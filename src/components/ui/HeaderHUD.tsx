import React from 'react';
import { GameMode } from '../../game/types';
import { getComboMultiplier } from '../../game/scoreCalculator';
import { GameIcon } from './GameIcon';

interface HeaderHUDProps {
  score: number;
  combo: number;
  lives: number;
  level: number;
  mode: GameMode;
  timeRemaining?: number;
  onPause: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  score,
  combo,
  lives,
  level,
  mode,
  timeRemaining = 0,
  onPause,
  isMuted,
  onToggleSound
}) => {
  const multiplier = getComboMultiplier(combo);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <header className="game-hud-header">
      {/* Brand & Mode Tag */}
      <div className="hud-left-section">
        <div className="hud-brand-group">
          <div className="hud-cake-badge">
            <GameIcon name="cake" size={24} color="#7C4DFF" />
          </div>
          <div className="brand-text-col">
            <span className="hud-title">PURBLE CAKE</span>
            <span className="hud-mode-badge mode-{mode}">
              {mode.toUpperCase()} MODE • LVL {level}
            </span>
          </div>
        </div>
      </div>

      {/* Core Stats: Score & Combo */}
      <div className="hud-center-section">
        <div className="hud-stat-box hud-score-box">
          <span className="hud-stat-label">SCORE</span>
          <span className="hud-stat-value hud-score-value">{score.toLocaleString()}</span>
        </div>

        {/* Combo Multiplier Meter */}
        <div className={`hud-stat-box hud-combo-box ${combo >= 2 ? 'combo-active' : ''}`}>
          <span className="hud-stat-label">COMBO</span>
          <div className="combo-display">
            <span className="combo-count">{combo}x</span>
            {combo >= 2 && (
              <span className="multiplier-pill flex-center-gap">
                <GameIcon name="flame" size={11} color="#FFFFFF" />
                {multiplier}x PTS
              </span>
            )}
          </div>
        </div>

        {/* Lives or Timed clock */}
        {mode === 'classic' && (
          <div className="hud-stat-box hud-lives-box">
            <span className="hud-stat-label">BAKER LIVES</span>
            <div className="lives-hearts-row">
              {[1, 2, 3].map((heartIndex) => {
                const isFull = heartIndex <= lives;
                return (
                  <span key={heartIndex} className="heart-icon-wrap">
                    <GameIcon
                      name="heart"
                      size={18}
                      color={isFull ? '#E11D48' : '#CBD5E1'}
                    />
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {mode === 'timed' && (
          <div className="hud-stat-box hud-timer-box">
            <span className="hud-stat-label">TIME LEFT</span>
            <span className={`hud-stat-value timer-clock flex-center-gap ${timeRemaining <= 20 ? 'timer-urgent' : ''}`}>
              <GameIcon name="clock" size={16} />
              {timeFormatted}
            </span>
          </div>
        )}
      </div>

      {/* Action Controls: Sound & Pause */}
      <div className="hud-right-section">
        <button
          className="hud-icon-btn"
          onClick={onToggleSound}
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
          aria-label="Toggle audio"
        >
          <GameIcon name={isMuted ? 'volume-off' : 'volume-on'} size={18} color="#475569" />
        </button>

        <button
          className="hud-icon-btn hud-pause-btn"
          onClick={onPause}
          title="Pause game (Shortcut: Esc)"
          aria-label="Pause game"
        >
          <GameIcon name="pause" size={18} color="#475569" />
        </button>
      </div>
    </header>
  );
};
