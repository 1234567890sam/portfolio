require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    serverSelectionTimeoutMS: 5000
})
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// Create default admin
const createAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            console.log('⚠️  Admin already exists. Skipping seed.');
            process.exit(0);
        }

        // Create new admin
        const admin = new Admin({
            username: 'admin',
            email: 'admin@portfolio.com',
            password: 'admin123' // Change this password after first login!
        });

        await admin.save();
        console.log('✅ Default admin created successfully!');
        console.log('📧 Username: admin');
        console.log('🔑 Password: admin123');
        console.log('⚠️  Please change the password after first login!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
