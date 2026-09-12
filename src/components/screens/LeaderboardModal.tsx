import React, { useState, useEffect } from 'react';
import { HighScoreEntry } from '../../game/types';
import { PersistenceService } from '../../services/persistence';
import { firebaseService } from '../../services/firebase';
import { GameIcon } from '../ui/GameIcon';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [scores, setScores] = useState<HighScoreEntry[]>([]);
  const [isCloud, setIsCloud] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadScores = async () => {
    setLoading(true);
    const result = await PersistenceService.getCombinedLeaderboard();
    setScores(result.scores);
    setIsCloud(result.isOnline);
    setLoading(false);
  };

  useEffect(() => {
    loadScores();
  }, []);

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog leaderboard-dialog">
        <div className="modal-header-banner banner-leaderboard">
          <div className="banner-icon-badge">
            <GameIcon name="trophy" size={32} color="#78350F" />
          </div>
          <h2>HALL OF MASTER BAKERS</h2>
          <div className="leaderboard-status-badge">
            {isCloud ? (
              <span className="status-online flex-center-gap">
                <GameIcon name="cloud-sun" size={12} color="#15803D" />
                Firebase Firestore Live Sync
              </span>
            ) : (
              <span className="status-offline flex-center-gap">
                <GameIcon name="package" size={12} color="#5D4037" />
                Local Browser Storage
              </span>
            )}
          </div>
        </div>

        <div className="leaderboard-table-wrapper">
          {loading ? (
            <div className="leaderboard-loading flex-center-gap">
              <GameIcon name="refresh" size={18} className="rotating" />
              <span>Whisking high scores...</span>
            </div>
          ) : scores.length === 0 ? (
            <div className="leaderboard-empty">
              <p>No high scores recorded yet. Be the first to deliver a delicious cake!</p>
            </div>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Baker</th>
                  <th>Score</th>
                  <th>Mode</th>
                  <th>Level</th>
                  <th>Cakes</th>
                  <th>Acc</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((entry, index) => {
                  return (
                    <tr key={index} className={index < 3 ? `row-top-${index + 1}` : ''}>
                      <td className="col-rank">
                        {index === 0 ? (
                          <GameIcon name="trophy" size={16} color="#EAB308" />
                        ) : index === 1 ? (
                          <GameIcon name="award" size={16} color="#94A3B8" />
                        ) : index === 2 ? (
                          <GameIcon name="award" size={16} color="#B45309" />
                        ) : (
                          `${index + 1}`
                        )}
                      </td>
                      <td className="col-name">
                        <strong>{entry.name}</strong>
                      </td>
                      <td className="col-score">{entry.score.toLocaleString()}</td>
                      <td className="col-mode">
                        <span className={`mode-badge mode-${entry.mode}`}>
                          {entry.mode}
                        </span>
                      </td>
                      <td className="col-level">Lv {entry.level}</td>
                      <td className="col-delivered">{entry.cakesDelivered}</td>
                      <td className="col-acc">{entry.accuracy}%</td>
                      <td className="col-date">{entry.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="modal-footer-actions modal-footer-split">
          <button className="btn-secondary-action flex-center-gap" onClick={loadScores}>
            <GameIcon name="refresh" size={15} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary-action flex-center-gap" onClick={onClose}>
            <span>Back to Bakery</span>
            <GameIcon name="cake" size={16} color="#FFFFFF" />
          </button>
        </div>
      </div>
    </div>
  );
};
