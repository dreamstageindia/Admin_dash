// frontend/src/components/UserTable.jsx
import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaSync,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCrown,
  FaUserCheck,
  FaUserClock
} from 'react-icons/fa';

const UserTable = ({ onEdit, onView, onRefresh }) => {
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(100);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit,
                search,
                sortBy,
                sortOrder
            };
            const response = await userService.getAllUsers(params);
            setUsers(response.data);
            setTotalPages(response.pagination.pages);
            setTotalUsers(response.pagination.total);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Error fetching users: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit, search, sortBy, sortOrder]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const newSelected = users.map((user) => user._id);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleSelect = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(item => item !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selected.length} users?`)) {
            try {
                await userService.bulkDeleteUsers(selected);
                setSelected([]);
                fetchUsers();
                onRefresh && onRefresh();
            } catch (error) {
                console.error('Error deleting users:', error);
                alert('Error deleting users: ' + error.message);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getSortIcon = (column) => {
        if (sortBy !== column) return <FaSort className="ml-1 text-gray-400" />;
        return sortOrder === 'asc' 
            ? <FaSortUp className="ml-1 text-blue-600" />
            : <FaSortDown className="ml-1 text-blue-600" />;
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const getMembershipBadge = (membership) => {
        if (!membership || !membership.status) {
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    No Membership
                </span>
            );
        }

        const status = membership.status.toLowerCase();
        let color = 'gray';
        let icon = null;

        if (status.includes('active')) {
            color = 'green';
            icon = <FaUserCheck className="mr-1" />;
        } else if (status.includes('inactive') || status.includes('expired')) {
            color = 'red';
            icon = <FaUserClock className="mr-1" />;
        } else if (status.includes('premium') || status.includes('vip')) {
            color = 'purple';
            icon = <FaCrown className="mr-1" />;
        }

        return (
            <span className={`px-2 py-1 text-xs rounded-full flex items-center bg-${color}-100 text-${color}-800`}>
                {icon}
                {membership.status}
                {membership.amount && (
                    <span className="ml-1 font-semibold">₹{membership.amount/100}</span>
                )}
            </span>
        );
    };

    return (
        <div className="w-full">
            {/* Filters and Search */}
            <div className="flex flex-wrap gap-2 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="createdAt">Created Date</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="phoneNumber">Phone</option>
                    <option value="membership.status">Membership</option>
                </select>
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                >
                    <option value="100">100 per page</option>
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                </select>
                <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <FaSync /> Refresh
                </button>
            </div>

            {/* Bulk Actions */}
            {selected.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-yellow-800">
                            {selected.length} user(s) selected
                        </span>
                        <button
                            onClick={handleBulkDelete}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
                        >
                            <FaTrash /> Delete Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={users.length > 0 && selected.length === users.length}
                                        className="h-4 w-4 text-blue-600 rounded"
                                    />
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center">
                                        Name
                                        {getSortIcon('name')}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('phoneNumber')}
                                >
                                    <div className="flex items-center">
                                        Phone
                                        {getSortIcon('phoneNumber')}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center">
                                        Email
                                        {getSortIcon('email')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Verified
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Membership
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('createdAt')}
                                >
                                    <div className="flex items-center">
                                        Created
                                        {getSortIcon('createdAt')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(user._id)}
                                                onChange={() => handleSelect(user._id)}
                                                className="h-4 w-4 text-blue-600 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {user.name || 'N/A'}
                                                </div>
                                                {user.stageName && (
                                                    <div className="text-sm text-gray-500">
                                                        Stage: {user.stageName}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                            {user.phoneNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                            {user.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                user.role === 'artist' 
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-purple-100 text-purple-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                user.isVerified 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {user.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getMembershipBadge(user.membership)}
                                            {user.membership?.validTill && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Valid till: {formatDate(user.membership.validTill)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onView(user)}
                                                    className="p-1 text-blue-600 hover:text-blue-800"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => onEdit(user)}
                                                    className="p-1 text-green-600 hover:text-green-800"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm('Are you sure you want to delete this user?')) {
                                                            try {
                                                                await userService.deleteUser(user._id);
                                                                fetchUsers();
                                                                onRefresh && onRefresh();
                                                            } catch (error) {
                                                                console.error('Error deleting user:', error);
                                                                alert('Error deleting user: ' + error.message);
                                                            }
                                                        }
                                                    }}
                                                    className="p-1 text-red-600 hover:text-red-800"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                <div className="text-sm text-gray-600">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalUsers)} of {totalUsers} users
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className={`px-3 py-1 rounded-lg ${
                            page === 1 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (page <= 3) {
                            pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = page - 2 + i;
                        }
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-3 py-1 rounded-lg ${
                                    page === pageNum
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className={`px-3 py-1 rounded-lg ${
                            page === totalPages 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;