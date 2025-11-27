const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  last_intents: { type: [String], default: [] },
  last_5_messages: { 
    type: [{ from: String, text: String, ts: Date }], 
    default: [] 
  },
  recent_entities: { type: mongoose.Schema.Types.Mixed, default: {} },
  state: { type: String, default: null },        
  awaiting: { type: mongoose.Schema.Types.Mixed, default: null },
  updatedAt: { type: Date, default: Date.now }
});

// method
memorySchema.methods.pushMessage = function(from, text) {
  this.last_5_messages.push({ from, text, ts: new Date() });
  if (this.last_5_messages.length > 5) this.last_5_messages.shift();
  this.updatedAt = new Date();
};

module.exports = mongoose.model("Memory", memorySchema);
