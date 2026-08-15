import re

with open('src/utils.ts', 'r') as f:
    content = f.read()

new_utils = """
export const formatMoneyMask = (val: string) => {
  const numericValue = val.replace(/\D/g, '');
  if (!numericValue) return '0,00';
  const amount = parseInt(numericValue, 10) / 100;
  return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const parseMoney = (val: string | number) => {
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
};
"""

content += new_utils

with open('src/utils.ts', 'w') as f:
    f.write(content)
