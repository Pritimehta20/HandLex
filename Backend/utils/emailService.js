import nodemailer from 'nodemailer';

// Configure your email service here
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service
  auth: {
    user: process.env.EMAIL_USER || 'handlex70@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'ypktplianvndehps', // Use app-specific password for Gmail
  },
});

export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@islapp.com',
      to: email,
      subject: 'Password Reset OTP - ISL Learning Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested a password reset for your ISL Learning Platform account.</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #666;">Your OTP is:</p>
            <p style="margin: 10px 0; font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${otp}</p>
          </div>
          <p style="color: #666;">This OTP will expire in 10 minutes.</p>
          <p style="color: #666;">If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">ISL Learning Platform | © 2026</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};
