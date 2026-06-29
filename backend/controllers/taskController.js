const Task = require("../models/Task");


const { analyzeTaskAI } = require("../services/geminiService");
// Create Task
const createTask = async (req, res) => {
  try {
    const { title, deadline } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    // AI Analysis
    // AI Analysis (Single API Call)
const aiResult = await analyzeTaskAI(title);

// Create MongoDB document
/*const task = await Task.create({
  title,
  priority: aiResult.priority,
  deadline: aiResult.deadline,
  estimatedHours: aiResult.estimatedHours,
  status: "Pending",
  breakdown: aiResult.breakdown,
  advice: aiResult.advice,
  reminder: aiResult.reminder,
});*/
const task = await Task.create({
  title,
  deadline, // <-- comes from the date picker
  priority: aiResult.priority,
  estimatedHours: aiResult.estimatedHours,
  status: "Pending",
  breakdown: aiResult.breakdown,
  advice: aiResult.advice,
  reminder: aiResult.reminder,
});

    res.status(201).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create task.",
    });
  }
};

// Get All Tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch tasks.",
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete task.",
    });
  }
};

// Toggle Status
const toggleStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    task.status =
      task.status === "Pending"
        ? "Completed"
        : "Pending";

    await task.save();

    res.json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update task.",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  deleteTask,
  toggleStatus,
};