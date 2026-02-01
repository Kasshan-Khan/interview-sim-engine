# interview.sim 🎙️✨

**The AI-Powered Technical Interview Simulator**

> *Master your interview before it happens.*

## 🚀 Overview
**interview.sim** is a real-time, voice-interactive interview simulation platform designed to help candidates practice for technical interviews. Powered by **Google Gemini 2.5 Flash Lite**, it parses your resume, generates tailored technical questions, listens to your spoken answers, and provides instant, scored feedback.

Built for the **[Hack2Hire]** Hackathon. 🏆

## ✨ Key Features
-   **📄 Resume Deep Dive**: Upload your PDF resume. The AI extracts your top skills and experience level to customize the interview.
-   **🗣️ Real-Time Voice Interaction**: Speak your answers naturally. The app uses the Web Speech API to listen and transcribe your responses.
-   **🧠 Adaptive AI Engine**: Powered by Gemini, the interviewer adapts the difficulty based on your performance.
-   **📊 Instant Feedback Loop**: Get immediate scores (0-10) and constructive feedback after every question.
-   **📉 Comprehensive Progress Tracking**: detailed history dashboard to track your readiness over time.
-   **🎨 Ethereal UI**: A modern, glassmorphism-inspired "Cyber-light" aesthetic for a distraction-free experience.

## 🛠️ Technology Stack
-   **Frontend**: React.js, Vite, Vanilla CSS (Custom Design System)
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (Mongoose)
-   **AI Model**: Google Gemini 2.5 Flash Lite (via `@google/generative-ai`)
-   **APIs**: Web Speech API (STT/TTS)

---

## ⚙️ Installation & Setup

### Prerequisites
-   Node.js (v18+)
-   MongoDB (Local or Atlas URI)
-   Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/interview-sim-engine.git
cd interview-sim-engine
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

**Create a `.env` file** in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend server:
```bash
npm start
```
*Server should run on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```
*App should open at `http://localhost:5173`*

---

## 🚶‍♂️ Walkthrough for Judges

Follow these steps to experience the full flow of **interview.sim**:

### Phase 1: Onboarding
1.  **Landing Page**: You'll land on our new minimalist homepage. Click **"Start Simulation"**.
2.  **Authentication**: Sign Up for a new account (or Log In).
    *   *Note: Passwords are hashed, but for demo purposes, you can use simple credentials.*

### Phase 2: The Setup
3.  **Resume Upload**: You will be prompted to upload a resume.
    *   **Action**: Drag & drop a PDF resume (or pick a sample file).
    *   *The backend will parse this and extract your skills (e.g., "React", "Node.js").*
4.  **Confirm**: Once uploaded, you'll be redirected to the live interview cockpit.

### Phase 3: The Interview (The "Wow" Factor 🌟)
5.  **Voice Interaction**: The AI will greet you and ask the first question based on your resume.
    *   **Action**: Click **"Start Answering"**, allow microphone access, and **SPEAK** your answer.
    *   *Tip: Try answer correctly to see the difficulty rise, or incorrectly to see it adapt.*
6.  **Submit**: Click **"Submit Now"** when finished speaking.
7.  **Feedback**: Watch the "Future Cockpit" update.
    *   The AI will evaluate your answer, give a score, and speak the feedback aloud.
    *   It will then ask the next question depending on how you did.

### Phase 4: Results & History
8.  **Completion**: After 5 questions (or if you click Finish), you go to the **Results Dashboard**.
9.  **Deep Dive**: Review your overall readiness score and question-by-question breakdown.
10. **History**: Click **"My Progress"** in the navbar to see a list of all your past simulation sessions.

---

## 🔮 Future Improvements
-   Video Analysis for body language.
-   Mock Coding Environment for LeetCode-style questions.
-   Peer-to-Peer Mock Interviews.

---

Made with ❤️ by Kasshan Khan
A Student from IIIT Kota CSE