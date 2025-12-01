const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        // Get token from cookie or Authorization header
        const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                message: 'Access denied. No token provided.', 
                success: false, 
                error: true 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await AdminUser.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                message: 'User not found', 
                success: false, 
                error: true 
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token', 
                success: false, 
                error: true 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired', 
                success: false, 
                error: true 
            });
        }
        res.status(500).json({ 
            message: 'Authentication failed', 
            success: false, 
            error: true 
        });
    }
};

// Middleware to check if user is admin (optional, based on your role system)
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            message: 'Access denied. Admin privileges required.', 
            success: false, 
            error: true 
        });
    }
};

// Middleware to check if user is verified
const isVerified = (req, res, next) => {
    if (req.user && req.user.verified) {
        next();
    } else {
        res.status(403).json({ 
            message: 'Please verify your email first', 
            success: false, 
            error: true 
        });
    }
};

module.exports = {
    authenticateToken,
    isAdmin,
    isVerified
};