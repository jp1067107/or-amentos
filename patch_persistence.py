import re

with open('src/firebase.ts', 'r') as f:
    content = f.read()

content = content.replace(
'''import { getFirestore, doc, setDoc, getDoc, initializeFirestore } from 'firebase/firestore';''',
'''import { getFirestore, doc, setDoc, getDoc, enableIndexedDbPersistence } from 'firebase/firestore';'''
)

content = content.replace(
'''export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});''',
'''export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.log("Multiple tabs open, persistence can only be enabled in one tab at a a time.");
  } else if (err.code == 'unimplemented') {
    console.log("The current browser does not support all of the features required to enable persistence");
  }
});'''
)

with open('src/firebase.ts', 'w') as f:
    f.write(content)
