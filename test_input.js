const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const inputFormatToMonth = (inputStr) => {
  if (!inputStr) return '';
  const [yStr, mStr] = inputStr.split('-');
  if (!yStr || !mStr) return '';
  const monthName = MONTHS[parseInt(mStr, 10) - 1];
  return `${monthName}/${yStr}`;
};

console.log(inputFormatToMonth("2024-10"));
console.log(inputFormatToMonth("2024-05"));
console.log(inputFormatToMonth("2026-08"));
