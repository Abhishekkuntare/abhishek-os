import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Zap,
  Clock,
  HardDrive,
  Wifi,
  Layers,
  Cpu,
  RefreshCw,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { getAllVFSFiles } from '../../lib/vfs';

export const PerformanceCenterApp: React.FC = () => {
  const { windows } = useOS();
  const [fps, setFps] = useState<number>(60);
  const [timingMetrics, setTimingMetrics] = useState<{
    pageLoadTime: number | null;
    domContentLoaded: number | null;
    ttfb: number | null;
    fcp: number | null;
  }>({
    pageLoadTime: null,
    domContentLoaded: null,
    ttfb: null,
    fcp: null,
  });

  const [memoryMetric, setMemoryMetric] = useState<{
    usedJSHeapSize: number | null;
    totalJSHeapSize: number | null;
  }>({
    usedJSHeapSize: null,
    totalJSHeapSize: null,
  });

  const [networkInfo, setNetworkInfo] = useState<{
    online: boolean;
    effectiveType: string;
    downlink: number | null;
  }>({
    online: true,
    effectiveType: '4g',
    downlink: null,
  });

  const [vfsStats, setVfsStats] = useState<{ count: number; totalBytes: number }>({
    count: 0,
    totalBytes: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fpsHistoryRef = useRef<number[]>(new Array(40).fill(60));

  // Collect Navigation Timing and Web Vitals
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.performance) {
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navEntries.length > 0) {
          const nav = navEntries[0];
          setTimingMetrics({
            pageLoadTime: nav.loadEventEnd > 0 ? Math.round(nav.loadEventEnd - nav.startTime) : null,
            domContentLoaded: nav.domContentLoadedEventEnd > 0 ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : null,
            ttfb: nav.responseStart > 0 ? Math.round(nav.responseStart - nav.requestStart) : null,
            fcp: null,
          });
        }

        // FCP observer
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(p => p.name === 'first-contentful-paint');
        if (fcpEntry) {
          setTimingMetrics(prev => ({ ...prev, fcp: Math.round(fcpEntry.startTime) }));
        }

        // Memory (Chromium)
        const perfWithMem = performance as any;
        if (perfWithMem.memory) {
          setMemoryMetric({
            usedJSHeapSize: Math.round(perfWithMem.memory.usedJSHeapSize / (1024 * 1024)),
            totalJSHeapSize: Math.round(perfWithMem.memory.totalJSHeapSize / (1024 * 1024)),
          });
        } else {
          setMemoryMetric({ usedJSHeapSize: null, totalJSHeapSize: null });
        }
      }

      // Network
      if (typeof navigator !== 'undefined') {
        const conn = (navigator as any).connection;
        setNetworkInfo({
          online: navigator.onLine,
          effectiveType: conn?.effectiveType || '4g',
          downlink: conn?.downlink || 10,
        });
      }

      // VFS files
      getAllVFSFiles().then(files => {
        const total = files.reduce((acc, f) => acc + (f.size || 0), 0);
        setVfsStats({ count: files.length, totalBytes: total });
      });
    } catch (e) {
      console.warn('Telemetry collection notice:', e);
    }
  }, []);

  // Live FPS Monitor
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measure = (now: number) => {
      frameCount++;
      if (now - lastTime >= 500) {
        const currentFps = Math.min(60, Math.round((frameCount * 1000) / (now - lastTime)));
        setFps(currentFps);
        fpsHistoryRef.current = [...fpsHistoryRef.current.slice(1), currentFps];

        // Draw sparkline
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            // Draw grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();

            // Draw line
            ctx.strokeStyle = currentFps >= 50 ? '#38bdf8' : '#fbbf24';
            ctx.lineWidth = 2;
            ctx.beginPath();
            const step = w / (fpsHistoryRef.current.length - 1);
            fpsHistoryRef.current.forEach((val, i) => {
              const y = h - (val / 60) * (h - 6) - 3;
              if (i === 0) ctx.moveTo(0, y);
              else ctx.lineTo(i * step, y);
            });
            ctx.stroke();
          }
        }

        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 select-none overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Performance Center</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                Live Telemetry
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Real browser metrics, Web Vitals, and runtime memory monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800 border border-white/10 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-slate-200 font-bold">{fps} FPS</span>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Core Web Vitals Row */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Core Web Vitals & Navigation Timings</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-white/10">
              <span className="text-[11px] text-slate-400">TTFB (Server Latency)</span>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                {timingMetrics.ttfb !== null ? `${timingMetrics.ttfb} ms` : 'Unavailable'}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Measured when browser exposes timing</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-white/10">
              <span className="text-[11px] text-slate-400">DOM Ready</span>
              <div className="text-lg font-bold font-mono text-sky-400 mt-1">
                {timingMetrics.domContentLoaded !== null ? `${timingMetrics.domContentLoaded} ms` : 'Unavailable'}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Actual navigation timing</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-white/10">
              <span className="text-[11px] text-slate-400">Full Page Load</span>
              <div className="text-lg font-bold font-mono text-indigo-400 mt-1">
                {timingMetrics.pageLoadTime !== null ? `${timingMetrics.pageLoadTime} ms` : 'Unavailable'}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Actual navigation timing</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-white/10">
              <span className="text-[11px] text-slate-400">FCP (First Contentful Paint)</span>
              <div className="text-lg font-bold font-mono text-teal-400 mt-1">
                {timingMetrics.fcp !== null ? `${timingMetrics.fcp} ms` : 'Unavailable'}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Measured when supported</span>
            </div>
          </div>
        </div>

        {/* Live FPS Sparkline Graph */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Display Refresh & Smoothness
              </span>
            </div>
            <span className="text-xs font-mono text-sky-400">{fps} Frames / Sec</span>
          </div>
          <canvas
            ref={canvasRef}
            width={600}
            height={70}
            className="w-full h-16 rounded-lg bg-slate-950 border border-white/5"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>-20s</span>
            <span>-10s</span>
            <span>Live (Real-Time RAF)</span>
          </div>
        </div>

        {/* Runtime Memory & Virtual Filesystem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Memory / Heap */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <span>JavaScript Heap Memory</span>
              </div>
              <span className="text-xs font-mono text-purple-300">
                {memoryMetric.usedJSHeapSize !== null ? `${memoryMetric.usedJSHeapSize} MB / ${memoryMetric.totalJSHeapSize} MB` : 'Unavailable'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-sky-400 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    memoryMetric.usedJSHeapSize !== null && memoryMetric.totalJSHeapSize ? Math.round((memoryMetric.usedJSHeapSize / memoryMetric.totalJSHeapSize) * 100) : 0
                  )}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Chromium-only heap telemetry; a qualitative performance score is intentionally not claimed.
            </p>
          </div>

          {/* OS Windows & VFS Storage */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Active Windows & VFS Store</span>
              </div>
              <span className="text-xs font-mono text-sky-300">
                {windows.length} Active Windows
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">VFS Files Indexed</span>
                <span className="font-bold text-white font-mono">{vfsStats.count} documents</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">VFS Storage Size</span>
                <span className="font-bold text-white font-mono">
                  {(vfsStats.totalBytes / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Network and Hardware Specs */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>Connection: {networkInfo.online ? 'Online' : 'Offline'} ({networkInfo.effectiveType.toUpperCase()})</span>
          </div>
          <div>Hardware Concurrency: {typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8} Cores</div>
          <div>Screen: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight} (${window.devicePixelRatio}x)` : '1920x1080'}</div>
        </div>
      </div>
    </div>
  );
};
