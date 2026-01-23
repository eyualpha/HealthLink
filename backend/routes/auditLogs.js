
import express from "express";
import AuditLog from "../models/AuditLog.js";
import { authenticateJWT } from "../middleware/auth.js"; 
import { requirePermission } from "../rbac.js";

const router = express.Router();

// GET /audit-logs?search=&action=&page=&pageSize=
router.get(
  "/",
  authenticateJWT,
  requirePermission("audit:read"),
  async (req, res) => {
    try {
      const {
        search = "",
        action,
        page = "1",
        pageSize = "10",
      } = req.query;

      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const sizeNum = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 10));

      const filter = {};

      if (action && action !== "all") {
        filter.action = action;
      }

      if (search && search.trim().length > 0) {
        const regex = new RegExp(search.trim(), "i");
        filter.$or = [
          { action: regex },
          { resourceType: regex },
          { resourceId: regex },
          { ip: regex },
        ];
      }

      const [items, total] = await Promise.all([
        AuditLog.find(filter)
          .sort({ createdAt: -1 })
          .skip((pageNum - 1) * sizeNum)
          .limit(sizeNum)
          .populate("actor", "name email role")
          .lean(),
        AuditLog.countDocuments(filter),
      ]);

      const mapped = items.map((log) => ({
        id: log._id.toString(),
        timestamp: log.createdAt,
        userName: log.actor?.name || "Unknown user",
        userRole: log.actor?.role,
        action: log.action,
        entityType: log.resourceType,
        entityId:
          typeof log.resourceId === "string"
            ? log.resourceId
            : log.resourceId?.toString(),
        description: log.diff
          ? JSON.stringify(log.diff).slice(0, 200)
          : undefined,
        ipAddress: log.ip,
      }));

      res.json({
        items: mapped,
        total,
        page: pageNum,
        pageSize: sizeNum,
      });
    } catch (err) {
      console.error("GET /audit-logs error:", err.message);
      res.status(500).json({ error: "Server error" });
    }
  },
);

export default router;
