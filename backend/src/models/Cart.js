const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  items: [
    {
      sku: String,
      title: String,
      size: String,
      qty: { type: Number, default: 1 },
      price: Number
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cart", cartSchema);
