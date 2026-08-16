import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Bem-vindo ao Meu Orçamento!",
      content: "Este aplicativo ajuda você a controlar seu orçamento doméstico usando o método de distribuição percentual. Vamos fazer um tour rápido de como usar.",
      icon: "🎉"
    },
    {
      title: "1. Defina sua Renda",
      content: "Na aba 'Orçamento', clique no lápis ao lado do Mês/Renda no topo para definir seu rendimento líquido do mês.",
      icon: "💰"
    },
    {
      title: "2. Adicione Despesas",
      content: "Ainda na aba 'Orçamento', adicione suas despesas dentro de cada categoria. O app fará as contas automaticamente para você e mostrará o resumo.",
      icon: "📝"
    },
    {
      title: "3. Ajuste suas Metas",
      content: "Na aba 'Metas', você pode definir qual porcentagem da sua renda deve ir para cada categoria (o total deve ser 100%). O resumo indicará se você ultrapassou seu objetivo.",
      icon: "🎯"
    },
    {
      title: "4. Salve seu Histórico",
      content: "Terminou o mês? Abra o menu de opções no canto superior direito e clique em 'Salvar Mês Atual'. Ele ficará registrado na aba 'Histórico'.",
      icon: "💾"
    },
    {
      title: "5. Sincronização em Nuvem",
      content: "Faça login com o Google para que seus dados fiquem salvos em tempo real na nuvem. Você poderá acessar seu orçamento de qualquer dispositivo!",
      icon: "☁️"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] border border-[#222] rounded-xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-[#222]">
          <h3 className="font-bold text-white">Tutorial Rápido</h3>
          <button onClick={onClose} className="p-1 text-[#a1a1aa] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center text-center min-h-[220px] justify-center">
          <div className="text-4xl mb-4">{steps[step].icon}</div>
          <h4 className="text-lg font-bold text-white mb-2">{steps[step].title}</h4>
          <p className="text-[#a1a1aa] text-sm leading-relaxed">
            {steps[step].content}
          </p>
        </div>

        <div className="p-4 border-t border-[#222] flex items-center justify-between bg-[#0a0a0a]">
          <button 
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="p-2 text-[#a1a1aa] hover:text-white disabled:opacity-30 disabled:hover:text-[#a1a1aa] transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-[#eab308]' : 'bg-[#333]'}`} />
            ))}
          </div>

          {step < steps.length - 1 ? (
            <button 
              onClick={() => setStep(prev => Math.min(steps.length - 1, prev + 1))}
              className="p-2 text-[#eab308] hover:text-[#ca9a04] transition-colors flex items-center gap-1 text-sm font-bold"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="p-2 text-green-400 hover:text-green-500 transition-colors flex items-center gap-1 text-sm font-bold"
            >
              Concluir <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
