import mongoose from "mongoose";
import crypto from "crypto";
import { generateJWT, verifyJWT } from "../helpers/utils.js";

const sessionTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUsedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Generate a random token
sessionTokenSchema.statics.generateToken = function (userId, userType) {
  const user = { id: userId, type: userType };
  return generateJWT(user);
};

// Create a new session token
sessionTokenSchema.statics.createSession = async function (userId, userType) {
  const token = this.generateToken(userId, userType);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Token expires in 7 days

  const session = new this({
    token,
    user: userId,
    userType,
    expiresAt,
  });

  await session.save();
  return session;
};

// Find active session by token
sessionTokenSchema.statics.findActiveSession = async function (token) {
  // console.log("findActiveSession", token);
  const decoded = verifyJWT(token);
  // console.log("decoded", decoded);
  return this.findOne({
    token,
    isActive: true,
    expiresAt: { $gt: new Date() },
  }).populate("user", "username email");
};

// Invalidate session
sessionTokenSchema.methods.invalidate = async function () {
  this.isActive = false;
  await this.save();
};

// Update last used timestamp
sessionTokenSchema.methods.updateLastUsed = async function () {
  this.lastUsedAt = new Date();
  await this.save();
};

// remove session
sessionTokenSchema.methods.removeSession = async function () {
  await this.deleteOne();
};

const SessionToken = mongoose.model("SessionToken", sessionTokenSchema);

export default SessionToken;
