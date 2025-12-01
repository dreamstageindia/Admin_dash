import React, { useState, useEffect } from 'react';
import { epkService } from '../services/epkService';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaSync,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaGlobe,
  FaEyeSlash,
  FaStar,
  FaMusic,
  FaUserFriends,
  FaFileImage,
  FaCalendar,
  FaLink
} from 'react-icons/fa';

const EPKTable = ({ onEdit, onView, onRefresh }) => {
    const [epks, setEpks] = useState([]);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEpks, setTotalEpks] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(100);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [artistTypeFilter, setArtistTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [artistModeFilter, setArtistModeFilter] = useState("");
    const [minScoreFilter, setMinScoreFilter] = useState("");

    const fetchEPKs = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit,
                search,
                sortBy,
                sortOrder,
                artistType: artistTypeFilter,
                status: statusFilter,
                artistMode: artistModeFilter,
                minScore: minScoreFilter
            };
            
            const response = await epkService.getAllEPKs(params);
            setEpks(response.data);
            setTotalPages(response.pagination.pages);
            setTotalEpks(response.pagination.total);
        } catch (error) {
            console.error('Error fetching EPKs:', error);
            alert('Error fetching EPKs: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEPKs();
    }, [page, limit, search, sortBy, sortOrder, artistTypeFilter, statusFilter, artistModeFilter, minScoreFilter]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const newSelected = epks.map((epk) => epk._id);
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
        if (window.confirm(`Are you sure you want to delete ${selected.length} EPKs?`)) {
            try {
                await epkService.bulkDeleteEPKs(selected);
                setSelected([]);
                fetchEPKs();
                onRefresh && onRefresh();
            } catch (error) {
                console.error('Error deleting EPKs:', error);
                alert('Error deleting EPKs: ' + error.message);
            }
        }
    };

    const handleBulkPublish = async (publish) => {
        if (window.confirm(`Are you sure you want to ${publish ? 'publish' : 'unpublish'} ${selected.length} EPKs?`)) {
            try {
                await epkService.bulkUpdateEPKs(selected, { isPublished: publish });
                setSelected([]);
                fetchEPKs();
                onRefresh && onRefresh();
            } catch (error) {
                console.error('Error updating EPKs:', error);
                alert('Error updating EPKs: ' + error.message);
            }
        }
    };

    const handleTogglePublish = async (id, currentStatus) => {
        try {
            await epkService.togglePublish(id);
            fetchEPKs();
            onRefresh && onRefresh();
        } catch (error) {
            console.error('Error toggling publish status:', error);
            alert('Error toggling publish status: ' + error.message);
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

    const getStageName = (epk) => {
        const heroSection = epk.sections?.find(s => s.id === 'hero');
        return heroSection?.data?.stageName || epk.artistName;
    };

    const getArtForm = (epk) => {
        const heroSection = epk.sections?.find(s => s.id === 'hero');
        return heroSection?.data?.artForm || 'N/A';
    };

    const getSectionCount = (epk, sectionId) => {
        const section = epk.sections?.find(s => s.id === sectionId);
        if (!section) return 0;
        
        switch(sectionId) {
            case 'gig-experience':
                return section.data?.experiences?.length || 0;
            case 'my-works':
                return section.data?.works?.length || 0;
            case 'media-assets':
                return section.data?.assets?.length || 0;
            case 'artist-crew':
                return section.data?.crewMembers?.length || 0;
            case 'artist-band':
                return section.data?.crewMembers?.length || 0;
            default:
                return 0;
        }
    };

    const getScoreBadge = (score) => {
        if (!score && score !== 0) return null;
        
        let color = 'gray';
        if (score >= 80) color = 'green';
        else if (score >= 60) color = 'blue';
        else if (score >= 40) color = 'yellow';
        else color = 'red';

        return (
            <span className={`px-2 py-1 text-xs rounded-full flex items-center bg-${color}-100 text-${color}-800`}>
                <FaStar className="mr-1" />
                {score}
            </span>
        );
    };

    const getStatusBadge = (isPublished) => {
        return isPublished ? (
            <span className="px-2 py-1 text-xs rounded-full flex items-center bg-green-100 text-green-800">
                <FaGlobe className="mr-1" />
                Published
            </span>
        ) : (
            <span className="px-2 py-1 text-xs rounded-full flex items-center bg-gray-100 text-gray-800">
                <FaEyeSlash className="mr-1" />
                Draft
            </span>
        );
    };

    const getArtistModeBadge = (mode) => {
        const modes = {
            'solo': { color: 'purple', label: 'Solo' },
            'group': { color: 'blue', label: 'Group' },
            'duo': { color: 'teal', label: 'Duo' }
        };
        
        const modeInfo = modes[mode] || { color: 'gray', label: mode };
        
        return (
            <span className={`px-2 py-1 text-xs rounded-full bg-${modeInfo.color}-100 text-${modeInfo.color}-800`}>
                {modeInfo.label}
            </span>
        );
    };

    // Extract unique artist types for filter
    const uniqueArtistTypes = [...new Set(epks.map(epk => epk.artistType))].filter(Boolean);

    return (
        <div className="w-full">
            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search EPKs..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={artistTypeFilter}
                    onChange={(e) => setArtistTypeFilter(e.target.value)}
                >
                    <option value="">All Artist Types</option>
                    {uniqueArtistTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
                
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={artistModeFilter}
                    onChange={(e) => setArtistModeFilter(e.target.value)}
                >
                    <option value="">All Modes</option>
                    <option value="solo">Solo</option>
                    <option value="group">Group</option>
                    <option value="duo">Duo</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="createdAt">Created Date</option>
                    <option value="artistName">Artist Name</option>
                    <option value="artistType">Artist Type</option>
                    <option value="epkScore.overall">EPK Score</option>
                    <option value="updatedAt">Updated Date</option>
                </select>
                
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={minScoreFilter}
                    onChange={(e) => setMinScoreFilter(e.target.value)}
                >
                    <option value="">Min Score</option>
                    <option value="80">80+</option>
                    <option value="60">60+</option>
                    <option value="40">40+</option>
                    <option value="0">Any</option>
                </select>
                
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                >
                    <option value="100">100 per page</option>
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                </select>
            </div>

            <div className="flex gap-2 mb-6">
                <button
                    onClick={fetchEPKs}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                    <FaSync /> Refresh
                </button>
                
                <button
                    onClick={() => {
                        setSearch("");
                        setArtistTypeFilter("");
                        setStatusFilter("");
                        setArtistModeFilter("");
                        setMinScoreFilter("");
                        setSortBy("createdAt");
                        setSortOrder("desc");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                >
                    Clear Filters
                </button>
            </div>

            {/* Bulk Actions */}
            {selected.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-yellow-800">
                            {selected.length} EPK(s) selected
                        </span>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleBulkPublish(true)}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                            >
                                Publish Selected
                            </button>
                            <button
                                onClick={() => handleBulkPublish(false)}
                                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-1"
                            >
                                Unpublish Selected
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
                            >
                                <FaTrash /> Delete Selected
                            </button>
                        </div>
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
                                        checked={epks.length > 0 && selected.length === epks.length}
                                        className="h-4 w-4 text-purple-600 rounded"
                                    />
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('artistName')}
                                >
                                    <div className="flex items-center">
                                        Artist / Stage Name
                                        {getSortIcon('artistName')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type / Mode
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sections
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('epkScore.overall')}
                                >
                                    <div className="flex items-center">
                                        Score
                                        {getSortIcon('epkScore.overall')}
                                    </div>
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
                                    <td colSpan="8" className="px-6 py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : epks.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                        No EPKs found
                                    </td>
                                </tr>
                            ) : (
                                epks.map((epk) => (
                                    <tr key={epk._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(epk._id)}
                                                onChange={() => handleSelect(epk._id)}
                                                className="h-4 w-4 text-purple-600 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {epk.artistName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Stage: {getStageName(epk)}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1 flex items-center">
                                                    <FaLink className="mr-1" />
                                                    {epk.slug}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                    {epk.artistType}
                                                </span>
                                                {getArtistModeBadge(epk.artistMode)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                {getStatusBadge(epk.isPublished)}
                                                <button
                                                    onClick={() => handleTogglePublish(epk._id, epk.isPublished)}
                                                    className="text-xs text-purple-600 hover:text-purple-800"
                                                >
                                                    {epk.isPublished ? 'Unpublish' : 'Publish'}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                    <FaMusic className="mr-1" />
                                                    {getSectionCount(epk, 'my-works')}
                                                </span>
                                                <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                    <FaCalendar className="mr-1" />
                                                    {getSectionCount(epk, 'gig-experience')}
                                                </span>
                                                <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                    <FaFileImage className="mr-1" />
                                                    {getSectionCount(epk, 'media-assets')}
                                                </span>
                                                <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                    <FaUserFriends className="mr-1" />
                                                    {getSectionCount(epk, 'artist-crew') + getSectionCount(epk, 'artist-band')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getScoreBadge(epk.epkScore?.overall)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {formatDate(epk.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onView(epk)}
                                                    className="p-1 text-blue-600 hover:text-blue-800"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => onEdit(epk)}
                                                    className="p-1 text-green-600 hover:text-green-800"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm('Are you sure you want to delete this EPK?')) {
                                                            try {
                                                                await epkService.deleteEPK(epk._id);
                                                                fetchEPKs();
                                                                onRefresh && onRefresh();
                                                            } catch (error) {
                                                                console.error('Error deleting EPK:', error);
                                                                alert('Error deleting EPK: ' + error.message);
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
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalEpks)} of {totalEpks} EPKs
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
                                        ? 'bg-purple-600 text-white'
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

export default EPKTable;