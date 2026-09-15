import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';
import { AppIcon } from '../ui/AppIcon';
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  Briefcase,
  Cpu,
  FolderKanban,
  FileText,
  Mail,
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'project' | 'skill' | 'experience' | 'app' | 'contact';
  title: string;
  subtitle: string;
  badge: string;
  appId: AppId;
  extraData?: any;
}

export const SearchPanel: React.FC = () => {
  const {
    isSearchOpen,
    setSearchOpen,
    openApp,
    projects,
    skills,
    experiences,
    settings,
  } = useOS();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('#taskbar-search-btn')
      ) {
        setSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, setSearchOpen]);

  if (!isSearchOpen) return null;

  // Compute matched items
  const cleanQ = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  if (cleanQ) {
    // 1. Projects
    projects.forEach(p => {
      const matchTitle = p.title.toLowerCase().includes(cleanQ);
      const matchTech = p.technologies.some(t => t.toLowerCase().includes(cleanQ));
      const matchDesc = p.short_description.toLowerCase().includes(cleanQ);

      if (matchTitle || matchTech || matchDesc) {
        results.push({
          id: `search-proj-${p.id}`,
          type: 'project',
          title: p.title,
          subtitle: p.technologies.join(' • '),
          badge: 'Project',
          appId: 'projects',
          extraData: { selectedProjectSlug: p.slug },
        });
      }
    });

    // 2. Skills
    skills.forEach(s => {
      if (s.name.toLowerCase().includes(cleanQ) || s.category.toLowerCase().includes(cleanQ)) {
        results.push({
          id: `search-skill-${s.id}`,
          type: 'skill',
          title: s.name,
          subtitle: `Category: ${s.category}`,
          badge: 'Skill',
          appId: 'skills',
        });
      }
    });

    // 3. Experience
    experiences.forEach(e => {
      const matchComp = e.company.toLowerCase().includes(cleanQ);
      const matchRole = e.role.toLowerCase().includes(cleanQ);
      const matchTech = e.technologies.some(t => t.toLowerCase().includes(cleanQ));
      const matchDesc = e.description.some(d => d.toLowerCase().includes(cleanQ));

      if (matchComp || matchRole || matchTech || matchDesc) {
        results.push({
          id: `search-exp-${e.id}`,
          type: 'experience',
          title: `${e.role} @ ${e.company}`,
          subtitle: `${e.start_date} – ${e.end_date} (${e.location})`,
          badge: 'Experience',
          appId: 'experience',
        });
      }
    });

    // 4. Contact
    if ('contact'.includes(cleanQ) || 'email'.includes(cleanQ) || 'phone'.includes(cleanQ)) {
      results.push({
        id: 'search-contact',
        type: 'contact',
        title: 'Contact Abhishek Kuntare',
        subtitle: 'Email: abhishekkuntare7@gmail.com • Phone: 9156075536',
        badge: 'Contact',
        appId: 'contact',
      });
    }

    // 5. Resume
    if ('resume'.includes(cleanQ) || 'cv'.includes(cleanQ) || 'pdf'.includes(cleanQ)) {
      results.push({
        id: 'search-resume',
        type: 'app',
        title: 'Abhishek Kuntare — Resume.pdf',
        subtitle: 'Preview and download the verified professional resume',
        badge: 'Resume',
        appId: 'resume',
      });
    }

    // 6. Workstation Tools & Apps
    const toolApps: { id: string; title: string; subtitle: string; appId: AppId; tags: string[] }[] = [
      { id: 'app-code', title: 'Abhishek Code Studio', subtitle: 'TypeScript code editor with virtual filesystem & terminal', appId: 'code-editor', tags: ['code', 'editor', 'dev', 'ts', 'ide', 'terminal', 'git'] },
      { id: 'app-writer', title: 'Abhishek Writer', subtitle: 'Word processor with rich formatting & autosave to VFS', appId: 'writer', tags: ['writer', 'word', 'doc', 'document', 'office', 'text'] },
      { id: 'app-sheets', title: 'Abhishek Sheets', subtitle: 'Spreadsheet engine with formula bar, math, and dynamic charts', appId: 'sheets', tags: ['sheets', 'excel', 'table', 'grid', 'chart', 'calc', 'formula'] },
      { id: 'app-camera', title: 'Camera & Video Studio', subtitle: 'Webcam photo filters, video recording, and snapshot gallery', appId: 'camera', tags: ['camera', 'photo', 'video', 'record', 'selfie', 'media'] },
      { id: 'app-arcade', title: 'Arcade Center', subtitle: 'Play retro Snake, Minesweeper, Solitaire, and Pixel Runner', appId: 'arcade', tags: ['game', 'arcade', 'play', 'snake', 'minesweeper', 'solitaire', 'runner'] },
      { id: 'app-achievements', title: 'Achievements & Milestones', subtitle: 'Track unlocked portfolio milestones, GamerScore, and XP', appId: 'achievements', tags: ['achievements', 'trophies', 'badges', 'xp', 'score'] },
      { id: 'app-files', title: 'File Explorer', subtitle: 'Manage virtual disks (C: and D:), documents, and media', appId: 'file-explorer', tags: ['files', 'explorer', 'folder', 'disk', 'vfs', 'storage'] },
      { id: 'app-video', title: 'Media Video Player', subtitle: 'Dedicated multimedia video player with playlist support', appId: 'video-player', tags: ['video', 'player', 'movie', 'clip', 'media'] },
    ];

    toolApps.forEach(t => {
      if (t.title.toLowerCase().includes(cleanQ) || t.tags.some(tag => tag.includes(cleanQ))) {
        results.push({
          id: t.id,
          type: 'app',
          title: t.title,
          subtitle: t.subtitle,
          badge: 'Application',
          appId: t.appId,
        });
      }
    });
  } else {
    // Default recommended queries
    results.push(
      {
        id: 'rec-km',
        type: 'project',
        title: 'KrishiMitra AI',
        subtitle: 'AI Crop Recommendations & Disease Diagnosis',
        badge: 'Featured',
        appId: 'projects',
        extraData: { selectedProjectSlug: 'krishimitra-ai' },
      },
      {
        id: 'rec-skills',
        type: 'skill',
        title: 'React.js & TypeScript Systems',
        subtitle: 'Explore full system specifications & skills',
        badge: 'Core Tech',
        appId: 'skills',
      },
      {
        id: 'rec-exp',
        type: 'experience',
        title: 'Software Developer @ Videoit.io',
        subtitle: '40%+ performance gains, video commerce frontend',
        badge: 'Experience',
        appId: 'experience',
      },
      {
        id: 'rec-resume',
        type: 'app',
        title: 'View & Download Resume',
        subtitle: 'Direct PDF viewer and download tool',
        badge: 'Document',
        appId: 'resume',
      }
    );
  }

  const handleSelect = (item: SearchResult) => {
    openApp(item.appId, item.extraData);
    setSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex] || results[0]);
    }
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return <FolderKanban className="w-4 h-4 text-sky-400" />;
      case 'skill':
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'experience':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'contact':
        return <Mail className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <motion.div
      ref={panelRef}
      id="windows-search-panel"
      initial={settings.animationsEnabled ? { opacity: 0, y: 20, scale: 0.96 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={settings.animationsEnabled ? { opacity: 0, y: 15, scale: 0.96 } : undefined}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[94vw] max-w-160 max-h-[82vh] z-9100 flex flex-col rounded-2xl bg-slate-900/95 border border-white/12 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-3xl overflow-hidden text-slate-100 select-none"
    >
      {/* Search Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <Search className="w-5 h-5 text-sky-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search projects, skills, experience, or tech (e.g., 'React', 'AI', 'Videoit')..."
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 border border-white/10 rounded">
            Ctrl+K
          </kbd>
        )}
      </div>

      {/* Results Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-60 max-h-96">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
          <span>{cleanQ ? `Matching Results (${results.length})` : 'Recommended Shortcuts'}</span>
          <span className="text-[10px] lowercase text-slate-400 font-normal">Press Enter to launch</span>
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 space-y-2">
            <Search className="w-8 h-8 opacity-30" />
            <p className="text-xs">No matching files or portfolio records found for "{query}".</p>
            <p className="text-[11px] text-slate-400">Try searching "React", "AI", "TypeScript", or "Experience".</p>
          </div>
        ) : (
          results.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.id}
                type="button"
                id={`search-res-${idx}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                  isSelected
                    ? 'bg-sky-500/20 border border-sky-400/30 text-white'
                    : 'hover:bg-white/5 border border-transparent text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 border border-white/10 shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-medium text-slate-100 truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 border border-white/10 text-slate-300">
                    {item.badge}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-300' : 'text-slate-600'}`} />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Quick category pills */}
      <div className="p-3 bg-slate-950/70 border-t border-white/10 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-400 shrink-0">Quick Filter:</span>
        <button
          type="button"
          onClick={() => setQuery('AI')}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 border border-white/10"
        >
          AI Projects
        </button>
        <button
          type="button"
          onClick={() => setQuery('React')}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10"
        >
          React.js
        </button>
        <button
          type="button"
          onClick={() => setQuery('TypeScript')}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10"
        >
          TypeScript
        </button>
        <button
          type="button"
          onClick={() => setQuery('Videoit')}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10"
        >
          Videoit.io
        </button>
      </div>
    </motion.div>
  );
};
