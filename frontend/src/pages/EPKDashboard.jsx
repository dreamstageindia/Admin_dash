import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
    FaPlus, 
    FaSync, 
    FaDownload, 
    FaUpload,
    FaFilter,
    FaMusic,
    FaUserFriends,
    FaChartLine,
    FaFileExcel,
    FaFileCsv,
    FaFilePdf,
    FaPrint,
    FaGlobe,
    FaEye,
    FaEyeSlash,
    FaStar,
    FaUsers,
    FaCalendarAlt,
    FaPalette
} from 'react-icons/fa';
import EPKTable from '../components/EPKTable';
import EPKForm from '../components/EPKForm';
import EPKDetail from '../components/EPKDetail';
import BulkUploadModal from '../components/BulkUploadModal';
import { epkService } from '../services/epkService';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EPKDashboard = () => {

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
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [selectedEPK, setSelectedEPK] = useState(null);
    const [formMode, setFormMode] = useState('create');
    const [refreshKey, setRefreshKey] = useState(0);
    const [stats, setStats] = useState({
        totalEPKs: 0,
        publishedEPKs: 0,
        draftEPKs: 0,
        averageScore: 0,
        artistTypes: [],
        recentEPKs: []
    });
    const [loadingStats, setLoadingStats] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [exportLoading, setExportLoading] = useState(false);
    const [showExportOptions, setShowExportOptions] = useState(false);
    const exportMenuRef = useRef(null);
    const [epks, setEpks] = useState([]);
    const [totalEPKsCount, setTotalEPKsCount] = useState(0);

    const handleCreate = () => {
        setSelectedEPK(null);
        setFormMode('create');
        setIsFormOpen(true);
    };

    const handleEdit = (epk) => {
        setSelectedEPK(epk);
        setFormMode('edit');
        setIsFormOpen(true);
    };

    const handleView = (epk) => {
        setSelectedEPK(epk);
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    const getStageName = (epk) => {
        const heroSection = epk.sections?.find(s => s.id === 'hero');
        return heroSection?.data?.stageName || epk.artistName;
    };

    // Fetch statistics
    const fetchStatistics = async () => {
        setLoadingStats(true);
        try {
            // Fetch stats
            const statsResponse = await epkService.getEPKStats();
            const statsData = statsResponse.data;
            setStats(statsData);
            
            // Fetch EPKs for table
            const epksResponse = await epkService.getAllEPKs({ limit: 100 });
            setEpks(epksResponse.data);
            setTotalEPKsCount(epksResponse.pagination?.total || 0);
            
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching statistics:', error);
            // Fallback data
            setStats({
                totalEPKs: 156,
                publishedEPKs: 89,
                draftEPKs: 67,
                averageScore: 78,
                artistTypes: [
                    { _id: 'Music Band', count: 45 },
                    { _id: 'Solo Artist', count: 67 },
                    { _id: 'DJ', count: 22 },
                    { _id: 'Dance Group', count: 12 }
                ],
                recentEPKs: []
            });
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

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

    // Export to Excel
    const exportToExcel = async () => {
        setExportLoading(true);
        try {
            const response = await epkService.getAllEPKs({ limit: 5000 });
            const epksData = response.data;

            const exportData = epksData.map(epk => {
                const heroSection = epk.sections?.find(s => s.id === 'hero');
                const profileSection = epk.sections?.find(s => s.id === 'profile-stats');
                
                return {
                    'EPK ID': epk._id,
                    'Artist Name': epk.artistName,
                    'Artist Type': epk.artistType,
                    'Stage Name': heroSection?.data?.stageName || 'N/A',
                    'Slug': epk.slug,
                    'Artist Mode': epk.artistMode,
                    'Managed By': epk.managedBy,
                    'Published': epk.isPublished ? 'Yes' : 'No',
                    'EPK Score': epk.epkScore?.overall || 0,
                    'Art Form': heroSection?.data?.artForm || 'N/A',
                    'Art Style': profileSection?.data?.artStyle || 'N/A',
                    'Experience Years': profileSection?.data?.experienceYears || 0,
                    'Gigs Count': profileSection?.data?.gigsCount || 0,
                    'Works Count': epk.sections?.find(s => s.id === 'my-works')?.data?.works?.length || 0,
                    'Media Assets': epk.sections?.find(s => s.id === 'media-assets')?.data?.assets?.length || 0,
                    'Crew Members': epk.sections?.find(s => s.id === 'artist-crew')?.data?.crewMembers?.length || 0,
                    'Band Members': epk.sections?.find(s => s.id === 'artist-band')?.data?.crewMembers?.length || 0,
                    'Created At': formatDate(epk.createdAt),
                    'Updated At': formatDate(epk.updatedAt),
                    'Published At': epk.publishedAt ? formatDate(epk.publishedAt) : 'N/A'
                };
            });

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            
            const wscols = [
                { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 30 },
                { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 15 },
                { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
                { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
            ];
            worksheet['!cols'] = wscols;

            XLSX.utils.book_append_sheet(workbook, worksheet, 'EPKs');
            
            const fileName = `epks_export_${new Date().toISOString().split('T')[0]}.xlsx`;
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
            const response = await epkService.getAllEPKs({ limit: 5000 });
            const epksData = response.data;

            const exportData = epksData.map(epk => {
                const heroSection = epk.sections?.find(s => s.id === 'hero');
                const profileSection = epk.sections?.find(s => s.id === 'profile-stats');
                
                return {
                    'EPK ID': epk._id,
                    'Artist Name': epk.artistName,
                    'Artist Type': epk.artistType,
                    'Stage Name': heroSection?.data?.stageName || 'N/A',
                    'Slug': epk.slug,
                    'Artist Mode': epk.artistMode,
                    'Managed By': epk.managedBy,
                    'Published': epk.isPublished ? 'Yes' : 'No',
                    'EPK Score': epk.epkScore?.overall || 0,
                    'Art Form': heroSection?.data?.artForm || 'N/A',
                    'Art Style': profileSection?.data?.artStyle || 'N/A',
                    'Experience Years': profileSection?.data?.experienceYears || 0,
                    'Gigs Count': profileSection?.data?.gigsCount || 0
                };
            });

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
            link.setAttribute('download', `epks_export_${new Date().toISOString().split('T')[0]}.csv`);
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
            const response = await epkService.getAllEPKs({ limit: 100 });
            const epksData = response.data;

            const doc = new jsPDF('landscape');
            
            doc.setFontSize(20);
            doc.text('EPKs Export Report', 14, 15);
            
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
            doc.text(`Total EPKs: ${formatNumber(epksData.length)}`, 14, 28);
            
            const tableData = epksData.map(epk => {
                const heroSection = epk.sections?.find(s => s.id === 'hero');
                return [
                    epk.artistName,
                    epk.artistType,
                    heroSection?.data?.stageName || 'N/A',
                    epk.isPublished ? 'Yes' : 'No',
                    epk.epkScore?.overall || 0,
                    formatDate(epk.createdAt)
                ];
            });

            doc.autoTable({
                startY: 35,
                head: [['Artist', 'Type', 'Stage Name', 'Published', 'Score', 'Created']],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [75, 0, 130], textColor: 255 },
                alternateRowStyles: { fillColor: [245, 245, 245] }
            });

            doc.save(`epks_export_${new Date().toISOString().split('T')[0]}.pdf`);
            
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
                    <title>EPKs Report</title>
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
                    <h1>EPK Management Report</h1>
                    <div class="summary">
                        <p>Generated: ${new Date().toLocaleString()}</p>
                        <div class="stats">
                            <div class="stat-item">
                                <strong>Total EPKs:</strong> ${formatNumber(stats.totalEPKs)}
                            </div>
                            <div class="stat-item">
                                <strong>Published:</strong> ${formatNumber(stats.publishedEPKs)}
                            </div>
                            <div class="stat-item">
                                <strong>Average Score:</strong> ${Math.round(stats.averageScore)}/100
                            </div>
                        </div>
                    </div>
                    <button class="no-print" onclick="window.print()">Print Report</button>
                    <button class="no-print" onclick="window.close()">Close</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Artist</th>
                                <th>Type</th>
                                <th>Stage Name</th>
                                <th>Published</th>
                                <th>Score</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${epks.slice(0, 50).map(epk => {
                                const heroSection = epk.sections?.find(s => s.id === 'hero');
                                return `
                                    <tr>
                                        <td>${epk.artistName}</td>
                                        <td>${epk.artistType}</td>
                                        <td>${heroSection?.data?.stageName || 'N/A'}</td>
                                        <td>${epk.isPublished ? 'Yes' : 'No'}</td>
                                        <td>${epk.epkScore?.overall || 0}</td>
                                        <td>${formatDate(epk.createdAt)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    ${epks.length > 50 ? `<p>... and ${epks.length - 50} more EPKs</p>` : ''}
                    <p class="no-print">Total records: ${epks.length}</p>
                </body>
            </html>
        `);
        printWindow.document.close();
        setShowExportOptions(false);
    };

    // Download template
    const downloadTemplate = async () => {
        try {
            const response = await epkService.getTemplate();
            const template = response.data;
            
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet([template.sampleData]);
            
            // Set headers
            const headerRow = [template.headers];
            XLSX.utils.sheet_add_aoa(worksheet, headerRow, { origin: 'A1' });
            
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
            
            const fileName = `epk_bulk_upload_template_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, fileName);
        } catch (error) {
            console.error('Error downloading template:', error);
            alert('Failed to download template. Please try again.');
        }
    };

    const statistics = [
        { 
            label: 'Total EPKs', 
            value: loadingStats ? '...' : formatNumber(stats.totalEPKs), 
            icon: <FaMusic />, 
            color: 'bg-purple-500', 
            textColor: 'text-white',
            description: 'All EPKs created'
        },
        { 
            label: 'Published', 
            value: loadingStats ? '...' : `${formatNumber(stats.publishedEPKs)} (${Math.round((stats.publishedEPKs / stats.totalEPKs) * 100 || 0)}%)`, 
            icon: <FaGlobe />, 
            color: 'bg-green-500', 
            textColor: 'text-white',
            description: 'Live EPKs'
        },
        { 
            label: 'Drafts', 
            value: loadingStats ? '...' : formatNumber(stats.draftEPKs), 
            icon: <FaEyeSlash />, 
            color: 'bg-yellow-500', 
            textColor: 'text-white',
            description: 'Unpublished EPKs'
        },
        { 
            label: 'Avg Score', 
            value: loadingStats ? '...' : `${Math.round(stats.averageScore)}/100`, 
            icon: <FaStar />, 
            color: 'bg-blue-500', 
            textColor: 'text-white',
            description: 'Average EPK score'
        },
        { 
            label: 'Artists', 
            value: loadingStats ? '...' : formatNumber(stats.artistTypes?.reduce((sum, type) => sum + type.count, 0) || 0), 
            icon: <FaUsers />, 
            color: 'bg-pink-500', 
            textColor: 'text-white',
            description: 'Unique artists'
        },
        { 
            label: 'This Month', 
            value: loadingStats ? '...' : '12', 
            icon: <FaCalendarAlt />, 
            color: 'bg-teal-500', 
            textColor: 'text-white',
            description: 'New EPKs this month'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">EPK Management Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage Electronic Press Kits for artists and bands</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
                    {statistics.map((stat, index) => (
                        <div 
                            key={index} 
                            className={`${stat.color} ${stat.textColor} rounded-xl shadow-lg p-4 transform transition-all hover:scale-105 hover:shadow-xl`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs opacity-90 font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold mt-1">
                                        {stat.value}
                                    </p>
                                    {stat.description && (
                                        <p className="text-xs opacity-80 mt-1">{stat.description}</p>
                                    )}
                                </div>
                                <div className="text-2xl opacity-80">
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

               

                {/* Action Bar */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
                            >
                                <FaPlus /> Create EPK
                            </button>
                            <button
                                onClick={() => setIsBulkUploadOpen(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                            >
                                <FaUpload /> Bulk Upload
                            </button>
                            <button
                                onClick={downloadTemplate}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                            >
                                <FaDownload /> Download Template
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
                            System Online • Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

                {/* EPK Table */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">EPKs List</h2>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            <span>Showing {formatNumber(epks.length)} of {formatNumber(totalEPKsCount)} EPKs</span>
                            {exportLoading && <FaSync className="animate-spin text-gray-400" />}
                        </div>
                    </div>
                    <EPKTable
                        key={refreshKey}
                        onEdit={handleEdit}
                        onView={handleView}
                        onRefresh={handleRefresh}
                    />
                </div>
            </div>

            {/* Modals */}
            <EPKForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                epkData={selectedEPK}
                mode={formMode}
                onSuccess={handleFormSuccess}
            />

            <EPKDetail
                open={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                epk={selectedEPK}
            />

            <BulkUploadModal
                open={isBulkUploadOpen}
                onClose={() => setIsBulkUploadOpen(false)}
                onSuccess={handleRefresh}
            />
        </div>
    );
};

export default EPKDashboard;