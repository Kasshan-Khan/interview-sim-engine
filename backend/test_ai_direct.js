require('dotenv').config();
const aiEngine = require('../ai_model/ai_engine');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'ai_debug_internal.log');
fs.writeFileSync(logFile, '');

const originalLog = console.log;
const originalError = console.error;

function fileLog(prefix, args) {
    const msg = args.map(arg => {
        if (typeof arg === 'object') {
            try { return JSON.stringify(arg, null, 2); }
            catch (e) { return '[Obj]'; }
        }
        return String(arg);
    }).join(' ');
    const line = `[${prefix}] ${msg}\n`;
    fs.appendFileSync(logFile, line);
    // Print to original console too
    if (prefix === 'ERROR') originalError.apply(console, args);
    else originalLog.apply(console, args);
}

// Override global console methods
console.log = (...args) => fileLog('INFO', args);
console.error = (...args) => fileLog('ERROR', args);

async function testAI() {
    const key = process.env.GEMINI_API_KEY || "";
    console.log("Testing AI Engine with API Key:", key ? "PRESENT" : "MISSING");
    console.log("Key Prefix:", key.substring(0, 4));
    console.log("Key Length:", key.length);

    const mockResume = {
        content: "Experienced Node.js developer with 5 years of experience in Express, MongoDB, and React. Built scalable microservices."
    };

    try {
        console.log("--- Calling initializeContext ---");
        const state = await aiEngine.initializeContext(mockResume);
        console.log("State Result:", state);

        console.log("--- Calling generateQuestion ---");
        const question = await aiEngine.generateQuestion(state);
        console.log("Question Result:", question);

    } catch (e) {
        console.error("CRITICAL TEST FAILURE:", e);
    }
}

testAI();
