import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email using nodemailer
 * @param {string} to - Recipient email
 * @param {string} subject - Subject of the email
 * @param {string} text - Plain text fallback
 * @param {string} html - HTML content
 */

const sendMail = async (to, subject, text, html = null) => {
  const mailOptions = {
    from: 'Eventify Team',
    to,
    subject,
    text,
    ...(html && { html }), // include HTML if provided
  };

  return transporter.sendMail(mailOptions);
};

export default { sendMail };
