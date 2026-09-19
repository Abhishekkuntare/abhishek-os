import React from 'react';
import { AppId, WindowState } from '../../types';
import { AboutApp } from '../applications/AboutApp';
import { AchievementsApp } from '../applications/AchievementsApp';
import { AdminApp } from '../applications/AdminApp';
import { AiAssistantApp } from '../applications/AiAssistantApp';
import { ApiTesterApp } from '../applications/ApiTesterApp';
import { ArcadeApp } from '../applications/ArcadeApp';
import BrowserApp from '../applications/BrowserApp';
import { CalculatorApp } from '../applications/CalculatorApp';
import CalendarApp from '../applications/CalendarApp';
import { CameraApp } from '../applications/CameraApp';
import { ControlPanelApp } from '../applications/ControlPanelApp';
import { CertificationsApp } from '../applications/CertificationsApp';
import CodeEditorApp from '../applications/CodeEditorApp';
import ContactApp from '../applications/ContactApp';
import { EducationApp } from '../applications/EducationApp';
import { ExperienceApp } from '../applications/ExperienceApp';
import { FileExplorerApp } from '../applications/FileExplorerApp';
import { GalleryApp } from '../applications/GalleryApp';
import  GitApp  from '../applications/GitApp';
import { MySkills } from '../applications/MySkills';
import { NotesApp } from '../applications/NotesApp';
import { PdfViewerApp } from '../applications/PdfViewerApp';
import { PerformanceCenterApp } from '../applications/PerformanceCenterApp';
import { ProjectsApp } from '../applications/ProjectsApp';
import { RecycleBinApp } from '../applications/RecycleBinApp';
import { ResumeApp } from '../applications/ResumeApp';
import { SecurityCenterApp } from '../applications/SecurityCenterApp';
import SettingsApp from '../applications/SettingsApp';
import { SheetsApp } from '../applications/SheetsApp';
import { SkillsApp } from '../applications/SkillsApp';
import { SpotifyApp } from '../applications/SpotifyApp';
import { SystemInfoApp } from '../applications/SystemInfoApp';
import { SystemMonitorApp } from '../applications/SystemMonitorApp';
import { TerminalApp } from '../applications/TerminalApp';
import { ThisPCApp } from '../applications/ThisPCApp';
import { YouTubeApp } from '../applications/YouTubeApp';
import WidgetsApp from '../applications/WidgetsApp';
import { WeatherApp } from '../applications/WeatherApp';
import VideoPlayerApp from '../applications/VideoPlayerApp';
import { WriterApp } from '../applications/WriterApp';
import { StoreApp } from '../applications/StoreApp';
import { AbhishekCanvaApp } from '../applications/abhishekcanva/AbhishekCanvaApp';
import WindowContentYouTube from './WindowContent';

interface WindowContentProps {
  win: WindowState;
}

const APP_COMPONENTS: Partial<Record<AppId, React.ComponentType<{ extraData?: any }>>> = {
  about: AboutApp,
  achievements: AchievementsApp,
  admin: AdminApp,
  ai: AiAssistantApp,
  'api-tester': ApiTesterApp,
  arcade: ArcadeApp,
  'abhishek-canva': AbhishekCanvaApp,
  browser: BrowserApp,
  calculator: CalculatorApp,
  calendar: CalendarApp,
  camera: CameraApp,
  'control-panel': ControlPanelApp,
  certifications: CertificationsApp,
  'code-editor': CodeEditorApp,
  contact: ContactApp,
  education: EducationApp,
  experience: ExperienceApp,
  'file-explorer': FileExplorerApp,
  gallery: GalleryApp,
  git: GitApp,
  skills: SkillsApp,
  notes: NotesApp,
  'pdf-viewer': PdfViewerApp,
  performance: PerformanceCenterApp,
  projects: ProjectsApp,
  'recycle-bin': RecycleBinApp,
  resume: ResumeApp,
  security: SecurityCenterApp,
  settings: SettingsApp,
  sheets: SheetsApp,
  spotify: SpotifyApp,
  'system-info': SystemInfoApp,
  'system-monitor': SystemMonitorApp,
  terminal: TerminalApp,
  'this-pc': ThisPCApp,
  youtube: WindowContentYouTube,
  widgets: WidgetsApp,
  weather: WeatherApp,
  'video-player': VideoPlayerApp,
  writer: WriterApp,
  store: StoreApp,
};

const WindowContentRouter: React.FC<WindowContentProps> = ({ win }) => {
  const Component = APP_COMPONENTS[win.appId];

  if (!Component) {
    return <div className="p-6 text-sm text-slate-300">Application is unavailable.</div>;
  }

  return <Component extraData={win.extraData} />;
};

export default WindowContentRouter;
