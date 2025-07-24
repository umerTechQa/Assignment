const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  age: { type: Number, required: true, min: 0 },
});

module.exports = mongoose.model("User", userSchema);