import re

with open('src/components/ExpensesTab.tsx', 'r') as f:
    content = f.read()

# For new expense:
old_expense_inputs = """                        <input 
                          type="text"
                          placeholder="Ex: Conta de Luz"
                          value={newName}
                          onChange={e => setNewName(e.target.value)}
                          className="w-full bg-[#0a0a0a] text-white border border-[#222] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#eab308]/50 focus:border-[#eab308]"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] text-sm">R$</span>
                        <input 
                          type="tel"
                          inputMode="numeric"
                          placeholder="0,00"
                          value={newValue}
                          onChange={e => setNewValue(formatMoneyMask(e.target.value))}
                          className="w-full bg-[#0a0a0a] text-white border border-[#222] rounded-lg px-2 pl-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#eab308]/50 focus:border-[#eab308]"
                        />
                      </div>"""

new_expense_inputs = """                        <input 
                          type="text"
                          placeholder="Ex: Conta de Luz"
                          value={newName}
                          onChange={e => setNewName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddExpense(selectedCategory, newName, newValue)}
                          className="w-full bg-[#0a0a0a] text-white border border-[#222] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#eab308]/50 focus:border-[#eab308]"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] text-sm">R$</span>
                        <input 
                          type="tel"
                          inputMode="numeric"
                          placeholder="0,00"
                          value={newValue}
                          onChange={e => setNewValue(formatMoneyMask(e.target.value))}
                          onKeyDown={e => e.key === 'Enter' && handleAddExpense(selectedCategory, newName, newValue)}
                          className="w-full bg-[#0a0a0a] text-white border border-[#222] rounded-lg px-2 pl-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#eab308]/50 focus:border-[#eab308]"
                        />
                      </div>"""

content = content.replace(old_expense_inputs, new_expense_inputs)

# For new autofill item:
old_autofill_inputs = """                          <input 
                            type="text"
                            placeholder="Nome"
                            value={newAutoFillName}
                            onChange={e => setNewAutoFillName(e.target.value)}
                            className="flex-1 sm:w-32 bg-[#0a0a0a] text-white border border-[#222] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#eab308]"
                          />
                          <input 
                            type="tel"
                            inputMode="numeric"
                            placeholder="Valor"
                            value={newAutoFillValue}
                            onChange={e => setNewAutoFillValue(formatMoneyMask(e.target.value))}
                            className="flex-1 sm:w-24 bg-[#0a0a0a] text-white border border-[#222] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#eab308]"
                          />"""

new_autofill_inputs = """                          <input 
                            type="text"
                            placeholder="Nome"
                            value={newAutoFillName}
                            onChange={e => setNewAutoFillName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddAutoFillItem(selectedCategory)}
                            className="flex-1 sm:w-32 bg-[#0a0a0a] text-white border border-[#222] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#eab308]"
                          />
                          <input 
                            type="tel"
                            inputMode="numeric"
                            placeholder="Valor"
                            value={newAutoFillValue}
                            onChange={e => setNewAutoFillValue(formatMoneyMask(e.target.value))}
                            onKeyDown={e => e.key === 'Enter' && handleAddAutoFillItem(selectedCategory)}
                            className="flex-1 sm:w-24 bg-[#0a0a0a] text-white border border-[#222] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#eab308]"
                          />"""

content = content.replace(old_autofill_inputs, new_autofill_inputs)

with open('src/components/ExpensesTab.tsx', 'w') as f:
    f.write(content)
