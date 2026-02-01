import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    // Hide nav on login page if desired, but good to keep for logo
    const isAuthPage = location.pathname === '/login';

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="nav">
                <Link to="/" className="nav-logo">
                    interview<span style={{ color: 'var(--primary)' }}>.sim</span>
                </Link>
                <div>
                    <div>
                        {user ? (
                            <>
                                <Link to="/upload">My Resume</Link>
                                <Link to="/results">My Progress</Link>
                                <button
                                    onClick={() => { logout(); }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--error)',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        marginLeft: '2rem',
                                        padding: 0
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            location.pathname !== '/login' && (
                                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
                            )
                        )}
                    </div>
                </div>
            </nav>
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <footer style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-tertiary)',
                fontSize: '0.8rem',
                borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
                &copy; 2026 interview.sim &bull; Powered by Google Gemini
            </footer>
        </div>
    );
};

export default Layout;
