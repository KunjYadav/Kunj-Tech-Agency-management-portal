const express = require("express");
const router = express.Router();
const {
  getProjectMessages,
  sendMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/:projectId", getProjectMessages);
router.post("/", sendMessage);

module.exports = router;
