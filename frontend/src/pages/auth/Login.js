import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SummaryApi from '../../common';
import Toast from '../../components/Toast';
import { IoFingerPrintSharp, IoEye, IoEyeOff } from "react-icons/io5";
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { isLoggedIn, login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect to /dashboard if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/manage-users');
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const res = await axios({
                method: SummaryApi.Login.method,
                url: SummaryApi.Login.url,
                data: formData,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (res.data.success) {
                // Store the token and update auth context
                login(res.data.token, res.data.user);
                
                setToast({ 
                    show: true, 
                    message: res.data.message || 'Login successful!', 
                    type: 'success' 
                });
                
                // Redirect to dashboard after 2 seconds
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                setToast({ 
                    show: true, 
                    message: res.data.message || 'Login failed', 
                    type: 'error' 
                });
            }
        } catch (err) {
            console.error('Login error:', err);
            setToast({ 
                show: true, 
                message: err.response?.data?.message || 'Login failed. Please try again.', 
                type: 'error' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-blue-950 px-4 sm:px-6 lg:px-8">
            <div className="text-center w-full max-w-md mx-auto">
                <div className="mb-6">
                    <div className="w-12 h-12 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                        <IoFingerPrintSharp className='h-10 w-10 text-teal-500'/>
                    </div>
                    <h2 className="text-2xl font-bold text-white mt-4">Login to Your Account</h2>
                    <p className="text-gray-300">Access your dashboard</p>
                </div>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <input
                            type="text"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            placeholder="Email or Phone"
                            className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-4 relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                            disabled={isLoading}
                        >
                            {showPassword ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                        </button>
                    </div>
                    <div className="flex justify-between items-center mb-6 text-sm text-gray-300">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" disabled={isLoading} />
                            Remember me
                        </label>
                        <a href="/forgot-password" className="text-gray-300 hover:underline">Forgot password</a>
                    </div>
                    <button
                        type="submit"
                        className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-white'} text-gray-800 font-semibold p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </>
                        ) : 'Login'}
                    </button>
                </form>
                <p className="mt-4 text-gray-300">
                    Don't have an account? <a href="/signup" className="text-gray-300 hover:underline">Sign Up</a>
                </p>
                {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />}
            </div>
        </div>
    );
};

export default Login;