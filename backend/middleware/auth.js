import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.js";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "1h";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev_refresh";
const REFRESH_EXPIRES_DAYS = parseInt(process.env.REFRESH_EXPIRES_DAYS || "30", 10);

export async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub).select("_id name email role disabled");
    if (!user || user.disabled) return res.status(401).json({ error: "Invalid user" });
    req.user = { id: user._id.toString(), role: user.role, name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function signAccessToken(user) {
  const payload = { sub: user._id.toString(), role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export async function issueRefreshToken(user) {
  const tokenId = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ tokenId, user: user._id, expiresAt });
  const token = jwt.sign({ sub: user._id.toString(), tid: tokenId }, REFRESH_SECRET, { expiresIn: `${REFRESH_EXPIRES_DAYS}d` });
  return token;
}

export async function verifyRefreshToken(token) {
  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const tokenId = payload.tid;
    const doc = await RefreshToken.findOne({ tokenId, revoked: false });
    if (!doc) throw new Error("Refresh token revoked or missing");
    if (doc.expiresAt < new Date()) throw new Error("Refresh token expired");
    const user = await User.findById(payload.sub).select("_id name email role");
    if (!user) throw new Error("User not found");
    return { user, tokenDoc: doc };
  } catch (err) {
    throw err;
  }
}

export async function revokeRefreshTokenById(tokenId) {
  await RefreshToken.updateOne({ tokenId }, { revoked: true });
}

export async function revokeRefreshToken(token) {
  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    await revokeRefreshTokenById(payload.tid);
  } catch (err) {
    // ignore
  }
}
