import mongoose from "mongoose";
import bcrypt from "bcrypt";
const AdminSchema = new mongoose.Schema({
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
   role: {
    type: String,
    required: true,
   }                                     
}, {timestamps: true});

AdminSchema.pre('save', async function(next) {
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

AdminSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;