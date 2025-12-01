'use client'

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Manage Users', href: '/manage-users' },
        { name: 'Manage EPKs', href: '/manage-epks' },
    ];

    return (
        <header className="bg-gradient-to-br from-blue-900 to-teal-700">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                {/* Logo */}
                <div className="flex">
                    <a href="#" className="flex items-center">
                        <img
                            alt="DREAM STAGE"
                            src="https://app.dreamstage.tech/src/assets/logo.png"
                            className="h-8 w-auto"
                        />
                        <span className="ml-3 text-lg font-bold text-white">DREAM STAGE</span>
                    </a>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:items-center lg:gap-x-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-semibold text-white hover:text-gray-300 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="text-sm font-semibold text-white hover:text-gray-300 transition-colors"
                        >
                            Logout
                        </button>
                    ) : (
                        <a
                            href="/login"
                            className="text-sm font-semibold text-white hover:text-gray-300 transition-colors"
                        >
                            Log in →
                        </a>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="inline-flex items-center justify-center p-2 text-white hover:text-gray-300"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-gradient-to-br from-blue-900 to-teal-700">
                    <div className="flex items-center justify-between p-6">
                        <a href="#" className="flex items-center">
                            <img
                                alt="Your Company"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-8 w-auto"
                            />
                            <span className="ml-3 text-lg font-bold text-white">Your Company</span>
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 text-white hover:text-gray-300"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center space-y-6 py-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-lg font-semibold text-white hover:text-gray-300 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="text-lg font-semibold text-white hover:text-gray-300 transition-colors"
                            >
                                Logout
                            </button>
                        ) : (
                            <a
                                href="/login"
                                className="text-lg font-semibold text-white hover:text-gray-300 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Log in →
                            </a>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;