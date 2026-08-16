import re

with open('src/components/ExpensesTab.tsx', 'r') as f:
    content = f.read()

old_add = """  const handleAddExpense = (category: CategoryName, name: string, value: number | string) => {
    let numValue = parseMoney(value);
    if (!name || numValue <= 0) return;
    
    const newItem = { id: Date.now().toString() + Math.random().toString(), name, value: numValue };
    setBudgetData(prev => ({
      ...prev,
      expenseItems: {
        ...prev.expenseItems,
        [category]: [...(prev.expenseItems[category] || []), newItem]
      },
      expenses: {
        ...prev.expenses,
        [category]: (prev.expenses[category] || 0) + numValue
      }
    }));
  };"""

new_add = """  const handleAddExpense = (category: CategoryName, name: string, value: number | string) => {
    let numValue = parseMoney(value);
    if (!name || numValue <= 0) return;
    
    const newItem = { id: Date.now().toString() + Math.random().toString(), name, value: numValue };
    setBudgetData(prev => ({
      ...prev,
      expenseItems: {
        ...prev.expenseItems,
        [category]: [...(prev.expenseItems[category] || []), newItem]
      },
      expenses: {
        ...prev.expenses,
        [category]: (prev.expenses[category] || 0) + numValue
      }
    }));

    if (name === newName) setNewName('');
    if (value === newValue) setNewValue('');
  };"""

content = content.replace(old_add, new_add)

old_add_autofill = """  const handleAddAutoFillItem = (category: CategoryName) => {
    let numValue = parseMoney(newAutoFillValue);
    if (!newAutoFillName || numValue <= 0) return;

    const newItem = { id: Date.now().toString(), name: newAutoFillName, defaultVal: numValue };
    setBudgetData(prev => ({
      ...prev,
      autoFill: {
        ...prev.autoFill,
        [category]: [...(prev.autoFill[category] || []), newItem]
      }
    }));
    setNewAutoFillName('');
    setNewAutoFillValue('');
  };"""
# The autofill one already resets! 

with open('src/components/ExpensesTab.tsx', 'w') as f:
    f.write(content)

