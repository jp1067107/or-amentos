import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_sync = """  // Use a ref to store the last data we received or sent to Firestore
  const lastSyncData = useRef<BudgetData | null>(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToBudget(user.uid, (data) => {
        if (data) {
          setBudgetData(prev => {
            if (isEqual(prev, data)) return prev;
            console.log("Firestore update received. Data differs from prev state.");
            console.log("prev:", prev);
            console.log("data:", data);
            lastSyncData.current = data; // Keep track of what we just received
            return data;
          });
        }
        setDataLoaded(true);
      });
      return () => unsubscribe();
    } else {
      setDataLoaded(false);
      setBudgetData(DEFAULT_BUDGET);
      lastSyncData.current = null;
    }
  }, [user]);

  useEffect(() => {
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

new_sync = """  const [isSyncing, setIsSyncing] = useState(false);
  const lastSyncStr = useRef<string>('');

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToBudget(user.uid, (data) => {
        if (data) {
          const dataStr = JSON.stringify(data);
          setBudgetData(prev => {
            const prevStr = JSON.stringify(prev);
            if (prevStr === dataStr) return prev;
            lastSyncStr.current = dataStr;
            return data;
          });
        }
        setDataLoaded(true);
      });
      return () => unsubscribe();
    } else {
      setDataLoaded(false);
      setBudgetData(DEFAULT_BUDGET);
      lastSyncStr.current = '';
    }
  }, [user]);

  useEffect(() => {
    if (user && dataLoaded) {
      const currentStr = JSON.stringify(budgetData);
      if (lastSyncStr.current !== currentStr) {
        lastSyncStr.current = currentStr;
        
        // Use a small timeout to debounce rapid saves
        const timer = setTimeout(() => {
          saveBudgetToFirestore(user.uid, budgetData);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [budgetData, user, dataLoaded]);"""

content = content.replace(old_sync, new_sync)

with open('src/App.tsx', 'w') as f:
    f.write(content)
