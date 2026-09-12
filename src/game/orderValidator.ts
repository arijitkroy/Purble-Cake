import { CakeState, CustomerOrder, ValidationResult, ValidationError } from './types';

const FIELD_LABELS: Record<keyof CakeState, string> = {
  base: 'Cake Base',
  shape: 'Shape',
  filling: 'Filling Layer',
  frosting: 'Frosting Layer',
  decoration: 'Decoration',
  topping: 'Topping'
};

export function validateCake(cake: CakeState, order: CustomerOrder): ValidationResult {
  const errors: ValidationError[] = [];
  const target = order.targetCake;

  // Check Base
  if (cake.base !== target.base) {
    errors.push({
      field: 'base',
      expected: target.base,
      actual: cake.base,
      label: FIELD_LABELS.base
    });
  }

  // Check Filling
  if (cake.filling !== target.filling) {
    errors.push({
      field: 'filling',
      expected: target.filling,
      actual: cake.filling,
      label: FIELD_LABELS.filling
    });
  }

  // Check Frosting
  if (cake.frosting !== target.frosting) {
    errors.push({
      field: 'frosting',
      expected: target.frosting,
      actual: cake.frosting,
      label: FIELD_LABELS.frosting
    });
  }

  // Check Decoration
  if (cake.decoration !== target.decoration) {
    errors.push({
      field: 'decoration',
      expected: target.decoration,
      actual: cake.decoration,
      label: FIELD_LABELS.decoration
    });
  }

  // Check Topping
  if (cake.topping !== target.topping) {
    errors.push({
      field: 'topping',
      expected: target.topping,
      actual: cake.topping,
      label: FIELD_LABELS.topping
    });
  }

  const isCorrect = errors.length === 0;
  // A cake is perfect if it has 0 errors and was made without extra time penalties
  const isPerfect = isCorrect && order.remainingTime > order.maxTime * 0.4;

  return {
    isCorrect,
    isPerfect,
    errors
  };
}
