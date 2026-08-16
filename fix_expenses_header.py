with open('src/components/ExpensesTab.tsx', 'r') as f:
    content = f.read()

# Fix focus ring
content = content.replace("focus-within:border-[#eab308]", "focus-within:border-emerald-500")
content = content.replace("focus:border-[#eab308]", "focus:border-emerald-500")

# Fix check button
content = content.replace(
    'className="p-1.5 bg-[#eab308] text-black rounded hover:bg-[#ca9a04] flex-shrink-0"',
    'className="p-1.5 bg-emerald-500 text-black rounded hover:bg-emerald-600 flex-shrink-0"'
)

# Fix edit button hover
content = content.replace(
    'hover:text-[#eab308]',
    'hover:text-emerald-400'
)

# Fix month badge text
content = content.replace(
    '<span className="text-[#eab308] text-sm font-bold">{budgetData.month}</span>',
    '<span className="text-white text-sm font-bold">{budgetData.month}</span>'
)

with open('src/components/ExpensesTab.tsx', 'w') as f:
    f.write(content)
