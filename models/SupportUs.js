import mongoose from 'mongoose';

const SupportSchema = new mongoose.Schema({
    userId: { // Reference to the user who is supporting
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    supportType: { // "one-time" or "monthly"
        type: String,
        enum: ['one-time', 'monthly'],
        required: true
    },
    displayName: { // How user wants to be visible
        type: String,
        trim: true,
        maxlength: 30,
        default:''
    },
    amount: { // Support amount
        type: Number,
        required: true,
        min: 1 // minimum support amount can be set as needed
    },
    isGoldMember: {
        type: Boolean,
        default: false
    },
    supportAt: {
        type: Date,
        default: Date.now
    },
    cancelledAt : {
        type : Date
    }
}, { timestamps: true });

// Pre-save middleware to automatically set isGoldMember
SupportSchema.pre('save', function(next) {
    if (this.supportType === 'monthly' && this.amount >= 1500) {
        this.isGoldMember = true;
    } else {
        this.isGoldMember = false;
    }
    next();
});

const Support = mongoose.model('Support', SupportSchema);
export default Support;
