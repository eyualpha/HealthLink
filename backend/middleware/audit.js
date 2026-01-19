import AuditLog from "../models/AuditLog.js";

export async function recordAudit({ actor, action, resourceType, resourceId, diff, ip }) {
  try {
    await AuditLog.create({ actor, action, resourceType, resourceId, diff, ip });
  } catch (err) {
    console.error("Failed to record audit:", err.message);
  }
}

export function auditAction(action, resourceType, getResourceId = (req) => req.params.id || null) {
  return async (req, res, next) => {
    res.on("finish", async () => {
      try {
        const resourceId = getResourceId(req);
        await recordAudit({
          actor: req.user?.id,
          action,
          resourceType,
          resourceId,
          diff: { body: req.body },
          ip: req.ip,
        });
      } catch (e) {
        // ignore
      }
    });
    next();
  };
}
