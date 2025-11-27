const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  title: String,
  description: String,
  price: Number,
  sizes: [String],      // ["S","M","L"]
  image: String,
  tags: [String],
  stock: { type: Number, default: 10 }
});

module.exports = mongoose.model("Product", productSchema);
