import express from "express";
import User from "../models/User.js";
import { BCRYPT_SALT_ROUNDS } from "../configs/env.config.js";
import {
  signAccessToken,
  issueRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
} from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  body("email").isEmail({ require_tld: false }),
  body("password").isLength({ min: 6 }),
  body("name").isLength({ min: 1 }),
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    const { email, password, name } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email in use" });
    const passwordHash = await User.hashPassword(
      password,
      parseInt(BCRYPT_SALT_ROUNDS, 10),
    );
    const user = await User.create({
      email,
      name,
      passwordHash,
      role: "patient",
    });
    const access = signAccessToken(user);
    const refresh = await issueRefreshToken(user);
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken: access,
      refreshToken: refresh,
    });
  },
);

router.post(
  "/login",
  body("email").isEmail({ require_tld: false }),
  body("password").isLength({ min: 1 }),
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const access = signAccessToken(user);
    const refresh = await issueRefreshToken(user);
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken: access,
      refreshToken: refresh,
    });
  },
);

router.post("/refresh", body("refreshToken").isString(), async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
  const { refreshToken } = req.body;
  try {
    const { user, tokenDoc } = await verifyRefreshToken(refreshToken);
    // rotate: revoke old and issue new
    await revokeRefreshToken(refreshToken);
    const access = signAccessToken(user);
    const refresh = await issueRefreshToken(user);
    res.json({ accessToken: access, refreshToken: refresh });
  } catch (err) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

router.post("/logout", body("refreshToken").isString(), async (req, res) => {
  const { refreshToken } = req.body;
  try {
    await revokeRefreshToken(refreshToken);
  } catch (err) {}
  res.json({ ok: true });
});

export default router;
