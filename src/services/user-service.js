import UserRepository from "../repository/user-repository.js";
import jwt from "jsonwebtoken";
import config from "../config/server-config.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { uploadToS3 } from "../utils/aws.js";
import { sendForgotPasswordEmail } from "../utils/sendEmail.js";
class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAll() {
    return await this.userRepository.getAll();
  }

  async signup(data) {
    const user = await this.userRepository.findByEmail(data.email);
    if (user) throw new Error("User is already registered");
    // ⚠️ Password is stored as-is (plain text)
    return await this.userRepository.createuser(data);
  }

  async login(data) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new Error("Invalid email");
    const user1 = bcrypt.compare(data.password, user.password);
    if (!user1) throw new Error("Invalid password");

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, config.JWT_SECRET_KEY, {
      expiresIn: config.JWT_EXPIRY_DATE,
    });

    return { token, user };
  }

  async logout(user) {
    return true;
  }

  async getById(id) {
    return await this.userRepository.getById(id);
  }

  async updateUser(id, data) {
    return await this.userRepository.findByIdandUpdate(id, data);
  }

  async deleteUser(id) {
    return await this.userRepository.findByIdandDelete(id);
  }

  async changePassword(id, data) {
    const user = await this.userRepository.getById(id);
    if (data.oldPassword !== user.password) throw new Error("Old password does not match");
    return await this.userRepository.findByIdandUpdate(id, { password: data.newPassword });
  }

  async getProfile(id) {
    return await this.userRepository.getProfile(id);
  }

  async upload(file) {
    try {
      if (!file) throw new Error("No file uploaded");

      const { buffer, originalname, mimetype } = file;
      const { Location, Key, Bucket } = await uploadToS3(buffer, originalname, mimetype);

      return { 
        url: Location, 
        key: Key, 
        bucket: Bucket 
      };

    } catch (error) {
      throw new Error("File upload failed: " + error.message);
    }
  }

  async verify(data) {
      try {
          const response = await this.userRepository.verify(data);
          return response;
      } catch (error) {
          console.log('Something wrong at service level');
          throw error;
      }
    }

    async forgetPassword(email) {
      try {
        const user = await this.userRepository.findByEmail(email);
        if(!user){
          throw new Error("Could not find email");
        }
        const payload = {
          id: user._id,
          email: user.email,
        };
        const resetToken = jwt.sign(payload, config.JWT_SECRET_KEY, {
          expiresIn: config.FORGET_PASSWORD_EXPIRY // expires in 5 minutes
        });
        const resetLink = `${config.FRONTEND_URL}/reset-password/${user._id}/${resetToken}`   
        sendForgotPasswordEmail(user.email, resetLink, user.name);     
        return user;    
      } catch (error) {
        console.log("Something wrong at service layer");
        throw  error;
      }
    }

    async resetPassword(userId, newPassword) {
      try {
        const user = await this.userRepository.getById(userId);
        if (!user) throw new Error("User not found");
        const hashedPassword = await bcrypt.hash(newPassword, 5);
        await this.userRepository.findByIdandUpdate(userId, {password: hashedPassword});
        return user;
      } catch (error) {
        console.log("Something wrong at service level", error);
        throw error;
      }
  }
}

export default UserService;
