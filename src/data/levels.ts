import { BaseFlavor, FillingFlavor, FrostingFlavor, DecorationType, ToppingType } from '../game/types';

export interface LevelConfig {
  level: number;
  title: string;
  targetDeliveries: number; // to advance to next level in Classic mode
  orderTime: number; // seconds per order
  maxActiveOrders: number;
  availableBases: BaseFlavor[];
  availableFillings: FillingFlavor[];
  availableFrostings: FrostingFlavor[];
  availableDecorations: DecorationType[];
  availableToppings: ToppingType[];
  requireFilling: boolean;
  requireTopping: boolean;
  conveyorSpeed: number; // visual animation duration (lower is faster)
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    title: 'Apprentice Baker',
    targetDeliveries: 3,
    orderTime: 32,
    maxActiveOrders: 1,
    availableBases: ['vanilla', 'chocolate'],
    availableFillings: [],
    availableFrostings: ['vanilla', 'chocolate'],
    availableDecorations: ['sprinkles', 'stars'],
    availableToppings: [],
    requireFilling: false,
    requireTopping: false,
    conveyorSpeed: 1.2
  },
  {
    level: 2,
    title: 'Sweet Confectioner',
    targetDeliveries: 5,
    orderTime: 26,
    maxActiveOrders: 1,
    availableBases: ['vanilla', 'chocolate', 'strawberry'],
    availableFillings: ['cream', 'chocolate', 'strawberry'],
    availableFrostings: ['vanilla', 'chocolate', 'strawberry'],
    availableDecorations: ['sprinkles', 'stars', 'hearts'],
    availableToppings: [],
    requireFilling: true,
    requireTopping: false,
    conveyorSpeed: 1.1
  },
  {
    level: 3,
    title: 'Master Decorator',
    targetDeliveries: 7,
    orderTime: 22,
    maxActiveOrders: 2,
    availableBases: ['vanilla', 'chocolate', 'strawberry', 'lemon'],
    availableFillings: ['cream', 'chocolate', 'strawberry', 'caramel'],
    availableFrostings: ['vanilla', 'chocolate', 'strawberry', 'mint', 'lemon'],
    availableDecorations: ['sprinkles', 'stars', 'hearts', 'dots'],
    availableToppings: ['cherry', 'strawberry', 'wafer'],
    requireFilling: true,
    requireTopping: true,
    conveyorSpeed: 1.0
  },
  {
    level: 4,
    title: 'Pastry Prodigy',
    targetDeliveries: 10,
    orderTime: 18,
    maxActiveOrders: 2,
    availableBases: ['vanilla', 'chocolate', 'strawberry', 'lemon', 'blueberry'],
    availableFillings: ['cream', 'chocolate', 'strawberry', 'caramel', 'blueberry'],
    availableFrostings: ['vanilla', 'chocolate', 'strawberry', 'mint', 'blueberry', 'lemon'],
    availableDecorations: ['sprinkles', 'stars', 'hearts', 'dots', 'swirls', 'candies'],
    availableToppings: ['cherry', 'strawberry', 'blueberry', 'wafer', 'choc_piece', 'candy'],
    requireFilling: true,
    requireTopping: true,
    conveyorSpeed: 0.85
  },
  {
    level: 5,
    title: 'Grand Bakery Maestro',
    targetDeliveries: 999, // Infinite high-score tier
    orderTime: 15,
    maxActiveOrders: 3,
    availableBases: ['vanilla', 'chocolate', 'strawberry', 'lemon', 'blueberry'],
    availableFillings: ['cream', 'chocolate', 'strawberry', 'caramel', 'blueberry'],
    availableFrostings: ['vanilla', 'chocolate', 'strawberry', 'mint', 'blueberry', 'lemon'],
    availableDecorations: ['sprinkles', 'stars', 'hearts', 'dots', 'swirls', 'candies'],
    availableToppings: ['cherry', 'strawberry', 'blueberry', 'wafer', 'choc_piece', 'candy'],
    requireFilling: true,
    requireTopping: true,
    conveyorSpeed: 0.7
  }
];

export function getLevelConfig(level: number): LevelConfig {
  const index = Math.min(Math.max(1, level) - 1, LEVEL_CONFIGS.length - 1);
  return LEVEL_CONFIGS[index];
}
