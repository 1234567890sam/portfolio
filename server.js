require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Fix for MongoDB SSL/TLS issues with newer Node.js versions
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Disable Mongoose query buffering globally so offline/disconnected queries fail fast
mongoose.set('bufferCommands', false);

// MongoDB Connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false
    })
        .then(() => console.log('✅ MongoDB Connected Successfully'))
        .catch(err => {
            console.error('❌ MongoDB Connection Error:', err.message);
            console.warn('⚠️  Running without database – serving local fallback data.');
        });
} else {
    console.warn('⚠️  MONGODB_URI environment variable is missing.');
    console.warn('⚠️  Running without database – serving local fallback data.');
}

// Database connection assurance middleware for serverless/cold starts
app.use('/api', require('./middleware/db'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/about', require('./routes/about'));
app.use('/api/upload', require('./routes/upload'));

// Favicon route to handle browser requests and avoid 404 console errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Admin panel: http://localhost:${PORT}/admin`);
});

module.exports = app;
