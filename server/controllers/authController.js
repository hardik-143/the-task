import User from "../models/User.js";
import SessionToken from "../models/SessionToken.js";
import { STATUS_CODE } from "../helpers/constants.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, type } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      type: type || "user",
    });

    await user.save();

    // Create session token
    // const session = await SessionToken.createSession(user._id, user.type);

    res.status(STATUS_CODE.CREATED).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      // token: session.token,
    });
  } catch (error) {
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: "Error registering user", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Login attempt with:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log("Found user:", user ? "Yes" : "No");

    if (!user) {
      return res.status().json({ message: "Invalid credentials" });
    }

    // Check password
    console.log("Attempting password comparison...");
    const isMatch = await user.comparePassword(password);
    console.log("Password comparison result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create new session token
    const session = await SessionToken.createSession(user._id, user.type);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        type: user.type,
      },
      token: session.token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const session = await SessionToken.findOne({ token });
      if (session) {
        await session.removeSession();
      }
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // console.log("Auth check headers:", req.headers);
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token received:", token ? "Present" : "Missing");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const session = await SessionToken.findActiveSession(token);
    // console.log("Session found:", session ? "Yes" : "No");

    if (!session) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    res.json({
      message: "Token is valid",
      user: {
        id: session.user._id,
        username: session.user.username,
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const session = await SessionToken.findActiveSession(token);
    if (!session) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Update last used timestamp
    await session.updateLastUsed();

    req.user = session.user;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
};
