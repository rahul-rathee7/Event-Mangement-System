import mongoose from "mongoose";

const Schema = mongoose.Schema;

const otpVerificationSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

export default mongoose.model("OtpVerification", otpVerificationSchema);