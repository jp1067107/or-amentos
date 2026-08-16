const parseMoney = (val) => {
  let cleaned = String(val).replace(/[^\d.,]/g, '');
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

console.log(parseMoney(5331));
console.log(parseMoney("5331"));
console.log(parseMoney("5331.00"));
