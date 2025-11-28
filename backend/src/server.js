require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/webhook", require("./routes/webhook"));

const adminTicketRoutes = require("./routes/adminTickets");
app.use("/admin/tickets", adminTicketRoutes);

// 👉 ADD CONVERSATION API ROUTES HERE ...
const conversationRoutes = require("./routes/conversations");
app.use("/admin/conversations", conversationRoutes);

const analyticsRoutes = require("./routes/analytics");
app.use("/admin/analytics", analyticsRoutes);

// DB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("DB error:", err));

// start server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
