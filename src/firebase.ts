import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, enableIndexedDbPersistence, onSnapshot } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { BudgetData } from './types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  console.log("Persistence error:", err);
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

export const subscribeToBudget = (userId: string, callback: (data: BudgetData | null) => void) => {
  let lastData = '';
  return onSnapshot(doc(db, 'user_budgets', userId), (d) => {
    if (d.exists()) {
      const dataStr = JSON.stringify(d.data());
      if (dataStr !== lastData) {
        lastData = dataStr;
        callback(d.data() as BudgetData);
      }
    } else {
      if (lastData !== 'null') {
        lastData = 'null';
        callback(null);
      }
    }
  }, (error) => {
    console.error('Error loading budget snapshot', error);
    callback(null);
  });
};
