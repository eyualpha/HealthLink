import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		dosage: { type: String, required: true, trim: true },
		frequency: { type: String, required: true, trim: true },
		duration: { type: String, required: true, trim: true },
	},
	{ _id: false }
);

const aiWarningSchema = new mongoose.Schema(
	{
		message: { type: String, required: true, trim: true },
		severity: {
			type: String,
			enum: ["low", "medium", "high", "critical"],
			default: "low",
			index: true,
		},
		code: { type: String, required: false, trim: true },
		generatedAt: { type: Date, default: Date.now },
	},
	{ _id: false }
);

const prescriptionSchema = new mongoose.Schema(
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
		medications: {
			type: [medicationSchema],
			required: true,
			validate: {
				validator(value) {
					return Array.isArray(value) && value.length > 0;
				},
				message: "At least one medication is required.",
			},
		},
		notes: { type: String, required: false, trim: true },
		aiWarnings: { type: [aiWarningSchema], default: [] },
	},
	{ timestamps: true }
);

prescriptionSchema.index({ patientId: 1, createdAt: -1 });

export default mongoose.model("Prescription", prescriptionSchema);
