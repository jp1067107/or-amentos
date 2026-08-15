import re

with open('src/components/ExpensesTab.tsx', 'r') as f:
    content = f.read()

# Replace local parseMoney with imports
content = content.replace("import { formatCurrency } from '../utils';", "import { formatCurrency, formatMoneyMask, parseMoney } from '../utils';")

# Remove local parseMoney if exists
local_parseMoney = """  const parseMoney = (val: string | number) => {
    if (typeof val === 'number') return val;
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
  };"""
content = content.replace(local_parseMoney, "")

# Ensure editIncome has masked initial value
content = content.replace("const [editIncome, setEditIncome] = useState(budgetData.income.toString());", "const [editIncome, setEditIncome] = useState(formatMoneyMask(budgetData.income.toFixed(2)));")
# Ensure editIncome is updated properly
content = content.replace("onChange={e => setEditIncome(e.target.value)}", "onChange={e => setEditIncome(formatMoneyMask(e.target.value))}")

# Update all money inputs to type="tel" inputMode="numeric"
# Wait, some inputs are text, some are values. Let's just use regex or exact match
content = content.replace('type="text"\\n                  inputMode="decimal"\\n                  value={editIncome}', 'type="tel"\\n                  inputMode="numeric"\\n                  value={editIncome}')
content = content.replace('type="text"\\n                                inputMode="decimal"\\n                                value={editExpenseValue}', 'type="tel"\\n                                inputMode="numeric"\\n                                value={editExpenseValue}')
content = content.replace('onChange={e => setEditExpenseValue(e.target.value)}', 'onChange={e => setEditExpenseValue(formatMoneyMask(e.target.value))}')

content = content.replace('type="text"\\n                          inputMode="decimal"\\n                          placeholder="0,00"\\n                          value={newValue}', 'type="tel"\\n                          inputMode="numeric"\\n                          placeholder="0,00"\\n                          value={newValue}')
content = content.replace('onChange={e => setNewValue(e.target.value)}', 'onChange={e => setNewValue(formatMoneyMask(e.target.value))}')

# Autofill inputs
content = content.replace('type="text"\\n                                  inputMode="decimal"\\n                                  defaultValue={item.defaultVal}', 'type="tel"\\n                                  inputMode="numeric"\\n                                  defaultValue={item.defaultVal}')

content = content.replace('type="text"\\n                            inputMode="decimal"\\n                            placeholder="Valor"\\n                            value={newAutoFillValue}', 'type="tel"\\n                            inputMode="numeric"\\n                            placeholder="Valor"\\n                            value={newAutoFillValue}')
content = content.replace('onChange={e => setNewAutoFillValue(e.target.value)}', 'onChange={e => setNewAutoFillValue(formatMoneyMask(e.target.value))}')

# Update any leftover type="text" inputMode="decimal" to type="tel" inputMode="numeric" just in case.
content = content.replace('type="text"\\n                  inputMode="decimal"', 'type="tel"\\n                  inputMode="numeric"')
content = content.replace('type="text"\\n                                inputMode="decimal"', 'type="tel"\\n                                inputMode="numeric"')
content = content.replace('type="text"\\n                          inputMode="decimal"', 'type="tel"\\n                          inputMode="numeric"')
content = content.replace('type="text"\\n                                  inputMode="decimal"', 'type="tel"\\n                                  inputMode="numeric"')
content = content.replace('type="text"\\n                            inputMode="decimal"', 'type="tel"\\n                            inputMode="numeric"')

# Need to handle single line replacements if spacing varies:
content = re.sub(r'type="text"(\s*)inputMode="decimal"', r'type="tel"\1inputMode="numeric"', content)

with open('src/components/ExpensesTab.tsx', 'w') as f:
    f.write(content)
