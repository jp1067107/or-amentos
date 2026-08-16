with open('src/components/HistoryTab.tsx', 'r') as f:
    content = f.read()

# Fix Income color
content = content.replace(
    '<span className="text-white font-medium">{formatCurrency(record.income)}</span>',
    '<span className="text-emerald-400 font-medium">{formatCurrency(record.income)}</span>'
)

# Fix Expenses color
content = content.replace(
    '<span className="text-[#eab308] font-medium">{formatCurrency(totalExpenses)}</span>',
    '<span className="text-red-400 font-medium">{formatCurrency(totalExpenses)}</span>'
)

# Fix Saldo color (green-500 to emerald-400, red-500 to red-400)
content = content.replace(
    "text-green-500' : 'text-red-500",
    "text-emerald-400' : 'text-red-400"
)

with open('src/components/HistoryTab.tsx', 'w') as f:
    f.write(content)
