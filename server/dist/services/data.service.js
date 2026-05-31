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
    // Cache for expensive operations
    static cache = new Map();
    static CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    /**
     * Get cached data if valid
     */
    static getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }
    /**
     * Set cached data
     */
    static setCachedData(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }
    /**
     * Get candidates for a specific constituency (with caching)
     */
    static async getCandidates(constituency) {
        const cacheKey = `candidates:${constituency}`;
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        try {
            if (!firebase_1.db)
                throw new Error('DB not initialized');
            const snapshot = await firebase_1.db
                .collection('candidates')
                .where('constituency', '==', constituency)
                .get();
            let result;
            if (snapshot.empty) {
                result = mockDb_1.mockCandidates[constituency] || [];
            }
            else {
                result = snapshot.docs.map(doc => ({
                    id: parseInt(doc.id, 10) || 0,
                    ...doc.data()
                }));
            }
            this.setCachedData(cacheKey, result);
            return result;
        }
        catch (error) {
            console.warn('Firestore getCandidates failed, using mock data');
            const result = mockDb_1.mockCandidates[constituency] || [];
            this.setCachedData(cacheKey, result);
            return result;
        }
    }
    /**
     * Get voting steps in specified language (with caching)
     */
    static async getVotingSteps(lang) {
        const cacheKey = `votingSteps:${lang}`;
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        try {
            if (!firebase_1.db)
                throw new Error('DB not initialized');
            const doc = await firebase_1.db.collection('settings').doc('votingSteps').get();
            let result;
            if (!doc.exists) {
                result = mockDb_1.votingSteps[lang] || mockDb_1.votingSteps.en;
            }
            else {
                const data = doc.data();
                result = data[lang] || data.en;
            }
            this.setCachedData(cacheKey, result);
            return result;
        }
        catch (error) {
            console.warn('Firestore getVotingSteps failed, using mock data');
            const result = mockDb_1.votingSteps[lang] || mockDb_1.votingSteps.en;
            this.setCachedData(cacheKey, result);
            return result;
        }
    }
    /**
     * Get election timeline (with caching)
     */
    static async getTimeline() {
        const cached = this.getCachedData('timeline');
        if (cached)
            return cached;
        try {
            if (!firebase_1.db)
                throw new Error('DB not initialized');
            const snapshot = await firebase_1.db
                .collection('timeline')
                .orderBy('date', 'asc')
                .get();
            let result;
            if (snapshot.empty) {
                result = this.DEFAULT_TIMELINE;
            }
            else {
                result = snapshot.docs.map(doc => doc.data());
            }
            this.setCachedData('timeline', result);
            return result;
        }
        catch (error) {
            console.warn('Firestore getTimeline failed, using mock data');
            const result = this.DEFAULT_TIMELINE;
            this.setCachedData('timeline', result);
            return result;
        }
    }
}
exports.DataService = DataService;
