import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import patientRoutes from "./routes/patients.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import appointmentRoutes from "./routes/appointments.js";
import { authenticateJWT } from "./middleware/auth.js";
import { Roles } from "./rbac.js";
import { CORS_ORIGIN } from "./configs/env.config.js";

import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./configs/mongodb.config.js";
import { PORT } from "./configs/env.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  console.log(
    `${new Date().toISOString()} --> ${req.method} ${req.originalUrl}`,
  );
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    try {
      console.log("Body:", JSON.stringify(req.body));
    } catch (e) {}
  }
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(
      `${new Date().toISOString()} <-- ${res.statusCode} ${req.method} ${req.originalUrl} ${ms}ms`,
    );
  });
  next();
});

// Connect DB and then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message || err);
    // start server anyway so some endpoints can be tested
    app.listen(PORT, () =>
      console.log(`Server started on port ${PORT} (no DB connection)`),
    );
  });

app.use(helmet());
// Explicit CORS options to reliably handle preflight requests
const corsOptions = {
  // allow any origin (will echo origin header) — keeps credentials support
  origin: function (origin, callback) {
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

app.get("/", (req, res) => {
  res.send("HealthLink Backend is running");
});

app.get("/db-status", (req, res) => {
  const state = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
  res.json({ state });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/appointments", appointmentRoutes);

app.get("/secure/admin", authenticateJWT, (req, res) => {
  if (req.user.role !== Roles.ADMIN)
    return res.status(403).json({ error: "Forbidden" });
  res.json({ ok: true, role: req.user.role });
});

app.get("/secure/clinician", authenticateJWT, (req, res) => {
  if (
    req.user.role !== Roles.CLINICIAN &&
    req.user.role !== Roles.ADMIN &&
    req.user.role !== Roles.DOCTOR
  )
    return res.status(403).json({ error: "Forbidden" });
  res.json({ ok: true, role: req.user.role });
});
