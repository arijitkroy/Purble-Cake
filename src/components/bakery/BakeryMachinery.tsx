import React from 'react';
import { MachineAction } from '../../game/types';
import { GameIcon } from '../ui/GameIcon';

interface MachineryProps {
  currentAction: MachineAction;
  activeStation: 'base' | 'filling' | 'frosting' | 'decoration' | 'topping' | null;
}

export const BakeryMachinery: React.FC<MachineryProps> = ({ currentAction, activeStation }) => {
  return (
    <div className="bakery-machinery-wrapper">
      {/* Top Gantry Bar */}
      <div className="machinery-overhead-rail">
        <div className="gear gear-left rotating">
          <GameIcon name="cog" size={22} color="#64748B" />
        </div>
        <div className="steam-pipe">
          <div className="steam-cloud steam-1">
            <GameIcon name="cloud" size={18} color="#CBD5E1" />
          </div>
          <div className="steam-cloud steam-2">
            <GameIcon name="cloud" size={18} color="#E2E8F0" />
          </div>
        </div>
        <div className="rail-track">
          <div className="track-rivets">••••••••••••••••••••••••••••••••••••••••</div>
        </div>
        <div className="gear gear-right rotating-reverse">
          <GameIcon name="cog" size={22} color="#64748B" />
        </div>
      </div>

      {/* Interactive Dispensers */}
      <div className="machinery-dispenser-units">
        {/* Dispenser 1: Sponge Press */}
        <div
          className={`dispenser-unit unit-base ${
            activeStation === 'base' || currentAction === 'dispense_base' ? 'active-unit' : ''
          }`}
        >
          <div className="dispenser-nozzle base-stamper">
            <div className="stamper-shaft"></div>
            <div className="stamper-head">
              <GameIcon name="layers" size={24} color="#D97706" />
            </div>
          </div>
          <div className="dispenser-label">BASE PRESS</div>
        </div>

        {/* Dispenser 2: Cream Filling Injector */}
        <div
          className={`dispenser-unit unit-filling ${
            activeStation === 'filling' || currentAction === 'dispense_filling' ? 'active-unit' : ''
          }`}
        >
          <div className="dispenser-nozzle filling-injector">
            <div className="injector-tube"></div>
            <div className="injector-tip">
              <GameIcon name="droplet" size={24} color="#0284C7" />
            </div>
          </div>
          <div className="dispenser-label">CREAM PIPE</div>
        </div>

        {/* Dispenser 3: Frosting Waterfall */}
        <div
          className={`dispenser-unit unit-frosting ${
            activeStation === 'frosting' || currentAction === 'apply_frosting' ? 'active-unit' : ''
          }`}
        >
          <div className="dispenser-nozzle frosting-bell">
            <div className="bell-dome"></div>
            <div className="bell-drip">
              <GameIcon name="cloud" size={24} color="#E11D48" />
            </div>
          </div>
          <div className="dispenser-label">ICING SWIRL</div>
        </div>

        {/* Dispenser 4: Sprinkle Shower */}
        <div
          className={`dispenser-unit unit-decor ${
            activeStation === 'decoration' || currentAction === 'shower_decor' ? 'active-unit' : ''
          }`}
        >
          <div className="dispenser-nozzle decor-shaker">
            <div className="shaker-canister"></div>
            <div className="shaker-sparkles">
              <GameIcon name="sparkles" size={24} color="#F59E0B" />
            </div>
          </div>
          <div className="dispenser-label">SPRINKLER</div>
        </div>

        {/* Dispenser 5: Topping Claw */}
        <div
          className={`dispenser-unit unit-topping ${
            activeStation === 'topping' || currentAction === 'drop_topping' ? 'active-unit' : ''
          }`}
        >
          <div className="dispenser-nozzle topping-claw">
            <div className="claw-arm"></div>
            <div className="claw-fingers">
              <GameIcon name="cherry" size={24} color="#DC2626" />
            </div>
          </div>
          <div className="dispenser-label">TOPPING CLAW</div>
        </div>
      </div>
    </div>
  );
};
