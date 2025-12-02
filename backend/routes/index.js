const express = require("express");
const { signup, login, forgotPassword, resetPassword, verifyEmail, validateOtp } = require("../controller/authController");
const testController = require("../controller/testController");
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    bulkUpdateUsers,
    bulkDeleteUsers
} = require("../controller/userController");

const {
    getAllEPKs,
    getEPKById,
    getEPKBySlug,
    createEPK,
    updateEPK,
    deleteEPK,
    bulkUpdateEPKs,
    bulkDeleteEPKs,
    bulkImportEPKs,
    togglePublish,
    getEPKStats,
    exportTemplate
} = require("../controller/epkController");

const { authenticateToken, isAdmin, isVerified } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes (no authentication required)
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/validate-otp", validateOtp);
router.get("/test", testController);

// Protected routes - require authentication
// User CRUD routes
router.get("/users", authenticateToken, isVerified, getAllUsers);
router.get("/users/:id", authenticateToken, isVerified, getUserById);
router.post("/users", authenticateToken, isVerified, createUser);
router.put("/users/:id", authenticateToken, isVerified, updateUser);
router.delete("/users/:id", authenticateToken, isVerified, deleteUser);

// Bulk operations (admin only)
router.post("/users/bulk-update", authenticateToken, isVerified, isAdmin, bulkUpdateUsers);
router.post("/users/bulk-delete", authenticateToken, isVerified, isAdmin, bulkDeleteUsers);

// EPK routes
router.get("/epks", authenticateToken, isVerified, getAllEPKs);
router.get("/epks/stats", authenticateToken, isVerified, getEPKStats);
router.get("/epks/template", authenticateToken, isVerified, exportTemplate);
router.get("/epks/:id", authenticateToken, isVerified, getEPKById);
router.get("/epks/slug/:slug", getEPKBySlug); // Public route for published EPKs
router.post("/epks", authenticateToken, isVerified, createEPK);
router.put("/epks/:id", authenticateToken, isVerified, updateEPK);
router.delete("/epks/:id", authenticateToken, isVerified, deleteEPK);
router.put("/epks/:id/publish", authenticateToken, isVerified, togglePublish);

// Bulk operations (admin only)
router.post("/epks/bulk-update", authenticateToken, bulkUpdateEPKs);
router.post("/epks/bulk-delete", authenticateToken,  bulkDeleteEPKs);
router.post("/epks/bulk-import", authenticateToken,  bulkImportEPKs);

// Optional: Add a protected test route
router.get("/protected-test", authenticateToken, (req, res) => {
    res.json({ 
        message: "This is a protected route", 
        user: req.user,
        success: true 
    });
});

module.exports = router;