import mongoose from "mongoose";

const taskAssignmentSchema = new mongoose.Schema(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for the unique combination
taskAssignmentSchema.index({ task_id: 1, user_id: 1 }, { unique: true });

const TaskAssignment = mongoose.model("TaskAssignment", taskAssignmentSchema);

export default TaskAssignment;
