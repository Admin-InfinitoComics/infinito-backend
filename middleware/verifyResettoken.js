import jwt from "jsonwebtoken";
import config from "../config/server-config.js";

export const verifyResetToken = (req, res, next) => {
  try {
    // token comes from URL params
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    // verify token validity
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

    // attach decoded data (e.g., userId, email) to request
    req.userFromToken = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired reset link" });
  }
};
