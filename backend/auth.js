// Deprecated compatibility shim: forward auth helpers to middleware/auth.js
export { authenticateJWT, signAccessToken, issueRefreshToken, verifyRefreshToken, revokeRefreshToken } from "./middleware/auth.js";
