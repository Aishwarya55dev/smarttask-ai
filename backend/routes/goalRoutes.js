const express = require("express");

const {
  createGoal,
  getGoals,
  updateProgress,
  deleteGoal,
} = require("../controllers/goalController");

const router = express.Router();

router.post("/", createGoal);

router.get("/", getGoals);

router.patch("/:id", updateProgress);

router.delete("/:id", deleteGoal);

module.exports = router;