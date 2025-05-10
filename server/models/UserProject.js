import mongoose from "mongoose";

const userProjectSchema = new mongoose.Schema(
  {
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
userProjectSchema.index({ user_id: 1, project_id: 1 }, { unique: true });

const UserProject = mongoose.model("UserProject", userProjectSchema);

export default UserProject;
