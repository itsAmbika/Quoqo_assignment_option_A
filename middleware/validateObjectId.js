const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

// Validate MongoDB ObjectId route params before controllers query the database.
const validateObjectId = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid task id", 400));
  }

  next();
};

module.exports = validateObjectId;
