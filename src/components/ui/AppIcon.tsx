import React from 'react';
import type { AppId } from '../../types';
import {
  Monitor,
  UserCheck,
  FolderKanban,
  Briefcase,
  Cpu,
  GraduationCap,
  Award,
  FileText,
  Mail,
  Trash2,
  Terminal,
  HardDrive,
  Settings,
  ShieldAlert,
  Folder,
  Code2,
  Sparkles,
  LayoutGrid,
  FileCode,
  Layers,
  HelpCircle,
  Globe,
  Youtube,
  Music,
  LayoutDashboard,
  Activity,
  Images,
  StickyNote,
  CloudSun,
  Calculator,
  Calendar,
  Camera,
  Table,
  Gamepad2,
  Trophy,
  Video,
  GitBranch,
  Send,
  SlidersHorizontal,
  Store,
} from 'lucide-react';

interface AppIconProps {
  name: string;
  appId?: AppId;
  fileExtension?: string;
  fileType?: 'file' | 'folder';
  className?: string;
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  appId,
  fileExtension,
  fileType,
  className = 'w-6 h-6',
  size,
}) => {
  const props = { className, size };

  const extension = fileExtension?.toLowerCase().replace(/^\./, '');
  const fileImage = fileType === 'folder'
    ? 'folder'
    : fileType === 'file'
      ? extension === 'pdf'
        ? 'pdf'
        : /^(ts|tsx|js|jsx|json|css|scss|html|py|sql|sh|go|rs|java|c|cpp|h|hpp|vue|svelte)$/.test(extension ?? '')
          ? 'code-file'
          : /^(txt|md|rtf|doc|docx|abkdoc)$/.test(extension ?? '')
            ? 'text-file'
            : 'files'
      : null;
  if (fileImage) {
    return (
      <img
        src={`/app-icons/${fileImage}.png`}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        className={`${className} object-contain`}
        draggable={false}
      />
    );
  }

  const appImageIcons: Partial<Record<AppId, string>> = {
    'this-pc': 'this-pc',
    'file-explorer': 'folder',
    'sheets': 'sheets',
    'settings': 'settings',
    'widgets': 'widgets',
    weather: 'weather',
    'abhishek-canva': 'canva',
    store: 'app-store',
    achievements: 'achievements',
    calculator: 'calculator',
    certifications: 'certificates',
    education: 'education',
    experience: 'experience',
    git: 'git',
    projects: 'projects',
    'code-editor': 'vs-code',
    terminal: 'terminal',
    browser: 'browser',
    writer: 'writer',
    resume: 'resume',
    skills: 'skills',
    contact: 'contacts',
    about: 'about',
    arcade: 'games',
    camera: 'camera',
    'video-player': 'media-player',
    'control-panel': 'control-center',
    gallery: 'gallery',
    notes: 'notes',
    performance: 'performance',
    'system-monitor': 'task-manager',
    youtube: 'youtube',
    'recycle-bin': 'trash',
    spotify: 'music',
    'music-player': 'music',
    'api-tester': 'api-lab',
    calendar: 'calendar',
  };
  const imageIcons: Record<string, string> = {
    Monitor: 'this-pc',
    CloudSun: 'weather',
    Palette: 'canva',
    Store: 'app-store',
    Trophy: 'achievements',
    Calculator: 'calculator',
    Table: 'sheets',
    Settings: 'settings',
    LayoutDashboard: 'widgets',
    Award: 'certificates',
    GraduationCap: 'education',
    GitBranch: 'git',
    FolderKanban: 'projects',
    Terminal: 'terminal',
    Globe: 'browser',
    Gamepad2: 'games',
    Camera: 'camera',
    SlidersHorizontal: 'control-center',
    Images: 'gallery',
    Music: 'music',
    Activity: 'task-manager',
    Youtube: 'youtube',
    StickyNote: 'notes',
    FileText: 'writer',
    UserCheck: 'about',
    Trash2: 'trash',
    Video: 'media-player',
    Send: 'api-lab',
    Calendar: 'calendar',
    Cpu: 'skills',
    Briefcase: 'experience',
    Mail: 'contacts',
    Code2: 'vs-code',
    ShieldAlert: 'task-manager',
    HardDrive: 'this-pc',
    Folder: 'folder',
  };
  const imageIcon = (appId && appImageIcons[appId]) || imageIcons[name];
  if (imageIcon) {
    return (
      <img
        src={`/app-icons/${imageIcon}.png`}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        className={`${className} object-contain`}
        draggable={false}
      />
    );
  }

  switch (name) {
    case 'Monitor':
      return <Monitor {...props} />;
    case 'Globe':
      return <Globe {...props} />;
    case 'Youtube':
      return <Youtube {...props} />;
    case 'Music':
      return <Music {...props} />;
    case 'LayoutDashboard':
      return <LayoutDashboard {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'Images':
      return <Images {...props} />;
    case 'StickyNote':
      return <StickyNote {...props} />;
    case 'CloudSun':
      return <CloudSun {...props} />;
    case 'Calculator':
      return <Calculator {...props} />;
    case 'Calendar':
      return <Calendar {...props} />;
    case 'UserCheck':
      return <UserCheck {...props} />;
    case 'FolderKanban':
      return <FolderKanban {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'Cpu':
      return <Cpu {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'Award':
      return <Award {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'Mail':
      return <Mail {...props} />;
    case 'Trash2':
      return <Trash2 {...props} />;
    case 'Terminal':
      return <Terminal {...props} />;
    case 'HardDrive':
      return <HardDrive {...props} />;
    case 'Settings':
      return <Settings {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
    case 'Folder':
      return <Folder {...props} />;
    case 'Code2':
      return <Code2 {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'LayoutGrid':
      return <LayoutGrid {...props} />;
    case 'FileCode':
      return <FileCode {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'Camera':
      return <Camera {...props} />;
    case 'Table':
      return <Table {...props} />;
    case 'Gamepad2':
      return <Gamepad2 {...props} />;
    case 'Trophy':
      return <Trophy {...props} />;
    case 'Video':
      return <Video {...props} />;
    case 'GitBranch':
      return <GitBranch {...props} />;
    case 'Send':
      return <Send {...props} />;
    case 'SlidersHorizontal':
      return <SlidersHorizontal {...props} />;
    case 'Store':
      return <Store {...props} />;
    default:
      return <Monitor {...props} />;
  }
};
