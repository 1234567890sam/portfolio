const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register first admin (can be disabled after first use)
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        // Create new admin
        const admin = new Admin({ username, email, password });
        await admin.save();

        // Generate token
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Admin registered successfully',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Login admin
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find admin
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Protected
router.get('/verify', auth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password');
        res.json({ valid: true, admin });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
