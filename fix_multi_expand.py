import re

with open('src/components/SummaryTable.tsx', 'r') as f:
    content = f.read()

# Update state
old_state = """  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleExpand = (cat: string) => {
    setExpandedCategory(prev => prev === cat ? null : cat);
  };"""

new_state = """  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleExpand = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };"""
content = content.replace(old_state, new_state)

# Update chevron
content = content.replace("expandedCategory === info.name ? 'rotate-180' : ''", "expandedCategories[info.name] ? 'rotate-180' : ''")

# Update row condition
content = content.replace("{expandedCategory === info.name && (", "{expandedCategories[info.name] && (")

with open('src/components/SummaryTable.tsx', 'w') as f:
    f.write(content)
