import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameMode, GameStatistics } from '../../game/types';
import { calculateGrade } from '../../game/scoreCalculator';
import { PersistenceService } from '../../services/persistence';
import { GameIcon } from '../ui/GameIcon';

interface GameOverProps {
  score: number;
  mode: GameMode;
  level: number;
  stats: GameStatistics;
  defaultPlayerName: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onViewLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverProps> = ({
  score,
  mode,
  level,
  stats,
  defaultPlayerName,
  onPlayAgain,
  onGoHome,
  onViewLeaderboard
}) => {
  const [playerName, setPlayerName] = useState(defaultPlayerName || 'Sweet Baker');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const gradeInfo = calculateGrade(score, stats.accuracy, stats.completed);

  useEffect(() => {
    if (gradeInfo.grade === 'S' || gradeInfo.grade === 'A' || score > 1000) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF4081', '#FFD54F', '#69F0AE', '#40C4FF', '#7C4DFF']
      });
    }

    const autoSave = async () => {
      setIsSaving(true);
      await PersistenceService.saveScore({
        name: playerName,
        score,
        mode,
        level,
        cakesDelivered: stats.completed,
        accuracy: stats.accuracy,
        date: new Date().toISOString().split('T')[0]
      });
      setIsSaving(false);
      setIsSaved(true);
    };

    autoSave();
  }, [score, mode, level, stats]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    setIsSaving(true);
    await PersistenceService.saveScore({
      name: playerName.trim(),
      score,
      mode,
      level,
      cakesDelivered: stats.completed,
      accuracy: stats.accuracy,
      date: new Date().toISOString().split('T')[0]
    });
    setIsSaving(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog game-over-dialog">
        {/* Bakery Closed Sign */}
        <div className="bakery-closed-sign">
          <div className="sign-chain left-chain"></div>
          <div className="sign-chain right-chain"></div>
          <div className="sign-board">
            <div className="sign-icon flex-center">
              <GameIcon name="cloud-sun" size={28} color="#FFD54F" />
            </div>
            <h2>BAKERY CLOSED!</h2>
            <span className="sign-sub">Shift Summary</span>
          </div>
        </div>

        {/* Grade Badge Banner */}
        <div className={`performance-grade-badge grade-${gradeInfo.grade.toLowerCase()}`}>
          <div className="grade-letter">{gradeInfo.grade}</div>
          <div className="grade-desc">
            <span className="grade-title">{gradeInfo.title}</span>
            <span className="grade-comment">{gradeInfo.comment}</span>
          </div>
        </div>

        {/* Primary Statistics Grid */}
        <div className="game-over-stats-grid">
          <div className="stat-card">
            <span className="stat-card-label">FINAL SCORE</span>
            <span className="stat-card-val score-highlight flex-center-gap">
              <GameIcon name="star" size={13} color="#D81B60" />
              {score.toLocaleString()}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">CAKES DELIVERED</span>
            <span className="stat-card-val flex-center-gap">
              <GameIcon name="cake" size={13} color="#0284C7" />
              {stats.completed}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">PERFECT ORDERS</span>
            <span className="stat-card-val flex-center-gap">
              <GameIcon name="award" size={13} color="#F59E0B" />
              {stats.perfect}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">BEST COMBO</span>
            <span className="stat-card-val flex-center-gap">
              <GameIcon name="flame" size={13} color="#E11D48" />
              x{stats.bestCombo}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">ACCURACY</span>
            <span className="stat-card-val flex-center-gap">
              <GameIcon name="check" size={13} color="#10B981" />
              {stats.accuracy}%
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">LEVEL REACHED</span>
            <span className="stat-card-val flex-center-gap">
              <GameIcon name="layers" size={13} color="#7C4DFF" />
              Level {level}
            </span>
          </div>
        </div>

        {/* Leaderboard Name Submission Form */}
        <form className="name-save-form" onSubmit={handleUpdateName}>
          <label htmlFor="baker-name-input">Baker Name for Leaderboard:</label>
          <div className="name-input-row">
            <input
              id="baker-name-input"
              type="text"
              maxLength={18}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your baker name"
            />
            <button type="submit" disabled={isSaving} className="btn-update-name flex-center-gap">
              <span>{isSaving ? 'Saving...' : 'Update Name'}</span>
            </button>
          </div>
          {isSaved && (
            <span className="save-status-msg flex-center-gap">
              <GameIcon name="check" size={14} color="#10B981" />
              Recorded on Leaderboard & Firestore
            </span>
          )}
        </form>

        {/* Action Buttons */}
        <div className="game-over-actions">
          <button className="btn-primary-action btn-play-again flex-center-gap" onClick={onPlayAgain}>
            <GameIcon name="refresh" size={16} color="#FFFFFF" />
            <span>Play Again</span>
          </button>
          <button className="btn-secondary-action flex-center-gap" onClick={onViewLeaderboard}>
            <GameIcon name="trophy" size={16} />
            <span>View Scores</span>
          </button>
          <button className="btn-secondary-action flex-center-gap" onClick={onGoHome}>
            <GameIcon name="home" size={16} />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
