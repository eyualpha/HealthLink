export const Roles = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  NURSE: "nurse",
  RECEPTION: "reception",
  PATIENT: "patient",
  CLINICIAN: "clinician",
};

const rolePermissions = {
  [Roles.ADMIN]: ["users:*", "patients:*", "appointments:*", "prescriptions:*", "audit:read"],
  [Roles.DOCTOR]: ["patients:read", "patients:update", "prescriptions:create", "appointments:read", "appointments:update"],
  [Roles.NURSE]: ["patients:read", "patients:update", "appointments:read"],
  [Roles.RECEPTION]: ["appointments:create", "appointments:update", "patients:create"],
  [Roles.PATIENT]: ["patients:read:own", "appointments:read:own", "prescriptions:read:own"],
};

export function permitRoles(...allowed) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(403).json({ error: "No role" });
    if (!allowed.includes(role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

export function requirePermission(permission) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(403).json({ error: "No role" });
    const perms = rolePermissions[role] || [];
    if (perms.includes("*")) return next();
    if (perms.includes(permission)) return next();
    // support wildcard like patients:*
    const [pResource, pAction] = permission.split(":");
    if (perms.some((p) => p.startsWith(`${pResource}:`) && p.endsWith("*"))) return next();
    return res.status(403).json({ error: "Forbidden" });
  };
}

export function getPermissionsForRole(role) {
  return rolePermissions[role] || [];
}
