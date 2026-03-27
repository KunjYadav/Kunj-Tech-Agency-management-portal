const express = require("express");
const router = express.Router();
const multer = require("multer");

// Use memory storage so we can stream the buffer directly to MongoDB.
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  getProjects,
  getProjectById,
  approveAndCreateProject,
  assignEmployee,
  unassignEmployee,
  updateProjectProgress,
  uploadFileToProject,
  getFile,
} = require("../controllers/projectController");

const { protect, authorize } = require("../middleware/auth");

// Secure all routes
router.use(protect);

router.get("/", getProjects);

// ------------------------------------------------------------------
// CRITICAL FIX: Put specific routes BEFORE dynamic /:id parameters!
// Otherwise, Express thinks the word "files" is a Project ID.
// ------------------------------------------------------------------
router.get("/files/:fileId", getFile);

// Now the dynamic ID route can safely go below
router.get("/:id", getProjectById);
// ------------------------------------------------------------------

router.post("/approve/:requestId", authorize("admin"), approveAndCreateProject);
router.patch("/:id/assign", authorize("admin"), assignEmployee);
router.patch("/:id/unassign", authorize("admin"), unassignEmployee);
router.patch("/:id", authorize("admin", "employee"), updateProjectProgress);

// File Operations
router.post("/:id/upload", upload.single("file"), uploadFileToProject);

module.exports = router;
