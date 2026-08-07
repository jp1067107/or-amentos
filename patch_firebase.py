import re

with open('src/firebase.ts', 'r') as f:
    content = f.read()

content = content.replace(
'''import { getFirestore, doc, setDoc, getDoc, initializeFirestore } from 'firebase/firestore';''',
'''import { getFirestore, doc, setDoc, getDoc, enableIndexedDbPersistence } from 'firebase/firestore';'''
)

content = content.replace(
'''export const db = initializeFirestore(app, {  experimentalForceLongPolling: true});''',
'''export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  console.log("Persistence error:", err);
});'''
)

# wait, the exact string in firebase.ts is:
# export const db = initializeFirestore(app, {  experimentalForceLongPolling: true});
# let's be careful with whitespace, maybe just use python regex.

with open('src/firebase.ts', 'w') as f:
    f.write(content)
