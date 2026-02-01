const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'terminated'],
        default: 'active',
    },
    interviewState: {
        currentTopic: { type: String, default: 'General' },
        difficultyLevel: { type: Number, default: 5 }, // 1-10
        topicsCovered: [String],
        candidateSignals: { type: mongoose.Schema.Types.Mixed, default: {} },
        consecutiveWeakAnswers: { type: Number, default: 0 },
        questionHistory: { type: [String], default: [] }
    },
    questions: [{
        questionText: String,
        userAnswer: String,
        aiFeedback: String,
        score: Number, // 0-10
        metrics: {
            clarity: Number,
            depth: Number,
            correctness: Number,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        }
    }],
    overallScore: {
        type: Number,
        default: 0,
    },
    readinessReport: {
        strengths: [String],
        weaknesses: [String],
        recommendation: String,
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    endedAt: Date,
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
