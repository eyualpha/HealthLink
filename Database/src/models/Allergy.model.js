import mongoose from "mongoose";

const allergySchema = new mongoose.Schema(
	{
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
			index: true,
		},
		substance: { type: String, required: true, trim: true, index: true },
		reaction: { type: String, required: false, trim: true },
		severity: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "low",
			index: true,
		},
		recordedDate: { type: Date, default: Date.now, index: true },
	},
	{ timestamps: true }
);

allergySchema.index({ patientId: 1, substance: 1 }, { unique: true });

export default mongoose.model("Allergy", allergySchema);
