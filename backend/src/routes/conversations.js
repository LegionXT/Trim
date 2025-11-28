const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");

// ----------------------
// GET ALL CONVERSATIONS
// ----------------------
router.get("/", async (req, res) => {
  try {
    const conversations = await Conversation.find({})
      .sort({ lastUpdated: -1 });

    return res.json({ conversations });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ text: "Error fetching conversations" });
  }
});

// ----------------------
// GET SINGLE CONVERSATION
// ----------------------
router.get("/:id", async (req, res) => {
  try {
    const convo = await Conversation.findById(req.params.id);
    if (!convo) return res.status(404).json({ text: "Conversation not found" });

    return res.json({ conversation: convo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ text: "Error fetching conversation" });
  }
});

// ----------------------
// UPDATE STATUS
// ----------------------
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // e.g. handled / open

    const convo = await Conversation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!convo) return res.status(404).json({ text: "Conversation not found" });

    return res.json({
      message: "Status updated",
      conversation: convo
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ text: "Error updating status" });
  }
});

module.exports = router;
