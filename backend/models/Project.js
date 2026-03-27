const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["Planning", "Development", "Testing", "Completed", "On Hold"],
      default: "Planning",
    },
    progress: { type: Number, default: 0 },
    budget: { type: String },
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
    },
    // NEW: Attachments array for File Uploads
    attachments: [
      {
        filename: String,
        path: String,
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    startDate: { type: Date, default: Date.now },
    deadline: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
