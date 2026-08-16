import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { formatCurrency, formatMoneyMask, parseMoney } from '../utils';
import { X, TrendingDown } from 'lucide-react';

interface SimulatorProps {
  onClose: () => void;
}

export const IncomeSimulator: React.FC<SimulatorProps> = ({ onClose }) => {
  const [initialAmount, setInitialAmount] = useState('350.000,00');
  const [withdrawalAmount, setWithdrawalAmount] = useState('1.000,00');
  const [interestRate, setInterestRate] = useState('8,00');
  const [interestType, setInterestType] = useState<'yearly' | 'monthly'>('yearly');
  const [period, setPeriod] = useState('1');
  const [periodType, setPeriodType] = useState<'years' | 'months'>('years');

  const results = useMemo(() => {
    const p = parseMoney(initialAmount);
    const w = parseMoney(withdrawalAmount);
    const r = parseMoney(interestRate) / 100;
    const t = parseInt(period) || 0;

    const months = periodType === 'years' ? t * 12 : t;
    const monthlyRate = interestType === 'yearly' ? Math.pow(1 + r, 1 / 12) - 1 : r;

    let balance = p;
    let totalInterest = 0;
    let totalWithdrawn = 0;
    const chartData = [];

    chartData.push({
      month: 0,
      label: 'Início',
      saldo: balance,
      jurosAcumulados: 0
    });

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      totalInterest += interest;
      balance += interest;
      balance -= w;
      totalWithdrawn += w;

      if (balance < 0) balance = 0;

      chartData.push({
        month: i,
        label: `Mês ${i}`,
        saldo: balance,
        jurosAcumulados: totalInterest
      });
    }

    return {
      finalBalance: balance,
      totalWithdrawn,
      totalInterest,
      chartData
    };
  }, [initialAmount, withdrawalAmount, interestRate, interestType, period, periodType]);

  const handleClear = () => {
    setInitialAmount('');
    setWithdrawalAmount('');
    setInterestRate('');
    setPeriod('');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-0 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="bg-[#0a0a0a] sm:border border-[#222] sm:rounded-xl w-full h-full sm:h-auto min-h-screen sm:min-h-0 max-w-4xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-[#222] bg-[#111111] sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Simulador de Renda</h2>
                <p className="text-sm text-[#a1a1aa]">Simule retiradas mensais do seu patrimônio investido</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-[#a1a1aa] hover:text-white transition-colors rounded-lg hover:bg-[#222]">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Form */}
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-4 bg-[#111] p-5 rounded-xl border border-[#222]">
                <div>
                  <label className="block text-sm font-medium text-[#a1a1aa] mb-1.5">Valor inicial</label>
                  <div className="flex items-center border border-[#333] rounded-lg bg-[#0a0a0a] px-3 focus-within:border-emerald-500 transition-colors">
                    <span className="text-[#a1a1aa]">R$</span>
                    <input 
                      type="text" 
                      value={initialAmount}
                      onChange={e => setInitialAmount(formatMoneyMask(e.target.value))}
                      className="w-full bg-transparent text-white px-3 py-3 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a1a1aa] mb-1.5">Valor de retirada mensal</label>
                  <div className="flex items-center border border-[#333] rounded-lg bg-[#0a0a0a] px-3 focus-within:border-emerald-500 transition-colors">
                    <span className="text-[#a1a1aa]">R$</span>
                    <input 
                      type="text" 
                      value={withdrawalAmount}
                      onChange={e => setWithdrawalAmount(formatMoneyMask(e.target.value))}
                      className="w-full bg-transparent text-white px-3 py-3 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#a1a1aa] mb-1.5">Taxa de juros</label>
                    <div className="flex border border-[#333] rounded-lg bg-[#0a0a0a] overflow-hidden focus-within:border-emerald-500 transition-colors">
                      <div className="flex items-center pl-3">
                        <span className="text-[#a1a1aa]">%</span>
                      </div>
                      <input 
                        type="text" 
                        value={interestRate}
                        onChange={e => setInterestRate(formatMoneyMask(e.target.value))}
                        className="w-full bg-transparent text-white px-2 py-3 focus:outline-none min-w-0"
                      />
                      <select 
                        value={interestType}
                        onChange={e => setInterestType(e.target.value as any)}
                        className="bg-[#1a1a1a] text-[#a1a1aa] border-l border-[#333] px-2 py-3 focus:outline-none text-sm"
                      >
                        <option value="yearly">anual</option>
                        <option value="monthly">mensal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#a1a1aa] mb-1.5">Tempo</label>
                    <div className="flex border border-[#333] rounded-lg bg-[#0a0a0a] overflow-hidden focus-within:border-emerald-500 transition-colors">
                      <input 
                        type="text" 
                        value={period}
                        onChange={e => setPeriod(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-transparent text-white px-3 py-3 focus:outline-none min-w-0"
                      />
                      <select 
                        value={periodType}
                        onChange={e => setPeriodType(e.target.value as any)}
                        className="bg-[#1a1a1a] text-[#a1a1aa] border-l border-[#333] px-2 py-3 focus:outline-none text-sm"
                      >
                        <option value="years">ano(s)</option>
                        <option value="months">meses</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                 <button className="text-sm text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
                   Simular aportes mensais
                 </button>
                 <button onClick={handleClear} className="text-sm text-[#71717a] hover:text-white transition-colors">
                   Limpar
                 </button>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-7 flex flex-col h-full">
              <h3 className="text-xl font-bold text-white mb-4">Resultado</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-emerald-900/40 p-5 rounded-xl border border-emerald-800 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-2">Valor total final</span>
                  <span className="text-emerald-400 text-2xl font-bold">{formatCurrency(results.finalBalance)}</span>
                </div>
                <div className="bg-[#111111] p-5 rounded-xl border border-[#222] shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[#a1a1aa] text-xs font-bold uppercase tracking-wider mb-2">Valor total retirado</span>
                  <span className="text-red-400 text-2xl font-bold">{formatCurrency(results.totalWithdrawn)}</span>
                </div>
                <div className="bg-[#111111] p-5 rounded-xl border border-[#222] shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[#a1a1aa] text-xs font-bold uppercase tracking-wider mb-2">Total em juros</span>
                  <span className="text-emerald-400 text-2xl font-bold">{formatCurrency(results.totalInterest)}</span>
                </div>
              </div>

              <div className="flex-1 min-h-[250px] sm:min-h-[300px] bg-[#111] border border-[#222] rounded-xl p-4 md:p-6 flex flex-col">
                <h4 className="text-sm font-bold text-white mb-6 text-center">Gráfico da Evolução do Saldo</h4>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.chartData} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis 
                        dataKey="label" 
                        stroke="#555" 
                        tick={{ fill: '#71717a', fontSize: 12 }} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#555" 
                        tick={{ fill: '#71717a', fontSize: 12 }}
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend iconType="square" wrapperStyle={{ paddingTop: '20px' }}/>
                      <Line 
                        type="monotone" 
                        dataKey="saldo" 
                        name="Valor Investido (Saldo)" 
                        stroke="#ffffff" 
                        strokeWidth={3}
                        dot={{ fill: '#ffffff', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#ef4444', stroke: '#000' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="jurosAcumulados" 
                        name="Total em juros" 
                        stroke="#34d399" 
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
