"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
const mockDb_1 = require("../data/mockDb");
dotenv_1.default.config();
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
    });
}
const db = firebase_admin_1.default.firestore();
async function seed() {
    console.log('🌱 Seeding Matdaan Mitra Database...');
    // 1. Seed Candidates
    const candidateBatch = db.batch();
    Object.entries(mockDb_1.mockCandidates).forEach(([constituency, list]) => {
        list.forEach(c => {
            const ref = db.collection('candidates').doc();
            candidateBatch.set(ref, { ...c, constituency });
        });
    });
    await candidateBatch.commit();
    console.log('✅ Candidates Seeded');
    // 2. Seed Voting Steps
    await db.collection('settings').doc('votingSteps').set(mockDb_1.votingSteps);
    console.log('✅ Voting Steps Seeded');
    // 3. Seed Timeline
    const timeline = [
        { date: '2026-04-15', event: 'Voter List Revision', status: 'completed' },
        { date: '2026-05-01', event: 'Nominations Start', status: 'upcoming' },
        { date: '2026-06-01', event: 'Polling Day', status: 'upcoming' }
    ];
    for (const item of timeline) {
        await db.collection('timeline').add(item);
    }
    console.log('✅ Timeline Seeded');
    console.log('🚀 Seeding Complete!');
    process.exit(0);
}
seed().catch(err => {
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
});
