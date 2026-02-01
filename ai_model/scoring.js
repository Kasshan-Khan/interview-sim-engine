// Scoring Logic

exports.calculateScore = (metrics) => {
    // Weighted Average
    // Correctness: 50%
    // Depth: 30%
    // Clarity: 20%

    const score = (metrics.correctness * 0.5) + (metrics.depth * 0.3) + (metrics.clarity * 0.2);
    return Math.round(score * 10) / 10; // Round to 1 decimal
};

exports.calculateConfidence = (responseTime, answerLength) => {
    // Simple heuristic
    // Fast response + good length = High confidence
    // Long pause or very short answer = Low confidence

    let confidence = 10;
    if (responseTime > 10000) confidence -= 2; // > 10s delay
    if (answerLength < 50) confidence -= 3; // Too short

    return Math.max(0, confidence);
};
