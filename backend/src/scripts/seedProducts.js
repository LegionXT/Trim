// run once: node src/scripts/seedProducts.js
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../models/Product");
const data = require("../data/mockProducts");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB...");

    await Product.deleteMany({});
    console.log("Old products removed");

    await Product.insertMany(data);
    console.log("Products seeded successfully!");

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
