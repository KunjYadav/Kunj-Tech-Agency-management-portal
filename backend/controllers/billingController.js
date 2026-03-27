const PaymentMethod = require("../models/PaymentMethod");

exports.getPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find({ user: req.user.id }).sort("-createdAt");
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addPaymentMethod = async (req, res) => {
  try {
    const { cardNumber, cardHolder, expMonth, expYear } = req.body;
    
    // Simulate Stripe/Gateway logic: Only store the last 4 digits!
    const last4 = cardNumber.slice(-4);
    const brand = cardNumber.startsWith("4") ? "Visa" : "Mastercard"; // Mock logic

    // If it's the first card, make it default
    const count = await PaymentMethod.countDocuments({ user: req.user.id });

    const newMethod = await PaymentMethod.create({
      user: req.user.id,
      cardHolder,
      brand,
      last4,
      expMonth,
      expYear,
      isDefault: count === 0
    });

    res.status(201).json(newMethod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.findById(req.params.id);
    if (!method || method.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    await method.deleteOne();
    res.json({ message: "Payment method removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};