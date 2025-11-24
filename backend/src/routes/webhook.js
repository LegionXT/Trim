const router = require("express").Router();
const { handleMessage } = require("../controllers/messageController");

router.post("/", handleMessage);

module.exports = router;
