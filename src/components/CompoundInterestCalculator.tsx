import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils';
import { X, Calculator } from 'lucide-react';

interface CalculatorProps {
  onClose: () => void;
}

export const CompoundInterestCalculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [initialAmount, setInitialAmount] = useState('1.000,00');
  const [monthlyAmount, setMonthlyAmount] = useState('500,00');
  const [interestRate, setInterestRate] = useState('10,00');
  const [interestType, setInterestType] = useState<'yearly' | 'monthly'>('yearly');
  const [period, setPeriod] = useState('10');
  const [periodType, setPeriodType] = useState<'years' | 'months'>('years');

  const parseMoney = (val: string) => {
    let cleaned = val.replace(/[^\d.,]/g, '');
    if (cleaned.includes(',') && cleaned.includes('.')) {
      const lastComma = cleaned.lastIndexOf(',');
      const lastDot = cleaned.lastIndexOf('.');
      if (lastComma > lastDot) {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        cleaned = cleaned.replace(/,/g, '');
      }
    } else if (cleaned.includes(',')) {
      cleaned = cleaned.replace(',', '.');
    }
    const result = parseFloat(cleaned);
    return isNaN(result) ? 0 : result;
  };


  const formatMoneyMask = (val: string) => {
    const numericValue = val.replace(/\D/g, '');
    if (!numericValue) return '0,00';
    const amount = parseInt(numericValue, 10) / 100;
    return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const results = useMemo(() => {
    const p = parseMoney(initialAmount);
    const pmt = parseMoney(monthlyAmount);
    const r = parseMoney(interestRate) / 100;
    const t = parseMoney(period);

    if (t <= 0) return { data: [], total: p, totalInvested: p, totalInterest: 0 };

    const months = periodType === 'years' ? t * 12 : t;
    const monthlyRate = interestType === 'yearly' ? Math.pow(1 + r, 1 / 12) - 1 : r;

    let currentBalance = p;
    let totalInvested = p;
    const data = [];

    // Push initial state (Month 0 or Year 0)
    data.push({
      month: 0,
      label: 'Hoje',
      total: currentBalance,
      invested: totalInvested,
      interest: 0
    });

    for (let m = 1; m <= months; m++) {
      currentBalance = currentBalance * (1 + monthlyRate) + pmt;
      totalInvested += pmt;
      
      // Save data point
      // If > 60 months, maybe just save yearly points to avoid huge charts, but area chart handles it fine.
      // Let's sample if months > 120
      if (months <= 120 || m % 12 === 0 || m === months) {
        data.push({
          month: m,
          label: periodType === 'years' && m % 12 === 0 ? `Ano ${m / 12}` : `Mês ${m}`,
          total: Math.round(currentBalance * 100) / 100,
          invested: Math.round(totalInvested * 100) / 100,
          interest: Math.round((currentBalance - totalInvested) * 100) / 100
        });
      }
    }

    return {
      data,
      total: currentBalance,
      totalInvested,
      totalInterest: currentBalance - totalInvested
    };
  }, [initialAmount, monthlyAmount, interestRate, interestType, period, periodType]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col overflow-hidden animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#222] bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#eab308]/10 flex items-center justify-center text-[#eab308]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">Juros Compostos</h2>
            <p className="text-xs text-[#a1a1aa]">Simule seus investimentos</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-[#111] hover:bg-[#222] text-[#a1a1aa] hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Formulário */}
        <div className="w-full lg:w-[400px] flex-shrink-0 space-y-6">
          <div className="bg-[#111111] border border-[#222] rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Valor Inicial</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] text-sm">R$</span>
                <input 
                  type="text"
                  inputMode="decimal"
                  value={initialAmount}
                  onChange={e => setInitialAmount(formatMoneyMask(e.target.value))}
                  className="w-full bg-[#0a0a0a] text-white border border-[#333] rounded-lg px-3 pl-10 py-2.5 focus:outline-none focus:border-[#eab308] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Aporte Mensal</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] text-sm">R$</span>
                <input 
                  type="text"
                  inputMode="decimal"
                  value={monthlyAmount}
                  onChange={e => setMonthlyAmount(formatMoneyMask(e.target.value))}
                  className="w-full bg-[#0a0a0a] text-white border border-[#333] rounded-lg px-3 pl-10 py-2.5 focus:outline-none focus:border-[#eab308] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Taxa de Juros</label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] text-sm">%</span>
                  <input 
                    type="text"
                    inputMode="decimal"
                    value={interestRate}
                    onChange={e => setInterestRate(formatMoneyMask(e.target.value))}
                    className="w-full bg-[#0a0a0a] text-white border border-[#333] rounded-lg px-3 pr-8 py-2.5 focus:outline-none focus:border-[#eab308] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-1 opacity-0">Tipo</label>
                <select 
                  value={interestType}
                  onChange={e => setInterestType(e.target.value as any)}
                  className="w-full bg-[#0a0a0a] text-white border border-[#333] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#eab308] transition-colors appearance-none"
                >
                  <option value="yearly">Ao Ano</option>
                  <option value="monthly">Ao Mês</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Período</label>
                <input 
                  type="text"
                  inputMode="numeric"
                  value={period}
                  onChange={e => setPeriod(e.target.value)}
                  className="w-full bg-[#0a0a0a] text-white border border-[#333] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#eab308] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-1 opacity-0">Tipo</label>
                <select 
                  value={periodType}
                  onChange={e => setPeriodType(e.target.value as any)}
                  className="w-full bg-[#0a0a0a] text-white border border-[#333] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#eab308] transition-colors appearance-none"
                >
                  <option value="years">Anos</option>
                  <option value="months">Meses</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="flex-1 space-y-6 flex flex-col min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#111111] border border-[#222] rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] mb-1">Valor Total Final</p>
              <p className="text-2xl font-bold text-white truncate" title={formatCurrency(results.total)}>
                {formatCurrency(results.total)}
              </p>
            </div>
            <div className="bg-[#111111] border border-[#222] rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] mb-1">Total Investido</p>
              <p className="text-xl font-bold text-[#71717a] truncate" title={formatCurrency(results.totalInvested)}>
                {formatCurrency(results.totalInvested)}
              </p>
            </div>
            <div className="bg-[#111111] border border-[#222] rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] mb-1">Total em Juros</p>
              <p className="text-xl font-bold text-[#eab308] truncate" title={formatCurrency(results.totalInterest)}>
                {formatCurrency(results.totalInterest)}
              </p>
            </div>
          </div>

          <div className="flex-1 bg-[#111111] border border-[#222] rounded-xl p-4 sm:p-6 min-h-[300px] flex flex-col">
            <h3 className="text-sm font-bold text-gray-300 mb-6">Projeção de Crescimento</h3>
            <div className="flex-1 min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#71717a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#71717a" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="label" 
                    stroke="#555" 
                    tick={{ fill: '#71717a', fontSize: 11 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    stroke="#555" 
                    tick={{ fill: '#71717a', fontSize: 11 }}
                    tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="invested" 
                    name="Valor Investido"
                    stroke="#71717a" 
                    fillOpacity={1} 
                    fill="url(#colorInvested)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    name="Valor Total"
                    stroke="#eab308" 
                    fillOpacity={1} 
                    fill="url(#colorInterest)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
