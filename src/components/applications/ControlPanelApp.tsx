import React from 'react';
import { Activity, ChevronRight, Palette, ShieldCheck, SlidersHorizontal, Sparkles, Settings2 } from 'lucide-react';
import { useOS } from '../../context/OSContext';

export const ControlPanelApp: React.FC = () => {
  const { openApp } = useOS();
  const sections = [
    { title: 'System & Security', description: 'Review protection boundaries and runtime status.', icon: ShieldCheck, color: 'text-emerald-300', app: 'security' as const },
    { title: 'Performance', description: 'Inspect live browser timing and workload telemetry.', icon: Activity, color: 'text-sky-300', app: 'performance' as const },
    { title: 'Personalization', description: 'Adjust wallpaper, theme, sound, and desktop behavior.', icon: Palette, color: 'text-violet-300', app: 'settings' as const },
  ];
  return (
    <div className="h-full overflow-y-auto bg-[#0b1220] text-slate-100">
      <header className="border-b border-white/10 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 px-6 py-7">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-300/30"><SlidersHorizontal className="h-7 w-7" /></div>
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Abhishek OS</p><h1 className="text-2xl font-semibold">Control Panel</h1><p className="mt-1 text-sm text-slate-400">A single place to manage your workstation experience.</p></div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-5 p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {sections.map(({ title, description, icon: Icon, color, app }) => (
            <button key={app} type="button" onClick={() => openApp(app)} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-300/40 hover:bg-white/[0.08]">
              <Icon className={`mb-4 h-6 w-6 ${color}`} /><h2 className="font-semibold">{title}</h2><p className="mt-1 min-h-10 text-xs leading-relaxed text-slate-400">{description}</p><span className="mt-4 flex items-center gap-1 text-xs font-medium text-indigo-300">Open section <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold"><Settings2 className="h-4 w-4 text-indigo-300" /> Quick actions</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => openApp('settings')} className="rounded-lg bg-indigo-500/20 px-3 py-2 text-xs text-indigo-200 hover:bg-indigo-500/30">Open Settings</button>
            <button type="button" onClick={() => openApp('security')} className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs text-emerald-200 hover:bg-emerald-500/25">Review security</button>
            <button type="button" onClick={() => openApp('performance')} className="rounded-lg bg-sky-500/15 px-3 py-2 text-xs text-sky-200 hover:bg-sky-500/25">View performance</button>
          </div>
          <p className="mt-4 flex items-center gap-2 text-[11px] text-slate-500"><Sparkles className="h-3.5 w-3.5" /> Changes are applied by the linked app and persist when supported by this browser.</p>
        </div>
      </main>
    </div>
  );
};
