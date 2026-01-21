import mongoose from "mongoose";

const workingHoursSchema = new mongoose.Schema(
	{
		dayOfWeek: {
			type: String,
			enum: [
				"monday",
				"tuesday",
				"wednesday",
				"thursday",
				"friday",
				"saturday",
				"sunday",
			],
			required: true,
		},
		startTime: { type: String, required: true },
		endTime: { type: String, required: true },
	},
	{ _id: false }
);

const doctorSchema = new mongoose.Schema(
	{
		// Links to the login/identity (User)
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
			unique: true,
			sparse: true,
			index: true,
		},

		fullName: { type: String, required: true, trim: true, index: true },

		specialization: { type: String, required: true, trim: true, index: true },

		licenseNumber: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true,
		},

		yearsOfExperience: { type: Number, required: false, min: 0 },

		hospital: {
			type: String,
			required: false,
			trim: true,
			index: true,
		},

		available: { type: Boolean, default: true, index: true },

		workingHours: { type: [workingHoursSchema], default: [] },
	},
	{ timestamps: true }
);

doctorSchema.index({ fullName: "text", specialization: "text" });

// Convenience relationships
doctorSchema.virtual("appointments", {
	ref: "Appointment",
	localField: "_id",
	foreignField: "doctorId",
});

doctorSchema.virtual("prescriptions", {
	ref: "Prescription",
	localField: "_id",
	foreignField: "doctorId",
});

doctorSchema.set("toJSON", { virtuals: true });
doctorSchema.set("toObject", { virtuals: true });

export default mongoose.model("Doctor", doctorSchema);
