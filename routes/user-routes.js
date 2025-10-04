import express from "express";
const router = express.Router();
import Usercontroller from "../controller/user-controller.js";
import { submitErrorReport , getAllErrorReports} from "../controller/error-report-controller.js";
import { submitFeedback, getAllFeedbacks } from "../controller/feedback-controller.js";
import {authenticate} from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { verifyResetToken } from "../middleware/verifyResettoken.js";
// Create (Register)
router.post('/signup', Usercontroller.signup)
// Read (All users)
router.get('/getall', Usercontroller.getAll);

// Read (Single user by ID)
router.get('/getById', Usercontroller.getById);

// Update (user by ID)
router.put('/update', Usercontroller.updateUser);

// Delete (user by ID)
router.delete('/delete', Usercontroller.deleteUser);

// Login (auth)
router.post('/login', Usercontroller.login);

// Check if user is authenticated
router.get('/check-auth', authenticate, Usercontroller.checkAuth);

// Optional: Logout
router.post('/logout', Usercontroller.logout);

// Optional: Change password
router.post('/change-password', Usercontroller.changePassword);



// Error report route
router.post("/report", authenticate, submitErrorReport);
router.get("/report", authenticate, getAllErrorReports); 

router.post("/feedback", authenticate, submitFeedback);
router.get("/feedback", authenticate, getAllFeedbacks); 

router.post("/upload", upload.single('image'), Usercontroller.uploadimage);

// verify (email) by sending otp
router.post('/verifyemail', Usercontroller.verifyemail);

router.post("/forget-password", Usercontroller.forgetPasswordFunc); 
router.post("/forget-password/:id/:token", verifyResetToken, Usercontroller.forgetPasswordEmail); 

export default router;