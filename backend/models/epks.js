const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
    primaryColor: { type: String, default: "#000000" },
    textColor: { type: String, default: "#FFFFFF" },
    bioTextColor: { type: String, default: "#FFFFFF" },
    backgroundColor: { type: String, default: "#5C5C5C" },
    gradientPresetId: { type: String, default: "mono-dark" },
    useGradient: { type: Boolean, default: true },
    resolved: {
        primary: { type: String },
        text: { type: String },
        bioText: { type: String },
        background: { type: String }
    }
}, { _id: false });

const heroDataSchema = new mongoose.Schema({
    mode: { type: String, default: "left-image" },
    imageShape: { type: String, default: "square" },
    useGradient: { type: Boolean, default: false },
    gradientPresetId: { type: String, default: "teal-sunset" },
    buttonLinkMode: { type: String, default: "section" },
    buttonSectionId: { type: String },
    buttonTarget: { type: String, default: "internal" },
    title: { type: String },
    content: { type: String },
    stageName: { type: String },
    artForm: { type: String },
    backgroundColor: { type: String },
    textColor: { type: String },
    shortBio: { type: String },
    primaryColor: { type: String },
    theme: themeSchema,
    buttonText: { type: String },
    buttonLink: { type: String },
    image: { type: String },
    backgroundImage: { type: String }
}, { _id: false });

const profileStatsDataSchema = new mongoose.Schema({
    primaryColor: { type: String },
    backgroundColor: { type: String },
    useGradient: { type: Boolean, default: false },
    theme: themeSchema,
    artStyle: { type: String },
    longBio: { type: String },
    socialMedia: {
        instagram: { type: String },
        spotify: { type: String },
        youtube: { type: String },
        soundcloud: { type: String },
        tiktok: { type: String },
        patreon: { type: String },
        facebook: { type: String },
        linkedin: { type: String }
    },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    sends: { type: Number, default: 0 },
    epkViews: { type: Number, default: 0 },
    experienceYears: { type: Number, default: 0 },
    hireRange: {
        min: { type: Number, default: 20000 },
        max: { type: Number },
        currency: { type: String, default: "INR" }
    },
    gigsCount: { type: Number },
    countriesTravelledCount: { type: Number },
    citiesTravelledCount: { type: Number }
}, { _id: false });

const experienceSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    location: { type: String, required: true },
    id: { type: String, required: true },
    eventPhoto: { type: String },
    eventDate: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    description: { type: String }
}, { _id: false });

const gigExperienceDataSchema = new mongoose.Schema({
    primaryColor: { type: String },
    backgroundColor: { type: String },
    useGradient: { type: Boolean, default: true },
    theme: themeSchema,
    experiences: [experienceSchema],
    textColor: { type: String },
    bioTextColor: { type: String },
    gradientPresetId: { type: String }
}, { _id: false });

const workSampleSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ["audio", "video", "image", "text"], 
        default: "audio" 
    },
    sampleName: { type: String, required: true },
    dateOfRelease: { type: String },
    label: { type: String },
    isTopWork: { type: Boolean, default: false },
    id: { type: String, required: true },
    thumbnail: { type: String },
    url: { type: String },
    content: { type: String }
}, { _id: false });

const myWorksDataSchema = new mongoose.Schema({
    primaryColor: { type: String },
    backgroundColor: { type: String },
    useGradient: { type: Boolean, default: true },
    theme: themeSchema,
    works: [workSampleSchema],
    textColor: { type: String },
    bioTextColor: { type: String },
    gradientPresetId: { type: String }
}, { _id: false });

const mediaAssetSchema = new mongoose.Schema({
    type: { type: String, enum: ["image", "video"], required: true },
    url: { type: String, required: true },
    id: { type: String, required: true },
    thumbnail: { type: String },
    title: { type: String },
    description: { type: String }
}, { _id: false });

const mediaAssetsDataSchema = new mongoose.Schema({
    primaryColor: { type: String },
    backgroundColor: { type: String },
    useGradient: { type: Boolean, default: true },
    theme: themeSchema,
    title: { type: String },
    assets: [mediaAssetSchema],
    textColor: { type: String },
    bioTextColor: { type: String },
    gradientPresetId: { type: String }
}, { _id: false });

const crewMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    id: { type: String, required: true },
    image: { type: String },
    epkLink: { type: String },
    description: { type: String }
}, { _id: false });

const artistCrewDataSchema = new mongoose.Schema({
    title: { type: String, default: "Dream Crew" },
    crewMembers: [crewMemberSchema],
    backgroundColor: { type: String },
    textColor: { type: String },
    primaryColor: { type: String },
    bioTextColor: { type: String },
    useGradient: { type: Boolean, default: false }
}, { _id: false });

const artistBandDataSchema = new mongoose.Schema({
    title: { type: String, default: "Dream Band" },
    crewMembers: [crewMemberSchema],
    backgroundColor: { type: String },
    textColor: { type: String },
    primaryColor: { type: String },
    bioTextColor: { type: String },
    useGradient: { type: Boolean, default: false }
}, { _id: false });

const affiliationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String },
    type: { type: String, default: "other" },
    id: { type: String, required: true },
    image: { type: String }
}, { _id: false });

const affiliationsDataSchema = new mongoose.Schema({
    primaryColor: { type: String },
    backgroundColor: { type: String },
    useGradient: { type: Boolean, default: true },
    theme: themeSchema,
    title: { type: String },
    affiliations: [affiliationSchema],
    sectionTitle: { type: String },
    heading: { type: String },
    headingTitle: { type: String },
    textColor: { type: String },
    bioTextColor: { type: String },
    gradientPresetId: { type: String }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true,
        enum: [
            "hero", "profile-stats", "gig-experience", "my-works", 
            "media-assets", "artist-crew", "artist-band", "affiliations", "endorsements"
        ] 
    },
    type: { 
        type: String, 
        required: true,
        enum: [
            "hero", "profile-stats", "gig-experience", "my-works", 
            "media-assets", "artist-crew", "artist-band", "affiliations", "endorsements"
        ] 
    },
    order: { type: Number, required: true },
    data: mongoose.Schema.Types.Mixed
}, { _id: false });

const epkScoreSchema = new mongoose.Schema({
    last: { type: Number, default: 0 },
    overall: { type: Number, default: 0 },
    perSection: {
        hero: { type: Number, default: 0 },
        profileStats: { type: Number, default: 0 },
        gigExperience: { type: Number, default: 0 },
        myWorks: { type: Number, default: 0 },
        mediaAssets: { type: Number, default: 0 },
        artistCrew: { type: Number, default: 0 },
        artistBand: { type: Number, default: 0 },
        affiliations: { type: Number, default: 0 },
        endorsements: { type: Number, default: 0 }
    },
    updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const epkSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    artistName: { type: String, required: true },
    artistType: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    theme: themeSchema,
    sections: [sectionSchema],
    isPublished: { type: Boolean, default: false },
    seoEnabled: { type: Boolean, default: true },
    analyticsEnabled: { type: Boolean, default: true },
    artistMode: { 
        type: String, 
        enum: ["solo", "group", "duo"], 
        default: "solo" 
    },
    managedBy: { 
        type: String, 
        enum: ["artist", "manager"], 
        default: "artist" 
    },
    managerPhone: { type: String },
    epkScore: epkScoreSchema,
    publishedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("EPK", epkSchema);