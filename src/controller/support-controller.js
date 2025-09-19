import SupportService from "../services/support-service.js";

const supportService = new SupportService();

export const createSupport = async (req, res) => {
    try {
        const { supportType, displayName, amount } = req.body;
        const userId = req.user.id; // Assuming user ID comes from auth middleware

        // Validate required fields
        if (!supportType || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Support type and amount are required'
            });
        }

        // Validate support type
        if (!['one-time', 'monthly'].includes(supportType)) {
            return res.status(400).json({
                success: false,
                message: 'Support type must be either one-time or monthly'
            });
        }

        // Validate amount
        if (amount < 1) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be at least 1'
            });
        }

        const supportData = {
            userId,
            supportType,
            displayName,
            amount
        };

        const support = await supportService.createSupport(supportData);

        // Determine what benefits user received
        let benefits = [];
        if (supportType === 'one-time' && amount >= 1500) {
            benefits.push('Infinito Ultimate subscription for 2 months');
        } else if (supportType === 'monthly' && amount >= 1500) {
            benefits.push('Gold membership');
        }

        res.status(201).json({
            success: true,
            message: 'Support created successfully',
            data: support,
            benefits: benefits
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getUserSupports = async (req, res) => {
    try {
        const userId = req.user.id;
        // console.log('User Id :-', userId);
        const supports = await supportService.getSupportsByUser(userId);
        
        res.status(200).json({
            success: true,
            data: supports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getAllSupports = async (req, res) => {
    try {
        const supports = await supportService.getAllSupports();
        
        res.status(200).json({
            success: true,
            data: supports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getGoldMembers = async (req, res) => {
    try {
        const goldMembers = await supportService.getGoldMembers();
        
        res.status(200).json({
            success: true,
            data: goldMembers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const getSupportStatistics = async (req, res) => {
    try {
        const stats = await supportService.getSupportStatistics();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// export const getUserTotalSupport = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const totalAmount = await supportService.getTotalSupportByUser(userId);
        
//         res.status(200).json({
//             success: true,
//             data: { totalAmount }
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message || 'Internal server error'
//         });
//     }
// };

// export const cancelMonthlySupport = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { supportId } = req.params;

//         const result = await supportService.cancelMonthlySupport(userId, supportId);
        
//         res.status(200).json({
//             success: true,
//             message: result.message
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message || 'Internal server error'
//         });
//     }
// };

// export const cancelMonthlySupport = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const result = await supportService.cancelMonthlySupport(userId);
//         res.status(200).json({ success: true, ...result });
//     } catch (error) {
//         res.status(400).json({ success: false, message: error.message });
//     }
// };
