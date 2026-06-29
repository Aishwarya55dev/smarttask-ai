/*const Task = require("../models/Task");
const { analyzeTaskAI } = require("../services/geminiService");

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required." });
    }

    const aiResult = await analyzeTaskAI(title);

    const task = await Task.create({
      userId: req.userId, // ← tied to logged-in user
      title,
      deadline,
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
    res.status(500).json({ message: "Failed to create task." });
  }
};

// Get Tasks — only for logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId, // ← only delete own tasks
    });
    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete task." });
  }
};

// Toggle Status
const toggleStatus = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId, // ← only toggle own tasks
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.status = task.status === "Pending" ? "Completed" : "Pending";
    await task.save();

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update task." });
  }
};

module.exports = { createTask, getTasks, deleteTask, toggleStatus };
*/
const Task = require("../models/Task");
const { analyzeTaskAI } = require("../services/geminiService");

const createTask = async (req, res) => {
  try {
    const { title, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required." });
    }

    // AI Analysis with fallback
    let aiResult = {
      priority: "Medium",
      estimatedHours: 1,
      breakdown: ["Plan task", "Start work", "Continue progress", "Review work", "Complete task"],
      advice: ["Start early", "Avoid distractions", "Review progress regularly"],
      reminder: "Start working on this task today to stay ahead of the deadline.",
    };

    try {
      aiResult = await analyzeTaskAI(title);
    } catch (aiError) {
      console.error("AI analysis failed, using defaults:", aiError.message);
    }

    const task = await Task.create({
      userId: req.userId,
      title,
      deadline,
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
    res.status(500).json({ message: "Failed to create task." });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete task." });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.status = task.status === "Pending" ? "Completed" : "Pending";
    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update task." });
  }
};

module.exports = { createTask, getTasks, deleteTask, toggleStatus };