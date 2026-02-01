require('dotenv').config();
const fs = require('fs');
const API_KEY = process.env.GEMINI_API_KEY;

async function checkModels() {
    if (!API_KEY) {
        console.error("NO API KEY FOUND");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    console.log(`Querying: ${url.replace(API_KEY, 'HIDDEN')}`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API ERROR:", data.error);
            return;
        }

        if (data.models) {
            console.log("--- AVAILABLE MODELS ---");
            const names = data.models.map(m => m.name.replace('models/', ''));

            // Filter for flash/pro models
            const relevant = names.filter(n => n.includes('gemini'));

            try {
                fs.writeFileSync('models_log.txt', relevant.join('\n'));
                console.log("Models written to models_log.txt");
            } catch (e) { console.error("Write failed", e); }

            console.log(relevant.join('\n'));

            console.log("------------------------");

            // Check for user's requested model
            const userModel = "gemini-2.5-flash-lite";
            const exists = relevant.some(n => n === userModel || n.includes(userModel));
            console.log(`Does '${userModel}' exist?`, exists ? "YES" : "NO");
        } else {
            console.log("No models returned.", data);
        }

    } catch (e) {
        console.error("FETCH ERROR:", e);
    }
}

checkModels();
