import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Battery,
  BatteryCharging,
  CalendarDays,
  Calculator,
  CheckCircle2,
  ChevronRight,
  CloudSun,
  Code2,
  Cpu,
  ExternalLink,
  FolderKanban,
  Github,
  Globe,
  HardDrive,
  Heart,
  Link2,
  MapPin,
  Menu,
  MessageCircle,
  Music2,
  Network,
  NotebookPen,
  Play,
  Quote,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Terminal,
  Timer,
  Trash2,
  Trophy,
  UserRound,
  Wifi,
  X,
  Zap,
  Clock,
} from 'lucide-react';

import { useOS } from '../../context/OSContext';

interface WorldCityTime {
  city: string;
  country: string;
  timeZone: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'Interview' | 'Sprint' | 'Milestone';
}

interface QuickLink {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

interface BatteryManager {
  level: number;
  charging: boolean;
  addEventListener: (
    type: string,
    listener: () => void
  ) => void;
  removeEventListener: (
    type: string,
    listener: () => void
  ) => void;
}

const WORLD_CITIES: WorldCityTime[] = [
  {
    city: 'New Delhi',
    country: 'India',
    timeZone: 'Asia/Kolkata',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    timeZone: 'Europe/London',
  },
  {
    city: 'New York',
    country: 'United States',
    timeZone: 'America/New_York',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    timeZone: 'Asia/Tokyo',
  },
  {
    city: 'Dubai',
    country: 'UAE',
    timeZone: 'Asia/Dubai',
  },
];

const DEV_QUOTES = [
  {
    quote: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger W. Dijkstra',
  },
  {
    quote: 'Make it work, make it right, make it fast.',
    author: 'Kent Beck',
  },
  {
    quote:
      'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    author: 'Martin Fowler',
  },
  {
    quote: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson',
  },
  {
    quote:
      'Programs must be written for people to read, and only incidentally for machines to execute.',
    author: 'Harold Abelson',
  },
];

const upcomingEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Portfolio System Upgrade',
    date: 'Today',
    type: 'Sprint',
  },
  {
    id: '2',
    title: 'Project Architecture Review',
    date: 'Tomorrow',
    type: 'Milestone',
  },
  {
    id: '3',
    title: 'Recruiter Follow-up',
    date: 'This Week',
    type: 'Interview',
  },
];

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-[24px]
        border border-white/[0.08]
        bg-white/[0.035]
        backdrop-blur-2xl
        shadow-[0_18px_60px_rgba(0,0,0,0.22)]
        transition-all duration-500
        hover:-translate-y-1
        hover:border-white/[0.14]
        hover:bg-white/[0.05]
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.045] via-transparent to-transparent opacity-60" />
      <div className="relative">{children}</div>
    </div>
  );
};

const CardHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}> = ({ icon, title, action }) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.06]">
          {icon}
        </div>

        <span className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300">
          {title}
        </span>
      </div>

      {action}
    </div>
  );
};

const ProgressBar: React.FC<{
  value: number;
  label?: string;
  valueLabel?: string;
  icon?: React.ReactNode;
}> = ({ value, label, valueLabel, icon }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[11px] text-slate-400">
          {icon}
          {label}
        </span>

        <span className="text-[11px] font-semibold text-slate-200">
          {valueLabel ?? `${value}%`}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-1000 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
};

export const WidgetsApp: React.FC = () => {
  const {
    projects,
    skills,
    experiences,
    openApp,
  } = useOS();

  const [currentTime, setCurrentTime] = useState(new Date());

  const [quickNote, setQuickNote] = useState(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    return (
      localStorage.getItem('ak_widget_quick_note') ||
      'Explore KrishiMitra AI and review the full-stack architecture.'
    );
  });

  const [weatherCity, setWeatherCity] = useState(() => {
    if (typeof window === 'undefined') {
      return 'Pune, IN';
    }

    return (
      localStorage.getItem('ak_widget_weather_city') ||
      'Pune, IN'
    );
  });

  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [cityInput, setCityInput] = useState('');

  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);

  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator === 'undefined') {
      return true;
    }

    return navigator.onLine;
  });

  const [musicPlaying, setMusicPlaying] = useState(false);

  const [githubActivity, setGithubActivity] = useState(72);

  const [refreshing, setRefreshing] = useState(false);

  /*
   * ------------------------------------------------------------
   * LIVE CLOCK
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  /*
   * ------------------------------------------------------------
   * ONLINE / OFFLINE
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /*
   * ------------------------------------------------------------
   * BATTERY
   * ------------------------------------------------------------
   */

  useEffect(() => {
    let battery: BatteryManager | null = null;

    const updateBattery = () => {
      if (!battery) return;

      setBatteryLevel(Math.round(battery.level * 100));
      setIsCharging(battery.charging);
    };

    const loadBattery = async () => {
      try {
        const navigatorWithBattery = navigator as Navigator & {
          getBattery?: () => Promise<BatteryManager>;
        };

        if (!navigatorWithBattery.getBattery) {
          return;
        }

        battery = await navigatorWithBattery.getBattery();

        updateBattery();

        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      } catch {
        setBatteryLevel(null);
      }
    };

    loadBattery();

    return () => {
      if (!battery) return;

      battery.removeEventListener('levelchange', updateBattery);
      battery.removeEventListener('chargingchange', updateBattery);
    };
  }, []);

  /*
   * ------------------------------------------------------------
   * PERSISTED NOTE
   * ------------------------------------------------------------
   */

  const handleNoteChange = (text: string) => {
    setQuickNote(text);

    localStorage.setItem(
      'ak_widget_quick_note',
      text
    );
  };

  /*
   * ------------------------------------------------------------
   * WEATHER CITY
   * ------------------------------------------------------------
   */

  const handleWeatherCity = () => {
    const city = cityInput.trim();

    if (!city) return;

    setWeatherCity(city);

    localStorage.setItem(
      'ak_widget_weather_city',
      city
    );

    setCityInput('');
    setIsSearchingCity(false);
  };

  /*
   * ------------------------------------------------------------
   * QUOTE
   * ------------------------------------------------------------
   */

  const currentQuote = useMemo(() => {
    return DEV_QUOTES[
      currentTime.getMinutes() % DEV_QUOTES.length
    ];
  }, [currentTime]);

  /*
   * ------------------------------------------------------------
   * DATE
   * ------------------------------------------------------------
   */

  const formattedDate = currentTime.toLocaleDateString(
    'en-IN',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  /*
   * ------------------------------------------------------------
   * TIME
   * ------------------------------------------------------------
   */

  const formattedTime = currentTime.toLocaleTimeString(
    'en-IN',
    {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }
  );

  /*
   * ------------------------------------------------------------
   * REFRESH
   * ------------------------------------------------------------
   */

  const handleRefresh = () => {
    setRefreshing(true);

    window.setTimeout(() => {
      setRefreshing(false);
      setCurrentTime(new Date());

      setGithubActivity(
        Math.floor(65 + Math.random() * 25)
      );
    }, 700);
  };

  /*
   * ------------------------------------------------------------
   * QUICK LINKS
   * ------------------------------------------------------------
   */

  const quickLinks: QuickLink[] = [
    {
      id: 'projects',
      title: 'Projects',
      subtitle: 'Explore work',
      icon: <FolderKanban className="h-4 w-4" />,
      action: () => openApp('projects'),
    },
    {
      id: 'terminal',
      title: 'Terminal',
      subtitle: 'Developer shell',
      icon: <Terminal className="h-4 w-4" />,
      action: () => openApp('terminal'),
    },
    {
      id: 'ai',
      title: 'Abhishek AI',
      subtitle: 'AI assistant',
      icon: <Sparkles className="h-4 w-4" />,
      action: () => openApp('ai'),
    },
    {
      id: 'resume',
      title: 'Resume',
      subtitle: 'Career profile',
      icon: <UserRound className="h-4 w-4" />,
      action: () => openApp('resume'),
    },
  ];

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */

  return (
    <div className="h-full w-full overflow-y-auto bg-[#070b14] text-slate-100 font-sans">
      <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">

        {/* ======================================================
            TOP HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-5 border-b border-white/[0.08] pb-6 xl:flex-row xl:items-center xl:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20">
                <Sparkles className="h-5 w-5 text-white" />

                <div className="absolute inset-0 animate-pulse rounded-2xl bg-white/10" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Widgets Center
                </h1>

                <p className="mt-0.5 text-xs text-slate-500">
                  Abhishek OS • Personal workstation dashboard
                </p>
              </div>

            </div>

            <p className="mt-3 max-w-2xl text-xs leading-5 text-slate-400">
              A macOS-inspired widget workspace for portfolio
              intelligence, productivity, developer tools and
              workstation utilities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <div
              className={`
                flex items-center gap-2 rounded-full
                border px-3 py-2 text-[11px] font-semibold
                ${
                  isOnline
                    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                    : 'border-rose-400/20 bg-rose-400/10 text-rose-300'
                }
              `}
            >
              <span
                className={`
                  h-2 w-2 rounded-full
                  ${
                    isOnline
                      ? 'animate-pulse bg-emerald-400'
                      : 'bg-rose-400'
                  }
                `}
              />

              {isOnline ? 'Online' : 'Offline'}
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition-all hover:bg-white/[0.08] hover:text-white"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  refreshing ? 'animate-spin' : ''
                }`}
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={() => openApp('settings')}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition-all hover:bg-white/[0.08] hover:text-white"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Customize
            </button>

          </div>
        </div>

        {/* ======================================================
            BENTO GRID
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          {/* ==================================================
              CLOCK / MACOS STYLE CLOCK
          ================================================== */}

          <Card className="md:col-span-2 xl:col-span-2 min-h-[250px]">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="flex h-full flex-col justify-between p-5">

              <CardHeader
                icon={
                  <Clock className="h-4 w-4 text-sky-400" />
                }
                title="World Clock"
                action={
                  <span className="text-[10px] text-slate-500">
                    Local workstation time
                  </span>
                }
              />

              <div className="py-6">

                <div className="font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {formattedTime}
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <CalendarDays className="h-3.5 w-3.5 text-sky-400" />
                  {formattedDate}
                </div>

              </div>

              <div className="flex flex-wrap items-center gap-2">

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.035] px-3 py-2">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-500">
                    Timezone
                  </span>

                  <span className="font-mono text-xs text-slate-200">
                    {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </span>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.035] px-3 py-2">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-500">
                    UTC
                  </span>

                  <span className="font-mono text-xs text-slate-200">
                    {currentTime
                      .getUTCHours()
                      .toString()
                      .padStart(2, '0')}
                    :
                    {currentTime
                      .getUTCMinutes()
                      .toString()
                      .padStart(2, '0')}
                  </span>
                </div>

              </div>
            </div>
          </Card>

          {/* ==================================================
              BATTERY
          ================================================== */}

          <Card className="min-h-[250px]">
            <div className="p-5">

              <CardHeader
                icon={
                  isCharging ? (
                    <BatteryCharging className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Battery className="h-4 w-4 text-emerald-400" />
                  )
                }
                title="Battery"
              />

              <div className="mt-8">

                {batteryLevel !== null ? (
                  <>
                    <div className="flex items-end justify-between">

                      <span className="text-5xl font-bold text-white">
                        {batteryLevel}%
                      </span>

                      <Battery
                        className={`mb-2 h-8 w-8 ${
                          isCharging
                            ? 'text-emerald-400 animate-pulse'
                            : 'text-slate-400'
                        }`}
                      />

                    </div>

                    <ProgressBar
                      value={batteryLevel}
                      valueLabel={
                        isCharging
                          ? 'Charging'
                          : `${batteryLevel}% remaining`
                      }
                    />

                    <p className="mt-4 text-[11px] text-slate-500">
                      Browser battery information
                    </p>
                  </>
                ) : (
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                    <Battery className="mb-3 h-7 w-7 text-slate-500" />

                    <p className="text-xs text-slate-300">
                      Battery information unavailable
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      Your browser does not expose battery
                      information.
                    </p>
                  </div>
                )}

              </div>
            </div>
          </Card>

          {/* ==================================================
              NETWORK
          ================================================== */}

          <Card className="min-h-[250px]">
            <div className="p-5">

              <CardHeader
                icon={
                  <Wifi
                    className={`h-4 w-4 ${
                      isOnline
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  />
                }
                title="Network"
              />

              <div className="mt-7">

                <div className="flex items-center gap-3">

                  <div
                    className={`
                      flex h-12 w-12 items-center justify-center
                      rounded-2xl
                      ${
                        isOnline
                          ? 'bg-emerald-400/10'
                          : 'bg-rose-400/10'
                      }
                    `}
                  >
                    <Network
                      className={`h-5 w-5 ${
                        isOnline
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="text-lg font-bold text-white">
                      {isOnline ? 'Connected' : 'Offline'}
                    </div>

                    <div className="text-[10px] text-slate-500">
                      Browser connectivity status
                    </div>
                  </div>

                </div>

                <div className="mt-6 space-y-3">

                  <div className="flex items-center justify-between rounded-xl bg-white/[0.025] p-3">
                    <span className="text-[11px] text-slate-500">
                      Connection
                    </span>

                    <span
                      className={`text-[11px] font-semibold ${
                        isOnline
                          ? 'text-emerald-300'
                          : 'text-rose-300'
                      }`}
                    >
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-white/[0.025] p-3">
                    <span className="text-[11px] text-slate-500">
                      Network API
                    </span>

                    <span className="text-[11px] font-semibold text-slate-300">
                      Available
                    </span>
                  </div>

                </div>

              </div>
            </div>
          </Card>

          {/* ==================================================
              WEATHER
          ================================================== */}

          <Card className="xl:col-span-2">
            <div className="p-5">

              <CardHeader
                icon={
                  <CloudSun className="h-4 w-4 text-amber-400" />
                }
                title="Weather"
                action={
                  <button
                    type="button"
                    onClick={() =>
                      setIsSearchingCity(!isSearchingCity)
                    }
                    className="text-[10px] font-semibold text-sky-400 transition-colors hover:text-sky-300"
                  >
                    Change city
                  </button>
                }
              />

              {isSearchingCity ? (
                <div className="mt-6 flex gap-2">

                  <input
                    type="text"
                    value={cityInput}
                    onChange={e =>
                      setCityInput(e.target.value)
                    }
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleWeatherCity();
                      }
                    }}
                    placeholder="Pune, Bengaluru, Mumbai..."
                    className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
                  />

                  <button
                    type="button"
                    onClick={handleWeatherCity}
                    className="rounded-xl bg-sky-400 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-sky-300"
                  >
                    Set
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setIsSearchingCity(false)
                    }
                    className="rounded-xl border border-white/[0.08] px-3 text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>
              ) : (
                <div className="mt-7">

                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                    <div>
                      <div className="flex items-center gap-3">

                        <CloudSun className="h-12 w-12 text-amber-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />

                        <div>
                          <div className="text-4xl font-extrabold text-white">
                            28°C
                          </div>

                          <div className="text-xs font-semibold text-emerald-300">
                            Mostly Sunny
                          </div>
                        </div>

                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {weatherCity}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">

                      <div className="rounded-xl bg-white/[0.025] p-3 text-center">
                        <span className="block text-[9px] uppercase text-slate-600">
                          Humidity
                        </span>
                        <span className="text-xs font-bold text-slate-200">
                          54%
                        </span>
                      </div>

                      <div className="rounded-xl bg-white/[0.025] p-3 text-center">
                        <span className="block text-[9px] uppercase text-slate-600">
                          Wind
                        </span>
                        <span className="text-xs font-bold text-slate-200">
                          12 km/h
                        </span>
                      </div>

                      <div className="rounded-xl bg-white/[0.025] p-3 text-center">
                        <span className="block text-[9px] uppercase text-slate-600">
                          AQI
                        </span>
                        <span className="text-xs font-bold text-emerald-300">
                          Good
                        </span>
                      </div>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() => openApp('weather')}
                    className="mt-5 flex items-center gap-1 text-[11px] font-semibold text-sky-400 transition-colors hover:text-sky-300"
                  >
                    Open full weather
                    <ChevronRight className="h-3 w-3" />
                  </button>

                </div>
              )}

            </div>
          </Card>

          {/* ==================================================
              PORTFOLIO STATS
          ================================================== */}

          <Card className="xl:col-span-2">
            <div className="p-5">

              <CardHeader
                icon={
                  <Trophy className="h-4 w-4 text-yellow-400" />
                }
                title="Portfolio Overview"
                action={
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Available
                  </div>
                }
              />

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition-all duration-300 hover:-translate-y-1">
                  <FolderKanban className="mb-3 h-4 w-4 text-sky-400" />
                  <div className="text-2xl font-bold text-white">
                    {projects.length}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    Projects
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition-all duration-300 hover:-translate-y-1">
                  <Code2 className="mb-3 h-4 w-4 text-indigo-400" />
                  <div className="text-2xl font-bold text-white">
                    {skills.length}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    Skills
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition-all duration-300 hover:-translate-y-1">
                  <Activity className="mb-3 h-4 w-4 text-emerald-400" />
                  <div className="text-2xl font-bold text-white">
                    {experiences.length}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    Roles
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition-all duration-300 hover:-translate-y-1">
                  <Zap className="mb-3 h-4 w-4 text-amber-400" />
                  <div className="text-2xl font-bold text-white">
                    2+
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    Years
                  </div>
                </div>

              </div>

              <div className="mt-5 flex flex-col justify-between gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center">

                <span className="text-xs text-slate-500">
                  Software Engineer • React • Next.js • Node.js
                </span>

                <button
                  type="button"
                  onClick={() => openApp('resume')}
                  className="flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  View Resume
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

              </div>

            </div>
          </Card>

          {/* ==================================================
              WORLD CLOCKS
          ================================================== */}

          <Card className="xl:col-span-2">
            <div className="p-5">

              <CardHeader
                icon={
                  <Globe className="h-4 w-4 text-indigo-400" />
                }
                title="World Clocks"
              />

              <div className="mt-5 grid gap-2 sm:grid-cols-2">

                {WORLD_CITIES.map(city => {

                  const cityTime =
                    currentTime.toLocaleTimeString(
                      [],
                      {
                        timeZone: city.timeZone,
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      }
                    );

                  return (
                    <div
                      key={city.city}
                      className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-3 transition-all duration-300 hover:bg-white/[0.05]"
                    >
                      <div className="min-w-0">

                        <div className="truncate text-xs font-semibold text-slate-200">
                          {city.city}
                        </div>

                        <div className="text-[9px] text-slate-600">
                          {city.country}
                        </div>

                      </div>

                      <div className="ml-3 font-mono text-xs font-semibold text-sky-300">
                        {cityTime}
                      </div>
                    </div>
                  );
                })}

              </div>

            </div>
          </Card>

          {/* ==================================================
              QUICK NOTES
          ================================================== */}

          <Card className="xl:col-span-2">
            <div className="p-5">

              <CardHeader
                icon={
                  <StickyNote className="h-4 w-4 text-amber-400" />
                }
                title="Quick Scratchpad"
                action={
                  <button
                    type="button"
                    onClick={() => openApp('notes')}
                    className="text-[10px] font-semibold text-sky-400 hover:text-sky-300"
                  >
                    Full Notes
                  </button>
                }
              />

              <textarea
                value={quickNote}
                onChange={e =>
                  handleNoteChange(e.target.value)
                }
                placeholder="Write an idea, reminder, TODO..."
                className="mt-5 h-32 w-full resize-none rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-xs leading-5 text-slate-200 outline-none placeholder:text-slate-600 focus:border-amber-400/30"
              />

              <div className="mt-2 flex items-center justify-between">

                <span className="text-[9px] text-slate-600">
                  Saved locally
                </span>

                <span className="text-[9px] text-slate-600">
                  {quickNote.length} characters
                </span>

              </div>

            </div>
          </Card>

          {/* ==================================================
              MUSIC PLAYER
          ================================================== */}

          <Card className="md:col-span-2">
            <div className="p-5">

              <CardHeader
                icon={
                  <Music2 className="h-4 w-4 text-pink-400" />
                }
                title="Music"
                action={
                  <span className="text-[9px] text-slate-600">
                    Mini Player
                  </span>
                }
              />

              <div className="mt-6 flex items-center gap-4">

                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">

                  <Music2 className="h-7 w-7 text-white" />

                  {musicPlaying && (
                    <div className="absolute inset-0 animate-pulse bg-white/10" />
                  )}

                </div>

                <div className="min-w-0 flex-1">

                  <div className="truncate text-sm font-bold text-white">
                    Developer Focus
                  </div>

                  <div className="mt-1 truncate text-[11px] text-slate-500">
                    Coding playlist • Abhishek OS
                  </div>

                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                    <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-pink-400 to-purple-400" />
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMusicPlaying(!musicPlaying)
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {musicPlaying ? (
                    <span className="text-xs font-bold">
                      II
                    </span>
                  ) : (
                    <Play className="ml-0.5 h-4 w-4 fill-current" />
                  )}
                </button>

              </div>

            </div>
          </Card>

          {/* ==================================================
              GITHUB ACTIVITY
          ================================================== */}

          <Card className="md:col-span-2">
            <div className="p-5">

              <CardHeader
                icon={
                  <Github className="h-4 w-4 text-white" />
                }
                title="GitHub Activity"
                action={
                  <a
                    href="https://github.com/Abhishekkuntare"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300"
                  >
                    Profile
                    <ExternalLink className="h-3 w-3" />
                  </a>
                }
              />

              <div className="mt-6 flex items-center gap-5">

                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-emerald-400/20">

                  <div className="text-xl font-bold text-white">
                    {githubActivity}
                  </div>

                  <div className="absolute -bottom-2 rounded-full bg-slate-900 px-2 py-0.5 text-[8px] text-slate-500">
                    activity
                  </div>

                </div>

                <div className="flex-1">

                  <div className="text-sm font-bold text-white">
                    Developer Activity
                  </div>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    Portfolio workspace activity indicator.
                  </p>

                  <ProgressBar
                    value={githubActivity}
                    valueLabel={`${githubActivity}%`}
                  />

                </div>

              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">

                <div className="rounded-xl bg-white/[0.025] p-3 text-center">
                  <div className="text-sm font-bold text-white">
                    React
                  </div>
                  <div className="text-[9px] text-slate-600">
                    Frontend
                  </div>
                </div>

                <div className="rounded-xl bg-white/[0.025] p-3 text-center">
                  <div className="text-sm font-bold text-white">
                    Next.js
                  </div>
                  <div className="text-[9px] text-slate-600">
                    Full Stack
                  </div>
                </div>

                <div className="rounded-xl bg-white/[0.025] p-3 text-center">
                  <div className="text-sm font-bold text-white">
                    Node.js
                  </div>
                  <div className="text-[9px] text-slate-600">
                    Backend
                  </div>
                </div>

              </div>

            </div>
          </Card>

          {/* ==================================================
              CALENDAR
          ================================================== */}

          <Card className="md:col-span-2">
            <div className="p-5">

              <CardHeader
                icon={
                  <CalendarDays className="h-4 w-4 text-blue-400" />
                }
                title="Upcoming"
                action={
                  <button
                    type="button"
                    onClick={() => openApp('calendar')}
                    className="text-[10px] text-sky-400 hover:text-sky-300"
                  >
                    Open Calendar
                  </button>
                }
              />

              <div className="mt-5 space-y-2">

                {upcomingEvents.map(event => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3 transition-all duration-300 hover:translate-x-1 hover:bg-white/[0.05]"
                  >

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-400/10">
                      <CalendarDays className="h-4 w-4 text-blue-400" />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="truncate text-xs font-semibold text-slate-200">
                        {event.title}
                      </div>

                      <div className="mt-0.5 text-[9px] text-slate-600">
                        {event.type}
                      </div>

                    </div>

                    <div className="text-[10px] font-semibold text-slate-400">
                      {event.date}
                    </div>

                  </div>
                ))}

              </div>

            </div>
          </Card>

          {/* ==================================================
              QUICK LAUNCH
          ================================================== */}

          <Card className="md:col-span-2">
            <div className="p-5">

              <CardHeader
                icon={
                  <Zap className="h-4 w-4 text-yellow-400" />
                }
                title="Quick Launch"
              />

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">

                {quickLinks.map(link => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={link.action}
                    className="group/link rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"
                  >

                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] text-slate-300 transition-colors group-hover/link:text-sky-400">
                      {link.icon}
                    </div>

                    <div className="text-xs font-semibold text-slate-200">
                      {link.title}
                    </div>

                    <div className="mt-1 truncate text-[9px] text-slate-600">
                      {link.subtitle}
                    </div>

                  </button>
                ))}

              </div>

            </div>
          </Card>

          {/* ==================================================
              STORAGE
          ================================================== */}

          <Card>
            <div className="p-5">

              <CardHeader
                icon={
                  <HardDrive className="h-4 w-4 text-cyan-400" />
                }
                title="Storage"
              />

              <div className="mt-7">

                <div className="flex items-end justify-between">

                  <div>
                    <div className="text-3xl font-bold text-white">
                      Browser
                    </div>

                    <div className="mt-1 text-[10px] text-slate-600">
                      Storage availability
                    </div>
                  </div>

                  <HardDrive className="h-8 w-8 text-cyan-400" />

                </div>

                <div className="mt-5">

                  <ProgressBar
                    value={38}
                    valueLabel="Local storage"
                  />

                </div>

                <p className="mt-4 text-[9px] leading-4 text-slate-600">
                  Exact device disk usage is not exposed
                  reliably by standard browser APIs.
                </p>

              </div>

            </div>
          </Card>

          {/* ==================================================
              DEVELOPER ENVIRONMENT
          ================================================== */}

          <Card>
            <div className="p-5">

              <CardHeader
                icon={
                  <Cpu className="h-4 w-4 text-emerald-400" />
                }
                title="Environment"
              />

              <div className="mt-5 space-y-2">

                <div className="flex items-center justify-between rounded-xl bg-white/[0.025] p-3">
                  <span className="text-[10px] text-slate-500">
                    Platform
                  </span>

                  <span className="text-[10px] font-semibold text-slate-200">
                    {navigator.platform || 'Browser'}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/[0.025] p-3">
                  <span className="text-[10px] text-slate-500">
                    Language
                  </span>

                  <span className="text-[10px] font-semibold text-slate-200">
                    {navigator.language}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/[0.025] p-3">
                  <span className="text-[10px] text-slate-500">
                    Cookies
                  </span>

                  <span className="text-[10px] font-semibold text-emerald-300">
                    {navigator.cookieEnabled
                      ? 'Enabled'
                      : 'Disabled'}
                  </span>
                </div>

              </div>

            </div>
          </Card>

          {/* ==================================================
              DEVELOPER WISDOM
          ================================================== */}

          <Card className="md:col-span-2">
            <div className="p-5">

              <CardHeader
                icon={
                  <Quote className="h-4 w-4 text-purple-400" />
                }
                title="Developer Wisdom"
              />

              <div className="mt-6">

                <blockquote className="border-l-2 border-purple-400/50 pl-4 text-sm italic leading-7 text-slate-300">
                  “{currentQuote.quote}”
                </blockquote>

                <div className="mt-4 text-right text-xs font-semibold text-purple-300">
                  — {currentQuote.author}
                </div>

              </div>

            </div>
          </Card>

          {/* ==================================================
              CAREER STATUS
          ================================================== */}

          <Card className="md:col-span-2">
            <div className="p-5">

              <CardHeader
                icon={
                  <Heart className="h-4 w-4 text-rose-400" />
                }
                title="Career Status"
              />

              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10">
                  <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                </div>

                <div className="flex-1">

                  <div className="text-lg font-bold text-white">
                    Available for opportunities
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Frontend • Full Stack • React • Next.js • Node.js
                    • AI-integrated applications
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => openApp('resume')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition-all hover:-translate-y-0.5"
                >
                  View Profile
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

              </div>

            </div>
          </Card>

          {/* ==================================================
              SYSTEM SECURITY
          ================================================== */}

          <Card>
            <div className="p-5">

              <CardHeader
                icon={
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                }
                title="Privacy"
              />

              <div className="mt-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white">
                      Browser protected
                    </div>

                    <div className="text-[9px] text-slate-600">
                      Local widget data
                    </div>
                  </div>

                </div>

                <div className="mt-5 space-y-2">

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    Notes stored locally
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    No continuous recording
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    Browser permission based
                  </div>

                </div>

              </div>

            </div>
          </Card>

          {/* ==================================================
              TOOLS
          ================================================== */}

          <Card>
            <div className="p-5">

              <CardHeader
                icon={
                  <Calculator className="h-4 w-4 text-orange-400" />
                }
                title="Utilities"
              />

              <div className="mt-5 grid grid-cols-2 gap-2">

                <button
                  type="button"
                  onClick={() => openApp('calculator')}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition-all hover:bg-white/[0.06]"
                >
                  <Calculator className="mb-2 h-4 w-4 text-orange-400" />

                  <div className="text-[10px] font-semibold text-slate-200">
                    Calculator
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => openApp('search')}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition-all hover:bg-white/[0.06]"
                >
                  <Search className="mb-2 h-4 w-4 text-sky-400" />

                  <div className="text-[10px] font-semibold text-slate-200">
                    Search
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => openApp('api-lab')}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition-all hover:bg-white/[0.06]"
                >
                  <Network className="mb-2 h-4 w-4 text-indigo-400" />

                  <div className="text-[10px] font-semibold text-slate-200">
                    API Lab
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => openApp('browser')}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition-all hover:bg-white/[0.06]"
                >
                  <Globe className="mb-2 h-4 w-4 text-cyan-400" />

                  <div className="text-[10px] font-semibold text-slate-200">
                    Browser
                  </div>
                </button>

              </div>

            </div>
          </Card>

          {/* ==================================================
              RECENT PROJECTS
          ================================================== */}

          <Card className="md:col-span-2 xl:col-span-4">
            <div className="p-5">

              <CardHeader
                icon={
                  <FolderKanban className="h-4 w-4 text-sky-400" />
                }
                title="Recent Projects"
                action={
                  <button
                    type="button"
                    onClick={() => openApp('projects')}
                    className="flex items-center gap-1 text-[10px] font-semibold text-sky-400 hover:text-sky-300"
                  >
                    View all
                    <ChevronRight className="h-3 w-3" />
                  </button>
                }
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                {projects.slice(0, 4).map((project: any, index: number) => (
                  <button
                    key={
                      project.id ||
                      project.slug ||
                      project.title ||
                      index
                    }
                    type="button"
                    onClick={() => openApp('projects')}
                    className="group/project overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] text-left transition-all duration-500 hover:-translate-y-1 hover:border-sky-400/20 hover:bg-white/[0.05]"
                  >

                    <div className="relative h-24 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">

                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title || 'Project'}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover/project:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FolderKanban className="h-8 w-8 text-slate-700 transition-transform duration-500 group-hover/project:scale-110" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    </div>

                    <div className="p-3">

                      <div className="truncate text-xs font-bold text-slate-200">
                        {project.title || 'Untitled Project'}
                      </div>

                      <div className="mt-1 truncate text-[9px] text-slate-600">
                        {project.category ||
                          project.subtitle ||
                          'Portfolio project'}
                      </div>

                    </div>

                  </button>
                ))}

              </div>

            </div>
          </Card>

        </div>

        {/* ======================================================
            FOOTER
        ====================================================== */}

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-5 text-[9px] text-slate-600 sm:flex-row">

          <div>
            Abhishek OS • Widgets Center
          </div>

          <div className="flex items-center gap-4">

            <span className="flex items-center gap-1.5">
              <Timer className="h-3 w-3" />
              Live updates
            </span>

            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" />
              Privacy-aware
            </span>

            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Smooth UI
            </span>

          </div>

        </div>

      </div>
    </div>
  );
};

export default WidgetsApp;