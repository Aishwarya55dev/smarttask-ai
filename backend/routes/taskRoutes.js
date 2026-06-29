const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  deleteTask,
  toggleStatus,
} = require("../controllers/taskController");

router.use(protect); // ← protect all task routes

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleStatus);

module.exports = router;