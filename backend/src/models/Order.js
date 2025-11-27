const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  status: { type: String, default: "processing" },
  tracking: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Order", orderSchema);
