import express from "express";
import { body, validationResult } from "express-validator";
import Prescription from "../models/prescription.model.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/doctor.model.js";
import { authenticateJWT } from "../middleware/auth.js";
import { requirePermission, Roles } from "../rbac.js";
import { auditAction } from "../middleware/audit.js";

const router = express.Router();

router.post(
  "/",
  authenticateJWT,
  requirePermission("prescriptions:create"),
  body("patientId").isMongoId(),
  body("doctorId").isMongoId(),
  body("medications").isArray({ min: 1 }),
  body("medications.*.name").isString().isLength({ min: 1 }),
  body("medications.*.dosage").isString().isLength({ min: 1 }),
  body("medications.*.frequency").isString().isLength({ min: 1 }),
  body("medications.*.duration").isString().isLength({ min: 1 }),
  body("instructions").isString().isLength({ min: 1 }),
  auditAction("create", "Prescription", (req) => req.auditResourceId),
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });

    const { patientId, doctorId, medications, instructions, issueDate } =
      req.body;

    const patientExists = await Patient.exists({ _id: patientId });
    if (!patientExists)
      return res.status(404).json({ error: "Patient not found" });

    const doctorExists = await Doctor.exists({ _id: doctorId });
    if (!doctorExists)
      return res.status(404).json({ error: "Doctor not found" });

    const prescription = await Prescription.create({
      patientId,
      doctorId,
      medications,
      instructions,
      issueDate,
    });

    req.auditResourceId = prescription._id.toString();
    res.status(201).json(prescription);
  },
);

router.get("/:id", authenticateJWT, async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);
  if (!prescription) return res.status(404).json({ error: "Not found" });

  const role = req.user.role;
  const userId = req.user.id;
  const clinicalStaffRoles = [
    Roles.ADMIN,
    Roles.DOCTOR,
    Roles.NURSE,
    Roles.CLINICIAN,
  ];

  const isClinicalStaff = clinicalStaffRoles.includes(role);
  const isPatientOwner =
    role === Roles.PATIENT && prescription.patientId?.toString() === userId;

  if (!isClinicalStaff && !isPatientOwner)
    return res.status(403).json({ error: "Forbidden" });

  await auditAction("read", "Prescription", () => req.params.id)(
    req,
    res,
    () => {},
  );
  return res.json(prescription);
});

router.get("/", authenticateJWT, async (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;
  const page = parseInt(req.query.page || "1", 10);
  const limit = Math.min(parseInt(req.query.limit || "25", 10), 100);
  const filter = {};
  const clinicalStaffRoles = [
    Roles.ADMIN,
    Roles.DOCTOR,
    Roles.NURSE,
    Roles.CLINICIAN,
  ];
  const isClinicalStaff = clinicalStaffRoles.includes(role);

  if (isClinicalStaff) {
    if (req.query.patientId) filter.patientId = req.query.patientId;
    if (req.query.doctorId) filter.doctorId = req.query.doctorId;
  } else if (role === Roles.PATIENT) {
    filter.patientId = userId;
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }
  const items = await Prescription.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ issueDate: -1, createdAt: -1 });

  res.json({ page, limit, items }).status(200);
});

export default router;
