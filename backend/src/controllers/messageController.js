const { detectIntent } = require("../nlu/intentEngine");
const ecommerce = require("../agents/ecommerce");
const productivity = require("../agents/productivity");
const support = require("../agents/support");
const memoryService = require("../services/memoryService");
const Conversation = require("../models/Conversation");

module.exports.handleMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    console.log("Incoming:", message);

    if (!userId || !message)
      return res.status(400).json({ text: "Missing userId or message" });

    // RESET
    if (message.toLowerCase() === "reset") {
      await memoryService.clearState(userId);
      return res.json({ text: "Memory cleared ✔️ Start fresh!" });
    }

    const mem = await memoryService.getMemory(userId);

    // ---------------- HANDLE AWAITING STATES ----------------
    if (mem?.awaiting?.field) {
      const field = mem.awaiting.field;

      // Correct handler order (message, userId)
      const handlers = {
        size: (msg, uid) => ecommerce.handleSizeSelection(msg, uid),
        confirm_checkout: (msg, uid) => ecommerce.handleCheckout(uid, msg), // checkout expects (userId, answer)
        payment: (msg, uid) => ecommerce.processPayment(uid, msg),         // payment expects (userId, message)
        meeting_date: (msg, uid) => productivity.handleDate(uid, msg),
        meeting_time: (msg, uid) => productivity.handleTime(uid, msg),
        meeting_duration: (msg, uid) => productivity.handleDuration(uid, msg)
      };

      if (handlers[field]) {
        const reply = await handlers[field](message, userId);

        // record + save bot reply
        await memoryService.recordBotMessage(userId, reply.text);

        let convoBot = await Conversation.findOne({ userId });
        if (!convoBot) convoBot = new Conversation({ userId, messages: [] });

        convoBot.messages.push({ from: "bot", text: reply.text });
        convoBot.lastUpdated = new Date();
        await convoBot.save();

        return res.json(reply);
      }
    }
    // ---------------------------------------------------------

    // ------------------ NLU PATH ------------------
    const { intent, entities } = detectIntent(message);
    await memoryService.recordUserMessage(userId, message, intent, entities);
    // ------------------------------------------------

    // -------- SAVE USER MESSAGE WITH INTENT --------
    let convo = await Conversation.findOne({ userId });
    if (!convo) convo = new Conversation({ userId, messages: [] });

    convo.messages.push({
      from: "user",
      text: message,
      intent
    });
    convo.lastUpdated = new Date();
    await convo.save();
    // -----------------------------------------------

    // ---------------- ROUTE TO AGENT ----------------
    let reply;

    if (intent === "product_search") {
      reply = await ecommerce.handle(message, userId);

    } else if (intent === "schedule_meeting") {
      reply = await productivity.handle(message, userId);

    } else if (intent === "support_issue") {
      reply = await support.handle(message, userId);

    } else {
      reply = { text: "I'm not sure I understood that. Can you clarify?" };
    }
    // ------------------------------------------------

    // record bot message
    await memoryService.recordBotMessage(userId, reply.text);

    // SAVE BOT MESSAGE
    let convoBot = await Conversation.findOne({ userId });
    if (!convoBot) convoBot = new Conversation({ userId, messages: [] });

    convoBot.messages.push({ from: "bot", text: reply.text });
    convoBot.lastUpdated = new Date();
    await convoBot.save();

    return res.json(reply);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ text: "Internal server error" });
  }
};
