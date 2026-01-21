// Deprecated shim: re-export canonical authenticateJWT as isAuthenticated
import { authenticateJWT as isAuthenticated } from "../middleware/auth.js";
export { isAuthenticated };
