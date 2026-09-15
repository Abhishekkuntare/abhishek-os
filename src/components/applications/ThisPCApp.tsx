import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';
import { AppIcon } from '../ui/AppIcon';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RefreshCw,
  Search,
  LayoutGrid,
  List,
  HardDrive,
  Folder,
  ChevronRight,
  Monitor,
  FileCode,
  Shield,
  Layers,
} from 'lucide-react';

interface DriveItem {
  letter: string;
  name: string;
  label: string;
  usedGB: number;
  totalGB: number;
  appId: AppId;
}

const DRIVES: DriveItem[] = [
  {
    letter: 'C:',
    name: 'Local Disk (C:)',
    label: 'About Abhishek & OS Core',
    usedGB: 182,
    totalGB: 512,
    appId: 'about',
  },
  {
    letter: 'D:',
    name: 'Projects Volume (D:)',
    label: 'AI & Web Applications',
    usedGB: 412,
    totalGB: 1024,
    appId: 'projects',
  },
  {
    letter: 'E:',
    name: 'Workstation Data (E:)',
    label: 'Experience, Skills & Credentials',
    usedGB: 64,
    totalGB: 256,
    appId: 'experience',
  },
];

const FOLDERS: { name: string; appId: AppId; icon: string; desc: string; count: string }[] = [
  { name: 'About', appId: 'about', icon: 'UserCheck', desc: 'System properties & bio', count: '1 profile' },
  { name: 'Projects', appId: 'projects', icon: 'FolderKanban', desc: 'KrishiMitra, Amba, CraveVerse', count: '3+ projects' },
  { name: 'Experience', appId: 'experience', icon: 'Briefcase', desc: 'Videoit.io, Fitness Fuel, Edsquare', count: '3 roles' },
  { name: 'Skills', appId: 'skills', icon: 'Cpu', desc: 'Languages, Frontend, AI/APIs', count: '31 skills' },
  { name: 'Education', appId: 'education', icon: 'GraduationCap', desc: 'B.Tech Information Technology', count: 'PRMIT&R' },
  { name: 'Certifications', appId: 'certifications', icon: 'Award', desc: 'Professional credentials', count: 'Verified' },
  { name: 'Contact', appId: 'contact', icon: 'Mail', desc: 'Email, phone, inquiry form', count: 'Direct channels' },
];

export const ThisPCApp: React.FC = () => {
  const { openApp, projects, skills, experiences } = useOS();
  const [currentPath, setCurrentPath] = useState('This PC');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFolders = FOLDERS.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none">
      {/* Explorer Toolbar */}
      <div className="h-10 px-3 border-b border-white/10 bg-slate-900/80 flex items-center justify-between gap-2">
        {/* Nav arrows & Path Bar */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setCurrentPath('This PC')}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white opacity-40 cursor-not-allowed"
            title="Forward"
            disabled
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentPath('This PC')}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          {/* Breadcrumbs */}
          <div className="flex-1 flex items-center px-2.5 py-1 rounded bg-slate-800/80 border border-white/10 text-xs font-mono text-slate-300 min-w-0">
            <Monitor className="w-3.5 h-3.5 text-sky-400 mr-1.5 shrink-0" />
            <span className="truncate">{currentPath}</span>
          </div>
        </div>

        {/* Search & View Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-36 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search This PC..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-white/10 rounded pl-8 pr-2 py-1 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div className="flex items-center bg-slate-800/80 rounded border border-white/10 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded text-xs ${viewMode === 'grid' ? 'bg-sky-500/30 text-sky-300' : 'text-slate-400 hover:text-white'}`}
              title="Tiles view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1 rounded text-xs ${viewMode === 'list' ? 'bg-sky-500/30 text-sky-300' : 'text-slate-400 hover:text-white'}`}
              title="Details view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Body: Sidebar + Main File Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Tree */}
        <div className="w-48 hidden md:flex flex-col border-r border-white/10 bg-slate-900/40 p-2 space-y-4 overflow-y-auto text-xs">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
              Quick Access
            </div>
            <div className="space-y-0.5">
              {FOLDERS.map(f => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => openApp(f.appId)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white text-left transition-colors"
                >
                  <AppIcon name={f.icon} className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="truncate">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
              Conceptual Drives
            </div>
            <div className="space-y-0.5">
              {DRIVES.map(d => (
                <button
                  key={d.letter}
                  type="button"
                  onClick={() => openApp(d.appId)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white text-left transition-colors"
                >
                  <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{d.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Pane */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Folders Section */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
              <span>Folders ({filteredFolders.length})</span>
              <span className="text-[10px] lowercase text-slate-400 font-normal">Double-click to open</span>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredFolders.map(folder => (
                  <div
                    key={folder.name}
                    id={`folder-${folder.name.toLowerCase()}`}
                    onDoubleClick={() => openApp(folder.appId)}
                    onClick={() => {}}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/8 hover:border-sky-500/40 transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Folder className="w-5 h-5 text-sky-400 fill-sky-400/20" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                        {folder.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {folder.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden divide-y divide-white/5 text-xs">
                {filteredFolders.map(folder => (
                  <div
                    key={folder.name}
                    onDoubleClick={() => openApp(folder.appId)}
                    className="flex items-center justify-between px-3 py-2.5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className="w-4 h-4 text-sky-400 fill-sky-400/20" />
                      <span className="font-medium text-slate-200">{folder.name}</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">{folder.desc}</span>
                    <span className="text-slate-400 text-[11px] font-mono">{folder.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Devices and Drives Section */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
              Devices and Drives ({DRIVES.length})
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DRIVES.map(drive => {
                const percentUsed = Math.round((drive.usedGB / drive.totalGB) * 100);
                const freeGB = drive.totalGB - drive.usedGB;

                return (
                  <div
                    key={drive.letter}
                    onDoubleClick={() => openApp(drive.appId)}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/8 hover:border-sky-500/40 transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-slate-300 group-hover:text-sky-400">
                      <HardDrive className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                          {drive.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {percentUsed}%
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-500 rounded-full"
                          style={{ width: `${percentUsed}%` }}
                        />
                      </div>

                      <p className="text-[10px] text-slate-400 truncate">
                        {freeGB} GB free of {drive.totalGB} GB ({drive.label})
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Environment Summary */}
          <div className="p-3.5 rounded-xl bg-slate-900/30 border border-white/5 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Computer: <strong className="text-slate-200">ABHISHEK-WORKSTATION</strong></span>
            </div>
            <div className="font-mono text-[11px] text-slate-400">
              C:\Users\Abhishek\Portfolio • Storage Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
