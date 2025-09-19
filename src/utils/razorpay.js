import Razorpay from "razorpay";
import config from "../config/server-config.js";
var instance = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_SECRET_KEY
})

export default instance;
