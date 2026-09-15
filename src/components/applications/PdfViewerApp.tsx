import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import {
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Printer,
  Search,
} from 'lucide-react';

export const PdfViewerApp: React.FC = () => {
  const { education, experiences, skills } = useOS();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalPages = 2;

  const handleDownload = () => {
    // Generate printed text/PDF representation
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Viewer Ribbon */}
      <header className="h-12 px-3 border-b border-white/10 bg-slate-900 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-sm">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-semibold text-xs text-slate-200">
            Abhishek_Kuntare_Resume.pdf
          </span>
        </div>

        {/* Zoom & Navigation Controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-white/10">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-white/10">
            <button
              onClick={() => setZoom(z => Math.max(60, z - 15))}
              className="p-1 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(160, z + 15))}
              className="p-1 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setRotation(r => (r + 90) % 360)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/10 text-slate-300"
            title="Rotate 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </header>

      {/* PDF Canvas Viewport */}
      <div className="flex-1 overflow-auto bg-slate-900/60 p-4 sm:p-8 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
          className="w-full max-w-2xl bg-white text-slate-900 rounded-lg shadow-2xl p-8 sm:p-12 min-h-[950px] border border-slate-300 space-y-6"
        >
          {currentPage === 1 ? (
            <>
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">ABHISHEK KUNTARE</h1>
                <p className="text-xs font-bold text-sky-700 uppercase tracking-widest mt-0.5">
                  Software Developer • Full-Stack & AI Systems
                </p>
                <div className="mt-2 text-[11px] text-slate-600 flex flex-wrap gap-4">
                  <span>Pune, Maharashtra, India</span>
                  <span>abhishekkuntare02@gmail.com</span>
                  <span>LinkedIn / GitHub Available</span>
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
                  Education
                </h2>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{education.institution}</h3>
                    <p className="text-[11px] text-slate-700">{education.degree} in {education.field}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-sky-700">CGPA: {education.cgpa}</span>
                    <p className="text-[10px] text-slate-500">{education.start_date} – {education.end_date}</p>
                  </div>
                </div>
              </div>

              {/* Professional Experience */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {experiences.map(exp => (
                    <div key={exp.id} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exp.role} — {exp.company}</span>
                        <span className="text-[10px] text-slate-500">{exp.start_date} – {exp.end_date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 italic">{exp.location}</p>
                      <ul className="list-disc list-inside mt-1.5 text-[11px] text-slate-700 space-y-1">
                        {exp.description.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Core Skills */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
                  Technical Competencies
                </h2>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skills.slice(0, 15).map(s => (
                    <span key={s.id} className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-medium text-slate-800">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Page 2: Key Projects & System Architecture */}
              <div className="border-b border-slate-900 pb-2">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Featured Engineering Projects & Impact
                </h2>
                <p className="text-[11px] text-slate-500">Page 2 • Technical Portfolio Breakdown</p>
              </div>

              <div className="space-y-5 text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">1. KrishiMitra AI — Intelligent Agro-Advisory Platform</h3>
                  <p className="text-[11px] text-slate-700 mt-1">
                    Architected an end-to-end intelligent agricultural diagnosis and multilingual advisory engine.
                    Integrated Google Gemini multimodal APIs for visual plant pathology analysis, combined with
                    geolocation microclimatic weather telemetry.
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Stack: Next.js 15, FastAPI, Gemini Multimodal API, PostgreSQL, Tailwind CSS
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-xs">2. CraveVerse — Real-Time Food Delivery & Kitchen Network</h3>
                  <p className="text-[11px] text-slate-700 mt-1">
                    Engineered a robust multi-role delivery platform with real-time order tracking, WebSocket telemetry,
                    and atomic order reconciliation in PostgreSQL.
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Stack: React 19, Node.js, Express, PostgreSQL, Supabase Auth
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-xs">3. Abhishek OS 2.0 — Interactive Web Workstation</h3>
                  <p className="text-[11px] text-slate-700 mt-1">
                    Developed a client-side operating system simulation with an IndexedDB virtual filesystem,
                    integrated Code Editor, Sheets engine with custom formula parsers, document writer, and real browser APIs.
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Stack: React 19, TypeScript, IndexedDB, Tailwind CSS 4, Motion
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
