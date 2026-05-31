"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
const mockDb_1 = require("../data/mockDb");
dotenv_1.default.config();
/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebase = () => {
    if (!firebase_admin_1.default.apps.length) {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    }
    return firebase_admin_1.default.firestore();
};
/**
 * Seed candidates collection
 */
const seedCandidates = async (db) => {
    const candidateBatch = db.batch();
    Object.entries(mockDb_1.mockCandidates).forEach(([constituency, list]) => {
        list.forEach((candidate) => {
            const ref = db.collection('candidates').doc();
            candidateBatch.set(ref, { ...candidate, constituency });
        });
    });
    await candidateBatch.commit();
    console.log('✅ Candidates Seeded');
};
/**
 * Seed voting steps settings
 */
const seedVotingSteps = async (db) => {
    await db.collection('settings').doc('votingSteps').set(mockDb_1.votingSteps);
    console.log('✅ Voting Steps Seeded');
};
/**
 * Seed election timeline
 */
const seedTimeline = async (db) => {
    const timeline = [
        { date: '2026-04-15', event: 'Voter List Revision', description: 'Verification of voter rolls across all constituencies.', status: 'completed' },
        { date: '2026-05-01', event: 'Nominations Start', description: 'Candidates begin filing their nomination papers.', status: 'upcoming' },
        { date: '2026-06-01', event: 'Polling Day', description: 'Nationwide voting across all states.', status: 'upcoming' },
    ];
    const batch = db.batch();
    timeline.forEach((item) => {
        const ref = db.collection('timeline').doc();
        batch.set(ref, item);
    });
    await batch.commit();
    console.log('✅ Timeline Seeded');
};
/**
 * Main seeding function
 */
async function seed() {
    console.log('🌱 Seeding Matdaan Mitra Database...');
    try {
        const db = initializeFirebase();
        await seedCandidates(db);
        await seedVotingSteps(db);
        await seedTimeline(db);
        console.log('🚀 Seeding Complete!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
}
seed();
