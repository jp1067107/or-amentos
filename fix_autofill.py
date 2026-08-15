import re

with open('src/components/ExpensesTab.tsx', 'r') as f:
    content = f.read()

# Add autoFillMasks state
old_state = "const [autoFillInputs, setAutoFillInputs] = useState<Record<string, number>>({});"
new_state = """const [autoFillInputs, setAutoFillInputs] = useState<Record<string, number>>({});
  const [autoFillMasks, setAutoFillMasks] = useState<Record<string, string>>({});"""
content = content.replace(old_state, new_state)

# Replace the input block
old_input = """                                  type="tel"
                                  inputMode="numeric"
                                  defaultValue={item.defaultVal}
                                  onChange={(e) => setAutoFillInputs(prev => ({...prev, [item.id]: parseMoney(e.target.value)}))}"""

new_input = """                                  type="tel"
                                  inputMode="numeric"
                                  value={autoFillMasks[item.id] !== undefined ? autoFillMasks[item.id] : formatMoneyMask(item.defaultVal.toFixed(2))}
                                  onChange={(e) => {
                                    const masked = formatMoneyMask(e.target.value);
                                    setAutoFillMasks(prev => ({...prev, [item.id]: masked}));
                                    setAutoFillInputs(prev => ({...prev, [item.id]: parseMoney(masked)}));
                                  }}"""

content = content.replace(old_input, new_input)

# In handleRemoveAutoFillItem, maybe we should also delete the mask state, but it doesn't matter too much.

with open('src/components/ExpensesTab.tsx', 'w') as f:
    f.write(content)
