import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CakeState,
  CustomerOrder,
  GameMode,
  GameStatistics,
  MachineAction,
  BaseFlavor,
  FillingFlavor,
  FrostingFlavor,
  DecorationType,
  ToppingType,
  ValidationError,
  GameSettings
} from '../../game/types';
import { getLevelConfig } from '../../data/levels';
import { generateOrder } from '../../game/orderGenerator';
import { validateCake } from '../../game/orderValidator';
import { calculateOrderScore } from '../../game/scoreCalculator';
import { soundEngine } from '../../audio/soundEngine';
import { PersistenceService } from '../../services/persistence';

import { HeaderHUD } from '../ui/HeaderHUD';
import { OrderQueue } from '../ui/OrderQueue';
import { ConveyorBelt } from '../bakery/ConveyorBelt';
import { BakeryMachinery } from '../bakery/BakeryMachinery';
import { StationPanel } from '../bakery/StationPanel';
import { FloatingFeedback, FloatingItem } from '../ui/FloatingFeedback';
import { InspectionModal } from '../ui/InspectionModal';
import { TutorialGuide } from '../ui/TutorialGuide';
import { GameOverModal } from './GameOverModal';
import { PauseModal } from './PauseModal';

type StationCategory = 'base' | 'filling' | 'frosting' | 'decoration' | 'topping';

interface GameScreenProps {
  mode: GameMode;
  settings: GameSettings;
  onGoHome: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
}

const INITIAL_CAKE: CakeState = {
  base: null,
  filling: null,
  frosting: null,
  decoration: null,
  topping: null
};

export const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  settings,
  onGoHome,
  onOpenLeaderboard,
  onOpenSettings
}) => {
  // Game loop state
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timedRemaining, setTimedRemaining] = useState<number>(mode === 'timed' ? 120 : 0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Active cake & history for Undo
  const [currentCake, setCurrentCake] = useState<CakeState>(INITIAL_CAKE);
  const cakeHistoryRef = useRef<CakeState[]>([]);

  // Active Station
  const [activeStation, setActiveStation] = useState<StationCategory>('base');
  const [machineAction, setMachineAction] = useState<MachineAction>('idle');
  const [animatingLayer, setAnimatingLayer] = useState<string | null>(null);

  // Order Queue
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const orderCountRef = useRef<number>(0);

  // Statistics
  const [stats, setStats] = useState<GameStatistics>({
    completed: 0,
    failed: 0,
    perfect: 0,
    bestCombo: 0,
    accuracy: 100
  });

  // UI Modals & Popups
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);
  const [inspectionData, setInspectionData] = useState<{
    order: CustomerOrder;
    cake: CakeState;
    errors: ValidationError[];
  } | null>(null);

  // Tutorial tracking
  const [showTutorialTips, setShowTutorialTips] = useState<boolean>(
    settings.showTutorial && mode === 'classic'
  );

  const levelConfig = getLevelConfig(level);

  // Sound Engine sync
  useEffect(() => {
    soundEngine.setSoundEnabled(settings.sfx);
    soundEngine.setMusicEnabled(settings.music);
    return () => {
      soundEngine.stopBakeryMusic();
    };
  }, [settings.sfx, settings.music]);

  // Initial order generation
  useEffect(() => {
    const initialOrder = generateOrder(1, mode, 0);
    orderCountRef.current = 1;
    setOrders([initialOrder]);
    setActiveOrderId(initialOrder.id);
  }, [mode]);

  // Floating feedback adder helper
  const addFloatingItem = useCallback(
    (text: string, type: FloatingItem['type'], subtext?: string) => {
      const newItem: FloatingItem = {
        id: `float_${Date.now()}_${Math.random()}`,
        text,
        type,
        subtext
      };
      setFloatingItems((prev) => [...prev, newItem]);
    },
    []
  );

  const removeFloatingItem = useCallback((id: string) => {
    setFloatingItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Timer Tick Interval (handles order expiry and timed mode countdown)
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const interval = window.setInterval(() => {
      // 1. Timed mode overall countdown
      if (mode === 'timed') {
        setTimedRemaining((prev) => {
          if (prev <= 1) {
            setIsGameOver(true);
            soundEngine.playMistake();
            return 0;
          }
          if (prev <= 11) {
            soundEngine.playTimerWarning();
          }
          return prev - 0.25;
        });
      }

      // 2. Order timers
      if (mode !== 'practice') {
        setOrders((prevOrders) => {
          let hasExpired = false;
          let expiredOrder: CustomerOrder | null = null;

          const updated = prevOrders.map((order) => {
            const nextTime = order.remainingTime - 0.25;
            if (nextTime <= 0 && !hasExpired) {
              hasExpired = true;
              expiredOrder = order;
            }
            return { ...order, remainingTime: Math.max(0, nextTime) };
          });

          if (hasExpired && expiredOrder) {
            // Handle order expiration penalty
            soundEngine.playMistake();
            addFloatingItem('-75 Expired!', 'error');
            setScore((s) => Math.max(0, s - 75));
            setCombo(0);

            setStats((s) => {
              const newFailed = s.failed + 1;
              const total = s.completed + newFailed;
              return {
                ...s,
                failed: newFailed,
                accuracy: Math.round((s.completed / total) * 100)
              };
            });

            if (mode === 'classic') {
              setLives((l) => {
                const nextLives = l - 1;
                if (nextLives <= 0) {
                  setIsGameOver(true);
                }
                return nextLives;
              });
            }

            // Remove expired order and generate a replacement
            const remaining = updated.filter((o) => o.id !== (expiredOrder as unknown as CustomerOrder).id);
            const newOrder = generateOrder(level, mode, orderCountRef.current++);
            const nextOrders = [...remaining, newOrder];
            setActiveOrderId(nextOrders[0]?.id || null);
            return nextOrders;
          }

          return updated;
        });
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isPaused, isGameOver, mode, level, addFloatingItem]);

  // Ensure queue is filled up to maxActiveOrders
  useEffect(() => {
    if (isGameOver) return;
    if (orders.length < levelConfig.maxActiveOrders) {
      const newOrder = generateOrder(level, mode, orderCountRef.current++);
      setOrders((prev) => [...prev, newOrder]);
      if (!activeOrderId) {
        setActiveOrderId(newOrder.id);
      }
    }
  }, [orders.length, levelConfig.maxActiveOrders, level, mode, isGameOver, activeOrderId]);

  // Push current cake to undo history
  const pushCakeState = (cake: CakeState) => {
    cakeHistoryRef.current.push({ ...cake });
  };

  // Station Actions
  const handleApplyBase = (base: BaseFlavor) => {
    pushCakeState(currentCake);
    setCurrentCake((prev) => ({ ...prev, base }));
    soundEngine.playBasePlaced();
    setMachineAction('dispense_base');
    setAnimatingLayer('base');
    setTimeout(() => {
      setMachineAction('idle');
      setAnimatingLayer(null);
    }, 600);

    // Auto-advance station tab to next logical step
    if (levelConfig.availableFillings.length > 0) {
      setActiveStation('filling');
    } else {
      setActiveStation('frosting');
    }
  };

  const handleApplyFilling = (filling: FillingFlavor) => {
    if (!currentCake.base) {
      addFloatingItem('Add Cake Base first!', 'error');
      return;
    }
    pushCakeState(currentCake);
    setCurrentCake((prev) => ({ ...prev, filling }));
    soundEngine.playFillingSquirt();
    setMachineAction('dispense_filling');
    setAnimatingLayer('filling');
    setTimeout(() => {
      setMachineAction('idle');
      setAnimatingLayer(null);
    }, 600);
    setActiveStation('frosting');
  };

  const handleApplyFrosting = (frosting: FrostingFlavor) => {
    if (!currentCake.base) {
      addFloatingItem('Add Cake Base first!', 'error');
      return;
    }
    pushCakeState(currentCake);
    setCurrentCake((prev) => ({ ...prev, frosting }));
    soundEngine.playFrostingSwirl();
    setMachineAction('apply_frosting');
    setAnimatingLayer('frosting');
    setTimeout(() => {
      setMachineAction('idle');
      setAnimatingLayer(null);
    }, 600);
    setActiveStation('decoration');
  };

  const handleApplyDecoration = (decoration: DecorationType) => {
    if (!currentCake.base) {
      addFloatingItem('Add Cake Base first!', 'error');
      return;
    }
    pushCakeState(currentCake);
    setCurrentCake((prev) => ({ ...prev, decoration }));
    soundEngine.playDecorShower();
    setMachineAction('shower_decor');
    setAnimatingLayer('decoration');
    setTimeout(() => {
      setMachineAction('idle');
      setAnimatingLayer(null);
    }, 600);
    if (levelConfig.availableToppings.length > 0) {
      setActiveStation('topping');
    }
  };

  const handleApplyTopping = (topping: ToppingType) => {
    if (!currentCake.base) {
      addFloatingItem('Add Cake Base first!', 'error');
      return;
    }
    pushCakeState(currentCake);
    setCurrentCake((prev) => ({ ...prev, topping }));
    soundEngine.playToppingDrop();
    setMachineAction('drop_topping');
    setAnimatingLayer('topping');
    setTimeout(() => {
      setMachineAction('idle');
      setAnimatingLayer(null);
    }, 600);
  };

  // Undo and Trash actions
  const handleUndo = () => {
    if (cakeHistoryRef.current.length > 0) {
      const prev = cakeHistoryRef.current.pop();
      if (prev) {
        setCurrentCake(prev);
        soundEngine.playClick();
      }
    }
  };

  const handleClear = () => {
    pushCakeState(currentCake);
    setCurrentCake(INITIAL_CAKE);
    soundEngine.playClick();
    setActiveStation('base');
  };

  // Active target order
  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0] || null;

  // Deliver Cake Action
  const handleDeliver = () => {
    if (!currentCake.base || !activeOrder) {
      addFloatingItem('Place a base on the plate first!', 'error');
      return;
    }

    const validation = validateCake(currentCake, activeOrder);

    // Animate conveyor delivery chute
    setMachineAction('deliver_chute');

    setTimeout(() => {
      if (validation.isCorrect) {
        // Successful delivery
        const newCombo = combo + 1;
        setCombo(newCombo);
        soundEngine.playOrderComplete(validation.isPerfect);
        if (newCombo >= 2) {
          soundEngine.playCombo(newCombo);
        }

        const scoreInfo = calculateOrderScore(
          true,
          validation.isPerfect,
          newCombo,
          activeOrder.remainingTime,
          activeOrder.maxTime,
          activeOrder.difficulty
        );

        setScore((s) => s + scoreInfo.points);

        addFloatingItem(
          `+${scoreInfo.points}`,
          validation.isPerfect ? 'perfect' : 'points',
          validation.isPerfect ? '⭐ PERFECT ORDER!' : newCombo > 1 ? `COMBO x${newCombo}!` : undefined
        );

        // Update statistics
        setStats((s) => {
          const newCompleted = s.completed + 1;
          const newPerfect = validation.isPerfect ? s.perfect + 1 : s.perfect;
          const bestCombo = Math.max(s.bestCombo, newCombo);
          const total = newCompleted + s.failed;
          return {
            ...s,
            completed: newCompleted,
            perfect: newPerfect,
            bestCombo,
            accuracy: Math.round((newCompleted / total) * 100)
          };
        });

        // Check level progression in Classic mode
        if (mode === 'classic') {
          const nextTarget = levelConfig.targetDeliveries;
          if (stats.completed + 1 >= nextTarget && level < 5) {
            setLevel((lvl) => {
              const nextLvl = lvl + 1;
              addFloatingItem(`🎉 LEVEL ${nextLvl} UNLOCKED!`, 'levelup', 'New recipes available!');
              return nextLvl;
            });
          }
        }

        // Remove completed order from queue
        setOrders((prev) => {
          const remaining = prev.filter((o) => o.id !== activeOrder.id);
          const newOrder = generateOrder(level, mode, orderCountRef.current++);
          const nextOrders = [...remaining, newOrder];
          setActiveOrderId(nextOrders[0]?.id || null);
          return nextOrders;
        });
      } else {
        // Incorrect delivery
        soundEngine.playMistake();
        setCombo(0);
        setScore((s) => Math.max(0, s - 50));
        addFloatingItem('-50 Mistake!', 'error');

        setStats((s) => {
          const newFailed = s.failed + 1;
          const total = s.completed + newFailed;
          return {
            ...s,
            failed: newFailed,
            accuracy: Math.round((s.completed / total) * 100)
          };
        });

        if (mode === 'classic') {
          setLives((l) => {
            const next = l - 1;
            if (next <= 0) {
              setIsGameOver(true);
            }
            return next;
          });
        }

        // Open inspection modal explaining what was wrong
        setInspectionData({
          order: activeOrder,
          cake: currentCake,
          errors: validation.errors
        });
      }

      // Reset tray for next cake
      setCurrentCake(INITIAL_CAKE);
      cakeHistoryRef.current = [];
      setMachineAction('idle');
      setActiveStation('base');
    }, 550);
  };

  // Keyboard Shortcuts (1-5 for stations, Space to Deliver, U to Undo, Esc to Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;

      if (e.key === 'Escape') {
        setIsPaused((p) => !p);
        return;
      }

      if (isPaused) return;

      if (e.key === '1') {
        setActiveStation('base');
        soundEngine.playClick();
      } else if (e.key === '2' && levelConfig.availableFillings.length > 0) {
        setActiveStation('filling');
        soundEngine.playClick();
      } else if (e.key === '3') {
        setActiveStation('frosting');
        soundEngine.playClick();
      } else if (e.key === '4') {
        setActiveStation('decoration');
        soundEngine.playClick();
      } else if (e.key === '5' && levelConfig.availableToppings.length > 0) {
        setActiveStation('topping');
        soundEngine.playClick();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleDeliver();
      } else if (e.key === 'u' || e.key === 'U') {
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isPaused, levelConfig, currentCake, activeOrder]);

  // Determine current tutorial cue
  let tutorialStep: StationCategory | null = null;
  let tutorialStepText = '';
  let tutorialStationHint = '';

  if (showTutorialTips && activeOrder) {
    if (!currentCake.base) {
      tutorialStep = 'base';
      tutorialStepText = `Start with a sponge base! Match the customer's ${activeOrder.targetCake.base} base.`;
      tutorialStationHint = 'Click on Base Station below';
    } else if (activeOrder.targetCake.filling && !currentCake.filling) {
      tutorialStep = 'filling';
      tutorialStepText = `Add ${activeOrder.targetCake.filling} filling layer next!`;
      tutorialStationHint = 'Click on Filling Station';
    } else if (activeOrder.targetCake.frosting && !currentCake.frosting) {
      tutorialStep = 'frosting';
      tutorialStepText = `Spread ${activeOrder.targetCake.frosting} frosting on the cake!`;
      tutorialStationHint = 'Click on Frosting Station';
    } else if (activeOrder.targetCake.decoration && !currentCake.decoration) {
      tutorialStep = 'decoration';
      tutorialStepText = `Shower with ${activeOrder.targetCake.decoration}!`;
      tutorialStationHint = 'Click on Decor Station';
    } else if (activeOrder.targetCake.topping && !currentCake.topping) {
      tutorialStep = 'topping';
      tutorialStepText = `Place the ${activeOrder.targetCake.topping} topping on top!`;
      tutorialStationHint = 'Click on Topping Station';
    } else {
      tutorialStep = null;
      tutorialStepText = 'Your cake looks ready! Hit DELIVER CAKE to serve!';
      tutorialStationHint = 'Press DELIVER CAKE or Spacebar';
    }
  }

  return (
    <div className="game-screen-container">
      {/* Floating Feedback Popups */}
      <FloatingFeedback items={floatingItems} onRemove={removeFloatingItem} />

      {/* Top HUD */}
      <HeaderHUD
        score={score}
        combo={combo}
        lives={lives}
        level={level}
        mode={mode}
        timeRemaining={timedRemaining}
        onPause={() => setIsPaused(true)}
        isMuted={!settings.sfx && !settings.music}
        onToggleSound={() => {
          const nextSfx = !settings.sfx;
          soundEngine.setSoundEnabled(nextSfx);
        }}
      />

      {/* Main Workstation Layout */}
      <main className="bakery-workstation-layout">
        {/* Left Column: Orders in Queue */}
        <aside className="workstation-left-col">
          <OrderQueue
            orders={orders}
            activeOrderId={activeOrderId}
            onSelectOrder={(id) => {
              setActiveOrderId(id);
              soundEngine.playClick();
            }}
            isPracticeMode={mode === 'practice'}
          />
        </aside>

        {/* Center & Right Column: Production Line & Controls */}
        <section className="workstation-center-col">
          {/* Overhead Animated Machinery */}
          <BakeryMachinery
            currentAction={machineAction}
            activeStation={activeStation}
          />

          {/* Active Conveyor Track */}
          <ConveyorBelt
            currentCake={currentCake}
            machineAction={machineAction}
            animatingLayer={animatingLayer}
            onDeliver={handleDeliver}
            onClear={handleClear}
            onUndo={handleUndo}
            canDeliver={Boolean(currentCake.base)}
            canUndo={cakeHistoryRef.current.length > 0}
          />

          {/* Tutorial Helper Bubble */}
          {showTutorialTips && (
            <TutorialGuide
              stepText={tutorialStepText}
              stationHint={tutorialStationHint}
              onDismiss={() => setShowTutorialTips(false)}
            />
          )}

          {/* Interactive Stations */}
          <StationPanel
            activeStation={activeStation}
            onSelectStation={(st) => {
              setActiveStation(st);
              soundEngine.playClick();
            }}
            currentCake={currentCake}
            targetOrder={activeOrder}
            availableBases={levelConfig.availableBases}
            availableFillings={levelConfig.availableFillings}
            availableFrostings={levelConfig.availableFrostings}
            availableDecorations={levelConfig.availableDecorations}
            availableToppings={levelConfig.availableToppings}
            onApplyBase={handleApplyBase}
            onApplyFilling={handleApplyFilling}
            onApplyFrosting={handleApplyFrosting}
            onApplyDecoration={handleApplyDecoration}
            onApplyTopping={handleApplyTopping}
            tutorialStep={tutorialStep}
          />
        </section>
      </main>

      {/* Recipe Mismatch Inspection Modal */}
      {inspectionData && (
        <InspectionModal
          order={inspectionData.order}
          submittedCake={inspectionData.cake}
          errors={inspectionData.errors}
          onClose={() => setInspectionData(null)}
        />
      )}

      {/* Pause Menu Modal */}
      {isPaused && (
        <PauseModal
          onResume={() => setIsPaused(false)}
          onRestart={() => {
            setIsPaused(false);
            setScore(0);
            setCombo(0);
            setLives(3);
            setLevel(1);
            setTimedRemaining(mode === 'timed' ? 120 : 0);
            setCurrentCake(INITIAL_CAKE);
            cakeHistoryRef.current = [];
            const initialOrder = generateOrder(1, mode, 0);
            setOrders([initialOrder]);
            setActiveOrderId(initialOrder.id);
          }}
          onOpenSettings={onOpenSettings}
          onQuit={onGoHome}
        />
      )}

      {/* Game Over Summary Modal */}
      {isGameOver && (
        <GameOverModal
          score={score}
          mode={mode}
          level={level}
          stats={stats}
          defaultPlayerName={settings.playerName}
          onPlayAgain={() => {
            setIsGameOver(false);
            setScore(0);
            setCombo(0);
            setLives(3);
            setLevel(1);
            setTimedRemaining(mode === 'timed' ? 120 : 0);
            setCurrentCake(INITIAL_CAKE);
            cakeHistoryRef.current = [];
            setStats({
              completed: 0,
              failed: 0,
              perfect: 0,
              bestCombo: 0,
              accuracy: 100
            });
            const initialOrder = generateOrder(1, mode, 0);
            setOrders([initialOrder]);
            setActiveOrderId(initialOrder.id);
          }}
          onGoHome={onGoHome}
          onViewLeaderboard={onOpenLeaderboard}
        />
      )}
    </div>
  );
};
