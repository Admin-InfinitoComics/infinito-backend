import dotenv from "dotenv";
dotenv.config();
export default {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY,
    JWT_EXPIRY_DATE: process.env.JWT_EXPIRY_DATE,
    FRONTEND_URL: process.env.FRONTEND_URL,
    ADMIN_URL: process.env.ADMIN_URL,
    RESEARCH_URL: process.env.RESEARCH_URL,
    FOUNDATION_URL: process.env.FOUNDATION_URL,
    ACCESS_KEY: process.env.ACCESS_KEY,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
    EMAIL_ID: process.env.EMAIL_ID,
    EMAIL_PASS: process.env.EMAIL_PASS,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SERVER: process.env.SMTP_SERVER,
    FORGET_PASSWORD_EXPIRY: process.env.FORGET_PASSWORD_EXPIRY,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_SECRET_KEY: process.env.RAZORPAY_SECRET_KEY
}