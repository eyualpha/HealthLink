import express from "express";
import { body, validationResult } from "express-validator";
import Appointment from "../models/appointements.model.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/doctor.model.js";
import { authenticateJWT } from "../middleware/auth.js";
import { requirePermission, Roles } from "../rbac.js";
import { auditAction } from "../middleware/audit.js";

const router = express.Router();

// Create appointment
router.post(
  "/",
  authenticateJWT,
  requirePermission("appointments:create"),
  body("patientId").isMongoId(),
  body("doctorId").isMongoId(),
  body("appointementDate").isISO8601(),
  body("appointementTime").isString().isLength({ min: 1 }),
  body("appointementType").isString().isLength({ min: 1 }),
  body("notes").optional().isString(),
  body("status").optional().isIn(["scheduled", "completed", "canceled"]),
  auditAction("create", "Appointment", (req) => req.auditResourceId),
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });

    const {
      patientId,
      doctorId,
      appointementDate,
      appointementTime,
      appointementType,
      notes,
      status,
    } = req.body;

    const patientExists = await Patient.exists({ _id: patientId });
    if (!patientExists)
      return res.status(404).json({ error: "Patient not found" });

    const doctorExists = await Doctor.exists({ _id: doctorId });
    if (!doctorExists)
      return res.status(404).json({ error: "Doctor not found" });

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointementDate,
      appointementTime,
      appointementType,
      notes,
      status,
    });

    req.auditResourceId = appointment._id.toString();
    res.status(201).json(appointment);
  },
);

// List appointments (patients see their own; staff see filters)
router.get("/", authenticateJWT, async (req, res) => {
  const role = req.user.role;
  const page = parseInt(req.query.page || "1", 10);
  const limit = Math.min(parseInt(req.query.limit || "25", 10), 100);
  const filter = {};

  if (role === Roles.PATIENT) {
    filter.patientId = req.user.id;
  } else {
    const allowed = [
      Roles.ADMIN,
      Roles.DOCTOR,
      Roles.NURSE,
      Roles.CLINICIAN,
      Roles.RECEPTION,
    ];
    if (!allowed.includes(role))
      return res.status(403).json({ error: "Forbidden" });
    if (req.query.patientId) filter.patientId = req.query.patientId;
    if (req.query.doctorId) filter.doctorId = req.query.doctorId;
  }

  const items = await Appointment.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ appointementDate: -1, createdAt: -1 });

  res.json({ page, limit, items });
});

// Read single appointment
router.get("/:id", authenticateJWT, async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ error: "Not found" });

  const role = req.user.role;
  const userId = req.user.id;
  const staffRoles = [Roles.ADMIN, Roles.DOCTOR, Roles.NURSE, Roles.CLINICIAN];

  const isStaff = staffRoles.includes(role);
  const isPatientOwner =
    role === Roles.PATIENT && appointment.patientId?.toString() === userId;

  if (!isStaff && !isPatientOwner)
    return res.status(403).json({ error: "Forbidden" });

  await auditAction("read", "Appointment", () => req.params.id)(
    req,
    res,
    () => {},
  );
  return res.json(appointment);
});

// Update appointment
router.put(
  "/:id",
  authenticateJWT,
  requirePermission("appointments:update"),
  body("appointementDate").optional().isISO8601(),
  body("appointementTime").optional().isString().isLength({ min: 1 }),
  body("appointementType").optional().isString().isLength({ min: 1 }),
  body("notes").optional().isString(),
  body("status").optional().isIn(["scheduled", "completed", "canceled"]),
  auditAction("update", "Appointment", (req) => req.params.id),
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  },
);

// Delete appointment (admin via wildcard)
router.delete(
  "/:id",
  authenticateJWT,
  requirePermission("appointments:delete"),
  auditAction("delete", "Appointment", (req) => req.params.id),
  async (req, res) => {
    const removed = await Appointment.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  },
);

export default router;
