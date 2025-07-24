const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const router = express.Router();

// Create User
router.post("/", async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email || age == null) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = new User({ name, email, age });
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) {
    return next(err);
  }
});

// Get All Users
router.get("/", async (req, res, next) => {
  try {
    const list = await User.find();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// Utility: Validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get Single User
router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id))
      return res.status(400).json({ message: "Invalid ID format" });
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json(u);
  } catch (err) {
    next(err);
  }
});

// Update User
router.put("/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id))
      return res.status(400).json({ message: "Invalid ID format" });
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete User
router.delete("/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id))
      return res.status(400).json({ message: "Invalid ID format" });
    const del = await User.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
