const AppError = require("../utils/AppError");

// Handles any request that does not match a registered route.
const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

module.exports = notFound;
