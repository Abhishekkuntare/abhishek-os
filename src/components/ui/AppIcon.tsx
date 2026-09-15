import React from 'react';
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
  className?: string;
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ name, className = 'w-6 h-6', size }) => {
  const props = { className, size };

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
