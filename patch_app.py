import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
'''import { GoalsTab } from './components/GoalsTab';
import { ExpensesTab } from './components/ExpensesTab';
import { HistoryTab } from './components/HistoryTab';''',
'''import { Suspense, lazy } from 'react';
const GoalsTab = lazy(() => import('./components/GoalsTab').then(module => ({ default: module.GoalsTab })));
const ExpensesTab = lazy(() => import('./components/ExpensesTab').then(module => ({ default: module.ExpensesTab })));
const HistoryTab = lazy(() => import('./components/HistoryTab').then(module => ({ default: module.HistoryTab })));'''
)

content = content.replace(
'''        {activeTab === 'orcamento' ? (
          <ExpensesTab budgetData={budgetData} setBudgetData={setBudgetData} />
        ) : activeTab === 'metas' ? (
          <GoalsTab budgetData={budgetData} setBudgetData={setBudgetData} onBack={() => setActiveTab('orcamento')} />
        ) : (
          <HistoryTab budgetData={budgetData} setBudgetData={setBudgetData} />
        )}''',
'''        <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="w-8 h-8 border-4 border-[#eab308] border-t-transparent rounded-full animate-spin"></div></div>}>
          {activeTab === 'orcamento' ? (
            <ExpensesTab budgetData={budgetData} setBudgetData={setBudgetData} />
          ) : activeTab === 'metas' ? (
            <GoalsTab budgetData={budgetData} setBudgetData={setBudgetData} onBack={() => setActiveTab('orcamento')} />
          ) : (
            <HistoryTab budgetData={budgetData} setBudgetData={setBudgetData} />
          )}
        </Suspense>'''
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
