import express from "express";
import { body, validationResult } from "express-validator";
import Doctor from "../models/doctor.model.js";
import { authenticateJWT } from "../middleware/auth.js";
import { permitRoles, Roles } from "../rbac.js";

const router = express.Router();

// List doctors (any authenticated user)
router.get("/", authenticateJWT, async (req, res) => {
  const q = (req.query.q || "").toString().trim();
  const filter = q
    ? {
        $or: [
          { fullname: new RegExp(q, "i") },
          { specialty: new RegExp(q, "i") },
          { email: new RegExp(q, "i") },
        ],
      }
    : {};

  const docs = await Doctor.find(filter).sort({ fullname: 1 }).lean();
  res.json(docs);
});

// Create doctor (admin only)
router.post(
  "/",
  authenticateJWT,
  permitRoles(Roles.ADMIN),
  body("fullname").isLength({ min: 1 }),
  body("specialty").isLength({ min: 1 }),
  body("contactNumber").isLength({ min: 1 }),
  body("email").isEmail({ require_tld: false }),
  body("yearsOfExperience").isInt({ min: 0 }),
  body("clinicAddress").isLength({ min: 1 }),
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });

    const existing = await Doctor.findOne({ email: req.body.email });
    if (existing) return res.status(409).json({ error: "Email in use" });

    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  },
);

export default router;
