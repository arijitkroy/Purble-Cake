import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import { HighScoreEntry } from '../game/types';

// Default / fallback configuration read from Vite environment variables
const getEnvFirebaseConfig = () => {
  const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
  if (env && env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID
    };
  }
  return null;
};

class FirebaseService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
  private isConnected = false;

  constructor() {
    this.initFirebase();
  }

  public initFirebase(customConfig?: Record<string, string>) {
    try {
      const config = customConfig || getEnvFirebaseConfig();
      if (!config || !config.apiKey || !config.projectId) {
        this.isConnected = false;
        return false;
      }

      if (getApps().length === 0) {
        this.app = initializeApp(config);
      } else {
        this.app = getApps()[0];
      }

      this.db = getFirestore(this.app);
      this.isConnected = true;
      console.log('Purble Cake: Firebase Firestore initialized successfully!');
      return true;
    } catch (err) {
      console.warn('Purble Cake: Firebase initialization skipped/failed:', err);
      this.isConnected = false;
      return false;
    }
  }

  public isFirestoreReady(): boolean {
    return this.isConnected && this.db !== null;
  }

  /**
   * Save a high score entry to Firestore collection "purble_leaderboard"
   */
  public async submitScore(entry: HighScoreEntry): Promise<boolean> {
    if (!this.db || !this.isConnected) {
      return false;
    }

    try {
      const colRef = collection(this.db, 'purble_leaderboard');
      await addDoc(colRef, {
        name: entry.name || 'Anonymous Baker',
        score: Number(entry.score) || 0,
        mode: entry.mode,
        level: Number(entry.level) || 1,
        cakesDelivered: Number(entry.cakesDelivered) || 0,
        accuracy: Number(entry.accuracy) || 100,
        date: entry.date,
        createdAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.warn('Purble Cake: Could not save score to Firestore:', error);
      return false;
    }
  }

  /**
   * Retrieve the top high scores from Firestore
   */
  public async fetchLeaderboard(maxEntries = 15): Promise<HighScoreEntry[]> {
    if (!this.db || !this.isConnected) {
      return [];
    }

    try {
      const colRef = collection(this.db, 'purble_leaderboard');
      const q = query(colRef, orderBy('score', 'desc'), limit(maxEntries));
      const querySnapshot = await getDocs(q);

      const entries: HighScoreEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          name: data.name || 'Anonymous Baker',
          score: data.score || 0,
          mode: data.mode || 'classic',
          level: data.level || 1,
          cakesDelivered: data.cakesDelivered || 0,
          accuracy: data.accuracy || 100,
          date: data.date || new Date().toISOString().split('T')[0]
        });
      });

      return entries;
    } catch (error) {
      console.warn('Purble Cake: Could not fetch scores from Firestore:', error);
      return [];
    }
  }
}

export const firebaseService = new FirebaseService();
