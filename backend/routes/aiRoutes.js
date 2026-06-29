const express = require("express");

const {
  getRiskAnalysis,
} = require("../controllers/aiController");

const router = express.Router();

// AI Productivity Analysis
router.get("/productivity-insights", getRiskAnalysis);

module.exports = router;