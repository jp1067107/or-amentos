const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `<div className="px-4 py-2 border-b border-[#222] mb-1">`,
  `<div className="px-4 py-2 border-b border-[#222] mb-1">
                   <p className="text-xs text-[#a1a1aa] truncate">{user.email}</p>
                 </div>
                 <button 
                   onClick={handleSaveCurrentMonth}
                   className="w-full text-left px-4 py-2 text-sm font-medium text-[#71717a] hover:bg-[#1a1a1a] hover:text-[#eab308] transition-colors flex items-center gap-2"
                 >
                   <Save className="w-4 h-4" /> Salvar Mês Atual
                 </button>
                 <div className="hidden">`
);

content = content.replace(
  `<p className="text-xs text-[#a1a1aa] truncate">{user.email}</p>
                 </div>`,
  ``
);

content = content.replace(
  `</div>
             )}`,
  `</div>
             )}`
);

fs.writeFileSync('src/App.tsx', content);
