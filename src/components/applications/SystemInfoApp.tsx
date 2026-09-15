import React from 'react';
import { useOS } from '../../context/OSContext';
import {
  HardDrive,
  Cpu,
  Monitor,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle,
  Activity,
} from 'lucide-react';

export const SystemInfoApp: React.FC = () => {
  const { projects, skills, experiences, settings } = useOS();

  const specs = [
    { label: 'Device Name', value: 'ABHISHEK-WORKSTATION', icon: Monitor },
    { label: 'Operating System', value: 'Abhishek Portfolio OS (Fluent Edition)', icon: Layers },
    { label: 'Primary Processor', value: 'React.js 19 + TypeScript + Next.js Architecture', icon: Cpu },
    { label: 'Installed Memory (RAM)', value: 'Strict TypeScript • Zero-Any Guaranteed', icon: Cpu },
    { label: 'Graphics & Motion Engine', value: 'Framer Motion 60fps GPU Hardware Acceleration', icon: Activity },
    { label: 'System Storage', value: `${projects.length} Projects, ${experiences.length} Positions, ${skills.length} Skills`, icon: HardDrive },
    { label: 'Database & Auth Layer', value: 'Supabase PostgreSQL + Local Reactive Sync', icon: Database },
    { label: 'UI Paradigm', value: 'Windows 11 Fluent Design with Mica Glass Surfaces', icon: ShieldCheck },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 select-text space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-white/10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <HardDrive className="w-4 h-4" />
            <span>System Information</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Workstation Hardware & Software Diagnostics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Technical runtime environment powering Abhishek Kuntare's interactive developer workstation.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">System Healthy</span>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-lg divide-y divide-white/5 text-xs">
        {specs.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3 text-slate-400 font-medium">
                <Icon className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{item.label}</span>
              </div>
              <div className="font-mono text-slate-200 font-semibold sm:text-right pl-7 sm:pl-0">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Runtime Note */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-400 space-y-2">
        <div className="font-semibold text-slate-300">Port & Ingress Diagnostic</div>
        <p className="leading-relaxed">
          Standard web port 3000 bound to 0.0.0.0. All API integrations and client assets compiled with Vite & Tailwind CSS.
        </p>
      </div>
    </div>
  );
};
