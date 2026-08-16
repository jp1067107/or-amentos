import re

with open('src/components/ExpensesTab.tsx', 'r') as f:
    content = f.read()

old_func = """const parseMoney = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  let cleaned = val.toString().replace(/[^\d.,]/g, '');
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

if old_func in content:
    content = content.replace(old_func, "")
else:
    # try regex
    content = re.sub(r'const parseMoney = .*?return isNaN\(result\) \? 0 : result;\n};\n', '', content, flags=re.DOTALL)

with open('src/components/ExpensesTab.tsx', 'w') as f:
    f.write(content)

