import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add the Histórico tab button
tab_code_to_find = """            <button 
              onClick={() => setActiveTab('metas')}
              className={`px-4 sm:px-6 py-4 md:px-8 text-[11px] sm:text-xs md:text-sm font-bold tracking-wide uppercase border-b-2 transition-colors whitespace-nowrap flex-1 text-center ${activeTab === 'metas' ? 'border-[#eab308] text-[#eab308]' : 'border-transparent text-[#a1a1aa] hover:text-white'}`}
            >
              Metas
            </button>"""

tab_code_to_replace = """            <button 
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
            </button>"""

content = content.replace(tab_code_to_find, tab_code_to_replace)


# Update the main content area
main_content_to_find = """        {activeTab === 'orcamento' ? (
          <ExpensesTab budgetData={budgetData} setBudgetData={setBudgetData} />
        ) : (
          <GoalsTab budgetData={budgetData} setBudgetData={setBudgetData} onBack={() => setActiveTab('orcamento')} />
        )}"""

main_content_to_replace = """        {activeTab === 'orcamento' ? (
          <ExpensesTab budgetData={budgetData} setBudgetData={setBudgetData} />
        ) : activeTab === 'metas' ? (
          <GoalsTab budgetData={budgetData} setBudgetData={setBudgetData} onBack={() => setActiveTab('orcamento')} />
        ) : (
          <HistoryTab budgetData={budgetData} setBudgetData={setBudgetData} />
        )}"""

content = content.replace(main_content_to_find, main_content_to_replace)

with open('src/App.tsx', 'w') as f:
    f.write(content)
