import { useState, useEffect, useRef } from 'react';

const useSpeech = () => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');

    // Refs for persistent objects
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    // Silence detection
    const silenceTimer = useRef(null);

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => {
                // If we simply stopped but shouldn't have (unexpected), maybe restart?
                // For now, simple state sync
                setIsListening(false);
            };

            recognition.onresult = (event) => {
                // Clear existing silence timer
                if (silenceTimer.current) clearTimeout(silenceTimer.current);

                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setTranscript(prev => prev + ' ' + finalTranscript);
                }

                // If we have any input (final or interim), set silence timer
                if (finalTranscript || interimTranscript) {
                    silenceTimer.current = setTimeout(() => {
                        // User hasn't spoken for 3 seconds, trigger "soft stop"
                        if (recognitionRef.current) recognitionRef.current.stop();
                    }, 3000); // 3 seconds silence threshold
                }
            };

            recognitionRef.current = recognition;
        } else {
            console.warn("Speech Recognition not supported in this browser.");
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (e) { console.error(e); }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const speak = (text) => {
        if (!synthRef.current) return;

        // Cancel previous speech
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Select a voice (try to find a good English one)
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Microsoft David'));
        if (preferredVoice) utterance.voice = preferredVoice;

        synthRef.current.speak(utterance);
    };

    const resetTranscript = () => setTranscript('');

    return {
        isListening,
        isSpeaking,
        transcript,
        startListening,
        stopListening,
        speak,
        resetTranscript
    };
};

export default useSpeech;
