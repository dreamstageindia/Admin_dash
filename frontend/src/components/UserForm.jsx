// frontend/src/components/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { FaChevronDown, FaChevronUp, FaSave, FaTimes } from 'react-icons/fa';

const USER_ROLES = [
    "Artists/Coaches/Educators/Guides/Experts/Creators",
    "Event-Curator",
    "Venue-Owner",
    "Artist-Manager",
    "Artist-Curator",
    "Equipment-Owner",
    "Community-Owner/Club-Owner/Promotor",
    "Artist Crew",
    "Event Crew",
    "Art School",
    "Art Lover"
];

const PRONOUNS = [
    "he/him",
    "she/her",
    "they/them",
    "prefer-not-to-say"
];

const UserForm = ({ open, onClose, userData, mode = 'create', onSuccess }) => {
    const [formData, setFormData] = useState({
        phoneNumber: '',
        name: '',
        email: '',
        pronouns: '',
        dob: '',
        roles: [],
        artistType: '',
        performanceType: '',
        stageName: '',
        epkManagementType: '',
        isVerified: false,
        hasCompletedOnboarding: false,
        dashboardTourSeen: false,
        role: 'artist'
    });

    const [membership, setMembership] = useState({
        status: '',
        startedAt: '',
        validTill: '',
        amount: '',
        lastOrderId: '',
        lastPaymentId: '',
        joinOrder: '',
        creator: { code: '', number: '' }
    });

    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        profile: true,
        membership: false
    });

    const [selectedRoles, setSelectedRoles] = useState([]);
    const [roleInput, setRoleInput] = useState('');

    useEffect(() => {
        if (userData) {
            setFormData({
                phoneNumber: userData.phoneNumber || '',
                name: userData.name || '',
                email: userData.email || '',
                pronouns: userData.pronouns || '',
                dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : '',
                roles: userData.roles || [],
                artistType: userData.artistType || '',
                performanceType: userData.performanceType || '',
                stageName: userData.stageName || '',
                epkManagementType: userData.epkManagementType || '',
                isVerified: userData.isVerified || false,
                hasCompletedOnboarding: userData.hasCompletedOnboarding || false,
                dashboardTourSeen: userData.dashboardTourSeen || false,
                role: userData.role || 'artist'
            });

            setSelectedRoles(userData.roles || []);

            if (userData.membership) {
                setMembership({
                    status: userData.membership.status || '',
                    startedAt: userData.membership.startedAt 
                        ? new Date(userData.membership.startedAt).toISOString().split('T')[0] 
                        : '',
                    validTill: userData.membership.validTill 
                        ? new Date(userData.membership.validTill).toISOString().split('T')[0] 
                        : '',
                    amount: userData.membership.amount || '',
                    lastOrderId: userData.membership.lastOrderId || '',
                    lastPaymentId: userData.membership.lastPaymentId || '',
                    joinOrder: userData.membership.joinOrder || '',
                    creator: {
                        code: userData.membership.creator?.code || '',
                        number: userData.membership.creator?.number || ''
                    }
                });
            }
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleMembershipChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setMembership(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setMembership(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleRoleSelect = (role) => {
        if (!selectedRoles.includes(role)) {
            setSelectedRoles([...selectedRoles, role]);
            setFormData(prev => ({
                ...prev,
                roles: [...selectedRoles, role]
            }));
        }
        setRoleInput('');
    };

    const removeRole = (roleToRemove) => {
        const newRoles = selectedRoles.filter(role => role !== roleToRemove);
        setSelectedRoles(newRoles);
        setFormData(prev => ({
            ...prev,
            roles: newRoles
        }));
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleSubmit = async () => {
        try {
            const dataToSubmit = {
                ...formData,
                roles: selectedRoles,
                membership: {
                    ...membership,
                    startedAt: membership.startedAt ? new Date(membership.startedAt) : null,
                    validTill: membership.validTill ? new Date(membership.validTill) : null,
                    amount: membership.amount ? Number(membership.amount) : null,
                    joinOrder: membership.joinOrder ? Number(membership.joinOrder) : null,
                    creator: {
                        ...membership.creator,
                        number: membership.creator.number ? Number(membership.creator.number) : null
                    }
                },
                dob: formData.dob ? new Date(formData.dob) : null
            };

            if (mode === 'create') {
                await userService.createUser(dataToSubmit);
            } else {
                await userService.updateUser(userData._id, dataToSubmit);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user: ' + error.message);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">
                            {mode === 'create' ? 'Create New User' : 'Edit User'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <FaTimes className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6">
                    {/* Basic Information Section */}
                    <div className="mb-6">
                        <div 
                            className="flex justify-between items-center cursor-pointer mb-4"
                            onClick={() => toggleSection('basic')}
                        >
                            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                            <span className="text-gray-500">
                                {expandedSections.basic ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                        </div>
                        
                        {expandedSections.basic && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pronouns
                                    </label>
                                    <select
                                        name="pronouns"
                                        value={formData.pronouns}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select pronouns</option>
                                        {PRONOUNS.map(pronoun => (
                                            <option key={pronoun} value={pronoun}>
                                                {pronoun}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        User Role
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="artist">Artist</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Roles
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {selectedRoles.map((role, index) => (
                                            <div 
                                                key={index} 
                                                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                            >
                                                {role}
                                                <button
                                                    type="button"
                                                    onClick={() => removeRole(role)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={roleInput}
                                            onChange={(e) => setRoleInput(e.target.value)}
                                            placeholder="Type to add roles..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && roleInput.trim()) {
                                                    e.preventDefault();
                                                    handleRoleSelect(roleInput.trim());
                                                }
                                            }}
                                        />
                                        {roleInput && (
                                            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                                                {USER_ROLES
                                                    .filter(role => 
                                                        role.toLowerCase().includes(roleInput.toLowerCase()) && 
                                                        !selectedRoles.includes(role)
                                                    )
                                                    .map((role, index) => (
                                                        <div
                                                            key={index}
                                                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                                                            onClick={() => handleRoleSelect(role)}
                                                        >
                                                            {role}
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Information Section */}
                    <div className="mb-6">
                        <div 
                            className="flex justify-between items-center cursor-pointer mb-4"
                            onClick={() => toggleSection('profile')}
                        >
                            <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
                            <span className="text-gray-500">
                                {expandedSections.profile ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                        </div>
                        
                        {expandedSections.profile && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Artist Type
                                    </label>
                                    <input
                                        type="text"
                                        name="artistType"
                                        value={formData.artistType}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Performance Type
                                    </label>
                                    <input
                                        type="text"
                                        name="performanceType"
                                        value={formData.performanceType}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stage Name
                                    </label>
                                    <input
                                        type="text"
                                        name="stageName"
                                        value={formData.stageName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        EPK Management Type
                                    </label>
                                    <input
                                        type="text"
                                        name="epkManagementType"
                                        value={formData.epkManagementType}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Membership Information Section */}
                    <div className="mb-6">
                        <div 
                            className="flex justify-between items-center cursor-pointer mb-4"
                            onClick={() => toggleSection('membership')}
                        >
                            <h3 className="text-lg font-semibold text-gray-800">Membership Information</h3>
                            <span className="text-gray-500">
                                {expandedSections.membership ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                        </div>
                        
                        {expandedSections.membership && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Membership Status
                                    </label>
                                    <input
                                        type="text"
                                        name="status"
                                        value={membership.status}
                                        onChange={handleMembershipChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Membership Amount
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={membership.amount}
                                        onChange={handleMembershipChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Started At
                                    </label>
                                    <input
                                        type="date"
                                        name="startedAt"
                                        value={membership.startedAt}
                                        onChange={handleMembershipChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valid Till
                                    </label>
                                    <input
                                        type="date"
                                        name="validTill"
                                        value={membership.validTill}
                                        onChange={handleMembershipChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Order ID
                                    </label>
                                    <input
                                        type="text"
                                        name="lastOrderId"
                                        value={membership.lastOrderId}
                                        onChange={handleMembershipChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Payment ID
                                    </label>
                                    <input
                                        type="text"
                                        name="lastPaymentId"
                                        value={membership.lastPaymentId}
                                        onChange={handleMembershipChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Join Order
                                    </label>
                                    <input
                                        type="number"
                                        name="joinOrder"
                                        value={membership.joinOrder}
                                        onChange={handleMembershipChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Creator Code
                                    </label>
                                    <input
                                        type="text"
                                        name="creator.code"
                                        value={membership.creator.code}
                                        onChange={handleMembershipChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Creator Number
                                    </label>
                                    <input
                                        type="number"
                                        name="creator.number"
                                        value={membership.creator.number}
                                        onChange={handleMembershipChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status Flags */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Flags</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.isVerified}
                                    onChange={handleChange}
                                    name="isVerified"
                                    className="h-4 w-4 text-blue-600 rounded"
                                />
                                <span className="ml-2 text-gray-700">Verified</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.hasCompletedOnboarding}
                                    onChange={handleChange}
                                    name="hasCompletedOnboarding"
                                    className="h-4 w-4 text-blue-600 rounded"
                                />
                                <span className="ml-2 text-gray-700">Completed Onboarding</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.dashboardTourSeen}
                                    onChange={handleChange}
                                    name="dashboardTourSeen"
                                    className="h-4 w-4 text-blue-600 rounded"
                                />
                                <span className="ml-2 text-gray-700">Dashboard Tour Seen</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t px-6 py-4">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <FaSave />
                            {mode === 'create' ? 'Create User' : 'Update User'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserForm;