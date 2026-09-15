import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Download, ExternalLink, Search, Sparkles, Store, Trash2, Zap } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';
import { AppIcon } from '../ui/AppIcon';

type StoreCategory = 'All' | 'Games' | 'Development' | 'Productivity' | 'System' | 'Portfolio';
type StoreItem = {
  id: string;
  launchId: AppId;
  gameId?: string;
  name: string;
  tagline: string;
  description: string;
  category: Exclude<StoreCategory, 'All'>;
  icon: string;
  color: string;
  builtIn?: boolean;
  featured?: boolean;
};

const CATALOG: StoreItem[] = [
  { id: 'game-neon-snake', launchId: 'arcade', gameId: 'snake', name: 'Neon Snake', tagline: 'Grow. Glow. Beat your best.', description: 'A fast neon grid chase with escalating speed, golden food, and local high scores.', category: 'Games', icon: 'Gamepad2', color: 'from-emerald-400 to-cyan-600', featured: true },
  { id: 'game-2048', launchId: 'arcade', gameId: '2048', name: '2048', tagline: 'Merge your way to mastery', description: 'Slide, merge, and plan ahead in a polished local number puzzle.', category: 'Games', icon: 'Grid2X2', color: 'from-amber-400 to-orange-600' },
  { id: 'game-minesweeper', launchId: 'arcade', gameId: 'minesweeper', name: 'Minesweeper', tagline: 'Clear the field', description: 'Reveal safe tiles, flag mines, and protect your best time.', category: 'Games', icon: 'Bomb', color: 'from-sky-400 to-blue-700' },
  { id: 'game-memory-match', launchId: 'arcade', gameId: 'memory', name: 'Memory Match', tagline: 'Find the pairs', description: 'Flip original OS-themed cards, build combos, and finish with fewer moves.', category: 'Games', icon: 'Brain', color: 'from-pink-400 to-rose-700' },
  { id: 'game-flappy-pixel', launchId: 'arcade', gameId: 'flappy-pixel', name: 'Flappy Pixel', tagline: 'One tap. One more run.', description: 'Guide an original pixel pilot through procedural gates.', category: 'Games', icon: 'Zap', color: 'from-cyan-400 to-indigo-700' },
  { id: 'game-breakout', launchId: 'arcade', gameId: 'breakout', name: 'Breakout', tagline: 'Bounce back', description: 'Break the wall, chase combos, and keep the ball alive.', category: 'Games', icon: 'CircleDot', color: 'from-red-400 to-orange-700' },
  { id: 'game-tic-tac-toe', launchId: 'arcade', gameId: 'tic-tac-toe', name: 'Tic-Tac-Toe', tagline: 'Classic, locally powered', description: 'Play a quick match against a friend or the built-in computer.', category: 'Games', icon: 'Grid3X3', color: 'from-indigo-400 to-blue-700' },
  { id: 'game-chess', launchId: 'arcade', gameId: 'chess', name: 'Chess', tagline: 'Think several moves ahead', description: 'A focused local board for two-player chess sessions.', category: 'Games', icon: 'Crown', color: 'from-slate-300 to-slate-600' },
  { id: 'game-word-challenge', launchId: 'arcade', gameId: 'word-challenge', name: 'Word Challenge', tagline: 'Type. Combo. Improve.', description: 'A quick typing challenge with accuracy, streaks, and personal records.', category: 'Games', icon: 'Type', color: 'from-fuchsia-400 to-purple-700' },
  { id: 'code-editor', launchId: 'code-editor', name: 'Code Studio', tagline: 'Ship code with focus', description: 'A focused TypeScript workspace with tabs, a project tree, and live editing tools.', category: 'Development', icon: 'Code2', color: 'from-cyan-500 to-blue-600', featured: true },
  { id: 'browser', launchId: 'browser', name: 'Browser', tagline: 'Explore the web', description: 'A fast developer browser with tabs, bookmarks, and an integrated search workspace.', category: 'Development', icon: 'Globe', color: 'from-blue-500 to-indigo-600', builtIn: true, featured: true },
  { id: 'git', launchId: 'git', name: 'Git Studio', tagline: 'See every change', description: 'Visual branches, commit timelines, staging, and diffs for your next release.', category: 'Development', icon: 'GitBranch', color: 'from-orange-500 to-rose-600', featured: true },
  { id: 'api-tester', launchId: 'api-tester', name: 'API Lab', tagline: 'Build better APIs', description: 'Send requests, inspect responses, and iterate on REST endpoints without leaving the OS.', category: 'Development', icon: 'Send', color: 'from-violet-500 to-fuchsia-600' },
  { id: 'writer', launchId: 'writer', name: 'Writer', tagline: 'Make ideas readable', description: 'A calm document editor for notes, drafts, and polished portfolio content.', category: 'Productivity', icon: 'FileText', color: 'from-amber-400 to-orange-600', builtIn: true },
  { id: 'sheets', launchId: 'sheets', name: 'Sheets', tagline: 'Think in tables', description: 'Formula-ready spreadsheets with charts and CSV export for everyday planning.', category: 'Productivity', icon: 'Table', color: 'from-emerald-400 to-teal-600', builtIn: true },
  { id: 'ai', launchId: 'ai', name: 'AI Copilot', tagline: 'A smarter workstation', description: 'Ask about the portfolio, draft content, and trigger safe OS workflows with AI assistance.', category: 'System', icon: 'Sparkles', color: 'from-fuchsia-500 to-purple-700', builtIn: true, featured: true },
  { id: 'performance', launchId: 'performance', name: 'Performance', tagline: 'Keep it fast', description: 'Runtime telemetry and web vitals to help tune your workstation experience.', category: 'System', icon: 'Activity', color: 'from-lime-400 to-green-600' },
  { id: 'security', launchId: 'security', name: 'Security', tagline: 'Stay in control', description: 'Review local permissions, audit status, and sandbox protections.', category: 'System', icon: 'ShieldCheck', color: 'from-sky-400 to-cyan-600' },
  { id: 'projects', launchId: 'projects', name: 'Projects', tagline: 'A portfolio in motion', description: 'Browse shipped work, technical challenges, and outcomes from Abhishek’s portfolio.', category: 'Portfolio', icon: 'FolderKanban', color: 'from-pink-500 to-red-600', builtIn: true },
  { id: 'resume', launchId: 'resume', name: 'Resume', tagline: 'Your story, ready', description: 'Open the latest resume and professional highlights.', category: 'Portfolio', icon: 'FileText', color: 'from-slate-400 to-slate-600', builtIn: true },
];

const STORAGE_KEY = 'abhishek-store-installed-v2';

export const StoreApp: React.FC = () => {
  const { openApp, addDesktopAppShortcut, removeDesktopAppShortcut, addNotification, desktopIcons } = useOS();
  const [category, setCategory] = useState<StoreCategory>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<StoreItem | null>(null);
  const [installed, setInstalled] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as AppId[];
      const shortcutIds = new Set(desktopIcons.map(icon => icon.id));
      return Array.from(new Set(saved.filter(id => shortcutIds.has(`store-${id}`))));
    } catch { return []; }
  });

  const visible = useMemo(() => CATALOG.filter(app =>
    (category === 'All' || app.category === category) &&
    `${app.name} ${app.tagline} ${app.description}`.toLowerCase().includes(query.toLowerCase())
  ), [category, query]);

  const setInstalledPersisted = (next: string[]) => {
    setInstalled(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  useEffect(() => {
    const shortcutIds = new Set(desktopIcons.map(icon => icon.id));
    const reconciled = Array.from(new Set([
      ...installed.filter(id => {
        const app = CATALOG.find(item => item.id === id);
        return Boolean(app && shortcutIds.has(`store-${id}`));
      }),
    ]));
    const discovered = CATALOG
      .filter(app => shortcutIds.has(`store-${app.id}`))
      .map(app => app.id);
    const nextInstalled = Array.from(new Set([...reconciled, ...discovered]));
    if (nextInstalled.join('|') !== installed.join('|')) {
      setInstalledPersisted(nextInstalled);
    }
  }, [desktopIcons, installed]);

  const install = (app: StoreItem) => {
    if (installed.includes(app.id)) return;
    const nextInstalled = Array.from(new Set([...installed, app.id]));
    setInstalledPersisted(nextInstalled);
    addDesktopAppShortcut(app.launchId, app.name, app.icon, `store-${app.id}`, app.gameId ? { gameId: app.gameId } : undefined);
    addNotification({ title: `${app.name} is ready`, message: 'Added to your desktop. This built-in web game runs locally — no external download was required.', type: 'success', appId: app.launchId });
  };

  const uninstall = (app: StoreItem) => {
    if (app.builtIn) return;
    setInstalledPersisted(installed.filter(id => id !== app.id));
    removeDesktopAppShortcut(`store-${app.id}`);
    addNotification({ title: `${app.name} removed`, message: 'The game was uninstalled and its desktop shortcut was removed.', type: 'info' });
  };

  if (selected) {
    const isInstalled = installed.includes(selected.id);
    return (
      <div className="h-full overflow-y-auto bg-[#080b14] text-slate-100">
        <div className="mx-auto max-w-4xl p-5 sm:p-8">
          <button onClick={() => setSelected(null)} className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"><ArrowLeft size={16} /> Back to Store</button>
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${selected.color} p-7 shadow-2xl`}>
            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black/20 shadow-inner"><AppIcon name={selected.icon} className="h-9 w-9 text-white" /></div><p className="mb-1 text-sm font-medium text-white/70">{selected.category} · Built into Abhishek OS</p><h1 className="text-4xl font-semibold tracking-tight">{selected.name}</h1><p className="mt-2 text-white/80">{selected.tagline}</p></div>
              <button onClick={() => openApp(selected.launchId, selected.gameId ? { gameId: selected.gameId } : undefined)} disabled={!isInstalled} className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">{isInstalled ? 'Open app' : 'Install to open'}</button>
            </div>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_260px]">
            <section><h2 className="text-lg font-semibold">About this app</h2><p className="mt-3 leading-7 text-slate-400">{selected.description} Everything runs locally inside this portfolio OS — there are no fake stores, external downloads, or hidden network installs.</p><div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-400"><span className="rounded-full bg-white/5 px-3 py-1.5">{selected.gameId ? 'Built-in web game' : 'Built-in experience'}</span><span className="rounded-full bg-white/5 px-3 py-1.5">Local state</span><span className="rounded-full bg-white/5 px-3 py-1.5">Desktop shortcut</span></div></section>
            <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="text-xs uppercase tracking-widest text-slate-500">Availability</p><p className="mt-3 text-sm text-slate-300">{isInstalled ? 'Installed on this workstation' : 'Available to install'}</p>{isInstalled && !selected.builtIn && <button onClick={() => uninstall(selected)} className="mt-5 flex items-center gap-2 text-sm text-rose-300 hover:text-rose-200"><Trash2 size={15} /> Uninstall</button>}</aside>
          </div>
        </div>
      </div>
    );
  }

  const featured = CATALOG.find(app => app.featured) || CATALOG[0];
  return (
    <div className="h-full overflow-y-auto bg-[#080b14] text-slate-100">
      <div className="mx-auto max-w-6xl p-5 sm:p-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-cyan-300"><Store size={18} /><span className="text-sm font-medium">Abhishek OS</span></div><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Abhishek Store</h1><p className="mt-2 text-sm text-slate-400">Built-in tools for the way you work.</p></div><label className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 sm:w-72"><Search size={16} className="text-slate-500" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search apps" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600" /></label></header>
        <section className={`relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br ${featured.color} p-6 shadow-2xl sm:p-8`}><div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" /><div className="relative max-w-xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Featured this week</p><h2 className="mt-3 text-3xl font-semibold">{featured.name}</h2><p className="mt-2 text-white/80">{featured.description}</p><button onClick={() => setSelected(featured)} className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">View details <ExternalLink className="ml-1 inline" size={14} /></button></div><Zap className="absolute bottom-6 right-8 h-20 w-20 text-white/20" /></section>
        <nav className="mt-8 flex gap-2 overflow-x-auto pb-1">{(['All', 'Games', 'Development', 'Productivity', 'System', 'Portfolio'] as StoreCategory[]).map(item => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${category === item ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>{item}</button>)}</nav>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visible.map(app => { const isInstalled = installed.includes(app.id); return <article key={app.id} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.06]"><button onClick={() => setSelected(app)} className="flex w-full items-start gap-3 text-left"><div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${app.color} shadow-lg`}><AppIcon name={app.icon} className="h-6 w-6 text-white" /></div><span className="min-w-0"><span className="block font-medium">{app.name}</span><span className="mt-0.5 block text-xs text-slate-500">{app.tagline}</span></span></button><p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">{app.description}</p><div className="mt-4 flex items-center justify-between"><span className="text-xs text-slate-600">{app.gameId ? 'Built-in web game' : app.builtIn ? 'Built-in' : app.category}</span>{isInstalled ?         <button onClick={() => openApp(app.launchId, app.gameId ? { gameId: app.gameId } : undefined)} className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-white/20"><Check size={13} /> Open</button> : <button onClick={() => install(app)} className="flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"><Download size={13} /> Install</button>}</div></article>; })}</div>
      </div>
    </div>
  );
};
