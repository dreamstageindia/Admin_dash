import React, { useState } from 'react';
import axios from 'axios';
import SummaryApi from '../../common';
import Toast from '../../components/Toast';
import { IoFingerPrintSharp, IoEye, IoEyeOff } from 'react-icons/io5';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isOtpValid, setIsOtpValid] = useState(null);

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return { hasUpperCase, hasNumber, hasSpecialChar };
    };

    const passwordValidation = validatePassword(newPassword);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }

        if (newOtp.every(digit => digit !== '')) {
            const otpValue = newOtp.join('');
            validateOtp(otpValue);
        } else {
            setIsOtpValid(null);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    const validateOtp = async (otpValue) => {
        try {
            const res = await axios({
                method: SummaryApi.ValidateOtp.method,
                url: SummaryApi.ValidateOtp.url,
                data: { email, otp: otpValue },
            });
            setIsOtpValid(res.data.success);
            if (res.data.success) {
                setToast({ show: true, message: 'OTP verified!', type: 'success' });
                setTimeout(() => {
                    setStep(3);
                }, 3000);
            }
        } catch (err) {
            setIsOtpValid(false);
            setToast({ show: true, message: 'Invalid OTP', type: 'error' });
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios({
                method: SummaryApi.ForgotPassword.method,
                url: SummaryApi.ForgotPassword.url,
                data: { email }
            });
            if (res.data.success) {
                setToast({ show: true, message: res.data.message, type: 'success' });
                setStep(2);
            }
        } catch (err) {
            setToast({ show: true, message: err.response?.data?.message || 'Failed to send OTP', type: 'error' });
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        const { hasUpperCase, hasNumber, hasSpecialChar } = validatePassword(newPassword);
        if (!hasUpperCase || !hasNumber || !hasSpecialChar) {
            setToast({ show: true, message: 'Password must contain at least one uppercase letter, one number, and one special character', type: 'error' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setToast({ show: true, message: 'Passwords do not match', type: 'error' });
            return;
        }
        try {
            const res = await axios({
                method: SummaryApi.ResetPassword.method,
                url: SummaryApi.ResetPassword.url,
                data: { email, otp: otp.join(''), newPassword, confirmPassword }
            });
            if (res.data.success) {
                setToast({ show: true, message: res.data.message, type: 'success' });
                setTimeout(() => window.location.href = '/login', 2000);
            }
        } catch (err) {
            setToast({ show: true, message: err.response?.data?.message || 'Password reset failed', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-blue-950 px-4 sm:px-6 lg:px-8">
            <div className="text-center w-full">
                <div className="mb-6">
                    <div className="w-12 h-12 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                        <IoFingerPrintSharp className='h-10 w-10 font-teal-500'/>
                    </div>
                    <h2 className="text-2xl font-bold text-white mt-4">Forgot Password</h2>
                    <p className="text-gray-300">Reset your password</p>
                </div>
                {step === 1 ? (
                    <form onSubmit={handleEmailSubmit} className="w-full">
                        <div className="mb-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-64 p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-64 bg-white text-gray-800 font-semibold p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            Send OTP
                        </button>
                    </form>
                ) : step === 2 ? (
                    <form className="w-full">
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
                    </form>
                ) : (
                    <form onSubmit={handleResetSubmit} className="w-full">
                        <div className="mb-4 relative w-64 mx-auto">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                                className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                            >
                                {showNewPassword ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="mb-4 text-left text-sm text-gray-300 w-64 mx-auto">
                            <p className={passwordValidation.hasUpperCase ? 'text-green-400' : ''}>
                                • At least one uppercase letter
                            </p>
                            <p className={passwordValidation.hasNumber ? 'text-green-400' : ''}>
                                • At least one number
                            </p>
                            <p className={passwordValidation.hasSpecialChar ? 'text-green-400' : ''}>
                                • At least one special character
                            </p>
                        </div>
                        <div className="mb-4 relative w-64 mx-auto">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                            >
                                {showConfirmPassword ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-64 bg-white text-gray-800 font-semibold p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            Reset Password
                        </button>
                    </form>
                )}
                {!(isOtpValid === true) && (
                    <p className="mt-4 text-gray-300">
                        <a href="/login" className="text-gray-300 hover:underline">Back to Login</a>
                    </p>
                )}
                {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />}
            </div>
        </div>
    );
};

export default ForgotPassword;