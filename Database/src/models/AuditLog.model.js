import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		action: {
			type: String,
			enum: ["CREATE", "UPDATE", "DELETE"],
			required: true,
			index: true,
		},
		entityType: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		entityId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			index: true,
		},
		timestamp: {
			type: Date,
			default: Date.now,
			index: true,
		},
		ipAddress: { type: String, required: false, trim: true },
	},
	{ timestamps: true }
);

auditLogSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });

export default mongoose.model("AuditLog", auditLogSchema);
