import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, initializeFirestore } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { BudgetData } from './types';

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const saveBudgetToFirestore = async (userId: string, data: BudgetData) => {
  try {
    await setDoc(doc(db, 'user_budgets', userId), data);
  } catch (e) {
    console.error('Error saving budget', e);
  }
};

export const loadBudgetFromFirestore = async (userId: string): Promise<BudgetData | null> => {
  try {
    const d = await getDoc(doc(db, 'user_budgets', userId));
    if (d.exists()) {
      return d.data() as BudgetData;
    }
  } catch (e) {
    console.error('Error loading budget', e);
  }
  return null;
};
