import React from 'react';
import { Cake } from './Cake';
import { CakeState, MachineAction } from '../../game/types';
import { GameIcon } from '../ui/GameIcon';

interface ConveyorBeltProps {
  currentCake: CakeState;
  machineAction: MachineAction;
  animatingLayer: string | null;
  onDeliver: () => void;
  onClear: () => void;
  onUndo: () => void;
  canDeliver: boolean;
  canUndo: boolean;
}

export const ConveyorBelt: React.FC<ConveyorBeltProps> = ({
  currentCake,
  machineAction,
  animatingLayer,
  onDeliver,
  onClear,
  onUndo,
  canDeliver,
  canUndo
}) => {
  const isDelivering = machineAction === 'deliver_chute';

  return (
    <div className="conveyor-station-container">
      {/* Conveyor Belt Framework */}
      <div className="conveyor-track-assembly">
        {/* Left intake hatch */}
        <div className="conveyor-hatch hatch-left">
          <div className="hatch-arch"></div>
          <span className="hatch-label">NEW TRAY</span>
        </div>

        {/* Center Track Area */}
        <div className="conveyor-belt-surface">
          {/* Animated striped rubber belt */}
          <div className={`belt-rubber-treads ${isDelivering ? 'belt-moving-fast' : 'belt-idle'}`}></div>

          {/* Roller wheels under the track */}
          <div className="roller-wheels">
            <span className="roller"><GameIcon name="cog" size={15} color="#94A3B8" /></span>
            <span className="roller"><GameIcon name="cog" size={15} color="#94A3B8" /></span>
            <span className="roller"><GameIcon name="cog" size={15} color="#94A3B8" /></span>
            <span className="roller"><GameIcon name="cog" size={15} color="#94A3B8" /></span>
            <span className="roller"><GameIcon name="cog" size={15} color="#94A3B8" /></span>
          </div>

          {/* Active Cake Carriage */}
          <div className={`cake-carriage ${isDelivering ? 'cake-sliding-out' : ''}`}>
            <Cake
              cake={currentCake}
              size="large"
              animateLayer={animatingLayer}
              showPlate={true}
            />
          </div>
        </div>

        {/* Right Delivery Hatch */}
        <div className="conveyor-hatch hatch-right">
          <div className="delivery-sensor">
            <div className="sensor-beacon blink-pulse"></div>
          </div>
          <div className="hatch-arch right-arch"></div>
          <span className="hatch-label flex-center-gap">
            <GameIcon name="package" size={12} color="#10B981" />
            DISPATCH
          </span>
        </div>
      </div>

      {/* Belt Quick Action Buttons */}
      <div className="conveyor-control-buttons">
        <button
          className="btn-conveyor btn-undo"
          onClick={onUndo}
          disabled={!canUndo || isDelivering}
          title="Undo the last added layer (Shortcut: U)"
          aria-label="Undo last step"
        >
          <span className="btn-icon"><GameIcon name="undo" size={16} /></span>
          <span className="btn-text">Undo Layer</span>
        </button>

        <button
          className="btn-conveyor btn-clear"
          onClick={onClear}
          disabled={!currentCake.base || isDelivering}
          title="Trash this cake and start fresh"
          aria-label="Trash cake and start fresh"
        >
          <span className="btn-icon"><GameIcon name="trash" size={16} /></span>
          <span className="btn-text">Trash Cake</span>
        </button>

        <button
          className={`btn-conveyor btn-deliver ${canDeliver ? 'btn-ready-deliver' : ''}`}
          onClick={onDeliver}
          disabled={!canDeliver || isDelivering}
          title="Send cake down the delivery conveyor! (Shortcut: Space)"
          aria-label="Send cake for delivery"
        >
          <span className="btn-icon"><GameIcon name="truck" size={18} /></span>
          <span className="btn-text">DELIVER CAKE!</span>
        </button>
      </div>
    </div>
  );
};
