const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const User = require("./models/User");
const Project = require("./models/Project");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const requestRoutes = require("./routes/requestRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const billingRoutes = require("./routes/billingRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

// CRITICAL FIX: Render acts as a reverse proxy. Express needs this to allow 'secure: true' cookies.
app.set("trust proxy", 1);

// FIX: Secure CORS configuration for production, open for local dev
// If FRONTEND_URL is misconfigured in production, this will still permit the current request origin
// while logging a warning. This prevents accidental CORS block in deploy and keeps cookie credentials.
const FRONTEND_URL = process.env.FRONTEND_URL?.replace(/\/+$/, "");

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      // Server-to-server/cURL requests have no origin
      return callback(null, true);
    }

    if (process.env.NODE_ENV === "production") {
      if (!FRONTEND_URL) {
        console.warn("WARNING: FRONTEND_URL not set in production, allowing request origin:", origin);
        return callback(null, true);
      }

      if (origin === FRONTEND_URL || origin === `${FRONTEND_URL}/`) {
        return callback(null, true);
      }

      return callback(new Error(`CORS policy forbids access from origin: ${origin}`));
    }

    // Local development: allow everything for convenience.
    return callback(null, true);
  },
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// We can remove the local /uploads static route since files live in Mongo now
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/billing", billingRoutes);

const PORT = process.env.PORT || 5000;

io.use(async (socket, next) => {
  try {
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    const token = cookies.token;

    if (!token)
      return next(new Error("Authentication error: No token provided"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = await User.findById(decoded.id).select("-password");

    if (!socket.user)
      return next(new Error("Authentication error: User not found"));
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("Secure User Connected:", socket.user.name);
  socket.join(socket.user._id.toString());

  socket.on("join_project", async (projectId) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) return;

      const isAdmin = socket.user.role === "admin";
      const isClient = project.client.toString() === socket.user._id.toString();
      const isAssigned = project.assignedEmployees.includes(socket.user._id);

      if (isAdmin || isClient || isAssigned) {
        socket.join(projectId);
        console.log(
          `User ${socket.user.name} joined secure room: ${projectId}`,
        );
      } else {
        socket.emit("error", {
          message: "Unauthorized to access this communications channel.",
        });
      }
    } catch (error) {
      console.error("Socket join error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Secure User Disconnected");
  });
});

mongoose.connect(process.env.MONGO_URI).then((conn) => {
  // NEW: Initialize MongoDB GridFS Bucket
  app.locals.gfsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
    bucketName: "uploads",
  });

  // FIX: Bind to 0.0.0.0 to prevent IPv6/IPv4 localhost resolution Axios errors
  server.listen(PORT, "0.0.0.0", () =>
    console.log(`Server & Secure Real-time Engine running on port ${PORT}`),
  );
});