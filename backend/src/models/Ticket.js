const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  convId: String,
  issue: String,
  escalationLevel: { type: Number, default: 0 },
  status: { type: String, default: "open" }
});

module.exports = mongoose.model("Ticket", ticketSchema);
