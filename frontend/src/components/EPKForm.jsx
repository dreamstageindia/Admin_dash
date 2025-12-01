import React, { useState, useEffect } from 'react';
import { epkService } from '../services/epkService';
import { FaChevronDown, FaChevronUp, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const EPKForm = ({ open, onClose, epkData, mode = 'create', onSuccess }) => {
    const [formData, setFormData] = useState({
        userId: '',
        artistName: '',
        artistType: 'Music Band',
        artistMode: 'solo',
        managedBy: 'artist',
        managerPhone: '',
        seoEnabled: true,
        analyticsEnabled: true,
        isPublished: false,
        theme: {
            primaryColor: "#000000",
            textColor: "#FFFFFF",
            bioTextColor: "#FFFFFF",
            backgroundColor: "#5C5C5C",
            gradientPresetId: "mono-dark",
            useGradient: true
        }
    });

    const [sections, setSections] = useState([]);
    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        theme: false,
        hero: false,
        profile: false,
        gigs: false,
        works: false,
        media: false,
        crew: false,
        band: false,
        affiliations: false
    });

    // Default sections structure
    const defaultSections = [
        {
            id: "hero",
            type: "hero",
            order: 0,
            data: {
                mode: "left-image",
                imageShape: "square",
                useGradient: false,
                gradientPresetId: "teal-sunset",
                buttonLinkMode: "section",
                buttonSectionId: "gig-experience",
                buttonTarget: "internal",
                title: "",
                content: "",
                stageName: "",
                artForm: "",
                backgroundColor: "#ffffff",
                textColor: "#000000",
                shortBio: "",
                primaryColor: "#8B5CF6",
                theme: {
                    useGradient: false,
                    primaryColor: "#8B5CF6",
                    backgroundColor: "#ffffff",
                    resolved: {
                        primary: "#0A8293",
                        text: "#000000",
                        bioText: "#000000",
                        background: "#FFFFFF"
                    }
                },
                buttonText: "View Gigs",
                buttonLink: "#gig-experience",
                image: "https://app.dreamstage.tech/defaults/hero-image.webp",
                backgroundImage: "https://app.dreamstage.tech/defaults/background-image.webp"
            }
        },
        {
            id: "profile-stats",
            type: "profile-stats",
            order: 1,
            data: {
                primaryColor: "#8B5CF6",
                backgroundColor: "#ffffff",
                useGradient: false,
                theme: {
                    useGradient: false,
                    primaryColor: "#8B5CF6",
                    backgroundColor: "#ffffff",
                    resolved: {
                        primary: "#0A8293",
                        text: "#000000",
                        bioText: "#000000",
                        background: "#FFFFFF"
                    }
                },
                artStyle: "",
                longBio: "",
                socialMedia: {},
                tags: [],
                likes: 0,
                sends: 0,
                epkViews: 0,
                experienceYears: 0,
                hireRange: {
                    min: 20000,
                    max: null,
                    currency: "INR"
                },
                gigsCount: 0,
                countriesTravelledCount: 0,
                citiesTravelledCount: 0
            }
        },
        {
            id: "gig-experience",
            type: "gig-experience",
            order: 2,
            data: {
                primaryColor: "#000000",
                backgroundColor: "#5C5C5C",
                useGradient: true,
                theme: {
                    useGradient: true,
                    primaryColor: "#000000",
                    backgroundColor: "#5C5C5C",
                    resolved: {
                        primary: "#000000",
                        text: "#FFFFFF",
                        bioText: "#FFFFFF",
                        background: "#5C5C5C"
                    },
                    gradientPresetId: "mono-dark",
                    textColor: "#FFFFFF",
                    bioTextColor: "#FFFFFF"
                },
                experiences: [],
                textColor: "#FFFFFF",
                bioTextColor: "#FFFFFF",
                gradientPresetId: "mono-dark"
            }
        },
        {
            id: "my-works",
            type: "my-works",
            order: 3,
            data: {
                primaryColor: "#000000",
                backgroundColor: "#5C5C5C",
                useGradient: true,
                theme: {
                    useGradient: true,
                    primaryColor: "#000000",
                    backgroundColor: "#5C5C5C",
                    resolved: {
                        primary: "#000000",
                        text: "#FFFFFF",
                        bioText: "#FFFFFF",
                        background: "#5C5C5C"
                    },
                    gradientPresetId: "mono-dark",
                    textColor: "#FFFFFF",
                    bioTextColor: "#FFFFFF"
                },
                works: [],
                textColor: "#FFFFFF",
                bioTextColor: "#FFFFFF",
                gradientPresetId: "mono-dark"
            }
        },
        {
            id: "media-assets",
            type: "media-assets",
            order: 4,
            data: {
                primaryColor: "#000000",
                backgroundColor: "#5C5C5C",
                useGradient: true,
                theme: {
                    useGradient: true,
                    primaryColor: "#000000",
                    backgroundColor: "#5C5C5C",
                    resolved: {
                        primary: "#000000",
                        text: "#FFFFFF",
                        bioText: "#FFFFFF",
                        background: "#5C5C5C"
                    },
                    textColor: "#FFFFFF",
                    bioTextColor: "#FFFFFF",
                    gradientPresetId: "mono-dark"
                },
                title: "",
                assets: [],
                textColor: "#FFFFFF",
                bioTextColor: "#FFFFFF",
                gradientPresetId: "mono-dark"
            }
        },
        {
            id: "artist-crew",
            type: "artist-crew",
            order: 5,
            data: {
                title: "Dream Crew",
                crewMembers: [],
                backgroundColor: "#C7DEE2",
                textColor: "#000000",
                primaryColor: "#9CAEC6",
                bioTextColor: "#000000",
                useGradient: false
            }
        },
        {
            id: "artist-band",
            type: "artist-band",
            order: 6,
            data: {
                title: "Dream Band",
                crewMembers: [],
                backgroundColor: "#C7DEE2",
                textColor: "#000000",
                primaryColor: "#9CAEC6",
                bioTextColor: "#000000",
                useGradient: false
            }
        },
        {
            id: "affiliations",
            type: "affiliations",
            order: 7,
            data: {
                primaryColor: "#000000",
                backgroundColor: "#5C5C5C",
                useGradient: true,
                theme: {
                    useGradient: true,
                    primaryColor: "#000000",
                    backgroundColor: "#5C5C5C",
                    resolved: {
                        primary: "#000000",
                        text: "#FFFFFF",
                        bioText: "#FFFFFF",
                        background: "#5C5C5C"
                    },
                    gradientPresetId: "mono-dark",
                    textColor: "#FFFFFF",
                    bioTextColor: "#FFFFFF"
                },
                title: "",
                affiliations: [],
                sectionTitle: "",
                heading: "",
                headingTitle: "",
                textColor: "#FFFFFF",
                bioTextColor: "#FFFFFF",
                gradientPresetId: "mono-dark"
            }
        },
        {
            id: "endorsements",
            type: "endorsements",
            order: 8,
            data: {}
        }
    ];

    useEffect(() => {
        if (epkData) {
            setFormData({
                userId: epkData.userId || '',
                artistName: epkData.artistName || '',
                artistType: epkData.artistType || 'Music Band',
                artistMode: epkData.artistMode || 'solo',
                managedBy: epkData.managedBy || 'artist',
                managerPhone: epkData.managerPhone || '',
                seoEnabled: epkData.seoEnabled !== undefined ? epkData.seoEnabled : true,
                analyticsEnabled: epkData.analyticsEnabled !== undefined ? epkData.analyticsEnabled : true,
                isPublished: epkData.isPublished || false,
                theme: epkData.theme || {
                    primaryColor: "#000000",
                    textColor: "#FFFFFF",
                    bioTextColor: "#FFFFFF",
                    backgroundColor: "#5C5C5C",
                    gradientPresetId: "mono-dark",
                    useGradient: true
                }
            });

            if (epkData.sections && epkData.sections.length > 0) {
                setSections(epkData.sections);
            } else {
                setSections(defaultSections);
            }
        } else {
            setSections(defaultSections);
            // Generate a random userId for new EPKs
            setFormData(prev => ({
                ...prev,
                userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }));
        }
    }, [epkData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleThemeChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            theme: {
                ...prev.theme,
                [name]: value
            }
        }));
    };

    const handleSectionChange = (sectionId, field, value) => {
        setSections(prev => prev.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    data: {
                        ...section.data,
                        [field]: value
                    }
                };
            }
            return section;
        }));
    };

    const handleNestedSectionChange = (sectionId, parentField, childField, value) => {
        setSections(prev => prev.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    data: {
                        ...section.data,
                        [parentField]: {
                            ...section.data[parentField],
                            [childField]: value
                        }
                    }
                };
            }
            return section;
        }));
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleAddItem = (sectionId, itemType) => {
        const newItem = {
            id: `${itemType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...getDefaultItem(itemType)
        };

        setSections(prev => prev.map(section => {
            if (section.id === sectionId) {
                const itemsField = getItemsField(itemType);
                return {
                    ...section,
                    data: {
                        ...section.data,
                        [itemsField]: [...(section.data[itemsField] || []), newItem]
                    }
                };
            }
            return section;
        }));
    };

    const handleRemoveItem = (sectionId, itemType, itemId) => {
        setSections(prev => prev.map(section => {
            if (section.id === sectionId) {
                const itemsField = getItemsField(itemType);
                return {
                    ...section,
                    data: {
                        ...section.data,
                        [itemsField]: section.data[itemsField].filter(item => item.id !== itemId)
                    }
                };
            }
            return section;
        }));
    };

    const handleUpdateItem = (sectionId, itemType, itemId, updates) => {
        setSections(prev => prev.map(section => {
            if (section.id === sectionId) {
                const itemsField = getItemsField(itemType);
                return {
                    ...section,
                    data: {
                        ...section.data,
                        [itemsField]: section.data[itemsField].map(item => 
                            item.id === itemId ? { ...item, ...updates } : item
                        )
                    }
                };
            }
            return section;
        }));
    };

    const getDefaultItem = (itemType) => {
        switch(itemType) {
            case 'experience':
                return {
                    eventName: '',
                    location: '',
                    eventPhoto: 'https://app.dreamstage.tech/defaults/event-photo.webp'
                };
            case 'work':
                return {
                    type: 'audio',
                    sampleName: '',
                    dateOfRelease: new Date().toISOString().split('T')[0],
                    label: '',
                    isTopWork: false,
                    thumbnail: 'https://app.dreamstage.tech/defaults/work-thumbnail.webp'
                };
            case 'asset':
                return {
                    type: 'image',
                    url: 'https://app.dreamstage.tech/defaults/media-asset.webp',
                    thumbnail: 'https://app.dreamstage.tech/defaults/media-asset.webp'
                };
            case 'crew':
                return {
                    name: '',
                    role: '',
                    image: 'https://app.dreamstage.tech/defaults/crew-member.webp'
                };
            case 'affiliation':
                return {
                    name: '',
                    role: 'Member',
                    type: 'other',
                    image: 'https://app.dreamstage.tech/defaults/affiliation.webp'
                };
            default:
                return {};
        }
    };

    const getItemsField = (itemType) => {
        switch(itemType) {
            case 'experience': return 'experiences';
            case 'work': return 'works';
            case 'asset': return 'assets';
            case 'crew': return 'crewMembers';
            case 'affiliation': return 'affiliations';
            default: return 'items';
        }
    };

    const handleSubmit = async () => {
        try {
            const dataToSubmit = {
                ...formData,
                sections: sections.map(section => ({
                    ...section,
                    data: {
                        ...section.data,
                        // Ensure default images are set
                        ...(section.type === 'hero' && {
                            image: section.data.image || 'https://app.dreamstage.tech/defaults/hero-image.webp',
                            backgroundImage: section.data.backgroundImage || 'https://app.dreamstage.tech/defaults/background-image.webp'
                        }),
                        ...(section.type === 'gig-experience' && {
                            experiences: section.data.experiences?.map(exp => ({
                                ...exp,
                                eventPhoto: exp.eventPhoto || 'https://app.dreamstage.tech/defaults/event-photo.webp'
                            })) || []
                        }),
                        ...(section.type === 'my-works' && {
                            works: section.data.works?.map(work => ({
                                ...work,
                                thumbnail: work.thumbnail || 'https://app.dreamstage.tech/defaults/work-thumbnail.webp'
                            })) || []
                        }),
                        ...(section.type === 'media-assets' && {
                            assets: section.data.assets?.map(asset => ({
                                ...asset,
                                url: asset.url || 'https://app.dreamstage.tech/defaults/media-asset.webp',
                                thumbnail: asset.thumbnail || 'https://app.dreamstage.tech/defaults/media-asset.webp'
                            })) || []
                        }),
                        ...((section.type === 'artist-crew' || section.type === 'artist-band') && {
                            crewMembers: section.data.crewMembers?.map(crew => ({
                                ...crew,
                                image: crew.image || 'https://app.dreamstage.tech/defaults/crew-member.webp'
                            })) || []
                        }),
                        ...(section.type === 'affiliations' && {
                            affiliations: section.data.affiliations?.map(aff => ({
                                ...aff,
                                image: aff.image || 'https://app.dreamstage.tech/defaults/affiliation.webp'
                            })) || []
                        })
                    }
                }))
            };

            if (mode === 'create') {
                await epkService.createEPK(dataToSubmit);
            } else {
                await epkService.updateEPK(epkData._id, dataToSubmit);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving EPK:', error);
            alert('Error saving EPK: ' + error.message);
        }
    };

    const handleImportExcel = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length > 0) {
                const firstRow = jsonData[0];
                
                // Update basic info from Excel
                setFormData(prev => ({
                    ...prev,
                    artistName: firstRow.artistName || prev.artistName,
                    artistType: firstRow.artistType || prev.artistType,
                    artistMode: firstRow.artistMode || prev.artistMode,
                    managedBy: firstRow.managedBy || prev.managedBy,
                    managerPhone: firstRow.managerPhone || prev.managerPhone,
                    seoEnabled: firstRow.seoEnabled === 'true' || firstRow.seoEnabled === true,
                    analyticsEnabled: firstRow.analyticsEnabled === 'true' || firstRow.analyticsEnabled === true,
                    isPublished: firstRow.isPublished === 'true' || firstRow.isPublished === true
                }));

                // Update hero section
                setSections(prev => prev.map(section => {
                    if (section.id === 'hero') {
                        return {
                            ...section,
                            data: {
                                ...section.data,
                                stageName: firstRow.stageName || section.data.stageName,
                                artForm: firstRow.artForm || section.data.artForm,
                                shortBio: firstRow.shortBio || section.data.shortBio
                            }
                        };
                    }
                    if (section.id === 'profile-stats') {
                        return {
                            ...section,
                            data: {
                                ...section.data,
                                artStyle: firstRow.artStyle || section.data.artStyle,
                                longBio: firstRow.longBio || section.data.longBio,
                                experienceYears: parseInt(firstRow.experienceYears) || section.data.experienceYears,
                                hireRange: {
                                    min: parseInt(firstRow.hireRange_min) || section.data.hireRange.min,
                                    max: parseInt(firstRow.hireRange_max) || section.data.hireRange.max,
                                    currency: firstRow.hireRange_currency || section.data.hireRange.currency
                                },
                                tags: firstRow.tags ? firstRow.tags.split(',').map(tag => tag.trim()) : section.data.tags
                            }
                        };
                    }
                    return section;
                }));

                alert(`Imported ${jsonData.length} rows from Excel file. Basic information has been populated.`);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const renderSectionItems = (sectionId, itemType, items) => {
        if (!items || items.length === 0) {
            return (
                <div className="text-gray-500 text-sm italic">
                    No {itemType}s added yet.
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={item.id} className="border rounded p-3 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">
                                {itemType === 'experience' ? item.eventName || `Experience ${index + 1}` :
                                 itemType === 'work' ? item.sampleName || `Work ${index + 1}` :
                                 itemType === 'asset' ? `Asset ${index + 1}` :
                                 itemType === 'crew' ? item.name || `Crew ${index + 1}` :
                                 item.name || `Affiliation ${index + 1}`}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleRemoveItem(sectionId, itemType, item.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <FaTrash />
                            </button>
                        </div>
                        
                        {itemType === 'experience' && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <label className="text-xs text-gray-500">Event Name</label>
                                    <input
                                        type="text"
                                        value={item.eventName || ''}
                                        onChange={(e) => handleUpdateItem(sectionId, itemType, item.id, { eventName: e.target.value })}
                                        className="w-full px-2 py-1 border rounded"
                                        placeholder="Event name"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Location</label>
                                    <input
                                        type="text"
                                        value={item.location || ''}
                                        onChange={(e) => handleUpdateItem(sectionId, itemType, item.id, { location: e.target.value })}
                                        className="w-full px-2 py-1 border rounded"
                                        placeholder="Location"
                                    />
                                </div>
                            </div>
                        )}

                        {itemType === 'work' && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <label className="text-xs text-gray-500">Sample Name</label>
                                    <input
                                        type="text"
                                        value={item.sampleName || ''}
                                        onChange={(e) => handleUpdateItem(sectionId, itemType, item.id, { sampleName: e.target.value })}
                                        className="w-full px-2 py-1 border rounded"
                                        placeholder="Work name"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Type</label>
                                    <select
                                        value={item.type || 'audio'}
                                        onChange={(e) => handleUpdateItem(sectionId, itemType, item.id, { type: e.target.value })}
                                        className="w-full px-2 py-1 border rounded"
                                    >
                                        <option value="audio">Audio</option>
                                        <option value="video">Video</option>
                                        <option value="image">Image</option>
                                        <option value="text">Text</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">
                            {mode === 'create' ? 'Create New EPK' : 'Edit EPK'}
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
                                        Artist Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="artistName"
                                        value={formData.artistName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Artist Type *
                                    </label>
                                    <select
                                        name="artistType"
                                        value={formData.artistType}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="Music Band">Music Band</option>
                                        <option value="Solo Artist">Solo Artist</option>
                                        <option value="DJ">DJ</option>
                                        <option value="Dance Group">Dance Group</option>
                                        <option value="Theatre Group">Theatre Group</option>
                                        <option value="Visual Artist">Visual Artist</option>
                                        <option value="Photographer">Photographer</option>
                                        <option value="Videographer">Videographer</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Artist Mode
                                    </label>
                                    <select
                                        name="artistMode"
                                        value={formData.artistMode}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="solo">Solo</option>
                                        <option value="group">Group</option>
                                        <option value="duo">Duo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Managed By
                                    </label>
                                    <select
                                        name="managedBy"
                                        value={formData.managedBy}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="artist">Artist</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Manager Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="managerPhone"
                                        value={formData.managerPhone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Import from Excel
                                    </label>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleImportExcel}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Upload Excel file to populate fields
                                    </p>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.seoEnabled}
                                            onChange={handleChange}
                                            name="seoEnabled"
                                            className="h-4 w-4 text-purple-600 rounded"
                                        />
                                        <span className="ml-2 text-gray-700">SEO Enabled</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.analyticsEnabled}
                                            onChange={handleChange}
                                            name="analyticsEnabled"
                                            className="h-4 w-4 text-purple-600 rounded"
                                        />
                                        <span className="ml-2 text-gray-700">Analytics Enabled</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.isPublished}
                                            onChange={handleChange}
                                            name="isPublished"
                                            className="h-4 w-4 text-purple-600 rounded"
                                        />
                                        <span className="ml-2 text-gray-700">Published</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Theme Section */}
                    <div className="mb-6">
                        <div 
                            className="flex justify-between items-center cursor-pointer mb-4"
                            onClick={() => toggleSection('theme')}
                        >
                            <h3 className="text-lg font-semibold text-gray-800">Theme Settings</h3>
                            <span className="text-gray-500">
                                {expandedSections.theme ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                        </div>
                        
                        {expandedSections.theme && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Primary Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            name="primaryColor"
                                            value={formData.theme.primaryColor}
                                            onChange={handleThemeChange}
                                            className="w-10 h-10"
                                        />
                                        <input
                                            type="text"
                                            name="primaryColor"
                                            value={formData.theme.primaryColor}
                                            onChange={handleThemeChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Text Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            name="textColor"
                                            value={formData.theme.textColor}
                                            onChange={handleThemeChange}
                                            className="w-10 h-10"
                                        />
                                        <input
                                            type="text"
                                            name="textColor"
                                            value={formData.theme.textColor}
                                            onChange={handleThemeChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Background Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            name="backgroundColor"
                                            value={formData.theme.backgroundColor}
                                            onChange={handleThemeChange}
                                            className="w-10 h-10"
                                        />
                                        <input
                                            type="text"
                                            name="backgroundColor"
                                            value={formData.theme.backgroundColor}
                                            onChange={handleThemeChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.theme.useGradient}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                theme: { ...prev.theme, useGradient: e.target.checked }
                                            }))}
                                            className="h-4 w-4 text-purple-600 rounded"
                                        />
                                        <span className="ml-2 text-gray-700">Use Gradient Background</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Hero Section */}
                    <div className="mb-6">
                        <div 
                            className="flex justify-between items-center cursor-pointer mb-4"
                            onClick={() => toggleSection('hero')}
                        >
                            <h3 className="text-lg font-semibold text-gray-800">Hero Section</h3>
                            <span className="text-gray-500">
                                {expandedSections.hero ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                        </div>
                        
                        {expandedSections.hero && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sections.find(s => s.id === 'hero')?.data && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Stage Name
                                            </label>
                                            <input
                                                type="text"
                                                value={sections.find(s => s.id === 'hero').data.stageName || ''}
                                                onChange={(e) => handleSectionChange('hero', 'stageName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                placeholder="Artist stage name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Art Form
                                            </label>
                                            <input
                                                type="text"
                                                value={sections.find(s => s.id === 'hero').data.artForm || ''}
                                                onChange={(e) => handleSectionChange('hero', 'artForm', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                placeholder="Music Band, Solo Artist, etc."
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Short Bio
                                            </label>
                                            <textarea
                                                value={sections.find(s => s.id === 'hero').data.shortBio || ''}
                                                onChange={(e) => handleSectionChange('hero', 'shortBio', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                rows="3"
                                                placeholder="Brief description of the artist"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Profile Image URL
                                            </label>
                                            <input
                                                type="text"
                                                value={sections.find(s => s.id === 'hero').data.image || ''}
                                                onChange={(e) => handleSectionChange('hero', 'image', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Default: https://app.dreamstage.tech/defaults/hero-image.webp
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Background Image URL
                                            </label>
                                            <input
                                                type="text"
                                                value={sections.find(s => s.id === 'hero').data.backgroundImage || ''}
                                                onChange={(e) => handleSectionChange('hero', 'backgroundImage', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                placeholder="https://example.com/background.jpg"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Default: https://app.dreamstage.tech/defaults/background-image.webp
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Gig Experience Section */}
                    <div className="mb-6">
                        <div 
                            className="flex justify-between items-center cursor-pointer mb-4"
                            onClick={() => toggleSection('gigs')}
                        >
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-800">Gig Experience</h3>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {sections.find(s => s.id === 'gig-experience')?.data?.experiences?.length || 0} experiences
                                </span>
                            </div>
                            <span className="text-gray-500">
                                {expandedSections.gigs ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                        </div>
                        
                        {expandedSections.gigs && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-gray-600">
                                        Add performance experiences
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem('gig-experience', 'experience')}
                                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                                    >
                                        <FaPlus /> Add Experience
                                    </button>
                                </div>
                                
                                {renderSectionItems('gig-experience', 'experience', 
                                    sections.find(s => s.id === 'gig-experience')?.data?.experiences)}
                            </div>
                        )}
                    </div>

                    {/* My Works Section */}
                    <div className="mb-6">
                        <div 
                            className="flex justify-between items-center cursor-pointer mb-4"
                            onClick={() => toggleSection('works')}
                        >
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-800">My Works</h3>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    {sections.find(s => s.id === 'my-works')?.data?.works?.length || 0} works
                                </span>
                            </div>
                            <span className="text-gray-500">
                                {expandedSections.works ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                        </div>
                        
                        {expandedSections.works && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-gray-600">
                                        Add audio, video, image, or text works
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem('my-works', 'work')}
                                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                                    >
                                        <FaPlus /> Add Work
                                    </button>
                                </div>
                                
                                {renderSectionItems('my-works', 'work', 
                                    sections.find(s => s.id === 'my-works')?.data?.works)}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h4 className="font-medium text-gray-800 mb-2">Quick Actions</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    // Set all default images
                                    setSections(defaultSections);
                                    alert('All sections reset to defaults with placeholder images.');
                                }}
                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                            >
                                Reset to Defaults
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const sectionIds = ['gig-experience', 'my-works', 'media-assets', 'artist-crew', 'artist-band', 'affiliations'];
                                    sectionIds.forEach(sectionId => {
                                        const itemsField = getItemsField(
                                            sectionId === 'gig-experience' ? 'experience' :
                                            sectionId === 'my-works' ? 'work' :
                                            sectionId === 'media-assets' ? 'asset' :
                                            sectionId === 'artist-crew' || sectionId === 'artist-band' ? 'crew' :
                                            'affiliation'
                                        );
                                        handleAddItem(sectionId, 
                                            sectionId === 'gig-experience' ? 'experience' :
                                            sectionId === 'my-works' ? 'work' :
                                            sectionId === 'media-assets' ? 'asset' :
                                            sectionId === 'artist-crew' || sectionId === 'artist-band' ? 'crew' :
                                            'affiliation'
                                        );
                                    });
                                    alert('Added sample items to all sections.');
                                }}
                                className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                            >
                                Add Sample Items
                            </button>
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
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                        >
                            <FaSave />
                            {mode === 'create' ? 'Create EPK' : 'Update EPK'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EPKForm;