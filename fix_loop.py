import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport isEqual from 'lodash/isEqual';")

old_sync = """  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToBudget(user.uid, (data) => {
        if (data) {
          setBudgetData(prev => {
            if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
            return data;
          });
        }
        setDataLoaded(true);
      });
      return () => unsubscribe();
    } else {
      setDataLoaded(false);
      setBudgetData(DEFAULT_BUDGET);
    }
  }, [user]);

  useEffect(() => {
    if (user && dataLoaded) {
      saveBudgetToFirestore(user.uid, budgetData);
    }
  }, [budgetData, user, dataLoaded]);"""

new_sync = """  // Use a ref to store the last data we received or sent to Firestore
  const lastSyncData = useRef<BudgetData | null>(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToBudget(user.uid, (data) => {
        if (data) {
          setBudgetData(prev => {
            if (isEqual(prev, data)) return prev;
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
        lastSyncData.current = budgetData;
        saveBudgetToFirestore(user.uid, budgetData);
      }
    }
  }, [budgetData, user, dataLoaded]);"""

content = content.replace(old_sync, new_sync)

with open('src/App.tsx', 'w') as f:
    f.write(content)
