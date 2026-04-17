import React, { useState, useEffect } from 'react';
import { fetchNewCards, initializeNewCards, getSettings, getDashboardStats } from '../store/progressStore';
import { playRussianAudio } from '../utils/audio';
import { Volume2, CheckCircle2, ArrowRight, Zap, Target, Award, ChevronRight } from 'lucide-react';

export default function LearnNew({ setScreen }) {
    const [phase, setPhase] = useState('selection'); // 'selection', 'intro', 'summary'
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [newCards, setNewCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [settings, setSettings] = useState({});
    const [stats, setStats] = useState(null);

    useEffect(() => {
        setSettings(getSettings());
        setStats(getDashboardStats());
    }, []);

    const handleLevelSelect = (level) => {
        const cards = fetchNewCards(level, settings.dailyNewGoal);
        if (cards.length === 0) {
           alert("No more new cards in this category!");
           return;
        }
        setSelectedLevel(level);
        setNewCards(cards);
        setPhase('intro');
    };

    const playAudio = () => {
        if (newCards.length > currentIndex) {
            const card = newCards[currentIndex];
            playRussianAudio(card.type === 'context' ? card.example || card.russian : card.russian);
        }
    };

    useEffect(() => {
        if (phase === 'intro' && newCards.length > currentIndex && settings.autoplayAudio) {
            playAudio();
        }
    }, [currentIndex, phase, newCards, settings.autoplayAudio]);

    const handleNext = () => {
        if (currentIndex < newCards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setPhase('summary');
        }
    };

    const handleStartLearning = () => {
        initializeNewCards(newCards);
        setScreen('review'); 
    };

    if (phase === 'selection') {
        const levels = [
            { id: 'fundamental', name: 'Fundamentals', desc: 'Core 80/20 daily usage', icon: Zap, color: '#3b82f6' },
            { id: 'b2', name: 'B2 Intermediate', desc: 'Nuance & social topics', icon: Target, color: '#8b5cf6' },
            { id: 'advanced', name: 'C1-C2 Advanced', desc: 'Complex formal patterns', icon: Award, color: '#f59e0b' }
        ];

        return (
            <div className="screen animate-fade-in">
                <h1 className="title-gradient mb-2">What's the focus?</h1>
                <p className="text-secondary mb-8">Choose a level for your new batch.</p>

                <div className="flex flex-col gap-4">
                    {levels.map(lvl => {
                        const Icon = lvl.icon;
                        const count = stats?.levelCounts?.[lvl.id] || 0;
                        return (
                            <div 
                                key={lvl.id} 
                                className="card card-interactive" 
                                style={{ padding: '1.25rem', opacity: count === 0 ? 0.6 : 1 }}
                                onClick={() => count > 0 && handleLevelSelect(lvl.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div style={{ backgroundColor: `${lvl.color}20`, padding: '0.75rem', borderRadius: '1rem', color: lvl.color }}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 style={{ margin: 0 }}>{lvl.name}</h3>
                                            <span className="text-secondary text-sm">{count} cards left</span>
                                        </div>
                                        <p className="text-secondary text-sm">{lvl.desc}</p>
                                    </div>
                                    <ChevronRight className="text-secondary" size={20} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <button className="btn btn-outline w-full mt-8" onClick={() => setScreen('dashboard')}>
                    Maybe Later
                </button>
            </div>
        );
    }

    if (phase === 'summary') {
        return (
            <div className="screen animate-fade-in text-center">
                <CheckCircle2 size={64} color="var(--success)" className="mb-4" style={{ margin: '0 auto' }}/>
                <h2 className="mb-2">Batch Ready!</h2>
                <p className="text-secondary mb-8">You've introduced these {newCards.length} {selectedLevel} cards.</p>
                
                <div className="card mb-8">
                    {newCards.map(c => (
                        <div key={c.id} className="flex justify-between mb-2 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <span className="cyrillic-text" style={{ fontSize: '1rem' }}>{c.russian}</span>
                            <span className="text-secondary">{c.english}</span>
                        </div>
                    ))}
                </div>

                <button className="btn btn-primary w-full" onClick={handleStartLearning}>
                    Start Practice Session
                </button>
            </div>
        );
    }

    const card = newCards[currentIndex];

    return (
        <div className="screen animate-fade-in flex flex-col justify-between" style={{ minHeight: 'calc(100vh - 100px)' }}>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <span className="tag">{selectedLevel} • {currentIndex + 1}/{newCards.length}</span>
                    <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => setPhase('selection')}>Change Level</button>
                </div>

                <div className="card text-center mb-6">
                    <div className="audio-player mb-6 mx-auto" style={{ margin: '0 auto' }} onClick={playAudio}>
                        <Volume2 size={32} />
                    </div>
                    
                    <h1 className="cyrillic-large">{card.russian}</h1>
                    
                    {settings.showTransliteration && (
                        <p className="translitcript mb-4">{card.transliteration}</p>
                    )}

                    <h2 className="text-primary mt-4" style={{ fontWeight: '400' }}>{card.english}</h2>
                </div>

                {card.example && (
                    <div className="card" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed var(--primary-color)' }}>
                        <p className="text-secondary text-sm mb-2">Example Context:</p>
                        <p className="cyrillic-text" style={{ fontSize: '1.2rem' }}>{card.example}</p>
                        <p className="text-secondary mt-2 italic">"{card.example_translation}"</p>
                    </div>
                )}
            </div>

            <button className="btn btn-primary w-full flex items-center justify-center gap-2" style={{ padding: '1.2rem' }} onClick={handleNext}>
                Next Card <ArrowRight size={20} />
            </button>
        </div>
    );
}
