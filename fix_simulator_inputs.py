import re

with open('src/components/IncomeSimulator.tsx', 'r') as f:
    content = f.read()

# Fix the internal grid of the form to not be side-by-side on lg if it's too tight
content = content.replace('grid grid-cols-1 sm:grid-cols-2 gap-4', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4')

# Revert xl:col-span-3 back to 4 to give the form more room, keeping it balanced
content = content.replace('xl:col-span-3', 'xl:col-span-4')
content = content.replace('xl:col-span-9', 'xl:col-span-8')

with open('src/components/IncomeSimulator.tsx', 'w') as f:
    f.write(content)
