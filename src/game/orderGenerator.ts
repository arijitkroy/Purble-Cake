import { CustomerOrder, CakeState, GameMode } from './types';
import { getLevelConfig } from '../data/levels';
import { getRandomCustomer } from '../data/customers';

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

let orderCounter = 1;

export function generateOrder(level: number, mode: GameMode, orderIndexInGame = 0): CustomerOrder {
  const config = getLevelConfig(level);
  const customer = getRandomCustomer();

  // For the very first tutorial orders in level 1, provide a gentle ramp:
  // Order 1: Base + Frosting + Decor
  // Order 2: Base + Filling + Frosting + Decor
  // Order 3+: Full options based on level
  let base = getRandomItem(config.availableBases);
  let filling = config.availableFillings.length > 0 ? getRandomItem(config.availableFillings) : null;
  let frosting = getRandomItem(config.availableFrostings);
  let decoration = config.availableDecorations.length > 0 ? getRandomItem(config.availableDecorations) : null;
  let topping = config.availableToppings.length > 0 ? getRandomItem(config.availableToppings) : null;

  if (level === 1 && orderIndexInGame === 0) {
    base = 'vanilla';
    filling = null;
    frosting = 'vanilla';
    decoration = 'sprinkles';
    topping = null;
  } else if (level === 1 && orderIndexInGame === 1) {
    base = 'chocolate';
    filling = null;
    frosting = 'chocolate';
    decoration = 'stars';
    topping = null;
  }

  // If level does not require filling/topping, make it probabilistic or omit
  if (!config.requireFilling && config.availableFillings.length > 0 && Math.random() < 0.4) {
    filling = null;
  }
  if (!config.requireTopping && config.availableToppings.length > 0 && Math.random() < 0.5) {
    topping = null;
  }

  const targetCake: CakeState = {
    base,
    filling,
    frosting,
    decoration,
    topping
  };

  // Calculate difficulty score based on elements required
  let elementCount = 2; // base + frosting
  if (filling) elementCount++;
  if (decoration) elementCount++;
  if (topping) elementCount++;

  let orderTime = config.orderTime;
  if (mode === 'timed') {
    // In timed rush, slightly faster
    orderTime = Math.max(14, config.orderTime - 4);
  } else if (mode === 'practice') {
    // In practice mode, generous/infinite timer
    orderTime = 999;
  }

  const order: CustomerOrder = {
    id: `order_${Date.now()}_${orderCounter++}`,
    customerId: customer.id,
    customerName: customer.name,
    targetCake,
    maxTime: orderTime,
    remainingTime: orderTime,
    difficulty: elementCount,
    bonusPoints: elementCount * 25,
    createdAt: Date.now()
  };

  return order;
}
