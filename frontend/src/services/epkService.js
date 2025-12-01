import axios from 'axios';

const API_BASE_URL = "https://admin.dreamstage.tech/api/api";

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
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

export const epkService = {
    // Get all EPKs with pagination
    getAllEPKs: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/epks', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get EPK statistics
    getEPKStats: async () => {
        try {
            const response = await axiosInstance.get('/epks/stats');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get template for bulk upload
    getTemplate: async () => {
        try {
            const response = await axiosInstance.get('/epks/template');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get single EPK
    getEPKById: async (id) => {
        try {
            const response = await axiosInstance.get(`/epks/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get EPK by slug (public route - no auth required)
    getEPKBySlug: async (slug) => {
        try {
            const response = await axiosInstance.get(`/epks/slug/${slug}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Create EPK
    createEPK: async (epkData) => {
        try {
            const response = await axiosInstance.post('/epks', epkData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update EPK
    updateEPK: async (id, epkData) => {
        try {
            const response = await axiosInstance.put(`/epks/${id}`, epkData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete EPK
    deleteEPK: async (id) => {
        try {
            const response = await axiosInstance.delete(`/epks/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Bulk update EPKs
    bulkUpdateEPKs: async (ids, updates) => {
        try {
            const response = await axiosInstance.post('/epks/bulk-update', { ids, updates });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Bulk delete EPKs
    bulkDeleteEPKs: async (ids) => {
        try {
            const response = await axiosInstance.post('/epks/bulk-delete', { ids });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Bulk import EPKs
    bulkImportEPKs: async (epksData) => {
        try {
            const response = await axiosInstance.post('/epks/bulk-import', { epksData });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Toggle publish status
    togglePublish: async (id) => {
        try {
            const response = await axiosInstance.put(`/epks/${id}/publish`, {});
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

    // Clear authentication data
    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axiosInstance.defaults.headers.common['Authorization'];
    },

    // Set token manually (for use after login)
    setAuthToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
};