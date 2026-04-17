const mongoose = require("mongoose");
const Task = require("../models/Task");
const sampleTasks = require("./sampleTasks");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/workflow_tracker";

// Reload the tasks collection with sample data for local website testing.
const seedTasks = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    await Task.deleteMany({});
    const tasks = await Task.insertMany(sampleTasks);

    console.log(`Seed complete: inserted ${tasks.length} tasks.`);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedTasks();
