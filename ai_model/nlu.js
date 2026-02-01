// Simulated Natural Language Understanding
// In a real system, this would call an LLM or use NLP libraries like compromise/natural

exports.analyzeAnswer = (answer, context) => {
    const text = answer.toLowerCase();
    const length = text.split(' ').length;

    // 1. Detect Keywords based on topic
    const keywords = {
        'JavaScript': ['closure', 'event loop', 'async', 'promise', 'callback', 'hoisting', 'scope'],
        'React': ['component', 'hook', 'state', 'props', 'virtual dom', 'lifecycle', 'render'],
        'Node.js': ['event emitter', 'stream', 'buffer', 'module', 'middleware', 'express', 'non-blocking']
    };

    const topicKeywords = keywords[context.topic] || [];
    const foundKeywords = topicKeywords.filter(k => text.includes(k));

    // 2. Heuristic Scoring
    let correctness = 5; // Start neutral
    let clarity = 5;
    let depth = 5;

    // Length heuristics
    if (length < 10) {
        clarity = 3;
        depth = 2;
    } else if (length > 30) {
        clarity = 7;
        depth = 6;
    } else if (length > 100) {
        depth = 9;
    }

    // Keyword heuristics
    if (foundKeywords.length > 0) {
        correctness += foundKeywords.length * 1.5;
        depth += foundKeywords.length;
    } else {
        correctness -= 2;
    }

    // Cap scores
    correctness = Math.min(10, Math.max(1, correctness));
    clarity = Math.min(10, Math.max(1, clarity));
    depth = Math.min(10, Math.max(1, depth));

    // 3. Generate Feedback
    let feedback = "";
    if (foundKeywords.length > 0) {
        feedback = `Good use of technical terms like ${foundKeywords.join(', ')}.`;
    } else {
        feedback = "The answer was a bit generic. Try to incude specific technical terminology.";
    }

    if (length < 15) feedback += " Could you elaborate more?";

    return {
        metrics: { correctness, clarity, depth },
        sentiment: length > 50 ? 'confident' : 'hesitant',
        keywordsFound: foundKeywords,
        feedback
    };
};

exports.extractSignals = (resumeText) => {
    // Mock signal extraction
    const skills = ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'];
    return {
        detectedSkills: skills,
        experienceLevel: 'Mid',
        strengths: ['JavaScript'],
        weaknesses: [] // To be populated during interview
    };
};
