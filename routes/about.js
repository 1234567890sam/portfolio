const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const About = require('../models/About');
const auth = require('../middleware/auth');

const fallbackDb = require('../utils/fallbackDb');

// @route   GET /api/about
// @desc    Get about content
// @access  Public
router.get('/', async (req, res) => {
    try {
        let about;
        if (mongoose.connection.readyState === 1) {
            about = await About.findOne();
        }

        // If no about document exists, create a default one
        if (!about) {
            const defaultData = fallbackDb.getAbout();
            about = new About(defaultData);
            try {
                if (mongoose.connection.readyState === 1) {
                    await about.save();
                }
            } catch (saveErr) {
                console.warn('Could not save default about document to database:', saveErr.message);
            }
        }

        res.json(about);
    } catch (error) {
        console.warn('Database offline or query failed. Serving fallback about content:', error.message);
        res.json(fallbackDb.getAbout());
    }
});

// @route   PUT /api/about
// @desc    Update about content
// @access  Protected
router.put('/', auth, async (req, res) => {
    try {
        const { bio, profileImage, socialLinks, resumeUrl, experience, education, certifications, stats } = req.body;

        // Always sync with fallback database backup
        fallbackDb.saveAbout(req.body);

        if (mongoose.connection.readyState !== 1) {
            return res.json({ message: 'About content updated successfully (offline backup mode)', about: req.body });
        }

        // Find and update, or create if doesn't exist
        let about = await About.findOne();

        if (!about) {
            about = new About({ bio, profileImage, socialLinks, resumeUrl, experience, education, certifications, stats });
        } else {
            about.bio = bio !== undefined ? bio : about.bio;
            about.profileImage = profileImage !== undefined ? profileImage : about.profileImage;
            about.socialLinks = socialLinks !== undefined ? socialLinks : about.socialLinks;
            about.resumeUrl = resumeUrl !== undefined ? resumeUrl : about.resumeUrl;
            about.experience = experience !== undefined ? experience : about.experience;
            about.education = education !== undefined ? education : about.education;
            about.certifications = certifications !== undefined ? certifications : about.certifications;
            about.stats = stats !== undefined ? stats : about.stats;
        }

        await about.save();
        res.json({ message: 'About content updated successfully', about });
    } catch (error) {
        console.error('Update about error:', error);
        // If updating MongoDB fails, but we successfully saved to local file:
        res.json({ message: 'About content updated successfully (offline backup mode)', about: req.body });
    }
});

module.exports = router;
