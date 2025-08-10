import { STATUS_CODE } from "../helpers/constants.js";
import Todo from "../models/Todo.js";
import User from "../models/User.js";

export const createTodo = async (req, res) => {
  console.log("createTodo", req);
  const { todo, apiKey } = req.body;

  const user = await User.findOne({ apiKey });
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const _todo = await Todo.create({ todo, created_by: user._id });

    res.status(STATUS_CODE.CREATED).json({
      message: "Todo created successfully",
      todo: _todo.toJSON(),
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: "Error creating todo",
      error: error.message,
    });
  }
};

export const getTodos = async (req, res) => {
  const { apiKey } = req.body;

  const user = await User.findOne({ apiKey });
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const todos = await Todo.find({ created_by: user._id });
    res.status(STATUS_CODE.OK).json({
      message: "Todos fetched successfully",
      todos: todos.map((todo) => todo.toJSON()),
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching todos",
      error: error.message,
    });
  }
};

export const getTodo = async (req, res) => {
  const { apiKey } = req.body;
  const { id: todoId } = req.params;

  const user = await User.findOne({ apiKey });
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const todo = await Todo.findById(id);
    res.status(STATUS_CODE.OK).json({
      message: "Todo fetched successfully",
      todo: todo.toJSON(),
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching todo",
      error: error.message,
    });
  }
};

export const updateTodo = async (req, res) => {
  const { todo, apiKey, id } = req.body;

  const user = await User.findOne({ apiKey });
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const _todo = await Todo.findByIdAndUpdate(id, { todo }, { new: true });
    res.status(STATUS_CODE.OK).json({
      message: "Todo updated successfully",
      todo: _todo.toJSON(),
    });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: "Error updating todo",
      error: error.message,
    });
  }
};

export const deleteTodo = async (req, res) => {
  const { id, apiKey } = req.body;

  const user = await User.findOne({ apiKey });
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await Todo.findByIdAndDelete(id);
    res.status(STATUS_CODE.OK).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting todo",
      error: error.message,
    });
  }
};

