const mongoose = require("mongoose");
const allowedStatuses = require("../constants/taskStatus");

// Each task can store multiple discussion comments.
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      minlength: [1, "Comment text cannot be empty"],
    },
    author: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
  },
  { timestamps: true }
);

// Main task/request document for the workflow tracker.
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [1, "Task title cannot be empty"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      // Restrict status values so clients cannot store inconsistent workflow states.
      enum: {
        values: allowedStatuses,
        message: "Status must be one of: pending, in_progress, completed, cancelled",
      },
      default: "pending",
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

taskSchema.index({ status: 1 });
taskSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Task", taskSchema);
