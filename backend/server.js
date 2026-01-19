import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { authenticateJWT, signTestToken } from "./auth.js";
import { Roles, permitRoles } from "./rbac.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/healthlink";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HealthLink Backend is running");
});

app.get("/db-status", (req, res) => {
  const state = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
  res.json({ state });
});

// Issue a test JWT for local testing (do not use in production)
app.get("/auth/test-token", (req, res) => {
  const role = req.query.role || Roles.PATIENT;
  const token = signTestToken({ id: "demo", role });
  res.json({ token, role });
});

// Example RBAC-protected routes
app.get("/secure/admin", authenticateJWT, permitRoles(Roles.ADMIN), (req, res) => {
  res.json({ ok: true, role: req.user.role });
});

app.get("/secure/clinician", authenticateJWT, permitRoles(Roles.CLINICIAN, Roles.ADMIN), (req, res) => {
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
