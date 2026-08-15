import React, { useState } from 'react';
import { BudgetData, CategoryName } from '../types';
import { CATEGORY_INFO } from '../constants';
import { BudgetChart } from './BudgetChart';
import { SummaryTable } from './SummaryTable';
import { formatCurrency, formatMoneyMask, parseMoney } from '../utils';
import { ChevronLeft, Plus, ChevronDown, ChevronUp, Trash2, Edit2, Check } from 'lucide-react';

const parseMoney = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
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

interface ExpensesTabProps {
  budgetData: BudgetData;
  setBudgetData: React.Dispatch<React.SetStateAction<BudgetData>>;
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({ budgetData, setBudgetData }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | null>(null);
  
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  
  const [showAutoFill, setShowAutoFill] = useState(false);
  const [autoFillInputs, setAutoFillInputs] = useState<Record<string, number>>({});
  const [autoFillMasks, setAutoFillMasks] = useState<Record<string, string>>({});
  
  const [newAutoFillName, setNewAutoFillName] = useState('');
  const [newAutoFillValue, setNewAutoFillValue] = useState('');

  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editIncome, setEditIncome] = useState(formatMoneyMask(budgetData.income.toFixed(2)));
  const [editMonth, setEditMonth] = useState(budgetData.month);

  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editExpenseName, setEditExpenseName] = useState('');
  const [editExpenseValue, setEditExpenseValue] = useState('');

  const handleAddExpense = (category: CategoryName, name: string, value: number | string) => {
    let numValue = parseMoney(value);
    if (!name || numValue <= 0) return;
    
    const newItem = { id: Date.now().toString() + Math.random().toString(), name, value: numValue };

    setBudgetData(prev => ({
      ...prev,
      expenseItems: {
        ...prev.expenseItems,
        [category]: [...(prev.expenseItems[category] || []), newItem]
      },
      expenses: {
        ...prev.expenses,
        [category]: (prev.expenses[category] || 0) + numValue
      }
    }));
    
    setNewName('');
    setNewValue('');
  };

  const handleRemoveExpense = (category: CategoryName, id: string, value: number) => {
    setBudgetData(prev => ({
      ...prev,
      expenseItems: {
        ...prev.expenseItems,
        [category]: prev.expenseItems[category].filter(item => item.id !== id)
      },
      expenses: {
        ...prev.expenses,
        [category]: Math.max(0, (prev.expenses[category] || 0) - value)
      }
    }));
  };

  const handleSaveEditExpense = (category: CategoryName, id: string, oldVal: number) => {
    const parsedVal = parseMoney(editExpenseValue);
    if (!editExpenseName || parsedVal < 0) {
      setEditingExpenseId(null);
      return;
    }

    setBudgetData(prev => {
      const items = prev.expenseItems[category] || [];
      const newItems = items.map(item => item.id === id ? { ...item, name: editExpenseName, value: parsedVal } : item);
      
      const newExpenses = { ...prev.expenses };
      newExpenses[category] = (newExpenses[category] || 0) - oldVal + parsedVal;
      
      return {
        ...prev,
        expenses: newExpenses,
        expenseItems: {
          ...prev.expenseItems,
          [category]: newItems
        }
      };
    });
    setEditingExpenseId(null);
  };

  const handleAddAutoFillItem = (category: CategoryName) => {
    const val = parseFloat(newAutoFillValue);
    if (!newAutoFillName || isNaN(val) || val <= 0) return;

    const newItem = { id: Date.now().toString(), name: newAutoFillName, defaultVal: val };
    
    setBudgetData(prev => ({
      ...prev,
      autoFill: {
        ...prev.autoFill,
        [category]: [...(prev.autoFill[category] || []), newItem]
      }
    }));
    
    setNewAutoFillName('');
    setNewAutoFillValue('');
  };

  const handleRemoveAutoFillItem = (category: CategoryName, id: string) => {
    setBudgetData(prev => ({
      ...prev,
      autoFill: {
        ...prev.autoFill,
        [category]: prev.autoFill[category].filter(item => item.id !== id)
      }
    }));
  };

  const saveHeader = () => {
    setBudgetData(prev => ({
      ...prev,
      income: parseMoney(editIncome),
      month: editMonth
    }));
    setIsEditingHeader(false);
  };

  const activeInfo = selectedCategory ? CATEGORY_INFO.find(c => c.name === selectedCategory) : null;
  const currentItems = selectedCategory ? (budgetData.expenseItems[selectedCategory] || []) : [];
  const currentAutoFillItems = selectedCategory ? (budgetData.autoFill[selectedCategory] || []) : [];

  return (
    <div className="p-4 md:p-8 pb-4">
      {/* Main Title Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Visão Geral</h1>
          <p className="text-[#a1a1aa] text-sm">Controle seu orçamento doméstico com base em suas próprias metas e rendimentos.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 relative group w-full lg:w-auto mt-2 lg:mt-0">
          {isEditingHeader ? (
            <div className="flex flex-wrap items-center gap-2 bg-[#111111] p-2 rounded-lg border border-[#333] shadow-sm z-10 w-full sm:w-auto">
              <input 
                type="text" 
                value={editMonth} 
                onChange={e => setEditMonth(e.target.value)}
                className="flex-1 sm:w-32 min-w-[80px] px-2 py-1 text-sm bg-[#222] text-white border border-[#333] rounded focus:outline-none focus:border-[#eab308]"
                placeholder="Mês"
              />
              <div className="flex items-center border border-[#333] rounded bg-[#222] px-2 focus-within:border-[#eab308] flex-1 sm:w-auto min-w-[100px]">
                <span className="text-[#a1a1aa] text-sm">R$</span>
                <input 
                  type="tel" 
                  inputMode="numeric"
                  value={editIncome} 
                  onChange={e => setEditIncome(formatMoneyMask(e.target.value))}
                  className="w-full sm:w-24 px-2 py-1 text-sm bg-transparent text-white focus:outline-none"
                  placeholder="Renda"
                />
              </div>
              <button onClick={saveHeader} className="p-1.5 bg-[#eab308] text-black rounded hover:bg-[#ca9a04] flex-shrink-0">
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => {
                  setEditIncome(budgetData.income.toString());
                  setEditMonth(budgetData.month);
                  setIsEditingHeader(true);
                }}
                className="absolute -top-2 -right-2 p-1.5 bg-[#222] border border-[#333] rounded-full shadow-sm text-[#a1a1aa] hover:text-[#eab308] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
                title="Editar Mês/Renda"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="bg-[#111111] border border-[#222] rounded-lg px-4 py-2 flex items-center justify-center flex-1 sm:flex-none sm:min-w-[120px]">
                  <span className="text-[#eab308] text-sm font-bold">{budgetData.month}</span>
                </div>
                
                <div className="flex flex-col items-start sm:items-end flex-1 sm:flex-none">
                  <span className="text-[#71717a] text-[10px] uppercase tracking-wider font-bold mb-1 sm:mr-1">Renda do mês</span>
                  <div className="bg-[#111111] border border-[#222] shadow-sm rounded-lg px-4 sm:px-6 py-2 flex items-center justify-center w-full sm:w-auto">
                    <span className="text-emerald-400 text-sm sm:text-base font-bold">{formatCurrency(budgetData.income as number)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 flex flex-col h-full bg-[#111111] rounded-xl border border-[#222] shadow-sm overflow-hidden">
          {!selectedCategory ? (
            <div className="p-6">
              <h3 className="text-white text-sm font-bold mb-4">Gastos</h3>
              
              <div className="mb-8">
                <BudgetChart data={budgetData} />
              </div>

              <div className="space-y-1">
                {CATEGORY_INFO.map(info => (
                  <button 
                    key={info.name}
                    onClick={() => setSelectedCategory(info.name)}
                    className="w-full flex items-center justify-between p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: info.color }} />
                      <span className="text-gray-200 text-sm font-semibold">{info.name}</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-[#71717a] opacity-0 group-hover:opacity-100 transform rotate-180 transition-all group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-0">
              <div className="flex items-center gap-3 p-4 border-b border-[#222] bg-[#1a1a1a]">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="p-1.5 hover:bg-[#222] rounded-lg transition-colors text-[#a1a1aa] hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeInfo?.color }} />
                  <h3 className="text-white text-sm font-bold">{selectedCategory}</h3>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-[#71717a] uppercase tracking-wider">Custos Lançados</h4>
                    <span className="text-xs font-bold text-[#a1a1aa] bg-[#222] border border-[#333] px-2 py-0.5 rounded">
                      Total: {formatCurrency(budgetData.expenses[selectedCategory] || 0)}
                    </span>
                  </div>
                  
                  {currentItems.length === 0 ? (
                    <p className="text-[#71717a] text-sm italic">Nenhum custo adicionado</p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {currentItems.map((exp) => (
                        <div key={exp.id} className="bg-[#1a1a1a] p-3 rounded-lg border border-[#222] group">
                          {editingExpenseId === exp.id ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="text"
                                value={editExpenseName}
                                onChange={e => setEditExpenseName(e.target.value)}
                                className="flex-1 bg-[#0a0a0a] text-white border border-[#222] rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#eab308]"
                              />
                              <input 
                                type="tel"
                                inputMode="numeric"
                                value={editExpenseValue}
                                onChange={e => setEditExpenseValue(formatMoneyMask(e.target.value))}
                                className="w-24 bg-[#0a0a0a] text-white border border-[#222] rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#eab308]"
                              />
                              <button 
                                onClick={() => handleSaveEditExpense(selectedCategory, exp.id, exp.value)}
                                className="p-1.5 bg-[#eab308] text-black rounded hover:bg-[#ca9a04]"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-200 text-sm font-medium">{exp.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-white text-sm font-bold">{formatCurrency(exp.value)}</span>
                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => {
                                      setEditingExpenseId(exp.id);
                                      setEditExpenseName(exp.name);
                                      setEditExpenseValue(exp.value.toString());
                                    }}
                                    className="text-[#555] hover:text-[#eab308] transition-colors p-1"
                                    title="Editar"
                                  >
                                    <Edit2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleRemoveExpense(selectedCategory, exp.id, exp.value)}
                                    className="text-[#555] hover:text-red-500 transition-colors p-1"
                                    title="Remover"
                                  >
                                    <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#222]">
                  <h4 className="text-xs font-bold text-[#71717a] uppercase tracking-wider mb-3">Lançar Despesa</h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input 
                          type="text"
                          placeholder="Ex: Conta de Luz"
                          value={newName}
                          onChange={e => setNewName(e.target.value)}
                          className="w-full bg-[#0a0a0a] text-white border border-[#222] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#eab308]/50 focus:border-[#eab308]"
                        />
                      </div>
                      <div className="w-32 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] text-[10px]">R$</span>
                        <input 
                          type="tel"
                          inputMode="numeric"
                          placeholder="0,00"
                          value={newValue}
                          onChange={e => setNewValue(formatMoneyMask(e.target.value))}
                          className="w-full bg-[#0a0a0a] text-white border border-[#222] rounded-lg px-2 pl-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#eab308]/50 focus:border-[#eab308]"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddExpense(selectedCategory, newName, newValue)}
                      disabled={!newName || !newValue || parseFloat(newValue) <= 0}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-[#eab308] text-black rounded-lg text-sm font-bold hover:bg-[#ca9a04] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" /> Adicionar
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#222] bg-[#1a1a1a] -mx-6 -mb-6 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">Meus Gastos Recorrentes</h4>
                      <p className="text-[10px] text-[#a1a1aa] mt-1 max-w-[200px]">Adicione e preencha gastos fixos desta categoria.</p>
                    </div>
                    {currentAutoFillItems.length > 0 && (
                      <button 
                        onClick={() => {
                          Object.entries(autoFillInputs).forEach(([id, val]) => {
                            const item = currentAutoFillItems.find(i => i.id === id);
                            if (item && (val as number) > 0) {
                              handleAddExpense(selectedCategory, item.name, val as number);
                            }
                          });
                          currentAutoFillItems.forEach(item => {
                            if (autoFillInputs[item.id] === undefined) {
                              handleAddExpense(selectedCategory, item.name, item.defaultVal);
                            }
                          });
                          setAutoFillInputs({});
                          setShowAutoFill(false);
                        }}
                        className="bg-[#222] border border-[#333] text-[#eab308] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#333] transition-colors shadow-sm"
                      >
                        Lançar Todos
                      </button>
                    )}
                  </div>

                  <button 
                    onClick={() => setShowAutoFill(!showAutoFill)}
                    className="flex items-center gap-1 text-[#eab308] text-xs font-bold mt-3 hover:text-[#ca9a04] transition-colors"
                  >
                    {showAutoFill ? 'Ocultar gastos' : 'Gerenciar gastos recorrentes'} {showAutoFill ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {showAutoFill && (
                    <div className="mt-4 space-y-4">
                      {currentAutoFillItems.length > 0 ? (
                        <div className="space-y-3">
                          {currentAutoFillItems.map(item => (
                            <div key={item.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2 group">
                              <span className="text-gray-200 text-xs font-medium w-full sm:w-24 truncate" title={item.name}>{item.name}</span>
                              <div className="flex-1 min-w-[100px] relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#71717a] text-[10px]">R$</span>
                                <input 
                                  type="tel"
                                  inputMode="numeric"
                                  value={autoFillMasks[item.id] !== undefined ? autoFillMasks[item.id] : formatMoneyMask(item.defaultVal.toFixed(2))}
                                  onChange={(e) => {
                                    const masked = formatMoneyMask(e.target.value);
                                    setAutoFillMasks(prev => ({...prev, [item.id]: masked}));
                                    setAutoFillInputs(prev => ({...prev, [item.id]: parseMoney(masked)}));
                                  }}
                                  className="w-full bg-[#0a0a0a] text-white border border-[#222] rounded px-2 pl-7 py-1.5 text-xs focus:outline-none focus:border-[#eab308]"
                                />
                              </div>
                              <button 
                                onClick={() => handleAddExpense(selectedCategory, item.name, autoFillInputs[item.id] || item.defaultVal)}
                                className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-[#222] hover:bg-[#eab308]/20 hover:text-[#eab308] flex items-center justify-center text-[#a1a1aa] transition-colors flex-shrink-0"
                                title="Lançar"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveAutoFillItem(selectedCategory, item.id)}
                                className="w-8 h-8 sm:w-7 sm:h-7 rounded-full hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center text-[#555] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex-shrink-0"
                                title="Remover dos recorrentes"
                              >
                                <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#71717a] italic">Nenhum gasto recorrente salvo.</p>
                      )}

                      <div className="pt-3 border-t border-[#222] flex flex-wrap sm:flex-nowrap items-center gap-2">
                         <input 
                            type="text"
                            placeholder="Nome"
                            value={newAutoFillName}
                            onChange={e => setNewAutoFillName(e.target.value)}
                            className="w-full sm:flex-1 bg-[#0a0a0a] text-white border border-[#222] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#eab308]"
                          />
                          <input 
                            type="tel"
                            inputMode="numeric"
                            placeholder="Valor"
                            value={newAutoFillValue}
                            onChange={e => setNewAutoFillValue(formatMoneyMask(e.target.value))}
                            className="flex-1 sm:w-24 bg-[#0a0a0a] text-white border border-[#222] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#eab308]"
                          />
                          <button 
                            onClick={() => handleAddAutoFillItem(selectedCategory)}
                            disabled={!newAutoFillName || !newAutoFillValue}
                            className="bg-[#222] text-[#a1a1aa] px-4 py-1.5 rounded text-xs font-bold hover:bg-[#333] hover:text-white transition-colors disabled:opacity-50"
                          >
                            Salvar
                          </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-8">
          <SummaryTable data={budgetData} />
        </div>
      </div>
    </div>
  );
};
