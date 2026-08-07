import re

with open('src/firebase.ts', 'r') as f:
    content = f.read()

new_subscribe = '''export const subscribeToBudget = (userId: string, callback: (data: BudgetData | null) => void) => {
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
};'''

# Replace the existing subscribeToBudget
old_subscribe = '''export const subscribeToBudget = (userId: string, callback: (data: BudgetData | null) => void) => {
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

content = content.replace(old_subscribe, new_subscribe)

with open('src/firebase.ts', 'w') as f:
    f.write(content)
