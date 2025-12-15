const bcrypt = require("bcryptjs");
const Admin = require("../../models/auth/Admin.js");
const OTP = require("../../models/auth/OTP.js");
const PendingRegistration = require("../../models/auth/pendingRegistration.js"); // New model needed
const { sendOTPEmail } = require("../../services/emailService.js");
const {
  generateToken,
  generateRefreshToken,
  generateResetToken,
  verifyToken,
} = require("../../services/tokenService.js");
const {
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequiredFields,
} = require("../../utils/validators.js");
const { generateOTP } = require("../../utils/helpers.js");

// Register Admin - Store temporarily until OTP verification
const register = async (req, res) => {
  try {
    const { fullName, email, phone, organization, password } = req.body;

    // Validation
    if (
      !validateRequiredFields([fullName, email, phone, organization, password])
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res
        .status(409)
        .json({ error: "Admin with this email already exists" });
    }

    // Check if there's already a pending registration
    const existingPending = await PendingRegistration.findOne({
      email: email.toLowerCase(),
    });
    if (existingPending) {
      // Update existing pending registration
      existingPending.fullName = fullName;
      existingPending.phone = phone;
      existingPending.organization = organization;
      existingPending.password = await bcrypt.hash(password, 10);
      existingPending.createdAt = new Date();
      await existingPending.save();
    } else {
      // Create new pending registration
      const hashedPassword = await bcrypt.hash(password, 10);
      await PendingRegistration.create({
        fullName,
        email: email.toLowerCase(),
        phone,
        organization,
        password: hashedPassword,
      });
    }

    // Invalidate any existing registration OTPs
    await OTP.updateMany(
      { email: email.toLowerCase(), type: "registration", isUsed: false },
      { isUsed: true }
    );

    // Generate and send OTP
    const otp = generateOTP();
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      type: "registration",
    });

    // await sendOTPEmail(email, otp, "registration");
    // Fire-and-forget email
sendOTPEmail(email, otp, "registration")
  .then(() => console.log(`OTP sent to ${email}`))
  .catch(err => console.error(`Failed to send OTP: ${err}`));

    res.status(201).json({
      message:
        "Registration initiated. Please check your email for verification code.",
      email: email.toLowerCase(),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login Admin
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!validateEmail(email)) {
      return res.status(200).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      return res.status(200).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // account locked
    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      const minutes = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return res.status(200).json({
        success: false,
        message: `Account locked. Try again in ${minutes} minutes.`,
      });
    }

    if (!admin.isActive) {
      return res.status(200).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    if (admin.hasOwnProperty("isVerified") && !admin.isVerified) {
      return res.status(200).json({
        success: false,
        message: "Account not verified",
      });
    }

    // password
    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      admin.loginAttempts = (admin.loginAttempts || 0) + 1;

      if (admin.loginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      }

      await admin.save();

      return res.status(200).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // SUCCESS
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    const accessToken = generateToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(200).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp, type } = req.body;

    if (!validateRequiredFields([email, otp, type])) {
      return res
        .status(400)
        .json({ error: "Email, OTP, and type are required" });
    }

    if (otp.length !== 6) {
      return res.status(400).json({ error: "OTP must be 6 digits" });
    }

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.updateOne({ _id: otpRecord._id }, { isUsed: true });
      return res
        .status(400)
        .json({
          error: "Too many invalid attempts. Please request a new OTP.",
        });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      await OTP.updateOne({ _id: otpRecord._id }, { $inc: { attempts: 1 } });
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Mark OTP as used
    await OTP.updateOne({ _id: otpRecord._id }, { isUsed: true });

    // Handle different OTP types
    if (type === "registration") {
      // Find pending registration
      const pendingRegistration = await PendingRegistration.findOne({
        email: email.toLowerCase(),
      });
      if (!pendingRegistration) {
        return res
          .status(404)
          .json({ error: "Pending registration not found" });
      }

      // Create actual admin account
      const admin = new Admin({
        fullName: pendingRegistration.fullName,
        email: pendingRegistration.email,
        phone: pendingRegistration.phone,
        organization: pendingRegistration.organization,
        password: pendingRegistration.password,
        isVerified: true,
        isActive: true,
      });

      await admin.save();

      // Clean up pending registration
      await PendingRegistration.deleteOne({ _id: pendingRegistration._id });

      return res.json({
        message: "Registration completed successfully",
        admin: {
          id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          organization: admin.organization,
          role: admin.role,
        },
      });
    }

    if (type === "password_reset") {
      // Find admin
      const admin = await Admin.findOne({ email: email.toLowerCase() });
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      const resetToken = generateResetToken(admin._id);

      return res.json({
        message: "OTP verified. You can now reset your password.",
        resetToken,
      });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!validateRequiredFields([email, type])) {
      return res.status(400).json({ error: "Email and type are required" });
    }

    // For registration type, check pending registration
    if (type === "registration") {
      const pendingRegistration = await PendingRegistration.findOne({
        email: email.toLowerCase(),
      });
      if (!pendingRegistration) {
        return res.status(404).json({ error: "No pending registration found" });
      }
    } else {
      // For login/password_reset, check if admin exists
      const admin = await Admin.findOne({ email: email.toLowerCase() });
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
    }

    // Invalidate previous OTPs
    await OTP.updateMany(
      { email: email.toLowerCase(), type, isUsed: false },
      { isUsed: true }
    );

    // Generate new OTP
    const otp = generateOTP();
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      type,
    });

    await sendOTPEmail(email, otp, type);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      // Don't reveal if email exists or not
      return res.json({
        message: "If an account exists, a reset code has been sent.",
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({ error: "Account is deactivated" });
    }

    // Invalidate existing password reset OTPs
    await OTP.updateMany(
      { email: email.toLowerCase(), type: "password_reset", isUsed: false },
      { isUsed: true }
    );

    // Generate and send OTP
    const otp = generateOTP();
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      type: "password_reset",
    });

    await sendOTPEmail(email, otp, "password_reset");

    res.json({ message: "If an account exists, a reset code has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!validateRequiredFields([resetToken, newPassword, confirmPassword])) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (!validatePassword(newPassword)) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    // Verify reset token
    const decoded = verifyToken(
      resetToken,
      process.env.JWT_SECRET || "your-secret-key"
    );
    if (decoded.type !== "password_reset") {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    // Find admin
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      return res.status(404).json({ error: "Admin not found or inactive" });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    admin.password = hashedPassword;
    admin.updatedAt = new Date();
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    await admin.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    const decoded = verifyToken(
      token,
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
    );
    if (decoded.type !== "refresh") {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const admin = await Admin.findById(decoded.adminId).select("-password");
    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: "Invalid or inactive account" });
    }

    const newAccessToken = generateToken(admin._id);
    const newRefreshToken = generateRefreshToken(admin._id);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Admin Profile
const getProfile = async (req, res) => {
  try {
    res.json({
      admin: {
        id: req.admin._id,
        fullName: req.admin.fullName,
        email: req.admin.email,
        phone: req.admin.phone,
        organization: req.admin.organization,
        role: req.admin.role,
        isVerified: req.admin.isVerified,
        lastLogin: req.admin.lastLogin,
        createdAt: req.admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Admin Profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, organization } = req.body;

    if (!validateRequiredFields([fullName, phone, organization])) {
      return res
        .status(400)
        .json({ error: "Full name, phone, and organization are required" });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    const admin = await Admin.findById(req.admin._id);
    admin.fullName = fullName;
    admin.phone = phone;
    admin.organization = organization;
    admin.updatedAt = new Date();
    await admin.save();

    res.json({
      message: "Profile updated successfully",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        organization: admin.organization,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (
      !validateRequiredFields([currentPassword, newPassword, confirmPassword])
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    if (!validatePassword(newPassword)) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    const admin = await Admin.findById(req.admin._id);

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    admin.password = hashedPassword;
    admin.updatedAt = new Date();
    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    // In a more sophisticated setup, you might blacklist the token
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Clean up expired pending registrations (utility function)
const cleanupExpiredPendingRegistrations = async () => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    await PendingRegistration.deleteMany({
      createdAt: { $lt: thirtyMinutesAgo },
    });
  } catch (error) {
    console.error("Cleanup error:", error);
  }
};

module.exports = {
  register,
  login,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  cleanupExpiredPendingRegistrations,
};
