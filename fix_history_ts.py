import re

with open('src/components/HistoryTab.tsx', 'r') as f:
    content = f.read()

# Add import for ExpenseItem
content = content.replace("import { BudgetData } from '../types';", "import { BudgetData, ExpenseItem } from '../types';")

# Fix the map
old_code = """                    {Object.entries(record.expenseItems).map(([category, items]) => {
                      if (!items || items.length === 0) return null;
                      const catTotal = items.reduce((sum, item) => sum + item.value, 0);"""

new_code = """                    {Object.entries(record.expenseItems).map(([category, itemsUncast]) => {
                      const items = itemsUncast as ExpenseItem[];
                      if (!items || items.length === 0) return null;
                      const catTotal = items.reduce((sum, item) => sum + item.value, 0);"""

content = content.replace(old_code, new_code)

with open('src/components/HistoryTab.tsx', 'w') as f:
    f.write(content)

