import React from 'react';

const Avatar = ({ state }) => {
    // states: 'idle', 'speaking', 'listening', 'thinking'

    // Abstract Visualization: A pulsing orb
    const getColor = () => {
        switch (state) {
            case 'speaking': return 'var(--success)';
            case 'listening': return 'var(--warning)';
            case 'thinking': return 'var(--accent)';
            default: return 'var(--primary)';
        }
    };

    const color = getColor();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0' }}>
            <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* Core Orb */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 30% 30%, ${color}, transparent)`,
                    boxShadow: `0 0 30px ${color}`,
                    zIndex: 2,
                    transition: 'all 0.5s ease',
                    transform: state === 'speaking' ? 'scale(1.1)' : 'scale(1)'
                }} />

                {/* Rings */}
                <div className={`ring ${state}`} style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: `1px solid ${color}`,
                    opacity: 0.3,
                    transition: 'all 0.5s ease'
                }} />

                {state === 'listening' && (
                    <div className="pulse-ring" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: `2px solid ${color}`,
                        animation: 'pulse-out 1.5s infinite'
                    }} />
                )}
            </div>

            <p style={{
                marginTop: '1.5rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: color,
                textTransform: 'uppercase',
                fontSize: '0.75rem'
            }}>
                AI Interviewer &bull; {state}
            </p>

            <style>{`
                @keyframes pulse-out {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .ring.thinking {
                    animation: spin 3s linear infinite;
                    border-top-color: transparent;
                    border-left-color: transparent;
                }
                .ring.speaking {
                    animation: breathe 2s ease-in-out infinite;
                }
                @keyframes breathe {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.1); opacity: 0.6; }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Avatar;
