import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BudgetData } from '../types';
import { CATEGORY_INFO } from '../constants';
import { formatCurrency } from '../utils';

interface BudgetChartProps {
  data: BudgetData;
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  const chartData = CATEGORY_INFO.map((info) => ({
    name: info.name,
    value: data.expenses[info.name],
    color: info.color,
  })).filter(item => item.value > 0);

  const totalGasto = Object.values(data.expenses).reduce((acc, val) => (acc as number) + (val as number), 0) as number;

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-white text-sm font-bold mb-4">Gastos por Categoria</h3>
      <div className="flex-1 relative flex flex-col">
        {chartData.length > 0 ? (
          <div className="relative h-[250px]">
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
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#fff', fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white text-xl font-bold">{formatCurrency(totalGasto as number)}</span>
            </div>
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center">
            <span className="text-[#71717a] text-sm">Você não possui gastos cadastrados</span>
          </div>
        )}
        <div className="mt-8">
          <h4 className="text-white text-sm font-bold mb-3">Legenda</h4>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2">
            {CATEGORY_INFO.map((info) => (
              <div key={info.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: info.color }} />
                <span className="text-[#a1a1aa] text-xs font-medium truncate">{info.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
