import sendMail from "../utils/sendMail.js";
import user from "../models/user.js";
import otpVerification from "../models/otpVerification.js";
import bcrypt from "bcrypt";
import userMessage from "../models/userMessage.js";

/* ================= USER NOTIFICATION ================= */

export const userNotification = async (req, res) => {
  const { email, fullname } = req.body;

  if (!email || !fullname) {
    return res.status(400).json({ success: false, message: "Missing email or fullname" });
  }

  const existingUser = await user.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ success: false, message: "User already exists" });
  }

  await user.create({ email, fullname });

  try {
    await sendMail(
      email,
      "🎉 Welcome to Eventify!",
      `Hello ${fullname}, your account has been created.`,
      `
        <div style="font-family: Arial; color:#333">
          <h2>Welcome to Eventify, ${fullname}!</h2>
          <p>Your account has been created successfully.</p>
          <p>🚀 Let's get started!</p>
          <p><strong>- Eventify Team</strong></p>
        </div>
      `
    );

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      fullname,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Email failed" });
  }
};

/* ================= FORGOT PASSWORD ================= */

export const forget_password = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Missing email" });
  }

  const existingUser = await user.findOne({ email });
  if (!existingUser) {
    return res.status(404).json({ success: false, message: "User does not exist" });
  }

  await otpVerification.deleteOne({ email });

  const otp = Math.floor(100000 + Math.random() * 900000);
  const hashedOtp = await bcrypt.hash(otp.toString(), 10);

  await otpVerification.create({ email, otp: hashedOtp });

  try {
    await sendMail(
      email,
      "Your OTP for Eventify",
      `Your OTP is ${otp}`,
      `<h2>Your OTP: ${otp}</h2>`
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Email failed" });
  }
};

/* ================= VERIFY OTP ================= */

export const verify_otp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Missing email or otp" });
  }

  const record = await otpVerification.findOne({ email });
  if (!record) {
    return res.status(404).json({ success: false, message: "OTP not found" });
  }

  const isValid = await bcrypt.compare(otp.toString(), record.otp);
  if (!isValid) {
    return res.status(401).json({ success: false, message: "Invalid OTP" });
  }

  return res.status(200).json({ success: true, message: "OTP verified" });
};

/* ================= RESET PASSWORD ================= */

export const reset_password = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing email or password" });
  }

  const existingUser = await user.findOne({ email });
  if (!existingUser) {
    return res.status(404).json({ success: false, message: "User does not exist" });
  }

  const isSame = await bcrypt.compare(password, existingUser.password);
  if (isSame) {
    return res.status(400).json({
      success: false,
      message: "New password cannot be same as old password",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await user.updateOne(
    { email },
    { $set: { password: hashedPassword } }
  );

  await otpVerification.deleteOne({ email });

  return res.status(200).json({ success: true, message: "Password reset successfully" });
};

/* ================= STORE MESSAGE ================= */

export const store_message = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Incomplete data" });
  }

  const existing = await userMessage.findOne({ email });

  if (existing) {
    existing.subject = subject;
    existing.message = message;
    await existing.save();
    return res.status(200).json({ success: true, message: "Message updated" });
  }

  await userMessage.create({ name, email, subject, message });

  return res.status(200).json({ success: true, message: "Message submitted" });
};

/* ================= TWO FACTOR ================= */

export const two_factor = async (req, res) => {
  const { email, inp } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Missing email" });
  }

  const exists = await user.findOne({ email });
  if (!exists) {
    return res.status(404).json({ success: false, message: "User does not exist" });
  }

  exists.twoFA = inp;
  await exists.save();

  return res.status(200).json({
    success: true,
    message: "Two factor authentication updated",
    two_factor: inp,
  });
};
