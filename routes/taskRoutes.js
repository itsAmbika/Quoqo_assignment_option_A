const express = require("express");
const {
  createTask,
  getAllTasks,
  updateTaskStatus,
  addTaskComment,
} = require("../controllers/taskController");
const asyncHandler = require("../middleware/asyncHandler");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.param("id", validateObjectId);

// Task collection routes.
router.post("/", asyncHandler(createTask));
router.get("/", asyncHandler(getAllTasks));

// Task-specific update routes.
router.patch("/:id/status", asyncHandler(updateTaskStatus));
router.post("/:id/comments", asyncHandler(addTaskComment));

module.exports = router;
