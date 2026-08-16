with open('src/components/SummaryTable.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<span className="text-gray-300 font-medium">{formatCurrency(item.value)}</span>',
    '<span className="text-red-400 font-medium">{formatCurrency(item.value)}</span>'
)

with open('src/components/SummaryTable.tsx', 'w') as f:
    f.write(content)
