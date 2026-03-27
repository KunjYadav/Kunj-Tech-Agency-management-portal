const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['Enterprise Web Apps', 'Design Systems', 'Mobile Excellence', 'Cloud Migration']
  },
  notes: {
    type: String,
    required: [true, 'Please provide details about your requirements']
  },
  budgetRange: String,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);