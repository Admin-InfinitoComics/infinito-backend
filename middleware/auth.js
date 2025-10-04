import jwt from 'jsonwebtoken';
import Account from '../models/User.js';
import config from '../config/server-config.js';

export const authenticate = async (req, res, next) => {
  try {
    // ✅ get token from cookies instead of headers
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ verify token
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

    // ✅ check user existence
    const user = await Account.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    console.log("Authenticated user:", req.user._id);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
