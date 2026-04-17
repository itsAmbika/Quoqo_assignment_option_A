const Task = require("../models/Task");
const allowedStatuses = require("../constants/taskStatus");
const AppError = require("../utils/AppError");

const isBlank = (value) => typeof value !== "string" || value.trim().length === 0;
const normalizeAuthor = (author) => {
  if (author === undefined || isBlank(author)) {
    return "Anonymous";
  }

  return author.trim();
};

// Create a new workflow task/request.
const createTask = async (req, res) => {
  const { title, description, status } = req.body;

  if (isBlank(title)) {
    throw new AppError("Task title is required", 400);
  }

  if (description !== undefined && typeof description !== "string") {
    throw new AppError("Task description must be a string", 400);
  }

  if (status !== undefined && !allowedStatuses.includes(status)) {
    throw new AppError("Invalid status", 400, { allowedStatuses });
  }

  const task = await Task.create({
    title: title.trim(),
    description,
    status,
  });

  res.status(201).json({
    message: "Task created successfully",
    task,
  });
};

// Return every task, newest first, for the main tracker list.
const getAllTasks = async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });

  res.json({
    count: tasks.length,
    tasks,
  });
};

// Update only the status field of a specific task.
const updateTaskStatus = async (req, res) => {
  const { status } = req.body;

  // Validate status before querying MongoDB so the client gets a clear error.
  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid status", 400, { allowedStatuses });
  }

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  res.json({
    message: "Task status updated successfully",
    task,
  });
};

// Add one comment to a specific task.
const addTaskComment = async (req, res) => {
  const { text, author } = req.body;

  // Reject empty or whitespace-only comments.
  if (isBlank(text)) {
    throw new AppError("Comment text is required", 400);
  }

  if (author !== undefined && typeof author !== "string") {
    throw new AppError("Comment author must be a string", 400);
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  task.comments.push({ text: text.trim(), author: normalizeAuthor(author) });
  await task.save();

  res.status(201).json({
    message: "Comment added successfully",
    task,
  });
};

module.exports = {
  createTask,
  getAllTasks,
  updateTaskStatus,
  addTaskComment,
};
