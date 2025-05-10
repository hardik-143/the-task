import Project from "../models/Project.js";
import UserProject from "../models/UserProject.js";
import { STATUS_CODE } from "../helpers/constants.js";

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and user info is in req.user

    // Create the project
    const project = new Project({
      name,
      description,
    });

    await project.save();

    // Create user-project relationship
    const userProject = new UserProject({
      user_id: userId,
      project_id: project._id,
    });

    await userProject.save();

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
    const userId = req.user.id;

    // Find all projects associated with the user
    const userProjects = await UserProject.find({ user_id: userId }).populate(
      "project_id"
    );

    const projects = userProjects.map((up) => up.project_id);

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

    const project = await Project.findById(id);

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

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
