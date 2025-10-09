import mailsender from "../utils/sendMail.js";
import user from '../models/user.js';
import otpVerification from '../models/otpVerification.js';
import bcrypt from 'bcrypt';

export const userNotification = async (req, res) => {
    const { email, fullname } = req.body;

    if (!email || !fullname) {
        return res.status(200).json({ success: false, message: "Missing email or fullname" });
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
        return res.status(200).json({ success: false, message: "User already exists" });
    }

    await user.create({ email, fullname });

    try {
        await mailsender.sendMail(
            email,
            '🎉 Welcome to Eventify!',
            `Hello ${fullname}, your account has been created.`,
            `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Welcome to <span style="color: #4f46e5;">Eventify</span>, ${fullname}!</h2>
          <p>We're thrilled to have you on board.</p>
          <p>Your account has been successfully created and you're ready to start exploring exciting opportunities.</p>
          <hr style="border: none; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #888;">If you have any questions, feel free to reply to this email.</p>
          <p>🚀 Let's get started!</p>
          <p><strong>- Eventify Team</strong></p>
        </div>
        `
        );
        return res.status(200).json({ success: true, message: 'User created successfully', fullname });
    } catch (emailError) {
        console.log('Email sending failed:', emailError);
    }
};

export const forget_password = async (req, res) => {
    const { email } = req.body;
    
    if(!email){
        return res.status(200).json({ success: false, message: "Missing email" });
    }

    const existingUser = await user.findOne({ email });
    if (!existingUser) {
        return res.status(200).json({ success: false, message: "User does not exist" });
    }

    const existingOtp = await otpVerification.findOne({ email });
    if (existingOtp) {
        await otpVerification.deleteOne({ email });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    await otpVerification.create({ email, otp });

    try {
        await mailsender.sendMail(
            email,
            `Hello ${existingUser.fullname}, your OTP is ${otp}`,
        );
        return res.status(200).json({ success: true, message: `Your otp sent successfully`, otp });
    } catch (emailError) {
        console.log('Email sending failed:', emailError);
    }
}

export const verify_otp = async (req, res) => {
    const { email, otp } = req.body;
    
    if(!email || !otp){
        return res.status(200).json({ success: false, message: "Missing email or otp" });
        console.log("Missing email or otp");
    }

    const existingUser = await user.findOne({ email });
    if (!existingUser) {
        return res.status(200).json({ success: false, message: "User does not exist" });
        console.log("User does not exist");
    }

    const existingOtp = await otpVerification.findOne({ email });
    if (!existingOtp) {
        return res.status(200).json({ success: false, message: "OTP does not exist" });
        console.log("OTP does not exist");
    }
    
    if(existingOtp.otp == otp){
        return res.status(200).json({ success: true, message: "OTP verified successfully" });
        console.log("OTP verified successfully");
    }
    else{
        return res.status(200).json({ success: false, message: "OTP does not match" });
        console.log("OTP does not match");
    }
}

export const reset_password = async (req, res) => {
    try{
        const { email, password } = req.body;
        
        if(!email || !password){
            return res.status(200).json({ success: false, message: "Missing email or password" });
            console.log("Missing email or password");
        }
        
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(200).json({ success: false, message: "User does not exist" });
            console.log("User does not exist");
        }

        const oldPassword = existingUser.password;

        const passwordMatch = await bcrypt.compare(password, oldPassword);
        if (passwordMatch) {
            return res.status(200).json({ success: false, message: "New password cannot be the same as the old password" });
            console.log("New password cannot be the same as the old password");
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await user.updateOne({ email }, { $set: { hashedPassword } });
        
        return res.status(200).json({ success: true, message: "Password reset successfully" });
        console.log("Password reset successfully");
    }
    catch(err){
        return res.status(400).json({ success: false, message: "Something went wrong" });
        console.log(err);
    }
}