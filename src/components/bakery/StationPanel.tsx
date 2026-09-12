import React from 'react';
import {
  BaseFlavor,
  FillingFlavor,
  FrostingFlavor,
  DecorationType,
  ToppingType,
  CakeState,
  CustomerOrder
} from '../../game/types';
import {
  BASE_OPTIONS,
  FILLING_OPTIONS,
  FROSTING_OPTIONS,
  DECORATION_OPTIONS,
  TOPPING_OPTIONS
} from '../../data/ingredients';
import { GameIcon } from '../ui/GameIcon';

type StationCategory = 'base' | 'filling' | 'frosting' | 'decoration' | 'topping';

interface StationPanelProps {
  activeStation: StationCategory;
  onSelectStation: (station: StationCategory) => void;
  currentCake: CakeState;
  targetOrder: CustomerOrder | null;
  availableBases: BaseFlavor[];
  availableFillings: FillingFlavor[];
  availableFrostings: FrostingFlavor[];
  availableDecorations: DecorationType[];
  availableToppings: ToppingType[];
  onApplyBase: (base: BaseFlavor) => void;
  onApplyFilling: (filling: FillingFlavor) => void;
  onApplyFrosting: (frosting: FrostingFlavor) => void;
  onApplyDecoration: (decoration: DecorationType) => void;
  onApplyTopping: (topping: ToppingType) => void;
  tutorialStep?: StationCategory | null;
}

export const StationPanel: React.FC<StationPanelProps> = ({
  activeStation,
  onSelectStation,
  currentCake,
  targetOrder,
  availableBases,
  availableFillings,
  availableFrostings,
  availableDecorations,
  availableToppings,
  onApplyBase,
  onApplyFilling,
  onApplyFrosting,
  onApplyDecoration,
  onApplyTopping,
  tutorialStep
}) => {
  const stationTabs: { id: StationCategory; name: string; icon: string; currentVal: string | null }[] = [
    { id: 'base', name: '1. Base', icon: 'layers', currentVal: currentCake.base },
    { id: 'filling', name: '2. Filling', icon: 'droplet', currentVal: currentCake.filling },
    { id: 'frosting', name: '3. Frosting', icon: 'cloud', currentVal: currentCake.frosting },
    { id: 'decoration', name: '4. Decor', icon: 'sparkles', currentVal: currentCake.decoration },
    { id: 'topping', name: '5. Topping', icon: 'cherry', currentVal: currentCake.topping }
  ];

  return (
    <div className="stations-card-container">
      {/* Station Category Navigation Tabs */}
      <div className="station-nav-tabs" role="tablist">
        {stationTabs.map((tab) => {
          const isSelected = activeStation === tab.id;
          const isTutorialTarget = tutorialStep === tab.id;
          const hasItem = Boolean(tab.currentVal);

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isSelected}
              className={`station-tab ${isSelected ? 'tab-active' : ''} ${
                isTutorialTarget ? 'tab-tutorial-pulse' : ''
              }`}
              onClick={() => onSelectStation(tab.id)}
            >
              <span className="tab-icon">
                <GameIcon name={tab.icon} size={16} />
              </span>
              <span className="tab-title">{tab.name}</span>
              {hasItem && (
                <span className="tab-applied-badge">
                  <GameIcon name="check" size={10} color="#FFFFFF" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive Ingredient Selector Tray */}
      <div className="station-content-tray">
        {/* BASE STATION */}
        {activeStation === 'base' && (
          <div className="ingredient-grid">
            {BASE_OPTIONS.filter((b) => availableBases.includes(b.id)).map((option) => {
              const isApplied = currentCake.base === option.id;
              const isTarget = targetOrder?.targetCake.base === option.id;

              return (
                <button
                  key={option.id}
                  className={`ingredient-btn ${isApplied ? 'ingredient-applied' : ''} ${
                    isTarget && tutorialStep === 'base' ? 'ingredient-target-glow' : ''
                  }`}
                  onClick={() => onApplyBase(option.id)}
                  style={{
                    borderColor: option.secondaryColor,
                    backgroundColor: isApplied ? `${option.color}33` : undefined
                  }}
                >
                  <div
                    className="ingredient-swatch"
                    style={{ backgroundColor: option.color, border: `2px solid ${option.secondaryColor}` }}
                  >
                    <GameIcon name={option.iconType} size={18} color={option.secondaryColor} />
                  </div>
                  <div className="ingredient-info">
                    <span className="ingredient-name">{option.name}</span>
                    <span className="ingredient-desc">{option.description}</span>
                  </div>
                  {isApplied && (
                    <span className="applied-pill">
                      <GameIcon name="check" size={10} /> Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* FILLING STATION */}
        {activeStation === 'filling' && (
          <div className="ingredient-grid">
            {availableFillings.length === 0 ? (
              <div className="station-locked-message">
                <GameIcon name="droplet" size={16} color="#0284C7" />
                <span>Filling unlocks in Level 2! Skip to Frosting.</span>
              </div>
            ) : (
              FILLING_OPTIONS.filter((f) => availableFillings.includes(f.id)).map((option) => {
                const isApplied = currentCake.filling === option.id;
                const isTarget = targetOrder?.targetCake.filling === option.id;

                return (
                  <button
                    key={option.id}
                    className={`ingredient-btn ${isApplied ? 'ingredient-applied' : ''} ${
                      isTarget && tutorialStep === 'filling' ? 'ingredient-target-glow' : ''
                    }`}
                    onClick={() => onApplyFilling(option.id)}
                    style={{
                      borderColor: option.secondaryColor,
                      backgroundColor: isApplied ? `${option.color}33` : undefined
                    }}
                  >
                    <div
                      className="ingredient-swatch"
                      style={{ backgroundColor: option.color, border: `2px solid ${option.secondaryColor}` }}
                    >
                      <GameIcon name={option.iconType} size={18} color={option.secondaryColor} />
                    </div>
                    <div className="ingredient-info">
                      <span className="ingredient-name">{option.name}</span>
                      <span className="ingredient-desc">{option.description}</span>
                    </div>
                    {isApplied && (
                      <span className="applied-pill">
                        <GameIcon name="check" size={10} /> Selected
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* FROSTING STATION */}
        {activeStation === 'frosting' && (
          <div className="ingredient-grid">
            {FROSTING_OPTIONS.filter((fr) => availableFrostings.includes(fr.id)).map((option) => {
              const isApplied = currentCake.frosting === option.id;
              const isTarget = targetOrder?.targetCake.frosting === option.id;

              return (
                <button
                  key={option.id}
                  className={`ingredient-btn ${isApplied ? 'ingredient-applied' : ''} ${
                    isTarget && tutorialStep === 'frosting' ? 'ingredient-target-glow' : ''
                  }`}
                  onClick={() => onApplyFrosting(option.id)}
                  style={{
                    borderColor: option.secondaryColor,
                    backgroundColor: isApplied ? `${option.color}33` : undefined
                  }}
                >
                  <div
                    className="ingredient-swatch"
                    style={{ backgroundColor: option.color, border: `2px solid ${option.secondaryColor}` }}
                  >
                    <GameIcon name={option.iconType} size={18} color={option.secondaryColor} />
                  </div>
                  <div className="ingredient-info">
                    <span className="ingredient-name">{option.name}</span>
                    <span className="ingredient-desc">{option.description}</span>
                  </div>
                  {isApplied && (
                    <span className="applied-pill">
                      <GameIcon name="check" size={10} /> Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* DECORATION STATION */}
        {activeStation === 'decoration' && (
          <div className="ingredient-grid">
            {DECORATION_OPTIONS.filter((d) => availableDecorations.includes(d.id)).map((option) => {
              const isApplied = currentCake.decoration === option.id;
              const isTarget = targetOrder?.targetCake.decoration === option.id;

              return (
                <button
                  key={option.id}
                  className={`ingredient-btn ${isApplied ? 'ingredient-applied' : ''} ${
                    isTarget && tutorialStep === 'decoration' ? 'ingredient-target-glow' : ''
                  }`}
                  onClick={() => onApplyDecoration(option.id)}
                  style={{
                    borderColor: option.secondaryColor,
                    backgroundColor: isApplied ? `${option.color}33` : undefined
                  }}
                >
                  <div
                    className="ingredient-swatch"
                    style={{ backgroundColor: option.color, border: `2px solid ${option.secondaryColor}` }}
                  >
                    <GameIcon name={option.iconType} size={18} color={option.secondaryColor} />
                  </div>
                  <div className="ingredient-info">
                    <span className="ingredient-name">{option.name}</span>
                    <span className="ingredient-desc">{option.description}</span>
                  </div>
                  {isApplied && (
                    <span className="applied-pill">
                      <GameIcon name="check" size={10} /> Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* TOPPING STATION */}
        {activeStation === 'topping' && (
          <div className="ingredient-grid">
            {availableToppings.length === 0 ? (
              <div className="station-locked-message">
                <GameIcon name="cherry" size={16} color="#DC2626" />
                <span>Toppings unlock in Level 3! Deliver your cake!</span>
              </div>
            ) : (
              TOPPING_OPTIONS.filter((t) => availableToppings.includes(t.id)).map((option) => {
                const isApplied = currentCake.topping === option.id;
                const isTarget = targetOrder?.targetCake.topping === option.id;

                return (
                  <button
                    key={option.id}
                    className={`ingredient-btn ${isApplied ? 'ingredient-applied' : ''} ${
                      isTarget && tutorialStep === 'topping' ? 'ingredient-target-glow' : ''
                    }`}
                    onClick={() => onApplyTopping(option.id)}
                    style={{
                      borderColor: option.secondaryColor,
                      backgroundColor: isApplied ? `${option.color}33` : undefined
                    }}
                  >
                    <div
                      className="ingredient-swatch"
                      style={{ backgroundColor: option.color, border: `2px solid ${option.secondaryColor}` }}
                    >
                      <GameIcon name={option.iconType} size={18} color={option.secondaryColor} />
                    </div>
                    <div className="ingredient-info">
                      <span className="ingredient-name">{option.name}</span>
                      <span className="ingredient-desc">{option.description}</span>
                    </div>
                    {isApplied && (
                      <span className="applied-pill">
                        <GameIcon name="check" size={10} /> Selected
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
