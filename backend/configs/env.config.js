import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET;
export const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || "12";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
// Support either MONGO_URI or MONGODB_URI environment variable names
export const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
