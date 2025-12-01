// backend/models/AdminUser.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    organization: { type: String, required: true },
    organizationSize: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    verified: { type: Boolean, default: false },
}, { timestamps: true });

adminUserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adminUserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("AdminUser", adminUserSchema);