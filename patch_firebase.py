import re

with open('src/firebase.ts', 'r') as f:
    content = f.read()

content = content.replace('enableIndexedDbPersistence, ', '')
content = content.replace('enableIndexedDbPersistence', '')

block_to_remove = """(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.log("Multiple tabs open, persistence can only be enabled in one tab at a a time.");
  } else if (err.code == 'unimplemented') {
    console.log("The current browser does not support all of the features required to enable persistence");
  }
});"""

content = content.replace(block_to_remove, '')

with open('src/firebase.ts', 'w') as f:
    f.write(content)
