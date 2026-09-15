import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Project } from '../../types';
import {
  FolderKanban,
  ExternalLink,
  Github,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Layers,
  Code2,
  Eye,
  Plus,
} from 'lucide-react';

export const ProjectsApp: React.FC = () => {
  const { windows, activeWindowId, projects, openApp } = useOS();

  // Check if opened with pre-selected project slug
  const currentWindow = windows.find(w => w.id === activeWindowId);
  const initialSlug = currentWindow?.extraData?.selectedProjectSlug;

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  useEffect(() => {
    if (initialSlug) {
      const found = projects.find(p => p.slug === initialSlug);
      if (found) setSelectedProject(found);
    }
  }, [initialSlug, projects]);

  const categories = ['All', ...Array.from(new Set((projects || []).map(p => p.category)))];

  const filteredProjects = (projects || []).filter(p => {
    const matchesCat = filterCategory === 'All' || p.category === filterCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.short_description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.technologies || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // DETAIL VIEW
  if (selectedProject) {
    return (
      <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-text overflow-hidden">
        {/* Detail Header bar */}
        <div className="h-11 px-4 border-b border-white/10 bg-slate-900/80 flex items-center justify-between shrink-0 select-none">
          <button
            type="button"
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects list</span>
          </button>

          <div className="flex items-center gap-2">
            {selectedProject.live_url && (
              <a
                href={selectedProject.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Demo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {selectedProject.github_url && (
              <a
                href={selectedProject.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Repository</span>
              </a>
            )}
          </div>
        </div>

        {/* Detail Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Hero Banner / Gallery */}
          <div className="space-y-3">
            <div className="w-full h-56 sm:h-80 rounded-2xl overflow-hidden bg-slate-900 relative border border-white/10 shadow-2xl">
              <img
                src={
                  selectedProject.gallery?.[activeGalleryIndex] ||
                  selectedProject.thumbnail_url
                }
                alt={selectedProject.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-sky-500 text-slate-950 mr-2">
                    {selectedProject.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900/80 text-slate-200 border border-white/15">
                    {selectedProject.year}
                  </span>
                </div>
              </div>
            </div>

            {/* Gallery Thumbnails (if multiple) */}
            {selectedProject.gallery && selectedProject.gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {selectedProject.gallery.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeGalleryIndex === idx
                        ? 'border-sky-400 ring-2 ring-sky-400/30'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {selectedProject.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {selectedProject.long_description || selectedProject.short_description}
            </p>
          </div>

          {/* Tech Stack Chips */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Technologies & Infrastructure
            </h3>
            <div className="flex flex-wrap gap-2">
              {(selectedProject.technologies || []).map(t => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-sky-300 border border-sky-400/20 shadow-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Challenges & Solution Grid */}
          {(selectedProject.challenges || selectedProject.solution || selectedProject.results) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {selectedProject.challenges && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/8 space-y-1.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Key Challenge
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedProject.challenges}
                  </p>
                </div>
              )}

              {selectedProject.solution && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/8 space-y-1.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                    Engineering Solution
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedProject.solution}
                  </p>
                </div>
              )}

              {selectedProject.results && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/8 space-y-1.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Impact & Outcomes
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedProject.results}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // LIST / GRID EXPLORER VIEW
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* Explorer Top Bar */}
      <div className="h-11 px-4 border-b border-white/10 bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                filterCategory === cat
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & View Mode */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-36 sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/90 border border-white/10 rounded-lg pl-8 pr-2 py-1 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div className="flex items-center bg-slate-800/90 rounded-lg border border-white/10 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-sky-500/30 text-sky-300' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-sky-500/30 text-sky-300' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => openApp('admin')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs border border-indigo-400/30 transition-colors"
            title="Manage Projects in Admin Control Center"
          >
            <Plus className="w-3 h-3" />
            <span>Manage</span>
          </button>
        </div>
      </div>

      {/* Main projects body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Found {filteredProjects.length} projects</span>
          <span>Click any card to inspect architectural details</span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <FolderKanban className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
            <p className="text-sm">No projects matching your search filter.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('All');
              }}
              className="text-xs text-sky-400 underline"
            >
              Reset filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map(p => (
              <div
                key={p.id}
                id={`project-card-${p.slug}`}
                onClick={() => setSelectedProject(p)}
                className="group flex flex-col rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/8 hover:border-sky-500/40 transition-all duration-200 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
              >
                {/* Thumbnail */}
                <div className="h-44 w-full bg-slate-950 relative overflow-hidden">
                  <img
                    src={p.thumbnail_url}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {p.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow">
                        <Sparkles className="w-2.5 h-2.5" />
                        Featured
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-900/80 text-slate-200 border border-white/10 backdrop-blur-xs">
                      {p.category}
                    </span>
                  </div>

                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/90 text-slate-300 border border-white/10">
                    {p.year}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {p.short_description}
                    </p>
                  </div>

                  {/* Tech stack */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5">
                      {(p.technologies || []).slice(0, 4).map(tech => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {(p.technologies || []).length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                          +{(p.technologies || []).length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-sky-400 font-medium pt-1">
                      <span>View Project Details</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden divide-y divide-white/5 text-xs">
            {filteredProjects.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="p-3.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                    <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white group-hover:text-sky-300 text-sm truncate">
                        {p.title}
                      </span>
                      {p.featured && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs truncate max-w-md">
                      {p.short_description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-slate-400 text-xs">
                  <span className="hidden md:inline font-mono">{p.year}</span>
                  <span className="hidden sm:inline px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                    {p.category}
                  </span>
                  <ExternalLink className="w-4 h-4 text-sky-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
