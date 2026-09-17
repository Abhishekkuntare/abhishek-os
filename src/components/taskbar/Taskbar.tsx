// // import React, { useRef, useState, useEffect } from 'react';

// // import { useOS } from '../../context/OSContext';
// // import { AppId, TaskbarApp } from '../../types';
// // import { AppIcon } from '../ui/AppIcon';

// // import {
// //   Search,
// //   Wifi,
// //   Volume2,
// //   Battery,
// //   Bell,
// //   CloudSun,
// //   Sun,
// //   Moon,
// //   VolumeX,
// //   Sparkles,
// //   LayoutDashboard,
// //   Plus,
// //   Trash2,
// //   House,
// //   Keyboard,
// //   Maximize2,
// //   Minimize2,
// // } from 'lucide-react';
// // import VirtualKeyboard from './VirtualKeyboard';

// // export const Taskbar: React.FC = () => {
// //   const {
// //     windows,
// //     activeWindowId,
// //     openApp,
// //     minimizeWindow,
// //     focusWindow,
// //     isStartMenuOpen,
// //     setStartMenuOpen,
// //     isSearchOpen,
// //     setSearchOpen,
// //     isNotificationCenterOpen,
// //     setNotificationCenterOpen,
// //     notifications,
// //     settings,
// //     updateSettings,
// //     playSystemSound,
// //     desktops,
// //     activeDesktopId,
// //     switchDesktop,
// //     createDesktop,
// //     deleteDesktop,
// //     moveWindowToDesktop,
// //     isDesktopOverviewOpen,
// //     setDesktopOverviewOpen,
// //     taskbarApps,
// //     reorderTaskbarApps,
// //     openContextMenu,
// //     goHome,
// //   } = useOS();

// //   const [timeStr, setTimeStr] = useState('');
// //   const [dateStr, setDateStr] = useState('');
// //   const [showVolumePopup, setShowVolumePopup] = useState(false);
// //   const [draggedAppId, setDraggedAppId] = useState<AppId | null>(null);
// //   const [showKeyboard, setShowKeyboard] = useState(false);
// //   const [isFullscreen, setIsFullscreen] = useState(false);

// //   const focusedEditable = useRef<HTMLElement | null>(null);

// //   useEffect(() => {
// //     const syncFullscreenState = () => {
// //       setIsFullscreen(Boolean(document.fullscreenElement));
// //     };

// //     document.addEventListener('fullscreenchange', syncFullscreenState);
// //     syncFullscreenState();

// //     return () => {
// //       document.removeEventListener('fullscreenchange', syncFullscreenState);
// //     };
// //   }, []);

// //   const toggleFullscreen = async () => {
// //     try {
// //       if (document.fullscreenElement) {
// //         await document.exitFullscreen();
// //         return;
// //       }

// //       const desktopRoot = document.getElementById('abhishek-workstation-os');

// //       if (!desktopRoot) {
// //         throw new Error('Desktop root is unavailable');
// //       }

// //       await desktopRoot.requestFullscreen();
// //     } catch (error) {
// //       console.error('Unable to toggle desktop fullscreen:', error);
// //     }
// //   };

// //   const pressVirtualKey = (key: string) => {
// //     const active = document.activeElement as HTMLElement | null;

// //     if (
// //       active?.tagName === 'INPUT' ||
// //       active?.tagName === 'TEXTAREA' ||
// //       active?.isContentEditable
// //     ) {
// //       focusedEditable.current = active;
// //     }

// //     const target = focusedEditable.current;

// //     if (
// //       !target ||
// //       !target.isConnected ||
// //       !(
// //         target.tagName === 'INPUT' ||
// //         target.tagName === 'TEXTAREA' ||
// //         target.isContentEditable
// //       )
// //     ) {
// //       return;
// //     }

// //     target.focus();

// //     if (
// //       target instanceof HTMLInputElement ||
// //       target instanceof HTMLTextAreaElement
// //     ) {
// //       if (key === 'Enter') {
// //         target.dispatchEvent(
// //           new KeyboardEvent('keydown', {
// //             key,
// //             bubbles: true,
// //             cancelable: true,
// //           }),
// //         );

// //         target.dispatchEvent(
// //           new KeyboardEvent('keyup', {
// //             key,
// //             bubbles: true,
// //           }),
// //         );

// //         return;
// //       }

// //       const value = target.value;
// //       let start = target.selectionStart ?? value.length;
// //       const end = target.selectionEnd ?? start;

// //       if (key === 'Backspace' && start === end && start > 0) {
// //         start -= 1;
// //       }

// //       const inserted = key === 'Backspace' ? '' : key;
// //       const nextValue =
// //         value.slice(0, start) + inserted + value.slice(end);

// //       const descriptor = Object.getOwnPropertyDescriptor(
// //         Object.getPrototypeOf(target),
// //         'value',
// //       );

// //       descriptor?.set?.call(target, nextValue);

// //       const caret = start + inserted.length;

// //       target.setSelectionRange(caret, caret);

// //       target.dispatchEvent(
// //         new InputEvent('input', {
// //           bubbles: true,
// //           inputType:
// //             key === 'Backspace'
// //               ? 'deleteContentBackward'
// //               : 'insertText',
// //           data: inserted || null,
// //         }),
// //       );
// //     } else {
// //       const selection = window.getSelection();

// //       if (!selection) return;

// //       const range = selection.rangeCount
// //         ? selection.getRangeAt(0)
// //         : document.createRange();

// //       if (!target.contains(range.commonAncestorContainer)) {
// //         range.selectNodeContents(target);
// //         range.collapse(false);
// //       }

// //       if (key === 'Backspace' && range.collapsed) {
// //         const container = range.startContainer;

// //         if (range.startOffset > 0) {
// //           range.setStart(container, range.startOffset - 1);
// //         }
// //       }

// //       range.deleteContents();

// //       if (key !== 'Backspace') {
// //         const text = document.createTextNode(
// //           key === 'Enter' ? '\n' : key,
// //         );

// //         range.insertNode(text);
// //         range.setStartAfter(text);
// //       }

// //       range.collapse(true);

// //       selection.removeAllRanges();
// //       selection.addRange(range);

// //       target.dispatchEvent(
// //         new InputEvent('input', {
// //           bubbles: true,
// //           inputType:
// //             key === 'Backspace'
// //               ? 'deleteContentBackward'
// //               : 'insertText',
// //           data: key === 'Backspace' ? null : key,
// //         }),
// //       );
// //     }
// //   };

// //   /* Live visitor clock and date */
// //   useEffect(() => {
// //     const updateTime = () => {
// //       const now = new Date();

// //       setTimeStr(
// //         now.toLocaleTimeString([], {
// //           hour: 'numeric',
// //           minute: '2-digit',
// //           hour12: true,
// //         }),
// //       );

// //       setDateStr(
// //         now.toLocaleDateString([], {
// //           month: 'numeric',
// //           day: 'numeric',
// //           year: 'numeric',
// //         }),
// //       );
// //     };

// //     updateTime();

// //     const interval = setInterval(updateTime, 1000);

// //     return () => clearInterval(interval);
// //   }, []);

// //   const unreadCount = notifications.filter((n) => !n.read).length;

// //   const handleAppClick = (appId: AppId) => {
// //     const existing = windows.find(
// //       (w) =>
// //         w.appId === appId &&
// //         w.desktopId === activeDesktopId,
// //     );

// //     if (!existing) {
// //       openApp(appId);
// //       return;
// //     }

// //     if (
// //       activeWindowId === existing.id &&
// //       !existing.isMinimized
// //     ) {
// //       minimizeWindow(existing.id);
// //     } else {
// //       focusWindow(existing.id);
// //     }
// //   };

// //   const isAppRunning = (appId: AppId) =>
// //     windows.some(
// //       (w) =>
// //         w.appId === appId &&
// //         w.desktopId === activeDesktopId,
// //     );

// //   const isAppFocused = (appId: AppId) =>
// //     windows.some(
// //       (w) =>
// //         w.appId === appId &&
// //         w.id === activeWindowId &&
// //         !w.isMinimized,
// //     );

// //   const visibleApps: TaskbarApp[] = [
// //     ...taskbarApps,
// //     ...windows
// //       .filter(
// //         (window) =>
// //           window.desktopId === activeDesktopId &&
// //           !taskbarApps.some(
// //             (app) => app.appId === window.appId,
// //           ),
// //       )
// //       .map((window) => ({
// //         appId: window.appId,
// //         title: window.title,
// //         icon: window.iconName,
// //       }))
// //       .filter(
// //         (app, index, list) =>
// //           list.findIndex(
// //             (item) => item.appId === app.appId,
// //           ) === index,
// //       ),
// //   ];

// //   return (
// //   <>
// //   <footer
// //       id="windows-taskbar"
// //       className="
// //         fixed
// //         bottom-0
// //         left-0
// //         right-0
// //         z-[9000]
// //         h-12
// //         sm:h-13
// //         acrylic-taskbar
// //         select-none
// //         overflow-visible
// //       "
// //       style={{
// //         borderTop: `1px solid ${settings.accentColor}45`,
// //       }}
// //     >
// //       {/* 
// //         IMPORTANT:
// //         The scroll container is a sibling of every popup.
// //         This prevents popup clipping and avoids nested buttons.
// //       */}
// //       <div
// //         className="
// //           h-full
// //           w-full
// //           overflow-x-auto
// //           overflow-y-visible
// //           overscroll-x-contain
// //           touch-pan-x
// //           [-ms-overflow-style:none]
// //           [scrollbar-width:none]
// //           [&::-webkit-scrollbar]:hidden
// //         "
// //       >
// //         <div
// //           className="
// //             flex
// //             h-full
// //             min-w-max
// //             items-center
// //             justify-between
// //             gap-2
// //             px-2
// //             sm:px-3
// //             lg:gap-3
// //             lg:px-4
// //             lg:min-w-full
// //           "
// //         >
// //           {/* LEFT SIDE */}
// //           <div className="flex shrink-0 items-center gap-1 sm:gap-2">
// //             <button
// //               type="button"
// //               aria-label="Show desktop"
// //               title="Show desktop"
// //               onClick={goHome}
// //               className="
// //                 group
// //                 flex
// //                 h-8
// //                 w-8
// //                 shrink-0
// //                 items-center
// //                 justify-center
// //                 rounded-lg
// //                 text-slate-200
// //                 transition-all
// //                 hover:bg-white/10
// //                 active:scale-90
// //               "
// //             >
// //               <House className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
// //             </button>

// //             <button
// //               type="button"
// //               onClick={() => openApp('widgets')}
// //               className="
// //                 flex
// //                 shrink-0
// //                 items-center
// //                 gap-2
// //                 rounded-md
// //                 px-2
// //                 py-1
// //                 text-xs
// //                 font-medium
// //                 text-slate-200
// //                 transition-colors
// //                 hover:bg-white/10
// //                 sm:px-2.5
// //               "
// //               title="Open Workstation Widgets Board & Weather"
// //             >
// //               <CloudSun className="h-4 w-4 shrink-0 text-amber-400" />

// //               <span className="hidden md:inline text-[11px] font-semibold text-slate-300">
// //                 28°C Mostly Sunny
// //               </span>
// //             </button>

// //             <button
// //               type="button"
// //               onClick={() => openApp('system-info')}
// //               className="
// //                 hidden
// //                 shrink-0
// //                 items-center
// //                 gap-1.5
// //                 rounded-md
// //                 px-2
// //                 py-1
// //                 text-[11px]
// //                 font-medium
// //                 text-slate-400
// //                 transition-colors
// //                 hover:bg-white/10
// //                 lg:flex
// //               "
// //               title="System Information"
// //             >
// //               <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
// //               <span>v2.0</span>
// //             </button>
// //           </div>

// //           {/* CENTER / APPS */}
// //           <div
// //             className="
// //               flex
// //               shrink-0
// //               items-center
// //               gap-1
// //               sm:gap-1.5
// //             "
// //           >
// //             {/* Desktop Overview Button */}
// //             <button
// //               type="button"
// //               aria-label="Desktop overview"
// //               onClick={() => {
// //                 setDesktopOverviewOpen(
// //                   !isDesktopOverviewOpen,
// //                 );
// //               }}
// //               className={`
// //                 relative
// //                 shrink-0
// //                 rounded-lg
// //                 p-2
// //                 transition-all
// //                 ${
// //                   isDesktopOverviewOpen
// //                     ? 'bg-sky-500/25 text-sky-300 ring-1 ring-sky-400/60'
// //                     : 'text-slate-300 hover:bg-white/10'
// //                 }
// //               `}
// //               title="Desktops overview"
// //             >
// //               <LayoutDashboard className="h-4 w-4" />
// //             </button>

// //             {/* Start Button */}
// //             <button
// //               type="button"
// //               id="taskbar-start-btn"
// //               aria-label="Start Menu"
// //               onClick={() => {
// //                 playSystemSound('click');
// //                 setStartMenuOpen(
// //                   (previous) => !previous,
// //                 );
// //                 setSearchOpen(false);
// //                 setNotificationCenterOpen(false);
// //                 setDesktopOverviewOpen(false);
// //               }}
// //               className={`
// //                 relative
// //                 shrink-0
// //                 rounded-lg
// //                 p-2
// //                 transition-all
// //                 duration-150
// //                 group
// //                 ${
// //                   isStartMenuOpen
// //                     ? 'bg-white/20 ring-1 ring-sky-400'
// //                     : 'hover:bg-white/10 active:scale-95'
// //                 }
// //               `}
// //               title="Start"
// //             >
// //               <div className="grid h-4 w-4 grid-cols-2 gap-0.5">
// //                 <div className="h-2 w-2 rounded-[2px] bg-sky-400 transition-colors group-hover:bg-sky-300" />
// //                 <div className="h-2 w-2 rounded-[2px] bg-sky-400 transition-colors group-hover:bg-sky-300" />
// //                 <div className="h-2 w-2 rounded-[2px] bg-sky-400 transition-colors group-hover:bg-sky-300" />
// //                 <div className="h-2 w-2 rounded-[2px] bg-sky-400 transition-colors group-hover:bg-sky-300" />
// //               </div>
// //             </button>

// //             {/* Search */}
// //             <button
// //               type="button"
// //               id="taskbar-search-btn"
// //               aria-label="Search Portfolio"
// //               onClick={() => {
// //                 playSystemSound('click');
// //                 setSearchOpen(
// //                   (previous) => !previous,
// //                 );
// //                 setStartMenuOpen(false);
// //                 setNotificationCenterOpen(false);
// //                 setDesktopOverviewOpen(false);
// //               }}
// //               className={`
// //                 flex
// //                 shrink-0
// //                 items-center
// //                 gap-2
// //                 rounded-lg
// //                 px-2.5
// //                 py-1.5
// //                 transition-colors
// //                 ${
// //                   isSearchOpen
// //                     ? 'bg-white/20 text-sky-300 ring-1 ring-sky-400'
// //                     : 'text-slate-300 hover:bg-white/10 hover:text-white'
// //                 }
// //               `}
// //               title="Search (Ctrl + K)"
// //             >
// //               <Search className="h-4 w-4" />

// //               <span className="hidden text-xs font-normal text-slate-400 md:inline">
// //                 Search...
// //               </span>
// //             </button>

// //             <div className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />

// //             {/* Pinned / Running Apps */}
// //             {visibleApps.map((item) => {
// //               const running = isAppRunning(item.appId);
// //               const focused = isAppFocused(item.appId);

// //               return (
// //                 <button
// //                   key={item.appId}
// //                   type="button"
// //                   id={`taskbar-app-${item.appId}`}
// //                   onClick={() =>
// //                     handleAppClick(item.appId)
// //                   }
// //                   onContextMenu={(event) => {
// //                     event.preventDefault();
// //                     event.stopPropagation();

// //                     openContextMenu(
// //                       event.clientX,
// //                       event.clientY,
// //                       'taskbar',
// //                       item.appId,
// //                     );
// //                   }}
// //                   draggable={taskbarApps.some(
// //                     (app) => app.appId === item.appId,
// //                   )}
// //                   onDragStart={() =>
// //                     setDraggedAppId(item.appId)
// //                   }
// //                   onDragOver={(event) =>
// //                     event.preventDefault()
// //                   }
// //                   onDrop={() => {
// //                     if (draggedAppId) {
// //                       reorderTaskbarApps(
// //                         draggedAppId,
// //                         item.appId,
// //                       );
// //                     }

// //                     setDraggedAppId(null);
// //                   }}
// //                   onDragEnd={() =>
// //                     setDraggedAppId(null)
// //                   }
// //                   className={`
// //                     relative
// //                     shrink-0
// //                     rounded-lg
// //                     p-2
// //                     transition-all
// //                     duration-150
// //                     group
// //                     ${
// //                       focused
// //                         ? 'bg-white/20 shadow-inner'
// //                         : running
// //                           ? 'bg-white/10 hover:bg-white/15'
// //                           : 'hover:bg-white/10'
// //                     }
// //                   `}
// //                   title={`${item.title}${
// //                     taskbarApps.some(
// //                       (app) =>
// //                         app.appId === item.appId,
// //                     )
// //                       ? ' — right-click for options'
// //                       : ''
// //                   }`}
// //                 >
// //                   <div className="flex h-5 w-5 items-center justify-center">
// //                     <AppIcon
// //                       name={item.icon}
// //                       className="h-4.5 w-4.5 text-slate-200 transition-transform group-hover:scale-110 group-hover:text-white"
// //                     />
// //                   </div>

// //                   {running && (
// //                     <span
// //                       className={`
// //                         absolute
// //                         bottom-0.5
// //                         left-1/2
// //                         -translate-x-1/2
// //                         rounded-full
// //                         transition-all
// //                         ${
// //                           focused
// //                             ? 'h-0.75 w-4 bg-sky-400'
// //                             : 'h-0.75 w-1.5 bg-slate-400 group-hover:w-3 group-hover:bg-slate-200'
// //                         }
// //                       `}
// //                     />
// //                   )}
// //                 </button>
// //               );
// //             })}
// //           </div>

// //           {/* RIGHT SIDE */}
// //           <div className="flex shrink-0 items-center gap-1">
// //             {/* Virtual Keyboard */}
// //             <button
// //               type="button"
// //               aria-label="Virtual keyboard"
// //               title="Virtual keyboard"
// //               onMouseDown={(event) =>
// //                 event.preventDefault()
// //               }
// //               onClick={() =>
// //                 setShowKeyboard(
// //                   (previous) => !previous,
// //                 )
// //               }
// //               className={`
// //                 rounded-lg
// //                 p-1.5
// //                 transition-colors
// //                 ${
// //                   showKeyboard
// //                     ? 'bg-sky-500/25 text-sky-300'
// //                     : 'text-slate-300 hover:bg-white/10'
// //                 }
// //               `}
// //             >
// //               <Keyboard className="h-4 w-4" />
// //             </button>

// //             {/* Fullscreen */}
// //             <button
// //               type="button"
// //               aria-label={
// //                 isFullscreen
// //                   ? 'Exit fullscreen'
// //                   : 'Enter fullscreen'
// //               }
// //               title={
// //                 isFullscreen
// //                   ? 'Exit fullscreen'
// //                   : 'Full screen desktop'
// //               }
// //               onClick={() =>
// //                 void toggleFullscreen()
// //               }
// //               className="
// //                 rounded-lg
// //                 p-1.5
// //                 text-slate-300
// //                 transition-colors
// //                 hover:bg-white/10
// //                 hover:text-cyan-300
// //               "
// //             >
// //               {isFullscreen ? (
// //                 <Minimize2 className="h-4 w-4" />
// //               ) : (
// //                 <Maximize2 className="h-4 w-4" />
// //               )}
// //             </button>

// //             {/* Quick Settings */}
// //             <button
// //               type="button"
// //               aria-label="Quick settings"
// //               className="
// //                 flex
// //                 shrink-0
// //                 cursor-pointer
// //                 items-center
// //                 gap-1.5
// //                 rounded-md
// //                 px-2
// //                 py-1
// //                 text-slate-300
// //                 transition-colors
// //                 hover:bg-white/10
// //               "
// //               onClick={() =>
// //                 setShowVolumePopup(
// //                   (previous) => !previous,
// //                 )
// //               }
// //               title="Status: Online, Battery 98%, Audio Active"
// //             >
// //               <Wifi className="h-3.5 w-3.5 text-emerald-400" />
// //               <Volume2 className="h-3.5 w-3.5" />
// //               <Battery className="h-3.5 w-3.5 text-sky-400" />
// //             </button>

// //             {/* Clock */}
// //             <button
// //               type="button"
// //               id="taskbar-clock-btn"
// //               aria-label="Open Calendar and Notifications"
// //               onClick={() => {
// //                 playSystemSound('click');

// //                 setNotificationCenterOpen(
// //                   (previous) => !previous,
// //                 );

// //                 setStartMenuOpen(false);
// //                 setSearchOpen(false);
// //               }}
// //               className={`
// //                 flex
// //                 shrink-0
// //                 flex-col
// //                 items-end
// //                 rounded-md
// //                 px-2
// //                 py-0.5
// //                 text-right
// //                 transition-colors
// //                 ${
// //                   isNotificationCenterOpen
// //                     ? 'bg-white/20 text-sky-300'
// //                     : 'text-slate-300 hover:bg-white/10 hover:text-white'
// //                 }
// //               `}
// //               title="Notification Center & Calendar"
// //             >
// //               <span className="text-xs font-semibold leading-tight">
// //                 {timeStr || '12:00 PM'}
// //               </span>

// //               <span className="text-[10px] leading-tight text-slate-400">
// //                 {dateStr || '9/13/2026'}
// //               </span>
// //             </button>

// //             {/* Notification Bell */}
// //             <button
// //               type="button"
// //               id="taskbar-notif-btn"
// //               aria-label="Notifications"
// //               onClick={() => {
// //                 playSystemSound('click');

// //                 setNotificationCenterOpen(
// //                   (previous) => !previous,
// //                 );

// //                 setStartMenuOpen(false);
// //                 setSearchOpen(false);
// //               }}
// //               className={`
// //                 relative
// //                 shrink-0
// //                 rounded-md
// //                 p-1.5
// //                 transition-colors
// //                 ${
// //                   isNotificationCenterOpen
// //                     ? 'bg-white/20 text-sky-300'
// //                     : 'text-slate-300 hover:bg-white/10 hover:text-white'
// //                 }
// //               `}
// //               title="Notifications"
// //             >
// //               <Bell className="h-4 w-4" />

// //               {unreadCount > 0 && (
// //                 <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-sky-500 ring-1 ring-slate-900" />
// //               )}
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* 
// //         DESKTOP OVERVIEW POPUP
// //         IMPORTANT: This is OUTSIDE the Start <button>.
// //         This fixes:
// //         "<button> cannot be a descendant of <button>"
// //       */}
// //       {isDesktopOverviewOpen && (
// //         <div
// //           className="
// //             desktop-overview
// //             fixed
// //             bottom-14
// //             left-1/2
// //             z-[9998]
// //             w-[min(760px,calc(100vw-24px))]
// //             -translate-x-1/2
// //             rounded-2xl
// //             border
// //             border-white/15
// //             bg-slate-950/90
// //             p-4
// //             shadow-2xl
// //             backdrop-blur-2xl
// //           "
// //         >
// //           <div className="mb-3 flex items-center justify-between gap-3">
// //             <div className="min-w-0">
// //               <p className="text-sm font-semibold text-white">
// //                 Your desktops
// //               </p>

// //               <p className="text-[11px] text-slate-400">
// //                 Switch workspace without losing your place
// //               </p>
// //             </div>

// //             <button
// //               type="button"
// //               onClick={createDesktop}
// //               className="
// //                 flex
// //                 shrink-0
// //                 items-center
// //                 gap-1
// //                 rounded-lg
// //                 bg-sky-500
// //                 px-2.5
// //                 py-1.5
// //                 text-xs
// //                 font-semibold
// //                 text-slate-950
// //                 transition-colors
// //                 hover:bg-sky-400
// //                 active:scale-95
// //               "
// //             >
// //               <Plus className="h-3.5 w-3.5" />
// //               <span>New desktop</span>
// //             </button>
// //           </div>

// //           <div className="grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
// //             {desktops.map((desktop) => {
// //               const desktopWindows = windows.filter(
// //                 (win) =>
// //                   win.desktopId === desktop.id,
// //               );

// //               return (
// //                 <div
// //                   key={desktop.id}
// //                   onDragOver={(event) =>
// //                     event.preventDefault()
// //                   }
// //                   onDrop={(event) => {
// //                     event.preventDefault();

// //                     const windowId =
// //                       event.dataTransfer.getData(
// //                         'text/window-id',
// //                       );

// //                     if (windowId) {
// //                       moveWindowToDesktop(
// //                         windowId,
// //                         desktop.id,
// //                       );
// //                     }
// //                   }}
// //                   className={`
// //                     group
// //                     relative
// //                     rounded-xl
// //                     border
// //                     p-2
// //                     transition-all
// //                     ${
// //                       desktop.id === activeDesktopId
// //                         ? 'border-sky-400/70 bg-sky-400/10'
// //                         : 'border-white/10 bg-white/[0.04] hover:border-white/25'
// //                     }
// //                   `}
// //                 >
// //                   <button
// //                     type="button"
// //                     onClick={() =>
// //                       switchDesktop(desktop.id)
// //                     }
// //                     className="block w-full text-left"
// //                   >
// //                     <div
// //                       className={`
// //                         relative
// //                         h-20
// //                         overflow-hidden
// //                         rounded-lg
// //                         bg-gradient-to-br
// //                         ${desktop.accent}
// //                         p-2
// //                       `}
// //                     >
// //                       <div className="absolute inset-0 bg-slate-950/45" />

// //                       <div className="relative grid grid-cols-3 gap-1">
// //                         {desktopWindows
// //                           .slice(0, 3)
// //                           .map((win) => (
// //                             <div
// //                               key={win.id}
// //                               draggable
// //                               onDragStart={(event) => {
// //                                 event.stopPropagation();

// //                                 event.dataTransfer.setData(
// //                                   'text/window-id',
// //                                   win.id,
// //                                 );
// //                               }}
// //                               title={`Drag ${win.title} to another desktop`}
// //                               className="
// //                                 h-12
// //                                 cursor-grab
// //                                 rounded
// //                                 bg-slate-900/80
// //                                 shadow-lg
// //                                 active:cursor-grabbing
// //                               "
// //                             />
// //                           ))}

// //                         {desktopWindows.length === 0 && (
// //                           <span className="col-span-3 self-center pt-3 text-center text-[10px] text-white/70">
// //                             Empty workspace
// //                           </span>
// //                         )}
// //                       </div>
// //                     </div>

// //                     <div className="flex items-center justify-between px-1 pt-2">
// //                       <span className="text-xs font-semibold text-slate-100">
// //                         {desktop.name}
// //                       </span>

// //                       <span className="text-[10px] text-slate-400">
// //                         {desktopWindows.length}{' '}
// //                         {desktopWindows.length === 1
// //                           ? 'window'
// //                           : 'windows'}
// //                       </span>
// //                     </div>

// //                     {desktopWindows.length > 0 && (
// //                       <div className="mt-2 flex flex-wrap gap-1 px-1">
// //                         {desktopWindows.map((win) => (
// //                           <span
// //                             key={win.id}
// //                             className="
// //                               max-w-full
// //                               truncate
// //                               rounded
// //                               bg-white/10
// //                               px-1.5
// //                               py-0.5
// //                               text-[9px]
// //                               text-slate-300
// //                             "
// //                             title={win.title}
// //                           >
// //                             {win.title}
// //                           </span>
// //                         ))}
// //                       </div>
// //                     )}
// //                   </button>

// //                   {desktops.length > 1 && (
// //                     <button
// //                       type="button"
// //                       aria-label={`Delete ${desktop.name}`}
// //                       onClick={() =>
// //                         deleteDesktop(desktop.id)
// //                       }
// //                       className="
// //                         absolute
// //                         right-2
// //                         top-2
// //                         rounded
// //                         p-1
// //                         text-slate-400
// //                         opacity-0
// //                         transition-opacity
// //                         hover:bg-red-500/20
// //                         hover:text-red-300
// //                         group-hover:opacity-100
// //                       "
// //                     >
// //                       <Trash2 className="h-3.5 w-3.5" />
// //                     </button>
// //                   )}
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       )}

// //       {/* QUICK SETTINGS POPUP */}
// //       {showVolumePopup && (
// //         <div
// //           className="
// //             fixed
// //             bottom-14
// //             right-3
// //             z-[9999]
// //             w-[min(320px,calc(100vw-24px))]
// //             rounded-2xl
// //             border
// //             border-white/10
// //             bg-slate-900/95
// //             p-4
// //             text-xs
// //             shadow-2xl
// //             backdrop-blur-2xl
// //           "
// //         >
// //           <div className="grid grid-cols-3 gap-2">
// //             <button
// //               type="button"
// //               disabled
// //               className="
// //                 flex
// //                 flex-col
// //                 items-center
// //                 justify-center
// //                 gap-1
// //                 rounded-xl
// //                 bg-sky-500
// //                 p-2.5
// //                 font-bold
// //                 text-slate-950
// //                 shadow-sm
// //               "
// //             >
// //               <Moon className="h-4 w-4" />
// //               <span className="text-[10px]">
// //                 Dark Mode
// //               </span>
// //             </button>

// //             <button
// //               type="button"
// //               onClick={() =>
// //                 updateSettings({
// //                   soundEffects:
// //                     !settings.soundEffects,
// //                 })
// //               }
// //               className={`
// //                 flex
// //                 flex-col
// //                 items-center
// //                 justify-center
// //                 gap-1
// //                 rounded-xl
// //                 p-2.5
// //                 transition-all
// //                 ${
// //                   settings.soundEffects
// //                     ? 'bg-sky-500 font-bold text-slate-950 shadow-sm'
// //                     : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
// //                 }
// //               `}
// //             >
// //               {settings.soundEffects ? (
// //                 <Volume2 className="h-4 w-4" />
// //               ) : (
// //                 <VolumeX className="h-4 w-4" />
// //               )}

// //               <span className="text-[10px]">
// //                 Sound FX
// //               </span>
// //             </button>

// //             <button
// //               type="button"
// //               onClick={() =>
// //                 updateSettings({
// //                   focusMode: !settings.focusMode,
// //                 })
// //               }
// //               className={`
// //                 flex
// //                 flex-col
// //                 items-center
// //                 justify-center
// //                 gap-1
// //                 rounded-xl
// //                 p-2.5
// //                 transition-all
// //                 ${
// //                   settings.focusMode
// //                     ? 'bg-sky-500 font-bold text-slate-950 shadow-sm'
// //                     : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
// //                 }
// //               `}
// //             >
// //               <Sparkles className="h-4 w-4" />

// //               <span className="text-[10px]">
// //                 Focus Mode
// //               </span>
// //             </button>
// //           </div>

// //           <div className="space-y-3 border-t border-white/10 pt-3">
// //             <div>
// //               <div className="mb-1.5 flex items-center justify-between">
// //                 <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
// //                   <Volume2 className="h-3.5 w-3.5 text-sky-400" />
// //                   <span>Master Volume</span>
// //                 </span>

// //                 <span className="font-mono text-[11px] text-slate-400">
// //                   {settings.volume}%
// //                 </span>
// //               </div>

// //               <input
// //                 type="range"
// //                 min="0"
// //                 max="100"
// //                 value={settings.volume}
// //                 onChange={(event) =>
// //                   updateSettings({
// //                     volume: Number(
// //                       event.target.value,
// //                     ),
// //                   })
// //                 }
// //                 className="
// //                   h-1.5
// //                   w-full
// //                   cursor-pointer
// //                   appearance-none
// //                   rounded-lg
// //                   bg-slate-700
// //                   accent-sky-400
// //                 "
// //               />
// //             </div>

// //             <div>
// //               <div className="mb-1.5 flex items-center justify-between">
// //                 <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
// //                   <Sun className="h-3.5 w-3.5 text-amber-400" />
// //                   <span>Screen Brightness</span>
// //                 </span>

// //                 <span className="font-mono text-[11px] text-slate-400">
// //                   {settings.brightness}%
// //                 </span>
// //               </div>

// //               <input
// //                 type="range"
// //                 min="30"
// //                 max="100"
// //                 value={settings.brightness}
// //                 onChange={(event) =>
// //                   updateSettings({
// //                     brightness: Number(
// //                       event.target.value,
// //                     ),
// //                   })
// //                 }
// //                 className="
// //                   h-1.5
// //                   w-full
// //                   cursor-pointer
// //                   appearance-none
// //                   rounded-lg
// //                   bg-slate-700
// //                   accent-amber-400
// //                 "
// //               />
// //             </div>
// //           </div>

// //           <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
// //             <span className="text-[10px] text-slate-500">
// //               Battery: 98% (Plugged in)
// //             </span>

// //             <button
// //               type="button"
// //               onClick={() => {
// //                 setShowVolumePopup(false);
// //                 openApp('settings');
// //               }}
// //               className="
// //                 text-[11px]
// //                 font-semibold
// //                 text-sky-400
// //                 transition-colors
// //                 hover:text-sky-300
// //               "
// //             >
// //               All Settings →
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* VIRTUAL KEYBOARD */}
// //       {/* {showKeyboard && (
     
// //    <VirtualKeyboard
// //   isOpen={showKeyboard}
// //   onClose={() => setShowKeyboard(false)}
// //   onKeyPress={pressVirtualKey}
// // />
// //       )} */}
// //     </footer>
// //  <VirtualKeyboard
// //   isOpen={showKeyboard}
// //   onClose={() => setShowKeyboard(false)}
// //   onKeyPress={pressVirtualKey}
// // />
// //  </>

// //   );
// // };




// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from 'react';

// import { useOS } from '../../context/OSContext';
// import { AppId, TaskbarApp } from '../../types';
// import { AppIcon } from '../ui/AppIcon';

// import {
//   Accessibility,
//   Airplay,
//   Battery,
//   Bell,
//   Bluetooth,
//   Captions,
//   Cast,
//   Check,
//   ChevronDown,
//   ChevronRight,
//   CloudSun,
//   House,
//   Keyboard,
//   LayoutDashboard,
//   Maximize2,
//   Minimize2,
//   Moon,
//   MonitorUp,
//   Plus,
//   Search,
//   Share2,
//   Sparkles,
//   Sun,
//   Trash2,
//   Volume2,
//   VolumeX,
//   Wifi,
//   X,
//   Zap,
// } from 'lucide-react';

// import VirtualKeyboard from './VirtualKeyboard';

// /* =========================================================
//    TYPES
// ========================================================= */

// type QuickSettingId =
//   | 'wifi'
//   | 'bluetooth'
//   | 'airplane'
//   | 'accessibility'
//   | 'energy'
//   | 'captions'
//   | 'nightLight'
//   | 'hotspot'
//   | 'sharing'
//   | 'cast'
//   | 'project';

// type QuickPanel =
//   | 'none'
//   | QuickSettingId;

// type ProjectMode =
//   | 'pc'
//   | 'duplicate'
//   | 'extend'
//   | 'second';

// interface QuickSettingTileProps {
//   id: QuickSettingId;
//   label: string;
//   icon: React.ElementType;
//   active: boolean;
//   subtitle?: string;
//   disabled?: boolean;
//   onClick: () => void;
// }

// interface SpeechRecognitionLike {
//   continuous: boolean;
//   interimResults: boolean;
//   lang: string;
//   onresult:
//     | ((event: any) => void)
//     | null;
//   onend:
//     | (() => void)
//     | null;
//   onerror:
//     | (() => void)
//     | null;
//   start: () => void;
//   stop: () => void;
// }

// declare global {
//   interface Window {
//     SpeechRecognition?: new () => SpeechRecognitionLike;
//     webkitSpeechRecognition?: new () => SpeechRecognitionLike;
//   }
// }

// /* =========================================================
//    PERSISTENT STATE
// ========================================================= */

// function usePersistentState<T>(
//   key: string,
//   initialValue: T,
// ): [
//   T,
//   React.Dispatch<React.SetStateAction<T>>,
// ] {
//   const [value, setValue] =
//     useState<T>(() => {
//       try {
//         const stored =
//           window.localStorage.getItem(key);

//         if (stored !== null) {
//           return JSON.parse(stored) as T;
//         }
//       } catch {
//         // Ignore storage failures.
//       }

//       return initialValue;
//     });

//   useEffect(() => {
//     try {
//       window.localStorage.setItem(
//         key,
//         JSON.stringify(value),
//       );
//     } catch {
//       // Ignore storage failures.
//     }
//   }, [key, value]);

//   return [value, setValue];
// }

// /* =========================================================
//    QUICK SETTING TILE
// ========================================================= */

// const QuickSettingTile: React.FC<
//   QuickSettingTileProps
// > = ({
//   id,
//   label,
//   icon: Icon,
//   active,
//   subtitle,
//   disabled = false,
//   onClick,
// }) => {
//   return (
//     <button
//       type="button"
//       data-quick-setting={id}
//       disabled={disabled}
//       onClick={onClick}
//       aria-pressed={active}
//       className={`
//         group
//         relative
//         min-h-[74px]
//         overflow-hidden
//         rounded-xl
//         border
//         px-2.5
//         py-2
//         text-left
//         transition-all
//         duration-200
//         ease-out
//         active:scale-[0.97]
//         focus:outline-none
//         focus-visible:ring-2
//         focus-visible:ring-sky-400/80
//         ${
//           active
//             ? 'border-sky-300/60 bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
//             : 'border-white/[0.09] bg-white/[0.055] text-slate-200 hover:border-white/[0.16] hover:bg-white/[0.09]'
//         }
//         ${
//           disabled
//             ? 'cursor-not-allowed opacity-45'
//             : 'cursor-pointer'
//         }
//       `}
//     >
//       <span
//         className={`
//           absolute
//           inset-x-0
//           top-0
//           h-px
//           transition-opacity
//           duration-300
//           ${
//             active
//               ? 'bg-white/80 opacity-100'
//               : 'bg-white/20 opacity-0 group-hover:opacity-100'
//           }
//         `}
//       />

//       <span className="flex items-start justify-between gap-2">
//         <span
//           className={`
//             flex
//             h-8
//             w-8
//             shrink-0
//             items-center
//             justify-center
//             rounded-lg
//             transition-all
//             duration-200
//             ${
//               active
//                 ? 'bg-white/20'
//                 : 'bg-slate-950/20 group-hover:bg-white/[0.08]'
//             }
//           `}
//         >
//           <Icon
//             className={`
//               h-4
//               w-4
//               transition-transform
//               duration-200
//               group-hover:scale-110
//               ${
//                 active
//                   ? 'text-slate-950'
//                   : 'text-slate-200'
//               }
//             `}
//           />
//         </span>

//         {active && (
//           <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-950/15">
//             <Check className="h-2.5 w-2.5" />
//           </span>
//         )}
//       </span>

//       <span
//         className={`
//           mt-1.5
//           block
//           truncate
//           text-[10px]
//           font-semibold
//           leading-tight
//           ${
//             active
//               ? 'text-slate-950'
//               : 'text-slate-200'
//           }
//         `}
//       >
//         {label}
//       </span>

//       {subtitle && (
//         <span
//           className={`
//             mt-0.5
//             block
//             truncate
//             text-[8px]
//             ${
//               active
//                 ? 'text-slate-950/65'
//                 : 'text-slate-500'
//             }
//           `}
//         >
//           {subtitle}
//         </span>
//       )}
//     </button>
//   );
// };

// /* =========================================================
//    SMALL OPTION BUTTON
// ========================================================= */

// interface OptionButtonProps {
//   active?: boolean;
//   children: React.ReactNode;
//   onClick: () => void;
// }

// const OptionButton: React.FC<
//   OptionButtonProps
// > = ({
//   active = false,
//   children,
//   onClick,
// }) => {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`
//         flex
//         w-full
//         items-center
//         justify-between
//         rounded-xl
//         border
//         px-3
//         py-2.5
//         text-left
//         transition-all
//         duration-200
//         active:scale-[0.98]
//         ${
//           active
//             ? 'border-sky-400/40 bg-sky-500/15 text-sky-300'
//             : 'border-white/[0.07] bg-white/[0.035] text-slate-300 hover:bg-white/[0.07]'
//         }
//       `}
//     >
//       <span className="text-[10px] font-semibold">
//         {children}
//       </span>

//       {active && (
//         <Check className="h-3.5 w-3.5 text-sky-400" />
//       )}
//     </button>
//   );
// };

// /* =========================================================
//    TASKBAR
// ========================================================= */

// export const Taskbar: React.FC = () => {
//   const {
//     windows,
//     activeWindowId,
//     openApp,
//     minimizeWindow,
//     focusWindow,

//     isStartMenuOpen,
//     setStartMenuOpen,

//     isSearchOpen,
//     setSearchOpen,

//     isNotificationCenterOpen,
//     setNotificationCenterOpen,

//     notifications,

//     settings,
//     updateSettings,
//     playSystemSound,

//     desktops,
//     activeDesktopId,
//     switchDesktop,
//     createDesktop,
//     deleteDesktop,
//     moveWindowToDesktop,

//     isDesktopOverviewOpen,
//     setDesktopOverviewOpen,

//     taskbarApps,
//     reorderTaskbarApps,

//     openContextMenu,
//     goHome,
//   } = useOS();

//   /* =======================================================
//      CLOCK
//   ======================================================= */

//   const [timeStr, setTimeStr] =
//     useState('');

//   const [dateStr, setDateStr] =
//     useState('');

//   /* =======================================================
//      POPUPS
//   ======================================================= */

//   const [
//     showVolumePopup,
//     setShowVolumePopup,
//   ] = useState(false);

//   const [
//     draggedAppId,
//     setDraggedAppId,
//   ] = useState<AppId | null>(null);

//   const [
//     showKeyboard,
//     setShowKeyboard,
//   ] = useState(false);

//   const [
//     isFullscreen,
//     setIsFullscreen,
//   ] = useState(false);

//   const [
//     quickPanel,
//     setQuickPanel,
//   ] = useState<QuickPanel>('none');

//   /* =======================================================
//      QUICK SETTINGS
//   ======================================================= */

//   const [
//     wifiEnabled,
//     setWifiEnabled,
//   ] = usePersistentState(
//     'abhishek-os-wifi',
//     true,
//   );

//   const [
//     bluetoothEnabled,
//     setBluetoothEnabled,
//   ] = usePersistentState(
//     'abhishek-os-bluetooth',
//     false,
//   );

//   const [
//     airplaneMode,
//     setAirplaneMode,
//   ] = usePersistentState(
//     'abhishek-os-airplane',
//     false,
//   );

//   const [
//     accessibilityEnabled,
//     setAccessibilityEnabled,
//   ] = usePersistentState(
//     'abhishek-os-accessibility',
//     false,
//   );

//   const [
//     largeText,
//     setLargeText,
//   ] = usePersistentState(
//     'abhishek-os-large-text',
//     false,
//   );

//   const [
//     highContrast,
//     setHighContrast,
//   ] = usePersistentState(
//     'abhishek-os-high-contrast',
//     false,
//   );

//   const [
//     reduceMotion,
//     setReduceMotion,
//   ] = usePersistentState(
//     'abhishek-os-reduce-motion',
//     false,
//   );

//   const [
//     energySaver,
//     setEnergySaver,
//   ] = usePersistentState(
//     'abhishek-os-energy-saver',
//     false,
//   );

//   const [
//     liveCaptions,
//     setLiveCaptions,
//   ] = usePersistentState(
//     'abhishek-os-live-captions',
//     false,
//   );

//   const [
//     nightLight,
//     setNightLight,
//   ] = usePersistentState(
//     'abhishek-os-night-light',
//     false,
//   );

//   const [
//     mobileHotspot,
//     setMobileHotspot,
//   ] = usePersistentState(
//     'abhishek-os-hotspot',
//     false,
//   );

//   const [
//     nearbySharing,
//     setNearbySharing,
//   ] = usePersistentState(
//     'abhishek-os-nearby-sharing',
//     false,
//   );

//   const [
//     castEnabled,
//     setCastEnabled,
//   ] = useState(false);

//   const [
//     projectEnabled,
//     setProjectEnabled,
//   ] = usePersistentState(
//     'abhishek-os-project-enabled',
//     false,
//   );

//   const [
//     projectMode,
//     setProjectMode,
//   ] = usePersistentState<ProjectMode>(
//     'abhishek-os-project-mode',
//     'pc',
//   );

//   const [
//     wifiNetwork,
//     setWifiNetwork,
//   ] = usePersistentState(
//     'abhishek-os-wifi-network',
//     'Airtel_Abhishek',
//   );

//   const [
//     bluetoothDevice,
//     setBluetoothDevice,
//   ] = usePersistentState(
//     'abhishek-os-bluetooth-device',
//     '',
//   );

//   const [
//     hotspotName,
//     setHotspotName,
//   ] = usePersistentState(
//     'abhishek-os-hotspot-name',
//     'Abhishek-Hotspot',
//   );

//   const [
//     captionText,
//     setCaptionText,
//   ] = useState('');

//   const [
//     castError,
//     setCastError,
//   ] = useState('');

//   const [
//     sharingMessage,
//     setSharingMessage,
//   ] = useState('');

//   const [
//     locationStatus,
//     setLocationStatus,
//   ] = useState('');

//   const castStreamRef =
//     useRef<MediaStream | null>(null);

//   const captionRecognitionRef =
//     useRef<SpeechRecognitionLike | null>(
//       null,
//     );

//   const focusedEditable =
//     useRef<HTMLElement | null>(null);

//   const castVideoRef =
//     useRef<HTMLVideoElement | null>(null);

//   /* =======================================================
//      FULLSCREEN
//   ======================================================= */

//   useEffect(() => {
//     const syncFullscreenState = () => {
//       setIsFullscreen(
//         Boolean(document.fullscreenElement),
//       );
//     };

//     document.addEventListener(
//       'fullscreenchange',
//       syncFullscreenState,
//     );

//     syncFullscreenState();

//     return () => {
//       document.removeEventListener(
//         'fullscreenchange',
//         syncFullscreenState,
//       );
//     };
//   }, []);

//   const toggleFullscreen =
//     async () => {
//       try {
//         if (document.fullscreenElement) {
//           await document.exitFullscreen();
//           return;
//         }

//         const desktopRoot =
//           document.getElementById(
//             'abhishek-workstation-os',
//           );

//         if (!desktopRoot) {
//           throw new Error(
//             'Desktop root is unavailable',
//           );
//         }

//         await desktopRoot.requestFullscreen();
//       } catch (error) {
//         console.error(
//           'Unable to toggle desktop fullscreen:',
//           error,
//         );
//       }
//     };

//   /* =======================================================
//      LIVE CLOCK
//   ======================================================= */

//   useEffect(() => {
//     const updateTime = () => {
//       const now = new Date();

//       setTimeStr(
//         now.toLocaleTimeString([], {
//           hour: 'numeric',
//           minute: '2-digit',
//           hour12: true,
//         }),
//       );

//       setDateStr(
//         now.toLocaleDateString([], {
//           month: 'numeric',
//           day: 'numeric',
//           year: 'numeric',
//         }),
//       );
//     };

//     updateTime();

//     const interval =
//       window.setInterval(
//         updateTime,
//         1000,
//       );

//     return () =>
//       window.clearInterval(interval);
//   }, []);

//   /* =======================================================
//      SYSTEM VISUAL EFFECTS
//   ======================================================= */

//   useEffect(() => {
//     const root =
//       document.getElementById(
//         'abhishek-workstation-os',
//       );

//     if (!root) {
//       return;
//     }

//     root.classList.toggle(
//       'os-accessibility-mode',
//       accessibilityEnabled,
//     );

//     root.classList.toggle(
//       'os-large-text',
//       largeText,
//     );

//     root.classList.toggle(
//       'os-high-contrast',
//       highContrast,
//     );

//     root.classList.toggle(
//       'os-reduced-motion',
//       reduceMotion,
//     );

//     root.classList.toggle(
//       'os-energy-saver',
//       energySaver,
//     );

//     root.classList.toggle(
//       'os-focus-mode',
//       settings.focusMode,
//     );

//     return () => {
//       root.classList.remove(
//         'os-accessibility-mode',
//         'os-large-text',
//         'os-high-contrast',
//         'os-reduced-motion',
//         'os-energy-saver',
//         'os-focus-mode',
//       );
//     };
//   }, [
//     accessibilityEnabled,
//     largeText,
//     highContrast,
//     reduceMotion,
//     energySaver,
//     settings.focusMode,
//   ]);

//   /* =======================================================
//      NIGHT LIGHT
//   ======================================================= */

//   useEffect(() => {
//     document.documentElement.style.setProperty(
//       '--os-night-light',
//       nightLight ? '1' : '0',
//     );

//     return () => {
//       document.documentElement.style.removeProperty(
//         '--os-night-light',
//       );
//     };
//   }, [nightLight]);

//   /* =======================================================
//      NOTIFICATIONS
//   ======================================================= */

//   const unreadCount =
//     notifications.filter(
//       notification =>
//         !notification.read,
//     ).length;

//   /* =======================================================
//      APP CLICK
//   ======================================================= */

//   const handleAppClick = (
//     appId: AppId,
//   ) => {
//     const existing =
//       windows.find(
//         window =>
//           window.appId === appId &&
//           window.desktopId ===
//             activeDesktopId,
//       );

//     if (!existing) {
//       openApp(appId);
//       return;
//     }

//     if (
//       activeWindowId === existing.id &&
//       !existing.isMinimized
//     ) {
//       minimizeWindow(existing.id);
//     } else {
//       focusWindow(existing.id);
//     }
//   };

//   const isAppRunning = (
//     appId: AppId,
//   ) =>
//     windows.some(
//       window =>
//         window.appId === appId &&
//         window.desktopId ===
//           activeDesktopId,
//     );

//   const isAppFocused = (
//     appId: AppId,
//   ) =>
//     windows.some(
//       window =>
//         window.appId === appId &&
//         window.id === activeWindowId &&
//         !window.isMinimized,
//     );

//   /* =======================================================
//      TASKBAR APPS
//   ======================================================= */

//   const visibleApps: TaskbarApp[] = [
//     ...taskbarApps,

//     ...windows
//       .filter(
//         window =>
//           window.desktopId ===
//             activeDesktopId &&
//           !taskbarApps.some(
//             app =>
//               app.appId ===
//               window.appId,
//           ),
//       )
//       .map(window => ({
//         appId: window.appId,
//         title: window.title,
//         icon: window.iconName,
//       }))
//       .filter(
//         (app, index, list) =>
//           list.findIndex(
//             item =>
//               item.appId ===
//               app.appId,
//           ) === index,
//       ),
//   ];

//   /* =======================================================
//      SOUND
//   ======================================================= */

//   const playQuickSettingSound =
//     () => {
//       try {
//         playSystemSound('click');
//       } catch {
//         // Keep UI functional.
//       }
//     };

//   /* =======================================================
//      WIFI
//   ======================================================= */

//   const toggleWifi = () => {
//     playQuickSettingSound();

//     if (airplaneMode) {
//       setAirplaneMode(false);
//       setWifiEnabled(true);
//       return;
//     }

//     setWifiEnabled(
//       previous => {
//         const next = !previous;

//         if (!next) {
//           setMobileHotspot(false);
//         }

//         return next;
//       },
//     );

//     setQuickPanel(
//       'wifi',
//     );
//   };

//   const connectWifi = (
//     network: string,
//   ) => {
//     playQuickSettingSound();
//     setWifiNetwork(network);
//     setWifiEnabled(true);
//     setAirplaneMode(false);
//     setMobileHotspot(false);
//   };

//   /* =======================================================
//      BLUETOOTH
//   ======================================================= */

//   const toggleBluetooth = () => {
//     playQuickSettingSound();

//     if (airplaneMode) {
//       setAirplaneMode(false);
//       setBluetoothEnabled(true);
//       return;
//     }

//     setBluetoothEnabled(
//       previous => {
//         const next = !previous;

//         if (!next) {
//           setBluetoothDevice('');
//         }

//         return next;
//       },
//     );

//     setQuickPanel(
//       'bluetooth',
//     );
//   };

//   const connectBluetooth =
//     (device: string) => {
//       playQuickSettingSound();
//       setBluetoothDevice(device);
//       setBluetoothEnabled(true);
//       setAirplaneMode(false);
//     };

//   /* =======================================================
//      AIRPLANE MODE
//   ======================================================= */

//   const toggleAirplane = () => {
//     playQuickSettingSound();

//     setAirplaneMode(
//       previous => {
//         const next = !previous;

//         if (next) {
//           setWifiEnabled(false);
//           setBluetoothEnabled(false);
//           setMobileHotspot(false);
//           setQuickPanel('airplane');
//         }

//         return next;
//       },
//     );
//   };

//   /* =======================================================
//      ACCESSIBILITY
//   ======================================================= */

//   const toggleAccessibility =
//     () => {
//       playQuickSettingSound();

//       setAccessibilityEnabled(
//         previous => {
//           const next = !previous;

//           if (next) {
//             setLargeText(true);
//           }

//           return next;
//         },
//       );

//       setQuickPanel(
//         'accessibility',
//       );
//     };

//   /* =======================================================
//      ENERGY SAVER
//   ======================================================= */

//   const toggleEnergySaver =
//     () => {
//       playQuickSettingSound();

//       setEnergySaver(
//         previous => !previous,
//       );

//       setQuickPanel(
//         'energy',
//       );
//     };

//   /* =======================================================
//      LIVE CAPTIONS
//   ======================================================= */

//   const stopCaptionRecognition =
//     () => {
//       try {
//         captionRecognitionRef.current?.stop();
//       } catch {
//         // Ignore stop failures.
//       }

//       captionRecognitionRef.current =
//         null;
//     };

//   const startCaptionRecognition =
//     () => {
//       const Recognition =
//         window.SpeechRecognition ||
//         window.webkitSpeechRecognition;

//       if (!Recognition) {
//         setCaptionText(
//           'Live captions are enabled. Speech recognition is not supported by this browser.',
//         );
//         return;
//       }

//       stopCaptionRecognition();

//       const recognition =
//         new Recognition();

//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang =
//         navigator.language || 'en-US';

//       recognition.onresult =
//         event => {
//           let text = '';

//           for (
//             let i =
//               event.resultIndex || 0;
//             i < event.results.length;
//             i += 1
//           ) {
//             text +=
//               event.results[i][0]
//                 ?.transcript || '';
//           }

//           if (text.trim()) {
//             setCaptionText(
//               text.trim(),
//             );
//           }
//         };

//       recognition.onerror = () => {
//         setCaptionText(
//           'Live captions is active. Microphone recognition is unavailable.',
//         );
//       };

//       recognition.onend = () => {
//         if (liveCaptions) {
//           try {
//             recognition.start();
//           } catch {
//             // Browser may reject rapid restarts.
//           }
//         }
//       };

//       try {
//         recognition.start();
//         captionRecognitionRef.current =
//           recognition;
//         setCaptionText(
//           'Listening for speech…',
//         );
//       } catch {
//         setCaptionText(
//           'Unable to start live captions.',
//         );
//       }
//     };

//   const toggleLiveCaptions =
//     () => {
//       playQuickSettingSound();

//       setLiveCaptions(
//         previous => {
//           const next = !previous;

//           if (!next) {
//             stopCaptionRecognition();
//             setCaptionText('');
//           }

//           return next;
//         },
//       );

//       setQuickPanel(
//         'captions',
//       );
//     };

//   useEffect(() => {
//     if (liveCaptions) {
//       startCaptionRecognition();
//     } else {
//       stopCaptionRecognition();
//       setCaptionText('');
//     }

//     return () => {
//       stopCaptionRecognition();
//     };

//     // Intentionally only react to the setting.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [liveCaptions]);

//   /* =======================================================
//      NIGHT LIGHT
//   ======================================================= */

//   const toggleNightLight =
//     () => {
//       playQuickSettingSound();

//       setNightLight(
//         previous => !previous,
//       );

//       setQuickPanel(
//         'nightLight',
//       );
//     };

//   /* =======================================================
//      HOTSPOT
//   ======================================================= */

//   const toggleHotspot =
//     () => {
//       playQuickSettingSound();

//       if (airplaneMode) {
//         setAirplaneMode(false);
//         setWifiEnabled(true);
//       }

//       setMobileHotspot(
//         previous => !previous,
//       );

//       setQuickPanel(
//         'hotspot',
//       );
//     };

//   /* =======================================================
//      NEARBY SHARING
//   ======================================================= */

//   const toggleNearbySharing =
//     () => {
//       playQuickSettingSound();

//       setNearbySharing(
//         previous => !previous,
//       );

//       setQuickPanel(
//         'sharing',
//       );
//     };

//   const shareWorkstation =
//     async () => {
//       playQuickSettingSound();

//       const shareData = {
//         title: 'Abhishek OS',
//         text: 'Check out my interactive portfolio workstation.',
//         url: window.location.href,
//       };

//       try {
//         if (
//           navigator.share
//         ) {
//           await navigator.share(
//             shareData,
//           );

//           setSharingMessage(
//             'Shared successfully.',
//           );
//         } else {
//           await navigator.clipboard.writeText(
//             window.location.href,
//           );

//           setSharingMessage(
//             'Workstation link copied to clipboard.',
//           );
//         }
//       } catch {
//         setSharingMessage(
//           'Sharing cancelled.',
//         );
//       }
//     };

//   /* =======================================================
//      CAST / SCREEN SHARE
//   ======================================================= */

//   const stopCast =
//     () => {
//       castStreamRef.current
//         ?.getTracks()
//         .forEach(track =>
//           track.stop(),
//         );

//       castStreamRef.current =
//         null;

//       setCastEnabled(false);

//       if (
//         castVideoRef.current
//       ) {
//         castVideoRef.current.srcObject =
//           null;
//       }
//     };

//   const startCast =
//     async () => {
//       playQuickSettingSound();
//       setCastError('');

//       if (
//         !navigator.mediaDevices?.getDisplayMedia
//       ) {
//         setCastError(
//           'Screen sharing is not supported in this browser.',
//         );
//         return;
//       }

//       try {
//         const stream =
//           await navigator.mediaDevices.getDisplayMedia(
//             {
//               video: true,
//               audio: true,
//             },
//           );

//         castStreamRef.current =
//           stream;

//         setCastEnabled(true);
//         setQuickPanel('cast');

//         const videoTrack =
//           stream.getVideoTracks()[0];

//         videoTrack?.addEventListener(
//           'ended',
//           () => {
//             stopCast();
//           },
//         );
//       } catch (error) {
//         console.error(
//           'Cast/share error:',
//           error,
//         );

//         setCastError(
//           'Screen sharing was cancelled or unavailable.',
//         );

//         setCastEnabled(false);
//       }
//     };

//   const toggleCast =
//     async () => {
//       if (castEnabled) {
//         stopCast();
//         setQuickPanel('cast');
//         return;
//       }

//       await startCast();
//     };

//   useEffect(() => {
//     if (
//       castVideoRef.current &&
//       castStreamRef.current
//     ) {
//       castVideoRef.current.srcObject =
//         castStreamRef.current;
//       castVideoRef.current
//         .play()
//         .catch(() => undefined);
//     }
//   }, [
//     castEnabled,
//     quickPanel,
//   ]);

//   useEffect(() => {
//     return () => {
//       castStreamRef.current
//         ?.getTracks()
//         .forEach(track =>
//           track.stop(),
//         );
//     };
//   }, []);

//   /* =======================================================
//      PROJECT
//   ======================================================= */

//   const toggleProject =
//     () => {
//       playQuickSettingSound();

//       if (projectEnabled) {
//         setProjectEnabled(false);
//         setProjectMode('pc');
//       } else {
//         setProjectEnabled(true);
//         setProjectMode('duplicate');
//       }

//       setQuickPanel(
//         'project',
//       );
//     };

//   const chooseProjectMode =
//     (mode: ProjectMode) => {
//       playQuickSettingSound();

//       setProjectMode(mode);

//       if (mode === 'pc') {
//         setProjectEnabled(false);
//       } else {
//         setProjectEnabled(true);
//       }
//     };

//   /* =======================================================
//      OPEN / CLOSE PANELS
//   ======================================================= */

//   const closeOtherPanels =
//     () => {
//       setStartMenuOpen(false);
//       setSearchOpen(false);
//       setNotificationCenterOpen(false);
//       setDesktopOverviewOpen(false);
//     };

//   const openQuickPanel = (
//     panel: QuickPanel,
//   ) => {
//     closeOtherPanels();

//     setShowVolumePopup(true);
//     setQuickPanel(panel);
//   };

//   /* =======================================================
//      VIRTUAL KEYBOARD
//   ======================================================= */

//   const pressVirtualKey =
//     (key: string) => {
//       const active =
//         document.activeElement as
//           | HTMLElement
//           | null;

//       if (
//         active?.tagName === 'INPUT' ||
//         active?.tagName === 'TEXTAREA' ||
//         active?.isContentEditable
//       ) {
//         focusedEditable.current =
//           active;
//       }

//       const target =
//         focusedEditable.current;

//       if (
//         !target ||
//         !target.isConnected ||
//         !(
//           target.tagName === 'INPUT' ||
//           target.tagName === 'TEXTAREA' ||
//           target.isContentEditable
//         )
//       ) {
//         return;
//       }

//       target.focus();

//       if (
//         target instanceof
//           HTMLInputElement ||
//         target instanceof
//           HTMLTextAreaElement
//       ) {
//         if (key === 'Enter') {
//           target.dispatchEvent(
//             new KeyboardEvent(
//               'keydown',
//               {
//                 key,
//                 bubbles: true,
//                 cancelable: true,
//               },
//             ),
//           );

//           target.dispatchEvent(
//             new KeyboardEvent(
//               'keyup',
//               {
//                 key,
//                 bubbles: true,
//               },
//             ),
//           );

//           return;
//         }

//         const value =
//           target.value;

//         let start =
//           target.selectionStart ??
//           value.length;

//         const end =
//           target.selectionEnd ??
//           start;

//         if (
//           key === 'Backspace' &&
//           start === end &&
//           start > 0
//         ) {
//           start -= 1;
//         }

//         const inserted =
//           key === 'Backspace'
//             ? ''
//             : key;

//         const nextValue =
//           value.slice(0, start) +
//           inserted +
//           value.slice(end);

//         const descriptor =
//           Object.getOwnPropertyDescriptor(
//             Object.getPrototypeOf(
//               target,
//             ),
//             'value',
//           );

//         descriptor?.set?.call(
//           target,
//           nextValue,
//         );

//         const caret =
//           start +
//           inserted.length;

//         target.setSelectionRange(
//           caret,
//           caret,
//         );

//         target.dispatchEvent(
//           new InputEvent('input', {
//             bubbles: true,
//             inputType:
//               key === 'Backspace'
//                 ? 'deleteContentBackward'
//                 : 'insertText',
//             data:
//               inserted || null,
//           }),
//         );

//         return;
//       }

//       const selection =
//         window.getSelection();

//       if (!selection) {
//         return;
//       }

//       const range =
//         selection.rangeCount
//           ? selection.getRangeAt(0)
//           : document.createRange();

//       if (
//         !target.contains(
//           range.commonAncestorContainer,
//         )
//       ) {
//         range.selectNodeContents(
//           target,
//         );

//         range.collapse(false);
//       }

//       if (
//         key === 'Backspace' &&
//         range.collapsed
//       ) {
//         const container =
//           range.startContainer;

//         if (
//           range.startOffset > 0
//         ) {
//           range.setStart(
//             container,
//             range.startOffset - 1,
//           );
//         }
//       }

//       range.deleteContents();

//       if (key !== 'Backspace') {
//         const text =
//           document.createTextNode(
//             key === 'Enter'
//               ? '\n'
//               : key,
//           );

//         range.insertNode(text);
//         range.setStartAfter(text);
//       }

//       range.collapse(true);

//       selection.removeAllRanges();
//       selection.addRange(range);

//       target.dispatchEvent(
//         new InputEvent('input', {
//           bubbles: true,
//           inputType:
//             key === 'Backspace'
//               ? 'deleteContentBackward'
//               : 'insertText',
//           data:
//             key === 'Backspace'
//               ? null
//               : key,
//         }),
//       );
//     };

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <>
//       {/* =====================================================
//           DISPLAY EFFECTS
//       ===================================================== */}

//       {nightLight && (
//         <div
//           aria-hidden="true"
//           className="
//             pointer-events-none
//             fixed
//             inset-0
//             z-[8990]
//             bg-orange-300/[0.12]
//             mix-blend-soft-light
//             backdrop-blur-[0.1px]
//           "
//         />
//       )}

//       {settings.brightness < 100 && (
//         <div
//           aria-hidden="true"
//           className="
//             pointer-events-none
//             fixed
//             inset-0
//             z-[8991]
//             bg-black
//           "
//           style={{
//             opacity:
//               Math.max(
//                 0,
//                 100 -
//                   settings.brightness,
//               ) / 140,
//           }}
//         />
//       )}

//       {settings.focusMode && (
//         <div
//           className="
//             pointer-events-none
//             fixed
//             left-1/2
//             top-3
//             z-[8995]
//             -translate-x-1/2
//             rounded-full
//             border
//             border-purple-400/30
//             bg-purple-950/70
//             px-3
//             py-1
//             text-[9px]
//             font-semibold
//             tracking-wide
//             text-purple-300
//             shadow-lg
//             backdrop-blur-xl
//           "
//         >
//           ✦ Focus mode active
//         </div>
//       )}

//       {liveCaptions && (
//         <div
//           className="
//             pointer-events-none
//             fixed
//             bottom-16
//             left-1/2
//             z-[8996]
//             w-[min(720px,calc(100vw-24px))]
//             -translate-x-1/2
//             rounded-xl
//             border
//             border-white/10
//             bg-black/85
//             px-4
//             py-3
//             text-center
//             text-sm
//             font-medium
//             text-white
//             shadow-2xl
//             backdrop-blur-xl
//           "
//         >
//           {captionText ||
//             'Live captions enabled'}
//         </div>
//       )}

//       {/* =====================================================
//           TASKBAR
//       ===================================================== */}

//       <footer
//         id="windows-taskbar"
//         className="
//           fixed
//           bottom-0
//           left-0
//           right-0
//           z-[9000]
//           h-12
//           sm:h-13
//           acrylic-taskbar
//           select-none
//           overflow-visible
//         "
//         style={{
//           borderTop: `1px solid ${
//             settings.accentColor
//           }45`,
//         }}
//       >
//         {/* ===================================================
//             TASKBAR CONTENT
//         =================================================== */}

//         <div
//           className="
//             h-full
//             w-full
//             overflow-x-auto
//             overflow-y-visible
//             overscroll-x-contain
//             touch-pan-x
//             [-ms-overflow-style:none]
//             [scrollbar-width:none]
//             [&::-webkit-scrollbar]:hidden
//           "
//         >
//           <div
//             className="
//               flex
//               h-full
//               min-w-max
//               items-center
//               justify-between
//               gap-2
//               px-2
//               sm:px-3
//               lg:gap-3
//               lg:px-4
//               lg:min-w-full
//             "
//           >
//             {/* =================================================
//                 LEFT
//             ================================================= */}

//             <div className="flex shrink-0 items-center gap-1 sm:gap-2">
//               {/* HOME */}

//               <button
//                 type="button"
//                 aria-label="Show desktop"
//                 title="Show desktop"
//                 onClick={() => {
//                   playQuickSettingSound();
//                   goHome();
//                 }}
//                 className="
//                   group
//                   flex
//                   h-8
//                   w-8
//                   shrink-0
//                   items-center
//                   justify-center
//                   rounded-lg
//                   text-slate-200
//                   transition-all
//                   duration-200
//                   hover:bg-white/10
//                   active:scale-90
//                 "
//               >
//                 <House
//                   className="
//                     h-4
//                     w-4
//                     transition-transform
//                     duration-200
//                     group-hover:-translate-y-0.5
//                   "
//                 />
//               </button>

//               {/* WEATHER */}

//               <button
//                 type="button"
//                 onClick={() => {
//                   playQuickSettingSound();
//                   openApp('widgets');
//                 }}
//                 className="
//                   flex
//                   shrink-0
//                   items-center
//                   gap-2
//                   rounded-md
//                   px-2
//                   py-1
//                   text-xs
//                   font-medium
//                   text-slate-200
//                   transition-all
//                   duration-200
//                   hover:bg-white/10
//                   sm:px-2.5
//                 "
//                 title="Open Weather"
//               >
//                 <CloudSun
//                   className="
//                     h-4
//                     w-4
//                     shrink-0
//                     text-amber-400
//                   "
//                 />

//                 <span
//                   className="
//                     hidden
//                     text-[11px]
//                     font-semibold
//                     text-slate-300
//                     md:inline
//                   "
//                 >
//                   28°C Mostly Sunny
//                 </span>
//               </button>

//               {/* VERSION */}

//               <button
//                 type="button"
//                 onClick={() =>
//                   openApp(
//                     'system-info',
//                   )
//                 }
//                 className="
//                   hidden
//                   shrink-0
//                   items-center
//                   gap-1.5
//                   rounded-md
//                   px-2
//                   py-1
//                   text-[11px]
//                   font-medium
//                   text-slate-400
//                   transition-all
//                   duration-200
//                   hover:bg-white/10
//                   lg:flex
//                 "
//                 title="System Information"
//               >
//                 <span
//                   className="
//                     h-2
//                     w-2
//                     animate-pulse
//                     rounded-full
//                     bg-emerald-400
//                   "
//                 />

//                 <span>
//                   v2.0
//                 </span>
//               </button>
//             </div>

//             {/* =================================================
//                 CENTER
//             ================================================= */}

//             <div
//               className="
//                 flex
//                 shrink-0
//                 items-center
//                 gap-1
//                 sm:gap-1.5
//               "
//             >
//               {/* DESKTOP OVERVIEW */}

//               <button
//                 type="button"
//                 aria-label="Desktop overview"
//                 onClick={() => {
//                   playQuickSettingSound();

//                   setDesktopOverviewOpen(
//                     !isDesktopOverviewOpen,
//                   );

//                   setStartMenuOpen(
//                     false,
//                   );

//                   setSearchOpen(
//                     false,
//                   );

//                   setNotificationCenterOpen(
//                     false,
//                   );

//                   setShowVolumePopup(
//                     false,
//                   );
//                 }}
//                 className={`
//                   relative
//                   shrink-0
//                   rounded-lg
//                   p-2
//                   transition-all
//                   duration-200
//                   ${
//                     isDesktopOverviewOpen
//                       ? 'bg-sky-500/25 text-sky-300 ring-1 ring-sky-400/60'
//                       : 'text-slate-300 hover:bg-white/10'
//                   }
//                 `}
//                 title="Desktops overview"
//               >
//                 <LayoutDashboard className="h-4 w-4" />
//               </button>

//               {/* START */}

//               <button
//                 type="button"
//                 id="taskbar-start-btn"
//                 aria-label="Start Menu"
//                 onClick={() => {
//                   playQuickSettingSound();

//                   setStartMenuOpen(
//                     previous =>
//                       !previous,
//                   );

//                   setSearchOpen(false);
//                   setNotificationCenterOpen(
//                     false,
//                   );
//                   setDesktopOverviewOpen(
//                     false,
//                   );
//                   setShowVolumePopup(
//                     false,
//                   );
//                 }}
//                 className={`
//                   group
//                   relative
//                   shrink-0
//                   rounded-lg
//                   p-2
//                   transition-all
//                   duration-200
//                   ${
//                     isStartMenuOpen
//                       ? 'bg-white/20 ring-1 ring-sky-400'
//                       : 'hover:bg-white/10 active:scale-95'
//                   }
//                 `}
//                 title="Start"
//               >
//                 <div className="grid h-4 w-4 grid-cols-2 gap-0.5">
//                   <div className="h-2 w-2 rounded-[2px] bg-sky-400" />
//                   <div className="h-2 w-2 rounded-[2px] bg-sky-400" />
//                   <div className="h-2 w-2 rounded-[2px] bg-sky-400" />
//                   <div className="h-2 w-2 rounded-[2px] bg-sky-400" />
//                 </div>
//               </button>

//               {/* SEARCH */}

//               <button
//                 type="button"
//                 id="taskbar-search-btn"
//                 aria-label="Search Portfolio"
//                 onClick={() => {
//                   playQuickSettingSound();

//                   setSearchOpen(
//                     previous =>
//                       !previous,
//                   );

//                   setStartMenuOpen(
//                     false,
//                   );

//                   setNotificationCenterOpen(
//                     false,
//                   );

//                   setDesktopOverviewOpen(
//                     false,
//                   );

//                   setShowVolumePopup(
//                     false,
//                   );
//                 }}
//                 className={`
//                   flex
//                   shrink-0
//                   items-center
//                   gap-2
//                   rounded-lg
//                   px-2.5
//                   py-1.5
//                   transition-all
//                   duration-200
//                   ${
//                     isSearchOpen
//                       ? 'bg-white/20 text-sky-300 ring-1 ring-sky-400'
//                       : 'text-slate-300 hover:bg-white/10 hover:text-white'
//                   }
//                 `}
//                 title="Search (Ctrl + K)"
//               >
//                 <Search className="h-4 w-4" />

//                 <span
//                   className="
//                     hidden
//                     text-xs
//                     text-slate-400
//                     md:inline
//                   "
//                 >
//                   Search...
//                 </span>
//               </button>

//               <div className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />

//               {/* APPS */}

//               {visibleApps.map(
//                 item => {
//                   const running =
//                     isAppRunning(
//                       item.appId,
//                     );

//                   const focused =
//                     isAppFocused(
//                       item.appId,
//                     );

//                   return (
//                     <button
//                       key={
//                         item.appId
//                       }
//                       type="button"
//                       id={`taskbar-app-${item.appId}`}
//                       onClick={() =>
//                         handleAppClick(
//                           item.appId,
//                         )
//                       }
//                       onContextMenu={event => {
//                         event.preventDefault();
//                         event.stopPropagation();

//                         openContextMenu(
//                           event.clientX,
//                           event.clientY,
//                           'taskbar',
//                           item.appId,
//                         );
//                       }}
//                       draggable={taskbarApps.some(
//                         app =>
//                           app.appId ===
//                           item.appId,
//                       )}
//                       onDragStart={() =>
//                         setDraggedAppId(
//                           item.appId,
//                         )
//                       }
//                       onDragOver={event =>
//                         event.preventDefault()
//                       }
//                       onDrop={() => {
//                         if (
//                           draggedAppId
//                         ) {
//                           reorderTaskbarApps(
//                             draggedAppId,
//                             item.appId,
//                           );
//                         }

//                         setDraggedAppId(
//                           null,
//                         );
//                       }}
//                       onDragEnd={() =>
//                         setDraggedAppId(
//                           null,
//                         )
//                       }
//                       className={`
//                         group
//                         relative
//                         shrink-0
//                         rounded-lg
//                         p-2
//                         transition-all
//                         duration-200
//                         ${
//                           focused
//                             ? 'bg-white/20 shadow-inner'
//                             : running
//                               ? 'bg-white/10 hover:bg-white/15'
//                               : 'hover:bg-white/10'
//                         }
//                       `}
//                       title={
//                         item.title
//                       }
//                     >
//                       <div className="flex h-5 w-5 items-center justify-center">
//                         <AppIcon
//                           name={
//                             item.icon
//                           }
//                           className="
//                             h-5
//                             w-5
//                             text-slate-200
//                             transition-transform
//                             duration-200
//                             group-hover:scale-110
//                             group-hover:text-white
//                           "
//                         />
//                       </div>

//                       {running && (
//                         <span
//                           className={`
//                             absolute
//                             bottom-0.5
//                             left-1/2
//                             -translate-x-1/2
//                             rounded-full
//                             transition-all
//                             duration-200
//                             ${
//                               focused
//                                 ? 'h-0.5 w-4 bg-sky-400'
//                                 : 'h-0.5 w-1.5 bg-slate-400 group-hover:w-3'
//                             }
//                           `}
//                         />
//                       )}
//                     </button>
//                   );
//                 },
//               )}
//             </div>

//             {/* =================================================
//                 RIGHT SIDE
//             ================================================= */}

//             <div className="flex shrink-0 items-center gap-1">
//               {/* KEYBOARD */}

//               <button
//                 type="button"
//                 aria-label="Virtual keyboard"
//                 title="Virtual keyboard"
//                 onMouseDown={event =>
//                   event.preventDefault()
//                 }
//                 onClick={() => {
//                   playQuickSettingSound();

//                   setShowKeyboard(
//                     previous =>
//                       !previous,
//                   );
//                 }}
//                 className={`
//                   rounded-lg
//                   p-1.5
//                   transition-all
//                   duration-200
//                   ${
//                     showKeyboard
//                       ? 'bg-sky-500/25 text-sky-300'
//                       : 'text-slate-300 hover:bg-white/10'
//                   }
//                 `}
//               >
//                 <Keyboard className="h-4 w-4" />
//               </button>

//               {/* FULLSCREEN */}

//               <button
//                 type="button"
//                 aria-label={
//                   isFullscreen
//                     ? 'Exit fullscreen'
//                     : 'Enter fullscreen'
//                 }
//                 title={
//                   isFullscreen
//                     ? 'Exit fullscreen'
//                     : 'Full screen desktop'
//                 }
//                 onClick={() =>
//                   void toggleFullscreen()
//                 }
//                 className="
//                   rounded-lg
//                   p-1.5
//                   text-slate-300
//                   transition-all
//                   duration-200
//                   hover:bg-white/10
//                   hover:text-cyan-300
//                   active:scale-90
//                 "
//               >
//                 {isFullscreen ? (
//                   <Minimize2 className="h-4 w-4" />
//                 ) : (
//                   <Maximize2 className="h-4 w-4" />
//                 )}
//               </button>

//               {/* QUICK SETTINGS BUTTON */}

//               <button
//                 type="button"
//                 aria-label="Quick settings"
//                 aria-expanded={
//                   showVolumePopup
//                 }
//                 onClick={() => {
//                   playQuickSettingSound();

//                   setShowVolumePopup(
//                     previous =>
//                       !previous,
//                   );

//                   setQuickPanel(
//                     'none',
//                   );

//                   closeOtherPanels();
//                 }}
//                 className={`
//                   flex
//                   shrink-0
//                   items-center
//                   gap-1.5
//                   rounded-md
//                   px-2
//                   py-1
//                   transition-all
//                   duration-200
//                   ${
//                     showVolumePopup
//                       ? 'bg-white/15 text-white ring-1 ring-white/10'
//                       : 'text-slate-300 hover:bg-white/10'
//                   }
//                 `}
//                 title="Quick settings"
//               >
//                 <Wifi
//                   className={`
//                     h-3.5
//                     w-3.5
//                     ${
//                       wifiEnabled &&
//                       !airplaneMode
//                         ? 'text-emerald-400'
//                         : 'text-slate-500'
//                     }
//                   `}
//                 />

//                 {settings.volume >
//                 0 ? (
//                   <Volume2 className="h-3.5 w-3.5" />
//                 ) : (
//                   <VolumeX className="h-3.5 w-3.5 text-slate-500" />
//                 )}

//                 <Battery className="h-3.5 w-3.5 text-sky-400" />
//               </button>

//               {/* CLOCK */}

//               <button
//                 type="button"
//                 id="taskbar-clock-btn"
//                 aria-label="Open Calendar and Notifications"
//                 onClick={() => {
//                   playQuickSettingSound();

//                   setNotificationCenterOpen(
//                     previous =>
//                       !previous,
//                   );

//                   setStartMenuOpen(
//                     false,
//                   );

//                   setSearchOpen(
//                     false,
//                   );

//                   setShowVolumePopup(
//                     false,
//                   );
//                 }}
//                 className={`
//                   flex
//                   shrink-0
//                   flex-col
//                   items-end
//                   rounded-md
//                   px-2
//                   py-0.5
//                   text-right
//                   transition-all
//                   duration-200
//                   ${
//                     isNotificationCenterOpen
//                       ? 'bg-white/20 text-sky-300'
//                       : 'text-slate-300 hover:bg-white/10 hover:text-white'
//                   }
//                 `}
//               >
//                 <span className="text-xs font-semibold leading-tight">
//                   {timeStr ||
//                     '12:00 PM'}
//                 </span>

//                 <span className="text-[10px] leading-tight text-slate-400">
//                   {dateStr ||
//                     '9/17/2026'}
//                 </span>
//               </button>

//               {/* NOTIFICATIONS */}

//               <button
//                 type="button"
//                 id="taskbar-notif-btn"
//                 aria-label="Notifications"
//                 onClick={() => {
//                   playQuickSettingSound();

//                   setNotificationCenterOpen(
//                     previous =>
//                       !previous,
//                   );

//                   setStartMenuOpen(
//                     false,
//                   );

//                   setSearchOpen(
//                     false,
//                   );

//                   setShowVolumePopup(
//                     false,
//                   );
//                 }}
//                 className="
//                   relative
//                   shrink-0
//                   rounded-md
//                   p-1.5
//                   text-slate-300
//                   transition-all
//                   duration-200
//                   hover:bg-white/10
//                   hover:text-white
//                 "
//               >
//                 <Bell className="h-4 w-4" />

//                 {unreadCount >
//                   0 && (
//                   <span
//                     className="
//                       absolute
//                       right-1
//                       top-1
//                       h-2
//                       w-2
//                       animate-pulse
//                       rounded-full
//                       bg-sky-500
//                       ring-1
//                       ring-slate-900
//                     "
//                   />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* =====================================================
//             DESKTOP OVERVIEW
//         ===================================================== */}

//         {isDesktopOverviewOpen && (
//           <div
//             className="
//               desktop-overview
//               fixed
//               bottom-14
//               left-1/2
//               z-[9998]
//               w-[min(760px,calc(100vw-24px))]
//               -translate-x-1/2
//               animate-[taskbarPopupIn_180ms_ease-out]
//               rounded-2xl
//               border
//               border-white/15
//               bg-slate-950/90
//               p-4
//               shadow-2xl
//               backdrop-blur-2xl
//             "
//           >
//             <div className="mb-3 flex items-center justify-between gap-3">
//               <div>
//                 <p className="text-sm font-semibold text-white">
//                   Your desktops
//                 </p>

//                 <p className="text-[11px] text-slate-400">
//                   Switch workspace without losing your place
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => {
//                   playQuickSettingSound();
//                   createDesktop();
//                 }}
//                 className="
//                   flex
//                   shrink-0
//                   items-center
//                   gap-1
//                   rounded-lg
//                   bg-sky-500
//                   px-2.5
//                   py-1.5
//                   text-xs
//                   font-semibold
//                   text-slate-950
//                   transition-all
//                   duration-200
//                   hover:bg-sky-400
//                   active:scale-95
//                 "
//               >
//                 <Plus className="h-3.5 w-3.5" />
//                 <span>
//                   New desktop
//                 </span>
//               </button>
//             </div>

//             <div
//               className="
//                 grid
//                 max-h-[65vh]
//                 grid-cols-1
//                 gap-3
//                 overflow-y-auto
//                 pr-1
//                 sm:grid-cols-2
//               "
//             >
//               {desktops.map(
//                 desktop => {
//                   const desktopWindows =
//                     windows.filter(
//                       window =>
//                         window.desktopId ===
//                         desktop.id,
//                     );

//                   return (
//                     <div
//                       key={
//                         desktop.id
//                       }
//                       onDragOver={event =>
//                         event.preventDefault()
//                       }
//                       onDrop={event => {
//                         event.preventDefault();

//                         const windowId =
//                           event.dataTransfer.getData(
//                             'text/window-id',
//                           );

//                         if (windowId) {
//                           moveWindowToDesktop(
//                             windowId,
//                             desktop.id,
//                           );
//                         }
//                       }}
//                       className={`
//                         group
//                         relative
//                         rounded-xl
//                         border
//                         p-2
//                         transition-all
//                         duration-200
//                         ${
//                           desktop.id ===
//                           activeDesktopId
//                             ? 'border-sky-400/70 bg-sky-400/10 shadow-lg shadow-sky-500/10'
//                             : 'border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.06]'
//                         }
//                       `}
//                     >
//                       <button
//                         type="button"
//                         onClick={() =>
//                           switchDesktop(
//                             desktop.id,
//                           )
//                         }
//                         className="block w-full text-left"
//                       >
//                         <div
//                           className={`
//                             relative
//                             h-20
//                             overflow-hidden
//                             rounded-lg
//                             bg-gradient-to-br
//                             ${desktop.accent}
//                             p-2
//                           `}
//                         >
//                           <div className="absolute inset-0 bg-slate-950/45" />

//                           <div className="relative grid grid-cols-3 gap-1">
//                             {desktopWindows
//                               .slice(
//                                 0,
//                                 3,
//                               )
//                               .map(
//                                 win => (
//                                   <div
//                                     key={
//                                       win.id
//                                     }
//                                     draggable
//                                     onDragStart={event => {
//                                       event.stopPropagation();

//                                       event.dataTransfer.setData(
//                                         'text/window-id',
//                                         win.id,
//                                       );
//                                     }}
//                                     className="
//                                       h-12
//                                       cursor-grab
//                                       rounded
//                                       bg-slate-900/80
//                                       shadow-lg
//                                       active:cursor-grabbing
//                                     "
//                                     title={`Drag ${win.title} to another desktop`}
//                                   />
//                                 ),
//                               )}

//                             {desktopWindows.length ===
//                               0 && (
//                               <span className="col-span-3 self-center pt-3 text-center text-[10px] text-white/70">
//                                 Empty workspace
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between px-1 pt-2">
//                           <span className="text-xs font-semibold text-slate-100">
//                             {desktop.name}
//                           </span>

//                           <span className="text-[10px] text-slate-400">
//                             {
//                               desktopWindows.length
//                             }{' '}
//                             {desktopWindows.length ===
//                             1
//                               ? 'window'
//                               : 'windows'}
//                           </span>
//                         </div>

//                         {desktopWindows.length >
//                           0 && (
//                           <div className="mt-2 flex flex-wrap gap-1 px-1">
//                             {desktopWindows.map(
//                               win => (
//                                 <span
//                                   key={
//                                     win.id
//                                   }
//                                   className="
//                                     max-w-full
//                                     truncate
//                                     rounded
//                                     bg-white/10
//                                     px-1.5
//                                     py-0.5
//                                     text-[9px]
//                                     text-slate-300
//                                   "
//                                 >
//                                   {
//                                     win.title
//                                   }
//                                 </span>
//                               ),
//                             )}
//                           </div>
//                         )}
//                       </button>

//                       {desktops.length >
//                         1 && (
//                         <button
//                           type="button"
//                           aria-label={`Delete ${desktop.name}`}
//                           onClick={() => {
//                             playQuickSettingSound();
//                             deleteDesktop(
//                               desktop.id,
//                             );
//                           }}
//                           className="
//                             absolute
//                             right-2
//                             top-2
//                             rounded
//                             p-1
//                             text-slate-400
//                             opacity-0
//                             transition-all
//                             duration-200
//                             hover:bg-red-500/20
//                             hover:text-red-300
//                             group-hover:opacity-100
//                           "
//                         >
//                           <Trash2 className="h-3.5 w-3.5" />
//                         </button>
//                       )}
//                     </div>
//                   );
//                 },
//               )}
//             </div>
//           </div>
//         )}

//         {/* =====================================================
//             QUICK SETTINGS BACKDROP
//         ===================================================== */}

//         {showVolumePopup && (
//           <>
//             <button
//               type="button"
//               aria-label="Close quick settings"
//               onClick={() => {
//                 setShowVolumePopup(
//                   false,
//                 );
//                 setQuickPanel(
//                   'none',
//                 );
//               }}
//               className="
//                 fixed
//                 inset-0
//                 z-[9997]
//                 cursor-default
//                 bg-black/10
//                 backdrop-blur-[1px]
//               "
//             />

//             {/* =================================================
//                 QUICK SETTINGS PANEL
//             ================================================= */}

//             <div
//               className="
//                 fixed
//                 bottom-14
//                 right-3
//                 z-[9999]
//                 w-[min(400px,calc(100vw-16px))]
//                 overflow-hidden
//                 rounded-[22px]
//                 border
//                 border-white/[0.13]
//                 bg-[#1b2028]/[0.98]
//                 text-xs
//                 shadow-[0_24px_80px_rgba(0,0,0,.58)]
//                 backdrop-blur-3xl
//                 animate-[quickSettingsIn_220ms_cubic-bezier(.2,.8,.2,1)]
//               "
//               onClick={event =>
//                 event.stopPropagation()
//               }
//             >
//               <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-500/[0.09] to-transparent" />

//               <div className="relative max-h-[calc(100vh-80px)] overflow-y-auto p-3.5 sm:p-4">
//                 {/* =================================================
//                     HEADER
//                 ================================================= */}

//                 <div className="mb-3 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <div
//                       className="
//                         flex
//                         h-7
//                         w-7
//                         items-center
//                         justify-center
//                         rounded-lg
//                         bg-sky-500/15
//                         text-sky-300
//                       "
//                     >
//                       <Sparkles className="h-3.5 w-3.5" />
//                     </div>

//                     <div>
//                       <p className="text-[13px] font-bold text-white">
//                         Quick Settings
//                       </p>

//                       <p className="text-[9px] text-slate-500">
//                         Abhishek OS controls
//                       </p>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     aria-label="Close quick settings"
//                     onClick={() =>
//                       setShowVolumePopup(
//                         false,
//                       )
//                     }
//                     className="
//                       rounded-lg
//                       p-1.5
//                       text-slate-500
//                       transition-all
//                       duration-200
//                       hover:bg-white/10
//                       hover:text-white
//                       active:scale-90
//                     "
//                   >
//                     <X className="h-3.5 w-3.5" />
//                   </button>
//                 </div>

//                 {/* =================================================
//                     MAIN TILES
//                 ================================================= */}

//                 <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
//                   <QuickSettingTile
//                     id="wifi"
//                     label="Wi-Fi"
//                     subtitle={
//                       airplaneMode
//                         ? 'Airplane mode'
//                         : wifiEnabled
//                           ? wifiNetwork
//                           : 'Off'
//                     }
//                     icon={Wifi}
//                     active={
//                       wifiEnabled &&
//                       !airplaneMode
//                     }
//                     disabled={
//                       airplaneMode
//                     }
//                     onClick={
//                       toggleWifi
//                     }
//                   />

//                   <QuickSettingTile
//                     id="bluetooth"
//                     label="Bluetooth"
//                     subtitle={
//                       bluetoothEnabled
//                         ? bluetoothDevice ||
//                           'On'
//                         : 'Off'
//                     }
//                     icon={
//                       Bluetooth
//                     }
//                     active={
//                       bluetoothEnabled &&
//                       !airplaneMode
//                     }
//                     disabled={
//                       airplaneMode
//                     }
//                     onClick={
//                       toggleBluetooth
//                     }
//                   />

//                   <QuickSettingTile
//                     id="airplane"
//                     label="Airplane mode"
//                     subtitle={
//                       airplaneMode
//                         ? 'All radios off'
//                         : 'Off'
//                     }
//                     icon={Airplay}
//                     active={
//                       airplaneMode
//                     }
//                     onClick={
//                       toggleAirplane
//                     }
//                   />

//                   <QuickSettingTile
//                     id="accessibility"
//                     label="Accessibility"
//                     subtitle={
//                       accessibilityEnabled
//                         ? 'Enabled'
//                         : 'Options'
//                     }
//                     icon={
//                       Accessibility
//                     }
//                     active={
//                       accessibilityEnabled
//                     }
//                     onClick={
//                       toggleAccessibility
//                     }
//                   />

//                   <QuickSettingTile
//                     id="energy"
//                     label="Energy saver"
//                     subtitle={
//                       energySaver
//                         ? 'Saving power'
//                         : 'Off'
//                     }
//                     icon={Zap}
//                     active={
//                       energySaver
//                     }
//                     onClick={
//                       toggleEnergySaver
//                     }
//                   />

//                   <QuickSettingTile
//                     id="captions"
//                     label="Live captions"
//                     subtitle={
//                       liveCaptions
//                         ? 'Listening'
//                         : 'Off'
//                     }
//                     icon={
//                       Captions
//                     }
//                     active={
//                       liveCaptions
//                     }
//                     onClick={
//                       toggleLiveCaptions
//                     }
//                   />

//                   <QuickSettingTile
//                     id="nightLight"
//                     label="Night light"
//                     subtitle={
//                       nightLight
//                         ? 'Warm display'
//                         : 'Off'
//                     }
//                     icon={Moon}
//                     active={
//                       nightLight
//                     }
//                     onClick={
//                       toggleNightLight
//                     }
//                   />

//                   <QuickSettingTile
//                     id="hotspot"
//                     label="Mobile hotspot"
//                     subtitle={
//                       mobileHotspot
//                         ? 'Sharing'
//                         : 'Off'
//                     }
//                     icon={Wifi}
//                     active={
//                       mobileHotspot
//                     }
//                     onClick={
//                       toggleHotspot
//                     }
//                   />

//                   <QuickSettingTile
//                     id="sharing"
//                     label="Nearby sharing"
//                     subtitle={
//                       nearbySharing
//                         ? 'Discoverable'
//                         : 'Off'
//                     }
//                     icon={
//                       Share2
//                     }
//                     active={
//                       nearbySharing
//                     }
//                     onClick={
//                       toggleNearbySharing
//                     }
//                   />

//                   <QuickSettingTile
//                     id="cast"
//                     label="Cast"
//                     subtitle={
//                       castEnabled
//                         ? 'Screen sharing'
//                         : 'Available'
//                     }
//                     icon={Cast}
//                     active={
//                       castEnabled
//                     }
//                     onClick={
//                       toggleCast
//                     }
//                   />

//                   <QuickSettingTile
//                     id="project"
//                     label="Project"
//                     subtitle={
//                       projectEnabled
//                         ? projectMode ===
//                           'duplicate'
//                           ? 'Duplicate'
//                           : projectMode ===
//                               'extend'
//                             ? 'Extend'
//                             : 'Second screen'
//                         : 'PC screen only'
//                     }
//                     icon={
//                       MonitorUp
//                     }
//                     active={
//                       projectEnabled
//                     }
//                     onClick={
//                       toggleProject
//                     }
//                   />
//                 </div>

//                 {/* =================================================
//                     CONTEXT PANEL
//                 ================================================= */}

//                 {quickPanel !==
//                   'none' && (
//                   <div className="mt-3 animate-[quickSubPanelIn_180ms_ease-out] rounded-xl border border-white/[0.08] bg-black/10 p-3">
//                     {/* WIFI */}

//                     {quickPanel ===
//                       'wifi' && (
//                       <div>
//                         <div className="mb-2 flex items-center justify-between">
//                           <div>
//                             <p className="text-[11px] font-bold text-white">
//                               Wi-Fi networks
//                             </p>

//                             <p className="text-[9px] text-slate-500">
//                               Choose a simulated network
//                             </p>
//                           </div>

//                           <span className="flex items-center gap-1 text-[9px] text-emerald-400">
//                             <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                             {wifiEnabled
//                               ? 'Connected'
//                               : 'Off'}
//                           </span>
//                         </div>

//                         <div className="space-y-1.5">
//                           {[
//                             'Airtel_Abhishek',
//                             'Abhishek_5G',
//                             'Office_Network',
//                             'Guest_WiFi',
//                           ].map(
//                             network => (
//                               <OptionButton
//                                 key={
//                                   network
//                                 }
//                                 active={
//                                   wifiEnabled &&
//                                   wifiNetwork ===
//                                     network
//                                 }
//                                 onClick={() =>
//                                   connectWifi(
//                                     network,
//                                   )
//                                 }
//                               >
//                                 <span className="flex items-center gap-2">
//                                   <Wifi className="h-3.5 w-3.5 text-sky-400" />
//                                   {
//                                     network
//                                   }
//                                 </span>
//                               </OptionButton>
//                             ),
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {/* BLUETOOTH */}

//                     {quickPanel ===
//                       'bluetooth' && (
//                       <div>
//                         <div className="mb-2">
//                           <p className="text-[11px] font-bold text-white">
//                             Bluetooth devices
//                           </p>

//                           <p className="text-[9px] text-slate-500">
//                             Connect a device to this workstation
//                           </p>
//                         </div>

//                         <div className="space-y-1.5">
//                           {[
//                             'AirPods Pro',
//                             'MX Master 3S',
//                             'Galaxy Buds',
//                             'Wireless Keyboard',
//                           ].map(
//                             device => (
//                               <OptionButton
//                                 key={
//                                   device
//                                 }
//                                 active={
//                                   bluetoothEnabled &&
//                                   bluetoothDevice ===
//                                     device
//                                 }
//                                 onClick={() =>
//                                   connectBluetooth(
//                                     device,
//                                   )
//                                 }
//                               >
//                                 <span className="flex items-center gap-2">
//                                   <Bluetooth className="h-3.5 w-3.5 text-sky-400" />
//                                   {
//                                     device
//                                   }
//                                 </span>
//                               </OptionButton>
//                             ),
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {/* AIRPLANE */}

//                     {quickPanel ===
//                       'airplane' && (
//                       <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
//                         <p className="text-[11px] font-bold text-amber-300">
//                           Airplane mode
//                         </p>

//                         <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
//                           Wi-Fi, Bluetooth and mobile hotspot are currently disabled.
//                         </p>
//                       </div>
//                     )}

//                     {/* ACCESSIBILITY */}

//                     {quickPanel ===
//                       'accessibility' && (
//                       <div>
//                         <div className="mb-2">
//                           <p className="text-[11px] font-bold text-white">
//                             Accessibility
//                           </p>

//                           <p className="text-[9px] text-slate-500">
//                             Personalize how Abhishek OS looks and behaves
//                           </p>
//                         </div>

//                         <div className="space-y-1.5">
//                           <OptionButton
//                             active={
//                               largeText
//                             }
//                             onClick={() =>
//                               setLargeText(
//                                 previous =>
//                                   !previous,
//                               )
//                             }
//                           >
//                             Large text
//                           </OptionButton>

//                           <OptionButton
//                             active={
//                               highContrast
//                             }
//                             onClick={() =>
//                               setHighContrast(
//                                 previous =>
//                                   !previous,
//                               )
//                             }
//                           >
//                             High contrast
//                           </OptionButton>

//                           <OptionButton
//                             active={
//                               reduceMotion
//                             }
//                             onClick={() =>
//                               setReduceMotion(
//                                 previous =>
//                                   !previous,
//                               )
//                             }
//                           >
//                             Reduce motion
//                           </OptionButton>
//                         </div>
//                       </div>
//                     )}

//                     {/* ENERGY */}

//                     {quickPanel ===
//                       'energy' && (
//                       <div>
//                         <p className="text-[11px] font-bold text-white">
//                           Energy saver
//                         </p>

//                         <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
//                           Energy saver reduces visual effects and animation intensity to simulate a lower-power workstation profile.
//                         </p>

//                         <div className="mt-2 rounded-lg bg-emerald-500/10 px-3 py-2">
//                           <span className="text-[9px] font-semibold text-emerald-400">
//                             {energySaver
//                               ? 'Power saving is active'
//                               : 'Normal performance mode'}
//                           </span>
//                         </div>
//                       </div>
//                     )}

//                     {/* CAPTIONS */}

//                     {quickPanel ===
//                       'captions' && (
//                       <div>
//                         <p className="text-[11px] font-bold text-white">
//                           Live captions
//                         </p>

//                         <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
//                           Captions appear at the bottom of the workstation when speech recognition is available.
//                         </p>

//                         <div className="mt-2 rounded-lg bg-black/30 px-3 py-2">
//                           <span className="text-[9px] text-slate-300">
//                             {captionText ||
//                               'Waiting for speech…'}
//                           </span>
//                         </div>
//                       </div>
//                     )}

//                     {/* NIGHT LIGHT */}

//                     {quickPanel ===
//                       'nightLight' && (
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <Moon className="h-4 w-4 text-amber-300" />

//                           <div>
//                             <p className="text-[11px] font-bold text-white">
//                               Night light
//                             </p>

//                             <p className="text-[9px] text-slate-500">
//                               Warm display protection
//                             </p>
//                           </div>
//                         </div>

//                         <div className="mt-2 rounded-lg border border-orange-300/20 bg-orange-300/10 p-3">
//                           <p className="text-[9px] leading-relaxed text-orange-100/80">
//                             The workstation display is now using a warmer color temperature to reduce cool blue tones.
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {/* HOTSPOT */}

//                     {quickPanel ===
//                       'hotspot' && (
//                       <div>
//                         <p className="text-[11px] font-bold text-white">
//                           Mobile hotspot
//                         </p>

//                         <p className="mt-1 text-[9px] text-slate-500">
//                           Simulated mobile network sharing
//                         </p>

//                         {mobileHotspot ? (
//                           <div className="mt-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">
//                             <div className="flex items-center justify-between">
//                               <span className="text-[9px] text-slate-400">
//                                 Network
//                               </span>

//                               <span className="text-[10px] font-bold text-emerald-400">
//                                 {
//                                   hotspotName
//                                 }
//                               </span>
//                             </div>

//                             <div className="mt-2 flex items-center justify-between">
//                               <span className="text-[9px] text-slate-400">
//                                 Status
//                               </span>

//                               <span className="text-[10px] font-bold text-emerald-400">
//                                 Active
//                               </span>
//                             </div>

//                             <div className="mt-2 flex items-center justify-between">
//                               <span className="text-[9px] text-slate-400">
//                                 Connected devices
//                               </span>

//                               <span className="text-[10px] font-bold text-white">
//                                 0
//                               </span>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="mt-2 rounded-lg bg-white/[0.035] px-3 py-2">
//                             <span className="text-[9px] text-slate-400">
//                               Turn hotspot on to share this simulated network.
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* SHARING */}

//                     {quickPanel ===
//                       'sharing' && (
//                       <div>
//                         <p className="text-[11px] font-bold text-white">
//                           Nearby sharing
//                         </p>

//                         <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
//                           Share your portfolio workstation using your browser's native sharing system.
//                         </p>

//                         <button
//                           type="button"
//                           onClick={
//                             shareWorkstation
//                           }
//                           className="
//                             mt-2
//                             flex
//                             w-full
//                             items-center
//                             justify-center
//                             gap-2
//                             rounded-xl
//                             bg-sky-500
//                             px-3
//                             py-2.5
//                             text-[10px]
//                             font-bold
//                             text-slate-950
//                             transition-all
//                             hover:bg-sky-400
//                             active:scale-[0.98]
//                           "
//                         >
//                           <Share2 className="h-3.5 w-3.5" />
//                           Share workstation
//                         </button>

//                         {sharingMessage && (
//                           <p className="mt-2 text-center text-[9px] text-emerald-400">
//                             {
//                               sharingMessage
//                             }
//                           </p>
//                         )}
//                       </div>
//                     )}

//                     {/* CAST */}

//                     {quickPanel ===
//                       'cast' && (
//                       <div>
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-[11px] font-bold text-white">
//                               Cast / Screen share
//                             </p>

//                             <p className="text-[9px] text-slate-500">
//                               Share the workstation screen
//                             </p>
//                           </div>

//                           {castEnabled && (
//                             <span className="flex items-center gap-1 text-[9px] text-emerald-400">
//                               <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
//                               Sharing
//                             </span>
//                           )}
//                         </div>

//                         {castEnabled ? (
//                           <>
//                             <video
//                               ref={
//                                 castVideoRef
//                               }
//                               muted
//                               autoPlay
//                               playsInline
//                               className="
//                                 mt-2
//                                 aspect-video
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-white/10
//                                 bg-black
//                                 object-cover
//                               "
//                             />

//                             <button
//                               type="button"
//                               onClick={
//                                 stopCast
//                               }
//                               className="
//                                 mt-2
//                                 flex
//                                 w-full
//                                 items-center
//                                 justify-center
//                                 gap-2
//                                 rounded-xl
//                                 bg-red-500/15
//                                 px-3
//                                 py-2.5
//                                 text-[10px]
//                                 font-bold
//                                 text-red-300
//                                 transition-all
//                                 hover:bg-red-500/25
//                               "
//                             >
//                               <X className="h-3.5 w-3.5" />
//                               Stop sharing
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 void startCast()
//                               }
//                               className="
//                                 mt-2
//                                 flex
//                                 w-full
//                                 items-center
//                                 justify-center
//                                 gap-2
//                                 rounded-xl
//                                 bg-sky-500
//                                 px-3
//                                 py-2.5
//                                 text-[10px]
//                                 font-bold
//                                 text-slate-950
//                                 transition-all
//                                 hover:bg-sky-400
//                               "
//                             >
//                               <Cast className="h-3.5 w-3.5" />
//                               Choose screen to share
//                             </button>

//                             {castError && (
//                               <p className="mt-2 text-[9px] text-red-300">
//                                 {
//                                   castError
//                                 }
//                               </p>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     )}

//                     {/* PROJECT */}

//                     {quickPanel ===
//                       'project' && (
//                       <div>
//                         <p className="text-[11px] font-bold text-white">
//                           Project to a display
//                         </p>

//                         <p className="mt-1 text-[9px] text-slate-500">
//                           Choose how this simulated workstation uses a second display.
//                         </p>

//                         <div className="mt-2 grid grid-cols-2 gap-1.5">
//                           <OptionButton
//                             active={
//                               projectMode ===
//                               'pc'
//                             }
//                             onClick={() =>
//                               chooseProjectMode(
//                                 'pc',
//                               )
//                             }
//                           >
//                             PC screen only
//                           </OptionButton>

//                           <OptionButton
//                             active={
//                               projectMode ===
//                               'duplicate'
//                             }
//                             onClick={() =>
//                               chooseProjectMode(
//                                 'duplicate',
//                               )
//                             }
//                           >
//                             Duplicate
//                           </OptionButton>

//                           <OptionButton
//                             active={
//                               projectMode ===
//                               'extend'
//                             }
//                             onClick={() =>
//                               chooseProjectMode(
//                                 'extend',
//                               )
//                             }
//                           >
//                             Extend
//                           </OptionButton>

//                           <OptionButton
//                             active={
//                               projectMode ===
//                               'second'
//                             }
//                             onClick={() =>
//                               chooseProjectMode(
//                                 'second',
//                               )
//                             }
//                           >
//                             Second screen
//                           </OptionButton>
//                         </div>

//                         <div className="mt-2 rounded-lg bg-sky-500/5 px-3 py-2">
//                           <span className="text-[9px] text-sky-300">
//                             Current:{' '}
//                             {projectMode ===
//                             'pc'
//                               ? 'PC screen only'
//                               : projectMode ===
//                                   'duplicate'
//                                 ? 'Duplicate displays'
//                                 : projectMode ===
//                                     'extend'
//                                   ? 'Extend desktop'
//                                   : 'Second screen only'}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* =================================================
//                     NETWORK STATUS
//                 ================================================= */}

//                 <div className="mt-3 rounded-xl border border-white/[0.07] bg-black/10 px-3 py-2.5">
//                   <div className="flex items-center justify-between gap-3">
//                     <div className="flex min-w-0 items-center gap-2">
//                       <span
//                         className={`
//                           h-2
//                           w-2
//                           shrink-0
//                           rounded-full
//                           ${
//                             airplaneMode
//                               ? 'bg-amber-400'
//                               : wifiEnabled
//                                 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.7)]'
//                                 : 'bg-slate-600'
//                           }
//                         `}
//                       />

//                       <span className="truncate text-[10px] font-semibold text-slate-300">
//                         {airplaneMode
//                           ? 'Airplane mode enabled'
//                           : wifiEnabled
//                             ? `Connected to ${wifiNetwork}`
//                             : 'No active network'}
//                       </span>
//                     </div>

//                     <span className="shrink-0 font-mono text-[9px] text-slate-600">
//                       {airplaneMode
//                         ? 'RADIOS OFF'
//                         : 'SECURE'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="my-3 h-px bg-white/[0.07]" />

//               {/* =========================================================
//     VOLUME
// ========================================================= */}
// <div className="space-y-2">
//   <div className="flex items-center justify-between">
//     <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
//       {settings.volume > 0 ? (
//         <Volume2 className="h-3.5 w-3.5 text-sky-400" />
//       ) : (
//         <VolumeX className="h-3.5 w-3.5 text-slate-500" />
//       )}

//       <span>Master volume</span>
//     </span>

//     <span className="font-mono text-[10px] font-semibold text-slate-500">
//       {settings.volume}%
//     </span>
//   </div>

//   <div className="flex items-center gap-2">
//     {/* Mute / Unmute */}
//     <button
//       type="button"
//       aria-label={
//         settings.volume > 0
//           ? "Mute volume"
//           : "Unmute volume"
//       }
//       title={
//         settings.volume > 0
//           ? "Mute"
//           : "Unmute"
//       }
//       onClick={() => {
//         playQuickSettingSound();

//         updateSettings({
//           volume:
//             settings.volume > 0
//               ? 0
//               : 70,
//         });
//       }}
//       className="
//         group
//         flex
//         h-8
//         w-8
//         shrink-0
//         items-center
//         justify-center
//         rounded-lg
//         border
//         border-white/[0.07]
//         bg-white/[0.05]
//         text-slate-300
//         shadow-sm
//         transition-all
//         duration-200
//         hover:bg-white/[0.10]
//         hover:text-white
//         active:scale-90
//       "
//     >
//       {settings.volume > 0 ? (
//         <Volume2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
//       ) : (
//         <VolumeX className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:scale-110" />
//       )}
//     </button>

//     {/* Volume Slider */}
//     <div className="relative flex-1">
//       <input
//         type="range"
//         min={0}
//         max={100}
//         step={1}
//         value={settings.volume}
//         onChange={(event) => {
//           updateSettings({
//             volume: Number(event.target.value),
//           });
//         }}
//         aria-label="Master volume"
//         className="
//           quick-range
//           relative
//           z-10
//           h-1.5
//           w-full
//           cursor-pointer
//           appearance-none
//           rounded-full
//           bg-transparent
//           outline-none
//         "
//         style={{
//           background: `linear-gradient(
//             to right,
//             rgb(56 189 248) 0%,
//             rgb(56 189 248) ${settings.volume}%,
//             rgb(51 65 85) ${settings.volume}%,
//             rgb(51 65 85) 100%
//           )`,
//         }}
//       />
//     </div>
//   </div>
// </div>

// {/* =========================================================
//     BRIGHTNESS
// ========================================================= */}
// <div className="mt-4 space-y-2">
//   <div className="flex items-center justify-between">
//     <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
//       <Sun className="h-3.5 w-3.5 text-amber-400" />

//       <span>Screen brightness</span>
//     </span>

//     <span className="font-mono text-[10px] font-semibold text-slate-500">
//       {settings.brightness}%
//     </span>
//   </div>

//   <div className="flex items-center gap-2">
//     {/* Brightness Icon */}
//     <div
//       className="
//         flex
//         h-8
//         w-8
//         shrink-0
//         items-center
//         justify-center
//         rounded-lg
//         border
//         border-amber-400/10
//         bg-amber-500/10
//         shadow-sm
//       "
//     >
//       <Sun
//         className="
//           h-4
//           w-4
//           text-amber-400
//           transition-transform
//           duration-300
//         "
//         style={{
//           transform: `rotate(${settings.brightness * 1.8}deg)`,
//         }}
//       />
//     </div>

//     {/* Brightness Slider */}
//     <div className="relative flex-1">
//       <input
//         type="range"
//         min={30}
//         max={100}
//         step={1}
//         value={settings.brightness}
//         onChange={(event) => {
//           updateSettings({
//             brightness: Number(event.target.value),
//           });
//         }}
//         aria-label="Screen brightness"
//         className="
//           brightness-range
//           relative
//           z-10
//           h-1.5
//           w-full
//           cursor-pointer
//           appearance-none
//           rounded-full
//           bg-transparent
//           outline-none
//         "
//         style={{
//           background: `linear-gradient(
//             to right,
//             rgb(251 191 36) 0%,
//             rgb(251 191 36) ${
//               ((settings.brightness - 30) / 70) * 100
//             }%,
//             rgb(51 65 85) ${
//               ((settings.brightness - 30) / 70) * 100
//             }%,
//             rgb(51 65 85) 100%
//           )`,
//         }}
//       />
//     </div>
//   </div>
// </div>

// {/* =========================================================
//     SLIDER STYLES
// ========================================================= */}
// <style>{`
//   .quick-range::-webkit-slider-runnable-track,
//   .brightness-range::-webkit-slider-runnable-track {
//     height: 6px;
//     border-radius: 9999px;
//     background: transparent;
//   }

//   .quick-range::-webkit-slider-thumb,
//   .brightness-range::-webkit-slider-thumb {
//     appearance: none;
//     -webkit-appearance: none;
//     width: 18px;
//     height: 18px;
//     margin-top: -6px;
//     border-radius: 9999px;
//     cursor: pointer;
//     transition:
//       transform 160ms ease,
//       box-shadow 160ms ease;
//   }

//   .quick-range::-webkit-slider-thumb {
//     background: rgb(56 189 248);
//     border: 2px solid rgb(224 242 254);
//     box-shadow:
//       0 0 0 2px rgba(56, 189, 248, 0.12),
//       0 0 12px rgba(56, 189, 248, 0.45);
//   }

//   .brightness-range::-webkit-slider-thumb {
//     background: rgb(251 191 36);
//     border: 2px solid rgb(255 251 235);
//     box-shadow:
//       0 0 0 2px rgba(251, 191, 36, 0.12),
//       0 0 12px rgba(251, 191, 36, 0.45);
//   }

//   .quick-range::-webkit-slider-thumb:hover,
//   .brightness-range::-webkit-slider-thumb:hover {
//     transform: scale(1.12);
//   }

//   .quick-range::-moz-range-track,
//   .brightness-range::-moz-range-track {
//     height: 6px;
//     border-radius: 9999px;
//     background: transparent;
//   }

//   .quick-range::-moz-range-thumb,
//   .brightness-range::-moz-range-thumb {
//     width: 18px;
//     height: 18px;
//     border-radius: 9999px;
//     cursor: pointer;
//     border: 2px solid white;
//   }

//   .quick-range::-moz-range-thumb {
//     background: rgb(56 189 248);
//     box-shadow:
//       0 0 0 2px rgba(56, 189, 248, 0.12),
//       0 0 12px rgba(56, 189, 248, 0.45);
//   }

//   .brightness-range::-moz-range-thumb {
//     background: rgb(251 191 36);
//     box-shadow:
//       0 0 0 2px rgba(251, 191, 36, 0.12),
//       0 0 12px rgba(251, 191, 36, 0.45);
//   }

//   .quick-range:focus-visible::-webkit-slider-thumb {
//     box-shadow:
//       0 0 0 3px rgba(56, 189, 248, 0.22),
//       0 0 14px rgba(56, 189, 248, 0.55);
//   }

//   .brightness-range:focus-visible::-webkit-slider-thumb {
//     box-shadow:
//       0 0 0 3px rgba(251, 191, 36, 0.22),
//       0 0 14px rgba(251, 191, 36, 0.55);
//   }
// `}</style>

//                 {/* =================================================
//                     MINI CONTROLS
//                 ================================================= */}

//                 <div className="mt-4 grid grid-cols-2 gap-2">
//                   {/* SOUND */}

//                   <button
//                     type="button"
//                     onClick={() => {
//                       playQuickSettingSound();

//                       updateSettings({
//                         soundEffects:
//                           !settings.soundEffects,
//                       });
//                     }}
//                     className={`
//                       group
//                       flex
//                       items-center
//                       justify-between
//                       rounded-xl
//                       border
//                       px-3
//                       py-2.5
//                       text-left
//                       transition-all
//                       duration-200
//                       active:scale-[0.98]
//                       ${
//                         settings.soundEffects
//                           ? 'border-sky-400/40 bg-sky-500/10'
//                           : 'border-white/[0.07] bg-white/[0.035] hover:bg-white/[0.06]'
//                       }
//                     `}
//                   >
//                     <span className="flex items-center gap-2">
//                       {settings.soundEffects ? (
//                         <Volume2 className="h-3.5 w-3.5 text-sky-400" />
//                       ) : (
//                         <VolumeX className="h-3.5 w-3.5 text-slate-500" />
//                       )}

//                       <span className="text-[10px] font-semibold text-slate-300">
//                         Sound FX
//                       </span>
//                     </span>

//                     <span
//                       className={`
//                         h-1.5
//                         w-1.5
//                         rounded-full
//                         ${
//                           settings.soundEffects
//                             ? 'bg-emerald-400'
//                             : 'bg-slate-600'
//                         }
//                       `}
//                     />
//                   </button>

//                   {/* FOCUS */}

//                   <button
//                     type="button"
//                     onClick={() => {
//                       playQuickSettingSound();

//                       updateSettings({
//                         focusMode:
//                           !settings.focusMode,
//                       });
//                     }}
//                     className={`
//                       group
//                       flex
//                       items-center
//                       justify-between
//                       rounded-xl
//                       border
//                       px-3
//                       py-2.5
//                       text-left
//                       transition-all
//                       duration-200
//                       active:scale-[0.98]
//                       ${
//                         settings.focusMode
//                           ? 'border-purple-400/40 bg-purple-500/10'
//                           : 'border-white/[0.07] bg-white/[0.035] hover:bg-white/[0.06]'
//                       }
//                     `}
//                   >
//                     <span className="flex items-center gap-2">
//                       <Sparkles
//                         className={`
//                           h-3.5
//                           w-3.5
//                           ${
//                             settings.focusMode
//                               ? 'text-purple-400'
//                               : 'text-slate-500'
//                           }
//                         `}
//                       />

//                       <span className="text-[10px] font-semibold text-slate-300">
//                         Focus mode
//                       </span>
//                     </span>

//                     <span
//                       className={`
//                         h-1.5
//                         w-1.5
//                         rounded-full
//                         ${
//                           settings.focusMode
//                             ? 'bg-purple-400'
//                             : 'bg-slate-600'
//                         }
//                       `}
//                     />
//                   </button>
//                 </div>

//                 {/* =================================================
//                     DEVICE STATUS
//                 ================================================= */}

//                 <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
//                   <div className="grid grid-cols-3 gap-3">
//                     <div>
//                       <p className="text-[8px] uppercase tracking-wider text-slate-600">
//                         Battery
//                       </p>

//                       <p className="mt-0.5 text-[11px] font-semibold text-slate-300">
//                         98%
//                       </p>
//                     </div>

//                     <div>
//                       <p className="text-[8px] uppercase tracking-wider text-slate-600">
//                         Power
//                       </p>

//                       <p className="mt-0.5 text-[11px] font-semibold text-emerald-400">
//                         {energySaver
//                           ? 'Saving'
//                           : 'Plugged in'}
//                       </p>
//                     </div>

//                     <div>
//                       <p className="text-[8px] uppercase tracking-wider text-slate-600">
//                         System
//                       </p>

//                       <p className="mt-0.5 text-[11px] font-semibold text-sky-400">
//                         Healthy
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* =================================================
//                     FOOTER
//                 ================================================= */}

//                 <div className="mt-3 flex items-center justify-between gap-3">
//                   <div className="flex min-w-0 items-center gap-1.5">
//                     <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

//                     <span className="truncate text-[9px] text-slate-600">
//                       Abhishek OS • All systems operational
//                     </span>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowVolumePopup(
//                         false,
//                       );
//                       openApp(
//                         'settings',
//                       );
//                     }}
//                     className="
//                       flex
//                       shrink-0
//                       items-center
//                       gap-1
//                       rounded-lg
//                       px-2
//                       py-1
//                       text-[10px]
//                       font-semibold
//                       text-sky-400
//                       transition-all
//                       duration-200
//                       hover:bg-sky-500/10
//                       hover:text-sky-300
//                     "
//                   >
//                     <span>
//                       All settings
//                     </span>

//                     <ChevronRight className="h-3 w-3" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* =====================================================
//             VIRTUAL KEYBOARD
//         ===================================================== */}

//         <VirtualKeyboard
//           isOpen={showKeyboard}
//           onClose={() =>
//             setShowKeyboard(
//               false,
//             )
//           }
//           onKeyPress={
//             pressVirtualKey
//           }
//         />
//       </footer>

//       {/* =======================================================
//           ANIMATIONS + VISUAL EFFECTS
//       ======================================================= */}

//       <style>
//         {`
//           @keyframes quickSettingsIn {
//             0% {
//               opacity: 0;
//               transform: translateY(14px) scale(.96);
//               filter: blur(5px);
//             }

//             55% {
//               opacity: 1;
//               transform: translateY(-2px) scale(1.005);
//               filter: blur(0);
//             }

//             100% {
//               opacity: 1;
//               transform: translateY(0) scale(1);
//               filter: blur(0);
//             }
//           }

//           @keyframes quickSubPanelIn {
//             0% {
//               opacity: 0;
//               transform: translateY(-5px) scale(.985);
//             }

//             100% {
//               opacity: 1;
//               transform: translateY(0) scale(1);
//             }
//           }

//           @keyframes taskbarPopupIn {
//             0% {
//               opacity: 0;
//               transform: translate(-50%, 10px) scale(.97);
//             }

//             100% {
//               opacity: 1;
//               transform: translate(-50%, 0) scale(1);
//             }
//           }

//           /* ---------------------------------------------
//              RANGE INPUTS
//           --------------------------------------------- */

//           .quick-range,
//           .brightness-range {
//             background:
//               linear-gradient(
//                 to right,
//                 #38bdf8 0%,
//                 #38bdf8 50%,
//                 #334155 50%,
//                 #334155 100%
//               );
//           }

//           .quick-range::-webkit-slider-thumb,
//           .brightness-range::-webkit-slider-thumb {
//             appearance: none;
//             width: 15px;
//             height: 15px;
//             border-radius: 9999px;
//             background: #e2e8f0;
//             border: 2px solid #38bdf8;
//             box-shadow:
//               0 0 0 3px rgba(56,189,248,.08);
//             transition:
//               transform .15s ease,
//               box-shadow .15s ease;
//           }

//           .brightness-range::-webkit-slider-thumb {
//             border-color: #f59e0b;
//           }

//           .quick-range::-webkit-slider-thumb:hover,
//           .brightness-range::-webkit-slider-thumb:hover {
//             transform: scale(1.15);
//             box-shadow:
//               0 0 0 5px rgba(56,189,248,.12);
//           }

//           .quick-range::-moz-range-thumb,
//           .brightness-range::-moz-range-thumb {
//             width: 15px;
//             height: 15px;
//             border-radius: 9999px;
//             background: #e2e8f0;
//             border: 2px solid #38bdf8;
//             box-shadow:
//               0 0 0 3px rgba(56,189,248,.08);
//           }

//           .brightness-range::-moz-range-thumb {
//             border-color: #f59e0b;
//           }

//           /* ---------------------------------------------
//              ACCESSIBILITY
//           --------------------------------------------- */

//           #abhishek-workstation-os.os-accessibility-mode {
//             text-rendering: optimizeLegibility;
//           }

//           #abhishek-workstation-os.os-large-text {
//             --os-text-scale: 1.06;
//           }

//           #abhishek-workstation-os.os-large-text
//           button,
//           #abhishek-workstation-os.os-large-text
//           input,
//           #abhishek-workstation-os.os-large-text
//           textarea {
//             font-size: calc(100% * var(--os-text-scale, 1));
//           }

//           #abhishek-workstation-os.os-high-contrast {
//             filter:
//               contrast(1.12)
//               saturate(1.08);
//           }

//           #abhishek-workstation-os.os-energy-saver
//           .animate-pulse {
//             animation-duration: 3s !important;
//           }

//           #abhishek-workstation-os.os-energy-saver
//           .animate-spin {
//             animation-duration: 5s !important;
//           }

//           #abhishek-workstation-os.os-energy-saver {
//             filter: brightness(.94);
//           }

//           #abhishek-workstation-os.os-focus-mode
//           [data-non-focus="true"] {
//             opacity: .35;
//           }

//           /* ---------------------------------------------
//              REDUCED MOTION
//           --------------------------------------------- */

//           #abhishek-workstation-os.os-reduced-motion *,
//           #abhishek-workstation-os.os-reduced-motion
//           *::before,
//           #abhishek-workstation-os.os-reduced-motion
//           *::after {
//             animation-duration: .001ms !important;
//             animation-iteration-count: 1 !important;
//             transition-duration: .001ms !important;
//             scroll-behavior: auto !important;
//           }

//           @media (prefers-reduced-motion: reduce) {
//             *,
//             *::before,
//             *::after {
//               animation-duration: .001ms !important;
//               animation-iteration-count: 1 !important;
//               transition-duration: .001ms !important;
//               scroll-behavior: auto !important;
//             }
//           }

//           /* ---------------------------------------------
//              MOBILE
//           --------------------------------------------- */

//           @media (max-width: 640px) {
//             .desktop-overview {
//               bottom: 58px;
//             }
//           }
//         `}
//       </style>
//     </>
//   );
// };


import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useOS } from '../../context/OSContext';
import { AppId, TaskbarApp } from '../../types';
import { AppIcon } from '../ui/AppIcon';

import {
  Accessibility,
  Airplay,
  Battery,
  Bell,
  Bluetooth,
  Captions,
  Cast,
  Check,
  ChevronDown,
  ChevronRight,
  CloudSun,
  House,
  Keyboard,
  LayoutDashboard,
  Maximize2,
  Minimize2,
  Moon,
  MonitorUp,
  Plus,
  Search,
  Share2,
  Sparkles,
  Sun,
  Trash2,
  Volume2,
  VolumeX,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import VirtualKeyboard from './VirtualKeyboard';

/* =========================================================
   TYPES
========================================================= */

type QuickSettingId =
  | 'wifi'
  | 'bluetooth'
  | 'airplane'
  | 'accessibility'
  | 'energy'
  | 'captions'
  | 'nightLight'
  | 'hotspot'
  | 'sharing'
  | 'cast'
  | 'project';

type QuickPanel =
  | 'none'
  | QuickSettingId;

type ProjectMode =
  | 'pc'
  | 'duplicate'
  | 'extend'
  | 'second';

interface QuickSettingTileProps {
  id: QuickSettingId;
  label: string;
  icon: React.ElementType;
  active: boolean;
  subtitle?: string;
  disabled?: boolean;
  onClick: () => void;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult:
    | ((event: any) => void)
    | null;
  onend:
    | (() => void)
    | null;
  onerror:
    | (() => void)
    | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

/* =========================================================
   PERSISTENT STATE
========================================================= */

function usePersistentState<T>(
  key: string,
  initialValue: T,
): [
  T,
  React.Dispatch<React.SetStateAction<T>>,
] {
  const [value, setValue] =
    useState<T>(() => {
      try {
        const stored =
          window.localStorage.getItem(key);

        if (stored !== null) {
          return JSON.parse(stored) as T;
        }
      } catch {
        // Ignore storage failures.
      }

      return initialValue;
    });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        key,
        JSON.stringify(value),
      );
    } catch {
      // Ignore storage failures.
    }
  }, [key, value]);

  return [value, setValue];
}

/* =========================================================
   QUICK SETTING TILE
========================================================= */

const QuickSettingTile: React.FC<
  QuickSettingTileProps
> = ({
  id,
  label,
  icon: Icon,
  active,
  subtitle,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      data-quick-setting={id}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      className={`
        group
        relative
        min-h-[74px]
        overflow-hidden
        rounded-xl
        border
        px-2.5
        py-2
        text-left
        transition-all
        duration-200
        ease-out
        active:scale-[0.97]
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-sky-400/80
        ${
          active
            ? 'border-sky-300/60 bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
            : 'border-white/[0.09] bg-white/[0.055] text-slate-200 hover:border-white/[0.16] hover:bg-white/[0.09]'
        }
        ${
          disabled
            ? 'cursor-not-allowed opacity-45'
            : 'cursor-pointer'
        }
      `}
    >
      <span
        className={`
          absolute
          inset-x-0
          top-0
          h-px
          transition-opacity
          duration-300
          ${
            active
              ? 'bg-white/80 opacity-100'
              : 'bg-white/20 opacity-0 group-hover:opacity-100'
          }
        `}
      />

      <span className="flex items-start justify-between gap-2">
        <span
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            transition-all
            duration-200
            ${
              active
                ? 'bg-white/20'
                : 'bg-slate-950/20 group-hover:bg-white/[0.08]'
            }
          `}
        >
          <Icon
            className={`
              h-4
              w-4
              transition-transform
              duration-200
              group-hover:scale-110
              ${
                active
                  ? 'text-slate-950'
                  : 'text-slate-200'
              }
            `}
          />
        </span>

        {active && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-950/15">
            <Check className="h-2.5 w-2.5" />
          </span>
        )}
      </span>

      <span
        className={`
          mt-1.5
          block
          truncate
          text-[10px]
          font-semibold
          leading-tight
          ${
            active
              ? 'text-slate-950'
              : 'text-slate-200'
          }
        `}
      >
        {label}
      </span>

      {subtitle && (
        <span
          className={`
            mt-0.5
            block
            truncate
            text-[8px]
            ${
              active
                ? 'text-slate-950/65'
                : 'text-slate-500'
            }
          `}
        >
          {subtitle}
        </span>
      )}
    </button>
  );
};

/* =========================================================
   SMALL OPTION BUTTON
========================================================= */

interface OptionButtonProps {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

const OptionButton: React.FC<
  OptionButtonProps
> = ({
  active = false,
  children,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        justify-between
        rounded-xl
        border
        px-3
        py-2.5
        text-left
        transition-all
        duration-200
        active:scale-[0.98]
        ${
          active
            ? 'border-sky-400/40 bg-sky-500/15 text-sky-300'
            : 'border-white/[0.07] bg-white/[0.035] text-slate-300 hover:bg-white/[0.07]'
        }
      `}
    >
      <span className="text-[10px] font-semibold">
        {children}
      </span>

      {active && (
        <Check className="h-3.5 w-3.5 text-sky-400" />
      )}
    </button>
  );
};

/* =========================================================
   TASKBAR
========================================================= */

export const Taskbar: React.FC = () => {
  const {
    windows,
    activeWindowId,
    openApp,
    minimizeWindow,
    focusWindow,

    isStartMenuOpen,
    setStartMenuOpen,

    isSearchOpen,
    setSearchOpen,

    isNotificationCenterOpen,
    setNotificationCenterOpen,

    notifications,

    settings,
    updateSettings,
    playSystemSound,

    desktops,
    activeDesktopId,
    switchDesktop,
    createDesktop,
    deleteDesktop,
    moveWindowToDesktop,

    isDesktopOverviewOpen,
    setDesktopOverviewOpen,

    taskbarApps,
    reorderTaskbarApps,

    openContextMenu,
    goHome,
  } = useOS();

  /* =======================================================
     CLOCK
  ======================================================= */

  const [timeStr, setTimeStr] =
    useState('');

  const [dateStr, setDateStr] =
    useState('');

  /* =======================================================
     POPUPS
  ======================================================= */

  const [
    showVolumePopup,
    setShowVolumePopup,
  ] = useState(false);

  const [
    draggedAppId,
    setDraggedAppId,
  ] = useState<AppId | null>(null);

  const [
    showKeyboard,
    setShowKeyboard,
  ] = useState(false);

  const [
    isFullscreen,
    setIsFullscreen,
  ] = useState(false);

  const [
    quickPanel,
    setQuickPanel,
  ] = useState<QuickPanel>('none');

  /* =======================================================
     QUICK SETTINGS
  ======================================================= */

  const [
    wifiEnabled,
    setWifiEnabled,
  ] = usePersistentState(
    'abhishek-os-wifi',
    true,
  );

  const [
    bluetoothEnabled,
    setBluetoothEnabled,
  ] = usePersistentState(
    'abhishek-os-bluetooth',
    false,
  );

  const [
    airplaneMode,
    setAirplaneMode,
  ] = usePersistentState(
    'abhishek-os-airplane',
    false,
  );

  const [
    accessibilityEnabled,
    setAccessibilityEnabled,
  ] = usePersistentState(
    'abhishek-os-accessibility',
    false,
  );

  const [
    largeText,
    setLargeText,
  ] = usePersistentState(
    'abhishek-os-large-text',
    false,
  );

  const [
    highContrast,
    setHighContrast,
  ] = usePersistentState(
    'abhishek-os-high-contrast',
    false,
  );

  const [
    reduceMotion,
    setReduceMotion,
  ] = usePersistentState(
    'abhishek-os-reduce-motion',
    false,
  );

  const [
    energySaver,
    setEnergySaver,
  ] = usePersistentState(
    'abhishek-os-energy-saver',
    false,
  );

  const [
    liveCaptions,
    setLiveCaptions,
  ] = usePersistentState(
    'abhishek-os-live-captions',
    false,
  );

  const [
    nightLight,
    setNightLight,
  ] = usePersistentState(
    'abhishek-os-night-light',
    false,
  );

  const [
    mobileHotspot,
    setMobileHotspot,
  ] = usePersistentState(
    'abhishek-os-hotspot',
    false,
  );

  const [
    nearbySharing,
    setNearbySharing,
  ] = usePersistentState(
    'abhishek-os-nearby-sharing',
    false,
  );

  const [
    castEnabled,
    setCastEnabled,
  ] = useState(false);

  const [
    projectEnabled,
    setProjectEnabled,
  ] = usePersistentState(
    'abhishek-os-project-enabled',
    false,
  );

  const [
    projectMode,
    setProjectMode,
  ] = usePersistentState<ProjectMode>(
    'abhishek-os-project-mode',
    'pc',
  );

  const [
    wifiNetwork,
    setWifiNetwork,
  ] = usePersistentState(
    'abhishek-os-wifi-network',
    'Airtel_Abhishek',
  );

  const [
    bluetoothDevice,
    setBluetoothDevice,
  ] = usePersistentState(
    'abhishek-os-bluetooth-device',
    '',
  );

  const [
    hotspotName,
    setHotspotName,
  ] = usePersistentState(
    'abhishek-os-hotspot-name',
    'Abhishek-Hotspot',
  );

  const [
    captionText,
    setCaptionText,
  ] = useState('');

  const [
    castError,
    setCastError,
  ] = useState('');

  const [
    sharingMessage,
    setSharingMessage,
  ] = useState('');

  const [
    locationStatus,
    setLocationStatus,
  ] = useState('');

  const castStreamRef =
    useRef<MediaStream | null>(null);

  const captionRecognitionRef =
    useRef<SpeechRecognitionLike | null>(
      null,
    );

  const focusedEditable =
    useRef<HTMLElement | null>(null);

  const castVideoRef =
    useRef<HTMLVideoElement | null>(null);

  /* =======================================================
     FULLSCREEN
  ======================================================= */

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreen(
        Boolean(document.fullscreenElement),
      );
    };

    document.addEventListener(
      'fullscreenchange',
      syncFullscreenState,
    );

    syncFullscreenState();

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        syncFullscreenState,
      );
    };
  }, []);

  const toggleFullscreen =
    async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          return;
        }

        const desktopRoot =
          document.getElementById(
            'abhishek-workstation-os',
          );

        if (!desktopRoot) {
          throw new Error(
            'Desktop root is unavailable',
          );
        }

        await desktopRoot.requestFullscreen();
      } catch (error) {
        console.error(
          'Unable to toggle desktop fullscreen:',
          error,
        );
      }
    };

  /* =======================================================
     LIVE CLOCK
  ======================================================= */

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTimeStr(
        now.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      );

      setDateStr(
        now.toLocaleDateString([], {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        }),
      );
    };

    updateTime();

    const interval =
      window.setInterval(
        updateTime,
        1000,
      );

    return () =>
      window.clearInterval(interval);
  }, []);

  /* =======================================================
     SYSTEM VISUAL EFFECTS
  ======================================================= */

  useEffect(() => {
    const root =
      document.getElementById(
        'abhishek-workstation-os',
      );

    if (!root) {
      return;
    }

    root.classList.toggle(
      'os-accessibility-mode',
      accessibilityEnabled,
    );

    root.classList.toggle(
      'os-large-text',
      largeText,
    );

    root.classList.toggle(
      'os-high-contrast',
      highContrast,
    );

    root.classList.toggle(
      'os-reduced-motion',
      reduceMotion,
    );

    root.classList.toggle(
      'os-energy-saver',
      energySaver,
    );

    root.classList.toggle(
      'os-focus-mode',
      settings.focusMode,
    );

    return () => {
      root.classList.remove(
        'os-accessibility-mode',
        'os-large-text',
        'os-high-contrast',
        'os-reduced-motion',
        'os-energy-saver',
        'os-focus-mode',
      );
    };
  }, [
    accessibilityEnabled,
    largeText,
    highContrast,
    reduceMotion,
    energySaver,
    settings.focusMode,
  ]);

  /* =======================================================
     NIGHT LIGHT
  ======================================================= */

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--os-night-light',
      nightLight ? '1' : '0',
    );

    return () => {
      document.documentElement.style.removeProperty(
        '--os-night-light',
      );
    };
  }, [nightLight]);

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const unreadCount =
    notifications.filter(
      notification =>
        !notification.read,
    ).length;

  /* =======================================================
     APP CLICK
  ======================================================= */

  const handleAppClick = (
    appId: AppId,
  ) => {
    const existing =
      windows.find(
        window =>
          window.appId === appId &&
          window.desktopId ===
            activeDesktopId,
      );

    if (!existing) {
      openApp(appId);
      return;
    }

    if (
      activeWindowId === existing.id &&
      !existing.isMinimized
    ) {
      minimizeWindow(existing.id);
    } else {
      focusWindow(existing.id);
    }
  };

  const isAppRunning = (
    appId: AppId,
  ) =>
    windows.some(
      window =>
        window.appId === appId &&
        window.desktopId ===
          activeDesktopId,
    );

  const isAppFocused = (
    appId: AppId,
  ) =>
    windows.some(
      window =>
        window.appId === appId &&
        window.id === activeWindowId &&
        !window.isMinimized,
    );

  /* =======================================================
     TASKBAR APPS
  ======================================================= */

  const visibleApps: TaskbarApp[] = [
    ...taskbarApps,

    ...windows
      .filter(
        window =>
          window.desktopId ===
            activeDesktopId &&
          !taskbarApps.some(
            app =>
              app.appId ===
              window.appId,
          ),
      )
      .map(window => ({
        appId: window.appId,
        title: window.title,
        icon: window.iconName,
      }))
      .filter(
        (app, index, list) =>
          list.findIndex(
            item =>
              item.appId ===
              app.appId,
          ) === index,
      ),
  ];

  /* =======================================================
     SOUND
  ======================================================= */

  const playQuickSettingSound =
    () => {
      try {
        playSystemSound('click');
      } catch {
        // Keep UI functional.
      }
    };

  /* =======================================================
     WIFI
  ======================================================= */

  const toggleWifi = () => {
    playQuickSettingSound();

    if (airplaneMode) {
      setAirplaneMode(false);
      setWifiEnabled(true);
      return;
    }

    setWifiEnabled(
      previous => {
        const next = !previous;

        if (!next) {
          setMobileHotspot(false);
        }

        return next;
      },
    );

    setQuickPanel(
      'wifi',
    );
  };

  const connectWifi = (
    network: string,
  ) => {
    playQuickSettingSound();
    setWifiNetwork(network);
    setWifiEnabled(true);
    setAirplaneMode(false);
    setMobileHotspot(false);
  };

  /* =======================================================
     BLUETOOTH
  ======================================================= */

  const toggleBluetooth = () => {
    playQuickSettingSound();

    if (airplaneMode) {
      setAirplaneMode(false);
      setBluetoothEnabled(true);
      return;
    }

    setBluetoothEnabled(
      previous => {
        const next = !previous;

        if (!next) {
          setBluetoothDevice('');
        }

        return next;
      },
    );

    setQuickPanel(
      'bluetooth',
    );
  };

  const connectBluetooth =
    (device: string) => {
      playQuickSettingSound();
      setBluetoothDevice(device);
      setBluetoothEnabled(true);
      setAirplaneMode(false);
    };

  /* =======================================================
     AIRPLANE MODE
  ======================================================= */

  const toggleAirplane = () => {
    playQuickSettingSound();

    setAirplaneMode(
      previous => {
        const next = !previous;

        if (next) {
          setWifiEnabled(false);
          setBluetoothEnabled(false);
          setMobileHotspot(false);
          setQuickPanel('airplane');
        }

        return next;
      },
    );
  };

  /* =======================================================
     ACCESSIBILITY
  ======================================================= */

  const toggleAccessibility =
    () => {
      playQuickSettingSound();

      setAccessibilityEnabled(
        previous => {
          const next = !previous;

          if (next) {
            setLargeText(true);
          }

          return next;
        },
      );

      setQuickPanel(
        'accessibility',
      );
    };

  /* =======================================================
     ENERGY SAVER
  ======================================================= */

  const toggleEnergySaver =
    () => {
      playQuickSettingSound();

      setEnergySaver(
        previous => !previous,
      );

      setQuickPanel(
        'energy',
      );
    };

  /* =======================================================
     LIVE CAPTIONS
  ======================================================= */

  const stopCaptionRecognition =
    () => {
      try {
        captionRecognitionRef.current?.stop();
      } catch {
        // Ignore stop failures.
      }

      captionRecognitionRef.current =
        null;
    };

  const startCaptionRecognition =
    () => {
      const Recognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (!Recognition) {
        setCaptionText(
          'Live captions are enabled. Speech recognition is not supported by this browser.',
        );
        return;
      }

      stopCaptionRecognition();

      const recognition =
        new Recognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang =
        navigator.language || 'en-US';

      recognition.onresult =
        event => {
          let text = '';

          for (
            let i =
              event.resultIndex || 0;
            i < event.results.length;
            i += 1
          ) {
            text +=
              event.results[i][0]
                ?.transcript || '';
          }

          if (text.trim()) {
            setCaptionText(
              text.trim(),
            );
          }
        };

      recognition.onerror = () => {
        setCaptionText(
          'Live captions is active. Microphone recognition is unavailable.',
        );
      };

      recognition.onend = () => {
        if (liveCaptions) {
          try {
            recognition.start();
          } catch {
            // Browser may reject rapid restarts.
          }
        }
      };

      try {
        recognition.start();
        captionRecognitionRef.current =
          recognition;
        setCaptionText(
          'Listening for speech…',
        );
      } catch {
        setCaptionText(
          'Unable to start live captions.',
        );
      }
    };

  const toggleLiveCaptions =
    () => {
      playQuickSettingSound();

      setLiveCaptions(
        previous => {
          const next = !previous;

          if (!next) {
            stopCaptionRecognition();
            setCaptionText('');
          }

          return next;
        },
      );

      setQuickPanel(
        'captions',
      );
    };

  useEffect(() => {
    if (liveCaptions) {
      startCaptionRecognition();
    } else {
      stopCaptionRecognition();
      setCaptionText('');
    }

    return () => {
      stopCaptionRecognition();
    };

    // Intentionally only react to the setting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveCaptions]);

  /* =======================================================
     NIGHT LIGHT
  ======================================================= */

  const toggleNightLight =
    () => {
      playQuickSettingSound();

      setNightLight(
        previous => !previous,
      );

      setQuickPanel(
        'nightLight',
      );
    };

  /* =======================================================
     HOTSPOT
  ======================================================= */

  const toggleHotspot =
    () => {
      playQuickSettingSound();

      if (airplaneMode) {
        setAirplaneMode(false);
        setWifiEnabled(true);
      }

      setMobileHotspot(
        previous => !previous,
      );

      setQuickPanel(
        'hotspot',
      );
    };

  /* =======================================================
     NEARBY SHARING
  ======================================================= */

  const toggleNearbySharing =
    () => {
      playQuickSettingSound();

      setNearbySharing(
        previous => !previous,
      );

      setQuickPanel(
        'sharing',
      );
    };

  const shareWorkstation =
    async () => {
      playQuickSettingSound();

      const shareData = {
        title: 'Abhishek OS',
        text: 'Check out my interactive portfolio workstation.',
        url: window.location.href,
      };

      try {
        if (
          navigator.share
        ) {
          await navigator.share(
            shareData,
          );

          setSharingMessage(
            'Shared successfully.',
          );
        } else {
          await navigator.clipboard.writeText(
            window.location.href,
          );

          setSharingMessage(
            'Workstation link copied to clipboard.',
          );
        }
      } catch {
        setSharingMessage(
          'Sharing cancelled.',
        );
      }
    };

  /* =======================================================
     CAST / SCREEN SHARE
  ======================================================= */

  const stopCast =
    () => {
      castStreamRef.current
        ?.getTracks()
        .forEach(track =>
          track.stop(),
        );

      castStreamRef.current =
        null;

      setCastEnabled(false);

      if (
        castVideoRef.current
      ) {
        castVideoRef.current.srcObject =
          null;
      }
    };

  const startCast =
    async () => {
      playQuickSettingSound();
      setCastError('');

      if (
        !navigator.mediaDevices?.getDisplayMedia
      ) {
        setCastError(
          'Screen sharing is not supported in this browser.',
        );
        return;
      }

      try {
        const stream =
          await navigator.mediaDevices.getDisplayMedia(
            {
              video: true,
              audio: true,
            },
          );

        castStreamRef.current =
          stream;

        setCastEnabled(true);
        setQuickPanel('cast');

        const videoTrack =
          stream.getVideoTracks()[0];

        videoTrack?.addEventListener(
          'ended',
          () => {
            stopCast();
          },
        );
      } catch (error) {
        console.error(
          'Cast/share error:',
          error,
        );

        setCastError(
          'Screen sharing was cancelled or unavailable.',
        );

        setCastEnabled(false);
      }
    };

  const toggleCast =
    async () => {
      if (castEnabled) {
        stopCast();
        setQuickPanel('cast');
        return;
      }

      await startCast();
    };

  useEffect(() => {
    if (
      castVideoRef.current &&
      castStreamRef.current
    ) {
      castVideoRef.current.srcObject =
        castStreamRef.current;
      castVideoRef.current
        .play()
        .catch(() => undefined);
    }
  }, [
    castEnabled,
    quickPanel,
  ]);

  useEffect(() => {
    return () => {
      castStreamRef.current
        ?.getTracks()
        .forEach(track =>
          track.stop(),
        );
    };
  }, []);

  /* =======================================================
     PROJECT
  ======================================================= */

  const toggleProject =
    () => {
      playQuickSettingSound();

      if (projectEnabled) {
        setProjectEnabled(false);
        setProjectMode('pc');
      } else {
        setProjectEnabled(true);
        setProjectMode('duplicate');
      }

      setQuickPanel(
        'project',
      );
    };

  const chooseProjectMode =
    (mode: ProjectMode) => {
      playQuickSettingSound();

      setProjectMode(mode);

      if (mode === 'pc') {
        setProjectEnabled(false);
      } else {
        setProjectEnabled(true);
      }
    };

  /* =======================================================
     OPEN / CLOSE PANELS
  ======================================================= */

  const closeOtherPanels =
    () => {
      setStartMenuOpen(false);
      setSearchOpen(false);
      setNotificationCenterOpen(false);
      setDesktopOverviewOpen(false);
    };

  const openQuickPanel = (
    panel: QuickPanel,
  ) => {
    closeOtherPanels();

    setShowVolumePopup(true);
    setQuickPanel(panel);
  };

  /* =======================================================
     VIRTUAL KEYBOARD
  ======================================================= */

  const pressVirtualKey =
    (key: string) => {
      const active =
        document.activeElement as
          | HTMLElement
          | null;

      if (
        active?.tagName === 'INPUT' ||
        active?.tagName === 'TEXTAREA' ||
        active?.isContentEditable
      ) {
        focusedEditable.current =
          active;
      }

      const target =
        focusedEditable.current;

      if (
        !target ||
        !target.isConnected ||
        !(
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        )
      ) {
        return;
      }

      target.focus();

      if (
        target instanceof
          HTMLInputElement ||
        target instanceof
          HTMLTextAreaElement
      ) {
        if (key === 'Enter') {
          target.dispatchEvent(
            new KeyboardEvent(
              'keydown',
              {
                key,
                bubbles: true,
                cancelable: true,
              },
            ),
          );

          target.dispatchEvent(
            new KeyboardEvent(
              'keyup',
              {
                key,
                bubbles: true,
              },
            ),
          );

          return;
        }

        const value =
          target.value;

        let start =
          target.selectionStart ??
          value.length;

        const end =
          target.selectionEnd ??
          start;

        if (
          key === 'Backspace' &&
          start === end &&
          start > 0
        ) {
          start -= 1;
        }

        const inserted =
          key === 'Backspace'
            ? ''
            : key;

        const nextValue =
          value.slice(0, start) +
          inserted +
          value.slice(end);

        const descriptor =
          Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(
              target,
            ),
            'value',
          );

        descriptor?.set?.call(
          target,
          nextValue,
        );

        const caret =
          start +
          inserted.length;

        target.setSelectionRange(
          caret,
          caret,
        );

        target.dispatchEvent(
          new InputEvent('input', {
            bubbles: true,
            inputType:
              key === 'Backspace'
                ? 'deleteContentBackward'
                : 'insertText',
            data:
              inserted || null,
          }),
        );

        return;
      }

      const selection =
        window.getSelection();

      if (!selection) {
        return;
      }

      const range =
        selection.rangeCount
          ? selection.getRangeAt(0)
          : document.createRange();

      if (
        !target.contains(
          range.commonAncestorContainer,
        )
      ) {
        range.selectNodeContents(
          target,
        );

        range.collapse(false);
      }

      if (
        key === 'Backspace' &&
        range.collapsed
      ) {
        const container =
          range.startContainer;

        if (
          range.startOffset > 0
        ) {
          range.setStart(
            container,
            range.startOffset - 1,
          );
        }
      }

      range.deleteContents();

      if (key !== 'Backspace') {
        const text =
          document.createTextNode(
            key === 'Enter'
              ? '\n'
              : key,
          );

        range.insertNode(text);
        range.setStartAfter(text);
      }

      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);

      target.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          inputType:
            key === 'Backspace'
              ? 'deleteContentBackward'
              : 'insertText',
          data:
            key === 'Backspace'
              ? null
              : key,
        }),
      );
    };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* =====================================================
          DISPLAY EFFECTS
      ===================================================== */}

      {nightLight && (
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            fixed
            inset-0
            z-[8990]
            bg-orange-300/[0.12]
            mix-blend-soft-light
            backdrop-blur-[0.1px]
          "
        />
      )}

      {settings.brightness < 100 && (
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            fixed
            inset-0
            z-[8991]
            bg-black
          "
          style={{
            opacity:
              Math.max(
                0,
                100 -
                  settings.brightness,
              ) / 140,
          }}
        />
      )}

      {settings.focusMode && (
        <div
          className="
            pointer-events-none
            fixed
            left-1/2
            top-3
            z-[8995]
            -translate-x-1/2
            rounded-full
            border
            border-purple-400/30
            bg-purple-950/70
            px-3
            py-1
            text-[9px]
            font-semibold
            tracking-wide
            text-purple-300
            shadow-lg
            backdrop-blur-xl
          "
        >
          ✦ Focus mode active
        </div>
      )}

      {liveCaptions && (
        <div
          className="
            pointer-events-none
            fixed
            bottom-16
            left-1/2
            z-[8996]
            w-[min(720px,calc(100vw-24px))]
            -translate-x-1/2
            rounded-xl
            border
            border-white/10
            bg-black/85
            px-4
            py-3
            text-center
            text-sm
            font-medium
            text-white
            shadow-2xl
            backdrop-blur-xl
          "
        >
          {captionText ||
            'Live captions enabled'}
        </div>
      )}

      {/* =====================================================
          TASKBAR
      ===================================================== */}

      <footer
        id="windows-taskbar"
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-[9000]
          h-12
          sm:h-13
          acrylic-taskbar
          select-none
          overflow-visible
        "
        style={{
          borderTop: `1px solid ${
            settings.accentColor
          }45`,
        }}
      >
        {/* ===================================================
            TASKBAR CONTENT
        =================================================== */}

        <div
          className="
            h-full
            w-full
            overflow-x-auto
            overflow-y-visible
            overscroll-x-contain
            touch-pan-x
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <div
            className="
              flex
              h-full
              min-w-max
              items-center
              justify-between
              gap-2
              px-2
              sm:px-3
              lg:gap-3
              lg:px-4
              lg:min-w-full
            "
          >
            {/* =================================================
                LEFT
            ================================================= */}

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              {/* HOME */}

              <button
                type="button"
                aria-label="Show desktop"
                title="Show desktop"
                onClick={() => {
                  playQuickSettingSound();
                  goHome();
                }}
                className="
                  group
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-200
                  transition-all
                  duration-200
                  hover:bg-white/10
                  active:scale-90
                "
              >
                <House
                  className="
                    h-4
                    w-4
                    transition-transform
                    duration-200
                    group-hover:-translate-y-0.5
                  "
                />
              </button>

              {/* WEATHER */}

              <button
                type="button"
                onClick={() => {
                  playQuickSettingSound();
                  openApp('widgets');
                }}
                className="
                  flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-md
                  px-2
                  py-1
                  text-xs
                  font-medium
                  text-slate-200
                  transition-all
                  duration-200
                  hover:bg-white/10
                  sm:px-2.5
                "
                title="Open Weather"
              >
                <CloudSun
                  className="
                    h-4
                    w-4
                    shrink-0
                    text-amber-400
                  "
                />

                <span
                  className="
                    hidden
                    text-[11px]
                    font-semibold
                    text-slate-300
                    md:inline
                  "
                >
                  28°C Mostly Sunny
                </span>
              </button>

              {/* VERSION */}

              <button
                type="button"
                onClick={() =>
                  openApp(
                    'system-info',
                  )
                }
                className="
                  hidden
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-md
                  px-2
                  py-1
                  text-[11px]
                  font-medium
                  text-slate-400
                  transition-all
                  duration-200
                  hover:bg-white/10
                  lg:flex
                "
                title="System Information"
              >
                <span
                  className="
                    h-2
                    w-2
                    animate-pulse
                    rounded-full
                    bg-emerald-400
                  "
                />

                <span>
                  v1.0
                </span>
              </button>
            </div>

            {/* =================================================
                CENTER
            ================================================= */}

            <div
              className="
                flex
                shrink-0
                items-center
                gap-1
                sm:gap-1.5
              "
            >
              {/* DESKTOP OVERVIEW */}

              <button
                type="button"
                aria-label="Desktop overview"
                onClick={() => {
                  playQuickSettingSound();

                  setDesktopOverviewOpen(
                    !isDesktopOverviewOpen,
                  );

                  setStartMenuOpen(
                    false,
                  );

                  setSearchOpen(
                    false,
                  );

                  setNotificationCenterOpen(
                    false,
                  );

                  setShowVolumePopup(
                    false,
                  );
                }}
                className={`
                  relative
                  shrink-0
                  rounded-lg
                  p-2
                  transition-all
                  duration-200
                  ${
                    isDesktopOverviewOpen
                      ? 'bg-sky-500/25 text-sky-300 ring-1 ring-sky-400/60'
                      : 'text-slate-300 hover:bg-white/10'
                  }
                `}
                title="Desktops overview"
              >
                <LayoutDashboard className="h-4 w-4" />
              </button>

              {/* START */}

              <button
                type="button"
                id="taskbar-start-btn"
                aria-label="Start Menu"
                onClick={() => {
                  playQuickSettingSound();

                  setStartMenuOpen(
                    previous =>
                      !previous,
                  );

                  setSearchOpen(false);
                  setNotificationCenterOpen(
                    false,
                  );
                  setDesktopOverviewOpen(
                    false,
                  );
                  setShowVolumePopup(
                    false,
                  );
                }}
                className={`
                  group
                  relative
                  shrink-0
                  rounded-lg
                  p-2
                  transition-all
                  duration-200
                  ${
                    isStartMenuOpen
                      ? 'bg-white/20 ring-1 ring-sky-400'
                      : 'hover:bg-white/10 active:scale-95'
                  }
                `}
                title="Start"
              >
                <div className="grid h-4 w-4 grid-cols-2 gap-0.5">
                  <div className="h-2 w-2 rounded-[2px] bg-sky-400" />
                  <div className="h-2 w-2 rounded-[2px] bg-sky-400" />
                  <div className="h-2 w-2 rounded-[2px] bg-sky-400" />
                  <div className="h-2 w-2 rounded-[2px] bg-sky-400" />
                </div>
              </button>

              {/* SEARCH */}

              <button
                type="button"
                id="taskbar-search-btn"
                aria-label="Search Portfolio"
                onClick={() => {
                  playQuickSettingSound();

                  setSearchOpen(
                    previous =>
                      !previous,
                  );

                  setStartMenuOpen(
                    false,
                  );

                  setNotificationCenterOpen(
                    false,
                  );

                  setDesktopOverviewOpen(
                    false,
                  );

                  setShowVolumePopup(
                    false,
                  );
                }}
                className={`
                  flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-lg
                  px-2.5
                  py-1.5
                  transition-all
                  duration-200
                  ${
                    isSearchOpen
                      ? 'bg-white/20 text-sky-300 ring-1 ring-sky-400'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }
                `}
                title="Search (Ctrl + K)"
              >
                <Search className="h-4 w-4" />

                <span
                  className="
                    hidden
                    text-xs
                    text-slate-400
                    md:inline
                  "
                >
                  Search...
                </span>
              </button>

              <div className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />

              {/* APPS */}

              {visibleApps.map(
                item => {
                  const running =
                    isAppRunning(
                      item.appId,
                    );

                  const focused =
                    isAppFocused(
                      item.appId,
                    );

                  return (
                    <button
                      key={
                        item.appId
                      }
                      type="button"
                      id={`taskbar-app-${item.appId}`}
                      onClick={() =>
                        handleAppClick(
                          item.appId,
                        )
                      }
                      onContextMenu={event => {
                        event.preventDefault();
                        event.stopPropagation();

                        openContextMenu(
                          event.clientX,
                          event.clientY,
                          'taskbar',
                          item.appId,
                        );
                      }}
                      draggable={taskbarApps.some(
                        app =>
                          app.appId ===
                          item.appId,
                      )}
                      onDragStart={() =>
                        setDraggedAppId(
                          item.appId,
                        )
                      }
                      onDragOver={event =>
                        event.preventDefault()
                      }
                      onDrop={() => {
                        if (
                          draggedAppId
                        ) {
                          reorderTaskbarApps(
                            draggedAppId,
                            item.appId,
                          );
                        }

                        setDraggedAppId(
                          null,
                        );
                      }}
                      onDragEnd={() =>
                        setDraggedAppId(
                          null,
                        )
                      }
                      className={`
                        group
                        relative
                        shrink-0
                        rounded-lg
                        p-2
                        transition-all
                        duration-200
                        ${
                          focused
                            ? 'bg-white/20 shadow-inner'
                            : running
                              ? 'bg-white/10 hover:bg-white/15'
                              : 'hover:bg-white/10'
                        }
                      `}
                      title={
                        item.title
                      }
                    >
                      <div className="flex h-5 w-5 items-center justify-center">
                        <AppIcon
                          name={
                            item.icon
                          }
                          className="
                            h-5
                            w-5
                            text-slate-200
                            transition-transform
                            duration-200
                            group-hover:scale-110
                            group-hover:text-white
                          "
                        />
                      </div>

                      {running && (
                        <span
                          className={`
                            absolute
                            bottom-0.5
                            left-1/2
                            -translate-x-1/2
                            rounded-full
                            transition-all
                            duration-200
                            ${
                              focused
                                ? 'h-0.5 w-4 bg-sky-400'
                                : 'h-0.5 w-1.5 bg-slate-400 group-hover:w-3'
                            }
                          `}
                        />
                      )}
                    </button>
                  );
                },
              )}
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="flex shrink-0 items-center gap-1">
              {/* KEYBOARD */}

              <button
                type="button"
                aria-label="Virtual keyboard"
                title="Virtual keyboard"
                onMouseDown={event =>
                  event.preventDefault()
                }
                onClick={() => {
                  playQuickSettingSound();

                  setShowKeyboard(
                    previous =>
                      !previous,
                  );
                }}
                className={`
                  rounded-lg
                  p-1.5
                  transition-all
                  duration-200
                  ${
                    showKeyboard
                      ? 'bg-sky-500/25 text-sky-300'
                      : 'text-slate-300 hover:bg-white/10'
                  }
                `}
              >
                <Keyboard className="h-4 w-4" />
              </button>

              {/* FULLSCREEN */}

              <button
                type="button"
                aria-label={
                  isFullscreen
                    ? 'Exit fullscreen'
                    : 'Enter fullscreen'
                }
                title={
                  isFullscreen
                    ? 'Exit fullscreen'
                    : 'Full screen desktop'
                }
                onClick={() =>
                  void toggleFullscreen()
                }
                className="
                  rounded-lg
                  p-1.5
                  text-slate-300
                  transition-all
                  duration-200
                  hover:bg-white/10
                  hover:text-cyan-300
                  active:scale-90
                "
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>

              {/* QUICK SETTINGS BUTTON */}

              <button
                type="button"
                aria-label="Quick settings"
                aria-expanded={
                  showVolumePopup
                }
                onClick={() => {
                  playQuickSettingSound();

                  setShowVolumePopup(
                    previous =>
                      !previous,
                  );

                  setQuickPanel(
                    'none',
                  );

                  closeOtherPanels();
                }}
                className={`
                  flex
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-md
                  px-2
                  py-1
                  transition-all
                  duration-200
                  ${
                    showVolumePopup
                      ? 'bg-white/15 text-white ring-1 ring-white/10'
                      : 'text-slate-300 hover:bg-white/10'
                  }
                `}
                title="Quick settings"
              >
                <Wifi
                  className={`
                    h-3.5
                    w-3.5
                    ${
                      wifiEnabled &&
                      !airplaneMode
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                    }
                  `}
                />

                {settings.volume >
                0 ? (
                  <Volume2 className="h-3.5 w-3.5" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5 text-slate-500" />
                )}

                <Battery className="h-3.5 w-3.5 text-sky-400" />
              </button>

              {/* CLOCK */}

              <button
                type="button"
                id="taskbar-clock-btn"
                aria-label="Open Calendar and Notifications"
                onClick={() => {
                  playQuickSettingSound();

                  setNotificationCenterOpen(
                    previous =>
                      !previous,
                  );

                  setStartMenuOpen(
                    false,
                  );

                  setSearchOpen(
                    false,
                  );

                  setShowVolumePopup(
                    false,
                  );
                }}
                className={`
                  flex
                  shrink-0
                  flex-col
                  items-end
                  rounded-md
                  px-2
                  py-0.5
                  text-right
                  transition-all
                  duration-200
                  ${
                    isNotificationCenterOpen
                      ? 'bg-white/20 text-sky-300'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span className="text-xs font-semibold leading-tight">
                  {timeStr ||
                    '12:00 PM'}
                </span>

                <span className="text-[10px] leading-tight text-slate-400">
                  {dateStr ||
                    '9/17/2026'}
                </span>
              </button>

              {/* NOTIFICATIONS */}

              <button
                type="button"
                id="taskbar-notif-btn"
                aria-label="Notifications"
                onClick={() => {
                  playQuickSettingSound();

                  setNotificationCenterOpen(
                    previous =>
                      !previous,
                  );

                  setStartMenuOpen(
                    false,
                  );

                  setSearchOpen(
                    false,
                  );

                  setShowVolumePopup(
                    false,
                  );
                }}
                className="
                  relative
                  shrink-0
                  rounded-md
                  p-1.5
                  text-slate-300
                  transition-all
                  duration-200
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <Bell className="h-4 w-4" />

                {unreadCount >
                  0 && (
                  <span
                    className="
                      absolute
                      right-1
                      top-1
                      h-2
                      w-2
                      animate-pulse
                      rounded-full
                      bg-sky-500
                      ring-1
                      ring-slate-900
                    "
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            DESKTOP OVERVIEW
        ===================================================== */}

        {isDesktopOverviewOpen && (
          <div
            className="
              desktop-overview
              fixed
              bottom-14
              left-1/2
              z-[9998]
              w-[min(760px,calc(100vw-24px))]
              -translate-x-1/2
              animate-[taskbarPopupIn_180ms_ease-out]
              rounded-2xl
              border
              border-white/15
              bg-slate-950/90
              p-4
              shadow-2xl
              backdrop-blur-2xl
            "
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  Your desktops
                </p>

                <p className="text-[11px] text-slate-400">
                  Switch workspace without losing your place
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  playQuickSettingSound();
                  createDesktop();
                }}
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1
                  rounded-lg
                  bg-sky-500
                  px-2.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-slate-950
                  transition-all
                  duration-200
                  hover:bg-sky-400
                  active:scale-95
                "
              >
                <Plus className="h-3.5 w-3.5" />
                <span>
                  New desktop
                </span>
              </button>
            </div>

            <div
              className="
                grid
                max-h-[65vh]
                grid-cols-1
                gap-3
                overflow-y-auto
                pr-1
                sm:grid-cols-2
              "
            >
              {desktops.map(
                desktop => {
                  const desktopWindows =
                    windows.filter(
                      window =>
                        window.desktopId ===
                        desktop.id,
                    );

                  return (
                    <div
                      key={
                        desktop.id
                      }
                      onDragOver={event =>
                        event.preventDefault()
                      }
                      onDrop={event => {
                        event.preventDefault();

                        const windowId =
                          event.dataTransfer.getData(
                            'text/window-id',
                          );

                        if (windowId) {
                          moveWindowToDesktop(
                            windowId,
                            desktop.id,
                          );
                        }
                      }}
                      className={`
                        group
                        relative
                        rounded-xl
                        border
                        p-2
                        transition-all
                        duration-200
                        ${
                          desktop.id ===
                          activeDesktopId
                            ? 'border-sky-400/70 bg-sky-400/10 shadow-lg shadow-sky-500/10'
                            : 'border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.06]'
                        }
                      `}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          switchDesktop(
                            desktop.id,
                          )
                        }
                        className="block w-full text-left"
                      >
                        <div
                          className={`
                            relative
                            h-20
                            overflow-hidden
                            rounded-lg
                            bg-gradient-to-br
                            ${desktop.accent}
                            p-2
                          `}
                        >
                          <div className="absolute inset-0 bg-slate-950/45" />

                          <div className="relative grid grid-cols-3 gap-1">
                            {desktopWindows
                              .slice(
                                0,
                                3,
                              )
                              .map(
                                win => (
                                  <div
                                    key={
                                      win.id
                                    }
                                    draggable
                                    onDragStart={event => {
                                      event.stopPropagation();

                                      event.dataTransfer.setData(
                                        'text/window-id',
                                        win.id,
                                      );
                                    }}
                                    className="
                                      h-12
                                      cursor-grab
                                      rounded
                                      bg-slate-900/80
                                      shadow-lg
                                      active:cursor-grabbing
                                    "
                                    title={`Drag ${win.title} to another desktop`}
                                  />
                                ),
                              )}

                            {desktopWindows.length ===
                              0 && (
                              <span className="col-span-3 self-center pt-3 text-center text-[10px] text-white/70">
                                Empty workspace
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-1 pt-2">
                          <span className="text-xs font-semibold text-slate-100">
                            {desktop.name}
                          </span>

                          <span className="text-[10px] text-slate-400">
                            {
                              desktopWindows.length
                            }{' '}
                            {desktopWindows.length ===
                            1
                              ? 'window'
                              : 'windows'}
                          </span>
                        </div>

                        {desktopWindows.length >
                          0 && (
                          <div className="mt-2 flex flex-wrap gap-1 px-1">
                            {desktopWindows.map(
                              win => (
                                <span
                                  key={
                                    win.id
                                  }
                                  className="
                                    max-w-full
                                    truncate
                                    rounded
                                    bg-white/10
                                    px-1.5
                                    py-0.5
                                    text-[9px]
                                    text-slate-300
                                  "
                                >
                                  {
                                    win.title
                                  }
                                </span>
                              ),
                            )}
                          </div>
                        )}
                      </button>

                      {desktops.length >
                        1 && (
                        <button
                          type="button"
                          aria-label={`Delete ${desktop.name}`}
                          onClick={() => {
                            playQuickSettingSound();
                            deleteDesktop(
                              desktop.id,
                            );
                          }}
                          className="
                            absolute
                            right-2
                            top-2
                            rounded
                            p-1
                            text-slate-400
                            opacity-0
                            transition-all
                            duration-200
                            hover:bg-red-500/20
                            hover:text-red-300
                            group-hover:opacity-100
                          "
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            QUICK SETTINGS BACKDROP
        ===================================================== */}

        {showVolumePopup && (
          <>
            <button
              type="button"
              aria-label="Close quick settings"
              onClick={() => {
                setShowVolumePopup(
                  false,
                );
                setQuickPanel(
                  'none',
                );
              }}
              className="
                fixed
                inset-0
                z-[9997]
                cursor-default
                bg-black/10
                backdrop-blur-[1px]
              "
            />

            {/* =================================================
                QUICK SETTINGS PANEL
            ================================================= */}

            <div
              className="
                fixed
                bottom-14
                right-3
                z-[9999]
                w-[min(400px,calc(100vw-16px))]
                overflow-hidden
                rounded-[22px]
                border
                border-white/[0.13]
                bg-[#1b2028]/[0.98]
                text-xs
                shadow-[0_24px_80px_rgba(0,0,0,.58)]
                backdrop-blur-3xl
                animate-[quickSettingsIn_220ms_cubic-bezier(.2,.8,.2,1)]
              "
              onClick={event =>
                event.stopPropagation()
              }
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-500/[0.09] to-transparent" />

              <div className="relative max-h-[calc(100vh-80px)] overflow-y-auto p-3.5 sm:p-4">
                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-lg
                        bg-sky-500/15
                        text-sky-300
                      "
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>

                    <div>
                      <p className="text-[13px] font-bold text-white">
                        Quick Settings
                      </p>

                      <p className="text-[9px] text-slate-500">
                        Abhishek OS controls
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Close quick settings"
                    onClick={() =>
                      setShowVolumePopup(
                        false,
                      )
                    }
                    className="
                      rounded-lg
                      p-1.5
                      text-slate-500
                      transition-all
                      duration-200
                      hover:bg-white/10
                      hover:text-white
                      active:scale-90
                    "
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* =================================================
                    MAIN TILES
                ================================================= */}

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <QuickSettingTile
                    id="wifi"
                    label="Wi-Fi"
                    subtitle={
                      airplaneMode
                        ? 'Airplane mode'
                        : wifiEnabled
                          ? wifiNetwork
                          : 'Off'
                    }
                    icon={Wifi}
                    active={
                      wifiEnabled &&
                      !airplaneMode
                    }
                    disabled={
                      airplaneMode
                    }
                    onClick={
                      toggleWifi
                    }
                  />

                  <QuickSettingTile
                    id="bluetooth"
                    label="Bluetooth"
                    subtitle={
                      bluetoothEnabled
                        ? bluetoothDevice ||
                          'On'
                        : 'Off'
                    }
                    icon={
                      Bluetooth
                    }
                    active={
                      bluetoothEnabled &&
                      !airplaneMode
                    }
                    disabled={
                      airplaneMode
                    }
                    onClick={
                      toggleBluetooth
                    }
                  />

                  <QuickSettingTile
                    id="airplane"
                    label="Airplane mode"
                    subtitle={
                      airplaneMode
                        ? 'All radios off'
                        : 'Off'
                    }
                    icon={Airplay}
                    active={
                      airplaneMode
                    }
                    onClick={
                      toggleAirplane
                    }
                  />

                  <QuickSettingTile
                    id="accessibility"
                    label="Accessibility"
                    subtitle={
                      accessibilityEnabled
                        ? 'Enabled'
                        : 'Options'
                    }
                    icon={
                      Accessibility
                    }
                    active={
                      accessibilityEnabled
                    }
                    onClick={
                      toggleAccessibility
                    }
                  />

                  <QuickSettingTile
                    id="energy"
                    label="Energy saver"
                    subtitle={
                      energySaver
                        ? 'Saving power'
                        : 'Off'
                    }
                    icon={Zap}
                    active={
                      energySaver
                    }
                    onClick={
                      toggleEnergySaver
                    }
                  />

                  <QuickSettingTile
                    id="captions"
                    label="Live captions"
                    subtitle={
                      liveCaptions
                        ? 'Listening'
                        : 'Off'
                    }
                    icon={
                      Captions
                    }
                    active={
                      liveCaptions
                    }
                    onClick={
                      toggleLiveCaptions
                    }
                  />

                  <QuickSettingTile
                    id="nightLight"
                    label="Night light"
                    subtitle={
                      nightLight
                        ? 'Warm display'
                        : 'Off'
                    }
                    icon={Moon}
                    active={
                      nightLight
                    }
                    onClick={
                      toggleNightLight
                    }
                  />

                  <QuickSettingTile
                    id="hotspot"
                    label="Mobile hotspot"
                    subtitle={
                      mobileHotspot
                        ? 'Sharing'
                        : 'Off'
                    }
                    icon={Wifi}
                    active={
                      mobileHotspot
                    }
                    onClick={
                      toggleHotspot
                    }
                  />

                  <QuickSettingTile
                    id="sharing"
                    label="Nearby sharing"
                    subtitle={
                      nearbySharing
                        ? 'Discoverable'
                        : 'Off'
                    }
                    icon={
                      Share2
                    }
                    active={
                      nearbySharing
                    }
                    onClick={
                      toggleNearbySharing
                    }
                  />

                  <QuickSettingTile
                    id="cast"
                    label="Cast"
                    subtitle={
                      castEnabled
                        ? 'Screen sharing'
                        : 'Available'
                    }
                    icon={Cast}
                    active={
                      castEnabled
                    }
                    onClick={
                      toggleCast
                    }
                  />

                  <QuickSettingTile
                    id="project"
                    label="Project"
                    subtitle={
                      projectEnabled
                        ? projectMode ===
                          'duplicate'
                          ? 'Duplicate'
                          : projectMode ===
                              'extend'
                            ? 'Extend'
                            : 'Second screen'
                        : 'PC screen only'
                    }
                    icon={
                      MonitorUp
                    }
                    active={
                      projectEnabled
                    }
                    onClick={
                      toggleProject
                    }
                  />
                </div>

                {/* =================================================
                    CONTEXT PANEL
                ================================================= */}

                {quickPanel !==
                  'none' && (
                  <div className="mt-3 animate-[quickSubPanelIn_180ms_ease-out] rounded-xl border border-white/[0.08] bg-black/10 p-3">
                    {/* WIFI */}

                    {quickPanel ===
                      'wifi' && (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-bold text-white">
                              Wi-Fi networks
                            </p>

                            <p className="text-[9px] text-slate-500">
                              Choose a simulated network
                            </p>
                          </div>

                          <span className="flex items-center gap-1 text-[9px] text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {wifiEnabled
                              ? 'Connected'
                              : 'Off'}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {[
                            'Airtel_Abhishek',
                            'Abhishek_5G',
                            'Office_Network',
                            'Guest_WiFi',
                          ].map(
                            network => (
                              <OptionButton
                                key={
                                  network
                                }
                                active={
                                  wifiEnabled &&
                                  wifiNetwork ===
                                    network
                                }
                                onClick={() =>
                                  connectWifi(
                                    network,
                                  )
                                }
                              >
                                <span className="flex items-center gap-2">
                                  <Wifi className="h-3.5 w-3.5 text-sky-400" />
                                  {
                                    network
                                  }
                                </span>
                              </OptionButton>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* BLUETOOTH */}

                    {quickPanel ===
                      'bluetooth' && (
                      <div>
                        <div className="mb-2">
                          <p className="text-[11px] font-bold text-white">
                            Bluetooth devices
                          </p>

                          <p className="text-[9px] text-slate-500">
                            Connect a device to this workstation
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          {[
                            'AirPods Pro',
                            'MX Master 3S',
                            'Galaxy Buds',
                            'Wireless Keyboard',
                          ].map(
                            device => (
                              <OptionButton
                                key={
                                  device
                                }
                                active={
                                  bluetoothEnabled &&
                                  bluetoothDevice ===
                                    device
                                }
                                onClick={() =>
                                  connectBluetooth(
                                    device,
                                  )
                                }
                              >
                                <span className="flex items-center gap-2">
                                  <Bluetooth className="h-3.5 w-3.5 text-sky-400" />
                                  {
                                    device
                                  }
                                </span>
                              </OptionButton>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* AIRPLANE */}

                    {quickPanel ===
                      'airplane' && (
                      <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
                        <p className="text-[11px] font-bold text-amber-300">
                          Airplane mode
                        </p>

                        <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
                          Wi-Fi, Bluetooth and mobile hotspot are currently disabled.
                        </p>
                      </div>
                    )}

                    {/* ACCESSIBILITY */}

                    {quickPanel ===
                      'accessibility' && (
                      <div>
                        <div className="mb-2">
                          <p className="text-[11px] font-bold text-white">
                            Accessibility
                          </p>

                          <p className="text-[9px] text-slate-500">
                            Personalize how Abhishek OS looks and behaves
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <OptionButton
                            active={
                              largeText
                            }
                            onClick={() =>
                              setLargeText(
                                previous =>
                                  !previous,
                              )
                            }
                          >
                            Large text
                          </OptionButton>

                          <OptionButton
                            active={
                              highContrast
                            }
                            onClick={() =>
                              setHighContrast(
                                previous =>
                                  !previous,
                              )
                            }
                          >
                            High contrast
                          </OptionButton>

                          <OptionButton
                            active={
                              reduceMotion
                            }
                            onClick={() =>
                              setReduceMotion(
                                previous =>
                                  !previous,
                              )
                            }
                          >
                            Reduce motion
                          </OptionButton>
                        </div>
                      </div>
                    )}

                    {/* ENERGY */}

                    {quickPanel ===
                      'energy' && (
                      <div>
                        <p className="text-[11px] font-bold text-white">
                          Energy saver
                        </p>

                        <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
                          Energy saver reduces visual effects and animation intensity to simulate a lower-power workstation profile.
                        </p>

                        <div className="mt-2 rounded-lg bg-emerald-500/10 px-3 py-2">
                          <span className="text-[9px] font-semibold text-emerald-400">
                            {energySaver
                              ? 'Power saving is active'
                              : 'Normal performance mode'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* CAPTIONS */}

                    {quickPanel ===
                      'captions' && (
                      <div>
                        <p className="text-[11px] font-bold text-white">
                          Live captions
                        </p>

                        <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
                          Captions appear at the bottom of the workstation when speech recognition is available.
                        </p>

                        <div className="mt-2 rounded-lg bg-black/30 px-3 py-2">
                          <span className="text-[9px] text-slate-300">
                            {captionText ||
                              'Waiting for speech…'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* NIGHT LIGHT */}

                    {quickPanel ===
                      'nightLight' && (
                      <div>
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4 text-amber-300" />

                          <div>
                            <p className="text-[11px] font-bold text-white">
                              Night light
                            </p>

                            <p className="text-[9px] text-slate-500">
                              Warm display protection
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 rounded-lg border border-orange-300/20 bg-orange-300/10 p-3">
                          <p className="text-[9px] leading-relaxed text-orange-100/80">
                            The workstation display is now using a warmer color temperature to reduce cool blue tones.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* HOTSPOT */}

                    {quickPanel ===
                      'hotspot' && (
                      <div>
                        <p className="text-[11px] font-bold text-white">
                          Mobile hotspot
                        </p>

                        <p className="mt-1 text-[9px] text-slate-500">
                          Simulated mobile network sharing
                        </p>

                        {mobileHotspot ? (
                          <div className="mt-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-slate-400">
                                Network
                              </span>

                              <span className="text-[10px] font-bold text-emerald-400">
                                {
                                  hotspotName
                                }
                              </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[9px] text-slate-400">
                                Status
                              </span>

                              <span className="text-[10px] font-bold text-emerald-400">
                                Active
                              </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[9px] text-slate-400">
                                Connected devices
                              </span>

                              <span className="text-[10px] font-bold text-white">
                                0
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 rounded-lg bg-white/[0.035] px-3 py-2">
                            <span className="text-[9px] text-slate-400">
                              Turn hotspot on to share this simulated network.
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SHARING */}

                    {quickPanel ===
                      'sharing' && (
                      <div>
                        <p className="text-[11px] font-bold text-white">
                          Nearby sharing
                        </p>

                        <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                          Share your portfolio workstation using your browser's native sharing system.
                        </p>

                        <button
                          type="button"
                          onClick={
                            shareWorkstation
                          }
                          className="
                            mt-2
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-sky-500
                            px-3
                            py-2.5
                            text-[10px]
                            font-bold
                            text-slate-950
                            transition-all
                            hover:bg-sky-400
                            active:scale-[0.98]
                          "
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          Share workstation
                        </button>

                        {sharingMessage && (
                          <p className="mt-2 text-center text-[9px] text-emerald-400">
                            {
                              sharingMessage
                            }
                          </p>
                        )}
                      </div>
                    )}

                    {/* CAST */}

                    {quickPanel ===
                      'cast' && (
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-bold text-white">
                              Cast / Screen share
                            </p>

                            <p className="text-[9px] text-slate-500">
                              Share the workstation screen
                            </p>
                          </div>

                          {castEnabled && (
                            <span className="flex items-center gap-1 text-[9px] text-emerald-400">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                              Sharing
                            </span>
                          )}
                        </div>

                        {castEnabled ? (
                          <>
                            <video
                              ref={
                                castVideoRef
                              }
                              muted
                              autoPlay
                              playsInline
                              className="
                                mt-2
                                aspect-video
                                w-full
                                rounded-xl
                                border
                                border-white/10
                                bg-black
                                object-cover
                              "
                            />

                            <button
                              type="button"
                              onClick={
                                stopCast
                              }
                              className="
                                mt-2
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-red-500/15
                                px-3
                                py-2.5
                                text-[10px]
                                font-bold
                                text-red-300
                                transition-all
                                hover:bg-red-500/25
                              "
                            >
                              <X className="h-3.5 w-3.5" />
                              Stop sharing
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                void startCast()
                              }
                              className="
                                mt-2
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-sky-500
                                px-3
                                py-2.5
                                text-[10px]
                                font-bold
                                text-slate-950
                                transition-all
                                hover:bg-sky-400
                              "
                            >
                              <Cast className="h-3.5 w-3.5" />
                              Choose screen to share
                            </button>

                            {castError && (
                              <p className="mt-2 text-[9px] text-red-300">
                                {
                                  castError
                                }
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* PROJECT */}

                    {quickPanel ===
                      'project' && (
                      <div>
                        <p className="text-[11px] font-bold text-white">
                          Project to a display
                        </p>

                        <p className="mt-1 text-[9px] text-slate-500">
                          Choose how this simulated workstation uses a second display.
                        </p>

                        <div className="mt-2 grid grid-cols-2 gap-1.5">
                          <OptionButton
                            active={
                              projectMode ===
                              'pc'
                            }
                            onClick={() =>
                              chooseProjectMode(
                                'pc',
                              )
                            }
                          >
                            PC screen only
                          </OptionButton>

                          <OptionButton
                            active={
                              projectMode ===
                              'duplicate'
                            }
                            onClick={() =>
                              chooseProjectMode(
                                'duplicate',
                              )
                            }
                          >
                            Duplicate
                          </OptionButton>

                          <OptionButton
                            active={
                              projectMode ===
                              'extend'
                            }
                            onClick={() =>
                              chooseProjectMode(
                                'extend',
                              )
                            }
                          >
                            Extend
                          </OptionButton>

                          <OptionButton
                            active={
                              projectMode ===
                              'second'
                            }
                            onClick={() =>
                              chooseProjectMode(
                                'second',
                              )
                            }
                          >
                            Second screen
                          </OptionButton>
                        </div>

                        <div className="mt-2 rounded-lg bg-sky-500/5 px-3 py-2">
                          <span className="text-[9px] text-sky-300">
                            Current:{' '}
                            {projectMode ===
                            'pc'
                              ? 'PC screen only'
                              : projectMode ===
                                  'duplicate'
                                ? 'Duplicate displays'
                                : projectMode ===
                                    'extend'
                                  ? 'Extend desktop'
                                  : 'Second screen only'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* =================================================
                    NETWORK STATUS
                ================================================= */}

                <div className="mt-3 rounded-xl border border-white/[0.07] bg-black/10 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`
                          h-2
                          w-2
                          shrink-0
                          rounded-full
                          ${
                            airplaneMode
                              ? 'bg-amber-400'
                              : wifiEnabled
                                ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.7)]'
                                : 'bg-slate-600'
                          }
                        `}
                      />

                      <span className="truncate text-[10px] font-semibold text-slate-300">
                        {airplaneMode
                          ? 'Airplane mode enabled'
                          : wifiEnabled
                            ? `Connected to ${wifiNetwork}`
                            : 'No active network'}
                      </span>
                    </div>

                    <span className="shrink-0 font-mono text-[9px] text-slate-600">
                      {airplaneMode
                        ? 'RADIOS OFF'
                        : 'SECURE'}
                    </span>
                  </div>
                </div>

                <div className="my-3 h-px bg-white/[0.07]" />

              {/* =========================================================
    VOLUME
========================================================= */}
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
      {settings.volume > 0 ? (
        <Volume2 className="h-3.5 w-3.5 text-sky-400" />
      ) : (
        <VolumeX className="h-3.5 w-3.5 text-slate-500" />
      )}

      <span>Master volume</span>
    </span>

    <span className="font-mono text-[10px] font-semibold text-slate-500">
      {settings.volume}%
    </span>
  </div>

  <div className="flex items-center gap-2">
    {/* Mute / Unmute */}
    <button
      type="button"
      aria-label={
        settings.volume > 0
          ? "Mute volume"
          : "Unmute volume"
      }
      title={
        settings.volume > 0
          ? "Mute"
          : "Unmute"
      }
      onClick={() => {
        playQuickSettingSound();

        updateSettings({
          volume:
            settings.volume > 0
              ? 0
              : 70,
        });
      }}
      className="
        group
        flex
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        rounded-lg
        border
        border-white/[0.07]
        bg-white/[0.05]
        text-slate-300
        shadow-sm
        transition-all
        duration-200
        hover:bg-white/[0.10]
        hover:text-white
        active:scale-90
      "
    >
      {settings.volume > 0 ? (
        <Volume2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
      ) : (
        <VolumeX className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:scale-110" />
      )}
    </button>

    {/* Volume Slider */}
    <div className="relative flex-1">
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={settings.volume}
        onChange={(event) => {
          updateSettings({
            volume: Number(event.target.value),
          });
        }}
        aria-label="Master volume"
        className="
          quick-range
          relative
          z-10
          h-1.5
          w-full
          cursor-pointer
          appearance-none
          rounded-full
          bg-transparent
          outline-none
        "
        style={{
          background: `linear-gradient(
            to right,
            rgb(56 189 248) 0%,
            rgb(56 189 248) ${settings.volume}%,
            rgb(51 65 85) ${settings.volume}%,
            rgb(51 65 85) 100%
          )`,
        }}
      />
    </div>
  </div>
</div>

{/* =========================================================
    BRIGHTNESS
========================================================= */}
<div className="mt-4 space-y-2">
  <div className="flex items-center justify-between">
    <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
      <Sun className="h-3.5 w-3.5 text-amber-400" />

      <span>Screen brightness</span>
    </span>

    <span className="font-mono text-[10px] font-semibold text-slate-500">
      {settings.brightness}%
    </span>
  </div>

  <div className="flex items-center gap-2">
    {/* Brightness Icon */}
    <div
      className="
        flex
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        rounded-lg
        border
        border-amber-400/10
        bg-amber-500/10
        shadow-sm
      "
    >
      <Sun
        className="
          h-4
          w-4
          text-amber-400
          transition-transform
          duration-300
        "
        style={{
          transform: `rotate(${settings.brightness * 1.8}deg)`,
        }}
      />
    </div>

    {/* Brightness Slider */}
    <div className="relative flex-1">
      <input
        type="range"
        min={30}
        max={100}
        step={1}
        value={settings.brightness}
        onChange={(event) => {
          updateSettings({
            brightness: Number(event.target.value),
          });
        }}
        aria-label="Screen brightness"
        className="
          brightness-range
          relative
          z-10
          h-1.5
          w-full
          cursor-pointer
          appearance-none
          rounded-full
          bg-transparent
          outline-none
        "
        style={{
          background: `linear-gradient(
            to right,
            rgb(251 191 36) 0%,
            rgb(251 191 36) ${
              ((settings.brightness - 30) / 70) * 100
            }%,
            rgb(51 65 85) ${
              ((settings.brightness - 30) / 70) * 100
            }%,
            rgb(51 65 85) 100%
          )`,
        }}
      />
    </div>
  </div>
</div>

{/* =========================================================
    SLIDER STYLES
========================================================= */}
<style>{`
  .quick-range::-webkit-slider-runnable-track,
  .brightness-range::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 9999px;
    background: transparent;
  }

  .quick-range::-webkit-slider-thumb,
  .brightness-range::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    margin-top: -6px;
    border-radius: 9999px;
    cursor: pointer;
    transition:
      transform 160ms ease,
      box-shadow 160ms ease;
  }

  .quick-range::-webkit-slider-thumb {
    background: rgb(56 189 248);
    border: 2px solid rgb(224 242 254);
    box-shadow:
      0 0 0 2px rgba(56, 189, 248, 0.12),
      0 0 12px rgba(56, 189, 248, 0.45);
  }

  .brightness-range::-webkit-slider-thumb {
    background: rgb(251 191 36);
    border: 2px solid rgb(255 251 235);
    box-shadow:
      0 0 0 2px rgba(251, 191, 36, 0.12),
      0 0 12px rgba(251, 191, 36, 0.45);
  }

  .quick-range::-webkit-slider-thumb:hover,
  .brightness-range::-webkit-slider-thumb:hover {
    transform: scale(1.12);
  }

  .quick-range::-moz-range-track,
  .brightness-range::-moz-range-track {
    height: 6px;
    border-radius: 9999px;
    background: transparent;
  }

  .quick-range::-moz-range-thumb,
  .brightness-range::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    cursor: pointer;
    border: 2px solid white;
  }

  .quick-range::-moz-range-thumb {
    background: rgb(56 189 248);
    box-shadow:
      0 0 0 2px rgba(56, 189, 248, 0.12),
      0 0 12px rgba(56, 189, 248, 0.45);
  }

  .brightness-range::-moz-range-thumb {
    background: rgb(251 191 36);
    box-shadow:
      0 0 0 2px rgba(251, 191, 36, 0.12),
      0 0 12px rgba(251, 191, 36, 0.45);
  }

  .quick-range:focus-visible::-webkit-slider-thumb {
    box-shadow:
      0 0 0 3px rgba(56, 189, 248, 0.22),
      0 0 14px rgba(56, 189, 248, 0.55);
  }

  .brightness-range:focus-visible::-webkit-slider-thumb {
    box-shadow:
      0 0 0 3px rgba(251, 191, 36, 0.22),
      0 0 14px rgba(251, 191, 36, 0.55);
  }
`}</style>

                {/* =================================================
                    MINI CONTROLS
                ================================================= */}

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {/* SOUND */}

                  <button
                    type="button"
                    onClick={() => {
                      playQuickSettingSound();

                      updateSettings({
                        soundEffects:
                          !settings.soundEffects,
                      });
                    }}
                    className={`
                      group
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      px-3
                      py-2.5
                      text-left
                      transition-all
                      duration-200
                      active:scale-[0.98]
                      ${
                        settings.soundEffects
                          ? 'border-sky-400/40 bg-sky-500/10'
                          : 'border-white/[0.07] bg-white/[0.035] hover:bg-white/[0.06]'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      {settings.soundEffects ? (
                        <Volume2 className="h-3.5 w-3.5 text-sky-400" />
                      ) : (
                        <VolumeX className="h-3.5 w-3.5 text-slate-500" />
                      )}

                      <span className="text-[10px] font-semibold text-slate-300">
                        Sound FX
                      </span>
                    </span>

                    <span
                      className={`
                        h-1.5
                        w-1.5
                        rounded-full
                        ${
                          settings.soundEffects
                            ? 'bg-emerald-400'
                            : 'bg-slate-600'
                        }
                      `}
                    />
                  </button>

                  {/* FOCUS */}

                  <button
                    type="button"
                    onClick={() => {
                      playQuickSettingSound();

                      updateSettings({
                        focusMode:
                          !settings.focusMode,
                      });
                    }}
                    className={`
                      group
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      px-3
                      py-2.5
                      text-left
                      transition-all
                      duration-200
                      active:scale-[0.98]
                      ${
                        settings.focusMode
                          ? 'border-purple-400/40 bg-purple-500/10'
                          : 'border-white/[0.07] bg-white/[0.035] hover:bg-white/[0.06]'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles
                        className={`
                          h-3.5
                          w-3.5
                          ${
                            settings.focusMode
                              ? 'text-purple-400'
                              : 'text-slate-500'
                          }
                        `}
                      />

                      <span className="text-[10px] font-semibold text-slate-300">
                        Focus mode
                      </span>
                    </span>

                    <span
                      className={`
                        h-1.5
                        w-1.5
                        rounded-full
                        ${
                          settings.focusMode
                            ? 'bg-purple-400'
                            : 'bg-slate-600'
                        }
                      `}
                    />
                  </button>
                </div>

                {/* =================================================
                    DEVICE STATUS
                ================================================= */}

                <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-600">
                        Battery
                      </p>

                      <p className="mt-0.5 text-[11px] font-semibold text-slate-300">
                        98%
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-600">
                        Power
                      </p>

                      <p className="mt-0.5 text-[11px] font-semibold text-emerald-400">
                        {energySaver
                          ? 'Saving'
                          : 'Plugged in'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-600">
                        System
                      </p>

                      <p className="mt-0.5 text-[11px] font-semibold text-sky-400">
                        Healthy
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    <span className="truncate text-[9px] text-slate-600">
                      Abhishek OS • All systems operational
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowVolumePopup(
                        false,
                      );
                      openApp(
                        'settings',
                      );
                    }}
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-1
                      rounded-lg
                      px-2
                      py-1
                      text-[10px]
                      font-semibold
                      text-sky-400
                      transition-all
                      duration-200
                      hover:bg-sky-500/10
                      hover:text-sky-300
                    "
                  >
                    <span>
                      All settings
                    </span>

                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* =====================================================
            VIRTUAL KEYBOARD
        ===================================================== */}

       {showKeyboard &&
  typeof document !== 'undefined' &&
  createPortal(
    <VirtualKeyboard
      isOpen={showKeyboard}
      onClose={() => setShowKeyboard(false)}
      onKeyPress={pressVirtualKey}
    />,
    document.body,
  )}
      </footer>

      {/* =======================================================
          ANIMATIONS + VISUAL EFFECTS
      ======================================================= */}

      <style>
        {`
          @keyframes quickSettingsIn {
            0% {
              opacity: 0;
              transform: translateY(14px) scale(.96);
              filter: blur(5px);
            }

            55% {
              opacity: 1;
              transform: translateY(-2px) scale(1.005);
              filter: blur(0);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes quickSubPanelIn {
            0% {
              opacity: 0;
              transform: translateY(-5px) scale(.985);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes taskbarPopupIn {
            0% {
              opacity: 0;
              transform: translate(-50%, 10px) scale(.97);
            }

            100% {
              opacity: 1;
              transform: translate(-50%, 0) scale(1);
            }
          }

          /* ---------------------------------------------
             RANGE INPUTS
          --------------------------------------------- */

          .quick-range,
          .brightness-range {
            background:
              linear-gradient(
                to right,
                #38bdf8 0%,
                #38bdf8 50%,
                #334155 50%,
                #334155 100%
              );
          }

          .quick-range::-webkit-slider-thumb,
          .brightness-range::-webkit-slider-thumb {
            appearance: none;
            width: 15px;
            height: 15px;
            border-radius: 9999px;
            background: #e2e8f0;
            border: 2px solid #38bdf8;
            box-shadow:
              0 0 0 3px rgba(56,189,248,.08);
            transition:
              transform .15s ease,
              box-shadow .15s ease;
          }

          .brightness-range::-webkit-slider-thumb {
            border-color: #f59e0b;
          }

          .quick-range::-webkit-slider-thumb:hover,
          .brightness-range::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow:
              0 0 0 5px rgba(56,189,248,.12);
          }

          .quick-range::-moz-range-thumb,
          .brightness-range::-moz-range-thumb {
            width: 15px;
            height: 15px;
            border-radius: 9999px;
            background: #e2e8f0;
            border: 2px solid #38bdf8;
            box-shadow:
              0 0 0 3px rgba(56,189,248,.08);
          }

          .brightness-range::-moz-range-thumb {
            border-color: #f59e0b;
          }

          /* ---------------------------------------------
             ACCESSIBILITY
          --------------------------------------------- */

          #abhishek-workstation-os.os-accessibility-mode {
            text-rendering: optimizeLegibility;
          }

          /*
           * IMPORTANT:
           * Keep the accessibility font scaling scoped to the taskbar.
           * The previous selector applied to EVERY button/input/textarea
           * inside the whole OS, including ContextMenu, StartMenu and apps.
           * That caused their carefully sized text-[...] classes to be
           * overridden and made the UI look unnecessarily large.
           */
          #abhishek-workstation-os.os-large-text #windows-taskbar {
            --os-text-scale: 1.06;
          }

          #abhishek-workstation-os.os-large-text #windows-taskbar button,
          #abhishek-workstation-os.os-large-text #windows-taskbar input,
          #abhishek-workstation-os.os-large-text #windows-taskbar textarea {
            font-size: calc(100% * var(--os-text-scale, 1));
          }

          #abhishek-workstation-os.os-high-contrast {
            filter:
              contrast(1.12)
              saturate(1.08);
          }

          #abhishek-workstation-os.os-energy-saver
          .animate-pulse {
            animation-duration: 3s !important;
          }

          #abhishek-workstation-os.os-energy-saver
          .animate-spin {
            animation-duration: 5s !important;
          }

          #abhishek-workstation-os.os-energy-saver {
            filter: brightness(.94);
          }

          #abhishek-workstation-os.os-focus-mode
          [data-non-focus="true"] {
            opacity: .35;
          }

          /* ---------------------------------------------
             REDUCED MOTION
          --------------------------------------------- */

          #abhishek-workstation-os.os-reduced-motion *,
          #abhishek-workstation-os.os-reduced-motion
          *::before,
          #abhishek-workstation-os.os-reduced-motion
          *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
            scroll-behavior: auto !important;
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: .001ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: .001ms !important;
              scroll-behavior: auto !important;
            }
          }

          /* ---------------------------------------------
             MOBILE
          --------------------------------------------- */

          @media (max-width: 640px) {
            .desktop-overview {
              bottom: 58px;
            }
          }
        `}
      </style>
    </>
  );
};