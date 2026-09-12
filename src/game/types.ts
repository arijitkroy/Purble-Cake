export type BaseFlavor = 'vanilla' | 'chocolate' | 'strawberry' | 'lemon' | 'blueberry';
export type BaseShape = 'round' | 'square' | 'heart';

export type FillingFlavor = 'cream' | 'chocolate' | 'strawberry' | 'caramel' | 'blueberry';

export type FrostingFlavor = 'vanilla' | 'chocolate' | 'strawberry' | 'mint' | 'blueberry' | 'lemon';

export type DecorationType = 'sprinkles' | 'stars' | 'hearts' | 'dots' | 'swirls' | 'candies';

export type ToppingType = 'cherry' | 'strawberry' | 'blueberry' | 'wafer' | 'choc_piece' | 'candy';

export interface CakeState {
  base: BaseFlavor | null;
  shape?: BaseShape;
  filling: FillingFlavor | null;
  frosting: FrostingFlavor | null;
  decoration: DecorationType | null;
  topping: ToppingType | null;
}

export interface CustomerOrder {
  id: string;
  customerId: string;
  customerName: string;
  targetCake: CakeState;
  maxTime: number; // in seconds
  remainingTime: number;
  difficulty: number;
  bonusPoints: number;
  createdAt: number;
}

export type GameMode = 'classic' | 'timed' | 'practice';

export interface GameStatistics {
  completed: number;
  failed: number;
  perfect: number;
  bestCombo: number;
  accuracy: number;
}

export interface ValidationError {
  field: keyof CakeState;
  expected: string | null;
  actual: string | null;
  label: string;
}

export interface ValidationResult {
  isCorrect: boolean;
  isPerfect: boolean;
  errors: ValidationError[];
}

export interface HighScoreEntry {
  id?: string;
  name: string;
  score: number;
  mode: GameMode;
  level: number;
  cakesDelivered: number;
  accuracy: number;
  date: string;
  timestamp?: number;
}

export interface GameSettings {
  music: boolean;
  sfx: boolean;
  reducedMotion: boolean;
  showTutorial: boolean;
  playerName: string;
}

export type MachineAction = 'idle' | 'dispense_base' | 'dispense_filling' | 'apply_frosting' | 'shower_decor' | 'drop_topping' | 'deliver_chute';
