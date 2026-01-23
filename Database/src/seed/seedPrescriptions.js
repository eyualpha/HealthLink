import mongoose from "mongoose";
import dotenv from "dotenv";
import Patient from "../models/Patient.model.js";
import Doctor from "../models/Doctor.model.js";
import Prescription from "../models/Prescription.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/healthlink";

const demoPrescriptions = [
	{
		medications: [
			{
				name: "Paracetamol",
				dosage: "500mg",
				frequency: "Twice daily",
				duration: "5 days",
			},
		],
		notes: "Take after meals.",
		aiWarnings: [],
	},
	{
		medications: [
			{
				name: "Amoxicillin",
				dosage: "500mg",
				frequency: "Three times daily",
				duration: "7 days",
			},
			{
				name: "Ibuprofen",
				dosage: "200mg",
				frequency: "Twice daily",
				duration: "5 days",
			},
		],
		notes: "Hydrate well. Stop if rash develops.",
		aiWarnings: [
			{
				message: "Monitor for gastrointestinal irritation with NSAIDs.",
				severity: "medium",
				code: "NSAID_GI_RISK",
			},
		],
	},
];

async function seedPrescriptions() {
	await mongoose.connect(MONGO_URI);

	const patients = await Patient.find();
	const doctors = await Doctor.find();

	if (patients.length === 0 || doctors.length === 0) {
		console.log("Missing patients or doctors. Run seedUsers, seedPatients, and seedDoctors first.");
		await mongoose.disconnect();
		return;
	}

	let created = 0;
	let skipped = 0;

	for (let i = 0; i < patients.length; i += 1) {
		const patient = patients[i];
		const doctor = doctors[i % doctors.length];
		const template = demoPrescriptions[i % demoPrescriptions.length];

		const firstMedName = template.medications[0]?.name;
		const existing = await Prescription.findOne({
			patientId: patient._id,
			doctorId: doctor._id,
			"medications.name": firstMedName,
		});

		if (existing) {
			console.log(`Skipped (exists): ${patient._id} -> ${doctor._id}`);
			skipped += 1;
			continue;
		}

		const prescription = await Prescription.create({
			patientId: patient._id,
			doctorId: doctor._id,
			medications: template.medications,
			notes: template.notes,
			aiWarnings: template.aiWarnings,
		});

		console.log(`Created prescription: ${prescription._id}`);
		created += 1;
	}

	console.log(`Prescription seed complete. Created: ${created}, Skipped: ${skipped}`);
	await mongoose.disconnect();
}

seedPrescriptions().catch((error) => {
	console.error("Prescription seed failed:", error);
	process.exit(1);
});
