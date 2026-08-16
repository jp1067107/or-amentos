import re

with open('src/components/HistoryTab.tsx', 'r') as f:
    content = f.read()

# Replace imports
content = content.replace("import React from 'react';", "import React, { useState } from 'react';")
content = content.replace("import { Trash2, History } from 'lucide-react';", "import { Trash2, History, ChevronDown } from 'lucide-react';")

# Add state
state_code = """export const HistoryTab: React.FC<HistoryTabProps> = ({ budgetData, setBudgetData }) => {
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRecord(prev => prev === id ? null : id);
  };"""

content = content.replace("export const HistoryTab: React.FC<HistoryTabProps> = ({ budgetData, setBudgetData }) => {", state_code)

# Replace the inner map return block
old_return = """            return (
              <div key={record.id} className="bg-[#111111] border border-[#222] rounded-xl p-5 relative group flex flex-col hover:border-[#333] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white capitalize">{record.month}</h3>
                    <p className="text-[10px] text-[#71717a] mt-1">Salvo em {new Date(record.timestamp).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(record.id)}
                    className="w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center text-[#555] transition-colors"
                    title="Excluir relatório"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3 flex-1 bg-[#0a0a0a] p-3 rounded-lg border border-[#222]">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#a1a1aa]">Renda:</span>
                    <span className="text-white font-medium">{formatCurrency(record.income)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#a1a1aa]">Despesas:</span>
                    <span className="text-[#eab308] font-medium">{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-[#222]">
                    <span className="text-[#a1a1aa]">Saldo:</span>
                    <span className={`font-bold ${saldo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {saldo >= 0 ? '+' : ''}{formatCurrency(saldo)}
                    </span>
                  </div>
                </div>
              </div>
            );"""

new_return = """            const isExpanded = expandedRecord === record.id;
            
            return (
              <div key={record.id} className="bg-[#111111] border border-[#222] rounded-xl p-5 relative group flex flex-col hover:border-[#333] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white capitalize">{record.month}</h3>
                    <p className="text-[10px] text-[#71717a] mt-1">Salvo em {new Date(record.timestamp).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleExpand(record.id)}
                      className="w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-[#222] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors"
                      title={isExpanded ? "Ocultar detalhes" : "Ver detalhes"}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <button 
                      onClick={() => handleDelete(record.id)}
                      className="w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center text-[#555] transition-colors"
                      title="Excluir relatório"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 bg-[#0a0a0a] p-3 rounded-lg border border-[#222]">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#a1a1aa]">Renda:</span>
                    <span className="text-white font-medium">{formatCurrency(record.income)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#a1a1aa]">Despesas:</span>
                    <span className="text-[#eab308] font-medium">{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-[#222]">
                    <span className="text-[#a1a1aa]">Saldo:</span>
                    <span className={`font-bold ${saldo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {saldo >= 0 ? '+' : ''}{formatCurrency(saldo)}
                    </span>
                  </div>
                </div>

                {isExpanded && record.expenseItems && (
                  <div className="mt-4 pt-4 border-t border-[#222] space-y-4 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">Detalhamento</h4>
                    {Object.entries(record.expenseItems).map(([category, items]) => {
                      if (!items || items.length === 0) return null;
                      const catTotal = items.reduce((sum, item) => sum + item.value, 0);
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-white font-bold">{category}</span>
                            <span className="text-[#71717a] font-medium text-xs">{formatCurrency(catTotal)}</span>
                          </div>
                          <div className="space-y-1.5 pl-2 border-l-2 border-[#222]">
                            {items.map(item => (
                              <div key={item.id} className="flex justify-between items-center text-xs">
                                <span className="text-[#a1a1aa] truncate mr-2">{item.name}</span>
                                <span className="text-gray-300 whitespace-nowrap">{formatCurrency(item.value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );"""

content = content.replace(old_return, new_return)

with open('src/components/HistoryTab.tsx', 'w') as f:
    f.write(content)

