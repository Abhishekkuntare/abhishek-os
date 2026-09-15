import React, { useState } from 'react';
import {
  StickyNote,
  Plus,
  Trash2,
  Search,
  Check,
  Calendar,
  Sparkles,
  Tag,
} from 'lucide-react';

interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: 'Recruiter' | 'Project' | 'Personal';
  updatedAt: string;
}

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Recruiter Quick Review: Abhishek Kuntare',
    content: `Core Stack: React 19, Next.js 15, TypeScript, Node.js, Tailwind CSS, AI/LLM integration.
Education: Bachelor of Engineering (8.50 CGPA).
Experience: 2+ years of production full-stack & frontend engineering.
Key Strengths: Component architecture, responsive design, state orchestration, sub-second performance.`,
    category: 'Recruiter',
    updatedAt: 'Today',
  },
  {
    id: 'note-2',
    title: 'KrishiMitra AI Architecture Notes',
    content: `Built with Next.js, FastAPI, and Google Gemini API.
Features: Crop disease diagnosis via vision inference, multi-lingual voice assistance, dynamic soil advisory.
Status: Production ready and featured on workstation desktop.`,
    category: 'Project',
    updatedAt: 'Yesterday',
  },
  {
    id: 'note-3',
    title: 'Workstation Setup & Next Steps',
    content: `1. Explore Developer Terminal (neofetch, sudo hire abhishek).
2. Inspect Live Wallpapers via Personalization Settings.
3. Test Chromium-inspired browser tab management and external fallback.
4. Download Abhishek_Kuntare_Resume.pdf.`,
    category: 'Personal',
    updatedAt: 'Sep 12',
  },
];

export const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('ak_notes_app_data');
      return saved ? JSON.parse(saved) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const saveNotes = (newNotes: NoteItem[]) => {
    setNotes(newNotes);
    localStorage.setItem('ak_notes_app_data', JSON.stringify(newNotes));
  };

  const createNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '',
      category: 'Personal',
      updatedAt: 'Just now',
    };
    const updated = [newNote, ...notes];
    saveNotes(updated);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
    if (activeNoteId === id && updated.length > 0) {
      setActiveNoteId(updated[0].id);
    }
  };

  const updateActiveNote = (fields: Partial<NoteItem>) => {
    const updated = notes.map(n =>
      n.id === activeNoteId ? { ...n, ...fields, updatedAt: 'Just now' } : n
    );
    saveNotes(updated);
  };

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const filteredNotes = notes.filter(
    n =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* 1. SIDEBAR NOTE LIST */}
      <div className="w-64 sm:w-72 border-r border-white/8 bg-slate-900/70 flex flex-col shrink-0">
        <div className="p-3 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs text-white">Workstation Notes</span>
          </div>
          <button
            type="button"
            onClick={createNote}
            className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-xs transition-colors flex items-center gap-1 font-semibold"
            title="Create New Note"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>

        {/* Search Notes */}
        <div className="p-2 border-b border-white/5">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/8 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="flex-1 bg-transparent text-white placeholder-slate-500 outline-hidden text-xs"
            />
          </div>
        </div>

        {/* Notes Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredNotes.map(n => {
            const isSelected = n.id === activeNoteId;
            return (
              <div
                key={n.id}
                onClick={() => setActiveNoteId(n.id)}
                className={`group p-2.5 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-400/15 border border-amber-400/30 text-white shadow-xs'
                    : 'hover:bg-slate-800/80 border border-transparent text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs truncate flex-1">{n.title || 'Untitled'}</h4>
                  <button
                    type="button"
                    onClick={e => deleteNote(n.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{n.content || 'Empty note...'}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                  <span>{n.updatedAt}</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-white/5 font-medium">{n.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN NOTE EDITOR */}
      {activeNote ? (
        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden bg-slate-950">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 gap-4">
            <input
              type="text"
              value={activeNote.title}
              onChange={e => updateActiveNote({ title: e.target.value })}
              placeholder="Note Title..."
              className="text-lg sm:text-xl font-bold text-white bg-transparent outline-hidden flex-1"
            />
            <select
              value={activeNote.category}
              onChange={e => updateActiveNote({ category: e.target.value as any })}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300 outline-hidden"
            >
              <option value="Recruiter">Recruiter</option>
              <option value="Project">Project</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          <textarea
            value={activeNote.content}
            onChange={e => updateActiveNote({ content: e.target.value })}
            placeholder="Start typing your note here..."
            className="flex-1 w-full bg-transparent text-slate-200 text-sm leading-relaxed p-2 resize-none outline-hidden font-mono mt-3"
          />

          <div className="pt-2 border-t border-white/8 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Changes persist automatically to local browser storage</span>
            <span>{activeNote.content.length} characters</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
          Select or create a note to begin editing.
        </div>
      )}
    </div>
  );
};
