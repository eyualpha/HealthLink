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

import { PORT } from "./configs/env.config.js";
import connectDB from "./configs/mongodb.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

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
  if (req.user.role !== Roles.ADMIN) return res.status(403).json({ error: "Forbidden" });
  res.json({ ok: true, role: req.user.role });
});

app.get("/secure/clinician", authenticateJWT, (req, res) => {
  if (req.user.role !== Roles.CLINICIAN && req.user.role !== Roles.ADMIN && req.user.role !== Roles.DOCTOR)
    return res.status(403).json({ error: "Forbidden" });
  res.json({ ok: true, role: req.user.role });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    // Still start the server so non-db endpoints can be tested
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} (no DB connection)`);
    });
  });
