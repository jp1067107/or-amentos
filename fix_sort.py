import re

with open('src/components/HistoryTab.tsx', 'r') as f:
    content = f.read()

content = content.replace("history.sort(", "[...history].sort(")

with open('src/components/HistoryTab.tsx', 'w') as f:
    f.write(content)
