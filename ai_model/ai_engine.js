const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Initialize Gemini
// Expects process.env.GEMINI_API_KEY to be set by the calling application
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Using gemini-pro (Gemini 1.0) for maximum compatibility
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// Fallback local NLU if needed (simplistic)
const localNLU = require('./nlu');

class AIEngine {
    constructor() {
        this.model = model;
    }

    /**
     * Initialize interview context based on resume
     * @param {Object} resumeData - The resume document from DB
     * @returns {Object} Initial state
     */
    async initializeContext(resumeData) {
        console.log("Initializing AI Context with Resume...");

        try {
            const prompt = `
        You are an expert technical interviewer. Analyze this resume to prepare for an interview.
        Resume Content: "${resumeData.content.substring(0, 4000)}..."
        
        Extract the following in JSON format:
        1. "detectedSkills": Array of strings (Top 5 technical skills)
        2. "experienceLevel": String (Junior, Mid, Senior)
        3. "strengths": Array of strings
        4. "focusAreas": Array of strings (Topics to quiz on)
        
        Output strictly valid JSON.
      `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

            let signals;
            try {
                signals = JSON.parse(text);
            } catch (e) {
                console.warn("JSON Parse failed for Init Context, using regex/fallback");
                signals = { detectedSkills: ['General'], experienceLevel: 'Mid', focusAreas: ['General'] };
            }

            return {
                currentTopic: signals.focusAreas?.[0] || 'General',
                difficultyLevel: 5, // 1-10
                topicsCovered: [],
                candidateSignals: signals,
                consecutiveWeakAnswers: 0,
                questionHistory: []
            };

        } catch (error) {
            console.error("AI Init Error:", error);
            // Fallback state
            return {
                currentTopic: 'General',
                difficultyLevel: 5,
                topicsCovered: [],
                candidateSignals: { detectedSkills: ['General Coding'] },
                consecutiveWeakAnswers: 0,
                questionHistory: []
            };
        }
    }

    /**
     * Generate the next question based on current state
     * @param {Object} state - current interview state
     */
    async generateQuestion(state) {
        try {
            const { currentTopic, difficultyLevel, candidateSignals, questionHistory } = state;
            const skills = candidateSignals?.detectedSkills?.join(', ') || "General Programming";

            const prompt = `
        Generate a technical interview question.
        Topic: ${currentTopic}
        Difficulty: ${difficultyLevel}/10
        Candidate Skills: ${skills}
        History: ${JSON.stringify(questionHistory.slice(-3))}
        
        Rules:
        - Question should be concise, clear, and conversational.
        - Do not repeat previous questions.
        - Focus on conceptual understanding or problem solving.
        
        Output JSON:
        {
           "questionText": "The actual question string",
           "topic": "${currentTopic}",
           "difficulty": "Easy/Medium/Hard"
        }
      `;

            const result = await this.model.generateContent(prompt);
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                return JSON.parse(text);
            } catch (e) {
                // Fallback if JSON fails
                return {
                    questionText: text,
                    topic: currentTopic,
                    difficulty: "Adaptive"
                };
            }
        } catch (error) {
            console.error("Generate Question Error Details:", error.message);
            return {
                questionText: "Could you tell me about your most challenging technical project?",
                topic: "Behavioral",
                difficulty: "Medium"
            };
        }
    }

    /**
     * Evaluate answer and update state
     */
    async evaluateAndUpdateState(currentState, lastQuestion, userAnswer) {
        try {
            const prompt = `
        Evaluate this interview answer.
        Question: "${lastQuestion}"
        Answer: "${userAnswer}"
        
        Provide:
        1. Score (0-10)
        2. Feedback (Constructive, 1-2 sentences)
        3. Next Topic Suggestion
        4. Difficulty Adjustment (+1, -1, or 0)
        
        Output JSON:
        {
          "score": number,
          "feedback": "string",
          "nextTopic": "string",
          "difficultyAdjustment": number,
          "metrics": { "clarity": number, "correctness": number, "confidence": number }
        }
      `;

            const result = await this.model.generateContent(prompt);
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const evalData = JSON.parse(text);

            // Calculate next state
            const nextState = { ...currentState };

            // Update Difficulty
            nextState.difficultyLevel = Math.max(1, Math.min(10, nextState.difficultyLevel + evalData.difficultyAdjustment));

            // Update Topic if needed
            if (evalData.nextTopic && evalData.nextTopic !== nextState.currentTopic) {
                nextState.topicsCovered.push(nextState.currentTopic);
                nextState.currentTopic = evalData.nextTopic;
            }

            // Track weak answers
            if (evalData.score < 5) {
                nextState.consecutiveWeakAnswers++;
            } else {
                nextState.consecutiveWeakAnswers = 0;
            }

            nextState.questionHistory.push(lastQuestion);

            return {
                evaluation: evalData,
                nextState: nextState
            };

        } catch (error) {
            console.error("Evaluation Error:", error);
            // Fallback
            return {
                evaluation: {
                    score: 5,
                    feedback: "Thank you. Let's move on.",
                    metrics: { clarity: 5, correctness: 5, confidence: 5 }
                },
                nextState: currentState
            };
        }
    }
}

module.exports = new AIEngine();
