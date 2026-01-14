const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'],
        default: 'Other'
    },
    proficiency: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 50
    },
    icon: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for sorting
skillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
