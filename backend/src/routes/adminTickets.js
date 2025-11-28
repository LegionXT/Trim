const express = require("express");
const Ticket = require("../models/Ticket");
const router = express.Router();

// GET all tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// GET single ticket by ID
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    res.json({ ticket });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

// UPDATE ticket status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // "open", "in-progress", "resolved"

    const valid = ["open", "in-progress", "resolved"];
    if (!valid.includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const updated = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Ticket not found" });

    res.json({ message: "Status updated", ticket: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update ticket" });
  }
});

module.exports = router;
