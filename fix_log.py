import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_sync = """  useEffect(() => {
    if (user && dataLoaded) {
      // Only save if the data has actually changed from what we last synced
      if (!isEqual(lastSyncData.current, budgetData)) {
        lastSyncData.current = budgetData;
        saveBudgetToFirestore(user.uid, budgetData);
      }
    }
  }, [budgetData, user, dataLoaded]);"""

new_sync = """  useEffect(() => {
    if (user && dataLoaded) {
      // Only save if the data has actually changed from what we last synced
      if (!isEqual(lastSyncData.current, budgetData)) {
        console.log("Saving to Firestore! Data changed.");
        console.log("lastSyncData:", lastSyncData.current);
        console.log("budgetData:", budgetData);
        lastSyncData.current = budgetData;
        saveBudgetToFirestore(user.uid, budgetData);
      }
    }
  }, [budgetData, user, dataLoaded]);"""

content = content.replace(old_sync, new_sync)

with open('src/App.tsx', 'w') as f:
    f.write(content)
