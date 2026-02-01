const fs = require('fs');

// Mock Resume Parser
// In a real app, this would use pdf-parse or an AI API
exports.parseResume = async (filePath) => {
    return new Promise((resolve) => {
        // Simulate processing delay
        setTimeout(() => {
            // Mock extracted data based on random logic or file content (stubbed)
            const mockData = {
                content: "Executed full-stack development using MERN stack. Proficient in Node.js, React, and MongoDB.",
                skills: ["JavaScript", "Node.js", "React", "MongoDB", "Express", "REST APIs"],
                experienceLevel: "Mid"
            };
            resolve(mockData);
        }, 1000);
    });
};
