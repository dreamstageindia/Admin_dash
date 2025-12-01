import React from 'react';
import { 
    FaMusic, 
    FaUserFriends, 
    FaCalendar, 
    FaImage, 
    FaLink, 
    FaGlobe, 
    FaEye, 
    FaEyeSlash,
    FaStar,
    FaPalette,
    FaTags,
    FaRupeeSign,
    FaMapMarkerAlt,
    FaUsers,
    FaBriefcase,
    FaAward,
    FaFileAudio,
    FaFileVideo,
    FaFileImage,
    FaFileAlt,
    FaExternalLinkAlt
} from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const EPKDetail = ({ open, onClose, epk }) => {
    if (!open || !epk) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const formatCurrency = (amount, currency = 'INR') => {
        if (!amount) return 'N/A';
        if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`;
        if (currency === 'USD') return `$${amount.toLocaleString('en-US')}`;
        if (currency === 'EUR') return `€${amount.toLocaleString('en-EU')}`;
        return `${amount} ${currency}`;
    };

    const getSection = (sectionId) => {
        return epk.sections?.find(s => s.id === sectionId);
    };

    const getHeroData = () => getSection('hero')?.data || {};
    const getProfileData = () => getSection('profile-stats')?.data || {};
    const getGigExperience = () => getSection('gig-experience')?.data?.experiences || [];
    const getMyWorks = () => getSection('my-works')?.data?.works || [];
    const getMediaAssets = () => getSection('media-assets')?.data?.assets || [];
    const getArtistCrew = () => getSection('artist-crew')?.data?.crewMembers || [];
    const getArtistBand = () => getSection('artist-band')?.data?.crewMembers || [];
    const getAffiliations = () => getSection('affiliations')?.data?.affiliations || [];

    const heroData = getHeroData();
    const profileData = getProfileData();

    const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
        <div className={`flex items-start mb-3 ${className}`}>
            <Icon className="mt-1 mr-3 text-gray-400 flex-shrink-0" />
            <div>
                <div className="text-sm text-gray-500">{label}</div>
                <div className="text-gray-800">{value || 'N/A'}</div>
            </div>
        </div>
    );

    const StatusBadge = ({ published, score }) => (
        <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
            }`}>
                {published ? <FaGlobe /> : <FaEyeSlash />}
                {published ? 'Published' : 'Draft'}
            </span>
            {score !== undefined && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                    score >= 80 ? 'bg-green-100 text-green-800' :
                    score >= 60 ? 'bg-blue-100 text-blue-800' :
                    score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    <FaStar />
                    {score}/100
                </span>
            )}
        </div>
    );

    const SectionCard = ({ title, icon: Icon, children, count }) => (
        <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Icon className="text-gray-500" />
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
                {count !== undefined && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {count} items
                    </span>
                )}
            </div>
            {children}
        </div>
    );

    const WorkTypeIcon = ({ type }) => {
        const icons = {
            audio: <FaFileAudio className="text-blue-500" />,
            video: <FaFileVideo className="text-red-500" />,
            image: <FaFileImage className="text-green-500" />,
            text: <FaFileAlt className="text-purple-500" />
        };
        return icons[type] || <FaFileAlt className="text-gray-500" />;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {epk.artistName}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-gray-600">
                                            {heroData.stageName || epk.artistName}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                            {epk.artistType}
                                        </span>
                                    </div>
                                </div>
                                <StatusBadge 
                                    published={epk.isPublished} 
                                    score={epk.epkScore?.overall} 
                                />
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <FaLink className="text-xs" />
                                        {epk.slug}
                                    </span>
                                    <span>•</span>
                                    <span>{epk.artistMode === 'group' ? 'Group' : 'Solo'}</span>
                                    <span>•</span>
                                    <span>Managed by: {epk.managedBy}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full ml-4"
                        >
                            <MdClose className="text-gray-500 text-xl" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Basic Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Hero Section Card */}
                            <SectionCard title="Hero Section" icon={FaMusic}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-gray-700">Stage Name</div>
                                        <div className="text-gray-900">{heroData.stageName || 'N/A'}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-gray-700">Art Form</div>
                                        <div className="text-gray-900">{heroData.artForm || 'N/A'}</div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <div className="text-sm font-medium text-gray-700">Short Bio</div>
                                        <div className="text-gray-900">{heroData.shortBio || 'N/A'}</div>
                                    </div>
                                </div>
                            </SectionCard>

                            {/* Profile Stats Card */}
                            <SectionCard title="Profile Stats" icon={FaBriefcase}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium text-gray-700">Art Style</div>
                                            <div className="text-gray-900">{profileData.artStyle || 'N/A'}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium text-gray-700">Experience</div>
                                            <div className="text-gray-900 flex items-center gap-1">
                                                <FaAward className="text-yellow-500" />
                                                {profileData.experienceYears || 0} years
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-gray-700">Hire Range</div>
                                        <div className="text-gray-900 flex items-center gap-2">
                                            <FaRupeeSign className="text-green-500" />
                                            {profileData.hireRange?.min ? 
                                                formatCurrency(profileData.hireRange.min, profileData.hireRange.currency) 
                                                : 'N/A'}
                                            {profileData.hireRange?.max && (
                                                <>
                                                    <span>to</span>
                                                    {formatCurrency(profileData.hireRange.max, profileData.hireRange.currency)}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {profileData.longBio && (
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium text-gray-700">Long Bio</div>
                                            <div className="text-gray-900 text-sm">{profileData.longBio}</div>
                                        </div>
                                    )}

                                    {profileData.tags && profileData.tags.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                                <FaTags /> Tags
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {profileData.tags.map((tag, index) => (
                                                    <span 
                                                        key={index} 
                                                        className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </SectionCard>

                            {/* Gig Experience Card */}
                            <SectionCard 
                                title="Gig Experience" 
                                icon={FaCalendar}
                                count={getGigExperience().length}
                            >
                                {getGigExperience().length > 0 ? (
                                    <div className="space-y-3">
                                        {getGigExperience().slice(0, 3).map((exp, index) => (
                                            <div key={exp.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                                                {exp.eventPhoto && (
                                                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                                        <img 
                                                            src={exp.eventPhoto} 
                                                            alt={exp.eventName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-800">{exp.eventName}</div>
                                                    <div className="text-sm text-gray-600 flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-xs" />
                                                        {exp.location}
                                                    </div>
                                                    {exp.description && (
                                                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                            {exp.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {getGigExperience().length > 3 && (
                                            <div className="text-center text-sm text-gray-500">
                                                + {getGigExperience().length - 3} more experiences
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-4">
                                        No gig experiences added
                                    </div>
                                )}
                            </SectionCard>

                            {/* My Works Card */}
                            <SectionCard 
                                title="My Works" 
                                icon={FaFileAudio}
                                count={getMyWorks().length}
                            >
                                {getMyWorks().length > 0 ? (
                                    <div className="space-y-2">
                                        {getMyWorks().slice(0, 3).map((work, index) => (
                                            <div key={work.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                                <WorkTypeIcon type={work.type} />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-800">{work.sampleName}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {work.dateOfRelease && new Date(work.dateOfRelease).toLocaleDateString()}
                                                        {work.label && ` • ${work.label}`}
                                                        {work.isTopWork && (
                                                            <span className="ml-2 text-yellow-600">
                                                                <FaStar className="inline mr-1" /> Top Work
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {getMyWorks().length > 3 && (
                                            <div className="text-center text-sm text-gray-500">
                                                + {getMyWorks().length - 3} more works
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-4">
                                        No works added
                                    </div>
                                )}
                            </SectionCard>
                        </div>

                        {/* Right Column - Additional Info */}
                        <div className="space-y-6">
                            {/* Theme Card */}
                            <SectionCard title="Theme" icon={FaPalette}>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-6 h-6 rounded border"
                                            style={{ backgroundColor: epk.theme?.primaryColor || '#000000' }}
                                        ></div>
                                        <span className="text-sm">Primary: {epk.theme?.primaryColor || '#000000'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-6 h-6 rounded border"
                                            style={{ backgroundColor: epk.theme?.backgroundColor || '#5C5C5C' }}
                                        ></div>
                                        <span className="text-sm">Background: {epk.theme?.backgroundColor || '#5C5C5C'}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Gradient: {epk.theme?.useGradient ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>
                            </SectionCard>

                            {/* Media Assets Card */}
                            <SectionCard 
                                title="Media Assets" 
                                icon={FaImage}
                                count={getMediaAssets().length}
                            >
                                {getMediaAssets().length > 0 ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        {getMediaAssets().slice(0, 6).map((asset, index) => (
                                            <div key={asset.id} className="aspect-square rounded overflow-hidden bg-gray-100">
                                                {asset.type === 'image' ? (
                                                    <img 
                                                        src={asset.url} 
                                                        alt={`Media ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                        <FaFileVideo className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {getMediaAssets().length > 6 && (
                                            <div className="col-span-3 text-center text-xs text-gray-500">
                                                + {getMediaAssets().length - 6} more assets
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-4">
                                        No media assets
                                    </div>
                                )}
                            </SectionCard>

                            {/* Artist Crew Card */}
                            <SectionCard 
                                title="Artist Crew" 
                                icon={FaUsers}
                                count={getArtistCrew().length}
                            >
                                {getArtistCrew().length > 0 ? (
                                    <div className="space-y-2">
                                        {getArtistCrew().slice(0, 3).map((crew, index) => (
                                            <div key={crew.id} className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                                    {crew.image ? (
                                                        <img 
                                                            src={crew.image} 
                                                            alt={crew.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <FaUserFriends className="text-gray-400 text-sm" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">{crew.name}</div>
                                                    <div className="text-xs text-gray-500">{crew.role}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {getArtistCrew().length > 3 && (
                                            <div className="text-center text-xs text-gray-500">
                                                + {getArtistCrew().length - 3} more crew members
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-4">
                                        No crew members
                                    </div>
                                )}
                            </SectionCard>

                            {/* Artist Band Card */}
                            <SectionCard 
                                title="Artist Band" 
                                icon={FaUserFriends}
                                count={getArtistBand().length}
                            >
                                {getArtistBand().length > 0 ? (
                                    <div className="space-y-2">
                                        {getArtistBand().slice(0, 3).map((member, index) => (
                                            <div key={member.id} className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                                    {member.image ? (
                                                        <img 
                                                            src={member.image} 
                                                            alt={member.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <FaUserFriends className="text-gray-400 text-sm" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">{member.name}</div>
                                                    <div className="text-xs text-gray-500">{member.role}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {getArtistBand().length > 3 && (
                                            <div className="text-center text-xs text-gray-500">
                                                + {getArtistBand().length - 3} more band members
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-4">
                                        No band members
                                    </div>
                                )}
                            </SectionCard>

                            {/* Affiliations Card */}
                            <SectionCard 
                                title="Affiliations" 
                                icon={FaBriefcase}
                                count={getAffiliations().length}
                            >
                                {getAffiliations().length > 0 ? (
                                    <div className="space-y-2">
                                        {getAffiliations().slice(0, 3).map((aff, index) => (
                                            <div key={aff.id} className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                                                    {aff.image ? (
                                                        <img 
                                                            src={aff.image} 
                                                            alt={aff.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <FaBriefcase className="text-gray-400 text-sm" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">{aff.name}</div>
                                                    <div className="text-xs text-gray-500">{aff.role || 'Member'}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {getAffiliations().length > 3 && (
                                            <div className="text-center text-xs text-gray-500">
                                                + {getAffiliations().length - 3} more affiliations
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-4">
                                        No affiliations
                                    </div>
                                )}
                            </SectionCard>

                            {/* Timestamps Card */}
                            <SectionCard title="Timestamps" icon={FaCalendar}>
                                <div className="space-y-2">
                                    <div className="text-sm">
                                        <div className="text-gray-500">Created</div>
                                        <div className="text-gray-800">{formatDate(epk.createdAt)}</div>
                                    </div>
                                    <div className="text-sm">
                                        <div className="text-gray-500">Updated</div>
                                        <div className="text-gray-800">{formatDate(epk.updatedAt)}</div>
                                    </div>
                                    {epk.publishedAt && (
                                        <div className="text-sm">
                                            <div className="text-gray-500">Published</div>
                                            <div className="text-gray-800">{formatDate(epk.publishedAt)}</div>
                                        </div>
                                    )}
                                </div>
                            </SectionCard>

                            {/* EPK Score Card */}
                            {epk.epkScore && (
                                <SectionCard title="EPK Score" icon={FaStar}>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Overall Score</span>
                                            <span className={`text-lg font-bold ${
                                                epk.epkScore.overall >= 80 ? 'text-green-600' :
                                                epk.epkScore.overall >= 60 ? 'text-blue-600' :
                                                epk.epkScore.overall >= 40 ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                                {epk.epkScore.overall}/100
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            {Object.entries(epk.epkScore.perSection || {}).map(([section, score]) => (
                                                <div key={section} className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-500 capitalize">{section.replace('-', ' ')}</span>
                                                    <span className={`font-medium ${
                                                        score >= 80 ? 'text-green-600' :
                                                        score >= 60 ? 'text-blue-600' :
                                                        score >= 40 ? 'text-yellow-600' :
                                                        'text-red-600'
                                                    }`}>
                                                        {score}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </SectionCard>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">{getGigExperience().length}</div>
                                <div className="text-xs text-gray-500">Experiences</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">{getMyWorks().length}</div>
                                <div className="text-xs text-gray-500">Works</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">{getMediaAssets().length}</div>
                                <div className="text-xs text-gray-500">Media Assets</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">{getArtistCrew().length + getArtistBand().length}</div>
                                <div className="text-xs text-gray-500">Team Members</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">{getAffiliations().length}</div>
                                <div className="text-xs text-gray-500">Affiliations</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">{profileData.tags?.length || 0}</div>
                                <div className="text-xs text-gray-500">Tags</div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    {profileData.socialMedia && Object.keys(profileData.socialMedia).length > 0 && (
                        <div className="mt-6 bg-white rounded-lg border p-4">
                            <h3 className="font-semibold text-gray-800 mb-3">Social Media Links</h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(profileData.socialMedia).map(([platform, url]) => (
                                    url && (
                                        <a
                                            key={platform}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm"
                                        >
                                            <FaExternalLinkAlt className="text-xs" />
                                            {platform}
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t px-6 py-4">
                    <div className="flex justify-end gap-3">
                        <a
                            href={`/epk/${epk.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <FaEye /> View Live EPK
                        </a>
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

export default EPKDetail;