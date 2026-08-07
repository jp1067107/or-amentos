import re

with open('src/firebase.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r"export const db = initializeFirestore\(app, \{[\s\n]*experimentalForceLongPolling: true[\s\n]*\}\);",
    '''export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  console.log("Persistence error:", err);
});''',
    content
)

with open('src/firebase.ts', 'w') as f:
    f.write(content)
