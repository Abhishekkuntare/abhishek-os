import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { VFSFile } from '../../types';
import { getAllVFSFiles, getVFSFile, saveVFSFile, createVFSFile } from '../../lib/vfs';
import { checkAndUnlockAchievement } from '../../lib/achievements';
import {
  Table,
  Save,
  Plus,
  Trash2,
  Bold,
  Italic,
  DollarSign,
  Percent,
  BarChart3,
  Download,
  Upload,
  FolderOpen,
  Check,
  Calculator,
} from 'lucide-react';

interface CellData {
  value: string;
  bold?: boolean;
  italic?: boolean;
  bg?: string;
  color?: string;
  format?: 'currency' | 'percent' | 'normal';
}

type SheetGrid = Record<string, CellData>; // key: e.g. "A1", "B2"

const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const ROW_COUNT = 25;

export const SheetsApp: React.FC = () => {
  const [currentFilePath, setCurrentFilePath] = useState<string>('/Documents/Portfolio_Projects.abkxlsx');
  const [workbookName, setWorkbookName] = useState<string>('Portfolio_Projects.abkxlsx');
  const [sheets, setSheets] = useState<Record<string, SheetGrid>>({
    Sheet1: {},
  });
  const [activeSheetName, setActiveSheetName] = useState<string>('Sheet1');
  const [selectedCell, setSelectedCell] = useState<string>('A1');
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const cellRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Chart modal
  const [showChartModal, setShowChartModal] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  // Load workbook from VFS
  useEffect(() => {
    loadWorkbook(currentFilePath);
  }, []);

  const loadWorkbook = async (path: string) => {
    const file = await getVFSFile(path);
    if (file) {
      setCurrentFilePath(file.path);
      setWorkbookName(file.name);
      try {
        const parsed = JSON.parse(file.content);
        if (parsed.sheets) {
          setSheets(parsed.sheets);
          const firstSheet = parsed.activeSheet || Object.keys(parsed.sheets)[0] || 'Sheet1';
          setActiveSheetName(firstSheet);
        }
      } catch (e) {
        console.warn('Workbook parse fallback:', e);
      }
      setSaveStatus('saved');
    }
  };

  const currentGrid = sheets[activeSheetName] || {};

  useEffect(() => {
    setFormulaInput(currentGrid[selectedCell]?.value || '');
  }, [activeSheetName, selectedCell]); // Keep the formula bar in sync after tab/navigation changes.

  // Safe formula evaluator without eval()
  const evaluateCellValue = (raw: string, grid: SheetGrid, visited = new Set<string>()): string => {
    if (!raw) return '';
    if (!raw.startsWith('=')) return raw;

    const formula = raw.substring(1).trim().toUpperCase();

    const resolveNumber = (key: string, visited = new Set<string>()): number | null => {
      if (visited.has(key)) return null;
      const value = grid[key]?.value?.trim() || '';
      if (!value) return null;
      const numeric = Number(value.replace(/,/g, ''));
      if (Number.isFinite(numeric)) return numeric;
      if (value.startsWith('=')) {
        visited.add(key);
        const evaluated = evaluateCellValue(value, grid, visited);
        const result = Number(evaluated.replace(/[$,% ,]/g, ''));
        return Number.isFinite(result) ? result : null;
      }
      return null;
    };

    // Helper to get numbers from a range like A1:A5 or single cell
    const getRangeValues = (rangeStr: string): number[] => {
      const [start, end] = rangeStr.split(':');
      if (!end) {
        const val = resolveNumber(start);
        return val === null ? [] : [val];
      }

      const startCol = start.charAt(0);
      const startRow = parseInt(start.substring(1), 10);
      const endCol = end.charAt(0);
      const endRow = parseInt(end.substring(1), 10);

      const nums: number[] = [];
      const colStartIdx = COLUMNS.indexOf(startCol);
      const colEndIdx = COLUMNS.indexOf(endCol);

      for (let c = colStartIdx; c <= colEndIdx; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const cellKey = `${COLUMNS[c]}${r}`;
          const v = resolveNumber(cellKey);
          if (v !== null) nums.push(v);
        }
      }
      return nums;
    };

    // Helper for non-empty text count
    const getRangeCountA = (rangeStr: string): number => {
      const [start, end] = rangeStr.split(':');
      if (!end) return grid[start]?.value ? 1 : 0;

      const startCol = start.charAt(0);
      const startRow = parseInt(start.substring(1), 10);
      const endCol = end.charAt(0);
      const endRow = parseInt(end.substring(1), 10);

      let count = 0;
      const colStartIdx = COLUMNS.indexOf(startCol);
      const colEndIdx = COLUMNS.indexOf(endCol);

      for (let c = colStartIdx; c <= colEndIdx; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const cellKey = `${COLUMNS[c]}${r}`;
          if (grid[cellKey]?.value && grid[cellKey]?.value.trim() !== '') count++;
        }
      }
      return count;
    };

    // SUM accepts both a range and comma-separated cell/range arguments.
    if (formula.startsWith('SUM(') && formula.endsWith(')')) {
      const values = formula.substring(4, formula.length - 1)
        .split(',')
        .flatMap(part => getRangeValues(part.trim()));
      const sum = values.reduce((acc, n) => acc + n, 0);
      return String(sum);
    }

    // AVERAGE
    if (formula.startsWith('AVERAGE(') && formula.endsWith(')')) {
      const range = formula.substring(8, formula.length - 1);
      const values = getRangeValues(range);
      if (values.length === 0) return '0';
      const avg = values.reduce((acc, n) => acc + n, 0) / values.length;
      return avg.toFixed(2);
    }

    // MIN
    if (formula.startsWith('MIN(') && formula.endsWith(')')) {
      const range = formula.substring(4, formula.length - 1);
      const values = getRangeValues(range);
      return values.length ? Math.min(...values).toString() : '0';
    }

    // MAX
    if (formula.startsWith('MAX(') && formula.endsWith(')')) {
      const range = formula.substring(4, formula.length - 1);
      const values = getRangeValues(range);
      return values.length ? Math.max(...values).toString() : '0';
    }

    // COUNT
    if (formula.startsWith('COUNT(') && formula.endsWith(')')) {
      const range = formula.substring(6, formula.length - 1);
      const values = getRangeValues(range);
      return values.length.toString();
    }

    // COUNTA
    if (formula.startsWith('COUNTA(') && formula.endsWith(')')) {
      const range = formula.substring(7, formula.length - 1);
      return getRangeCountA(range).toString();
    }

    // Basic Excel-style arithmetic, resolved without eval() so formulas
    // remain safe while still supporting =A1+B1*2 and parenthesised values.
    if (/^[A-Z]+\d+([+\-*/][A-Z]+\d+|[+\-*/]\d+(?:\.\d+)?|\s|\(|\)|\.)+$/.test(formula)) {
      const expression = formula.replace(/[A-Z]+\d+/g, ref => {
        const value = resolveNumber(ref);
        return value === null ? 'NaN' : String(value);
      });
      if (!expression.includes('NaN')) {
        const tokens = expression.match(/(?:\d+(?:\.\d+)?|[+\-*/()])/g) || [];
        const values: number[] = [];
        const operators: string[] = [];
        const precedence = (operator: string) => operator === '+' || operator === '-' ? 1 : 2;
        const apply = () => {
          const operator = operators.pop();
          const right = values.pop();
          const left = values.pop();
          if (!operator || left === undefined || right === undefined) return false;
          values.push(operator === '+' ? left + right : operator === '-' ? left - right : operator === '*' ? left * right : right === 0 ? NaN : left / right);
          return true;
        };
        for (const token of tokens) {
          if (/^\d/.test(token)) values.push(Number(token));
          else if (token === '(') operators.push(token);
          else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') if (!apply()) return '#VALUE!';
            operators.pop();
          } else {
            while (operators.length && operators[operators.length - 1] !== '(' && precedence(operators[operators.length - 1]) >= precedence(token)) if (!apply()) return '#VALUE!';
            operators.push(token);
          }
        }
        while (operators.length) if (!apply()) return '#VALUE!';
        return values.length === 1 && Number.isFinite(values[0]) ? String(values[0]) : '#VALUE!';
      }
    }

    // IF(A1>50, "Pass", "Fail")
    if (formula.startsWith('IF(') && formula.endsWith(')')) {
      try {
        const inside = formula.substring(3, formula.length - 1);
        const parts = inside.split(',').map(s => s.trim());
        const cond = parts[0];
        const match = cond.match(/^([A-J]\d+)\s*(>=|<=|==|>|<|=)\s*(-?\d+(?:\.\d+)?)$/);
        if (match) {
          const cellKey = match[1];
          const op = match[2];
          const targetVal = parseFloat(match[3]);
          const cellVal = parseFloat(grid[cellKey]?.value || '0');
          let pass = false;
          if (op === '>') pass = cellVal > targetVal;
          if (op === '<') pass = cellVal < targetVal;
          if (op === '>=') pass = cellVal >= targetVal;
          if (op === '<=') pass = cellVal <= targetVal;
          if (op === '==' || op === '=') pass = cellVal === targetVal;

          return pass ? parts[1].replace(/['"]/g, '') : parts[2]?.replace(/['"]/g, '') || '';
        }
      } catch {
        return '#VALUE!';
      }
    }

    return '#FORMULA?';
  };

  // Select cell handler
  const handleSelectCell = (key: string) => {
    setSelectedCell(key);
    const raw = currentGrid[key]?.value || '';
    setFormulaInput(raw);
    // Keep keyboard navigation attached to the newly selected cell. Without
    // this, Enter/Tab changes the highlight but keystrokes continue in the
    // previously focused input.
    requestAnimationFrame(() => {
      const input = cellRefs.current[key];
      input?.focus();
      input?.select();
    });
  };

  const moveSelection = (key: string, direction: 'up' | 'down' | 'left' | 'right') => {
    const col = COLUMNS.indexOf(key.match(/[A-Z]+/)?.[0] || 'A');
    const row = Number(key.match(/\d+/)?.[0] || 1);
    let nextCol = col + (direction === 'left' ? -1 : direction === 'right' ? 1 : 0);
    let nextRow = row + (direction === 'up' ? -1 : direction === 'down' ? 1 : 0);
    // Excel-style wrapping at the edge of a row/column when tabbing or
    // pressing Enter, while arrow keys remain clamped.
    if (direction === 'right' && nextCol >= COLUMNS.length) { nextCol = 0; nextRow += 1; }
    if (direction === 'left' && nextCol < 0) { nextCol = COLUMNS.length - 1; nextRow -= 1; }
    nextCol = Math.max(0, Math.min(COLUMNS.length - 1, nextCol));
    nextRow = Math.max(1, Math.min(ROW_COUNT, nextRow));
    handleSelectCell(`${COLUMNS[nextCol]}${nextRow}`);
  };

  const handleCellKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, key: string) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      moveSelection(key, event.shiftKey ? 'up' : 'down');
    } else if (event.key === 'Tab') {
      event.preventDefault();
      moveSelection(key, event.shiftKey ? 'left' : 'right');
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      if (event.currentTarget.value) {
        event.preventDefault();
        handleUpdateCell(key, '');
        setFormulaInput('');
      }
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      // Let arrows move the selection only when the caret is at an edge.
      const input = event.currentTarget;
      const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
      const atEdge = horizontal
        ? (event.key === 'ArrowLeft' ? input.selectionStart === 0 : input.selectionEnd === input.value.length)
        : true;
      if (atEdge) {
        event.preventDefault();
        moveSelection(key, event.key === 'ArrowUp' ? 'up' : event.key === 'ArrowDown' ? 'down' : event.key === 'ArrowLeft' ? 'left' : 'right');
      }
    }
  };

  // Update cell value
  const handleUpdateCell = (key: string, val: string) => {
    setSheets(prev => ({
      ...prev,
      [activeSheetName]: {
        ...prev[activeSheetName],
        [key]: {
          ...(prev[activeSheetName]?.[key] || {}),
          value: val,
        },
      },
    }));
    if (key === selectedCell) setFormulaInput(val);
    setSaveStatus('unsaved');
  };

  // Toggle cell formatting
  const handleToggleFormat = (prop: 'bold' | 'italic') => {
    const existing = currentGrid[selectedCell] || { value: '' };
    setSheets(prev => ({
      ...prev,
      [activeSheetName]: {
        ...prev[activeSheetName],
        [selectedCell]: {
          ...existing,
          [prop]: !existing[prop],
        },
      },
    }));
    setSaveStatus('unsaved');
  };

  const handleApplyNumberFormat = (formatType: 'currency' | 'percent') => {
    const existing = currentGrid[selectedCell] || { value: '' };
    setSheets(prev => ({
      ...prev,
      [activeSheetName]: {
        ...prev[activeSheetName],
        [selectedCell]: {
          ...existing,
          format: existing.format === formatType ? undefined : formatType,
        },
      },
    }));
    setSaveStatus('unsaved');
  };

  // Save workbook to VFS
  const handleSaveWorkbook = async () => {
    setSaveStatus('saving');
    const content = JSON.stringify({
      activeSheet: activeSheetName,
      sheets,
      updatedAt: Date.now(),
    });

    const file: VFSFile = {
      id: `sheet-${Date.now()}`,
      name: workbookName,
      path: currentFilePath,
      type: 'file',
      extension: 'abkxlsx',
      mimeType: 'application/json',
      size: content.length,
      updatedAt: Date.now(),
      content,
    };

    await saveVFSFile(file);
    setSaveStatus('saved');
    checkAndUnlockAchievement('sheet-analyst');
  };

  // CSV Export
  const handleExportCSV = () => {
    let csv = '';
    for (let r = 1; r <= ROW_COUNT; r++) {
      const rowVals: string[] = [];
      for (const col of COLUMNS) {
        const raw = currentGrid[`${col}${r}`]?.value || '';
        const evaluated = evaluateCellValue(raw, currentGrid);
        rowVals.push(`"${evaluated.replace(/"/g, '""')}"`);
      }
      csv += rowVals.join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workbookName.replace(/\.[^/.]+$/, '')}.csv`;
    a.click();
  };

  // Format cell display value with currency or percentage
  const getDisplayValue = (key: string): string => {
    const cell = currentGrid[key];
    if (!cell) return '';
    const raw = cell.value || '';
    const evaluated = evaluateCellValue(raw, currentGrid);

    if (cell.format === 'currency') {
      const num = parseFloat(evaluated);
      return isNaN(num) ? evaluated : `$${num.toLocaleString()}`;
    }
    if (cell.format === 'percent') {
      const num = parseFloat(evaluated);
      return isNaN(num) ? evaluated : `${num}%`;
    }
    return evaluated;
  };

  // Chart data extraction (values from column E)
  const chartValues = useMemo(() => {
    const list: { label: string; value: number }[] = [];
    for (let r = 2; r <= 10; r++) {
      const label = currentGrid[`A${r}`]?.value || `Item ${r}`;
      const rawVal = currentGrid[`E${r}`]?.value || currentGrid[`C${r}`]?.value;
      const val = parseFloat(evaluateCellValue(rawVal || '', currentGrid).replace(/,/g, ''));
      if (!isNaN(val) && val > 0) {
        list.push({ label, value: val });
      }
    }
    return list;
  }, [currentGrid]);

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Ribbon / Top Bar */}
      <header className="h-12 px-3 border-b border-white/10 bg-slate-900 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Table className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={workbookName}
              onChange={e => {
                setWorkbookName(e.target.value);
                setSaveStatus('unsaved');
              }}
              className="bg-transparent font-semibold text-xs sm:text-sm text-slate-100 hover:bg-white/5 px-2 py-1 rounded focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-56"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowChartModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-sky-400 hover:bg-sky-500/10 rounded-md transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visual Chart</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={handleSaveWorkbook}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </header>

      {/* Formatting & Formula Bar */}
      <div className="px-3 py-1.5 border-b border-white/10 bg-slate-900/70 flex items-center gap-2 text-xs shrink-0 overflow-x-auto no-scrollbar">
        {/* Formatting pills */}
        <button
          onClick={() => handleToggleFormat('bold')}
          className={`p-1.5 rounded hover:bg-white/10 ${currentGrid[selectedCell]?.bold ? 'bg-emerald-500/30 text-emerald-400' : 'text-slate-300'}`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleToggleFormat('italic')}
          className={`p-1.5 rounded hover:bg-white/10 ${currentGrid[selectedCell]?.italic ? 'bg-emerald-500/30 text-emerald-400' : 'text-slate-300'}`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        <button
          onClick={() => handleApplyNumberFormat('currency')}
          className={`p-1.5 rounded hover:bg-white/10 ${currentGrid[selectedCell]?.format === 'currency' ? 'bg-emerald-500/30 text-emerald-400' : 'text-slate-300'}`}
          title="Currency ($)"
        >
          <DollarSign className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleApplyNumberFormat('percent')}
          className={`p-1.5 rounded hover:bg-white/10 ${currentGrid[selectedCell]?.format === 'percent' ? 'bg-emerald-500/30 text-emerald-400' : 'text-slate-300'}`}
          title="Percentage (%)"
        >
          <Percent className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Selected Cell Box */}
        <div className="px-2.5 py-1 bg-slate-800 rounded font-mono font-bold text-xs text-sky-400 border border-white/10 min-w-12 text-center">
          {selectedCell}
        </div>

        <span className="text-slate-500 font-serif italic text-sm">fx</span>

        {/* Formula Bar Input */}
        <input
          type="text"
          value={formulaInput}
          onChange={e => {
            setFormulaInput(e.target.value);
            handleUpdateCell(selectedCell, e.target.value);
          }}
          placeholder="Enter value or formula like =SUM(A1:A5), =AVERAGE(B2:B8)"
          className="flex-1 bg-slate-950/80 border border-white/10 rounded px-2.5 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 overflow-auto bg-slate-950">
        <table className="border-collapse table-fixed w-full text-xs">
          <thead>
            <tr className="bg-slate-900 border-b border-white/10 sticky top-0 z-10">
              <th className="w-12 h-7 border-r border-white/10 bg-slate-900/90 text-center text-slate-500 font-mono text-[10px]">
                #
              </th>
              {COLUMNS.map(col => (
                <th
                  key={col}
                  className="w-36 h-7 border-r border-white/10 bg-slate-900/90 text-center font-bold text-slate-400 font-mono"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROW_COUNT }, (_, idx) => idx + 1).map(row => (
              <tr key={row} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="w-12 h-7 border-r border-white/10 bg-slate-900/60 text-center text-slate-500 font-mono text-[10px] select-none">
                  {row}
                </td>
                {COLUMNS.map(col => {
                  const key = `${col}${row}`;
                  const cell = currentGrid[key];
                  const isSelected = selectedCell === key;
                  const display = getDisplayValue(key);

                  return (
                    <td
                      key={key}
                      onClick={() => handleSelectCell(key)}
                      style={{
                        backgroundColor: cell?.bg || undefined,
                        color: cell?.color || undefined,
                      }}
                      className={`h-7 border-r border-white/10 px-2 truncate transition-colors cursor-cell ${
                        cell?.bold ? 'font-bold' : ''
                      } ${cell?.italic ? 'italic' : ''} ${
                        isSelected
                          ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-500/10'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <input
                        aria-label={`${key} cell`}
                        ref={input => { cellRefs.current[key] = input; }}
                        value={isSelected ? (cell?.value || '') : display}
                        onFocus={() => handleSelectCell(key)}
                        onChange={event => handleUpdateCell(key, event.target.value)}
                        onKeyDown={event => handleCellKeyDown(event, key)}
                        onClick={event => event.stopPropagation()}
                        className="w-full h-full bg-transparent outline-none border-0 p-0 text-inherit font-inherit"
                        style={{ caretColor: 'var(--os-accent, #38bdf8)' }}
                        title={cell?.value ? display : undefined}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Sheet Tabs Bar */}
      <footer className="h-8 px-2 border-t border-white/10 bg-slate-900 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-1">
          {Object.keys(sheets).map(sName => (
            <button
              key={sName}
              onClick={() => setActiveSheetName(sName)}
              className={`px-3 py-1 rounded-t text-[11px] font-medium transition-colors ${
                activeSheetName === sName
                  ? 'bg-slate-950 text-emerald-400 border-t-2 border-emerald-500 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {sName}
            </button>
          ))}
          <button
            onClick={() => {
              const newName = `Sheet${Object.keys(sheets).length + 1}`;
              setSheets(prev => ({ ...prev, [newName]: {} }));
              setActiveSheetName(newName);
            }}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded"
            title="Add New Sheet"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 pr-2 text-[11px] text-slate-400 font-mono">
          <span>Formula Engine Active</span>
          {saveStatus === 'saved' && (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Saved</span>
            </span>
          )}
        </div>
      </footer>

      {/* Chart Visualization Modal */}
      {showChartModal && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-100">Dynamic Workbook Chart</h3>
              </div>
              <button
                onClick={() => setShowChartModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            {/* Chart SVG Visualization */}
            <div className="h-64 bg-slate-950 rounded-xl p-4 flex items-end justify-around gap-2 border border-white/5">
              {chartValues.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs">
                  No numerical data detected in score columns.
                </div>
              ) : (
                chartValues.map((item, i) => {
                  const maxVal = Math.max(...chartValues.map(v => v.value), 100);
                  const heightPercent = Math.min(100, Math.round((item.value / maxVal) * 100));

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">{item.value}</span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-emerald-600 to-sky-400 transition-all duration-500"
                      />
                      <span className="text-[10px] text-slate-400 truncate max-w-14 text-center">
                        {item.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowChartModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Close Chart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
