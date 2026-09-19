export type AppId =
  | 'this-pc'
  | 'browser'
  | 'youtube'
  | 'spotify'
  | 'widgets'
  | 'gallery'
  | 'weather'
  | 'calculator'
  | 'calendar'
  | 'notes'
  | 'system-monitor'
  | 'about'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'education'
  | 'certifications'
  | 'resume'
  | 'contact'
  | 'recycle-bin'
  | 'terminal'
  | 'system-info'
  | 'settings'
  | 'admin'
  | 'camera'
  | 'video-player'
  | 'music-player'
  | 'code-editor'
  | 'writer'
  | 'sheets'
  | 'pdf-viewer'
  | 'snipping-tool'
  | 'arcade'
  | 'downloads'
  | 'achievements'
  | 'file-explorer'
  | 'git'
  | 'api-tester'
  | 'ai'
  | 'performance'
  | 'security'
  | 'control-panel'
  | 'store'
  | 'abhishek-canva';

export interface TaskbarApp {
  appId: AppId;
  title: string;
  icon: string;
}

export interface VFSFile {
  id: string;
  name: string;
  path: string; // e.g. "/Documents/Abhishek_Profile.abkdoc"
  type: 'file' | 'folder';
  mimeType?: string;
  extension: string; // "abkdoc", "abkxlsx", "ts", "jpg", "mp4", "pdf", "txt", etc.
  size: number;
  updatedAt: number;
  content: string; // Text, JSON, data URI, or base64
  thumbnail?: string;
  isSystem?: boolean;
  deletedAt?: number | null; // Set when in Recycle Bin
  /** Finder labels persisted with the file. */
  tags?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  category: 'exploration' | 'engineering' | 'multimedia' | 'mastery';
  unlocked?: boolean;
  unlockedAt: number | null;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  iconName: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  prevBounds?: { x: number; y: number; width: number; height: number };
  snap?: WindowSnap;
  groupId?: string;
  extraData?: any;
  desktopId: string;
}

export type WindowSnap =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface Project {
  id: string;
  title: string;
  slug: string;
  number?: string;
  short_description: string;
  long_description: string;
  technologies: string[];
  category: string;
  year: string;
  thumbnail_url: string;
  gallery: string[];
  live_url?: string;
  github_url?: string;
  featured: boolean;
  status: 'Completed' | 'In Progress' | 'Maintained';
  challenges?: string;
  solution?: string;
  results?: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string[];
  achievements: string[];
  technologies: string[];
  sort_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Programming Languages' | 'Frontend' | 'Backend & Database' | 'AI / API' | 'Tools / Engineering';
  sort_order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  cgpa: string;
  start_date: string;
  end_date: string;
  location: string;
  description: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  credential_id?: string;
  credential_url?: string;
  certificate_url?: string;
  description: string;
  skills?: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'alert';
  read: boolean;
}

export type WallpaperType =
  | 'static'
  | 'aurora'
  | 'starfield'
  | 'developer-grid'
  | 'cosmic-flow'
  | 'liquid-glass'
  | 'neural'
  | 'black-hole'
  | 'video';

export interface Wallpaper {
  id: string;
  name: string;
  thumbnailColor: string;
  style: string;
  type?: WallpaperType;
  description?: string;
  videoUrl?: string;
}

export interface DesktopIconItem {
  id: string;
  appId: AppId;
  title: string;
  iconName: string;
  fileExtension?: string;
  customPosition?: { x: number; y: number };
  /** Optional launch payload used by installed Store experiences. */
  extraData?: any;
}

export interface SystemSettings {
  theme: 'dark';
  accentColor: string;
  wallpaperId: string;
  animationsEnabled: boolean;
  glassBlurEnabled: boolean;
  soundsEnabled: boolean;
  taskbarPosition: 'center' | 'left';
  performanceMode: 'quality' | 'balanced' | 'performance';
  brightness: number; // 30 - 100
  focusMode: boolean;
  batterySaver: boolean;
  recruiterMode: boolean;
  /** The focused workspace used by the Start menu and quick-launch workflows. */
  workspaceMode: 'recruiter' | 'developer';
  windowMode: 'windows' | 'macos';
  iconSize: 'small' | 'medium' | 'large';
}

export type SystemPowerState = 'booting' | 'locked' | 'running' | 'sleeping' | 'shutting-down' | 'off';
