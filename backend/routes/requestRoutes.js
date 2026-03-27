const express = require("express");
const router = express.Router();
const {
  createRequest,
  getRequests,
  updateRequestStatus,
} = require("../controllers/requestController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router
  .route("/")
  // Allow both clients and admins to submit requests
  .post(authorize("client", "admin"), createRequest)
  // SECURITY FIX: Explicitly allow employees to view the queue as well
  .get(authorize("client", "admin", "employee"), getRequests);

router.patch("/:id", authorize("admin"), updateRequestStatus);

module.exports = router;
