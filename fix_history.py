import re

with open('src/components/HistoryTab.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Trash2 } from 'lucide-react';", "import { Trash2, History } from 'lucide-react';")

old_empty = """        <div className="flex flex-col items-center justify-center p-8 bg-[#111111] rounded-xl border border-[#222] min-h-[300px]">
          <p className="text-[#a1a1aa] text-sm text-center">Você ainda não possui relatórios salvos.</p>
          <p className="text-[#71717a] text-xs text-center mt-2">Salve o mês atual no menu de opções do topo.</p>
        </div>"""

new_empty = """        <div className="flex flex-col items-center justify-center p-8 bg-[#111111] rounded-xl border border-[#222] min-h-[300px]">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-[#333]">
            <History className="w-8 h-8 text-[#555]" />
          </div>
          <p className="text-white text-base font-bold text-center">Nenhum relatório salvo</p>
          <p className="text-[#71717a] text-sm text-center mt-2 max-w-[250px]">Salve o mês atual no menu de opções do topo para ver seu histórico aqui.</p>
        </div>"""

content = content.replace(old_empty, new_empty)

with open('src/components/HistoryTab.tsx', 'w') as f:
    f.write(content)
