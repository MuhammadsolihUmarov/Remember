import React, { useState } from 'react';
import { getAllCards } from '../store/progressStore';
import { Search, Volume2, Filter } from 'lucide-react';
import { playRussianAudio } from '../utils/audio';

export default function Library() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const cards = getAllCards();

    const filteredCards = cards.filter(card => {
        const matchesSearch = card.russian.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             card.english.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || card.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <div className="screen animate-fade-in">
            <h1 className="title-gradient mb-6">Card Library</h1>

            <div className="flex gap-2 mb-6">
                <div className="flex items-center bg-card-bg border border-border-color rounded-lg px-3 flex-1" style={{ background: 'var(--card-bg)' }}>
                    <Search size={18} className="text-secondary" />
                    <input 
                        type="text" 
                        placeholder="Search cards..." 
                        className="w-full bg-transparent border-none p-2 text-primary focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    className="btn btn-outline" 
                    style={{ padding: '0 0.5rem' }}
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="speaking">Speaking</option>
                    <option value="listening">Listening</option>
                    <option value="context">Context</option>
                </select>
            </div>

            <div className="flex flex-col gap-3">
                {filteredCards.map(card => (
                    <div key={card.id} className="card" style={{ padding: '1rem' }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="tag mb-2" style={{ fontSize: '0.6rem' }}>{card.type}</span>
                                <h3 className="cyrillic-text" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{card.russian}</h3>
                                <p className="text-secondary">{card.english}</p>
                            </div>
                            <button className="btn-icon" onClick={() => playRussianAudio(card.russian)}>
                                <Volume2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                
                {filteredCards.length === 0 && (
                    <p className="text-center text-secondary mt-8">No cards matching your criteria.</p>
                )}
            </div>
        </div>
    );
}
