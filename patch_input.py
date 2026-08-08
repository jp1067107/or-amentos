import re

with open('src/components/ExpensesTab.tsx', 'r') as f:
    content = f.read()

# Replace newValue input
content = content.replace(
'''<input 
                          type="number"
                          placeholder="0,00"
                          value={newValue}
                          onChange={e => setNewValue(e.target.value)}''',
'''<input 
                          type="text"
                          inputMode="decimal"
                          placeholder="0,00"
                          value={newValue}
                          onChange={e => setNewValue(e.target.value)}'''
)

# replace handleAddExpense logic
old_add = '''  const handleAddExpense = (category: CategoryName, name: string, value: number) => {
    if (!name || value <= 0) return;'''
new_add = '''  const handleAddExpense = (category: CategoryName, name: string, value: number | string) => {
    let numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    if (isNaN(numValue)) numValue = 0;
    if (!name || numValue <= 0) return;'''

content = content.replace(old_add, new_add)
content = content.replace(
    '''[category]: (prev.expenses[category] || 0) + value''',
    '''[category]: (prev.expenses[category] || 0) + numValue'''
)
content = content.replace(
    '''const newItem = { id: Date.now().toString() + Math.random().toString(), name, value };''',
    '''const newItem = { id: Date.now().toString() + Math.random().toString(), name, value: numValue };'''
)
content = content.replace(
    '''handleAddExpense(selectedCategory, newName, parseFloat(newValue))''',
    '''handleAddExpense(selectedCategory, newName, newValue)'''
)

# Replace autoFillInput onChange
content = content.replace(
'''<input 
                                  type="number"
                                  defaultValue={item.defaultVal}
                                  onChange={(e) => setAutoFillInputs(prev => ({...prev, [item.id]: parseFloat(e.target.value)}))}''',
'''<input 
                                  type="text"
                                  inputMode="decimal"
                                  defaultValue={item.defaultVal}
                                  onChange={(e) => setAutoFillInputs(prev => ({...prev, [item.id]: parseFloat(e.target.value.replace(',', '.'))}))}'''
)

# Replace newAutoFillValue input
content = content.replace(
'''<input 
                            type="number"
                            placeholder="Valor"
                            value={newAutoFillValue}
                            onChange={e => setNewAutoFillValue(e.target.value)}''',
'''<input 
                            type="text"
                            inputMode="decimal"
                            placeholder="Valor"
                            value={newAutoFillValue}
                            onChange={e => setNewAutoFillValue(e.target.value)}'''
)

# Replace editExpenseValue input
content = content.replace(
'''<input 
                                type="number"
                                value={editExpenseValue}
                                onChange={e => setEditExpenseValue(e.target.value)}''',
'''<input 
                                type="text"
                                inputMode="decimal"
                                value={editExpenseValue}
                                onChange={e => setEditExpenseValue(e.target.value)}'''
)

# Replace handleSaveEditExpense logic
old_save = '''  const handleSaveEditExpense = (category: CategoryName, id: string, oldVal: number) => {
    const parsedVal = parseFloat(editExpenseValue);
    if (!editExpenseName || isNaN(parsedVal) || parsedVal < 0) return;'''
new_save = '''  const handleSaveEditExpense = (category: CategoryName, id: string, oldVal: number) => {
    const parsedVal = parseFloat(editExpenseValue.replace(',', '.'));
    if (!editExpenseName || isNaN(parsedVal) || parsedVal < 0) return;'''

content = content.replace(old_save, new_save)


# Replace header income edit
content = content.replace(
'''<input
                        type="number"
                        value={editIncome}
                        onChange={e => setEditIncome(e.target.value)}''',
'''<input
                        type="text"
                        inputMode="decimal"
                        value={editIncome}
                        onChange={e => setEditIncome(e.target.value)}'''
)

# Replace header income save
old_header = '''  const handleSaveHeader = () => {
    const parsedIncome = parseFloat(editIncome);
    if (!isNaN(parsedIncome) && parsedIncome >= 0) {'''
new_header = '''  const handleSaveHeader = () => {
    const parsedIncome = parseFloat(editIncome.replace(',', '.'));
    if (!isNaN(parsedIncome) && parsedIncome >= 0) {'''

content = content.replace(old_header, new_header)

with open('src/components/ExpensesTab.tsx', 'w') as f:
    f.write(content)
