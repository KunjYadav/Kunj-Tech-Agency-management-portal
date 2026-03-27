const Message = require("../models/Message");
const Project = require("../models/Project");

// Helper function to verify user is allowed to access project messages
const verifyProjectAccess = async (projectId, userId, userRole) => {
  const project = await Project.findById(projectId);
  if (!project) return false;

  if (userRole === "admin") return true;
  if (project.client.toString() === userId.toString()) return true;
  if (project.assignedEmployees.includes(userId)) return true;

  return false;
};

exports.getProjectMessages = async (req, res) => {
  try {
    const hasAccess = await verifyProjectAccess(
      req.params.projectId,
      req.user.id,
      req.user.role,
    );
    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Not authorized to view comms for this project." });
    }

    const messages = await Message.find({ project: req.params.projectId })
      .populate("sender", "name role")
      .sort("createdAt");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { projectId, content } = req.body;

    const hasAccess = await verifyProjectAccess(
      projectId,
      req.user.id,
      req.user.role,
    );
    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Not authorized to transmit to this project." });
    }

    const message = await Message.create({
      project: projectId,
      sender: req.user.id,
      content,
    });

    const populatedMessage = await message.populate("sender", "name role");

    // REAL-TIME EMIT: Send to everyone securely verified in the project room
    req.io.to(projectId).emit("receive_message", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
