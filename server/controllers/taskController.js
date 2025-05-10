import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { STATUS_CODE } from "../helpers/constants.js";

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, projectId, assignedTo } =
      req.body;
    const { _id } = req.user;

    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(STATUS_CODE.NOT_FOUND).json({
        success: false,
        error: "Project not found",
      });
    }

    if (!project.users.includes(_id)) {
      return res.status(STATUS_CODE.FORBIDDEN).json({
        success: false,
        error: "You don't have access to this project",
      });
    }

    const task = new Task({
      title,
      description,
      priority,
      status,
      project_id: projectId,
      created_by: _id,
      assigned_to: assignedTo || _id,
    });

    await task.save();

    // Add task to project's tasks array
    project.tasks.push(task._id);
    await project.save();

    res.status(STATUS_CODE.CREATED).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a single task
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;

    const task = await Task.findById(id).populate([
      { path: "createdBy", select: "username email" },
      { path: "assignedTo", select: "username email" },
      { path: "project" },
    ]);

    if (!task) {
      return res.status(STATUS_CODE.NOT_FOUND).json({
        success: false,
        error: "Task not found",
      });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    if (!project.users.includes(_id)) {
      return res.status(STATUS_CODE.FORBIDDEN).json({
        success: false,
        error: "You don't have access to this task",
      });
    }

    res.status(STATUS_CODE.OK).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, assignedTo } = req.body;
    const { _id } = req.user;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(STATUS_CODE.NOT_FOUND).json({
        success: false,
        error: "Task not found",
      });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    if (!project.users.includes(_id)) {
      return res.status(STATUS_CODE.FORBIDDEN).json({
        success: false,
        error: "You don't have access to this task",
      });
    }

    // Update task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.assignedTo = assignedTo || task.assignedTo;

    await task.save();

    await task.populate([
      { path: "createdBy", select: "username email" },
      { path: "assignedTo", select: "username email" },
    ]);

    res.status(STATUS_CODE.OK).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(STATUS_CODE.NOT_FOUND).json({
        success: false,
        error: "Task not found",
      });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    if (!project.users.includes(_id)) {
      return res.status(STATUS_CODE.FORBIDDEN).json({
        success: false,
        error: "You don't have access to this task",
      });
    }

    // Remove task from project's tasks array
    project.tasks = project.tasks.filter(
      (taskId) => taskId.toString() !== id.toString()
    );
    await project.save();

    // Delete the task
    await Task.findByIdAndDelete(id);

    res.status(STATUS_CODE.OK).json({
      success: true,
      data: { message: "Task deleted successfully" },
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

export { createTask, getTaskById, updateTask, deleteTask };
