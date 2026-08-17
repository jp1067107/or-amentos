import re

with open('src/components/IncomeSimulator.tsx', 'r') as f:
    content = f.read()

# 1. Expand the modal width
content = content.replace('max-w-4xl shadow-2xl', 'max-w-5xl xl:max-w-6xl shadow-2xl')

# 2. Adjust Grid Columns
content = content.replace('lg:col-span-5', 'lg:col-span-4 xl:col-span-3')
content = content.replace('lg:col-span-7', 'lg:col-span-8 xl:col-span-9')

# 3. Adjust the result cards typography and padding to prevent overflow
content = content.replace('text-2xl font-bold', 'text-xl lg:text-lg xl:text-2xl font-bold truncate max-w-full')
content = content.replace('p-5 rounded-xl', 'p-4 xl:p-5 rounded-xl')

# 4. Fix vertical centering and potential clipping on desktop
content = content.replace('min-h-screen p-0 sm:p-4 md:p-8 flex items-center justify-center', 'min-h-screen p-0 sm:p-4 md:p-8 flex sm:items-start lg:items-center justify-center')

# 5. Fix alignment of bottom left buttons
content = content.replace('flex items-center justify-between px-2', 'flex flex-col sm:flex-row items-center justify-between px-2 gap-4 mt-2')

with open('src/components/IncomeSimulator.tsx', 'w') as f:
    f.write(content)
