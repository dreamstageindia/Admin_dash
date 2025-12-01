// backend/admin-controllers/userController.js
const AppUser = require("../models/AppUser");

// Get all users with pagination and search
async function getAllUsers(req, res) {
    try {
        const { page = 1, limit = 100, search = "", sortBy = "createdAt", sortOrder = "desc" } = req.query;
        
        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phoneNumber: { $regex: search, $options: "i" } },
                { stageName: { $regex: search, $options: "i" } }
            ];
        }   

        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        const users = await AppUser.find(query)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await AppUser.countDocuments(query);

        res.json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Get single user by ID
async function getUserById(req, res) {
    try {
        const user = await AppUser.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Create new user
async function createUser(req, res) {
    try {
        const user = new AppUser(req.body);
        await user.save();
        res.status(201).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

// Update user
async function updateUser(req, res) {
    try {
        const user = await AppUser.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

// Delete user
async function deleteUser(req, res) {
    try {
        const user = await AppUser.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Bulk operations
async function bulkUpdateUsers(req, res) {
    try {
        const { ids, updates } = req.body;
        const result = await AppUser.updateMany(
            { _id: { $in: ids } },
            updates
        );
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function bulkDeleteUsers(req, res) {
    try {
        const { ids } = req.body;
        const result = await AppUser.deleteMany({ _id: { $in: ids } });
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    bulkUpdateUsers,
    bulkDeleteUsers
};