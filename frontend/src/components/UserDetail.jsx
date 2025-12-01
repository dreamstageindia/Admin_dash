// frontend/src/components/UserDetail.jsx
import React from 'react';
import { 
    FaUser, 
    FaPhone, 
    FaEnvelope, 
    FaCalendar, 
    FaCheckCircle, 
    FaTimesCircle,
    FaBriefcase,
    FaTag,
    FaCertificate,
    FaIdCard,
    FaMoneyBill,
    FaReceipt,
    FaHashtag,
    FaCrown,
    FaUserCheck,
    FaUserClock,
    FaRupeeSign
} from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const UserDetail = ({ open, onClose, user }) => {
    if (!open || !user) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return `₹${amount/100}`;
    };

    const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
        <div className={`flex items-start mb-3 ${className}`}>
            <Icon className="mt-1 mr-3 text-gray-400 flex-shrink-0" />
            <div>
                <div className="text-sm text-gray-500">{label}</div>
                <div className="text-gray-800">{value || 'N/A'}</div>
            </div>
        </div>
    );

    const MembershipStatusBadge = ({ membership }) => {
        if (!membership || !membership.status) {
            return (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    No Membership
                </span>
            );
        }

        const status = membership.status.toLowerCase();
        let color = 'gray';
        let icon = <FaUserClock />;

        if (status.includes('active')) {
            color = 'green';
            icon = <FaUserCheck />;
        } else if (status.includes('inactive') || status.includes('expired')) {
            color = 'red';
            icon = <FaTimesCircle />;
        } else if (status.includes('premium') || status.includes('vip')) {
            color = 'purple';
            icon = <FaCrown />;
        }

        return (
            <span className={`px-3 py-1 bg-${color}-100 text-${color}-800 rounded-full text-sm font-medium flex items-center gap-1`}>
                {icon}
                {membership.status}
                {membership.amount && (
                    <span className="ml-1 font-bold">{formatCurrency(membership.amount)}</span>
                )}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {user.name || user.phoneNumber}
                            </h2>
                            <p className="text-sm text-gray-600">User Details</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <MembershipStatusBadge membership={user.membership} />
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <MdClose className="text-gray-500 text-xl" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Column 1 - Basic Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information Card */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaUser className="mr-2" />
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem icon={FaUser} label="Name" value={user.name} />
                                    <InfoItem icon={FaPhone} label="Phone" value={user.phoneNumber} />
                                    <InfoItem icon={FaEnvelope} label="Email" value={user.email} />
                                    <InfoItem icon={FaBriefcase} label="Role" value={user.role} />
                                    <InfoItem icon={FaCalendar} label="Date of Birth" value={user.dob ? formatDate(user.dob) : 'N/A'} />
                                    <div className="flex items-start">
                                        <FaTag className="mt-1 mr-3 text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-500">Pronouns</div>
                                            <div className="text-gray-800">{user.pronouns || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Information Card */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Profile Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem icon={FaBriefcase} label="Artist Type" value={user.artistType} />
                                    <InfoItem icon={FaBriefcase} label="Performance Type" value={user.performanceType} />
                                    <InfoItem icon={FaUser} label="Stage Name" value={user.stageName} />
                                    <InfoItem icon={FaBriefcase} label="EPK Management" value={user.epkManagementType} />
                                </div>
                            </div>

                            {/* Status Card */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                                        <div className="text-sm text-gray-500 mb-2">Verification</div>
                                        {user.isVerified ? (
                                            <div className="flex items-center text-green-600">
                                                <FaCheckCircle className="mr-2" />
                                                <span className="font-medium">Verified</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-yellow-600">
                                                <FaTimesCircle className="mr-2" />
                                                <span className="font-medium">Pending</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                                        <div className="text-sm text-gray-500 mb-2">Onboarding</div>
                                        {user.hasCompletedOnboarding ? (
                                            <div className="flex items-center text-green-600">
                                                <FaCheckCircle className="mr-2" />
                                                <span className="font-medium">Completed</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-yellow-600">
                                                <FaTimesCircle className="mr-2" />
                                                <span className="font-medium">Pending</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                                        <div className="text-sm text-gray-500 mb-2">Dashboard Tour</div>
                                        {user.dashboardTourSeen ? (
                                            <div className="flex items-center text-green-600">
                                                <FaCheckCircle className="mr-2" />
                                                <span className="font-medium">Seen</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-yellow-600">
                                                <FaTimesCircle className="mr-2" />
                                                <span className="font-medium">Not Seen</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2 - Additional Info */}
                        <div className="space-y-6">
                            {/* Roles Card */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Roles</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.roles?.map((role, index) => (
                                        <span 
                                            key={index} 
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                    {(!user.roles || user.roles.length === 0) && (
                                        <span className="text-gray-500">No roles assigned</span>
                                    )}
                                </div>
                            </div>

                            {/* Timestamps Card */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Timestamps</h3>
                                <InfoItem icon={FaCalendar} label="Created" value={formatDate(user.createdAt)} />
                                <InfoItem icon={FaCalendar} label="Updated" value={formatDate(user.updatedAt)} />
                            </div>

                            {/* Creator Info (if exists) */}
                            {user.membership?.creator && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <FaIdCard className="mr-2" />
                                        Creator Information
                                    </h3>
                                    <InfoItem 
                                        icon={FaHashtag} 
                                        label="Creator Code" 
                                        value={user.membership.creator.code} 
                                    />
                                    <InfoItem 
                                        icon={FaHashtag} 
                                        label="Creator Number" 
                                        value={user.membership.creator.number} 
                                    />
                                    {user.membership.joinOrder && (
                                        <InfoItem 
                                            icon={FaHashtag} 
                                            label="Join Order" 
                                            value={user.membership.joinOrder} 
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Membership Details Section */}
                    {user.membership && (
                        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaCertificate className="mr-2" />
                                Membership Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-2">
                                        <FaMoneyBill className="text-green-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Amount</span>
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">
                                        {user.membership.amount ? `₹${user.membership.amount/100}` : 'N/A'}
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-2">
                                        <FaCalendar className="text-blue-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Started At</span>
                                    </div>
                                    <div className="text-gray-900">
                                        {user.membership.startedAt ? formatDate(user.membership.startedAt) : 'N/A'}
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-2">
                                        <FaCalendar className="text-orange-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Valid Till</span>
                                    </div>
                                    <div className="text-gray-900">
                                        {user.membership.validTill ? formatDate(user.membership.validTill) : 'N/A'}
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-2">
                                        <FaReceipt className="text-purple-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Status</span>
                                    </div>
                                    <div className={`font-medium ${
                                        user.membership.status?.toLowerCase().includes('active') 
                                            ? 'text-green-600' 
                                            : user.membership.status?.toLowerCase().includes('expired')
                                            ? 'text-red-600'
                                            : 'text-gray-600'
                                    }`}>
                                        {user.membership.status || 'N/A'}
                                    </div>
                                </div>

                                {user.membership.lastOrderId && (
                                    <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2">
                                        <div className="flex items-center mb-2">
                                            <FaIdCard className="text-indigo-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-700">Last Order ID</span>
                                        </div>
                                        <div className="font-mono text-gray-900">
                                            {user.membership.lastOrderId}
                                        </div>
                                    </div>
                                )}

                                {user.membership.lastPaymentId && (
                                    <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2">
                                        <div className="flex items-center mb-2">
                                            <FaReceipt className="text-teal-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-700">Last Payment ID</span>
                                        </div>
                                        <div className="font-mono text-gray-900">
                                            {user.membership.lastPaymentId}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Membership Notes */}
                            {user.membership.notes && (
                                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center mb-2">
                                        <FaTag className="text-gray-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Notes</span>
                                    </div>
                                    <div className="text-gray-900">
                                        {user.membership.notes}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t px-6 py-4">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;