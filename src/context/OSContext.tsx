// import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import {
//   AppId,
//   WindowState,
//   Project,
//   Experience,
//   Skill,
//   Education,
//   Certification,
//   NotificationItem,
//   SystemSettings,
//   SystemPowerState,
//   ContactMessage,
//   DesktopIconItem,
//   TaskbarApp,
// } from '../types';
// import {
//   INITIAL_PROJECTS,
//   INITIAL_EXPERIENCES,
//   INITIAL_SKILLS,
//   INITIAL_EDUCATION,
//   INITIAL_WALLPAPERS,
//   DESKTOP_ICONS,
//   PROFILE_INFO,
// } from '../data/initialData';
// import {
//   getStoredProjects,
//   saveProjects,
//   getStoredCertifications,
//   saveCertifications,
//   getStoredExperiences,
//   getStoredSkills,
//   getStoredSettings,
//   saveSettings,
//   getStoredNotifications,
//   saveNotifications,
//   getStoredContactMessages,
//   saveContactMessage,
//   saveContactMessages,
//   getRecycleBinItems,
//   saveRecycleBinItems,
//   RecycleBinItem,
//   getAdminAuthState,
//   setAdminAuthState,
//   getStoredTaskbarApps,
//   saveTaskbarApps,
// } from '../lib/storage';
// import { saveVFSFile } from '../lib/vfs';
// import { getCustomWallpaper } from '../lib/wallpaperStorage';

// interface ContextMenuState {
//   isOpen: boolean;
//   x: number;
//   y: number;
//   type: 'desktop' | 'taskbar' | 'icon';
//   targetId?: string;
// }

// interface OSContextType {
//   // Power & Boot
//   powerState: SystemPowerState;
//   setPowerState: (state: SystemPowerState) => void;
//   restartSystem: () => void;
//   shutdownSystem: () => void;
//   sleepSystem: () => void;
//   wakeSystem: () => void;
//   unlockSystem: () => void;

//   // Window Management
//   windows: WindowState[];
//   activeWindowId: string | null;
//   openApp: (appId: AppId, extraData?: any) => void;
//   activateMode: (mode: 'recruiter' | 'developer') => void;
//   closeWindow: (id: string) => void;
//   goHome: () => void;
//   recentClosedApps: AppId[];
//   minimizeWindow: (id: string) => void;
//   maximizeWindow: (id: string) => void;
//   focusWindow: (id: string) => void;
//   updateWindowPosition: (id: string, pos: { x: number; y: number }) => void;
//   updateWindowSize: (id: string, size: { width: number; height: number }) => void;
//   moveWindowToDesktop: (windowId: string, desktopId: string) => void;
//   desktops: Desktop[];
//   activeDesktopId: string;
//   switchDesktop: (id: string) => void;
//   createDesktop: () => void;
//   deleteDesktop: (id: string) => void;
//   isDesktopOverviewOpen: boolean;
//   setDesktopOverviewOpen: (open: boolean) => void;

//   // UI Panels
//   isStartMenuOpen: boolean;
//   setStartMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
//   isSearchOpen: boolean;
//   setSearchOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
//   isNotificationCenterOpen: boolean;
//   setNotificationCenterOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
//   toggleStartMenu: () => void;
//   toggleSearch: () => void;
//   toggleNotificationCenter: () => void;
//   closeAllOverlays: () => void;
//   contextMenu: ContextMenuState;
//   setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState>>;
//   openContextMenu: (x: number, y: number, type?: 'desktop' | 'taskbar' | 'icon', targetId?: string) => void;
//   closeContextMenu: () => void;

//   // Desktop State
//   desktopIcons: DesktopIconItem[];
//   selectedIconId: string | null;
//   setSelectedIconId: (id: string | null) => void;
//   renameDesktopIcon: (id: string, title: string) => void;
//   removeDesktopIcon: (id: string) => void;
//   createDesktopItem: (type: 'folder' | 'text') => Promise<void>;
//   addDesktopAppShortcut: (appId: AppId, title: string, iconName: string, id?: string, extraData?: any) => void;
//   removeDesktopAppShortcut: (id: string) => void;
//   undoDesktopChange: () => void;
//   redoDesktopChange: () => void;
//   toggleFavoriteDesktopIcon: (id: string) => void;
//   favoriteDesktopIconIds: string[];
//   refreshDesktop: () => void;
//   taskbarApps: TaskbarApp[];
//   reorderTaskbarApps: (fromAppId: AppId, toAppId: AppId) => void;
//   pinTaskbarApp: (app: TaskbarApp) => void;
//   unpinTaskbarApp: (appId: AppId) => void;

//   // Settings & Appearance
//   settings: SystemSettings;
//   updateSettings: (newSettings: Partial<SystemSettings>) => void;
//   currentWallpaper: typeof INITIAL_WALLPAPERS[0];
//   wallpapers: typeof INITIAL_WALLPAPERS;

//   // Data & Content
//   projects: Project[];
//   experiences: Experience[];
//   skills: Skill[];
//   education: Education;
//   certifications: Certification[];
//   notifications: NotificationItem[];
//   recycleBinItems: RecycleBinItem[];
//   contactMessages: ContactMessage[];
//   contactSubmissions: ContactMessage[];

//   // Mutations
//   addProject: (project: Omit<Project, 'id' | 'sort_order'>) => Promise<void>;
//   updateProject: (project: Project) => Promise<void>;
//   deleteProject: (id: string) => Promise<void>;
//   addCertification: (cert: Omit<Certification, 'id'>) => Promise<void>;
//   deleteCertification: (id: string) => Promise<void>;
//   sendContactMessage: (name: string, email: string, message: string) => Promise<boolean>;
//   markMessageRead: (id: string) => void;
//   markNotificationAsRead: (id: string) => void;
//   clearNotifications: () => void;
//   addNotification: (notification: Omit<NotificationItem, 'id' | 'time' | 'read'> & { appId?: AppId }) => void;
//   emptyRecycleBin: () => void;
//   restoreRecycleBinItem: (id: string) => void;
//   permanentlyDeleteRecycleBinItem: (id: string) => void;

//   // Admin Auth
//   isAdminLoggedIn: boolean;
//   isAdminAuthenticated: boolean;
//   loginAdmin: (pass: string) => boolean;
//   adminLogin: (emailOrPass: string, pass?: string) => Promise<boolean>;
//   logoutAdmin: () => void;
//   adminLogout: () => void;

//   // Audio / Sound
//   playSystemSound: (type: 'click' | 'open' | 'notify' | 'shutdown' | 'boot') => void;
// }

// export interface Desktop {
//   id: string;
//   name: string;
//   accent: string;
// }

// const OSContext = createContext<OSContextType | null>(null);

// const APP_TITLES: Record<AppId, string> = {
//   'this-pc': 'This PC',
//   'about': 'About Abhishek',
//   'projects': 'Projects Explorer',
//   'experience': 'Professional Experience',
//   'skills': 'System Specifications — Skills',
//   'education': 'Education History',
//   'certifications': 'Certifications & Credentials',
//   'resume': 'Resume — Abhishek_Kuntare.pdf',
//   'contact': 'Contact Abhishek',
//   'recycle-bin': 'Recycle Bin',
//   'terminal': 'Windows PowerShell / Terminal',
//   'system-info': 'System Information',
//   'settings': 'Settings',
//   'admin': 'Abhishek Portfolio Control Center',
//   'browser': 'Abhishek Browser',
//   'calendar': 'Calendar & Milestones',
//   'youtube': 'YouTube Embed Studio',
//   'spotify': 'Spotify Music Station',
//   'widgets': 'Workstation Widgets Board',
//   'gallery': 'Media & Project Gallery',
//   'weather': 'Weather Forecast',
//   'calculator': 'Calculator',
//   'notes': 'Workstation Notes',
//   'system-monitor': 'Task Manager',
//   'camera': 'Camera & Video Studio',
//   'video-player': 'Media Player',
//   'music-player': 'Music Station',
//   'code-editor': 'Abhishek Code Studio',
//   'writer': 'Abhishek Writer',
//   'sheets': 'Abhishek Sheets',
//   'pdf-viewer': 'PDF Document Viewer',
//   'snipping-tool': 'Snipping Tool',
//   'arcade': 'Arcade Center',
//   'downloads': 'Downloads & Files',
//   'achievements': 'Achievements & Milestones',
//   'file-explorer': 'File Explorer',
//   'ai': 'Abhishek AI',
//   'git': 'Git Studio',
//   'api-tester': 'API Lab',
//   'performance': 'Performance Center',
//   'security': 'Security Center',
//   'control-panel': 'Control Panel',
//   'store': 'Abhishek Store',
// };

// const APP_ICONS: Record<AppId, string> = {
//   'this-pc': 'Monitor',
//   'about': 'UserCheck',
//   'projects': 'FolderKanban',
//   'experience': 'Briefcase',
//   'skills': 'Cpu',
//   'education': 'GraduationCap',
//   'certifications': 'Award',
//   'resume': 'FileText',
//   'contact': 'Mail',
//   'recycle-bin': 'Trash2',
//   'terminal': 'Terminal',
//   'system-info': 'HardDrive',
//   'settings': 'Settings',
//   'admin': 'ShieldAlert',
//   'browser': 'Globe',
//   'calendar': 'Calendar',
//   'youtube': 'Youtube',
//   'spotify': 'Music',
//   'widgets': 'Sparkles',
//   'gallery': 'Images',
//   'weather': 'CloudSun',
//   'calculator': 'Calculator',
//   'notes': 'StickyNote',
//   'system-monitor': 'Activity',
//   'camera': 'Camera',
//   'video-player': 'Video',
//   'music-player': 'Music',
//   'code-editor': 'Code2',
//   'writer': 'FileText',
//   'sheets': 'Table',
//   'pdf-viewer': 'FileText',
//   'snipping-tool': 'Sparkles',
//   'arcade': 'Gamepad2',
//   'downloads': 'Folder',
//   'achievements': 'Trophy',
//   'file-explorer': 'Folder',
//   'ai': 'Sparkles',
//   'git': 'GitBranch',
//   'api-tester': 'Send',
//   'performance': 'Activity',
//   'security': 'ShieldCheck',
//   'control-panel': 'SlidersHorizontal',
//   'store': 'Store',
// };

// const DEFAULT_TASKBAR_APPS: TaskbarApp[] = [
//   { appId: 'this-pc', title: 'This PC', icon: 'Monitor' },
//   { appId: 'browser', title: 'Browser', icon: 'Globe' },
//   { appId: 'youtube', title: 'YouTube', icon: 'Youtube' },
//   { appId: 'spotify', title: 'Spotify', icon: 'Music' },
//   { appId: 'gallery', title: 'Gallery', icon: 'Images' },
//   { appId: 'projects', title: 'Projects', icon: 'FolderKanban' },
//   { appId: 'terminal', title: 'Terminal', icon: 'Terminal' },
//   { appId: 'resume', title: 'Resume', icon: 'FileText' },
//   { appId: 'settings', title: 'Settings', icon: 'Settings' },
// ];

// export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   // Power state: initial boot sequence (brief 1.5s)
//   const [powerState, setPowerState] = useState<SystemPowerState>('booting');

//   // Window list & zIndex counter
//   const [windows, setWindows] = useState<WindowState[]>([]);
//   const [recentClosedApps, setRecentClosedApps] = useState<AppId[]>([]);
//   const [taskbarApps, setTaskbarApps] = useState<TaskbarApp[]>(() =>
//     getStoredTaskbarApps(DEFAULT_TASKBAR_APPS)
//   );
//   const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
//   const [highestZ, setHighestZ] = useState<number>(10);
//   const highestZRef = useRef(10);
//   const [desktops, setDesktops] = useState<Desktop[]>([
//     { id: 'desktop-1', name: 'Desktop 1', accent: 'from-sky-500 to-indigo-500' },
//   ]);
//   const [activeDesktopId, setActiveDesktopId] = useState('desktop-1');
//   const [isDesktopOverviewOpen, setDesktopOverviewOpen] = useState(false);

//   // Panels
//   const [isStartMenuOpen, setStartMenuOpen] = useState(false);
//   const [isSearchOpen, setSearchOpen] = useState(false);
//   const [isNotificationCenterOpen, setNotificationCenterOpen] = useState(false);
//   const [contextMenu, setContextMenu] = useState<ContextMenuState>({
//     isOpen: false,
//     x: 0,
//     y: 0,
//     type: 'desktop',
//   });

//   // Desktop selection & icons
//   const [desktopIcons, setDesktopIcons] = useState<DesktopIconItem[]>(() => {
//     try {
//       const stored = localStorage.getItem('abhishek-desktop-icons');
//       if (!stored) return DESKTOP_ICONS;
//       const saved = JSON.parse(stored) as DesktopIconItem[];
//       const savedIds = new Set(saved.map(icon => icon.id));
//       const deletedIds = new Set(
//         getRecycleBinItems()
//           .filter(item => item.originalType === 'desktop-icon' && item.payload?.id)
//           .map(item => item.payload.id)
//       );
//       return [
//         ...saved,
//         ...DESKTOP_ICONS.filter(icon => !savedIds.has(icon.id) && !deletedIds.has(icon.id)),
//       ];
//     } catch {
//       return DESKTOP_ICONS;
//     }
//   });
//   const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
//   const iconHistory = useRef<{ before: DesktopIconItem[]; after: DesktopIconItem[] }[]>([]);
//   const iconHistoryIndex = useRef(-1);
//   const [favoriteDesktopIconIds, setFavoriteDesktopIconIds] = useState<string[]>(() => {
//     try {
//       const stored = localStorage.getItem('abhishek-desktop-favorites');
//       return stored ? JSON.parse(stored) : [];
//     } catch {
//       return [];
//     }
//   });

//   // System settings
//   const [settings, setSettings] = useState<SystemSettings>(getStoredSettings);
//   const [customWallpaperUrl, setCustomWallpaperUrl] = useState<string | null>(null);
//   const [customWallpaperType, setCustomWallpaperType] = useState<'image' | 'video' | null>(null);

//   useEffect(() => {
//     let objectUrl: string | null = null;
//     let disposed = false;
//     const loadWallpaper = async () => {
//       const blob = await getCustomWallpaper();
//       if (disposed || !blob) return;
//       const nextUrl = URL.createObjectURL(blob);
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//       objectUrl = nextUrl;
//       setCustomWallpaperUrl(nextUrl);
//       setCustomWallpaperType(blob.type.startsWith('video/') ? 'video' : 'image');
//     };
//     const handleWallpaperChange = () => {
//       void loadWallpaper().catch(error => {
//         console.error('Unable to load custom wallpaper:', error);
//       });
//     };
//     handleWallpaperChange();
//     window.addEventListener('abhishek-wallpaper-changed', handleWallpaperChange);
//     return () => {
//       disposed = true;
//       window.removeEventListener('abhishek-wallpaper-changed', handleWallpaperChange);
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//     };
//   }, []);

//   // Keep the browser document in sync with settings so every application,
//   // including portals and overlays, can use the same theme and accent.
//   useEffect(() => {
//     const root = document.documentElement;
//     root.dataset.theme = settings.theme;
//     root.style.setProperty('--os-accent', settings.accentColor);
//     root.style.setProperty('--os-brightness', `${settings.brightness}%`);
//     root.style.colorScheme = settings.theme;
//   }, [settings.theme, settings.accentColor, settings.brightness]);

//   // Data states
//   const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
//   const [experiences, setExperiences] = useState<Experience[]>(getStoredExperiences);
//   const [skills, setSkills] = useState<Skill[]>(getStoredSkills);
//   const [education] = useState<Education>(INITIAL_EDUCATION);
//   const [certifications, setCertifications] = useState<Certification[]>([]);
//   const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);
//   const [recycleBinItems, setRecycleBinItems] = useState<RecycleBinItem[]>(() => {
//     const stored = getRecycleBinItems();
//     const seen = new Set<string>();
//     const deduplicated = stored.filter(item => {
//       const key = item.originalType === 'desktop-icon' && item.payload?.id
//         ? `desktop-icon:${item.payload.id}`
//         : item.id;
//       if (seen.has(key)) return false;
//       seen.add(key);
//       return true;
//     });
//     if (deduplicated.length !== stored.length) saveRecycleBinItems(deduplicated);
//     return deduplicated;
//   });
//   const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
//   const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(getAdminAuthState);

//   // Play subtle synthetic system sound via Web Audio API without external files
//   const playSystemSound = useCallback((type: 'click' | 'open' | 'notify' | 'shutdown' | 'boot') => {
//     if (!settings.soundsEnabled) return;
//     try {
//       const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
//       if (!AudioContext) return;
//       const ctx = new AudioContext();

//       if (type === 'click') {
//         const osc = ctx.createOscillator();
//         const gain = ctx.createGain();
//         osc.frequency.setValueAtTime(800, ctx.currentTime);
//         gain.gain.setValueAtTime(0.04, ctx.currentTime);
//         gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
//         osc.connect(gain);
//         gain.connect(ctx.destination);
//         osc.start();
//         osc.stop(ctx.currentTime + 0.05);
//       } else if (type === 'open') {
//         const osc = ctx.createOscillator();
//         const gain = ctx.createGain();
//         osc.frequency.setValueAtTime(520, ctx.currentTime);
//         osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);
//         gain.gain.setValueAtTime(0.05, ctx.currentTime);
//         gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
//         osc.connect(gain);
//         gain.connect(ctx.destination);
//         osc.start();
//         osc.stop(ctx.currentTime + 0.11);
//       } else if (type === 'notify') {
//         const osc = ctx.createOscillator();
//         const gain = ctx.createGain();
//         osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
//         osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
//         gain.gain.setValueAtTime(0.05, ctx.currentTime);
//         gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
//         osc.connect(gain);
//         gain.connect(ctx.destination);
//         osc.start();
//         osc.stop(ctx.currentTime + 0.26);
//       }
//     } catch {
//       // Audio context might be restricted before user interaction; ignore silently
//     }
//   }, [settings.soundsEnabled]);

//   // Load initial asynchronous data
//   useEffect(() => {
//     async function loadData() {
//       const p = await getStoredProjects();
//       setProjects(p);
//       const c = await getStoredCertifications();
//       setCertifications(c);
//       const m = await getStoredContactMessages();
//       setContactMessages(m);
//     }
//     loadData();
//   }, []);

//   // Update settings handler
//   const updateSettings = useCallback((newSettings: Partial<SystemSettings>) => {
//     setSettings(prev => {
//       const updated = { ...prev, ...newSettings, theme: 'dark' as const };
//       saveSettings(updated);
//       return updated;
//     });
//   }, []);

//   const wallpapers = useMemo(() => {
//     const customVideo = customWallpaperUrl;
//     if (!customVideo) return INITIAL_WALLPAPERS;
//     return [
//       ...INITIAL_WALLPAPERS,
//       {
//         id: 'wall-custom',
//         name: 'System wallpaper',
//         thumbnailColor: '#111827',
//         style: customWallpaperType === 'image'
//           ? `center / cover no-repeat url("${customVideo}")`
//           : '#020617',
//         type: customWallpaperType === 'video' ? 'video' as const : 'static' as const,
//         videoUrl: customWallpaperType === 'video' ? customVideo : undefined,
//         description: 'Wallpaper selected from this device',
//       },
//     ];
//   }, [customWallpaperType, customWallpaperUrl, settings.wallpaperId]);
//   const currentWallpaper = useMemo(() => {
//     return wallpapers.find(w => w.id === settings.wallpaperId) || wallpapers[0];
//   }, [settings.wallpaperId, wallpapers]);

//   // Close context menu
//   const closeContextMenu = useCallback(() => {
//     setContextMenu(prev => (prev.isOpen ? { ...prev, isOpen: false } : prev));
//   }, []);

//   // Open context menu helper
//   const openContextMenu = useCallback((x: number, y: number, type: 'desktop' | 'taskbar' | 'icon' = 'desktop', targetId?: string) => {
//     setContextMenu({ isOpen: true, x, y, type, targetId });
//     setStartMenuOpen(false);
//     setSearchOpen(false);
//     setNotificationCenterOpen(false);
//   }, []);

//   // Close all overlays & flyout menus
//   const closeAllOverlays = useCallback(() => {
//     setStartMenuOpen(false);
//     setSearchOpen(false);
//     setNotificationCenterOpen(false);
//     closeContextMenu();
//     setDesktopOverviewOpen(false);
//   }, [closeContextMenu]);

//   const switchDesktop = useCallback((id: string) => {
//     if (!desktops.some(desktop => desktop.id === id)) return;
//     setActiveDesktopId(id);
//     setWindows(prev => {
//       const nextWindow = [...prev]
//         .filter(win => win.desktopId === id && !win.isMinimized)
//         .sort((a, b) => b.zIndex - a.zIndex)[0];
//       setActiveWindowId(nextWindow?.id || null);
//       return prev;
//     });
//     setDesktopOverviewOpen(false);
//     playSystemSound('click');
//   }, [desktops, playSystemSound]);

//   const createDesktop = useCallback(() => {
//     const id = `desktop-${Date.now()}`;
//     setDesktops(prev => [...prev, { id, name: `Desktop ${prev.length + 1}`, accent: 'from-violet-500 to-fuchsia-500' }]);
//     setActiveDesktopId(id);
//     setActiveWindowId(null);
//     setDesktopOverviewOpen(false);
//     playSystemSound('open');
//   }, [playSystemSound]);

//   const deleteDesktop = useCallback((id: string) => {
//     if (desktops.length === 1) return;
//     const remaining = desktops.filter(desktop => desktop.id !== id);
//     setDesktops(remaining);
//     const destinationId = activeDesktopId === id ? remaining[0].id : activeDesktopId;
//     setWindows(prev => prev.map(win => win.desktopId === id ? { ...win, desktopId: destinationId } : win));
//     if (activeDesktopId === id) {
//       const next = remaining[0];
//       setActiveDesktopId(next.id);
//       setActiveWindowId(null);
//     }
//     playSystemSound('click');
//   }, [activeDesktopId, desktops, playSystemSound]);

//   const moveWindowToDesktop = useCallback((windowId: string, desktopId: string) => {
//     if (!desktops.some(desktop => desktop.id === desktopId)) return;
//     setWindows(prev => prev.map(win => win.id === windowId ? { ...win, desktopId } : win));
//     if (desktopId !== activeDesktopId && activeWindowId === windowId) {
//       setActiveWindowId(null);
//     }
//     playSystemSound('click');
//   }, [activeDesktopId, activeWindowId, desktops, playSystemSound]);

//   // Toggle helpers
//   const toggleStartMenu = useCallback(() => {
//     setStartMenuOpen(prev => {
//       const next = !prev;
//       if (next) {
//         setSearchOpen(false);
//         setNotificationCenterOpen(false);
//         closeContextMenu();
//       }
//       return next;
//     });
//   }, [closeContextMenu]);

//   const toggleSearch = useCallback(() => {
//     setSearchOpen(prev => {
//       const next = !prev;
//       if (next) {
//         setStartMenuOpen(false);
//         setNotificationCenterOpen(false);
//         closeContextMenu();
//       }
//       return next;
//     });
//   }, [closeContextMenu]);

//   const toggleNotificationCenter = useCallback(() => {
//     setNotificationCenterOpen(prev => {
//       const next = !prev;
//       if (next) {
//         setStartMenuOpen(false);
//         setSearchOpen(false);
//         closeContextMenu();
//       }
//       return next;
//     });
//   }, [closeContextMenu]);

//   // Focus a window
//   const focusWindow = useCallback((id: string) => {
//     setActiveWindowId(id);
//     setWindows(prev => {
//       const target = prev.find(w => w.id === id);
//       if (!target) return prev;
//       const nextZ = highestZ + 1;
//       setHighestZ(nextZ);
//       return prev.map(w => (w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w));
//     });
//     setStartMenuOpen(false);
//     setSearchOpen(false);
//     setNotificationCenterOpen(false);
//     closeContextMenu();
//   }, [highestZ, closeContextMenu]);

//   // Open App
//   const openApp = useCallback((appId: AppId, extraData?: any) => {
//     playSystemSound('open');
//     setStartMenuOpen(false);
//     setSearchOpen(false);
//     setNotificationCenterOpen(false);
//     closeContextMenu();

//     setWindows(prev => {
//       const existing = prev.find(w => w.appId === appId && w.desktopId === activeDesktopId);
//       const nextZ = highestZRef.current + 1;
//       highestZRef.current = nextZ;
//       setHighestZ(nextZ);

//       if (existing) {
//         setActiveWindowId(existing.id);
//         return prev.map(w =>
//           w.id === existing.id
//             ? { ...w, isMinimized: false, zIndex: nextZ, extraData: extraData || w.extraData }
//             : w
//         );
//       }

//       // Calculate staggered default position
//       const offset = (prev.length % 6) * 28;
//       const isMobile = window.innerWidth < 768;
//       const defaultWidth = isMobile ? window.innerWidth : Math.min(window.innerWidth - 60, 940);
//       const defaultHeight = isMobile ? window.innerHeight - 56 : Math.min(window.innerHeight - 100, 640);
//       const defaultX = isMobile ? 0 : Math.max(30, (window.innerWidth - defaultWidth) / 2 + offset);
//       const defaultY = isMobile ? 0 : Math.max(30, (window.innerHeight - defaultHeight) / 2 - 20 + offset);

//       const newWindow: WindowState = {
//         id: `win-${appId}-${Date.now()}`,
//         appId,
//         title: APP_TITLES[appId] || 'Application',
//         iconName: APP_ICONS[appId] || 'AppWindow',
//         isMinimized: false,
//         isMaximized: isMobile,
//         position: { x: defaultX, y: defaultY },
//         size: { width: defaultWidth, height: defaultHeight },
//         zIndex: nextZ,
//         extraData,
//         desktopId: activeDesktopId,
//       };

//       setActiveWindowId(newWindow.id);
//       return [...prev, newWindow];
//     });
//   }, [activeDesktopId, highestZ, playSystemSound, closeContextMenu]);

//   // Mode launchers intentionally open a curated workspace rather than replacing
//   // the user's existing windows. Delayed launches keep the desktop responsive
//   // and make the workflow feel like a smooth workspace handoff.
//   const activateMode = useCallback((mode: 'recruiter' | 'developer') => {
//     const apps: AppId[] = mode === 'recruiter'
//       ? ['resume', 'experience', 'projects', 'skills', 'git', 'contact']
//       : ['git', 'projects', 'api-tester', 'terminal', 'code-editor', 'this-pc', 'system-monitor', 'performance', 'system-info'];
//     updateSettings({ workspaceMode: mode, recruiterMode: mode === 'recruiter' });
//     apps.forEach((appId, index) => {
//       window.setTimeout(() => openApp(appId), index * 110);
//     });
//   }, [openApp, updateSettings]);

//   // Close Window
//   const closeWindow = useCallback((id: string) => {
//     playSystemSound('click');
//     setWindows(prev => {
//       const closing = prev.find(w => w.id === id);
//       const remaining = prev.filter(w => w.id !== id);
//       if (closing) {
//         setRecentClosedApps(recent => [closing.appId, ...recent.filter(appId => appId !== closing.appId)].slice(0, 5));
//       }
//       if (activeWindowId === id) {
//         if (remaining.length > 0) {
//           const topWindow = [...remaining].sort((a, b) => b.zIndex - a.zIndex)[0];
//           setActiveWindowId(topWindow.id);
//         } else {
//           setActiveWindowId(null);
//         }
//       }
//       return remaining;
//     });
//   }, [activeWindowId, playSystemSound]);

//   const goHome = useCallback(() => {
//     setWindows(previous => previous.map(window => ({ ...window, isMinimized: true })));
//     setActiveWindowId(null);
//     closeAllOverlays();
//     setSelectedIconId(null);
//     playSystemSound('click');
//   }, [closeAllOverlays, playSystemSound]);

//   const reorderTaskbarApps = useCallback((fromAppId: AppId, toAppId: AppId) => {
//     setTaskbarApps(prev => {
//       const from = prev.findIndex(app => app.appId === fromAppId);
//       const to = prev.findIndex(app => app.appId === toAppId);
//       if (from < 0 || to < 0 || from === to) return prev;
//       const next = [...prev];
//       const [moved] = next.splice(from, 1);
//       next.splice(to, 0, moved);
//       saveTaskbarApps(next);
//       return next;
//     });
//   }, []);

//   const pinTaskbarApp = useCallback((app: TaskbarApp) => {
//     setTaskbarApps(prev => {
//       if (prev.some(item => item.appId === app.appId)) return prev;
//       const next = [...prev, app];
//       saveTaskbarApps(next);
//       return next;
//     });
//   }, []);

//   const unpinTaskbarApp = useCallback((appId: AppId) => {
//     setTaskbarApps(prev => {
//       const next = prev.filter(app => app.appId !== appId);
//       saveTaskbarApps(next);
//       return next;
//     });
//   }, []);

//   // Minimize Window
//   const minimizeWindow = useCallback((id: string) => {
//     playSystemSound('click');
//     setWindows(prev =>
//       prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
//     );
//     setActiveWindowId(current => {
//       if (current === id) {
//         const visible = windows.filter(w => w.id !== id && !w.isMinimized);
//         if (visible.length > 0) {
//           return [...visible].sort((a, b) => b.zIndex - a.zIndex)[0].id;
//         }
//         return null;
//       }
//       return current;
//     });
//   }, [windows, playSystemSound]);

//   // Maximize / Restore Window
//   const maximizeWindow = useCallback((id: string) => {
//     playSystemSound('click');
//     setWindows(prev =>
//       prev.map(w => {
//         if (w.id !== id) return w;
//         if (!w.isMaximized) {
//           // Maximize
//           return {
//             ...w,
//             isMaximized: true,
//             prevBounds: {
//               x: w.position.x,
//               y: w.position.y,
//               width: w.size.width,
//               height: w.size.height,
//             },
//           };
//         } else {
//           // Restore
//           const prevB = w.prevBounds || {
//             x: 60,
//             y: 40,
//             width: Math.min(window.innerWidth - 80, 920),
//             height: Math.min(window.innerHeight - 120, 620),
//           };
//           return {
//             ...w,
//             isMaximized: false,
//             position: { x: prevB.x, y: prevB.y },
//             size: { width: prevB.width, height: prevB.height },
//           };
//         }
//       })
//     );
//   }, [playSystemSound]);

//   // Update window position
//   const updateWindowPosition = useCallback((id: string, pos: { x: number; y: number }) => {
//     setWindows(prev =>
//       prev.map(w => (w.id === id ? { ...w, position: pos } : w))
//     );
//   }, []);

//   // Update window size
//   const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
//     setWindows(prev =>
//       prev.map(w => (w.id === id ? { ...w, size } : w))
//     );
//   }, []);

//   // Refresh desktop
//   const refreshDesktop = useCallback(() => {
//     playSystemSound('notify');
//     setSelectedIconId(null);
//     closeContextMenu();
//   }, [playSystemSound, closeContextMenu]);

//   const recordIconChange = useCallback((before: DesktopIconItem[], after: DesktopIconItem[]) => {
//     iconHistory.current = iconHistory.current.slice(0, iconHistoryIndex.current + 1);
//     iconHistory.current.push({ before, after });
//     iconHistoryIndex.current = iconHistory.current.length - 1;
//   }, []);

//   const renameDesktopIcon = useCallback((id: string, title: string) => {
//     const trimmed = title.trim();
//     if (!trimmed) return;
//     setDesktopIcons(previous => {
//       const updated = previous.map(icon => icon.id === id ? { ...icon, title: trimmed } : icon);
//       recordIconChange(previous, updated);
//       localStorage.setItem('abhishek-desktop-icons', JSON.stringify(updated));
//       return updated;
//     });
//     playSystemSound('click');
//   }, [playSystemSound, recordIconChange]);

//   const removeDesktopIcon = useCallback((id: string) => {
//     const icon = desktopIcons.find(item => item.id === id);
//     if (!icon || icon.appId === 'recycle-bin') return;
//     const recycleItem: RecycleBinItem = {
//       id: `desktop-icon-${id}-${Date.now()}`,
//       originalType: 'desktop-icon',
//       name: icon.title,
//       deletedAt: new Date().toISOString(),
//       payload: icon,
//     };
//     setDesktopIcons(previous => {
//       const updated = previous.filter(icon => icon.id !== id);
//       if (updated.length !== previous.length) {
//         recordIconChange(previous, updated);
//       }
//       localStorage.setItem('abhishek-desktop-icons', JSON.stringify(updated));
//       return updated;
//     });
//     setRecycleBinItems(previousItems => {
//       const alreadyDeleted = previousItems.some(item =>
//         item.originalType === 'desktop-icon' && item.payload?.id === id
//       );
//       if (alreadyDeleted) return previousItems;
//       const next = [recycleItem, ...previousItems];
//       saveRecycleBinItems(next);
//       return next;
//     });
//     setSelectedIconId(previous => previous === id ? null : previous);
//     playSystemSound('click');
//   }, [desktopIcons, playSystemSound, recordIconChange]);

//   const createDesktopItem = useCallback(async (type: 'folder' | 'text') => {
//     const baseName = type === 'folder' ? 'New folder' : 'New Text Document';
//     const extension = type === 'text' ? 'txt' : '';
//     const existingNames = new Set(desktopIcons.map(icon => icon.title));
//     let title = baseName;
//     let suffix = 2;
//     while (existingNames.has(title) || existingNames.has(`${title}.${extension}`)) {
//       title = `${baseName} (${suffix++})`;
//     }

//     const fileName = extension ? `${title}.${extension}` : title;
//     const itemId = `desktop-${type}-${Date.now()}`;
//     await saveVFSFile({
//       id: itemId,
//       name: fileName,
//       path: `/Desktop/${fileName}`,
//       type: type === 'folder' ? 'folder' : 'file',
//       extension,
//       mimeType: type === 'folder' ? 'inode/directory' : 'text/plain',
//       size: 0,
//       updatedAt: Date.now(),
//       content: '',
//       isSystem: false,
//     });

//     setDesktopIcons(previous => {
//       const updated = [...previous, {
//         id: itemId,
//         appId: (type === 'folder' ? 'file-explorer' : 'writer') as AppId,
//         title: fileName,
//         iconName: type === 'folder' ? 'Folder' : 'FileText',
//         fileExtension: extension || undefined,
//       }];
//       recordIconChange(previous, updated);
//       localStorage.setItem('abhishek-desktop-icons', JSON.stringify(updated));
//       return updated;
//     });
//     setSelectedIconId(itemId);
//     playSystemSound('notify');
//   }, [desktopIcons, playSystemSound, recordIconChange]);

//   const addDesktopAppShortcut = useCallback((appId: AppId, title: string, iconName: string, shortcutId?: string, extraData?: any) => {
//     setDesktopIcons(previous => {
//       if (previous.some(icon => icon.id === (shortcutId || `icon-${appId}`))) return previous;
//       const updated = [...previous, {
//         id: shortcutId || `icon-${appId}`,
//         appId,
//         title,
//         iconName,
//         extraData,
//       }];
//       recordIconChange(previous, updated);
//       localStorage.setItem('abhishek-desktop-icons', JSON.stringify(updated));
//       return updated;
//     });
//     playSystemSound('notify');
//   }, [playSystemSound, recordIconChange]);

//   const removeDesktopAppShortcut = useCallback((id: string) => {
//     setDesktopIcons(previous => {
//       const updated = previous.filter(icon => icon.id !== id);
//       if (updated.length === previous.length) return previous;
//       recordIconChange(previous, updated);
//       localStorage.setItem('abhishek-desktop-icons', JSON.stringify(updated));
//       return updated;
//     });
//     setSelectedIconId(previous => previous === id ? null : previous);
//     playSystemSound('click');
//   }, [playSystemSound, recordIconChange]);

//   const applyIconHistory = useCallback((next: DesktopIconItem[], index: number) => {
//     iconHistoryIndex.current = index;
//     setDesktopIcons(next);
//     localStorage.setItem('abhishek-desktop-icons', JSON.stringify(next));
//     setSelectedIconId(null);
//     playSystemSound('click');
//   }, [playSystemSound]);

//   const undoDesktopChange = useCallback(() => {
//     const entry = iconHistory.current[iconHistoryIndex.current];
//     if (!entry) return;
//     applyIconHistory(entry.before, iconHistoryIndex.current - 1);
//   }, [applyIconHistory]);

//   const redoDesktopChange = useCallback(() => {
//     const entry = iconHistory.current[iconHistoryIndex.current + 1];
//     if (!entry) return;
//     applyIconHistory(entry.after, iconHistoryIndex.current + 1);
//   }, [applyIconHistory]);

//   const toggleFavoriteDesktopIcon = useCallback((id: string) => {
//     setFavoriteDesktopIconIds(previous => {
//       const updated = previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id];
//       localStorage.setItem('abhishek-desktop-favorites', JSON.stringify(updated));
//       return updated;
//     });
//     playSystemSound('notify');
//   }, [playSystemSound]);

//   // Power actions
//   const restartSystem = useCallback(() => {
//     setPowerState('booting');
//     setWindows([]);
//     setActiveWindowId(null);
//     setStartMenuOpen(false);
//   }, []);

//   const shutdownSystem = useCallback(() => {
//     setPowerState('shutting-down');
//     setStartMenuOpen(false);
//     setWindows([]);
//     setTimeout(() => {
//       setPowerState('off');
//     }, 1800);
//   }, []);

//   const sleepSystem = useCallback(() => {
//     setPowerState('sleeping');
//     setStartMenuOpen(false);
//   }, []);

//   const wakeSystem = useCallback(() => {
//     setPowerState('running');
//   }, []);

//   const unlockSystem = useCallback(() => {
//     setPowerState('running');
//   }, []);

//   // Data mutations: Add project
//   const addProject = useCallback(async (newProjData: Omit<Project, 'id' | 'sort_order'>) => {
//     const newProj: Project = {
//       ...newProjData,
//       id: `proj-${Date.now()}`,
//       sort_order: projects.length + 1,
//       created_at: new Date().toISOString(),
//     };
//     const updated = [newProj, ...projects];
//     setProjects(updated);
//     await saveProjects(updated);

//     // Notify user
//     const notif: NotificationItem = {
//       id: `notif-${Date.now()}`,
//       title: 'Project Published',
//       message: `"${newProj.title}" is now published on your public portfolio.`,
//       time: 'Just now',
//       type: 'success',
//       read: false,
//     };
//     const updatedNotifs = [notif, ...notifications];
//     setNotifications(updatedNotifs);
//     saveNotifications(updatedNotifs);
//     playSystemSound('notify');
//   }, [projects, notifications, playSystemSound]);

//   // Update project
//   const updateProject = useCallback(async (updatedProj: Project) => {
//     const updated = projects.map(p => (p.id === updatedProj.id ? updatedProj : p));
//     setProjects(updated);
//     await saveProjects(updated);
//     playSystemSound('notify');
//   }, [projects, playSystemSound]);

//   // Delete project -> moves to recycle bin
//   const deleteProject = useCallback(async (id: string) => {
//     const target = projects.find(p => p.id === id);
//     if (!target) return;
//     const updatedProjects = projects.filter(p => p.id !== id);
//     setProjects(updatedProjects);
//     await saveProjects(updatedProjects);

//     // Add to recycle bin
//     const binItem: RecycleBinItem = {
//       id: `bin-${Date.now()}`,
//       originalType: 'project',
//       name: target.title,
//       deletedAt: new Date().toISOString(),
//       payload: target,
//     };
//     const updatedBin = [binItem, ...recycleBinItems];
//     setRecycleBinItems(updatedBin);
//     saveRecycleBinItems(updatedBin);
//     playSystemSound('click');
//   }, [projects, recycleBinItems, playSystemSound]);

//   // Add certification
//   const addCertification = useCallback(async (certData: Omit<Certification, 'id'>) => {
//     const newCert: Certification = {
//       ...certData,
//       id: `cert-${Date.now()}`,
//     };
//     const updated = [newCert, ...certifications];
//     setCertifications(updated);
//     await saveCertifications(updated);
//     playSystemSound('notify');
//   }, [certifications, playSystemSound]);

//   // Delete certification
//   const deleteCertification = useCallback(async (id: string) => {
//     const target = certifications.find(c => c.id === id);
//     if (!target) return;
//     const updated = certifications.filter(c => c.id !== id);
//     setCertifications(updated);
//     await saveCertifications(updated);
//   }, [certifications]);

//   // Send contact message
//   const sendContactMessage = useCallback(async (name: string, email: string, message: string): Promise<boolean> => {
//     try {
//       const newMsg = await saveContactMessage({ name, email, message });
//       setContactMessages(prev => [newMsg, ...prev]);

//       // Add system notification for incoming message
//       const notif: NotificationItem = {
//         id: `notif-${Date.now()}`,
//         title: `Message from ${name}`,
//         message: `New inquiry sent to ${PROFILE_INFO.email}`,
//         time: 'Just now',
//         type: 'success',
//         read: false,
//       };
//       setNotifications(prev => {
//         const u = [notif, ...prev];
//         saveNotifications(u);
//         return u;
//       });
//       playSystemSound('notify');
//       return true;
//     } catch {
//       return false;
//     }
//   }, [playSystemSound]);

//   // Notification actions
//   const addNotification = useCallback((notification: Omit<NotificationItem, 'id' | 'time' | 'read'> & { appId?: AppId }) => {
//     setNotifications(prev => {
//       const next = [{ ...notification, id: `notif-${Date.now()}`, time: 'Just now', read: false }, ...prev];
//       saveNotifications(next);
//       return next;
//     });
//   }, []);

//   const markNotificationAsRead = useCallback((id: string) => {
//     setNotifications(prev => {
//       const u = prev.map(n => (n.id === id ? { ...n, read: true } : n));
//       saveNotifications(u);
//       return u;
//     });
//   }, []);

//   const clearNotifications = useCallback(() => {
//     setNotifications([]);
//     saveNotifications([]);
//   }, []);

//   // Recycle Bin actions
//   const emptyRecycleBin = useCallback(() => {
//     setRecycleBinItems([]);
//     saveRecycleBinItems([]);
//     playSystemSound('click');
//   }, [playSystemSound]);

//   const restoreRecycleBinItem = useCallback((id: string) => {
//     const item = recycleBinItems.find(i => i.id === id);
//     if (!item) return;

//     if (item.originalType === 'project' && item.payload) {
//       setProjects(prev => {
//         const u = [item.payload as Project, ...prev];
//         saveProjects(u);
//         return u;
//       });
//     }
//     if (item.originalType === 'desktop-icon' && item.payload) {
//       setDesktopIcons(previous => {
//         if (previous.some(icon => icon.id === item.payload.id)) return previous;
//         const restored = [...previous, item.payload as DesktopIconItem];
//         localStorage.setItem('abhishek-desktop-icons', JSON.stringify(restored));
//         return restored;
//       });
//     }

//     const updatedBin = recycleBinItems.filter(i => i.id !== id);
//     setRecycleBinItems(updatedBin);
//     saveRecycleBinItems(updatedBin);
//     playSystemSound('open');
//   }, [recycleBinItems, playSystemSound]);

//   const permanentlyDeleteRecycleBinItem = useCallback((id: string) => {
//     const updated = recycleBinItems.filter(item => item.id !== id);
//     setRecycleBinItems(updated);
//     saveRecycleBinItems(updated);
//     playSystemSound('click');
//   }, [recycleBinItems, playSystemSound]);

//   // Admin login
//   const loginAdmin = useCallback((pass: string): boolean => {
//     // Development/demo credential support: Demo@12345
//     if (pass === 'Demo@12345' || pass === 'admin123' || pass === 'abhishek') {
//       setIsAdminLoggedIn(true);
//       setAdminAuthState(true);
//       playSystemSound('notify');
//       return true;
//     }
//     return false;
//   }, [playSystemSound]);

//   const logoutAdmin = useCallback(() => {
//     setIsAdminLoggedIn(false);
//     setAdminAuthState(false);
//     playSystemSound('click');
//   }, [playSystemSound]);

//   const adminLogin = useCallback(async (emailOrPass: string, pass?: string): Promise<boolean> => {
//     const passwordToCheck = pass !== undefined ? pass : emailOrPass;
//     if (
//       passwordToCheck === 'Demo@12345' ||
//       passwordToCheck === 'admin123' ||
//       passwordToCheck === 'abhishek' ||
//       passwordToCheck === 'admin'
//     ) {
//       setIsAdminLoggedIn(true);
//       setAdminAuthState(true);
//       playSystemSound('notify');
//       return true;
//     }
//     return false;
//   }, [playSystemSound]);

//   const adminLogout = useCallback(() => {
//     logoutAdmin();
//   }, [logoutAdmin]);

//   const markMessageRead = useCallback((id: string) => {
//     setContactMessages(prev => {
//       const updated = prev.map(m => (m.id === id ? { ...m, read: true } : m));
//       saveContactMessages(updated);
//       return updated;
//     });
//   }, []);

//   // Global Keyboard Shortcuts (Ctrl+K, Escape, Meta)
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       const target = e.target as HTMLElement | null;
//       const isEditableTarget = Boolean(
//         target &&
//         (target.isContentEditable ||
//           target.tagName === 'INPUT' ||
//           target.tagName === 'TEXTAREA' ||
//           target.tagName === 'SELECT')
//       );

//       // Ctrl + K or Cmd + K: Toggle Search
//       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
//         e.preventDefault();
//         setSearchOpen(prev => !prev);
//         setStartMenuOpen(false);
//         setNotificationCenterOpen(false);
//       }

//       if (!isEditableTarget && (e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'z') {
//         e.preventDefault();
//         if (e.shiftKey) redoDesktopChange(); else undoDesktopChange();
//       } else if (!isEditableTarget && (e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'y') {
//         e.preventDefault();
//         redoDesktopChange();
//       }

//       // Escape: Close panels or top active window
//       if (e.key === 'Escape') {
//         if (contextMenu.isOpen) {
//           closeContextMenu();
//           return;
//         }
//         if (isSearchOpen) {
//           setSearchOpen(false);
//           return;
//         }
//         if (isStartMenuOpen) {
//           setStartMenuOpen(false);
//           return;
//         }
//         if (isNotificationCenterOpen) {
//           setNotificationCenterOpen(false);
//           return;
//         }
//       }

//       // Alt + Tab: Switch windows
//       if (e.altKey && e.key === 'Tab') {
//         e.preventDefault();
//         if (windows.length > 1) {
//           const currentIndex = windows.findIndex(w => w.id === activeWindowId);
//           const nextIndex = (currentIndex + 1) % windows.length;
//           focusWindow(windows[nextIndex].id);
//         }
//       }

//       // Mission Control: Ctrl/Cmd + Up
//       if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key === 'ArrowUp') {
//         e.preventDefault();
//         setDesktopOverviewOpen(prev => !prev);
//         setStartMenuOpen(false);
//         setSearchOpen(false);
//         setNotificationCenterOpen(false);
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [
//     isSearchOpen,
//     isStartMenuOpen,
//     isNotificationCenterOpen,
//     contextMenu.isOpen,
//     windows,
//     activeWindowId,
//     desktops,
//     activeDesktopId,
//     switchDesktop,
//     createDesktop,
//     deleteDesktop,
//     isDesktopOverviewOpen,
//     setDesktopOverviewOpen,
//     focusWindow,
//     closeContextMenu,
//     undoDesktopChange,
//     redoDesktopChange,
//   ]);

//   const value = {
//     powerState,
//     setPowerState,
//     restartSystem,
//     shutdownSystem,
//     sleepSystem,
//     wakeSystem,
//     unlockSystem,
//     windows,
//     activeWindowId,
//     openApp,
//     activateMode,
//     closeWindow,
//     goHome,
//     recentClosedApps,
//     minimizeWindow,
//     maximizeWindow,
//     focusWindow,
//     updateWindowPosition,
//     updateWindowSize,
//     moveWindowToDesktop,
//     desktops,
//     activeDesktopId,
//     switchDesktop,
//     createDesktop,
//     deleteDesktop,
//     isDesktopOverviewOpen,
//     setDesktopOverviewOpen,
//     isStartMenuOpen,
//     setStartMenuOpen,
//     isSearchOpen,
//     setSearchOpen,
//     isNotificationCenterOpen,
//     setNotificationCenterOpen,
//     toggleStartMenu,
//     toggleSearch,
//     toggleNotificationCenter,
//     closeAllOverlays,
//     contextMenu,
//     setContextMenu,
//     openContextMenu,
//     closeContextMenu,
//     desktopIcons,
//     selectedIconId,
//     setSelectedIconId,
//     renameDesktopIcon,
//     removeDesktopIcon,
//     createDesktopItem,
//     addDesktopAppShortcut,
//     removeDesktopAppShortcut,
//     undoDesktopChange,
//     redoDesktopChange,
//     toggleFavoriteDesktopIcon,
//     favoriteDesktopIconIds,
//     refreshDesktop,
//     taskbarApps,
//     reorderTaskbarApps,
//     pinTaskbarApp,
//     unpinTaskbarApp,
//     settings,
//     updateSettings,
//     currentWallpaper,
//     wallpapers,
//     projects,
//     experiences,
//     skills,
//     education,
//     certifications,
//     notifications,
//     recycleBinItems,
//     contactMessages,
//     contactSubmissions: contactMessages,
//     addProject,
//     updateProject,
//     deleteProject,
//     addCertification,
//     deleteCertification,
//     sendContactMessage,
//     markMessageRead,
//     markNotificationAsRead,
//     clearNotifications,
//     addNotification,
//     emptyRecycleBin,
//     restoreRecycleBinItem,
//     permanentlyDeleteRecycleBinItem,
//     isAdminLoggedIn,
//     isAdminAuthenticated: isAdminLoggedIn,
//     loginAdmin,
//     adminLogin,
//     logoutAdmin,
//     adminLogout,
//     playSystemSound,
//   };

//   return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
// };

// export const useOS = () => {
//   const context = useContext(OSContext);
//   if (!context) {
//     throw new Error('useOS must be used within an OSProvider');
//   }
//   return context;
// };


import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  AppId,
  WindowState,
  Project,
  Experience,
  Skill,
  Education,
  Certification,
  NotificationItem,
  SystemSettings,
  SystemPowerState,
  ContactMessage,
  DesktopIconItem,
  TaskbarApp,
} from '../types';

import {
  INITIAL_PROJECTS,
  INITIAL_EXPERIENCES,
  INITIAL_SKILLS,
  INITIAL_EDUCATION,
  INITIAL_WALLPAPERS,
  DESKTOP_ICONS,
  PROFILE_INFO,
} from '../data/initialData';

import {
  getStoredProjects,
  saveProjects,
  getStoredCertifications,
  saveCertifications,
  getStoredExperiences,
  getStoredSkills,
  getStoredSettings,
  saveSettings,
  getStoredNotifications,
  saveNotifications,
  getStoredContactMessages,
  saveContactMessage,
  saveContactMessages,
  getRecycleBinItems,
  saveRecycleBinItems,
  RecycleBinItem,
  getAdminAuthState,
  setAdminAuthState,
  getStoredTaskbarApps,
  saveTaskbarApps,
} from '../lib/storage';

import { saveVFSFile } from '../lib/vfs';
import { getCustomWallpaper } from '../lib/wallpaperStorage';

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  type: 'desktop' | 'taskbar' | 'icon';
  targetId?: string;
}

export interface Desktop {
  id: string;
  name: string;
  accent: string;
}

interface OSContextType {
  // Power & Boot
  powerState: SystemPowerState;
  setPowerState: (state: SystemPowerState) => void;
  restartSystem: () => void;
  shutdownSystem: () => void;
  sleepSystem: () => void;
  wakeSystem: () => void;
  unlockSystem: () => void;

  // Window Management
  windows: WindowState[];
  activeWindowId: string | null;
  openApp: (appId: AppId, extraData?: any) => void;
  activateMode: (mode: 'recruiter' | 'developer') => void;
  closeWindow: (id: string) => void;
  goHome: () => void;
  recentClosedApps: AppId[];
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (
    id: string,
    pos: { x: number; y: number }
  ) => void;
  updateWindowSize: (
    id: string,
    size: { width: number; height: number }
  ) => void;
  moveWindowToDesktop: (windowId: string, desktopId: string) => void;

  desktops: Desktop[];
  activeDesktopId: string;
  switchDesktop: (id: string) => void;
  createDesktop: () => void;
  deleteDesktop: (id: string) => void;

  isDesktopOverviewOpen: boolean;
  setDesktopOverviewOpen: (open: boolean) => void;

  // UI Panels
  isStartMenuOpen: boolean;
  setStartMenuOpen: (
    open: boolean | ((prev: boolean) => boolean)
  ) => void;

  isSearchOpen: boolean;
  setSearchOpen: (
    open: boolean | ((prev: boolean) => boolean)
  ) => void;

  isNotificationCenterOpen: boolean;
  setNotificationCenterOpen: (
    open: boolean | ((prev: boolean) => boolean)
  ) => void;

  toggleStartMenu: () => void;
  toggleSearch: () => void;
  toggleNotificationCenter: () => void;
  closeAllOverlays: () => void;

  contextMenu: ContextMenuState;
  setContextMenu: React.Dispatch<
    React.SetStateAction<ContextMenuState>
  >;
  openContextMenu: (
    x: number,
    y: number,
    type?: 'desktop' | 'taskbar' | 'icon',
    targetId?: string
  ) => void;
  closeContextMenu: () => void;

  // Desktop State
  desktopIcons: DesktopIconItem[];
  selectedIconId: string | null;
  setSelectedIconId: (id: string | null) => void;

  renameDesktopIcon: (id: string, title: string) => void;
  removeDesktopIcon: (id: string) => void;
  createDesktopItem: (type: 'folder' | 'text') => Promise<void>;

  addDesktopAppShortcut: (
    appId: AppId,
    title: string,
    iconName: string,
    id?: string,
    extraData?: any
  ) => void;

  removeDesktopAppShortcut: (id: string) => void;

  undoDesktopChange: () => void;
  redoDesktopChange: () => void;

  toggleFavoriteDesktopIcon: (id: string) => void;
  favoriteDesktopIconIds: string[];

  refreshDesktop: () => void;

  taskbarApps: TaskbarApp[];
  reorderTaskbarApps: (
    fromAppId: AppId,
    toAppId: AppId
  ) => void;
  pinTaskbarApp: (app: TaskbarApp) => void;
  unpinTaskbarApp: (appId: AppId) => void;

  // Settings & Appearance
  settings: SystemSettings;
  updateSettings: (
    newSettings: Partial<SystemSettings>
  ) => void;

  currentWallpaper: typeof INITIAL_WALLPAPERS[0];
  wallpapers: typeof INITIAL_WALLPAPERS;

  // Data & Content
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  education: Education;
  certifications: Certification[];
  notifications: NotificationItem[];
  recycleBinItems: RecycleBinItem[];
  contactMessages: ContactMessage[];
  contactSubmissions: ContactMessage[];

  // Mutations
  addProject: (
    project: Omit<Project, 'id' | 'sort_order'>
  ) => Promise<void>;

  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addCertification: (
    cert: Omit<Certification, 'id'>
  ) => Promise<void>;

  deleteCertification: (id: string) => Promise<void>;

  sendContactMessage: (
    name: string,
    email: string,
    message: string
  ) => Promise<boolean>;

  markMessageRead: (id: string) => void;

  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  addNotification: (
    notification: Omit<
      NotificationItem,
      'id' | 'time' | 'read'
    > & {
      appId?: AppId;
    }
  ) => void;

  emptyRecycleBin: () => void;
  restoreRecycleBinItem: (id: string) => void;
  permanentlyDeleteRecycleBinItem: (id: string) => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  isAdminAuthenticated: boolean;

  loginAdmin: (pass: string) => boolean;
  adminLogin: (
    emailOrPass: string,
    pass?: string
  ) => Promise<boolean>;

  logoutAdmin: () => void;
  adminLogout: () => void;

  // Audio / Sound
  playSystemSound: (
    type: 'click' | 'open' | 'notify' | 'shutdown' | 'boot'
  ) => void;
}

const OSContext = createContext<OSContextType | null>(null);

const APP_TITLES: Record<AppId, string> = {
  'this-pc': 'This PC',
  about: 'About Abhishek',
  projects: 'Projects Explorer',
  experience: 'Professional Experience',
  skills: 'System Specifications — Skills',
  education: 'Education History',
  certifications: 'Certifications & Credentials',
  resume: 'Resume — Abhishek_Kuntare.pdf',
  contact: 'Contact Abhishek',
  'recycle-bin': 'Recycle Bin',
  terminal: 'Windows PowerShell / Terminal',
  'system-info': 'System Information',
  settings: 'Settings',
  admin: 'Abhishek Portfolio Control Center',
  browser: 'Abhishek Browser',
  calendar: 'Calendar & Milestones',
  youtube: 'YouTube Embed Studio',
  spotify: 'Spotify Music Station',
  widgets: 'Workstation Widgets Board',
  gallery: 'Media & Project Gallery',
  weather: 'Weather Forecast',
  calculator: 'Calculator',
  notes: 'Workstation Notes',
  'system-monitor': 'Task Manager',
  camera: 'Camera & Video Studio',
  'video-player': 'Media Player',
  'music-player': 'Music Station',
  'code-editor': 'Abhishek Code Studio',
  writer: 'Abhishek Writer',
  sheets: 'Abhishek Sheets',
  'pdf-viewer': 'PDF Document Viewer',
  'snipping-tool': 'Snipping Tool',
  arcade: 'Arcade Center',
  downloads: 'Downloads & Files',
  achievements: 'Achievements & Milestones',
  'file-explorer': 'File Explorer',
  ai: 'Abhishek AI',
  git: 'Git Studio',
  'api-tester': 'API Lab',
  performance: 'Performance Center',
  security: 'Security Center',
  'control-panel': 'Control Panel',
  store: 'Abhishek Store',
};

const APP_ICONS: Record<AppId, string> = {
  'this-pc': 'Monitor',
  about: 'UserCheck',
  projects: 'FolderKanban',
  experience: 'Briefcase',
  skills: 'Cpu',
  education: 'GraduationCap',
  certifications: 'Award',
  resume: 'FileText',
  contact: 'Mail',
  'recycle-bin': 'Trash2',
  terminal: 'Terminal',
  'system-info': 'HardDrive',
  settings: 'Settings',
  admin: 'ShieldAlert',
  browser: 'Globe',
  calendar: 'Calendar',
  youtube: 'Youtube',
  spotify: 'Music',
  widgets: 'Sparkles',
  gallery: 'Images',
  weather: 'CloudSun',
  calculator: 'Calculator',
  notes: 'StickyNote',
  'system-monitor': 'Activity',
  camera: 'Camera',
  'video-player': 'Video',
  'music-player': 'Music',
  'code-editor': 'Code2',
  writer: 'FileText',
  sheets: 'Table',
  'pdf-viewer': 'FileText',
  'snipping-tool': 'Sparkles',
  arcade: 'Gamepad2',
  downloads: 'Folder',
  achievements: 'Trophy',
  'file-explorer': 'Folder',
  ai: 'Sparkles',
  git: 'GitBranch',
  'api-tester': 'Send',
  performance: 'Activity',
  security: 'ShieldCheck',
  'control-panel': 'SlidersHorizontal',
  store: 'Store',
};

const DEFAULT_TASKBAR_APPS: TaskbarApp[] = [
  {
    appId: 'this-pc',
    title: 'This PC',
    icon: 'Monitor',
  },
  {
    appId: 'browser',
    title: 'Browser',
    icon: 'Globe',
  },
  {
    appId: 'youtube',
    title: 'YouTube',
    icon: 'Youtube',
  },
  {
    appId: 'spotify',
    title: 'Spotify',
    icon: 'Music',
  },
  {
    appId: 'gallery',
    title: 'Gallery',
    icon: 'Images',
  },
  {
    appId: 'projects',
    title: 'Projects',
    icon: 'FolderKanban',
  },
  {
    appId: 'terminal',
    title: 'Terminal',
    icon: 'Terminal',
  },
  {
    appId: 'resume',
    title: 'Resume',
    icon: 'FileText',
  },
  {
    appId: 'settings',
    title: 'Settings',
    icon: 'Settings',
  },
];

const DESKTOP_ICON_STORAGE_KEY = 'abhishek-desktop-icons';
const DESKTOP_FAVORITES_STORAGE_KEY =
  'abhishek-desktop-favorites';

export const OSProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // ------------------------------------------------------------
  // POWER STATE
  // ------------------------------------------------------------

  const [powerState, setPowerState] =
    useState<SystemPowerState>('booting');

  // Boot sequence
  useEffect(() => {
    if (powerState !== 'booting') return;

    const timer = window.setTimeout(() => {
      setPowerState('running');
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [powerState]);

  // ------------------------------------------------------------
  // WINDOW MANAGEMENT
  // ------------------------------------------------------------

  const [windows, setWindows] = useState<WindowState[]>([]);
  const [recentClosedApps, setRecentClosedApps] =
    useState<AppId[]>([]);

  const [activeWindowId, setActiveWindowId] =
    useState<string | null>(null);

  const [highestZ, setHighestZ] = useState(10);
  const highestZRef = useRef(10);

  const nextZIndex = useCallback(() => {
    const next = highestZRef.current + 1;

    highestZRef.current = next;
    setHighestZ(next);

    return next;
  }, []);

  // ------------------------------------------------------------
  // TASKBAR
  // ------------------------------------------------------------

  const [taskbarApps, setTaskbarApps] = useState<TaskbarApp[]>(
    () => getStoredTaskbarApps(DEFAULT_TASKBAR_APPS)
  );

  // ------------------------------------------------------------
  // VIRTUAL DESKTOPS
  // ------------------------------------------------------------

  const [desktops, setDesktops] = useState<Desktop[]>([
    {
      id: 'desktop-1',
      name: 'Desktop 1',
      accent: 'from-sky-500 to-indigo-500',
    },
  ]);

  const [activeDesktopId, setActiveDesktopId] =
    useState('desktop-1');

  const [isDesktopOverviewOpen, setDesktopOverviewOpen] =
    useState(false);

  // ------------------------------------------------------------
  // UI PANELS
  // ------------------------------------------------------------

  const [isStartMenuOpen, setStartMenuOpen] =
    useState(false);

  const [isSearchOpen, setSearchOpen] =
    useState(false);

  const [isNotificationCenterOpen, setNotificationCenterOpen] =
    useState(false);

  const [contextMenu, setContextMenu] =
    useState<ContextMenuState>({
      isOpen: false,
      x: 0,
      y: 0,
      type: 'desktop',
    });

  // ------------------------------------------------------------
  // DESKTOP ICONS
  // ------------------------------------------------------------

  const [desktopIcons, setDesktopIcons] =
    useState<DesktopIconItem[]>(() => {
      try {
        const stored = localStorage.getItem(
          DESKTOP_ICON_STORAGE_KEY
        );

        if (!stored) {
          return DESKTOP_ICONS;
        }

        const saved = JSON.parse(
          stored
        ) as DesktopIconItem[];

        const savedIds = new Set(
          saved.map(icon => icon.id)
        );

        const deletedIds = new Set(
          getRecycleBinItems()
            .filter(
              item =>
                item.originalType === 'desktop-icon' &&
                item.payload?.id
            )
            .map(item => item.payload.id)
        );

        return [
          ...saved,
          ...DESKTOP_ICONS.filter(
            icon =>
              !savedIds.has(icon.id) &&
              !deletedIds.has(icon.id)
          ),
        ];
      } catch {
        return DESKTOP_ICONS;
      }
    });

  const [selectedIconId, setSelectedIconId] =
    useState<string | null>(null);

  const iconHistory = useRef<
    {
      before: DesktopIconItem[];
      after: DesktopIconItem[];
    }[]
  >([]);

  const iconHistoryIndex = useRef(-1);

  const [favoriteDesktopIconIds, setFavoriteDesktopIconIds] =
    useState<string[]>(() => {
      try {
        const stored = localStorage.getItem(
          DESKTOP_FAVORITES_STORAGE_KEY
        );

        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    });

  // ------------------------------------------------------------
  // SETTINGS / WALLPAPER
  // ------------------------------------------------------------

  const [settings, setSettings] =
    useState<SystemSettings>(getStoredSettings);

  const [customWallpaperUrl, setCustomWallpaperUrl] =
    useState<string | null>(null);

  const [customWallpaperType, setCustomWallpaperType] =
    useState<'image' | 'video' | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let disposed = false;

    const loadWallpaper = async () => {
      const blob = await getCustomWallpaper();

      if (disposed || !blob) {
        return;
      }

      const nextUrl = URL.createObjectURL(blob);

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      objectUrl = nextUrl;

      setCustomWallpaperUrl(nextUrl);

      setCustomWallpaperType(
        blob.type.startsWith('video/')
          ? 'video'
          : 'image'
      );
    };

    const handleWallpaperChange = () => {
      void loadWallpaper().catch(error => {
        console.error(
          'Unable to load custom wallpaper:',
          error
        );
      });
    };

    handleWallpaperChange();

    window.addEventListener(
      'abhishek-wallpaper-changed',
      handleWallpaperChange
    );

    return () => {
      disposed = true;

      window.removeEventListener(
        'abhishek-wallpaper-changed',
        handleWallpaperChange
      );

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = settings.theme;

    root.style.setProperty(
      '--os-accent',
      settings.accentColor
    );

    root.style.setProperty(
      '--os-brightness',
      `${settings.brightness}%`
    );

    root.style.colorScheme = settings.theme;
  }, [
    settings.theme,
    settings.accentColor,
    settings.brightness,
  ]);

  // ------------------------------------------------------------
  // DATA
  // ------------------------------------------------------------

  const [projects, setProjects] =
    useState<Project[]>(INITIAL_PROJECTS);

  const [experiences] =
    useState<Experience[]>(INITIAL_EXPERIENCES);

  const [skills] =
    useState<Skill[]>(INITIAL_SKILLS);

  const [education] =
    useState<Education>(INITIAL_EDUCATION);

  const [certifications, setCertifications] =
    useState<Certification[]>([]);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(
      getStoredNotifications
    );

  const [recycleBinItems, setRecycleBinItems] =
    useState<RecycleBinItem[]>(() => {
      const stored = getRecycleBinItems();

      const seen = new Set<string>();

      const deduplicated = stored.filter(item => {
        const key =
          item.originalType === 'desktop-icon' &&
          item.payload?.id
            ? `desktop-icon:${item.payload.id}`
            : item.id;

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      });

      if (deduplicated.length !== stored.length) {
        saveRecycleBinItems(deduplicated);
      }

      return deduplicated;
    });

  const [contactMessages, setContactMessages] =
    useState<ContactMessage[]>([]);

  const [isAdminLoggedIn, setIsAdminLoggedIn] =
    useState<boolean>(getAdminAuthState);

  // ------------------------------------------------------------
  // INITIAL ASYNC DATA
  // ------------------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [
          storedProjects,
          storedCertifications,
          storedMessages,
        ] = await Promise.all([
          getStoredProjects(),
          getStoredCertifications(),
          getStoredContactMessages(),
        ]);

        if (!mounted) return;

        setProjects(storedProjects);
        setCertifications(storedCertifications);
        setContactMessages(storedMessages);
      } catch (error) {
        console.error(
          'Unable to load stored OS data:',
          error
        );
      }
    };

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  // ------------------------------------------------------------
  // AUDIO
  // ------------------------------------------------------------

  const playSystemSound = useCallback(
    (
      type:
        | 'click'
        | 'open'
        | 'notify'
        | 'shutdown'
        | 'boot'
    ) => {
      if (!settings.soundsEnabled) {
        return;
      }

      try {
        const AudioContext =
          window.AudioContext ||
          (window as any).webkitAudioContext;

        if (!AudioContext) {
          return;
        }

        const ctx = new AudioContext();

        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'click') {
          oscillator.frequency.setValueAtTime(
            800,
            ctx.currentTime
          );

          gain.gain.setValueAtTime(
            0.04,
            ctx.currentTime
          );

          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.04
          );

          oscillator.start();
          oscillator.stop(ctx.currentTime + 0.05);
        }

        if (type === 'open') {
          oscillator.frequency.setValueAtTime(
            520,
            ctx.currentTime
          );

          oscillator.frequency.exponentialRampToValueAtTime(
            780,
            ctx.currentTime + 0.08
          );

          gain.gain.setValueAtTime(
            0.05,
            ctx.currentTime
          );

          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.1
          );

          oscillator.start();
          oscillator.stop(ctx.currentTime + 0.11);
        }

        if (type === 'notify') {
          oscillator.frequency.setValueAtTime(
            659.25,
            ctx.currentTime
          );

          oscillator.frequency.setValueAtTime(
            880,
            ctx.currentTime + 0.08
          );

          gain.gain.setValueAtTime(
            0.05,
            ctx.currentTime
          );

          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.25
          );

          oscillator.start();
          oscillator.stop(ctx.currentTime + 0.26);
        }

        if (type === 'boot') {
          oscillator.frequency.setValueAtTime(
            392,
            ctx.currentTime
          );

          oscillator.frequency.exponentialRampToValueAtTime(
            784,
            ctx.currentTime + 0.25
          );

          gain.gain.setValueAtTime(
            0.04,
            ctx.currentTime
          );

          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.3
          );

          oscillator.start();
          oscillator.stop(ctx.currentTime + 0.31);
        }

        if (type === 'shutdown') {
          oscillator.frequency.setValueAtTime(
            784,
            ctx.currentTime
          );

          oscillator.frequency.exponentialRampToValueAtTime(
            196,
            ctx.currentTime + 0.3
          );

          gain.gain.setValueAtTime(
            0.04,
            ctx.currentTime
          );

          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.35
          );

          oscillator.start();
          oscillator.stop(ctx.currentTime + 0.36);
        }

        window.setTimeout(() => {
          void ctx.close().catch(() => {});
        }, 500);
      } catch {
        // Audio can be blocked until the first user interaction.
      }
    },
    [settings.soundsEnabled]
  );

  // ------------------------------------------------------------
  // SETTINGS
  // ------------------------------------------------------------

  const updateSettings = useCallback(
    (newSettings: Partial<SystemSettings>) => {
      setSettings(previous => {
        const updated: SystemSettings = {
          ...previous,
          ...newSettings,
          theme: 'dark',
        };

        saveSettings(updated);

        return updated;
      });
    },
    []
  );

  // ------------------------------------------------------------
  // WALLPAPERS
  // ------------------------------------------------------------

  const wallpapers = useMemo(() => {
    if (!customWallpaperUrl) {
      return INITIAL_WALLPAPERS;
    }

    return [
      ...INITIAL_WALLPAPERS,
      {
        id: 'wall-custom',
        name: 'System wallpaper',
        thumbnailColor: '#111827',
        style:
          customWallpaperType === 'image'
            ? `center / cover no-repeat url("${customWallpaperUrl}")`
            : '#020617',
        type:
          customWallpaperType === 'video'
            ? ('video' as const)
            : ('static' as const),
        videoUrl:
          customWallpaperType === 'video'
            ? customWallpaperUrl
            : undefined,
        description:
          'Wallpaper selected from this device',
      },
    ];
  }, [
    customWallpaperType,
    customWallpaperUrl,
  ]);

  const currentWallpaper = useMemo(() => {
    return (
      wallpapers.find(
        wallpaper =>
          wallpaper.id === settings.wallpaperId
      ) || wallpapers[0]
    );
  }, [settings.wallpaperId, wallpapers]);

  // ------------------------------------------------------------
  // CONTEXT MENU
  // ------------------------------------------------------------

  const closeContextMenu = useCallback(() => {
    setContextMenu(previous =>
      previous.isOpen
        ? {
            ...previous,
            isOpen: false,
          }
        : previous
    );
  }, []);

  const openContextMenu = useCallback(
    (
      x: number,
      y: number,
      type:
        | 'desktop'
        | 'taskbar'
        | 'icon' = 'desktop',
      targetId?: string
    ) => {
      setContextMenu({
        isOpen: true,
        x,
        y,
        type,
        targetId,
      });

      setStartMenuOpen(false);
      setSearchOpen(false);
      setNotificationCenterOpen(false);
    },
    []
  );

  const closeAllOverlays = useCallback(() => {
    setStartMenuOpen(false);
    setSearchOpen(false);
    setNotificationCenterOpen(false);
    setDesktopOverviewOpen(false);
    closeContextMenu();
  }, [closeContextMenu]);

  // ------------------------------------------------------------
  // VIRTUAL DESKTOPS
  // ------------------------------------------------------------

  const switchDesktop = useCallback(
    (id: string) => {
      if (!desktops.some(desktop => desktop.id === id)) {
        return;
      }

      setActiveDesktopId(id);

      setWindows(currentWindows => {
        const visibleWindows = currentWindows
          .filter(
            window =>
              window.desktopId === id &&
              !window.isMinimized
          )
          .sort(
            (a, b) => b.zIndex - a.zIndex
          );

        setActiveWindowId(
          visibleWindows[0]?.id || null
        );

        return currentWindows;
      });

      setDesktopOverviewOpen(false);
      closeAllOverlays();
      playSystemSound('click');
    },
    [
      desktops,
      closeAllOverlays,
      playSystemSound,
    ]
  );

  const createDesktop = useCallback(() => {
    const id = `desktop-${Date.now()}`;

    setDesktops(previous => [
      ...previous,
      {
        id,
        name: `Desktop ${previous.length + 1}`,
        accent:
          'from-violet-500 to-fuchsia-500',
      },
    ]);

    setActiveDesktopId(id);
    setActiveWindowId(null);
    setDesktopOverviewOpen(false);

    playSystemSound('open');
  }, [playSystemSound]);

  const deleteDesktop = useCallback(
    (id: string) => {
      if (desktops.length === 1) {
        return;
      }

      const remaining = desktops.filter(
        desktop => desktop.id !== id
      );

      const destinationId =
        activeDesktopId === id
          ? remaining[0].id
          : activeDesktopId;

      setWindows(previous =>
        previous.map(window =>
          window.desktopId === id
            ? {
                ...window,
                desktopId: destinationId,
              }
            : window
        )
      );

      setDesktops(remaining);

      if (activeDesktopId === id) {
        setActiveDesktopId(destinationId);
        setActiveWindowId(null);
      }

      playSystemSound('click');
    },
    [
      activeDesktopId,
      desktops,
      playSystemSound,
    ]
  );

  const moveWindowToDesktop = useCallback(
    (windowId: string, desktopId: string) => {
      if (
        !desktops.some(
          desktop => desktop.id === desktopId
        )
      ) {
        return;
      }

      setWindows(previous =>
        previous.map(window =>
          window.id === windowId
            ? {
                ...window,
                desktopId,
              }
            : window
        )
      );

      if (
        desktopId !== activeDesktopId &&
        activeWindowId === windowId
      ) {
        setActiveWindowId(null);
      }

      playSystemSound('click');
    },
    [
      activeDesktopId,
      activeWindowId,
      desktops,
      playSystemSound,
    ]
  );

  // ------------------------------------------------------------
  // UI TOGGLES
  // ------------------------------------------------------------

  const toggleStartMenu = useCallback(() => {
    setStartMenuOpen(previous => {
      const next = !previous;

      if (next) {
        setSearchOpen(false);
        setNotificationCenterOpen(false);
        closeContextMenu();
      }

      return next;
    });
  }, [closeContextMenu]);

  const toggleSearch = useCallback(() => {
    setSearchOpen(previous => {
      const next = !previous;

      if (next) {
        setStartMenuOpen(false);
        setNotificationCenterOpen(false);
        closeContextMenu();
      }

      return next;
    });
  }, [closeContextMenu]);

  const toggleNotificationCenter = useCallback(() => {
    setNotificationCenterOpen(previous => {
      const next = !previous;

      if (next) {
        setStartMenuOpen(false);
        setSearchOpen(false);
        closeContextMenu();
      }

      return next;
    });
  }, [closeContextMenu]);

  // ------------------------------------------------------------
  // WINDOW FOCUS
  // ------------------------------------------------------------

  const focusWindow = useCallback(
    (id: string) => {
      const nextZ = nextZIndex();

      setWindows(previous => {
        const target = previous.find(
          window => window.id === id
        );

        if (!target) {
          return previous;
        }

        setActiveWindowId(id);

        return previous.map(window =>
          window.id === id
            ? {
                ...window,
                isMinimized: false,
                zIndex: nextZ,
              }
            : window
        );
      });

      setStartMenuOpen(false);
      setSearchOpen(false);
      setNotificationCenterOpen(false);
      closeContextMenu();
    },
    [closeContextMenu, nextZIndex]
  );

  // ------------------------------------------------------------
  // OPEN APP
  // ------------------------------------------------------------

  const openApp = useCallback(
    (appId: AppId, extraData?: any) => {
      playSystemSound('open');

      setStartMenuOpen(false);
      setSearchOpen(false);
      setNotificationCenterOpen(false);
      closeContextMenu();

      setWindows(previous => {
        const existing = previous.find(
          window =>
            window.appId === appId &&
            window.desktopId === activeDesktopId
        );

        const nextZ = nextZIndex();

        if (existing) {
          setActiveWindowId(existing.id);

          return previous.map(window =>
            window.id === existing.id
              ? {
                  ...window,
                  isMinimized: false,
                  zIndex: nextZ,
                  extraData:
                    extraData !== undefined
                      ? extraData
                      : window.extraData,
                }
              : window
          );
        }

        const isMobile =
          window.innerWidth < 768;

        const defaultWidth = isMobile
          ? window.innerWidth
          : Math.min(
              window.innerWidth - 60,
              940
            );

        const defaultHeight = isMobile
          ? Math.max(
              420,
              window.innerHeight - 56
            )
          : Math.min(
              window.innerHeight - 100,
              640
            );

        const offset =
          (previous.length % 6) * 28;

        const defaultX = isMobile
          ? 0
          : Math.max(
              30,
              (window.innerWidth -
                defaultWidth) /
                2 +
                offset
            );

        const defaultY = isMobile
          ? 0
          : Math.max(
              30,
              (window.innerHeight -
                defaultHeight) /
                2 -
                20 +
                offset
            );

        const newWindow: WindowState = {
          id: `win-${appId}-${Date.now()}`,
          appId,
          title:
            APP_TITLES[appId] ||
            'Application',
          iconName:
            APP_ICONS[appId] ||
            'AppWindow',
          isMinimized: false,
          isMaximized: isMobile,
          position: {
            x: defaultX,
            y: defaultY,
          },
          size: {
            width: defaultWidth,
            height: defaultHeight,
          },
          zIndex: nextZ,
          extraData,
          desktopId: activeDesktopId,
        };

        setActiveWindowId(newWindow.id);

        return [
          ...previous,
          newWindow,
        ];
      });
    },
    [
      activeDesktopId,
      closeContextMenu,
      nextZIndex,
      playSystemSound,
    ]
  );

  // ------------------------------------------------------------
  // WORKSPACE MODES
  // ------------------------------------------------------------

  const activateMode = useCallback(
    (mode: 'recruiter' | 'developer') => {
      const apps: AppId[] =
        mode === 'recruiter'
          ? [
              'resume',
              'experience',
              'projects',
              'skills',
              'git',
              'contact',
            ]
          : [
              'git',
              'projects',
              'api-tester',
              'terminal',
              'code-editor',
              'this-pc',
              'system-monitor',
              'performance',
              'system-info',
            ];

      updateSettings({
        workspaceMode: mode,
        recruiterMode:
          mode === 'recruiter',
      });

      apps.forEach((appId, index) => {
        window.setTimeout(() => {
          openApp(appId);
        }, index * 110);
      });
    },
    [openApp, updateSettings]
  );

  // ------------------------------------------------------------
  // CLOSE WINDOW
  // ------------------------------------------------------------

  const closeWindow = useCallback(
    (id: string) => {
      playSystemSound('click');

      setWindows(previous => {
        const closing = previous.find(
          window => window.id === id
        );

        const remaining =
          previous.filter(
            window => window.id !== id
          );

        if (closing) {
          setRecentClosedApps(recent => [
            closing.appId,
            ...recent.filter(
              appId =>
                appId !== closing.appId
            ),
          ].slice(0, 5));
        }

        if (activeWindowId === id) {
          const visible = remaining
            .filter(
              window =>
                window.desktopId ===
                  activeDesktopId &&
                !window.isMinimized
            )
            .sort(
              (a, b) =>
                b.zIndex - a.zIndex
            );

          setActiveWindowId(
            visible[0]?.id || null
          );
        }

        return remaining;
      });
    },
    [
      activeDesktopId,
      activeWindowId,
      playSystemSound,
    ]
  );

  const goHome = useCallback(() => {
    setWindows(previous =>
      previous.map(window => ({
        ...window,
        isMinimized: true,
      }))
    );

    setActiveWindowId(null);
    closeAllOverlays();
    setSelectedIconId(null);

    playSystemSound('click');
  }, [
    closeAllOverlays,
    playSystemSound,
  ]);

  // ------------------------------------------------------------
  // TASKBAR
  // ------------------------------------------------------------

  const reorderTaskbarApps = useCallback(
    (
      fromAppId: AppId,
      toAppId: AppId
    ) => {
      setTaskbarApps(previous => {
        const fromIndex =
          previous.findIndex(
            app =>
              app.appId === fromAppId
          );

        const toIndex =
          previous.findIndex(
            app =>
              app.appId === toAppId
          );

        if (
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex === toIndex
        ) {
          return previous;
        }

        const next = [...previous];

        const [moved] =
          next.splice(fromIndex, 1);

        next.splice(toIndex, 0, moved);

        saveTaskbarApps(next);

        return next;
      });
    },
    []
  );

  const pinTaskbarApp = useCallback(
    (app: TaskbarApp) => {
      setTaskbarApps(previous => {
        if (
          previous.some(
            item =>
              item.appId === app.appId
          )
        ) {
          return previous;
        }

        const next = [
          ...previous,
          app,
        ];

        saveTaskbarApps(next);

        return next;
      });
    },
    []
  );

  const unpinTaskbarApp = useCallback(
    (appId: AppId) => {
      setTaskbarApps(previous => {
        const next =
          previous.filter(
            app =>
              app.appId !== appId
          );

        saveTaskbarApps(next);

        return next;
      });
    },
    []
  );

  // ------------------------------------------------------------
  // MINIMIZE WINDOW
  // ------------------------------------------------------------

  const minimizeWindow = useCallback(
    (id: string) => {
      playSystemSound('click');

      setWindows(previous => {
        const updated = previous.map(
          window =>
            window.id === id
              ? {
                  ...window,
                  isMinimized: true,
                }
              : window
        );

        if (activeWindowId === id) {
          const nextWindow = updated
            .filter(
              window =>
                window.desktopId ===
                  activeDesktopId &&
                !window.isMinimized
            )
            .sort(
              (a, b) =>
                b.zIndex - a.zIndex
            )[0];

          setActiveWindowId(
            nextWindow?.id || null
          );
        }

        return updated;
      });
    },
    [
      activeDesktopId,
      activeWindowId,
      playSystemSound,
    ]
  );

  // ------------------------------------------------------------
  // MAXIMIZE / RESTORE
  // ------------------------------------------------------------

  const maximizeWindow = useCallback(
    (id: string) => {
      playSystemSound('click');

      setWindows(previous =>
        previous.map(window => {
          if (window.id !== id) {
            return window;
          }

          if (!window.isMaximized) {
            return {
              ...window,
              isMaximized: true,
              prevBounds: {
                x: window.position.x,
                y: window.position.y,
                width: window.size.width,
                height: window.size.height,
              },
            };
          }

          const previousBounds =
            window.prevBounds || {
              x: 60,
              y: 40,
              width: Math.min(
                window.innerWidth - 80,
                920
              ),
              height: Math.min(
                window.innerHeight - 120,
                620
              ),
            };

          return {
            ...window,
            isMaximized: false,
            position: {
              x: previousBounds.x,
              y: previousBounds.y,
            },
            size: {
              width:
                previousBounds.width,
              height:
                previousBounds.height,
            },
          };
        })
      );
    },
    [playSystemSound]
  );

  // ------------------------------------------------------------
  // WINDOW POSITION / SIZE
  // ------------------------------------------------------------

  const updateWindowPosition = useCallback(
    (
      id: string,
      pos: { x: number; y: number }
    ) => {
      setWindows(previous =>
        previous.map(window =>
          window.id === id
            ? {
                ...window,
                position: pos,
              }
            : window
        )
      );
    },
    []
  );

  const updateWindowSize = useCallback(
    (
      id: string,
      size: {
        width: number;
        height: number;
      }
    ) => {
      setWindows(previous =>
        previous.map(window =>
          window.id === id
            ? {
                ...window,
                size,
              }
            : window
        )
      );
    },
    []
  );

  // ------------------------------------------------------------
  // DESKTOP ICON HISTORY
  // ------------------------------------------------------------

  const recordIconChange = useCallback(
    (
      before: DesktopIconItem[],
      after: DesktopIconItem[]
    ) => {
      iconHistory.current =
        iconHistory.current.slice(
          0,
          iconHistoryIndex.current + 1
        );

      iconHistory.current.push({
        before,
        after,
      });

      iconHistoryIndex.current =
        iconHistory.current.length - 1;
    },
    []
  );

  const renameDesktopIcon = useCallback(
    (id: string, title: string) => {
      const trimmed = title.trim();

      if (!trimmed) {
        return;
      }

      setDesktopIcons(previous => {
        const updated =
          previous.map(icon =>
            icon.id === id
              ? {
                  ...icon,
                  title: trimmed,
                }
              : icon
          );

        if (updated === previous) {
          return previous;
        }

        recordIconChange(
          previous,
          updated
        );

        localStorage.setItem(
          DESKTOP_ICON_STORAGE_KEY,
          JSON.stringify(updated)
        );

        return updated;
      });

      playSystemSound('click');
    },
    [
      playSystemSound,
      recordIconChange,
    ]
  );

  const removeDesktopIcon = useCallback(
    (id: string) => {
      const icon = desktopIcons.find(
        item => item.id === id
      );

      if (
        !icon ||
        icon.appId === 'recycle-bin'
      ) {
        return;
      }

      const recycleItem: RecycleBinItem = {
        id: `desktop-icon-${id}-${Date.now()}`,
        originalType: 'desktop-icon',
        name: icon.title,
        deletedAt:
          new Date().toISOString(),
        payload: icon,
      };

      setDesktopIcons(previous => {
        const updated =
          previous.filter(
            item => item.id !== id
          );

        if (
          updated.length ===
          previous.length
        ) {
          return previous;
        }

        recordIconChange(
          previous,
          updated
        );

        localStorage.setItem(
          DESKTOP_ICON_STORAGE_KEY,
          JSON.stringify(updated)
        );

        return updated;
      });

      setRecycleBinItems(previous => {
        const alreadyDeleted =
          previous.some(
            item =>
              item.originalType ===
                'desktop-icon' &&
              item.payload?.id === id
          );

        if (alreadyDeleted) {
          return previous;
        }

        const next = [
          recycleItem,
          ...previous,
        ];

        saveRecycleBinItems(next);

        return next;
      });

      setSelectedIconId(previous =>
        previous === id
          ? null
          : previous
      );

      playSystemSound('click');
    },
    [
      desktopIcons,
      playSystemSound,
      recordIconChange,
    ]
  );

  const createDesktopItem = useCallback(
    async (
      type: 'folder' | 'text'
    ) => {
      const baseName =
        type === 'folder'
          ? 'New folder'
          : 'New Text Document';

      const extension =
        type === 'text' ? 'txt' : '';

      const existingNames = new Set(
        desktopIcons.map(
          icon => icon.title
        )
      );

      let title = baseName;
      let suffix = 2;

      while (
        existingNames.has(title) ||
        existingNames.has(
          extension
            ? `${title}.${extension}`
            : title
        )
      ) {
        title = `${baseName} (${suffix++})`;
      }

      const fileName = extension
        ? `${title}.${extension}`
        : title;

      const itemId = `desktop-${type}-${Date.now()}`;

      await saveVFSFile({
        id: itemId,
        name: fileName,
        path: `/Desktop/${fileName}`,
        type:
          type === 'folder'
            ? 'folder'
            : 'file',
        extension,
        mimeType:
          type === 'folder'
            ? 'inode/directory'
            : 'text/plain',
        size: 0,
        updatedAt: Date.now(),
        content: '',
        isSystem: false,
      });

      setDesktopIcons(previous => {
        const updated = [
          ...previous,
          {
            id: itemId,
            appId:
              (type === 'folder'
                ? 'file-explorer'
                : 'writer') as AppId,
            title: fileName,
            iconName:
              type === 'folder'
                ? 'Folder'
                : 'FileText',
            fileExtension:
              extension || undefined,
          },
        ];

        recordIconChange(
          previous,
          updated
        );

        localStorage.setItem(
          DESKTOP_ICON_STORAGE_KEY,
          JSON.stringify(updated)
        );

        return updated;
      });

      setSelectedIconId(itemId);

      playSystemSound('notify');
    },
    [
      desktopIcons,
      playSystemSound,
      recordIconChange,
    ]
  );

  const addDesktopAppShortcut =
    useCallback(
      (
        appId: AppId,
        title: string,
        iconName: string,
        shortcutId?: string,
        extraData?: any
      ) => {
        setDesktopIcons(previous => {
          const id =
            shortcutId ||
            `icon-${appId}`;

          if (
            previous.some(
              icon => icon.id === id
            )
          ) {
            return previous;
          }

          const updated = [
            ...previous,
            {
              id,
              appId,
              title,
              iconName,
              extraData,
            },
          ];

          recordIconChange(
            previous,
            updated
          );

          localStorage.setItem(
            DESKTOP_ICON_STORAGE_KEY,
            JSON.stringify(updated)
          );

          return updated;
        });

        playSystemSound('notify');
      },
      [
        playSystemSound,
        recordIconChange,
      ]
    );

  const removeDesktopAppShortcut =
    useCallback(
      (id: string) => {
        setDesktopIcons(previous => {
          const updated =
            previous.filter(
              icon => icon.id !== id
            );

          if (
            updated.length ===
            previous.length
          ) {
            return previous;
          }

          recordIconChange(
            previous,
            updated
          );

          localStorage.setItem(
            DESKTOP_ICON_STORAGE_KEY,
            JSON.stringify(updated)
          );

          return updated;
        });

        setSelectedIconId(previous =>
          previous === id
            ? null
            : previous
        );

        playSystemSound('click');
      },
      [
        playSystemSound,
        recordIconChange,
      ]
    );

  const applyIconHistory = useCallback(
    (
      next: DesktopIconItem[],
      index: number
    ) => {
      iconHistoryIndex.current =
        index;

      setDesktopIcons(next);

      localStorage.setItem(
        DESKTOP_ICON_STORAGE_KEY,
        JSON.stringify(next)
      );

      setSelectedIconId(null);

      playSystemSound('click');
    },
    [playSystemSound]
  );

  const undoDesktopChange =
    useCallback(() => {
      const entry =
        iconHistory.current[
          iconHistoryIndex.current
        ];

      if (!entry) {
        return;
      }

      applyIconHistory(
        entry.before,
        iconHistoryIndex.current - 1
      );
    }, [applyIconHistory]);

  const redoDesktopChange =
    useCallback(() => {
      const entry =
        iconHistory.current[
          iconHistoryIndex.current + 1
        ];

      if (!entry) {
        return;
      }

      applyIconHistory(
        entry.after,
        iconHistoryIndex.current + 1
      );
    }, [applyIconHistory]);

  const toggleFavoriteDesktopIcon =
    useCallback(
      (id: string) => {
        setFavoriteDesktopIconIds(
          previous => {
            const updated =
              previous.includes(id)
                ? previous.filter(
                    item => item !== id
                  )
                : [...previous, id];

            localStorage.setItem(
              DESKTOP_FAVORITES_STORAGE_KEY,
              JSON.stringify(updated)
            );

            return updated;
          }
        );

        playSystemSound('notify');
      },
      [playSystemSound]
    );

  const refreshDesktop = useCallback(() => {
    playSystemSound('notify');
    setSelectedIconId(null);
    closeContextMenu();
  }, [
    closeContextMenu,
    playSystemSound,
  ]);

  // ------------------------------------------------------------
  // POWER ACTIONS
  // ------------------------------------------------------------

  const restartSystem = useCallback(() => {
    playSystemSound('shutdown');

    setPowerState('booting');
    setWindows([]);
    setActiveWindowId(null);
    setStartMenuOpen(false);
    setSearchOpen(false);
    setNotificationCenterOpen(false);
    setDesktopOverviewOpen(false);

    window.setTimeout(() => {
      setPowerState('running');
      playSystemSound('boot');
    }, 1800);
  }, [playSystemSound]);

  const shutdownSystem = useCallback(() => {
    playSystemSound('shutdown');

    setPowerState('shutting-down');
    setStartMenuOpen(false);
    setSearchOpen(false);
    setNotificationCenterOpen(false);
    setWindows([]);
    setActiveWindowId(null);

    window.setTimeout(() => {
      setPowerState('off');
    }, 1800);
  }, [playSystemSound]);

  const sleepSystem = useCallback(() => {
    setPowerState('sleeping');
    setStartMenuOpen(false);
    setSearchOpen(false);
    setNotificationCenterOpen(false);
  }, []);

  const wakeSystem = useCallback(() => {
    setPowerState('running');
    playSystemSound('boot');
  }, [playSystemSound]);

  const unlockSystem = useCallback(() => {
    setPowerState('running');
  }, []);

  // ------------------------------------------------------------
  // PROJECTS
  // ------------------------------------------------------------

  const addProject = useCallback(
    async (
      newProjData: Omit<
        Project,
        'id' | 'sort_order'
      >
    ) => {
      const newProject: Project = {
        ...newProjData,
        id: `proj-${Date.now()}`,
        sort_order:
          projects.length + 1,
        created_at:
          new Date().toISOString(),
      };

      const updated = [
        newProject,
        ...projects,
      ];

      setProjects(updated);

      await saveProjects(updated);

      const notification: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Project Published',
        message: `"${newProject.title}" is now published on your public portfolio.`,
        time: 'Just now',
        type: 'success',
        read: false,
      };

      setNotifications(previous => {
        const next = [
          notification,
          ...previous,
        ];

        saveNotifications(next);

        return next;
      });

      playSystemSound('notify');
    },
    [
      projects,
      playSystemSound,
    ]
  );

  const updateProject = useCallback(
    async (updatedProject: Project) => {
      const updated =
        projects.map(project =>
          project.id ===
          updatedProject.id
            ? updatedProject
            : project
        );

      setProjects(updated);

      await saveProjects(updated);

      playSystemSound('notify');
    },
    [
      projects,
      playSystemSound,
    ]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      const target = projects.find(
        project => project.id === id
      );

      if (!target) {
        return;
      }

      const updatedProjects =
        projects.filter(
          project => project.id !== id
        );

      setProjects(updatedProjects);

      await saveProjects(
        updatedProjects
      );

      const binItem: RecycleBinItem = {
        id: `bin-${Date.now()}`,
        originalType: 'project',
        name: target.title,
        deletedAt:
          new Date().toISOString(),
        payload: target,
      };

      setRecycleBinItems(previous => {
        const updatedBin = [
          binItem,
          ...previous,
        ];

        saveRecycleBinItems(
          updatedBin
        );

        return updatedBin;
      });

      playSystemSound('click');
    },
    [
      projects,
      playSystemSound,
    ]
  );

  // ------------------------------------------------------------
  // CERTIFICATIONS
  // ------------------------------------------------------------

  const addCertification =
    useCallback(
      async (
        certData: Omit<Certification, 'id'>
      ) => {
        const newCertification: Certification =
          {
            ...certData,
            id: `cert-${Date.now()}`,
          };

        const updated = [
          newCertification,
          ...certifications,
        ];

        setCertifications(updated);

        await saveCertifications(
          updated
        );

        playSystemSound('notify');
      },
      [
        certifications,
        playSystemSound,
      ]
    );

  const deleteCertification =
    useCallback(
      async (id: string) => {
        const updated =
          certifications.filter(
            certification =>
              certification.id !== id
          );

        if (
          updated.length ===
          certifications.length
        ) {
          return;
        }

        setCertifications(updated);

        await saveCertifications(
          updated
        );

        playSystemSound('click');
      },
      [
        certifications,
        playSystemSound,
      ]
    );

  // ------------------------------------------------------------
  // CONTACT
  // ------------------------------------------------------------

  const sendContactMessage =
    useCallback(
      async (
        name: string,
        email: string,
        message: string
      ): Promise<boolean> => {
        try {
          const newMessage =
            await saveContactMessage({
              name,
              email,
              message,
            });

          setContactMessages(previous => [
            newMessage,
            ...previous,
          ]);

          const notification: NotificationItem =
            {
              id: `notif-${Date.now()}`,
              title: `Message from ${name}`,
              message: `New inquiry sent to ${PROFILE_INFO.email}`,
              time: 'Just now',
              type: 'success',
              read: false,
            };

          setNotifications(previous => {
            const next = [
              notification,
              ...previous,
            ];

            saveNotifications(next);

            return next;
          });

          playSystemSound('notify');

          return true;
        } catch (error) {
          console.error(
            'Unable to send contact message:',
            error
          );

          return false;
        }
      },
      [playSystemSound]
    );

  // ------------------------------------------------------------
  // NOTIFICATIONS
  // ------------------------------------------------------------

  const addNotification =
    useCallback(
      (
        notification: Omit<
          NotificationItem,
          'id' | 'time' | 'read'
        > & {
          appId?: AppId;
        }
      ) => {
        setNotifications(previous => {
          const next = [
            {
              ...notification,
              id: `notif-${Date.now()}`,
              time: 'Just now',
              read: false,
            },
            ...previous,
          ];

          saveNotifications(next);

          return next;
        });

        playSystemSound('notify');
      },
      [playSystemSound]
    );

  const markNotificationAsRead =
    useCallback((id: string) => {
      setNotifications(previous => {
        const updated =
          previous.map(notification =>
            notification.id === id
              ? {
                  ...notification,
                  read: true,
                }
              : notification
          );

        saveNotifications(updated);

        return updated;
      });
    }, []);

  const clearNotifications =
    useCallback(() => {
      setNotifications([]);
      saveNotifications([]);
    }, []);

  // ------------------------------------------------------------
  // RECYCLE BIN
  // ------------------------------------------------------------

  const emptyRecycleBin =
    useCallback(() => {
      setRecycleBinItems([]);
      saveRecycleBinItems([]);
      playSystemSound('click');
    }, [playSystemSound]);

  const restoreRecycleBinItem =
    useCallback(
      (id: string) => {
        const item =
          recycleBinItems.find(
            recycleItem =>
              recycleItem.id === id
          );

        if (!item) {
          return;
        }

        if (
          item.originalType ===
            'project' &&
          item.payload
        ) {
          const project =
            item.payload as Project;

          setProjects(previous => {
            if (
              previous.some(
                existing =>
                  existing.id ===
                  project.id
              )
            ) {
              return previous;
            }

            const updated = [
              project,
              ...previous,
            ];

            saveProjects(updated);

            return updated;
          });
        }

        if (
          item.originalType ===
            'desktop-icon' &&
          item.payload
        ) {
          const icon =
            item.payload as DesktopIconItem;

          setDesktopIcons(previous => {
            if (
              previous.some(
                existing =>
                  existing.id ===
                  icon.id
              )
            ) {
              return previous;
            }

            const restored = [
              ...previous,
              icon,
            ];

            localStorage.setItem(
              DESKTOP_ICON_STORAGE_KEY,
              JSON.stringify(restored)
            );

            return restored;
          });
        }

        setRecycleBinItems(previous => {
          const updated =
            previous.filter(
              recycleItem =>
                recycleItem.id !== id
            );

          saveRecycleBinItems(
            updated
          );

          return updated;
        });

        playSystemSound('open');
      },
      [
        recycleBinItems,
        playSystemSound,
      ]
    );

  const permanentlyDeleteRecycleBinItem =
    useCallback(
      (id: string) => {
        setRecycleBinItems(previous => {
          const updated =
            previous.filter(
              item => item.id !== id
            );

          saveRecycleBinItems(
            updated
          );

          return updated;
        });

        playSystemSound('click');
      },
      [playSystemSound]
    );

  // ------------------------------------------------------------
  // ADMIN AUTH
  // ------------------------------------------------------------

  const loginAdmin = useCallback(
    (pass: string): boolean => {
      if (
        pass === 'Demo@12345' ||
        pass === 'admin123' ||
        pass === 'abhishek'
      ) {
        setIsAdminLoggedIn(true);
        setAdminAuthState(true);
        playSystemSound('notify');

        return true;
      }

      return false;
    },
    [playSystemSound]
  );

  const logoutAdmin =
    useCallback(() => {
      setIsAdminLoggedIn(false);
      setAdminAuthState(false);
      playSystemSound('click');
    }, [playSystemSound]);

  const adminLogin = useCallback(
    async (
      emailOrPass: string,
      pass?: string
    ): Promise<boolean> => {
      const passwordToCheck =
        pass !== undefined
          ? pass
          : emailOrPass;

      if (
        passwordToCheck ===
          'Demo@12345' ||
        passwordToCheck ===
          'admin123' ||
        passwordToCheck ===
          'abhishek' ||
        passwordToCheck === 'admin'
      ) {
        setIsAdminLoggedIn(true);
        setAdminAuthState(true);
        playSystemSound('notify');

        return true;
      }

      return false;
    },
    [playSystemSound]
  );

  const adminLogout =
    useCallback(() => {
      logoutAdmin();
    }, [logoutAdmin]);

  // ------------------------------------------------------------
  // CONTACT MESSAGE READ
  // ------------------------------------------------------------

  const markMessageRead =
    useCallback((id: string) => {
      setContactMessages(previous => {
        const updated =
          previous.map(message =>
            message.id === id
              ? {
                  ...message,
                  read: true,
                }
              : message
          );

        saveContactMessages(
          updated
        );

        return updated;
      });
    }, []);

  // ------------------------------------------------------------
  // GLOBAL KEYBOARD SHORTCUTS
  // ------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      const target =
        event.target as HTMLElement | null;

      const isEditableTarget =
        Boolean(
          target &&
            (target.isContentEditable ||
              target.tagName ===
                'INPUT' ||
              target.tagName ===
                'TEXTAREA' ||
              target.tagName ===
                'SELECT')
        );

      // Ctrl/Cmd + K
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();

        setSearchOpen(
          previous => !previous
        );

        setStartMenuOpen(false);
        setNotificationCenterOpen(false);
        closeContextMenu();

        return;
      }

      // Undo / Redo
      if (
        !isEditableTarget &&
        (event.ctrlKey ||
          event.metaKey) &&
        !event.altKey &&
        event.key.toLowerCase() ===
          'z'
      ) {
        event.preventDefault();

        if (event.shiftKey) {
          redoDesktopChange();
        } else {
          undoDesktopChange();
        }

        return;
      }

      if (
        !isEditableTarget &&
        (event.ctrlKey ||
          event.metaKey) &&
        !event.altKey &&
        event.key.toLowerCase() ===
          'y'
      ) {
        event.preventDefault();

        redoDesktopChange();

        return;
      }

      // Escape
      if (event.key === 'Escape') {
        if (contextMenu.isOpen) {
          closeContextMenu();
          return;
        }

        if (isSearchOpen) {
          setSearchOpen(false);
          return;
        }

        if (isStartMenuOpen) {
          setStartMenuOpen(false);
          return;
        }

        if (
          isNotificationCenterOpen
        ) {
          setNotificationCenterOpen(
            false
          );
          return;
        }

        if (isDesktopOverviewOpen) {
          setDesktopOverviewOpen(
            false
          );
          return;
        }
      }

      // Alt + Tab
      if (
        event.altKey &&
        event.key === 'Tab'
      ) {
        event.preventDefault();

        const desktopWindows =
          windows
            .filter(
              window =>
                window.desktopId ===
                activeDesktopId
            )
            .sort(
              (a, b) =>
                b.zIndex - a.zIndex
            );

        if (
          desktopWindows.length > 1
        ) {
          const currentIndex =
            desktopWindows.findIndex(
              window =>
                window.id ===
                activeWindowId
            );

          const nextIndex =
            currentIndex < 0
              ? 0
              : (currentIndex + 1) %
                desktopWindows.length;

          focusWindow(
            desktopWindows[
              nextIndex
            ].id
          );
        }

        return;
      }

      // Ctrl/Cmd + ArrowUp
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        !event.altKey &&
        event.key === 'ArrowUp'
      ) {
        event.preventDefault();

        setDesktopOverviewOpen(
          previous => !previous
        );

        setStartMenuOpen(false);
        setSearchOpen(false);
        setNotificationCenterOpen(
          false
        );
        closeContextMenu();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [
    activeDesktopId,
    activeWindowId,
    closeContextMenu,
    contextMenu.isOpen,
    focusWindow,
    isDesktopOverviewOpen,
    isNotificationCenterOpen,
    isSearchOpen,
    isStartMenuOpen,
    redoDesktopChange,
    undoDesktopChange,
    windows,
  ]);

  // ------------------------------------------------------------
  // CONTEXT VALUE
  // ------------------------------------------------------------

  const value: OSContextType = {
    // Power
    powerState,
    setPowerState,
    restartSystem,
    shutdownSystem,
    sleepSystem,
    wakeSystem,
    unlockSystem,

    // Windows
    windows,
    activeWindowId,
    openApp,
    activateMode,
    closeWindow,
    goHome,
    recentClosedApps,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    moveWindowToDesktop,

    // Desktops
    desktops,
    activeDesktopId,
    switchDesktop,
    createDesktop,
    deleteDesktop,
    isDesktopOverviewOpen,
    setDesktopOverviewOpen,

    // Panels
    isStartMenuOpen,
    setStartMenuOpen,
    isSearchOpen,
    setSearchOpen,
    isNotificationCenterOpen,
    setNotificationCenterOpen,
    toggleStartMenu,
    toggleSearch,
    toggleNotificationCenter,
    closeAllOverlays,

    // Context menu
    contextMenu,
    setContextMenu,
    openContextMenu,
    closeContextMenu,

    // Desktop
    desktopIcons,
    selectedIconId,
    setSelectedIconId,
    renameDesktopIcon,
    removeDesktopIcon,
    createDesktopItem,
    addDesktopAppShortcut,
    removeDesktopAppShortcut,
    undoDesktopChange,
    redoDesktopChange,
    toggleFavoriteDesktopIcon,
    favoriteDesktopIconIds,
    refreshDesktop,

    // Taskbar
    taskbarApps,
    reorderTaskbarApps,
    pinTaskbarApp,
    unpinTaskbarApp,

    // Settings
    settings,
    updateSettings,
    currentWallpaper,
    wallpapers,

    // Content
    projects,
    experiences,
    skills,
    education,
    certifications,
    notifications,
    recycleBinItems,
    contactMessages,
    contactSubmissions:
      contactMessages,

    // Mutations
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    deleteCertification,
    sendContactMessage,
    markMessageRead,
    markNotificationAsRead,
    clearNotifications,
    addNotification,

    // Recycle Bin
    emptyRecycleBin,
    restoreRecycleBinItem,
    permanentlyDeleteRecycleBinItem,

    // Admin
    isAdminLoggedIn,
    isAdminAuthenticated:
      isAdminLoggedIn,
    loginAdmin,
    adminLogin,
    logoutAdmin,
    adminLogout,

    // Sound
    playSystemSound,
  };

  return (
    <OSContext.Provider value={value}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = (): OSContextType => {
  const context = useContext(OSContext);

  if (!context) {
    throw new Error(
      'useOS must be used within an OSProvider'
    );
  }

  return context;
};