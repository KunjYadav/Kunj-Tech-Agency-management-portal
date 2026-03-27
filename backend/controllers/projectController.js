const Project = require("../models/Project");
const ServiceRequest = require("../models/ServiceRequest");
const Notification = require("../models/Notification");

// NEW: Required for file streaming and Object ID parsing
const mongoose = require("mongoose");
const { Readable } = require("stream");

// ... (Keep getProjects, getProjectById, approveAndCreateProject, assignEmployee, unassignEmployee, and updateProjectProgress as they were) ...
exports.getProjects = async (req, res) => {
  try {
    let query;

    if (req.user.role === "admin") {
      query = Project.find()
        .populate("client", "name email company")
        .populate("assignedEmployees", "name email");
    } else if (req.user.role === "employee") {
      query = Project.find({ assignedEmployees: req.user.id })
        .populate("client", "name email company")
        .populate("assignedEmployees", "name email");
    } else {
      query = Project.find({ client: req.user.id })
        .populate("client", "name email company")
        .populate("assignedEmployees", "name email");
    }

    const projects = await query.sort("-createdAt");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name email company")
      .populate("assignedEmployees", "name email")
      .populate("attachments.uploadedBy", "name");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isClient = project.client._id.toString() === req.user.id;
    const isEmployee = project.assignedEmployees.some(
      (emp) => emp._id.toString() === req.user.id,
    );
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isClient && !isEmployee) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this project" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveAndCreateProject = async (req, res) => {
  try {
    const { requestId } = req.params;

    const serviceRequest = await ServiceRequest.findById(requestId);
    if (!serviceRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    const newProject = await Project.create({
      name: serviceRequest.serviceType,
      description: serviceRequest.notes,
      client: serviceRequest.client,
      budget: serviceRequest.budgetRange,
      status: "Planning",
      progress: 0,
      serviceRequest: serviceRequest._id,
    });

    serviceRequest.status = "approved";
    await serviceRequest.save();

    const notif = await Notification.create({
      recipient: serviceRequest.client,
      sender: req.user.id,
      type: "STATUS_CHANGE",
      content: `Your request for ${serviceRequest.serviceType} has been approved and initialized!`,
      link: `/projects/${newProject._id}`,
    });
    req.io.to(notif.recipient.toString()).emit("new_notification", notif);

    res.status(201).json({
      message: "Project successfully initialized",
      project: newProject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during approval", error: error.message });
  }
};

exports.assignEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.assignedEmployees.includes(employeeId)) {
      project.assignedEmployees.push(employeeId);
      await project.save();

      const notif = await Notification.create({
        recipient: employeeId,
        sender: req.user.id,
        type: "ASSIGNMENT",
        content: `You have been assigned to a new project: ${project.name}`,
        link: `/projects/${project._id}`,
      });
      req.io.to(notif.recipient.toString()).emit("new_notification", notif);
    }

    const updatedProject = await Project.findById(id)
      .populate("client", "name email company")
      .populate("assignedEmployees", "name email")
      .populate("attachments.uploadedBy", "name");

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.unassignEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.assignedEmployees = project.assignedEmployees.filter(
      (emp) => emp.toString() !== employeeId,
    );
    await project.save();

    const updatedProject = await Project.findById(id)
      .populate("client", "name email company")
      .populate("assignedEmployees", "name email")
      .populate("attachments.uploadedBy", "name");

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProjectProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    const progressNum = Number(progress);
    if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
      return res
        .status(400)
        .json({ message: "Progress must be between 0 and 100" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isAssignedEmployee = project.assignedEmployees.includes(req.user.id);

    if (!isAdmin && !isAssignedEmployee) {
      return res.status(403).json({
        message: "Unauthorized: You are not assigned to this project.",
      });
    }

    const status = progressNum === 100 ? "Completed" : "Development";

    project.progress = progressNum;
    project.status = status;
    await project.save();

    await project.populate("client", "name email company");

    const notif = await Notification.create({
      recipient: project.client._id,
      sender: req.user.id,
      type: "STATUS_CHANGE",
      content: `Project "${project.name}" progress updated to ${progressNum}%`,
      link: `/projects/${project._id}`,
    });
    req.io.to(notif.recipient.toString()).emit("new_notification", notif);

    res.status(200).json(project);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating progress", error: error.message });
  }
};

// --- NEW FILE HANDLING LOGIC ---

// @desc    Upload file to MongoDB GridFS
// @route   POST /api/projects/:id/upload
exports.uploadFileToProject = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isAdmin = req.user.role === "admin";
    const isClient = project.client.toString() === req.user.id;
    const isAssigned = project.assignedEmployees.includes(req.user.id);

    if (!isAdmin && !isClient && !isAssigned) {
      return res
        .status(403)
        .json({ message: "Unauthorized to upload to this project." });
    }

    // Access the GridFS bucket we created in index.js
    const gfsBucket = req.app.locals.gfsBucket;

    // Convert the Multer memory buffer into a readable Node stream
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    // Create the upload stream to MongoDB
    const uploadStream = gfsBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    // Pipe the data into the database
    readableStream.pipe(uploadStream);

    uploadStream.on("error", (error) => {
      return res
        .status(500)
        .json({ message: "Database upload failed", error: error.message });
    });

    // Wait for the stream to finish before saving the project
    uploadStream.on("finish", async () => {
      project.attachments.push({
        filename: req.file.originalname,
        // Save an API route that points to our new download function
        path: `/api/projects/files/${uploadStream.id}`,
        uploadedBy: req.user.id,
      });

      await project.save();

      const updatedProject = await Project.findById(req.params.id)
        .populate("client", "name email company")
        .populate("assignedEmployees", "name email")
        .populate("attachments.uploadedBy", "name");

      res.status(200).json(updatedProject);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "File upload logic failed", error: error.message });
  }
};

// @desc    Stream file from MongoDB to User
// @route   GET /api/projects/files/:fileId
exports.getFile = async (req, res) => {
  try {
    const gfsBucket = req.app.locals.gfsBucket;
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    // Check if the file exists in the database
    const files = await gfsBucket.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found in database" });
    }

    // Tell the browser what kind of file it is receiving
    res.set("Content-Type", files[0].contentType);
    res.set("Content-Disposition", `inline; filename="${files[0].filename}"`);

    // Stream the chunks back out of MongoDB to the client
    const downloadStream = gfsBucket.openDownloadStream(fileId);
    downloadStream.pipe(res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving file", error: error.message });
  }
};
