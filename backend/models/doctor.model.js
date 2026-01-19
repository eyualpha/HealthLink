import mongoose from "mongoose";
const doctorSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    clinicAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
