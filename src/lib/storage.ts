// import { Project, Experience, Skill, Education, Certification, ContactMessage, NotificationItem, SystemSettings, TaskbarApp } from '../types';
// import { INITIAL_PROJECTS, INITIAL_EXPERIENCES, INITIAL_SKILLS, INITIAL_EDUCATION, INITIAL_NOTIFICATIONS } from '../data/initialData';
// import { supabase, isSupabaseConfigured } from './supabase';

// const STORAGE_KEYS = {
//   PROJECTS: 'ak_portfolio_projects_v1',
//   EXPERIENCES: 'ak_portfolio_experiences_v1',
//   SKILLS: 'ak_portfolio_skills_v1',
//   CERTIFICATIONS: 'ak_portfolio_certifications_v1',
//   NOTIFICATIONS: 'ak_portfolio_notifications_v1',
//   MESSAGES: 'ak_portfolio_messages_v1',
//   RECYCLE_BIN: 'ak_portfolio_recycle_bin_v1',
//   SETTINGS: 'ak_portfolio_settings_v1',
//   ADMIN_AUTH: 'ak_portfolio_admin_auth_v1',
//   TASKBAR_APPS: 'ak_portfolio_taskbar_apps_v1',
// };

// export function getStoredTaskbarApps(fallback: TaskbarApp[]): TaskbarApp[] {
//   return getLocal<TaskbarApp[]>(STORAGE_KEYS.TASKBAR_APPS, fallback);
// }

// export function saveTaskbarApps(apps: TaskbarApp[]): void {
//   setLocal(STORAGE_KEYS.TASKBAR_APPS, apps);
// }

// export const DEFAULT_SETTINGS: SystemSettings = {
//   theme: 'dark',
//   accentColor: '#38bdf8', // Windows Sky Cyan
//   wallpaperId: 'wall-aurora',
//   animationsEnabled: true,
//   glassBlurEnabled: true,
//   soundsEnabled: true,
//   taskbarPosition: 'center',
//   performanceMode: 'quality',
//   brightness: 100,
//   focusMode: false,
//   batterySaver: false,
//   recruiterMode: false,
//   workspaceMode: 'developer',
//   windowMode: 'windows',
//   iconSize: 'medium',
// };

// // Safe localStorage helpers
// function getLocal<T>(key: string, fallback: T): T {
//   try {
//     const item = localStorage.getItem(key);
//     if (!item) return fallback;
//     return JSON.parse(item);
//   } catch (err) {
//     console.error(`Error reading ${key} from storage:`, err);
//     return fallback;
//   }
// }

// function setLocal<T>(key: string, value: T): void {
//   try {
//     localStorage.setItem(key, JSON.stringify(value));
//   } catch (err) {
//     console.error(`Error saving ${key} to storage:`, err);
//   }
// }

// // Projects Service
// export async function getStoredProjects(): Promise<Project[]> {
//   if (isSupabaseConfigured && supabase) {
//     try {
//       const { data, error } = await supabase
//         .from('projects')
//         .select('*')
//         .order('sort_order', { ascending: true });
//       if (!error && data && data.length > 0) {
//         return data as Project[];
//       }
//     } catch (err) {
//       console.warn('Supabase fetch failed, falling back to local storage:', err);
//     }
//   }
//   return getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
// }

// export async function saveProjects(projects: Project[]): Promise<void> {
//   setLocal(STORAGE_KEYS.PROJECTS, projects);
//   if (isSupabaseConfigured && supabase) {
//     try {
//       // Upsert into Supabase
//       await supabase.from('projects').upsert(projects);
//     } catch (err) {
//       console.error('Supabase saveProjects error:', err);
//     }
//   }
// }

// // Certifications Service
// export async function getStoredCertifications(): Promise<Certification[]> {
//   if (isSupabaseConfigured && supabase) {
//     try {
//       const { data, error } = await supabase
//         .from('certifications')
//         .select('*')
//         .order('issue_date', { ascending: false });
//       if (!error && data) {
//         return data as Certification[];
//       }
//     } catch (err) {
//       console.warn('Supabase cert fetch failed, using local storage:', err);
//     }
//   }
//   return getLocal<Certification[]>(STORAGE_KEYS.CERTIFICATIONS, []);
// }

// export async function saveCertifications(certifications: Certification[]): Promise<void> {
//   setLocal(STORAGE_KEYS.CERTIFICATIONS, certifications);
//   if (isSupabaseConfigured && supabase) {
//     try {
//       await supabase.from('certifications').upsert(certifications);
//     } catch (err) {
//       console.error('Supabase saveCertifications error:', err);
//     }
//   }
// }

// // Experiences Service
// export function getStoredExperiences(): Experience[] {
//   return getLocal<Experience[]>(STORAGE_KEYS.EXPERIENCES, INITIAL_EXPERIENCES);
// }

// export function saveExperiences(experiences: Experience[]): void {
//   setLocal(STORAGE_KEYS.EXPERIENCES, experiences);
// }

// // Skills Service
// export function getStoredSkills(): Skill[] {
//   return getLocal<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
// }

// export function saveSkills(skills: Skill[]): void {
//   setLocal(STORAGE_KEYS.SKILLS, skills);
// }

// // Contact Messages Service
// export async function getStoredContactMessages(): Promise<ContactMessage[]> {
//   if (isSupabaseConfigured && supabase) {
//     try {
//       const { data, error } = await supabase
//         .from('contact_messages')
//         .select('*')
//         .order('created_at', { ascending: false });
//       if (!error && data) {
//         return data as ContactMessage[];
//       }
//     } catch (err) {
//       console.warn('Supabase contact messages fetch failed:', err);
//     }
//   }
//   return getLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, [
//     {
//       id: 'msg-sample',
//       name: 'Tech Recruiter',
//       email: 'recruiter@techventures.io',
//       message: 'Hi Abhishek, your work on KrishiMitra AI and high performance React apps looks impressive. Would love to connect!',
//       created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
//       read: false
//     }
//   ]);
// }

// export async function saveContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'read'>): Promise<ContactMessage> {
//   const newMsg: ContactMessage = {
//     ...msg,
//     id: `msg-${Date.now()}`,
//     created_at: new Date().toISOString(),
//     read: false,
//   };
//   const current = getLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
//   const updated = [newMsg, ...current];
//   setLocal(STORAGE_KEYS.MESSAGES, updated);

//   if (isSupabaseConfigured && supabase) {
//     try {
//       await supabase.from('contact_messages').insert([newMsg]);
//     } catch (err) {
//       console.error('Supabase saveContactMessage error:', err);
//     }
//   }

//   return newMsg;
// }

// export function saveContactMessages(messages: ContactMessage[]): void {
//   setLocal(STORAGE_KEYS.MESSAGES, messages);
// }

// // Recycle Bin Service
// export interface RecycleBinItem {
//   id: string;
//   originalType: 'project' | 'file' | 'certification' | 'desktop-icon';
//   name: string;
//   deletedAt: string;
//   payload: any;
// }

// export function getRecycleBinItems(): RecycleBinItem[] {
//   return getLocal<RecycleBinItem[]>(STORAGE_KEYS.RECYCLE_BIN, []);
// }

// export function saveRecycleBinItems(items: RecycleBinItem[]): void {
//   setLocal(STORAGE_KEYS.RECYCLE_BIN, items);
// }

// // Settings Service
// export function getStoredSettings(): SystemSettings {
//   const stored = getLocal<Partial<SystemSettings>>(STORAGE_KEYS.SETTINGS, {});
//   const settings: SystemSettings = {
//     ...DEFAULT_SETTINGS,
//     ...stored,
//     brightness: Math.min(100, Math.max(30, Number(stored.brightness ?? DEFAULT_SETTINGS.brightness))),
//     // The light palette was retired; normalize settings saved by older builds.
//     theme: 'dark',
//   };
//   if (stored.theme === 'light') setLocal(STORAGE_KEYS.SETTINGS, settings);
//   return settings;
// }

// export function saveSettings(settings: SystemSettings): void {
//   setLocal(STORAGE_KEYS.SETTINGS, settings);
// }

// // Notifications Service
// export function getStoredNotifications(): NotificationItem[] {
//   return getLocal<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
// }

// export function saveNotifications(notifications: NotificationItem[]): void {
//   setLocal(STORAGE_KEYS.NOTIFICATIONS, notifications);
// }

// // Admin Auth Service
// export function getAdminAuthState(): boolean {
//   return getLocal<boolean>(STORAGE_KEYS.ADMIN_AUTH, false);
// }

// export function setAdminAuthState(isAuthed: boolean): void {
//   setLocal(STORAGE_KEYS.ADMIN_AUTH, isAuthed);
// }


import {
  Project,
  Experience,
  Skill,
  Education,
  Certification,
  ContactMessage,
  NotificationItem,
  SystemSettings,
  TaskbarApp,
} from '../types';

import {
  INITIAL_PROJECTS,
  INITIAL_EXPERIENCES,
  INITIAL_SKILLS,
  INITIAL_EDUCATION,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

/**
 * ============================================================
 * STORAGE KEYS
 * ============================================================
 */

const STORAGE_KEYS = {
  PROJECTS: 'ak_portfolio_projects_v2',
  EXPERIENCES: 'ak_portfolio_experiences_v2',
  SKILLS: 'ak_portfolio_skills_v2',
  CERTIFICATIONS: 'ak_portfolio_certifications_v2',
  NOTIFICATIONS: 'ak_portfolio_notifications_v2',
  MESSAGES: 'ak_portfolio_messages_v2',
  RECYCLE_BIN: 'ak_portfolio_recycle_bin_v2',
  SETTINGS: 'ak_portfolio_settings_v2',
  ADMIN_AUTH: 'ak_portfolio_admin_auth_v2',
  TASKBAR_APPS: 'ak_portfolio_taskbar_apps_v2',
};

/**
 * ============================================================
 * DEFAULT SETTINGS
 * ============================================================
 */

export const DEFAULT_SETTINGS: SystemSettings = {
  theme: 'dark',
  accentColor: '#38bdf8',
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

/**
 * ============================================================
 * SAFE LOCAL STORAGE HELPERS
 * ============================================================
 *
 * These helpers make the application resilient when:
 * - localStorage is unavailable
 * - stored JSON is corrupted
 * - browser privacy mode blocks storage
 */

function canUseLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function getLocal<T>(key: string, fallback: T): T {
  if (!canUseLocalStorage()) {
    return fallback;
  }

  try {
    const item = localStorage.getItem(key);

    if (!item) {
      return fallback;
    }

    const parsed = JSON.parse(item);

    return parsed as T;
  } catch (error) {
    console.error(`Error reading "${key}" from local storage:`, error);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving "${key}" to local storage:`, error);
  }
}

function removeLocal(key: string): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing "${key}" from local storage:`, error);
  }
}

/**
 * ============================================================
 * TASKBAR APPS
 * ============================================================
 */

export function getStoredTaskbarApps(
  fallback: TaskbarApp[],
): TaskbarApp[] {
  return getLocal<TaskbarApp[]>(
    STORAGE_KEYS.TASKBAR_APPS,
    fallback,
  );
}

export function saveTaskbarApps(
  apps: TaskbarApp[],
): void {
  setLocal(STORAGE_KEYS.TASKBAR_APPS, apps);
}

/**
 * ============================================================
 * PROJECTS
 * ============================================================
 *
 * Projects are now completely local.
 *
 * Admin changes:
 * Add
 * Edit
 * Delete
 *
 * are persisted in browser localStorage.
 */

export async function getStoredProjects(): Promise<Project[]> {
  const stored = getLocal<Project[] | null>(
    STORAGE_KEYS.PROJECTS,
    null,
  );

  /**
   * First visit:
   * populate storage with the initial portfolio projects.
   */
  if (!stored) {
    const initialProjects = [...INITIAL_PROJECTS];

    setLocal(
      STORAGE_KEYS.PROJECTS,
      initialProjects,
    );

    return initialProjects;
  }

  return stored;
}

export async function saveProjects(
  projects: Project[],
): Promise<void> {
  setLocal(
    STORAGE_KEYS.PROJECTS,
    projects,
  );
}

/**
 * ============================================================
 * CERTIFICATIONS
 * ============================================================
 */

export async function getStoredCertifications(): Promise<Certification[]> {
  return getLocal<Certification[]>(
    STORAGE_KEYS.CERTIFICATIONS,
    [],
  );
}

export async function saveCertifications(
  certifications: Certification[],
): Promise<void> {
  setLocal(
    STORAGE_KEYS.CERTIFICATIONS,
    certifications,
  );
}

/**
 * ============================================================
 * EXPERIENCES
 * ============================================================
 */

export function getStoredExperiences(): Experience[] {
  const stored = getLocal<Experience[] | null>(
    STORAGE_KEYS.EXPERIENCES,
    null,
  );

  if (!stored) {
    const initialExperiences = [...INITIAL_EXPERIENCES];

    setLocal(
      STORAGE_KEYS.EXPERIENCES,
      initialExperiences,
    );

    return initialExperiences;
  }

  return stored;
}

export function saveExperiences(
  experiences: Experience[],
): void {
  setLocal(
    STORAGE_KEYS.EXPERIENCES,
    experiences,
  );
}

/**
 * ============================================================
 * SKILLS
 * ============================================================
 */

export function getStoredSkills(): Skill[] {
  const stored = getLocal<Skill[] | null>(
    STORAGE_KEYS.SKILLS,
    null,
  );

  if (!stored) {
    const initialSkills = [...INITIAL_SKILLS];

    setLocal(
      STORAGE_KEYS.SKILLS,
      initialSkills,
    );

    return initialSkills;
  }

  return stored;
}

export function saveSkills(
  skills: Skill[],
): void {
  setLocal(
    STORAGE_KEYS.SKILLS,
    skills,
  );
}

/**
 * ============================================================
 * EDUCATION
 * ============================================================
 *
 * Education currently comes from initialData and is not
 * mutated by the Admin panel.
 */

export function getStoredEducation(): Education {
  return INITIAL_EDUCATION;
}

/**
 * ============================================================
 * CONTACT MESSAGES
 * ============================================================
 *
 * Contact form submissions are stored locally.
 *
 * IMPORTANT:
 * This means contact messages are available only in the
 * same browser/device where they were submitted.
 */

const SAMPLE_CONTACT_MESSAGE: ContactMessage = {
  id: 'msg-sample',
  name: 'Tech Recruiter',
  email: 'recruiter@techventures.io',
  message:
    'Hi Abhishek, your work on KrishiMitra AI and high performance React apps looks impressive. Would love to connect!',
  created_at: new Date(
    Date.now() - 3600000 * 24,
  ).toISOString(),
  read: false,
};

export async function getStoredContactMessages(): Promise<ContactMessage[]> {
  const stored = getLocal<ContactMessage[] | null>(
    STORAGE_KEYS.MESSAGES,
    null,
  );

  if (!stored) {
    const initialMessages = [SAMPLE_CONTACT_MESSAGE];

    setLocal(
      STORAGE_KEYS.MESSAGES,
      initialMessages,
    );

    return initialMessages;
  }

  return stored;
}

export async function saveContactMessage(
  msg: Omit<
    ContactMessage,
    'id' | 'created_at' | 'read'
  >,
): Promise<ContactMessage> {
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    created_at: new Date().toISOString(),
    read: false,
  };

  const currentMessages = getLocal<ContactMessage[]>(
    STORAGE_KEYS.MESSAGES,
    [],
  );

  const updatedMessages = [
    newMessage,
    ...currentMessages,
  ];

  setLocal(
    STORAGE_KEYS.MESSAGES,
    updatedMessages,
  );

  return newMessage;
}

export function saveContactMessages(
  messages: ContactMessage[],
): void {
  setLocal(
    STORAGE_KEYS.MESSAGES,
    messages,
  );
}

/**
 * ============================================================
 * RECYCLE BIN
 * ============================================================
 */

export interface RecycleBinItem {
  id: string;

  originalType:
    | 'project'
    | 'file'
    | 'certification'
    | 'desktop-icon';

  name: string;

  deletedAt: string;

  payload: any;
}

export function getRecycleBinItems(): RecycleBinItem[] {
  return getLocal<RecycleBinItem[]>(
    STORAGE_KEYS.RECYCLE_BIN,
    [],
  );
}

export function saveRecycleBinItems(
  items: RecycleBinItem[],
): void {
  setLocal(
    STORAGE_KEYS.RECYCLE_BIN,
    items,
  );
}

/**
 * ============================================================
 * SETTINGS
 * ============================================================
 */

export function getStoredSettings(): SystemSettings {
  const stored = getLocal<Partial<SystemSettings>>(
    STORAGE_KEYS.SETTINGS,
    {},
  );

  const brightness = Number(
    stored.brightness ??
      DEFAULT_SETTINGS.brightness,
  );

  const normalizedBrightness = Math.min(
    100,
    Math.max(30, brightness),
  );

  const settings: SystemSettings = {
    ...DEFAULT_SETTINGS,
    ...stored,

    /**
     * Abhishek OS currently uses dark mode as the
     * primary system appearance.
     */
    theme: 'dark',

    brightness: Number.isFinite(
      normalizedBrightness,
    )
      ? normalizedBrightness
      : DEFAULT_SETTINGS.brightness,
  };

  /**
   * Normalize old settings saved by previous versions.
   */
  setLocal(
    STORAGE_KEYS.SETTINGS,
    settings,
  );

  return settings;
}

export function saveSettings(
  settings: SystemSettings,
): void {
  setLocal(
    STORAGE_KEYS.SETTINGS,
    settings,
  );
}

/**
 * ============================================================
 * NOTIFICATIONS
 * ============================================================
 */

export function getStoredNotifications(): NotificationItem[] {
  return getLocal<NotificationItem[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    INITIAL_NOTIFICATIONS,
  );
}

export function saveNotifications(
  notifications: NotificationItem[],
): void {
  setLocal(
    STORAGE_KEYS.NOTIFICATIONS,
    notifications,
  );
}

/**
 * ============================================================
 * ADMIN AUTH
 * ============================================================
 *
 * This is only local/demo authentication.
 *
 * IMPORTANT:
 * It is NOT secure production authentication.
 * The password validation itself currently happens in
 * OSContext, not here.
 */

export function getAdminAuthState(): boolean {
  return getLocal<boolean>(
    STORAGE_KEYS.ADMIN_AUTH,
    false,
  );
}

export function setAdminAuthState(
  isAuthenticated: boolean,
): void {
  setLocal(
    STORAGE_KEYS.ADMIN_AUTH,
    isAuthenticated,
  );
}

/**
 * ============================================================
 * STORAGE RESET HELPERS
 * ============================================================
 *
 * Useful during development if old data causes UI problems.
 */

export function clearPortfolioStorage(): void {
  removeLocal(STORAGE_KEYS.PROJECTS);
  removeLocal(STORAGE_KEYS.EXPERIENCES);
  removeLocal(STORAGE_KEYS.SKILLS);
  removeLocal(STORAGE_KEYS.CERTIFICATIONS);
  removeLocal(STORAGE_KEYS.NOTIFICATIONS);
  removeLocal(STORAGE_KEYS.MESSAGES);
  removeLocal(STORAGE_KEYS.RECYCLE_BIN);
  removeLocal(STORAGE_KEYS.SETTINGS);
  removeLocal(STORAGE_KEYS.ADMIN_AUTH);
  removeLocal(STORAGE_KEYS.TASKBAR_APPS);
}

/**
 * Reset only portfolio content while preserving:
 * - Settings
 * - Taskbar
 * - Admin auth
 * - Recycle bin
 * - Notifications
 */

export function resetPortfolioContent(): void {
  setLocal(
    STORAGE_KEYS.PROJECTS,
    [...INITIAL_PROJECTS],
  );

  setLocal(
    STORAGE_KEYS.EXPERIENCES,
    [...INITIAL_EXPERIENCES],
  );

  setLocal(
    STORAGE_KEYS.SKILLS,
    [...INITIAL_SKILLS],
  );

  setLocal(
    STORAGE_KEYS.CERTIFICATIONS,
    [],
  );

  setLocal(
    STORAGE_KEYS.MESSAGES,
    [SAMPLE_CONTACT_MESSAGE],
  );
}

/**
 * ============================================================
 * DEBUG / STORAGE INFORMATION
 * ============================================================
 */

export function getStorageSnapshot() {
  return {
    projects: getStoredProjects(),
    experiences: getStoredExperiences(),
    skills: getStoredSkills(),
    certifications: getStoredCertifications(),
    notifications: getStoredNotifications(),
    contactMessages: getStoredContactMessages(),
    recycleBinItems: getRecycleBinItems(),
    settings: getStoredSettings(),
    taskbarApps: getStoredTaskbarApps([]),
    isAdminAuthenticated: getAdminAuthState(),
  };
}