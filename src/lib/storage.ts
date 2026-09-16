import { Project, Experience, Skill, Education, Certification, ContactMessage, NotificationItem, SystemSettings, TaskbarApp } from '../types';
import { INITIAL_PROJECTS, INITIAL_EXPERIENCES, INITIAL_SKILLS, INITIAL_EDUCATION, INITIAL_NOTIFICATIONS } from '../data/initialData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PROJECTS: 'ak_portfolio_projects_v1',
  EXPERIENCES: 'ak_portfolio_experiences_v1',
  SKILLS: 'ak_portfolio_skills_v1',
  CERTIFICATIONS: 'ak_portfolio_certifications_v1',
  NOTIFICATIONS: 'ak_portfolio_notifications_v1',
  MESSAGES: 'ak_portfolio_messages_v1',
  RECYCLE_BIN: 'ak_portfolio_recycle_bin_v1',
  SETTINGS: 'ak_portfolio_settings_v1',
  ADMIN_AUTH: 'ak_portfolio_admin_auth_v1',
  TASKBAR_APPS: 'ak_portfolio_taskbar_apps_v1',
};

export function getStoredTaskbarApps(fallback: TaskbarApp[]): TaskbarApp[] {
  return getLocal<TaskbarApp[]>(STORAGE_KEYS.TASKBAR_APPS, fallback);
}

export function saveTaskbarApps(apps: TaskbarApp[]): void {
  setLocal(STORAGE_KEYS.TASKBAR_APPS, apps);
}

export const DEFAULT_SETTINGS: SystemSettings = {
  theme: 'dark',
  accentColor: '#38bdf8', // Windows Sky Cyan
  wallpaperId: 'wall-aurora',
  animationsEnabled: true,
  glassBlurEnabled: true,
  soundsEnabled: true,
  taskbarPosition: 'center',
  performanceMode: 'quality',
  brightness: 100,
  focusMode: false,
  batterySaver: false,
  recruiterMode: false,
  workspaceMode: 'developer',
  windowMode: 'windows',
  iconSize: 'medium',
};

// Safe localStorage helpers
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// Projects Service
export async function getStoredProjects(): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Project[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage:', err);
    }
  }
  return getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
}

export async function saveProjects(projects: Project[]): Promise<void> {
  setLocal(STORAGE_KEYS.PROJECTS, projects);
  if (isSupabaseConfigured && supabase) {
    try {
      // Upsert into Supabase
      await supabase.from('projects').upsert(projects);
    } catch (err) {
      console.error('Supabase saveProjects error:', err);
    }
  }
}

// Certifications Service
export async function getStoredCertifications(): Promise<Certification[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('issue_date', { ascending: false });
      if (!error && data) {
        return data as Certification[];
      }
    } catch (err) {
      console.warn('Supabase cert fetch failed, using local storage:', err);
    }
  }
  return getLocal<Certification[]>(STORAGE_KEYS.CERTIFICATIONS, []);
}

export async function saveCertifications(certifications: Certification[]): Promise<void> {
  setLocal(STORAGE_KEYS.CERTIFICATIONS, certifications);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('certifications').upsert(certifications);
    } catch (err) {
      console.error('Supabase saveCertifications error:', err);
    }
  }
}

// Experiences Service
export function getStoredExperiences(): Experience[] {
  return getLocal<Experience[]>(STORAGE_KEYS.EXPERIENCES, INITIAL_EXPERIENCES);
}

export function saveExperiences(experiences: Experience[]): void {
  setLocal(STORAGE_KEYS.EXPERIENCES, experiences);
}

// Skills Service
export function getStoredSkills(): Skill[] {
  return getLocal<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
}

export function saveSkills(skills: Skill[]): void {
  setLocal(STORAGE_KEYS.SKILLS, skills);
}

// Contact Messages Service
export async function getStoredContactMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as ContactMessage[];
      }
    } catch (err) {
      console.warn('Supabase contact messages fetch failed:', err);
    }
  }
  return getLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, [
    {
      id: 'msg-sample',
      name: 'Tech Recruiter',
      email: 'recruiter@techventures.io',
      message: 'Hi Abhishek, your work on KrishiMitra AI and high performance React apps looks impressive. Would love to connect!',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      read: false
    }
  ]);
}

export async function saveContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'read'>): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    created_at: new Date().toISOString(),
    read: false,
  };
  const current = getLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
  const updated = [newMsg, ...current];
  setLocal(STORAGE_KEYS.MESSAGES, updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('contact_messages').insert([newMsg]);
    } catch (err) {
      console.error('Supabase saveContactMessage error:', err);
    }
  }

  return newMsg;
}

export function saveContactMessages(messages: ContactMessage[]): void {
  setLocal(STORAGE_KEYS.MESSAGES, messages);
}

// Recycle Bin Service
export interface RecycleBinItem {
  id: string;
  originalType: 'project' | 'file' | 'certification' | 'desktop-icon';
  name: string;
  deletedAt: string;
  payload: any;
}

export function getRecycleBinItems(): RecycleBinItem[] {
  return getLocal<RecycleBinItem[]>(STORAGE_KEYS.RECYCLE_BIN, []);
}

export function saveRecycleBinItems(items: RecycleBinItem[]): void {
  setLocal(STORAGE_KEYS.RECYCLE_BIN, items);
}

// Settings Service
export function getStoredSettings(): SystemSettings {
  const stored = getLocal<Partial<SystemSettings>>(STORAGE_KEYS.SETTINGS, {});
  const settings: SystemSettings = {
    ...DEFAULT_SETTINGS,
    ...stored,
    brightness: Math.min(100, Math.max(30, Number(stored.brightness ?? DEFAULT_SETTINGS.brightness))),
    // The light palette was retired; normalize settings saved by older builds.
    theme: 'dark',
  };
  if (stored.theme === 'light') setLocal(STORAGE_KEYS.SETTINGS, settings);
  return settings;
}

export function saveSettings(settings: SystemSettings): void {
  setLocal(STORAGE_KEYS.SETTINGS, settings);
}

// Notifications Service
export function getStoredNotifications(): NotificationItem[] {
  return getLocal<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export function saveNotifications(notifications: NotificationItem[]): void {
  setLocal(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

// Admin Auth Service
export function getAdminAuthState(): boolean {
  return getLocal<boolean>(STORAGE_KEYS.ADMIN_AUTH, false);
}

export function setAdminAuthState(isAuthed: boolean): void {
  setLocal(STORAGE_KEYS.ADMIN_AUTH, isAuthed);
}
