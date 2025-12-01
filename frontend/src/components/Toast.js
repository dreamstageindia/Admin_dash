import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000); // Toast disappears after 10 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center bg-gradient-to-r from-teal-900 to-blue-950 text-white text-sm font-semibold transition-all duration-1000 transform translate-x-0 w-64`}>
            <svg
                className={`w-10 h-5 mr-2 ${type === 'success' ? 'text-green-400' : 'text-red-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                {type === 'success' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                )}
            </svg>
            <span>{message}</span>
        </div>
    );
};

export default Toast;