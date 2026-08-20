import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { TutorialModal } from './components/TutorialModal';",
    "import { TutorialModal } from './components/TutorialModal';\nimport { BasicCalculator } from './components/BasicCalculator';"
)
content = content.replace(
    "import { LogOut, RotateCcw, Settings, ChevronDown, Save, Calculator, Menu, HelpCircle, TrendingDown } from 'lucide-react';",
    "import { LogOut, RotateCcw, Settings, ChevronDown, Save, Calculator, Menu, HelpCircle, TrendingDown, Percent, PlusSquare } from 'lucide-react';"
)

# 2. State
content = content.replace(
    "const [showTutorial, setShowTutorial] = useState(false);",
    "const [showTutorial, setShowTutorial] = useState(false);\n  const [showBasicCalculator, setShowBasicCalculator] = useState(false);"
)

# 3. Menu items
# Replace Calculator with Percent for Calc. de Juros, and add new Basic Calculator menu item above it
old_menu = """                 <button 
                   onClick={() => { setShowCalculator(true); setShowOptionsMenu(false); }}
                   className="w-full text-left px-5 py-3 text-base font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-[#eab308] transition-colors flex items-center gap-2"
                 >
                   <Calculator className="w-5 h-5" /> Calc. de Juros
                 </button>"""
new_menu = """                 <button 
                   onClick={() => { setShowBasicCalculator(true); setShowOptionsMenu(false); }}
                   className="w-full text-left px-5 py-3 text-base font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-white transition-colors flex items-center gap-2"
                 >
                   <Calculator className="w-5 h-5" /> Calculadora Comum
                 </button>
                 <button 
                   onClick={() => { setShowCalculator(true); setShowOptionsMenu(false); }}
                   className="w-full text-left px-5 py-3 text-base font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-[#eab308] transition-colors flex items-center gap-2"
                 >
                   <Percent className="w-5 h-5" /> Calc. de Juros
                 </button>"""
content = content.replace(old_menu, new_menu)

# 4. End Modals
old_end = """      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}"""
new_end = """      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}
      {showBasicCalculator && (
        <BasicCalculator onClose={() => setShowBasicCalculator(false)} />
      )}"""
content = content.replace(old_end, new_end)

with open('src/App.tsx', 'w') as f:
    f.write(content)
