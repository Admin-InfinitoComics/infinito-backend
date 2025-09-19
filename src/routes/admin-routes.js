import express from 'express';
import AdminController from '../controller/admin-controller.js';
import { checkRole } from '../middleware/roleCheck.js';
import { adminauthenticate } from '../middleware/adminauth.js'; 
const router = express.Router();

// Route to create a new admin
router.post('/create', AdminController.createAdmin);

// Route to login an admin
router.post('/login', AdminController.loginAdmin);

// Route to get all admins
router.get('/all', AdminController.getAllAdmins);

// Route to get a specific admin by ID
router.get('/:id', AdminController.getAdminById);

// Route to update an admin by ID
router.put('/:id', AdminController.updateAdmin);

// Route to delete an admin by ID
router.delete('/:id', AdminController.deleteAdmin);
export default router;