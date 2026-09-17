// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import { useOS } from "../../context/OSContext";
// import { AppId } from "../../types";
// import { AppIcon } from "../ui/AppIcon";

// import {
//   RefreshCw,
//   SlidersHorizontal,
//   Terminal,
//   FolderKanban,
//   ShieldAlert,
//   Monitor,
//   Check,
//   Grid2X2,
//   ArrowUpDown,
//   ChevronRight,
//   Plus,
//   Paintbrush,
//   Code2,
//   Eye,
//   AlignJustify,
//   FileText,
//   Folder,
//   Undo2,
//   Redo2,
//   Settings2,
//   Pin,
//   PinOff,
//   X,
//   Clock3,
//   Scissors,
//   Copy,
//   Pencil,
//   Share2,
//   Trash2,
//   Smartphone,
//   ShieldCheck,
//   MapPin,
//   Heart,
//   Archive,
//   Clipboard,
//   Cloud,
//   FileCode2,
//   MoreHorizontal,
//   FolderOpen,
//   Info,
//   Star,
// } from "lucide-react";

// type SubMenu =
//   | "view"
//   | "sort"
//   | "new"
//   | "share"
//   | "compress"
//   | null;

// type DesktopAPI = {
//   getSettings: () => {
//     viewMode: "large" | "medium" | "small";
//     sortBy: "name" | "type" | "date";
//     sortDirection: "asc" | "desc";
//     autoArrange: boolean;
//     alignToGrid: boolean;
//     showDesktopIcons: boolean;
//   };

//   setViewMode: (
//     mode: "large" | "medium" | "small"
//   ) => void;

//   setSortBy: (
//     sort: "name" | "type" | "date"
//   ) => void;

//   toggleSortDirection: () => void;

//   toggleAutoArrange: () => void;

//   toggleAlignToGrid: () => void;

//   toggleDesktopIcons: () => void;

//   arrangeIcons: () => void;

//   refresh: () => void;
// };

// const getDesktopAPI = (): DesktopAPI | null => {
//   if (
//     typeof window === "undefined"
//   ) {
//     return null;
//   }

//   return (
//     (window as any)
//       .__ABHISHEK_DESKTOP__ ?? null
//   );
// };

// export const ContextMenu: React.FC = () => {
//   const os = useOS();

//   const {
//     contextMenu,
//     closeContextMenu,
//     refreshDesktop,
//     openApp,
//     closeWindow,
//     minimizeWindow,
//     focusWindow,
//     windows,
//     activeDesktopId,
//     taskbarApps,
//     pinTaskbarApp,
//     unpinTaskbarApp,
//     recentClosedApps,
//     desktopIcons,
//     renameDesktopIcon,
//     removeDesktopIcon,
//     createDesktopItem,
//     toggleFavoriteDesktopIcon,
//     favoriteDesktopIconIds,
//   } = os;

//   const menuRef =
//     useRef<HTMLDivElement>(null);

//   const [activeSubMenu, setActiveSubMenu] =
//     useState<SubMenu>(null);

//   /**
//    * ---------------------------------------------------------
//    * Close menu when clicking outside
//    * ---------------------------------------------------------
//    */

//   useEffect(() => {
//     if (!contextMenu.isOpen) {
//       setActiveSubMenu(null);
//       return;
//     }

//     const handlePointerDown = (
//       event: PointerEvent
//     ) => {
//       // The right-button pointerdown opens the menu; it must not close it again.
//       if (event.button === 2) {
//         return;
//       }

//       const target =
//         event.target as Node;

//       if (
//         menuRef.current &&
//         !menuRef.current.contains(target)
//       ) {
//         closeContextMenu();
//         setActiveSubMenu(null);
//       }
//     };

//     window.addEventListener(
//       "pointerdown",
//       handlePointerDown
//     );

//     return () => {
//       window.removeEventListener(
//         "pointerdown",
//         handlePointerDown
//       );
//     };
//   }, [
//     contextMenu.isOpen,
//     closeContextMenu,
//   ]);

//   /**
//    * ---------------------------------------------------------
//    * Escape closes menu
//    * ---------------------------------------------------------
//    */

//   useEffect(() => {
//     if (!contextMenu.isOpen) return;

//     const handleKeyDown = (
//       event: KeyboardEvent
//     ) => {
//       if (event.key === "Escape") {
//         closeContextMenu();
//         setActiveSubMenu(null);
//       }
//     };

//     window.addEventListener(
//       "keydown",
//       handleKeyDown
//     );

//     return () => {
//       window.removeEventListener(
//         "keydown",
//         handleKeyDown
//       );
//     };
//   }, [
//     contextMenu.isOpen,
//     closeContextMenu,
//   ]);

//   if (!contextMenu.isOpen) {
//     return null;
//   }

//   if (contextMenu.type === "taskbar" && contextMenu.targetId) {
//     const appId = contextMenu.targetId as AppId;
//     const appWindows = windows.filter(window => window.appId === appId && window.desktopId === activeDesktopId);
//     const pinned = taskbarApps.some(app => app.appId === appId);
//     const app = taskbarApps.find(item => item.appId === appId) || {
//       appId,
//       title: appWindows[0]?.title || "Application",
//       icon: appWindows[0]?.iconName || "AppWindow",
//     };
//     const itemClass = "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-slate-100 transition-colors hover:bg-white/10";
//     const close = () => closeContextMenu();
//     return (
//       <div
//         ref={menuRef}
//         role="menu"
//         aria-label={`${app.title} taskbar menu`}
//         style={{ top: `${Math.max(8, Math.min(contextMenu.y - 250, window.innerHeight - 330))}px`, left: `${Math.max(8, Math.min(contextMenu.x - 100, window.innerWidth - 238))}px` }}
//         className="fixed z-[99999] w-[230px] overflow-hidden rounded-xl border border-white/10 bg-[#202020]/95 p-1.5 shadow-2xl backdrop-blur-2xl"
//       >
//         <div className="border-b border-white/10 px-3 py-2">
//           <p className="truncate text-xs font-semibold text-white">{app.title}</p>
//           <p className="text-[10px] text-slate-400">{appWindows.length ? `${appWindows.length} open window${appWindows.length === 1 ? "" : "s"}` : "Not currently open"}</p>
//         </div>
//         {appWindows.map((appWindow) => (
//           <button key={appWindow.id} type="button" className={itemClass} onClick={() => { focusWindow(appWindow.id); close(); }}>
//             <span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> {appWindow.title}
//           </button>
//         ))}
//         <button type="button" className={itemClass} onClick={() => { openApp(appId); close(); }}>
//           <Plus className="h-4 w-4 text-sky-300" /> New window
//         </button>
//         {recentClosedApps.includes(appId) && (
//           <button type="button" className={itemClass} onClick={() => { openApp(appId); close(); }}>
//             <Clock3 className="h-4 w-4 text-amber-300" /> Recently closed
//           </button>
//         )}
//         {appWindows.length > 0 && (
//           <button type="button" className={itemClass} onClick={() => { appWindows.forEach(appWindow => minimizeWindow(appWindow.id)); close(); }}>
//             <span className="h-4 w-4 rounded border border-slate-400/60" /> Minimize all
//           </button>
//         )}
//         <button type="button" className={itemClass} onClick={() => { pinned ? unpinTaskbarApp(appId) : pinTaskbarApp(app); close(); }}>
//           {pinned ? <PinOff className="h-4 w-4 text-slate-300" /> : <Pin className="h-4 w-4 text-slate-300" />}
//           {pinned ? "Unpin from taskbar" : "Pin to taskbar"}
//         </button>
//         {appWindows.length > 0 && (
//           <button type="button" className={`${itemClass} text-red-200 hover:bg-red-500/15`} onClick={() => { appWindows.forEach(appWindow => closeWindow(appWindow.id)); close(); }}>
//             <X className="h-4 w-4" /> Close window{appWindows.length === 1 ? "" : "s"}
//           </button>
//         )}
//       </div>
//     );
//   }

//   if (contextMenu.type === "icon" && contextMenu.targetId) {
//     const icon = desktopIcons.find(item => item.id === contextMenu.targetId);
//     if (!icon) return null;

//     const itemClass = "group flex h-9 w-full items-center gap-3 rounded-md px-2.5 text-left text-[13px] text-slate-100 transition-colors hover:bg-white/[0.1] hover:text-white disabled:pointer-events-none disabled:opacity-40";
//     const iconClass = "h-[17px] w-[17px] shrink-0 text-slate-400 transition-colors group-hover:text-sky-300";
//     const divider = <div className="my-1 h-px bg-white/[0.09]" />;
//     const close = () => { setActiveSubMenu(null); closeContextMenu(); };
//     const isFavorite = favoriteDesktopIconIds.includes(icon.id);
//     const iconPath = `C:\\Users\\Abhishek\\Desktop\\${icon.title}${icon.fileExtension ? `.${icon.fileExtension}` : ""}`;
//     const menuWidth = 340;
//     const menuHeight = 610;
//     const left = Math.max(8, Math.min(contextMenu.x, window.innerWidth - menuWidth - 8));
//     const top = Math.max(8, Math.min(contextMenu.y, window.innerHeight - menuHeight - 8));
//     const share = async (target?: string) => {
//       if (target === "phone") {
//         if (navigator.share) {
//           await navigator.share({ title: icon.title, text: `Shared from Abhishek OS: ${icon.title}` }).catch(() => undefined);
//         } else {
//           await navigator.clipboard?.writeText(iconPath);
//         }
//       } else {
//         await navigator.clipboard?.writeText(iconPath);
//       }
//       close();
//     };

//     return (
//       <div ref={menuRef} role="menu" aria-label={`${icon.title} context menu`}
//         style={{ top: `${top}px`, left: `${left}px` }}
//         className="fixed z-[99999] w-[340px] overflow-visible rounded-xl border border-white/[0.12] bg-[#202020]/95 p-1.5 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[#202020]/88 select-none animate-in fade-in zoom-in-[0.97] duration-150"
//         onContextMenu={event => event.preventDefault()}>
//         <div className="flex items-center gap-2.5 px-2.5 py-2">
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900/80 ring-1 ring-white/10">
//             <AppIcon name={icon.iconName} className="h-5 w-5 text-sky-300" />
//           </div>
//           <div className="min-w-0"><p className="truncate text-xs font-semibold text-white">{icon.title}</p><p className="truncate text-[10px] text-slate-400">{iconPath}</p></div>
//         </div>
//         <div className="grid grid-cols-5 gap-1 border-y border-white/[0.09] px-1 py-1">
//           {[[Scissors, "Cut"], [Copy, "Copy"], [Pencil, "Rename"], [Share2, "Share"], [Trash2, "Delete"]] .map(([Icon, label]) => (
//             <button key={label as string} type="button" title={label as string} className="group flex h-12 flex-col items-center justify-center gap-1 rounded-md text-[10px] text-slate-300 hover:bg-white/10 hover:text-white"
//               onClick={() => {
//                 if (label === "Rename") {
//                   const next = window.prompt("Rename", icon.title);
//                   if (next) renameDesktopIcon(icon.id, next);
//                   close();
//                 } else if (label === "Copy") share(); else if (label === "Delete") {
//                   if (icon.appId !== "recycle-bin" && window.confirm(`Remove the "${icon.title}" shortcut from the desktop?`)) {
//                     removeDesktopIcon(icon.id);
//                   }
//                   close();
//                 } else { close(); }
//               }}>
//               <Icon className="h-4 w-4 text-slate-400 group-hover:text-sky-300" /><span>{label as string}</span>
//             </button>
//           ))}
//         </div>
//         <button type="button" className={itemClass} onClick={() => { openApp(icon.appId, icon.extraData); close(); }}><FolderOpen className={iconClass} />Open</button>
//         <button type="button" className={itemClass} onClick={() => share("phone")}><Smartphone className={iconClass} />Send to phone</button>
//         <div className="relative" onMouseEnter={() => setActiveSubMenu("share")}>
//           <button type="button" className={itemClass}><Share2 className={iconClass} /><span className="flex-1">Share with</span><ChevronRight className="h-4 w-4 text-slate-500" /></button>
//           {activeSubMenu === "share" && <div className="absolute left-[calc(100%+5px)] top-0 z-10 w-52 rounded-lg border border-white/10 bg-[#202020]/98 p-1 shadow-2xl animate-in fade-in slide-in-from-left-1 duration-100">
//             <button type="button" className={itemClass} onClick={() => share("phone")}><Smartphone className={iconClass} />Nearby device</button>
//             <button type="button" className={itemClass} onClick={() => share()}><Clipboard className={iconClass} />Copy link</button>
//           </div>}
//         </div>
//         <button type="button" className={itemClass} onClick={() => { openApp("this-pc", { path: iconPath }); close(); }}><MapPin className={iconClass} />Open file location</button>
//         <button type="button" className={itemClass} onClick={() => { toggleFavoriteDesktopIcon(icon.id); close(); }}><Heart className={`${iconClass} ${isFavorite ? "fill-rose-400 text-rose-400" : ""}`} />{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</button>
//         <div className="relative" onMouseEnter={() => setActiveSubMenu("compress")}>
//           <button type="button" className={itemClass}><Archive className={iconClass} /><span className="flex-1">Compress to</span><ChevronRight className="h-4 w-4 text-slate-500" /></button>
//           {activeSubMenu === "compress" && <div className="absolute left-[calc(100%+5px)] top-0 z-10 w-52 rounded-lg border border-white/10 bg-[#202020]/98 p-1 shadow-2xl animate-in fade-in slide-in-from-left-1 duration-100">
//             <button type="button" className={itemClass} onClick={() => { openApp("terminal", { command: `compress "${iconPath}"` }); close(); }}><Archive className={iconClass} />ZIP archive</button>
//             <button type="button" className={itemClass} onClick={() => { openApp("terminal", { command: `compress "${iconPath}" --7z` }); close(); }}><Archive className={iconClass} />7z archive</button>
//           </div>}
//         </div>
//         <button type="button" className={itemClass} onClick={() => share()}><Clipboard className={iconClass} />Copy as path</button>
//         <button type="button" className={itemClass} onClick={() => { openApp("settings"); close(); }}><Info className={iconClass} />Properties</button>
//         {divider}
//         <button type="button" className={itemClass} onClick={() => { openApp("browser", { url: "https://drive.google.com" }); close(); }}><Cloud className={iconClass} />Back up to cloud</button>
//         <button type="button" className={itemClass} onClick={() => { openApp("browser", { url: "https://drive.google.com/drive/my-drive" }); close(); }}><Cloud className={iconClass} />View cloud versions</button>
//         <button type="button" className={itemClass} onClick={() => { openApp("writer", { filePath: iconPath }); close(); }}><FileCode2 className={iconClass} />Edit in Notepad</button>
//         <button type="button" className={itemClass} onClick={() => { openApp("code-editor", { filePath: iconPath }); close(); }}><FileCode2 className={iconClass} />Open with Code</button>
//         <button type="button" className={itemClass} onClick={() => { close(); }}><MoreHorizontal className={iconClass} />Show more options</button>
//       </div>
//     );
//   }

//   /**
//    * ---------------------------------------------------------
//    * Desktop API
//    * ---------------------------------------------------------
//    */

//   const desktopAPI =
//     getDesktopAPI();

//   const settings =
//     desktopAPI?.getSettings();

//   /**
//    * ---------------------------------------------------------
//    * Menu dimensions
//    * ---------------------------------------------------------
//    */

//   const menuWidth = 315;

//   const menuHeight = 470;

//   const viewportWidth =
//     typeof window !== "undefined"
//       ? window.innerWidth
//       : 1440;

//   const viewportHeight =
//     typeof window !== "undefined"
//       ? window.innerHeight
//       : 900;

//   /**
//    * Keep main menu inside viewport.
//    */

//   const x = Math.max(
//     10,
//     Math.min(
//       contextMenu.x,
//       viewportWidth -
//         menuWidth -
//         10
//     )
//   );

//   const y = Math.max(
//     10,
//     Math.min(
//       contextMenu.y,
//       viewportHeight -
//         menuHeight -
//         10
//     )
//   );

//   /**
//    * ---------------------------------------------------------
//    * Helpers
//    * ---------------------------------------------------------
//    */

//   const closeMenu = () => {
//     setActiveSubMenu(null);
//     closeContextMenu();
//   };

//   const handleViewChange = (
//     mode:
//       | "large"
//       | "medium"
//       | "small"
//   ) => {
//     desktopAPI?.setViewMode(mode);

//     /**
//      * Don't close immediately.
//      * This feels closer to Windows.
//      */
//     setActiveSubMenu(null);
//     closeContextMenu();
//   };

//   const handleSortChange = (
//     sort:
//       | "name"
//       | "type"
//       | "date"
//   ) => {
//     desktopAPI?.setSortBy(sort);
//     desktopAPI?.arrangeIcons();

//     setActiveSubMenu(null);
//     closeContextMenu();
//   };

//   const handleAutoArrange = () => {
//     desktopAPI?.toggleAutoArrange();
//     desktopAPI?.arrangeIcons();

//     setActiveSubMenu(null);
//     closeContextMenu();
//   };

//   const handleAlignToGrid = () => {
//     desktopAPI?.toggleAlignToGrid();

//     setActiveSubMenu(null);
//     closeContextMenu();
//   };

//   const handleShowDesktopIcons = () => {
//     desktopAPI?.toggleDesktopIcons();

//     setActiveSubMenu(null);
//     closeContextMenu();
//   };

//   const handleSortDirection = () => {
//     desktopAPI?.toggleSortDirection();
//     desktopAPI?.arrangeIcons();

//     setActiveSubMenu(null);
//     closeContextMenu();
//   };

//   /**
//    * ---------------------------------------------------------
//    * Generic menu item
//    * ---------------------------------------------------------
//    */

//   const menuItemClass = `
//     group
//     flex
//     h-10
//     w-full
//     items-center
//     rounded-md
//     px-2.5
//     text-left
//     text-[13px]
//     font-medium
//     text-slate-100
//     transition-all
//     duration-100
//     ease-out
//     hover:bg-white/[0.09]
//     hover:text-white
//     active:bg-white/[0.14]
//   `;

//   const iconClass = `
//     mr-3
//     h-[17px]
//     w-[17px]
//     shrink-0
//     text-slate-400
//     transition-colors
//     duration-100
//     group-hover:text-sky-300
//   `;

//   const submenuItemClass = `
//     group
//     flex
//     h-10
//     w-full
//     items-center
//     rounded-md
//     px-2.5
//     text-left
//     text-[13px]
//     font-medium
//     text-slate-100
//     transition-all
//     duration-100
//     ease-out
//     hover:bg-white/[0.09]
//     hover:text-white
//     active:bg-white/[0.14]
//   `;

//   return (
//     <div
//       ref={menuRef}
//       id="desktop-context-menu"
//       role="menu"
//       aria-label="Desktop context menu"
//       style={{
//         top: `${y}px`,
//         left: `${x}px`,
//       }}
//       className="
//         fixed
//         z-[99999]
//         w-[315px]
//         overflow-visible
//         rounded-[11px]
//         border
//         border-white/[0.10]
//         bg-[#202020]/95
//         p-1
//         text-slate-100
//         shadow-[0_20px_60px_rgba(0,0,0,0.55)]
//         backdrop-blur-2xl
//         supports-[backdrop-filter]:bg-[#202020]/85
//         select-none
//         animate-in
//         fade-in
//         zoom-in-[0.97]
//         duration-100
//       "
//       onContextMenu={(event) =>
//         event.preventDefault()
//       }
//     >
//       {/* =====================================================
//           HEADER
//       ===================================================== */}

//       <div
//         className="
//           flex
//           h-8
//           items-center
//           px-2.5
//           text-[11px]
//           font-semibold
//           uppercase
//           tracking-[0.08em]
//           text-slate-500
//         "
//       >
//         Abhishek OS
//       </div>

//       {/* =====================================================
//           VIEW
//       ===================================================== */}

//       <div
//         className="relative"
//         onMouseEnter={() =>
//           setActiveSubMenu("view")
//         }
//       >
//         <button
//           type="button"
//           role="menuitem"
//           className={menuItemClass}
//         >
//           <Grid2X2
//             className={iconClass}
//           />

//           <span className="flex-1">
//             View
//           </span>

//           <ChevronRight
//             className="
//               h-4
//               w-4
//               text-slate-500
//               transition-transform
//               group-hover:translate-x-[1px]
//             "
//           />
//         </button>

//         {/* =================================================
//             VIEW SUBMENU
//         ================================================= */}

//         {activeSubMenu === "view" && (
//           <div
//             className="
//               absolute
//               left-[calc(100%+5px)]
//               top-0
//               w-[315px]
//               rounded-[11px]
//               border
//               border-white/[0.10]
//               bg-[#202020]/95
//               p-1
//               shadow-[0_20px_60px_rgba(0,0,0,0.55)]
//               backdrop-blur-2xl
//               supports-[backdrop-filter]:bg-[#202020]/85
//               animate-in
//               fade-in
//               slide-in-from-left-1
//               duration-100
//             "
//             onMouseEnter={() =>
//               setActiveSubMenu("view")
//             }
//           >
//             {/* Large icons */}

//             <button
//               type="button"
//               className={submenuItemClass}
//               onClick={() =>
//                 handleViewChange(
//                   "large"
//                 )
//               }
//             >
//               <Grid2X2
//                 className={iconClass}
//               />

//               <span className="flex-1">
//                 Large icons
//               </span>

//               <span className="mr-2 text-[11px] text-slate-500">
//                 Ctrl+Shift+2
//               </span>

//               {settings?.viewMode ===
//                 "large" && (
//                 <Check className="h-4 w-4 text-sky-400" />
//               )}
//             </button>

//             {/* Medium icons */}

//             <button
//               type="button"
//               className={submenuItemClass}
//               onClick={() =>
//                 handleViewChange(
//                   "medium"
//                 )
//               }
//             >
//               <Grid2X2
//                 className={iconClass}
//               />

//               <span className="flex-1">
//                 Medium icons
//               </span>

//               <span className="mr-2 text-[11px] text-slate-500">
//                 Ctrl+Shift+3
//               </span>

//               {settings?.viewMode ===
//                 "medium" && (
//                 <Check className="h-4 w-4 text-sky-400" />
//               )}
//             </button>

//             {/* Small icons */}

//             <button
//               type="button"
//               className={submenuItemClass}
//               onClick={() =>
//                 handleViewChange(
//                   "small"
//                 )
//               }
//             >
//               <Grid2X2
//                 className={iconClass}
//               />

//               <span className="flex-1">
//                 Small icons
//               </span>

//               <span className="mr-2 text-[11px] text-slate-500">
//                 Ctrl+Shift+4
//               </span>

//               {settings?.viewMode ===
//                 "small" && (
//                 <Check className="h-4 w-4 text-sky-400" />
//               )}
//             </button>

//             <div className="my-1 h-px bg-white/[0.08]" />

//             {/* Auto arrange */}

//             <button
//               type="button"
//               className={submenuItemClass}
//               onClick={
//                 handleAutoArrange
//               }
//             >
//               <AlignJustify
//                 className={iconClass}
//               />

//               <span className="flex-1">
//                 Auto arrange icons
//               </span>

//               {settings?.autoArrange && (
//                 <Check className="h-4 w-4 text-sky-400" />
//               )}
//             </button>

//             {/* Align to grid */}

//             <button
//               type="button"
//               className={submenuItemClass}
//               onClick={
//                 handleAlignToGrid
//               }
//             >
//               <Grid2X2
//                 className={iconClass}
//               />

//               <span className="flex-1">
//                 Align icons to grid
//               </span>

//               {settings?.alignToGrid && (
//                 <Check className="h-4 w-4 text-sky-400" />
//               )}
//             </button>

//             {/* Show desktop icons */}

//             <button
//               type="button"
//               className={submenuItemClass}
//               onClick={
//                 handleShowDesktopIcons
//               }
//             >
//               <Eye
//                 className={iconClass}
//               />

//               <span className="flex-1">
//                 Show desktop icons
//               </span>

//               {settings?.showDesktopIcons && (
//                 <Check className="h-4 w-4 text-sky-400" />
//               )}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* =====================================================
//           SORT BY
//       ===================================================== */}

//       <div
//         className="relative"
//         onMouseEnter={() =>
//           setActiveSubMenu("sort")
//         }
//       >
//         <button
//           type="button"
//           role="menuitem"
//           className={menuItemClass}
//         >
//           <ArrowUpDown
//             className={iconClass}
//           />

//           <span className="flex-1">
//             Sort by
//           </span>

//           <ChevronRight
//             className="
//               h-4
//               w-4
//               text-slate-500
//             "
//           />
//         </button>

//         {/* =================================================
//             SORT SUBMENU
//         ================================================= */}

//         {activeSubMenu === "sort" && (
//           <div
//             className="
//               absolute
//               left-[calc(100%+5px)]
//               top-0
//               w-[250px]
//               rounded-[11px]
//               border
//               border-white/[0.10]
//               bg-[#202020]/95
//               p-1
//               shadow-[0_20px_60px_rgba(0,0,0,0.55)]
//               backdrop-blur-2xl
//               supports-[backdrop-filter]:bg-[#202020]/85
//               animate-in
//               fade-in
//               slide-in-from-left-1
//               duration-100
//             "
//             onMouseEnter={() =>
//               setActiveSubMenu("sort")
//             }
//           >
//             {/* Name */}

//             <button
//               type="button"
//               className={submenuItemClass}
//               onClick={() =>
//                 handleSortChange(
//                   "name"
//                 )
//               }
//             >
//               <span
//                 className="
//                   mr-3
//                   flex
//                   h-4
//                   w-4
//                   items-center
//                   justify-center
//                 "
//               >
//                 {settings?.sortBy ===
//                   "name" && (
//                   <Check className="h-4 w-4 text-sky-400" />
//                 )}
//               </span>

//               <span>
//                 Name
//               </span>
//             </button>

//             {/* Type */}

//             <button
//               type="button"
//               className={submenuItemClass}
//               onClick={() =>
//                 handleSortChange(
//                   "type"
//                 )
//               }
//             >
//               <span
//                 className="
//                   mr-3
//                   flex
//                   h-4
//                   w-4
//                   items-center
//                   justify-center
//                 "
//               >
//                 {settings?.sortBy ===
//                   "type" && (
//                   <Check className="h-4 w-4 text-sky-400" />
//                 )}
//               </span>

//               <span>
//                 Item type
//               </span>
//             </button>

//             {/* Date */}

//             <button
//               type="button"
//               className={submenuItemClass}
//               onClick={() =>
//                 handleSortChange(
//                   "date"
//                 )
//               }
//             >
//               <span
//                 className="
//                   mr-3
//                   flex
//                   h-4
//                   w-4
//                   items-center
//                   justify-center
//                 "
//               >
//                 {settings?.sortBy ===
//                   "date" && (
//                   <Check className="h-4 w-4 text-sky-400" />
//                 )}
//               </span>

//               <span>
//                 Date modified
//               </span>
//             </button>

//             <div className="my-1 h-px bg-white/[0.08]" />

//             {/* Ascending / Descending */}

//             <button
//               type="button"
//               className={submenuItemClass}
//               onClick={
//                 handleSortDirection
//               }
//             >
//               <ArrowUpDown
//                 className={iconClass}
//               />

//               <span className="flex-1">
//                 {settings?.sortDirection ===
//                 "asc"
//                   ? "Ascending"
//                   : "Descending"}
//               </span>

//               <Check className="h-4 w-4 text-sky-400" />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* =====================================================
//           REFRESH
//       ===================================================== */}

//       <button
//         type="button"
//         role="menuitem"
//         className={menuItemClass}
//         onClick={() => {
//           refreshDesktop();
//           desktopAPI?.refresh();
//           closeMenu();
//         }}
//       >
//         <RefreshCw
//           className={iconClass}
//         />

//         <span className="flex-1">
//           Refresh
//         </span>
//       </button>

//       {/* =====================================================
//           UNDO DELETE
//       ===================================================== */}

//       <button
//         type="button"
//         role="menuitem"
//         className={menuItemClass}
//         onClick={() => {
//           os.undoDesktopChange();

//           closeMenu();
//         }}
//       >
//         <Undo2
//           className={iconClass}
//         />

//         <span className="flex-1">
//           Undo Delete
//         </span>

//         <span className="text-[11px] text-slate-600">
//           Ctrl+Z
//         </span>
//       </button>

//       <button type="button" role="menuitem" className={menuItemClass} onClick={() => { os.redoDesktopChange(); closeMenu(); }}>
//         <Redo2 className={iconClass} />
//         <span className="flex-1">Redo Desktop Change</span>
//         <span className="text-[11px] text-slate-600">Ctrl+Y</span>
//       </button>

//       <div className="my-1 h-px bg-white/[0.08]" />

//       {/* =====================================================
//           NEW
//       ===================================================== */}

//       <div
//         className="relative"
//         onMouseEnter={() =>
//           setActiveSubMenu("new")
//         }
//       >
//         <button
//           type="button"
//           role="menuitem"
//           className={menuItemClass}
//         >
//           <Plus
//             className={iconClass}
//           />

//           <span className="flex-1">
//             New
//           </span>

//           <ChevronRight
//             className="
//               h-4
//               w-4
//               text-slate-500
//             "
//           />
//         </button>

//         {activeSubMenu === "new" && (
//           <div
//             className="
//               absolute
//               left-[calc(100%+5px)]
//               top-0
//               w-[235px]
//               rounded-[11px]
//               border
//               border-white/[0.10]
//               bg-[#202020]/95
//               p-1
//               shadow-[0_20px_60px_rgba(0,0,0,0.55)]
//               backdrop-blur-2xl
//               supports-[backdrop-filter]:bg-[#202020]/85
//               animate-in
//               fade-in
//               slide-in-from-left-1
//               duration-100
//             "
//             onMouseEnter={() =>
//               setActiveSubMenu("new")
//             }
//           >
//             <button
//               type="button"
//               className={submenuItemClass}
//               onClick={() => {
//                 void createDesktopItem("folder");
//                 closeMenu();
//               }}
//             >
//               <Folder
//                 className={iconClass}
//               />

//               New folder
//             </button>

//             <button
//               type="button"
//               className={submenuItemClass}
//               onClick={() => {
//                 void createDesktopItem("text");
//                 closeMenu();
//               }}
//             >
//               <FileText
//                 className={iconClass}
//               />

//               Text document
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="my-1 h-px bg-white/[0.08]" />

//       {/* =====================================================
//           DISPLAY SETTINGS
//       ===================================================== */}

//       <button
//         type="button"
//         role="menuitem"
//         className={menuItemClass}
//         onClick={() => {
//           openApp("settings");
//           closeMenu();
//         }}
//       >
//         <Monitor
//           className={iconClass}
//         />

//         <span>
//           Display settings
//         </span>
//       </button>

//       {/* =====================================================
//           PERSONALIZE
//       ===================================================== */}

//       <button
//         type="button"
//         role="menuitem"
//         className={menuItemClass}
//         onClick={() => {
//           openApp("settings");
//           closeMenu();
//         }}
//       >
//         <Paintbrush
//           className={iconClass}
//         />

//         <span>
//           Personalize
//         </span>
//       </button>

//       <div className="my-1 h-px bg-white/[0.08]" />

//       {/* =====================================================
//           OPEN IN TERMINAL
//       ===================================================== */}

//       <button
//         type="button"
//         role="menuitem"
//         className={menuItemClass}
//         onClick={() => {
//           openApp("terminal");
//           closeMenu();
//         }}
//       >
//         <Terminal
//           className="
//             mr-3
//             h-[17px]
//             w-[17px]
//             shrink-0
//             text-emerald-400
//             transition-colors
//             group-hover:text-emerald-300
//           "
//         />

//         <span className="flex-1">
//           Open in Terminal
//         </span>
//       </button>

//       {/* =====================================================
//           OPEN WITH CODE
//       ===================================================== */}

//       <button
//         type="button"
//         role="menuitem"
//         className={menuItemClass}
//         onClick={() => {
//           /**
//            * If you register a "code" app:
//            */
//           openApp("code-editor");
//           closeMenu();
//         }}
//       >
//         <Code2
//           className="
//             mr-3
//             h-[17px]
//             w-[17px]
//             shrink-0
//             text-blue-400
//             transition-colors
//             group-hover:text-blue-300
//           "
//         />

//         <span className="flex-1">
//           Open with Code
//         </span>
//       </button>

//       <div className="my-1 h-px bg-white/[0.08]" />

//       {/* =====================================================
//           FILE EXPLORER
//       ===================================================== */}

//       <button
//         type="button"
//         role="menuitem"
//         className={menuItemClass}
//         onClick={() => {
//           openApp("this-pc");
//           closeMenu();
//         }}
//       >
//         <Monitor
//           className={iconClass}
//         />

//         <span className="flex-1">
//           Open File Explorer
//         </span>
//       </button>

//       {/* =====================================================
//           PROJECTS
//       ===================================================== */}

//       <button
//         type="button"
//         role="menuitem"
//         className={menuItemClass}
//         onClick={() => {
//           openApp("projects");
//           closeMenu();
//         }}
//       >
//         <FolderKanban
//           className={iconClass}
//         />

//         <span className="flex-1">
//           Browse Projects
//         </span>
//       </button>

//       {/* =====================================================
//           PORTFOLIO CONTROL CENTER
//       ===================================================== */}

//       {/* =====================================================
//           FOOTER
//       ===================================================== */}

//       <div
//         className="
//           mt-1
//           flex
//           h-7
//           items-center
//           gap-1.5
//           px-2.5
//           text-[10px]
//           text-slate-600
//         "
//       >
//         <Settings2
//           className="h-3 w-3"
//         />

//         <span>
//           Abhishek OS Desktop
//         </span>
//       </div>
//     </div>
//   );
// };

// export default ContextMenu;


import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useOS } from "../../context/OSContext";
import { AppId } from "../../types";
import { AppIcon } from "../ui/AppIcon";

import {
  RefreshCw,
  SlidersHorizontal,
  Terminal,
  FolderKanban,
  Monitor,
  Check,
  Grid2X2,
  ArrowUpDown,
  ChevronRight,
  Plus,
  Paintbrush,
  Code2,
  Eye,
  AlignJustify,
  FileText,
  Folder,
  Undo2,
  Redo2,
  Settings2,
  Pin,
  PinOff,
  X,
  Clock3,
  Scissors,
  Copy,
  Pencil,
  Share2,
  Trash2,
  Smartphone,
  Heart,
  Archive,
  Clipboard,
  Cloud,
  FileCode2,
  MoreHorizontal,
  FolderOpen,
  Info,
  Sparkles,
  MoveDiagonal2,
  ShieldCheck,
} from "lucide-react";

type SubMenu =
  | "view"
  | "sort"
  | "new"
  | "share"
  | "compress"
  | null;

type DesktopAPI = {
  getSettings: () => {
    viewMode: "large" | "medium" | "small";
    sortBy: "name" | "type" | "date";
    sortDirection: "asc" | "desc";
    autoArrange: boolean;
    alignToGrid: boolean;
    showDesktopIcons: boolean;
  };

  setViewMode: (
    mode: "large" | "medium" | "small"
  ) => void;

  setSortBy: (
    sort: "name" | "type" | "date"
  ) => void;

  toggleSortDirection: () => void;
  toggleAutoArrange: () => void;
  toggleAlignToGrid: () => void;
  toggleDesktopIcons: () => void;
  arrangeIcons: () => void;
  refresh: () => void;
};

const getDesktopAPI = (): DesktopAPI | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    (window as unknown as {
      __ABHISHEK_DESKTOP__?: DesktopAPI;
    }).__ABHISHEK_DESKTOP__ ?? null
  );
};

/* =========================================================
   SMALL GLASS SEPARATOR
   ========================================================= */

const Divider = () => (
  <div className="mx-2 my-1.5 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
);

/* =========================================================
   MENU ITEM
   ========================================================= */

interface MenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  active?: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  icon,
  shortcut,
  danger = false,
  disabled = false,
  active = false,
  hasSubmenu = false,
  onClick,
  onMouseEnter,
}) => {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`
        group relative flex h-9 w-full items-center
        rounded-lg px-2 text-left
        text-[12.5px] font-medium
        transition-all duration-150
        ease-out
        disabled:pointer-events-none
        disabled:opacity-40
        ${
          danger
            ? "text-red-200 hover:bg-red-500/[0.12] hover:text-red-100"
            : "text-slate-200 hover:bg-white/[0.085] hover:text-white"
        }
        ${active ? "bg-white/[0.08]" : ""}
      `}
    >
      {/* Hover glow */}
      <span
        className="
          pointer-events-none absolute inset-0
          rounded-lg opacity-0
          transition-opacity duration-150
          group-hover:opacity-100
          bg-gradient-to-r
          from-white/[0.045]
          via-white/[0.025]
          to-transparent
        "
      />

      {/* Active accent */}
      {active && (
        <span
          className="
            absolute left-0 top-1.5 bottom-1.5
            w-[2px] rounded-full
            bg-sky-400
            shadow-[0_0_10px_rgba(56,189,248,0.8)]
          "
        />
      )}

      {icon && (
        <span
          className={`
            relative z-10 mr-3
            flex h-[18px] w-[18px]
            shrink-0 items-center justify-center
            transition-all duration-150
            ${
              danger
                ? "text-red-300 group-hover:text-red-200"
                : "text-slate-400 group-hover:text-sky-300"
            }
          `}
        >
          {icon}
        </span>
      )}

      <span className="relative z-10 flex-1 truncate">
        {children}
      </span>

      {shortcut && (
        <span
          className="
            relative z-10 ml-4
            text-[10px]
            font-medium
            tracking-wide
            text-slate-500
            group-hover:text-slate-400
          "
        >
          {shortcut}
        </span>
      )}

      {hasSubmenu && (
        <ChevronRight
          className="
            relative z-10 ml-2
            h-3.5 w-3.5
            text-slate-500
            transition-transform duration-150
            group-hover:translate-x-0.5
            group-hover:text-slate-300
          "
        />
      )}
    </button>
  );
};

/* =========================================================
   SUBMENU CONTAINER
   ========================================================= */

interface SubMenuContainerProps {
  children: React.ReactNode;
  width?: number;
}

const SubMenuContainer: React.FC<
  SubMenuContainerProps
> = ({ children, width = 260 }) => {
  return (
    <div
      style={{ width }}
      className="
        absolute
        left-[calc(100%+6px)]
        top-0
        z-[100]
        overflow-hidden
        rounded-xl
        border
        border-white/[0.13]
        bg-[#11151d]/[0.88]
        p-1.5
        shadow-[0_24px_80px_rgba(0,0,0,0.58)]
        backdrop-blur-[30px]
        backdrop-saturate-[180%]
        animate-in
        fade-in
        slide-in-from-left-1
        zoom-in-[0.98]
        duration-150
      "
      onMouseDown={(event) =>
        event.stopPropagation()
      }
    >
      {/* Glass shine */}
      <div
        className="
          pointer-events-none
          absolute inset-x-0 top-0
          h-20
          bg-gradient-to-b
          from-white/[0.055]
          to-transparent
        "
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/* =========================================================
   MAIN CONTEXT MENU
   ========================================================= */

export const ContextMenu: React.FC = () => {
  const os = useOS();

  const {
    contextMenu,
    closeContextMenu,
    refreshDesktop,
    openApp,
    closeWindow,
    minimizeWindow,
    focusWindow,
    windows,
    activeDesktopId,
    taskbarApps,
    pinTaskbarApp,
    unpinTaskbarApp,
    recentClosedApps,
    desktopIcons,
    renameDesktopIcon,
    removeDesktopIcon,
    createDesktopItem,
    toggleFavoriteDesktopIcon,
    favoriteDesktopIconIds,
  } = os;

  const menuRef =
    useRef<HTMLDivElement>(null);

  const [activeSubMenu, setActiveSubMenu] =
    useState<SubMenu>(null);

  /* =========================================================
     CLOSE WHEN CLICKING OUTSIDE
     ========================================================= */

  useEffect(() => {
    if (!contextMenu.isOpen) {
      setActiveSubMenu(null);
      return;
    }

    const handlePointerDown = (
      event: PointerEvent
    ) => {
      if (event.button === 2) {
        return;
      }

      const target =
        event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        closeContextMenu();
        setActiveSubMenu(null);
      }
    };

    window.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [
    contextMenu.isOpen,
    closeContextMenu,
  ]);

  /* =========================================================
     ESCAPE
     ========================================================= */

  useEffect(() => {
    if (!contextMenu.isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closeContextMenu();
        setActiveSubMenu(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    contextMenu.isOpen,
    closeContextMenu,
  ]);

  if (!contextMenu.isOpen) {
    return null;
  }

  /* =========================================================
     TASKBAR CONTEXT MENU
     ========================================================= */

  if (
    contextMenu.type === "taskbar" &&
    contextMenu.targetId
  ) {
    const appId =
      contextMenu.targetId as AppId;

    const appWindows =
      windows.filter(
        (appWindow) =>
          appWindow.appId === appId &&
          appWindow.desktopId ===
            activeDesktopId
      );

    const pinned =
      taskbarApps.some(
        (app) => app.appId === appId
      );

    const app =
      taskbarApps.find(
        (item) => item.appId === appId
      ) || {
        appId,
        title:
          appWindows[0]?.title ||
          "Application",
        icon:
          appWindows[0]?.iconName ||
          "AppWindow",
      };

    const close = () => {
      closeContextMenu();
      setActiveSubMenu(null);
    };

    const top = Math.max(
      8,
      Math.min(
        contextMenu.y - 310,
        window.innerHeight - 430
      )
    );

    const left = Math.max(
      8,
      Math.min(
        contextMenu.x - 115,
        window.innerWidth - 260
      )
    );

    return (
      <div
        ref={menuRef}
        role="menu"
        aria-label={`${app.title} taskbar menu`}
        style={{
          top,
          left,
        }}
        className="
          fixed z-[99999]
          w-[250px]
          overflow-hidden
          rounded-2xl
          border border-white/[0.14]
          bg-[#10141c]/[0.84]
          p-1.5
          text-slate-100
          shadow-[0_28px_90px_rgba(0,0,0,0.65)]
          backdrop-blur-[32px]
          backdrop-saturate-[180%]
          select-none
          animate-in
          fade-in
          zoom-in-[0.94]
          slide-in-from-bottom-1
          duration-150
        "
        onContextMenu={(event) =>
          event.preventDefault()
        }
      >
        {/* Glass reflection */}
        <div
          className="
            pointer-events-none
            absolute inset-x-0 top-0
            h-24
            bg-gradient-to-b
            from-sky-400/[0.06]
            via-white/[0.025]
            to-transparent
          "
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-1 flex items-center gap-3 px-2.5 py-2.5">
            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                border border-white/[0.1]
                bg-white/[0.055]
                shadow-inner
              "
            >
              <AppIcon
                name={app.icon}
                className="h-5 w-5 text-sky-300"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {app.title}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                {appWindows.length
                  ? `${appWindows.length} open ${
                      appWindows.length === 1
                        ? "window"
                        : "windows"
                    }`
                  : "Not currently open"}
              </p>
            </div>

            {pinned && (
              <Pin className="h-3.5 w-3.5 text-sky-400" />
            )}
          </div>

          <Divider />

          {/* Open windows */}
          {appWindows.length > 0 && (
            <>
              <div className="px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                Open windows
              </div>

              {appWindows.map(
                (appWindow) => (
                  <MenuItem
                    key={appWindow.id}
                    icon={
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                    }
                    onClick={() => {
                      focusWindow(
                        appWindow.id
                      );
                      close();
                    }}
                  >
                    {appWindow.title}
                  </MenuItem>
                )
              )}
            </>
          )}

          <MenuItem
            icon={
              <Plus className="h-4 w-4" />
            }
            onClick={() => {
              openApp(appId);
              close();
            }}
          >
            New window
          </MenuItem>

          {recentClosedApps.includes(
            appId
          ) && (
            <MenuItem
              icon={
                <Clock3 className="h-4 w-4" />
              }
              onClick={() => {
                openApp(appId);
                close();
              }}
            >
              Recently closed
            </MenuItem>
          )}

          {appWindows.length > 0 && (
            <MenuItem
              icon={
                <MoveDiagonal2 className="h-4 w-4" />
              }
              onClick={() => {
                appWindows.forEach(
                  (appWindow) =>
                    minimizeWindow(
                      appWindow.id
                    )
                );
                close();
              }}
            >
              Minimize all
            </MenuItem>
          )}

          <Divider />

          <MenuItem
            icon={
              pinned ? (
                <PinOff className="h-4 w-4" />
              ) : (
                <Pin className="h-4 w-4" />
              )
            }
            onClick={() => {
              pinned
                ? unpinTaskbarApp(
                    appId
                  )
                : pinTaskbarApp(app);

              close();
            }}
          >
            {pinned
              ? "Unpin from taskbar"
              : "Pin to taskbar"}
          </MenuItem>

          {appWindows.length > 0 && (
            <MenuItem
              danger
              icon={
                <X className="h-4 w-4" />
              }
              onClick={() => {
                appWindows.forEach(
                  (appWindow) =>
                    closeWindow(
                      appWindow.id
                    )
                );
                close();
              }}
            >
              Close{" "}
              {appWindows.length === 1
                ? "window"
                : "windows"}
            </MenuItem>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================
     DESKTOP ICON CONTEXT MENU
     ========================================================= */

  if (
    contextMenu.type === "icon" &&
    contextMenu.targetId
  ) {
    const icon = desktopIcons.find(
      (item) =>
        item.id === contextMenu.targetId
    );

    if (!icon) {
      return null;
    }

    const isFavorite =
      favoriteDesktopIconIds.includes(
        icon.id
      );

    const iconPath =
      `C:\\Users\\Abhishek\\Desktop\\${icon.title}` +
      `${
        icon.fileExtension
          ? `.${icon.fileExtension}`
          : ""
      }`;

    const menuWidth = 330;
    const menuHeight = 650;

    const left = Math.max(
      8,
      Math.min(
        contextMenu.x,
        window.innerWidth -
          menuWidth -
          8
      )
    );

    const top = Math.max(
      8,
      Math.min(
        contextMenu.y,
        window.innerHeight -
          menuHeight -
          8
      )
    );

    const close = () => {
      setActiveSubMenu(null);
      closeContextMenu();
    };

    const share = async (
      target?: string
    ) => {
      if (
        target === "phone" &&
        navigator.share
      ) {
        await navigator
          .share({
            title: icon.title,
            text: `Shared from Abhishek OS: ${icon.title}`,
          })
          .catch(() => undefined);
      } else {
        await navigator.clipboard
          ?.writeText(iconPath)
          .catch(() => undefined);
      }

      close();
    };

    return (
      <div
        ref={menuRef}
        role="menu"
        aria-label={`${icon.title} context menu`}
        style={{
          top,
          left,
        }}
        className="
          fixed z-[99999]
          w-[330px]
          overflow-visible
          rounded-2xl
          border border-white/[0.14]
          bg-[#10141c]/[0.86]
          p-1.5
          text-slate-100
          shadow-[0_30px_100px_rgba(0,0,0,0.68)]
          backdrop-blur-[32px]
          backdrop-saturate-[190%]
          select-none
          animate-in
          fade-in
          zoom-in-[0.94]
          duration-150
        "
        onContextMenu={(event) =>
          event.preventDefault()
        }
      >
        {/* =================================================
            GLASS BACKGROUND
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute inset-0
            overflow-hidden
            rounded-2xl
          "
        >
          <div
            className="
              absolute -left-20 -top-20
              h-40 w-40
              rounded-full
              bg-sky-400/[0.07]
              blur-3xl
            "
          />

          <div
            className="
              absolute -right-20 top-20
              h-44 w-44
              rounded-full
              bg-indigo-500/[0.055]
              blur-3xl
            "
          />

          <div
            className="
              absolute inset-x-0 top-0
              h-28
              bg-gradient-to-b
              from-white/[0.055]
              to-transparent
            "
          />
        </div>

        <div className="relative z-10">
          {/* =================================================
              FILE HEADER
          ================================================= */}

          <div className="flex items-center gap-3 px-2.5 py-2.5">
            <div
              className="
                relative flex h-10 w-10
                shrink-0 items-center justify-center
                rounded-xl
                border border-white/[0.12]
                bg-white/[0.055]
                shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
              "
            >
              <AppIcon
                name={icon.iconName}
                className="h-6 w-6 text-sky-300"
              />

              {isFavorite && (
                <span
                  className="
                    absolute -right-1 -top-1
                    flex h-4 w-4
                    items-center justify-center
                    rounded-full
                    border border-white/20
                    bg-rose-500/90
                    shadow-[0_0_12px_rgba(244,63,94,0.45)]
                  "
                >
                  <Heart className="h-2.5 w-2.5 fill-white text-white" />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-white">
                {icon.title}
              </p>

              <p className="mt-0.5 truncate text-[9.5px] text-slate-500">
                {icon.fileExtension
                  ? `${icon.fileExtension.toUpperCase()} file`
                  : "Desktop item"}
              </p>
            </div>

            <ShieldCheck className="h-4 w-4 text-emerald-400/70" />
          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div
            className="
              mx-1
              grid grid-cols-5
              overflow-hidden
              rounded-xl
              border border-white/[0.08]
              bg-black/[0.12]
            "
          >
            {[
              {
                icon: Scissors,
                label: "Cut",
                action: close,
              },
              {
                icon: Copy,
                label: "Copy",
                action: () => share(),
              },
              {
                icon: Pencil,
                label: "Rename",
                action: () => {
                  const next =
                    window.prompt(
                      "Rename item",
                      icon.title
                    );

                  if (
                    next &&
                    next.trim() &&
                    next.trim() !==
                      icon.title
                  ) {
                    renameDesktopIcon(
                      icon.id,
                      next.trim()
                    );
                  }

                  close();
                },
              },
              {
                icon: Share2,
                label: "Share",
                action: () =>
                  share("phone"),
              },
              {
                icon: Trash2,
                label: "Delete",
                action: () => {
                  if (
                    icon.appId !==
                      "recycle-bin" &&
                    window.confirm(
                      `Remove "${icon.title}" from the desktop?`
                    )
                  ) {
                    removeDesktopIcon(
                      icon.id
                    );
                  }

                  close();
                },
              },
            ].map(
              ({
                icon: ActionIcon,
                label,
                action,
              }) => (
                <button
                  key={label}
                  type="button"
                  title={label}
                  onClick={action}
                  className="
                    group flex h-14
                    flex-col items-center
                    justify-center gap-1
                    border-r border-white/[0.06]
                    last:border-r-0
                    text-slate-400
                    transition-all duration-150
                    hover:bg-white/[0.07]
                    hover:text-white
                  "
                >
                  <ActionIcon
                    className="
                      h-4 w-4
                      transition-transform
                      duration-150
                      group-hover:-translate-y-0.5
                      group-hover:text-sky-300
                    "
                  />

                  <span className="text-[9px]">
                    {label}
                  </span>
                </button>
              )
            )}
          </div>

          <div className="px-1 pt-1">
            <MenuItem
              icon={
                <FolderOpen className="h-4 w-4" />
              }
              onClick={() => {
                openApp(
                  icon.appId,
                  icon.extraData
                );
                close();
              }}
            >
              Open
            </MenuItem>

            <MenuItem
              icon={
                <Smartphone className="h-4 w-4" />
              }
              onClick={() =>
                share("phone")
              }
            >
              Send to phone
            </MenuItem>

            {/* =================================================
                SHARE SUBMENU
            ================================================= */}

            <div
              className="relative"
              onMouseEnter={() =>
                setActiveSubMenu("share")
              }
            >
              <MenuItem
                icon={
                  <Share2 className="h-4 w-4" />
                }
                hasSubmenu
              >
                Share with
              </MenuItem>

              {activeSubMenu ===
                "share" && (
                <SubMenuContainer width={220}>
                  <MenuItem
                    icon={
                      <Smartphone className="h-4 w-4" />
                    }
                    onClick={() =>
                      share("phone")
                    }
                  >
                    Nearby device
                  </MenuItem>

                  <MenuItem
                    icon={
                      <Clipboard className="h-4 w-4" />
                    }
                    onClick={() =>
                      share()
                    }
                  >
                    Copy link
                  </MenuItem>
                </SubMenuContainer>
              )}
            </div>

            <MenuItem
              icon={
                <MoveDiagonal2 className="h-4 w-4" />
              }
              onClick={() => {
                openApp("this-pc", {
                  path: iconPath,
                });
                close();
              }}
            >
              Open file location
            </MenuItem>

            <MenuItem
              icon={
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite
                      ? "fill-rose-400 text-rose-400"
                      : ""
                  }`}
                />
              }
              onClick={() => {
                toggleFavoriteDesktopIcon(
                  icon.id
                );
                close();
              }}
            >
              {isFavorite
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </MenuItem>

            {/* =================================================
                COMPRESS SUBMENU
            ================================================= */}

            <div
              className="relative"
              onMouseEnter={() =>
                setActiveSubMenu(
                  "compress"
                )
              }
            >
              <MenuItem
                icon={
                  <Archive className="h-4 w-4" />
                }
                hasSubmenu
              >
                Compress to
              </MenuItem>

              {activeSubMenu ===
                "compress" && (
                <SubMenuContainer width={220}>
                  <MenuItem
                    icon={
                      <Archive className="h-4 w-4" />
                    }
                    onClick={() => {
                      openApp(
                        "terminal",
                        {
                          command: `compress "${iconPath}"`,
                        }
                      );
                      close();
                    }}
                  >
                    ZIP archive
                  </MenuItem>

                  <MenuItem
                    icon={
                      <Archive className="h-4 w-4" />
                    }
                    onClick={() => {
                      openApp(
                        "terminal",
                        {
                          command: `compress "${iconPath}" --7z`,
                        }
                      );
                      close();
                    }}
                  >
                    7z archive
                  </MenuItem>
                </SubMenuContainer>
              )}
            </div>

            <MenuItem
              icon={
                <Clipboard className="h-4 w-4" />
              }
              onClick={() =>
                share()
              }
            >
              Copy as path
            </MenuItem>

            <MenuItem
              icon={
                <Info className="h-4 w-4" />
              }
              onClick={() => {
                openApp("settings");
                close();
              }}
            >
              Properties
            </MenuItem>
          </div>

          <Divider />

          <div className="px-1">
            <MenuItem
              icon={
                <Cloud className="h-4 w-4" />
              }
              onClick={() => {
                openApp("browser", {
                  url: "https://drive.google.com",
                });
                close();
              }}
            >
              Back up to cloud
            </MenuItem>

            <MenuItem
              icon={
                <Cloud className="h-4 w-4" />
              }
              onClick={() => {
                openApp("browser", {
                  url: "https://drive.google.com/drive/my-drive",
                });
                close();
              }}
            >
              View cloud versions
            </MenuItem>

            <MenuItem
              icon={
                <FileCode2 className="h-4 w-4" />
              }
              onClick={() => {
                openApp("writer", {
                  filePath: iconPath,
                });
                close();
              }}
            >
              Edit in Notepad
            </MenuItem>

            <MenuItem
              icon={
                <Code2 className="h-4 w-4" />
              }
              onClick={() => {
                openApp("code-editor", {
                  filePath: iconPath,
                });
                close();
              }}
            >
              Open with Code
            </MenuItem>

            <MenuItem
              icon={
                <MoreHorizontal className="h-4 w-4" />
              }
              onClick={close}
            >
              Show more options
            </MenuItem>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     DESKTOP CONTEXT MENU
     ========================================================= */

  const desktopAPI =
    getDesktopAPI();

  const settings =
    desktopAPI?.getSettings();

  const menuWidth = 315;
  const menuHeight = 510;

  const viewportWidth =
    typeof window !== "undefined"
      ? window.innerWidth
      : 1440;

  const viewportHeight =
    typeof window !== "undefined"
      ? window.innerHeight
      : 900;

  const x = Math.max(
    10,
    Math.min(
      contextMenu.x,
      viewportWidth -
        menuWidth -
        10
    )
  );

  const y = Math.max(
    10,
    Math.min(
      contextMenu.y,
      viewportHeight -
        menuHeight -
        10
    )
  );

  const closeMenu = () => {
    setActiveSubMenu(null);
    closeContextMenu();
  };

  const handleViewChange = (
    mode:
      | "large"
      | "medium"
      | "small"
  ) => {
    desktopAPI?.setViewMode(mode);
    closeMenu();
  };

  const handleSortChange = (
    sort:
      | "name"
      | "type"
      | "date"
  ) => {
    desktopAPI?.setSortBy(sort);
    desktopAPI?.arrangeIcons();
    closeMenu();
  };

  const handleAutoArrange = () => {
    desktopAPI?.toggleAutoArrange();
    desktopAPI?.arrangeIcons();
    closeMenu();
  };

  const handleAlignToGrid = () => {
    desktopAPI?.toggleAlignToGrid();
    closeMenu();
  };

  const handleShowDesktopIcons = () => {
    desktopAPI?.toggleDesktopIcons();
    closeMenu();
  };

  const handleSortDirection = () => {
    desktopAPI?.toggleSortDirection();
    desktopAPI?.arrangeIcons();
    closeMenu();
  };

  return (
    <div
      ref={menuRef}
      id="desktop-context-menu"
      role="menu"
      aria-label="Abhishek OS desktop context menu"
      style={{
        top: y,
        left: x,
      }}
      className="
        fixed z-[99999]
        w-[315px]
        overflow-visible
        rounded-2xl
        border border-white/[0.14]
        bg-[#0d1118]/[0.84]
        p-1.5
        text-slate-100
        shadow-[0_30px_100px_rgba(0,0,0,0.68)]
        backdrop-blur-[34px]
        backdrop-saturate-[190%]
        select-none
        animate-in
        fade-in
        zoom-in-[0.94]
        duration-150
      "
      onContextMenu={(event) =>
        event.preventDefault()
      }
    >
      {/* =====================================================
          GLASS LIGHT
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          overflow-hidden
          rounded-2xl
        "
      >
        <div
          className="
            absolute -left-16 -top-16
            h-40 w-40
            rounded-full
            bg-sky-400/[0.065]
            blur-3xl
          "
        />

        <div
          className="
            absolute -right-20 top-32
            h-44 w-44
            rounded-full
            bg-indigo-500/[0.05]
            blur-3xl
          "
        />

        <div
          className="
            absolute inset-x-0 top-0
            h-24
            bg-gradient-to-b
            from-white/[0.055]
            to-transparent
          "
        />

        <div
          className="
            absolute inset-x-4 top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/[0.18]
            to-transparent
          "
        />
      </div>

      <div className="relative z-10">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            flex h-9
            items-center
            gap-2
            px-2.5
          "
        >
          <Sparkles
            className="
              h-3.5 w-3.5
              text-sky-400
              drop-shadow-[0_0_7px_rgba(56,189,248,0.6)]
            "
          />

          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-slate-500
            "
          >
            Abhishek OS
          </span>

          <span className="ml-auto text-[9px] text-slate-600">
            Desktop
          </span>
        </div>

        <Divider />

        {/* =====================================================
            VIEW
        ===================================================== */}

        <div
          className="relative"
          onMouseEnter={() =>
            setActiveSubMenu("view")
          }
        >
          <MenuItem
            icon={
              <Grid2X2 className="h-4 w-4" />
            }
            hasSubmenu
          >
            View
          </MenuItem>

          {activeSubMenu ===
            "view" && (
            <SubMenuContainer width={315}>
              <div className="px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                Icon layout
              </div>

              <MenuItem
                icon={
                  <Grid2X2 className="h-4 w-4" />
                }
                shortcut="Ctrl+Shift+2"
                active={
                  settings?.viewMode ===
                  "large"
                }
                onClick={() =>
                  handleViewChange(
                    "large"
                  )
                }
              >
                Large icons
                {settings?.viewMode ===
                  "large" && (
                  <Check className="ml-2 h-3.5 w-3.5 text-sky-400" />
                )}
              </MenuItem>

              <MenuItem
                icon={
                  <Grid2X2 className="h-4 w-4" />
                }
                shortcut="Ctrl+Shift+3"
                active={
                  settings?.viewMode ===
                  "medium"
                }
                onClick={() =>
                  handleViewChange(
                    "medium"
                  )
                }
              >
                Medium icons
                {settings?.viewMode ===
                  "medium" && (
                  <Check className="ml-2 h-3.5 w-3.5 text-sky-400" />
                )}
              </MenuItem>

              <MenuItem
                icon={
                  <Grid2X2 className="h-4 w-4" />
                }
                shortcut="Ctrl+Shift+4"
                active={
                  settings?.viewMode ===
                  "small"
                }
                onClick={() =>
                  handleViewChange(
                    "small"
                  )
                }
              >
                Small icons
                {settings?.viewMode ===
                  "small" && (
                  <Check className="ml-2 h-3.5 w-3.5 text-sky-400" />
                )}
              </MenuItem>

              <Divider />

              <MenuItem
                icon={
                  <AlignJustify className="h-4 w-4" />
                }
                active={
                  settings?.autoArrange
                }
                onClick={
                  handleAutoArrange
                }
              >
                Auto arrange icons
                {settings?.autoArrange && (
                  <Check className="ml-2 h-3.5 w-3.5 text-sky-400" />
                )}
              </MenuItem>

              <MenuItem
                icon={
                  <Grid2X2 className="h-4 w-4" />
                }
                active={
                  settings?.alignToGrid
                }
                onClick={
                  handleAlignToGrid
                }
              >
                Align icons to grid
                {settings?.alignToGrid && (
                  <Check className="ml-2 h-3.5 w-3.5 text-sky-400" />
                )}
              </MenuItem>

              <MenuItem
                icon={
                  <Eye className="h-4 w-4" />
                }
                active={
                  settings?.showDesktopIcons
                }
                onClick={
                  handleShowDesktopIcons
                }
              >
                Show desktop icons
                {settings?.showDesktopIcons && (
                  <Check className="ml-2 h-3.5 w-3.5 text-sky-400" />
                )}
              </MenuItem>
            </SubMenuContainer>
          )}
        </div>

        {/* =====================================================
            SORT
        ===================================================== */}

        <div
          className="relative"
          onMouseEnter={() =>
            setActiveSubMenu("sort")
          }
        >
          <MenuItem
            icon={
              <ArrowUpDown className="h-4 w-4" />
            }
            hasSubmenu
          >
            Sort by
          </MenuItem>

          {activeSubMenu ===
            "sort" && (
            <SubMenuContainer width={250}>
              <div className="px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                Arrange desktop items
              </div>

              <MenuItem
                active={
                  settings?.sortBy ===
                  "name"
                }
                onClick={() =>
                  handleSortChange(
                    "name"
                  )
                }
              >
                <span className="mr-2">
                  Name
                </span>

                {settings?.sortBy ===
                  "name" && (
                  <Check className="ml-auto h-3.5 w-3.5 text-sky-400" />
                )}
              </MenuItem>

              <MenuItem
                active={
                  settings?.sortBy ===
                  "type"
                }
                onClick={() =>
                  handleSortChange(
                    "type"
                  )
                }
              >
                <span className="mr-2">
                  Item type
                </span>

                {settings?.sortBy ===
                  "type" && (
                  <Check className="ml-auto h-3.5 w-3.5 text-sky-400" />
                )}
              </MenuItem>

              <MenuItem
                active={
                  settings?.sortBy ===
                  "date"
                }
                onClick={() =>
                  handleSortChange(
                    "date"
                  )
                }
              >
                <span className="mr-2">
                  Date modified
                </span>

                {settings?.sortBy ===
                  "date" && (
                  <Check className="ml-auto h-3.5 w-3.5 text-sky-400" />
                )}
              </MenuItem>

              <Divider />

              <MenuItem
                icon={
                  <ArrowUpDown className="h-4 w-4" />
                }
                onClick={
                  handleSortDirection
                }
              >
                {settings?.sortDirection ===
                "asc"
                  ? "Ascending"
                  : "Descending"}

                <Check className="ml-auto h-3.5 w-3.5 text-sky-400" />
              </MenuItem>
            </SubMenuContainer>
          )}
        </div>

        {/* =====================================================
            REFRESH
        ===================================================== */}

        <MenuItem
          icon={
            <RefreshCw className="h-4 w-4" />
          }
          onClick={() => {
            refreshDesktop();
            desktopAPI?.refresh();
            closeMenu();
          }}
        >
          Refresh
        </MenuItem>

        {/* =====================================================
            UNDO / REDO
        ===================================================== */}

        <MenuItem
          icon={
            <Undo2 className="h-4 w-4" />
          }
          shortcut="Ctrl+Z"
          onClick={() => {
            os.undoDesktopChange();
            closeMenu();
          }}
        >
          Undo Delete
        </MenuItem>

        <MenuItem
          icon={
            <Redo2 className="h-4 w-4" />
          }
          shortcut="Ctrl+Y"
          onClick={() => {
            os.redoDesktopChange();
            closeMenu();
          }}
        >
          Redo Desktop Change
        </MenuItem>

        <Divider />

        {/* =====================================================
            NEW
        ===================================================== */}

        <div
          className="relative"
          onMouseEnter={() =>
            setActiveSubMenu("new")
          }
        >
          <MenuItem
            icon={
              <Plus className="h-4 w-4" />
            }
            hasSubmenu
          >
            New
          </MenuItem>

          {activeSubMenu ===
            "new" && (
            <SubMenuContainer width={235}>
              <div className="px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                Create
              </div>

              <MenuItem
                icon={
                  <Folder className="h-4 w-4" />
                }
                onClick={() => {
                  void createDesktopItem(
                    "folder"
                  );
                  closeMenu();
                }}
              >
                New folder
              </MenuItem>

              <MenuItem
                icon={
                  <FileText className="h-4 w-4" />
                }
                onClick={() => {
                  void createDesktopItem(
                    "text"
                  );
                  closeMenu();
                }}
              >
                Text document
              </MenuItem>
            </SubMenuContainer>
          )}
        </div>

        <Divider />

        {/* =====================================================
            DISPLAY SETTINGS
        ===================================================== */}

        <MenuItem
          icon={
            <Monitor className="h-4 w-4" />
          }
          onClick={() => {
            openApp("settings");
            closeMenu();
          }}
        >
          Display settings
        </MenuItem>

        {/* =====================================================
            PERSONALIZE
        ===================================================== */}

        <MenuItem
          icon={
            <Paintbrush className="h-4 w-4" />
          }
          onClick={() => {
            openApp("settings");
            closeMenu();
          }}
        >
          Personalize
        </MenuItem>

        <Divider />

        {/* =====================================================
            TERMINAL
        ===================================================== */}

        <MenuItem
          icon={
            <Terminal className="h-4 w-4 text-emerald-400" />
          }
          onClick={() => {
            openApp("terminal");
            closeMenu();
          }}
        >
          Open in Terminal
        </MenuItem>

        {/* =====================================================
            CODE
        ===================================================== */}

        <MenuItem
          icon={
            <Code2 className="h-4 w-4 text-blue-400" />
          }
          onClick={() => {
            openApp("code-editor");
            closeMenu();
          }}
        >
          Open with Code
        </MenuItem>

        <Divider />

        {/* =====================================================
            FILE EXPLORER
        ===================================================== */}

        <MenuItem
          icon={
            <FolderOpen className="h-4 w-4" />
          }
          onClick={() => {
            openApp("this-pc");
            closeMenu();
          }}
        >
          Open File Explorer
        </MenuItem>

        {/* =====================================================
            PROJECTS
        ===================================================== */}

        <MenuItem
          icon={
            <FolderKanban className="h-4 w-4" />
          }
          onClick={() => {
            openApp("projects");
            closeMenu();
          }}
        >
          Browse Projects
        </MenuItem>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div
          className="
            mt-1
            flex h-7
            items-center
            gap-1.5
            px-2.5
            text-[9px]
            text-slate-600
          "
        >
          <Settings2 className="h-3 w-3" />

          <span>
            Abhishek OS Desktop
          </span>

          <span className="ml-auto">
            v1.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContextMenu;