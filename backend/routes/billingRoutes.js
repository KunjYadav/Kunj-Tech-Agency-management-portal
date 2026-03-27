const express = require("express");
const router = express.Router();
const { getPaymentMethods, addPaymentMethod, deletePaymentMethod } = require("../controllers/billingController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/", getPaymentMethods);
router.post("/", addPaymentMethod);
router.delete("/:id", deletePaymentMethod);

module.exports = router;