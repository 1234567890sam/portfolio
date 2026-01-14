const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: '/uploads/default-project.jpg'
    },
    techStack: [{
        type: String,
        trim: true
    }],
    projectUrl: {
        type: String,
        trim: true
    },
    githubUrl: {
        type: String,
        trim: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for sorting
projectSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
