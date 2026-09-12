import { GameSettings, HighScoreEntry, GameStatistics } from '../game/types';
import { firebaseService } from './firebase';

const STORAGE_KEYS = {
  SETTINGS: 'purble_cake_settings_v1',
  SCORES: 'purble_cake_scores_v1',
  STATS: 'purble_cake_stats_v1'
};

const DEFAULT_SETTINGS: GameSettings = {
  music: true,
  sfx: true,
  reducedMotion: false,
  showTutorial: true,
  playerName: 'Sweet Baker'
};

const DEFAULT_STATS: GameStatistics = {
  completed: 0,
  failed: 0,
  perfect: 0,
  bestCombo: 0,
  accuracy: 100
};

export class PersistenceService {
  public static getSettings(): GameSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Error reading settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: GameSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Error saving settings to localStorage:', e);
    }
  }

  public static getLocalScores(): HighScoreEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCORES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading scores from localStorage:', e);
    }
    return [
      { name: 'Chef Muffin', score: 2400, mode: 'classic', level: 5, cakesDelivered: 18, accuracy: 95, date: '2026-09-01' },
      { name: 'Pip Bunny', score: 1850, mode: 'classic', level: 4, cakesDelivered: 14, accuracy: 92, date: '2026-09-02' },
      { name: 'Sugar Star', score: 1200, mode: 'timed', level: 3, cakesDelivered: 10, accuracy: 88, date: '2026-09-03' }
    ];
  }

  public static async saveScore(entry: HighScoreEntry): Promise<void> {
    // 1. Save locally
    try {
      const current = this.getLocalScores();
      const updated = [entry, ...current]
        .sort((a, b) => b.score - a.score)
        .slice(0, 30); // keep top 30
      localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving local score:', e);
    }

    // 2. Submit to Firebase Firestore
    try {
      await firebaseService.submitScore(entry);
    } catch (e) {
      console.warn('Failed to sync score with Firestore:', e);
    }
  }

  public static async getCombinedLeaderboard(): Promise<{ scores: HighScoreEntry[]; isOnline: boolean }> {
    if (firebaseService.isFirestoreReady()) {
      const cloudScores = await firebaseService.fetchLeaderboard(20);
      if (cloudScores && cloudScores.length > 0) {
        return { scores: cloudScores, isOnline: true };
      }
    }
    return { scores: this.getLocalScores(), isOnline: false };
  }

  public static getStats(): GameStatistics {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATS);
      if (stored) {
        return { ...DEFAULT_STATS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Error reading stats from localStorage:', e);
    }
    return DEFAULT_STATS;
  }

  public static updateStats(updates: Partial<GameStatistics>) {
    try {
      const current = this.getStats();
      const newCompleted = (current.completed || 0) + (updates.completed || 0);
      const newFailed = (current.failed || 0) + (updates.failed || 0);
      const newPerfect = (current.perfect || 0) + (updates.perfect || 0);
      const total = newCompleted + newFailed;
      const accuracy = total > 0 ? Math.round((newCompleted / total) * 100) : 100;
      const bestCombo = Math.max(current.bestCombo || 0, updates.bestCombo || 0);

      const updated: GameStatistics = {
        completed: newCompleted,
        failed: newFailed,
        perfect: newPerfect,
        bestCombo,
        accuracy
      };

      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error updating stats:', e);
    }
  }

  public static resetProgress() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SCORES);
      localStorage.removeItem(STORAGE_KEYS.STATS);
    } catch (e) {
      console.warn('Error resetting progress:', e);
    }
  }
}
