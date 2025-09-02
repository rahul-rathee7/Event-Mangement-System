import mailsender from "../utils/sendMail.js";
import user from '../models/user.js';

export const userNotification = async (req, res) => {
    const { email, fullname } = req.body;
    console.log(email, fullname);

    if (!email || !fullname) {
        return res.status(200).json({ message: "Missing email or fullname" });
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
        return res.status(200).json({ message: "User already exists" });
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
        return res.status(200).json({ message: 'User created successfully', fullname });
    } catch (emailError) {
        console.log('Email sending failed:', emailError);
    }
};