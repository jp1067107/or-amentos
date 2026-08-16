import re

with open('src/components/ExpensesTab.tsx', 'r') as f:
    content = f.read()

# Replace the input block for month
old_input = """              <input 
                type="month" 
                value={monthToInputFormat(editMonth)} 
                onChange={e => setEditMonth(inputFormatToMonth(e.target.value) || e.target.value)}
                className="flex-1 sm:w-32 min-w-[120px] px-2 py-1 text-sm bg-[#222] text-white border border-[#333] rounded focus:outline-none focus:border-[#eab308] appearance-none"
                placeholder="Mês"
              />"""

new_input = """              <input 
                type="text" 
                value={editMonth} 
                onChange={e => setEditMonth(e.target.value)}
                className="flex-1 sm:w-32 min-w-[120px] px-2 py-1 text-sm bg-[#222] text-white border border-[#333] rounded focus:outline-none focus:border-[#eab308]"
                placeholder="Ex: Maio/2024"
              />"""

content = content.replace(old_input, new_input)

with open('src/components/ExpensesTab.tsx', 'w') as f:
    f.write(content)

