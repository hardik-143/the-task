import express from "express";
import {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected with authentication
router.use(authenticate);

// Create a new task
router.post("/", createTask);

// Get a single task
router.get("/:id", getTaskById);

// Update a task
router.put("/:id", updateTask);

// Delete a task
router.delete("/:id", deleteTask);

export default router;
