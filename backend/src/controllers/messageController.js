const { detectIntent } = require("../nlu/intentEngine");
const ecommerce = require("../agents/ecommerce");
const productivity = require("../agents/productivity");
const support = require("../agents/support");
const memoryService = require("../services/memoryService");

module.exports.handleMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    console.log("Incoming:", message);

    if (!userId || !message) return res.status(400).json({ text: "Missing userId or message" });

    const mem = await memoryService.getMemory(userId);

    // If waiting on a field, handle it first
    if (mem && mem.state && mem.awaiting) {
      const awaiting = mem.awaiting;
      // size path
      if (awaiting.field === "size") {
        const reply = await ecommerce.handleSizeSelection(message, userId);
        await memoryService.recordBotMessage(userId, reply.text);
        return res.json(reply);
      }
      // confirm checkout
      if (awaiting.field === "confirm_checkout") {
        const reply = await ecommerce.handleCheckout(userId, message);
        await memoryService.recordBotMessage(userId, reply.text);
        return res.json(reply);
      }
      // awaiting payment
      if (awaiting.field === "payment") {
        const reply = await ecommerce.processPayment(userId, message);
        await memoryService.recordBotMessage(userId, reply.text);
        return res.json(reply);
      }
    }

    // Normal NLU path
    const { intent, entities } = detectIntent(message);
    await memoryService.recordUserMessage(userId, message, intent, entities);

    let reply;
    if (intent === "product_search") reply = await ecommerce.handle(message, userId);
    else if (intent === "schedule_meeting") reply = await productivity.handle(message, userId);
    else if (intent === "support_issue") reply = await support.handle(message, userId);
    else reply = { text: "I'm not sure I understood that. Can you clarify?" };

    await memoryService.recordBotMessage(userId, reply.text);
    return res.json(reply);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ text: "Internal server error" });
  }
};
