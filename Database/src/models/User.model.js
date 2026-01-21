import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const Roles = Object.freeze({
	DOCTOR: "Doctor",
	NURSE: "Nurse",
	ADMIN: "Admin",
	PATIENT: "Patient",
});

function looksLikeBcryptHash(value) {
	return typeof value === "string" && value.startsWith("$2") && value.length >= 50;
}

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			index: true,
			lowercase: true,
			trim: true,
		},

		// Stored as a bcrypt hash.
		password: {
			type: String,
			required: true,
			select: false,
		},

		// One user -> one role.
		role: {
			type: String,
			enum: Object.values(Roles),
			default: Roles.PATIENT,
			index: true,
			required: true,
		},

		// Disable accounts without deleting.
		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},

		// Audit & security.
		lastLogin: {
			type: Date,
			default: null,
			index: true,
		},

		// Optional 1-1 links to profile documents.
		doctorProfile: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Doctor",
			unique: true,
			sparse: true,
		},
		patientProfile: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
			unique: true,
			sparse: true,
		},
	},
	{ timestamps: true }
);

userSchema.pre("validate", function (next) {
	if (this.doctorProfile && this.patientProfile) {
		return next(new Error("User cannot be linked to both Doctor and Patient profiles."));
	}
	if (this.doctorProfile && this.role !== Roles.DOCTOR) {
		return next(new Error('doctorProfile can only be set when role is "Doctor".'));
	}
	if (this.patientProfile && this.role !== Roles.PATIENT) {
		return next(new Error('patientProfile can only be set when role is "Patient".'));
	}
	return next();
});

userSchema.pre("save", async function (next) {
	try {
		if (!this.isModified("password")) return next();
		if (looksLikeBcryptHash(this.password)) return next();
		this.password = await bcrypt.hash(this.password, 12);
		return next();
	} catch (error) {
		return next(error);
	}
});

userSchema.methods.verifyPassword = function (plainTextPassword) {
	return bcrypt.compare(plainTextPassword, this.password);
};

userSchema.statics.hashPassword = function (plainTextPassword, rounds = 12) {
	return bcrypt.hash(plainTextPassword, rounds);
};

userSchema.set("toJSON", {
	transform(_doc, ret) {
		delete ret.password;
		return ret;
	},
});

export default mongoose.model("User", userSchema);
