const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [
    {
      from: String,
      text: String,
      intent: String,     
      ts: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, default: "open" },  // admin can close/handle it
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Conversation", conversationSchema);
