import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectTasks,
  getProjectUsers,
} from "../controllers/projectController.js";

const router = express.Router();

// All routes are protected with authentication
router.use(authenticate);

// Create a new project
router.post("/", createProject);

// Get all projects for the authenticated user
router.get("/", getAllProjects);

// Get a single project by ID
router.get("/:id", getProjectById);

// Update a project
router.put("/:id", updateProject);

// Delete a project
router.delete("/:id", deleteProject);

// Get all tasks for a project
router.get("/:id/tasks", getProjectTasks);

// Get all users for a project
router.get("/:id/users", getProjectUsers);

export default router;
