const Memory = require("../models/Memory");

/**
 * Get or create memory for a user
 */
async function getMemory(userId) {
  let mem = await Memory.findOne({ userId });
  if (!mem) {
    mem = new Memory({ userId });
    await mem.save();
  }
  return mem;
}

/**
 * Record a user message + intent + optional entities
 */
async function recordUserMessage(userId, text, intent = null, entities = {}) {
  const mem = await getMemory(userId);
  mem.pushMessage("user", text);
  if (intent) {
    mem.last_intents.push(intent);
    if (mem.last_intents.length > 10) mem.last_intents.shift(); // keep small
  }
  mem.recent_entities = { ...mem.recent_entities, ...entities };
  mem.updatedAt = new Date();
  await mem.save();
  return mem;
}

/**
 * Record bot reply
 */
async function recordBotMessage(userId, text) {
  const mem = await getMemory(userId);
  mem.pushMessage("bot", text);
  mem.updatedAt = new Date();
  await mem.save();
  return mem;
}

/**
 * Set conversation state (step machine)
 */
async function setState(userId, state, awaiting = null) {
  const mem = await getMemory(userId);
  mem.state = state;
  mem.awaiting = awaiting;
  mem.updatedAt = new Date();
  await mem.save();
  return mem;
}

/**
 * Clear state (when flow completes)
 */
async function clearState(userId) {
  const mem = await getMemory(userId);
  mem.state = null;
  mem.awaiting = null;
  mem.updatedAt = new Date();
  await mem.save();
  return mem;
}

module.exports = {
  getMemory,
  recordUserMessage,
  recordBotMessage,
  setState,
  clearState
};
