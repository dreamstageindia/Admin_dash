import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SummaryApi from '../../common';
import Toast from '../../components/Toast';

const VerifyEmail = () => {
    const [otp, setOtp] = useState(Array(6).fill('')); // Array to store 6 OTP digits
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [isOtpValid, setIsOtpValid] = useState(null); // Track OTP validity
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Allow only numbers
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus the next input
        if (value && index < 5) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }

        // Validate OTP when all 6 digits are entered
        if (newOtp.every(digit => digit !== '')) {
            const otpValue = newOtp.join('');
            validateOtp(otpValue);
        } else {
            setIsOtpValid(null); // Reset validation state if OTP is incomplete
        }
    };

    // Handle backspace key
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Move focus to the previous input if the current box is empty
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    // Validate OTP with the backend
    const validateOtp = async (otpValue) => {
        try {
            const res = await axios({
                method: SummaryApi.ValidateOtp.method,
                url: SummaryApi.ValidateOtp.url,
                data: { email, otp: otpValue },
            });
            setIsOtpValid(res.data.success); // Update validation state based on the response
            if (res.data.success) {
                // Automatically verify if OTP is valid
                const verifyRes = await axios({
                    method: SummaryApi.VerifyEmail.method,
                    url: SummaryApi.VerifyEmail.url,
                    data: { email, otp: otpValue }
                });
                if (verifyRes.data.success) {
                    setToast({ show: true, message: verifyRes.data.message, type: 'success' });
                    setTimeout(() => navigate('/login'), 2000);
                }
            }
        } catch (err) {
            setIsOtpValid(false); // Mark OTP as invalid if there's an error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setToast({ show: true, message: 'Please enter a valid 6-digit OTP', type: 'error' });
            return;
        }
        try {
            const res = await axios({
                method: SummaryApi.VerifyEmail.method,
                url: SummaryApi.VerifyEmail.url,
                data: { email, otp: otpValue }
            });
            if (res.data.success) {
                setToast({ show: true, message: res.data.message, type: 'success' });
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setToast({ show: true, message: err.response?.data?.message || 'Email verification failed', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-blue-950 px-4 sm:px-6 lg:px-8">
            <div className="text-center w-full">
                <div className="mb-6">
                    <div className="w-12 h-12 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mt-4">Verify Your Email</h2>
                    <p className="text-gray-300">Enter the OTP sent to {email}</p>
                </div>
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                    <div className="mb-4 flex justify-center space-x-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-input-${index}`}
                                type="text"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                maxLength={1}
                                className={`w-10 h-10 p-3 bg-transparent border rounded-lg text-white text-center focus:outline-none focus:ring-2 ${
                                    isOtpValid === null
                                        ? 'border-gray-500 focus:ring-blue-500'
                                        : isOtpValid
                                        ? 'border-green-500 focus:ring-green-500'
                                        : 'border-red-500 focus:ring-red-500'
                                }`}
                                required
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="w-1/2 bg-white text-gray-800 font-semibold p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        Verify Email
                    </button>
                </form>
                <p className="mt-4 text-gray-300">
                    Back to <a href="/signup" className="text-gray-300 hover:underline">Sign Up</a>
                </p>
                {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />}
            </div>
        </div>
    );
};

export default VerifyEmail;