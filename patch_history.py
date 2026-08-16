import re

with open('src/components/HistoryTab.tsx', 'r') as f:
    content = f.read()

# Replace state and imports
content = content.replace("import { Trash2, History, ChevronDown } from 'lucide-react';", "import { Trash2, History, ChevronDown, AlertTriangle } from 'lucide-react';")

old_state = """export const HistoryTab: React.FC<HistoryTabProps> = ({ budgetData, setBudgetData }) => {
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRecord(prev => prev === id ? null : id);
  };"""

new_state = """export const HistoryTab: React.FC<HistoryTabProps> = ({ budgetData, setBudgetData }) => {
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRecord(prev => prev === id ? null : id);
  };"""

content = content.replace(old_state, new_state)

old_delete = """  const handleDelete = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      history: (prev.history || []).filter(record => record.id !== id)
    }));
  };"""

new_delete = """  const handleDelete = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      history: (prev.history || []).filter(record => record.id !== id)
    }));
    setDeleteConfirmId(null);
  };"""

content = content.replace(old_delete, new_delete)

old_button = """                    <button 
                      onClick={() => handleDelete(record.id)}
                      className="w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center text-[#555] transition-colors"
                      title="Excluir relatório"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>"""

new_button = """                    <button 
                      onClick={() => setDeleteConfirmId(record.id)}
                      className="w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center text-[#555] transition-colors"
                      title="Excluir relatório"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>"""

content = content.replace(old_button, new_button)

modal = """      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#333] rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Excluir Relatório</h3>
            </div>
            <p className="text-[#a1a1aa] text-sm mb-6">
              Tem certeza que deseja excluir este relatório salvo? Essa ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-[#222] transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}"""

# add modal right before the last div
content = content.replace("    </div>\n  );\n};", modal + "\n    </div>\n  );\n};")

with open('src/components/HistoryTab.tsx', 'w') as f:
    f.write(content)
