import React, { useState, useEffect } from 'react';
import { fetchDueCards, submitReview, getSettings } from '../store/progressStore';
import { playRussianAudio } from '../utils/audio';
import { Volume2 } from 'lucide-react';

export default function ReviewFlow({ setScreen }) {
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        setQueue(fetchDueCards());
        setSettings(getSettings());
    }, []);

    const playCurrentAudio = () => {
        if (queue.length > currentIndex) {
             const card = queue[currentIndex].card;
             const textToSpeak = card.type === 'context' ? card.example || card.russian : card.russian;
             playRussianAudio(textToSpeak);
        }
    };

    useEffect(() => {
        if (!showAnswer && queue.length > currentIndex) {
            const card = queue[currentIndex].card;
            if (card.type === 'listening' || (settings.autoplayAudio && card.type !== 'speaking')) {
                 playCurrentAudio();
            }
        }
    }, [currentIndex, showAnswer, queue, settings.autoplayAudio]);

    const handleReveal = () => {
        setShowAnswer(true);
        if (settings.autoplayAudio) {
            playCurrentAudio();
        }
    };

    const handleRate = (rating) => {
        // rating: 1=Again, 2=Hard, 3=Good, 4=Easy
        const item = queue[currentIndex];
        submitReview(item.card.id, rating);
        
        setShowAnswer(false);
        setCurrentIndex(prev => prev + 1);
    };

    if (queue.length === 0) {
        return (
            <div className="screen animate-fade-in text-center mt-8">
                <h2>All caught up! 🎉</h2>
                <p className="text-secondary mb-8">You have no more reviews due right now.</p>
                <button className="btn btn-primary" onClick={() => setScreen('dashboard')}>Back to Dashboard</button>
            </div>
        );
    }

    if (currentIndex >= queue.length) {
        return (
             <div className="screen animate-fade-in text-center mt-8">
                 <h2>Great work! 🏆</h2>
                 <p className="text-secondary mb-8">You finished {queue.length} reviews.</p>
                 <button className="btn btn-primary" onClick={() => setScreen('dashboard')}>Back to Dashboard</button>
             </div>
        )
    }

    const { card, progress } = queue[currentIndex];
    
    // UI logic based on card type
    return (
        <div className="screen animate-fade-in flex flex-col justify-between" style={{ minHeight: 'calc(100vh - 100px)' }}>
            
            <div>
                {/* Header info */}
                <div className="flex justify-between items-center mb-8">
                     <span className="tag">{card.type} practice</span>
                     <span className="text-secondary text-sm">{queue.length - currentIndex} left</span>
                </div>
                
                {/* Front of card */}
                <div className="card text-center mb-4" style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {card.type === 'speaking' && (
                        <>
                            <h2 style={{ fontSize: '2rem' }}>{card.english}</h2>
                            <p className="text-secondary mt-4">Say it in Russian</p>
                        </>
                    )}
                    
                    {card.type === 'listening' && (
                         <>
                             <div className="audio-player mb-4" onClick={playCurrentAudio}>
                                 <Volume2 size={32} />
                             </div>
                             <p className="cyrillic-text">Listen and translate</p>
                         </>
                    )}
                    
                    {card.type === 'context' && (
                         <>
                             <h2 style={{ fontSize: '1.5rem', lineHeight: '1.4' }}>{card.english}</h2>
                             {card.example_translation && (
                                 <p className="text-secondary mt-2">"{card.example_translation}"</p>
                             )}
                         </>
                    )}
                </div>
            </div>

            {/* Back of Card / Action Area */}
            <div>
                {!showAnswer ? (
                    <button className="btn btn-primary w-full" style={{ padding: '1.2rem', fontSize: '1.2rem' }} onClick={handleReveal}>
                        Reveal Answer
                    </button>
                ) : (
                    <div className="animate-fade-in">
                        <div className="card text-center mb-4 pb-8" style={{ border: '2px solid var(--success)', borderBottomWidth: '4px' }}>
                             <div className="flex justify-center mb-4">
                                  <div className="audio-player" onClick={playCurrentAudio} style={{ width: '48px', height: '48px' }}>
                                      <Volume2 size={24} />
                                  </div>
                             </div>
                             
                             <h2 className="cyrillic-large">{card.russian}</h2>
                             
                             {settings.showTransliteration && (
                                 <p className="translitcript mb-4">{card.transliteration}</p>
                             )}
                             
                             {card.type === 'listening' && (
                                 <p className="text-primary mt-4" style={{ fontSize: '1.2rem' }}>{card.english}</p>
                             )}
                             
                             {card.type === 'context' && card.example && (
                                 <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                                      <p className="cyrillic-text text-primary">{card.example}</p>
                                 </div>
                             )}
                        </div>
                        
                        <p className="text-center text-sm text-secondary">How was it?</p>
                        <div className="review-actions">
                             <button className="review-btn btn-rate-again" onClick={() => handleRate(1)}>
                                 Again
                                 <span className="interval">&lt; 1m</span>
                             </button>
                             <button className="review-btn btn-rate-hard" onClick={() => handleRate(2)}>
                                 Hard
                                 <span className="interval">{calcInterval(progress.interval_days, 2)}d</span>
                             </button>
                             <button className="review-btn btn-rate-good" onClick={() => handleRate(3)}>
                                 Good
                                 <span className="interval">{calcInterval(progress.interval_days, 3, progress.ease_factor)}d</span>
                             </button>
                             <button className="review-btn btn-rate-easy" onClick={() => handleRate(4)}>
                                 Easy
                                 <span className="interval">{calcInterval(progress.interval_days, 4, progress.ease_factor)}d</span>
                             </button>
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    );
}

// Helper to show UX interval approximations on buttons
function calcInterval(currentInterval, rating, ease = 2.5) {
    if (!currentInterval) currentInterval = 0;
    if (rating === 2) return Math.max(1, Math.round(currentInterval * 1.2));
    if (rating === 3) return Math.max(1, Math.round(currentInterval * ease));
    if (rating === 4) return Math.max(1, Math.round(currentInterval * ease * 1.3));
    return 0;
}
