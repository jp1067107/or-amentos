import React from 'react';
import { BudgetData } from '../types';
import { CATEGORY_INFO } from '../constants';
import { formatCurrency } from '../utils';

interface SummaryTableProps {
  data: BudgetData;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({ data }) => {
  const totalGasto = Object.values(data.expenses).reduce((acc, val) => (acc as number) + (val as number), 0) as number;
  const totalAGastar = data.income;
  const utilizedPercentage = totalAGastar > 0 ? (totalGasto / totalAGastar) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-[#111111] rounded-xl border border-[#222] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#222] bg-[#1a1a1a] px-6 py-4">
        <h3 className="text-sm font-bold text-white">Resumo do Orçamento</h3>
      </div>
      
      <div className="flex-1 overflow-x-auto p-4 md:p-6">
        <table className="w-full text-left text-sm border-collapse min-w-[550px]">
          <thead className="bg-[#111111] text-[10px] uppercase tracking-wider text-[#71717a]">
            <tr className="border-b border-[#222]">
              <th className="pb-3 pr-4 font-semibold">Categoria</th>
              <th className="pb-3 pr-4 font-semibold">Valor Gasto</th>
              <th className="pb-3 pr-4 font-semibold">Devo gastar</th>
              <th className="pb-3 pr-4 font-semibold">Utilizado</th>
              <th className="pb-3 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222] text-gray-200 text-xs font-medium">
            {CATEGORY_INFO.map((info) => {
              const spent = data.expenses[info.name] || 0;
              const targetPercent = data.goals[info.name] || 0;
              const targetAmount = (data.income * targetPercent) / 100;
              const utilized = targetAmount > 0 ? (spent / targetAmount) * 100 : 0;
              const totalPercentage = data.income > 0 ? (spent / data.income) * 100 : 0;

              return (
                <tr key={info.name} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="py-3 pr-4 whitespace-nowrap text-gray-200">{info.name}</td>
                  <td className="py-3 pr-4 whitespace-nowrap text-red-400 font-bold">{formatCurrency(spent)}</td>
                  <td className="py-3 pr-4 whitespace-nowrap text-[#a1a1aa]">{formatCurrency(targetAmount)}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${utilized > 100 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {utilized.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 whitespace-nowrap text-right text-[#a1a1aa]">{totalPercentage.toFixed(2)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 md:px-6 py-4 border-t border-[#222] bg-[#1a1a1a] grid grid-cols-2 md:flex md:items-center md:justify-between gap-4 md:gap-0 rounded-b-xl">
        <div className="flex flex-col">
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-1">Total gasto</div>
          <div className="text-red-400 text-base sm:text-lg font-bold">{formatCurrency(totalGasto as number)}</div>
        </div>
        <div className="flex flex-col md:items-center">
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-1">Total a gastar</div>
          <div className="text-white text-base sm:text-lg font-bold">{formatCurrency(totalAGastar as number)}</div>
        </div>
        <div className="flex flex-col col-span-2 md:col-span-1 items-start md:items-end bg-[#111] md:bg-transparent p-3 md:p-0 rounded-lg md:rounded-none border border-[#222] md:border-none">
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-1">Utilizado</div>
          <div className="text-[#eab308] text-lg sm:text-xl font-bold">{utilizedPercentage.toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
};
