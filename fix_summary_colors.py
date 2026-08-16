with open('src/components/SummaryTable.tsx', 'r') as f:
    content = f.read()

# Change Total a gastar color to emerald
content = content.replace(
    '<div className="text-white text-base sm:text-lg font-bold">{formatCurrency(totalAGastar as number)}</div>',
    '<div className="text-emerald-400 text-base sm:text-lg font-bold">{formatCurrency(totalAGastar as number)}</div>'
)

# Change Utilizado color to be dynamic
old_utilizado = '<div className="text-[#eab308] text-lg sm:text-xl font-bold">{utilizedPercentage.toFixed(0)}%</div>'
new_utilizado = '<div className={`text-lg sm:text-xl font-bold ${utilizedPercentage > 100 ? "text-red-500" : "text-emerald-400"}`}>{utilizedPercentage.toFixed(0)}%</div>'
content = content.replace(old_utilizado, new_utilizado)

with open('src/components/SummaryTable.tsx', 'w') as f:
    f.write(content)
