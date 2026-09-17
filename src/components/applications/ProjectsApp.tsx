// import React, { useEffect, useMemo, useState } from 'react';

// import { useOS } from '../../context/OSContext';
// import { Project } from '../../types';

// import {
//   FolderKanban,
//   ExternalLink,
//   Github,
//   Search,
//   LayoutGrid,
//   List,
//   Sparkles,
//   ArrowLeft,
//   Eye,
//   GripVertical,
//   ArrowUpDown,
//   RotateCcw,
//   Calendar,
//   Layers,
//   Code2,
//   Star,
//   ChevronDown,
//   X,
// } from 'lucide-react';

// type SortMode =
//   | 'custom'
//   | 'newest'
//   | 'oldest'
//   | 'az'
//   | 'za';

// const PROJECT_ORDER_KEY = 'abhishek-os-project-showcase-order-v1';

// export const ProjectsApp: React.FC = () => {
//   const { windows, activeWindowId, projects } = useOS();

//   const currentWindow = windows.find(w => w.id === activeWindowId);
//   const initialSlug = currentWindow?.extraData?.selectedProjectSlug;

//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);

//   const [filterCategory, setFilterCategory] = useState<string>('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

//   const [sortMode, setSortMode] = useState<SortMode>('custom');

//   const [projectOrder, setProjectOrder] = useState<string[]>([]);
//   const [draggedId, setDraggedId] = useState<string | null>(null);
//   const [dragOverId, setDragOverId] = useState<string | null>(null);

//   const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

//   const [showSortMenu, setShowSortMenu] = useState(false);

//   /* ---------------------------------------------------------
//      LOAD SAVED PROJECT ORDER
//   --------------------------------------------------------- */

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem(PROJECT_ORDER_KEY);

//       if (stored) {
//         const parsed = JSON.parse(stored);

//         if (Array.isArray(parsed)) {
//           setProjectOrder(parsed);
//         }
//       }
//     } catch {
//       setProjectOrder([]);
//     }
//   }, []);

//   /* ---------------------------------------------------------
//      KEEP ORDER IN SYNC WITH CURRENT PROJECTS
//   --------------------------------------------------------- */

//   useEffect(() => {
//     if (!projects?.length) return;

//     setProjectOrder(previous => {
//       const existingIds = new Set(projects.map(project => project.id));

//       const validExistingOrder = previous.filter(id =>
//         existingIds.has(id)
//       );

//       const missingProjects = projects
//         .filter(project => !validExistingOrder.includes(project.id))
//         .sort((a, b) => {
//           const aOrder = a.sort_order ?? 999999;
//           const bOrder = b.sort_order ?? 999999;

//           return aOrder - bOrder;
//         })
//         .map(project => project.id);

//       const nextOrder = [
//         ...validExistingOrder,
//         ...missingProjects,
//       ];

//       try {
//         localStorage.setItem(
//           PROJECT_ORDER_KEY,
//           JSON.stringify(nextOrder)
//         );
//       } catch {
//         // Ignore localStorage errors.
//       }

//       return nextOrder;
//     });
//   }, [projects]);

//   /* ---------------------------------------------------------
//      OPEN PROJECT FROM WINDOW EXTRA DATA
//   --------------------------------------------------------- */

//   useEffect(() => {
//     if (!initialSlug) return;

//     const found = (projects || []).find(
//       project => project.slug === initialSlug
//     );

//     if (found) {
//       setSelectedProject(found);
//       setActiveGalleryIndex(0);
//     }
//   }, [initialSlug, projects]);

//   /* ---------------------------------------------------------
//      CATEGORIES
//   --------------------------------------------------------- */

//   const categories = useMemo(() => {
//     return [
//       'All',
//       ...Array.from(
//         new Set(
//           (projects || [])
//             .map(project => project.category)
//             .filter(Boolean)
//         )
//       ),
//     ];
//   }, [projects]);

//   /* ---------------------------------------------------------
//      CUSTOM ORDER
//   --------------------------------------------------------- */

//   const orderedProjects = useMemo(() => {
//     const list = [...(projects || [])];

//     if (!projectOrder.length) {
//       return list.sort(
//         (a, b) =>
//           (a.sort_order ?? 999999) -
//           (b.sort_order ?? 999999)
//       );
//     }

//     const orderMap = new Map(
//       projectOrder.map((id, index) => [id, index])
//     );

//     return list.sort((a, b) => {
//       const aIndex = orderMap.get(a.id);
//       const bIndex = orderMap.get(b.id);

//       if (aIndex === undefined && bIndex === undefined) {
//         return (
//           (a.sort_order ?? 999999) -
//           (b.sort_order ?? 999999)
//         );
//       }

//       if (aIndex === undefined) return 1;
//       if (bIndex === undefined) return -1;

//       return aIndex - bIndex;
//     });
//   }, [projects, projectOrder]);

//   /* ---------------------------------------------------------
//      FILTER + SORT
//   --------------------------------------------------------- */

//   const filteredProjects = useMemo(() => {
//     const query = searchQuery.trim().toLowerCase();

//     const result = orderedProjects.filter(project => {
//       const matchesCategory =
//         filterCategory === 'All' ||
//         project.category === filterCategory;

//       const matchesSearch =
//         !query ||
//         project.title.toLowerCase().includes(query) ||
//         (project.short_description || '')
//           .toLowerCase()
//           .includes(query) ||
//         (project.long_description || '')
//           .toLowerCase()
//           .includes(query) ||
//         (project.technologies || []).some(technology =>
//           technology.toLowerCase().includes(query)
//         );

//       return matchesCategory && matchesSearch;
//     });

//     if (sortMode === 'newest') {
//       return [...result].sort((a, b) => {
//         const yearA = Number(a.year) || 0;
//         const yearB = Number(b.year) || 0;

//         return yearB - yearA;
//       });
//     }

//     if (sortMode === 'oldest') {
//       return [...result].sort((a, b) => {
//         const yearA = Number(a.year) || 0;
//         const yearB = Number(b.year) || 0;

//         return yearA - yearB;
//       });
//     }

//     if (sortMode === 'az') {
//       return [...result].sort((a, b) =>
//         a.title.localeCompare(b.title)
//       );
//     }

//     if (sortMode === 'za') {
//       return [...result].sort((a, b) =>
//         b.title.localeCompare(a.title)
//       );
//     }

//     return result;
//   }, [
//     orderedProjects,
//     searchQuery,
//     filterCategory,
//     sortMode,
//   ]);

//   /* ---------------------------------------------------------
//      DRAG REORDER
//   --------------------------------------------------------- */

//   const handleDragStart = (
//     event: React.DragEvent<HTMLDivElement>,
//     projectId: string
//   ) => {
//     setDraggedId(projectId);

//     event.dataTransfer.effectAllowed = 'move';
//     event.dataTransfer.setData(
//       'text/plain',
//       projectId
//     );
//   };

//   const handleDragOver = (
//     event: React.DragEvent<HTMLDivElement>,
//     projectId: string
//   ) => {
//     event.preventDefault();

//     if (!draggedId || draggedId === projectId) return;

//     setDragOverId(projectId);

//     event.dataTransfer.dropEffect = 'move';
//   };

//   const handleDrop = (
//     event: React.DragEvent<HTMLDivElement>,
//     targetId: string
//   ) => {
//     event.preventDefault();

//     const sourceId =
//       draggedId ||
//       event.dataTransfer.getData('text/plain');

//     if (!sourceId || sourceId === targetId) {
//       setDraggedId(null);
//       setDragOverId(null);
//       return;
//     }

//     setProjectOrder(previousOrder => {
//       const fallbackOrder = orderedProjects.map(
//         project => project.id
//       );

//       const currentOrder =
//         previousOrder.length > 0
//           ? [...previousOrder]
//           : fallbackOrder;

//       const sourceIndex =
//         currentOrder.indexOf(sourceId);

//       const targetIndex =
//         currentOrder.indexOf(targetId);

//       if (
//         sourceIndex === -1 ||
//         targetIndex === -1
//       ) {
//         return currentOrder;
//       }

//       const nextOrder = [...currentOrder];

//       const [movedProject] = nextOrder.splice(
//         sourceIndex,
//         1
//       );

//       nextOrder.splice(
//         targetIndex,
//         0,
//         movedProject
//       );

//       try {
//         localStorage.setItem(
//           PROJECT_ORDER_KEY,
//           JSON.stringify(nextOrder)
//         );
//       } catch {
//         // Ignore storage errors.
//       }

//       return nextOrder;
//     });

//     setSortMode('custom');
//     setDraggedId(null);
//     setDragOverId(null);
//   };

//   const handleDragEnd = () => {
//     setDraggedId(null);
//     setDragOverId(null);
//   };

//   /* ---------------------------------------------------------
//      RESET CUSTOM ORDER
//   --------------------------------------------------------- */

//   const resetProjectOrder = () => {
//     const defaultOrder = [...(projects || [])]
//       .sort(
//         (a, b) =>
//           (a.sort_order ?? 999999) -
//           (b.sort_order ?? 999999)
//       )
//       .map(project => project.id);

//     setProjectOrder(defaultOrder);
//     setSortMode('custom');

//     try {
//       localStorage.setItem(
//         PROJECT_ORDER_KEY,
//         JSON.stringify(defaultOrder)
//       );
//     } catch {
//       // Ignore storage errors.
//     }
//   };

//   /* ---------------------------------------------------------
//      OPEN PROJECT
//   --------------------------------------------------------- */

//   const openProject = (project: Project) => {
//     setSelectedProject(project);
//     setActiveGalleryIndex(0);
//   };

//   /* ---------------------------------------------------------
//      SORT LABEL
//   --------------------------------------------------------- */

//   const sortLabel = {
//     custom: 'Custom Order',
//     newest: 'Newest First',
//     oldest: 'Oldest First',
//     az: 'A → Z',
//     za: 'Z → A',
//   }[sortMode];

//   /* =========================================================
//      PROJECT DETAIL VIEW
//   ========================================================= */

//   if (selectedProject) {
//     return (
//       <div className="flex h-full flex-col overflow-hidden bg-slate-950 text-slate-100">

//         {/* HEADER */}

//         <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 bg-slate-900/90 px-4">

//           <button
//             type="button"
//             onClick={() => {
//               setSelectedProject(null);
//               setActiveGalleryIndex(0);
//             }}
//             className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             <span>Back to Projects</span>
//           </button>

//           <div className="flex items-center gap-2">

//             {selectedProject.live_url && (
//               <a
//                 href={selectedProject.live_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition-all hover:bg-sky-400"
//               >
//                 <Eye className="h-3.5 w-3.5" />
//                 Live Demo
//                 <ExternalLink className="h-3 w-3" />
//               </a>
//             )}

//             {selectedProject.github_url && (
//               <a
//                 href={selectedProject.github_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-all hover:bg-slate-700"
//               >
//                 <Github className="h-3.5 w-3.5" />
//                 Repository
//               </a>
//             )}

//           </div>
//         </div>

//         {/* DETAIL BODY */}

//         <div className="flex-1 overflow-y-auto p-4 sm:p-6">

//           <div className="mx-auto max-w-6xl space-y-7">

//             {/* HERO */}

//             <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">

//               <div className="relative h-60 sm:h-[420px]">

//                 <img
//                   src={
//                     selectedProject.gallery?.[
//                       activeGalleryIndex
//                     ] ||
//                     selectedProject.thumbnail_url
//                   }
//                   alt={selectedProject.title}
//                   className="h-full w-full object-cover"
//                   referrerPolicy="no-referrer"
//                 />

//                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

//                 <div className="absolute bottom-5 left-5 right-5">

//                   <div className="mb-3 flex flex-wrap items-center gap-2">

//                     <span className="rounded-lg bg-sky-500 px-2.5 py-1 text-[11px] font-bold text-slate-950">
//                       {selectedProject.category}
//                     </span>

//                     <span className="rounded-lg border border-white/10 bg-slate-950/80 px-2.5 py-1 text-[11px] font-medium text-slate-200">
//                       {selectedProject.year}
//                     </span>

//                     {selectedProject.featured && (
//                       <span className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-slate-950">
//                         <Sparkles className="h-3 w-3" />
//                         Featured
//                       </span>
//                     )}

//                   </div>

//                   <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
//                     {selectedProject.title}
//                   </h1>

//                 </div>
//               </div>

//               {/* GALLERY */}

//               {selectedProject.gallery &&
//                 selectedProject.gallery.length > 1 && (
//                   <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-slate-950/50 p-3">
//                     {selectedProject.gallery.map(
//                       (image, index) => (
//                         <button
//                           key={`${image}-${index}`}
//                           type="button"
//                           onClick={() =>
//                             setActiveGalleryIndex(index)
//                           }
//                           className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
//                             activeGalleryIndex === index
//                               ? 'border-sky-400 ring-2 ring-sky-400/20'
//                               : 'border-white/10 opacity-60 hover:opacity-100'
//                           }`}
//                         >
//                           <img
//                             src={image}
//                             alt=""
//                             className="h-full w-full object-cover"
//                             referrerPolicy="no-referrer"
//                           />
//                         </button>
//                       )
//                     )}
//                   </div>
//                 )}

//             </div>

//             {/* DESCRIPTION */}

//             <section className="space-y-3">

//               <div className="flex items-center gap-2">
//                 <Layers className="h-4 w-4 text-sky-400" />
//                 <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
//                   Project Overview
//                 </h2>
//               </div>

//               <p className="text-sm leading-7 text-slate-300 sm:text-base">
//                 {selectedProject.long_description ||
//                   selectedProject.short_description}
//               </p>

//             </section>

//             {/* TECHNOLOGIES */}

//             <section className="space-y-3">

//               <div className="flex items-center gap-2">
//                 <Code2 className="h-4 w-4 text-sky-400" />
//                 <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
//                   Technologies & Infrastructure
//                 </h2>
//               </div>

//               <div className="flex flex-wrap gap-2">

//                 {(selectedProject.technologies || []).map(
//                   technology => (
//                     <span
//                       key={technology}
//                       className="rounded-xl border border-sky-400/20 bg-slate-900 px-3 py-1.5 text-xs font-medium text-sky-300"
//                     >
//                       {technology}
//                     </span>
//                   )
//                 )}

//               </div>

//             </section>

//             {/* CHALLENGE / SOLUTION / RESULTS */}

//             {(selectedProject.challenges ||
//               selectedProject.solution ||
//               selectedProject.results) && (

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

//                 {selectedProject.challenges && (
//                   <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
//                     <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-400">
//                       Key Challenge
//                     </p>

//                     <p className="text-xs leading-6 text-slate-300">
//                       {selectedProject.challenges}
//                     </p>
//                   </div>
//                 )}

//                 {selectedProject.solution && (
//                   <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
//                     <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-sky-400">
//                       Engineering Solution
//                     </p>

//                     <p className="text-xs leading-6 text-slate-300">
//                       {selectedProject.solution}
//                     </p>
//                   </div>
//                 )}

//                 {selectedProject.results && (
//                   <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
//                     <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
//                       Impact & Outcomes
//                     </p>

//                     <p className="text-xs leading-6 text-slate-300">
//                       {selectedProject.results}
//                     </p>
//                   </div>
//                 )}

//               </div>
//             )}

//           </div>

//         </div>
//       </div>
//     );
//   }

//   /* =========================================================
//      PROJECT EXPLORER
//   ========================================================= */

//   return (
//     <div className="flex h-full flex-col overflow-hidden bg-slate-950 text-slate-100">

//       {/* =====================================================
//           TOOLBAR
//       ===================================================== */}

//       <div className="shrink-0 border-b border-white/10 bg-slate-900/90">

//         <div className="flex min-h-12 items-center gap-2 px-3 sm:px-4">

//           {/* SEARCH */}

//           <div className="relative min-w-0 flex-1 sm:max-w-xs">

//             <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />

//             <input
//               type="text"
//               value={searchQuery}
//               onChange={event =>
//                 setSearchQuery(event.target.value)
//               }
//               placeholder="Search projects..."
//               className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-2 pl-9 pr-8 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
//             />

//             {searchQuery && (
//               <button
//                 type="button"
//                 onClick={() => setSearchQuery('')}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-white/10 hover:text-white"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             )}

//           </div>

//           {/* SORT */}

//           <div className="relative">

//             <button
//               type="button"
//               onClick={() =>
//                 setShowSortMenu(value => !value)
//               }
//               className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-2.5 py-2 text-xs text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
//             >
//               <ArrowUpDown className="h-3.5 w-3.5" />
//               <span className="hidden sm:inline">
//                 {sortLabel}
//               </span>
//               <ChevronDown className="h-3 w-3" />
//             </button>

//             {showSortMenu && (
//               <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-1.5 shadow-2xl">

//                 {[
//                   ['custom', 'Custom Order'],
//                   ['newest', 'Newest First'],
//                   ['oldest', 'Oldest First'],
//                   ['az', 'A → Z'],
//                   ['za', 'Z → A'],
//                 ].map(([value, label]) => (
//                   <button
//                     key={value}
//                     type="button"
//                     onClick={() => {
//                       setSortMode(
//                         value as SortMode
//                       );
//                       setShowSortMenu(false);
//                     }}
//                     className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-xs transition-colors ${
//                       sortMode === value
//                         ? 'bg-sky-500/15 text-sky-300'
//                         : 'text-slate-300 hover:bg-white/5 hover:text-white'
//                     }`}
//                   >
//                     {label}
//                   </button>
//                 ))}

//               </div>
//             )}

//           </div>

//           {/* RESET ORDER */}

//           <button
//             type="button"
//             onClick={resetProjectOrder}
//             title="Reset custom project order"
//             className="rounded-xl border border-white/10 bg-slate-800 p-2 text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
//           >
//             <RotateCcw className="h-3.5 w-3.5" />
//           </button>

//           {/* VIEW */}

//           <div className="flex items-center rounded-xl border border-white/10 bg-slate-800 p-0.5">

//             <button
//               type="button"
//               onClick={() => setViewMode('grid')}
//               title="Grid view"
//               className={`rounded-lg p-1.5 transition-all ${
//                 viewMode === 'grid'
//                   ? 'bg-sky-500/20 text-sky-300'
//                   : 'text-slate-500 hover:text-white'
//               }`}
//             >
//               <LayoutGrid className="h-3.5 w-3.5" />
//             </button>

//             <button
//               type="button"
//               onClick={() => setViewMode('list')}
//               title="List view"
//               className={`rounded-lg p-1.5 transition-all ${
//                 viewMode === 'list'
//                   ? 'bg-sky-500/20 text-sky-300'
//                   : 'text-slate-500 hover:text-white'
//               }`}
//             >
//               <List className="h-3.5 w-3.5" />
//             </button>

//           </div>

//         </div>

//         {/* CATEGORY BAR */}

//         <div className="flex gap-1.5 overflow-x-auto px-3 pb-2 sm:px-4">

//           {categories.map(category => (
//             <button
//               key={category}
//               type="button"
//               onClick={() =>
//                 setFilterCategory(category)
//               }
//               className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all ${
//                 filterCategory === category
//                   ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/10'
//                   : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
//               }`}
//             >
//               {category}
//             </button>
//           ))}

//         </div>

//       </div>

//       {/* =====================================================
//           BODY
//       ===================================================== */}

//       <div className="flex-1 overflow-y-auto p-4 sm:p-6">

//         <div className="mx-auto max-w-7xl space-y-5">

//           {/* HEADER */}

//           <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

//             <div>

//               <div className="flex items-center gap-2">

//                 <FolderKanban className="h-5 w-5 text-sky-400" />

//                 <h1 className="text-lg font-bold text-white">
//                   Project Showcase
//                 </h1>

//               </div>

//               <p className="mt-1 text-xs text-slate-500">
//                 Explore projects, inspect architecture, and
//                 arrange the showcase order.
//               </p>

//             </div>

//             <div className="flex items-center gap-2 text-[11px] text-slate-500">

//               <span>
//                 {filteredProjects.length} of{' '}
//                 {projects?.length || 0} projects
//               </span>

//               {sortMode === 'custom' && (
//                 <>
//                   <span>•</span>

//                   <span className="flex items-center gap-1 text-sky-400">
//                     <GripVertical className="h-3 w-3" />
//                     Drag to reorder
//                   </span>
//                 </>
//               )}

//             </div>

//           </div>

//           {/* EMPTY */}

//           {filteredProjects.length === 0 ? (
//             <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/40 text-center">

//               <div className="mb-4 rounded-2xl bg-slate-800 p-4">
//                 <Search className="h-7 w-7 text-slate-500" />
//               </div>

//               <h3 className="text-sm font-bold text-white">
//                 No projects found
//               </h3>

//               <p className="mt-1 max-w-sm text-xs text-slate-500">
//                 Try another search term or category.
//               </p>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setSearchQuery('');
//                   setFilterCategory('All');
//                 }}
//                 className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400"
//               >
//                 Reset Filters
//               </button>

//             </div>
//           ) : viewMode === 'grid' ? (

//             /* =================================================
//                GRID
//             ================================================= */

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

//               {filteredProjects.map(
//                 (project, index) => {

//                   const isDragging =
//                     draggedId === project.id;

//                   const isDragOver =
//                     dragOverId === project.id;

//                   return (
//                     <div
//                       key={project.id}
//                       draggable={
//                         sortMode === 'custom'
//                       }
//                       onDragStart={event =>
//                         handleDragStart(
//                           event,
//                           project.id
//                         )
//                       }
//                       onDragOver={event =>
//                         handleDragOver(
//                           event,
//                           project.id
//                         )
//                       }
//                       onDrop={event =>
//                         handleDrop(
//                           event,
//                           project.id
//                         )
//                       }
//                       onDragEnd={handleDragEnd}
//                       className={`relative transition-all duration-200 ${
//                         isDragging
//                           ? 'scale-[0.98] opacity-40'
//                           : ''
//                       } ${
//                         isDragOver
//                           ? 'translate-y-1'
//                           : ''
//                       }`}
//                     >

//                       {/* DROP INDICATOR */}

//                       {isDragOver &&
//                         sortMode ===
//                           'custom' && (
//                           <div className="absolute -top-2 left-4 right-4 z-20 h-1 rounded-full bg-sky-400 shadow-lg shadow-sky-400/60" />
//                         )}

//                       <div
//                         onClick={() =>
//                           openProject(project)
//                         }
//                         className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border bg-slate-900/70 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900 ${
//                           isDragOver
//                             ? 'border-sky-400/70 ring-2 ring-sky-400/10'
//                             : 'border-white/10 hover:border-sky-500/40'
//                         }`}
//                       >

//                         {/* IMAGE */}

//                         <div className="relative h-48 overflow-hidden bg-slate-950">

//                           <img
//                             src={
//                               project.thumbnail_url
//                             }
//                             alt={project.title}
//                             className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//                             referrerPolicy="no-referrer"
//                           />

//                           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

//                           {/* POSITION */}

//                           <div className="absolute left-3 top-3 flex items-center gap-2">

//                             {sortMode ===
//                               'custom' && (
//                               <div
//                                 draggable
//                                 onDragStart={event =>
//                                   handleDragStart(
//                                     event,
//                                     project.id
//                                   )
//                                 }
//                                 onClick={event =>
//                                   event.stopPropagation()
//                                 }
//                                 className="flex cursor-grab items-center gap-1 rounded-lg border border-white/10 bg-slate-950/80 px-2 py-1 text-[10px] text-slate-300 backdrop-blur-md active:cursor-grabbing"
//                                 title="Drag project"
//                               >
//                                 <GripVertical className="h-3 w-3" />
//                                 {index + 1}
//                               </div>
//                             )}

//                             {project.featured && (
//                               <span className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-[10px] font-bold text-slate-950 shadow-lg">
//                                 <Sparkles className="h-3 w-3" />
//                                 Featured
//                               </span>
//                             )}

//                           </div>

//                           {/* CATEGORY */}

//                           <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">

//                             <span className="rounded-lg border border-white/10 bg-slate-950/80 px-2 py-1 text-[10px] font-medium text-slate-200 backdrop-blur-md">
//                               {project.category}
//                             </span>

//                             <span className="rounded-lg border border-white/10 bg-slate-950/80 px-2 py-1 text-[10px] font-semibold text-slate-300 backdrop-blur-md">
//                               {project.year}
//                             </span>

//                           </div>

//                         </div>

//                         {/* CONTENT */}

//                         <div className="flex flex-1 flex-col justify-between p-4">

//                           <div>

//                             <h3 className="line-clamp-1 text-base font-bold text-white transition-colors group-hover:text-sky-300">
//                               {project.title}
//                             </h3>

//                             <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-400">
//                               {project.short_description}
//                             </p>

//                           </div>

//                           {/* TECH */}

//                           <div className="mt-4 border-t border-white/5 pt-3">

//                             <div className="flex flex-wrap gap-1.5">

//                               {(project.technologies || [])
//                                 .slice(0, 4)
//                                 .map(
//                                   technology => (
//                                     <span
//                                       key={
//                                         technology
//                                       }
//                                       className="rounded-lg bg-slate-800 px-2 py-1 text-[10px] text-slate-300"
//                                     >
//                                       {
//                                         technology
//                                       }
//                                     </span>
//                                   )
//                                 )}

//                               {(project.technologies || [])
//                                 .length > 4 && (
//                                 <span className="px-1 py-1 text-[10px] text-slate-500">
//                                   +
//                                   {project
//                                     .technologies
//                                     .length -
//                                     4}
//                                 </span>
//                               )}

//                             </div>

//                             <div className="mt-3 flex items-center justify-between">

//                               <span className="text-[11px] font-semibold text-sky-400">
//                                 Inspect Project
//                               </span>

//                               <ExternalLink className="h-3.5 w-3.5 text-sky-400 transition-transform group-hover:translate-x-1" />

//                             </div>

//                           </div>

//                         </div>

//                       </div>
//                     </div>
//                   );
//                 }
//               )}

//             </div>

//           ) : (

//             /* =================================================
//                LIST
//             ================================================= */

//             <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60">

//               {filteredProjects.map(
//                 (project, index) => {

//                   const isDragging =
//                     draggedId === project.id;

//                   const isDragOver =
//                     dragOverId === project.id;

//                   return (
//                     <div
//                       key={project.id}
//                       draggable={
//                         sortMode === 'custom'
//                       }
//                       onDragStart={event =>
//                         handleDragStart(
//                           event,
//                           project.id
//                         )
//                       }
//                       onDragOver={event =>
//                         handleDragOver(
//                           event,
//                           project.id
//                         )
//                       }
//                       onDrop={event =>
//                         handleDrop(
//                           event,
//                           project.id
//                         )
//                       }
//                       onDragEnd={handleDragEnd}
//                       className={`relative border-b border-white/5 last:border-b-0 ${
//                         isDragging
//                           ? 'opacity-40'
//                           : ''
//                       }`}
//                     >

//                       {isDragOver &&
//                         sortMode ===
//                           'custom' && (
//                           <div className="absolute left-0 right-0 top-0 z-10 h-1 bg-sky-400 shadow-lg shadow-sky-400/60" />
//                         )}

//                       <div
//                         onClick={() =>
//                           openProject(project)
//                         }
//                         className="group flex cursor-pointer items-center gap-3 p-3 transition-all hover:bg-white/[0.04] sm:gap-4 sm:p-4"
//                       >

//                         {/* DRAG */}

//                         {sortMode ===
//                           'custom' && (
//                           <div
//                             className="hidden cursor-grab text-slate-600 transition-colors hover:text-sky-400 sm:block"
//                             title="Drag to reorder"
//                           >
//                             <GripVertical className="h-5 w-5" />
//                           </div>
//                         )}

//                         {/* NUMBER */}

//                         <div className="hidden w-6 shrink-0 text-center font-mono text-[10px] text-slate-600 sm:block">
//                           {String(
//                             index + 1
//                           ).padStart(2, '0')}
//                         </div>

//                         {/* THUMBNAIL */}

//                         <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-800 sm:h-16 sm:w-24">

//                           <img
//                             src={
//                               project.thumbnail_url
//                             }
//                             alt={project.title}
//                             className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
//                             referrerPolicy="no-referrer"
//                           />

//                         </div>

//                         {/* INFO */}

//                         <div className="min-w-0 flex-1">

//                           <div className="flex items-center gap-2">

//                             <h3 className="truncate text-sm font-bold text-white transition-colors group-hover:text-sky-300">
//                               {project.title}
//                             </h3>

//                             {project.featured && (
//                               <Star className="h-3 w-3 shrink-0 fill-current text-amber-400" />
//                             )}

//                           </div>

//                           <p className="mt-1 line-clamp-1 text-xs text-slate-500">
//                             {
//                               project.short_description
//                             }
//                           </p>

//                           <div className="mt-2 flex items-center gap-2">

//                             <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[9px] text-slate-400">
//                               {
//                                 project.category
//                               }
//                             </span>

//                             <span className="flex items-center gap-1 text-[9px] text-slate-600">
//                               <Calendar className="h-3 w-3" />
//                               {
//                                 project.year
//                               }
//                             </span>

//                           </div>

//                         </div>

//                         {/* ACTION */}

//                         <div className="hidden items-center gap-2 text-sky-400 sm:flex">

//                           <span className="text-[10px] font-semibold opacity-0 transition-opacity group-hover:opacity-100">
//                             Inspect
//                           </span>

//                           <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />

//                         </div>

//                       </div>

//                     </div>
//                   );
//                 }
//               )}

//             </div>
//           )}

//           {/* BOTTOM INFORMATION */}

//           {filteredProjects.length > 0 && (
//             <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-slate-900/30 px-4 py-3 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">

//               <span>
//                 {sortMode === 'custom'
//                   ? 'Custom showcase order is saved locally on this device.'
//                   : `Sorted by ${sortLabel.toLowerCase()}.`}
//               </span>

//               {sortMode === 'custom' && (
//                 <span className="flex items-center gap-1">
//                   <GripVertical className="h-3 w-3" />
//                   Drag any project to reposition it.
//                 </span>
//               )}

//             </div>
//           )}

//         </div>

//       </div>
//     </div>
//   );
// };

import React, { useEffect, useMemo, useState } from 'react';
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
  Eye,
  GripVertical,
  ArrowUpDown,
  RotateCcw,
  Calendar,
  Layers,
  Code2,
  Star,
  ChevronDown,
  X,
} from 'lucide-react';

type SortMode =
  | 'custom'
  | 'newest'
  | 'oldest'
  | 'az'
  | 'za';

const PROJECT_ORDER_KEY =
  'abhishek-os-project-showcase-order-v1';

export const ProjectsApp: React.FC = () => {
  const {
    windows,
    activeWindowId,
    projects,
  } = useOS();

  const currentWindow = windows.find(
    window => window.id === activeWindowId
  );

  const initialSlug =
    currentWindow?.extraData?.selectedProjectSlug;

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [filterCategory, setFilterCategory] =
    useState<string>('All');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [viewMode, setViewMode] =
    useState<'grid' | 'list'>('grid');

  const [sortMode, setSortMode] =
    useState<SortMode>('custom');

  const [projectOrder, setProjectOrder] =
    useState<string[]>([]);

  const [draggedId, setDraggedId] =
    useState<string | null>(null);

  const [dragOverId, setDragOverId] =
    useState<string | null>(null);

  const [activeGalleryIndex, setActiveGalleryIndex] =
    useState(0);

  const [showSortMenu, setShowSortMenu] =
    useState(false);

  /*
   * ---------------------------------------------------------
   * LOAD SAVED PROJECT ORDER
   * ---------------------------------------------------------
   */

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(PROJECT_ORDER_KEY);

      if (!stored) return;

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setProjectOrder(
          parsed.filter(
            item => typeof item === 'string'
          )
        );
      }
    } catch (error) {
      console.warn(
        'Unable to load project showcase order:',
        error
      );

      setProjectOrder([]);
    }
  }, []);

  /*
   * ---------------------------------------------------------
   * KEEP ORDER IN SYNC WITH CURRENT PROJECTS
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!projects?.length) return;

    setProjectOrder(previousOrder => {
      const projectIds = new Set(
        projects.map(project => project.id)
      );

      const validExistingOrder =
        previousOrder.filter(id =>
          projectIds.has(id)
        );

      const missingProjects = [...projects]
        .filter(
          project =>
            !validExistingOrder.includes(project.id)
        )
        .sort((a, b) => {
          const aOrder =
            a.sort_order ?? 999999;

          const bOrder =
            b.sort_order ?? 999999;

          return aOrder - bOrder;
        })
        .map(project => project.id);

      const nextOrder = [
        ...validExistingOrder,
        ...missingProjects,
      ];

      try {
        localStorage.setItem(
          PROJECT_ORDER_KEY,
          JSON.stringify(nextOrder)
        );
      } catch (error) {
        console.warn(
          'Unable to save project order:',
          error
        );
      }

      return nextOrder;
    });
  }, [projects]);

  /*
   * ---------------------------------------------------------
   * OPEN PROJECT FROM WINDOW EXTRA DATA
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!initialSlug) return;

    const foundProject = (
      projects || []
    ).find(
      project =>
        project.slug === initialSlug
    );

    if (foundProject) {
      setSelectedProject(foundProject);
      setActiveGalleryIndex(0);
    }
  }, [initialSlug, projects]);

  /*
   * ---------------------------------------------------------
   * CATEGORIES
   * ---------------------------------------------------------
   */

  const categories = useMemo(() => {
    const projectCategories = Array.from(
      new Set(
        (projects || [])
          .map(project => project.category)
          .filter(
            (category): category is string =>
              Boolean(category)
          )
      )
    );

    return ['All', ...projectCategories];
  }, [projects]);

  /*
   * ---------------------------------------------------------
   * CUSTOM PROJECT ORDER
   * ---------------------------------------------------------
   */

  const orderedProjects = useMemo(() => {
    const list = [...(projects || [])];

    if (!projectOrder.length) {
      return list.sort(
        (a, b) =>
          (a.sort_order ?? 999999) -
          (b.sort_order ?? 999999)
      );
    }

    const orderMap = new Map(
      projectOrder.map(
        (id, index) => [id, index]
      )
    );

    return list.sort((a, b) => {
      const aIndex = orderMap.get(a.id);
      const bIndex = orderMap.get(b.id);

      if (
        aIndex === undefined &&
        bIndex === undefined
      ) {
        return (
          (a.sort_order ?? 999999) -
          (b.sort_order ?? 999999)
        );
      }

      if (aIndex === undefined) return 1;
      if (bIndex === undefined) return -1;

      return aIndex - bIndex;
    });
  }, [projects, projectOrder]);

  /*
   * ---------------------------------------------------------
   * FILTER + SORT
   * ---------------------------------------------------------
   */

  const filteredProjects = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    const result = orderedProjects.filter(
      project => {
        const matchesCategory =
          filterCategory === 'All' ||
          project.category === filterCategory;

        const technologies =
          project.technologies || [];

        const matchesSearch =
          !query ||
          project.title
            .toLowerCase()
            .includes(query) ||
          (
            project.short_description || ''
          )
            .toLowerCase()
            .includes(query) ||
          (
            project.long_description || ''
          )
            .toLowerCase()
            .includes(query) ||
          technologies.some(
            technology =>
              technology
                .toLowerCase()
                .includes(query)
          );

        return (
          matchesCategory &&
          matchesSearch
        );
      }
    );

    switch (sortMode) {
      case 'newest':
        return [...result].sort((a, b) => {
          const yearA = Number(a.year) || 0;
          const yearB = Number(b.year) || 0;

          return yearB - yearA;
        });

      case 'oldest':
        return [...result].sort((a, b) => {
          const yearA = Number(a.year) || 0;
          const yearB = Number(b.year) || 0;

          return yearA - yearB;
        });

      case 'az':
        return [...result].sort((a, b) =>
          a.title.localeCompare(b.title)
        );

      case 'za':
        return [...result].sort((a, b) =>
          b.title.localeCompare(a.title)
        );

      case 'custom':
      default:
        return result;
    }
  }, [
    orderedProjects,
    searchQuery,
    filterCategory,
    sortMode,
  ]);

  /*
   * ---------------------------------------------------------
   * DRAG START
   * ---------------------------------------------------------
   */

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    projectId: string
  ) => {
    setDraggedId(projectId);

    event.dataTransfer.effectAllowed =
      'move';

    event.dataTransfer.setData(
      'text/plain',
      projectId
    );
  };

  /*
   * ---------------------------------------------------------
   * DRAG OVER
   * ---------------------------------------------------------
   */

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    projectId: string
  ) => {
    event.preventDefault();

    if (
      !draggedId ||
      draggedId === projectId
    ) {
      return;
    }

    setDragOverId(projectId);

    event.dataTransfer.dropEffect =
      'move';
  };

  /*
   * ---------------------------------------------------------
   * DROP
   * ---------------------------------------------------------
   */

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetId: string
  ) => {
    event.preventDefault();

    const sourceId =
      draggedId ||
      event.dataTransfer.getData(
        'text/plain'
      );

    if (
      !sourceId ||
      sourceId === targetId
    ) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    setProjectOrder(previousOrder => {
      const fallbackOrder =
        orderedProjects.map(
          project => project.id
        );

      const currentOrder =
        previousOrder.length
          ? [...previousOrder]
          : fallbackOrder;

      const sourceIndex =
        currentOrder.indexOf(sourceId);

      const targetIndex =
        currentOrder.indexOf(targetId);

      if (
        sourceIndex === -1 ||
        targetIndex === -1
      ) {
        return currentOrder;
      }

      const nextOrder = [
        ...currentOrder,
      ];

      const [movedProject] =
        nextOrder.splice(
          sourceIndex,
          1
        );

      nextOrder.splice(
        targetIndex,
        0,
        movedProject
      );

      try {
        localStorage.setItem(
          PROJECT_ORDER_KEY,
          JSON.stringify(nextOrder)
        );
      } catch (error) {
        console.warn(
          'Unable to save project order:',
          error
        );
      }

      return nextOrder;
    });

    setSortMode('custom');
    setDraggedId(null);
    setDragOverId(null);
  };

  /*
   * ---------------------------------------------------------
   * DRAG END
   * ---------------------------------------------------------
   */

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  /*
   * ---------------------------------------------------------
   * RESET PROJECT ORDER
   * ---------------------------------------------------------
   */

  const resetProjectOrder = () => {
    const defaultOrder = [
      ...(projects || []),
    ]
      .sort(
        (a, b) =>
          (a.sort_order ?? 999999) -
          (b.sort_order ?? 999999)
      )
      .map(project => project.id);

    setProjectOrder(defaultOrder);
    setSortMode('custom');

    try {
      localStorage.setItem(
        PROJECT_ORDER_KEY,
        JSON.stringify(defaultOrder)
      );
    } catch (error) {
      console.warn(
        'Unable to reset project order:',
        error
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * OPEN PROJECT
   * ---------------------------------------------------------
   */

  const openProject = (
    project: Project
  ) => {
    setSelectedProject(project);
    setActiveGalleryIndex(0);
  };

  /*
   * ---------------------------------------------------------
   * SORT LABEL
   * ---------------------------------------------------------
   */

  const sortLabel: Record<
    SortMode,
    string
  > = {
    custom: 'Custom Order',
    newest: 'Newest First',
    oldest: 'Oldest First',
    az: 'A → Z',
    za: 'Z → A',
  };

  /*
   * ---------------------------------------------------------
   * PROJECT DETAIL VIEW
   * ---------------------------------------------------------
   */

  if (selectedProject) {
    const galleryImages =
      selectedProject.gallery?.length
        ? selectedProject.gallery
        : selectedProject.thumbnail_url
          ? [selectedProject.thumbnail_url]
          : [];

    const activeImage =
      galleryImages[
        activeGalleryIndex
      ] || galleryImages[0];

    return (
      <div className="flex h-full flex-col overflow-hidden bg-slate-950 text-slate-100">
        {/* Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 bg-slate-900/90 px-3 sm:px-4">
          <button
            type="button"
            onClick={() => {
              setSelectedProject(null);
              setActiveGalleryIndex(0);
            }}
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </button>

          <div className="flex items-center gap-2">
            {selectedProject.live_url && (
              <a
                href={
                  selectedProject.live_url
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition-all hover:bg-sky-400"
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  Live Demo
                </span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {selectedProject.github_url && (
              <a
                href={
                  selectedProject.github_url
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-all hover:bg-slate-700"
              >
                <Github className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  Repository
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Detail Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-6xl space-y-7">
            {/* Hero */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
              <div className="relative h-60 sm:h-[420px]">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={
                      selectedProject.title
                    }
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950">
                    <FolderKanban className="h-16 w-16 text-sky-400/40" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {selectedProject.category && (
                      <span className="rounded-lg bg-sky-500 px-2.5 py-1 text-[11px] font-bold text-slate-950">
                        {
                          selectedProject.category
                        }
                      </span>
                    )}

                    {selectedProject.year && (
                      <span className="rounded-lg border border-white/10 bg-slate-950/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md">
                        {
                          selectedProject.year
                        }
                      </span>
                    )}

                    {selectedProject.featured && (
                      <span className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-slate-950">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
                    {
                      selectedProject.title
                    }
                  </h1>
                </div>
              </div>

              {/* Gallery */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-slate-950/50 p-3">
                  {galleryImages.map(
                    (image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setActiveGalleryIndex(
                            index
                          )
                        }
                        className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                          activeGalleryIndex ===
                          index
                            ? 'border-sky-400 ring-2 ring-sky-400/20'
                            : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Project Overview */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-sky-400" />

                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Project Overview
                </h2>
              </div>

              <p className="text-sm leading-7 text-slate-300 sm:text-base">
                {selectedProject.long_description ||
                  selectedProject.short_description ||
                  'No project description available.'}
              </p>
            </section>

            {/* Technologies */}
            {selectedProject.technologies &&
              selectedProject.technologies.length >
                0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-sky-400" />

                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                      Technologies &
                      Infrastructure
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map(
                      technology => (
                        <span
                          key={technology}
                          className="rounded-xl border border-sky-400/20 bg-slate-900 px-3 py-1.5 text-xs font-medium text-sky-300"
                        >
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                </section>
              )}

            {/* Challenge / Solution / Results */}
            {(selectedProject.challenges ||
              selectedProject.solution ||
              selectedProject.results) && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {selectedProject.challenges && (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      Key Challenge
                    </p>

                    <p className="text-xs leading-6 text-slate-300">
                      {
                        selectedProject.challenges
                      }
                    </p>
                  </div>
                )}

                {selectedProject.solution && (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-sky-400">
                      Engineering Solution
                    </p>

                    <p className="text-xs leading-6 text-slate-300">
                      {
                        selectedProject.solution
                      }
                    </p>
                  </div>
                )}

                {selectedProject.results && (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      Impact & Outcomes
                    </p>

                    <p className="text-xs leading-6 text-slate-300">
                      {
                        selectedProject.results
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * PROJECT EXPLORER
   * =========================================================
   */

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="shrink-0 border-b border-white/10 bg-slate-900/90">
        <div className="flex min-h-12 items-center gap-2 px-3 sm:px-4">
          {/* Search */}
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />

            <input
              type="text"
              value={searchQuery}
              onChange={event =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search projects..."
              className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-2 pl-9 pr-8 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() =>
                  setSearchQuery('')
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-white/10 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowSortMenu(
                  value => !value
                )
              }
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-2.5 py-2 text-xs text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
              aria-haspopup="menu"
              aria-expanded={showSortMenu}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />

              <span className="hidden sm:inline">
                {sortLabel[sortMode]}
              </span>

              <ChevronDown className="h-3 w-3" />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-1.5 shadow-2xl">
                {(
                  [
                    [
                      'custom',
                      'Custom Order',
                    ],
                    [
                      'newest',
                      'Newest First',
                    ],
                    [
                      'oldest',
                      'Oldest First',
                    ],
                    ['az', 'A → Z'],
                    ['za', 'Z → A'],
                  ] as Array<
                    [SortMode, string]
                  >
                ).map(
                  ([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setSortMode(value);
                        setShowSortMenu(
                          false
                        );
                      }}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                        sortMode === value
                          ? 'bg-sky-500/15 text-sky-300'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={resetProjectOrder}
            title="Reset custom project order"
            className="rounded-xl border border-white/10 bg-slate-800 p-2 text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
            aria-label="Reset custom project order"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* View */}
          <div className="flex items-center rounded-xl border border-white/10 bg-slate-800 p-0.5">
            <button
              type="button"
              onClick={() =>
                setViewMode('grid')
              }
              title="Grid view"
              aria-label="Grid view"
              className={`rounded-lg p-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-sky-500/20 text-sky-300'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() =>
                setViewMode('list')
              }
              title="List view"
              aria-label="List view"
              className={`rounded-lg p-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-sky-500/20 text-sky-300'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Category Bar */}
        <div className="flex gap-1.5 overflow-x-auto px-3 pb-2 sm:px-4">
          {categories.map(category => (
            <button
              key={category}
              type="button"
              onClick={() =>
                setFilterCategory(
                  category
                )
              }
              className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all ${
                filterCategory === category
                  ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-sky-400" />

                <h1 className="text-lg font-bold text-white">
                  Project Showcase
                </h1>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Explore projects, inspect
                architecture, and arrange
                the showcase order.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>
                {filteredProjects.length} of{' '}
                {projects?.length || 0}{' '}
                projects
              </span>

              {sortMode === 'custom' && (
                <>
                  <span>•</span>

                  <span className="flex items-center gap-1 text-sky-400">
                    <GripVertical className="h-3 w-3" />
                    Drag to reorder
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Empty */}
          {filteredProjects.length ===
          0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/40 text-center">
              <div className="mb-4 rounded-2xl bg-slate-800 p-4">
                <Search className="h-7 w-7 text-slate-500" />
              </div>

              <h3 className="text-sm font-bold text-white">
                No projects found
              </h3>

              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Try another search term or
                category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory(
                    'All'
                  );
                }}
                className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-sky-400"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* =================================================
               GRID
            ================================================= */

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map(
                (project, index) => {
                  const isDragging =
                    draggedId ===
                    project.id;

                  const isDragOver =
                    dragOverId ===
                    project.id;

                  return (
                    <div
                      key={project.id}
                      draggable={
                        sortMode ===
                        'custom'
                      }
                      onDragStart={event =>
                        handleDragStart(
                          event,
                          project.id
                        )
                      }
                      onDragOver={event =>
                        handleDragOver(
                          event,
                          project.id
                        )
                      }
                      onDrop={event =>
                        handleDrop(
                          event,
                          project.id
                        )
                      }
                      onDragEnd={
                        handleDragEnd
                      }
                      className={`relative transition-all duration-200 ${
                        isDragging
                          ? 'scale-[0.98] opacity-40'
                          : ''
                      } ${
                        isDragOver
                          ? 'translate-y-1'
                          : ''
                      }`}
                    >
                      {isDragOver &&
                        sortMode ===
                          'custom' && (
                          <div className="absolute -top-2 left-4 right-4 z-20 h-1 rounded-full bg-sky-400 shadow-lg shadow-sky-400/60" />
                        )}

                      <div
                        onClick={() =>
                          openProject(
                            project
                          )
                        }
                        className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border bg-slate-900/70 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900 ${
                          isDragOver
                            ? 'border-sky-400/70 ring-2 ring-sky-400/10'
                            : 'border-white/10 hover:border-sky-500/40'
                        }`}
                      >
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-slate-950">
                          {project.thumbnail_url ? (
                            <img
                              src={
                                project.thumbnail_url
                              }
                              alt={
                                project.title
                              }
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
                              <FolderKanban className="h-12 w-12 text-sky-400/30" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                          {/* Position */}
                          <div className="absolute left-3 top-3 flex items-center gap-2">
                            {sortMode ===
                              'custom' && (
                              <div
                                draggable
                                onDragStart={event =>
                                  handleDragStart(
                                    event,
                                    project.id
                                  )
                                }
                                onClick={event =>
                                  event.stopPropagation()
                                }
                                className="flex cursor-grab items-center gap-1 rounded-lg border border-white/10 bg-slate-950/80 px-2 py-1 text-[10px] text-slate-300 backdrop-blur-md active:cursor-grabbing"
                                title="Drag project"
                              >
                                <GripVertical className="h-3 w-3" />
                                {index +
                                  1}
                              </div>
                            )}

                            {project.featured && (
                              <span className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-[10px] font-bold text-slate-950 shadow-lg">
                                <Sparkles className="h-3 w-3" />
                                Featured
                              </span>
                            )}
                          </div>

                          {/* Category */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                            {project.category && (
                              <span className="max-w-[70%] truncate rounded-lg border border-white/10 bg-slate-950/80 px-2 py-1 text-[10px] font-medium text-slate-200 backdrop-blur-md">
                                {
                                  project.category
                                }
                              </span>
                            )}

                            {project.year && (
                              <span className="rounded-lg border border-white/10 bg-slate-950/80 px-2 py-1 text-[10px] font-semibold text-slate-300 backdrop-blur-md">
                                {
                                  project.year
                                }
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col justify-between p-4">
                          <div>
                            <h3 className="line-clamp-1 text-base font-bold text-white transition-colors group-hover:text-sky-300">
                              {
                                project.title
                              }
                            </h3>

                            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-400">
                              {
                                project.short_description
                              }
                            </p>
                          </div>

                          {/* Technologies */}
                          <div className="mt-4 border-t border-white/5 pt-3">
                            <div className="flex flex-wrap gap-1.5">
                              {(
                                project.technologies ||
                                []
                              )
                                .slice(
                                  0,
                                  4
                                )
                                .map(
                                  technology => (
                                    <span
                                      key={
                                        technology
                                      }
                                      className="rounded-lg bg-slate-800 px-2 py-1 text-[10px] text-slate-300"
                                    >
                                      {
                                        technology
                                      }
                                    </span>
                                  )
                                )}

                              {(
                                project.technologies ||
                                []
                              ).length >
                                4 && (
                                <span className="px-1 py-1 text-[10px] text-slate-500">
                                  +
                                  {(
                                    project.technologies ||
                                    []
                                  ).length -
                                    4}
                                </span>
                              )}
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-sky-400">
                                Inspect Project
                              </span>

                              <ExternalLink className="h-3.5 w-3.5 text-sky-400 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            /* =================================================
               LIST
            ================================================= */

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60">
              {filteredProjects.map(
                (project, index) => {
                  const isDragging =
                    draggedId ===
                    project.id;

                  const isDragOver =
                    dragOverId ===
                    project.id;

                  return (
                    <div
                      key={project.id}
                      draggable={
                        sortMode ===
                        'custom'
                      }
                      onDragStart={event =>
                        handleDragStart(
                          event,
                          project.id
                        )
                      }
                      onDragOver={event =>
                        handleDragOver(
                          event,
                          project.id
                        )
                      }
                      onDrop={event =>
                        handleDrop(
                          event,
                          project.id
                        )
                      }
                      onDragEnd={
                        handleDragEnd
                      }
                      className={`relative border-b border-white/5 last:border-b-0 ${
                        isDragging
                          ? 'opacity-40'
                          : ''
                      }`}
                    >
                      {isDragOver &&
                        sortMode ===
                          'custom' && (
                          <div className="absolute left-0 right-0 top-0 z-10 h-1 bg-sky-400 shadow-lg shadow-sky-400/60" />
                        )}

                      <div
                        onClick={() =>
                          openProject(
                            project
                          )
                        }
                        className="group flex cursor-pointer items-center gap-3 p-3 transition-all hover:bg-white/[0.04] sm:gap-4 sm:p-4"
                      >
                        {/* Drag */}
                        {sortMode ===
                          'custom' && (
                          <div
                            className="hidden cursor-grab text-slate-600 transition-colors hover:text-sky-400 sm:block"
                            title="Drag to reorder"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>
                        )}

                        {/* Number */}
                        <div className="hidden w-6 shrink-0 text-center font-mono text-[10px] text-slate-600 sm:block">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            '0'
                          )}
                        </div>

                        {/* Thumbnail */}
                        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-800 sm:h-16 sm:w-24">
                          {project.thumbnail_url ? (
                            <img
                              src={
                                project.thumbnail_url
                              }
                              alt={
                                project.title
                              }
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <FolderKanban className="h-6 w-6 text-slate-600" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-bold text-white transition-colors group-hover:text-sky-300">
                              {
                                project.title
                              }
                            </h3>

                            {project.featured && (
                              <Star className="h-3 w-3 shrink-0 fill-current text-amber-400" />
                            )}
                          </div>

                          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                            {
                              project.short_description
                            }
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            {project.category && (
                              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[9px] text-slate-400">
                                {
                                  project.category
                                }
                              </span>
                            )}

                            {project.year && (
                              <span className="flex items-center gap-1 text-[9px] text-slate-600">
                                <Calendar className="h-3 w-3" />
                                {
                                  project.year
                                }
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action */}
                        <div className="hidden items-center gap-2 text-sky-400 sm:flex">
                          <span className="text-[10px] font-semibold opacity-0 transition-opacity group-hover:opacity-100">
                            Inspect
                          </span>

                          <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* Bottom Information */}
          {filteredProjects.length >
            0 && (
            <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-slate-900/30 px-4 py-3 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {sortMode === 'custom'
                  ? 'Custom showcase order is saved locally on this device.'
                  : `Sorted by ${sortLabel[
                      sortMode
                    ].toLowerCase()}.`}
              </span>

              {sortMode ===
                'custom' && (
                <span className="flex items-center gap-1">
                  <GripVertical className="h-3 w-3" />
                  Drag any project to
                  reposition it.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsApp;