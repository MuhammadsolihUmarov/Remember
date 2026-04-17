import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../store/progressStore';
import { Play } from 'lucide-react';

export default function Dashboard({ setScreen }) {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        setStats(getDashboardStats());
    }, []);

    if (!stats) return null;

    return (
        <div className="screen animate-fade-in">
            <h1 className="title-gradient cyrillic-large">Привет!</h1>
            <p className="text-secondary mb-8">Ready to speak some Russian?</p>

            <div className="flex gap-4 mb-8">
                <div className="stat-box">
                    <div className="stat-value text-primary">{stats.streak}</div>
                    <div className="stat-label">Day Streak 🔥</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.totalMastered}</div>
                    <div className="stat-label">Words Mastered</div>
                </div>
            </div>

            <div className="card mb-4 card-interactive" onClick={() => setScreen('review')} style={{ cursor: 'pointer' }}>
                <div className="flex justify-between items-center">
                    <div>
                        <h3>Reviews Due</h3>
                        <p className="text-secondary">{stats.dueCount} cards waiting</p>
                    </div>
                    <div className="btn-icon" style={{ backgroundColor: stats.dueCount > 0 ? 'var(--primary-color)' : '', color: stats.dueCount > 0 ? 'white' : '' }}>
                        <Play fill={stats.dueCount > 0 ? 'currentColor' : 'none'}/>
                    </div>
                </div>
            </div>

            <div className="card mb-8 card-interactive" onClick={() => setScreen('learn')} style={{ cursor: 'pointer' }}>
                <div className="flex justify-between items-center">
                    <div>
                        <h3>Learn New</h3>
                        <p className="text-secondary">{stats.newCardsAvailable} cards available</p>
                    </div>
                    <div className="btn-icon">
                        <Play />
                    </div>
                </div>
            </div>
            
            {stats.weakStats.length > 0 && (
                <div>
                     <h3 className="mb-4">Needs Work</h3>
                     <div className="card" style={{ padding: '1rem' }}>
                         {stats.weakStats.slice(0, 3).map(w => (
                             <div key={w.id} className="flex justify-between mb-2 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                 <span className="cyrillic-text" style={{ fontSize: '1.2rem' }}>{w.russian}</span>
                                 <span className="text-secondary">{w.english}</span>
                             </div>
                         ))}
                         <button className="btn btn-outline w-full mt-2" onClick={() => setScreen('library')}>View All in Library</button>
                     </div>
                </div>
            )}
        </div>
    );
}
