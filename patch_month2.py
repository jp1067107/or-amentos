import re

with open('src/components/ExpensesTab.tsx', 'r') as f:
    content = f.read()

# Replace functions
content = re.sub(r"const monthToInputFormat =.*?(?=export const ExpensesTab)", "", content, flags=re.DOTALL)

with open('src/components/ExpensesTab.tsx', 'w') as f:
    f.write(content)

