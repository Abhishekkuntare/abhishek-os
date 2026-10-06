import React, { Suspense } from 'react';
import { AppId, WindowState } from '../../types';

const AboutApp = React.lazy(() => import('../applications/AboutApp').then(module => ({ default: module.AboutApp })));
const AchievementsApp = React.lazy(() => import('../applications/AchievementsApp').then(module => ({ default: module.AchievementsApp })));
const AdminApp = React.lazy(() => import('../applications/AdminApp').then(module => ({ default: module.AdminApp })));
const AiAssistantApp = React.lazy(() => import('../applications/AiAssistantApp').then(module => ({ default: module.AiAssistantApp })));
const ApiTesterApp = React.lazy(() => import('../applications/ApiTesterApp').then(module => ({ default: module.ApiTesterApp })));
const ArcadeApp = React.lazy(() => import('../applications/ArcadeApp').then(module => ({ default: module.ArcadeApp })));
const BrowserApp = React.lazy(() => import('../applications/BrowserApp'));
const CalculatorApp = React.lazy(() => import('../applications/CalculatorApp').then(module => ({ default: module.CalculatorApp })));
const CalendarApp = React.lazy(() => import('../applications/CalendarApp'));
const CameraApp = React.lazy(() => import('../applications/CameraApp').then(module => ({ default: module.CameraApp })));
const ControlPanelApp = React.lazy(() => import('../applications/ControlPanelApp').then(module => ({ default: module.ControlPanelApp })));
const CertificationsApp = React.lazy(() => import('../applications/CertificationsApp').then(module => ({ default: module.CertificationsApp })));
const CodeEditorApp = React.lazy(() => import('../applications/CodeEditorApp'));
const ContactApp = React.lazy(() => import('../applications/ContactApp').then(module => ({ default: module.ContactApp })));
const EducationApp = React.lazy(() => import('../applications/EducationApp').then(module => ({ default: module.EducationApp })));
const ExperienceApp = React.lazy(() => import('../applications/ExperienceApp').then(module => ({ default: module.ExperienceApp })));
const FileExplorerApp = React.lazy(() => import('../applications/FileExplorerApp').then(module => ({ default: module.FileExplorerApp })));
const GalleryApp = React.lazy(() => import('../applications/GalleryApp').then(module => ({ default: module.GalleryApp })));
const GitApp = React.lazy(() => import('../applications/GitApp'));
const NotesApp = React.lazy(() => import('../applications/NotesApp').then(module => ({ default: module.NotesApp })));
const PdfViewerApp = React.lazy(() => import('../applications/PdfViewerApp').then(module => ({ default: module.PdfViewerApp })));
const PerformanceCenterApp = React.lazy(() => import('../applications/PerformanceCenterApp').then(module => ({ default: module.PerformanceCenterApp })));
const ProjectsApp = React.lazy(() => import('../applications/ProjectsApp').then(module => ({ default: module.ProjectsApp })));
const RecycleBinApp = React.lazy(() => import('../applications/RecycleBinApp').then(module => ({ default: module.RecycleBinApp })));
const ResumeApp = React.lazy(() => import('../applications/ResumeApp').then(module => ({ default: module.ResumeApp })));
const SecurityCenterApp = React.lazy(() => import('../applications/SecurityCenterApp').then(module => ({ default: module.SecurityCenterApp })));
const SettingsApp = React.lazy(() => import('../applications/SettingsApp'));
const SheetsApp = React.lazy(() => import('../applications/SheetsApp').then(module => ({ default: module.SheetsApp })));
const SkillsApp = React.lazy(() => import('../applications/SkillsApp').then(module => ({ default: module.SkillsApp })));
const SpotifyApp = React.lazy(() => import('../applications/SpotifyApp').then(module => ({ default: module.SpotifyApp })));
const SystemInfoApp = React.lazy(() => import('../applications/SystemInfoApp').then(module => ({ default: module.SystemInfoApp })));
const SystemMonitorApp = React.lazy(() => import('../applications/SystemMonitorApp').then(module => ({ default: module.SystemMonitorApp })));
const TerminalApp = React.lazy(() => import('../applications/TerminalApp').then(module => ({ default: module.TerminalApp })));
const ThisPCApp = React.lazy(() => import('../applications/ThisPCApp').then(module => ({ default: module.ThisPCApp })));
const WidgetsApp = React.lazy(() => import('../applications/WidgetsApp'));
const WeatherApp = React.lazy(() => import('../applications/WeatherApp').then(module => ({ default: module.WeatherApp })));
const VideoPlayerApp = React.lazy(() => import('../applications/VideoPlayerApp'));
const WriterApp = React.lazy(() => import('../applications/WriterApp').then(module => ({ default: module.WriterApp })));
const StoreApp = React.lazy(() => import('../applications/StoreApp').then(module => ({ default: module.StoreApp })));
const AbhishekCanvaApp = React.lazy(() => import('../applications/abhishekcanva/AbhishekCanvaApp').then(module => ({ default: module.AbhishekCanvaApp })));
const WindowContentYouTube = React.lazy(() => import('./WindowContent'));

interface WindowContentProps {
  win: WindowState;
}

const APP_COMPONENTS: Partial<Record<AppId, React.LazyExoticComponent<React.ComponentType<{ extraData?: any }>>>> = {
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

  return (
    <Suspense
      fallback={
        <div
          role="status"
          className="flex h-full min-h-40 items-center justify-center text-sm text-slate-400"
        >
          Loading application...
        </div>
      }
    >
      <Component extraData={win.extraData} />
    </Suspense>
  );
};

export default WindowContentRouter;
