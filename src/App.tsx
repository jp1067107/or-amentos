import React, { useState, useEffect, useRef } from 'react';
import { BudgetData, HistoricalRecord } from './types';
import { DEFAULT_BUDGET } from './constants';
import { GoalsTab } from './components/GoalsTab';
import { ExpensesTab } from './components/ExpensesTab';
import { HistoryTab } from './components/HistoryTab';
import { CompoundInterestCalculator } from './components/CompoundInterestCalculator';
import { CompoundInterestCalculator } from './components/CompoundInterestCalculator';
import { auth, googleProvider, saveBudgetToFirestore, subscribeToBudget } from './firebase';
import { signInWithPopup, User } from 'firebase/auth';
import { LogOut, RotateCcw, Settings, ChevronDown, Save, Calculator, Menu } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [budgetData, setBudgetData] = useState<BudgetData>(DEFAULT_BUDGET);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'orcamento' | 'metas' | 'historico'>('orcamento');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
    };
    if (showOptionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptionsMenu]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoadingUser(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToBudget(user.uid, (data) => {
        if (data) {
          setBudgetData(prev => {
            if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
            return data;
          });
        }
        setDataLoaded(true);
      });
      return () => unsubscribe();
    } else {
      setDataLoaded(false);
      setBudgetData(DEFAULT_BUDGET);
    }
  }, [user]);

  useEffect(() => {
    if (user && dataLoaded) {
      saveBudgetToFirestore(user.uid, budgetData);
    }
  }, [budgetData, user, dataLoaded]);

  const handleSaveCurrentMonth = () => {
    const record: HistoricalRecord = {
      id: Date.now().toString(),
      month: budgetData.month,
      income: budgetData.income,
      expenses: budgetData.expenses,
      expenseItems: budgetData.expenseItems,
      timestamp: Date.now()
    };
    
    setBudgetData(prev => ({
      ...prev,
      history: [...(prev.history || []), record]
    }));
    setShowOptionsMenu(false);
    setActiveTab('historico');
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#eab308] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-[#222] rounded-xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#333]">
             <span className="text-[#eab308] text-2xl font-bold">R$</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Orçamento Pessoal</h1>
            <p className="text-[#a1a1aa] text-sm">Faça login para salvar e sincronizar seus dados na nuvem com segurança.</p>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#eab308] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#000000] text-white p-2 sm:p-4 md:p-8 font-sans selection:bg-[#eab308]/30 selection:text-[#eab308]">
      <div className="max-w-[1200px] mx-auto bg-[#0a0a0a] rounded-xl border border-[#222] shadow-2xl overflow-hidden flex flex-col min-h-[calc(100vh-16px)] sm:min-h-0">
        
        {/* Top Options Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#050505] border-b border-[#222]">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-[#1a1a1a] rounded flex items-center justify-center border border-[#333]">
                <span className="text-[#eab308] text-[10px] font-bold">R$</span>
             </div>
             <h2 className="font-bold text-sm text-white">Meu Orçamento</h2>
           </div>
           <div className="relative" ref={menuRef}>
             <button 
               onClick={() => setShowOptionsMenu(!showOptionsMenu)}
               className="p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors border border-transparent hover:border-[#333] flex items-center justify-center text-[#a1a1aa] hover:text-white"
             >
               <Menu className="w-5 h-5" />
             </button>
             
             {showOptionsMenu && (
               <div className="absolute right-0 top-full mt-2 w-64 bg-[#111111] border border-[#222] rounded-xl shadow-2xl py-2 z-50 overflow-hidden flex flex-col">
                 <div className="px-4 py-2 border-b border-[#222] mb-1">
                   <p className="text-xs text-[#a1a1aa] truncate">{user.email}</p>
                 </div>
                 <button 
                   onClick={handleSaveCurrentMonth}
                   className="w-full text-left px-5 py-3 text-base font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-[#eab308] transition-colors flex items-center gap-2"
                 >
                   <Save className="w-5 h-5" /> Salvar Mês Atual
                 </button>
                 <button 
                   onClick={() => { setShowCalculator(true); setShowOptionsMenu(false); }}
                   className="w-full text-left px-5 py-3 text-base font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-[#eab308] transition-colors flex items-center gap-2"
                 >
                   <Calculator className="w-5 h-5" /> Calc. de Juros
                 </button>
                 <button 
                   onClick={() => { setShowResetModal(true); setShowOptionsMenu(false); }}
                   className="w-full text-left px-5 py-3 text-base font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-red-400 transition-colors flex items-center gap-2"
                 >
                   <RotateCcw className="w-5 h-5" /> Resetar App
                 </button>
                 <button
                   onClick={() => { handleLogout(); setShowOptionsMenu(false); }}
                   className="w-full text-left px-5 py-3 text-base font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-white transition-colors flex items-center gap-2"
                 >
                   <LogOut className="w-5 h-5" /> Sair
                 </button>
               </div>
             )}
           </div>
        </div>

        {/* Tabs Header */}
        <header className="flex overflow-x-auto custom-scrollbar border-b border-[#222] bg-[#0a0a0a]">
            <button 
              onClick={() => setActiveTab('orcamento')}
              className={`px-4 sm:px-6 py-4 md:px-8 text-[11px] sm:text-xs md:text-sm font-bold tracking-wide uppercase border-b-2 transition-colors whitespace-nowrap flex-1 text-center ${activeTab === 'orcamento' ? 'border-[#eab308] text-[#eab308]' : 'border-transparent text-[#a1a1aa] hover:text-white'}`}
            >
              Orçamento
            </button>
            <button 
              onClick={() => setActiveTab('metas')}
              className={`px-4 sm:px-6 py-4 md:px-8 text-[11px] sm:text-xs md:text-sm font-bold tracking-wide uppercase border-b-2 transition-colors whitespace-nowrap flex-1 text-center ${activeTab === 'metas' ? 'border-[#eab308] text-[#eab308]' : 'border-transparent text-[#a1a1aa] hover:text-white'}`}
            >
              Metas
            </button>
            <button 
              onClick={() => setActiveTab('historico')}
              className={`px-4 sm:px-6 py-4 md:px-8 text-[11px] sm:text-xs md:text-sm font-bold tracking-wide uppercase border-b-2 transition-colors whitespace-nowrap flex-1 text-center ${activeTab === 'historico' ? 'border-[#eab308] text-[#eab308]' : 'border-transparent text-[#a1a1aa] hover:text-white'}`}
            >
              Histórico
            </button>
        </header>

          {activeTab === 'orcamento' ? (
            <ExpensesTab budgetData={budgetData} setBudgetData={setBudgetData} />
          ) : activeTab === 'metas' ? (
            <GoalsTab budgetData={budgetData} setBudgetData={setBudgetData} onBack={() => setActiveTab('orcamento')} />
          ) : (
            <HistoryTab budgetData={budgetData} setBudgetData={setBudgetData} />
          )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#222] rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Resetar Aplicativo</h3>
            <p className="text-[#a1a1aa] text-sm mb-6">Tem certeza que deseja apagar todos os dados e voltar ao padrão? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-3 flex-col sm:flex-row mt-6">
              <button 
                onClick={() => setShowResetModal(false)} 
                className="px-4 py-3 sm:py-2 text-sm font-bold text-[#a1a1aa] hover:text-white transition-colors bg-[#1a1a1a] sm:bg-transparent rounded-lg sm:rounded-none"
              >
                Cancelar
              </button>
              <button 
                onClick={() => { setBudgetData(DEFAULT_BUDGET); setShowResetModal(false); }} 
                className="px-4 py-3 sm:py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Sim, resetar
              </button>
            </div>
          </div>
        </div>
      )}
      {showCalculator && (
        <CompoundInterestCalculator onClose={() => setShowCalculator(false)} />
      )}
    </div>
  );
}
