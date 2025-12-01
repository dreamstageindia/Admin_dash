import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LockClosedIcon, UserGroupIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect to /login if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-blue-950 px-4 sm:px-6 lg:px-8">
            {/* Buttons */}
            <div className="flex flex-row items-center justify-center gap-6 flex-wrap">
                <a
                    href="/create-auth"
                    className="flex items-center justify-center w-[1000px] bg-white text-gray-800 font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <LockClosedIcon className="h-8 w-8 mr-4" />
                    <span className="text-xl">Create Authentication</span>
                </a>
                <a
                    href="/manage-auths"
                    className="flex items-center justify-center w-[1000px] bg-white text-gray-800 font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <UserGroupIcon className="h-8 w-8 mr-4" />
                    <span className="text-xl">Manage My Auths</span>
                </a>
                <a
                    href="/settings"
                    className="flex items-center justify-center w-[1000px] bg-white text-gray-800 font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <Cog6ToothIcon className="h-8 w-8 mr-4" />
                    <span className="text-xl">Settings</span>
                </a>
            </div>
        </div>
    );
};

export default Dashboard;