import express from "express";
import Patient from "../models/Patient.js";
import { authenticateJWT } from "../middleware/auth.js";
import { requirePermission, Roles } from "../rbac.js";
import { auditAction } from "../middleware/audit.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Create patient (reception or admin or patient self)
router.post(
  "/",
  authenticateJWT,
  requirePermission("patients:create"),
  body("name").isLength({ min: 1 }),
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    const p = await Patient.create(req.body);
    res.status(201).json(p);
  }
);

// Search / list (paginated simple)
router.get("/", authenticateJWT, requirePermission("patients:read"), async (req, res) => {
  const q = req.query.q || "";
  const page = parseInt(req.query.page || "1", 10);
  const limit = Math.min(parseInt(req.query.limit || "25", 10), 100);
  const filter = q ? { $text: { $search: q } } : {};
  const docs = await Patient.find(filter).skip((page - 1) * limit).limit(limit);
  res.json({ page, limit, items: docs });
});

// Get single patient: allow doctors/nurses/admin or patient owner
router.get("/:id", authenticateJWT, async (req, res, next) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ error: "Not found" });
  const role = req.user.role;
  if (role === Roles.ADMIN || role === Roles.DOCTOR || role === Roles.NURSE || role === Roles.CLINICIAN) {
    await auditAction("read", "Patient", () => req.params.id)(req, res, () => {});
    return res.json(patient);
  }
  // patients can read own only -- we assume patient user id matches some identifier (out of scope)
  if (role === Roles.PATIENT && req.user.id === patient.ownerDoctorId?.toString()) {
    await auditAction("read", "Patient", () => req.params.id)(req, res, () => {});
    return res.json(patient);
  }
  return res.status(403).json({ error: "Forbidden" });
});

// Update patient
router.put(
  "/:id",
  authenticateJWT,
  requirePermission("patients:update"),
  body("name").optional().isLength({ min: 1 }),
  auditAction("update", "Patient", (req) => req.params.id),
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  }
);

// Delete patient (admin only)
router.delete("/:id", authenticateJWT, requirePermission("patients:delete"), auditAction("delete", "Patient", (req) => req.params.id), async (req, res) => {
  const removed = await Patient.findByIdAndDelete(req.params.id);
  if (!removed) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;
