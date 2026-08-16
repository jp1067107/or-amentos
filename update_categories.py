import re

with open('src/components/ExpensesTab.tsx', 'r') as f:
    content = f.read()

# I want to replace the whole `space-y-1` mapping block with a richer one.
old_block = """              <div className="space-y-1">
                {CATEGORY_INFO.map(info => (
                  <button 
                    key={info.name}
                    onClick={() => setSelectedCategory(info.name)}
                    className="w-full flex items-center justify-between p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: info.color }} />
                      <span className="text-gray-200 text-sm font-semibold">{info.name}</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-[#71717a] opacity-0 group-hover:opacity-100 transform rotate-180 transition-all group-hover:text-white" />
                  </button>
                ))}
              </div>"""

new_block = """              <div className="space-y-2">
                {CATEGORY_INFO.map(info => {
                  const spent = budgetData.expenses[info.name] || 0;
                  const goalPercent = budgetData.goals[info.name] || 0;
                  const target = (budgetData.income * goalPercent) / 100;
                  const percentSpent = target > 0 ? Math.min((spent / target) * 100, 100) : 0;
                  const isOver = spent > target && target > 0;

                  return (
                    <button 
                      key={info.name}
                      onClick={() => setSelectedCategory(info.name)}
                      className="w-full text-left p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors group border border-transparent hover:border-[#333]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: info.color }} />
                          <span className="text-gray-200 text-sm font-bold">{info.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isOver ? 'text-red-400' : 'text-gray-300'}`}>
                            {formatCurrency(spent)}
                          </span>
                          <ChevronLeft className="w-4 h-4 text-[#71717a] opacity-0 group-hover:opacity-100 transform rotate-180 transition-all group-hover:text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#71717a] mb-1 font-medium">
                        <span>Progresso</span>
                        <span>Meta: {formatCurrency(target)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : ''}`}
                          style={{ 
                            width: `${percentSpent}%`, 
                            backgroundColor: isOver ? undefined : info.color 
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>"""

if old_block in content:
    content = content.replace(old_block, new_block)
else:
    print("Could not find old block to replace.")

content = content.replace('<h3 className="text-white text-sm font-bold mb-4">Gastos</h3>', '')

with open('src/components/ExpensesTab.tsx', 'w') as f:
    f.write(content)

