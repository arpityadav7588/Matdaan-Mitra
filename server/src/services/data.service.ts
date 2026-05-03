import { db } from '../utils/firebase';
import { mockCandidates, votingSteps, constituencies } from '../data/mockDb';

export class DataService {
  static async getCandidates(constituency: string) {
    try {
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
      const snapshot = await db.collection('timeline').orderBy('date', 'asc').get();
      if (snapshot.empty) {
        return [
          { date: '2026-04-15', event: 'Voter List Revision', status: 'completed' },
          { date: '2026-05-01', event: 'Nominations Start', status: 'upcoming' },
          { date: '2026-06-01', event: 'Polling Day', status: 'upcoming' }
        ];
      }
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.warn('Firestore getTimeline failed, using mock');
      return [
        { date: '2026-04-15', event: 'Voter List Revision', status: 'completed' },
        { date: '2026-05-01', event: 'Nominations Start', status: 'upcoming' },
        { date: '2026-06-01', event: 'Polling Day', status: 'upcoming' }
      ];
    }
  }
}
