import User from "../models/User.js";
import { STATUS_CODE } from "../helpers/constants.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export const getUsersForProject = async (req, res) => {
  // search in username,email
  const { search } = req.query;
  try {
    const user = await User.find({
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("-password");
    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching user", error: error.message });
  }
};
// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// Create new user (admin only)
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

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
    });

    await user.save();

    res.status(STATUS_CODE.CREATED).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        apiKey: user.apiKey,
      },
    });
  } catch (error) {
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Email already in use" });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true }
    ).select("-password");

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating user", error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Email already in use" });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating profile", error: error.message });
  }
};
