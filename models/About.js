const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    bio: {
        type: String,
        required: true,
        default: 'Welcome to my portfolio!'
    },
    profileImage: {
        type: String,
        default: '/uploads/profile.jpg'
    },
    profileImageSecondary: {
        type: String,
        default: '/uploads/profile_secondary.jpg'
    },
    socialLinks: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        email: { type: String, default: '' },
        instagram: { type: String, default: '' },
        whatsapp: { type: String, default: '' }
    },
    resumeUrl: {
        type: String,
        default: ''
    },
    experience: {
        years: { type: String, default: '2+' },
        label: { type: String, default: 'Years of building real-world projects' }
    },
    education: [{
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        year: { type: String, required: true },
        icon: { type: String, default: 'fas fa-graduation-cap' }
    }],
    certifications: [{
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        icon: { type: String, default: 'fas fa-certificate' }
    }],
    stats: {
        completed: { type: String, default: '15+' }
    },
    currentFocus: {
        type: String,
        default: 'Zero-Trust Architecture & Rust'
    },
    availabilityStatus: {
        type: String,
        default: 'Available'
    },
    availabilityLabel: {
        type: String,
        default: 'Open to Work'
    },
    location: {
        type: String,
        default: 'Pune, IN'
    },
    replyTime: {
        type: String,
        default: '< 12h'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);
