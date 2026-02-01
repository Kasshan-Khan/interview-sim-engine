const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    originalFilename: {
        type: String,
        required: true,
    },
    content: {
        type: String, // Full text content
        required: true,
    },
    parsedSkills: {
        type: [String],
        default: [],
    },
    experienceLevel: {
        type: String,
        enum: ['Junior', 'Mid', 'Senior'],
        default: 'Junior',
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Resume', ResumeSchema);
