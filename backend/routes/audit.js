import express from "express";
import AuditLog from "../models/AuditLog.js";
import { authenticateJWT } from "../middleware/auth.js";
import { requirePermission } from "../rbac.js";

const router = express.Router();

router.get(
  "/",
  authenticateJWT,
  requirePermission("audit:read"),
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        actor,
        resourceType,
        action,
        resourceId,
        page = 1,
        limit = 50,
      } = req.query;

      const filter = {};

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
          filter.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          filter.createdAt.$lte = new Date(endDate);
        }
      }

      if (actor) {
        filter.actor = actor;
      }

      if (resourceType) {
        filter.resourceType = resourceType;
      }

      if (action) {
        filter.action = action;
      }

      if (resourceId) {
        filter.resourceId = resourceId;
      }

      const pageNum = parseInt(page, 10);
      const limitNum = Math.min(parseInt(limit, 10), 100); 
      const skip = (pageNum - 1) * limitNum;

      const [logs, total] = await Promise.all([
        AuditLog.find(filter)
          .sort({ createdAt: -1 }) 
          .skip(skip)
          .limit(limitNum)
          .populate("actor", "name email") 
          .lean(),
        AuditLog.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: logs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      });
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch audit logs",
        message: error.message,
      });
    }
  },
);

router.get(
  "/:id",
  authenticateJWT,
  requirePermission("audit:read"),
  async (req, res) => {
    try {
      const log = await AuditLog.findById(req.params.id)
        .populate("actor", "name email")
        .lean();

      if (!log) {
        return res.status(404).json({
          success: false,
          error: "Audit log not found",
        });
      }

      res.json({
        success: true,
        data: log,
      });
    } catch (error) {
      console.error("Error fetching audit log:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch audit log",
        message: error.message,
      });
    }
  },
);

export default router;
