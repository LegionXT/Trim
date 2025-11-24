const { detectIntent } = require("../nlu/intentEngine");

const ecommerce = require("../agents/ecommerce");
const productivity = require("../agents/productivity");
const support = require("../agents/support");

module.exports.handleMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const { intent, confidence } = detectIntent(message);

    let reply;

    if (intent === "product_search") reply = await ecommerce.handle(message, userId);
    else if (intent === "schedule_meeting") reply = await productivity.handle(message, userId);
    else if (intent === "support_issue") reply = await support.handle(message, userId);
    else reply = { text: "I'm not sure I understood that. Can you clarify?" };

    res.json(reply);
  } catch (err) {
    console.log(err);
    res.json({ text: "Something went wrong. Try again." });
  }
};
