import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  updateWindowPosition: (id: string, pos: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  snapWindow: (id: string, snap: WindowSnap) => void;
  toggleWindowGroup: (id: string) => void;
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
  setStartMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isNotificationCenterOpen: boolean;
  setNotificationCenterOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleStartMenu: () => void;
  toggleSearch: () => void;
  toggleNotificationCenter: () => void;
  closeAllOverlays: () => void;
  contextMenu: ContextMenuState;
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState>>;
  openContextMenu: (x: number, y: number, type?: 'desktop' | 'taskbar' | 'icon', targetId?: string) => void;
  closeContextMenu: () => void;

  // Desktop State
  desktopIcons: DesktopIconItem[];
  selectedIconId: string | null;
  setSelectedIconId: (id: string | null) => void;
  renameDesktopIcon: (id: string, title: string) => void;
  removeDesktopIcon: (id: string) => void;
  createDesktopItem: (type: 'folder' | 'text') => Promise<void>;
  addDesktopAppShortcut: (appId: AppId, title: string, iconName: string, id?: string, extraData?: any) => void;
  removeDesktopAppShortcut: (id: string) => void;
  undoDesktopChange: () => void;
  redoDesktopChange: () => void;
  toggleFavoriteDesktopIcon: (id: string) => void;
  favoriteDesktopIconIds: string[];
  refreshDesktop: () => void;
  taskbarApps: TaskbarApp[];
  reorderTaskbarApps: (fromAppId: AppId, toAppId: AppId) => void;
  pinTaskbarApp: (app: TaskbarApp) => void;
  unpinTaskbarApp: (appId: AppId) => void;

  // Settings & Appearance
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
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
  addProject: (project: Omit<Project, 'id' | 'sort_order'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addCertification: (cert: Omit<Certification, 'id'>) => Promise<void>;
  deleteCertification: (id: string) => Promise<void>;
  sendContactMessage: (name: string, email: string, message: string) => Promise<boolean>;
  markMessageRead: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'time' | 'read'> & { appId?: AppId }) => void;
  emptyRecycleBin: () => void;
  restoreRecycleBinItem: (id: string) => void;
  permanentlyDeleteRecycleBinItem: (id: string) => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  isAdminAuthenticated: boolean;
  loginAdmin: (pass: string) => boolean;
  adminLogin: (emailOrPass: string, pass?: string) => Promise<boolean>;
  logoutAdmin: () => void;
  adminLogout: () => void;

  // Audio / Sound
  playSystemSound: (type: 'click' | 'open' | 'notify' | 'shutdown' | 'boot') => void;
}

export interface Desktop {
  id: string;
  name: string;
  accent: string;
}

const OSContext = createContext<OSContextType | null>(null);

const APP_TITLES: Record<AppId, string> = {
  'this-pc': 'This PC',
  'about': 'About Abhishek',
  'projects': 'Projects Explorer',
  'experience': 'Professional Experience',
  'skills': 'System Specifications — Skills',
  'education': 'Education History',
  'certifications': 'Certifications & Credentials',
  'resume': 'Resume — Abhishek_Kuntare.pdf',
  'contact': 'Contact Abhishek',
  'recycle-bin': 'Recycle Bin',
  'terminal': 'Windows PowerShell / Terminal',
  'system-info': 'System Information',
  'settings': 'Settings',
  'admin': 'Abhishek Portfolio Control Center',
  'browser': 'Abhishek Browser',
  'calendar': 'Calendar & Milestones',
  'youtube': 'YouTube Embed Studio',
  'spotify': 'Spotify Music Station',
  'widgets': 'Workstation Widgets Board',
  'gallery': 'Media & Project Gallery',
  'weather': 'Weather Forecast',
  'calculator': 'Calculator',
  'notes': 'Workstation Notes',
  'system-monitor': 'Task Manager',
  'camera': 'Camera & Video Studio',
  'video-player': 'Media Player',
  'music-player': 'Music Station',
  'code-editor': 'Abhishek Code Studio',
  'writer': 'Abhishek Writer',
  'sheets': 'Abhishek Sheets',
  'pdf-viewer': 'PDF Document Viewer',
  'snipping-tool': 'Snipping Tool',
  'arcade': 'Arcade Center',
  'downloads': 'Downloads & Files',
  'achievements': 'Achievements & Milestones',
  'file-explorer': 'File Explorer',
  'ai': 'Abhishek AI',
  'git': 'Git Studio',
  'api-tester': 'API Lab',
  'performance': 'Performance Center',
  'security': 'Security Center',
  'control-panel': 'Control Panel',
  'store': 'Abhishek Store',
};

const APP_ICONS: Record<AppId, string> = {
  'this-pc': 'Monitor',
  'about': 'UserCheck',
  'projects': 'FolderKanban',
  'experience': 'Briefcase',
  'skills': 'Cpu',
  'education': 'GraduationCap',
  'certifications': 'Award',
  'resume': 'FileText',
  'contact': 'Mail',
  'recycle-bin': 'Trash2',
  'terminal': 'Terminal',
  'system-info': 'HardDrive',
  'settings': 'Settings',
  'admin': 'ShieldAlert',
  'browser': 'Globe',
  'calendar': 'Calendar',
  'youtube': 'Youtube',
  'spotify': 'Music',
  'widgets': 'Sparkles',
  'gallery': 'Images',
  'weather': 'CloudSun',
  'calculator': 'Calculator',
  'notes': 'StickyNote',
  'system-monitor': 'Activity',
  'camera': 'Camera',
  'video-player': 'Video',
  'music-player': 'Music',
  'code-editor': 'Code2',
  'writer': 'FileText',
  'sheets': 'Table',
  'pdf-viewer': 'FileText',
  'snipping-tool': 'Sparkles',
  'arcade': 'Gamepad2',
  'downloads': 'Folder',
  'achievements': 'Trophy',
  'file-explorer': 'Folder',
  'ai': 'Sparkles',
  'git': 'GitBranch',
  'api-tester': 'Send',
  'performance': 'Activity',
  'security': 'ShieldCheck',
  'control-panel': 'SlidersHorizontal',
  'store': 'Store',
};

const DEFAULT_TASKBAR_APPS: TaskbarApp[] = [
  { appId: 'this-pc', title: 'This PC', icon: 'Monitor' },
  { appId: 'browser', title: 'Browser', icon: 'Globe' },
  { appId: 'youtube', title: 'YouTube', icon: 'Youtube' },
  { appId: 'spotify', title: 'Spotify', icon: 'Music' },
  { appId: 'gallery', title: 'Gallery', icon: 'Images' },
  { appId: 'projects', title: 'Projects', icon: 'FolderKanban' },
  { appId: 'terminal', title: 'Terminal', icon: 'Terminal' },
  { appId: 'resume', title: 'Resume', icon: 'FileText' },
  { appId: 'settings', title: 'Settings', icon: 'Settings' },
];

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Power state: initial boot sequence (brief 1.5s)
  const [powerState, setPowerState] = useState<SystemPowerState>('booting');

  // Window list & zIndex counter
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [recentClosedApps, setRecentClosedApps] = useState<AppId[]>([]);
  const [taskbarApps, setTaskbarApps] = useState<TaskbarApp[]>(() =>
    getStoredTaskbarApps(DEFAULT_TASKBAR_APPS)
  );
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [highestZ, setHighestZ] = useState<number>(10);
  const highestZRef = useRef(10);
  const [desktops, setDesktops] = useState<Desktop[]>([
    { id: 'desktop-1', name: 'Desktop 1', accent: 'from-sky-500 to-indigo-500' },
  ]);
  const [activeDesktopId, setActiveDesktopId] = useState('desktop-1');
  const [isDesktopOverviewOpen, setDesktopOverviewOpen] = useState(false);

  // Panels
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isNotificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    type: 'desktop',
  });

  // Desktop selection & icons
  const [desktopIcons, setDesktopIcons] = useState<DesktopIconItem[]>(() => {
    try {
      const stored = localStorage.getItem('abhishek-desktop-icons');
      if (!stored) return DESKTOP_ICONS;
      const saved = JSON.parse(stored) as DesktopIconItem[];
      const savedIds = new Set(saved.map(icon => icon.id));
      const deletedIds = new Set(
        getRecycleBinItems()
          .filter(item => item.originalType === 'desktop-icon' && item.payload?.id)
          .map(item => item.payload.id)
      );
      return [
        ...saved,
        ...DESKTOP_ICONS.filter(icon => !savedIds.has(icon.id) && !deletedIds.has(icon.id)),
      ];
    } catch {
      return DESKTOP_ICONS;
    }
  });
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const iconHistory = useRef<{ before: DesktopIconItem[]; after: DesktopIconItem[] }[]>([]);
  const iconHistoryIndex = useRef(-1);
  const [favoriteDesktopIconIds, setFavoriteDesktopIconIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('abhishek-desktop-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // System settings
  const [settings, setSettings] = useState<SystemSettings>(getStoredSettings);
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState<string | null>(null);
  const [customWallpaperType, setCustomWallpaperType] = useState<'image' | 'video' | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let disposed = false;
    const loadWallpaper = async () => {
      const blob = await getCustomWallpaper();
      if (disposed || !blob) return;
      const nextUrl = URL.createObjectURL(blob);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = nextUrl;
      setCustomWallpaperUrl(nextUrl);
      setCustomWallpaperType(blob.type.startsWith('video/') ? 'video' : 'image');
    };
    const handleWallpaperChange = () => {
      void loadWallpaper().catch(error => {
        console.error('Unable to load custom wallpaper:', error);
      });
    };
    handleWallpaperChange();
    window.addEventListener('abhishek-wallpaper-changed', handleWallpaperChange);
    return () => {
      disposed = true;
      window.removeEventListener('abhishek-wallpaper-changed', handleWallpaperChange);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  // Keep the browser document in sync with settings so every application,
  // including portals and overlays, can use the same theme and accent.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = settings.theme;
    root.style.setProperty('--os-accent', settings.accentColor);
    root.style.setProperty('--os-brightness', `${settings.brightness}%`);
    root.style.colorScheme = settings.theme;
  }, [settings.theme, settings.accentColor, settings.brightness]);

  // Data states
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [experiences, setExperiences] = useState<Experience[]>(getStoredExperiences);
  const [skills, setSkills] = useState<Skill[]>(getStoredSkills);
  const [education] = useState<Education>(INITIAL_EDUCATION);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);
  const [recycleBinItems, setRecycleBinItems] = useState<RecycleBinItem[]>(() => {
    const stored = getRecycleBinItems();
    const seen = new Set<string>();
    const deduplicated = stored.filter(item => {
      const key = item.originalType === 'desktop-icon' && item.payload?.id
        ? `desktop-icon:${item.payload.id}`
        : item.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (deduplicated.length !== stored.length) saveRecycleBinItems(deduplicated);
    return deduplicated;
  });
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(getAdminAuthState);

  // Play subtle synthetic system sound via Web Audio API without external files
  const playSystemSound = useCallback((type: 'click' | 'open' | 'notify' | 'shutdown' | 'boot') => {
    if (!settings.soundsEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'open') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.11);
      } else if (type === 'notify') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      }
    } catch {
      // Audio context might be restricted before user interaction; ignore silently
    }
  }, [settings.soundsEnabled]);

  // Load initial asynchronous data
  useEffect(() => {
    async function loadData() {
      const p = await getStoredProjects();
      setProjects(p);
      const c = await getStoredCertifications();
      setCertifications(c);
      const m = await getStoredContactMessages();
      setContactMessages(m);
    }
    loadData();
  }, []);

  // Update settings handler
  const updateSettings = useCallback((newSettings: Partial<SystemSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings, theme: 'dark' as const };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const wallpapers = useMemo(() => {
    const customVideo = customWallpaperUrl;
    if (!customVideo) return INITIAL_WALLPAPERS;
    return [
      ...INITIAL_WALLPAPERS,
      {
        id: 'wall-custom',
        name: 'System wallpaper',
        thumbnailColor: '#111827',
        style: customWallpaperType === 'image'
          ? `center / cover no-repeat url("${customVideo}")`
          : '#020617',
        type: customWallpaperType === 'video' ? 'video' as const : 'static' as const,
        videoUrl: customWallpaperType === 'video' ? customVideo : undefined,
        description: 'Wallpaper selected from this device',
      },
    ];
  }, [customWallpaperType, customWallpaperUrl, settings.wallpaperId]);
  const currentWallpaper = useMemo(() => {
    return wallpapers.find(w => w.id === settings.wallpaperId) || wallpapers[0];
  }, [settings.wallpaperId, wallpapers]);

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => (prev.isOpen ? { ...prev, isOpen: false } : prev));
  }, []);

  // Open context menu helper
  const openContextMenu = useCallback((x: number, y: number, type: 'desktop' | 'taskbar' | 'icon' = 'desktop', targetId?: string) => {
    setContextMenu({ isOpen: true, x, y, type, targetId });
    setStartMenuOpen(false);
    setSearchOpen(false);
    setNotificationCenterOpen(false);
  }, []);

  // Close all overlays & flyout menus
  const closeAllOverlays = useCallback(() => {
    setStartMenuOpen(false);
    setSearchOpen(false);
    setNotificationCenterOpen(false);
    closeContextMenu();
    setDesktopOverviewOpen(false);
  }, [closeContextMenu]);

  const switchDesktop = useCallback((id: string) => {
    if (!desktops.some(desktop => desktop.id === id)) return;
    setActiveDesktopId(id);
    setWindows(prev => {
      const nextWindow = [...prev]
        .filter(win => win.desktopId === id && !win.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0];
      setActiveWindowId(nextWindow?.id || null);
      return prev;
    });
    setDesktopOverviewOpen(false);
    playSystemSound('click');
  }, [desktops, playSystemSound]);

  const createDesktop = useCallback(() => {
    const id = `desktop-${Date.now()}`;
    setDesktops(prev => [...prev, { id, name: `Desktop ${prev.length + 1}`, accent: 'from-violet-500 to-fuchsia-500' }]);
    setActiveDesktopId(id);
    setActiveWindowId(null);
    setDesktopOverviewOpen(false);
    playSystemSound('open');
  }, [playSystemSound]);

  const deleteDesktop = useCallback((id: string) => {
    if (desktops.length === 1) return;
    const remaining = desktops.filter(desktop => desktop.id !== id);
    setDesktops(remaining);
    const destinationId = activeDesktopId === id ? remaining[0].id : activeDesktopId;
    setWindows(prev => prev.map(win => win.desktopId === id ? { ...win, desktopId: destinationId } : win));
    if (activeDesktopId === id) {
      const next = remaining[0];
      setActiveDesktopId(next.id);
      setActiveWindowId(null);
    }
    playSystemSound('click');
  }, [activeDesktopId, desktops, playSystemSound]);

  const moveWindowToDesktop = useCallback((windowId: string, desktopId: string) => {
    if (!desktops.some(desktop => desktop.id === desktopId)) return;
    setWindows(prev => prev.map(win => win.id === windowId ? { ...win, desktopId } : win));
    if (desktopId !== activeDesktopId && activeWindowId === windowId) {
      setActiveWindowId(null);
    }
    playSystemSound('click');
  }, [activeDesktopId, activeWindowId, desktops, playSystemSound]);

  // Toggle helpers
  const toggleStartMenu = useCallback(() => {
    setStartMenuOpen(prev => {
      const next = !prev;
      if (next) {
        setSearchOpen(false);
        setNotificationCenterOpen(false);
        closeContextMenu();
      }
      return next;
    });
  }, [closeContextMenu]);

  const toggleSearch = useCallback(() => {
    setSearchOpen(prev => {
      const next = !prev;
      if (next) {
        setStartMenuOpen(false);
        setNotificationCenterOpen(false);
        closeContextMenu();
      }
      return next;
    });
  }, [closeContextMenu]);

  const toggleNotificationCenter = useCallback(() => {
    setNotificationCenterOpen(prev => {
      const next = !prev;
      if (next) {
        setStartMenuOpen(false);
        setSearchOpen(false);
        closeContextMenu();
      }
      return next;
    });
  }, [closeContextMenu]);

  // Focus a window
  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const target = prev.find(w => w.id === id);
      if (!target) return prev;
      const nextZ = highestZ + 1;
      setHighestZ(nextZ);
      return prev.map(w => (w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w));
    });
    setStartMenuOpen(false);
    setSearchOpen(false);
    setNotificationCenterOpen(false);
    closeContextMenu();
  }, [highestZ, closeContextMenu]);

  // Open App
  const openApp = useCallback((appId: AppId, extraData?: any) => {
    playSystemSound('open');
    setStartMenuOpen(false);
    setSearchOpen(false);
    setNotificationCenterOpen(false);
    closeContextMenu();

    setWindows(prev => {
      const existing = prev.find(w => w.appId === appId && w.desktopId === activeDesktopId);
      const nextZ = highestZRef.current + 1;
      highestZRef.current = nextZ;
      setHighestZ(nextZ);

      if (existing) {
        setActiveWindowId(existing.id);
        return prev.map(w =>
          w.id === existing.id
            ? { ...w, isMinimized: false, zIndex: nextZ, extraData: extraData || w.extraData }
            : w
        );
      }

      // Calculate staggered default position
      const offset = (prev.length % 6) * 28;
      const isMobile = window.innerWidth < 768;
      const defaultWidth = isMobile ? window.innerWidth : Math.min(window.innerWidth - 60, 940);
      const defaultHeight = isMobile ? window.innerHeight - 56 : Math.min(window.innerHeight - 100, 640);
      const defaultX = isMobile ? 0 : Math.max(30, (window.innerWidth - defaultWidth) / 2 + offset);
      const defaultY = isMobile ? 0 : Math.max(30, (window.innerHeight - defaultHeight) / 2 - 20 + offset);

      const newWindow: WindowState = {
        id: `win-${appId}-${Date.now()}`,
        appId,
        title: APP_TITLES[appId] || 'Application',
        iconName: APP_ICONS[appId] || 'AppWindow',
        isMinimized: false,
        isMaximized: isMobile,
        position: { x: defaultX, y: defaultY },
        size: { width: defaultWidth, height: defaultHeight },
        zIndex: nextZ,
        extraData,
        desktopId: activeDesktopId,
      };

      setActiveWindowId(newWindow.id);
      return [...prev, newWindow];
    });
  }, [activeDesktopId, highestZ, playSystemSound, closeContextMenu]);

  // Mode launchers intentionally open a curated workspace rather than replacing
  // the user's existing windows. Delayed launches keep the desktop responsive
  // and make the workflow feel like a smooth workspace handoff.
  const activateMode = useCallback((mode: 'recruiter' | 'developer') => {
    const apps: AppId[] = mode === 'recruiter'
      ? ['resume', 'experience', 'projects', 'skills', 'git', 'contact']
      : ['git', 'projects', 'api-tester', 'terminal', 'code-editor', 'this-pc', 'system-monitor', 'performance', 'system-info'];
    updateSettings({ workspaceMode: mode, recruiterMode: mode === 'recruiter' });
    apps.forEach((appId, index) => {
      window.setTimeout(() => openApp(appId), index * 110);
    });
  }, [openApp, updateSettings]);

  // Close Window
  const closeWindow = useCallback((id: string) => {
    playSystemSound('click');
    setWindows(prev => {
      const closing = prev.find(w => w.id === id);
      const remaining = prev.filter(w => w.id !== id);
      if (closing) {
        setRecentClosedApps(recent => [closing.appId, ...recent.filter(appId => appId !== closing.appId)].slice(0, 5));
      }
      if (activeWindowId === id) {
        if (remaining.length > 0) {
          const topWindow = [...remaining].sort((a, b) => b.zIndex - a.zIndex)[0];
          setActiveWindowId(topWindow.id);
        } else {
          setActiveWindowId(null);
        }
      }
      return remaining;
    });
  }, [activeWindowId, playSystemSound]);

  const goHome = useCallback(() => {
    setWindows(previous => previous.map(window => ({ ...window, isMinimized: true })));
    setActiveWindowId(null);
    closeAllOverlays();
    setSelectedIconId(null);
    playSystemSound('click');
  }, [closeAllOverlays, playSystemSound]);

  const reorderTaskbarApps = useCallback((fromAppId: AppId, toAppId: AppId) => {
    setTaskbarApps(prev => {
      const from = prev.findIndex(app => app.appId === fromAppId);
      const to = prev.findIndex(app => app.appId === toAppId);
      if (from < 0 || to < 0 || from === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      saveTaskbarApps(next);
      return next;
    });
  }, []);

  const pinTaskbarApp = useCallback((app: TaskbarApp) => {
    setTaskbarApps(prev => {
      if (prev.some(item => item.appId === app.appId)) return prev;
      const next = [...prev, app];
      saveTaskbarApps(next);
      return next;
    });
  }, []);

  const unpinTaskbarApp = useCallback((appId: AppId) => {
    setTaskbarApps(prev => {
      const next = prev.filter(app => app.appId !== appId);
      saveTaskbarApps(next);
      return next;
    });
  }, []);

  // Minimize Window
  const minimizeWindow = useCallback((id: string) => {
    playSystemSound('click');
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindowId(current => {
      if (current === id) {
        const visible = windows.filter(w => w.id !== id && !w.isMinimized);
        if (visible.length > 0) {
          return [...visible].sort((a, b) => b.zIndex - a.zIndex)[0].id;
        }
        return null;
      }
      return current;
    });
  }, [windows, playSystemSound]);

  // Maximize / Restore Window
  const maximizeWindow = useCallback((id: string) => {
    playSystemSound('click');
    setWindows(prev =>
      prev.map(w => {
        if (w.id !== id) return w;
        if (!w.isMaximized) {
          // Maximize
          return {
            ...w,
            isMaximized: true,
            prevBounds: {
              x: w.position.x,
              y: w.position.y,
              width: w.size.width,
              height: w.size.height,
            },
          };
        } else {
          // Restore
          const prevB = w.prevBounds || {
            x: 60,
            y: 40,
            width: Math.min(window.innerWidth - 80, 920),
            height: Math.min(window.innerHeight - 120, 620),
          };
          return {
            ...w,
            isMaximized: false,
            position: { x: prevB.x, y: prevB.y },
            size: { width: prevB.width, height: prevB.height },
          };
        }
      })
    );
  }, [playSystemSound]);

  // Update window position
  const updateWindowPosition = useCallback((id: string, pos: { x: number; y: number }) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, position: pos } : w))
    );
  }, []);

  // Update window size
  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, size } : w))
    );
  }, []);

  // Snap Window
  const snapWindow = useCallback((id: string, snap: WindowSnap) => {
    const taskbarH = 54;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight - taskbarH;
    const halfW = Math.round(screenW / 2);
    const halfH = Math.round(screenH / 2);

    let position = { x: 0, y: 0 };
    let size = { width: screenW, height: screenH };

    switch (snap) {
      case 'left':
        position = { x: 0, y: 0 };
        size = { width: halfW, height: screenH };
        break;
      case 'right':
        position = { x: halfW, y: 0 };
        size = { width: halfW, height: screenH };
        break;
      case 'top':
        position = { x: 0, y: 0 };
        size = { width: screenW, height: halfH };
        break;
      case 'bottom':
        position = { x: 0, y: halfH };
        size = { width: screenW, height: halfH };
        break;
      case 'top-left':
        position = { x: 0, y: 0 };
        size = { width: halfW, height: halfH };
        break;
      case 'top-right':
        position = { x: halfW, y: 0 };
        size = { width: halfW, height: halfH };
        break;
      case 'bottom-left':
        position = { x: 0, y: halfH };
        size = { width: halfW, height: halfH };
        break;
      case 'bottom-right':
        position = { x: halfW, y: halfH };
        size = { width: halfW, height: halfH };
        break;
    }

    setWindows(prev =>
      prev.map(w =>
        w.id === id
          ? {
              ...w,
              isMaximized: false,
              position,
              size,
              snap,
            }
          : w
      )
    );
  }, []);

  // Toggle Window Group
  const toggleWindowGroup = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === id
          ? {
              ...w,
              groupId: w.groupId ? undefined : 'group-1',
            }
          : w
      )
    );
  }, []);

  // Refresh desktop
  const refreshDesktop = useCallback(() => {
    playSystemSound('notify');
    setSelectedIconId(null);
    closeContextMenu();
  }, [playSystemSound, closeContextMenu]);

  const recordIconChange = useCallback((before: DesktopIconItem[], after: DesktopIconItem[]) => {
    iconHistory.current = iconHistory.current.slice(0, iconHistoryIndex.current + 1);
    iconHistory.current.push({ before, after });
    iconHistoryIndex.current = iconHistory.current.length - 1;
  }, []);

  const renameDesktopIcon = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setDesktopIcons(previous => {
      const updated = previous.map(icon => icon.id === id ? { ...icon, title: trimmed } : icon);
      recordIconChange(previous, updated);
      localStorage.setItem('abhishek-desktop-icons', JSON.stringify(updated));
      return updated;
    });
    playSystemSound('click');
  }, [playSystemSound, recordIconChange]);

  const removeDesktopIcon = useCallback((id: string) => {
    const icon = desktopIcons.find(item => item.id === id);
    if (!icon || icon.appId === 'recycle-bin') return;
    const recycleItem: RecycleBinItem = {
      id: `desktop-icon-${id}-${Date.now()}`,
      originalType: 'desktop-icon',
      name: icon.title,
      deletedAt: new Date().toISOString(),
      payload: icon,
    };
    setDesktopIcons(previous => {
      const updated = previous.filter(icon => icon.id !== id);
      if (updated.length !== previous.length) {
        recordIconChange(previous, updated);
      }
      localStorage.setItem('abhishek-desktop-icons', JSON.stringify(updated));
      return updated;
    });
    setRecycleBinItems(previousItems => {
      const alreadyDeleted = previousItems.some(item =>
        item.originalType === 'desktop-icon' && item.payload?.id === id
      );
      if (alreadyDeleted) return previousItems;
      const next = [recycleItem, ...previousItems];
      saveRecycleBinItems(next);
      return next;
    });
    setSelectedIconId(previous => previous === id ? null : previous);
    playSystemSound('click');
  }, [desktopIcons, playSystemSound, recordIconChange]);

  const createDesktopItem = useCallback(async (type: 'folder' | 'text') => {
    const baseName = type === 'folder' ? 'New folder' : 'New Text Document';
    const extension = type === 'text' ? 'txt' : '';
    const existingNames = new Set(desktopIcons.map(icon => icon.title));
    let title = baseName;
    let suffix = 2;
    while (existingNames.has(title) || existingNames.has(`${title}.${extension}`)) {
      title = `${baseName} (${suffix++})`;
    }

    const fileName = extension ? `${title}.${extension}` : title;
    const itemId = `desktop-${type}-${Date.now()}`;
    await saveVFSFile({
      id: itemId,
      name: fileName,
      path: `/Desktop/${fileName}`,
      type: type === 'folder' ? 'folder' : 'file',
      extension,
      mimeType: type === 'folder' ? 'inode/directory' : 'text/plain',
      size: 0,
      updatedAt: Date.now(),
      content: '',
      isSystem: false,
    });

    setDesktopIcons(previous => {
      const updated = [...previous, {
        id: itemId,
        appId: (type === 'folder' ? 'file-explorer' : 'writer') as AppId,
        title: fileName,
        iconName: type === 'folder' ? 'Folder' : 'FileText',
        fileExtension: extension || undefined,
      }];
      recordIconChange(previous, updated);
      localStorage.setItem('abhishek-desktop-icons', JSON.stringify(updated));
      return updated;
    });
    setSelectedIconId(itemId);
    playSystemSound('notify');
  }, [desktopIcons, playSystemSound, recordIconChange]);

  const addDesktopAppShortcut = useCallback((appId: AppId, title: string, iconName: string, shortcutId?: string, extraData?: any) => {
    setDesktopIcons(previous => {
      if (previous.some(icon => icon.id === (shortcutId || `icon-${appId}`))) return previous;
      const updated = [...previous, {
        id: shortcutId || `icon-${appId}`,
        appId,
        title,
        iconName,
        extraData,
      }];
      recordIconChange(previous, updated);
      localStorage.setItem('abhishek-desktop-icons', JSON.stringify(updated));
      return updated;
    });
    playSystemSound('notify');
  }, [playSystemSound, recordIconChange]);

  const removeDesktopAppShortcut = useCallback((id: string) => {
    setDesktopIcons(previous => {
      const updated = previous.filter(icon => icon.id !== id);
      if (updated.length === previous.length) return previous;
      recordIconChange(previous, updated);
      localStorage.setItem('abhishek-desktop-icons', JSON.stringify(updated));
      return updated;
    });
    setSelectedIconId(previous => previous === id ? null : previous);
    playSystemSound('click');
  }, [playSystemSound, recordIconChange]);

  const applyIconHistory = useCallback((next: DesktopIconItem[], index: number) => {
    iconHistoryIndex.current = index;
    setDesktopIcons(next);
    localStorage.setItem('abhishek-desktop-icons', JSON.stringify(next));
    setSelectedIconId(null);
    playSystemSound('click');
  }, [playSystemSound]);

  const undoDesktopChange = useCallback(() => {
    const entry = iconHistory.current[iconHistoryIndex.current];
    if (!entry) return;
    applyIconHistory(entry.before, iconHistoryIndex.current - 1);
  }, [applyIconHistory]);

  const redoDesktopChange = useCallback(() => {
    const entry = iconHistory.current[iconHistoryIndex.current + 1];
    if (!entry) return;
    applyIconHistory(entry.after, iconHistoryIndex.current + 1);
  }, [applyIconHistory]);

  const toggleFavoriteDesktopIcon = useCallback((id: string) => {
    setFavoriteDesktopIconIds(previous => {
      const updated = previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id];
      localStorage.setItem('abhishek-desktop-favorites', JSON.stringify(updated));
      return updated;
    });
    playSystemSound('notify');
  }, [playSystemSound]);

  // Power actions
  const restartSystem = useCallback(() => {
    setPowerState('booting');
    setWindows([]);
    setActiveWindowId(null);
    setStartMenuOpen(false);
  }, []);

  const shutdownSystem = useCallback(() => {
    setPowerState('shutting-down');
    setStartMenuOpen(false);
    setWindows([]);
    setTimeout(() => {
      setPowerState('off');
    }, 1800);
  }, []);

  const sleepSystem = useCallback(() => {
    setPowerState('sleeping');
    setStartMenuOpen(false);
  }, []);

  const wakeSystem = useCallback(() => {
    setPowerState('running');
  }, []);

  const unlockSystem = useCallback(() => {
    setPowerState('running');
  }, []);

  // Data mutations: Add project
  const addProject = useCallback(async (newProjData: Omit<Project, 'id' | 'sort_order'>) => {
    const newProj: Project = {
      ...newProjData,
      id: `proj-${Date.now()}`,
      sort_order: projects.length + 1,
      created_at: new Date().toISOString(),
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    await saveProjects(updated);

    // Notify user
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Project Published',
      message: `"${newProj.title}" is now published on your public portfolio.`,
      time: 'Just now',
      type: 'success',
      read: false,
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    saveNotifications(updatedNotifs);
    playSystemSound('notify');
  }, [projects, notifications, playSystemSound]);

  // Update project
  const updateProject = useCallback(async (updatedProj: Project) => {
    const updated = projects.map(p => (p.id === updatedProj.id ? updatedProj : p));
    setProjects(updated);
    await saveProjects(updated);
    playSystemSound('notify');
  }, [projects, playSystemSound]);

  // Delete project -> moves to recycle bin
  const deleteProject = useCallback(async (id: string) => {
    const target = projects.find(p => p.id === id);
    if (!target) return;
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    await saveProjects(updatedProjects);

    // Add to recycle bin
    const binItem: RecycleBinItem = {
      id: `bin-${Date.now()}`,
      originalType: 'project',
      name: target.title,
      deletedAt: new Date().toISOString(),
      payload: target,
    };
    const updatedBin = [binItem, ...recycleBinItems];
    setRecycleBinItems(updatedBin);
    saveRecycleBinItems(updatedBin);
    playSystemSound('click');
  }, [projects, recycleBinItems, playSystemSound]);

  // Add certification
  const addCertification = useCallback(async (certData: Omit<Certification, 'id'>) => {
    const newCert: Certification = {
      ...certData,
      id: `cert-${Date.now()}`,
    };
    const updated = [newCert, ...certifications];
    setCertifications(updated);
    await saveCertifications(updated);
    playSystemSound('notify');
  }, [certifications, playSystemSound]);

  // Delete certification
  const deleteCertification = useCallback(async (id: string) => {
    const target = certifications.find(c => c.id === id);
    if (!target) return;
    const updated = certifications.filter(c => c.id !== id);
    setCertifications(updated);
    await saveCertifications(updated);
  }, [certifications]);

  // Send contact message
  const sendContactMessage = useCallback(async (name: string, email: string, message: string): Promise<boolean> => {
    try {
      const newMsg = await saveContactMessage({ name, email, message });
      setContactMessages(prev => [newMsg, ...prev]);

      // Add system notification for incoming message
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Message from ${name}`,
        message: `New inquiry sent to ${PROFILE_INFO.email}`,
        time: 'Just now',
        type: 'success',
        read: false,
      };
      setNotifications(prev => {
        const u = [notif, ...prev];
        saveNotifications(u);
        return u;
      });
      playSystemSound('notify');
      return true;
    } catch {
      return false;
    }
  }, [playSystemSound]);

  // Notification actions
  const addNotification = useCallback((notification: Omit<NotificationItem, 'id' | 'time' | 'read'> & { appId?: AppId }) => {
    setNotifications(prev => {
      const next = [{ ...notification, id: `notif-${Date.now()}`, time: 'Just now', read: false }, ...prev];
      saveNotifications(next);
      return next;
    });
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const u = prev.map(n => (n.id === id ? { ...n, read: true } : n));
      saveNotifications(u);
      return u;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    saveNotifications([]);
  }, []);

  // Recycle Bin actions
  const emptyRecycleBin = useCallback(() => {
    setRecycleBinItems([]);
    saveRecycleBinItems([]);
    playSystemSound('click');
  }, [playSystemSound]);

  const restoreRecycleBinItem = useCallback((id: string) => {
    const item = recycleBinItems.find(i => i.id === id);
    if (!item) return;

    if (item.originalType === 'project' && item.payload) {
      setProjects(prev => {
        const u = [item.payload as Project, ...prev];
        saveProjects(u);
        return u;
      });
    }
    if (item.originalType === 'desktop-icon' && item.payload) {
      setDesktopIcons(previous => {
        if (previous.some(icon => icon.id === item.payload.id)) return previous;
        const restored = [...previous, item.payload as DesktopIconItem];
        localStorage.setItem('abhishek-desktop-icons', JSON.stringify(restored));
        return restored;
      });
    }

    const updatedBin = recycleBinItems.filter(i => i.id !== id);
    setRecycleBinItems(updatedBin);
    saveRecycleBinItems(updatedBin);
    playSystemSound('open');
  }, [recycleBinItems, playSystemSound]);

  const permanentlyDeleteRecycleBinItem = useCallback((id: string) => {
    const updated = recycleBinItems.filter(item => item.id !== id);
    setRecycleBinItems(updated);
    saveRecycleBinItems(updated);
    playSystemSound('click');
  }, [recycleBinItems, playSystemSound]);

  // Admin login
  const loginAdmin = useCallback((pass: string): boolean => {
    // Development/demo credential support: Demo@12345
    if (pass === 'Demo@12345' || pass === 'admin123' || pass === 'abhishek') {
      setIsAdminLoggedIn(true);
      setAdminAuthState(true);
      playSystemSound('notify');
      return true;
    }
    return false;
  }, [playSystemSound]);

  const logoutAdmin = useCallback(() => {
    setIsAdminLoggedIn(false);
    setAdminAuthState(false);
    playSystemSound('click');
  }, [playSystemSound]);

  const adminLogin = useCallback(async (emailOrPass: string, pass?: string): Promise<boolean> => {
    const passwordToCheck = pass !== undefined ? pass : emailOrPass;
    if (
      passwordToCheck === 'Demo@12345' ||
      passwordToCheck === 'admin123' ||
      passwordToCheck === 'abhishek' ||
      passwordToCheck === 'admin'
    ) {
      setIsAdminLoggedIn(true);
      setAdminAuthState(true);
      playSystemSound('notify');
      return true;
    }
    return false;
  }, [playSystemSound]);

  const adminLogout = useCallback(() => {
    logoutAdmin();
  }, [logoutAdmin]);

  const markMessageRead = useCallback((id: string) => {
    setContactMessages(prev => {
      const updated = prev.map(m => (m.id === id ? { ...m, read: true } : m));
      saveContactMessages(updated);
      return updated;
    });
  }, []);

  // Global Keyboard Shortcuts (Ctrl+K, Escape, Meta)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditableTarget = Boolean(
        target &&
        (target.isContentEditable ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      );

      // Ctrl + K or Cmd + K: Toggle Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
        setStartMenuOpen(false);
        setNotificationCenterOpen(false);
      }

      if (!isEditableTarget && (e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redoDesktopChange(); else undoDesktopChange();
      } else if (!isEditableTarget && (e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redoDesktopChange();
      }

      // Escape: Close panels or top active window
      if (e.key === 'Escape') {
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
        if (isNotificationCenterOpen) {
          setNotificationCenterOpen(false);
          return;
        }
      }

      // Alt + Tab: Switch windows
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        if (windows.length > 1) {
          const currentIndex = windows.findIndex(w => w.id === activeWindowId);
          const nextIndex = (currentIndex + 1) % windows.length;
          focusWindow(windows[nextIndex].id);
        }
      }

      // Mission Control: Ctrl/Cmd + Up
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        setDesktopOverviewOpen(prev => !prev);
        setStartMenuOpen(false);
        setSearchOpen(false);
        setNotificationCenterOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isSearchOpen,
    isStartMenuOpen,
    isNotificationCenterOpen,
    contextMenu.isOpen,
    windows,
    activeWindowId,
    desktops,
    activeDesktopId,
    switchDesktop,
    createDesktop,
    deleteDesktop,
    isDesktopOverviewOpen,
    setDesktopOverviewOpen,
    focusWindow,
    closeContextMenu,
    undoDesktopChange,
    redoDesktopChange,
  ]);

  const value = {
    powerState,
    setPowerState,
    restartSystem,
    shutdownSystem,
    sleepSystem,
    wakeSystem,
    unlockSystem,
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
    snapWindow,
    toggleWindowGroup,
    moveWindowToDesktop,
    desktops,
    activeDesktopId,
    switchDesktop,
    createDesktop,
    deleteDesktop,
    isDesktopOverviewOpen,
    setDesktopOverviewOpen,
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
    contextMenu,
    setContextMenu,
    openContextMenu,
    closeContextMenu,
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
    taskbarApps,
    reorderTaskbarApps,
    pinTaskbarApp,
    unpinTaskbarApp,
    settings,
    updateSettings,
    currentWallpaper,
    wallpapers,
    projects,
    experiences,
    skills,
    education,
    certifications,
    notifications,
    recycleBinItems,
    contactMessages,
    contactSubmissions: contactMessages,
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
    emptyRecycleBin,
    restoreRecycleBinItem,
    permanentlyDeleteRecycleBinItem,
    isAdminLoggedIn,
    isAdminAuthenticated: isAdminLoggedIn,
    loginAdmin,
    adminLogin,
    logoutAdmin,
    adminLogout,
    playSystemSound,
  };

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};
