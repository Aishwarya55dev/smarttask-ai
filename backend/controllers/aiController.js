const Task = require("../models/Task");
const { generateRiskAnalysis } = require("../services/geminiService");

const getRiskAnalysis = async (req, res) => {
  try {
    const tasks = await Task.find({
      status: "Pending",
    });

    if (tasks.length === 0) {
      return res.json({
        risk: "Low",
        summary: "No pending tasks.",
        recommendations: [],
      });
    }

    const result = await generateRiskAnalysis(tasks);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to analyze productivity.",
    });
  }
};

module.exports = {
  getRiskAnalysis,
};