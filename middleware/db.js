const mongoose = require('mongoose');

const ensureDbConnected = async (req, res, next) => {
    const state = mongoose.connection.readyState;
    
    // If disconnected (0), initiate connection and wait
    if (state === 0) {
        try {
            if (process.env.MONGODB_URI) {
                await mongoose.connect(process.env.MONGODB_URI, {
                    tls: true,
                    tlsAllowInvalidCertificates: false,
                    tlsAllowInvalidHostnames: false,
                    serverSelectionTimeoutMS: 5000,
                    bufferCommands: false
                });
            }
        } catch (err) {
            console.error('❌ Database connection middleware error:', err.message);
        }
    } 
    // If connecting (2), wait for the active connection to establish
    else if (state === 2) {
        try {
            await mongoose.connection.asPromise();
        } catch (err) {
            console.error('❌ Error waiting for DB connection:', err.message);
        }
    }
    
    next();
};

module.exports = ensureDbConnected;
