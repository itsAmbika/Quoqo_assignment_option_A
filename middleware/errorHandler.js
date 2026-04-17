// Central API error handler. Add new known error types here as the API grows.
const errorHandler = (error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Malformed JSON request body",
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      error: "Request body is too large",
    });
  }

  if (error.isOperational) {
    const response = { error: error.message };

    if (error.details) {
      response.details = error.details;
    }

    return res.status(error.statusCode).json(response);
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid task id" });
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
