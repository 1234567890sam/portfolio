require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const About = require('../models/About');
const fallbackDb = require('../utils/fallbackDb');

const RESUME_PATH = path.join(__dirname, '../public/uploads/resume.pdf');

// 1. Create a minimal valid PDF file
const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 56 >>
stream
BT
/F1 12 Tf
72 712 Td
(M Saad Shaikh - Resume Placeholder) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000056 00000 n 
0000000111 00000 n 
0000000227 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
333
%%EOF`;

try {
    fs.writeFileSync(RESUME_PATH, pdfContent);
    console.log('✅ Created placeholder resume.pdf at public/uploads/resume.pdf');
} catch (err) {
    console.error('❌ Error writing PDF file:', err);
    process.exit(1);
}

// 2. Connect to MongoDB and update the DB record
mongoose.connect(process.env.MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    serverSelectionTimeoutMS: 5000
})
    .then(async () => {
        console.log('✅ MongoDB Connected. Updating database...');
        try {
            let about = await About.findOne();
            if (about) {
                about.resumeUrl = '/uploads/resume.pdf';
                await about.save();
                console.log('✅ Database about.resumeUrl updated to /uploads/resume.pdf');
            } else {
                console.log('ℹ️ No existing About record found in MongoDB.');
            }

            // 3. Update fallback_data.json
            const fallbackPath = path.join(__dirname, '../fallback_data.json');
            if (fs.existsSync(fallbackPath)) {
                const fallbackData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
                if (fallbackData.about) {
                    fallbackData.about.resumeUrl = '/uploads/resume.pdf';
                    fs.writeFileSync(fallbackPath, JSON.stringify(fallbackData, null, 4));
                    console.log('✅ fallback_data.json updated successfully');
                }
            }

            process.exit(0);
        } catch (dbErr) {
            console.error('❌ Error updating database or fallback file:', dbErr);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('ℹ️ Proceeding to update fallback_data.json only...');
        
        try {
            // Update fallback_data.json anyway
            const fallbackPath = path.join(__dirname, '../fallback_data.json');
            if (fs.existsSync(fallbackPath)) {
                const fallbackData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
                if (fallbackData.about) {
                    fallbackData.about.resumeUrl = '/uploads/resume.pdf';
                    fs.writeFileSync(fallbackPath, JSON.stringify(fallbackData, null, 4));
                    console.log('✅ fallback_data.json updated successfully');
                }
            }
            process.exit(0);
        } catch (fallbackErr) {
            console.error('❌ Error updating fallback file:', fallbackErr);
            process.exit(1);
        }
    });
