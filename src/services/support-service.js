import SupportRepository from "../repository/support-repository.js";
import UserRepository from "../repository/user-repository.js";

class SupportService {
    constructor() {
        this.supportRepository = new SupportRepository();
        this.userRepository = new UserRepository();
    }

    async updateUserBenefits(userId, supportType, amount) {
        try {
            const user = await this.userRepository.getById(userId);
            const updateData = {};

            if (supportType === 'one-time' && amount >= 1500) {
                // Grant Infinito Ultimate subscription for 2 months
                const expirationDate = new Date();
                expirationDate.setMonth(expirationDate.getMonth() + 2);
                
                updateData.hasInfinitoUltimate = true;
                updateData.infinitoUltimateTo = expirationDate;
            } else if (supportType === 'monthly' && amount >= 1500) {
                // Grant Gold membership
                // updateData.isGoldMember = true;
                // updateData.goldMembershipStartedAt = new Date();

                // update the infinitoUltimateTo according to the sir.
            }

            if (Object.keys(updateData).length > 0) {
                await this.userRepository.findByIdandUpdate(userId, updateData);
            }
        } catch (error) {
            throw error;
        }
    }

    async createSupport(data) {
        try {
            const { userId, supportType, displayName, amount } = data;
            
            // Check if user exists
            const user = await this.userRepository.getById(userId);
            console.log("User:- ", user);
            if (!user) {
                throw new Error('User not found');
            }

            // Determine if this support makes user a gold member
            const isGoldMember = (supportType === 'monthly' && amount >= 1500);

            // Create support entry
            const supportData = {
                userId,
                supportType,
                displayName: displayName || user.name,
                amount,
                isGoldMember
            };

            const support = await this.supportRepository.create(supportData);

            // Update user benefits based on support
            await this.updateUserBenefits(userId, supportType, amount);

            return support;
        } catch (error) {
            throw error;
        }
    }

    async getSupportsByUser(userId) {
        try {
            
            const supports = await this.supportRepository.findByUserId(userId);
            return supports;
        } catch (error) {
            throw error;
        }
    }

    async getAllSupports() {
        try {
            const supports = await this.supportRepository.getAll();
            return supports;
        } catch (error) {
            throw error;
        }
    }

    async getGoldMembers() {
        try {
            const goldMembers = await this.supportRepository.findActiveGoldMembers();
            return goldMembers;
        } catch (error) {
            throw error;
        }
    }

    // async getTotalSupportByUser(userId) {
    //     try {
    //         const totalAmount = await this.supportRepository.getTotalSupportByUser(userId);
    //         return totalAmount;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async cancelMonthlySupport(userId, supportId) {
    //     try {
    //         // Find the support
    //         const support = await this.supportRepository.get(supportId);
    //         if (!support || support.userId.toString() !== userId) {
    //             throw new Error('Support not found or unauthorized');
    //         }

    //         if (support.supportType !== 'monthly') {
    //             throw new Error('Only monthly supports can be cancelled');
    //         }

    //         // Remove the support
    //         await this.supportRepository.destroy(supportId);

    //         // Update user benefits if they were a gold member
    //         if (support.isGoldMember) {
    //             await this.userRepository.update(userId, {
    //                 isGoldMember: false,
    //                 goldMembershipStartedAt: null
    //             });
    //         }

    //         return { message: 'Monthly support cancelled successfully' };
    //     } catch (error) {
    //         throw error;
    //     }
    // }


    async getSupportStatistics() {
        const Support = this.supportRepository.model;
        // One-time funds
        const [oneTimeFundsResult] = await Support.aggregate([
            { $match: { supportType: "one-time" } },
            { $group: { _id: null, totalFunds: { $sum: "$amount" } } }
        ]);
        const oneTimeFunds = oneTimeFundsResult?.totalFunds || 0;

        // Monthly funds calculation
        const monthlySupports = await Support.find({ supportType: "monthly" });
        let monthlyFunds = 0;
        const now = new Date();
        monthlySupports.forEach(support => {
            const start = support.createdAt;
            const end = support.cancelledAt || now;
            // Calculate the number of months between start and end
            let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            // If the end day is after or equal to the start day, count the current month
            if (end.getDate() >= start.getDate()) months++;
            if (months < 1) months = 1; // At least 1 month
            monthlyFunds += support.amount * months;
        });

        // Other stats
        const supporterCount = await Support.distinct("userId").then(arr => arr.length);
        const goldMembers = await Support.countDocuments({ isGoldMember: true, supportType: "monthly" });
        const oneTimeCount = await Support.countDocuments({ supportType: "one-time" });
        const monthlyCount = await Support.countDocuments({ supportType: "monthly" });

        return {
            oneTimeFunds,
            monthlyFunds,
            totalFunds: oneTimeFunds + monthlyFunds,
            supporterCount,
            goldMembers,
            oneTimeCount,
            monthlyCount
        };
    }
}

export default SupportService;
