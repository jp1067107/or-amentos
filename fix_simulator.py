import re

with open('src/components/IncomeSimulator.tsx', 'r') as f:
    content = f.read()

# Make the form grid responsive
old_grid = """<div className="grid grid-cols-2 gap-4">"""
new_grid = """<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">"""
content = content.replace(old_grid, new_grid)

# Fix Final Balance colors (Red to Green)
old_final_balance = """<div className="bg-[#8b1515] p-5 rounded-xl border border-red-900 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-red-100 text-xs font-bold uppercase tracking-wider mb-2">Valor total final</span>
                  <span className="text-white text-2xl font-bold">{formatCurrency(results.finalBalance)}</span>
                </div>"""
new_final_balance = """<div className="bg-emerald-900/40 p-5 rounded-xl border border-emerald-800 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-2">Valor total final</span>
                  <span className="text-emerald-400 text-2xl font-bold">{formatCurrency(results.finalBalance)}</span>
                </div>"""
content = content.replace(old_final_balance, new_final_balance)

# Fix Total Withdrawn colors (Yellow to Red)
old_withdrawn = """<div className="bg-[#111111] p-5 rounded-xl border border-[#222] shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[#a1a1aa] text-xs font-bold uppercase tracking-wider mb-2">Valor total retirado</span>
                  <span className="text-[#eab308] text-2xl font-bold">{formatCurrency(results.totalWithdrawn)}</span>
                </div>"""
new_withdrawn = """<div className="bg-[#111111] p-5 rounded-xl border border-[#222] shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[#a1a1aa] text-xs font-bold uppercase tracking-wider mb-2">Valor total retirado</span>
                  <span className="text-red-400 text-2xl font-bold">{formatCurrency(results.totalWithdrawn)}</span>
                </div>"""
content = content.replace(old_withdrawn, new_withdrawn)

# Fix Total Interest box (Make it more clearly green if we want to)
# Already text-green-400 but let's make it consistent
old_interest = """<div className="bg-[#111111] p-5 rounded-xl border border-[#222] shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[#a1a1aa] text-xs font-bold uppercase tracking-wider mb-2">Total em juros</span>
                  <span className="text-green-400 text-2xl font-bold">{formatCurrency(results.totalInterest)}</span>
                </div>"""
new_interest = """<div className="bg-[#111111] p-5 rounded-xl border border-[#222] shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[#a1a1aa] text-xs font-bold uppercase tracking-wider mb-2">Total em juros</span>
                  <span className="text-emerald-400 text-2xl font-bold">{formatCurrency(results.totalInterest)}</span>
                </div>"""
content = content.replace(old_interest, new_interest)

# Fix Chart Lines
old_chart_lines = """<Line 
                        type="monotone" 
                        dataKey="jurosAcumulados" 
                        name="Total em juros" 
                        stroke="#8b1515" 
                        strokeWidth={3}
                        dot={false}
                      />"""
new_chart_lines = """<Line 
                        type="monotone" 
                        dataKey="jurosAcumulados" 
                        name="Total em juros" 
                        stroke="#34d399" 
                        strokeWidth={3}
                        dot={false}
                      />"""
content = content.replace(old_chart_lines, new_chart_lines)

# Fix responsive container height for small mobile
content = content.replace("min-h-[300px]", "min-h-[250px] sm:min-h-[300px]")

# Fix focus ring
content = content.replace("focus-within:border-red-500", "focus-within:border-emerald-500")

# Fix modal wrapper padding
content = content.replace("min-h-screen p-4 md:p-8 flex items-center justify-center", "min-h-screen p-0 sm:p-4 md:p-8 flex items-center justify-center")
content = content.replace("bg-[#0a0a0a] border border-[#222] rounded-xl w-full max-w-4xl shadow-2xl", "bg-[#0a0a0a] sm:border border-[#222] sm:rounded-xl w-full h-full sm:h-auto min-h-screen sm:min-h-0 max-w-4xl shadow-2xl flex flex-col")

# Make internal grid responsive better
content = content.replace("p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8", "flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8")

# Fix header spacing on mobile
content = content.replace("p-6 border-b border-[#222] bg-[#111111]", "p-4 sm:p-6 border-b border-[#222] bg-[#111111] sticky top-0 z-10")

# Header Icon color
content = content.replace("bg-red-500/10", "bg-emerald-500/10")
content = content.replace("text-red-500", "text-emerald-500")
content = content.replace("hover:text-red-400", "hover:text-emerald-400")

with open('src/components/IncomeSimulator.tsx', 'w') as f:
    f.write(content)
