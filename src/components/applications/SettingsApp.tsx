import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useOS } from '../../context/OSContext';
import { saveCustomWallpaper } from '../../lib/wallpaperStorage';

import {
  ArrowLeft,
  Search,
  Home,
  Monitor,
  Bluetooth,
  Wifi,
  Palette,
  AppWindow,
  Users,
  Clock3,
  Gamepad2,
  Accessibility,
  ShieldCheck,
  RefreshCw,
  Image as ImageIcon,
  Paintbrush,
  Sun,
  Moon,
  Sparkles,
  Volume2,
  Zap,
  Check,
  ChevronRight,
  Info,
  Laptop,
  Cpu,
  HardDrive,
  Globe,
  Keyboard,
  Lock,
  Bell,
  Eye,
  MousePointer2,
  Languages,
  SlidersHorizontal,
  RotateCcw,
  Layers,
  Network,
  Smartphone,
  MonitorSpeaker,
  Printer,
  Camera,
  Tablet,
  Headphones,
  Mouse,
  Gamepad,
  Shield,
  KeyRound,
  UserRound,
  Power,
  Database,
  Download,
  Upload,
  Plug,
  Router,
  Server,
  CircleCheck,
  CircleAlert,
  X,
  Plus,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Rocket,
  HardDriveDownload,
  Timer,
  MapPin,
  MonitorCog,
  Accessibility as AccessibilityIcon,
  BriefcaseBusiness,
  Code2,
} from 'lucide-react';


/* =========================================================
   TYPES
========================================================= */

type SettingsPage =
  | 'home'
  | 'system'
  | 'bluetooth'
  | 'network'
  | 'personalization'
  | 'apps'
  | 'accounts'
  | 'time'
  | 'gaming'
  | 'accessibility'
  | 'privacy'
  | 'update';

type ModalType =
  | 'add-device'
  | 'display'
  | 'sound'
  | 'notifications'
  | 'storage'
  | 'installed-app'
  | 'startup'
  | 'sign-in'
  | 'datetime'
  | 'language'
  | 'gaming'
  | 'privacy'
  | 'security'
  | 'none';

interface NavItem {
  id: SettingsPage;
  label: string;
  icon: React.ElementType;
  color: string;
}

interface SettingRowProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  onClick?: () => void;
  right?: React.ReactNode;
  accent?: string;
}

interface Device {
  id: number;
  name: string;
  type: string;
  icon: React.ElementType;
  connected: boolean;
  paired: boolean;
}

interface AppItem {
  id: number;
  name: string;
  publisher: string;
  version: string;
  icon: React.ElementType;
  startup: boolean;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'info' | 'warning';
}


/* =========================================================
   CONSTANTS
========================================================= */

const ACCENT_COLORS = [
  {
    name: 'Sky Cyan',
    hex: '#38bdf8',
  },
  {
    name: 'Electric Blue',
    hex: '#3b82f6',
  },
  {
    name: 'Emerald Green',
    hex: '#10b981',
  },
  {
    name: 'Amethyst Purple',
    hex: '#a855f7',
  },
  {
    name: 'Crimson Rose',
    hex: '#f43f5e',
  },
  {
    name: 'Amber Gold',
    hex: '#f59e0b',
  },
];

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    color: 'text-orange-400',
  },
  {
    id: 'system',
    label: 'System',
    icon: Monitor,
    color: 'text-sky-400',
  },
  {
    id: 'bluetooth',
    label: 'Bluetooth & devices',
    icon: Bluetooth,
    color: 'text-blue-400',
  },
  {
    id: 'network',
    label: 'Network & internet',
    icon: Wifi,
    color: 'text-cyan-400',
  },
  {
    id: 'personalization',
    label: 'Personalization',
    icon: Palette,
    color: 'text-purple-400',
  },
  {
    id: 'apps',
    label: 'Apps',
    icon: AppWindow,
    color: 'text-indigo-400',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: Users,
    color: 'text-emerald-400',
  },
  {
    id: 'time',
    label: 'Time & language',
    icon: Clock3,
    color: 'text-yellow-400',
  },
  {
    id: 'gaming',
    label: 'Gaming',
    icon: Gamepad2,
    color: 'text-red-400',
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    icon: Accessibility,
    color: 'text-blue-300',
  },
  {
    id: 'privacy',
    label: 'Privacy & security',
    icon: ShieldCheck,
    color: 'text-slate-300',
  },
  {
    id: 'update',
    label: 'Windows Update',
    icon: RefreshCw,
    color: 'text-cyan-400',
  },
];

const SEARCH_ITEMS = [
  'Background',
  'Colors',
  'Themes',
  'Lock screen',
  'Animations',
  'Glass blur',
  'System sounds',
  'Display',
  'Sound',
  'Notifications',
  'Storage',
  'Bluetooth',
  'Bluetooth & devices',
  'Wi-Fi',
  'Network',
  'Internet',
  'Installed apps',
  'Startup apps',
  'Your info',
  'Sign-in options',
  'Date & time',
  'Language & region',
  'Game Mode',
  'Accessibility',
  'Visual effects',
  'Privacy',
  'Security',
  'Windows Update',
  'System information',
];


/* =========================================================
   SMALL UI COMPONENTS
========================================================= */

const SettingRow: React.FC<SettingRowProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  right,
  accent = 'text-slate-200',
}) => {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={event => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onClick();
        }
      }}
      className="
        group w-full
        flex items-center gap-4
        px-5 py-4
        text-left
        rounded-2xl
        bg-white/[0.035]
        border border-white/[0.06]
        hover:bg-white/[0.065]
        hover:border-white/[0.12]
        hover:-translate-y-[1px]
        active:scale-[0.995]
        transition-all duration-200
      "
    >
      <div
        className="
          shrink-0
          w-10 h-10
          rounded-xl
          bg-white/[0.055]
          border border-white/[0.06]
          flex items-center justify-center
          group-hover:bg-white/[0.09]
          transition-all duration-200
        "
      >
        <Icon
          className={`w-5 h-5 ${accent}`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium text-slate-100">
          {title}
        </div>

        {description && (
          <div className="mt-0.5 text-[12px] text-slate-400 leading-relaxed">
            {description}
          </div>
        )}
      </div>

      {right ? (
        <div className="shrink-0">
          {right}
        </div>
      ) : (
        <ChevronRight
          className="
            w-5 h-5
            text-slate-500
            group-hover:text-slate-200
            group-hover:translate-x-1
            transition-all
          "
        />
      )}
    </div>
  );
};


interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  accent?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  accent = '#38bdf8',
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(event) => {
        event.stopPropagation();
        onChange();
      }}
      className="
        relative
        w-[46px] h-[26px]
        rounded-full
        shrink-0
        transition-all duration-300
      "
      style={{
        background: checked
          ? accent
          : 'rgba(100,116,139,.55)',
        boxShadow: checked
          ? `0 0 20px ${accent}40`
          : 'none',
      }}
    >
      <span
        className="
          absolute top-[4px]
          w-[18px] h-[18px]
          rounded-full
          bg-white
          shadow-md
          transition-transform duration-300
        "
        style={{
          transform: checked
            ? 'translateX(24px)'
            : 'translateX(4px)',
        }}
      />
    </button>
  );
};


const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        rounded-2xl
        border border-white/[0.07]
        bg-white/[0.025]
        shadow-[0_10px_40px_rgba(0,0,0,.12)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};


const SectionHeader: React.FC<{
  title: string;
  description?: string;
}> = ({
  title,
  description,
}) => {
  return (
    <div>
      <h1
        className="
          text-[30px]
          sm:text-[36px]
          font-semibold
          tracking-tight
          text-white
        "
      >
        {title}
      </h1>

      {description && (
        <p className="mt-1 text-[13px] text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
};


const MiniStat: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: string;
}> = ({
  icon: Icon,
  label,
  value,
  accent = 'text-sky-400',
}) => {
  return (
    <div
      className="
        p-4
        rounded-2xl
        bg-white/[0.035]
        border border-white/[0.06]
        hover:bg-white/[0.055]
        transition-all
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            w-9 h-9
            rounded-xl
            bg-white/[0.05]
            flex items-center justify-center
          "
        >
          <Icon className={`w-4 h-4 ${accent}`} />
        </div>

        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">
            {label}
          </div>

          <div className="mt-1 text-[13px] font-medium text-white truncate">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================================
   MAIN SETTINGS APP
========================================================= */

export const SettingsApp: React.FC = () => {
  const {
    settings,
    updateSettings,
    wallpapers,
    currentWallpaper,
    playSystemSound,
    activateMode,
  } = useOS();

  const [activePage, setActivePage] =
    useState<SettingsPage>('home');

  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] =
    useState(false);

  const [modal, setModal] =
    useState<ModalType>('none');

  const [toast, setToast] =
    useState<ToastState>({
      show: false,
      message: '',
      type: 'success',
    });

  const [bluetoothEnabled, setBluetoothEnabled] =
    useState(true);

  const [wifiEnabled, setWifiEnabled] =
    useState(true);

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(true);

  const [gameMode, setGameMode] =
    useState(true);

  const [nightLight, setNightLight] =
    useState(false);

  const [transparency, setTransparency] =
    useState(() => settings?.glassBlurEnabled ?? true);

  const [pointerTrails, setPointerTrails] =
    useState(false);

  const [largeText, setLargeText] =
    useState(false);

  const [privacyLocation, setPrivacyLocation] =
    useState(false);

  const [privacyCamera, setPrivacyCamera] =
    useState(true);

  const [privacyMicrophone, setPrivacyMicrophone] =
    useState(true);

  const [isCheckingUpdates, setIsCheckingUpdates] =
    useState(false);

  const [updateChecked, setUpdateChecked] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(new Date());

  const [isOnline, setIsOnline] =
    useState(
      typeof navigator !== 'undefined'
        ? navigator.onLine
        : true
    );

  const [connectedDevices, setConnectedDevices] =
    useState<Device[]>([
      {
        id: 1,
        name: 'OnePlus Bullets Wireless',
        type: 'Headphones',
        icon: Headphones,
        connected: false,
        paired: true,
      },
      {
        id: 2,
        name: 'Living room TV',
        type: 'Display',
        icon: MonitorSpeaker,
        connected: false,
        paired: true,
      },
      {
        id: 3,
        name: 'Lyne Rover 39',
        type: 'Headphones',
        icon: Headphones,
        connected: false,
        paired: true,
      },
    ]);

  const [installedApps] =
    useState<AppItem[]>([
      {
        id: 1,
        name: 'VS Code',
        publisher: 'Microsoft',
        version: '1.104',
        icon: CodeIcon,
        startup: true,
      },
      {
        id: 2,
        name: 'Google Chrome',
        publisher: 'Google',
        version: '140',
        icon: Globe,
        startup: true,
      },
      {
        id: 3,
        name: 'File Explorer',
        publisher: 'Abhishek OS',
        version: '2026.1',
        icon: HardDrive,
        startup: false,
      },
      {
        id: 4,
        name: 'Terminal',
        publisher: 'Abhishek OS',
        version: '2.0',
        icon: TerminalIcon,
        startup: false,
      },
      {
        id: 5,
        name: 'Settings',
        publisher: 'Abhishek OS',
        version: '2026.1',
        icon: SlidersHorizontal,
        startup: false,
      },
      {
        id: 6,
        name: 'Portfolio Browser',
        publisher: 'Abhishek',
        version: '1.8',
        icon: Globe,
        startup: false,
      },
    ]);

  const [browserWidth, setBrowserWidth] =
    useState(
      typeof window !== 'undefined'
        ? window.innerWidth
        : 1920
    );

  const [browserHeight, setBrowserHeight] =
    useState(
      typeof window !== 'undefined'
        ? window.innerHeight
        : 1080
    );

  const [batteryLevel, setBatteryLevel] =
    useState<number | null>(null);

  const [networkType, setNetworkType] =
    useState('Wi-Fi');

  const [deviceName] =
    useState('DESKTOP-G6HV1N3');


  /* =======================================================
     HELPERS
  ======================================================= */

  const accent =
    settings?.accentColor || '#38bdf8';

  const showToast = (
    message: string,
    type: ToastState['type'] = 'success'
  ) => {
    setToast({
      show: true,
      message,
      type,
    });

    window.setTimeout(() => {
      setToast((previous) => ({
        ...previous,
        show: false,
      }));
    }, 2500);
  };


  const selectPage = (
    page: SettingsPage
  ) => {
    setActivePage(page);
    setSearch('');
    setIsSearchFocused(false);

    try {
      playSystemSound('click');
    } catch {
      // Ignore sound errors.
    }
  };


  const changeWallpaper = (
    wallpaperId: string
  ) => {
    updateSettings({
      wallpaperId,
    });

    try {
      playSystemSound('click');
    } catch {
      // Ignore.
    }

    showToast('Background updated');
  };


  const changeAccent = (
    hex: string
  ) => {
    updateSettings({
      accentColor: hex,
    });

    try {
      playSystemSound('click');
    } catch {
      // Ignore.
    }

    showToast('Accent color updated');
  };


  const resetVisualSettings = () => {
    if (wallpapers.length > 0) {
      updateSettings({
        wallpaperId: wallpapers[0].id,
        accentColor: '#38bdf8',
        animationsEnabled: true,
        glassBlurEnabled: true,
        soundsEnabled: true,
      });
    } else {
      updateSettings({
        accentColor: '#38bdf8',
        animationsEnabled: true,
        glassBlurEnabled: true,
        soundsEnabled: true,
      });
    }

    setNightLight(false);
    setTransparency(true);
    setLargeText(false);

    showToast('Personalization settings reset');
  };


  const toggleDevice = (
    id: number
  ) => {
    setConnectedDevices((devices) =>
      devices.map((device) =>
        device.id === id
          ? {
              ...device,
              connected: !device.connected,
            }
          : device
      )
    );

    showToast('Device connection updated');
  };


  const addDemoDevice = () => {
    const newDevice: Device = {
      id: Date.now(),
      name: 'New Bluetooth Device',
      type: 'Wireless device',
      icon: Bluetooth,
      connected: true,
      paired: true,
    };

    setConnectedDevices((devices) => [
      ...devices,
      newDevice,
    ]);

    setModal('none');
    showToast('Device added successfully');
  };


  const checkForUpdates = () => {
    setIsCheckingUpdates(true);
    setUpdateChecked(false);
    window.setTimeout(() => {
      setIsCheckingUpdates(false);
      setUpdateChecked(true);
      showToast('You’re up to date');
    }, 2200);
  };


  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredSearchItems =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return [];
      }

      return SEARCH_ITEMS.filter((item) =>
        item
          .toLowerCase()
          .includes(query)
      ).slice(0, 8);
    }, [search]);


  const searchNavigate = (
    item: string
  ) => {
    const value =
      item.toLowerCase();

    if (
      value.includes('background') ||
      value.includes('color') ||
      value.includes('theme') ||
      value.includes('animation') ||
      value.includes('glass') ||
      value.includes('lock')
    ) {
      selectPage('personalization');
      return;
    }

    if (
      value.includes('display') ||
      value.includes('sound') ||
      value.includes('notification') ||
      value.includes('storage') ||
      value.includes('system')
    ) {
      selectPage('system');
      return;
    }

    if (
      value.includes('bluetooth')
    ) {
      selectPage('bluetooth');
      return;
    }

    if (
      value.includes('wi-fi') ||
      value.includes('network') ||
      value.includes('internet')
    ) {
      selectPage('network');
      return;
    }

    if (
      value.includes('app') ||
      value.includes('startup')
    ) {
      selectPage('apps');
      return;
    }

    if (
      value.includes('account') ||
      value.includes('sign-in') ||
      value.includes('your info')
    ) {
      selectPage('accounts');
      return;
    }

    if (
      value.includes('time') ||
      value.includes('language') ||
      value.includes('region')
    ) {
      selectPage('time');
      return;
    }

    if (
      value.includes('game')
    ) {
      selectPage('gaming');
      return;
    }

    if (
      value.includes('accessibility') ||
      value.includes('visual') ||
      value.includes('pointer')
    ) {
      selectPage('accessibility');
      return;
    }

    if (
      value.includes('privacy') ||
      value.includes('security')
    ) {
      selectPage('privacy');
      return;
    }

    if (
      value.includes('update')
    ) {
      selectPage('update');
    }
  };


  /* =======================================================
     LIVE BROWSER INFORMATION
  ======================================================= */

  useEffect(() => {
    const updateWindowSize = () => {
      setBrowserWidth(window.innerWidth);
      setBrowserHeight(window.innerHeight);
    };

    updateWindowSize();

    window.addEventListener(
      'resize',
      updateWindowSize
    );

    return () => {
      window.removeEventListener(
        'resize',
        updateWindowSize
      );
    };
  }, []);


  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);

    window.addEventListener(
      'online',
      online
    );

    window.addEventListener(
      'offline',
      offline
    );

    return () => {
      window.removeEventListener(
        'online',
        online
      );

      window.removeEventListener(
        'offline',
        offline
      );
    };
  }, []);


  useEffect(() => {
    const timer =
      window.setInterval(() => {
        setCurrentTime(
          new Date()
        );
      }, 1000);

    return () =>
      window.clearInterval(timer);
  }, []);


  useEffect(() => {
    const connection =
      (
        navigator as Navigator & {
          connection?: {
            effectiveType?: string;
          };
        }
      ).connection;

    if (connection?.effectiveType) {
      setNetworkType(
        connection.effectiveType
          .toUpperCase()
      );
    }
  }, []);


  useEffect(() => {
    const nav =
      navigator as Navigator & {
        getBattery?: () => Promise<{
          level: number;
          addEventListener?: (
            event: string,
            handler: () => void
          ) => void;
        }>;
      };

    if (!nav.getBattery) {
      return;
    }

    nav
      .getBattery()
      .then((battery) => {
        setBatteryLevel(
          Math.round(
            battery.level * 100
          )
        );

        const updateBattery = () => {
          setBatteryLevel(
            Math.round(
              battery.level * 100
            )
          );
        };

        battery.addEventListener?.(
          'levelchange',
          updateBattery
        );
      })
      .catch(() => {
        // Battery API unavailable.
      });
  }, []);


  /* =======================================================
     PAGE: HOME
  ======================================================= */

  const renderHome = () => {
    const activeDevices =
      connectedDevices.filter(
        (device) => device.connected
      ).length;

    return (
      <div className="space-y-7 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title="Settings"
          description="Manage your Abhishek OS workstation."
        />

        <Card className="border-sky-400/15 bg-gradient-to-br from-sky-500/[0.08] via-transparent to-violet-500/[0.08]">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Focused workspaces</div>
              <p className="mt-1 text-xs text-slate-400">Launch a polished set of apps for your next conversation or build session.</p>
            </div>
            <div className="flex gap-2">
              {([
                { mode: 'recruiter' as const, label: 'Recruiter', icon: BriefcaseBusiness },
                { mode: 'developer' as const, label: 'Developer', icon: Code2 },
              ]).map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => { activateMode(mode); showToast(`${label} workspace activated`, 'success'); }}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-semibold transition-colors ${
                    settings.workspaceMode === mode
                      ? 'border-sky-400/50 bg-sky-400/15 text-sky-200'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Card>


        {/* PROFILE HERO */}

        <Card
          className="
            overflow-hidden
            relative
            bg-gradient-to-br
            from-sky-500/[0.13]
            via-transparent
            to-purple-500/[0.10]
          "
        >
          <div
            className="
              absolute
              -top-24
              -right-24
              w-72
              h-72
              rounded-full
              blur-3xl
              opacity-20
            "
            style={{
              background: accent,
            }}
          />

          <div className="relative p-5 sm:p-6">

            <div className="flex flex-col sm:flex-row sm:items-center gap-5">

              <div className="relative shrink-0">

                <div
                  className="
                    w-[72px]
                    h-[72px]
                    rounded-full
                    overflow-hidden
                    border
                    bg-slate-900
                    shadow-2xl
                  "
                  style={{
                    borderColor:
                      `${accent}70`,
                    boxShadow:
                      `0 0 35px ${accent}25`,
                  }}
                >
                  <img
                    src="/avatar.png"
                    alt="Abhishek"
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />
                </div>

                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    w-4
                    h-4
                    rounded-full
                    bg-emerald-400
                    border-[3px]
                    border-[#202020]
                    shadow-[0_0_12px_rgba(52,211,153,.9)]
                  "
                />
              </div>


              <div className="flex-1">

                <div className="text-xl font-semibold text-white">
                  Abhishek
                </div>

                <div className="text-sm text-slate-400">
                  Local Account
                </div>

                <div className="mt-3 flex flex-wrap gap-2">

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded-full
                      bg-emerald-400/10
                      border border-emerald-400/20
                      text-[11px]
                      text-emerald-300
                    "
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded-full
                      bg-white/[0.045]
                      border border-white/[0.07]
                      text-[11px]
                      text-slate-300
                    "
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    Developer Workstation
                  </span>

                </div>

              </div>


              <div className="sm:text-right">

                <div className="text-[11px] text-slate-500">
                  BUILD
                </div>

                <div className="mt-1 text-sm font-semibold text-white">
                  Abhishek OS 2026
                </div>

                <div className="mt-1 text-[11px] text-slate-500">
                  Portfolio Edition
                </div>

              </div>

            </div>

          </div>
        </Card>


        {/* QUICK STATS */}

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">

          <MiniStat
            icon={Monitor}
            label="Display"
            value={`${browserWidth} × ${browserHeight}`}
            accent="text-sky-400"
          />

          <MiniStat
            icon={Wifi}
            label="Network"
            value={
              isOnline
                ? networkType
                : 'Offline'
            }
            accent="text-cyan-400"
          />

          <MiniStat
            icon={Bluetooth}
            label="Devices"
            value={`${activeDevices} connected`}
            accent="text-blue-400"
          />

          <MiniStat
            icon={Zap}
            label="Battery"
            value={
              batteryLevel !== null
                ? `${batteryLevel}%`
                : 'Connected'
            }
            accent="text-amber-400"
          />

        </div>


        {/* RECOMMENDED */}

        <div>

          <h2 className="text-sm font-semibold text-white mb-3">
            Recommended settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <SettingRow
              icon={Palette}
              title="Personalization"
              description="Change your background, colors, themes and visual effects."
              accent="text-purple-400"
              onClick={() =>
                selectPage(
                  'personalization'
                )
              }
            />

            <SettingRow
              icon={Monitor}
              title="System"
              description="Display, sound, notifications, storage and device information."
              accent="text-sky-400"
              onClick={() =>
                selectPage('system')
              }
            />

            <SettingRow
              icon={Bluetooth}
              title="Bluetooth & devices"
              description="Manage connected Bluetooth devices, printers and peripherals."
              accent="text-blue-400"
              onClick={() =>
                selectPage('bluetooth')
              }
            />

            <SettingRow
              icon={Wifi}
              title="Network & internet"
              description="Manage Wi-Fi, Ethernet, VPN and network settings."
              accent="text-cyan-400"
              onClick={() =>
                selectPage('network')
              }
            />

          </div>

        </div>


        {/* QUICK SETTINGS */}

        <div>

          <h2 className="text-sm font-semibold text-white mb-3">
            Quick settings
          </h2>

          <div className="space-y-2">

            <SettingRow
              icon={Sparkles}
              title="Animations"
              description={
                settings?.animationsEnabled
                  ? 'Window and menu animations are enabled.'
                  : 'Window and menu animations are disabled.'
              }
              right={
                <Toggle
                  checked={
                    !!settings?.animationsEnabled
                  }
                  onChange={() =>
                    updateSettings({
                      animationsEnabled:
                        !settings?.animationsEnabled,
                    })
                  }
                  accent={accent}
                />
              }
              accent="text-amber-400"
            />


            <SettingRow
              icon={Layers}
              title="Glass blur"
              description={
                settings?.glassBlurEnabled
                  ? 'Mica and acrylic effects are enabled.'
                  : 'Glass effects are disabled.'
              }
              right={
                <Toggle
                  checked={
                    !!settings?.glassBlurEnabled
                  }
                  onChange={() =>
                    updateSettings({
                      glassBlurEnabled:
                        !settings?.glassBlurEnabled,
                    })
                  }
                  accent={accent}
                />
              }
              accent="text-sky-400"
            />


            <SettingRow
              icon={Volume2}
              title="System sounds"
              description={
                settings?.soundsEnabled
                  ? 'System audio feedback is enabled.'
                  : 'System audio feedback is disabled.'
              }
              right={
                <Toggle
                  checked={
                    !!settings?.soundsEnabled
                  }
                  onChange={() => {
                    const next =
                      !settings?.soundsEnabled;

                    updateSettings({
                      soundsEnabled: next,
                    });

                    if (next) {
                      try {
                        playSystemSound(
                          'notify'
                        );
                      } catch {
                        // Ignore.
                      }
                    }
                  }}
                  accent={accent}
                />
              }
              accent="text-emerald-400"
            />

          </div>

        </div>

      </div>
    );
  };


  /* =======================================================
     PAGE: SYSTEM
  ======================================================= */

  const renderSystem = () => {
    return (
      <div className="space-y-6 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title="System"
          description="Display, sound, notifications, storage and workstation information."
        />


        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <SettingRow
            icon={Monitor}
            title="Display"
            description={`${browserWidth} × ${browserHeight} • Browser display`}
            accent="text-sky-400"
            onClick={() =>
              setModal('display')
            }
          />

          <SettingRow
            icon={Volume2}
            title="Sound"
            description="Output, input and volume"
            accent="text-purple-400"
            onClick={() =>
              setModal('sound')
            }
          />

          <SettingRow
            icon={Bell}
            title="Notifications"
            description={
              notificationsEnabled
                ? 'Notifications are enabled'
                : 'Notifications are disabled'
            }
            accent="text-yellow-400"
            right={
              <Toggle
                checked={
                  notificationsEnabled
                }
                onChange={() =>
                  setNotificationsEnabled(
                    (value) => !value
                  )
                }
                accent={accent}
              />
            }
          />

          <SettingRow
            icon={HardDrive}
            title="Storage"
            description="Manage storage and virtual file system"
            accent="text-emerald-400"
            onClick={() =>
              setModal('storage')
            }
          />

        </div>


        {/* DISPLAY CARD */}

        <Card className="overflow-hidden">

          <div
            className="
              p-5
              border-b
              border-white/[0.06]
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-sky-500/10
                  flex
                  items-center
                  justify-center
                "
              >
                <Laptop className="w-5 h-5 text-sky-400" />
              </div>

              <div>

                <h2 className="text-sm font-semibold text-white">
                  About this workstation
                </h2>

                <p className="text-xs text-slate-500 mt-0.5">
                  Developer Portfolio Environment
                </p>

              </div>

            </div>

            <span
              className="
                hidden
                sm:inline-flex
                px-2.5
                py-1
                rounded-full
                text-[10px]
                bg-emerald-400/10
                border border-emerald-400/20
                text-emerald-300
              "
            >
              Running
            </span>

          </div>


          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

            {[
              [
                'Device',
                deviceName,
              ],
              [
                'Architecture',
                'Full-Stack / AI',
              ],
              [
                'Framework',
                'React + Vite',
              ],
              [
                'Runtime',
                'Web Browser',
              ],
              [
                'Build',
                'Release 2026',
              ],
              [
                'Status',
                'Open to Opportunities',
              ],
            ].map(
              ([label, value]) => (
                <div
                  key={label}
                  className="
                    p-3.5
                    rounded-xl
                    bg-black/20
                    border
                    border-white/[0.05]
                  "
                >
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">
                    {label}
                  </div>

                  <div className="mt-1 text-xs text-slate-200 font-medium">
                    {value}
                  </div>
                </div>
              )
            )}

          </div>

        </Card>

      </div>
    );
  };


  /* =======================================================
     PAGE: BLUETOOTH & DEVICES
  ======================================================= */

  const renderBluetooth = () => {
    return (
      <div className="space-y-6 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title="Bluetooth & devices"
          description="Manage connected devices, Bluetooth, printers, cameras and peripherals."
        />


        {/* DEVICE GRID */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

          {connectedDevices.slice(0, 3).map(
            (device) => {
              const DeviceIcon =
                device.icon;

              return (
                <Card
                  key={device.id}
                  className="
                    p-5
                    relative
                    overflow-hidden
                    group
                    hover:bg-white/[0.045]
                    transition-all
                  "
                >

                  <button
                    type="button"
                    className="
                      absolute
                      top-3
                      right-3
                      p-1.5
                      rounded-lg
                      text-slate-500
                      hover:text-white
                      hover:bg-white/[0.07]
                    "
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>


                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-white/[0.05]
                      flex
                      items-center
                      justify-center
                      mb-4
                    "
                  >
                    <DeviceIcon
                      className="w-6 h-6 text-slate-200"
                    />
                  </div>


                  <div className="text-sm font-semibold text-white truncate pr-5">
                    {device.name}
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    {device.type}
                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      toggleDevice(
                        device.id
                      )
                    }
                    className={`
                      mt-4
                      px-4
                      py-2
                      rounded-xl
                      text-xs
                      font-medium
                      transition-all
                      ${
                        device.connected
                          ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                          : 'bg-white/[0.06] text-slate-200 border border-white/[0.08] hover:bg-white/[0.1]'
                      }
                    `}
                  >
                    {device.connected
                      ? 'Connected'
                      : 'Connect'}
                  </button>

                </Card>
              );
            }
          )}


          <button
            type="button"
            onClick={() =>
              setModal('add-device')
            }
            className="
              min-h-[210px]
              rounded-2xl
              border
              border-dashed
              border-white/[0.13]
              bg-white/[0.018]
              hover:bg-white/[0.045]
              hover:border-sky-400/30
              flex
              flex-col
              items-center
              justify-center
              transition-all
              group
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-full
                border
                border-white/[0.1]
                flex
                items-center
                justify-center
                group-hover:scale-110
                group-hover:border-sky-400/40
                transition-all
              "
            >
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-sky-400" />
            </div>

            <div className="mt-3 text-sm font-medium text-slate-200">
              Add device
            </div>

            <div className="mt-1 text-xs text-slate-500">
              Bluetooth, wireless display and more
            </div>

          </button>

        </div>


        {/* BLUETOOTH */}

        <Card>

          <div
            className="
              p-5
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-blue-500/10
                  flex
                  items-center
                  justify-center
                "
              >
                <Bluetooth className="w-5 h-5 text-blue-400" />
              </div>

              <div>

                <div className="text-sm font-semibold text-white">
                  Bluetooth
                </div>

                <div className="text-xs text-slate-500 mt-0.5">
                  Discoverable as "{deviceName}"
                </div>

              </div>

            </div>

            <Toggle
              checked={bluetoothEnabled}
              onChange={() =>
                setBluetoothEnabled(
                  (value) => !value
                )
              }
              accent={accent}
            />

          </div>

        </Card>


        {/* OTHER DEVICES */}

        <div>

          <h2 className="text-sm font-semibold text-white mb-3">
            Devices
          </h2>

          <div className="space-y-2">

            <SettingRow
              icon={Keyboard}
              title="Keyboard"
              description="USB / Bluetooth keyboard"
              accent="text-slate-300"
            />

            <SettingRow
              icon={Mouse}
              title="Mouse"
              description="Pointer and mouse settings"
              accent="text-slate-300"
            />

            <SettingRow
              icon={Printer}
              title="Printers & scanners"
              description="Manage printers and scanning devices"
              accent="text-slate-300"
            />

            <SettingRow
              icon={Camera}
              title="Cameras"
              description="Connected cameras and image settings"
              accent="text-purple-300"
            />

            <SettingRow
              icon={Smartphone}
              title="Mobile devices"
              description="Instantly access your mobile devices from your PC"
              accent="text-emerald-300"
            />

          </div>

        </div>

      </div>
    );
  };


  /* =======================================================
     PAGE: NETWORK
  ======================================================= */

  const renderNetwork = () => {
    return (
      <div className="space-y-6 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title="Network & internet"
          description="View connection status and manage your network configuration."
        />


        {/* CONNECTION HERO */}

        <Card
          className="
            overflow-hidden
            bg-gradient-to-br
            from-cyan-500/[0.10]
            via-transparent
            to-blue-500/[0.08]
          "
        >

          <div className="p-5 sm:p-6">

            <div className="flex items-center gap-4">

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-cyan-400/10
                  border border-cyan-400/20
                  flex
                  items-center
                  justify-center
                "
              >
                <Wifi className="w-7 h-7 text-cyan-400" />
              </div>

              <div className="flex-1">

                <div className="text-lg font-semibold text-white">
                  {isOnline
                    ? 'Connected'
                    : 'No internet'}
                </div>

                <div className="text-xs text-slate-400 mt-1">
                  {isOnline
                    ? `Connected through ${networkType}`
                    : 'Check your network connection'}
                </div>

              </div>

              <div
                className={`
                  w-3
                  h-3
                  rounded-full
                  ${
                    isOnline
                      ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,.9)]'
                      : 'bg-red-400'
                  }
                `}
              />

            </div>

          </div>

        </Card>


        <div className="space-y-2">

          <SettingRow
            icon={Wifi}
            title="Wi-Fi"
            description={
              wifiEnabled
                ? 'Connected • Available networks'
                : 'Wi-Fi is turned off'
            }
            right={
              <Toggle
                checked={wifiEnabled}
                onChange={() =>
                  setWifiEnabled(
                    (value) => !value
                  )
                }
                accent={accent}
              />
            }
            accent="text-cyan-400"
          />

          <SettingRow
            icon={Network}
            title="Ethernet"
            description="Manage wired network connections"
            accent="text-emerald-400"
          />

          <SettingRow
            icon={Router}
            title="Mobile hotspot"
            description="Share your internet connection with other devices"
            accent="text-blue-400"
          />

          <SettingRow
            icon={ShieldCheck}
            title="VPN"
            description="Add and manage VPN connections"
            accent="text-purple-400"
          />

          <SettingRow
            icon={SlidersHorizontal}
            title="Proxy"
            description="Use a proxy server for internet connections"
            accent="text-yellow-400"
          />

        </div>


        {/* NETWORK DETAILS */}

        <Card className="p-5">

          <div className="flex items-center gap-3 mb-5">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-white/[0.05]
                flex
                items-center
                justify-center
              "
            >
              <Globe className="w-5 h-5 text-cyan-400" />
            </div>

            <div>

              <h2 className="text-sm font-semibold text-white">
                Network properties
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Current browser connection information
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {[
              [
                'Status',
                isOnline
                  ? 'Online'
                  : 'Offline',
              ],
              [
                'Connection',
                networkType,
              ],
              [
                'Browser',
                navigator.userAgent
                  .split(' ')
                  .slice(-2)
                  .join(' '),
              ],
              [
                'Hostname',
                window.location.hostname ||
                  'localhost',
              ],
            ].map(
              ([label, value]) => (
                <div
                  key={label}
                  className="
                    p-3.5
                    rounded-xl
                    bg-black/20
                    border border-white/[0.05]
                  "
                >
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">
                    {label}
                  </div>

                  <div className="mt-1 text-xs text-slate-200 truncate">
                    {value}
                  </div>
                </div>
              )
            )}

          </div>

        </Card>

      </div>
    );
  };


  /* =======================================================
     PAGE: PERSONALIZATION
  ======================================================= */

  const renderPersonalization = () => {
    return (
      <div className="space-y-7 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title="Personalization"
          description="Background, colors, themes, lock screen and visual appearance."
        />


        {/* THEME PREVIEW */}

        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">

          <Card
            className="
              relative
              min-h-[180px]
              overflow-hidden
              group
            "
          >

            <div
              className="absolute inset-0"
              style={{
                background:
                  currentWallpaper?.style ||
                  'linear-gradient(135deg,#111827,#020617)',
              }}
            />

            <div className="absolute inset-0 bg-black/25" />

            <div
              className="
                absolute
                left-5
                top-5
                right-5
                bottom-5
                rounded-2xl
                bg-slate-950/65
                backdrop-blur-xl
                border border-white/10
                p-4
                transition-transform
                duration-500
                group-hover:scale-[1.02]
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="w-9 h-9 rounded-xl"
                  style={{
                    backgroundColor:
                      accent,
                  }}
                />

                <div className="flex-1 space-y-1.5">

                  <div className="h-1.5 w-28 rounded-full bg-white/60" />

                  <div className="h-1.5 w-20 rounded-full bg-white/20" />

                </div>

              </div>


              <div className="absolute bottom-5 left-5 right-5">

                <div className="h-1.5 w-36 rounded-full bg-white/30" />

                <div className="h-1.5 w-24 rounded-full bg-white/10 mt-2" />

              </div>

            </div>


            <div
              className="
                absolute
                bottom-3
                right-3
                px-2.5
                py-1
                rounded-lg
                bg-black/55
                backdrop-blur-md
                text-[10px]
                text-white/80
                border border-white/10
              "
            >
              Current theme
            </div>

          </Card>


          {/* WALLPAPER PREVIEWS */}

          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">System wallpaper</h3>
              <p className="mt-1 text-xs text-slate-400">Choose an image or video from your device and apply it to the desktop immediately.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-sky-300">
              <Upload className="h-4 w-4" />
              Choose image or video
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={event => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const maxSize = file.type.startsWith('video/') ? 40 * 1024 * 1024 : 8 * 1024 * 1024;
                  if (file.size > maxSize) {
                    showToast(file.type.startsWith('video/') ? 'Choose a video smaller than 40 MB' : 'Choose an image smaller than 8 MB', 'error');
                    event.target.value = '';
                    return;
                  }
                  void saveCustomWallpaper(file).then(() => {
                    if (file.type.startsWith('video/')) {
                      localStorage.removeItem('abhishek-custom-wallpaper-style');
                    } else {
                      localStorage.setItem('abhishek-custom-wallpaper-style', 'center / cover no-repeat');
                    }
                    updateSettings({ wallpaperId: 'wall-custom' });
                    window.dispatchEvent(new Event('abhishek-wallpaper-changed'));
                    showToast('Wallpaper applied to desktop', 'success');
                  }).catch(error => {
                    console.error('Unable to save custom wallpaper:', error);
                    showToast('Unable to save this wallpaper', 'error');
                  });
                  event.target.value = '';
                }}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

            {wallpapers
              .slice(0, 6)
              .map((wallpaper) => {

                const selected =
                  wallpaper.id ===
                  settings.wallpaperId;

                return (
                  <button
                    key={wallpaper.id}
                    type="button"
                    onClick={() =>
                      changeWallpaper(
                        wallpaper.id
                      )
                    }
                    className={`
                      relative
                      aspect-[1.35/1]
                      rounded-2xl
                      overflow-hidden
                      border
                      group
                      transition-all
                      ${
                        selected
                          ? 'border-sky-400 ring-2 ring-sky-400/20'
                          : 'border-white/10 hover:border-white/25'
                      }
                    `}
                  >

                    <div
                      className="
                        absolute
                        inset-0
                        transition-transform
                        duration-500
                        group-hover:scale-110
                      "
                      style={{
                        background:
                          wallpaper.style,
                      }}
                    />

                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />


                    {selected && (
                      <div className="absolute right-2 bottom-2">

                        <div
                          className="
                            w-7
                            h-7
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            shadow-xl
                          "
                          style={{
                            background:
                              accent,
                          }}
                        >
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        </div>

                      </div>
                    )}

                  </button>
                );
              })}

          </div>

        </div>


        {/* BACKGROUND */}

        <Card
          id="background-settings"
          className="p-5"
        >

          <div className="flex items-center gap-3 mb-5">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-white/[0.05]
                flex
                items-center
                justify-center
              "
            >
              <ImageIcon className="w-5 h-5 text-sky-400" />
            </div>

            <div>

              <h2 className="text-sm font-semibold text-white">
                Background
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Choose a desktop background for your workstation.
              </p>

            </div>

          </div>


          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

            {wallpapers.map(
              (wallpaper) => {

                const selected =
                  wallpaper.id ===
                  settings.wallpaperId;

                return (
                  <button
                    key={wallpaper.id}
                    type="button"
                    onClick={() =>
                      changeWallpaper(
                        wallpaper.id
                      )
                    }
                    className={`
                      relative
                      overflow-hidden
                      rounded-xl
                      border
                      text-left
                      transition-all
                      group
                      ${
                        selected
                          ? 'border-sky-400 ring-2 ring-sky-400/20'
                          : 'border-white/10 hover:border-white/25'
                      }
                    `}
                  >

                    <div
                      className="
                        h-24
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                      style={{
                        background:
                          wallpaper.style,
                      }}
                    />

                    <div
                      className="
                        px-3
                        py-2.5
                        bg-slate-900/90
                      "
                    >

                      <div className="text-xs font-medium text-slate-200 truncate">
                        {wallpaper.name}
                      </div>

                      {selected && (
                        <div className="text-[10px] text-sky-400 mt-0.5">
                          Currently selected
                        </div>
                      )}

                    </div>

                  </button>
                );
              }
            )}

          </div>

        </Card>


        {/* THEME */}

        <Card className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-white">App theme</h2>
              <p className="text-xs text-slate-500 mt-1">
                Apply the color mode across the desktop and every open window.
              </p>
            </div>
            <span className="rounded-lg border border-sky-400 bg-sky-500/20 px-3 py-2 text-xs font-semibold text-sky-300">
              Dark
            </span>
          </div>
        </Card>

        {/* COLORS */}

        <Card
          id="colors-settings"
          className="p-5"
        >

          <div className="flex items-center gap-3 mb-5">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-purple-500/10
                flex
                items-center
                justify-center
              "
            >
              <Palette className="w-5 h-5 text-purple-400" />
            </div>

            <div>

              <h2 className="text-sm font-semibold text-white">
                Colors
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Select the accent color used throughout Abhishek OS.
              </p>

            </div>

          </div>


          <div className="flex flex-wrap gap-4">

            {ACCENT_COLORS.map(
              (color) => {

                const selected =
                  settings.accentColor ===
                  color.hex;

                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() =>
                      changeAccent(
                        color.hex
                      )
                    }
                    title={color.name}
                    className={`
                      relative
                      w-11
                      h-11
                      rounded-full
                      flex
                      items-center
                      justify-center
                      transition-all
                      ${
                        selected
                          ? 'scale-110 ring-2 ring-white ring-offset-4 ring-offset-[#1b1b1b]'
                          : 'hover:scale-110'
                      }
                    `}
                    style={{
                      backgroundColor:
                        color.hex,
                    }}
                  >

                    {selected && (
                      <Check className="w-5 h-5 text-white stroke-[3]" />
                    )}

                  </button>
                );
              }
            )}

          </div>


          <div className="mt-5 flex items-center gap-3">

            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  accent,
              }}
            />

            <span className="text-xs text-slate-400">
              Current accent:
              {' '}
              <span className="text-slate-200 font-medium">
                {ACCENT_COLORS.find(
                  (item) =>
                    item.hex ===
                    settings.accentColor
                )?.name ||
                  settings.accentColor}
              </span>
            </span>

          </div>

        </Card>


        {/* VISUAL EFFECTS */}

        <Card className="p-5">

          <div className="flex items-center gap-3 mb-4">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-amber-500/10
                flex
                items-center
                justify-center
              "
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>

            <div>

              <h2 className="text-sm font-semibold text-white">
                Visual effects
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Control Windows-style visual effects.
              </p>

            </div>

          </div>


          <div className="space-y-2">

            <SettingRow
              icon={Sparkles}
              title="Animation effects"
              description="Animate windows, menus and transitions."
              right={
                <Toggle
                  checked={
                    !!settings.animationsEnabled
                  }
                  onChange={() =>
                    updateSettings({
                      animationsEnabled:
                        !settings.animationsEnabled,
                    })
                  }
                  accent={accent}
                />
              }
              accent="text-amber-400"
            />

            <SettingRow
              icon={Layers}
              title="Transparency effects"
              description="Use Mica-style transparency and blur."
              right={
                <Toggle
                  checked={transparency}
                  onChange={() => {
                    const next = !transparency;
                    setTransparency(next);
                    updateSettings({ glassBlurEnabled: next });
                  }}
                  accent={accent}
                />
              }
              accent="text-sky-400"
            />

            <SettingRow
              icon={Moon}
              title="Night light"
              description="Reduce blue light from your display."
              right={
                <Toggle
                  checked={nightLight}
                  onChange={() =>
                    setNightLight(
                      (value) => !value
                    )
                  }
                  accent={accent}
                />
              }
              accent="text-yellow-400"
            />

          </div>

        </Card>


        <button
          type="button"
          onClick={resetVisualSettings}
          className="
            w-full
            px-5
            py-4
            rounded-2xl
            border border-red-400/10
            bg-red-400/[0.025]
            hover:bg-red-400/[0.06]
            text-sm
            text-slate-300
            flex
            items-center
            justify-center
            gap-2
            transition-all
          "
        >
          <RotateCcw className="w-4 h-4" />
          Reset personalization
        </button>

      </div>
    );
  };


  /* =======================================================
     PAGE: APPS
  ======================================================= */

  const renderApps = () => {
    return (
      <div className="space-y-6 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title="Apps"
          description="Installed applications, startup behavior and app preferences."
        />


        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <SettingRow
            icon={AppWindow}
            title="Installed apps"
            description={`${installedApps.length} applications installed`}
            accent="text-indigo-400"
            onClick={() =>
              setModal('installed-app')
            }
          />

          <SettingRow
            icon={Zap}
            title="Startup"
            description="Control applications launched when Abhishek OS starts."
            accent="text-amber-400"
            onClick={() =>
              setModal('startup')
            }
          />

          <SettingRow
            icon={Download}
            title="App installation"
            description="Choose where applications can be installed."
            accent="text-emerald-400"
          />

          <SettingRow
            icon={SlidersHorizontal}
            title="Advanced app settings"
            description="Manage optional application preferences."
            accent="text-sky-400"
          />

        </div>


        <Card className="overflow-hidden">

          <div className="p-5 border-b border-white/[0.06]">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-sm font-semibold text-white">
                  Recently installed
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Applications available on this workstation
                </p>

              </div>

              <AppWindow className="w-5 h-5 text-indigo-400" />

            </div>

          </div>


          <div className="divide-y divide-white/[0.05]">

            {installedApps.slice(0, 5).map(
              (app) => {

                const AppIcon =
                  app.icon;

                return (
                  <button
                    type="button"
                    key={app.id}
                    onClick={() =>
                      setModal(
                        'installed-app'
                      )
                    }
                    className="
                      w-full
                      p-4
                      flex
                      items-center
                      gap-4
                      text-left
                      hover:bg-white/[0.035]
                      transition-colors
                    "
                  >

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-white/[0.05]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <AppIcon className="w-5 h-5 text-slate-200" />
                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="text-sm font-medium text-white">
                        {app.name}
                      </div>

                      <div className="text-xs text-slate-500 mt-0.5">
                        {app.publisher} • v{app.version}
                      </div>

                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500" />

                  </button>
                );
              }
            )}

          </div>

        </Card>

      </div>
    );
  };


  /* =======================================================
     PAGE: ACCOUNTS
  ======================================================= */

  const renderAccounts = () => {
    return (
      <div className="space-y-6 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title="Accounts"
          description="Manage your workstation account and sign-in options."
        />


        <Card className="p-5">

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            <div
              className="
                w-16
                h-16
                rounded-full
                overflow-hidden
                border border-white/10
                bg-slate-900
              "
            >
              <img
                src="/avatar.png"
                alt="Abhishek"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />
            </div>

            <div className="flex-1">

              <div className="text-xl font-semibold text-white">
                Abhishek
              </div>

              <div className="text-sm text-slate-400">
                Local Account
              </div>

              <div className="mt-2 text-xs text-emerald-300">
                Administrator access
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                showToast(
                  'Account information opened',
                  'info'
                )
              }
              className="
                px-4
                py-2.5
                rounded-xl
                bg-white/[0.06]
                border border-white/[0.08]
                text-xs
                text-slate-200
                hover:bg-white/[0.1]
                transition-all
              "
            >
              Manage account
            </button>

          </div>

        </Card>


        <div className="space-y-2">

          <SettingRow
            icon={UserRound}
            title="Your info"
            description="Profile picture, account name and account type"
            accent="text-emerald-400"
          />

          <SettingRow
            icon={KeyRound}
            title="Sign-in options"
            description="Password, PIN and authentication settings"
            accent="text-blue-400"
            onClick={() =>
              setModal('sign-in')
            }
          />

          <SettingRow
            icon={Users}
            title="Family & other users"
            description="Manage other users on this workstation"
            accent="text-purple-400"
          />

          <SettingRow
            icon={Database}
            title="Windows backup"
            description="Back up your files and settings"
            accent="text-cyan-400"
          />

        </div>

      </div>
    );
  };


  /* =======================================================
     PAGE: TIME & LANGUAGE
  ======================================================= */

  const renderTime = () => {
    return (
      <div className="space-y-6 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title="Time & language"
          description="Language, region, date, time and typing preferences."
        />


        <Card
          className="
            p-5
            bg-gradient-to-br
            from-yellow-500/[0.08]
            via-transparent
            to-orange-500/[0.06]
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-yellow-400/10
                flex
                items-center
                justify-center
              "
            >
              <Clock3 className="w-7 h-7 text-yellow-400" />
            </div>

            <div>

              <div className="text-2xl font-semibold text-white">
                {currentTime.toLocaleTimeString(
                  [],
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )}
              </div>

              <div className="text-xs text-slate-400 mt-1">
                {currentTime.toLocaleDateString(
                  [],
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </div>

            </div>

          </div>

        </Card>


        <div className="space-y-2">

          <SettingRow
            icon={Clock3}
            title="Date & time"
            description="Set time zone, clock and automatic time settings"
            accent="text-yellow-400"
            onClick={() =>
              setModal('datetime')
            }
          />

          <SettingRow
            icon={Languages}
            title="Language & region"
            description="Windows display language, region and regional format"
            accent="text-blue-400"
            onClick={() =>
              setModal('language')
            }
          />

          <SettingRow
            icon={Keyboard}
            title="Typing"
            description="Touch keyboard, text suggestions and autocorrect"
            accent="text-purple-400"
          />

          <SettingRow
            icon={Globe}
            title="Speech"
            description="Speech recognition and voice typing"
            accent="text-cyan-400"
          />

        </div>

      </div>
    );
  };


  /* =======================================================
     PAGE: GAMING
  ======================================================= */

  const renderGaming = () => {
    return (
      <div className="space-y-6 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title="Gaming"
          description="Game Mode, performance and interactive experience preferences."
        />


        <Card
          className="
            p-5
            overflow-hidden
            relative
            bg-gradient-to-br
            from-red-500/[0.10]
            via-transparent
            to-purple-500/[0.08]
          "
        >

          <div
            className="
              absolute
              -right-10
              -top-10
              w-40
              h-40
              rounded-full
              bg-red-500/10
              blur-3xl
            "
          />

          <div className="relative flex items-center gap-4">

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-red-500/10
                flex
                items-center
                justify-center
              "
            >
              <Gamepad className="w-7 h-7 text-red-400" />
            </div>

            <div className="flex-1">

              <div className="text-lg font-semibold text-white">
                Game Mode
              </div>

              <div className="text-xs text-slate-400 mt-1">
                Optimize your workstation for games and interactive experiences.
              </div>

            </div>

            <Toggle
              checked={gameMode}
              onChange={() =>
                setGameMode(
                  (value) => !value
                )
              }
              accent="#f43f5e"
            />

          </div>

        </Card>


        <div className="space-y-2">

          <SettingRow
            icon={Gamepad2}
            title="Game Bar"
            description="Capture screenshots, recordings and game activity"
            accent="text-red-400"
          />

          <SettingRow
            icon={Monitor}
            title="Captures"
            description="Configure screen recording and captured media"
            accent="text-purple-400"
          />

          <SettingRow
            icon={Rocket}
            title="Game performance"
            description="Optimize performance for foreground applications"
            accent="text-amber-400"
          />

          <SettingRow
            icon={MonitorCog}
            title="Graphics"
            description="Configure application graphics preferences"
            accent="text-sky-400"
          />

        </div>

      </div>
    );
  };


  /* =======================================================
     PAGE: ACCESSIBILITY
  ======================================================= */

  const renderAccessibility = () => {
    return (
      <div className="space-y-6 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title="Accessibility"
          description="Make Abhishek OS easier to see, hear and interact with."
        />


        <Card className="p-5">

          <div className="flex items-center gap-4">

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-blue-500/10
                flex
                items-center
                justify-center
              "
            >
              <AccessibilityIcon className="w-7 h-7 text-blue-400" />
            </div>

            <div>

              <div className="text-lg font-semibold text-white">
                Accessibility
              </div>

              <div className="text-xs text-slate-400 mt-1">
                Personalize how you interact with your workstation.
              </div>

            </div>

          </div>

        </Card>


        <div className="space-y-2">

          <SettingRow
            icon={Eye}
            title="Visual effects"
            description="Animation, transparency and visual appearance"
            accent="text-blue-300"
            right={
              <Toggle
                checked={
                  !!settings.animationsEnabled
                }
                onChange={() =>
                  updateSettings({
                    animationsEnabled:
                      !settings.animationsEnabled,
                  })
                }
                accent={accent}
              />
            }
          />

          <SettingRow
            icon={SlidersHorizontal}
            title="Text size"
            description={
              largeText
                ? 'Larger text is enabled'
                : 'Standard text size'
            }
            accent="text-purple-400"
            right={
              <Toggle
                checked={largeText}
                onChange={() =>
                  setLargeText(
                    (value) => !value
                  )
                }
                accent={accent}
              />
            }
          />

          <SettingRow
            icon={MousePointer2}
            title="Mouse pointer"
            description={
              pointerTrails
                ? 'Pointer trails enabled'
                : 'Standard pointer behavior'
            }
            accent="text-cyan-400"
            right={
              <Toggle
                checked={pointerTrails}
                onChange={() =>
                  setPointerTrails(
                    (value) => !value
                  )
                }
                accent={accent}
              />
            }
          />

          <SettingRow
            icon={Volume2}
            title="Audio"
            description="Mono audio and audio accessibility options"
            accent="text-emerald-400"
          />

          <SettingRow
            icon={Keyboard}
            title="Keyboard"
            description="Sticky Keys, Filter Keys and keyboard interaction"
            accent="text-yellow-400"
          />

        </div>

      </div>
    );
  };


  /* =======================================================
     PAGE: PRIVACY
  ======================================================= */

  const renderPrivacy = () => {
    return (
      <div className="space-y-6 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title="Privacy & security"
          description="Control privacy permissions and review workstation security."
        />


        {/* SECURITY STATUS */}

        <Card
          className="
            p-5
            bg-gradient-to-br
            from-emerald-500/[0.09]
            via-transparent
            to-cyan-500/[0.06]
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-emerald-400/10
                flex
                items-center
                justify-center
              "
            >
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>

            <div className="flex-1">

              <div className="text-lg font-semibold text-white">
                Security status
              </div>

              <div className="text-xs text-emerald-300 mt-1">
                Your workstation is protected
              </div>

            </div>

            <CircleCheck className="w-6 h-6 text-emerald-400" />

          </div>

        </Card>


        <div className="space-y-2">

          <SettingRow
            icon={ShieldCheck}
            title="Windows Security"
            description="Virus protection, firewall and device security"
            accent="text-emerald-400"
            onClick={() =>
              setModal('security')
            }
          />

          <SettingRow
            icon={MapPin}
            title="Location"
            description={
              privacyLocation
                ? 'Location permission enabled'
                : 'Location permission disabled'
            }
            accent="text-cyan-400"
            right={
              <Toggle
                checked={privacyLocation}
                onChange={() =>
                  setPrivacyLocation(
                    (value) => !value
                  )
                }
                accent={accent}
              />
            }
          />

          <SettingRow
            icon={Camera}
            title="Camera"
            description={
              privacyCamera
                ? 'Camera access allowed'
                : 'Camera access blocked'
            }
            accent="text-purple-400"
            right={
              <Toggle
                checked={privacyCamera}
                onChange={() =>
                  setPrivacyCamera(
                    (value) => !value
                  )
                }
                accent={accent}
              />
            }
          />

          <SettingRow
            icon={Volume2}
            title="Microphone"
            description={
              privacyMicrophone
                ? 'Microphone access allowed'
                : 'Microphone access blocked'
            }
            accent="text-yellow-400"
            right={
              <Toggle
                checked={privacyMicrophone}
                onChange={() =>
                  setPrivacyMicrophone(
                    (value) => !value
                  )
                }
                accent={accent}
              />
            }
          />

          <SettingRow
            icon={Lock}
            title="Privacy dashboard"
            description="Review permissions and recent activity"
            accent="text-slate-300"
            onClick={() =>
              setModal('privacy')
            }
          />

        </div>

      </div>
    );
  };


  /* =======================================================
     PAGE: WINDOWS UPDATE
  ======================================================= */

  const renderUpdate = () => {
    return (
      <div className="space-y-6 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title="Windows Update"
          description="Keep Abhishek OS up to date with the latest portfolio build."
        />


        <Card
          className="
            p-5
            sm:p-6
            overflow-hidden
            relative
            bg-gradient-to-br
            from-cyan-500/[0.10]
            via-transparent
            to-blue-500/[0.08]
          "
        >

          <div
            className="
              absolute
              -right-20
              -top-20
              w-64
              h-64
              rounded-full
              bg-cyan-400/10
              blur-3xl
            "
          />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">

            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                ${
                  isCheckingUpdates
                    ? 'animate-spin'
                    : ''
                }
              `}
              style={{
                background:
                  `${accent}15`,
              }}
            >
              <RefreshCw
                className="w-8 h-8"
                style={{
                  color: accent,
                }}
              />
            </div>

            <div className="flex-1">

              <div className="text-xl font-semibold text-white">
                {isCheckingUpdates
                  ? 'Checking for updates...'
                  : updateChecked
                    ? "You're up to date"
                    : 'Updates available to check'}
              </div>

              <div className="text-xs text-slate-400 mt-1">
                Last checked just now • Abhishek OS Build 2026
              </div>

            </div>

            <button
              type="button"
              disabled={
                isCheckingUpdates
              }
              onClick={checkForUpdates}
              className="
                px-5
                py-3
                rounded-xl
                text-xs
                font-semibold
                text-white
                disabled:opacity-50
                transition-all
                hover:brightness-110
                active:scale-95
              "
              style={{
                background:
                  accent,
                boxShadow:
                  `0 0 25px ${accent}25`,
              }}
            >
              {isCheckingUpdates
                ? 'Checking...'
                : 'Check for updates'}
            </button>

          </div>

        </Card>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <SettingRow
            icon={RefreshCw}
            title="Update history"
            description="View previously installed updates"
            accent="text-cyan-400"
          />

          <SettingRow
            icon={Timer}
            title="Active hours"
            description="Choose when this workstation is normally in use"
            accent="text-yellow-400"
          />

          <SettingRow
            icon={Download}
            title="Advanced options"
            description="Additional update and restart options"
            accent="text-purple-400"
          />

          <SettingRow
            icon={ShieldCheck}
            title="Windows Insider"
            description="Explore preview builds and developer features"
            accent="text-emerald-400"
          />

        </div>


        <Card className="p-5">

          <div className="flex items-center gap-3 mb-5">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-white/[0.05]
                flex
                items-center
                justify-center
              "
            >
              <Info className="w-5 h-5 text-sky-400" />
            </div>

            <div>

              <h2 className="text-sm font-semibold text-white">
                About updates
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Portfolio environment update channel
              </p>

            </div>

          </div>


          <div className="space-y-3">

            {[
              [
                'Current build',
                '2026.09',
              ],
              [
                'Release channel',
                'Stable',
              ],
              [
                'Update status',
                updateChecked
                  ? 'Checked just now'
                  : 'Ready to check',
              ],
            ].map(
              ([label, value]) => (
                <div
                  key={label}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    py-2
                    border-b
                    border-white/[0.05]
                    last:border-0
                  "
                >

                  <span className="text-xs text-slate-500">
                    {label}
                  </span>

                  <span className="text-xs text-slate-200">
                    {value}
                  </span>

                </div>
              )
            )}

          </div>

        </Card>

      </div>
    );
  };


  /* =======================================================
     GENERIC FALLBACK
  ======================================================= */

  const renderFallback = (
    page: SettingsPage
  ) => {

    const item =
      NAV_ITEMS.find(
        (nav) =>
          nav.id === page
      );

    const Icon =
      item?.icon || Info;

    return (
      <div className="space-y-6 animate-[settingsFade_.3s_ease-out]">

        <SectionHeader
          title={
            item?.label ||
            'Settings'
          }
          description="Manage your Abhishek OS workstation."
        />

        <Card className="p-6">

          <div className="flex items-center gap-4">

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-white/[0.05]
                flex
                items-center
                justify-center
              "
            >
              <Icon className="w-6 h-6 text-sky-400" />
            </div>

            <div>

              <div className="text-sm font-semibold text-white">
                {item?.label}
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Settings for this section are available here.
              </p>

            </div>

          </div>

        </Card>

      </div>
    );
  };


  /* =======================================================
     CONTENT SWITCHER
  ======================================================= */

  const renderContent = () => {

    switch (activePage) {

      case 'home':
        return renderHome();

      case 'system':
        return renderSystem();

      case 'bluetooth':
        return renderBluetooth();

      case 'network':
        return renderNetwork();

      case 'personalization':
        return renderPersonalization();

      case 'apps':
        return renderApps();

      case 'accounts':
        return renderAccounts();

      case 'time':
        return renderTime();

      case 'gaming':
        return renderGaming();

      case 'accessibility':
        return renderAccessibility();

      case 'privacy':
        return renderPrivacy();

      case 'update':
        return renderUpdate();

      default:
        return renderFallback(
          activePage
        );
    }
  };


  /* =======================================================
     ACTIVE NAV
  ======================================================= */

  const activeNav =
    NAV_ITEMS.find(
      (item) =>
        item.id === activePage
    );


  /* =======================================================
     MODALS
  ======================================================= */

  const renderModal = () => {

    if (modal === 'none') {
      return null;
    }


    const close = () =>
      setModal('none');


    return (
      <div
        className="
          fixed
          inset-0
          z-[100]
          flex
          items-center
          justify-center
          p-4
          bg-black/55
          backdrop-blur-sm
          animate-[settingsFade_.2s_ease-out]
        "
        onMouseDown={(event) => {
          if (
            event.target ===
            event.currentTarget
          ) {
            close();
          }
        }}
      >

        <div
          className="
            w-full
            max-w-[520px]
            max-h-[85vh]
            overflow-y-auto
            rounded-3xl
            bg-[#252525]
            border border-white/[0.10]
            shadow-[0_30px_100px_rgba(0,0,0,.55)]
          "
        >

          {/* MODAL HEADER */}

          <div
            className="
              p-5
              border-b
              border-white/[0.07]
              flex
              items-center
              justify-between
            "
          >

            <div>

              <div className="text-lg font-semibold text-white">
                {modal === 'add-device' &&
                  'Add a device'}

                {modal === 'display' &&
                  'Display'}

                {modal === 'sound' &&
                  'Sound'}

                {modal === 'storage' &&
                  'Storage'}

                {modal === 'installed-app' &&
                  'Installed apps'}

                {modal === 'startup' &&
                  'Startup apps'}

                {modal === 'sign-in' &&
                  'Sign-in options'}

                {modal === 'datetime' &&
                  'Date & time'}

                {modal === 'language' &&
                  'Language & region'}

                {modal === 'security' &&
                  'Windows Security'}

                {modal === 'privacy' &&
                  'Privacy dashboard'}
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Abhishek OS
              </div>

            </div>

            <button
              type="button"
              onClick={close}
              className="
                w-9
                h-9
                rounded-xl
                flex
                items-center
                justify-center
                text-slate-400
                hover:text-white
                hover:bg-white/[0.07]
                transition-all
              "
            >
              <X className="w-4 h-4" />
            </button>

          </div>


          {/* ADD DEVICE */}

          {modal === 'add-device' && (
            <div className="p-5 space-y-3">

              <button
                type="button"
                onClick={addDemoDevice}
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-white/[0.035]
                  border border-white/[0.07]
                  hover:bg-white/[0.07]
                  text-left
                  flex
                  items-center
                  gap-4
                  transition-all
                "
              >

                <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Bluetooth className="w-5 h-5 text-blue-400" />
                </div>

                <div className="flex-1">

                  <div className="text-sm font-medium text-white">
                    Bluetooth device
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    Mouse, keyboard, headphones or other devices
                  </div>

                </div>

                <ChevronRight className="w-4 h-4 text-slate-500" />

              </button>


              <button
                type="button"
                onClick={addDemoDevice}
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-white/[0.035]
                  border border-white/[0.07]
                  hover:bg-white/[0.07]
                  text-left
                  flex
                  items-center
                  gap-4
                  transition-all
                "
              >

                <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-sky-400" />
                </div>

                <div className="flex-1">

                  <div className="text-sm font-medium text-white">
                    Wireless display or dock
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    Connect a wireless display
                  </div>

                </div>

                <ChevronRight className="w-4 h-4 text-slate-500" />

              </button>

            </div>
          )}


          {/* DISPLAY */}

          {modal === 'display' && (
            <div className="p-5 space-y-4">

              <MiniStat
                icon={Monitor}
                label="Resolution"
                value={`${browserWidth} × ${browserHeight}`}
                accent="text-sky-400"
              />

              <SettingRow
                icon={Sun}
                title="Brightness"
                description="Browser cannot directly control physical display brightness."
                right={
                  <span className="text-xs text-slate-400">
                    100%
                  </span>
                }
              />

              <SettingRow
                icon={Layers}
                title="Scale"
                description="Interface scaling"
                right={
                  <span className="text-xs text-slate-300">
                    100%
                  </span>
                }
              />

              <SettingRow
                icon={Monitor}
                title="Multiple displays"
                description="Manage connected monitors"
              />

            </div>
          )}


          {/* SOUND */}

          {modal === 'sound' && (
            <div className="p-5 space-y-3">

              <SettingRow
                icon={Volume2}
                title="Output"
                description="Default audio output device"
                right={
                  <span className="text-xs text-emerald-300">
                    Available
                  </span>
                }
                accent="text-purple-400"
              />

              <SettingRow
                icon={MonitorSpeaker}
                title="Input"
                description="Default microphone device"
                right={
                  <span className="text-xs text-emerald-300">
                    Available
                  </span>
                }
                accent="text-cyan-400"
              />

              <SettingRow
                icon={SlidersHorizontal}
                title="Volume mixer"
                description="Adjust app and system volume"
                accent="text-amber-400"
              />

            </div>
          )}


          {/* STORAGE */}

          {modal === 'storage' && (
            <div className="p-5 space-y-5">

              <div>

                <div className="flex justify-between text-xs mb-2">

                  <span className="text-slate-400">
                    Storage used
                  </span>

                  <span className="text-white">
                    286 GB / 512 GB
                  </span>

                </div>

                <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">

                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '56%',
                      background:
                        accent,
                    }}
                  />

                </div>

              </div>


              {[
                [
                  HardDrive,
                  'Applications',
                  '86 GB',
                ],
                [
                  ImageIcon,
                  'Pictures & media',
                  '64 GB',
                ],
                [
                  Download,
                  'Downloads',
                  '28 GB',
                ],
                [
                  Database,
                  'System & other',
                  '108 GB',
                ],
              ].map(
                ([Icon, name, value]) => {

                  const ItemIcon =
                    Icon as React.ElementType;

                  return (
                    <div
                      key={name as string}
                      className="
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-xl
                        bg-white/[0.035]
                      "
                    >

                      <ItemIcon className="w-4 h-4 text-slate-400" />

                      <span className="flex-1 text-xs text-slate-300">
                        {name as string}
                      </span>

                      <span className="text-xs text-slate-500">
                        {value as string}
                      </span>

                    </div>
                  );
                }
              )}

            </div>
          )}


          {/* INSTALLED APPS */}

          {modal === 'installed-app' && (
            <div className="p-5 space-y-2">

              {installedApps.map(
                (app) => {

                  const AppIcon =
                    app.icon;

                  return (
                    <div
                      key={app.id}
                      className="
                        p-3
                        rounded-xl
                        bg-white/[0.035]
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center">
                        <AppIcon className="w-4 h-4 text-slate-300" />
                      </div>

                      <div className="flex-1">

                        <div className="text-xs font-medium text-white">
                          {app.name}
                        </div>

                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {app.publisher} • v{app.version}
                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          showToast(
                            `${app.name} selected`,
                            'info'
                          )
                        }
                        className="
                          px-3
                          py-1.5
                          rounded-lg
                          bg-white/[0.05]
                          text-[10px]
                          text-slate-300
                        "
                      >
                        Options
                      </button>

                    </div>
                  );
                }
              )}

            </div>
          )}


          {/* STARTUP */}

          {modal === 'startup' && (
            <div className="p-5 space-y-2">

              {installedApps.map(
                (app) => {

                  const AppIcon =
                    app.icon;

                  return (
                    <div
                      key={app.id}
                      className="
                        p-3
                        rounded-xl
                        bg-white/[0.035]
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <AppIcon className="w-5 h-5 text-slate-300" />

                      <div className="flex-1">

                        <div className="text-xs font-medium text-white">
                          {app.name}
                        </div>

                        <div className="text-[10px] text-slate-500">
                          Startup application
                        </div>

                      </div>

                      <Toggle
                        checked={app.startup}
                        onChange={() =>
                          showToast(
                            'Startup preference updated'
                          )
                        }
                        accent={accent}
                      />

                    </div>
                  );
                }
              )}

            </div>
          )}


          {/* SIGN IN */}

          {modal === 'sign-in' && (
            <div className="p-5 space-y-2">

              <SettingRow
                icon={KeyRound}
                title="Password"
                description="Password for your local account"
                accent="text-blue-400"
              />

              <SettingRow
                icon={Lock}
                title="PIN"
                description="Use a PIN to sign in faster"
                accent="text-purple-400"
              />

              <SettingRow
                icon={Eye}
                title="Windows Hello"
                description="Biometric and face authentication"
                accent="text-emerald-400"
              />

            </div>
          )}


          {/* DATE TIME */}

          {modal === 'datetime' && (
            <div className="p-5 space-y-3">

              <div
                className="
                  p-5
                  rounded-2xl
                  bg-black/20
                  border border-white/[0.05]
                  text-center
                "
              >

                <Clock3 className="w-7 h-7 text-yellow-400 mx-auto" />

                <div className="mt-3 text-3xl font-semibold text-white">
                  {currentTime.toLocaleTimeString()}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>

              </div>

              <SettingRow
                icon={RefreshCw}
                title="Set time automatically"
                description="Use browser and system time"
                right={
                  <Toggle
                    checked
                    onChange={() =>
                      showToast(
                        'Automatic time is enabled'
                      )
                    }
                    accent={accent}
                  />
                }
              />

            </div>
          )}


          {/* LANGUAGE */}

          {modal === 'language' && (
            <div className="p-5 space-y-2">

              <SettingRow
                icon={Languages}
                title="Windows display language"
                description="English (India)"
                accent="text-blue-400"
              />

              <SettingRow
                icon={Globe}
                title="Country or region"
                description="India"
                accent="text-emerald-400"
              />

              <SettingRow
                icon={Clock3}
                title="Regional format"
                description="English (India)"
                accent="text-yellow-400"
              />

              <SettingRow
                icon={Keyboard}
                title="Preferred keyboard"
                description="English keyboard"
                accent="text-purple-400"
              />

            </div>
          )}


          {/* SECURITY */}

          {modal === 'security' && (
            <div className="p-5 space-y-3">

              {[
                [
                  Shield,
                  'Virus & threat protection',
                  'Protected',
                ],
                [
                  Wifi,
                  'Firewall & network protection',
                  'Protected',
                ],
                [
                  KeyRound,
                  'Account protection',
                  'Protected',
                ],
                [
                  Monitor,
                  'Device security',
                  'Protected',
                ],
              ].map(
                ([Icon, title, status]) => {

                  const ItemIcon =
                    Icon as React.ElementType;

                  return (
                    <div
                      key={title as string}
                      className="
                        p-4
                        rounded-2xl
                        bg-emerald-400/[0.035]
                        border border-emerald-400/[0.08]
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <ItemIcon className="w-5 h-5 text-emerald-400" />

                      <div className="flex-1">

                        <div className="text-xs font-medium text-white">
                          {title as string}
                        </div>

                        <div className="text-[10px] text-emerald-300 mt-1">
                          {status as string}
                        </div>

                      </div>

                      <CircleCheck className="w-4 h-4 text-emerald-400" />

                    </div>
                  );
                }
              )}

            </div>
          )}


          {/* PRIVACY */}

          {modal === 'privacy' && (
            <div className="p-5 space-y-2">

              <SettingRow
                icon={MapPin}
                title="Location"
                description="Recent location permission activity"
                accent="text-cyan-400"
              />

              <SettingRow
                icon={Camera}
                title="Camera"
                description="Recent camera permission activity"
                accent="text-purple-400"
              />

              <SettingRow
                icon={Volume2}
                title="Microphone"
                description="Recent microphone permission activity"
                accent="text-yellow-400"
              />

              <SettingRow
                icon={ShieldCheck}
                title="Security activity"
                description="No suspicious activity detected"
                accent="text-emerald-400"
              />

            </div>
          )}

        </div>

      </div>
    );
  };


  /* =======================================================
     SIDEBAR
  ======================================================= */

  const renderSidebar = () => {
    return (
      <aside
        className="
          hidden
          lg:flex
          w-[250px]
          xl:w-[275px]
          shrink-0
          flex-col
          bg-[#202020]
          border-r border-white/[0.06]
        "
      >

        {/* PROFILE */}

        <div className="px-4 pt-5 pb-4">

          <button
            type="button"
            onClick={() =>
              selectPage('home')
            }
            className="
              flex
              items-center
              gap-3
              w-full
              text-left
              rounded-xl
              p-2
              hover:bg-white/[0.05]
              transition-colors
            "
          >

            <div
              className="
                relative
                w-10
                h-10
                rounded-full
                overflow-hidden
                bg-black/40
                border
                border-white/10
                shadow-lg
                shrink-0
              "
              style={{
                boxShadow:
                  `0 0 20px ${accent}20`,
              }}
            >

              <img
                src="/avatar.png"
                alt="Abhishek"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

              <span
                className="
                  absolute
                  bottom-0
                  right-0
                  w-2.5
                  h-2.5
                  rounded-full
                  bg-emerald-400
                  border-2
                  border-slate-900
                "
              />

            </div>

            <div className="min-w-0">

              <div className="text-[14px] font-semibold text-white">
                Abhishek
              </div>

              <div className="text-[11px] text-slate-400">
                Local Account
              </div>

            </div>

          </button>

        </div>


        {/* NAV */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            pb-4
            space-y-1
            scrollbar-thin
          "
        >

          {NAV_ITEMS.map(
            (item) => {

              const Icon =
                item.icon;

              const active =
                activePage ===
                item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    selectPage(
                      item.id
                    )
                  }
                  className={`
                    relative
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    rounded-xl
                    text-left
                    transition-all
                    duration-200
                    group
                    ${
                      active
                        ? 'bg-white/[0.09] text-white shadow-[inset_0_0_20px_rgba(255,255,255,.02)]'
                        : 'text-slate-300 hover:bg-white/[0.055] hover:text-white'
                    }
                  `}
                >

                  {active && (
                    <span
                      className="
                        absolute
                        left-0
                        top-1/2
                        -translate-y-1/2
                        w-[3px]
                        h-6
                        rounded-r-full
                      "
                      style={{
                        background:
                          accent,
                        boxShadow:
                          `0 0 12px ${accent}`,
                      }}
                    />
                  )}

                  <Icon
                    className={`
                      w-[19px]
                      h-[19px]
                      shrink-0
                      ${item.color}
                      ${
                        active
                          ? 'scale-110'
                          : 'group-hover:scale-110'
                      }
                      transition-transform
                    `}
                  />

                  <span className="text-[13px] font-medium truncate">
                    {item.label}
                  </span>

                </button>
              );
            }
          )}

        </nav>


        {/* FOOTER */}

        <div className="p-3 border-t border-white/[0.06]">

          <div
            className="
              p-3
              rounded-xl
              bg-white/[0.035]
              border border-white/[0.05]
            "
          >

            <div className="flex items-center gap-2">

              <div className="relative">

                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

              </div>

              <span className="text-[11px] text-slate-300">
                Workstation online
              </span>

            </div>

            <div className="text-[10px] text-slate-500 mt-1">
              Abhishek OS • Build 2026
            </div>

          </div>

        </div>

      </aside>
    );
  };


  /* =======================================================
     HEADER
  ======================================================= */

  const renderHeader = () => {
    return (
      <header
        className="
          h-[60px]
          shrink-0
          px-3
          sm:px-5
          flex
          items-center
          gap-3
          border-b
          border-white/[0.06]
          bg-[#1b1b1b]/95
          backdrop-blur-2xl
          relative
          z-50
        "
      >

        {/* MOBILE BACK */}

        <button
          type="button"
          onClick={() =>
            selectPage('home')
          }
          className="
            lg:hidden
            w-9
            h-9
            rounded-xl
            flex
            items-center
            justify-center
            text-slate-400
            hover:text-white
            hover:bg-white/[0.06]
            transition-colors
          "
        >
          <ArrowLeft className="w-4 h-4" />
        </button>


        {/* SEARCH */}

        <div
          className={`
            relative
            flex-1
            max-w-[600px]
            mx-auto
            transition-all
            duration-200
            ${
              isSearchFocused
                ? 'scale-[1.01]'
                : ''
            }
          `}
        >

          <Search
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              w-4
              h-4
              text-slate-500
              pointer-events-none
            "
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            onFocus={() =>
              setIsSearchFocused(true)
            }
            onBlur={() =>
              window.setTimeout(
                () =>
                  setIsSearchFocused(
                    false
                  ),
                150
              )
            }
            onKeyDown={(event) => {

              if (
                event.key ===
                  'Enter' &&
                filteredSearchItems[0]
              ) {
                searchNavigate(
                  filteredSearchItems[0]
                );
              }

              if (
                event.key ===
                'Escape'
              ) {
                setSearch('');
              }

            }}
            placeholder="Find a setting"
            className="
              w-full
              h-10
              rounded-full
              bg-white/[0.025]
              border border-white/[0.10]
              pl-11
              pr-4
              text-[13px]
              text-slate-200
              placeholder:text-slate-500
              outline-none
              focus:border-sky-400/60
              focus:bg-white/[0.045]
              transition-all
            "
          />


          {/* SEARCH RESULTS */}

          {search &&
            filteredSearchItems.length >
              0 && (

              <div
                className="
                  absolute
                  top-12
                  left-0
                  right-0
                  z-[80]
                  rounded-2xl
                  overflow-hidden
                  bg-[#252525]
                  border border-white/[0.10]
                  shadow-2xl
                  p-1.5
                "
              >

                {filteredSearchItems.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        searchNavigate(
                          item
                        );
                      }}
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-2.5
                        rounded-xl
                        text-left
                        text-xs
                        text-slate-300
                        hover:bg-white/[0.07]
                        hover:text-white
                        transition-colors
                      "
                    >

                      <Search className="w-3.5 h-3.5 text-slate-500" />

                      <span className="flex-1">
                        {item}
                      </span>

                      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

                    </button>
                  )
                )}

              </div>
            )}

        </div>


        {/* CURRENT PAGE */}

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">

          {activeNav && (
            <>
              {(() => {

                const ActiveIcon =
                  activeNav.icon;

                return (
                  <ActiveIcon
                    className="w-4 h-4"
                  />
                );

              })()}

              <span className="hidden xl:block">
                {activeNav.label}
              </span>

            </>
          )}

        </div>

      </header>
    );
  };


  /* =======================================================
     MOBILE NAV
  ======================================================= */

  const renderMobileNav = () => {

    const mobileItems =
      [
        'home',
        'system',
        'bluetooth',
        'network',
        'personalization',
      ] as SettingsPage[];

    return (
      <div
        className="
          lg:hidden
          fixed
          left-3
          right-3
          bottom-3
          z-[90]
          h-[62px]
          rounded-2xl
          bg-[#252525]/95
          backdrop-blur-2xl
          border border-white/[0.10]
          shadow-[0_20px_50px_rgba(0,0,0,.45)]
          flex
          items-center
          justify-around
          px-2
        "
      >

        {mobileItems.map(
          (page) => {

            const item =
              NAV_ITEMS.find(
                (nav) =>
                  nav.id === page
              );

            if (!item) {
              return null;
            }

            const Icon =
              item.icon;

            const active =
              activePage ===
              item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  selectPage(
                    item.id
                  )
                }
                className={`
                  relative
                  w-12
                  h-11
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  transition-all
                  ${
                    active
                      ? 'bg-white/[0.09]'
                      : 'hover:bg-white/[0.05]'
                  }
                `}
              >

                <Icon
                  className={`
                    w-5
                    h-5
                    ${item.color}
                    ${
                      active
                        ? 'scale-110'
                        : ''
                    }
                    transition-transform
                  `}
                />

                {active && (
                  <span
                    className="
                      absolute
                      bottom-1
                      w-1.5
                      h-1.5
                      rounded-full
                    "
                    style={{
                      background:
                        accent,
                      boxShadow:
                        `0 0 8px ${accent}`,
                    }}
                  />
                )}

              </button>
            );
          }
        )}

      </div>
    );
  };


  /* =======================================================
     MAIN RETURN
  ======================================================= */

  return (
    <div
      className="
        h-full
        w-full
        flex
        bg-[#1b1b1b]
        text-slate-100
        overflow-hidden
        select-none
        font-sans
      "
      style={{
        '--os-accent':
          accent,
      } as React.CSSProperties}
    >

      {renderSidebar()}


      <main
        className="
          flex-1
          min-w-0
          flex
          flex-col
          overflow-hidden
        "
      >

        {renderHeader()}


        {/* CONTENT */}

        <div
          className="
            flex-1
            overflow-y-auto
            overscroll-contain
          "
        >

          <div
            className="
              w-full
              max-w-[1120px]
              mx-auto
              px-4
              sm:px-6
              lg:px-8
              py-6
              sm:py-8
              pb-28
            "
          >

            {renderContent()}

          </div>

        </div>

      </main>


      {renderMobileNav()}


      {renderModal()}


      {/* ===================================================
          TOAST
      =================================================== */}

      {toast.show && (
        <div
          className="
            fixed
            left-1/2
            bottom-6
            -translate-x-1/2
            z-[200]
            animate-[settingsToast_.25s_ease-out]
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-2xl
              bg-[#292929]/95
              backdrop-blur-2xl
              border border-white/[0.10]
              shadow-2xl
              min-w-[220px]
            "
          >

            {toast.type ===
              'success' ? (
              <CircleCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toast.type ===
              'warning' ? (
              <CircleAlert className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-sky-400 shrink-0" />
            )}

            <span className="text-xs text-slate-200">
              {toast.message}
            </span>

          </div>

        </div>
      )}


      {/* ===================================================
          INLINE ANIMATIONS
      =================================================== */}

      <style>
        {`
          @keyframes settingsFade {
            from {
              opacity: 0;
              transform: translateY(7px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes settingsToast {
            from {
              opacity: 0;
              transform: translate(-50%, 12px) scale(.96);
            }

            to {
              opacity: 1;
              transform: translate(-50%, 0) scale(1);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        `}
      </style>

    </div>
  );
};


/* =========================================================
   ICON FALLBACKS
   Keeping these local means no extra dependencies.
========================================================= */

const CodeIcon: React.FC<{
  className?: string;
}> = ({
  className = '',
}) => (
  <div
    className={`
      ${className}
      flex
      items-center
      justify-center
      font-mono
      font-bold
      text-sky-400
    `}
  >
    {'</>'}
  </div>
);


const TerminalIcon: React.FC<{
  className?: string;
}> = ({
  className = '',
}) => (
  <div
    className={`
      ${className}
      flex
      items-center
      justify-center
      font-mono
      font-bold
      text-emerald-400
    `}
  >
    {'>_'}
  </div>
);

export default SettingsApp;