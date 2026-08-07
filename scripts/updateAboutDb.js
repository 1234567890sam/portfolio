require('dotenv').config();
const mongoose = require('mongoose');
const About = require('../models/About');
const fallbackDb = require('../utils/fallbackDb');

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

const updateAboutDb = async () => {
    try {
        // Fetch new social links and education from local fallback db
        const fallbackAbout = fallbackDb.getAbout();
        const newSocials = fallbackAbout.socialLinks;
        const newEducation = fallbackAbout.education;

        // Find existing about record
        let about = await About.findOne();

        if (!about) {
            console.log('ℹ️ No existing About record found. Creating a new one with fallback data...');
            about = new About(fallbackAbout);
        } else {
            console.log('ℹ️ Existing About record found. Updating socialLinks, education, and profile images...');
            about.socialLinks = {
                ...about.socialLinks,
                ...newSocials
            };
            about.education = newEducation;
            about.profileImage = fallbackAbout.profileImage || '/uploads/profile.jpg';
            about.profileImageSecondary = fallbackAbout.profileImageSecondary || '/uploads/profile_secondary.jpg';
        }

        await about.save();

        console.log('✅ About database record updated successfully!');
        console.log('');
        console.log('🔗 GitHub:', about.socialLinks.github);
        console.log('🔗 LinkedIn:', about.socialLinks.linkedin);
        console.log('🔗 Instagram:', about.socialLinks.instagram);
        console.log('✉️ Email:', about.socialLinks.email);
        console.log('📞 WhatsApp:', about.socialLinks.whatsapp);
        console.log('🖼️ Primary Profile Image:', about.profileImage);
        console.log('🖼️ Secondary Profile Image:', about.profileImageSecondary);
        console.log('');
        console.log('🎓 Education Journey updated:');
        about.education.forEach(edu => {
            console.log(`   - ${edu.degree} at ${edu.institution} (${edu.year})`);
        });
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating About in MongoDB:', error);
        process.exit(1);
    }
};

updateAboutDb();
