const Resume = require('../models/Resume');
const User = require('../models/User');
const { parseResume } = require('../services/resumeParser');
const fs = require('fs');

// @desc    Upload and parse resume
// @route   POST /api/resume/upload
// @access  Private
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Parse the resume
        const parsedData = await parseResume(req.file.path);

        // Create new Resume document
        const newResume = new Resume({
            user: req.user.id,
            originalFilename: req.file.originalname,
            content: parsedData.content,
            parsedSkills: parsedData.skills,
            experienceLevel: parsedData.experienceLevel
        });

        const resume = await newResume.save();

        // Optionally update user profile with skills
        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { skills: { $each: parsedData.skills } }
        });

        // Clean up uploaded file (optional, or keep it for archive)
        // fs.unlinkSync(req.file.path); 

        res.json(resume);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get user's resume
// @route   GET /api/resume
// @access  Private
exports.getResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user.id }).sort({ uploadedAt: -1 });
        if (!resume) {
            return res.status(404).json({ msg: 'Resume not found' });
        }
        res.json(resume);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
