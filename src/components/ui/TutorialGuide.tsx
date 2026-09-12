import React from 'react';
import { GameIcon } from './GameIcon';

interface TutorialGuideProps {
  stepText: string;
  stationHint: string;
  onDismiss: () => void;
}

export const TutorialGuide: React.FC<TutorialGuideProps> = ({
  stepText,
  stationHint,
  onDismiss
}) => {
  return (
    <div className="tutorial-bubble-container">
      <div className="tutorial-avatar-photo">
        <img
          src="/assets/chef_muffin.jpg"
          alt="Chef Muffin"
          className="chef-muffin-img"
        />
      </div>
      <div className="tutorial-content">
        <span className="tutorial-chef-name">CHEF MUFFIN SAYS:</span>
        <p className="tutorial-msg-text">{stepText}</p>
        <span className="tutorial-hint-badge flex-center-gap">
          <GameIcon name="arrow-right" size={12} color="#FF4081" />
          {stationHint}
        </span>
      </div>
      <button
        className="tutorial-dismiss-btn"
        onClick={onDismiss}
        title="Hide tutorial tips"
        aria-label="Hide tutorial tips"
      >
        ✕
      </button>
    </div>
  );
};
