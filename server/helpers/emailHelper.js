import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP Configuration Error:", error);
  } else {
    console.log("SMTP Server is ready to take our messages");
  }
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text version of the email
 * @param {string} [options.html] - HTML version of the email
 * @param {Array} [options.attachments] - Array of attachments
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  attachments = [],
}) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

/**
 * Send a welcome email to a new user
 * @param {string} email - User's email address
 * @param {string} name - User's name
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Our Platform!";
  const text = `Hi ${name},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Our Platform!</h2>
      <p>Hi ${name},</p>
      <p>We're excited to have you on board! Thank you for joining our platform.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <br>
      <p>Best regards,<br>The Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

/**
 * Send a password reset email
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  const subject = "Password Reset Request";
  const text = `You requested a password reset. Please click the following link to reset your password: ${resetUrl}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Please click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

export const AccountCreatedEmail = async (email, name) => {
  const subject = "Account Created";
  const text = `Hi ${name},\n\nYour account has been created successfully.\n\nBest regards,\nThe Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Account Created</h2>
      <p>Hi ${name},</p>
      <p>Your account has been created successfully. Thank you for joining our platform.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <br>
      <p>Best regards,<br>The Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};
