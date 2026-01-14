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
        instagram: { type: String, default: '' }
    },
    resumeUrl: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);
