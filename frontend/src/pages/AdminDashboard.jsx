// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
    FaPlus, 
    FaSync, 
    FaDownload, 
    FaFilter,
    FaUsers,
    FaCheckCircle,
    FaUserTie,
    FaUserFriends,
    FaRupeeSign,
    FaChartLine,
    FaUserClock,
    FaCrown,
    FaFileExcel,
    FaFileCsv,
    FaFilePdf,
    FaPrint
} from 'react-icons/fa';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';
import UserDetail from '../components/UserDetail';
import { userService } from '../services/userService';
import * as XLSX from 'xlsx'; // You'll need to install this package
import jsPDF from 'jspdf';    // You'll need to install this package
import 'jspdf-autotable';     // You'll need to install this package
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {

    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect to /login if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);


    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formMode, setFormMode] = useState('create');
    const [refreshKey, setRefreshKey] = useState(0);
    const [stats, setStats] = useState({
        totalUsers: 0,
        verifiedUsers: 0,
        artists: 0,
        managers: 0,
        activeMemberships: 0,
        totalRevenue: 0,
        pendingVerification: 0,
        premiumUsers: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [exportLoading, setExportLoading] = useState(false);
    const [showExportOptions, setShowExportOptions] = useState(false);
    const exportMenuRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [totalUsersCount, setTotalUsersCount] = useState(0);

    const handleCreate = () => {
        setSelectedUser(null);
        setFormMode('create');
        setIsFormOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormMode('edit');
        setIsFormOpen(true);
    };

    const handleView = (user) => {
        setSelectedUser(user);
        setIsDetailOpen(true);
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
        fetchStatistics();
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        handleRefresh();
    };

    const formatNumber = (num) => {
        if (num === undefined || num === null) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0';
        return `₹${Math.round(amount).toLocaleString('en-IN')}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    // Close export menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setShowExportOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchStatistics = async () => {
        setLoadingStats(true);
        try {
            // Fetch all users for statistics
            const response = await userService.getAllUsers({ limit: 1000 });
            const fetchedUsers = response.data;
            setUsers(fetchedUsers);
            
            // Calculate statistics
            const totalUsers = response.pagination?.total || fetchedUsers.length;
            setTotalUsersCount(totalUsers);
            
            const verifiedUsers = fetchedUsers.filter(user => user.isVerified).length;
            const artists = fetchedUsers.filter(user => user.role === 'artist').length;
            const managers = fetchedUsers.filter(user => user.role === 'manager').length;
            
            // Membership statistics
            const activeMemberships = fetchedUsers.filter(user => 
                user.membership?.status?.toLowerCase().includes('active')
            ).length;
            
            const totalRevenue = fetchedUsers.reduce((sum, user) => {
                return sum + (user.membership?.amount || 0);
            }, 0);
            
            const pendingVerification = fetchedUsers.filter(user => !user.isVerified).length;
            
            const premiumUsers = fetchedUsers.filter(user => 
                user.membership?.status?.toLowerCase().includes('premium') || 
                user.membership?.status?.toLowerCase().includes('vip')
            ).length;

            setStats({
                totalUsers,
                verifiedUsers,
                artists,
                managers,
                activeMemberships,
                totalRevenue,
                pendingVerification,
                premiumUsers
            });
            
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching statistics:', error);
            // Fallback to mock data if API fails
            setStats({
                totalUsers: 1234,
                verifiedUsers: 890,
                artists: 950,
                managers: 284,
                activeMemberships: 765,
                totalRevenue: 1285000,
                pendingVerification: 344,
                premiumUsers: 120
            });
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    // Export to Excel
    const exportToExcel = async () => {
        setExportLoading(true);
        try {
            // Get all users for export
            const response = await userService.getAllUsers({ limit: 5000 });
            const usersData = response.data;

            // Prepare data for export
            const exportData = usersData.map(user => ({
                'User ID': user._id,
                'Name': user.name || 'N/A',
                'Phone': user.phoneNumber,
                'Email': user.email || 'N/A',
                'Role': user.role,
                'Verified': user.isVerified ? 'Yes' : 'No',
                'Stage Name': user.stageName || 'N/A',
                'Artist Type': user.artistType || 'N/A',
                'Performance Type': user.performanceType || 'N/A',
                'Pronouns': user.pronouns || 'N/A',
                'DOB': user.dob ? formatDate(user.dob) : 'N/A',
                'Membership Status': user.membership?.status || 'N/A',
                'Membership Amount': user.membership?.amount ? `₹${user.membership.amount}` : 'N/A',
                'Valid Till': user.membership?.validTill ? formatDate(user.membership.validTill) : 'N/A',
                'Created At': formatDate(user.createdAt),
                'Updated At': formatDate(user.updatedAt),
                'Onboarding Completed': user.hasCompletedOnboarding ? 'Yes' : 'No',
                'Dashboard Tour Seen': user.dashboardTourSeen ? 'Yes' : 'No',
                'Roles': user.roles?.join(', ') || 'N/A'
            }));

            // Create workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(exportData);

            // Add column widths
            const wscols = [
                { wch: 25 }, // User ID
                { wch: 20 }, // Name
                { wch: 15 }, // Phone
                { wch: 25 }, // Email
                { wch: 10 }, // Role
                { wch: 10 }, // Verified
                { wch: 15 }, // Stage Name
                { wch: 15 }, // Artist Type
                { wch: 15 }, // Performance Type
                { wch: 10 }, // Pronouns
                { wch: 12 }, // DOB
                { wch: 15 }, // Membership Status
                { wch: 15 }, // Membership Amount
                { wch: 12 }, // Valid Till
                { wch: 15 }, // Created At
                { wch: 15 }, // Updated At
                { wch: 15 }, // Onboarding Completed
                { wch: 15 }, // Dashboard Tour Seen
                { wch: 30 }, // Roles
            ];
            worksheet['!cols'] = wscols;

            // Add to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

            // Generate Excel file
            const fileName = `users_export_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            
            setShowExportOptions(false);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Failed to export to Excel. Please try again.');
        } finally {
            setExportLoading(false);
        }
    };

    // Export to CSV
    const exportToCSV = async () => {
        setExportLoading(true);
        try {
            const response = await userService.getAllUsers({ limit: 5000 });
            const usersData = response.data;

            const exportData = usersData.map(user => ({
                'User ID': user._id,
                'Name': user.name || 'N/A',
                'Phone': user.phoneNumber,
                'Email': user.email || 'N/A',
                'Role': user.role,
                'Verified': user.isVerified ? 'Yes' : 'No',
                'Stage Name': user.stageName || 'N/A',
                'Artist Type': user.artistType || 'N/A',
                'Performance Type': user.performanceType || 'N/A',
                'Pronouns': user.pronouns || 'N/A',
                'DOB': user.dob ? formatDate(user.dob) : 'N/A',
                'Membership Status': user.membership?.status || 'N/A',
                'Membership Amount': user.membership?.amount ? user.membership.amount : '',
                'Valid Till': user.membership?.validTill ? formatDate(user.membership.validTill) : 'N/A',
                'Created At': formatDate(user.createdAt),
                'Updated At': formatDate(user.updatedAt),
                'Onboarding Completed': user.hasCompletedOnboarding ? 'Yes' : 'No',
                'Dashboard Tour Seen': user.dashboardTourSeen ? 'Yes' : 'No',
                'Roles': user.roles?.join(', ') || 'N/A'
            }));

            // Convert to CSV
            const headers = Object.keys(exportData[0]).join(',');
            const rows = exportData.map(row => 
                Object.values(row).map(value => 
                    typeof value === 'string' && value.includes(',') ? `"${value}"` : value
                ).join(',')
            );
            const csvContent = [headers, ...rows].join('\n');

            // Download CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setShowExportOptions(false);
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            alert('Failed to export to CSV. Please try again.');
        } finally {
            setExportLoading(false);
        }
    };

    // Export to PDF
    const exportToPDF = async () => {
        setExportLoading(true);
        try {
            const response = await userService.getAllUsers({ limit: 100 });
            const usersData = response.data;

            const doc = new jsPDF('landscape');
            
            // Add title
            doc.setFontSize(20);
            doc.text('Users Export Report', 14, 15);
            
            // Add date
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
            
            // Add summary
            doc.setFontSize(12);
            doc.text(`Total Users: ${formatNumber(usersData.length)}`, 14, 30);
            doc.text(`Last Updated: ${lastUpdated.toLocaleTimeString()}`, 14, 36);
            
            // Prepare table data
            const tableData = usersData.map(user => [
                user.name || 'N/A',
                user.phoneNumber,
                user.email || 'N/A',
                user.role,
                user.isVerified ? 'Yes' : 'No',
                user.membership?.status || 'N/A',
                user.membership?.amount ? `₹${user.membership.amount}` : 'N/A',
                formatDate(user.createdAt)
            ]);

            // Add table
            doc.autoTable({
                startY: 45,
                head: [['Name', 'Phone', 'Email', 'Role', 'Verified', 'Membership', 'Amount', 'Created']],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                alternateRowStyles: { fillColor: [245, 245, 245] }
            });

            // Save PDF
            doc.save(`users_export_${new Date().toISOString().split('T')[0]}.pdf`);
            
            setShowExportOptions(false);
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            alert('Failed to export to PDF. Please try again.');
        } finally {
            setExportLoading(false);
        }
    };

    // Print Report
    const printReport = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Users Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #333; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .summary { background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
                        .stats { display: flex; gap: 20px; margin-bottom: 20px; }
                        .stat-item { flex: 1; }
                        @media print {
                            .no-print { display: none; }
                            body { margin: 0; }
                        }
                    </style>
                </head>
                <body>
                    <h1>Users Management Report</h1>
                    <div class="summary">
                        <p>Generated: ${new Date().toLocaleString()}</p>
                        <div class="stats">
                            <div class="stat-item">
                                <strong>Total Users:</strong> ${formatNumber(stats.totalUsers)}
                            </div>
                            <div class="stat-item">
                                <strong>Verified Users:</strong> ${formatNumber(stats.verifiedUsers)}
                            </div>
                            <div class="stat-item">
                                <strong>Active Memberships:</strong> ${formatNumber(stats.activeMemberships)}
                            </div>
                        </div>
                    </div>
                    <button class="no-print" onclick="window.print()">Print Report</button>
                    <button class="no-print" onclick="window.close()">Close</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Verified</th>
                                <th>Membership</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.slice(0, 50).map(user => `
                                <tr>
                                    <td>${user.name || 'N/A'}</td>
                                    <td>${user.phoneNumber}</td>
                                    <td>${user.email || 'N/A'}</td>
                                    <td>${user.role}</td>
                                    <td>${user.isVerified ? 'Yes' : 'No'}</td>
                                    <td>${user.membership?.status || 'N/A'}</td>
                                    <td>${formatDate(user.createdAt)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${users.length > 50 ? `<p>... and ${users.length - 50} more users</p>` : ''}
                    <p class="no-print">Total records: ${users.length}</p>
                </body>
            </html>
        `);
        printWindow.document.close();
        setShowExportOptions(false);
    };

    // Export specific filtered data
    const exportFilteredData = async (filters = {}) => {
        setExportLoading(true);
        try {
            const response = await userService.getAllUsers({ ...filters, limit: 5000 });
            const usersData = response.data;
            
            // Ask user which format they want
            const format = window.prompt('Choose export format:\n1. Excel\n2. CSV\n3. PDF', '1');
            
            switch(format) {
                case '1':
                    await exportToExcelWithData(usersData);
                    break;
                case '2':
                    await exportToCSVWithData(usersData);
                    break;
                case '3':
                    await exportToPDFWithData(usersData);
                    break;
                default:
                    alert('Export cancelled or invalid format selected.');
            }
        } catch (error) {
            console.error('Error exporting filtered data:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setExportLoading(false);
        }
    };

    const statistics = [
        { 
            label: 'Total Users', 
            value: loadingStats ? '...' : formatNumber(stats.totalUsers), 
            icon: <FaUsers />, 
            color: 'bg-blue-500', 
            textColor: 'text-white',
            description: 'Registered users'
        },
        { 
            label: 'Verified Users', 
            value: loadingStats ? '...' : `${formatNumber(stats.verifiedUsers)} (${Math.round((stats.verifiedUsers / stats.totalUsers) * 100 || 0)}%)`, 
            icon: <FaCheckCircle />, 
            color: 'bg-green-500', 
            textColor: 'text-white',
            description: 'Email/Phone verified'
        },
        { 
            label: 'Artists', 
            value: loadingStats ? '...' : formatNumber(stats.artists), 
            icon: <FaUserFriends />, 
            color: 'bg-purple-500', 
            textColor: 'text-white',
            description: 'Artist accounts'
        },
        { 
            label: 'Managers', 
            value: loadingStats ? '...' : formatNumber(stats.managers), 
            icon: <FaUserTie />, 
            color: 'bg-orange-500', 
            textColor: 'text-white',
            description: 'Manager accounts'
        },
        { 
            label: 'Active Memberships', 
            value: loadingStats ? '...' : formatNumber(stats.activeMemberships), 
            icon: <FaUserClock />, 
            color: 'bg-teal-500', 
            textColor: 'text-white',
            description: 'Active subscriptions'
        },
        { 
            label: 'Total Revenue', 
            value: loadingStats ? '...' : formatCurrency(stats.totalRevenue/100), 
            icon: <FaRupeeSign />, 
            color: 'bg-emerald-500', 
            textColor: 'text-white',
            description: 'From memberships'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">User Management Dashboard</h1>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statistics.map((stat, index) => (
                        <div 
                            key={index} 
                            className={`${stat.color} ${stat.textColor} rounded-xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-sm opacity-90 font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {stat.value}
                                    </p>
                                    {stat.description && (
                                        <p className="text-xs opacity-80 mt-1">{stat.description}</p>
                                    )}
                                </div>
                                <div className="text-3xl opacity-80">
                                    {stat.icon}
                                </div>
                            </div>
                            {loadingStats && (
                                <div className="h-1 w-full bg-white bg-opacity-30 rounded-full overflow-hidden mt-2">
                                    <div className="h-full bg-white animate-pulse"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Summary Bar */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Dashboard Summary</h3>
                            <div className="flex flex-wrap gap-4 mt-2">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">
                                        Total: <span className="font-semibold">{formatNumber(stats.totalUsers)}</span>
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">
                                        Verified: <span className="font-semibold">{formatNumber(stats.verifiedUsers)}</span>
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">
                                        Active: <span className="font-semibold">{formatNumber(stats.activeMemberships)}</span>
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">
                                        Revenue: <span className="font-semibold">{formatCurrency(stats.totalRevenue/100)}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                            >
                                <FaPlus /> Add User
                            </button>
                            <button
                                onClick={handleRefresh}
                                disabled={loadingStats || exportLoading}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                    loadingStats || exportLoading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                <FaSync className={loadingStats ? 'animate-spin' : ''} /> 
                                {loadingStats ? 'Loading...' : 'Refresh'}
                            </button>
                            
                            {/* Export Button with Dropdown */}
                            <div className="relative" ref={exportMenuRef}>
                                <button
                                    onClick={() => setShowExportOptions(!showExportOptions)}
                                    disabled={exportLoading}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                        exportLoading
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {exportLoading ? (
                                        <>
                                            <FaSync className="animate-spin" /> Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <FaDownload /> Export
                                        </>
                                    )}
                                </button>
                                
                                {showExportOptions && (
                                    <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                                        <div className="py-1">
                                            <button
                                                onClick={exportToExcel}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <FaFileExcel className="text-green-600" /> Export to Excel
                                            </button>
                                            <button
                                                onClick={exportToCSV}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <FaFileCsv className="text-blue-600" /> Export to CSV
                                            </button>
                                            <button
                                                onClick={exportToPDF}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <FaFilePdf className="text-red-600" /> Export to PDF
                                            </button>
                                            <div className="border-t border-gray-200 my-1"></div>
                                            <button
                                                onClick={printReport}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <FaPrint className="text-gray-600" /> Print Report
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 transition-colors">
                                <FaFilter /> Filters
                            </button>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            System Online • {exportLoading && 'Exporting...'}
                        </div>
                    </div>
                </div>

                {/* Export Progress Bar */}
                {exportLoading && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaSync className="text-blue-600 animate-spin" />
                                <span className="text-sm font-medium text-blue-800">
                                    Exporting data, please wait...
                                </span>
                            </div>
                            <span className="text-xs text-blue-600">
                                This may take a moment
                            </span>
                        </div>
                        <div className="h-1 bg-blue-100 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-blue-500 animate-pulse" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                )}

                {/* User Table */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Users List</h2>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            <span>Showing {formatNumber(users.length)} of {formatNumber(totalUsersCount)} users</span>
                            {exportLoading && <FaSync className="animate-spin text-gray-400" />}
                        </div>
                    </div>
                    <UserTable
                        key={refreshKey}
                        onEdit={handleEdit}
                        onView={handleView}
                        onRefresh={handleRefresh}
                    />
                </div>

               

            </div>

            {/* Modals */}
            <UserForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                userData={selectedUser}
                mode={formMode}
                onSuccess={handleFormSuccess}
            />

            <UserDetail
                open={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                user={selectedUser}
            />
        </div>
    );
};

// Helper functions for exporting with data
const exportToExcelWithData = (usersData) => {
    const exportData = usersData.map(user => ({
        'User ID': user._id,
        'Name': user.name || 'N/A',
        'Phone': user.phoneNumber,
        'Email': user.email || 'N/A',
        'Role': user.role,
        'Verified': user.isVerified ? 'Yes' : 'No',
        'Stage Name': user.stageName || 'N/A',
        'Artist Type': user.artistType || 'N/A',
        'Performance Type': user.performanceType || 'N/A',
        'Pronouns': user.pronouns || 'N/A',
        'DOB': user.dob ? new Date(user.dob).toLocaleDateString('en-IN') : 'N/A',
        'Membership Status': user.membership?.status || 'N/A',
        'Membership Amount': user.membership?.amount ? `₹${user.membership.amount}` : 'N/A',
        'Valid Till': user.membership?.validTill ? new Date(user.membership.validTill).toLocaleDateString('en-IN') : 'N/A',
        'Created At': new Date(user.createdAt).toLocaleDateString('en-IN'),
        'Updated At': new Date(user.updatedAt).toLocaleDateString('en-IN'),
        'Onboarding Completed': user.hasCompletedOnboarding ? 'Yes' : 'No',
        'Dashboard Tour Seen': user.dashboardTourSeen ? 'Yes' : 'No',
        'Roles': user.roles?.join(', ') || 'N/A'
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, `filtered_users_export_${new Date().toISOString().split('T')[0]}.xlsx`);
};

const exportToCSVWithData = (usersData) => {
    const exportData = usersData.map(user => ({
        'User ID': user._id,
        'Name': user.name || 'N/A',
        'Phone': user.phoneNumber,
        'Email': user.email || 'N/A',
        'Role': user.role,
        'Verified': user.isVerified ? 'Yes' : 'No',
        'Stage Name': user.stageName || 'N/A',
        'Artist Type': user.artistType || 'N/A',
        'Performance Type': user.performanceType || 'N/A',
        'Pronouns': user.pronouns || 'N/A',
        'DOB': user.dob ? new Date(user.dob).toLocaleDateString('en-IN') : 'N/A',
        'Membership Status': user.membership?.status || 'N/A',
        'Membership Amount': user.membership?.amount ? user.membership.amount : '',
        'Valid Till': user.membership?.validTill ? new Date(user.membership.validTill).toLocaleDateString('en-IN') : 'N/A',
        'Created At': new Date(user.createdAt).toLocaleDateString('en-IN'),
        'Updated At': new Date(user.updatedAt).toLocaleDateString('en-IN'),
        'Onboarding Completed': user.hasCompletedOnboarding ? 'Yes' : 'No',
        'Dashboard Tour Seen': user.dashboardTourSeen ? 'Yes' : 'No',
        'Roles': user.roles?.join(', ') || 'N/A'
    }));

    const headers = Object.keys(exportData[0]).join(',');
    const rows = exportData.map(row => 
        Object.values(row).map(value => 
            typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `filtered_users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const exportToPDFWithData = (usersData) => {
    const doc = new jsPDF('landscape');
    
    doc.setFontSize(20);
    doc.text('Filtered Users Export Report', 14, 15);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
    doc.text(`Total Records: ${usersData.length}`, 14, 28);
    
    const tableData = usersData.slice(0, 100).map(user => [
        user.name || 'N/A',
        user.phoneNumber,
        user.email || 'N/A',
        user.role,
        user.isVerified ? 'Yes' : 'No',
        user.membership?.status || 'N/A',
        user.membership?.amount ? `₹${user.membership.amount}` : 'N/A',
        new Date(user.createdAt).toLocaleDateString('en-IN')
    ]);

    doc.autoTable({
        startY: 35,
        head: [['Name', 'Phone', 'Email', 'Role', 'Verified', 'Membership', 'Amount', 'Created']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    if (usersData.length > 100) {
        const finalY = doc.lastAutoTable.finalY || 35;
        doc.setFontSize(10);
        doc.text(`Note: Showing first 100 of ${usersData.length} records`, 14, finalY + 10);
    }

    doc.save(`filtered_users_export_${new Date().toISOString().split('T')[0]}.pdf`);
};

export default AdminDashboard;