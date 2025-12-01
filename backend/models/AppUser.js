// backend/admin-models/AppUser.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    name: { type: String },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["artist", "manager"], default: "artist" },
    email: { type: String },
    pronouns: { type: String },
    dob: { type: Date },
    roles: { type: [String], default: [] },
    artistType: { type: String },
    performanceType: { type: String },
    stageName: { type: String },
    epkManagementType: { type: String },
    hasCompletedOnboarding: { type: Boolean, default: false },
    dashboardTourSeen: { type: Boolean, default: false },
    membership: {
        status: { type: String },
        startedAt: { type: Date },
        validTill: { type: Date },
        amount: { type: Number },
        lastOrderId: { type: String },
        lastPaymentId: { type: String },
        joinOrder: { type: Number },
        creator: { 
            code: { type: String },
            number: { type: Number }
        }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);