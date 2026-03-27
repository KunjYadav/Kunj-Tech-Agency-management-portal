const mongoose = require("mongoose");

const PaymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cardHolder: { type: String, required: true },
  brand: { type: String, required: true }, // e.g., Visa, Mastercard
  last4: { type: String, required: true },
  expMonth: { type: String, required: true },
  expYear: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);