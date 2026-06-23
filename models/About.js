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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);
