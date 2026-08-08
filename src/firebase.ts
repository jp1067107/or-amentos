import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { BudgetData } from './types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.log("Multiple tabs open, persistence can only be enabled in one tab at a a time.");
  } else if (err.code == 'unimplemented') {
    console.log("The current browser does not support all of the features required to enable persistence");
  }
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
