import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { VFSFile } from '../../types';
import { getAllVFSFiles, getVFSFile, saveVFSFile, createVFSFile } from '../../lib/vfs';
import { checkAndUnlockAchievement } from '../../lib/achievements';
import {
  FileText,
  Save,
  Printer,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Table,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  Download,
  FolderOpen,
  Check,
  Code,
  Quote,
} from 'lucide-react';

export const WriterApp: React.FC = () => {
  const { playSystemSound } = useOS();
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  const [currentFilePath, setCurrentFilePath] = useState<string>('/Documents/Abhishek_Profile.abkdoc');
  const [docTitle, setDocTitle] = useState<string>('Abhishek_Profile.abkdoc');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);

  // Find & Replace
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  // Open Document Modal
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [availableDocs, setAvailableDocs] = useState<VFSFile[]>([]);

  // Load initial document from VFS
  useEffect(() => {
    loadDocument(currentFilePath);
  }, []);

  const loadDocument = async (path: string) => {
    const file = await getVFSFile(path);
    if (file && editorRef.current) {
      setCurrentFilePath(file.path);
      setDocTitle(file.name);
      try {
        const parsed = JSON.parse(file.content);
        editorRef.current.innerHTML = parsed.content || file.content;
      } catch {
        editorRef.current.innerHTML = file.content;
      }
      updateStats();
      setSaveStatus('saved');
    }
  };

  // Update live word & character stats
  const updateStats = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
  };

  // Execute formatting command on rich text container
  const rememberSelection = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || !editorRef.current) return;
    const range = selection.getRangeAt(0);
    if (editorRef.current.contains(range.commonAncestorContainer)) {
      savedSelectionRef.current = range.cloneRange();
    }
  };

  const execFormat = (command: string, value: string | undefined = undefined) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    if (savedSelectionRef.current) {
      selection?.removeAllRanges();
      selection?.addRange(savedSelectionRef.current);
    }
    // formatBlock is inconsistent across browsers when passed markup.
    // The tag name form works in Chromium and Firefox and preserves the selection.
    const commandValue = command === 'formatBlock'
      ? value?.replace(/[<>]/g, '').toLowerCase()
      : value;
    document.execCommand(command, false, commandValue);
    rememberSelection();
    setSaveStatus('unsaved');
    updateStats();
  };

  // Autosave periodically if unsaved
  useEffect(() => {
    if (saveStatus !== 'unsaved') return;

    const timer = setTimeout(() => {
      handleSave();
    }, 2500);

    return () => clearTimeout(timer);
  }, [saveStatus]);

  const handleSave = async () => {
    if (!editorRef.current) return;
    setSaveStatus('saving');

    const htmlContent = editorRef.current.innerHTML;
    const structured = JSON.stringify({
      title: docTitle,
      author: 'Abhishek Kuntare',
      updatedAt: Date.now(),
      content: htmlContent,
    });

    const file: VFSFile = {
      id: `doc-${Date.now()}`,
      name: docTitle,
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
    const now = new Date();
    setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    checkAndUnlockAchievement('word-architect');
  };

  const handleNewDocument = async () => {
    const newName = `Document_${Date.now().toString().slice(-4)}.abkdoc`;
    const newPath = `/Documents/${newName}`;
    const initialContent = '<h1>Untitled Document</h1><p>Start typing your thoughts, notes, or technical specifications here...</p>';

    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
    setDocTitle(newName);
    setCurrentFilePath(newPath);
    await createVFSFile('/Documents', newName, JSON.stringify({ title: newName, content: initialContent }), 'abkdoc');
    setSaveStatus('saved');
    updateStats();
  };

  const handleOpenModal = async () => {
    const all = await getAllVFSFiles();
    const docs = all.filter(f => !f.deletedAt && (f.extension === 'abkdoc' || f.extension === 'txt' || f.extension === 'md'));
    setAvailableDocs(docs);
    setShowOpenModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Insert Table helper
  const handleInsertTable = () => {
    const tableHtml = `
      <table style="width:100%; border-collapse:collapse; margin:16px 0; border:1px solid #334155;">
        <thead>
          <tr style="background-color:#1e293b;">
            <th style="border:1px solid #334155; padding:8px; text-align:left;">Module</th>
            <th style="border:1px solid #334155; padding:8px; text-align:left;">Status</th>
            <th style="border:1px solid #334155; padding:8px; text-align:left;">Lead Engineer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border:1px solid #334155; padding:8px;">Frontend Architecture</td>
            <td style="border:1px solid #334155; padding:8px;">Completed</td>
            <td style="border:1px solid #334155; padding:8px;">Abhishek Kuntare</td>
          </tr>
          <tr>
            <td style="border:1px solid #334155; padding:8px;">Multimodal AI Integration</td>
            <td style="border:1px solid #334155; padding:8px;">Production</td>
            <td style="border:1px solid #334155; padding:8px;">Abhishek Kuntare</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `;
    execFormat('insertHTML', tableHtml);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Top Application Bar */}
      <header className="h-12 px-3 border-b border-white/10 bg-slate-900/90 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={docTitle}
                onChange={e => {
                  setDocTitle(e.target.value);
                  setSaveStatus('unsaved');
                }}
                className="bg-transparent font-semibold text-xs sm:text-sm text-slate-100 hover:bg-white/5 px-2 py-1 rounded focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-52"
              />
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">{currentFilePath}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNewDocument}
            className="px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 rounded-md transition-colors"
          >
            New
          </button>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 rounded-md transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Open</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
          <button
            onClick={handlePrint}
            className="p-1.5 text-slate-300 hover:bg-white/10 rounded-md transition-colors"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Ribbon / Formatting Toolbar */}
      <div onMouseDown={rememberSelection} className="px-3 py-1.5 border-b border-white/10 bg-slate-900/60 flex items-center gap-1 overflow-x-auto text-xs shrink-0 no-scrollbar">
        <button
          onMouseDown={e => { e.preventDefault(); rememberSelection(); }}
          onClick={() => execFormat('undo')}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>
        <button
          onMouseDown={e => { e.preventDefault(); rememberSelection(); }}
          onClick={() => execFormat('redo')}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Font formatting */}
        <button
          onMouseDown={e => { e.preventDefault(); rememberSelection(); }}
          onClick={() => execFormat('bold')}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300 font-bold"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onMouseDown={e => { e.preventDefault(); rememberSelection(); }}
          onClick={() => execFormat('italic')}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300 italic"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          onMouseDown={e => { e.preventDefault(); rememberSelection(); }}
          onClick={() => execFormat('underline')}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300 underline"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          onMouseDown={e => { e.preventDefault(); rememberSelection(); }}
          onClick={() => execFormat('strikeThrough')}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300"
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Headings */}
        <button
          onMouseDown={e => { e.preventDefault(); rememberSelection(); }}
          onClick={() => execFormat('formatBlock', 'h1')}
          className="px-2 py-1 hover:bg-white/10 rounded text-slate-300 font-bold text-xs"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onMouseDown={e => { e.preventDefault(); rememberSelection(); }}
          onClick={() => execFormat('formatBlock', 'h2')}
          className="px-2 py-1 hover:bg-white/10 rounded text-slate-300 font-bold text-xs"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onMouseDown={e => { e.preventDefault(); rememberSelection(); }}
          onClick={() => execFormat('formatBlock', 'h3')}
          className="px-2 py-1 hover:bg-white/10 rounded text-slate-300 font-bold text-xs"
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5 inline mr-0.5" />H3
        </button>
        <button
          onMouseDown={e => { e.preventDefault(); rememberSelection(); }}
          onClick={() => execFormat('formatBlock', 'p')}
          className="px-2 py-1 hover:bg-white/10 rounded text-slate-300 text-xs"
        >
          P
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Alignment */}
        <button
          onClick={() => execFormat('justifyLeft')}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300"
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execFormat('justifyCenter')}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300"
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execFormat('justifyRight')}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300"
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execFormat('justifyFull')}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300"
          title="Justify"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Lists & Inserts */}
        <button
          onClick={() => execFormat('insertUnorderedList')}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300"
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => execFormat('insertOrderedList')}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleInsertTable}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300"
          title="Insert Table"
        >
          <Table className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            const url = prompt('Enter Image URL:');
            if (url) execFormat('insertImage', url);
          }}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300"
          title="Insert Image URL"
        >
          <ImageIcon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            const url = prompt('Enter Link URL:');
            if (url) execFormat('createLink', url);
          }}
          className="p-1.5 hover:bg-white/10 rounded text-slate-300"
          title="Insert Link"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Page Canvas / Document Body */}
      <div className="flex-1 overflow-y-auto bg-slate-900/60 p-4 sm:p-8 flex justify-center">
        <div className="w-full max-w-3xl min-h-[850px] bg-slate-900 border border-white/12 rounded-xl shadow-2xl p-8 sm:p-12 text-slate-100 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => {
              rememberSelection();
              setSaveStatus('unsaved');
              updateStats();
            }}
            className="outline-none min-h-[750px] prose prose-invert prose-headings:text-slate-100 prose-headings:font-bold prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 max-w-none text-sm sm:text-base selection:bg-blue-500/30"
          />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-7 px-4 border-t border-white/10 bg-slate-900 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-4">
          <span>
            Page 1 of 1 • <strong>{wordCount}</strong> words • <strong>{charCount}</strong> characters
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">Format: Abhishek OpenDoc (.abkdoc)</span>
        </div>

        <div className="flex items-center gap-2">
          {saveStatus === 'saving' && (
            <span className="text-amber-400 font-medium animate-pulse">Saving changes...</span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <Check className="w-3 h-3" />
              <span>Saved ({lastSavedTime})</span>
            </span>
          )}
          {saveStatus === 'unsaved' && <span className="text-slate-400 font-medium">Unsaved changes</span>}
        </div>
      </footer>

      {/* Open Document Modal */}
      {showOpenModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <span>Open Virtual Document</span>
              </h3>
              <button
                onClick={() => setShowOpenModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1">
              {availableDocs.map(doc => (
                <div
                  key={doc.path}
                  onClick={() => {
                    loadDocument(doc.path);
                    setShowOpenModal(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{doc.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{doc.path}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {Math.round(doc.size / 1024)} KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
