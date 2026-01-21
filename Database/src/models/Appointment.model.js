import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
	{
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
			index: true,
		},
		doctorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Doctor",
			required: true,
			index: true,
		},
		appointmentDate: {
			type: Date,
			required: true,
			index: true,
		},
		status: {
			type: String,
			enum: ["Scheduled", "Completed", "Cancelled"],
			default: "Scheduled",
			index: true,
		},
		reason: {
			type: String,
			required: false,
			trim: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
			index: true,
		},
	},
	{ timestamps: true }
);

// One doctor -> one appointment per time slot
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 }, { unique: true });

export default mongoose.model("Appointment", appointmentSchema);
