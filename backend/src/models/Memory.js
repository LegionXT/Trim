const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  userId: String,
  last_intents: Array,
  last_5_messages: Array,
  recent_entities: Object
});

module.exports = mongoose.model("Memory", memorySchema);
