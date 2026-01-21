import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import patientRoutes from "./routes/patients.js";
import { authenticateJWT } from "./middleware/auth.js";
import { Roles } from "./rbac.js";

import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./configs/mongodb.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();

app.use(helmet());
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
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
