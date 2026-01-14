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

// Update admin credentials
const updateAdmin = async () => {
    try {
        // New strong credentials
        const newUsername = 'msaadshaikh';
        const newEmail = 'work.msaad@gmail.com';
        const newPassword = 'Saad@Portfolio2024!'; // Strong password

        // Find existing admin
        const admin = await Admin.findOne();

        if (!admin) {
            console.log('❌ No admin found. Run npm run seed first!');
            process.exit(1);
        }

        // Update credentials
        admin.username = newUsername;
        admin.email = newEmail;
        admin.password = newPassword; // Will be hashed by pre-save hook

        await admin.save();

        console.log('✅ Admin credentials updated successfully!');
        console.log('');
        console.log('📧 New Username:', newUsername);
        console.log('📧 New Email:', newEmail);
        console.log('🔑 New Password:', newPassword);
        console.log('');
        console.log('⚠️  IMPORTANT: Save these credentials securely!');
        console.log('⚠️  Change password again after deployment!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating admin:', error);
        process.exit(1);
    }
};

updateAdmin();
