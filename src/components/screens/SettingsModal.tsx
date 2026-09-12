import React, { useState } from 'react';
import { GameSettings } from '../../game/types';
import { PersistenceService } from '../../services/persistence';
import { GameIcon } from '../ui/GameIcon';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>({ ...settings });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleToggle = (key: 'music' | 'sfx' | 'reducedMotion' | 'showTutorial') => {
    const updated = {
      ...localSettings,
      [key]: !localSettings[key]
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    PersistenceService.saveSettings(updated);
  };

  const handleNameChange = (name: string) => {
    const updated = { ...localSettings, playerName: name };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    PersistenceService.saveSettings(updated);
  };

  const handleResetProgress = () => {
    PersistenceService.resetProgress();
    setShowResetConfirm(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog settings-dialog">
        <div className="modal-header-banner banner-settings">
          <div className="banner-icon-badge">
            <GameIcon name="settings" size={30} color="#FFFFFF" />
          </div>
          <h2>BAKERY SETTINGS</h2>
          <p className="modal-subtitle">Configure audio, gameplay preferences, & baker details</p>
        </div>

        <div className="settings-options-list">
          {/* Player Name */}
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title">Baker Name</span>
              <span className="setting-desc">Appears on high scores & delivery certificates</span>
            </div>
            <input
              type="text"
              maxLength={18}
              className="setting-text-input"
              value={localSettings.playerName}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          {/* Sound Effects Toggle */}
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title">Sound Effects (SFX)</span>
              <span className="setting-desc">Whimsical squirts, stamps, chimes & fanfares</span>
            </div>
            <button
              className={`toggle-switch-btn flex-center-gap ${localSettings.sfx ? 'toggle-on' : 'toggle-off'}`}
              onClick={() => handleToggle('sfx')}
            >
              <GameIcon name={localSettings.sfx ? 'volume-on' : 'volume-off'} size={14} />
              <span>{localSettings.sfx ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Music Toggle */}
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title">Bakery Background Music</span>
              <span className="setting-desc">Gentle procedural bakery melody</span>
            </div>
            <button
              className={`toggle-switch-btn flex-center-gap ${localSettings.music ? 'toggle-on' : 'toggle-off'}`}
              onClick={() => handleToggle('music')}
            >
              <GameIcon name={localSettings.music ? 'volume-on' : 'volume-off'} size={14} />
              <span>{localSettings.music ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title">Reduced Motion</span>
              <span className="setting-desc">Gentler conveyor transitions & animations</span>
            </div>
            <button
              className={`toggle-switch-btn flex-center-gap ${localSettings.reducedMotion ? 'toggle-on' : 'toggle-off'}`}
              onClick={() => handleToggle('reducedMotion')}
            >
              {localSettings.reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Show Tutorial Toggle */}
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title">Tutorial Cues</span>
              <span className="setting-desc">Show Chef Muffin's helpful station reminders</span>
            </div>
            <button
              className={`toggle-switch-btn flex-center-gap ${localSettings.showTutorial ? 'toggle-on' : 'toggle-off'}`}
              onClick={() => handleToggle('showTutorial')}
            >
              {localSettings.showTutorial ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Reset Progress */}
          <div className="setting-reset-box">
            {showResetConfirm ? (
              <div className="reset-confirm-prompt">
                <p>Are you sure? This will wipe your high scores and statistics!</p>
                <div className="reset-confirm-buttons">
                  <button className="btn-danger" onClick={handleResetProgress}>
                    Yes, Delete Everything
                  </button>
                  <button className="btn-secondary-action" onClick={() => setShowResetConfirm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="btn-danger-outline flex-center-gap"
                onClick={() => setShowResetConfirm(true)}
              >
                <GameIcon name="alert" size={14} color="#D32F2F" />
                <span>Reset All Career Progress</span>
              </button>
            )}
            {resetDone && (
              <span className="reset-success-pill flex-center-gap">
                <GameIcon name="check" size={14} color="#10B981" />
                Progress Cleared!
              </span>
            )}
          </div>
        </div>

        <div className="modal-footer-actions">
          <button className="btn-primary-action flex-center-gap" onClick={onClose}>
            <GameIcon name="check" size={16} color="#FFFFFF" />
            <span>Done & Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};
