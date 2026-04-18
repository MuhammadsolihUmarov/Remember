import React, { useState } from 'react';
import { setActiveUser } from '../store/progressStore';

export default function AccountLogin({ onLogin }) {
    const [username, setUsername] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const trimmed = username.trim();
        if (trimmed) {
            setActiveUser(trimmed);
            onLogin(trimmed);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h1 className="title-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome to Remember</h1>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    Please enter a username to get started. Your progress will be saved under this name.
                </p>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Username" 
                        className="bg-card-bg border border-border-color rounded-lg px-3 p-2 text-primary focus:outline-none focus:border-accent"
                        style={{ background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}
                        autoFocus
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem' }}>
                        Start Learning
                    </button>
                </form>
            </div>
        </div>
    );
}
