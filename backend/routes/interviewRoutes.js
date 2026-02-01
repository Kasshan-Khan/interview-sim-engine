const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/interview/start
router.post('/start', authMiddleware, interviewController.startInterview);

// @route   POST /api/interview/answer
router.post('/answer', authMiddleware, interviewController.submitAnswer);

// @route   GET /api/interview/history
router.get('/user/history', authMiddleware, interviewController.getUserHistory);

// @route   GET /api/interview/:id
router.get('/:id', authMiddleware, interviewController.getSession);

module.exports = router;
