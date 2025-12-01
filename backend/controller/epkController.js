const EPK = require("../models/epks");
const mongoose = require("mongoose");

// Default image URLs
const DEFAULT_IMAGES = {
    heroImage: "https://app.dreamstage.tech/defaults/hero-image.webp",
    backgroundImage: "https://app.dreamstage.tech/defaults/background-image.webp",
    eventPhoto: "https://app.dreamstage.tech/defaults/event-photo.webp",
    workThumbnail: "https://app.dreamstage.tech/defaults/work-thumbnail.webp",
    mediaAsset: "https://app.dreamstage.tech/defaults/media-asset.webp",
    crewMember: "https://app.dreamstage.tech/defaults/crew-member.webp",
    affiliation: "https://app.dreamstage.tech/defaults/affiliation.webp"
};

// Helper function to generate UUID
const generateUUID = () => require('crypto').randomUUID();

// Helper function to generate slug
const generateSlug = (artistName) => {
    const baseSlug = artistName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
    const uniqueId = require('crypto').randomBytes(4).toString('hex');
    return `${uniqueId}/${baseSlug}`;
};

// Sample data for sections
const SAMPLE_EXPERIENCES = [
    {
        id: generateUUID(),
        eventName: "Monsoon Festival 2023",
        location: "Bangalore, India",
        eventPhoto: DEFAULT_IMAGES.eventPhoto,
        eventDate: "2023-07-15",
        startDate: "2023-07-15",
        endDate: "2023-07-17",
        description: "Headlined the main stage at India's largest independent music festival."
    },
    {
        id: generateUUID(),
        eventName: "NH7 Weekender",
        location: "Pune, India",
        eventPhoto: DEFAULT_IMAGES.eventPhoto,
        eventDate: "2022-12-03",
        startDate: "2022-12-03",
        endDate: "2022-12-04",
        description: "Performed on the Bacardi Arena to a crowd of 5000+ music enthusiasts."
    }
];

const SAMPLE_WORKS = [
    {
        id: generateUUID(),
        type: "audio",
        sampleName: "Monsoon Melodies",
        dateOfRelease: "2023-06-15",
        label: "Independent",
        isTopWork: true,
        thumbnail: DEFAULT_IMAGES.workThumbnail,
        url: "https://example.com/monsoon-melodies",
        content: "Our debut EP featuring 5 original tracks inspired by the Indian monsoon."
    },
    {
        id: generateUUID(),
        type: "video",
        sampleName: "Live at Blue Frog",
        dateOfRelease: "2023-03-22",
        label: "Independent",
        isTopWork: true,
        thumbnail: DEFAULT_IMAGES.workThumbnail,
        url: "https://example.com/live-bluefrog",
        content: "Full length live performance video from our sold-out show."
    },
    {
        id: generateUUID(),
        type: "audio",
        sampleName: "Urban Echoes",
        dateOfRelease: "2022-11-10",
        label: "Independent",
        isTopWork: false,
        thumbnail: DEFAULT_IMAGES.workThumbnail,
        url: "https://example.com/urban-echoes",
        content: "Single exploring the sounds of city life through folk instrumentation."
    }
];

const SAMPLE_MEDIA_ASSETS = [
    {
        id: generateUUID(),
        type: "image",
        url: DEFAULT_IMAGES.mediaAsset,
        thumbnail: DEFAULT_IMAGES.mediaAsset,
        title: "Stage Performance",
        description: "High quality stage photo from our recent concert."
    },
    {
        id: generateUUID(),
        type: "image",
        url: DEFAULT_IMAGES.mediaAsset,
        thumbnail: DEFAULT_IMAGES.mediaAsset,
        title: "Band Portrait",
        description: "Professional band portrait for media use."
    },
    {
        id: generateUUID(),
        type: "video",
        url: DEFAULT_IMAGES.mediaAsset,
        thumbnail: DEFAULT_IMAGES.mediaAsset,
        title: "Behind the Scenes",
        description: "Exclusive behind-the-scenes footage from our studio session."
    }
];

const SAMPLE_CREW_MEMBERS = [
    {
        id: generateUUID(),
        name: "Alex Johnson",
        role: "Guitarist & Vocalist",
        image: DEFAULT_IMAGES.crewMember,
        epkLink: "https://dreamstage.tech/alexjohnson",
        description: "Lead guitarist and founding member with 10+ years of experience."
    },
    {
        id: generateUUID(),
        name: "Maya Sharma",
        role: "Bassist & Backing Vocals",
        image: DEFAULT_IMAGES.crewMember,
        epkLink: "https://dreamstage.tech/mayasharma",
        description: "Versatile bassist with background in jazz and classical music."
    }
];

const SAMPLE_BAND_MEMBERS = [
    {
        id: generateUUID(),
        name: "Raj Malhotra",
        role: "Drummer & Percussionist",
        image: DEFAULT_IMAGES.crewMember,
        epkLink: "https://dreamstage.tech/rajmalhotra",
        description: "Session drummer with expertise in multiple percussion instruments."
    },
    {
        id: generateUUID(),
        name: "Priya Patel",
        role: "Keyboardist & Synth Artist",
        image: DEFAULT_IMAGES.crewMember,
        epkLink: "https://dreamstage.tech/priyapatel",
        description: "Classically trained pianist with modern electronic influences."
    }
];

const SAMPLE_AFFILIATIONS = [
    {
        id: generateUUID(),
        name: "Fender Musical Instruments",
        role: "Endorsed Artist",
        type: "brand",
        image: DEFAULT_IMAGES.affiliation
    },
    {
        id: generateUUID(),
        name: "Independent Music Association",
        role: "Member",
        type: "organization",
        image: DEFAULT_IMAGES.affiliation
    },
    {
        id: generateUUID(),
        name: "Universal Music India",
        role: "Collaborating Partner",
        type: "label",
        image: DEFAULT_IMAGES.affiliation
    }
];

// Default sections structure
const DEFAULT_SECTIONS = [
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
            image: DEFAULT_IMAGES.heroImage,
            backgroundImage: DEFAULT_IMAGES.backgroundImage
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

// Get all EPKs with pagination and search
async function getAllEPKs(req, res) {
    try {
        const { 
            page = 1, 
            limit = 100, 
            search = "", 
            sortBy = "createdAt", 
            sortOrder = "desc",
            artistType = "",
            status = "",
            artistMode = "",
            minScore = 0
        } = req.query;
        
        const query = {};
        
        if (search) {
            query.$or = [
                { artistName: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
                { 'sections.data.stageName': { $regex: search, $options: "i" } }
            ];
        }

        if (artistType) {
            query.artistType = artistType;
        }

        if (status) {
            if (status === 'published') {
                query.isPublished = true;
            } else if (status === 'draft') {
                query.isPublished = false;
            }
        }

        if (artistMode) {
            query.artistMode = artistMode;
        }

        if (minScore) {
            query['epkScore.overall'] = { $gte: parseInt(minScore) };
        }

        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        const epks = await EPK.find(query)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await EPK.countDocuments(query);

        res.json({
            success: true,
            data: epks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Get single EPK by ID
async function getEPKById(req, res) {
    try {
        const epk = await EPK.findById(req.params.id);
        if (!epk) {
            return res.status(404).json({ success: false, message: "EPK not found" });
        }
        res.json({ success: true, data: epk });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Get EPK by slug
async function getEPKBySlug(req, res) {
    try {
        const epk = await EPK.findOne({ slug: req.params.slug });
        if (!epk) {
            return res.status(404).json({ success: false, message: "EPK not found" });
        }
        res.json({ success: true, data: epk });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Create new EPK
async function createEPK(req, res) {
    try {
        const { userId, artistName, artistType, sections = [] } = req.body;
        
        // Generate unique ID and slug
        const id = generateUUID();
        const slug = generateSlug(artistName);

        // Process sections data
        const processedSections = sections.length > 0 ? sections : DEFAULT_SECTIONS.map((section, index) => {
            const sectionData = { ...section };
            
            // Apply default values based on section type
            if (sectionData.type === 'hero') {
                sectionData.data = {
                    ...sectionData.data,
                    stageName: sectionData.data.stageName || artistName,
                    artForm: sectionData.data.artForm || artistType,
                    image: sectionData.data.image || DEFAULT_IMAGES.heroImage,
                    backgroundImage: sectionData.data.backgroundImage || DEFAULT_IMAGES.backgroundImage
                };
            }
            
            return sectionData;
        });

        // Create EPK with default values
        const epkData = {
            id,
            userId,
            artistName,
            artistType,
            slug,
            theme: {
                primaryColor: "#000000",
                textColor: "#FFFFFF",
                bioTextColor: "#FFFFFF",
                backgroundColor: "#5C5C5C",
                gradientPresetId: "mono-dark",
                useGradient: true
            },
            sections: processedSections,
            isPublished: false,
            seoEnabled: true,
            analyticsEnabled: true,
            artistMode: req.body.artistMode || "solo",
            managedBy: req.body.managedBy || "artist",
            managerPhone: req.body.managerPhone || "",
            epkScore: {
                last: 0,
                overall: 0,
                perSection: {
                    hero: 0,
                    profileStats: 0,
                    gigExperience: 0,
                    myWorks: 0,
                    mediaAssets: 0,
                    artistCrew: 0,
                    artistBand: 0,
                    affiliations: 0,
                    endorsements: 0
                },
                updatedAt: new Date()
            }
        };

        const epk = new EPK(epkData);
        await epk.save();
        
        res.status(201).json({ 
            success: true, 
            data: epk,
            message: "EPK created successfully"
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

// Update EPK
async function updateEPK(req, res) {
    try {
        const updates = { ...req.body, updatedAt: Date.now() };
        
        const epk = await EPK.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );
        
        if (!epk) {
            return res.status(404).json({ success: false, message: "EPK not found" });
        }
        
        res.json({ 
            success: true, 
            data: epk,
            message: "EPK updated successfully"
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

// Delete EPK
async function deleteEPK(req, res) {
    try {
        const epk = await EPK.findByIdAndDelete(req.params.id);
        if (!epk) {
            return res.status(404).json({ success: false, message: "EPK not found" });
        }
        res.json({ 
            success: true, 
            message: "EPK deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Bulk operations
async function bulkUpdateEPKs(req, res) {
    try {
        const { ids, updates } = req.body;
        const result = await EPK.updateMany(
            { _id: { $in: ids } },
            { ...updates, updatedAt: Date.now() }
        );
        res.json({ 
            success: true, 
            data: result,
            message: `${result.modifiedCount} EPKs updated`
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function bulkDeleteEPKs(req, res) {
    try {
        const { ids } = req.body;
        const result = await EPK.deleteMany({ _id: { $in: ids } });
        res.json({ 
            success: true, 
            data: result,
            message: `${result.deletedCount} EPKs deleted`
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

// Process section data from Excel row
function processSectionData(section, row) {
    switch(section.type) {
        case 'hero':
            return {
                ...section.data,
                stageName: row.stageName || row.artistName,
                artForm: row.artForm || row.artistType,
                shortBio: row.shortBio || `${row.artistName} - ${row.artistType}`,
                image: row.hero_image || DEFAULT_IMAGES.heroImage,
                backgroundImage: row.hero_backgroundImage || DEFAULT_IMAGES.backgroundImage
            };
        case 'profile-stats':
            return {
                ...section.data,
                artStyle: row.artStyle || "",
                longBio: row.longBio || "",
                experienceYears: parseInt(row.experienceYears) || 0,
                hireRange: {
                    min: parseInt(row.hireRange_min) || 20000,
                    max: parseInt(row.hireRange_max) || null,
                    currency: row.hireRange_currency || "INR"
                },
                gigsCount: parseInt(row.gigsCount) || 0,
                countriesTravelledCount: parseInt(row.countriesTravelledCount) || 0,
                citiesTravelledCount: parseInt(row.citiesTravelledCount) || 0,
                tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : []
            };
        case 'gig-experience':
            // Process gig experiences from Excel
            const experiences = [];
            for (let i = 1; i <= 2; i++) {
                if (row[`gig_experience_${i}_eventName`]) {
                    experiences.push({
                        id: generateUUID(),
                        eventName: row[`gig_experience_${i}_eventName`],
                        location: row[`gig_experience_${i}_location`] || "Not specified",
                        eventPhoto: row[`gig_experience_${i}_eventPhoto`] || DEFAULT_IMAGES.eventPhoto,
                        eventDate: row[`gig_experience_${i}_eventDate`] || "",
                        startDate: row[`gig_experience_${i}_startDate`] || "",
                        endDate: row[`gig_experience_${i}_endDate`] || "",
                        description: row[`gig_experience_${i}_description`] || ""
                    });
                }
            }
            // If no experiences in Excel, use sample data
            return {
                ...section.data,
                experiences: experiences.length > 0 ? experiences : SAMPLE_EXPERIENCES
            };
        case 'my-works':
            // Process works from Excel or use sample
            const works = [];
            for (let i = 1; i <= 3; i++) {
                if (row[`my_works_${i}_sampleName`]) {
                    works.push({
                        id: generateUUID(),
                        type: row[`my_works_${i}_type`] || "audio",
                        sampleName: row[`my_works_${i}_sampleName`],
                        dateOfRelease: row[`my_works_${i}_dateOfRelease`] || "",
                        label: row[`my_works_${i}_label`] || "Independent",
                        isTopWork: row[`my_works_${i}_isTopWork`] === 'true' || false,
                        thumbnail: row[`my_works_${i}_thumbnail`] || DEFAULT_IMAGES.workThumbnail,
                        url: row[`my_works_${i}_url`] || "",
                        content: row[`my_works_${i}_content`] || ""
                    });
                }
            }
            return {
                ...section.data,
                works: works.length > 0 ? works : SAMPLE_WORKS
            };
        case 'media-assets':
            // Process media assets from Excel or use sample
            const assets = [];
            for (let i = 1; i <= 3; i++) {
                if (row[`media_assets_${i}_title`]) {
                    assets.push({
                        id: generateUUID(),
                        type: row[`media_assets_${i}_type`] || "image",
                        url: row[`media_assets_${i}_url`] || DEFAULT_IMAGES.mediaAsset,
                        thumbnail: row[`media_assets_${i}_thumbnail`] || DEFAULT_IMAGES.mediaAsset,
                        title: row[`media_assets_${i}_title`],
                        description: row[`media_assets_${i}_description`] || ""
                    });
                }
            }
            return {
                ...section.data,
                assets: assets.length > 0 ? assets : SAMPLE_MEDIA_ASSETS,
                title: row.media_assets_title || "Media Assets"
            };
        case 'artist-crew':
            // Process crew members from Excel or use sample
            const crewMembers = [];
            for (let i = 1; i <= 2; i++) {
                if (row[`artist_crew_${i}_name`]) {
                    crewMembers.push({
                        id: generateUUID(),
                        name: row[`artist_crew_${i}_name`],
                        role: row[`artist_crew_${i}_role`] || "Crew Member",
                        image: row[`artist_crew_${i}_image`] || DEFAULT_IMAGES.crewMember,
                        epkLink: row[`artist_crew_${i}_epkLink`] || "",
                        description: row[`artist_crew_${i}_description`] || ""
                    });
                }
            }
            return {
                ...section.data,
                crewMembers: crewMembers.length > 0 ? crewMembers : SAMPLE_CREW_MEMBERS,
                title: row.artist_crew_title || "Dream Crew"
            };
        case 'artist-band':
            // Process band members from Excel or use sample
            const bandMembers = [];
            for (let i = 1; i <= 2; i++) {
                if (row[`artist_band_${i}_name`]) {
                    bandMembers.push({
                        id: generateUUID(),
                        name: row[`artist_band_${i}_name`],
                        role: row[`artist_band_${i}_role`] || "Band Member",
                        image: row[`artist_band_${i}_image`] || DEFAULT_IMAGES.crewMember,
                        epkLink: row[`artist_band_${i}_epkLink`] || "",
                        description: row[`artist_band_${i}_description`] || ""
                    });
                }
            }
            return {
                ...section.data,
                crewMembers: bandMembers.length > 0 ? bandMembers : SAMPLE_BAND_MEMBERS,
                title: row.artist_band_title || "Dream Band"
            };
        case 'affiliations':
            // Process affiliations from Excel or use sample
            const affiliations = [];
            for (let i = 1; i <= 3; i++) {
                if (row[`affiliations_${i}_name`]) {
                    affiliations.push({
                        id: generateUUID(),
                        name: row[`affiliations_${i}_name`],
                        role: row[`affiliations_${i}_role`] || "",
                        type: row[`affiliations_${i}_type`] || "other",
                        image: row[`affiliations_${i}_image`] || DEFAULT_IMAGES.affiliation
                    });
                }
            }
            return {
                ...section.data,
                affiliations: affiliations.length > 0 ? affiliations : SAMPLE_AFFILIATIONS,
                title: row.affiliations_title || "Affiliations",
                sectionTitle: row.affiliations_sectionTitle || "Our Partners",
                heading: row.affiliations_heading || "Affiliations & Endorsements",
                headingTitle: row.affiliations_headingTitle || "Brand Associations"
            };
        default:
            return section.data;
    }
}

// Bulk import EPKs from Excel data
async function bulkImportEPKs(req, res) {
    try {
        const { epksData } = req.body;
        
        if (!Array.isArray(epksData)) {
            return res.status(400).json({ 
                success: false, 
                message: "epksData must be an array" 
            });
        }

        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const row of epksData) {
            try {
                // Validate required fields
                if (!row.artistName || !row.artistType) {
                    throw new Error('artistName and artistType are required');
                }

                const id = generateUUID();
                const slug = generateSlug(row.artistName);

                // Create sections with data from Excel row
                const sections = DEFAULT_SECTIONS.map((section, index) => ({
                    ...section,
                    order: index,
                    data: processSectionData(section, row)
                }));

                const epk = new EPK({
                    id,
                    userId: row.userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    artistName: row.artistName,
                    artistType: row.artistType,
                    slug,
                    theme: {
                        primaryColor: row.theme_primaryColor || "#000000",
                        textColor: row.theme_textColor || "#FFFFFF",
                        bioTextColor: row.theme_bioTextColor || "#FFFFFF",
                        backgroundColor: row.theme_backgroundColor || "#5C5C5C",
                        gradientPresetId: row.theme_gradientPresetId || "mono-dark",
                        useGradient: row.theme_useGradient === 'true' || row.theme_useGradient === true || true
                    },
                    sections,
                    isPublished: row.isPublished === 'true' || row.isPublished === true || false,
                    seoEnabled: row.seoEnabled === 'true' || row.seoEnabled === true || true,
                    analyticsEnabled: row.analyticsEnabled === 'true' || row.analyticsEnabled === true || true,
                    artistMode: row.artistMode || "solo",
                    managedBy: row.managedBy || "artist",
                    managerPhone: row.managerPhone || "",
                    epkScore: {
                        last: 0,
                        overall: 0,
                        perSection: {
                            hero: 0,
                            profileStats: 0,
                            gigExperience: 0,
                            myWorks: 0,
                            mediaAssets: 0,
                            artistCrew: 0,
                            artistBand: 0,
                            affiliations: 0,
                            endorsements: 0
                        },
                        updatedAt: new Date()
                    }
                });

                await epk.save();
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    artistName: row.artistName || 'Unknown',
                    error: error.message
                });
            }
        }

        res.json({
            success: true,
            data: results,
            message: `Imported ${results.success} EPKs, ${results.failed} failed`
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

// Toggle publish status
async function togglePublish(req, res) {
    try {
        const epk = await EPK.findById(req.params.id);
        if (!epk) {
            return res.status(404).json({ success: false, message: "EPK not found" });
        }

        epk.isPublished = !epk.isPublished;
        if (epk.isPublished && !epk.publishedAt) {
            epk.publishedAt = new Date();
        }
        epk.updatedAt = new Date();

        await epk.save();

        res.json({
            success: true,
            data: epk,
            message: `EPK ${epk.isPublished ? 'published' : 'unpublished'} successfully`
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

// Get EPK statistics
async function getEPKStats(req, res) {
    try {
        const totalEPKs = await EPK.countDocuments();
        const publishedEPKs = await EPK.countDocuments({ isPublished: true });
        const draftEPKs = await EPK.countDocuments({ isPublished: false });
        
        const artistTypes = await EPK.aggregate([
            { $group: { _id: "$artistType", count: { $sum: 1 } } }
        ]);

        const averageScore = await EPK.aggregate([
            { $group: { _id: null, avgScore: { $avg: "$epkScore.overall" } } }
        ]);

        const recentEPKs = await EPK.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('artistName artistType createdAt epkScore.overall');

        res.json({
            success: true,
            data: {
                totalEPKs,
                publishedEPKs,
                draftEPKs,
                artistTypes,
                averageScore: averageScore[0]?.avgScore || 0,
                recentEPKs
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Export EPKs to Excel/CSV template
async function exportTemplate(req, res) {
    try {
        const template = {
            headers: [
                // Basic Info
                "artistName",
                "artistType",
                "artistMode",
                "managedBy",
                "managerPhone",
                "seoEnabled",
                "analyticsEnabled",
                "isPublished",
                
                // Hero Section
                "stageName",
                "artForm",
                "shortBio",
                "hero_image",
                "hero_backgroundImage",
                
                // Profile Stats
                "artStyle",
                "longBio",
                "experienceYears",
                "hireRange_min",
                "hireRange_max",
                "hireRange_currency",
                "gigsCount",
                "countriesTravelledCount",
                "citiesTravelledCount",
                "tags",
                
                // Gig Experience (2 cards)
                "gig_experience_1_eventName",
                "gig_experience_1_location",
                "gig_experience_1_eventPhoto",
                "gig_experience_1_eventDate",
                "gig_experience_1_startDate",
                "gig_experience_1_endDate",
                "gig_experience_1_description",
                
                "gig_experience_2_eventName",
                "gig_experience_2_location",
                "gig_experience_2_eventPhoto",
                "gig_experience_2_eventDate",
                "gig_experience_2_startDate",
                "gig_experience_2_endDate",
                "gig_experience_2_description",
                
                // My Works (3 samples like Monsoon Drifters)
                "my_works_1_type",
                "my_works_1_sampleName",
                "my_works_1_dateOfRelease",
                "my_works_1_label",
                "my_works_1_isTopWork",
                "my_works_1_thumbnail",
                "my_works_1_url",
                "my_works_1_content",
                
                "my_works_2_type",
                "my_works_2_sampleName",
                "my_works_2_dateOfRelease",
                "my_works_2_label",
                "my_works_2_isTopWork",
                "my_works_2_thumbnail",
                "my_works_2_url",
                "my_works_2_content",
                
                "my_works_3_type",
                "my_works_3_sampleName",
                "my_works_3_dateOfRelease",
                "my_works_3_label",
                "my_works_3_isTopWork",
                "my_works_3_thumbnail",
                "my_works_3_url",
                "my_works_3_content",
                
                // Media Assets (3 assets)
                "media_assets_title",
                "media_assets_1_type",
                "media_assets_1_url",
                "media_assets_1_thumbnail",
                "media_assets_1_title",
                "media_assets_1_description",
                
                "media_assets_2_type",
                "media_assets_2_url",
                "media_assets_2_thumbnail",
                "media_assets_2_title",
                "media_assets_2_description",
                
                "media_assets_3_type",
                "media_assets_3_url",
                "media_assets_3_thumbnail",
                "media_assets_3_title",
                "media_assets_3_description",
                
                // Artist Crew (2 members)
                "artist_crew_title",
                "artist_crew_1_name",
                "artist_crew_1_role",
                "artist_crew_1_image",
                "artist_crew_1_epkLink",
                "artist_crew_1_description",
                
                "artist_crew_2_name",
                "artist_crew_2_role",
                "artist_crew_2_image",
                "artist_crew_2_epkLink",
                "artist_crew_2_description",
                
                // Artist Band (2 members)
                "artist_band_title",
                "artist_band_1_name",
                "artist_band_1_role",
                "artist_band_1_image",
                "artist_band_1_epkLink",
                "artist_band_1_description",
                
                "artist_band_2_name",
                "artist_band_2_role",
                "artist_band_2_image",
                "artist_band_2_epkLink",
                "artist_band_2_description",
                
                // Affiliations (3 items)
                "affiliations_title",
                "affiliations_sectionTitle",
                "affiliations_heading",
                "affiliations_headingTitle",
                
                "affiliations_1_name",
                "affiliations_1_role",
                "affiliations_1_type",
                "affiliations_1_image",
                
                "affiliations_2_name",
                "affiliations_2_role",
                "affiliations_2_type",
                "affiliations_2_image",
                
                "affiliations_3_name",
                "affiliations_3_role",
                "affiliations_3_type",
                "affiliations_3_image",
                
                // Theme
                "theme_primaryColor",
                "theme_textColor",
                "theme_bioTextColor",
                "theme_backgroundColor",
                "theme_gradientPresetId",
                "theme_useGradient"
            ],
            sampleData: {
                // Basic Info
                artistName: "The Monsoon Drifters",
                artistType: "Music Band",
                artistMode: "group",
                managedBy: "manager",
                managerPhone: "+449098087076",
                seoEnabled: "true",
                analyticsEnabled: "true",
                isPublished: "true",
                
                // Hero Section
                stageName: "The Monsoon Drifters",
                artForm: "Music Band",
                shortBio: "A contemporary folk-rock band from Bangalore...",
                hero_image: DEFAULT_IMAGES.heroImage,
                hero_backgroundImage: DEFAULT_IMAGES.backgroundImage,
                
                // Profile Stats
                artStyle: "Folk-inspired Rock",
                longBio: "Born in the creative streets of Bangalore in 2018...",
                experienceYears: "7",
                hireRange_min: "20000",
                hireRange_max: "50000",
                hireRange_currency: "INR",
                gigsCount: "50",
                countriesTravelledCount: "3",
                citiesTravelledCount: "15",
                tags: "FolkRock,Indie,Storytelling,Soulful,Indian Fusion",
                
                // Gig Experience 1
                gig_experience_1_eventName: "Monsoon Festival 2023",
                gig_experience_1_location: "Bangalore, India",
                gig_experience_1_eventPhoto: DEFAULT_IMAGES.eventPhoto,
                gig_experience_1_eventDate: "2023-07-15",
                gig_experience_1_startDate: "2023-07-15",
                gig_experience_1_endDate: "2023-07-17",
                gig_experience_1_description: "Headlined the main stage at India's largest independent music festival.",
                
                // Gig Experience 2
                gig_experience_2_eventName: "NH7 Weekender",
                gig_experience_2_location: "Pune, India",
                gig_experience_2_eventPhoto: DEFAULT_IMAGES.eventPhoto,
                gig_experience_2_eventDate: "2022-12-03",
                gig_experience_2_startDate: "2022-12-03",
                gig_experience_2_endDate: "2022-12-04",
                gig_experience_2_description: "Performed on the Bacardi Arena to a crowd of 5000+ music enthusiasts.",
                
                // My Works 1
                my_works_1_type: "audio",
                my_works_1_sampleName: "Monsoon Melodies",
                my_works_1_dateOfRelease: "2023-06-15",
                my_works_1_label: "Independent",
                my_works_1_isTopWork: "true",
                my_works_1_thumbnail: DEFAULT_IMAGES.workThumbnail,
                my_works_1_url: "https://example.com/monsoon-melodies",
                my_works_1_content: "Our debut EP featuring 5 original tracks inspired by the Indian monsoon.",
                
                // My Works 2
                my_works_2_type: "video",
                my_works_2_sampleName: "Live at Blue Frog",
                my_works_2_dateOfRelease: "2023-03-22",
                my_works_2_label: "Independent",
                my_works_2_isTopWork: "true",
                my_works_2_thumbnail: DEFAULT_IMAGES.workThumbnail,
                my_works_2_url: "https://example.com/live-bluefrog",
                my_works_2_content: "Full length live performance video from our sold-out show.",
                
                // My Works 3
                my_works_3_type: "audio",
                my_works_3_sampleName: "Urban Echoes",
                my_works_3_dateOfRelease: "2022-11-10",
                my_works_3_label: "Independent",
                my_works_3_isTopWork: "false",
                my_works_3_thumbnail: DEFAULT_IMAGES.workThumbnail,
                my_works_3_url: "https://example.com/urban-echoes",
                my_works_3_content: "Single exploring the sounds of city life through folk instrumentation.",
                
                // Media Assets
                media_assets_title: "Media Assets",
                media_assets_1_type: "image",
                media_assets_1_url: DEFAULT_IMAGES.mediaAsset,
                media_assets_1_thumbnail: DEFAULT_IMAGES.mediaAsset,
                media_assets_1_title: "Stage Performance",
                media_assets_1_description: "High quality stage photo from our recent concert.",
                
                media_assets_2_type: "image",
                media_assets_2_url: DEFAULT_IMAGES.mediaAsset,
                media_assets_2_thumbnail: DEFAULT_IMAGES.mediaAsset,
                media_assets_2_title: "Band Portrait",
                media_assets_2_description: "Professional band portrait for media use.",
                
                media_assets_3_type: "video",
                media_assets_3_url: DEFAULT_IMAGES.mediaAsset,
                media_assets_3_thumbnail: DEFAULT_IMAGES.mediaAsset,
                media_assets_3_title: "Behind the Scenes",
                media_assets_3_description: "Exclusive behind-the-scenes footage from our studio session.",
                
                // Artist Crew
                artist_crew_title: "Dream Crew",
                artist_crew_1_name: "Alex Johnson",
                artist_crew_1_role: "Guitarist & Vocalist",
                artist_crew_1_image: DEFAULT_IMAGES.crewMember,
                artist_crew_1_epkLink: "https://dreamstage.tech/alexjohnson",
                artist_crew_1_description: "Lead guitarist and founding member with 10+ years of experience.",
                
                artist_crew_2_name: "Maya Sharma",
                artist_crew_2_role: "Bassist & Backing Vocals",
                artist_crew_2_image: DEFAULT_IMAGES.crewMember,
                artist_crew_2_epkLink: "https://dreamstage.tech/mayasharma",
                artist_crew_2_description: "Versatile bassist with background in jazz and classical music.",
                
                // Artist Band
                artist_band_title: "Dream Band",
                artist_band_1_name: "Raj Malhotra",
                artist_band_1_role: "Drummer & Percussionist",
                artist_band_1_image: DEFAULT_IMAGES.crewMember,
                artist_band_1_epkLink: "https://dreamstage.tech/rajmalhotra",
                artist_band_1_description: "Session drummer with expertise in multiple percussion instruments.",
                
                artist_band_2_name: "Priya Patel",
                artist_band_2_role: "Keyboardist & Synth Artist",
                artist_band_2_image: DEFAULT_IMAGES.crewMember,
                artist_band_2_epkLink: "https://dreamstage.tech/priyapatel",
                artist_band_2_description: "Classically trained pianist with modern electronic influences.",
                
                // Affiliations
                affiliations_title: "Affiliations",
                affiliations_sectionTitle: "Our Partners",
                affiliations_heading: "Affiliations & Endorsements",
                affiliations_headingTitle: "Brand Associations",
                
                affiliations_1_name: "Fender Musical Instruments",
                affiliations_1_role: "Endorsed Artist",
                affiliations_1_type: "brand",
                affiliations_1_image: DEFAULT_IMAGES.affiliation,
                
                affiliations_2_name: "Independent Music Association",
                affiliations_2_role: "Member",
                affiliations_2_type: "organization",
                affiliations_2_image: DEFAULT_IMAGES.affiliation,
                
                affiliations_3_name: "Universal Music India",
                affiliations_3_role: "Collaborating Partner",
                affiliations_3_type: "label",
                affiliations_3_image: DEFAULT_IMAGES.affiliation,
                
                // Theme
                theme_primaryColor: "#000000",
                theme_textColor: "#FFFFFF",
                theme_bioTextColor: "#FFFFFF",
                theme_backgroundColor: "#5C5C5C",
                theme_gradientPresetId: "mono-dark",
                theme_useGradient: "true"
            }
        };

        res.json({
            success: true,
            data: template,
            message: "Template structure generated"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    getAllEPKs,
    getEPKById,
    getEPKBySlug,
    createEPK,
    updateEPK,
    deleteEPK,
    bulkUpdateEPKs,
    bulkDeleteEPKs,
    bulkImportEPKs,
    togglePublish,
    getEPKStats,
    exportTemplate,
    DEFAULT_IMAGES,
    DEFAULT_SECTIONS
};