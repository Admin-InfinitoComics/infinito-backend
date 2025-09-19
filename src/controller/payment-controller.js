import Payment from "../models/Payment.js";
import razorpayInstance from '../utils/razorpay.js'
import { paymentPlans } from '../constant/constants.js'
import User from '../models/User.js'
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";

export const createOrder = async (req, res) => {
    try {
        const user = req.user.toObject();
        // console.log("USER: ", user)
        const { membershipType } = req.body;

        // validating membershipType
        const validMemberships = ["Monthly", "HalfYear", "Annual", "UltimateKit"];
        if (!validMemberships.includes(membershipType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid membership type",
            });
        }

        const order = await razorpayInstance.orders.create({
            "amount": (paymentPlans[membershipType]) * 100,
            "currency": "INR",
            "receipt": "receipt#1",
            "partial_payment": false,
            "notes": {
                userId: user._id,
                name: user.name,
                email: user.email,
                membershipType
            }
        })

        //on success, save the order in db
        const payment = new Payment({
            orderId: order.id,
            amount: order.amount,
            status: order.status,
            receipt: order.receipt,
            notes: order.notes
        });

        const savedPayment = await payment.save();


        //returning order details to fronted
        res.status(200).json({
            success: true,
            message: "Successfully created order",
            data: {
                ...savedPayment.toObject(),
                keyId: process.env.RAZORPAY_KEY_ID
            }
        })

    }
    catch (err) {
        console.log("Error creating order in razorpay: ", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create order. Please try again!"
        })
    }
}

export const webhooksetup = async (req, res) => {
    try {
        const webhookSignature = req.get("X-Razorpay-Signature");

        const isWebHookValid = validateWebhookSignature(JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET)

        console.log("isWebHookValid: ", isWebHookValid);
        if (!isWebHookValid) {
            return res.status(400).json({ message: "Webhook signature is invalid" })
        }

        //changing payment status in db
        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        payment.status = paymentDetails.status;
        await payment.save();

        //adding membership to user
        const userId = payment.notes?.userId;
        const membershipType = payment.notes?.membershipType;

        if (!userId || !membershipType) {
            return res.status(400).json({ message: "Missing user ID or membership type" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // updating membership based on type
        if (["Monthly", "HalfYear", "Annual"].includes(membershipType)) {
            user.membershipType = membershipType;

            // membership expiry logic
            const now = new Date();
            if (membershipType === "Monthly") {
                user.infinitoUltimateTo = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            } else if (membershipType === "HalfYear") {
                user.infinitoUltimateTo = new Date(Date.now() + 182 * 24 * 60 * 60 * 1000);
            } else if (membershipType === "Annual") {
                user.infinitoUltimateTo = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            }
        } else if (membershipType === "UltimateKit") {
            user.hasInfinitoUltimateKit = true;
        }
        await user.save();
        return res.status(200).json({ message: "Webhook received successfully!" })
    }
    catch (err) {
        console.log("Error setting up webhook: ", err);
        return res.status(500).json({
            success: false,
            message: "webhook set up failed"
        })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        console.log("PAYMENT VERIFICATION STARTED...")
        const user = req.user;

        // checking for valid membership type
        const hasMembership = ["Monthly", "HalfYear", "Annual"].includes(user.membershipType);

        const isPremium = user.hasInfinitoUltimateKit || hasMembership;

        return res.status(200).json({
            success: true,
            isPremium,
            membershipType: user.membershipType || "",
            hasInfinitoUltimateKit: user.hasInfinitoUltimateKit || false,
        });
    } catch (err) {
        console.log("Error verifying payment: ", err);
        return res.status(500).json({
            success: false,
            message: "Failed to verify payment status"
        });
    }
};

