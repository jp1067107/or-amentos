import re

with open('src/components/CompoundInterestCalculator.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { formatCurrency } from '../utils';", "import { formatCurrency, formatMoneyMask, parseMoney } from '../utils';")

local_functions = """
  const formatMoneyMask = (val: string) => {
    const numericValue = val.replace(/\D/g, '');
    if (!numericValue) return '0,00';
    const amount = parseInt(numericValue, 10) / 100;
    return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
"""
content = content.replace(local_functions, "")

content = re.sub(r'type="text"(\s*)inputMode="decimal"', r'type="tel"\1inputMode="numeric"', content)
content = re.sub(r'type="text"(\s*)inputMode="numeric"', r'type="tel"\1inputMode="numeric"', content)

with open('src/components/CompoundInterestCalculator.tsx', 'w') as f:
    f.write(content)
