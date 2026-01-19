import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/healthlink";

async function seed() {
  await mongoose.connect(MONGO_URI);
  const email = process.env.SEED_ADMIN_EMAIL || "admin@localhost";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }
  const passwordHash = await User.hashPassword(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10));
  const u = await User.create({ email, name: "Admin", passwordHash, role: "admin" });
  console.log("Created admin:", u.email);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
