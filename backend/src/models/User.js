const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  preferences: Object
});

module.exports = mongoose.model("User", userSchema);
