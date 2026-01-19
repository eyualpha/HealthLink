import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import patientRoutes from "./routes/patients.js";
import { authenticateJWT } from "./middleware/auth.js";
import { Roles } from "./rbac.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/healthlink";

app.use(helmet());
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
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
