import re

with open('src/components/ExpensesTab.tsx', 'r') as f:
    content = f.read()

helpers = """const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const monthToInputFormat = (monthStr: string) => {
  if (!monthStr) return '';
  const parts = monthStr.split('/');
  if (parts.length !== 2) return '';
  const [mStr, yStr] = parts;
  const mIndex = MONTHS.findIndex(m => m.toLowerCase() === mStr.trim().toLowerCase());
  if (mIndex === -1) return '';
  const mm = (mIndex + 1).toString().padStart(2, '0');
  return `${yStr.trim()}-${mm}`;
};

const inputFormatToMonth = (inputStr: string) => {
  if (!inputStr) return '';
  const [yStr, mStr] = inputStr.split('-');
  if (!yStr || !mStr) return '';
  const monthName = MONTHS[parseInt(mStr, 10) - 1];
  return `${monthName}/${yStr}`;
};

export const ExpensesTab: React.FC<ExpensesTabProps> = ({ budgetData, setBudgetData }) => {"""

content = content.replace("export const ExpensesTab: React.FC<ExpensesTabProps> = ({ budgetData, setBudgetData }) => {", helpers)

old_input = """              <input 
                type="text" 
                value={editMonth} 
                onChange={e => setEditMonth(e.target.value)}
                className="flex-1 sm:w-32 min-w-[80px] px-2 py-1 text-sm bg-[#222] text-white border border-[#333] rounded focus:outline-none focus:border-[#eab308]"
                placeholder="Mês"
              />"""

new_input = """              <input 
                type="month" 
                value={monthToInputFormat(editMonth)} 
                onChange={e => setEditMonth(inputFormatToMonth(e.target.value) || e.target.value)}
                className="flex-1 sm:w-32 min-w-[120px] px-2 py-1 text-sm bg-[#222] text-white border border-[#333] rounded focus:outline-none focus:border-[#eab308] appearance-none"
                placeholder="Mês"
              />"""

content = content.replace(old_input, new_input)

with open('src/components/ExpensesTab.tsx', 'w') as f:
    f.write(content)

