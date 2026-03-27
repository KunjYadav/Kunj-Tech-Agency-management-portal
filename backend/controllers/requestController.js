const ServiceRequest = require("../models/ServiceRequest");

// @desc    Create new service request
// @route   POST /api/requests
exports.createRequest = async (req, res) => {
  try {
    const { serviceType, notes, budgetRange } = req.body;

    const request = await ServiceRequest.create({
      client: req.user.id,
      serviceType,
      notes,
      budgetRange,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all requests (Admin/Employee) or User requests (Client)
// @route   GET /api/requests
exports.getRequests = async (req, res) => {
  try {
    let query;
    // Let admins and employees see all requests, restrict clients to their own
    if (req.user.role === "admin" || req.user.role === "employee") {
      query = ServiceRequest.find().populate("client", "name email company");
    } else {
      // FIX: Added .populate() here so client details aren't left blank
      query = ServiceRequest.find({ client: req.user.id }).populate(
        "client",
        "name email company",
      );
    }

    const requests = await query.sort("-createdAt");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id
exports.updateRequestStatus = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = req.body.status || request.status;
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
