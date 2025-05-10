import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { STATUS_CODE } from "../helpers/constants.js";

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: "Authentication invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: "Authentication invalid",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(STATUS_CODE.UNAUTHORIZED).json({
      success: false,
      error: "Authentication invalid",
    });
  }
};

export { authenticate };
