import mongoose from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: true, 
    unique: true
  },
  password : {
    type: String,
    required: true
  },        
  name: { 
    type: String, 
    required: true 
   },                              
  dob: { 
    type: Date,
    required: true
  },                                                
  username: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30,
    match: [/^[0-9a-zA-Z._]{6,30}$/, 'Username must be 6-30 characters long and contain only letters, underscores (_), and periods (.)']
  },
  newsLetter: {
    type: Boolean,
    default: true
  },
  isverified: {
    type: Boolean,
    default: false
  },
  verificationcode: String,
  verificationCodeExpiresAt: {
    type: Date
  },
  // Subscription and membership fields
  hasInfinitoUltimate: {
    type: Boolean,
    default: false
  },
  infinitoUltimateTo: {
    type: Date,
    default: null
  },
  hasInfinitoUltimateKit: {
    type: Boolean,
    default: false
  },
  membershipType: {
    type: String,
    enum: ["", "Monthly", "HalfYear", "Annual"],
    default: ""
  }
}, {timestamps: true});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const saltRounds = 10;
        const hashed = await bcrypt.hash(this.password, saltRounds);
        this.password = hashed;
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
const Account = mongoose.model('Account', UserSchema);
export default Account;