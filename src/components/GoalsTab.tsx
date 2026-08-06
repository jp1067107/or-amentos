import React, { useState } from 'react';
import { BudgetData, CategoryName } from '../types';
import { CATEGORY_INFO } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils';

interface GoalsTabProps {
  budgetData: BudgetData;
  setBudgetData: React.Dispatch<React.SetStateAction<BudgetData>>;
  onBack: () => void;
}

export const GoalsTab: React.FC<GoalsTabProps> = ({ budgetData, setBudgetData, onBack }) => {
  const [goals, setGoals] = useState<Record<CategoryName, number>>(budgetData.goals);

  const totalPercentage = Object.values(goals).reduce((acc, val) => (acc as number) + (val as number), 0) as number;

  const chartData: Array<{name: string, value: number, color: string}> = CATEGORY_INFO.map(info => ({
    name: info.name,
    value: goals[info.name],
    color: info.color
  })).filter(item => item.value > 0);

  if (totalPercentage < 100) {
    chartData.push({ name: 'Restante', value: 100 - totalPercentage, color: '#222' });
  }

  const handleSliderChange = (category: CategoryName, value: number) => {
    setGoals(prev => ({ ...prev, [category]: value }));
  };

  const handleSave = () => {
    if (totalPercentage !== 100) return;
    setBudgetData(prev => ({ ...prev, goals }));
    onBack();
  };

  const handleReset = () => {
    setGoals(budgetData.goals);
  };

  const exceedsLimit = totalPercentage > 100;
  const isInvalid = totalPercentage !== 100;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Minhas Metas</h1>
        <p className="text-[#a1a1aa] text-sm">Ajuste os percentuais ideais para cada categoria de gasto do seu orçamento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-4 bg-[#111111] border border-[#222] rounded-xl p-6 shadow-sm flex flex-col items-center">
          <h2 className="text-sm font-bold text-[#71717a] uppercase tracking-wider mb-1">Distribuição Ideal</h2>
          <div className={`text-2xl font-bold mb-4 ${isInvalid ? 'text-red-400' : 'text-emerald-400'}`}>
            Total: {totalPercentage}%
          </div>
          
          {exceedsLimit && (
            <p className="text-xs font-bold text-red-400 mb-4 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-center">
              Você ultrapassou 100% (excedente de {totalPercentage - 100}%)
            </p>
          )}
          {totalPercentage < 100 && (
            <p className="text-xs font-bold text-amber-500 mb-4 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-center">
              Faltam {100 - totalPercentage}% para completar
            </p>
          )}

          <div className="w-full h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full mt-6 grid grid-cols-2 gap-y-3 gap-x-2">
            {CATEGORY_INFO.map((info) => (
              <div key={info.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: info.color }} />
                <span className="text-[#a1a1aa] text-[10px] font-medium truncate" title={info.name}>{info.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-8 space-y-6 bg-[#111111] border border-[#222] rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-[#222] pb-4 gap-2">
            <h3 className="text-white font-bold text-sm">Ajustar Metas</h3>
            <span className="text-[#a1a1aa] text-xs font-medium bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#222]">Renda base: <strong className="text-white ml-1">{formatCurrency(budgetData.income)}</strong></span>
          </div>
          
          <div className="space-y-8">
            {CATEGORY_INFO.map(info => {
              const targetAmount = (budgetData.income * goals[info.name]) / 100;
              
              return (
                <div key={info.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-gray-200 font-bold text-sm flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
                      {info.name}
                    </label>
                    <div className="flex flex-col items-end">
                      <span className="text-white font-bold text-sm">{formatCurrency(targetAmount)}</span>
                      <span className="text-[#71717a] text-[10px] font-medium">({goals[info.name]}%)</span>
                    </div>
                  </div>
                  <div className="relative pt-4 pb-2">
                    <div 
                      className="absolute top-0 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm transform -translate-x-1/2 -mt-1 pointer-events-none transition-all duration-200 ease-out"
                      style={{ left: `${goals[info.name]}%`, backgroundColor: info.color }}
                    >
                      {goals[info.name]}%
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goals[info.name]}
                      onChange={(e) => handleSliderChange(info.name, parseInt(e.target.value))}
                      className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#eab308]/20"
                      style={{
                        backgroundImage: `linear-gradient(${info.color}, ${info.color})`,
                        backgroundSize: `${goals[info.name]}% 100%`,
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                    <div className="flex justify-between text-[10px] font-medium text-[#71717a] mt-1.5">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-[#222] mt-4">
            <button
              onClick={handleReset}
              className="px-4 py-3 sm:py-2 text-[#a1a1aa] font-bold text-sm sm:text-xs rounded-lg hover:bg-[#1a1a1a] transition-colors border border-transparent hover:border-[#333] w-full sm:w-auto text-center"
            >
              Restaurar Valores
            </button>
            <button
              onClick={handleSave}
              disabled={isInvalid}
              className={`px-6 py-3 sm:py-2 font-bold text-sm sm:text-xs rounded-lg shadow-sm transition-all w-full sm:w-auto text-center ${
                isInvalid ? 'bg-[#222] text-[#555] cursor-not-allowed border border-[#333]' : 'bg-[#eab308] text-black hover:bg-[#ca9a04] hover:shadow-md'
              }`}
            >
              Salvar Metas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
