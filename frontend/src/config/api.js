// frontend/src/config/api.js
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const API_ENDPOINTS = {
    USERS: {
        GET_ALL: `${API_BASE_URL}/users`,
        GET_ONE: (id) => `${API_BASE_URL}/users/${id}`,
        CREATE: `${API_BASE_URL}/users`,
        UPDATE: (id) => `${API_BASE_URL}/users/${id}`,
        DELETE: (id) => `${API_BASE_URL}/users/${id}`,
        BULK_UPDATE: `${API_BASE_URL}/users/bulk-update`,
        BULK_DELETE: `${API_BASE_URL}/users/bulk-delete`
    }
};

export const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
};