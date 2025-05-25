import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 1433;

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
    ],
  })
);

// Body parsing middleware - MUST be before routes
app.use(express.json()); // parse json bodies in the request
app.use(express.urlencoded({ extended: true })); // parse urlencoded bodies in the request

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true, // Prevents client-side access to the cookie
      sameSite: "strict", // Protects against CSRF
    },
  })
);

// Request logging middleware
// app.use((req, res, next) => {
//   console.log("=== Request Details ===");
//   console.log("Time:", new Date().toISOString());
//   console.log("Method:", req.method);
//   console.log("URL:", req.url);
//   console.log("Headers:", req.headers);
//   console.log("Body:", req.body);
//   console.log("=====================");
//   next();
// });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// ------------------------------
// Test routes for email functionality
import {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "./helpers/emailHelper.js";

// Test route for welcome email
app.get("/test/welcome-email", async (req, res) => {
  try {
    const result = await sendWelcomeEmail(
      req.query.to || "kavinisarg@gmail.com",
      req.query.name || "Nisarg"
    );
    res.json({ success: true, message: "Welcome email sent", result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// ------------------------------

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the CRUD API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
