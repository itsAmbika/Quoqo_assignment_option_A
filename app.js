const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();
const PORT = process.env.PORT || 3000;
const frontendDistPath = path.join(__dirname, "frontend", "dist");

// Parse incoming JSON request bodies and reject oversized payloads.
app.use(express.json({ limit: "10kb" }));

// Allow browser-based React apps to call this API during local development.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Health/documentation route that lists the available API endpoints.
app.get("/api", (req, res) => {
  res.json({
    message: "Task management API",
    endpoints: {
      createTask: "POST /tasks",
      getAllTasks: "GET /tasks",
      updateStatus: "PATCH /tasks/:id/status",
      addComment: "POST /tasks/:id/comments",
    },
  });
});

app.use("/tasks", taskRoutes);

// Serve the built React UI from Express when frontend/dist exists.
app.use(express.static(frontendDistPath));

const sendFrontend = (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"), (error) => {
    if (error) {
      res.status(200).json({
        message: "Frontend is not built yet. Run npm run build or npm run client.",
        apiDocs: "GET /api",
      });
    }
  });
};

app.get("/", sendFrontend);
app.get("/new", sendFrontend);

// Keep error middleware after all routes so unmatched requests and thrown errors are handled centrally.
app.use(notFound);
app.use(errorHandler);

// Start the server only after MongoDB connects successfully.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
