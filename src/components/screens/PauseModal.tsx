import React from 'react';
import { GameIcon } from '../ui/GameIcon';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onQuit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onOpenSettings,
  onQuit
}) => {
  return (
    <div className="modal-backdrop pause-backdrop">
      <div className="modal-dialog pause-dialog">
        <div className="modal-header-banner banner-pause">
          <div className="banner-icon-badge">
            <GameIcon name="pause" size={30} color="#FFFFFF" />
          </div>
          <h2>GAME PAUSED</h2>
          <p className="modal-subtitle">Take a sweet breather! The kitchen is frozen.</p>
        </div>

        <div className="pause-actions-list">
          <button className="btn-primary-action btn-resume flex-center-gap" onClick={onResume} autoFocus>
            <GameIcon name="play" size={18} color="#FFFFFF" />
            <span>Resume Baking</span>
          </button>
          <button className="btn-secondary-action flex-center-gap" onClick={onRestart}>
            <GameIcon name="refresh" size={16} />
            <span>Restart Shift</span>
          </button>
          <button className="btn-secondary-action flex-center-gap" onClick={onOpenSettings}>
            <GameIcon name="settings" size={16} />
            <span>Audio & Settings</span>
          </button>
          <button className="btn-secondary-action btn-quit flex-center-gap" onClick={onQuit}>
            <GameIcon name="home" size={16} />
            <span>Quit to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
