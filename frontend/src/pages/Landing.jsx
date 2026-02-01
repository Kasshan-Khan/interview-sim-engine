import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import heroImage from '../assets/hero_illustration.png';

const Landing = () => {
    const { user } = useContext(AuthContext);

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <section className="container flex-center" style={{
                minHeight: '80vh',
                flexDirection: 'column',
                textAlign: 'center',
                position: 'relative'
            }}>
                {/* Abstract Background Elements */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'var(--primary-glow)',
                    filter: 'blur(80px)',
                    borderRadius: '50%',
                    zIndex: -1
                }} />

                <div style={{ maxWidth: '800px', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        borderRadius: '99px',
                        background: 'rgba(255,255,255,0.5)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)'
                    }}>
                        ✨ AI-Powered Interview Simulation
                    </div>

                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: 800,
                        marginBottom: '1.5rem',
                        lineHeight: 1.1,
                        letterSpacing: '-0.03em',
                        background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Master Your Interview <br />
                        <span className="text-gradient">Before It Happens</span>
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '2.5rem',
                        lineHeight: 1.6,
                        maxWidth: '600px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        Experience real-time, voice-interactive technical interviews tailored to your resume. Get instant feedback and land your dream job.
                    </p>

                    <div className="flex-center" style={{ gap: '1rem' }}>
                        <Link to={user ? "/upload" : "/login"} className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            {user ? 'Resume Simulation' : 'Start Simulation'}
                        </Link>
                        {!user && (
                            <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: 'white' }}>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>

                {/* Hero Image */}
                <div style={{
                    marginTop: '4rem',
                    maxWidth: '900px',
                    width: '100%',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: '0 25px 80px -20px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    position: 'relative',
                    animation: 'float 6s ease-in-out infinite'
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.2) 100%)',
                        zIndex: 2,
                        pointerEvents: 'none'
                    }} />
                    <img
                        src={heroImage}
                        alt="AI Interview Interface"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                </div>
            </section>

            {/* Features Grid */}
            <section className="container" style={{ marginTop: '5rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    <FeatureCard
                        icon="🎙️"
                        title="Real-Time Voice Analysis"
                        desc="Speak naturally. Our AI listens, understands, and responds instantly, just like a real human interviewer."
                    />
                    <FeatureCard
                        icon="📄"
                        title="Resume Deep Dive"
                        desc="Upload your resume. The engine scans your skills and customizes questions to your specific profile."
                    />
                    <FeatureCard
                        icon="📊"
                        title="Instant Feedback Scores"
                        desc="Get detailed performance metrics on technical accuracy, clarity, and confidence immediately after."
                    />
                </div>
            </section>

            {/* CSS Animations */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="card" style={{
        textAlign: 'left',
        padding: '2rem',
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)'
    }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{desc}</p>
    </div>
);

export default Landing;
