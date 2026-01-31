import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, subject, text, html) => {
  try {
    const data = await resend.emails.send({
      from: 'Eventify <onboarding@resend.dev>', // works in dev
      to,
      subject,
      text,
      ...(html && { html }),
    });

    return data;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export default sendMail;