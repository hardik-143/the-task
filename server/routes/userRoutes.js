import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  getUsersForProject,
} from "../controllers/userController.js";
import { verifyToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);

router.get("/users-for-project", verifyToken, getUsersForProject);
router.get("/", verifyToken, getAllUsers);
router.post("/", verifyToken, createUser);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
