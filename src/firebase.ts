import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { BudgetData } from './types';

const app = initializeApp(firebaseConfig);
export const db = firebaseConfig.firestoreDatabaseId ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : getFirestore(app);

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

export const subscribeToBudget = (userId: string, callback: (data: BudgetData | null) => void) => {
  return onSnapshot(doc(db, 'user_budgets', userId), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as BudgetData);
    } else {
      callback(null);
    }
  }, (err) => {
    console.error('Error listening to budget:', err);
    callback(null);
  });
};
