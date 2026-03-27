const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Readable } = require("stream");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// NEW: Helper function to attach the token as an HttpOnly cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, // Crucial: Prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // Requires HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // FIX: Allow cross-domain cookies in production
    domain: process.env.COOKIE_DOMAIN || undefined,
  };

  res.status(statusCode).cookie("token", token, options).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar, // Added avatar mapping
  });
};

// @desc    Register User
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, company, position } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // --- SECURITY IMPLEMENTATION: Privilege Escalation Prevention ---
    let assignedRole = "client"; // Default all public signups to client
    const adminCount = await User.countDocuments({ role: "admin" });

    if (adminCount === 0 && role === "admin") {
      assignedRole = "admin";
    } else {
      let isAdmin = false;
      // Read token from cookie instead of Authorization header
      if (req.cookies && req.cookies.token) {
        try {
          const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
          const requester = await User.findById(decoded.id);
          if (requester && requester.role === "admin") {
            isAdmin = true;
          }
        } catch (err) {
          console.error("Token verification failed during provisioning");
        }
      }

      if (isAdmin) {
        assignedRole = role || "employee";
      } else {
        if (role === "admin" || role === "employee") {
          return res.status(403).json({
            message:
              "Security Error: You are not authorized to create employee or admin accounts.",
          });
        }
        assignedRole = "client";
      }
    }
    // --------------------------------------------------------------

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      company,
      position,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login User
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      sendTokenResponse(user, 200, res);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // FIX: Match creation options
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // FIX: Match creation options
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// @desc    Get Current User Profile
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      sendTokenResponse(updatedUser, 200, res);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload user avatar to GridFS
// @route   POST /api/auth/profile/avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image provided" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const gfsBucket = req.app.locals.gfsBucket;
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = gfsBucket.openUploadStream(`avatar_${user._id}_${Date.now()}`, {
      contentType: req.file.mimetype,
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("error", (error) => {
      return res.status(500).json({ message: "Database upload failed", error: error.message });
    });

    uploadStream.on("finish", async () => {
      user.avatar = `/api/auth/avatar/${uploadStream.id}`;
      const updatedUser = await user.save();
      sendTokenResponse(updatedUser, 200, res);
    });
  } catch (error) {
    res.status(500).json({ message: "Avatar upload failed", error: error.message });
  }
};

// @desc    Stream avatar file from MongoDB GridFS
// @route   GET /api/auth/avatar/:fileId
exports.getAvatar = async (req, res) => {
  try {
    const gfsBucket = req.app.locals.gfsBucket;
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    const files = await gfsBucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    res.set("Content-Type", files[0].contentType);
    res.set("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    const downloadStream = gfsBucket.openDownloadStream(fileId);
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving avatar", error: error.message });
  }
};
