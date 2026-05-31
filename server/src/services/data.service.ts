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

  /**
   * Get candidates for a specific constituency
   */
  static async getCandidates(constituency: string): Promise<Candidate[]> {
    try {
      if (!db) throw new Error('DB not initialized');
      
      const snapshot = await db
        .collection('candidates')
        .where('constituency', '==', constituency)
        .get();
      
      if (snapshot.empty) {
        return (mockCandidates as any)[constituency] || [];
      }
      
      return snapshot.docs.map(doc => ({ 
        id: parseInt(doc.id, 10) || 0, 
        ...doc.data() 
      } as Candidate));
    } catch (error) {
      console.warn('Firestore getCandidates failed, using mock data');
      return (mockCandidates as any)[constituency] || [];
    }
  }

  /**
   * Get voting steps in specified language
   */
  static async getVotingSteps(
    lang: 'en' | 'hi' | 'ta' | 'te'
  ): Promise<VotingStep[]> {
    try {
      if (!db) throw new Error('DB not initialized');
      
      const doc = await db.collection('settings').doc('votingSteps').get();
      
      if (!doc.exists) {
        return (votingSteps as any)[lang] || votingSteps.en;
      }
      
      const data = doc.data();
      return (data as any)[lang] || (data as any).en;
    } catch (error) {
      console.warn('Firestore getVotingSteps failed, using mock data');
      return (votingSteps as any)[lang] || votingSteps.en;
    }
  }

  /**
   * Get election timeline
   */
  static async getTimeline(): Promise<TimelineItem[]> {
    try {
      if (!db) throw new Error('DB not initialized');
      
      const snapshot = await db
        .collection('timeline')
        .orderBy('date', 'asc')
        .get();
      
      if (snapshot.empty) {
        return this.DEFAULT_TIMELINE;
      }
      
      return snapshot.docs.map(doc => doc.data() as TimelineItem);
    } catch (error) {
      console.warn('Firestore getTimeline failed, using mock data');
      return this.DEFAULT_TIMELINE;
    }
  }
}
