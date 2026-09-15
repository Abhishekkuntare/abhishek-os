import React, { useState, useEffect } from 'react';
import { Delete, History, RotateCcw } from 'lucide-react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState<boolean>(true);
  const [history, setHistory] = useState<string[]>([]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        setOperator(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (e.key === 'Escape') {
        clearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const inputDigit = (digit: string) => {
    if (overwrite) {
      setDisplay(digit);
      setOverwrite(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (overwrite) {
      setDisplay('0.');
      setOverwrite(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setOverwrite(true);
  };

  const backspace = () => {
    if (overwrite) return;
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
      setOverwrite(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const toggleSign = () => {
    const num = parseFloat(display);
    if (isNaN(num)) return;
    setDisplay(String(-num));
  };

  const percentage = () => {
    const num = parseFloat(display);
    if (isNaN(num)) return;
    setDisplay(String(num / 100));
  };

  const setOperator = (op: string) => {
    const current = parseFloat(display);
    if (previousValue !== null && operation && !overwrite) {
      const result = computeResult(previousValue, current, operation);
      setPreviousValue(result);
      setDisplay(String(result));
    } else {
      setPreviousValue(current);
    }
    setOperation(op);
    setOverwrite(true);
  };

  const computeResult = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
      case '×':
        return a * b;
      case '/':
      case '÷':
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  };

  const calculate = () => {
    if (previousValue === null || operation === null) return;
    const current = parseFloat(display);
    const result = computeResult(previousValue, current, operation);
    const historyEntry = `${previousValue} ${operation} ${current} = ${result}`;

    setHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setOverwrite(true);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 select-none overflow-hidden font-sans p-4 space-y-3">
      {/* 1. CALCULATOR DISPLAY & EXPRESSION */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex flex-col items-end justify-end min-h-[90px] shadow-inner">
        <div className="text-xs text-slate-400 font-mono h-4">
          {previousValue !== null && operation ? `${previousValue} ${operation}` : ''}
        </div>
        <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight truncate w-full text-right">
          {display}
        </div>
      </div>

      {/* 2. NUMERIC KEYPAD (Windows 11 Layout) */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        <button
          type="button"
          onClick={percentage}
          className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors"
        >
          %
        </button>
        <button
          type="button"
          onClick={() => setDisplay('0')}
          className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors"
        >
          CE
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-red-400 font-semibold text-sm transition-colors"
        >
          C
        </button>
        <button
          type="button"
          onClick={backspace}
          className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors"
        >
          <Delete className="w-4 h-4" />
        </button>

        {/* Row 2 */}
        <button
          type="button"
          onClick={() => inputDigit('7')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => inputDigit('8')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => inputDigit('9')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => setOperator('/')}
          className={`p-3 rounded-xl font-bold text-base transition-colors ${
            operation === '/' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800/90 text-sky-400 hover:bg-slate-700'
          }`}
        >
          ÷
        </button>

        {/* Row 3 */}
        <button
          type="button"
          onClick={() => inputDigit('4')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => inputDigit('5')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => inputDigit('6')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => setOperator('*')}
          className={`p-3 rounded-xl font-bold text-base transition-colors ${
            operation === '*' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800/90 text-sky-400 hover:bg-slate-700'
          }`}
        >
          ×
        </button>

        {/* Row 4 */}
        <button
          type="button"
          onClick={() => inputDigit('1')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => inputDigit('2')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => inputDigit('3')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
        >
          3
        </button>
        <button
          type="button"
          onClick={() => setOperator('-')}
          className={`p-3 rounded-xl font-bold text-base transition-colors ${
            operation === '-' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800/90 text-sky-400 hover:bg-slate-700'
          }`}
        >
          -
        </button>

        {/* Row 5 */}
        <button
          type="button"
          onClick={toggleSign}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
        >
          ±
        </button>
        <button
          type="button"
          onClick={() => inputDigit('0')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
        >
          0
        </button>
        <button
          type="button"
          onClick={inputDecimal}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
        >
          .
        </button>
        <button
          type="button"
          onClick={() => setOperator('+')}
          className={`p-3 rounded-xl font-bold text-base transition-colors ${
            operation === '+' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800/90 text-sky-400 hover:bg-slate-700'
          }`}
        >
          +
        </button>
      </div>

      {/* Row 6: Equals */}
      <button
        type="button"
        onClick={calculate}
        className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base transition-colors shadow-lg shadow-sky-500/20"
      >
        =
      </button>

      {/* 3. RECENT CALCULATION HISTORY */}
      {history.length > 0 && (
        <div className="pt-2 border-t border-white/8 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
            <History className="w-3.5 h-3.5 text-sky-400" />
            <span>Recent History</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.slice(0, 3).map((h, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/5 font-mono">
                {h}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
