const InterviewSession = require('../models/InterviewSession');
const Resume = require('../models/Resume');
const aiEngine = require('../../ai_model/ai_engine');

// @desc    Start a new interview session
// @route   POST /api/interview/start
// @access  Private
exports.startInterview = async (req, res) => {
    try {
        // Find user's latest resume
        const resume = await Resume.findOne({ user: req.user.id }).sort({ uploadedAt: -1 });

        if (!resume) {
            return res.status(400).json({ msg: 'Please upload a resume first' });
        }

        // Initialize Session State
        const initialState = await aiEngine.initializeContext(resume);

        const newSession = new InterviewSession({
            user: req.user.id,
            resume: resume._id,
            status: 'active',
            interviewState: initialState,
            questions: []
        });

        // Generate First Question via AI Engine
        const firstQuestion = await aiEngine.generateQuestion(initialState);

        // We will store this question as the "pending" question in logic if needed, 
        // but for now we just return it. 
        // OPTIONAL: You could push it to questions array with empty answer to track "asked".

        await newSession.save();

        res.json({
            sessionId: newSession._id,
            message: "Interview Started",
            firstQuestion: firstQuestion
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Submit answer and get next question
// @route   POST /api/interview/answer
// @access  Private
exports.submitAnswer = async (req, res) => {
    try {
        const { sessionId, questionText, answerText } = req.body;

        const session = await InterviewSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }

        // 1. Evaluate & Update State
        const { evaluation, nextState } = await aiEngine.evaluateAndUpdateState(
            session.interviewState,
            questionText,
            answerText
        );

        // 2. Save to Session
        session.questions.push({
            questionText,
            userAnswer: answerText,
            aiFeedback: evaluation.feedback,
            score: evaluation.score,
            metrics: evaluation.metrics,
            timestamp: Date.now()
        });

        // Update State
        session.interviewState = nextState;

        // 3. Check Termination
        // Terminate if 5 questions OR state indicates termination
        if (session.questions.length >= 5) {
            session.status = 'completed';
            session.endedAt = Date.now();

            // Calculate Overall Score
            const avgScore = session.questions.reduce((acc, q) => acc + q.score, 0) / session.questions.length;
            session.overallScore = Math.round(avgScore * 10) / 10;

            await session.save();
            return res.json({
                status: 'completed',
                feedback: evaluation.feedback,
                score: evaluation.score,
                overallScore: session.overallScore,
                redirect: '/results'
            });
        }

        // 4. Generate Next Question from New State
        const nextQuestion = await aiEngine.generateQuestion(nextState);

        await session.save();

        res.json({
            status: 'active',
            feedback: evaluation.feedback,
            score: evaluation.score,
            nextQuestion
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get session results
// @route   GET /api/interview/:id
// @access  Private
exports.getSession = async (req, res) => {
    try {
        const session = await InterviewSession.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }
        // Verify user owns this session
        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        res.json(session);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all user sessions
// @route   GET /api/interview/history
// @access  Private
exports.getUserHistory = async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ user: req.user.id, status: 'completed' })
            .sort({ endedAt: -1 })
            .select('overallScore endedAt difficultyLevel');
        res.json(sessions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
