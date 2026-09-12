export function getComboMultiplier(combo: number): number {
  if (combo <= 1) return 1.0;
  if (combo === 2) return 1.25;
  if (combo === 3) return 1.5;
  if (combo === 4) return 2.0;
  return 2.5;
}

export function calculateOrderScore(
  isCorrect: boolean,
  isPerfect: boolean,
  combo: number,
  remainingTime: number,
  maxTime: number,
  difficulty: number
): { points: number; speedBonus: number; perfectBonus: number; multiplier: number } {
  if (!isCorrect) {
    return {
      points: -50,
      speedBonus: 0,
      perfectBonus: 0,
      multiplier: 1.0
    };
  }

  const basePoints = 100 + (difficulty - 2) * 20;
  const timeRatio = Math.max(0, Math.min(1, remainingTime / maxTime));
  const speedBonus = Math.round(timeRatio * 60);
  const perfectBonus = isPerfect ? 50 : 0;
  const multiplier = getComboMultiplier(combo);

  const rawPoints = basePoints + speedBonus + perfectBonus;
  const points = Math.round(rawPoints * multiplier);

  return {
    points,
    speedBonus,
    perfectBonus,
    multiplier
  };
}

export function calculateGrade(score: number, accuracy: number, cakesDelivered: number): {
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  title: string;
  comment: string;
} {
  if (cakesDelivered >= 12 && accuracy >= 95 && score >= 2000) {
    return {
      grade: 'S',
      title: 'Grandmaster Pâtissier',
      comment: 'Flawless culinary artistry! The town is in absolute awe!'
    };
  }
  if (accuracy >= 85 && score >= 1200) {
    return {
      grade: 'A',
      title: 'Star Confectioner',
      comment: 'Superb precision and marvelous speed! Every customer left smiling!'
    };
  }
  if (accuracy >= 70 && score >= 700) {
    return {
      grade: 'B',
      title: 'Skilled Baker',
      comment: 'Great baking rhythm! A few crumbs here and there, but delicious!'
    };
  }
  if (score >= 300) {
    return {
      grade: 'C',
      title: 'Apprentice Baker',
      comment: 'Good effort! Keep practicing your recipes to build higher combos!'
    };
  }
  return {
    grade: 'D',
    title: 'Flour Novice',
    comment: "The kitchen got a little messy, but every great baker starts somewhere!"
  };
}
