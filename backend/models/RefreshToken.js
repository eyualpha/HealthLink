import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenId: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    revoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("RefreshToken", refreshTokenSchema);
