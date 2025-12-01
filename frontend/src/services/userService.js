// frontend/src/services/userService.js
import axios from './axiosInstance'; // Import your configured axios instance

// If you don't have a separate axiosInstance file, you can create one or use the same pattern as epkService

// Option 1: Create a shared axios instance (recommended)
// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: "https://admin.dreamstage.tech/api/api",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 (Unauthorized)
        if (error.response?.status === 401) {
            // Clear authentication data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Remove Authorization header
            delete axiosInstance.defaults.headers.common['Authorization'];
            
            // Redirect to login page if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

// Helper function to handle API errors
const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error status
        console.error('API Error:', error.response.status, error.response.data);
        
        // If it's a 401, we've already handled it in the interceptor
        if (error.response.status === 401) {
            throw { 
                message: 'Session expired. Please login again.', 
                success: false, 
                error: true 
            };
        }
        
        throw error.response.data;
    } else if (error.request) {
        // Request made but no response
        console.error('Network Error:', error.message);
        throw { 
            message: 'Network error. Please check your connection.', 
            success: false, 
            error: true 
        };
    } else {
        // Something else happened
        console.error('Error:', error.message);
        throw { 
            message: error.message || 'An unexpected error occurred', 
            success: false, 
            error: true 
        };
    }
};

export const userService = {
    // Get all users with pagination
    getAllUsers: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/users', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get single user
    getUserById: async (id) => {
        try {
            const response = await axiosInstance.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Create user
    createUser: async (userData) => {
        try {
            const response = await axiosInstance.post('/users', userData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update user
    updateUser: async (id, userData) => {
        try {
            const response = await axiosInstance.put(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete user
    deleteUser: async (id) => {
        try {
            const response = await axiosInstance.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Bulk update users
    bulkUpdateUsers: async (ids, updates) => {
        try {
            const response = await axiosInstance.post('/users/bulk-update', { ids, updates });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Bulk delete users
    bulkDeleteUsers: async (ids) => {
        try {
            const response = await axiosInstance.post('/users/bulk-delete', { ids });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Set token manually (for use after login)
    setAuthToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
};