import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect to /dashboard if logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-900 to-blue-950 px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl">
                {/* Logo */}
                <div className="mb-8">
                    <img
                        alt="Your Company"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-12 w-auto mx-auto"
                    />
                </div>

                {/* Hero Section */}
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                    Welcome to Your Company
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 mb-8">
                    Streamline your workflow with our powerful tools. Get started today and take control of your projects.
                </p>

                {/* Call to Action */}
                <div className="flex justify-center gap-4">
                    <a
                        href="/signup"
                        className="bg-white text-gray-800 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        Sign Up
                    </a>
                    <a
                        href="/login"
                        className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-gray-800 transition-colors duration-300"
                    >
                        Log In
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;