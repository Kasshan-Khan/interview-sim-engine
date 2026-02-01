const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// @route   POST /api/resume/upload
router.post('/upload', authMiddleware, uploadMiddleware, resumeController.uploadResume);

// @route   GET /api/resume
router.get('/', authMiddleware, resumeController.getResume);

module.exports = router;
