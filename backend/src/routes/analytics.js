const express = require("express");
const router = express.Router();

const Ticket = require("../models/Ticket");
const Conversation = require("../models/Conversation");

// GET /admin/analytics/overview
router.get("/overview", async (req, res) => {
  try {
    const openTickets = await Ticket.countDocuments({ status: "open" });
    const resolvedTickets = await Ticket.countDocuments({ status: "resolved" });

    const totalConversations = await Conversation.countDocuments();

    return res.json({
      openTickets,
      resolvedTickets,
      totalConversations
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load analytics" });
  }
});

// GET /admin/analytics/top-intents
router.get("/top-intents", async (req, res) => {
  try {
    const conversations = await Conversation.find();

    const intentCount = {};

    for (const convo of conversations) {
      for (const msg of convo.messages) {
        if (msg.intent) {
          intentCount[msg.intent] = (intentCount[msg.intent] || 0) + 1;
        }
      }
    }

    res.json(intentCount);
  } catch (err) {
    res.status(500).json({ error: "Failed to load intent stats" });
  }
});

// GET /admin/analytics/daily
router.get("/daily", async (req, res) => {
  try {
    const conversations = await Conversation.find();

    const dayCount = {};

    for (const convo of conversations) {
      const day = new Date(convo.lastUpdated).toISOString().slice(0, 10); 
      dayCount[day] = (dayCount[day] || 0) + 1;
    }

    res.json(dayCount);
  } catch (err) {
    res.status(500).json({ error: "Failed to load daily stats" });
  }
});

module.exports = router;
