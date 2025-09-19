import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    orderId: { //ordere id created by razorpay
        type: String,
        required: true
    },
    paymentId: {
        type: String
    },
    signature: {  //what is this signature?
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        // enum: ['CREATED', 'PAID', 'FAILED'],
        // default: 'CREATED'
    },
    notes: {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        membershipType: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
}, {timestamps: true});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;