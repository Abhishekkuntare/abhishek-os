import React from 'react';
import { useOS } from '../../context/OSContext';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

export const EducationApp: React.FC = () => {
  const { education } = useOS();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 select-text space-y-6">
      {/* Education Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-white/10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Formal Education & Degree Qualifications
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified academic credentials from undergraduate studies in Information Technology.
          </p>
        </div>

        {/* CGPA Badge */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/90 border border-white/10 shadow">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-sm font-bold text-white">CGPA: {education.cgpa}</div>
            <div className="text-[10px] text-slate-400">Academic Standing</div>
          </div>
        </div>
      </div>

      {/* Main Institution Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {education.institution}
            </h3>
            <div className="text-sm font-semibold text-sky-400 flex items-center gap-2">
              <span>{education.degree} in {education.field}</span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-white/5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {education.start_date} – {education.end_date}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 pt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {education.location}
            </span>
          </div>
        </div>

        {/* Curriculum & Key Highlights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Academic Highlights & Coursework</span>
          </div>

          <div className="space-y-2">
            {(education?.description || []).map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Specifications Format Table */}
        <div className="pt-2 border-t border-white/5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Institutional Record Details
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-white/5">
              <div className="text-[10px] text-slate-400">Major Field</div>
              <div className="font-semibold text-slate-200 mt-0.5">{education.field}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-white/5">
              <div className="text-[10px] text-slate-400">Cumulative GPA</div>
              <div className="font-semibold text-amber-400 mt-0.5">{education.cgpa}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-white/5">
              <div className="text-[10px] text-slate-400">Duration</div>
              <div className="font-semibold text-slate-200 mt-0.5">4 Years (Graduated)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-white/5">
              <div className="text-[10px] text-slate-400">Location</div>
              <div className="font-semibold text-slate-200 mt-0.5">{education.location}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
