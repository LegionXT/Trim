const express = require("express");
const Conversation = require("../models/Conversation");
const router = express.Router();

// GET all conversations (summary)
router.get("/", async (req, res) => {
  try {
    const list = await Conversation.find()
      .sort({ lastUpdated: -1 })
      .select("userId status lastUpdated");
    res.json({ conversations: list });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// GET conversation messages
router.get("/:userId", async (req, res) => {
  try {
    const convo = await Conversation.findOne({ userId: req.params.userId });
    if (!convo) return res.status(404).json({ error: "Conversation not found" });

    res.json({ conversation: convo });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

// Mark as handled/closed
router.patch("/:userId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["open", "closed"];
    if (!valid.includes(status)) return res.status(400).json({ error: "Invalid status" });

    const updated = await Conversation.findOneAndUpdate(
      { userId: req.params.userId },
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Conversation not found" });

    res.json({ message: "Status updated", conversation: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;
