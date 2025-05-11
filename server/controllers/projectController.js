import "../models/User.js";
import Project from "../models/Project.js";
import UserProject from "../models/UserProject.js";
import { STATUS_CODE } from "../helpers/constants.js";
import Task from "../models/Task.js";

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { _id } = req.user;

    const project = new Project({
      name,
      description,
      createdBy: _id,
      users: [_id],
    });

    await project.save();

    res.status(STATUS_CODE.CREATED).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all projects for the authenticated user
const getAllProjects = async (req, res) => {
  try {
    const user = req.user;
    const { _id, type } = user;

    const projects = await Project.find({ users: { $in: [_id] } })
      // .populate([
      //   { path: "createdBy", select: "username email" },
      //   { path: "users", select: "username email" },
      // ])
      .sort({ createdAt: -1 });

    if (projects.length === 0) {
      res.status(STATUS_CODE.NOT_FOUND).json({
        success: false,
        error: "No projects found",
      });
    }
    res.status(STATUS_CODE.OK).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate([
      { path: "createdBy" },
      { path: "users" },
    ]);

    if (!project) {
      res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        error: "Project not found",
      });
    }

    res.status(STATUS_CODE.OK).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    // Check if user has access to this project
    const userProject = await UserProject.findOne({
      user_id: userId,
      project_id: id,
    });

    if (!userProject) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: "You do not have access to this project",
      });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        error: "Project not found",
      });
    }

    res.status(STATUS_CODE.OK).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user has access to this project
    const userProject = await UserProject.findOne({
      user_id: userId,
      project_id: id,
    });

    if (!userProject) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: "You do not have access to this project",
      });
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        error: "Project not found",
      });
    }

    // Delete all user-project relationships for this project
    await UserProject.deleteMany({ project_id: id });

    res.status(STATUS_CODE.OK).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { id } = req.params;
    // search params
    const { status, priority } = req.query;
    const tasks = await Task.find({
      project_id: id,
      status:
        status === "all"
          ? { $in: ["pending", "in_progress", "completed"] }
          : status,
      priority:
        priority === "all" ? { $in: ["low", "medium", "high"] } : priority,
    }).populate([{ path: "created_by" }, { path: "assigned_to" }]);

    if (!tasks) {
      res.status(STATUS_CODE.NOT_FOUND).json({
        success: false,
        error: "No tasks found",
      });
    }

    res.status(STATUS_CODE.OK).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectTasks,
};
