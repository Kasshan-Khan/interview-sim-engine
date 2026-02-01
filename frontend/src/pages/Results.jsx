import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Results = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('id');
    const [session, setSession] = useState(null);
    const navigate = useNavigate();

    const [history, setHistory] = useState(null);

    useEffect(() => {
        if (sessionId) {
            fetchResults();
        } else {
            fetchHistory();
        }
    }, [sessionId]);

    const fetchResults = async () => {
        try {
            const res = await api.get(`/interview/${sessionId}`);
            setSession(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to load results');
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await api.get('/interview/user/history');
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Single Session View
    if (sessionId) {
        if (!session) return <div className="container" style={{ marginTop: '2rem' }}>Loading Result Details...</div>;
        return (
            <div className="container" style={{ maxWidth: '900px', marginTop: '2rem' }}>
                <button onClick={() => navigate('/results')} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
                    &larr; Back to History
                </button>
                <div className="card" style={{ textAlign: 'center', marginBottom: '2rem', padding: '3rem' }}>
                    <h1>Interview Complete</h1>
                    <div style={{
                        fontSize: '4rem',
                        fontWeight: 'bold',
                        color: session.overallScore >= 7 ? 'var(--success)' : 'var(--error)',
                        margin: '1rem 0'
                    }}>
                        {session.overallScore}
                        <span style={{ fontSize: '1.5rem', color: 'var(--text-tertiary)' }}>/10</span>
                    </div>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Readiness Score</p>
                    <button className="btn btn-primary" onClick={() => navigate('/upload')} style={{ marginTop: '2rem' }}>
                        Start New Interview
                    </button>
                </div>

                <h2 style={{ marginBottom: '1rem' }}>Question Breakdown</h2>
                {session.questions.map((q, index) => (
                    <div key={index} className="card" style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold' }}>Q{index + 1}: {q.questionText}</span>
                            <span style={{
                                color: q.score >= 7 ? 'var(--success)' : 'var(--error)',
                                fontWeight: 'bold'
                            }}>
                                {q.score}/10
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1rem' }}>
                            "{q.userAnswer}"
                        </p>
                        <div style={{ backgroundColor: 'var(--bg-deep)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <strong>AI Feedback:</strong> {q.aiFeedback}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // History List View
    if (!history) return <div className="container" style={{ marginTop: '2rem' }}>Loading Progress...</div>;

    return (
        <div className="container" style={{ maxWidth: '800px', marginTop: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>My Progress</h1>
                <button className="btn btn-primary" onClick={() => navigate('/upload')}>
                    + New Interview
                </button>
            </div>

            {history.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h3>No interviews yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Upload your resume and start your first simulation to see your progress here.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/upload')}>
                        Get Started
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {history.map((item) => (
                        <div key={item._id} className="card"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onClick={() => navigate(`/results?id=${item._id}`)}
                        >
                            <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                    Technical Interview
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {new Date(item.endedAt).toLocaleDateString()} &bull; {new Date(item.endedAt).toLocaleTimeString()}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: item.overallScore >= 7 ? 'var(--success)' : (item.overallScore >= 4 ? 'var(--warning)' : 'var(--error)')
                                }}>
                                    {item.overallScore}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Score</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Results;
