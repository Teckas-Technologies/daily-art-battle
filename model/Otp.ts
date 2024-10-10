import mongoose, { Document, model } from "mongoose";

interface Otp extends Document {
    email: string;
    otp: string;
    otpExpiresAt: Date;
  }

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true }
})

export default mongoose.models.Otp || model<Otp>('Otp', OtpSchema);