import React from 'react';
import { BudgetData } from '../types';
import { formatCurrency } from '../utils';
import { Trash2 } from 'lucide-react';

interface HistoryTabProps {
  budgetData: BudgetData;
  setBudgetData: React.Dispatch<React.SetStateAction<BudgetData>>;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ budgetData, setBudgetData }) => {
  const history = budgetData.history || [];

  const handleDelete = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      history: (prev.history || []).filter(record => record.id !== id)
    }));
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
          <p className="text-[#a1a1aa] text-sm text-center">Você ainda não possui relatórios salvos.</p>
          <p className="text-[#71717a] text-xs text-center mt-2">Salve o mês atual no menu de opções do topo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.sort((a, b) => b.timestamp - a.timestamp).map(record => {
            const totalExpenses = Object.values(record.expenses).reduce((acc, val) => acc + val, 0);
            const saldo = getSaldo(record.income, totalExpenses);

            return (
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
            );
          })}
        </div>
      )}
    </div>
  );
};
