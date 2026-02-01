require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // dummy
        // The SDK doesn't expose listModels directly on the main class easily in all versions?
        // Actually it might not be in the high-level helper.
        // But we can try the fallback of just guessing.

        // Let's try to infer from the error message or just try variations.
        console.log("Testing Model 1.5-flash-001...");
        const m1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        await m1.generateContent("Hello");
        console.log("SUCCESS: gemini-1.5-flash-001");
        process.exit(0);

    } catch (e) {
        console.log("FAIL: gemini-1.5-flash-001", e.message);

        try {
            console.log("Testing Model gemini-pro...");
            const m2 = genAI.getGenerativeModel({ model: "gemini-pro" });
            await m2.generateContent("Hello");
            console.log("SUCCESS: gemini-pro");
        } catch (e2) {
            console.log("FAIL: gemini-pro", e2.message);
        }
    }
}

listModels();
