import React, { useState } from 'react';
import { getAllCards, getCustomCards, saveCustomCards, getEditedData, saveEditedData, getDeletedCardIds, saveDeletedCardIds } from '../store/progressStore';
import { Search, Volume2, Filter, Plus, Edit2, Trash2 } from 'lucide-react';
import { playRussianAudio } from '../utils/audio';
import EditCardModal from '../components/EditCardModal';

export default function Library() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [refresh, setRefresh] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState(null);

    const cards = getAllCards();

    const filteredCards = cards.filter(card => {
        const matchesSearch = card.russian.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             card.english.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || card.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleSaveCard = (cardData) => {
        if (cardData.id.startsWith('custom_')) {
            const customCards = getCustomCards();
            const existingIndex = customCards.findIndex(c => c.id === cardData.id);
            if (existingIndex >= 0) {
                customCards[existingIndex] = cardData;
            } else {
                customCards.push(cardData);
            }
            saveCustomCards(customCards);
        } else {
            // Edited a seed card
            const editedData = getEditedData();
            editedData[cardData.id] = cardData;
            saveEditedData(editedData);
        }
        setRefresh(prev => prev + 1);
    };

    const handleDelete = (id) => {
        if (id.startsWith('custom_')) {
            const customCards = getCustomCards();
            saveCustomCards(customCards.filter(c => c.id !== id));
        } else {
            const deletedIds = getDeletedCardIds();
            if (!deletedIds.includes(id)) {
                deletedIds.push(id);
                saveDeletedCardIds(deletedIds);
            }
        }
        setRefresh(prev => prev + 1);
    };

    const openCreate = () => {
        setEditingCard(null);
        setIsModalOpen(true);
    };

    const openEdit = (card) => {
        setEditingCard(card);
        setIsModalOpen(true);
    };

    return (
        <div className="screen animate-fade-in" style={{ paddingBottom: '80px' }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="title-gradient">Card Library</h1>
                <button className="btn btn-primary flex items-center gap-2" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={openCreate}>
                    <Plus size={16} /> New Card
                </button>
            </div>

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
                                {card.level === 'b2' && <span className="tag mb-2 ml-2" style={{ fontSize: '0.6rem', background: '#3b82f633', color: '#60a5fa' }}>B2</span>}
                                {card.level === 'advanced' && <span className="tag mb-2 ml-2" style={{ fontSize: '0.6rem', background: '#8b5cf633', color: '#a78bfa' }}>ADV</span>}
                                <h3 className="cyrillic-text" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{card.russian}</h3>
                                <p className="text-secondary">{card.english}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn-icon" onClick={() => openEdit(card)}>
                                    <Edit2 size={18} style={{ color: 'var(--text-secondary)' }} />
                                </button>
                                <button className="btn-icon" onClick={() => handleDelete(card.id)}>
                                    <Trash2 size={18} style={{ color: 'var(--text-secondary)' }} />
                                </button>
                                <button className="btn-icon" onClick={() => playRussianAudio(card.russian)}>
                                    <Volume2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                
                {filteredCards.length === 0 && (
                    <p className="text-center text-secondary mt-8">No cards matching your criteria.</p>
                )}
            </div>

            <EditCardModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveCard} 
                initialData={editingCard} 
            />
        </div>
    );
}
