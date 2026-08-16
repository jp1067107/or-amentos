import re

with open('src/components/CompoundInterestCalculator.tsx', 'r') as f:
    content = f.read()

old_period_type = """              <div>
                <label className="block text-sm font-bold text-[#111] mb-1 opacity-0">Tipo</label>
                <select 
                  value={periodType}
                  onChange={e => setPeriodType(e.target.value as any)}
                  className="w-full bg-[#0a0a0a] text-white border border-[#333] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#eab308] transition-colors appearance-none"
                >
                  <option value="years">Anos</option>
                  <option value="months">Meses</option>
                </select>
              </div>
            </div>"""

new_period_type = """              <div>
                <label className="block text-sm font-bold text-[#111] mb-1 opacity-0">Tipo</label>
                <select 
                  value={periodType}
                  onChange={e => setPeriodType(e.target.value as any)}
                  className="w-full bg-[#0a0a0a] text-white border border-[#333] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#eab308] transition-colors appearance-none"
                >
                  <option value="years">Anos</option>
                  <option value="months">Meses</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setInitialAmount('0,00');
                setMonthlyAmount('0,00');
                setInterestRate('0,00');
                setPeriod('0');
              }}
              className="w-full mt-4 py-2 text-sm font-bold text-[#a1a1aa] hover:text-white border border-[#333] rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              Zerar Valores
            </button>"""

content = content.replace(old_period_type, new_period_type)

with open('src/components/CompoundInterestCalculator.tsx', 'w') as f:
    f.write(content)

