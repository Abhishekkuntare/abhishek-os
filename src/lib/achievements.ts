import { Achievement } from '../types';

const ACHIEVEMENTS_STORAGE_KEY = 'ak_portfolio_achievements_v1';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-project',
    title: 'First Project Discovered',
    description: 'Opened and explored one of Abhishek’s production projects.',
    icon: '🚀',
    points: 50,
    category: 'exploration',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 'terminal-explorer',
    title: 'Power User Terminal',
    description: 'Executed developer commands in the PowerShell Terminal.',
    icon: '⚡',
    points: 50,
    category: 'engineering',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 'code-explorer',
    title: 'Code Inspector',
    description: 'Explored full-stack TypeScript source code in Abhishek Code.',
    icon: '💻',
    points: 100,
    category: 'engineering',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 'camera-shutter',
    title: 'Workstation Snapshot',
    description: 'Captured a photo or video using the browser Camera application.',
    icon: '📸',
    points: 50,
    category: 'multimedia',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 'word-architect',
    title: 'Document Architect',
    description: 'Created or formatted documentation in Abhishek Writer.',
    icon: '📝',
    points: 75,
    category: 'engineering',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 'sheet-analyst',
    title: 'Spreadsheet Analyst',
    description: 'Computed formula metrics inside Abhishek Sheets.',
    icon: '📊',
    points: 75,
    category: 'engineering',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 'game-champion',
    title: 'Arcade Master',
    description: 'Achieved a high score in an original Abhishek Arcade title.',
    icon: '🎮',
    points: 100,
    category: 'mastery',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 'wallpaper-customizer',
    title: 'Desktop Aesthetician',
    description: 'Configured a custom live or interactive workstation wallpaper.',
    icon: '🎨',
    points: 50,
    category: 'exploration',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 'recruiter-express',
    title: 'Recruiter Fast-Track',
    description: 'Activated 60-second Recruiter Mode for rapid qualification.',
    icon: '⭐',
    points: 100,
    category: 'mastery',
    unlocked: false,
    unlockedAt: null,
  },
];

export function getStoredAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (!raw) return INITIAL_ACHIEVEMENTS;
    const stored: Achievement[] = JSON.parse(raw);
    return INITIAL_ACHIEVEMENTS.map(initial => {
      const match = stored.find(s => s.id === initial.id);
      if (match) {
        return {
          ...initial,
          ...match,
          unlocked: !!match.unlockedAt,
        };
      }
      return {
        ...initial,
        unlocked: false,
      };
    });
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function getAchievements(): Achievement[] {
  return getStoredAchievements();
}

export function resetAchievements(): void {
  try {
    localStorage.removeItem(ACHIEVEMENTS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset achievements:', e);
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
  } catch (e) {
    console.error('Failed to save achievements:', e);
  }
}

export function checkAndUnlockAchievement(
  id: string,
  onUnlock?: (achievement: Achievement) => void
): Achievement | null {
  const list = getStoredAchievements();
  const target = list.find(a => a.id === id);

  if (target && !target.unlockedAt) {
    target.unlockedAt = Date.now();
    target.unlocked = true;
    saveAchievements(list);
    if (onUnlock) {
      onUnlock(target);
    }
    return target;
  }
  return null;
}
