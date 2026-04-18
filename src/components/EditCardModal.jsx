import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const defaultData = {
    russian: '',
    english: '',
    transliteration: '',
    type: 'speaking',
    level: 'fundamental',
    topic: 'custom'
};

export default function EditCardModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState(defaultData);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || defaultData);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ 
            ...formData, 
            id: formData.id || `custom_${Date.now()}` // Generate ID for new cards
        });
        onClose();
    };

    if (!isOpen) return null;

    const modalContent = (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 50, padding: '1rem'
        }}>
            <div className="card" style={{ 
                width: '100%', maxWidth: '450px', 
                maxHeight: '90vh', overflowY: 'auto',
                background: 'var(--card-bg)', color: 'var(--text-primary)', 
                border: '1px solid var(--border-color)',
                padding: '1.5rem', borderRadius: '1rem'
            }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>{initialData ? 'Edit Card' : 'Create Custom Card'}</h2>
                    <button onClick={onClose} className="btn-icon" style={{ cursor: 'pointer' }}>
                        <X size={20} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Russian</label>
                        <input 
                            required
                            name="russian"
                            value={formData.russian}
                            onChange={handleChange}
                            style={{ 
                                width: '100%', background: 'transparent', color: 'var(--text-primary)', 
                                border: '1px solid var(--border-color)', borderRadius: '0.5rem', 
                                padding: '0.5rem', outline: 'none' 
                            }}
                            placeholder="e.g. Спасибо"
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>English</label>
                        <input 
                            required
                            name="english"
                            value={formData.english}
                            onChange={handleChange}
                            style={{ 
                                width: '100%', background: 'transparent', color: 'var(--text-primary)', 
                                border: '1px solid var(--border-color)', borderRadius: '0.5rem', 
                                padding: '0.5rem', outline: 'none' 
                            }}
                            placeholder="e.g. Thank you"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Transliteration (Optional)</label>
                        <input 
                            name="transliteration"
                            value={formData.transliteration}
                            onChange={handleChange}
                            style={{ 
                                width: '100%', background: 'transparent', color: 'var(--text-primary)', 
                                border: '1px solid var(--border-color)', borderRadius: '0.5rem', 
                                padding: '0.5rem', outline: 'none' 
                            }}
                            placeholder="e.g. Spasibo"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Type</label>
                            <select 
                                name="type" 
                                value={formData.type} 
                                onChange={handleChange}
                                style={{ 
                                    width: '100%', background: 'transparent', color: 'var(--text-primary)', 
                                    border: '1px solid var(--border-color)', borderRadius: '0.5rem', 
                                    padding: '0.5rem', outline: 'none' 
                                }}
                            >
                                <option value="speaking">Speaking</option>
                                <option value="listening">Listening</option>
                                <option value="context">Context</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Level</label>
                            <select 
                                name="level" 
                                value={formData.level} 
                                onChange={handleChange}
                                style={{ 
                                    width: '100%', background: 'transparent', color: 'var(--text-primary)', 
                                    border: '1px solid var(--border-color)', borderRadius: '0.5rem', 
                                    padding: '0.5rem', outline: 'none' 
                                }}
                            >
                                <option value="fundamental">Fundamental</option>
                                <option value="b2">B2 Intermediate</option>
                                <option value="advanced">Advanced (C1)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Topic</label>
                        <input 
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            style={{ 
                                width: '100%', background: 'transparent', color: 'var(--text-primary)', 
                                border: '1px solid var(--border-color)', borderRadius: '0.5rem', 
                                padding: '0.5rem', outline: 'none' 
                            }}
                            placeholder="e.g. basics"
                        />
                    </div>

                    {formData.type === 'context' && (
                        <>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Example</label>
                                <textarea 
                                    name="example"
                                    value={formData.example || ''}
                                    onChange={handleChange}
                                    style={{ 
                                        width: '100%', background: 'transparent', color: 'var(--text-primary)', 
                                        border: '1px solid var(--border-color)', borderRadius: '0.5rem', 
                                        padding: '0.5rem', outline: 'none', minHeight: '60px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Example Translation</label>
                                <textarea 
                                    name="example_translation"
                                    value={formData.example_translation || ''}
                                    onChange={handleChange}
                                    style={{ 
                                        width: '100%', background: 'transparent', color: 'var(--text-primary)', 
                                        border: '1px solid var(--border-color)', borderRadius: '0.5rem', 
                                        padding: '0.5rem', outline: 'none', minHeight: '60px'
                                    }}
                                />
                            </div>
                        </>
                    )}

                    <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Card</button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
