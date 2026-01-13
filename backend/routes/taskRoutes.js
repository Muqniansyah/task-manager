const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// CREATE
router.post("/", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

// READ
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// UPDATE (title / completed / dll)
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

module.exports = router;
