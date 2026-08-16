import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_sync = """  useEffect(() => {
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
  }, [user]);"""

new_sync = """  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToBudget(user.uid, (data) => {
        if (data) {
          lastSyncStr.current = JSON.stringify(data);
          setBudgetData(data);
        } else {
          // If no data exists, we start with DEFAULT_BUDGET but we DO NOT set lastSyncStr yet
          // so it triggers a save of the default budget.
          setBudgetData(DEFAULT_BUDGET);
          lastSyncStr.current = ''; 
        }
        setDataLoaded(true);
      });
      return () => unsubscribe();
    } else {
      setDataLoaded(false);
      setBudgetData(DEFAULT_BUDGET);
      lastSyncStr.current = '';
    }
  }, [user]);"""

content = content.replace(old_sync, new_sync)

with open('src/App.tsx', 'w') as f:
    f.write(content)
