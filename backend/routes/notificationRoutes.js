const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/", getNotifications);

// Put this BEFORE the /:id route so it doesn't get caught as an ID!
router.patch("/read-all", markAllAsRead); 
router.patch("/:id/read", markAsRead);

module.exports = router;