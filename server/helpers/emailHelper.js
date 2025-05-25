import nodemailer from "nodemailer";
import dotenv from "dotenv";
import pug from "pug";
import path from "path";
import { fileURLToPath } from "url";
import juice from "juice";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 * Render a Pug template
 * @param {string} template - Template name (without .pug extension)
 * @param {Object} data - Data to pass to the template
 * @returns {string} - Rendered HTML with inlined styles
 */
const renderTemplate = (template, data) => {
  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    "emails",
    `${template}.pug`
  );
  // const styleStr = `
  //   <style>
  //     .btn {
  //       background-color: #007bff;
  //       padding: 10px 20px;
  //       color: white;
  //       text-decoration: none;
  //       border-radius: 5px;
  //       display: inline-block;
  //       margin: 10px 0;
  //     }
  //   </style>
  // `;
  const renderedTemplate = pug.renderFile(templatePath, data);
  // const htmlWithStyles = renderedTemplate.replace(
  //   "</head>",
  //   `${styleStr}</head>`
  // );
  return juice(renderedTemplate);
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Template name (without .pug extension)
 * @param {Object} options.templateData - Data to pass to the template
 * @param {Array} [options.attachments] - Array of attachments
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendEmail = async ({
  to,
  subject,
  template,
  templateData,
  attachments = [],
}) => {
  try {
    const html = renderTemplate(template, templateData);
    const text = html.replace(/<[^>]*>/g, ""); // Strip HTML tags for plain text version

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
  const loginUrl = `${process.env.CLIENT_URL}/login`;
  return sendEmail({
    to: email,
    subject: "Welcome to Our Platform!",
    template: "welcome",
    templateData: {
      name,
      loginUrl,
      subject: "Welcome to Our Platform!",
    },
  });
};

/**
 * Send a password reset email
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  return sendEmail({
    to: email,
    subject: "Password Reset Request",
    template: "password-reset",
    templateData: {
      resetUrl,
      subject: "Password Reset Request",
    },
  });
};

export const AccountCreatedEmail = async (email, name) => {
  const loginUrl = `${process.env.CLIENT_URL}/login`;
  return sendEmail({
    to: email,
    subject: "Account Created",
    template: "welcome",
    templateData: {
      name,
      loginUrl,
      subject: "Account Created",
    },
  });
};
