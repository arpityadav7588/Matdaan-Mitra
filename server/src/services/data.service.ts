import { db } from '../utils/firebase';
import { mockCandidates, votingSteps } from '../data/mockDb';

export class DataService {
  static async getCandidates(constituency: string) {
    try {
      if (!db) throw new Error('DB not initialized');
      const snapshot = await db.collection('candidates').where('constituency', '==', constituency).get();
      if (snapshot.empty) {
        return (mockCandidates as any)[constituency] || [];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn('Firestore getCandidates failed, using mock');
      return (mockCandidates as any)[constituency] || [];
    }
  }

  static async getVotingSteps(lang: 'en' | 'hi' | 'ta' | 'te') {
    try {
      if (!db) throw new Error('DB not initialized');
      const doc = await db.collection('settings').doc('votingSteps').get();
      if (!doc.exists) {
        return (votingSteps as any)[lang] || votingSteps.en;
      }
      const data = doc.data();
      return (data as any)[lang] || (data as any).en;
    } catch (error) {
      console.warn('Firestore getVotingSteps failed, using mock');
      return (votingSteps as any)[lang] || votingSteps.en;
    }
  }

  static async getTimeline() {
    try {
      if (!db) throw new Error('DB not initialized');
      const snapshot = await db.collection('timeline').orderBy('date', 'asc').get();
      if (snapshot.empty) {
        return [
          { date: '2026-04-15', event: 'Voter List Revision', description: 'Verification of voter rolls across all constituencies.', status: 'completed' },
          { date: '2026-05-01', event: 'Nominations Start', description: 'Candidates begin filing their nomination papers.', status: 'upcoming' },
          { date: '2026-06-01', event: 'Polling Day', description: 'Nationwide voting across all states.', status: 'upcoming' }
        ];
      }
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.warn('Firestore getTimeline failed, using mock');
      return [
        { date: '2026-04-15', event: 'Voter List Revision', description: 'Verification of voter rolls across all constituencies.', status: 'completed' },
        { date: '2026-05-01', event: 'Nominations Start', description: 'Candidates begin filing their nomination papers.', status: 'upcoming' },
        { date: '2026-06-01', event: 'Polling Day', description: 'Nationwide voting across all states.', status: 'upcoming' }
      ];
    }
  }
}
