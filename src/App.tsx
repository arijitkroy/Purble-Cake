import React, { useState, useEffect } from 'react';
import { GameMode, GameSettings } from './game/types';
import { PersistenceService } from './services/persistence';
import { firebaseService } from './services/firebase';
import { soundEngine } from './audio/soundEngine';

import { MainMenu } from './components/screens/MainMenu';
import { GameScreen } from './components/screens/GameScreen';
import { LeaderboardModal } from './components/screens/LeaderboardModal';
import { SettingsModal } from './components/screens/SettingsModal';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'game'>('menu');
  const [activeMode, setActiveMode] = useState<GameMode>('classic');
  const [settings, setSettings] = useState<GameSettings>(() => PersistenceService.getSettings());

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize persistence & firebase from environment
  useEffect(() => {
    const saved = PersistenceService.getSettings();
    setSettings(saved);
    firebaseService.initFirebase();
  }, []);

  // Update audio engine settings
  useEffect(() => {
    soundEngine.setSoundEnabled(settings.sfx);
    soundEngine.setMusicEnabled(settings.music);
  }, [settings.sfx, settings.music]);

  const handleStartGame = (mode: GameMode) => {
    soundEngine.playClick();
    setActiveMode(mode);
    setCurrentScreen('game');
  };

  const handleGoHome = () => {
    soundEngine.playClick();
    setCurrentScreen('menu');
  };

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    PersistenceService.saveSettings(newSettings);
  };

  return (
    <div className={`app-root ${settings.reducedMotion ? 'reduced-motion' : ''}`}>
      {currentScreen === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          onOpenLeaderboard={() => {
            soundEngine.playClick();
            setShowLeaderboard(true);
          }}
          onOpenSettings={() => {
            soundEngine.playClick();
            setShowSettings(true);
          }}
        />
      )}

      {currentScreen === 'game' && (
        <GameScreen
          mode={activeMode}
          settings={settings}
          onGoHome={handleGoHome}
          onOpenLeaderboard={() => {
            soundEngine.playClick();
            setShowLeaderboard(true);
          }}
          onOpenSettings={() => {
            soundEngine.playClick();
            setShowSettings(true);
          }}
        />
      )}

      {/* Global Modals accessible from anywhere */}
      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;
