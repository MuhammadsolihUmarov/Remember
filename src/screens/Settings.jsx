import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, resetProgress } from '../store/progressStore';
import { Moon, Sun, Languages, Trash2, RefreshCw } from 'lucide-react';

export default function Settings() {
    const [settings, setSettingsState] = useState(null);

    useEffect(() => {
        setSettingsState(getSettings());
    }, []);

    if (!settings) return null;

    const handleToggle = (key) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettingsState(newSettings);
        saveSettings(newSettings);
    };

    const handleLimitChange = (val) => {
        const newSettings = { ...settings, dailyNewGoal: parseInt(val) };
        setSettingsState(newSettings);
        saveSettings(newSettings);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            resetProgress();
            window.location.reload();
        }
    };

    return (
        <div className="screen animate-fade-in">
            <h1 className="title-gradient mb-8">Settings</h1>

            <div className="card mb-4">
                <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-3">
                        <Sun size={20} className="text-secondary" />
                        <span>Dark Mode</span>
                    </div>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={settings.darkMode} 
                            onChange={() => handleToggle('darkMode')} 
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                <div className="flex justify-between items-center py-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                        <Languages size={20} className="text-secondary" />
                        <span>Show Transliteration</span>
                    </div>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={settings.showTransliteration} 
                            onChange={() => handleToggle('showTransliteration')} 
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                <div className="flex justify-between items-center py-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                        <RefreshCw size={20} className="text-secondary" />
                        <span>Autoplay Audio</span>
                    </div>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={settings.autoplayAudio} 
                            onChange={() => handleToggle('autoplayAudio')} 
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            <div className="card mb-8">
                <h3 className="mb-4 text-sm font-semibold uppercase text-secondary">Learning Goals</h3>
                <div className="flex justify-between items-center">
                    <span>New cards per day</span>
                    <input 
                        type="number" 
                        className="btn btn-outline" 
                        style={{ width: '80px', padding: '0.5rem' }} 
                        value={settings.dailyNewGoal}
                        onChange={(e) => handleLimitChange(e.target.value)}
                        min="1"
                        max="50"
                    />
                </div>
            </div>

            <button className="btn btn-outline w-full text-danger border-danger flex items-center justify-center gap-2" 
                    style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                    onClick={handleReset}>
                <Trash2 size={18} />
                Reset Progress
            </button>
            
            <p className="text-center text-secondary mt-8 text-sm">
                Russian Speaking App v1.0.0
            </p>

            <style>{`
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 34px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: var(--primary-color);
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
            `}</style>
        </div>
    );
}
