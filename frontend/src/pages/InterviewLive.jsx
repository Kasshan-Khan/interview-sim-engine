import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import useSpeech from '../hooks/useSpeech';

const InterviewLive = () => {
    const [session, setSession] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [avatarState, setAvatarState] = useState('idle');
    const [interactionStarted, setInteractionStarted] = useState(false);

    // Track if we are in "Answering Mode" to prevent premature submissions
    const isAnsweringRef = useRef(false);

    const navigate = useNavigate();
    const {
        isListening,
        isSpeaking,
        transcript,
        startListening,
        stopListening,
        speak,
        resetTranscript
    } = useSpeech();

    // Sync Avatar state
    useEffect(() => {
        if (isSpeaking) setAvatarState('speaking');
        else if (isListening) setAvatarState('listening');
        else if (loading) setAvatarState('thinking');
        else setAvatarState('idle');
    }, [isSpeaking, isListening, loading]);

    // Auto-Submit Logic
    // When listening stops AND we have a transcript AND we were in answering mode -> Submit
    useEffect(() => {
        if (!isListening && transcript.trim().length > 5 && isAnsweringRef.current && !loading) {
            handleSubmit(transcript);
        }
    }, [isListening, transcript]);

    const startInterview = async () => {
        try {
            setLoading(true);
            const res = await api.post('/interview/start');
            setSession(res.data);
            setCurrentQuestion(res.data.firstQuestion);
            setInteractionStarted(true);
            setLoading(false);

            // Speak first question
            setTimeout(() => speak(res.data.firstQuestion.questionText), 500);

        } catch (err) {
            console.error(err);
            alert('Failed to start.');
            navigate('/upload');
            setLoading(false);
        }
    };

    const startAnswering = () => {
        resetTranscript();
        isAnsweringRef.current = true;
        startListening();
    };

    const handleSubmit = async (answerText) => {
        // If manual submit with empty text, try to use current transcript
        const finalAnswer = answerText || transcript;

        if (!finalAnswer.trim()) {
            alert("Please speak an answer before submitting.");
            return;
        }

        // Prevent double submits
        if (loading) return;

        isAnsweringRef.current = false; // Stop answering mode
        stopListening(); // Ensure mic is off
        setLoading(true);

        try {
            const res = await api.post('/interview/answer', {
                sessionId: session.sessionId || session._id,
                questionText: currentQuestion.questionText,
                answerText: finalAnswer
            });

            if (res.data.status === 'completed') {
                navigate(`/results?id=${session.sessionId || session._id}`);
            } else {
                setCurrentQuestion(res.data.nextQuestion);
                resetTranscript();

                // Speak Feedback then Question
                const speechText = `${res.data.feedback}. Moving on. ${res.data.nextQuestion.questionText}`;
                speak(speechText);
            }

        } catch (err) {
            console.error(err);
            setLoading(false); // Ensure loading is reset on error
        } finally {
            setLoading(false);
        }
    };

    if (!interactionStarted) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
                <div className="card">
                    <h2>Real-Time AI Interview</h2>
                    <p>Check your microphone and speakers.</p>
                    <button className="btn btn-primary" onClick={startInterview}>
                        Start Session
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container flex-center" style={{ minHeight: '85vh', flexDirection: 'column' }}>

            {/* Header / HUD */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '900px',
                marginBottom: '2rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '1rem'
            }}>
                <div>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Topic</span>
                    <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{currentQuestion?.topic || 'Initializing...'}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Difficulty</span>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '99px',
                        background: 'rgba(192, 132, 252, 0.1)',
                        border: '1px solid var(--primary-glow)',
                        color: 'var(--primary)',
                        fontSize: '0.85rem',
                        fontWeight: 600
                    }}>
                        {currentQuestion?.difficulty || 'Adaptive'}
                    </div>
                </div>
            </div>

            <Avatar state={avatarState} />

            {/* Question Display */}
            <div className="card" style={{
                maxWidth: '900px',
                width: '100%',
                minHeight: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                marginBottom: '2rem',
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    background: 'linear-gradient(to right, #1e293b, #475569)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.4
                }}>
                    {currentQuestion ? `"${currentQuestion.questionText}"` : "Connecting to AI Interviewer..."}
                </h2>
            </div>

            {/* Transcription / Input Area */}
            <div style={{ width: '100%', maxWidth: '800px', position: 'relative' }}>
                <div style={{
                    background: 'var(--bg-surface-top)',
                    border: isListening ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    minHeight: '120px',
                    color: transcript ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                    boxShadow: isListening ? '0 0 15px var(--accent-glow)' : 'inset 0 2px 4px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease'
                }}>
                    {transcript || (isListening ? "Listening..." : "Waiting for response...")}
                    {isListening && <span className="cursor-blink">|</span>}
                </div>

                {/* Controls Overlay */}
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    {!isListening && !loading && (
                        <button
                            className="btn btn-primary"
                            onClick={startAnswering}
                            style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
                        >
                            🎤 Start Answering
                        </button>
                    )}

                    {isListening && (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="recording-indicator" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)' }}>
                                <div style={{ width: 8, height: 8, background: 'var(--error)', borderRadius: '50%' }}></div>
                                REC
                            </div>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleSubmit(transcript)}
                            >
                                📤 Submit Now
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .cursor-blink { animation: blink 1s step-end infinite; }
                @keyframes blink { 50% { opacity: 0; } }
            `}</style>
        </div>
    );
};

export default InterviewLive;
