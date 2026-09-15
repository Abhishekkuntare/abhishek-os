import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  XCircle,
  RefreshCw,
  Search,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Leaf,
  Gauge,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowUpDown,
  Pause,
  Play,
  Network,
  MemoryStick,
  MonitorCog,
} from 'lucide-react';

import { useOS } from '../../context/OSContext';
import { AppIcon } from '../ui/AppIcon';

/* =========================================================
   TYPES
========================================================= */

interface ProcessRow {
  id: string;
  appId: string;
  name: string;
  iconName?: string;
  status: 'Running' | 'Suspended';
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  weight: number;
  isHeavy: boolean;
}

type SortKey =
  | 'name'
  | 'status'
  | 'cpu'
  | 'memory'
  | 'disk'
  | 'network';

/* =========================================================
   APP RESOURCE WEIGHTS

   IMPORTANT:
   Keys containing "-" MUST be wrapped in quotes.
========================================================= */

const APP_HEAVY_WEIGHTS: Record<string, number> = {
  browser: 1.8,
  youtube: 2.4,
  spotify: 1.6,
  gallery: 1.4,
  camera: 1.3,
  'video-player': 2.1,
  arcade: 1.9,
  'code-editor': 2.2,
  terminal: 1.2,
  sheets: 1.1,
  writer: 0.9,
  'file-explorer': 0.8,
  downloads: 0.7,
  weather: 0.6,
  calendar: 0.5,
  calculator: 0.3,
  notes: 0.4,
};

/* =========================================================
   HELPERS
========================================================= */

const getAppWeight = (appId: string): number => {
  return APP_HEAVY_WEIGHTS[appId] ?? 0.7;
};

const clamp = (
  value: number,
  min: number,
  max: number
): number => {
  return Math.min(Math.max(value, min), max);
};

const formatMemory = (value: number): string => {
  if (value >= 1024) {
    return `${(value / 1024).toFixed(1)} GB`;
  }

  return `${Math.round(value)} MB`;
};

const formatNetwork = (value: number): string => {
  if (value < 0.05) {
    return '0 Mbps';
  }

  return `${value.toFixed(1)} Mbps`;
};

/* =========================================================
   COMPONENT
========================================================= */

export const SystemMonitorApp: React.FC = () => {
  const {
    windows,
    closeWindow,
    focusWindow,
  } = useOS();

  const [selectedProcessId, setSelectedProcessId] =
    useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [sortKey, setSortKey] = useState<SortKey>('cpu');

  const [sortDirection, setSortDirection] =
    useState<'asc' | 'desc'>('desc');

  const [refreshing, setRefreshing] = useState(false);

  const [telemetryTick, setTelemetryTick] = useState(0);

  const [showMore, setShowMore] = useState(false);

  /* =======================================================
     LIVE TELEMETRY SIMULATION

     This doesn't claim to read real Windows CPU usage.
     It creates realistic animated values for the simulated OS.
  ======================================================= */

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTelemetryTick(prev => prev + 1);
    }, 1800);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /* =======================================================
     BUILD PROCESS LIST
  ======================================================= */

  const processes = useMemo<ProcessRow[]>(() => {
    return windows.map((win, idx) => {
      const weight = getAppWeight(win.appId);

      const isHeavy =
        weight >= 1.4 ||
        [
          'browser',
          'youtube',
          'spotify',
          'gallery',
          'camera',
          'video-player',
          'arcade',
          'code-editor',
        ].includes(win.appId);

      const wave =
        Math.sin(
          telemetryTick * 0.9 +
          idx * 1.37
        ) * 0.35;

      const wave2 =
        Math.cos(
          telemetryTick * 0.6 +
          idx * 0.83
        ) * 0.25;

      let cpu = 0;
      let memory = 0;
      let disk = 0;
      let network = 0;

      if (win.isMinimized) {
        cpu = 0.1;
        memory = 18 + idx * 3;
        disk = 0;
        network = 0;
      } else {
        cpu = clamp(
          0.65 +
            weight * 1.75 +
            idx * 0.18 +
            wave +
            wave2,
          0.2,
          18.9
        );

        memory = clamp(
          42 +
            weight * 62 +
            idx * 11 +
            Math.abs(wave) * 12,
          28,
          780
        );

        disk = clamp(
          weight * 1.9 +
            Math.abs(wave2) * 7,
          0,
          48
        );

        network = clamp(
          weight >= 1.4
            ? weight * 0.55 +
                Math.abs(wave) * 1.5
            : Math.abs(wave2) * 0.25,
          0,
          8
        );
      }

      return {
        id: win.id,
        appId: win.appId,
        name: win.title,
        iconName: win.iconName,
        status: win.isMinimized
          ? 'Suspended'
          : 'Running',
        cpu,
        memory,
        disk,
        network,
        weight,
        isHeavy,
      };
    });
  }, [windows, telemetryTick]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredProcesses = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    const filtered = processes.filter(proc => {
      if (!query) {
        return true;
      }

      return (
        proc.name.toLowerCase().includes(query) ||
        proc.appId.toLowerCase().includes(query) ||
        proc.status.toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      let result = 0;

      switch (sortKey) {
        case 'name':
          result = a.name.localeCompare(b.name);
          break;

        case 'status':
          result = a.status.localeCompare(b.status);
          break;

        case 'cpu':
          result = a.cpu - b.cpu;
          break;

        case 'memory':
          result = a.memory - b.memory;
          break;

        case 'disk':
          result = a.disk - b.disk;
          break;

        case 'network':
          result = a.network - b.network;
          break;

        default:
          result = 0;
      }

      return sortDirection === 'asc'
        ? result
        : -result;
    });
  }, [
    processes,
    searchQuery,
    sortKey,
    sortDirection,
  ]);

  /* =======================================================
     SYSTEM TOTALS
  ======================================================= */

  const totalCpu = useMemo(() => {
    const processCpu = processes.reduce(
      (sum, process) => sum + process.cpu,
      0
    );

    return clamp(
      processCpu + 2.7,
      3,
      96
    );
  }, [processes]);

  const totalMemory = useMemo(() => {
    const processMemory = processes.reduce(
      (sum, process) => sum + process.memory,
      0
    );

    return clamp(
      1600 + processMemory,
      1800,
      15000
    );
  }, [processes]);

  const memoryPercent = clamp(
    (totalMemory / 16384) * 100,
    0,
    100
  );

  const totalDisk = useMemo(() => {
    return clamp(
      processes.reduce(
        (sum, process) => sum + process.disk,
        0
      ) + 4.2,
      0,
      100
    );
  }, [processes]);

  const totalNetwork = useMemo(() => {
    return processes.reduce(
      (sum, process) => sum + process.network,
      0
    );
  }, [processes]);

  /* =======================================================
     SORT HANDLER
  ======================================================= */

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDirection(prev =>
          prev === 'asc'
            ? 'desc'
            : 'asc'
        );
      } else {
        setSortKey(key);
        setSortDirection('desc');
      }
    },
    [sortKey]
  );

  /* =======================================================
     END TASK
  ======================================================= */

  const handleEndTask = useCallback(
    (id: string) => {
      closeWindow(id);

      if (selectedProcessId === id) {
        setSelectedProcessId(null);
      }
    },
    [
      closeWindow,
      selectedProcessId,
    ]
  );

  /* =======================================================
     FOCUS PROCESS
  ======================================================= */

  const handleProcessDoubleClick = useCallback(
    (id: string) => {
      focusWindow(id);
    },
    [focusWindow]
  );

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    window.setTimeout(() => {
      setTelemetryTick(prev => prev + 1);
      setRefreshing(false);
    }, 650);
  }, []);

  /* =======================================================
     SELECTED PROCESS
  ======================================================= */

  const selectedProcess = processes.find(
    process =>
      process.id === selectedProcessId
  );

  /* =======================================================
     RESOURCE BAR
  ======================================================= */

  const ResourceBar: React.FC<{
    value: number;
    max?: number;
  }> = ({
    value,
    max = 100,
  }) => {
    const percentage = clamp(
      (value / max) * 100,
      0,
      100
    );

    return (
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-sky-400 transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    );
  };

  /* =======================================================
     SORT BUTTON
  ======================================================= */

  const SortButton: React.FC<{
    label: string;
    value: SortKey;
    align?: 'left' | 'right';
  }> = ({
    label,
    value,
    align = 'left',
  }) => {
    const active = sortKey === value;

    return (
      <button
        type="button"
        onClick={() => handleSort(value)}
        className={`group flex w-full items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide transition-colors ${
          align === 'right'
            ? 'justify-end'
            : 'justify-start'
        } ${
          active
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span>{label}</span>

        {active ? (
          sortDirection === 'desc' ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 -rotate-90" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
        )}
      </button>
    );
  };

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#1c1c1c] font-sans text-slate-100">

      {/* ===================================================
          TOP TOOLBAR
      =================================================== */}

      <div className="relative z-20 flex shrink-0 items-center gap-3 border-b border-white/[0.07] bg-[#202020] px-4 py-2.5">

        {/* Task Manager Icon */}

        <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 sm:flex">
          <MonitorCog className="h-4.5 w-4.5 text-sky-400" />
        </div>

        {/* Search */}

        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            value={searchQuery}
            onChange={e =>
              setSearchQuery(e.target.value)
            }
            placeholder="Type a name, publisher, or PID to search"
            className="h-9 w-full rounded-md border border-white/[0.07] bg-[#2a2a2a] pl-10 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-500 transition-all focus:border-sky-400/40 focus:bg-[#303030] focus:ring-1 focus:ring-sky-400/20"
          />
        </div>

        {/* Right controls */}

        <div className="ml-auto flex items-center gap-1">

          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh"
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-all hover:bg-white/[0.07] hover:text-white"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? 'animate-spin'
                  : ''
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              setShowMore(prev => !prev)
            }
            title="More options"
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-all hover:bg-white/[0.07] hover:text-white"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ===================================================
          MORE MENU
      =================================================== */}

      {showMore && (
        <div className="absolute right-4 top-14 z-50 w-52 overflow-hidden rounded-lg border border-white/[0.1] bg-[#292929] p-1.5 shadow-2xl shadow-black/50 animate-[fadeIn_.18s_ease-out]">

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Efficiency mode</span>
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <Gauge className="h-4 w-4 text-sky-400" />
            <span>Resource settings</span>
          </button>

          <div className="my-1 border-t border-white/[0.07]" />

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <Activity className="h-4 w-4 text-purple-400" />
            <span>Performance details</span>
          </button>
        </div>
      )}

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="relative z-10 shrink-0 px-5 pb-3 pt-4 sm:px-6">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-white">
                Processes
              </h1>

              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-slate-400">
                {processes.length}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Monitor running applications and system activity
            </p>
          </div>

          <div className="flex items-center gap-2">

            {selectedProcess && (
              <button
                type="button"
                onClick={() =>
                  handleEndTask(
                    selectedProcess.id
                  )
                }
                className="group flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition-all hover:border-red-400/40 hover:bg-red-500/20 hover:text-red-200"
              >
                <XCircle className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                End task
              </button>
            )}

            <button
              type="button"
              className="hidden items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-white/[0.07] hover:text-white sm:flex"
            >
              <Play className="h-3.5 w-3.5" />
              Run new task
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================
          PERFORMANCE SUMMARY
      =================================================== */}

      <div className="relative z-10 grid shrink-0 grid-cols-2 gap-2.5 px-5 pb-4 sm:grid-cols-4 sm:px-6">

        {/* CPU */}

        <div className="group relative overflow-hidden rounded-lg border border-white/[0.07] bg-[#242424] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-[#282828]">

          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span className="text-[11px] font-medium text-slate-400">
                CPU
              </span>
            </div>

            <span className="font-mono text-sm font-semibold text-white">
              {totalCpu.toFixed(0)}%
            </span>
          </div>

          <ResourceBar
            value={totalCpu}
          />

          <div className="mt-1.5 text-[10px] text-slate-500">
            12 logical processors
          </div>
        </div>

        {/* MEMORY */}

        <div className="group relative overflow-hidden rounded-lg border border-white/[0.07] bg-[#242424] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-[#282828]">

          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-sky-500/10 blur-2xl transition-all duration-500 group-hover:bg-sky-500/20" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MemoryStick className="h-4 w-4 text-sky-400" />
              <span className="text-[11px] font-medium text-slate-400">
                Memory
              </span>
            </div>

            <span className="font-mono text-sm font-semibold text-white">
              {formatMemory(totalMemory)}
            </span>
          </div>

          <ResourceBar
            value={memoryPercent}
          />

          <div className="mt-1.5 text-[10px] text-slate-500">
            of 16 GB total
          </div>
        </div>

        {/* DISK */}

        <div className="group relative overflow-hidden rounded-lg border border-white/[0.07] bg-[#242424] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-[#282828]">

          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-amber-500/10 blur-2xl transition-all duration-500 group-hover:bg-amber-500/20" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-amber-400" />
              <span className="text-[11px] font-medium text-slate-400">
                Disk
              </span>
            </div>

            <span className="font-mono text-sm font-semibold text-white">
              {totalDisk.toFixed(0)}%
            </span>
          </div>

          <ResourceBar
            value={totalDisk}
          />

          <div className="mt-1.5 text-[10px] text-slate-500">
            SSD activity
          </div>
        </div>

        {/* NETWORK */}

        <div className="group relative overflow-hidden rounded-lg border border-white/[0.07] bg-[#242424] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-[#282828]">

          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-purple-500/10 blur-2xl transition-all duration-500 group-hover:bg-purple-500/20" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-purple-400" />
              <span className="text-[11px] font-medium text-slate-400">
                Network
              </span>
            </div>

            <span className="font-mono text-sm font-semibold text-white">
              {formatNetwork(totalNetwork)}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[10px] font-medium text-emerald-400">
              Online
            </span>
          </div>

          <div className="mt-1 text-[10px] text-slate-500">
            Ethernet / Wi-Fi
          </div>
        </div>
      </div>

      {/* ===================================================
          PROCESS TABLE
      =================================================== */}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden border-t border-white/[0.06] bg-[#1f1f1f]">

        {/* TABLE HEADER */}

        <div className="grid shrink-0 grid-cols-[minmax(210px,2.6fr)_100px_80px_100px_90px_100px] border-b border-white/[0.07] bg-[#222222] px-4 py-2.5 sm:grid-cols-[minmax(260px,3fr)_120px_90px_110px_100px_110px] sm:px-5">

          <div className="flex items-center">
            <SortButton
              label="Name"
              value="name"
            />
          </div>

          <div className="flex items-center">
            <SortButton
              label="Status"
              value="status"
            />
          </div>

          <div className="flex items-center justify-end">
            <SortButton
              label="CPU"
              value="cpu"
              align="right"
            />
          </div>

          <div className="flex items-center justify-end">
            <SortButton
              label="Memory"
              value="memory"
              align="right"
            />
          </div>

          <div className="flex items-center justify-end">
            <SortButton
              label="Disk"
              value="disk"
              align="right"
            />
          </div>

          <div className="flex items-center justify-end">
            <SortButton
              label="Network"
              value="network"
              align="right"
            />
          </div>
        </div>

        {/* TABLE BODY */}

        <div className="min-h-0 flex-1 overflow-auto">

          {filteredProcesses.length === 0 ? (
            <div className="flex h-full min-h-[260px] items-center justify-center p-8">
              <div className="text-center">
                <Search className="mx-auto h-8 w-8 text-slate-600" />

                <p className="mt-3 text-sm font-medium text-slate-400">
                  No matching processes
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Try a different application name or keyword.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.045]">

              {filteredProcesses.map(
                process => {
                  const isSelected =
                    process.id ===
                    selectedProcessId;

                  const cpuPercent =
                    clamp(
                      process.cpu,
                      0,
                      100
                    );

                  const memoryPercent =
                    clamp(
                      (process.memory /
                        1024) *
                        100,
                      0,
                      100
                    );

                  return (
                    <div
                      key={process.id}
                      onClick={() =>
                        setSelectedProcessId(
                          process.id
                        )
                      }
                      onDoubleClick={() =>
                        handleProcessDoubleClick(
                          process.id
                        )
                      }
                      className={`group grid cursor-pointer grid-cols-[minmax(210px,2.6fr)_100px_80px_100px_90px_100px] items-center px-4 py-2.5 transition-all duration-150 sm:grid-cols-[minmax(260px,3fr)_120px_90px_110px_100px_110px] sm:px-5 ${
                        isSelected
                          ? 'bg-sky-500/[0.14]'
                          : 'hover:bg-white/[0.045]'
                      }`}
                    >

                      {/* NAME */}

                      <div className="flex min-w-0 items-center gap-2.5">

                        <div
                          className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
                            isSelected
                              ? 'border-sky-400/30 bg-sky-400/10'
                              : 'border-white/[0.06] bg-white/[0.025] group-hover:border-white/[0.12] group-hover:bg-white/[0.05]'
                          }`}
                        >
                          <AppIcon
                            name={
                              process.iconName
                            }
                            className={`h-4 w-4 ${
                              isSelected
                                ? 'text-sky-300'
                                : 'text-slate-300'
                            }`}
                          />

                          {!process
                            .status ||
                          process.status ===
                            'Running' ? (
                            <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-[#1f1f1f]" />
                          ) : null}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`truncate text-xs font-medium ${
                                isSelected
                                  ? 'text-white'
                                  : 'text-slate-200'
                              }`}
                            >
                              {process.name}
                            </span>

                            {process.isHeavy && (
                              <Zap className="h-3 w-3 shrink-0 text-amber-400/70" />
                            )}
                          </div>

                          <div className="mt-0.5 hidden truncate text-[9px] text-slate-600 sm:block">
                            {process.appId}
                          </div>
                        </div>
                      </div>

                      {/* STATUS */}

                      <div>
                        {process.status ===
                        'Running' ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                            Running
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                            <Pause className="h-3 w-3" />
                            Suspended
                          </span>
                        )}
                      </div>

                      {/* CPU */}

                      <div className="text-right">
                        <span
                          className={`font-mono text-xs ${
                            process.cpu >= 8
                              ? 'text-amber-300'
                              : 'text-slate-300'
                          }`}
                        >
                          {process.cpu.toFixed(
                            1
                          )}
                          %
                        </span>

                        <div className="ml-auto mt-1 hidden h-0.5 w-12 overflow-hidden rounded-full bg-white/[0.05] sm:block">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              process.cpu >=
                              8
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                            style={{
                              width: `${Math.min(
                                cpuPercent *
                                  4,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* MEMORY */}

                      <div className="text-right">
                        <span className="font-mono text-xs text-slate-300">
                          {formatMemory(
                            process.memory
                          )}
                        </span>

                        <div className="ml-auto mt-1 hidden h-0.5 w-12 overflow-hidden rounded-full bg-white/[0.05] sm:block">
                          <div
                            className="h-full rounded-full bg-sky-400 transition-all duration-700"
                            style={{
                              width: `${memoryPercent}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* DISK */}

                      <div className="text-right font-mono text-xs text-slate-400">
                        {process.disk.toFixed(
                          1
                        )}{' '}
                        MB/s
                      </div>

                      {/* NETWORK */}

                      <div className="flex items-center justify-end gap-2">

                        <span className="font-mono text-xs text-slate-400">
                          {formatNetwork(
                            process.network
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();

                            handleEndTask(
                              process.id
                            );
                          }}
                          title="End task"
                          className={`hidden h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-all hover:bg-red-500/15 hover:text-red-400 sm:flex ${
                            isSelected
                              ? 'opacity-100'
                              : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* =================================================
            STATUS BAR
        ================================================= */}

        <div className="flex shrink-0 items-center justify-between border-t border-white/[0.07] bg-[#202020] px-4 py-2 text-[10px] text-slate-500 sm:px-5">

          <div className="flex items-center gap-3">

            <span>
              {filteredProcesses.length}{' '}
              process
              {filteredProcesses.length !==
              1
                ? 'es'
                : ''}
            </span>

            <span className="h-3 w-px bg-white/[0.08]" />

            <span>
              {processes.filter(
                process =>
                  process.status ===
                  'Running'
              ).length}{' '}
              running
            </span>
          </div>

          <div className="flex items-center gap-2">

            <span className="hidden sm:inline">
              Double-click to focus
            </span>

            <span className="h-1 w-1 rounded-full bg-emerald-400" />

            <span className="text-emerald-400">
              Monitoring
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================
          SELECTED PROCESS QUICK INFO
      =================================================== */}

      {selectedProcess && (
        <div className="absolute bottom-12 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 overflow-hidden rounded-xl border border-white/[0.1] bg-[#292929]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl animate-[slideUp_.22s_ease-out]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-400/10">
              <AppIcon
                name={
                  selectedProcess.iconName
                }
                className="h-5 w-5 text-sky-300"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {selectedProcess.name}
              </p>

              <div className="mt-1 flex items-center gap-3 text-[9px] text-slate-500">
                <span>
                  CPU{' '}
                  {selectedProcess.cpu.toFixed(
                    1
                  )}
                  %
                </span>

                <span>
                  {formatMemory(
                    selectedProcess.memory
                  )}
                </span>

                <span>
                  {formatNetwork(
                    selectedProcess.network
                  )}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedProcessId(null)
              }
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/[0.07] hover:text-white"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   LOCAL ANIMATIONS

   These work even if you don't have custom Tailwind
   animations configured.
========================================================= */

const style = document.createElement('style');

style.innerHTML = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 12px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

if (
  typeof document !== 'undefined' &&
  !document.head.querySelector(
    'style[data-system-monitor-animations]'
  )
) {
  style.setAttribute(
    'data-system-monitor-animations',
    'true'
  );

  document.head.appendChild(style);
}