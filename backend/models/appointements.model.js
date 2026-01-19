import mongoose from "mongoose";

const appointementSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointementDate: {
      type: Date,
      required: true,
    },
    appointementTime: {
      type: String,
      required: true,
    },
    appointementType: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "canceled"],
      default: "scheduled",
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model("Appointment", appointementSchema);
export default Appointment;
