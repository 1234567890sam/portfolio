const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

const fallbackDb = require('../utils/fallbackDb');

// @route   GET /api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
    try {
        let skills = [];
        if (mongoose.connection.readyState === 1) {
            skills = await Skill.find().sort({ category: 1, order: 1 });
        } else {
            skills = fallbackDb.getSkills();
        }
        res.json(skills);
    } catch (error) {
        console.warn('Database offline or query failed. Serving fallback skills content:', error.message);
        res.json(fallbackDb.getSkills());
    }
});

// @route   POST /api/skills
// @desc    Create new skill
// @access  Protected
router.post('/', auth, async (req, res) => {
    try {
        const { name, category, proficiency, icon, order } = req.body;

        // Add to local fallback database
        const localSkill = fallbackDb.addSkill({ name, category, proficiency, icon, order });

        if (mongoose.connection.readyState !== 1) {
            return res.status(201).json({ message: 'Skill created successfully (offline backup mode)', skill: localSkill });
        }

        const skill = new Skill({
            name,
            category,
            proficiency,
            icon,
            order
        });

        await skill.save();
        res.status(201).json({ message: 'Skill created successfully', skill });
    } catch (error) {
        console.error('Create skill error:', error);
        res.status(500).json({ error: 'Server error creating skill' });
    }
});

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Protected
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, category, proficiency, icon, order } = req.body;

        // Update in local fallback database
        const localSkill = fallbackDb.updateSkill(req.params.id, { name, category, proficiency, icon, order });

        if (mongoose.connection.readyState !== 1) {
            if (!localSkill) {
                return res.status(404).json({ error: 'Skill not found in local backup' });
            }
            return res.json({ message: 'Skill updated successfully (offline backup mode)', skill: localSkill });
        }

        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            { name, category, proficiency, icon, order },
            { new: true, runValidators: true }
        );

        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        res.json({ message: 'Skill updated successfully', skill });
    } catch (error) {
        console.error('Update skill error:', error);
        res.status(500).json({ error: 'Server error updating skill' });
    }
});

// @route   DELETE /api/skills/:id
// @desc    Delete skill
// @access  Protected
router.delete('/:id', auth, async (req, res) => {
    try {
        // Delete from local fallback database
        fallbackDb.deleteSkill(req.params.id);

        if (mongoose.connection.readyState !== 1) {
            return res.json({ message: 'Skill deleted successfully (offline backup mode)' });
        }

        const skill = await Skill.findByIdAndDelete(req.params.id);

        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('Delete skill error:', error);
        res.status(500).json({ error: 'Server error deleting skill' });
    }
});

module.exports = router;
