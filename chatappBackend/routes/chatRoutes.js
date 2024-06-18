// chatRoutes.js
const express = require("express");
const { processChat } = require("../controllers/chatController");

const router = express.Router();

router.post("/", processChat);

module.exports = router;
