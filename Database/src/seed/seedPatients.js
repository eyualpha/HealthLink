import mongoose from "mongoose";
import dotenv from "dotenv";
import User, { Roles } from "../models/User.model.js";
import Patient from "../models/Patient.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/healthlink";

const demoProfiles = [
	{
		fullName: "Jane Doe",
		gender: "female",
		dateOfBirth: new Date("1990-04-12"),
		bloodType: "A+",
		phoneNumber: "+1-555-0101",
		address: "123 Elm Street",
		emergencyContact: {
			name: "John Doe",
			relationship: "Spouse",
			phoneNumber: "+1-555-0102",
		},
		identifiers: [{ system: "MRN", value: "MRN-0001" }],
	},
	{
		fullName: "Mark Smith",
		gender: "male",
		dateOfBirth: new Date("1982-09-30"),
		bloodType: "O-",
		phoneNumber: "+1-555-0103",
		address: "456 Pine Avenue",
		emergencyContact: {
			name: "Sarah Smith",
			relationship: "Sister",
			phoneNumber: "+1-555-0104",
		},
		identifiers: [{ system: "MRN", value: "MRN-0002" }],
	},
];

async function seedPatients() {
	await mongoose.connect(MONGO_URI);

	const patientUsers = await User.find({ role: Roles.PATIENT });

	if (patientUsers.length === 0) {
		console.log("No Patient users found. Run seedUsers first.");
		await mongoose.disconnect();
		return;
	}

	let created = 0;
	let skipped = 0;

	for (let i = 0; i < patientUsers.length; i += 1) {
		const user = patientUsers[i];

		const existing = await Patient.findOne({ userId: user._id });
		if (existing) {
			console.log(`Skipped (exists): ${user.email}`);
			skipped += 1;
			continue;
		}

		const profile = demoProfiles[i % demoProfiles.length];
		const patient = await Patient.create({
			...profile,
			userId: user._id,
			createdBy: user._id,
		});

		console.log(`Created patient profile for: ${user.email} -> ${patient._id}`);
		created += 1;
	}

	console.log(`Patient seed complete. Created: ${created}, Skipped: ${skipped}`);
	await mongoose.disconnect();
}

seedPatients().catch((error) => {
	console.error("Patient seed failed:", error);
	process.exit(1);
});
