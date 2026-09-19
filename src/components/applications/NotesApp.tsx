import React, {

  useCallback,

  useEffect,

  useMemo,

  useRef,

  useState,

} from 'react';

import { createPortal } from 'react-dom';

import {

  StickyNote,

  Plus,

  Trash2,

  Search,

  Pin,

  PinOff,

  Palette,

  MoreHorizontal,

  Copy,

  Check,

  Calendar,

  Tag,

  X,

  ChevronDown,

  SortAsc,

  Clock3,

  FileText,

  Sparkles,

  Archive,

  ArchiveRestore,

  Maximize2,

  Minimize2,

  Menu,

  ArrowLeft,

  Save,

  Eraser,

  RotateCcw,

} from 'lucide-react';



/* =========================================================*

*&#xA0;  TYPES*

*========================================================= */



type NoteCategory = 'Recruiter' | 'Project' | 'Personal';



interface NoteColor {

  id: string;

  name: string;

  bg: string;

  border: string;

  accent: string;

  soft: string;

  text: string;

}



interface NoteItem {

  id: string;

  title: string;

  content: string;

  category: NoteCategory;

  updatedAt: string;

  colorId: string;

  pinned: boolean;

  archived: boolean;

  createdAt: string;

}



/* =========================================================*

*&#xA0;  COLORS*

*========================================================= */



const NOTE_COLORS: NoteColor[] = [

  {

    id: 'default',

    name: 'Default',

    bg: '#0f172a',

    border: '#334155',

    accent: '#94a3b8',

    soft: 'rgba(148,163,184,0.12)',

    text: '#f8fafc',

  },

  {

    id: 'yellow',

    name: 'Yellow',

    bg: '#241f0d',

    border: '#8b7417',

    accent: '#facc15',

    soft: 'rgba(250,204,21,0.13)',

    text: '#fff7c2',

  },

  {

    id: 'orange',

    name: 'Orange',

    bg: '#25170e',

    border: '#9a5b20',

    accent: '#fb923c',

    soft: 'rgba(251,146,60,0.13)',

    text: '#ffedd5',

  },

  {

    id: 'red',

    name: 'Red',

    bg: '#250f14',

    border: '#9f394b',

    accent: '#fb7185',

    soft: 'rgba(251,113,133,0.13)',

    text: '#ffe4e6',

  },

  {

    id: 'pink',

    name: 'Pink',

    bg: '#25121f',

    border: '#a34c78',

    accent: '#f472b6',

    soft: 'rgba(244,114,182,0.13)',

    text: '#fce7f3',

  },

  {

    id: 'purple',

    name: 'Purple',

    bg: '#1d1530',

    border: '#7047a6',

    accent: '#c084fc',

    soft: 'rgba(192,132,252,0.13)',

    text: '#f3e8ff',

  },

  {

    id: 'blue',

    name: 'Blue',

    bg: '#0d1b2d',

    border: '#315d91',

    accent: '#60a5fa',

    soft: 'rgba(96,165,250,0.13)',

    text: '#dbeafe',

  },

  {

    id: 'cyan',

    name: 'Cyan',

    bg: '#0a2025',

    border: '#287f8b',

    accent: '#22d3ee',

    soft: 'rgba(34,211,238,0.13)',

    text: '#cffafe',

  },

  {

    id: 'green',

    name: 'Green',

    bg: '#0d2118',

    border: '#347451',

    accent: '#4ade80',

    soft: 'rgba(74,222,128,0.13)',

    text: '#dcfce7',

  },

];



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

    colorId: 'yellow',

    pinned: true,

    archived: false,

    createdAt: new Date().toISOString(),

  },

  {

    id: 'note-2',

    title: 'KrishiMitra AI Architecture Notes',

    content: `Built with Next.js, FastAPI, and Google Gemini API.



Features: Crop disease diagnosis via vision inference, multi-lingual voice assistance, dynamic soil advisory.



Status: Production ready and featured on workstation desktop.`,

    category: 'Project',

    updatedAt: 'Yesterday',

    colorId: 'green',

    pinned: false,

    archived: false,

    createdAt: new Date().toISOString(),

  },

  {

    id: 'note-3',

    title: 'Workstation Setup & Next Steps',

    content: `1. Explore Developer Terminal.



2. Inspect Live Wallpapers via Personalization Settings.



3. Test Chromium-inspired browser tab management and external fallback.



4. Download Abhishek_Kuntare_Resume.pdf.`,

    category: 'Personal',

    updatedAt: 'Sep 12',

    colorId: 'blue',

    pinned: false,

    archived: false,

    createdAt: new Date().toISOString(),

  },

];



/* =========================================================*

*&#xA0;  HELPERS*

*========================================================= */



const STORAGE_KEY = 'ak_notes_app_data_v3';



const getColor = (id: string) =>

  NOTE_COLORS.find(color => color.id === id) || NOTE_COLORS[0];



const formatUpdatedTime = () => {

  return new Intl.DateTimeFormat('en', {

    month: 'short',

    day: 'numeric',

    hour: 'numeric',

    minute: '2-digit',

  }).format(new Date());

};



const getWordCount = (text: string) => {

  const clean = text.trim();

  if (!clean) return 0;

  return clean.split(/\s+/).length;

};



const getCharacterCount = (text: string) => text.length;



/* =========================================================*

*&#xA0;  COLOR MENU*

*&#xA0;  IMPORTANT:*

*&#xA0;  This component uses createPortal() so the menu is rendered*

*&#xA0;  directly under document.body and can NEVER be clipped by*

*&#xA0;  the Notes editor/window's overflow-hidden container.*

*========================================================= */



interface ColorMenuProps {

  anchor: HTMLElement | null;

  currentColor: string;

  onSelect: (colorId: string) => void;

  onClose: () => void;

}



const ColorMenu: React.FC<ColorMenuProps> = ({

  anchor,

  currentColor,

  onSelect,

  onClose,

}) => {

  const menuRef = useRef<HTMLDivElement | null>(null);



  const [position, setPosition] = useState({

    top: 0,

    left: 0,

  });



  const updatePosition = useCallback(() => {

    if (!anchor) return;



    const rect = anchor.getBoundingClientRect();



    const menuWidth = 250;

    const menuHeight = 190;

    const gap = 8;



    let left = rect.left;

    let top = rect.bottom + gap;



    if (left + menuWidth > window.innerWidth - 12) {

      left = window.innerWidth - menuWidth - 12;

    }



    if (left < 12) {

      left = 12;

    }



    if (top + menuHeight > window.innerHeight - 12) {

      top = rect.top - menuHeight - gap;

    }



    if (top < 12) {

      top = 12;

    }



    setPosition({

      top,

      left,

    });

  }, [anchor]);



  useEffect(() => {

    updatePosition();



    const handleScroll = () => updatePosition();

    const handleResize = () => updatePosition();



    window.addEventListener('scroll', handleScroll, true);

    window.addEventListener('resize', handleResize);



    return () => {

      window.removeEventListener('scroll', handleScroll, true);

      window.removeEventListener('resize', handleResize);

    };

  }, [updatePosition]);



  useEffect(() => {

    const handlePointerDown = (event: MouseEvent) => {

      const target = event.target as Node;



      if (

        menuRef.current &&

        !menuRef.current.contains(target) &&

        anchor &&

        !anchor.contains(target)

      ) {

        onClose();

      }

    };



    document.addEventListener('mousedown', handlePointerDown);



    return () => {

      document.removeEventListener('mousedown', handlePointerDown);

    };

  }, [anchor, onClose]);



  if (!anchor) return null;



  return createPortal(

    <>

      <div

        className="fixed inset-0"

        style={{

          zIndex: 99998,

          pointerEvents: 'none',

        }}

      />



      <div

        ref={menuRef}

        className="fixed rounded-2xl border border-white/15 bg-[#111827]/98 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.55)] p-3 animate-[noteColorIn_160ms_ease-out]"

        style={{

          zIndex: 99999,

          top: position.top,

          left: position.left,

          width: 250,

        }}

      >

        <div className="flex items-center justify-between mb-3">

          <div>

            <div className="text-sm font-bold text-white">

              Note Color

            </div>

            <div className="text-[10px] text-slate-400 mt-0.5">

              Choose a color for this note

            </div>

          </div>



          <button

            type="button"

            onClick={onClose}

            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"

          >

            <X size={14} />

          </button>

        </div>



        <div className="grid grid-cols-5 gap-2">

          {NOTE_COLORS.map(color => {

            const selected = color.id === currentColor;



            return (

              <button

                key={color.id}

                type="button"

                title={color.name}

                aria-label={`Use ${color.name} note color`}

                onClick={() => {

                  onSelect(color.id);

                  onClose();

                }}

                className="relative h-9 rounded-xl border transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 active:scale-95"

                style={{

                  background: color.bg,

                  borderColor: selected

                    ? color.accent

                    : 'rgba(255,255,255,0.12)',

                  boxShadow: selected

                    ? `0 0 0 2px ${color.accent}33, 0 5px 18px ${color.accent}22`

                    : undefined,

                }}

              >

                <span

                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"

                  style={{

                    background: color.accent,

                  }}

                />



                {selected && (

                  <span className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-white flex items-center justify-center">

                    <Check

                      size={10}

                      strokeWidth={3}

                      style={{

                        color: color.accent,

                      }}

                    />

                  </span>

                )}

              </button>

            );

          })}

        </div>



        <div className="mt-3 pt-3 border-t border-white/10">

          <div className="flex items-center gap-2 text-[10px] text-slate-400">

            <Palette size={12} />

            <span>Color is saved automatically</span>

          </div>

        </div>

      </div>

    </>,

    document.body

  );

};



/* =========================================================*

*&#xA0;  DROPDOWN*

*========================================================= */



interface DropdownProps {
  open: boolean;
  anchor: HTMLElement | null;
  children: React.ReactNode;
  className?: string;
  width?: number;
  onClose?: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  open,
  anchor,
  children,
  className = '',
  width = 220,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const gap = 8;
    const padding = 10;

    let left = rect.right - width;
    let top = rect.bottom + gap;

    if (left < padding) left = padding;
    if (left + width > window.innerWidth - padding) {
      left = window.innerWidth - width - padding;
    }

    const menuHeight = menuRef.current?.getBoundingClientRect().height || 220;

    if (top + menuHeight > window.innerHeight - padding) {
      top = rect.top - menuHeight - gap;
    }

    if (top < padding) top = padding;

    setPosition({ top, left });
  }, [anchor, width]);

  useEffect(() => {
    if (!open || !anchor) return;

    updatePosition();

    const frame = window.requestAnimationFrame(() => {
      updatePosition();
    });

    const handleUpdate = () => updatePosition();

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [open, anchor, updatePosition]);

  useEffect(() => {
    if (!open || !anchor || !onClose) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !anchor.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [open, anchor, onClose]);

  if (!open || !anchor) return null;

  return createPortal(
    <div
      ref={menuRef}
      className={`fixed rounded-2xl border border-white/10 bg-[#111827]/98 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.5)] p-1.5 animate-[dropdownIn_150ms_ease-out] ${className}`}
      style={{
        position: 'fixed',
        zIndex: 99999,
        top: position.top,
        left: position.left,
        width,
      }}
    >
      {children}
    </div>,
    document.body
  );
};


/* =========================================================*

*&#xA0;  NOTES APP*

*========================================================= */



export const NotesApp: React.FC = () => {

  /* -------------------------------------------------------*

*&#xA0;    LOAD NOTES*

*&#xA0; ------------------------------------------------------- */



  const [notes, setNotes] = useState<NoteItem[]>(() => {

    try {

      const saved = localStorage.getItem(STORAGE_KEY);



      if (saved) {

        const parsed = JSON.parse(saved);



        if (Array.isArray(parsed)) {

          return parsed.map((note: Partial<NoteItem>) => ({

            id: note.id || `note-${Date.now()}-${Math.random()}`,

            title: note.title || 'Untitled Note',

            content: note.content || '',

            category: note.category || 'Personal',

            updatedAt: note.updatedAt || 'Just now',

            colorId: note.colorId || 'default',

            pinned: Boolean(note.pinned),

            archived: Boolean(note.archived),

            createdAt: note.createdAt || new Date().toISOString(),

          }));

        }

      }



      return DEFAULT_NOTES;

    } catch {

      return DEFAULT_NOTES;

    }

  });



  const [activeNoteId, setActiveNoteId] = useState(

    notes[0]?.id || ''

  );



  const [searchQuery, setSearchQuery] = useState('');

  const [categoryFilter, setCategoryFilter] = useState<

    'All' | NoteCategory

  >('All');



  const [showArchived, setShowArchived] = useState(false);



  const [sortMode, setSortMode] = useState<

    'updated' | 'created' | 'title'

  >('updated');



  const [sortOpen, setSortOpen] = useState(false);

  const [moreOpen, setMoreOpen] = useState(false);



  const [colorAnchor, setColorAnchor] =

    useState<HTMLElement | null>(null);



  const [sidebarOpen, setSidebarOpen] = useState(true);



  const [fullscreen, setFullscreen] = useState(false);



  const [savedIndicator, setSavedIndicator] = useState(true);



  const [confirmDelete, setConfirmDelete] = useState(false);



  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const sortButtonRef = useRef<HTMLButtonElement | null>(null);



  /* -------------------------------------------------------*

*&#xA0;    PERSIST*

*&#xA0; ------------------------------------------------------- */



  const saveNotes = useCallback((newNotes: NoteItem[]) => {

    setNotes(newNotes);



    try {

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));

    } catch {

      // Ignore storage errors.

    }



    setSavedIndicator(true);

  }, []);



  useEffect(() => {

    if (!savedIndicator) return;



    const timer = window.setTimeout(() => {

      setSavedIndicator(false);

    }, 1800);



    return () => window.clearTimeout(timer);

  }, [savedIndicator]);



  /* -------------------------------------------------------*

*&#xA0;    ACTIVE NOTE*

*&#xA0; ------------------------------------------------------- */



  const activeNote = useMemo(

    () =>

      notes.find(note => note.id === activeNoteId) ||

      notes[0] ||

      null,

    [notes, activeNoteId]

  );



  /* -------------------------------------------------------*

*&#xA0;    FILTER + SORT*

*&#xA0; ------------------------------------------------------- */



  const filteredNotes = useMemo(() => {

    const query = searchQuery.trim().toLowerCase();



    const result = notes.filter(note => {

      const matchesSearch =

        !query ||

        note.title.toLowerCase().includes(query) ||

        note.content.toLowerCase().includes(query) ||

        note.category.toLowerCase().includes(query);



      const matchesCategory =

        categoryFilter === 'All' ||

        note.category === categoryFilter;



      const matchesArchive =

        showArchived ? note.archived : !note.archived;



      return matchesSearch && matchesCategory && matchesArchive;

    });



    return [...result].sort((a, b) => {

      if (sortMode === 'title') {

        return a.title.localeCompare(b.title);

      }



      if (sortMode === 'created') {

        return (

          new Date(b.createdAt).getTime() -

          new Date(a.createdAt).getTime()

        );

      }



      if (a.pinned !== b.pinned) {

        return a.pinned ? -1 : 1;

      }



      return (

        new Date(b.createdAt).getTime() -

        new Date(a.createdAt).getTime()

      );

    });

  }, [

    notes,

    searchQuery,

    categoryFilter,

    showArchived,

    sortMode,

  ]);



  /* -------------------------------------------------------*

*&#xA0;    CREATE*

*&#xA0; ------------------------------------------------------- */



  const createNote = () => {

    const newNote: NoteItem = {

      id: `note-${Date.now()}`,

      title: 'Untitled Note',

      content: '',

      category: 'Personal',

      updatedAt: 'Just now',

      colorId: 'default',

      pinned: false,

      archived: false,

      createdAt: new Date().toISOString(),

    };



    const updated = [newNote, ...notes];



    saveNotes(updated);

    setActiveNoteId(newNote.id);

    setShowArchived(false);



    setTimeout(() => {

      titleInputRef.current?.focus();

      titleInputRef.current?.select();

    }, 50);

  };



  /* -------------------------------------------------------*

*&#xA0;    UPDATE*

*&#xA0; ------------------------------------------------------- */



  const updateActiveNote = (

    fields: Partial<NoteItem>

  ) => {

    if (!activeNote) return;



    const updated = notes.map(note =>

      note.id === activeNote.id

        ? {

            ...note,

            ...fields,

            updatedAt: formatUpdatedTime(),

          }

        : note

    );



    saveNotes(updated);

  };



  /* -------------------------------------------------------*

*&#xA0;    DELETE*

*&#xA0; ------------------------------------------------------- */



  const deleteNote = (id: string) => {

    const index = notes.findIndex(note => note.id === id);



    const updated = notes.filter(note => note.id !== id);



    saveNotes(updated);



    if (id === activeNoteId) {

      const nextNote =

        updated[index] ||

        updated[index - 1] ||

        updated[0];



      setActiveNoteId(nextNote?.id || '');

    }



    setConfirmDelete(false);

  };



  /* -------------------------------------------------------*

*&#xA0;    DUPLICATE*

*&#xA0; ------------------------------------------------------- */



  const duplicateNote = () => {

    if (!activeNote) return;



    const duplicate: NoteItem = {

      ...activeNote,

      id: `note-${Date.now()}`,

      title: `${activeNote.title} Copy`,

      createdAt: new Date().toISOString(),

      updatedAt: 'Just now',

      pinned: false,

    };



    const index = notes.findIndex(

      note => note.id === activeNote.id

    );



    const updated = [...notes];



    updated.splice(index + 1, 0, duplicate);



    saveNotes(updated);

    setActiveNoteId(duplicate.id);

  };



  /* -------------------------------------------------------*

*&#xA0;    PIN*

*&#xA0; ------------------------------------------------------- */



  const togglePin = () => {

    if (!activeNote) return;



    updateActiveNote({

      pinned: !activeNote.pinned,

    });

  };



  /* -------------------------------------------------------*

*&#xA0;    ARCHIVE*

*&#xA0; ------------------------------------------------------- */



  const toggleArchive = () => {

    if (!activeNote) return;



    updateActiveNote({

      archived: !activeNote.archived,

    });



    if (!activeNote.archived) {

      const remaining = notes.filter(

        note => note.id !== activeNote.id && !note.archived

      );



      setActiveNoteId(remaining[0]?.id || '');

    }

  };



  /* -------------------------------------------------------*

*&#xA0;    CLEAR NOTE*

*&#xA0; ------------------------------------------------------- */



  const clearNote = () => {

    if (!activeNote) return;



    updateActiveNote({

      content: '',

    });

  };



  /* -------------------------------------------------------*

*&#xA0;    RESET DEMO NOTES*

*&#xA0; ------------------------------------------------------- */



  const resetNotes = () => {

    saveNotes(DEFAULT_NOTES);

    setActiveNoteId(DEFAULT_NOTES[0].id);

    setShowArchived(false);

    setMoreOpen(false);

  };



  /* -------------------------------------------------------*

*&#xA0;    KEYBOARD SHORTCUTS*

*&#xA0; ------------------------------------------------------- */



  useEffect(() => {

    const handleKeyDown = (event: KeyboardEvent) => {

      const modifier = event.ctrlKey || event.metaKey;



      if (modifier && event.key.toLowerCase() === 'n') {

        event.preventDefault();

        createNote();

      }



      if (modifier && event.key.toLowerCase() === 'f') {

        event.preventDefault();



        const search =

          document.querySelector<HTMLInputElement>(

            '[data-notes-search]'

          );



        search?.focus();

      }



      if (modifier && event.key.toLowerCase() === 's') {

        event.preventDefault();

        setSavedIndicator(true);

      }



      if (event.key === 'Escape') {

        setColorAnchor(null);

        setSortOpen(false);

        setMoreOpen(false);

      }

    };



    window.addEventListener('keydown', handleKeyDown);



    return () => {

      window.removeEventListener('keydown', handleKeyDown);

    };

  }, [notes]);



  /* -------------------------------------------------------*

*&#xA0;    CATEGORY COUNTS*

*&#xA0; ------------------------------------------------------- */



  const counts = useMemo(

    () => ({

      all: notes.filter(note => !note.archived).length,

      recruiter: notes.filter(

        note =>

          note.category === 'Recruiter' && !note.archived

      ).length,

      project: notes.filter(

        note =>

          note.category === 'Project' && !note.archived

      ).length,

      personal: notes.filter(

        note =>

          note.category === 'Personal' && !note.archived

      ).length,

      archived: notes.filter(note => note.archived).length,

    }),

    [notes]

  );



  /* -------------------------------------------------------*

*&#xA0;    RENDER*

*&#xA0; ------------------------------------------------------- */



  return (

    <div

      className={`relative flex h-full w-full overflow-hidden bg-[#070b14] text-slate-100 font-sans ${

        fullscreen ? 'fixed inset-0 z-[9999]' : ''

      }`}

    >

      {/* ===================================================*

*&#xA0;         GLOBAL APP CSS*

*&#xA0;     =================================================== */}



      <style>

        {`

          @keyframes noteColorIn {

            from {

              opacity: 0;

              transform: translateY(-5px) scale(.96);

            }

            to {

              opacity: 1;

              transform: translateY(0) scale(1);

            }

          }



          @keyframes dropdownIn {

            from {

              opacity: 0;

              transform: translateY(-5px) scale(.97);

            }

            to {

              opacity: 1;

              transform: translateY(0) scale(1);

            }

          }



          @keyframes noteSlideIn {

            from {

              opacity: 0;

              transform: translateY(7px);

            }

            to {

              opacity: 1;

              transform: translateY(0);

            }

          }



          @keyframes glowPulse {

            0%,100% {

              opacity: .5;

            }

            50% {

              opacity: 1;

            }

          }



          .notes-scrollbar::-webkit-scrollbar {

            width: 7px;

            height: 7px;

          }



          .notes-scrollbar::-webkit-scrollbar-track {

            background: transparent;

          }



          .notes-scrollbar::-webkit-scrollbar-thumb {

            background: rgba(148,163,184,.18);

            border-radius: 999px;

          }



          .notes-scrollbar::-webkit-scrollbar-thumb:hover {

            background: rgba(148,163,184,.3);

          }



          .notes-no-scrollbar::-webkit-scrollbar {

            display: none;

          }



          .notes-no-scrollbar {

            scrollbar-width: none;

          }



          .note-editor::selection {

            background: rgba(96,165,250,.3);

          }



          textarea {

            field-sizing: content;

          }

        `}

      </style>



      {/* ===================================================*

*&#xA0;         BACKGROUND*

*&#xA0;     =================================================== */}



      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500/[0.035] blur-[100px]" />

        <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/[0.035] blur-[100px]" />

      </div>



      {/* ===================================================*

*&#xA0;         SIDEBAR*

*&#xA0;     =================================================== */}



      <aside

        className={`

          relative z-20 flex flex-col shrink-0

          border-r border-white/[0.08]

          bg-[#0b111e]/95 backdrop-blur-2xl

          transition-all duration-300 ease-out

          ${

            sidebarOpen

              ? 'w-[280px]'

              : 'w-0 overflow-hidden border-r-0'

          }

        `}

      >

        {/* Sidebar Header */}



        <div className="h-[68px] px-4 flex items-center justify-between border-b border-white/[0.07] shrink-0">

          <div className="flex items-center gap-3 min-w-0">

            <div

              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg"

              style={{

                background:

                  'linear-gradient(135deg,#fbbf24,#f59e0b)',

              }}

            >

              <StickyNote

                size={19}

                className="text-white"

              />

            </div>



            <div className="min-w-0">

              <div className="font-bold text-sm text-white truncate">

                Workstation Notes

              </div>



              <div className="text-[10px] text-slate-500">

                {counts.all} notes

              </div>

            </div>

          </div>



          <button

            type="button"

            onClick={createNote}

            title="New Note (Ctrl+N)"

            className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 hover:text-blue-300 transition-all hover:scale-105 active:scale-95"

          >

            <Plus size={17} />

          </button>

        </div>



        {/* Search */}



        <div className="p-3 shrink-0">

          <div className="relative">

            <Search

              size={15}

              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"

            />



            <input

              data-notes-search

              value={searchQuery}

              onChange={e =>

                setSearchQuery(e.target.value)

              }

              placeholder="Search notes..."

              className="w-full h-9 pl-9 pr-9 rounded-xl bg-black/20 border border-white/[0.07] text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500/40 focus:bg-blue-500/[0.04] transition-all"

            />



            {searchQuery && (

              <button

                type="button"

                onClick={() => setSearchQuery('')}

                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10"

              >

                <X size={13} />

              </button>

            )}

          </div>

        </div>



        {/* Navigation */}



        <div className="px-3 pb-3 space-y-1 shrink-0">

          <SidebarButton

            active={categoryFilter === 'All' && !showArchived}

            icon={<FileText size={15} />}

            label="All Notes"

            count={counts.all}

            onClick={() => {

              setCategoryFilter('All');

              setShowArchived(false);

            }}

          />



          <SidebarButton

            active={categoryFilter === 'Recruiter'}

            icon={<Tag size={15} />}

            label="Recruiter"

            count={counts.recruiter}

            accent="blue"

            onClick={() => {

              setCategoryFilter('Recruiter');

              setShowArchived(false);

            }}

          />



          <SidebarButton

            active={categoryFilter === 'Project'}

            icon={<Sparkles size={15} />}

            label="Projects"

            count={counts.project}

            accent="purple"

            onClick={() => {

              setCategoryFilter('Project');

              setShowArchived(false);

            }}

          />



          <SidebarButton

            active={categoryFilter === 'Personal'}

            icon={<StickyNote size={15} />}

            label="Personal"

            count={counts.personal}

            accent="yellow"

            onClick={() => {

              setCategoryFilter('Personal');

              setShowArchived(false);

            }}

          />



          <SidebarButton

            active={showArchived}

            icon={<Archive size={15} />}

            label="Archived"

            count={counts.archived}

            onClick={() => {

              setShowArchived(true);

              setCategoryFilter('All');

            }}

          />

        </div>



        {/* Divider */}



        <div className="mx-3 border-t border-white/[0.06]" />



        {/* Note List */}



        <div className="flex-1 overflow-y-auto notes-scrollbar p-2">

          {filteredNotes.length === 0 ? (

            <div className="h-full flex flex-col items-center justify-center text-center px-6">

              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">

                <Search

                  size={20}

                  className="text-slate-600"

                />

              </div>



              <div className="text-xs font-semibold text-slate-400">

                No notes found

              </div>



              <div className="text-[10px] text-slate-600 mt-1">

                Try another search or create a new note.

              </div>

            </div>

          ) : (

            <div className="space-y-1.5">

              {filteredNotes.map(note => {

                const color = getColor(note.colorId);

                const selected =

                  note.id === activeNoteId;



                return (

                  <button

                    key={note.id}

                    type="button"

                    onClick={() =>

                      setActiveNoteId(note.id)

                    }

                    className={`

                      relative w-full text-left p-3 rounded-xl

                      border transition-all duration-200

                      group animate-[noteSlideIn_180ms_ease-out]

                      ${

                        selected

                          ? 'bg-white/[0.065] border-white/[0.12] shadow-lg'

                          : 'border-transparent hover:bg-white/[0.035] hover:border-white/[0.06]'

                      }

                    `}

                  >

                    {selected && (

                      <span

                        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"

                        style={{

                          background: color.accent,

                        }}

                      />

                    )}



                    <div className="flex items-start gap-2">

                      <div

                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"

                        style={{

                          background: color.accent,

                          boxShadow: `0 0 8px ${color.accent}55`,

                        }}

                      />



                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-1.5">

                          <h3

                            className={`text-xs font-semibold truncate ${

                              selected

                                ? 'text-white'

                                : 'text-slate-300'

                            }`}

                          >

                            {note.title ||

                              'Untitled Note'}

                          </h3>



                          {note.pinned && (

                            <Pin

                              size={10}

                              className="shrink-0"

                              style={{

                                color: color.accent,

                              }}

                              fill="currentColor"

                            />

                          )}

                        </div>



                        <p className="text-[10px] leading-relaxed text-slate-500 line-clamp-2 mt-1.5">

                          {note.content ||

                            'Empty note...'}

                        </p>



                        <div className="flex items-center justify-between gap-2 mt-2.5">

                          <span className="text-[9px] text-slate-600 truncate">

                            {note.updatedAt}

                          </span>



                          <span

                            className="px-1.5 py-0.5 rounded-md text-[8px] font-semibold"

                            style={{

                              color: color.accent,

                              background: color.soft,

                            }}

                          >

                            {note.category}

                          </span>

                        </div>

                      </div>

                    </div>

                  </button>

                );

              })}

            </div>

          )}

        </div>



        {/* Sidebar Footer */}



        <div className="p-3 border-t border-white/[0.07] shrink-0">

          <div className="flex items-center justify-between text-[9px] text-slate-600">

            <span>Local storage</span>



            <span className="flex items-center gap-1.5 text-emerald-500/80">

              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[glowPulse_2s_infinite]" />

              Auto saved

            </span>

          </div>

        </div>

      </aside>



      {/* ===================================================*

*&#xA0;         MAIN AREA*

*&#xA0;     =================================================== */}



      <main className="relative z-10 flex-1 min-w-0 flex flex-col bg-[#080d18]">

        {/* =================================================*

*&#xA0;           TOP BAR*

*&#xA0;       ================================================= */}



        <header className="h-[68px] shrink-0 flex items-center gap-3 px-3 sm:px-5 border-b border-white/[0.07] bg-[#0b111e]/90 backdrop-blur-2xl">

          <button

            type="button"

            onClick={() =>

              setSidebarOpen(value => !value)

            }

            title="Toggle Sidebar"

            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"

          >

            <Menu size={17} />

          </button>



          {activeNote ? (

            <>

              <div className="flex-1 min-w-0">

                <input

                  ref={titleInputRef}

                  value={activeNote.title}

                  onChange={e =>

                    updateActiveNote({

                      title: e.target.value,

                    })

                  }

                  className="w-full bg-transparent outline-none text-sm sm:text-base font-bold text-white placeholder:text-slate-600 truncate"

                  placeholder="Untitled Note"

                />



                <div className="flex items-center gap-2 mt-0.5">

                  <span className="text-[9px] text-slate-600">

                    {activeNote.updatedAt}

                  </span>



                  {savedIndicator && (

                    <>

                      <span className="text-slate-700">

                        •

                      </span>



                      <span className="flex items-center gap-1 text-[9px] text-emerald-400/80 animate-[noteSlideIn_160ms_ease-out]">

                        <Check size={9} />

                        Saved

                      </span>

                    </>

                  )}

                </div>

              </div>



              {/* Header Actions */}



              <div className="flex items-center gap-1.5">

                {/* Pin */}



                <button

                  type="button"

                  onClick={togglePin}

                  title={

                    activeNote.pinned

                      ? 'Unpin Note'

                      : 'Pin Note'

                  }

                  className={`

                    hidden sm:flex w-9 h-9 rounded-xl items-center justify-center transition-all

                    ${

                      activeNote.pinned

                        ? 'bg-amber-400/15 text-amber-400'

                        : 'text-slate-500 hover:text-white hover:bg-white/[0.06]'

                    }

                  `}

                >

                  {activeNote.pinned ? (

                    <Pin size={15} fill="currentColor" />

                  ) : (

                    <Pin size={15} />

                  )}

                </button>



                {/* Color */}



                <div className="relative">

                  <button

                    type="button"

                    title="Note Color"

                    onClick={event => {

                      event.stopPropagation();



                      if (colorAnchor) {

                        setColorAnchor(null);

                      } else {

                        setColorAnchor(

                          event.currentTarget

                        );

                      }

                    }}

                    className={`

                      w-9 h-9 rounded-xl flex items-center justify-center

                      transition-all hover:bg-white/[0.06]

                      ${

                        colorAnchor

                          ? 'bg-white/[0.08] text-white'

                          : 'text-slate-500 hover:text-white'

                      }

                    `}

                  >

                    <Palette size={16} />

                  </button>



                  <ColorMenu

                    anchor={colorAnchor}

                    currentColor={activeNote.colorId}

                    onSelect={colorId =>

                      updateActiveNote({

                        colorId,

                      })

                    }

                    onClose={() =>

                      setColorAnchor(null)

                    }

                  />

                </div>



                {/* More */}



                <div className="relative">

                  <button

                    ref={moreButtonRef}
                    type="button"

                    onClick={() =>

                      setMoreOpen(value => !value)

                    }

                    title="More"

                    className={`

                      w-9 h-9 rounded-xl flex items-center justify-center transition-all

                      ${

                        moreOpen

                          ? 'bg-white/[0.08] text-white'

                          : 'text-slate-500 hover:text-white hover:bg-white/[0.06]'

                      }

                    `}

                  >

                    <MoreHorizontal size={17} />

                  </button>



                  <Dropdown
                      open={moreOpen}
                      anchor={moreButtonRef.current}
                      width={220}
                      onClose={() => setMoreOpen(false)}
                    >

                    <MenuItem

                      icon={

                        <Copy size={14} />

                      }

                      label="Duplicate Note"

                      onClick={() => {

                        duplicateNote();

                        setMoreOpen(false);

                      }}

                    />



                    <MenuItem

                      icon={

                        activeNote.archived ? (

                          <ArchiveRestore

                            size={14}

                          />

                        ) : (

                          <Archive size={14} />

                        )

                      }

                      label={

                        activeNote.archived

                          ? 'Restore Note'

                          : 'Archive Note'

                      }

                      onClick={() => {

                        toggleArchive();

                        setMoreOpen(false);

                      }}

                    />



                    <MenuItem

                      icon={<Eraser size={14} />}

                      label="Clear Content"

                      onClick={() => {

                        clearNote();

                        setMoreOpen(false);

                      }}

                    />



                    <div className="h-px bg-white/[0.07] my-1" />



                    <MenuItem

                      danger

                      icon={<Trash2 size={14} />}

                      label="Delete Note"

                      onClick={() => {

                        setConfirmDelete(true);

                        setMoreOpen(false);

                      }}

                    />

                  </Dropdown>

                </div>



                {/* Fullscreen */}



                <button

                  type="button"

                  onClick={() =>

                    setFullscreen(value => !value)

                  }

                  title="Fullscreen"

                  className="hidden md:flex w-9 h-9 rounded-xl items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all"

                >

                  {fullscreen ? (

                    <Minimize2 size={15} />

                  ) : (

                    <Maximize2 size={15} />

                  )}

                </button>

              </div>

            </>

          ) : (

            <div className="flex-1 text-sm text-slate-500">

              No note selected

            </div>

          )}

        </header>



        {/* =================================================*

*&#xA0;           TOOLBAR*

*&#xA0;       ================================================= */}



        {activeNote && (

          <div className="h-[52px] shrink-0 px-3 sm:px-5 flex items-center gap-2 border-b border-white/[0.06] bg-[#0a101c]/90 backdrop-blur-xl overflow-x-auto notes-no-scrollbar">

            {/* Category */}



            <div className="relative shrink-0">

              <select

                value={activeNote.category}

                onChange={event =>

                  updateActiveNote({

                    category:

                      event.target.value as NoteCategory,

                  })

                }

                className="h-8 appearance-none pl-3 pr-8 rounded-lg bg-white/[0.045] border border-white/[0.07] text-[10px] font-semibold text-slate-300 outline-none cursor-pointer hover:bg-white/[0.07] transition"

              >

                <option value="Recruiter">

                  Recruiter

                </option>

                <option value="Project">

                  Project

                </option>

                <option value="Personal">

                  Personal

                </option>

              </select>



              <ChevronDown

                size={11}

                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"

              />

            </div>



            <div className="w-px h-5 bg-white/[0.08] shrink-0" />



            {/* Color Quick Action */}



            <button

              type="button"

              onClick={event =>

                setColorAnchor(event.currentTarget)

              }

              className="h-8 px-2.5 rounded-lg flex items-center gap-2 text-[10px] font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition shrink-0"

            >

              <span

                className="w-3 h-3 rounded-full"

                style={{

                  background: getColor(

                    activeNote.colorId

                  ).accent,

                }}

              />



              Color

            </button>



            <div className="w-px h-5 bg-white/[0.08] shrink-0" />



            {/* Pin */}



            <button

              type="button"

              onClick={togglePin}

              className={`

                h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-[10px] transition shrink-0

                ${

                  activeNote.pinned

                    ? 'bg-amber-400/10 text-amber-400'

                    : 'text-slate-500 hover:text-white hover:bg-white/[0.06]'

                }

              `}

            >

              <Pin

                size={12}

                fill={

                  activeNote.pinned

                    ? 'currentColor'

                    : 'none'

                }

              />



              {activeNote.pinned

                ? 'Pinned'

                : 'Pin'}

            </button>



            {/* Sort */}



            <div className="relative ml-auto shrink-0">

              <button

                ref={sortButtonRef}
                type="button"

                onClick={() =>

                  setSortOpen(value => !value)

                }

                className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-white hover:bg-white/[0.06] transition"

              >

                <SortAsc size={13} />

                Sort

                <ChevronDown size={10} />

              </button>



              <Dropdown
                open={sortOpen}
                anchor={sortButtonRef.current}
                width={220}
                onClose={() => setSortOpen(false)}
              >

                <MenuItem

                  icon={<Clock3 size={14} />}

                  label="Recently Updated"

                  active={sortMode === 'updated'}

                  onClick={() => {

                    setSortMode('updated');

                    setSortOpen(false);

                  }}

                />



                <MenuItem

                  icon={<Calendar size={14} />}

                  label="Recently Created"

                  active={sortMode === 'created'}

                  onClick={() => {

                    setSortMode('created');

                    setSortOpen(false);

                  }}

                />



                <MenuItem

                  icon={<SortAsc size={14} />}

                  label="Title A–Z"

                  active={sortMode === 'title'}

                  onClick={() => {

                    setSortMode('title');

                    setSortOpen(false);

                  }}

                />

              </Dropdown>

            </div>

          </div>

        )}



        {/* =================================================*

*&#xA0;           EDITOR*

*&#xA0;       ================================================= */}



        <div className="flex-1 min-h-0 overflow-hidden">

          {activeNote ? (

            <div

              className="h-full overflow-y-auto notes-scrollbar transition-colors duration-500"

              style={{

                background: getColor(

                  activeNote.colorId

                ).bg,

              }}

            >

              <div className="min-h-full w-full flex justify-center px-3 sm:px-6 py-5 sm:py-8">

                <div className="w-full max-w-4xl">

                  {/* Editor Card */}



                  <div

                    className="relative min-h-[calc(100vh-190px)] rounded-2xl border shadow-2xl overflow-hidden transition-all duration-500"

                    style={{

                      borderColor: `${getColor(

                        activeNote.colorId

                      ).border}66`,

                      background: `${getColor(

                        activeNote.colorId

                      ).bg}`,

                      boxShadow: `0 30px 90px ${getColor(

                        activeNote.colorId

                      ).accent}0b`,

                    }}

                  >

                    {/* Accent line */}



                    <div

                      className="absolute top-0 left-0 right-0 h-[2px]"

                      style={{

                        background: `linear-gradient(90deg, transparent, ${getColor(

                          activeNote.colorId

                        ).accent}, transparent)`,

                      }}

                    />



                    {/* Content */}



                    <div className="p-5 sm:p-8 md:p-10">

                      <div className="mb-7">

                        <div className="flex items-center gap-2 mb-3">

                          <span

                            className="w-2 h-2 rounded-full"

                            style={{

                              background:

                                getColor(

                                  activeNote.colorId

                                ).accent,

                              boxShadow: `0 0 12px ${getColor(

                                activeNote.colorId

                              ).accent}77`,

                            }}

                          />



                          <span

                            className="text-[10px] uppercase tracking-[0.18em] font-bold"

                            style={{

                              color:

                                getColor(

                                  activeNote.colorId

                                ).accent,

                            }}

                          >

                            {activeNote.category}

                          </span>



                          {activeNote.pinned && (

                            <Pin

                              size={11}

                              style={{

                                color:

                                  getColor(

                                    activeNote.colorId

                                  ).accent,

                              }}

                              fill="currentColor"

                            />

                          )}

                        </div>



                        <input

                          value={activeNote.title}

                          onChange={event =>

                            updateActiveNote({

                              title:

                                event.target.value,

                            })

                          }

                          placeholder="Untitled Note"

                          className="w-full bg-transparent border-none outline-none text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white placeholder:text-white/20"

                        />

                      </div>



                      {/* Main textarea */}



                      <textarea

                        value={activeNote.content}

                        onChange={event =>

                          updateActiveNote({

                            content:

                              event.target.value,

                          })

                        }

                        placeholder="Start writing your note..."

                        spellCheck

                        className="note-editor block w-full min-h-[430px] resize-none bg-transparent border-none outline-none text-sm sm:text-[15px] leading-7 text-slate-300 placeholder:text-slate-600"

                        style={{

                          caretColor:

                            getColor(

                              activeNote.colorId

                            ).accent,

                        }}

                      />



                      {/* Bottom metadata */}



                      <div className="mt-8 pt-5 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3">

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-600">

                          <span>

                            {getWordCount(

                              activeNote.content

                            )}{' '}

                            words

                          </span>



                          <span>

                            {getCharacterCount(

                              activeNote.content

                            )}{' '}

                            characters

                          </span>



                          <span>

                            Created{' '}

                            {new Date(

                              activeNote.createdAt

                            ).toLocaleDateString()}

                          </span>

                        </div>



                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600">

                          <Save size={11} />

                          Changes saved locally

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ) : (

            /* EMPTY STATE */



            <div className="h-full flex items-center justify-center p-6">

              <div className="text-center max-w-sm">

                <div className="mx-auto w-16 h-16 rounded-3xl bg-amber-400/10 border border-amber-400/15 flex items-center justify-center mb-5">

                  <StickyNote

                    size={27}

                    className="text-amber-400"

                  />

                </div>



                <h2 className="text-lg font-bold text-white">

                  No note selected

                </h2>



                <p className="text-xs text-slate-500 mt-2 leading-relaxed">

                  Create a new note and start writing

                  something beautiful.

                </p>



                <button

                  type="button"

                  onClick={createNote}

                  className="mt-5 h-10 px-5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold flex items-center gap-2 mx-auto transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-blue-500/20"

                >

                  <Plus size={15} />

                  Create Note

                </button>

              </div>

            </div>

          )}

        </div>



        {/* =================================================*

*&#xA0;           STATUS BAR*

*&#xA0;       ================================================= */}



        <footer className="h-[32px] shrink-0 px-3 sm:px-5 flex items-center justify-between border-t border-white/[0.06] bg-[#080d18] text-[9px] text-slate-600">

          <div className="flex items-center gap-3">

            <span>

              {filteredNotes.length} note

              {filteredNotes.length === 1 ? '' : 's'}

            </span>



            <span className="hidden sm:inline">

              Local workspace

            </span>

          </div>



          <div className="flex items-center gap-3">

            {activeNote && (

              <>

                <span>

                  {getWordCount(

                    activeNote.content

                  )}{' '}

                  words

                </span>



                <span>

                  {getCharacterCount(

                    activeNote.content

                  )}{' '}

                  chars

                </span>

              </>

            )}



            <span className="flex items-center gap-1 text-emerald-500/70">

              <Check size={9} />

              Saved

            </span>

          </div>

        </footer>

      </main>



      {/* ===================================================*

*&#xA0;         DELETE CONFIRMATION*

*&#xA0;     =================================================== */}



      {confirmDelete &&

        activeNote &&

        createPortal(

          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-5 bg-black/60 backdrop-blur-md">

            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111827] shadow-[0_30px_100px_rgba(0,0,0,.6)] p-5 animate-[dropdownIn_160ms_ease-out]">

              <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-4">

                <Trash2 size={19} />

              </div>



              <h3 className="text-base font-bold text-white">

                Delete this note?

              </h3>



              <p className="text-xs text-slate-500 mt-2 leading-relaxed">

                "{activeNote.title}" will be permanently

                removed from this Notes workspace.

              </p>



              <div className="flex justify-end gap-2 mt-6">

                <button

                  type="button"

                  onClick={() =>

                    setConfirmDelete(false)

                  }

                  className="h-9 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-xs font-semibold text-slate-300 transition"

                >

                  Cancel

                </button>



                <button

                  type="button"

                  onClick={() =>

                    deleteNote(activeNote.id)

                  }

                  className="h-9 px-4 rounded-xl bg-red-500 hover:bg-red-400 text-xs font-semibold text-white transition shadow-lg shadow-red-500/20"

                >

                  Delete Note

                </button>

              </div>

            </div>

          </div>,

          document.body

        )}

    </div>

  );

};



/* =========================================================*

*&#xA0;  SIDEBAR BUTTON*

*========================================================= */



interface SidebarButtonProps {

  active: boolean;

  icon: React.ReactNode;

  label: string;

  count: number;

  accent?: 'blue' | 'purple' | 'yellow';

  onClick: () => void;

}



const SidebarButton: React.FC<SidebarButtonProps> = ({

  active,

  icon,

  label,

  count,

  accent = 'blue',

  onClick,

}) => {

  const accentClasses = {

    blue: 'text-blue-400',

    purple: 'text-purple-400',

    yellow: 'text-amber-400',

  };



  return (

    <button

      type="button"

      onClick={onClick}

      className={`

        w-full h-9 px-3 rounded-xl flex items-center gap-2.5

        text-[11px] font-medium transition-all duration-200

        ${

          active

            ? 'bg-white/[0.065] text-white shadow-sm'

            : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.035]'

        }

      `}

    >

      <span

        className={

          active

            ? accentClasses[accent]

            : 'text-slate-600'

        }

      >

        {icon}

      </span>



      <span className="flex-1 text-left">

        {label}

      </span>



      <span

        className={`text-[9px] ${

          active

            ? 'text-slate-400'

            : 'text-slate-700'

        }`}

      >

        {count}

      </span>

    </button>

  );

};



/* =========================================================*

*&#xA0;  MENU ITEM*

*========================================================= */



interface MenuItemProps {

  icon: React.ReactNode;

  label: string;

  onClick: () => void;

  danger?: boolean;

  active?: boolean;

}



const MenuItem: React.FC<MenuItemProps> = ({

  icon,

  label,

  onClick,

  danger = false,

  active = false,

}) => {

  return (

    <button

      type="button"

      onClick={onClick}

      className={`

        w-full h-9 px-2.5 rounded-xl flex items-center gap-2.5

        text-[10px] font-medium transition-all

        ${

          danger

            ? 'text-red-400 hover:bg-red-500/10'

            : active

            ? 'text-white bg-white/[0.07]'

            : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'

        }

      `}

    >

      {icon}



      <span className="flex-1 text-left">

        {label}

      </span>



      {active && (

        <Check

          size={12}

          className="text-blue-400"

        />

      )}

    </button>

  );

};



export default NotesApp;