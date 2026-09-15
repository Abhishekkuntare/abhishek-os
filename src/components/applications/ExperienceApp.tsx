import React from 'react';
import { useOS } from '../../context/OSContext';
import {
  Briefcase,
  Calendar,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

export const ExperienceApp: React.FC = () => {
  const { experiences } = useOS();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 select-text space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-white/10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Briefcase className="w-4 h-4" />
            <span>Career History</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Professional Experience & Milestones
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            2+ years of production experience scaling web applications, client portals, and e-commerce frontends.
          </p>
        </div>

        {/* High-Impact Stat Highlight */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10">
          <Zap className="w-5 h-5 text-amber-400" />
          <div className="text-xs">
            <div className="font-bold text-white text-sm">40%+ Speedup</div>
            <div className="text-[10px] text-slate-400">Measured load reduction</div>
          </div>
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 sm:before:left-5 before:w-0.5 before:bg-white/10">
        {experiences.map((exp, idx) => (
          <div key={exp.id} className="relative pl-10 sm:pl-12 space-y-3 group">
            {/* Timeline node */}
            <div className="absolute left-2.5 sm:left-3.5 -translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-sky-400 group-hover:scale-125 transition-transform shadow" />

            <div className="p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-white/8 hover:border-sky-500/30 transition-all shadow-lg space-y-4">
              {/* Header: Role & Company */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    {exp.role}
                  </h3>
                  <div className="text-sm font-semibold text-sky-400">
                    {exp.company}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-white/5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {exp.start_date} – {exp.end_date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Core Responsibilities
                </div>
                <ul className="space-y-1.5">
                  {(exp.description || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Achievements */}
              {exp.achievements && exp.achievements.length > 0 && (
                <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300 uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Key Performance Achievements</span>
                  </div>
                  <div className="space-y-1">
                    {(exp.achievements || []).map((ach, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                {(exp.technologies || []).map(t => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
