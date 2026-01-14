const express = require('express');
const router = express.Router();
const About = require('../models/About');
const auth = require('../middleware/auth');

// @route   GET /api/about
// @desc    Get about content
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Get the first (and should be only) about document
        let about = await About.findOne();

        // If no about document exists, create a default one
        if (!about) {
            about = new About({
                bio: 'Welcome to my portfolio! I\'m a passionate developer creating amazing digital experiences.',
                profileImage: '/uploads/profile.jpg',
                socialLinks: {
                    github: '',
                    linkedin: '',
                    twitter: '',
                    email: '',
                    instagram: ''
                }
            });
            await about.save();
        }

        res.json(about);
    } catch (error) {
        console.error('Get about error:', error);
        res.status(500).json({ error: 'Server error fetching about content' });
    }
});

// @route   PUT /api/about
// @desc    Update about content
// @access  Protected
router.put('/', auth, async (req, res) => {
    try {
        const { bio, profileImage, socialLinks, resumeUrl } = req.body;

        // Find and update, or create if doesn't exist
        let about = await About.findOne();

        if (!about) {
            about = new About({ bio, profileImage, socialLinks, resumeUrl });
        } else {
            about.bio = bio || about.bio;
            about.profileImage = profileImage || about.profileImage;
            about.socialLinks = socialLinks || about.socialLinks;
            about.resumeUrl = resumeUrl !== undefined ? resumeUrl : about.resumeUrl;
        }

        await about.save();
        res.json({ message: 'About content updated successfully', about });
    } catch (error) {
        console.error('Update about error:', error);
        res.status(500).json({ error: 'Server error updating about content' });
    }
});

module.exports = router;
