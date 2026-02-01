import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        setLoading(true);
        try {
            await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/interview');
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Upload Resume</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Our AI engine will analyze your skills to generate a personalized interview session.
                    </p>
                </div>

                <form onSubmit={handleUpload}>
                    <div
                        style={{
                            border: '2px dashed rgba(255,255,255,0.1)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '4rem 2rem',
                            marginBottom: '2rem',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            transition: 'all 0.2s'
                        }}
                        onDragOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                        onDragLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                        <input
                            type="file"
                            id="resume-upload"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ display: 'none' }}
                        />
                        <label
                            htmlFor="resume-upload"
                            className="btn btn-secondary"
                            style={{ cursor: 'pointer', display: 'inline-block', marginBottom: '1rem' }}
                        >
                            {file ? 'Change File' : 'Select Document'}
                        </label>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', margin: 0 }}>
                            {file ? file.name : 'PDF, DOCX, or TXT (Max 5MB)'}
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading || !file}
                        style={{ padding: '1rem', opacity: (!file || loading) ? 0.5 : 1 }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner" style={{ marginRight: '0.5rem' }}>🔄</span>
                                Analyzing Resume...
                            </>
                        ) : 'Start AI Interview 🚀'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ResumeUpload;
