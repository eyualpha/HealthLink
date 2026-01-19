import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    resourceType: String,
    resourceId: mongoose.Schema.Types.ObjectId,
    diff: mongoose.Schema.Types.Mixed,
    ip: String,
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditSchema);
