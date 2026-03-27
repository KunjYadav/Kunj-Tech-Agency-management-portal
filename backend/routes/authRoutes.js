const express = require("express");
const router = express.Router();
const multer = require("multer");

// Use memory storage for direct GridFS streaming
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  register,
  login,
  logout, 
  getProfile,
  updateProfile,
  uploadAvatar,
  getAvatar,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); 

// Self-service profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Avatar Routes
router.post("/profile/avatar", protect, upload.single("avatar"), uploadAvatar);
router.get("/avatar/:fileId", getAvatar);

// Admin Only: Get all users with full details
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort("-createdAt");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Only: Update User
router.put("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    if (req.body.role === "client") {
      user.company = req.body.company;
      user.position = undefined;
    } else {
      user.position = req.body.company;
      user.company = undefined;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      company: updatedUser.company,
      position: updatedUser.position,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Only: Delete User
router.delete("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own admin account" });
    }

    await user.deleteOne();
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
