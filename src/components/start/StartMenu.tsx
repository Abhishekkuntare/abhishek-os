import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';
import { AppIcon } from '../ui/AppIcon';
import { PROFILE_INFO } from '../../data/initialData';
import {
  Search,
  Power,
  Moon,
  RotateCcw,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BriefcaseBusiness,
  Code2,
} from 'lucide-react';

const START_PINNED_APPS: { appId: AppId; title: string; icon: string }[] = [
  { appId: 'browser', title: 'Browser', icon: 'Globe' },
  { appId: 'projects', title: 'Projects', icon: 'FolderKanban' },
  { appId: 'code-editor', title: 'Abhishek Code', icon: 'Code2' },
  { appId: 'writer', title: 'Writer', icon: 'FileText' },
  { appId: 'sheets', title: 'Sheets', icon: 'Table' },
  { appId: 'arcade', title: 'Arcade', icon: 'Gamepad2' },
  { appId: 'camera', title: 'Camera', icon: 'Camera' },
  { appId: 'achievements', title: 'Trophies', icon: 'Trophy' },
  { appId: 'video-player', title: 'Videos', icon: 'Video' },
  { appId: 'youtube', title: 'YouTube', icon: 'Youtube' },
  { appId: 'spotify', title: 'Spotify', icon: 'Music' },
  { appId: 'gallery', title: 'Gallery', icon: 'Images' },
  { appId: 'terminal', title: 'Terminal', icon: 'Terminal' },
  { appId: 'about', title: 'About Me', icon: 'UserCheck' },
  { appId: 'experience', title: 'Experience', icon: 'Briefcase' },
  { appId: 'skills', title: 'Skills', icon: 'Cpu' },
  { appId: 'widgets', title: 'Widgets', icon: 'Sparkles' },
  { appId: 'weather', title: 'Weather', icon: 'CloudSun' },
  { appId: 'calculator', title: 'Calculator', icon: 'Calculator' },
  { appId: 'notes', title: 'Notes', icon: 'StickyNote' },
  { appId: 'calendar', title: 'Calendar', icon: 'Calendar' },
  { appId: 'resume', title: 'Resume', icon: 'FileText' },
  { appId: 'contact', title: 'Contact', icon: 'Mail' },
  { appId: 'system-monitor', title: 'Task Manager', icon: 'Activity' },
  { appId: 'settings', title: 'Settings', icon: 'Settings' },
];

export const StartMenu: React.FC = () => {
  const {
    isStartMenuOpen,
    setStartMenuOpen,
    openApp,
    projects,
    setSearchOpen,
    restartSystem,
    shutdownSystem,
    sleepSystem,
    settings,
    activateMode,
  } = useOS();

  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [filterText, setFilterText] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('#taskbar-start-btn')
      ) {
        setStartMenuOpen(false);
      }
    };
    if (isStartMenuOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isStartMenuOpen, setStartMenuOpen]);

  if (!isStartMenuOpen) return null;

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  const filteredApps = START_PINNED_APPS.filter(app =>
    app.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <motion.div
      ref={menuRef}
      id="windows-start-menu"
      initial={settings.animationsEnabled ? { opacity: 0, y: 20, scale: 0.96 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={settings.animationsEnabled ? { opacity: 0, y: 15, scale: 0.96 } : undefined}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[94vw] max-w-160 max-h-[82vh] z-9100 flex flex-col rounded-2xl bg-slate-900/95 border border-white/12 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-3xl overflow-hidden text-slate-100 select-none"
    >
      {/* Top Search bar */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Type here to search apps, skills, projects..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setSearchOpen(true);
                setStartMenuOpen(false);
              }
            }}
            className="w-full bg-slate-800/80 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-slate-800 transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* Main scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-2 space-y-5">
        {/* Curated workspaces */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {([
            {
              mode: 'recruiter' as const,
              title: 'Recruiter Mode',
              subtitle: 'Resume, impact & best-fit roles',
              icon: BriefcaseBusiness,
              color: 'from-emerald-500/25 to-sky-500/15',
            },
            {
              mode: 'developer' as const,
              title: 'Developer Mode',
              subtitle: 'Code, APIs & system workspace',
              icon: Code2,
              color: 'from-violet-500/25 to-sky-500/15',
            },
          ]).map(({ mode, title, subtitle, icon: Icon, color }) => (
            <button
              key={mode}
              type="button"
              onClick={() => { activateMode(mode); setStartMenuOpen(false); }}
              className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                settings.workspaceMode === mode
                  ? `border-sky-400/60 bg-gradient-to-br ${color} shadow-[0_0_24px_rgba(56,189,248,.12)]`
                  : 'border-white/10 bg-white/[0.035] hover:border-white/25 hover:bg-white/[0.08]'
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950/50">
                <Icon className="h-5 w-5 text-sky-300 transition-transform group-hover:scale-110" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-white">{title}</span>
                <span className="mt-0.5 block truncate text-[10px] text-slate-400">{subtitle}</span>
              </span>
              {settings.workspaceMode === mode && <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-sky-300">Active</span>}
            </button>
          ))}
        </section>
        {settings.workspaceMode === 'recruiter' && (
          <section className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-emerald-200">Best-fit roles</div>
                <p className="mt-0.5 text-[10px] text-slate-400">A quick match snapshot for your next conversation.</p>
              </div>
              <BriefcaseBusiness className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['Senior Frontend Engineer', 'Full-stack Product Engineer', 'AI Platform Engineer'].map(role => (
                <span key={role} className="rounded-full border border-emerald-300/20 bg-slate-950/30 px-2 py-1 text-[10px] text-emerald-100">
                  {role}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Pinned Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-semibold text-slate-300">Pinned Applications</span>
            <button
              type="button"
              onClick={() => openApp('projects')}
              className="text-[11px] font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              All apps <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
            {filteredApps.map(app => (
              <button
                key={app.appId}
                type="button"
                id={`start-app-${app.appId}`}
                onClick={() => {
                  openApp(app.appId);
                  setStartMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl hover:bg-white/10 transition-colors group text-center"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/90 border border-white/10 group-hover:scale-110 group-hover:bg-slate-700/80 transition-all shadow-sm mb-1.5">
                  <AppIcon name={app.icon} className="w-5 h-5 text-sky-400 group-hover:text-sky-300" />
                </div>
                <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate max-w-full">
                  {app.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended / Featured Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300">Featured Projects</span>
            </div>
            <span className="text-[10px] text-slate-400">Recently Updated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {featuredProjects.map(proj => (
              <button
                key={proj.id}
                type="button"
                id={`start-featured-${proj.id}`}
                onClick={() => {
                  openApp('projects', { selectedProjectSlug: proj.slug });
                  setStartMenuOpen(false);
                }}
                className="flex flex-col p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-white/8 hover:border-sky-500/30 transition-all text-left group"
              >
                <div className="w-full h-18 rounded-lg overflow-hidden mb-2 bg-slate-900 relative">
                  <img
                    src={proj.thumbnail_url}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-sky-500/80 text-white backdrop-blur-xs">
                    {proj.year}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 truncate">
                  {proj.title}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {proj.short_description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Profile & Power Footer */}
      <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-slate-950/60 flex items-center justify-between relative">
        {/* Profile */}
        <button
          type="button"
          onClick={() => {
            openApp('about');
            setStartMenuOpen(false);
          }}
          className="flex items-center gap-2.5 p-1.5 -ml-1.5 rounded-xl hover:bg-white/10 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
            AK
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
              <span>{PROFILE_INFO.name}</span>
            </div>
            <div className="text-[10px] text-slate-400">{PROFILE_INFO.role}</div>
          </div>
        </button>

        {/* Power Menu Button */}
        <div className="relative">
          <button
            type="button"
            id="start-power-btn"
            aria-label="Power Options"
            onClick={() => setShowPowerMenu(prev => !prev)}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Power"
          >
            <Power className="w-4 h-4 text-sky-400" />
          </button>

          {/* Power Options Popover */}
          {showPowerMenu && (
            <div className="absolute bottom-12 right-0 w-44 rounded-xl bg-slate-900 border border-white/15 shadow-2xl backdrop-blur-2xl p-1.5 z-9999 text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowPowerMenu(false);
                  sleepSystem();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-slate-200 hover:text-white transition-colors text-left"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sleep</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPowerMenu(false);
                  restartSystem();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-slate-200 hover:text-white transition-colors text-left"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>Restart</span>
              </button>

              <div className="h-px bg-white/10 my-1" />

              <button
                type="button"
                onClick={() => {
                  setShowPowerMenu(false);
                  shutdownSystem();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Shut Down</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
