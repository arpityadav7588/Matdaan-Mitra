"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.storage = exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let isInitialized = false;
if (!firebase_admin_1.default.apps.length) {
    try {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };
        if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
            firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.cert(serviceAccount),
                storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
            });
            isInitialized = true;
            console.log('✅ Firebase Admin initialized successfully.');
        }
        else {
            console.warn('⚠️ Firebase credentials missing in .env. Using mock mode.');
        }
    }
    catch (error) {
        console.warn('❌ Firebase Admin failed to initialize:', error);
    }
}
else {
    isInitialized = true;
}
// Export null or a mock if not initialized to prevent crashing
exports.db = isInitialized ? firebase_admin_1.default.firestore() : null;
exports.storage = isInitialized ? firebase_admin_1.default.storage() : null;
exports.auth = isInitialized ? firebase_admin_1.default.auth() : null;
