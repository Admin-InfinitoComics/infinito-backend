import jwt from "jsonwebtoken";
import config from "../config/server-config.js";

export const verifyResetToken = (req, res, next) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    req.userFromToken = decoded; // attach to request for downstream use
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired reset link" });
  }
};
