const mongoose = require('mongoose');

const ensureDbConnected = async (req, res, next) => {
    // If not connected (0 = disconnected, 2 = connecting, 3 = disconnecting)
    if (mongoose.connection.readyState !== 1) {
        try {
            if (process.env.MONGODB_URI) {
                await mongoose.connect(process.env.MONGODB_URI, {
                    serverSelectionTimeoutMS: 5000,
                    bufferCommands: false
                });
            }
        } catch (err) {
            console.error('❌ Database connection middleware error:', err.message);
        }
    }
    next();
};

module.exports = ensureDbConnected;
