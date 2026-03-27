const Project = require("../models/Project");
const User = require("../models/User");
const ServiceRequest = require("../models/ServiceRequest");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let stats = {};

    if (role === "admin") {
      // Admin sees everything
      const [projectCount, userCount, pendingRequests, activeEmployees] = await Promise.all([
        Project.countDocuments(),
        User.countDocuments(),
        ServiceRequest.countDocuments({ status: "Pending" }),
        User.countDocuments({ role: "employee" })
      ]);
      stats = { projectCount, userCount, pendingRequests, activeEmployees };

    } else if (role === "employee") {
      // Employee sees their specific assignments
      const [myProjects, myCompletedProjects] = await Promise.all([
        Project.countDocuments({ assignedEmployees: userId, status: { $ne: "Completed" } }),
        Project.countDocuments({ assignedEmployees: userId, status: "Completed" })
      ]);
      stats = { activeProjects: myProjects, completedProjects: myCompletedProjects };

    } else if (role === "client") {
      // Client sees their own requests and project health
      const [totalRequests, activeProjects] = await Promise.all([
        ServiceRequest.countDocuments({ client: userId }),
        Project.countDocuments({ client: userId, status: { $ne: "Completed" } })
      ]);
      stats = { totalRequests, activeProjects };
    }

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error aggregating dashboard data", error: error.message });
  }
};