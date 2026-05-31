"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
const firebase_1 = require("../utils/firebase");
const mockDb_1 = require("../data/mockDb");
class DataService {
    static DEFAULT_TIMELINE = [
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
    static async getCandidates(constituency) {
        try {
            if (!firebase_1.db)
                throw new Error('DB not initialized');
            const snapshot = await firebase_1.db
                .collection('candidates')
                .where('constituency', '==', constituency)
                .get();
            if (snapshot.empty) {
                return mockDb_1.mockCandidates[constituency] || [];
            }
            return snapshot.docs.map(doc => ({
                id: parseInt(doc.id, 10) || 0,
                ...doc.data()
            }));
        }
        catch (error) {
            console.warn('Firestore getCandidates failed, using mock data');
            return mockDb_1.mockCandidates[constituency] || [];
        }
    }
    /**
     * Get voting steps in specified language
     */
    static async getVotingSteps(lang) {
        try {
            if (!firebase_1.db)
                throw new Error('DB not initialized');
            const doc = await firebase_1.db.collection('settings').doc('votingSteps').get();
            if (!doc.exists) {
                return mockDb_1.votingSteps[lang] || mockDb_1.votingSteps.en;
            }
            const data = doc.data();
            return data[lang] || data.en;
        }
        catch (error) {
            console.warn('Firestore getVotingSteps failed, using mock data');
            return mockDb_1.votingSteps[lang] || mockDb_1.votingSteps.en;
        }
    }
    /**
     * Get election timeline
     */
    static async getTimeline() {
        try {
            if (!firebase_1.db)
                throw new Error('DB not initialized');
            const snapshot = await firebase_1.db
                .collection('timeline')
                .orderBy('date', 'asc')
                .get();
            if (snapshot.empty) {
                return this.DEFAULT_TIMELINE;
            }
            return snapshot.docs.map(doc => doc.data());
        }
        catch (error) {
            console.warn('Firestore getTimeline failed, using mock data');
            return this.DEFAULT_TIMELINE;
        }
    }
}
exports.DataService = DataService;
