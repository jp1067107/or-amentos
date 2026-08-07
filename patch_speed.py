import re

with open('src/firebase.ts', 'r') as f:
    content = f.read()

content = content.replace(
'''import { getFirestore, doc, setDoc, getDoc, enableIndexedDbPersistence } from 'firebase/firestore';''',
'''import { getFirestore, doc, setDoc, getDoc, enableIndexedDbPersistence, onSnapshot } from 'firebase/firestore';'''
)

new_func = '''export const subscribeToBudget = (userId: string, callback: (data: BudgetData | null) => void) => {
  return onSnapshot(doc(db, 'user_budgets', userId), (d) => {
    if (d.exists()) {
      callback(d.data() as BudgetData);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error loading budget snapshot', error);
    callback(null);
  });
};'''

content += f"\n{new_func}\n"

with open('src/firebase.ts', 'w') as f:
    f.write(content)


with open('src/App.tsx', 'r') as f:
    app_content = f.read()

app_content = app_content.replace(
'''import { auth, googleProvider, saveBudgetToFirestore, loadBudgetFromFirestore } from './firebase';''',
'''import { auth, googleProvider, saveBudgetToFirestore, loadBudgetFromFirestore, subscribeToBudget } from './firebase';'''
)

app_effect = '''  useEffect(() => {
    if (user) {
      loadBudgetFromFirestore(user.uid).then(data => {
        if (data) {
          setBudgetData(data);
        }
        setDataLoaded(true);
      });
    } else {
      setDataLoaded(false);
      setBudgetData(DEFAULT_BUDGET);
    }
  }, [user]);'''

app_effect_new = '''  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToBudget(user.uid, (data) => {
        if (data) {
          setBudgetData(data);
        }
        setDataLoaded(true);
      });
      return () => unsubscribe();
    } else {
      setDataLoaded(false);
      setBudgetData(DEFAULT_BUDGET);
    }
  }, [user]);'''

app_content = app_content.replace(app_effect, app_effect_new)

with open('src/App.tsx', 'w') as f:
    f.write(app_content)
