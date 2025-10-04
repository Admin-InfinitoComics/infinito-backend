import UserRepository from "../repository/user-repository.js";
import jwt from "jsonwebtoken";
import config from "../config/server-config.js";
import bcrypt from "bcryptjs";
import { uploadToS3 } from "../utils/aws.js";
import { sendForgotPasswordEmail } from "../utils/sendEmail.js";

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  // 🔹 For Admin Panel (restricted with middleware)
  async getAll(adminId) {
    return await this.userRepository.getAllByAdmin(adminId); // filter users per admin
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

  // 🔹 For Normal Users (multi-page)
  async signup(data) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new Error("User already registered");

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData = { ...data, password: hashedPassword };

    return await this.userRepository.createuser(userData);
  }

  async login(data) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new Error("Invalid email");

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, config.JWT_SECRET_KEY, {
      expiresIn: config.JWT_EXPIRY_DATE,
    });

    return { token, user };
  }

  async logout(user) {
    // Stateless JWT logout → nothing to do server-side
    return true;
  }

  async changePassword(id, { oldPassword, newPassword }) {
    const user = await this.userRepository.getById(id);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Old password does not match");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.userRepository.findByIdandUpdate(id, { password: hashedPassword });
  }

  async getProfile(id) {
    return await this.userRepository.getProfile(id);
  }

  // 🔹 Upload profile image
  async upload(file) {
    if (!file) throw new Error("No file uploaded");

    const { buffer, originalname, mimetype } = file;
    const { Location, Key, Bucket } = await uploadToS3(buffer, originalname, mimetype);

    return { url: Location, key: Key, bucket: Bucket };
  }

  // 🔹 Email verification
  async verify(data) {
    return await this.userRepository.verify(data);
  }

  // 🔹 Forgot / Reset password
  async forgetPassword(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Email not found");

    const payload = { id: user._id, email: user.email };
    const resetToken = jwt.sign(payload, config.JWT_SECRET_KEY, {
      expiresIn: config.FORGET_PASSWORD_EXPIRY, // e.g. 5 minutes
    });

    const resetLink = `${config.FRONTEND_URL}/reset-password/${user._id}/${resetToken}`;
    await sendForgotPasswordEmail(user.email, resetLink, user.name);

    return { message: "Reset link sent to email" };
  }

  async resetPassword(userId, newPassword) {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new Error("User not found");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.findByIdandUpdate(userId, { password: hashedPassword });

    return { message: "Password reset successful" };
  }
}

export default UserService;
