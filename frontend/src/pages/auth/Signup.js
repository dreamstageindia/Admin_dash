import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SummaryApi from '../../common';
import Toast from '../../components/Toast';
import { IoFingerPrintSharp } from 'react-icons/io5';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', organization: '', organizationSize: '', role: '', phone: '', email: '', password: '', confirmPassword: ''
    });
    const [currentStep, setCurrentStep] = useState(1);
    const [currentField, setCurrentField] = useState(1); // Tracks the current field within the step
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    // AI-like prompts for each field
    const prompts = {
        1: {
            1: "Hi! Let's start with your name. What's it going to be?",
            2: "Great! Now,What kind of artist?",
            3: "Nice! Wh?",
            4: "Awesome! What's your role there?"
        },
        2: {
            1: "Cool, let's get your contact details. What's your phone number?",
            2: "Almost there! What's your email address?"
        },
        3: {
            1: "Time to secure your account. Please enter a password.",
            2: "One last step! Can you confirm your password?"
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateIndianPhoneNumber = (phone) => {
        const indianPhoneRegex = /^[6-9]\d{9}$/;
        return indianPhoneRegex.test(phone);
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return { hasUpperCase, hasNumber, hasSpecialChar };
    };

    const passwordValidation = validatePassword(formData.password);

    const handleNext = () => {
        const fieldsInStep = {
            1: ['name', 'organization', 'organizationSize', 'role'],
            2: ['phone', 'email'],
            3: ['password', 'confirmPassword']
        };

        const currentFields = fieldsInStep[currentStep];
        const currentFieldName = currentFields[currentField - 1];

        if (!formData[currentFieldName]) {
            setToast({ show: true, message: 'Please fill in this field', type: 'error' });
            return;
        }

        if (currentStep === 2 && currentField === 1 && !validateIndianPhoneNumber(formData.phone)) {
            setToast({ show: true, message: 'Please enter a valid 10-digit Indian phone number (starting with 6, 7, 8, or 9)', type: 'error' });
            return;
        }

        if (currentStep === 3 && currentField === 1) {
            const { hasUpperCase, hasNumber, hasSpecialChar } = validatePassword(formData.password);
            if (!hasUpperCase || !hasNumber || !hasSpecialChar) {
                setToast({ show: true, message: 'Password must contain at least one uppercase letter, number, and special character', type: 'error' });
                return;
            }
        }

        if (currentStep === 3 && currentField === 2 && formData.password !== formData.confirmPassword) {
            setToast({ show: true, message: 'Passwords do not match', type: 'error' });
            return;
        }

        if (currentField < currentFields.length) {
            setCurrentField(currentField + 1);
        } else {
            if (currentStep < 3) {
                setCurrentStep(currentStep + 1);
                setCurrentField(1);
            } else {
                handleSubmit();
            }
        }
    };

    const handleBack = () => {
        if (currentField > 1) {
            setCurrentField(currentField - 1);
        } else if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setCurrentField(Object.keys(prompts[currentStep - 1]).length);
        }
    };

    const handleSubmit = async () => {
        try {
            const res = await axios({
                method: SummaryApi.Signup.method,
                url: SummaryApi.Signup.url,
                data: formData
            });
            if (res.data.success) {
                setToast({ show: true, message: res.data.message, type: 'success' });
                setTimeout(() => navigate('/verify-email', { state: { email: formData.email } }), 2000);
            }
        } catch (err) {
            setToast({ show: true, message: err.response?.data?.message || 'Signup failed', type: 'error' });
        }
    };

    const renderInput = () => {
        const fieldMap = {
            1: [
                { name: 'name', type: 'text', placeholder: 'Your Name' },
                { name: 'organization', type: 'text', placeholder: 'Your Organization' },
                { name: 'organizationSize', type: 'text', placeholder: 'e.g., Small, Medium, Large' },
                { name: 'role', type: 'text', placeholder: 'Your Role' }
            ],
            2: [
                { name: 'phone', type: 'tel', placeholder: 'Phone Number', pattern: '[6-9][0-9]{9}', title: 'Please enter a valid 10-digit Indian phone number' },
                { name: 'email', type: 'email', placeholder: 'Email Address' }
            ],
            3: [
                { name: 'password', type: showPassword ? 'text' : 'password', placeholder: 'Password' },
                { name: 'confirmPassword', type: showConfirmPassword ? 'text' : 'password', placeholder: 'Confirm Password' }
            ]
        };

        const field = fieldMap[currentStep][currentField - 1];
        return (
            <div className="relative w-full max-w-md">
                <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    pattern={field.pattern}
                    title={field.title}
                />
                {(field.name === 'password' || field.name === 'confirmPassword') && (
                    <button
                        type="button"
                        onClick={() => field.name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                        {((field.name === 'password' && showPassword) || (field.name === 'confirmPassword' && showConfirmPassword)) ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        )}
                    </button>
                )}
                {field.name === 'password' && (
                    <div className="mt-2 text-left text-sm text-gray-300">
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
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-blue-950 px-4 sm:px-6 lg:px-8">
            <div className="text-center w-full max-w-lg">
                <div className="mb-6">
                    <div className="w-12 h-12 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                        <IoFingerPrintSharp className="h-10 w-10 text-teal-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mt-4">Let's create your account!</h2>
                    <p className="text-gray-300">Step {currentStep} of 3</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-md mb-4 p-4 bg-gray-800 rounded-lg text-white text-left">
                        <p className="animate-pulse">{prompts[currentStep][currentField]}</p>
                    </div>
                    {renderInput()}
                    <div className="flex w-full max-w-md justify-between mt-6">
                        {!(currentStep === 1 && currentField === 1) && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="w-[48%] bg-gray-500 text-white font-semibold p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                Back
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleNext}
                            className={`w-${currentStep === 1 && currentField === 1 ? 'full' : '[48%]'} bg-white text-gray-800 font-semibold p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300`}
                        >
                            {currentStep === 3 && currentField === 2 ? 'Sign Up' : 'Next'}
                        </button>
                    </div>
                </div>
                <p className="mt-4 text-gray-300">
                    Already have an account? <a href="/login" className="text-gray-300 hover:underline">Login</a>
                </p>
                {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />}
            </div>
        </div>
    );
};

export default Signup;