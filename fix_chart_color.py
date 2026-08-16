with open('src/components/BudgetChart.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<span className="text-white text-xl font-bold">{formatCurrency(totalGasto as number)}</span>',
    '<span className="text-red-400 text-xl font-bold">{formatCurrency(totalGasto as number)}</span>'
)

with open('src/components/BudgetChart.tsx', 'w') as f:
    f.write(content)
