import React, { useState } from 'react';
import { GameMode } from '../../game/types';
import { Cake } from '../bakery/Cake';
import { GameIcon } from '../ui/GameIcon';

interface MainMenuProps {
  onStartGame: (mode: GameMode) => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenLeaderboard,
  onOpenSettings
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div
      className="main-menu-container"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 248, 240, 0.88), rgba(255, 234, 215, 0.94)), url('/assets/bakery_backdrop.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Background Animated Ambience */}
      <div className="menu-background-elements">
        <div className="bg-floating-doughnut bg-item-1"><GameIcon name="sparkles" size={32} color="#F48FB1" /></div>
        <div className="bg-floating-cupcake bg-item-2"><GameIcon name="star" size={36} color="#FFD54F" /></div>
        <div className="bg-floating-cookie bg-item-3"><GameIcon name="heart" size={30} color="#FF80AB" /></div>
        <div className="bg-floating-croissant bg-item-4"><GameIcon name="cake" size={34} color="#CE93D8" /></div>
        <div className="bg-floating-star bg-item-5"><GameIcon name="sparkles" size={28} color="#80DEEA" /></div>
      </div>

      <div className="menu-card">
        {/* Whimsical Bakery Awning */}
        <div className="bakery-roof-awning">
          <div className="awning-stripe stripe-red"></div>
          <div className="awning-stripe stripe-white"></div>
          <div className="awning-stripe stripe-red"></div>
          <div className="awning-stripe stripe-white"></div>
          <div className="awning-stripe stripe-red"></div>
          <div className="awning-stripe stripe-white"></div>
          <div className="awning-stripe stripe-red"></div>
        </div>

        {/* Brand Header with Chef Muffin mascot badge */}
        <div className="menu-brand-header">
          <div className="brand-steam-wrap">
            <span className="steam-puff puff-1"><GameIcon name="cloud" size={16} color="#CBD5E1" /></span>
            <span className="steam-puff puff-2"><GameIcon name="cloud" size={18} color="#E2E8F0" /></span>
          </div>

          <div className="menu-mascot-avatar-wrap">
            <img
              src="/assets/chef_muffin.jpg"
              alt="Chef Muffin Master Baker"
              className="menu-mascot-img"
            />
          </div>

          <h1 className="game-logo-text">
            <span className="logo-purble">PURBLE</span>{' '}
            <span className="logo-cake">CAKE</span>
          </h1>
          <p className="game-tagline">Build. Decorate. Deliver!</p>
        </div>

        {/* Centerpiece Animated Cake Showcase */}
        <div className="menu-cake-showcase">
          <Cake
            cake={{
              base: 'strawberry',
              filling: 'cream',
              frosting: 'vanilla',
              decoration: 'sprinkles',
              topping: 'cherry'
            }}
            size="medium"
            showPlate={true}
          />
        </div>

        {/* Primary Play Mode Buttons */}
        <div className="menu-action-buttons">
          <button
            className="menu-btn btn-mode-classic"
            onClick={() => onStartGame('classic')}
          >
            <span className="btn-main-icon">
              <GameIcon name="star" size={24} color="#FFFFFF" />
            </span>
            <div className="btn-text-block">
              <span className="btn-title">PLAY CLASSIC</span>
              <span className="btn-subtext">Endless levels, 3 lives & rising challenge</span>
            </div>
            <span className="btn-arrow">
              <GameIcon name="arrow-right" size={20} color="#FFFFFF" />
            </span>
          </button>

          <button
            className="menu-btn btn-mode-timed"
            onClick={() => onStartGame('timed')}
          >
            <span className="btn-main-icon">
              <GameIcon name="zap" size={24} color="#FFFFFF" />
            </span>
            <div className="btn-text-block">
              <span className="btn-title">TIMED BAKERY</span>
              <span className="btn-subtext">2-minute high-speed cake rush!</span>
            </div>
            <span className="btn-arrow">
              <GameIcon name="arrow-right" size={20} color="#FFFFFF" />
            </span>
          </button>

          <button
            className="menu-btn btn-mode-practice"
            onClick={() => onStartGame('practice')}
          >
            <span className="btn-main-icon">
              <GameIcon name="cake" size={24} color="#FFFFFF" />
            </span>
            <div className="btn-text-block">
              <span className="btn-title">PRACTICE KITCHEN</span>
              <span className="btn-subtext">Relaxed baking, no timers or stress</span>
            </div>
            <span className="btn-arrow">
              <GameIcon name="arrow-right" size={20} color="#FFFFFF" />
            </span>
          </button>
        </div>

        {/* Secondary Utility Links */}
        <div className="menu-footer-links">
          <button
            className="footer-icon-btn flex-center-gap"
            onClick={() => setShowHowToPlay(true)}
            title="How to Play Guide"
          >
            <GameIcon name="book" size={16} />
            <span>Rules</span>
          </button>
          <button
            className="footer-icon-btn flex-center-gap"
            onClick={onOpenLeaderboard}
            title="High Scores & Firestore Leaderboard"
          >
            <GameIcon name="trophy" size={16} />
            <span>Leaderboard</span>
          </button>
          <button
            className="footer-icon-btn flex-center-gap"
            onClick={onOpenSettings}
            title="Settings"
          >
            <GameIcon name="settings" size={16} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* How To Play Modal */}
      {showHowToPlay && (
        <div className="modal-backdrop">
          <div className="modal-dialog rules-dialog">
            <div className="modal-header-banner banner-rules">
              <div className="banner-icon-badge">
                <GameIcon name="book" size={28} color="#FFFFFF" />
              </div>
              <h2>HOW TO BAKE PURBLE CAKES</h2>
            </div>
            <div className="rules-body">
              <div className="rule-step">
                <span className="step-badge">1</span>
                <div>
                  <strong>Read the Customer Order:</strong> Look at the order tickets on the left. Check the target cake and ingredient tags.
                </div>
              </div>
              <div className="rule-step">
                <span className="step-badge">2</span>
                <div>
                  <strong>Use the 5 Bakery Stations:</strong> Select Cake Base, Filling Layer, Frosting, Decorations, and Topping.
                </div>
              </div>
              <div className="rule-step">
                <span className="step-badge">3</span>
                <div>
                  <strong>Deliver on Conveyor:</strong> Hit <strong>DELIVER CAKE</strong> (or Spacebar). Correct orders score points and increase your combo multiplier!
                </div>
              </div>
              <div className="rule-step">
                <span className="step-badge">4</span>
                <div>
                  <strong>Made a Slip?</strong> Click <strong>Undo Layer</strong> or <strong>Trash Cake</strong> to restart the tray before delivering.
                </div>
              </div>
              <div className="rule-step">
                <span className="step-badge">5</span>
                <div>
                  <strong>Keyboard Controls:</strong>
                  <div className="keys-grid">
                    <span><kbd>1</kbd>–<kbd>5</kbd> Select Station</span>
                    <span><kbd>Space</kbd> Deliver Cake</span>
                    <span><kbd>U</kbd> Undo Layer</span>
                    <span><kbd>Esc</kbd> Pause Game</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer-actions">
              <button
                className="btn-primary-action flex-center-gap"
                onClick={() => setShowHowToPlay(false)}
              >
                <span>Let's Bake!</span>
                <GameIcon name="cake" size={18} color="#FFFFFF" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
