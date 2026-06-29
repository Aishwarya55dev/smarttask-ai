const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");

// Get all habits
router.get("/", async (req, res) => {
  const habits = await Habit.find().sort({ createdAt: -1 });
  res.json(habits);
});

// Create habit
router.post("/", async (req, res) => {
  const habit = await Habit.create({ title: req.body.title });
  res.status(201).json(habit);
});

// Mark done today — increases streak
router.patch("/:id/done", async (req, res) => {
  const habit = await Habit.findById(req.params.id);
  if (!habit.completedToday) {
    habit.streak += 1;
    habit.completedToday = true;
    await habit.save();
  }
  res.json(habit);
});

// Delete habit
router.delete("/:id", async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;