import CrudRepository from "./crud-repository.js";
import Support from "../models/SupportUs.js";

class SupportRepository extends CrudRepository {
    constructor() {
        super(Support);
    }

    async findByUserId(userId) {
        try {
            console.log(userId);
            const supports = await Support.find({ userId });
            return supports;
        } catch (error) {
            throw error;
        }
    }

    async findActiveGoldMembers() {
        try {
            const activeSupports = await Support.find({ 
                supportType: 'monthly', 
                isGoldMember: true 
            }).populate('userId', 'name email username');
            return activeSupports;
        } catch (error) {
            throw error;
        }
    }

    async getTotalSupportByUser(userId) {
        try {
            const result = await Support.aggregate([
                { $match: { userId: userId } },
                { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
            ]);
            return result[0]?.totalAmount || 0;
        } catch (error) {
            throw error;
        }
    }
}

export default SupportRepository;
