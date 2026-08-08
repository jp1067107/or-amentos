import re

with open('src/components/ExpensesTab.tsx', 'r') as f:
    content = f.read()

content = content.replace(
'''<input 
                  type="number" 
                  value={editIncome}''',
'''<input 
                  type="text" 
                  inputMode="decimal"
                  value={editIncome}'''
)

content = content.replace(
'''  const saveHeader = () => {
    setBudgetData(prev => ({
      ...prev,
      income: parseFloat(editIncome) || 0,''',
'''  const saveHeader = () => {
    setBudgetData(prev => ({
      ...prev,
      income: parseFloat(editIncome.replace(',', '.')) || 0,'''
)

with open('src/components/ExpensesTab.tsx', 'w') as f:
    f.write(content)
