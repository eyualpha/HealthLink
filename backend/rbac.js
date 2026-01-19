export const Roles = {
  ADMIN: "admin",
  CLINICIAN: "clinician",
  PATIENT: "patient",
};

export function permitRoles(...allowed) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(403).json({ error: "No role" });
    if (!allowed.includes(role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
