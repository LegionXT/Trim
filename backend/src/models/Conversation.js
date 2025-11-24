const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  userId: String,
  messages: [
    {
      from: String,
      text: String,
      ts: { type: Date, default: Date.now }
    }
  ],
  mode: String,
  status: { type: String, default: "open" }
});

module.exports = mongoose.model("Conversation", conversationSchema);
