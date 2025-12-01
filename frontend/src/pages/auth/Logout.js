import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        
        // Optional: Show a success toast
        Toast({ message: 'Logged out successfully', type: 'success' });
        
        // Redirect to the login page
        navigate('/login');
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-blue-950">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Logging out...</h2>
            </div>
        </div>
    );
};

export default Logout; 