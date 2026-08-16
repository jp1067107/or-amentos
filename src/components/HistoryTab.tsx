import React, { useState } from 'react';
import { BudgetData, ExpenseItem } from '../types';
import { formatCurrency } from '../utils';
import { Trash2, History, ChevronDown, AlertTriangle } from 'lucide-react';

interface HistoryTabProps {
  budgetData: BudgetData;
  setBudgetData: React.Dispatch<React.SetStateAction<BudgetData>>;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ budgetData, setBudgetData }) => {
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRecord(prev => prev === id ? null : id);
  };
  const history = budgetData.history || [];

  const handleDelete = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      history: (prev.history || []).filter(record => record.id !== id)
    }));
    setDeleteConfirmId(null);
  };

  const getSaldo = (income: number, expenses: number) => {
    return income - expenses;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Histórico de Relatórios</h2>
          <p className="text-sm text-[#a1a1aa] mt-1">Análise seus orçamentos passados e gerencie o espaço.</p>
        </div>
      </div>
      
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-[#111111] rounded-xl border border-[#222] min-h-[300px]">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-[#333]">
            <History className="w-8 h-8 text-[#555]" />
          </div>
          <p className="text-white text-base font-bold text-center">Nenhum relatório salvo</p>
          <p className="text-[#71717a] text-sm text-center mt-2 max-w-[250px]">Salve o mês atual no menu de opções do topo para ver seu histórico aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...history].sort((a, b) => b.timestamp - a.timestamp).map(record => {
            const totalExpenses = Object.values(record.expenses).reduce((acc, val) => (acc as number) + (val as number), 0) as number;
            const saldo = getSaldo(record.income, totalExpenses);

            const isExpanded = expandedRecord === record.id;
            
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
                      onClick={() => setDeleteConfirmId(record.id)}
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
                    {Object.entries(record.expenseItems).map(([category, itemsUncast]) => {
                      const items = itemsUncast as ExpenseItem[];
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
            );
          })}
        </div>
      )}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#333] rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Excluir Relatório</h3>
            </div>
            <p className="text-[#a1a1aa] text-sm mb-6">
              Tem certeza que deseja excluir este relatório salvo? Essa ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-[#222] transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
