import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
  name: String,
  dose: String,
  frequency: String,
  duration: String,
});

const patientSchema = new mongoose.Schema(
  {
    identifiers: [
      {
        system: String,
        value: String,
      },
    ],
    name: { type: String, required: true },
    dob: Date,
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    contact: {
      phone: String,
      email: String,
    },
    address: String,
    allergies: [String],
    medications: [medicationSchema],
    medicalHistory: [String],
    ownerDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

patientSchema.index({ name: "text", "identifiers.value": 1 });

export default mongoose.model("Patient", patientSchema);
