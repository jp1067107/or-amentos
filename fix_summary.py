import re

with open('src/components/SummaryTable.tsx', 'r') as f:
    content = f.read()

# Add useState import
content = content.replace("import React from 'react';", "import React, { useState } from 'react';\nimport { ChevronDown } from 'lucide-react';")

# Add state and Chevron to component
old_sig = """export const SummaryTable: React.FC<SummaryTableProps> = ({ data }) => {
  const totalGasto = Object.values(data.expenses).reduce((acc, val) => (acc as number) + (val as number), 0) as number;"""

new_sig = """export const SummaryTable: React.FC<SummaryTableProps> = ({ data }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleExpand = (cat: string) => {
    setExpandedCategory(prev => prev === cat ? null : cat);
  };

  const totalGasto = Object.values(data.expenses).reduce((acc, val) => (acc as number) + (val as number), 0) as number;"""

content = content.replace(old_sig, new_sig)

old_row = """              return (
                <tr key={info.name} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="py-3 pr-4 whitespace-nowrap text-gray-200">{info.name}</td>"""

new_row = """              return (
                <React.Fragment key={info.name}>
                <tr 
                  onClick={() => toggleExpand(info.name)}
                  className="hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                >
                  <td className="py-3 pr-4 whitespace-nowrap text-gray-200 flex items-center gap-2">
                    <ChevronDown className={`w-4 h-4 text-[#71717a] group-hover:text-white transition-transform ${expandedCategory === info.name ? 'rotate-180' : ''}`} />
                    {info.name}
                  </td>"""
content = content.replace(old_row, new_row)

old_end_row = """                  <td className="py-3 whitespace-nowrap text-right text-[#a1a1aa]">{totalPercentage.toFixed(2)}%</td>
                </tr>
              );"""

new_end_row = """                  <td className="py-3 whitespace-nowrap text-right text-[#a1a1aa]">{totalPercentage.toFixed(2)}%</td>
                </tr>
                {expandedCategory === info.name && (
                  <tr className="bg-[#151515]">
                    <td colSpan={5} className="py-0">
                      <div className="px-8 py-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col gap-2">
                          {(data.expenseItems[info.name] || []).length === 0 ? (
                            <div className="text-xs text-[#71717a] italic py-1">Nenhum item registrado nesta categoria.</div>
                          ) : (
                            (data.expenseItems[info.name] || []).map(item => (
                              <div key={item.id} className="flex justify-between items-center text-xs py-1 border-b border-[#222] last:border-0">
                                <span className="text-[#a1a1aa] truncate mr-2 flex-1">{item.name}</span>
                                <span className="text-gray-300 font-medium">{formatCurrency(item.value)}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                </React.Fragment>
              );"""
content = content.replace(old_end_row, new_end_row)

with open('src/components/SummaryTable.tsx', 'w') as f:
    f.write(content)
