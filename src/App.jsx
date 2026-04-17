import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './screens/Dashboard';
import LearnNew from './screens/LearnNew';
import ReviewFlow from './screens/ReviewFlow';
import Library from './screens/Library';
import Settings from './screens/Settings';
import { getSettings, applyTheme } from './store/progressStore';

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  useEffect(() => {
    // Apply theme on load
    const settings = getSettings();
    applyTheme(settings.darkMode);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard setScreen={setCurrentScreen} />;
      case 'learn':
        return <LearnNew setScreen={setCurrentScreen} />;
      case 'review':
        return <ReviewFlow setScreen={setCurrentScreen} />;
      case 'library':
        return <Library />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setScreen={setCurrentScreen} />;
    }
  };

  return (
    <div className="container">
      {renderScreen()}
      <Navigation currentScreen={currentScreen} setScreen={setCurrentScreen} />
    </div>
  );
}

export default App;
