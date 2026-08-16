import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace("import { CompoundInterestCalculator } from './components/CompoundInterestCalculator';", 
"""import { CompoundInterestCalculator } from './components/CompoundInterestCalculator';
import { IncomeSimulator } from './components/IncomeSimulator';
import { TutorialModal } from './components/TutorialModal';""")

content = content.replace("import { LogOut, RotateCcw, Settings, ChevronDown, Save, Calculator, Menu } from 'lucide-react';",
"import { LogOut, RotateCcw, Settings, ChevronDown, Save, Calculator, Menu, HelpCircle, TrendingDown } from 'lucide-react';")

# Add state
old_state = """  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);"""
new_state = """  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);"""
content = content.replace(old_state, new_state)

# Add to menu
old_menu = """                 <button 
                   onClick={() => { setShowCalculator(true); setShowOptionsMenu(false); }}
                   className="w-full text-left px-5 py-3 text-base font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-[#eab308] transition-colors flex items-center gap-2"
                 >
                   <Calculator className="w-5 h-5" /> Calc. de Juros
                 </button>"""
new_menu = """                 <button 
                   onClick={() => { setShowCalculator(true); setShowOptionsMenu(false); }}
                   className="w-full text-left px-5 py-3 text-base font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-[#eab308] transition-colors flex items-center gap-2"
                 >
                   <Calculator className="w-5 h-5" /> Calc. de Juros
                 </button>
                 <button 
                   onClick={() => { setShowSimulator(true); setShowOptionsMenu(false); }}
                   className="w-full text-left px-5 py-3 text-base font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-red-500 transition-colors flex items-center gap-2"
                 >
                   <TrendingDown className="w-5 h-5" /> Simulador de Renda
                 </button>
                 <button 
                   onClick={() => { setShowTutorial(true); setShowOptionsMenu(false); }}
                   className="w-full text-left px-5 py-3 text-base font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-[#3b82f6] transition-colors flex items-center gap-2"
                 >
                   <HelpCircle className="w-5 h-5" /> Tutorial Rápido
                 </button>"""
content = content.replace(old_menu, new_menu)

# Add Modals at bottom
old_end = """      {showCalculator && (
        <CompoundInterestCalculator onClose={() => setShowCalculator(false)} />
      )}
    </div>
  );
}"""
new_end = """      {showCalculator && (
        <CompoundInterestCalculator onClose={() => setShowCalculator(false)} />
      )}
      {showSimulator && (
        <IncomeSimulator onClose={() => setShowSimulator(false)} />
      )}
      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}"""
content = content.replace(old_end, new_end)

with open('src/App.tsx', 'w') as f:
    f.write(content)
