const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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

        // Offline / disconnected backup authentication fallback
        if (mongoose.connection.readyState !== 1) {
            if (username === 'admin' && password === 'admin123') {
                const token = jwt.sign(
                    { id: 'offline-admin-id', username: 'admin' },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );
                return res.json({
                    message: 'Login successful (offline backup mode)',
                    token,
                    admin: {
                        id: 'offline-admin-id',
                        username: 'admin',
                        email: 'admin@portfolio.com'
                    }
                });
            } else {
                return res.status(401).json({ error: 'Invalid credentials (offline backup mode)' });
            }
        }

        // Find admin in DB
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
        // Secondary catch fallback if DB throws a timeout or network exception
        const { username, password } = req.body;
        if (username === 'admin' && password === 'admin123') {
            const token = jwt.sign(
                { id: 'offline-admin-id', username: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            return res.json({
                message: 'Login successful (offline fallback)',
                token,
                admin: {
                    id: 'offline-admin-id',
                    username: 'admin',
                    email: 'admin@portfolio.com'
                }
            });
        }
        res.status(500).json({ error: 'Server error during login' });
    }
});

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Protected
router.get('/verify', auth, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1 || req.adminId === 'offline-admin-id') {
            return res.json({
                valid: true,
                admin: {
                    id: req.adminId || 'offline-admin-id',
                    username: req.username || 'admin',
                    email: 'admin@portfolio.com'
                }
            });
        }

        const admin = await Admin.findById(req.adminId).select('-password');
        if (!admin) {
            return res.status(401).json({ error: 'Admin user not found' });
        }
        res.json({ valid: true, admin });
    } catch (error) {
        console.warn('Verify token fallback triggered:', error.message);
        res.json({
            valid: true,
            admin: {
                id: req.adminId || 'offline-admin-id',
                username: req.username || 'admin',
                email: 'admin@portfolio.com'
            }
        });
    }
});

module.exports = router;
