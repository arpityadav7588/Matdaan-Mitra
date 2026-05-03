import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let isInitialized = false;

if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
        storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      });
      isInitialized = true;
      console.log('✅ Firebase Admin initialized successfully.');
    } else {
      console.warn('⚠️ Firebase credentials missing in .env. Using mock mode.');
    }
  } catch (error) {
    console.warn('❌ Firebase Admin failed to initialize:', error);
  }
} else {
  isInitialized = true;
}

// Export null or a mock if not initialized to prevent crashing
export const db = isInitialized ? admin.firestore() : null;
export const storage = isInitialized ? admin.storage() : null;
export const auth = isInitialized ? admin.auth() : null;
