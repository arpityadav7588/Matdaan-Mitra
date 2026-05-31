import { db } from '../utils/firebase';
import { mockCandidates, votingSteps } from '../data/mockDb';

interface TimelineItem {
  date: string;
  event: string;
  description: string;
  status: string;
}

interface VotingStep {
  step: number;
  title: string;
  desc: string;
}

interface Candidate {
  id: number;
  name: string;
  party: string;
  symbol: string;
  edu: string;
  assets: string;
  criminal: string;
}

export class DataService {
  private static readonly DEFAULT_TIMELINE: TimelineItem[] = [
    { 
      date: '2026-04-15', 
      event: 'Voter List Revision', 
      description: 'Verification of voter rolls across all constituencies.', 
      status: 'completed' 
    },
    { 
      date: '2026-05-01', 
      event: 'Nominations Start', 
      description: 'Candidates begin filing their nomination papers.', 
      status: 'upcoming' 
    },
    { 
      date: '2026-06-01', 
      event: 'Polling Day', 
      description: 'Nationwide voting across all states.', 
      status: 'upcoming' 
    },
  ];

  // Cache for expensive operations
  private static cache: Map<string, { data: any; timestamp: number }> = new Map();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached data if valid
   */
  private static getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  /**
   * Set cached data
   */
  private static setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Get candidates for a specific constituency (with caching)
   */
  static async getCandidates(constituency: string): Promise<Candidate[]> {
    const cacheKey = `candidates:${constituency}`;
    const cached = this.getCachedData<Candidate[]>(cacheKey);
    if (cached) return cached;

    try {
      if (!db) throw new Error('DB not initialized');
      
      const snapshot = await db
        .collection('candidates')
        .where('constituency', '==', constituency)
        .get();
      
      let result: Candidate[];
      if (snapshot.empty) {
        result = (mockCandidates as any)[constituency] || [];
      } else {
        result = snapshot.docs.map(doc => ({ 
          id: parseInt(doc.id, 10) || 0, 
          ...doc.data() 
        } as Candidate));
      }

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.warn('Firestore getCandidates failed, using mock data');
      const result = (mockCandidates as any)[constituency] || [];
      this.setCachedData(cacheKey, result);
      return result;
    }
  }

  /**
   * Get voting steps in specified language (with caching)
   */
  static async getVotingSteps(
    lang: 'en' | 'hi' | 'ta' | 'te'
  ): Promise<VotingStep[]> {
    const cacheKey = `votingSteps:${lang}`;
    const cached = this.getCachedData<VotingStep[]>(cacheKey);
    if (cached) return cached;

    try {
      if (!db) throw new Error('DB not initialized');
      
      const doc = await db.collection('settings').doc('votingSteps').get();
      
      let result: VotingStep[];
      if (!doc.exists) {
        result = (votingSteps as any)[lang] || votingSteps.en;
      } else {
        const data = doc.data();
        result = (data as any)[lang] || (data as any).en;
      }

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.warn('Firestore getVotingSteps failed, using mock data');
      const result = (votingSteps as any)[lang] || votingSteps.en;
      this.setCachedData(cacheKey, result);
      return result;
    }
  }

  /**
   * Get election timeline (with caching)
   */
  static async getTimeline(): Promise<TimelineItem[]> {
    const cached = this.getCachedData<TimelineItem[]>('timeline');
    if (cached) return cached;

    try {
      if (!db) throw new Error('DB not initialized');
      
      const snapshot = await db
        .collection('timeline')
        .orderBy('date', 'asc')
        .get();
      
      let result: TimelineItem[];
      if (snapshot.empty) {
        result = this.DEFAULT_TIMELINE;
      } else {
        result = snapshot.docs.map(doc => doc.data() as TimelineItem);
      }

      this.setCachedData('timeline', result);
      return result;
    } catch (error) {
      console.warn('Firestore getTimeline failed, using mock data');
      const result = this.DEFAULT_TIMELINE;
      this.setCachedData('timeline', result);
      return result;
    }
  }
}
