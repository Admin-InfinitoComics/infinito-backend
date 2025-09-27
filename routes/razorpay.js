import express from "express";
import { verifyPayment } from "../controller/razorpay-controller.js";
const router = express.Router();

router.post("/verify", verifyPayment);

export default router;
