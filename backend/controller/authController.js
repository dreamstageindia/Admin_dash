// backend/controller/authController.js

const AdminUser = require("../models/AdminUser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Signup
async function signup(req, res) {
    try {
        const { name, organization, organizationSize, role, phone, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match", success: false, error: true });
        }
        const existingUser = await AdminUser.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or phone already exists", success: false, error: true });
        }
        const user = new AdminUser({ name, organization, organizationSize, role, phone, email, password });
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email - OTP",
            text: `Your OTP for email verification is ${otp}. It is valid for 10 minutes.`,
        });

        res.status(201).json({ message: "User created. OTP sent to email for verification.", success: true, error: false, email });
    } catch (err) {
        res.status(400).json({ message: err.message || "Signup failed", success: false, error: true });
    }
}

// Verify Email
async function verifyEmail(req, res) {
    try {
        const { email, otp } = req.body;
        const user = await AdminUser.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false, error: true });
        }
        user.verified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.json({ message: "Email verified successfully", success: true, error: false });
    } catch (err) {
        res.status(400).json({ message: err.message || "Email verification failed", success: false, error: true });
    }
}

// Login
async function login(req, res) {
    try {
        const { identifier, password } = req.body;
        const user = await AdminUser.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false, error: true });
        }
        if (!user.verified) {
            return res.status(400).json({ message: "Please verify your email first", success: false, error: true });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", success: false, error: true });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server configuration error", success: false, error: true });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
        res.json({ message: "Login successful", success: true, error: false, token });
    } catch (err) {
        res.status(400).json({ message: err.message || "Login failed", success: false, error: true });
    }
}

// Forgot Password
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await AdminUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false, error: true });
        }
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
        });

        res.json({ message: "OTP sent to email", success: true, error: false });
    } catch (err) {
        res.status(400).json({ message: err.message || "Failed to send OTP", success: false, error: true });
    }
}

// Reset Password
async function resetPassword(req, res) {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match", success: false, error: true });
        }
        const user = await AdminUser.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false, error: true });
        }
        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.json({ message: "Password reset successfully", success: true, error: false });
    } catch (err) {
        res.status(400).json({ message: err.message || "Password reset failed", success: false, error: true });
    }
}

// Validate OTP
async function validateOtp(req, res) {
    try {
        const { email, otp } = req.body;

        // Find the user by email and check if the OTP matches and is not expired
        const user = await AdminUser.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // If OTP is valid, return success
        res.json({ success: true, message: 'OTP is valid' });
    } catch (err) {
        console.error('Error validating OTP:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports = { signup, login, forgotPassword, resetPassword, verifyEmail, validateOtp };