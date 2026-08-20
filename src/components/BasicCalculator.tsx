import React, { useState } from 'react';
import { X, Calculator as CalcIcon } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const BasicCalculator: React.FC<Props> = ({ onClose }) => {
  const [current, setCurrent] = useState('0');
  const [previous, setPrevious] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);

  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const handleNum = (num: string) => {
    if (waiting) {
      setCurrent(num);
      setWaiting(false);
    } else {
      setCurrent(current === '0' ? num : current + num);
    }
  };

  const handleDot = () => {
    if (waiting) {
      setCurrent('0.');
      setWaiting(false);
    } else if (!current.includes('.')) {
      setCurrent(current + '.');
    }
  };

  const handleOp = (op: string) => {
    if (operator && !waiting && previous) {
      const result = calculate(parseFloat(previous), parseFloat(current), operator);
      setCurrent(String(result));
      setPrevious(String(result));
    } else {
      setPrevious(current);
    }
    setOperator(op);
    setWaiting(true);
  };

  const handleEqual = () => {
    if (operator && previous) {
      const result = calculate(parseFloat(previous), parseFloat(current), operator);
      setCurrent(String(result));
      setPrevious(null);
      setOperator(null);
      setWaiting(true);
    }
  };

  const handleClear = () => {
    setCurrent('0');
    setPrevious(null);
    setOperator(null);
    setWaiting(false);
  };

  const handlePercent = () => {
    setCurrent(String(parseFloat(current) / 100));
  };

  const handleToggleSign = () => {
    setCurrent(String(parseFloat(current) * -1));
  };

  const btnClass = "h-16 rounded-2xl text-xl font-medium transition-colors flex items-center justify-center active:scale-95";
  const numClass = `${btnClass} bg-[#1a1a1a] text-white hover:bg-[#222]`;
  const opClass = `${btnClass} bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30`;
  const actionClass = `${btnClass} bg-[#333] text-white hover:bg-[#444]`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-[#222] rounded-[32px] w-full max-w-sm shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center">
              <CalcIcon className="w-4 h-4 text-[#a1a1aa]" />
            </div>
            <h2 className="text-sm font-bold text-white">Calculadora</h2>
          </div>
          <button onClick={onClose} className="p-1.5 bg-[#111] hover:bg-[#222] text-[#a1a1aa] hover:text-white rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display */}
        <div className="px-6 py-8 flex flex-col items-end justify-end space-y-2 bg-[#0a0a0a]">
          <div className="text-[#71717a] h-6 text-sm font-medium">
            {previous ? `${previous.replace('.', ',')} ${operator}` : ''}
          </div>
          <div className="text-6xl font-light text-white tracking-tight truncate max-w-full">
            {current.replace('.', ',')}
          </div>
        </div>

        {/* Keypad */}
        <div className="p-6 bg-[#111111] grid grid-cols-4 gap-3">
          <button onClick={handleClear} className={actionClass}>AC</button>
          <button onClick={handleToggleSign} className={actionClass}>+/-</button>
          <button onClick={handlePercent} className={actionClass}>%</button>
          <button onClick={() => handleOp('÷')} className={opClass}>÷</button>

          <button onClick={() => handleNum('7')} className={numClass}>7</button>
          <button onClick={() => handleNum('8')} className={numClass}>8</button>
          <button onClick={() => handleNum('9')} className={numClass}>9</button>
          <button onClick={() => handleOp('×')} className={opClass}>×</button>

          <button onClick={() => handleNum('4')} className={numClass}>4</button>
          <button onClick={() => handleNum('5')} className={numClass}>5</button>
          <button onClick={() => handleNum('6')} className={numClass}>6</button>
          <button onClick={() => handleOp('-')} className={opClass}>-</button>

          <button onClick={() => handleNum('1')} className={numClass}>1</button>
          <button onClick={() => handleNum('2')} className={numClass}>2</button>
          <button onClick={() => handleNum('3')} className={numClass}>3</button>
          <button onClick={() => handleOp('+')} className={opClass}>+</button>

          <button onClick={() => handleNum('0')} className={`${numClass} col-span-2`}>0</button>
          <button onClick={handleDot} className={numClass}>,</button>
          <button onClick={handleEqual} className={`${btnClass} bg-emerald-500 text-black hover:bg-emerald-400 font-bold`}>=</button>
        </div>

      </div>
    </div>
  );
};
