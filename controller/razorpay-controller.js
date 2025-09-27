import Razorpay from "razorpay";
import crypto from "crypto";
import PaperAccess from "../models/PaperAccess.js"; // import the model

// POST /api/razorpay/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paperId, userId } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // Mark paper as unlocked for user in DB
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
      await PaperAccess.findOneAndUpdate(
        { userId, paperId },
        { userId, paperId, expiresAt },
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, message: "Payment verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Payment verification failed", error: err.message });
  }
};