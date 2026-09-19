// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';

// import { useOS } from '../../context/OSContext';
// import { AppId } from '../../types';
// import { AppIcon } from '../ui/AppIcon';

// import {
//   ArrowLeft,
//   ArrowRight,
//   ArrowUp,
//   RefreshCw,
//   Search,
//   LayoutGrid,
//   List,
//   HardDrive,
//   Folder,
//   ChevronRight,
//   Monitor,
//   FileCode,
//   Shield,
//   Layers,
//   Grid2X2,
//   SortAsc,
//   ListFilter,
//   Network,
//   RotateCcw,
//   Wrench,
//   Code2,
//   MoreHorizontal,
//   Plus,
//   X,
//   Check,
//   ExternalLink,
//   Info,
//   FolderOpen,
//   Copy,
//   Trash2,
//   Pin,
//   Star,
//   Clock3,
//   Tag,
//   Database,
//   Globe2,
//   Server,
//   Settings2,
// } from 'lucide-react';

// /* =========================================================
//    TYPES
// ========================================================= */

// interface DriveItem {
//   letter: string;
//   name: string;
//   label: string;
//   usedGB: number;
//   totalGB: number;
//   appId: AppId;
// }

// interface FolderItem {
//   name: string;
//   appId: AppId;
//   icon: string;
//   desc: string;
//   count: string;
//   type?: string;
// }

// interface NetworkLocation {
//   id: string;
//   name: string;
//   address: string;
//   createdAt: string;
// }

// type ViewMode = 'grid' | 'list';

// type SortMode =
//   | 'name-asc'
//   | 'name-desc'
//   | 'type'
//   | 'size'
//   | 'date';

// type GroupMode = 'none' | 'type' | 'name';

// type ContextTarget =
//   | {
//       type: 'background';
//     }
//   | {
//       type: 'folder';
//       item: FolderItem;
//     }
//   | {
//       type: 'drive';
//       item: DriveItem;
//     };

// interface ContextMenuState {
//   x: number;
//   y: number;
//   target: ContextTarget;
// }

// interface PropertiesTarget {
//   title: string;
//   type: string;
//   location: string;
//   details: string[];
//   icon: 'folder' | 'drive' | 'network' | 'system';
// }

// /* =========================================================
//    STATIC DATA
// ========================================================= */

// const DRIVES: DriveItem[] = [
//   {
//     letter: 'C:',
//     name: 'Local Disk (C:)',
//     label: 'About Abhishek & OS Core',
//     usedGB: 182,
//     totalGB: 512,
//     appId: 'about',
//   },
//   {
//     letter: 'D:',
//     name: 'Projects Volume (D:)',
//     label: 'AI & Web Applications',
//     usedGB: 412,
//     totalGB: 1024,
//     appId: 'projects',
//   },
//   {
//     letter: 'E:',
//     name: 'Workstation Data (E:)',
//     label: 'Experience, Skills & Credentials',
//     usedGB: 64,
//     totalGB: 256,
//     appId: 'experience',
//   },
// ];

// const FOLDERS: FolderItem[] = [
//   {
//     name: 'About',
//     appId: 'about',
//     icon: 'UserCheck',
//     desc: 'System properties & bio',
//     count: '1 profile',
//     type: 'Profile',
//   },
//   {
//     name: 'Projects',
//     appId: 'projects',
//     icon: 'FolderKanban',
//     desc: 'KrishiMitra, Amba, CraveVerse',
//     count: '3+ projects',
//     type: 'Portfolio',
//   },
//   {
//     name: 'Experience',
//     appId: 'experience',
//     icon: 'Briefcase',
//     desc: 'Videoit.io, Fitness Fuel, Edsquare',
//     count: '3 roles',
//     type: 'Career',
//   },
//   {
//     name: 'Skills',
//     appId: 'skills',
//     icon: 'Cpu',
//     desc: 'Languages, Frontend, AI/APIs',
//     count: '31 skills',
//     type: 'Technical',
//   },
//   {
//     name: 'Education',
//     appId: 'education',
//     icon: 'GraduationCap',
//     desc: 'B.Tech Information Technology',
//     count: 'PRMIT&R',
//     type: 'Education',
//   },
//   {
//     name: 'Certifications',
//     appId: 'certifications',
//     icon: 'Award',
//     desc: 'Professional credentials',
//     count: 'Verified',
//     type: 'Credentials',
//   },
//   {
//     name: 'Contact',
//     appId: 'contact',
//     icon: 'Mail',
//     desc: 'Email, phone, inquiry form',
//     count: 'Direct channels',
//     type: 'Communication',
//   },
// ];

// const NETWORK_STORAGE_KEY =
//   'abhishek-os-network-locations-v1';

// /* =========================================================
//    SMALL HELPERS
// ========================================================= */

// const loadNetworkLocations = (): NetworkLocation[] => {
//   try {
//     const raw = localStorage.getItem(NETWORK_STORAGE_KEY);

//     if (!raw) return [];

//     const parsed = JSON.parse(raw);

//     return Array.isArray(parsed) ? parsed : [];
//   } catch {
//     return [];
//   }
// };

// const saveNetworkLocations = (
//   locations: NetworkLocation[],
// ) => {
//   try {
//     localStorage.setItem(
//       NETWORK_STORAGE_KEY,
//       JSON.stringify(locations),
//     );
//   } catch {
//     // Ignore storage failures gracefully.
//   }
// };

// const formatDate = (date: string) => {
//   try {
//     return new Intl.DateTimeFormat('en-IN', {
//       dateStyle: 'medium',
//       timeStyle: 'short',
//     }).format(new Date(date));
//   } catch {
//     return date;
//   }
// };

// /* =========================================================
//    CONTEXT MENU COMPONENT
// ========================================================= */

// interface ContextMenuProps {
//   menu: ContextMenuState;
//   onClose: () => void;
//   onView: (view: ViewMode) => void;
//   onSort: (sort: SortMode) => void;
//   onGroup: (group: GroupMode) => void;
//   onAddNetwork: () => void;
//   onUndoDelete: () => void;
//   onProperties: () => void;
//   onOpenCode: () => void;
//   onShowMore: () => void;
// }

// const ContextMenu: React.FC<ContextMenuProps> = ({
//   menu,
//   onClose,
//   onView,
//   onSort,
//   onGroup,
//   onAddNetwork,
//   onUndoDelete,
//   onProperties,
//   onOpenCode,
//   onShowMore,
// }) => {
//   const [activeSubmenu, setActiveSubmenu] = useState<
//     'view' | 'sort' | 'group' | null
//   >(null);

//   const menuRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const handlePointerDown = (event: MouseEvent) => {
//       if (
//         menuRef.current &&
//         !menuRef.current.contains(
//           event.target as Node,
//         )
//       ) {
//         onClose();
//       }
//     };

//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         onClose();
//       }
//     };

//     document.addEventListener(
//       'mousedown',
//       handlePointerDown,
//     );

//     document.addEventListener(
//       'keydown',
//       handleKeyDown,
//     );

//     return () => {
//       document.removeEventListener(
//         'mousedown',
//         handlePointerDown,
//       );

//       document.removeEventListener(
//         'keydown',
//         handleKeyDown,
//       );
//     };
//   }, [onClose]);

//   const itemBase =
//     'group w-full flex items-center gap-3 px-3 py-2.5 text-left text-[13px] text-slate-100 rounded-lg transition-all duration-150 hover:bg-white/[0.08] active:bg-white/[0.12]';

//   const disabledBase =
//     'opacity-40 cursor-not-allowed hover:bg-transparent';

//   const submenuBase =
//     'absolute left-[calc(100%+6px)] top-0 min-w-[190px] rounded-xl border border-white/10 bg-[#292929]/[0.98] backdrop-blur-2xl shadow-2xl shadow-black/50 p-1.5 animate-[menuSlide_.12s_ease-out]';

//   return (
//     <>
//       <style>
//         {`
//           @keyframes menuSlide {
//             from {
//               opacity: 0;
//               transform: translateY(-4px) scale(.98);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0) scale(1);
//             }
//           }

//           @keyframes menuPop {
//             from {
//               opacity: 0;
//               transform: scale(.96) translateY(-4px);
//             }
//             to {
//               opacity: 1;
//               transform: scale(1) translateY(0);
//             }
//           }
//         `}
//       </style>

//       <div
//         ref={menuRef}
//         className="absolute z-[9999] min-w-[250px] rounded-xl border border-white/10 bg-[#292929]/[0.98] backdrop-blur-2xl shadow-2xl shadow-black/50 p-1.5 animate-[menuPop_.12s_ease-out]"
//         style={{
//           left: menu.x,
//           top: menu.y,
//         }}
//         onContextMenu={(event) =>
//           event.preventDefault()
//         }
//       >
//         {/* VIEW */}

//         <div className="relative">
//           <button
//             type="button"
//             className={itemBase}
//             onMouseEnter={() =>
//               setActiveSubmenu('view')
//             }
//             onClick={() =>
//               setActiveSubmenu(
//                 activeSubmenu === 'view'
//                   ? null
//                   : 'view',
//               )
//             }
//           >
//             <Grid2X2 className="w-4 h-4 text-slate-300" />

//             <span className="flex-1">
//               View
//             </span>

//             <ChevronRight className="w-4 h-4 text-slate-400" />
//           </button>

//           {activeSubmenu === 'view' && (
//             <div className={submenuBase}>
//               <button
//                 type="button"
//                 className={itemBase}
//                 onClick={() => {
//                   onView('grid');
//                   onClose();
//                 }}
//               >
//                 <LayoutGrid className="w-4 h-4 text-sky-400" />

//                 <span className="flex-1">
//                   Large icons
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 className={itemBase}
//                 onClick={() => {
//                   onView('list');
//                   onClose();
//                 }}
//               >
//                 <List className="w-4 h-4 text-sky-400" />

//                 <span className="flex-1">
//                   Details
//                 </span>
//               </button>
//             </div>
//           )}
//         </div>

//         {/* SORT */}

//         <div className="relative">
//           <button
//             type="button"
//             className={itemBase}
//             onMouseEnter={() =>
//               setActiveSubmenu('sort')
//             }
//             onClick={() =>
//               setActiveSubmenu(
//                 activeSubmenu === 'sort'
//                   ? null
//                   : 'sort',
//               )
//             }
//           >
//             <SortAsc className="w-4 h-4 text-sky-300" />

//             <span className="flex-1">
//               Sort by
//             </span>

//             <ChevronRight className="w-4 h-4 text-slate-400" />
//           </button>

//           {activeSubmenu === 'sort' && (
//             <div className={submenuBase}>
//               <button
//                 type="button"
//                 className={itemBase}
//                 onClick={() => {
//                   onSort('name-asc');
//                   onClose();
//                 }}
//               >
//                 <span className="flex-1">
//                   Name
//                 </span>
//                 <span className="text-[10px] text-slate-500">
//                   A–Z
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 className={itemBase}
//                 onClick={() => {
//                   onSort('name-desc');
//                   onClose();
//                 }}
//               >
//                 <span className="flex-1">
//                   Name
//                 </span>
//                 <span className="text-[10px] text-slate-500">
//                   Z–A
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 className={itemBase}
//                 onClick={() => {
//                   onSort('type');
//                   onClose();
//                 }}
//               >
//                 <Tag className="w-4 h-4 text-slate-400" />
//                 <span className="flex-1">
//                   Type
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 className={itemBase}
//                 onClick={() => {
//                   onSort('size');
//                   onClose();
//                 }}
//               >
//                 <Database className="w-4 h-4 text-slate-400" />
//                 <span className="flex-1">
//                   Size
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 className={itemBase}
//                 onClick={() => {
//                   onSort('date');
//                   onClose();
//                 }}
//               >
//                 <Clock3 className="w-4 h-4 text-slate-400" />
//                 <span className="flex-1">
//                   Date modified
//                 </span>
//               </button>
//             </div>
//           )}
//         </div>

//         {/* GROUP */}

//         <div className="relative">
//           <button
//             type="button"
//             className={itemBase}
//             onMouseEnter={() =>
//               setActiveSubmenu('group')
//             }
//             onClick={() =>
//               setActiveSubmenu(
//                 activeSubmenu === 'group'
//                   ? null
//                   : 'group',
//               )
//             }
//           >
//             <ListFilter className="w-4 h-4 text-sky-300" />

//             <span className="flex-1">
//               Group by
//             </span>

//             <ChevronRight className="w-4 h-4 text-slate-400" />
//           </button>

//           {activeSubmenu === 'group' && (
//             <div className={submenuBase}>
//               <button
//                 type="button"
//                 className={itemBase}
//                 onClick={() => {
//                   onGroup('none');
//                   onClose();
//                 }}
//               >
//                 <span className="flex-1">
//                   None
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 className={itemBase}
//                 onClick={() => {
//                   onGroup('type');
//                   onClose();
//                 }}
//               >
//                 <Tag className="w-4 h-4 text-slate-400" />
//                 <span className="flex-1">
//                   Type
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 className={itemBase}
//                 onClick={() => {
//                   onGroup('name');
//                   onClose();
//                 }}
//               >
//                 <List className="w-4 h-4 text-slate-400" />
//                 <span className="flex-1">
//                   Name
//                 </span>
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="h-px bg-white/10 my-1.5" />

//         {/* NETWORK LOCATION */}

//         <button
//           type="button"
//           className={itemBase}
//           onClick={() => {
//             onAddNetwork();
//             onClose();
//           }}
//         >
//           <Network className="w-4 h-4 text-slate-300" />

//           <span className="flex-1">
//             Add a network location
//           </span>
//         </button>

//         {/* UNDO DELETE */}

//         <button
//           type="button"
//           className={itemBase}
//           onClick={() => {
//             onUndoDelete();
//             onClose();
//           }}
//         >
//           <RotateCcw className="w-4 h-4 text-sky-300" />

//           <span className="flex-1">
//             Undo Delete
//           </span>

//           <span className="text-[11px] text-slate-500">
//             Ctrl+Z
//           </span>
//         </button>

//         {/* PROPERTIES */}

//         <button
//           type="button"
//           className={itemBase}
//           onClick={() => {
//             onProperties();
//             onClose();
//           }}
//         >
//           <Wrench className="w-4 h-4 text-slate-300" />

//           <span className="flex-1">
//             Properties
//           </span>

//           <span className="text-[11px] text-slate-500">
//             Alt+Enter
//           </span>
//         </button>

//         <div className="h-px bg-white/10 my-1.5" />

//         {/* CODE */}

//         <button
//           type="button"
//           className={itemBase}
//           onClick={() => {
//             onOpenCode();
//             onClose();
//           }}
//         >
//           <Code2 className="w-4 h-4 text-sky-400" />

//           <span className="flex-1">
//             Open with Code
//           </span>
//         </button>

//         {/* MORE OPTIONS */}

//         <button
//           type="button"
//           className={itemBase}
//           onClick={() => {
//             onShowMore();
//             onClose();
//           }}
//         >
//           <MoreHorizontal className="w-4 h-4 text-slate-300" />

//           <span className="flex-1">
//             Show more options
//           </span>
//         </button>
//       </div>
//     </>
//   );
// };

// /* =========================================================
//    NETWORK LOCATION MODAL
// ========================================================= */

// interface NetworkLocationModalProps {
//   onClose: () => void;
//   onSave: (
//     name: string,
//     address: string,
//   ) => void;
// }

// const NetworkLocationModal: React.FC<
//   NetworkLocationModalProps
// > = ({ onClose, onSave }) => {
//   const [name, setName] = useState('');
//   const [address, setAddress] = useState('');
//   const [error, setError] = useState('');

//   const submit = () => {
//     const cleanName = name.trim();
//     const cleanAddress = address.trim();

//     if (!cleanName) {
//       setError('Please enter a location name.');
//       return;
//     }

//     if (!cleanAddress) {
//       setError('Please enter a network address.');
//       return;
//     }

//     onSave(cleanName, cleanAddress);
//   };

//   return (
//     <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-[menuPop_.15s_ease-out]">
//       <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#202020]/[0.98] shadow-2xl shadow-black/60 overflow-hidden">
//         <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center">
//               <Network className="w-5 h-5 text-sky-400" />
//             </div>

//             <div>
//               <h2 className="text-sm font-semibold text-white">
//                 Add a network location
//               </h2>

//               <p className="text-[11px] text-slate-400 mt-0.5">
//                 Add a custom location to This PC
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         <div className="p-5 space-y-4">
//           <div>
//             <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
//               Location name
//             </label>

//             <input
//               autoFocus
//               value={name}
//               onChange={(e) => {
//                 setName(e.target.value);
//                 setError('');
//               }}
//               placeholder="e.g. Company Server"
//               className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/10"
//             />
//           </div>

//           <div>
//             <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
//               Network address
//             </label>

//             <input
//               value={address}
//               onChange={(e) => {
//                 setAddress(e.target.value);
//                 setError('');
//               }}
//               placeholder="https://example.com or //server/share"
//               className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/10"
//             />
//           </div>

//           {error && (
//             <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300">
//               {error}
//             </div>
//           )}

//           <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
//             <div className="flex gap-2.5">
//               <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />

//               <p className="text-[11px] leading-relaxed text-slate-400">
//                 This is a portfolio OS simulation. The location
//                 is stored locally in this browser and will appear
//                 under Network Locations.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-white/10 bg-black/10">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/10 transition"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={submit}
//             className="px-4 py-2 rounded-lg text-xs font-medium bg-sky-500 hover:bg-sky-400 text-white transition shadow-lg shadow-sky-500/20"
//           >
//             Add location
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    PROPERTIES MODAL
// ========================================================= */

// interface PropertiesModalProps {
//   target: PropertiesTarget;
//   onClose: () => void;
// }

// const PropertiesModal: React.FC<
//   PropertiesModalProps
// > = ({ target, onClose }) => {
//   const Icon =
//     target.icon === 'drive'
//       ? HardDrive
//       : target.icon === 'network'
//         ? Network
//         : target.icon === 'system'
//           ? Monitor
//           : Folder;

//   return (
//     <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-[menuPop_.15s_ease-out]">
//       <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#202020]/[0.98] shadow-2xl shadow-black/60 overflow-hidden">
//         <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
//           <div className="flex items-center gap-3 min-w-0">
//             <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0">
//               <Icon className="w-5 h-5 text-sky-400" />
//             </div>

//             <div className="min-w-0">
//               <h2 className="text-sm font-semibold text-white truncate">
//                 {target.title}
//               </h2>

//               <p className="text-[11px] text-slate-400">
//                 Properties
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         <div className="p-5 space-y-5">
//           <div className="grid grid-cols-2 gap-3">
//             <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
//               <div className="text-[10px] uppercase tracking-wider text-slate-500">
//                 Type
//               </div>

//               <div className="text-xs text-slate-200 mt-1">
//                 {target.type}
//               </div>
//             </div>

//             <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
//               <div className="text-[10px] uppercase tracking-wider text-slate-500">
//                 Location
//               </div>

//               <div className="text-xs text-slate-200 mt-1 truncate">
//                 {target.location}
//               </div>
//             </div>
//           </div>

//           <div>
//             <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
//               Details
//             </div>

//             <div className="rounded-xl border border-white/5 bg-slate-900/60 divide-y divide-white/5 overflow-hidden">
//               {target.details.map(
//                 (detail, index) => (
//                   <div
//                     key={`${detail}-${index}`}
//                     className="px-3 py-2.5 text-xs text-slate-300 flex items-center gap-2"
//                   >
//                     <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
//                     {detail}
//                   </div>
//                 ),
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end px-5 py-4 border-t border-white/10">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-5 py-2 rounded-lg text-xs font-medium bg-sky-500 hover:bg-sky-400 text-white transition"
//           >
//             OK
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    MORE OPTIONS MODAL
// ========================================================= */

// interface MoreOptionsModalProps {
//   onClose: () => void;
//   onProperties: () => void;
//   onRefresh: () => void;
// }

// const MoreOptionsModal: React.FC<
//   MoreOptionsModalProps
// > = ({
//   onClose,
//   onProperties,
//   onRefresh,
// }) => {
//   return (
//     <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-[menuPop_.15s_ease-out]">
//       <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#202020]/[0.98] shadow-2xl shadow-black/60 overflow-hidden">
//         <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
//           <div>
//             <h2 className="text-sm font-semibold text-white">
//               More options
//             </h2>

//             <p className="text-[11px] text-slate-400 mt-0.5">
//               Additional This PC actions
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         <div className="p-3 grid grid-cols-2 gap-2">
//           <button
//             type="button"
//             onClick={() => {
//               onRefresh();
//               onClose();
//             }}
//             className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] p-3 text-left transition"
//           >
//             <RefreshCw className="w-4 h-4 text-sky-400" />

//             <div>
//               <div className="text-xs font-medium text-white">
//                 Refresh
//               </div>

//               <div className="text-[10px] text-slate-500">
//                 Reload this view
//               </div>
//             </div>
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               onProperties();
//               onClose();
//             }}
//             className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] p-3 text-left transition"
//           >
//             <Settings2 className="w-4 h-4 text-sky-400" />

//             <div>
//               <div className="text-xs font-medium text-white">
//                 Properties
//               </div>

//               <div className="text-[10px] text-slate-500">
//                 View system details
//               </div>
//             </div>
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               window.dispatchEvent(
//                 new CustomEvent(
//                   'abhishek:open-desktop-settings',
//                 ),
//               );

//               onClose();
//             }}
//             className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] p-3 text-left transition"
//           >
//             <Monitor className="w-4 h-4 text-sky-400" />

//             <div>
//               <div className="text-xs font-medium text-white">
//                 Display settings
//               </div>

//               <div className="text-[10px] text-slate-500">
//                 Desktop personalization
//               </div>
//             </div>
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               window.dispatchEvent(
//                 new CustomEvent(
//                   'abhishek:open-terminal',
//                 ),
//               );

//               onClose();
//             }}
//             className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] p-3 text-left transition"
//           >
//             <Code2 className="w-4 h-4 text-sky-400" />

//             <div>
//               <div className="text-xs font-medium text-white">
//                 Terminal
//               </div>

//               <div className="text-[10px] text-slate-500">
//                 Open command shell
//               </div>
//             </div>
//           </button>
//         </div>

//         <div className="px-5 py-4 border-t border-white/10 flex justify-end">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-5 py-2 rounded-lg text-xs bg-sky-500 hover:bg-sky-400 text-white font-medium transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    MAIN APP
// ========================================================= */

// export const ThisPCApp: React.FC = () => {
//   const {
//     openApp,
//   } = useOS();

//   const mainPaneRef =
//     useRef<HTMLDivElement | null>(null);

//   const [currentPath, setCurrentPath] =
//     useState('This PC');

//   const [viewMode, setViewMode] =
//     useState<ViewMode>('grid');

//   const [searchQuery, setSearchQuery] =
//     useState('');

//   const [sortMode, setSortMode] =
//     useState<SortMode>('name-asc');

//   const [groupMode, setGroupMode] =
//     useState<GroupMode>('none');

//   const [contextMenu, setContextMenu] =
//     useState<ContextMenuState | null>(null);

//   const [
//     networkModalOpen,
//     setNetworkModalOpen,
//   ] = useState(false);

//   const [
//     propertiesTarget,
//     setPropertiesTarget,
//   ] = useState<PropertiesTarget | null>(
//     null,
//   );

//   const [
//     moreOptionsOpen,
//     setMoreOptionsOpen,
//   ] = useState(false);

//   const [
//     networkLocations,
//     setNetworkLocations,
//   ] = useState<NetworkLocation[]>(
//     () => loadNetworkLocations(),
//   );

//   const [selectedItem, setSelectedItem] =
//     useState<string | null>(null);

//   const [refreshKey, setRefreshKey] =
//     useState(0);

//   /* =======================================================
//      SEARCH
//   ======================================================= */

//   const filteredFolders = useMemo(() => {
//     const query =
//       searchQuery.trim().toLowerCase();

//     if (!query) return FOLDERS;

//     return FOLDERS.filter((folder) => {
//       return (
//         folder.name
//           .toLowerCase()
//           .includes(query) ||
//         folder.desc
//           .toLowerCase()
//           .includes(query) ||
//         folder.count
//           .toLowerCase()
//           .includes(query) ||
//         folder.type
//           ?.toLowerCase()
//           .includes(query)
//       );
//     });
//   }, [searchQuery]);

//   /* =======================================================
//      SORT
//   ======================================================= */

//   const sortedFolders = useMemo(() => {
//     const items = [...filteredFolders];

//     switch (sortMode) {
//       case 'name-desc':
//         return items.sort((a, b) =>
//           b.name.localeCompare(a.name),
//         );

//       case 'type':
//         return items.sort((a, b) =>
//           (a.type || '').localeCompare(
//             b.type || '',
//           ),
//         );

//       case 'size':
//         return items.sort(
//           (a, b) =>
//             b.count.length - a.count.length,
//         );

//       case 'date':
//         return items.reverse();

//       case 'name-asc':
//       default:
//         return items.sort((a, b) =>
//           a.name.localeCompare(b.name),
//         );
//     }
//   }, [filteredFolders, sortMode]);

//   /* =======================================================
//      GROUP
//   ======================================================= */

//   const groupedFolders = useMemo(() => {
//     if (groupMode === 'none') {
//       return [
//         {
//           title: '',
//           items: sortedFolders,
//         },
//       ];
//     }

//     const groups =
//       new Map<string, FolderItem[]>();

//     sortedFolders.forEach((folder) => {
//       const key =
//         groupMode === 'type'
//           ? folder.type || 'Other'
//           : folder.name.charAt(0).toUpperCase();

//       if (!groups.has(key)) {
//         groups.set(key, []);
//       }

//       groups.get(key)!.push(folder);
//     });

//     return Array.from(groups.entries())
//       .sort(([a], [b]) =>
//         a.localeCompare(b),
//       )
//       .map(([title, items]) => ({
//         title,
//         items,
//       }));
//   }, [sortedFolders, groupMode]);

//   /* =======================================================
//      CONTEXT MENU POSITION
//   ======================================================= */

//   const openContextMenu = useCallback(
//     (
//       event: React.MouseEvent,
//       target: ContextTarget = {
//         type: 'background',
//       },
//     ) => {
//       event.preventDefault();
//       event.stopPropagation();

//       const container =
//         mainPaneRef.current;

//       if (!container) return;

//       const rect =
//         container.getBoundingClientRect();

//       const menuWidth = 255;
//       const menuHeight = 430;

//       let x =
//         event.clientX - rect.left;

//       let y =
//         event.clientY - rect.top;

//       const maxX =
//         container.clientWidth -
//         menuWidth -
//         10;

//       const maxY =
//         container.clientHeight -
//         menuHeight -
//         10;

//       x = Math.max(
//         8,
//         Math.min(x, Math.max(8, maxX)),
//       );

//       y = Math.max(
//         8,
//         Math.min(y, Math.max(8, maxY)),
//       );

//       setContextMenu({
//         x,
//         y,
//         target,
//       });

//       setSelectedItem(
//         target.type === 'folder'
//           ? `folder-${target.item.name}`
//           : target.type === 'drive'
//             ? `drive-${target.item.letter}`
//             : null,
//       );
//     },
//     [],
//   );

//   const closeContextMenu =
//     useCallback(() => {
//       setContextMenu(null);
//     }, []);

//   /* =======================================================
//      NETWORK LOCATION
//   ======================================================= */

//   const addNetworkLocation = (
//     name: string,
//     address: string,
//   ) => {
//     const newLocation: NetworkLocation = {
//       id: `network-${Date.now()}`,
//       name,
//       address,
//       createdAt:
//         new Date().toISOString(),
//     };

//     const updated = [
//       ...networkLocations,
//       newLocation,
//     ];

//     setNetworkLocations(updated);
//     saveNetworkLocations(updated);

//     setNetworkModalOpen(false);
//   };

//   /* =======================================================
//      PROPERTIES
//   ======================================================= */

//   const openProperties = useCallback(() => {
//     if (
//       contextMenu?.target.type ===
//       'folder'
//     ) {
//       const folder =
//         contextMenu.target.item;

//       setPropertiesTarget({
//         title: folder.name,
//         type: `${folder.type || 'Folder'} folder`,
//         location: `This PC\\${folder.name}`,
//         details: [
//           folder.desc,
//           folder.count,
//           'Available from the Abhishek OS workspace.',
//           'Double-click to open the application.',
//         ],
//         icon: 'folder',
//       });

//       return;
//     }

//     if (
//       contextMenu?.target.type ===
//       'drive'
//     ) {
//       const drive =
//         contextMenu.target.item;

//       const free =
//         drive.totalGB -
//         drive.usedGB;

//       setPropertiesTarget({
//         title: drive.name,
//         type: 'Conceptual drive',
//         location: drive.letter,
//         details: [
//           drive.label,
//           `${drive.usedGB} GB used`,
//           `${free} GB free`,
//           `${drive.totalGB} GB total capacity`,
//         ],
//         icon: 'drive',
//       });

//       return;
//     }

//     setPropertiesTarget({
//       title: 'This PC',
//       type: 'System location',
//       location: 'This PC',
//       details: [
//         `${FOLDERS.length} portfolio folders`,
//         `${DRIVES.length} conceptual drives`,
//         `${networkLocations.length} network locations`,
//         'Abhishek OS portfolio environment',
//       ],
//       icon: 'system',
//     });
//   }, [contextMenu, networkLocations.length]);

//   /* =======================================================
//      UNDO DELETE
//   ======================================================= */

//   const handleUndoDelete =
//     useCallback(() => {
//       window.dispatchEvent(
//         new CustomEvent(
//           'abhishek:undo-delete',
//         ),
//       );
//     }, []);

//   /* =======================================================
//      OPEN WITH CODE
//   ======================================================= */

//   const handleOpenWithCode =
//     useCallback(() => {
//       try {
//         openApp('code' as AppId);
//       } catch {
//         window.dispatchEvent(
//           new CustomEvent(
//             'abhishek:open-code',
//           ),
//         );
//       }
//     }, [openApp]);

//   /* =======================================================
//      REFRESH
//   ======================================================= */

//   const handleRefresh = useCallback(() => {
//     setRefreshKey(
//       (previous) => previous + 1,
//     );
//   }, []);

//   /* =======================================================
//      KEYBOARD SHORTCUTS
//   ======================================================= */

//   useEffect(() => {
//     const handleKeyDown = (
//       event: KeyboardEvent,
//     ) => {
//       if (
//         event.ctrlKey &&
//         event.key.toLowerCase() === 'z'
//       ) {
//         event.preventDefault();
//         handleUndoDelete();
//         return;
//       }

//       if (
//         event.altKey &&
//         event.key === 'Enter'
//       ) {
//         event.preventDefault();

//         setContextMenu(null);

//         setPropertiesTarget({
//           title: 'This PC',
//           type: 'System location',
//           location: 'This PC',
//           details: [
//             `${FOLDERS.length} portfolio folders`,
//             `${DRIVES.length} conceptual drives`,
//             `${networkLocations.length} network locations`,
//             'Abhishek OS portfolio environment',
//           ],
//           icon: 'system',
//         });
//       }

//       if (event.key === 'Escape') {
//         setContextMenu(null);
//         setPropertiesTarget(null);
//         setNetworkModalOpen(false);
//         setMoreOptionsOpen(false);
//       }
//     };

//     window.addEventListener(
//       'keydown',
//       handleKeyDown,
//     );

//     return () => {
//       window.removeEventListener(
//         'keydown',
//         handleKeyDown,
//       );
//     };
//   }, [
//     handleUndoDelete,
//     networkLocations.length,
//   ]);

//   /* =======================================================
//      OPEN FOLDER
//   ======================================================= */

//   const handleOpenFolder = (
//     folder: FolderItem,
//   ) => {
//     setSelectedItem(
//       `folder-${folder.name}`,
//     );

//     openApp(folder.appId);
//   };

//   /* =======================================================
//      OPEN DRIVE
//   ======================================================= */

//   const handleOpenDrive = (
//     drive: DriveItem,
//   ) => {
//     setSelectedItem(
//       `drive-${drive.letter}`,
//     );

//     openApp(drive.appId);
//   };

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <div
//       key={refreshKey}
//       className="relative flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-hidden"
//       onContextMenu={(event) =>
//         openContextMenu(event)
//       }
//     >
//       {/* ===================================================
//           TOOLBAR
//       =================================================== */}

//       <div className="h-11 px-3 border-b border-white/10 bg-slate-900/90 backdrop-blur-xl flex items-center justify-between gap-2 shrink-0">
//         {/* Navigation */}

//         <div className="flex items-center gap-1.5 flex-1 min-w-0">
//           <button
//             type="button"
//             onClick={() =>
//               setCurrentPath('This PC')
//             }
//             className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
//             title="Back"
//           >
//             <ArrowLeft className="w-3.5 h-3.5" />
//           </button>

//           <button
//             type="button"
//             disabled
//             className="p-1.5 rounded-lg text-slate-500 opacity-40 cursor-not-allowed"
//             title="Forward"
//           >
//             <ArrowRight className="w-3.5 h-3.5" />
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               setCurrentPath('This PC')
//             }
//             className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
//             title="Up"
//           >
//             <ArrowUp className="w-3.5 h-3.5" />
//           </button>

//           <button
//             type="button"
//             onClick={handleRefresh}
//             className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
//             title="Refresh"
//           >
//             <RefreshCw className="w-3.5 h-3.5" />
//           </button>

//           {/* Breadcrumb */}

//           <div className="flex-1 flex items-center px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-white/10 text-xs font-mono text-slate-300 min-w-0">
//             <Monitor className="w-3.5 h-3.5 text-sky-400 mr-1.5 shrink-0" />

//             <span className="truncate">
//               {currentPath}
//             </span>
//           </div>
//         </div>

//         {/* Search */}

//         <div className="flex items-center gap-2 shrink-0">
//           <div className="relative w-36 sm:w-48">
//             <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />

//             <input
//               type="text"
//               placeholder="Search This PC..."
//               value={searchQuery}
//               onChange={(event) =>
//                 setSearchQuery(
//                   event.target.value,
//                 )
//               }
//               className="w-full bg-slate-800/80 border border-white/10 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400/60"
//             />
//           </div>

//           {/* View switch */}

//           <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg border border-white/10 p-0.5">
//             <button
//               type="button"
//               onClick={() =>
//                 setViewMode('grid')
//               }
//               className={`p-1.5 rounded-md transition ${
//                 viewMode === 'grid'
//                   ? 'bg-sky-500/25 text-sky-300'
//                   : 'text-slate-400 hover:text-white'
//               }`}
//               title="Grid view"
//             >
//               <LayoutGrid className="w-3.5 h-3.5" />
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 setViewMode('list')
//               }
//               className={`p-1.5 rounded-md transition ${
//                 viewMode === 'list'
//                   ? 'bg-sky-500/25 text-sky-300'
//                   : 'text-slate-400 hover:text-white'
//               }`}
//               title="List view"
//             >
//               <List className="w-3.5 h-3.5" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ===================================================
//           MAIN CONTENT
//       =================================================== */}

//       <div className="flex-1 flex overflow-hidden">
//         {/* =================================================
//             SIDEBAR
//         ================================================= */}

//         <aside className="w-48 hidden md:flex flex-col border-r border-white/10 bg-slate-900/40 p-2 space-y-4 overflow-y-auto text-xs">
//           <div>
//             <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1.5">
//               Quick Access
//             </div>

//             <div className="space-y-0.5">
//               {FOLDERS.map((folder) => (
//                 <button
//                   key={folder.name}
//                   type="button"
//                   onClick={() =>
//                     handleOpenFolder(
//                       folder,
//                     )
//                   }
//                   onContextMenu={(event) =>
//                     openContextMenu(
//                       event,
//                       {
//                         type: 'folder',
//                         item: folder,
//                       },
//                     )
//                   }
//                   className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-left transition"
//                 >
//                   <AppIcon
//                     name={folder.icon}
//                     className="w-4 h-4 text-sky-400 shrink-0"
//                   />

//                   <span className="truncate">
//                     {folder.name}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1.5">
//               This PC
//             </div>

//             <button
//               type="button"
//               onClick={() =>
//                 setCurrentPath('This PC')
//               }
//               className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 text-left transition"
//             >
//               <Monitor className="w-4 h-4 text-sky-400" />

//               <span>This PC</span>
//             </button>
//           </div>

//           <div>
//             <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1.5">
//               Conceptual Drives
//             </div>

//             <div className="space-y-0.5">
//               {DRIVES.map((drive) => (
//                 <button
//                   key={drive.letter}
//                   type="button"
//                   onClick={() =>
//                     handleOpenDrive(
//                       drive,
//                     )
//                   }
//                   onContextMenu={(event) =>
//                     openContextMenu(
//                       event,
//                       {
//                         type: 'drive',
//                         item: drive,
//                       },
//                     )
//                   }
//                   className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-left transition"
//                 >
//                   <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />

//                   <span className="truncate">
//                     {drive.name}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Network */}

//           {networkLocations.length > 0 && (
//             <div>
//               <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1.5">
//                 Network Locations
//               </div>

//               <div className="space-y-0.5">
//                 {networkLocations.map(
//                   (location) => (
//                     <button
//                       key={location.id}
//                       type="button"
//                       onClick={() => {
//                         window.open(
//                           location.address,
//                           '_blank',
//                           'noopener,noreferrer',
//                         );
//                       }}
//                       className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-left transition"
//                       title={location.address}
//                     >
//                       <Globe2 className="w-4 h-4 text-violet-400 shrink-0" />

//                       <span className="truncate">
//                         {location.name}
//                       </span>
//                     </button>
//                   ),
//                 )}
//               </div>
//             </div>
//           )}
//         </aside>

//         {/* =================================================
//             RIGHT PANE
//         ================================================= */}

//         <main
//           ref={mainPaneRef}
//           className="relative flex-1 overflow-y-auto p-4 space-y-7"
//           onContextMenu={(event) =>
//             openContextMenu(event)
//           }
//           onClick={() => {
//             setSelectedItem(null);
//           }}
//         >
//           {/* =================================================
//               HEADER
//           ================================================= */}

//           <div className="flex items-end justify-between gap-4">
//             <div>
//               <div className="flex items-center gap-2">
//                 <Monitor className="w-5 h-5 text-sky-400" />

//                 <h1 className="text-base font-semibold text-white">
//                   This PC
//                 </h1>
//               </div>

//               <p className="text-[11px] text-slate-500 mt-1">
//                 Manage your Abhishek OS workspace
//               </p>
//             </div>

//             <div className="flex items-center gap-2 text-[10px] text-slate-500">
//               <span>
//                 {filteredFolders.length} folders
//               </span>

//               <span className="text-slate-700">
//                 •
//               </span>

//               <span>
//                 {DRIVES.length} drives
//               </span>

//               <span className="text-slate-700">
//                 •
//               </span>

//               <span>
//                 {networkLocations.length} network
//               </span>
//             </div>
//           </div>

//           {/* =================================================
//               FOLDERS
//           ================================================= */}

//           <section>
//             <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
//               <span>
//                 Folders ({filteredFolders.length})
//               </span>

//               <span className="text-[10px] lowercase text-slate-500 font-normal">
//                 Double-click to open • Right-click for options
//               </span>
//             </div>

//             {filteredFolders.length === 0 ? (
//               <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/30 py-12 flex flex-col items-center justify-center text-center">
//                 <Search className="w-8 h-8 text-slate-600 mb-3" />

//                 <h3 className="text-sm font-medium text-slate-300">
//                   No results found
//                 </h3>

//                 <p className="text-xs text-slate-500 mt-1">
//                   Try another search term.
//                 </p>
//               </div>
//             ) : (
//               groupedFolders.map(
//                 (group) => (
//                   <div
//                     key={
//                       group.title || 'ungrouped'
//                     }
//                     className="mb-5 last:mb-0"
//                   >
//                     {group.title && (
//                       <div className="flex items-center gap-2 mb-2">
//                         <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
//                           {group.title}
//                         </div>

//                         <div className="h-px bg-white/5 flex-1" />
//                       </div>
//                     )}

//                     {viewMode === 'grid' ? (
//                       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
//                         {group.items.map(
//                           (folder) => {
//                             const itemId = `folder-${folder.name}`;

//                             return (
//                               <div
//                                 key={
//                                   folder.name
//                                 }
//                                 id={itemId}
//                                 onClick={(
//                                   event,
//                                 ) => {
//                                   event.stopPropagation();
//                                   setSelectedItem(
//                                     itemId,
//                                   );
//                                 }}
//                                 onDoubleClick={() =>
//                                   handleOpenFolder(
//                                     folder,
//                                   )
//                                 }
//                                 onContextMenu={(
//                                   event,
//                                 ) =>
//                                   openContextMenu(
//                                     event,
//                                     {
//                                       type: 'folder',
//                                       item: folder,
//                                     },
//                                   )
//                                 }
//                                 className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer group ${
//                                   selectedItem ===
//                                   itemId
//                                     ? 'bg-sky-500/10 border-sky-400/40 ring-1 ring-sky-400/20'
//                                     : 'bg-slate-900/60 border-white/8 hover:bg-slate-800/80 hover:border-sky-500/30'
//                                 }`}
//                               >
//                                 <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
//                                   <Folder className="w-5 h-5 text-sky-400 fill-sky-400/20" />
//                                 </div>

//                                 <div className="min-w-0">
//                                   <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
//                                     {folder.name}
//                                   </div>

//                                   <div className="text-[10px] text-slate-500 truncate mt-0.5">
//                                     {folder.count}
//                                   </div>
//                                 </div>

//                                 {selectedItem ===
//                                   itemId && (
//                                   <div className="absolute top-2 right-2">
//                                     <Check className="w-3.5 h-3.5 text-sky-400" />
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           },
//                         )}
//                       </div>
//                     ) : (
//                       <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden divide-y divide-white/5">
//                         {group.items.map(
//                           (folder) => {
//                             const itemId = `folder-${folder.name}`;

//                             return (
//                               <div
//                                 key={
//                                   folder.name
//                                 }
//                                 onClick={() =>
//                                   setSelectedItem(
//                                     itemId,
//                                   )
//                                 }
//                                 onDoubleClick={() =>
//                                   handleOpenFolder(
//                                     folder,
//                                   )
//                                 }
//                                 onContextMenu={(
//                                   event,
//                                 ) =>
//                                   openContextMenu(
//                                     event,
//                                     {
//                                       type: 'folder',
//                                       item: folder,
//                                     },
//                                   )
//                                 }
//                                 className={`flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors cursor-pointer ${
//                                   selectedItem ===
//                                   itemId
//                                     ? 'bg-sky-500/10'
//                                     : ''
//                                 }`}
//                               >
//                                 <Folder className="w-4 h-4 text-sky-400 fill-sky-400/20 shrink-0" />

//                                 <span className="font-medium text-xs text-slate-200 w-28 truncate">
//                                   {folder.name}
//                                 </span>

//                                 <span className="text-slate-500 text-[11px] flex-1 truncate">
//                                   {folder.desc}
//                                 </span>

//                                 <span className="text-slate-500 text-[10px] font-mono">
//                                   {folder.count}
//                                 </span>

//                                 <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
//                               </div>
//                             );
//                           },
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ),
//               )
//             )}
//           </section>

//           {/* =================================================
//               NETWORK LOCATIONS
//           ================================================= */}

//           {networkLocations.length > 0 && (
//             <section>
//               <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
//                 Network Locations ({networkLocations.length})
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {networkLocations.map(
//                   (location) => (
//                     <div
//                       key={location.id}
//                       onDoubleClick={() =>
//                         window.open(
//                           location.address,
//                           '_blank',
//                           'noopener,noreferrer',
//                         )
//                       }
//                       onContextMenu={(
//                         event,
//                       ) =>
//                         openContextMenu(
//                           event,
//                         )
//                       }
//                       className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/8 hover:border-violet-500/40 transition-all cursor-pointer group"
//                     >
//                       <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center">
//                         <Network className="w-5 h-5 text-violet-400" />
//                       </div>

//                       <div className="min-w-0 flex-1">
//                         <div className="text-xs font-semibold text-slate-200 truncate">
//                           {location.name}
//                         </div>

//                         <div className="text-[10px] text-slate-500 truncate mt-0.5">
//                           {location.address}
//                         </div>
//                       </div>

//                       <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-violet-400" />
//                     </div>
//                   ),
//                 )}
//               </div>
//             </section>
//           )}

//           {/* =================================================
//               DRIVES
//           ================================================= */}

//           <section>
//             <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
//               Devices and Drives ({DRIVES.length})
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//               {DRIVES.map((drive) => {
//                 const percentUsed =
//                   Math.round(
//                     (drive.usedGB /
//                       drive.totalGB) *
//                       100,
//                   );

//                 const freeGB =
//                   drive.totalGB -
//                   drive.usedGB;

//                 const itemId = `drive-${drive.letter}`;

//                 return (
//                   <div
//                     key={drive.letter}
//                     onClick={(event) => {
//                       event.stopPropagation();

//                       setSelectedItem(
//                         itemId,
//                       );
//                     }}
//                     onDoubleClick={() =>
//                       handleOpenDrive(
//                         drive,
//                       )
//                     }
//                     onContextMenu={(event) =>
//                       openContextMenu(
//                         event,
//                         {
//                           type: 'drive',
//                           item: drive,
//                         },
//                       )
//                     }
//                     className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer group ${
//                       selectedItem === itemId
//                         ? 'bg-sky-500/10 border-sky-400/40 ring-1 ring-sky-400/20'
//                         : 'bg-slate-900/60 border-white/8 hover:bg-slate-800/80 hover:border-sky-500/30'
//                     }`}
//                   >
//                     <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
//                       <HardDrive className="w-5 h-5 text-slate-300 group-hover:text-sky-400 transition-colors" />
//                     </div>

//                     <div className="flex-1 min-w-0 space-y-1.5">
//                       <div className="flex items-center justify-between gap-2">
//                         <h4 className="text-xs font-semibold text-slate-200 truncate">
//                           {drive.name}
//                         </h4>

//                         <span className="text-[10px] text-slate-400 font-mono shrink-0">
//                           {percentUsed}%
//                         </span>
//                       </div>

//                       <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-sky-500 rounded-full transition-all duration-700"
//                           style={{
//                             width: `${percentUsed}%`,
//                           }}
//                         />
//                       </div>

//                       <p className="text-[10px] text-slate-500 truncate">
//                         {freeGB} GB free of{' '}
//                         {drive.totalGB} GB
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>

//           {/* =================================================
//               SYSTEM SUMMARY
//           ================================================= */}

//           <div className="p-3.5 rounded-xl bg-slate-900/30 border border-white/5 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
//             <div className="flex items-center gap-2">
//               <span className="relative flex w-2 h-2">
//                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

//                 <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
//               </span>

//               <span>
//                 Computer:{' '}
//                 <strong className="text-slate-200">
//                   ABHISHEK-WORKSTATION
//                 </strong>
//               </span>
//             </div>

//             <div className="font-mono text-[10px] text-slate-500">
//               C:\Users\Abhishek\Portfolio • Storage Ready
//             </div>
//           </div>

//           {/* =================================================
//               CONTEXT MENU
//           ================================================= */}

//           {contextMenu && (
//             <ContextMenu
//               menu={contextMenu}
//               onClose={closeContextMenu}
//               onView={setViewMode}
//               onSort={setSortMode}
//               onGroup={setGroupMode}
//               onAddNetwork={() =>
//                 setNetworkModalOpen(true)
//               }
//               onUndoDelete={
//                 handleUndoDelete
//               }
//               onProperties={() => {
//                 openProperties();
//               }}
//               onOpenCode={
//                 handleOpenWithCode
//               }
//               onShowMore={() =>
//                 setMoreOptionsOpen(true)
//               }
//             />
//           )}

//           {/* =================================================
//               NETWORK MODAL
//           ================================================= */}

//           {networkModalOpen && (
//             <NetworkLocationModal
//               onClose={() =>
//                 setNetworkModalOpen(false)
//               }
//               onSave={
//                 addNetworkLocation
//               }
//             />
//           )}

//           {/* =================================================
//               PROPERTIES MODAL
//           ================================================= */}

//           {propertiesTarget && (
//             <PropertiesModal
//               target={propertiesTarget}
//               onClose={() =>
//                 setPropertiesTarget(null)
//               }
//             />
//           )}

//           {/* =================================================
//               MORE OPTIONS
//           ================================================= */}

//           {moreOptionsOpen && (
//             <MoreOptionsModal
//               onClose={() =>
//                 setMoreOptionsOpen(false)
//               }
//               onRefresh={handleRefresh}
//               onProperties={() => {
//                 setMoreOptionsOpen(false);

//                 setPropertiesTarget({
//                   title: 'This PC',
//                   type: 'System location',
//                   location: 'This PC',
//                   details: [
//                     `${FOLDERS.length} portfolio folders`,
//                     `${DRIVES.length} conceptual drives`,
//                     `${networkLocations.length} network locations`,
//                     'Abhishek OS portfolio environment',
//                   ],
//                   icon: 'system',
//                 });
//               }}
//             />
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';
import { AppIcon } from '../ui/AppIcon';

import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  Briefcase,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Folder,
  FolderKanban,
  Globe2,
  GraduationCap,
  Grid2X2,
  HardDrive,
  Info,
  LayoutGrid,
  List,
  ListFilter,
  Mail,
  Monitor,
  MoreHorizontal,
  Network,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings2,
  SortAsc,
  Tag,
  UserCheck,
  Wrench,
  X,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface DriveItem {
  letter: string;
  name: string;
  label: string;
  usedGB: number;
  totalGB: number;
  appId: AppId;
}

interface FolderItem {
  name: string;
  appId: AppId;
  icon: string;
  desc: string;
  count: string;
  type: string;
}

interface NetworkLocation {
  id: string;
  name: string;
  address: string;
  createdAt: string;
}

type ViewMode = 'grid' | 'list';

type SortMode =
  | 'name-asc'
  | 'name-desc'
  | 'type'
  | 'size'
  | 'date';

type GroupMode =
  | 'none'
  | 'type'
  | 'name';

type ContextTarget =
  | {
      type: 'background';
    }
  | {
      type: 'folder';
      item: FolderItem;
    }
  | {
      type: 'drive';
      item: DriveItem;
    };

interface ContextMenuState {
  x: number;
  y: number;
  target: ContextTarget;
}

interface PropertiesTarget {
  title: string;
  type: string;
  location: string;
  details: string[];
  icon: 'folder' | 'drive' | 'network' | 'system';
}

/* =========================================================
   DATA
========================================================= */

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

const FOLDERS: FolderItem[] = [
  {
    name: 'About',
    appId: 'about',
    icon: 'UserCheck',
    desc: 'System properties & bio',
    count: '1 profile',
    type: 'Profile',
  },
  {
    name: 'Projects',
    appId: 'projects',
    icon: 'FolderKanban',
    desc: 'KrishiMitra, Amba, CraveVerse',
    count: '14+ projects',
    type: 'Portfolio',
  },
  {
    name: 'Experience',
    appId: 'experience',
    icon: 'Briefcase',
    desc: 'Videoit.io, Fitness Fuel, Edsquare',
    count: '3 roles',
    type: 'Career',
  },
  {
    name: 'Skills',
    appId: 'skills',
    icon: 'Cpu',
    desc: 'Languages, Frontend, AI/APIs',
    count: '31 skills',
    type: 'Technical',
  },
  {
    name: 'Education',
    appId: 'education',
    icon: 'GraduationCap',
    desc: 'B.Tech Information Technology',
    count: 'PRMIT&R',
    type: 'Education',
  },
  {
    name: 'Certifications',
    appId: 'certifications',
    icon: 'Award',
    desc: 'Professional credentials',
    count: 'Verified',
    type: 'Credentials',
  },
  {
    name: 'Contact',
    appId: 'contact',
    icon: 'Mail',
    desc: 'Email, phone, inquiry form',
    count: 'Direct channels',
    type: 'Communication',
  },
];

const NETWORK_STORAGE_KEY =
  'abhishek-os-network-locations-v2';

/* =========================================================
   STORAGE
========================================================= */

const readNetworkLocations = (): NetworkLocation[] => {
  try {
    const value = localStorage.getItem(
      NETWORK_STORAGE_KEY,
    );

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
};

const writeNetworkLocations = (
  locations: NetworkLocation[],
) => {
  try {
    localStorage.setItem(
      NETWORK_STORAGE_KEY,
      JSON.stringify(locations),
    );
  } catch {
    // Local storage can fail in restricted environments.
  }
};

/* =========================================================
   CONTEXT MENU
========================================================= */

interface ContextMenuProps {
  menu: ContextMenuState;
  viewMode: ViewMode;
  sortMode: SortMode;
  groupMode: GroupMode;
  onClose: () => void;
  onViewChange: (mode: ViewMode) => void;
  onSortChange: (mode: SortMode) => void;
  onGroupChange: (mode: GroupMode) => void;
  onNetworkLocation: () => void;
  onUndoDelete: () => void;
  onProperties: () => void;
  onOpenCode: () => void;
  onMoreOptions: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  menu,
  viewMode,
  sortMode,
  groupMode,
  onClose,
  onViewChange,
  onSortChange,
  onGroupChange,
  onNetworkLocation,
  onUndoDelete,
  onProperties,
  onOpenCode,
  onMoreOptions,
}) => {
  const menuRef =
    useRef<HTMLDivElement | null>(null);

  const [
    openSubmenu,
    setOpenSubmenu,
  ] = useState<
    'view' | 'sort' | 'group' | null
  >(null);

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        onClose();
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    document.addEventListener(
      'keydown',
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );

      document.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, [onClose]);

  const menuItem =
    'relative w-full h-9 flex items-center gap-3 px-3 rounded-md text-left text-[12px] text-slate-200 transition-all duration-150';

  const hoverItem =
    'hover:bg-white/[0.07] hover:text-white';

  const iconClass =
    'w-[15px] h-[15px] shrink-0';

  const submenuClass =
    'absolute left-[calc(100%+5px)] top-0 min-w-[205px] p-1 rounded-lg border border-white/10 bg-slate-900/[0.98] shadow-2xl shadow-black/50 backdrop-blur-xl animate-[contextSubmenu_.12s_ease-out]';

  const CheckMark = ({
    active,
  }: {
    active: boolean;
  }) =>
    active ? (
      <Check className="w-3.5 h-3.5 text-sky-400" />
    ) : (
      <span className="w-3.5" />
    );

  return (
    <>
      <style>
        {`
          @keyframes contextMenuIn {
            from {
              opacity: 0;
              transform: scale(.96) translateY(-4px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes contextSubmenu {
            from {
              opacity: 0;
              transform: translateX(-4px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>

      <div
        ref={menuRef}
        className="
          absolute
          z-[9999]
          w-[258px]
          p-1
          rounded-xl
          border border-white/[0.12]
          bg-slate-900/[0.97]
          backdrop-blur-xl
          shadow-[0_18px_55px_rgba(0,0,0,0.45)]
          animate-[contextMenuIn_.12s_ease-out]
        "
        style={{
          left: menu.x,
          top: menu.y,
        }}
        onContextMenu={(event) =>
          event.preventDefault()
        }
      >
        {/* ==============================
            VIEW
        ============================== */}

        <div className="relative">
          <button
            type="button"
            className={`${menuItem} ${hoverItem}`}
            onMouseEnter={() =>
              setOpenSubmenu('view')
            }
            onClick={() =>
              setOpenSubmenu(
                openSubmenu === 'view'
                  ? null
                  : 'view',
              )
            }
          >
            <Grid2X2
              className={`${iconClass} text-slate-400`}
            />

            <span className="flex-1">
              View
            </span>

            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {openSubmenu === 'view' && (
            <div className={submenuClass}>
              <div className="px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-slate-500">
                View
              </div>

              <button
                type="button"
                className={`${menuItem} ${hoverItem}`}
                onClick={() => {
                  onViewChange('grid');
                  onClose();
                }}
              >
                <LayoutGrid
                  className={`${iconClass} text-slate-400`}
                />

                <span className="flex-1">
                  Large icons
                </span>

                <CheckMark
                  active={
                    viewMode === 'grid'
                  }
                />
              </button>

              <button
                type="button"
                className={`${menuItem} ${hoverItem}`}
                onClick={() => {
                  onViewChange('list');
                  onClose();
                }}
              >
                <List
                  className={`${iconClass} text-slate-400`}
                />

                <span className="flex-1">
                  Details
                </span>

                <CheckMark
                  active={
                    viewMode === 'list'
                  }
                />
              </button>
            </div>
          )}
        </div>

        {/* ==============================
            SORT
        ============================== */}

        <div className="relative">
          <button
            type="button"
            className={`${menuItem} ${hoverItem}`}
            onMouseEnter={() =>
              setOpenSubmenu('sort')
            }
            onClick={() =>
              setOpenSubmenu(
                openSubmenu === 'sort'
                  ? null
                  : 'sort',
              )
            }
          >
            <SortAsc
              className={`${iconClass} text-slate-400`}
            />

            <span className="flex-1">
              Sort by
            </span>

            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {openSubmenu === 'sort' && (
            <div className={submenuClass}>
              <div className="px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-slate-500">
                Sort by
              </div>

              <button
                type="button"
                className={`${menuItem} ${hoverItem}`}
                onClick={() => {
                  onSortChange(
                    'name-asc',
                  );
                  onClose();
                }}
              >
                <span className="w-[15px] text-center text-[11px] text-slate-500">
                  A
                </span>

                <span className="flex-1">
                  Name
                </span>

                <span className="text-[10px] text-slate-600">
                  A–Z
                </span>

                <CheckMark
                  active={
                    sortMode ===
                    'name-asc'
                  }
                />
              </button>

              <button
                type="button"
                className={`${menuItem} ${hoverItem}`}
                onClick={() => {
                  onSortChange(
                    'name-desc',
                  );
                  onClose();
                }}
              >
                <span className="w-[15px] text-center text-[11px] text-slate-500">
                  Z
                </span>

                <span className="flex-1">
                  Name
                </span>

                <span className="text-[10px] text-slate-600">
                  Z–A
                </span>

                <CheckMark
                  active={
                    sortMode ===
                    'name-desc'
                  }
                />
              </button>

              <button
                type="button"
                className={`${menuItem} ${hoverItem}`}
                onClick={() => {
                  onSortChange('type');
                  onClose();
                }}
              >
                <Tag
                  className={`${iconClass} text-slate-400`}
                />

                <span className="flex-1">
                  Type
                </span>

                <CheckMark
                  active={
                    sortMode === 'type'
                  }
                />
              </button>

              <button
                type="button"
                className={`${menuItem} ${hoverItem}`}
                onClick={() => {
                  onSortChange('size');
                  onClose();
                }}
              >
                <Database
                  className={`${iconClass} text-slate-400`}
                />

                <span className="flex-1">
                  Size
                </span>

                <CheckMark
                  active={
                    sortMode === 'size'
                  }
                />
              </button>

              <button
                type="button"
                className={`${menuItem} ${hoverItem}`}
                onClick={() => {
                  onSortChange('date');
                  onClose();
                }}
              >
                <Clock3
                  className={`${iconClass} text-slate-400`}
                />

                <span className="flex-1">
                  Date modified
                </span>

                <CheckMark
                  active={
                    sortMode === 'date'
                  }
                />
              </button>
            </div>
          )}
        </div>

        {/* ==============================
            GROUP
        ============================== */}

        <div className="relative">
          <button
            type="button"
            className={`${menuItem} ${hoverItem}`}
            onMouseEnter={() =>
              setOpenSubmenu('group')
            }
            onClick={() =>
              setOpenSubmenu(
                openSubmenu === 'group'
                  ? null
                  : 'group',
              )
            }
          >
            <ListFilter
              className={`${iconClass} text-slate-400`}
            />

            <span className="flex-1">
              Group by
            </span>

            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {openSubmenu === 'group' && (
            <div className={submenuClass}>
              <div className="px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-slate-500">
                Group by
              </div>

              <button
                type="button"
                className={`${menuItem} ${hoverItem}`}
                onClick={() => {
                  onGroupChange('none');
                  onClose();
                }}
              >
                <span className="w-[15px]" />

                <span className="flex-1">
                  None
                </span>

                <CheckMark
                  active={
                    groupMode === 'none'
                  }
                />
              </button>

              <button
                type="button"
                className={`${menuItem} ${hoverItem}`}
                onClick={() => {
                  onGroupChange('type');
                  onClose();
                }}
              >
                <Tag
                  className={`${iconClass} text-slate-400`}
                />

                <span className="flex-1">
                  Type
                </span>

                <CheckMark
                  active={
                    groupMode === 'type'
                  }
                />
              </button>

              <button
                type="button"
                className={`${menuItem} ${hoverItem}`}
                onClick={() => {
                  onGroupChange('name');
                  onClose();
                }}
              >
                <List
                  className={`${iconClass} text-slate-400`}
                />

                <span className="flex-1">
                  Name
                </span>

                <CheckMark
                  active={
                    groupMode === 'name'
                  }
                />
              </button>
            </div>
          )}
        </div>

        {/* SEPARATOR */}

        <div className="h-px bg-white/[0.08] my-1" />

        {/* NETWORK LOCATION */}

        <button
          type="button"
          className={`${menuItem} ${hoverItem}`}
          onClick={() => {
            onNetworkLocation();
            onClose();
          }}
        >
          <Network
            className={`${iconClass} text-slate-400`}
          />

          <span className="flex-1">
            Add a network location
          </span>
        </button>

        {/* UNDO */}

        <button
          type="button"
          className={`${menuItem} ${hoverItem}`}
          onClick={() => {
            onUndoDelete();
            onClose();
          }}
        >
          <RotateCcw
            className={`${iconClass} text-slate-400`}
          />

          <span className="flex-1">
            Undo Delete
          </span>

          <span className="text-[10px] text-slate-600">
            Ctrl+Z
          </span>
        </button>

        {/* PROPERTIES */}

        <button
          type="button"
          className={`${menuItem} ${hoverItem}`}
          onClick={() => {
            onProperties();
            onClose();
          }}
        >
          <Wrench
            className={`${iconClass} text-slate-400`}
          />

          <span className="flex-1">
            Properties
          </span>

          <span className="text-[10px] text-slate-600">
            Alt+Enter
          </span>
        </button>

        {/* SEPARATOR */}

        <div className="h-px bg-white/[0.08] my-1" />

        {/* CODE */}

        <button
          type="button"
          className={`${menuItem} ${hoverItem}`}
          onClick={() => {
            onOpenCode();
            onClose();
          }}
        >
          <Code2
            className={`${iconClass} text-sky-400`}
          />

          <span className="flex-1">
            Open with Code
          </span>
        </button>

        {/* MORE OPTIONS */}

        <button
          type="button"
          className={`${menuItem} ${hoverItem}`}
          onClick={() => {
            onMoreOptions();
            onClose();
          }}
        >
          <MoreHorizontal
            className={`${iconClass} text-slate-400`}
          />

          <span className="flex-1">
            Show more options
          </span>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        </button>
      </div>
    </>
  );
};

/* =========================================================
   NETWORK LOCATION DIALOG
========================================================= */

interface NetworkLocationDialogProps {
  onClose: () => void;
  onSave: (
    name: string,
    address: string,
  ) => void;
}

const NetworkLocationDialog: React.FC<
  NetworkLocationDialogProps
> = ({
  onClose,
  onSave,
}) => {
  const [name, setName] =
    useState('');

  const [address, setAddress] =
    useState('');

  const [error, setError] =
    useState('');

  const handleSave = () => {
    const cleanName =
      name.trim();

    const cleanAddress =
      address.trim();

    if (!cleanName) {
      setError(
        'Enter a name for this location.',
      );
      return;
    }

    if (!cleanAddress) {
      setError(
        'Enter a network address.',
      );
      return;
    }

    onSave(
      cleanName,
      cleanAddress,
    );
  };

  return (
    <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-black/35 backdrop-blur-[2px] p-4 animate-[contextMenuIn_.14s_ease-out]">
      <div className="w-full max-w-[430px] overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50">
        {/* Header */}

        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center">
              <Network className="w-4 h-4 text-sky-400" />
            </div>

            <div>
              <h2 className="text-sm font-medium text-white">
                Add a network location
              </h2>

              <p className="text-[10px] text-slate-500 mt-0.5">
                Add a custom location to This PC
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">
              Location name
            </label>

            <input
              autoFocus
              value={name}
              onChange={(event) => {
                setName(
                  event.target.value,
                );
                setError('');
              }}
              placeholder="Company Server"
              className="
                w-full
                h-9
                px-3
                rounded-md
                border border-white/10
                bg-slate-950
                text-xs
                text-slate-200
                placeholder:text-slate-600
                outline-none
                focus:border-sky-400/50
                focus:ring-1
                focus:ring-sky-400/20
              "
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">
              Network address
            </label>

            <input
              value={address}
              onChange={(event) => {
                setAddress(
                  event.target.value,
                );
                setError('');
              }}
              placeholder="https://example.com"
              className="
                w-full
                h-9
                px-3
                rounded-md
                border border-white/10
                bg-slate-950
                text-xs
                text-slate-200
                placeholder:text-slate-600
                outline-none
                focus:border-sky-400/50
                focus:ring-1
                focus:ring-sky-400/20
              "
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-red-400/20 bg-red-400/5 text-[11px] text-red-300">
              <Info className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-md bg-white/[0.03] border border-white/5">
            <Info className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />

            <p className="text-[10px] leading-relaxed text-slate-500">
              Network locations are stored locally
              in this browser as part of the
              Abhishek OS simulation.
            </p>
          </div>
        </div>

        {/* Footer */}

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-white/10 bg-slate-950/30">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-md text-[11px] text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-8 px-4 rounded-md bg-sky-500 hover:bg-sky-400 text-white text-[11px] font-medium transition shadow-sm shadow-sky-500/20"
          >
            Add location
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   PROPERTIES DIALOG
========================================================= */

interface PropertiesDialogProps {
  target: PropertiesTarget;
  onClose: () => void;
}

const PropertiesDialog: React.FC<
  PropertiesDialogProps
> = ({
  target,
  onClose,
}) => {
  const Icon =
    target.icon === 'drive'
      ? HardDrive
      : target.icon === 'network'
        ? Network
        : target.icon === 'system'
          ? Monitor
          : Folder;

  return (
    <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-black/35 backdrop-blur-[2px] p-4 animate-[contextMenuIn_.14s_ease-out]">
      <div className="w-full max-w-[470px] overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50">
        {/* Header */}

        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-sky-400" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-medium text-white truncate">
                {target.title}
              </h2>

              <p className="text-[10px] text-slate-500">
                Properties
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details */}

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg border border-white/5 bg-slate-950/60">
              <div className="text-[9px] uppercase tracking-wider text-slate-600">
                Type
              </div>

              <div className="text-[11px] text-slate-300 mt-1">
                {target.type}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-white/5 bg-slate-950/60">
              <div className="text-[9px] uppercase tracking-wider text-slate-600">
                Location
              </div>

              <div className="text-[11px] text-slate-300 mt-1 truncate">
                {target.location}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-600 mb-2">
              Details
            </div>

            <div className="rounded-lg border border-white/5 overflow-hidden bg-slate-950/50">
              {target.details.map(
                (detail, index) => (
                  <div
                    key={`${detail}-${index}`}
                    className="flex items-center gap-2 px-3 py-2.5 border-b border-white/5 last:border-b-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />

                    <span className="text-[11px] text-slate-400">
                      {detail}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end px-4 py-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-5 rounded-md bg-sky-500 hover:bg-sky-400 text-white text-[11px] font-medium transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SHOW MORE OPTIONS
========================================================= */

interface MoreOptionsDialogProps {
  onClose: () => void;
  onRefresh: () => void;
  onProperties: () => void;
}

const MoreOptionsDialog: React.FC<
  MoreOptionsDialogProps
> = ({
  onClose,
  onRefresh,
  onProperties,
}) => {
  return (
    <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-black/35 backdrop-blur-[2px] p-4 animate-[contextMenuIn_.14s_ease-out]">
      <div className="w-full max-w-[390px] rounded-xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div>
            <h2 className="text-sm font-medium text-white">
              More options
            </h2>

            <p className="text-[10px] text-slate-500 mt-0.5">
              Additional Explorer actions
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2">
          <button
            type="button"
            onClick={() => {
              onRefresh();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.06] transition text-left"
          >
            <RefreshCw className="w-4 h-4 text-sky-400" />

            <div>
              <div className="text-xs text-slate-200">
                Refresh
              </div>

              <div className="text-[10px] text-slate-600 mt-0.5">
                Refresh this Explorer view
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onProperties();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.06] transition text-left"
          >
            <Settings2 className="w-4 h-4 text-sky-400" />

            <div>
              <div className="text-xs text-slate-200">
                Properties
              </div>

              <div className="text-[10px] text-slate-600 mt-0.5">
                View This PC information
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent(
                  'abhishek:open-desktop-settings',
                ),
              );

              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.06] transition text-left"
          >
            <Monitor className="w-4 h-4 text-sky-400" />

            <div>
              <div className="text-xs text-slate-200">
                Display settings
              </div>

              <div className="text-[10px] text-slate-600 mt-0.5">
                Personalize your desktop
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent(
                  'abhishek:open-terminal',
                ),
              );

              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.06] transition text-left"
          >
            <Code2 className="w-4 h-4 text-sky-400" />

            <div>
              <div className="text-xs text-slate-200">
                Terminal
              </div>

              <div className="text-[10px] text-slate-600 mt-0.5">
                Open Abhishek Terminal
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN THIS PC APP
========================================================= */

export const ThisPCApp: React.FC = () => {
  const { openApp } = useOS();

  const mainRef =
    useRef<HTMLDivElement | null>(null);

  const [currentPath, setCurrentPath] =
    useState('This PC');

  const [viewMode, setViewMode] =
    useState<ViewMode>('grid');

  const [sortMode, setSortMode] =
    useState<SortMode>('name-asc');

  const [groupMode, setGroupMode] =
    useState<GroupMode>('none');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [selectedItem, setSelectedItem] =
    useState<string | null>(null);

  const [contextMenu, setContextMenu] =
    useState<ContextMenuState | null>(
      null,
    );

  const [
    networkDialogOpen,
    setNetworkDialogOpen,
  ] = useState(false);

  const [
    propertiesTarget,
    setPropertiesTarget,
  ] = useState<PropertiesTarget | null>(
    null,
  );

  const [
    moreOptionsOpen,
    setMoreOptionsOpen,
  ] = useState(false);

  const [
    networkLocations,
    setNetworkLocations,
  ] = useState<NetworkLocation[]>(
    () => readNetworkLocations(),
  );

  const [refreshVersion, setRefreshVersion] =
    useState(0);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredFolders = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    if (!query) {
      return FOLDERS;
    }

    return FOLDERS.filter(
      (folder) =>
        folder.name
          .toLowerCase()
          .includes(query) ||
        folder.desc
          .toLowerCase()
          .includes(query) ||
        folder.count
          .toLowerCase()
          .includes(query) ||
        folder.type
          .toLowerCase()
          .includes(query),
    );
  }, [searchQuery]);

  /* =======================================================
     SORT
  ======================================================= */

  const sortedFolders = useMemo(() => {
    const items = [
      ...filteredFolders,
    ];

    switch (sortMode) {
      case 'name-desc':
        return items.sort((a, b) =>
          b.name.localeCompare(a.name),
        );

      case 'type':
        return items.sort((a, b) =>
          a.type.localeCompare(b.type),
        );

      case 'size':
        return items.sort(
          (a, b) =>
            b.count.length -
            a.count.length,
        );

      case 'date':
        return items.reverse();

      case 'name-asc':
      default:
        return items.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
    }
  }, [filteredFolders, sortMode]);

  /* =======================================================
     GROUP
  ======================================================= */

  const groupedFolders = useMemo(() => {
    if (groupMode === 'none') {
      return [
        {
          title: '',
          items: sortedFolders,
        },
      ];
    }

    const map =
      new Map<string, FolderItem[]>();

    sortedFolders.forEach(
      (folder) => {
        const key =
          groupMode === 'type'
            ? folder.type
            : folder.name
                .charAt(0)
                .toUpperCase();

        if (!map.has(key)) {
          map.set(key, []);
        }

        map.get(key)!.push(folder);
      },
    );

    return Array.from(map.entries())
      .sort(([a], [b]) =>
        a.localeCompare(b),
      )
      .map(
        ([title, items]) => ({
          title,
          items,
        }),
      );
  }, [groupMode, sortedFolders]);

  /* =======================================================
     CLOSE CONTEXT MENU
  ======================================================= */

  const closeContextMenu =
    useCallback(() => {
      setContextMenu(null);
    }, []);

  /* =======================================================
     OPEN CONTEXT MENU
  ======================================================= */

  const openContextMenu =
    useCallback(
      (
        event: React.MouseEvent,
        target: ContextTarget = {
          type: 'background',
        },
      ) => {
        event.preventDefault();
        event.stopPropagation();

        const container =
          mainRef.current;

        if (!container) {
          return;
        }

        const rect =
          container.getBoundingClientRect();

        /*
         * Compact menu dimensions.
         * These are deliberately smaller than the
         * previous version so the menu feels like
         * a native Explorer context menu.
         */

        const menuWidth = 258;
        const menuHeight = 365;
        const padding = 8;

        let x =
          event.clientX -
          rect.left;

        let y =
          event.clientY -
          rect.top;

        const maxX =
          container.clientWidth -
          menuWidth -
          padding;

        const maxY =
          container.clientHeight -
          menuHeight -
          padding;

        x = Math.max(
          padding,
          Math.min(
            x,
            Math.max(
              padding,
              maxX,
            ),
          ),
        );

        y = Math.max(
          padding,
          Math.min(
            y,
            Math.max(
              padding,
              maxY,
            ),
          ),
        );

        setContextMenu({
          x,
          y,
          target,
        });

        if (target.type === 'folder') {
          setSelectedItem(
            `folder-${target.item.name}`,
          );
        } else if (
          target.type === 'drive'
        ) {
          setSelectedItem(
            `drive-${target.item.letter}`,
          );
        } else {
          setSelectedItem(null);
        }
      },
      [],
    );

  /* =======================================================
     NETWORK LOCATION
  ======================================================= */

  const addNetworkLocation =
    useCallback(
      (
        name: string,
        address: string,
      ) => {
        const location: NetworkLocation =
          {
            id: `network-${Date.now()}`,
            name,
            address,
            createdAt:
              new Date().toISOString(),
          };

        const updated = [
          ...networkLocations,
          location,
        ];

        setNetworkLocations(
          updated,
        );

        writeNetworkLocations(
          updated,
        );

        setNetworkDialogOpen(
          false,
        );
      },
      [networkLocations],
    );

  /* =======================================================
     PROPERTIES
  ======================================================= */

  const openProperties =
    useCallback(() => {
      const target =
        contextMenu?.target;

      if (!target) {
        return;
      }

      if (target.type === 'folder') {
        const folder =
          target.item;

        setPropertiesTarget({
          title: folder.name,
          type: `${folder.type} folder`,
          location: `This PC\\${folder.name}`,
          details: [
            folder.desc,
            folder.count,
            'Abhishek OS portfolio application',
            'Double-click to open',
          ],
          icon: 'folder',
        });

        return;
      }

      if (target.type === 'drive') {
        const drive =
          target.item;

        const free =
          drive.totalGB -
          drive.usedGB;

        setPropertiesTarget({
          title: drive.name,
          type: 'Conceptual drive',
          location: drive.letter,
          details: [
            drive.label,
            `${drive.usedGB} GB used`,
            `${free} GB free`,
            `${drive.totalGB} GB total capacity`,
          ],
          icon: 'drive',
        });

        return;
      }

      setPropertiesTarget({
        title: 'This PC',
        type: 'System location',
        location: 'This PC',
        details: [
          `${FOLDERS.length} portfolio folders`,
          `${DRIVES.length} conceptual drives`,
          `${networkLocations.length} network locations`,
          'Abhishek OS portfolio environment',
        ],
        icon: 'system',
      });
    }, [
      contextMenu,
      networkLocations.length,
    ]);

  /* =======================================================
     DEFAULT PROPERTIES
  ======================================================= */

  const openThisPCProperties =
    useCallback(() => {
      setPropertiesTarget({
        title: 'This PC',
        type: 'System location',
        location: 'This PC',
        details: [
          `${FOLDERS.length} portfolio folders`,
          `${DRIVES.length} conceptual drives`,
          `${networkLocations.length} network locations`,
          'Abhishek OS portfolio environment',
        ],
        icon: 'system',
      });
    }, [
      networkLocations.length,
    ]);

  /* =======================================================
     UNDO DELETE
  ======================================================= */

  const handleUndoDelete =
    useCallback(() => {
      window.dispatchEvent(
        new CustomEvent(
          'abhishek:undo-delete',
        ),
      );
    }, []);

  /* =======================================================
     CODE
  ======================================================= */

  const handleOpenCode =
    useCallback(() => {
      try {
        openApp('code' as AppId);
      } catch {
        window.dispatchEvent(
          new CustomEvent(
            'abhishek:open-code',
          ),
        );
      }
    }, [openApp]);

  /* =======================================================
     REFRESH
  ======================================================= */

  const refresh =
    useCallback(() => {
      setRefreshVersion(
        (value) => value + 1,
      );
    }, []);

  /* =======================================================
     OPEN FOLDER
  ======================================================= */

  const handleFolderOpen = (
    folder: FolderItem,
  ) => {
    setSelectedItem(
      `folder-${folder.name}`,
    );

    openApp(folder.appId);
  };

  /* =======================================================
     OPEN DRIVE
  ======================================================= */

  const handleDriveOpen = (
    drive: DriveItem,
  ) => {
    setSelectedItem(
      `drive-${drive.letter}`,
    );

    openApp(drive.appId);
  };

  /* =======================================================
     KEYBOARD SHORTCUTS
  ======================================================= */

  useEffect(() => {
    const handleKeyboard =
      (event: KeyboardEvent) => {
        if (
          event.ctrlKey &&
          event.key.toLowerCase() ===
            'z'
        ) {
          event.preventDefault();

          handleUndoDelete();

          return;
        }

        if (
          event.altKey &&
          event.key === 'Enter'
        ) {
          event.preventDefault();

          setContextMenu(null);

          openThisPCProperties();

          return;
        }

        if (
          event.key === 'Escape'
        ) {
          setContextMenu(null);
          setPropertiesTarget(null);
          setNetworkDialogOpen(
            false,
          );
          setMoreOptionsOpen(false);
        }
      };

    window.addEventListener(
      'keydown',
      handleKeyboard,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyboard,
      );
    };
  }, [
    handleUndoDelete,
    openThisPCProperties,
  ]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      key={refreshVersion}
      className="
        relative
        flex
        flex-col
        h-full
        overflow-hidden
        bg-slate-950
        text-slate-100
        select-none
      "
      onContextMenu={(event) =>
        openContextMenu(event)
      }
    >
      {/* ===================================================
          TOP EXPLORER TOOLBAR
      =================================================== */}

      <div className="h-11 shrink-0 px-3 flex items-center gap-2 border-b border-white/10 bg-slate-900/90">
        {/* Navigation */}

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() =>
              setCurrentPath(
                'This PC',
              )
            }
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
            title="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 cursor-not-allowed"
            title="Forward"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrentPath(
                'This PC',
              )
            }
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
            title="Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={refresh}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Path */}

        <div className="flex-1 min-w-0">
          <div className="h-7 flex items-center px-2.5 rounded-md border border-white/10 bg-slate-800/70">
            <Monitor className="w-3.5 h-3.5 text-sky-400 mr-2 shrink-0" />

            <span className="text-[11px] font-mono text-slate-300 truncate">
              {currentPath}
            </span>
          </div>
        </div>

        {/* Search */}

        <div className="relative w-40 sm:w-52 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />

          <input
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value,
              )
            }
            placeholder="Search This PC"
            className="
              w-full
              h-7
              pl-8
              pr-2
              rounded-md
              border
              border-white/10
              bg-slate-800/70
              text-[11px]
              text-slate-200
              placeholder:text-slate-600
              outline-none
              focus:border-sky-400/40
            "
          />
        </div>

        {/* View */}

        <div className="hidden sm:flex items-center p-0.5 rounded-md border border-white/10 bg-slate-800/70">
          <button
            type="button"
            onClick={() =>
              setViewMode('grid')
            }
            className={`w-6 h-6 rounded flex items-center justify-center transition ${
              viewMode === 'grid'
                ? 'bg-sky-500/20 text-sky-300'
                : 'text-slate-500 hover:text-white'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setViewMode('list')
            }
            className={`w-6 h-6 rounded flex items-center justify-center transition ${
              viewMode === 'list'
                ? 'bg-sky-500/20 text-sky-300'
                : 'text-slate-500 hover:text-white'
            }`}
            title="Details view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ===================================================
          BODY
      =================================================== */}

      <div className="flex-1 flex overflow-hidden">
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="hidden md:flex w-48 shrink-0 flex-col gap-5 p-2 border-r border-white/10 bg-slate-900/40 overflow-y-auto">
          {/* Quick Access */}

          <div>
            <div className="px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Quick Access
            </div>

            <div className="space-y-0.5">
              {FOLDERS.map(
                (folder) => (
                  <button
                    key={
                      folder.name
                    }
                    type="button"
                    onClick={() =>
                      handleFolderOpen(
                        folder,
                      )
                    }
                    onContextMenu={(
                      event,
                    ) =>
                      openContextMenu(
                        event,
                        {
                          type: 'folder',
                          item: folder,
                        },
                      )
                    }
                    className="w-full h-7.5 flex items-center gap-2 px-2 rounded-md text-left text-[11px] text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] transition"
                  >
                    <AppIcon
                      name={
                        folder.icon
                      }
                      className="w-3.5 h-3.5 text-sky-400"
                    />

                    <span className="truncate">
                      {folder.name}
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>

          {/* This PC */}

          <div>
            <div className="px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              This PC
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPath(
                  'This PC',
                )
              }
              onContextMenu={(event) =>
                openContextMenu(
                  event,
                )
              }
              className="w-full h-7.5 flex items-center gap-2 px-2 rounded-md text-left text-[11px] text-slate-200 bg-white/[0.05] hover:bg-white/[0.08] transition"
            >
              <Monitor className="w-3.5 h-3.5 text-sky-400" />

              <span>This PC</span>
            </button>
          </div>

          {/* Drives */}

          <div>
            <div className="px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Drives
            </div>

            <div className="space-y-0.5">
              {DRIVES.map(
                (drive) => (
                  <button
                    key={
                      drive.letter
                    }
                    type="button"
                    onClick={() =>
                      handleDriveOpen(
                        drive,
                      )
                    }
                    onContextMenu={(
                      event,
                    ) =>
                      openContextMenu(
                        event,
                        {
                          type: 'drive',
                          item: drive,
                        },
                      )
                    }
                    className="w-full h-7.5 flex items-center gap-2 px-2 rounded-md text-left text-[11px] text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] transition"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />

                    <span className="truncate">
                      {drive.name}
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Network */}

          {networkLocations.length >
            0 && (
            <div>
              <div className="px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Network
              </div>

              <div className="space-y-0.5">
                {networkLocations.map(
                  (location) => (
                    <button
                      key={
                        location.id
                      }
                      type="button"
                      onClick={() =>
                        window.open(
                          location.address,
                          '_blank',
                          'noopener,noreferrer',
                        )
                      }
                      className="w-full h-7.5 flex items-center gap-2 px-2 rounded-md text-left text-[11px] text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
                      title={
                        location.address
                      }
                    >
                      <Globe2 className="w-3.5 h-3.5 text-violet-400" />

                      <span className="truncate">
                        {location.name}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </aside>

        {/* =================================================
            MAIN PANE
        ================================================= */}

        <main
          ref={mainRef}
          className="relative flex-1 overflow-y-auto p-4"
          onContextMenu={(event) =>
            openContextMenu(event)
          }
          onClick={() => {
            setSelectedItem(null);
          }}
        >
          {/* Header */}

          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-sky-400" />

                <h1 className="text-sm font-semibold text-white">
                  This PC
                </h1>
              </div>

              <p className="text-[10px] text-slate-600 mt-1">
                Abhishek OS workspace
              </p>
            </div>

            <div className="text-[10px] text-slate-600">
              {filteredFolders.length}{' '}
              folders
              <span className="mx-1.5">
                •
              </span>
              {DRIVES.length} drives
            </div>
          </div>

          {/* =================================================
              FOLDERS
          ================================================= */}

          <section className="mb-7">
            <div className="flex items-center justify-between px-1 mb-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Folders
                <span className="ml-1 text-slate-700">
                  (
                  {
                    filteredFolders.length
                  }
                  )
                </span>
              </div>

              <div className="text-[9px] text-slate-700">
                Right-click for options
              </div>
            </div>

            {filteredFolders.length ===
            0 ? (
              <div className="rounded-lg border border-dashed border-white/10 bg-slate-900/30 py-12 text-center">
                <Search className="w-6 h-6 mx-auto text-slate-700 mb-2" />

                <p className="text-xs text-slate-500">
                  No folders found
                </p>
              </div>
            ) : (
              groupedFolders.map(
                (group) => (
                  <div
                    key={
                      group.title ||
                      'all'
                    }
                    className="mb-4 last:mb-0"
                  >
                    {group.title && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] uppercase tracking-wider text-slate-600">
                          {group.title}
                        </span>

                        <div className="h-px bg-white/5 flex-1" />
                      </div>
                    )}

                    {viewMode ===
                    'grid' ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                        {group.items.map(
                          (
                            folder,
                          ) => {
                            const id = `folder-${folder.name}`;

                            const isSelected =
                              selectedItem ===
                              id;

                            return (
                              <div
                                key={
                                  folder.name
                                }
                                onClick={(
                                  event,
                                ) => {
                                  event.stopPropagation();

                                  setSelectedItem(
                                    id,
                                  );
                                }}
                                onDoubleClick={() =>
                                  handleFolderOpen(
                                    folder,
                                  )
                                }
                                onContextMenu={(
                                  event,
                                ) =>
                                  openContextMenu(
                                    event,
                                    {
                                      type: 'folder',
                                      item: folder,
                                    },
                                  )
                                }
                                className={`
                                  relative
                                  flex
                                  items-center
                                  gap-3
                                  min-h-[66px]
                                  p-3
                                  rounded-lg
                                  border
                                  cursor-pointer
                                  transition-all
                                  duration-150
                                  ${
                                    isSelected
                                      ? 'border-sky-400/40 bg-sky-400/[0.08] ring-1 ring-sky-400/10'
                                      : 'border-white/[0.07] bg-slate-900/60 hover:bg-slate-800/70 hover:border-white/10'
                                  }
                                `}
                              >
                                <div
                                  className="
                                    w-9
                                    h-9
                                    rounded-lg
                                    shrink-0
                                    flex
                                    items-center
                                    justify-center
                                    bg-sky-500/[0.08]
                                    border
                                    border-sky-400/15
                                    transition-transform
                                    duration-150
                                    group-hover:scale-105
                                  "
                                >
                                  <Folder className="w-4.5 h-4.5 text-sky-400 fill-sky-400/10" />
                                </div>

                                <div className="min-w-0">
                                  <div className="text-[11px] font-medium text-slate-200 truncate">
                                    {
                                      folder.name
                                    }
                                  </div>

                                  <div className="text-[9px] text-slate-600 truncate mt-0.5">
                                    {
                                      folder.count
                                    }
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="absolute top-2 right-2">
                                    <Check className="w-3 h-3 text-sky-400" />
                                  </div>
                                )}
                              </div>
                            );
                          },
                        )}
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-lg border border-white/[0.07] bg-slate-900/50 divide-y divide-white/5">
                        {group.items.map(
                          (
                            folder,
                          ) => {
                            const id = `folder-${folder.name}`;

                            return (
                              <div
                                key={
                                  folder.name
                                }
                                onClick={() =>
                                  setSelectedItem(
                                    id,
                                  )
                                }
                                onDoubleClick={() =>
                                  handleFolderOpen(
                                    folder,
                                  )
                                }
                                onContextMenu={(
                                  event,
                                ) =>
                                  openContextMenu(
                                    event,
                                    {
                                      type: 'folder',
                                      item: folder,
                                    },
                                  )
                                }
                                className={`
                                  flex
                                  items-center
                                  gap-3
                                  px-3
                                  py-2.5
                                  cursor-pointer
                                  transition
                                  ${
                                    selectedItem ===
                                    id
                                      ? 'bg-sky-400/[0.07]'
                                      : 'hover:bg-white/[0.035]'
                                  }
                                `}
                              >
                                <Folder className="w-4 h-4 text-sky-400 shrink-0" />

                                <span className="w-28 shrink-0 text-[11px] text-slate-200 truncate">
                                  {
                                    folder.name
                                  }
                                </span>

                                <span className="flex-1 text-[10px] text-slate-600 truncate">
                                  {
                                    folder.desc
                                  }
                                </span>

                                <span className="text-[9px] text-slate-700 font-mono">
                                  {
                                    folder.count
                                  }
                                </span>

                                <ChevronRight className="w-3 h-3 text-slate-700" />
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
                ),
              )
            )}
          </section>

          {/* =================================================
              NETWORK LOCATIONS
          ================================================= */}

          {networkLocations.length >
            0 && (
            <section className="mb-7">
              <div className="flex items-center gap-2 px-1 mb-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Network Locations
                </span>

                <span className="text-[9px] text-slate-700">
                  (
                  {
                    networkLocations.length
                  }
                  )
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {networkLocations.map(
                  (location) => (
                    <div
                      key={
                        location.id
                      }
                      onDoubleClick={() =>
                        window.open(
                          location.address,
                          '_blank',
                          'noopener,noreferrer',
                        )
                      }
                      onContextMenu={(
                        event,
                      ) =>
                        openContextMenu(
                          event,
                        )
                      }
                      className="
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-lg
                        border
                        border-white/[0.07]
                        bg-slate-900/60
                        hover:bg-slate-800/70
                        hover:border-violet-400/20
                        transition
                        cursor-pointer
                      "
                    >
                      <div className="w-9 h-9 rounded-lg bg-violet-500/[0.08] border border-violet-400/15 flex items-center justify-center shrink-0">
                        <Network className="w-4 h-4 text-violet-400" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-medium text-slate-200 truncate">
                          {
                            location.name
                          }
                        </div>

                        <div className="text-[9px] text-slate-600 truncate mt-0.5">
                          {
                            location.address
                          }
                        </div>
                      </div>

                      <ExternalLink className="w-3 h-3 text-slate-700" />
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

          {/* =================================================
              DRIVES
          ================================================= */}

          <section className="mb-6">
            <div className="flex items-center gap-2 px-1 mb-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Devices and Drives
              </span>

              <span className="text-[9px] text-slate-700">
                ({DRIVES.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {DRIVES.map(
                (drive) => {
                  const usedPercent =
                    Math.round(
                      (drive.usedGB /
                        drive.totalGB) *
                        100,
                    );

                  const freeGB =
                    drive.totalGB -
                    drive.usedGB;

                  const id = `drive-${drive.letter}`;

                  const selected =
                    selectedItem ===
                    id;

                  return (
                    <div
                      key={
                        drive.letter
                      }
                      onClick={(
                        event,
                      ) => {
                        event.stopPropagation();

                        setSelectedItem(
                          id,
                        );
                      }}
                      onDoubleClick={() =>
                        handleDriveOpen(
                          drive,
                        )
                      }
                      onContextMenu={(
                        event,
                      ) =>
                        openContextMenu(
                          event,
                          {
                            type: 'drive',
                            item: drive,
                          },
                        )
                      }
                      className={`
                        flex
                        items-start
                        gap-3
                        p-3
                        rounded-lg
                        border
                        cursor-pointer
                        transition-all
                        ${
                          selected
                            ? 'border-sky-400/40 bg-sky-400/[0.07]'
                            : 'border-white/[0.07] bg-slate-900/60 hover:bg-slate-800/70 hover:border-white/10'
                        }
                      `}
                    >
                      <div className="w-9 h-9 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                        <HardDrive className="w-4 h-4 text-slate-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-medium text-slate-200 truncate">
                            {
                              drive.name
                            }
                          </span>

                          <span className="text-[9px] font-mono text-slate-600">
                            {
                              usedPercent
                            }%
                          </span>
                        </div>

                        <div className="h-1.5 mt-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-sky-500 transition-all duration-500"
                            style={{
                              width: `${usedPercent}%`,
                            }}
                          />
                        </div>

                        <div className="text-[9px] text-slate-600 mt-1.5 truncate">
                          {freeGB} GB free of{' '}
                          {
                            drive.totalGB
                          } GB
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </section>

          {/* =================================================
              FOOTER STATUS
          ================================================= */}

          <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-white/[0.05] bg-slate-900/30">
            <div className="flex items-center gap-2">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute w-full h-full rounded-full bg-emerald-400 animate-ping opacity-40" />

                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[9px] text-slate-500">
                ABHISHEK-WORKSTATION
              </span>
            </div>

            <span className="text-[9px] text-slate-700 font-mono">
              C:\Users\Abhishek\Portfolio
            </span>
          </div>

          {/* =================================================
              RIGHT CLICK MENU
          ================================================= */}

          {contextMenu && (
            <ContextMenu
              menu={contextMenu}
              viewMode={viewMode}
              sortMode={sortMode}
              groupMode={groupMode}
              onClose={
                closeContextMenu
              }
              onViewChange={
                setViewMode
              }
              onSortChange={
                setSortMode
              }
              onGroupChange={
                setGroupMode
              }
              onNetworkLocation={() =>
                setNetworkDialogOpen(
                  true,
                )
              }
              onUndoDelete={
                handleUndoDelete
              }
              onProperties={
                openProperties
              }
              onOpenCode={
                handleOpenCode
              }
              onMoreOptions={() =>
                setMoreOptionsOpen(
                  true,
                )
              }
            />
          )}

          {/* =================================================
              NETWORK LOCATION
          ================================================= */}

          {networkDialogOpen && (
            <NetworkLocationDialog
              onClose={() =>
                setNetworkDialogOpen(
                  false,
                )
              }
              onSave={
                addNetworkLocation
              }
            />
          )}

          {/* =================================================
              PROPERTIES
          ================================================= */}

          {propertiesTarget && (
            <PropertiesDialog
              target={
                propertiesTarget
              }
              onClose={() =>
                setPropertiesTarget(
                  null,
                )
              }
            />
          )}

          {/* =================================================
              MORE OPTIONS
          ================================================= */}

          {moreOptionsOpen && (
            <MoreOptionsDialog
              onClose={() =>
                setMoreOptionsOpen(
                  false,
                )
              }
              onRefresh={refresh}
              onProperties={() => {
                setMoreOptionsOpen(
                  false,
                );

                openThisPCProperties();
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};