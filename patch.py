import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
'''                 <div className="px-4 py-2 border-b border-[#222] mb-1">
                   <p className="text-xs text-[#a1a1aa] truncate">{user.email}</p>
                 </div>''',
'''                 <div className="px-4 py-2 border-b border-[#222] mb-1">
                   <p className="text-xs text-[#a1a1aa] truncate">{user.email}</p>
                 </div>
                 <button 
                   onClick={handleSaveCurrentMonth}
                   className="w-full text-left px-4 py-2 text-sm font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-[#eab308] transition-colors flex items-center gap-2"
                 >
                   <Save className="w-4 h-4" /> Salvar Mês Atual
                 </button>'''
)

content = content.replace(
'''             <button 
               onClick={() => setActiveTab('orcamento')}
               className={`px-4 sm:px-6 py-4 md:px-8 text-[11px] sm:text-xs md:text-sm font-bold tracking-wide uppercase border-b-2 transition-colors whitespace-nowrap flex-1 text-center ${activeTab === 'orcamento' ? 'border-[#eab308] text-[#eab308]' : 'border-transparent text-[#a1a1aa] hover:text-white'}`}
             >
               Orçamento
             </button>
             <button 
               onClick={() => setActiveTab('metas')}
               className={`px-4 sm:px-6 py-4 md:px-8 text-[11px] sm:text-xs md:text-sm font-bold tracking-wide uppercase border-b-2 transition-colors whitespace-nowrap flex-1 text-center ${activeTab === 'metas' ? 'border-[#eab308] text-[#eab308]' : 'border-transparent text-[#a1a1aa] hover:text-white'}`}
             >
               Metas
             </button>''',
'''             <button 
               onClick={() => setActiveTab('orcamento')}
               className={`px-4 sm:px-6 py-4 md:px-8 text-[11px] sm:text-xs md:text-sm font-bold tracking-wide uppercase border-b-2 transition-colors whitespace-nowrap flex-1 text-center ${activeTab === 'orcamento' ? 'border-[#eab308] text-[#eab308]' : 'border-transparent text-[#a1a1aa] hover:text-white'}`}
             >
               Orçamento
             </button>
             <button 
               onClick={() => setActiveTab('metas')}
               className={`px-4 sm:px-6 py-4 md:px-8 text-[11px] sm:text-xs md:text-sm font-bold tracking-wide uppercase border-b-2 transition-colors whitespace-nowrap flex-1 text-center ${activeTab === 'metas' ? 'border-[#eab308] text-[#eab308]' : 'border-transparent text-[#a1a1aa] hover:text-white'}`}
             >
               Metas
             </button>
             <button 
               onClick={() => setActiveTab('historico')}
               className={`px-4 sm:px-6 py-4 md:px-8 text-[11px] sm:text-xs md:text-sm font-bold tracking-wide uppercase border-b-2 transition-colors whitespace-nowrap flex-1 text-center ${activeTab === 'historico' ? 'border-[#eab308] text-[#eab308]' : 'border-transparent text-[#a1a1aa] hover:text-white'}`}
             >
               Histórico
             </button>'''
)

content = content.replace(
'''         {activeTab === 'orcamento' ? (
           <ExpensesTab budgetData={budgetData} setBudgetData={setBudgetData} />
         ) : (
           <GoalsTab budgetData={budgetData} setBudgetData={setBudgetData} onBack={() => setActiveTab('orcamento')} />
         )}''',
'''         {activeTab === 'orcamento' ? (
           <ExpensesTab budgetData={budgetData} setBudgetData={setBudgetData} />
         ) : activeTab === 'metas' ? (
           <GoalsTab budgetData={budgetData} setBudgetData={setBudgetData} onBack={() => setActiveTab('orcamento')} />
         ) : (
           <HistoryTab budgetData={budgetData} setBudgetData={setBudgetData} />
         )}'''
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
