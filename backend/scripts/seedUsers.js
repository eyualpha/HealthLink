import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/healthlink";

const USERS = [
  { email: "admin@localhost", password: "Admin123!", name: "Admin User", role: "admin" },
  { email: "doctor@localhost", password: "Doctor123!", name: "Dr. Seeded", role: "doctor" },
  { email: "nurse@localhost", password: "Nurse123!", name: "Nurse Seeded", role: "nurse" },
  { email: "reception@localhost", password: "Reception123!", name: "Reception User", role: "reception" },
  { email: "patient@localhost", password: "Patient123!", name: "Patient Seeded", role: "patient" },
  { email: "clinician@localhost", password: "Clinician123!", name: "Clinician Seeded", role: "clinician" },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to Mongo for seeding users");

  for (const u of USERS) {
    const existing = await User.findOne({ email: u.email });
    const passwordHash = await User.hashPassword(u.password, parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10));
    if (existing) {
      existing.name = u.name;
      existing.role = u.role;
      existing.passwordHash = passwordHash;
      await existing.save();
      console.log("Updated:", u.email, "->", u.password);
    } else {
      await User.create({ email: u.email, name: u.name, passwordHash, role: u.role });
      console.log("Created:", u.email, "->", u.password);
    }
  }

  console.log("Seeding complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
