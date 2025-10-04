import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import config from '../config/server-config.js';

export const adminauthenticate = async (req, res, next) => {
  try {
    // Get token from cookies (instead of headers)
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

    // Find user
    const user = await Admin.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
