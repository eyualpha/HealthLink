import express from "express";
import User from "../models/User.js";
import { authenticateJWT } from "../middleware/auth.js";
import { permitRoles, Roles } from "../rbac.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Admin creates staff users
router.post(
  "/",
  authenticateJWT,
  permitRoles(Roles.ADMIN),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("name").isLength({ min: 1 }),
  body("role").isIn([
    Roles.ADMIN,
    Roles.DOCTOR,
    Roles.NURSE,
    Roles.RECEPTION,
    Roles.PATIENT,
    Roles.CLINICIAN,
  ]),
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    const { email, password, name, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email in use" });
    const passwordHash = await User.hashPassword(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),
    );
    const user = await User.create({ email, name, passwordHash, role });
    res.status(201).json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  },
);

router.get(
  "/:id",
  authenticateJWT,
  permitRoles(Roles.ADMIN),
  async (req, res) => {
    const user = await User.findById(req.params.id).select(
      "_id name email role createdAt",
    );
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  },
);

export default router;
