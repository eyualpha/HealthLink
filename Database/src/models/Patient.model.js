import mongoose from "mongoose";

const identifierSchema = new mongoose.Schema(
	{
		system: { type: String, required: true, trim: true },
		value: { type: String, required: true, trim: true },
	},
	{ _id: false }
);

const emergencyContactSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		relationship: { type: String, required: false, trim: true },
		phoneNumber: { type: String, required: true, trim: true },
	},
	{ _id: false }
);

const patientSchema = new mongoose.Schema(
	{
		// Links to the login/identity (User). This is NOT the medical record itself.
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
			unique: true,
			sparse: true,
			index: true,
		},

		// Medical identifiers (MRN, national ID, etc.)
		identifiers: {
			type: [identifierSchema],
			default: [],
		},

		fullName: { type: String, required: true, trim: true, index: true },

		gender: {
			type: String,
			enum: ["male", "female", "other"],
			default: "other",
			index: true,
		},

		dateOfBirth: { type: Date, required: false, index: true },

		bloodType: {
			type: String,
			enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
			required: false,
			index: true,
		},

		phoneNumber: { type: String, required: false, trim: true },

		address: {
			type: String,
			required: false,
			trim: true,
		},

		emergencyContact: {
			type: emergencyContactSchema,
			required: false,
		},

		// Who registered the patient (typically Admin/Nurse/Doctor user)
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
			index: true,
		},
	},
	{ timestamps: true }
);

patientSchema.index({ fullName: "text", "identifiers.value": 1 });

// Convenience relationships (actual FK fields live in the other collections)
patientSchema.virtual("appointments", {
	ref: "Appointment",
	localField: "_id",
	foreignField: "patientId",
});

patientSchema.virtual("prescriptions", {
	ref: "Prescription",
	localField: "_id",
	foreignField: "patientId",
});

patientSchema.virtual("allergies", {
	ref: "Allergy",
	localField: "_id",
	foreignField: "patientId",
});

patientSchema.set("toJSON", { virtuals: true });
patientSchema.set("toObject", { virtuals: true });

export default mongoose.model("Patient", patientSchema);
