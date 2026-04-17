import React from 'react';
import { Home, BookOpen, Repeat, Library, Settings } from 'lucide-react';

export default function Navigation({ currentScreen, setScreen }) {
    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Home' },
        { id: 'learn', icon: BookOpen, label: 'Learn' },
        { id: 'review', icon: Repeat, label: 'Review' },
        { id: 'library', icon: Library, label: 'Library' },
        { id: 'settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                    <a 
                        key={item.id} 
                        href={`#${item.id}`}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setScreen(item.id);
                        }}
                    >
                        <Icon />
                        <span>{item.label}</span>
                    </a>
                );
            })}
        </nav>
    );
}
