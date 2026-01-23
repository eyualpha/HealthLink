import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User, { Roles } from "../models/User.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/healthlink";
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

const demoUsers = [
	{
		email: "admin@healthlink.local",
		password: "admin123",
		role: Roles.ADMIN,
		isActive: true,
	},
	{
		email: "doctor@healthlink.local",
		password: "doctor123",
		role: Roles.DOCTOR,
		isActive: true,
	},
	{
		email: "nurse@healthlink.local",
		password: "nurse123",
		role: Roles.NURSE,
		isActive: true,
	},
	{
		email: "patient@healthlink.local",
		password: "patient123",
		role: Roles.PATIENT,
		isActive: true,
	},
];

async function seedUsers() {
	await mongoose.connect(MONGO_URI);

	let created = 0;
	let skipped = 0;

	for (const user of demoUsers) {
		const existing = await User.findOne({ email: user.email });
		if (existing) {
			console.log(`Skipped (exists): ${user.email}`);
			skipped += 1;
			continue;
		}

		const passwordHash = await bcrypt.hash(user.password, SALT_ROUNDS);
		await User.create({
			email: user.email,
			password: passwordHash,
			role: user.role,
			isActive: user.isActive,
		});

		console.log(`Created: ${user.email} (${user.role})`);
		created += 1;
	}

	console.log(`User seed complete. Created: ${created}, Skipped: ${skipped}`);
	await mongoose.disconnect();
}

seedUsers().catch((error) => {
	console.error("User seed failed:", error);
	process.exit(1);
});
