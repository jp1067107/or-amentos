const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const monthToInputFormat = (monthStr) => {
  if (!monthStr) return '';
  const parts = monthStr.split('/');
  if (parts.length !== 2) return '';
  const [mStr, yStr] = parts;
  const mIndex = MONTHS.findIndex(m => m.toLowerCase() === mStr.trim().toLowerCase());
  if (mIndex === -1) return '';
  const mm = (mIndex + 1).toString().padStart(2, '0');
  return `${yStr.trim()}-${mm}`;
};

const inputFormatToMonth = (inputStr) => {
  if (!inputStr) return '';
  const [yStr, mStr] = inputStr.split('-');
  if (!yStr || !mStr) return '';
  const monthName = MONTHS[parseInt(mStr, 10) - 1];
  return `${monthName}/${yStr}`;
};

console.log("Maio/2026 ->", monthToInputFormat("Maio/2026"))
console.log("2026-05 ->", inputFormatToMonth("2026-05"))

