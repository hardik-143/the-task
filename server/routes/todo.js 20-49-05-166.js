import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../controllers/todoController.js";

const router = express.Router();

router.post("/create", createTodo);
router.get("/", getTodos);
router.put("/update", updateTodo);
router.delete("/delete", deleteTodo);
router.get("/:id", getTodo);

export default router;
