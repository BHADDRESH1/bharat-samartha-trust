const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const emailTemplates = {
  registration: (otp) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">Welcome to Admin Portal</h2>
      <p>Thank you for registering. Please use the following code to complete your registration:</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h1 style="color: #6366f1; font-size: 32px; margin: 0;">${otp}</h1>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't create this account, please ignore this email.</p>
    </div>
  `,
  login: (otp) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">Login Verification</h2>
      <p>Your login verification code is:</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h1 style="color: #6366f1; font-size: 32px; margin: 0;">${otp}</h1>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If this wasn't you, please secure your account immediately.</p>
    </div>
  `,
  password_reset: (otp) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">Password Reset Request</h2>
      <p>You requested to reset your password. Use the following code:</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h1 style="color: #6366f1; font-size: 32px; margin: 0;">${otp}</h1>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `,
};

const emailSubjects = {
  registration: "Complete Your Admin Registration",
  login: "Your Login Verification Code",
  password_reset: "Reset Your Password",
};

const sendOTPEmail = async (email, otp, type) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@adminportal.com",
    to: email,
    subject: emailSubjects[type],
    html: emailTemplates[type](otp),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail
};
