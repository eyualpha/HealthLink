import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Roles } from "../rbac.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(Roles), default: Roles.PATIENT, index: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: false },
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = function (plain, rounds = 12) {
  return bcrypt.hash(plain, rounds);
};

export default mongoose.model("User", userSchema);
