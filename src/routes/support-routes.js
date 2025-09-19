import express from 'express';
import { 
    createSupport, 
    getUserSupports, 
    getAllSupports, 
    getGoldMembers, 
    getSupportStatistics,
    // getUserTotalSupport, 
    // cancelMonthlySupport 
} from '../controller/support-controller.js';
import { authenticate } from '../middleware/auth.js'; // Assuming you have auth middleware

const router = express.Router();

// Create a new support (donation)
router.post('/create', authenticate, createSupport);
// router.post('/create', createSupport);

// Get current user's supports
router.get('/my-supports', authenticate, getUserSupports);

// Get current user's total support amount
// router.get('/my-total', authenticate, getUserTotalSupport);

// Cancel monthly support for current user
// router.post('/cancel-monthly', authenticate, cancelMonthlySupport);

// Admin routes (you might want to add admin middleware here)
router.get('/all', getAllSupports);
router.get('/gold-members', authenticate, getGoldMembers);

// Statistics for Support Us page
router.get('/statistics', getSupportStatistics);

export default router;
