const Goal = require("../models/Goal");

// Create Goal
/*const createGoal = async (req, res) => {
  try {
    const { title, target } = req.body;

    const goal = await Goal.create({
      title,
      target: target || 100,
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create goal.",
    });
  }
};*/
const createGoal = async (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  try {
    const { title, target } = req.body;

    const goal = await Goal.create({
      title,
      target: target || 100,
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error("Goal Error:", error);

    res.status(500).json({
      message: "Failed to create goal.",
      error: error.message,
    });
  }
};

// Get All Goals
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find().sort({
      createdAt: -1,
    });

    res.json(goals);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch goals.",
    });
  }
};

// Update Goal Progress
const updateProgress = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found.",
      });
    }

    goal.progress = req.body.progress;

    if (goal.progress >= goal.target) {
      goal.progress = goal.target;
      goal.completed = true;
    }

    await goal.save();

    res.json(goal);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update goal.",
    });
  }
};

// Delete Goal
const deleteGoal = async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);

    res.json({
      message: "Goal deleted.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete goal.",
    });
  }
};

module.exports = {
  createGoal,
  getGoals,
  updateProgress,
  deleteGoal,
};