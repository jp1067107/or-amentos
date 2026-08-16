import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_sync = """        if (data) {
          setBudgetData(prev => {
            if (isEqual(prev, data)) return prev;
            lastSyncData.current = data; // Keep track of what we just received
            return data;
          });
        }"""

new_sync = """        if (data) {
          setBudgetData(prev => {
            if (isEqual(prev, data)) return prev;
            console.log("Firestore update received. Data differs from prev state.");
            console.log("prev:", prev);
            console.log("data:", data);
            lastSyncData.current = data; // Keep track of what we just received
            return data;
          });
        }"""

content = content.replace(old_sync, new_sync)

with open('src/App.tsx', 'w') as f:
    f.write(content)
