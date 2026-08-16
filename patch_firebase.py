import re

with open('src/firebase.ts', 'r') as f:
    content = f.read()

content = content.replace("export const db = getFirestore(app);", "export const db = firebaseConfig.firestoreDatabaseId ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : getFirestore(app);")

with open('src/firebase.ts', 'w') as f:
    f.write(content)
