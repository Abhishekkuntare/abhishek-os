import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOS } from '../../context/OSContext';
import { VFSFile } from '../../types';
import { getAllVFSFiles, getVFSFile, saveVFSFile, createVFSFile } from '../../lib/vfs';
import { checkAndUnlockAchievement } from '../../lib/achievements';
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Check, ChevronDown,
  Code2, Copy, FilePlus2, FileText, FolderOpen, Highlighter, Image as ImageIcon,
  IndentDecrease, IndentIncrease, Italic, Link2, List, ListOrdered, Maximize2,
  Minimize2, Minus, MoreHorizontal, Paintbrush, Printer, Quote, Redo2, Replace,
  Save, Search, TextSelect, Strikethrough, Table2, Type, Underline, Undo2, ZoomIn,
  ZoomOut, Scissors, Clipboard, Subscript, Superscript, RemoveFormatting, Clock,
  Columns3, CheckCircle2, X
} from 'lucide-react';

type SaveStatus = 'saved' | 'saving' | 'unsaved';
type BlockTag = 'P' | 'H1' | 'H2' | 'H3' | 'BLOCKQUOTE' | 'PRE';

type ActiveState = {
  bold: boolean; italic: boolean; underline: boolean; strike: boolean;
  ul: boolean; ol: boolean; left: boolean; center: boolean; right: boolean; justify: boolean;
  sub: boolean; super: boolean;
};

const DEFAULT_CONTENT = '<h1>Untitled Document</h1><p>Start typing your thoughts, notes, or technical specifications here...</p>';

const FONTS = [
  ['Inter', 'Inter, Arial, sans-serif'],
  ['Arial', 'Arial, sans-serif'],
  ['Calibri', 'Calibri, Arial, sans-serif'],
  ['Cambria', 'Cambria, Georgia, serif'],
  ['Georgia', 'Georgia, serif'],
  ['Times New Roman', '"Times New Roman", serif'],
  ['Courier New', '"Courier New", monospace'],
  ['Verdana', 'Verdana, sans-serif'],
] as const;

const SIZES = [
  ['8', '1'], ['10', '2'], ['12', '3'], ['14', '4'], ['16', '5'], ['18', '6'],
  ['20', '7'], ['24', '8'], ['28', '9'], ['32', '10'], ['36', '11'], ['40', '12'], ['48', '13'],
] as const;

const EMPTY_ACTIVE: ActiveState = {
  bold: false, italic: false, underline: false, strike: false,
  ul: false, ol: false, left: false, center: false, right: false, justify: false,
  sub: false, super: false,
};

export const WriterApp: React.FC = () => {
  const { playSystemSound } = useOS();
  const rootRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const [morePos, setMorePos] = useState({ top: 0, right: 12 });

  const [currentFilePath, setCurrentFilePath] = useState('/Documents/Abhishek_Profile.abkdoc');
  const [docTitle, setDocTitle] = useState('Abhishek_Profile.abkdoc');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSavedTime, setLastSavedTime] = useState('Just now');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [block, setBlock] = useState<BlockTag>('P');
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [docs, setDocs] = useState<VFSFile[]>([]);
  const [findOpen, setFindOpen] = useState(false);
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [textColor, setTextColor] = useState('#e5e7eb');
  const [highlight, setHighlight] = useState('#facc15');
  const [moreOpen, setMoreOpen] = useState(false);
  const [font, setFont] = useState(FONTS[0][1]);
  const [fontSize, setFontSize] = useState('5');
  const [active, setActive] = useState<ActiveState>(EMPTY_ACTIVE);
  const [statusMessage, setStatusMessage] = useState('Ready');

  const markDirty = useCallback(() => setSaveStatus('unsaved'), []);

  const updateStats = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const text = editor.innerText || '';
    const clean = text.replace(/\u00a0/g, ' ').trim();
    setWordCount(clean ? clean.split(/\s+/).length : 0);
    setCharCount(text.length);
    const height = editor.scrollHeight;
    setPageCount(Math.max(1, Math.ceil(height / 980)));
  }, []);

  const insideEditor = useCallback((range: Range | null) => {
    const editor = editorRef.current;
    return !!editor && !!range && editor.contains(range.commonAncestorContainer);
  }, []);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (insideEditor(range)) savedRange.current = range.cloneRange();
  }, [insideEditor]);

  const restoreSelection = useCallback(() => {
    const editor = editorRef.current;
    const range = savedRange.current;
    if (!editor) return false;
    try {
      editor.focus({ preventScroll: true });
      if (range && editor.contains(range.commonAncestorContainer)) {
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  const getCurrentBlock = useCallback((): BlockTag => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return 'P';
    let node: Node | null = sel.getRangeAt(0).startContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    while (node && node !== editorRef.current) {
      const tag = (node as HTMLElement).tagName?.toUpperCase();
      if (['P', 'H1', 'H2', 'H3', 'BLOCKQUOTE', 'PRE'].includes(tag)) return tag as BlockTag;
      node = node.parentNode;
    }
    return 'P';
  }, []);

  const syncToolbar = useCallback(() => {
    const editor = editorRef.current;
    const sel = window.getSelection();
    if (!editor || !sel || !sel.rangeCount || !insideEditor(sel.getRangeAt(0))) return;
    try {
      setActive({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strike: document.queryCommandState('strikeThrough'),
        ul: document.queryCommandState('insertUnorderedList'),
        ol: document.queryCommandState('insertOrderedList'),
        left: document.queryCommandState('justifyLeft'),
        center: document.queryCommandState('justifyCenter'),
        right: document.queryCommandState('justifyRight'),
        justify: document.queryCommandState('justifyFull'),
        sub: document.queryCommandState('subscript'),
        super: document.queryCommandState('superscript'),
      });
      setBlock(getCurrentBlock());
      const fs = document.queryCommandValue('fontSize');
      if (fs && SIZES.some(([, value]) => value === fs)) setFontSize(fs);
      const family = document.queryCommandValue('fontName');
      if (family) {
        const normalized = family.replace(/['"]/g, '').toLowerCase();
        const found = FONTS.find(([, value]) => value.replace(/['"]/g, '').toLowerCase().split(',')[0] === normalized.split(',')[0]);
        if (found) setFont(found[1]);
      }
    } catch {}
  }, [getCurrentBlock, insideEditor]);

  useEffect(() => {
    const onSelection = () => {
      saveSelection();
      syncToolbar();
    };
    document.addEventListener('selectionchange', onSelection);
    return () => document.removeEventListener('selectionchange', onSelection);
  }, [saveSelection, syncToolbar]);

  const afterEdit = useCallback(() => {
    saveSelection();
    syncToolbar();
    updateStats();
    markDirty();
  }, [markDirty, saveSelection, syncToolbar, updateStats]);

  const command = useCallback((name: string, value?: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    restoreSelection();
    try {
      document.execCommand(name, false, value);
      setStatusMessage(name === 'undo' ? 'Undo' : name === 'redo' ? 'Redo' : 'Formatting applied');
    } catch (error) {
      console.warn(`Writer command ${name} failed`, error);
    }
    afterEdit();
  }, [afterEdit, restoreSelection]);

  const blockCommand = useCallback((tag: BlockTag) => {
    const editor = editorRef.current;
    if (!editor) return;
    restoreSelection();
    editor.focus({ preventScroll: true });
    const value = tag.toLowerCase();
    try {
      document.execCommand('formatBlock', false, value);
    } catch {
      try { document.execCommand('formatBlock', false, `<${value}>`); } catch {}
    }
    setBlock(tag);
    setStatusMessage(tag === 'P' ? 'Paragraph' : `${tag} heading`);
    afterEdit();
  }, [afterEdit, restoreSelection]);

  const insertHTML = useCallback((html: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    restoreSelection();
    editor.focus({ preventScroll: true });
    try {
      document.execCommand('insertHTML', false, html);
      setStatusMessage('Inserted');
    } catch (error) {
      console.warn(error);
    }
    afterEdit();
  }, [afterEdit, restoreSelection]);

  const insertText = useCallback((text: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    restoreSelection();
    editor.focus({ preventScroll: true });
    try { document.execCommand('insertText', false, text); } catch {}
    afterEdit();
  }, [afterEdit, restoreSelection]);

  const save = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;
    setSaveStatus('saving');
    try {
      const structured = JSON.stringify({
        title: docTitle,
        author: 'Abhishek Kuntare',
        updatedAt: Date.now(),
        content: editor.innerHTML,
      });
      const file: VFSFile = {
        id: `doc-${Date.now()}`,
        name: docTitle.endsWith('.abkdoc') ? docTitle : `${docTitle}.abkdoc`,
        path: currentFilePath,
        type: 'file',
        extension: 'abkdoc',
        mimeType: 'application/json',
        size: structured.length,
        updatedAt: Date.now(),
        content: structured,
      };
      await saveVFSFile(file);
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setStatusMessage('Document saved');
      checkAndUnlockAchievement('word-architect');
      try { playSystemSound?.('success'); } catch {}
    } catch (error) {
      console.error(error);
      setSaveStatus('unsaved');
      setStatusMessage('Save failed');
    }
  }, [currentFilePath, docTitle, playSystemSound]);

  useEffect(() => {
    if (saveStatus !== 'unsaved') return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(save, 1800);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [saveStatus, save]);

  const load = useCallback(async (path: string) => {
    const file = await getVFSFile(path);
    const editor = editorRef.current;
    if (!editor) return;
    if (!file) {
      editor.innerHTML = DEFAULT_CONTENT;
      setCurrentFilePath(path);
      setDocTitle(path.split('/').pop() || 'Untitled.abkdoc');
      setSaveStatus('saved');
      updateStats();
      requestAnimationFrame(syncToolbar);
      return;
    }
    let html = file.content;
    let title = file.name;
    try {
      const parsed = JSON.parse(file.content);
      html = parsed.content || file.content;
      title = parsed.title || file.name;
    } catch {}
    editor.innerHTML = html || DEFAULT_CONTENT;
    setCurrentFilePath(file.path);
    setDocTitle(title);
    setSaveStatus('saved');
    setLastSavedTime('Loaded');
    savedRange.current = null;
    updateStats();
    requestAnimationFrame(syncToolbar);
  }, [syncToolbar, updateStats]);

  useEffect(() => {
    try { document.execCommand('styleWithCSS', false, 'true'); } catch {}
    load(currentFilePath);
  }, []); // initial load only

  const newDoc = useCallback(async () => {
    const name = `Document_${Date.now().toString().slice(-4)}.abkdoc`;
    const path = `/Documents/${name}`;
    if (editorRef.current) editorRef.current.innerHTML = DEFAULT_CONTENT;
    setDocTitle(name);
    setCurrentFilePath(path);
    setSaveStatus('unsaved');
    setLastSavedTime('Not saved');
    savedRange.current = null;
    updateStats();
    setStatusMessage('New document');
    try {
      await createVFSFile('/Documents', name, JSON.stringify({ title: name, content: DEFAULT_CONTENT }), 'abkdoc');
    } catch {}
    requestAnimationFrame(syncToolbar);
  }, [syncToolbar, updateStats]);

  const openDocs = useCallback(async () => {
    const all = await getAllVFSFiles();
    setDocs(all.filter(f => !f.deletedAt && ['abkdoc', 'txt', 'md'].includes(f.extension || '')));
    setOpenModal(true);
  }, []);

  const replaceAll = useCallback(() => {
    if (!find || !editorRef.current) return;
    const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let node = walker.nextNode();
    while (node) { nodes.push(node as Text); node = walker.nextNode(); }
    let count = 0;
    nodes.forEach(textNode => {
      const value = textNode.nodeValue || '';
      if (value.includes(find)) {
        count += value.split(find).length - 1;
        textNode.nodeValue = value.split(find).join(replace);
      }
    });
    setStatusMessage(`${count} replacement${count === 1 ? '' : 's'}`);
    updateStats();
    markDirty();
  }, [find, replace, markDirty, updateStats]);

  const findNext = useCallback(() => {
    if (!find || !editorRef.current) return;
    const selection = window.getSelection();
    const text = editorRef.current.innerText || '';
    const start = selection?.focusOffset || 0;
    const index = text.toLowerCase().indexOf(find.toLowerCase(), start);
    if (index >= 0) {
      setStatusMessage(`Found at character ${index + 1}`);
    } else {
      setStatusMessage('No match found');
    }
  }, [find]);

  const insertLink = useCallback(() => {
    const url = window.prompt('Enter URL', 'https://');
    if (url) command('createLink', url);
  }, [command]);

  const insertImage = useCallback(() => {
    const url = window.prompt('Enter image URL', 'https://');
    if (url) insertHTML(`<img class="writer-image" src="${url.replace(/"/g, '&quot;')}" alt="Inserted image" /><p><br></p>`);
  }, [insertHTML]);

  const insertTable = useCallback(() => {
    insertHTML('<table><thead><tr><th>Column 1</th><th>Column 2</th><th>Column 3</th></tr></thead><tbody><tr><td>Item</td><td>Status</td><td>Details</td></tr><tr><td>Example</td><td>Active</td><td>Update this content</td></tr></tbody></table><p><br></p>');
  }, [insertHTML]);

  const insertDateTime = useCallback(() => {
    insertText(new Date().toLocaleString());
  }, [insertText]);

  const insertPageBreak = useCallback(() => {
    insertHTML('<div class="writer-page-break"></div><p><br></p>');
  }, [insertHTML]);

  const copy = useCallback(() => command('copy'), [command]);
  const cut = useCallback(() => command('cut'), [command]);
  const pastePlain = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) insertText(text);
    } catch {
      setStatusMessage('Clipboard permission required');
    }
  }, [insertText]);

  const updateMorePosition = useCallback(() => {
    const button = moreButtonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setMorePos({ top: Math.min(window.innerHeight - 16, rect.bottom + 8), right: Math.max(12, window.innerWidth - rect.right) });
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    updateMorePosition();
    const handler = () => updateMorePosition();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [moreOpen, updateMorePosition]);

  const toolbarButton = (icon: React.ReactNode, title: string, action: () => void, isActive = false, disabled = false) => (
    <button
      type="button"
      className={`w-btn ${isActive ? 'active' : ''}`}
      title={title}
      disabled={disabled}
      onMouseDown={e => { e.preventDefault(); saveSelection(); }}
      onClick={action}
    >{icon}</button>
  );

  const headingButton = (tag: BlockTag, label: string, title: string) => (
    <button
      type="button"
      className={`w-btn heading ${block === tag ? 'active' : ''}`}
      title={title}
      onMouseDown={e => { e.preventDefault(); saveSelection(); }}
      onClick={() => blockCommand(tag)}
    >{label}</button>
  );

  const zoomStyle = useMemo(() => ({
    width: `${100 / (zoom / 100)}%`,
    minHeight: `${1060 / (zoom / 100)}px`,
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'top center',
  }), [zoom]);

  return (
    <div ref={rootRef} className={`writer ${fullscreen ? 'fullscreen' : ''}`}>
      <style>{`
        *{box-sizing:border-box}
        .writer{--bg:#07101f;--panel:#0b1526;--panel2:#101c31;--panel3:#14223b;--line:rgba(255,255,255,.09);--line2:rgba(255,255,255,.14);--text:#e8edf6;--muted:#8290a7;--blue:#3b82f6;--blue2:#60a5fa;width:100%;height:100%;min-height:0;display:flex;flex-direction:column;overflow:hidden;color:var(--text);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;background:radial-gradient(circle at 15% -10%,rgba(59,130,246,.16),transparent 32%),radial-gradient(circle at 90% 10%,rgba(99,102,241,.09),transparent 30%),linear-gradient(180deg,#071120,#030914);animation:writerFade .28s ease}
        .writer.fullscreen{position:fixed;inset:0;z-index:99999}
        @keyframes writerFade{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
        @keyframes pop{from{opacity:0;transform:translateY(-6px) scale(.97)}to{opacity:1;transform:none}}
        @keyframes pulseSave{0%,100%{opacity:1}50%{opacity:.45}}
        .w-top{height:66px;min-height:66px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 12px;border-bottom:1px solid var(--line);background:rgba(9,18,33,.94);backdrop-filter:blur(24px);position:relative;z-index:50}
        .w-brand{display:flex;align-items:center;gap:10px;min-width:0}.w-logo{width:39px;height:39px;border-radius:12px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#6366f1,#2563eb);box-shadow:0 10px 30px rgba(37,99,235,.28);flex:none}.w-title{min-width:0}.w-title input{display:block;width:min(360px,34vw);padding:4px 7px;border:1px solid transparent;border-radius:7px;outline:none;color:#f8fafc;background:transparent;font-weight:750;font-size:13px}.w-title input:hover,.w-title input:focus{background:rgba(255,255,255,.045);border-color:var(--line2)}.w-path{max-width:440px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#64748b;font:9px ui-monospace,SFMono-Regular,Consolas,monospace;margin-top:2px}
        .w-actions{display:flex;gap:5px;align-items:center;flex:none}.w-top-btn{height:35px;padding:0 11px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid transparent;border-radius:9px;color:#cbd5e1;background:transparent;font-size:11px;font-weight:650;cursor:pointer;transition:transform .16s ease,background .16s ease,border-color .16s ease,box-shadow .16s ease}.w-top-btn:hover{background:rgba(255,255,255,.07);border-color:var(--line2);transform:translateY(-1px)}.w-top-btn:active{transform:translateY(0) scale(.98)}.w-top-btn.primary{color:#fff;background:linear-gradient(135deg,#2563eb,#4f46e5);box-shadow:0 8px 25px rgba(37,99,235,.25)}
        .w-toolbar-shell{position:relative;z-index:45;box-shadow:0 8px 25px rgba(0,0,0,.12)}.w-toolbar{height:58px;min-height:58px;display:flex;align-items:center;gap:4px;padding:7px 10px;border-bottom:1px solid var(--line);background:rgba(9,18,33,.95);backdrop-filter:blur(22px);overflow-x:auto;overflow-y:hidden;scrollbar-width:thin}.w-toolbar::-webkit-scrollbar{height:4px}.w-toolbar::-webkit-scrollbar-thumb{background:rgba(148,163,184,.24);border-radius:20px}.w-group{display:flex;align-items:center;gap:3px;flex:none}.w-sep{height:29px;width:1px;background:var(--line);margin:0 5px;flex:none}
        .w-btn{height:35px;min-width:35px;padding:0 8px;display:inline-flex;align-items:center;justify-content:center;border:1px solid transparent;border-radius:8px;color:#cbd5e1;background:transparent;cursor:pointer;transition:background .16s ease,color .16s ease,border-color .16s ease,transform .16s ease,box-shadow .16s ease;flex:none}.w-btn:hover{background:rgba(255,255,255,.075);color:#fff;border-color:var(--line2);transform:translateY(-1px)}.w-btn:active{transform:scale(.96)}.w-btn.active{background:linear-gradient(180deg,rgba(59,130,246,.29),rgba(37,99,235,.18));border-color:rgba(96,165,250,.34);color:#dbeafe;box-shadow:inset 0 0 0 1px rgba(59,130,246,.07),0 4px 14px rgba(37,99,235,.08)}.w-btn:disabled{opacity:.35;cursor:not-allowed}.w-btn.heading{min-width:39px;font-size:11px;font-weight:800}.w-select{height:35px;padding:0 27px 0 10px;border:1px solid var(--line);border-radius:8px;outline:none;color:#d5dce8;background:#0a1527;font-size:11px;cursor:pointer;flex:none;transition:.16s}.w-select:hover,.w-select:focus{border-color:rgba(96,165,250,.42);background:#0d1930}.w-select option{background:#0b1526;color:#e5e7eb}
        .w-color{position:relative;width:35px;height:35px;display:grid;place-items:center;border-radius:8px;cursor:pointer;flex:none;transition:.16s}.w-color:hover{background:rgba(255,255,255,.075)}.w-color input{position:absolute;inset:0;opacity:0;cursor:pointer}.w-swatch{width:18px;height:18px;border-radius:5px;border:1px solid rgba(255,255,255,.32);box-shadow:0 2px 8px rgba(0,0,0,.3)}
        .w-floating-menu{position:fixed;z-index:100000;width:245px;padding:7px;border:1px solid rgba(255,255,255,.15);border-radius:14px;background:rgba(12,22,39,.985);backdrop-filter:blur(24px);box-shadow:0 28px 90px rgba(0,0,0,.58),0 0 0 1px rgba(255,255,255,.02);animation:pop .16s ease;overflow:hidden}.w-menu-title{padding:7px 9px 6px;color:#64748b;font-size:9px;text-transform:uppercase;letter-spacing:.1em;font-weight:800}.w-menu-item{width:100%;height:35px;display:flex;align-items:center;gap:9px;padding:0 9px;border:0;border-radius:8px;color:#cbd5e1;background:transparent;text-align:left;font-size:11px;cursor:pointer}.w-menu-item:hover{background:rgba(59,130,246,.14);color:#fff}.w-menu-item svg{color:#93c5fd}.w-menu-divider{height:1px;background:var(--line);margin:6px 4px}
        .w-find{display:flex;align-items:center;gap:7px;padding:7px 10px;border-bottom:1px solid var(--line);background:rgba(8,18,33,.98);z-index:35;animation:pop .14s ease}.w-input{height:35px;width:210px;border:1px solid var(--line);border-radius:8px;outline:none;padding:0 10px;color:#e2e8f0;background:#050d1b;font-size:11px;transition:.16s}.w-input:focus{border-color:rgba(59,130,246,.55);box-shadow:0 0 0 3px rgba(59,130,246,.08)}
        .w-area{flex:1;min-height:0;overflow:auto;padding:40px 24px 70px;background:radial-gradient(circle at 50% 5%,rgba(59,130,246,.055),transparent 38%),#050b16;scrollbar-width:thin}.w-area::-webkit-scrollbar{width:10px}.w-area::-webkit-scrollbar-thumb{background:rgba(148,163,184,.16);border-radius:20px}.w-page{width:min(100%,920px);min-height:1060px;margin:0 auto;padding:78px 82px 100px;background:linear-gradient(180deg,#111c30,#0d1627);border:1px solid rgba(255,255,255,.11);border-radius:10px;box-shadow:0 35px 100px rgba(0,0,0,.48),0 5px 20px rgba(0,0,0,.25);transition:box-shadow .25s,border-color .25s}.w-page:focus-within{border-color:rgba(59,130,246,.32);box-shadow:0 35px 100px rgba(0,0,0,.48),0 0 0 1px rgba(59,130,246,.08),0 0 45px rgba(59,130,246,.045)}.w-page-zoom{margin:0 auto;transition:width .2s ease,min-height .2s ease}.w-editor{outline:none;min-height:880px;color:#d2d8e3;font-size:16px;line-height:1.75;caret-color:#60a5fa;overflow-wrap:anywhere;word-break:break-word}.w-editor::selection{background:rgba(59,130,246,.35);color:#fff}.w-editor h1{font-size:38px;line-height:1.18;color:#f8fafc;margin:0 0 20px;font-weight:800;letter-spacing:-.03em}.w-editor h2{font-size:29px;line-height:1.25;color:#f1f5f9;margin:28px 0 15px;font-weight:750}.w-editor h3{font-size:22px;line-height:1.3;color:#e2e8f0;margin:24px 0 12px;font-weight:700}.w-editor p{margin:0 0 13px}.w-editor ul,.w-editor ol{padding-left:32px;margin:10px 0 18px}.w-editor li{padding-left:4px;margin:5px 0}.w-editor li::marker{color:#60a5fa}.w-editor blockquote{margin:20px 0;padding:14px 20px;border-left:3px solid #3b82f6;border-radius:0 9px 9px 0;background:rgba(59,130,246,.08);color:#bfdbfe;font-style:italic}.w-editor pre{margin:18px 0;padding:17px;overflow:auto;border:1px solid var(--line);border-radius:10px;background:#020617;color:#c4b5fd;font:13px/1.7 "Cascadia Code","Courier New",monospace}.w-editor code{font-family:"Cascadia Code","Courier New",monospace}.w-editor a{color:#60a5fa;text-decoration:underline}.w-editor img.writer-image{display:block;max-width:100%;height:auto;margin:20px auto;border-radius:12px;border:1px solid var(--line);box-shadow:0 18px 45px rgba(0,0,0,.3)}.w-editor table{width:100%;border-collapse:collapse;margin:20px 0;background:rgba(15,23,42,.55)}.w-editor th,.w-editor td{padding:10px 12px;border:1px solid rgba(255,255,255,.12);text-align:left;min-width:90px}.w-editor th{background:rgba(59,130,246,.14);color:#fff}.w-editor hr{border:0;border-top:1px solid rgba(255,255,255,.14);margin:28px 0}.w-editor .writer-page-break{height:0;border-top:2px dashed rgba(96,165,250,.28);margin:55px 0;position:relative}.w-editor .writer-page-break:after{content:'Page Break';position:absolute;right:0;top:-17px;color:#64748b;font-size:9px;letter-spacing:.08em;text-transform:uppercase}
        .w-status{height:31px;min-height:31px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 9px;border-top:1px solid var(--line);background:#091423;color:#8190a8;font-size:10px;z-index:40}.w-status-left,.w-status-right{display:flex;align-items:center;gap:12px;min-width:0}.w-status-right button{height:24px;min-width:24px}.saved{color:#34d399;display:flex;align-items:center;gap:3px}.saving{color:#fbbf24;animation:pulseSave 1s infinite}.unsaved{color:#94a3b8}
        .w-modal-bg{position:absolute;inset:0;z-index:200;display:grid;place-items:center;padding:18px;background:rgba(2,6,23,.72);backdrop-filter:blur(14px)}.w-modal{width:min(650px,100%);max-height:85%;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.14);border-radius:18px;background:#0d1729;box-shadow:0 35px 100px rgba(0,0,0,.6);animation:pop .18s ease}.w-modal-head{height:60px;min-height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 15px;border-bottom:1px solid var(--line)}.w-modal-list{padding:10px;overflow:auto}.w-doc{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px;border-radius:10px;cursor:pointer;transition:.15s}.w-doc:hover{background:rgba(255,255,255,.06);transform:translateX(2px)}
        @media(max-width:900px){.w-page{padding-left:52px;padding-right:52px}.w-title input{width:250px}}
        @media(max-width:700px){.w-top{height:57px;min-height:57px}.w-title input{width:170px}.w-path{display:none}.w-top-btn span{display:none}.w-top-btn{width:35px;padding:0}.w-toolbar{height:52px;min-height:52px}.w-area{padding:18px 8px 50px}.w-page{min-height:900px;padding:42px 24px 70px;border-radius:6px}.w-editor{font-size:15px}.w-editor h1{font-size:30px}.w-editor h2{font-size:24px}.w-editor h3{font-size:19px}.w-find{overflow-x:auto}.w-input{width:150px}.w-status-left .hide-mobile{display:none}.w-status-left{gap:7px}.w-status-right{gap:6px}.w-floating-menu{width:220px}}
        @media print{.writer{height:auto!important;background:white!important}.w-top,.w-toolbar-shell,.w-find,.w-status,.w-floating-menu{display:none!important}.w-area{padding:0!important;overflow:visible!important;background:white!important}.w-page-zoom{width:100%!important}.w-page{width:100%!important;min-height:auto!important;padding:30px!important;border:0!important;box-shadow:none!important;background:white!important;transform:none!important}.w-editor,.w-editor p,.w-editor li,.w-editor h1,.w-editor h2,.w-editor h3{color:#111!important}}
      `}</style>

      <header className="w-top">
        <div className="w-brand">
          <div className="w-logo"><FileText size={18}/></div>
          <div className="w-title">
            <input value={docTitle} onChange={e => { setDocTitle(e.target.value); markDirty(); }} spellCheck={false} aria-label="Document title"/>
            <div className="w-path">{currentFilePath}</div>
          </div>
        </div>
        <div className="w-actions">
          <button className="w-top-btn" onClick={newDoc}><FilePlus2 size={14}/><span>New</span></button>
          <button className="w-top-btn" onClick={openDocs}><FolderOpen size={14}/><span>Open</span></button>
          <button className="w-top-btn primary" onClick={save}><Save size={14}/><span>Save</span></button>
          <button className="w-top-btn" onClick={() => window.print()} title="Print"><Printer size={14}/></button>
          <button className="w-top-btn" onClick={() => setFullscreen(v => !v)} title="Fullscreen">{fullscreen ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}</button>
        </div>
      </header>

      <div className="w-toolbar-shell">
        <div className="w-toolbar" onMouseDown={e => { if (!(e.target as HTMLElement).closest('button,select,input,label')) saveSelection(); }}>
          <div className="w-group">
            {toolbarButton(<Undo2 size={15}/>, 'Undo  Ctrl+Z', () => command('undo'))}
            {toolbarButton(<Redo2 size={15}/>, 'Redo  Ctrl+Y', () => command('redo'))}
          </div>
          <div className="w-sep"/>

          <select className="w-select" value={font} title="Font family" onMouseDown={() => saveSelection()} onChange={e => { setFont(e.target.value); command('fontName', e.target.value); }}>
            {FONTS.map(([label, value]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select className="w-select" value={fontSize} title="Font size" onMouseDown={() => saveSelection()} onChange={e => { setFontSize(e.target.value); command('fontSize', e.target.value); }}>
            {SIZES.map(([label, value]) => <option key={value} value={value}>{label}px</option>)}
          </select>
          <div className="w-sep"/>

          <div className="w-group">
            {toolbarButton(<Bold size={15}/>, 'Bold  Ctrl+B', () => command('bold'), active.bold)}
            {toolbarButton(<Italic size={15}/>, 'Italic  Ctrl+I', () => command('italic'), active.italic)}
            {toolbarButton(<Underline size={15}/>, 'Underline  Ctrl+U', () => command('underline'), active.underline)}
            {toolbarButton(<Strikethrough size={15}/>, 'Strikethrough', () => command('strikeThrough'), active.strike)}
          </div>
          <div className="w-sep"/>

          <div className="w-group">
            {headingButton('P', 'P', 'Normal paragraph')}
            {headingButton('H1', 'H1', 'Heading 1')}
            {headingButton('H2', 'H2', 'Heading 2')}
            {headingButton('H3', 'H3', 'Heading 3')}
          </div>
          <div className="w-sep"/>

          <div className="w-group">
            {toolbarButton(<AlignLeft size={15}/>, 'Align left', () => command('justifyLeft'), active.left)}
            {toolbarButton(<AlignCenter size={15}/>, 'Center', () => command('justifyCenter'), active.center)}
            {toolbarButton(<AlignRight size={15}/>, 'Align right', () => command('justifyRight'), active.right)}
            {toolbarButton(<AlignJustify size={15}/>, 'Justify', () => command('justifyFull'), active.justify)}
          </div>
          <div className="w-sep"/>

          <div className="w-group">
            {toolbarButton(<List size={15}/>, 'Bullet list', () => command('insertUnorderedList'), active.ul)}
            {toolbarButton(<ListOrdered size={15}/>, 'Numbered list', () => command('insertOrderedList'), active.ol)}
            {toolbarButton(<IndentDecrease size={15}/>, 'Decrease indent', () => command('outdent'))}
            {toolbarButton(<IndentIncrease size={15}/>, 'Increase indent', () => command('indent'))}
          </div>
          <div className="w-sep"/>

          <label className="w-color" title="Text color" onMouseDown={e => { e.preventDefault(); saveSelection(); }}>
            <span className="w-swatch" style={{background:textColor}}/><input type="color" value={textColor} onChange={e => { setTextColor(e.target.value); command('foreColor', e.target.value); }}/>
          </label>
          <label className="w-color" title="Highlight" onMouseDown={e => { e.preventDefault(); saveSelection(); }}>
            <Highlighter size={15}/><input type="color" value={highlight} onChange={e => { setHighlight(e.target.value); command('hiliteColor', e.target.value); }}/>
          </label>
          {toolbarButton(<Paintbrush size={15}/>, 'Clear formatting', () => command('removeFormat'))}
          <div className="w-sep"/>

          {toolbarButton(<Table2 size={15}/>, 'Insert table', insertTable)}
          {toolbarButton(<ImageIcon size={15}/>, 'Insert image', insertImage)}
          {toolbarButton(<Link2 size={15}/>, 'Insert link', insertLink)}
          {toolbarButton(<Quote size={15}/>, 'Blockquote', () => blockCommand('BLOCKQUOTE'), block === 'BLOCKQUOTE')}
          {toolbarButton(<Code2 size={15}/>, 'Code block', () => blockCommand('PRE'), block === 'PRE')}
          {toolbarButton(<Minus size={15}/>, 'Horizontal line', () => insertHTML('<hr><p><br></p>'))}
          <div className="w-sep"/>
          {toolbarButton(<Search size={15}/>, 'Find / Replace  Ctrl+F', () => setFindOpen(v => !v), findOpen)}
          <button
            ref={moreButtonRef}
            type="button"
            className={`w-btn ${moreOpen ? 'active' : ''}`}
            title="More options"
            onMouseDown={e => { e.preventDefault(); saveSelection(); }}
            onClick={() => { updateMorePosition(); setMoreOpen(v => !v); }}
          ><MoreHorizontal size={16}/></button>
        </div>
      </div>

      {findOpen && <div className="w-find">
        <Search size={14} color="#60a5fa"/>
        <input autoFocus className="w-input" placeholder="Find text..." value={find} onChange={e => setFind(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') findNext(); }}/>
        <input className="w-input" placeholder="Replace with..." value={replace} onChange={e => setReplace(e.target.value)}/>
        <button className="w-top-btn" onClick={findNext}><Search size={13}/> Find next</button>
        <button className="w-top-btn primary" onClick={replaceAll}><Replace size={13}/> Replace all</button>
        <button className="w-top-btn" onClick={() => setFindOpen(false)}><X size={14}/></button>
      </div>}

      {moreOpen && <div className="w-floating-menu" style={{ top: morePos.top, right: morePos.right }} onMouseDown={e => e.stopPropagation()}>
        <div className="w-menu-title">More editing tools</div>
        <button className="w-menu-item" onClick={() => { command('subscript'); setMoreOpen(false); }}><Subscript size={15}/> Subscript</button>
        <button className="w-menu-item" onClick={() => { command('superscript'); setMoreOpen(false); }}><Superscript size={15}/> Superscript</button>
        <button className="w-menu-item" onClick={() => { command('removeFormat'); setMoreOpen(false); }}><RemoveFormatting size={15}/> Clear all formatting</button>
        <div className="w-menu-divider"/>
        <button className="w-menu-item" onClick={() => { copy(); setMoreOpen(false); }}><Copy size={15}/> Copy</button>
        <button className="w-menu-item" onClick={() => { cut(); setMoreOpen(false); }}><Scissors size={15}/> Cut</button>
        <button className="w-menu-item" onClick={() => { pastePlain(); setMoreOpen(false); }}><Clipboard size={15}/> Paste plain text</button>
        <button className="w-menu-item" onClick={() => { command('selectAll'); setMoreOpen(false); }}><TextSelect size={15}/> Select all</button>
        <div className="w-menu-divider"/>
        <button className="w-menu-item" onClick={() => { insertDateTime(); setMoreOpen(false); }}><Clock size={15}/> Insert date & time</button>
        <button className="w-menu-item" onClick={() => { insertPageBreak(); setMoreOpen(false); }}><Columns3 size={15}/> Insert page break</button>
      </div>}

      <main className="w-area" onMouseDown={() => { if (moreOpen) setMoreOpen(false); }}>
        <div className="w-page-zoom" style={zoomStyle}>
          <div className="w-page">
            <div
              ref={editorRef}
              className="w-editor"
              contentEditable
              suppressContentEditableWarning
              spellCheck
              onInput={afterEdit}
              onMouseUp={() => { saveSelection(); syncToolbar(); }}
              onKeyUp={() => { saveSelection(); syncToolbar(); updateStats(); }}
              onFocus={() => { saveSelection(); syncToolbar(); }}
              onBlur={saveSelection}
              onKeyDown={e => {
                const mod = e.ctrlKey || e.metaKey;
                if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); save(); return; }
                if (mod && e.key.toLowerCase() === 'f') { e.preventDefault(); setFindOpen(true); return; }
                if (mod && e.key.toLowerCase() === 'b') { e.preventDefault(); command('bold'); return; }
                if (mod && e.key.toLowerCase() === 'i') { e.preventDefault(); command('italic'); return; }
                if (mod && e.key.toLowerCase() === 'u') { e.preventDefault(); command('underline'); return; }
                if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); insertLink(); return; }
                if (e.key === 'Tab') {
                  e.preventDefault();
                  command(e.shiftKey ? 'outdent' : 'indent');
                  return;
                }
                if (e.key === 'Escape' && moreOpen) setMoreOpen(false);
              }}
            />
          </div>
        </div>
      </main>

      <footer className="w-status">
        <div className="w-status-left">
          <span>Page 1 of {pageCount}</span>
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
          <span className="hide-mobile">Abhishek OpenDoc</span>
          <span className="hide-mobile">• {statusMessage}</span>
        </div>
        <div className="w-status-right">
          <button className="w-btn" onClick={() => setZoom(v => Math.max(60, v - 10))}><ZoomOut size={12}/></button>
          <span className="zoom-label">{zoom}%</span>
          <button className="w-btn" onClick={() => setZoom(v => Math.min(160, v + 10))}><ZoomIn size={12}/></button>
          {saveStatus === 'saving' && <span className="saving">Saving...</span>}
          {saveStatus === 'saved' && <span className="saved"><CheckCircle2 size={11}/> Saved {lastSavedTime}</span>}
          {saveStatus === 'unsaved' && <span className="unsaved">Unsaved changes</span>}
        </div>
      </footer>

      {openModal && <div className="w-modal-bg" onMouseDown={e => { if (e.target === e.currentTarget) setOpenModal(false); }}>
        <div className="w-modal">
          <div className="w-modal-head">
            <div style={{display:'flex',alignItems:'center',gap:9}}>
              <div className="w-logo" style={{width:30,height:30}}><FolderOpen size={15}/></div>
              <div><div style={{fontSize:13,fontWeight:750}}>Open Document</div><div style={{fontSize:10,color:'#64748b'}}>Documents in Abhishek OS</div></div>
            </div>
            <button className="w-btn" onClick={() => setOpenModal(false)}><X size={15}/></button>
          </div>
          <div className="w-modal-list">
            {docs.length === 0 ? <div style={{padding:40,textAlign:'center',color:'#64748b'}}>No documents found</div> : docs.map(doc => (
              <div className="w-doc" key={doc.path} onClick={async () => { await load(doc.path); setOpenModal(false); }}>
                <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}>
                  <FileText size={17} color="#60a5fa"/>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:650,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{doc.name}</div>
                    <div style={{fontSize:9,color:'#64748b',fontFamily:'monospace',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{doc.path}</div>
                  </div>
                </div>
                <span style={{fontSize:9,color:'#64748b'}}>{Math.max(1,Math.round(doc.size / 1024))} KB</span>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
};

export default WriterApp;
