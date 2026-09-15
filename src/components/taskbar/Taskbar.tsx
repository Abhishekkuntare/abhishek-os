import React, { useRef, useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId, TaskbarApp } from '../../types';
import { AppIcon } from '../ui/AppIcon';
import {
  Search,
  Wifi,
  Volume2,
  Battery,
  Bell,
  Sliders,
  ShieldAlert,
  CloudSun,
  Sun,
  Moon,
  Zap,
  VolumeX,
  Sparkles,
  LayoutDashboard,
  Plus,
  Trash2,
  House,
  Keyboard,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export const Taskbar: React.FC = () => {
  const {
    windows,
    activeWindowId,
    openApp,
    minimizeWindow,
    focusWindow,
    isStartMenuOpen,
    setStartMenuOpen,
    isSearchOpen,
    setSearchOpen,
    isNotificationCenterOpen,
    setNotificationCenterOpen,
    notifications,
    settings,
    updateSettings,
    playSystemSound,
    desktops,
    activeDesktopId,
    switchDesktop,
    createDesktop,
    deleteDesktop,
    moveWindowToDesktop,
    isDesktopOverviewOpen,
    setDesktopOverviewOpen,
    taskbarApps,
    reorderTaskbarApps,
    openContextMenu,
    goHome,
  } = useOS();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [draggedAppId, setDraggedAppId] = useState<AppId | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const focusedEditable = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const syncFullscreenState = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreenState);
    syncFullscreenState();
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        const desktopRoot = document.getElementById('abhishek-workstation-os');
        if (!desktopRoot) {
          throw new Error('Desktop root is unavailable');
        }
        await desktopRoot.requestFullscreen();
      }
    } catch (error) {
      console.error('Unable to toggle desktop fullscreen:', error);
    }
  };

  const pressVirtualKey = (key: string) => {
    const active = document.activeElement as HTMLElement | null;
    if (active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA' || active?.isContentEditable) {
      focusedEditable.current = active;
    }
    const target = focusedEditable.current;
    if (!target || !target.isConnected ||
      !(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
    target.focus();

    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      if (key === 'Enter') {
        target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
        target.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
        return;
      }
      const value = target.value;
      let start = target.selectionStart ?? value.length;
      let end = target.selectionEnd ?? start;
      if (key === 'Backspace' && start === end && start > 0) start -= 1;
      const inserted = key === 'Backspace' ? '' : key;
      const nextValue = value.slice(0, start) + inserted + value.slice(end);
      const descriptor = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(target), 'value'
      );
      descriptor?.set?.call(target, nextValue);
      const caret = start + inserted.length;
      target.setSelectionRange(caret, caret);
      target.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        inputType: key === 'Backspace' ? 'deleteContentBackward' : 'insertText',
        data: inserted || null,
      }));
    } else {
      const selection = window.getSelection();
      if (!selection) return;
      const range = selection.rangeCount ? selection.getRangeAt(0) : document.createRange();
      if (!target.contains(range.commonAncestorContainer)) {
        range.selectNodeContents(target);
        range.collapse(false);
      }
      if (key === 'Backspace' && range.collapsed) {
        const container = range.startContainer;
        if (range.startOffset > 0) {
          range.setStart(container, range.startOffset - 1);
        }
      }
      range.deleteContents();
      if (key !== 'Backspace') {
        const text = document.createTextNode(key === 'Enter' ? '\n' : key);
        range.insertNode(text);
        range.setStartAfter(text);
      }
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      target.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        inputType: key === 'Backspace' ? 'deleteContentBackward' : 'insertText',
        data: key === 'Backspace' ? null : key,
      }));
    }
  };

  // Live visitor clock and date
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
      );
      setDateStr(
        now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleAppClick = (appId: AppId) => {
    const existing = windows.find(w => w.appId === appId && w.desktopId === activeDesktopId);
    if (!existing) {
      openApp(appId);
    } else {
      if (activeWindowId === existing.id && !existing.isMinimized) {
        minimizeWindow(existing.id);
      } else {
        focusWindow(existing.id);
      }
    }
  };

  const isAppRunning = (appId: AppId) => windows.some(w => w.appId === appId && w.desktopId === activeDesktopId);
  const isAppFocused = (appId: AppId) =>
    windows.some(w => w.appId === appId && w.id === activeWindowId && !w.isMinimized);
  const visibleApps: TaskbarApp[] = [
    ...taskbarApps,
    ...windows
      .filter(window => window.desktopId === activeDesktopId && !taskbarApps.some(app => app.appId === window.appId))
      .map(window => ({ appId: window.appId, title: window.title, icon: window.iconName }))
      .filter((app, index, list) => list.findIndex(item => item.appId === app.appId) === index),
  ];

  return (
    <footer
      id="windows-taskbar"
      className="fixed bottom-0 left-0 right-0 h-12 z-9000 flex items-center justify-between px-3 acrylic-taskbar select-none transition-all"
      style={{ borderTop: `1px solid ${settings.accentColor}45` }}
    >
      {/* Left side / Windows 11 Widgets & Workstation Brand */}
      <div className="flex items-center space-x-2">
        <button type="button" aria-label="Show desktop" title="Show desktop" onClick={goHome}
          className="group flex h-8 w-8 items-center justify-center rounded-lg text-slate-200 transition-all hover:bg-white/10 active:scale-90">
          <House className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
        </button>
        <button
          type="button"
          onClick={() => openApp('widgets')}
          className="flex items-center gap-2 px-2.5 py-1 rounded-md hover:bg-white/10 text-xs font-medium text-slate-200 transition-colors"
          title="Open Workstation Widgets Board & Weather"
        >
          <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="hidden md:inline text-[11px] font-semibold text-slate-300">28°C Mostly Sunny</span>
        </button>
        <button
          type="button"
          onClick={() => openApp('system-info')}
          className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/10 text-[11px] font-medium text-slate-400 transition-colors"
          title="System Information"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>v2.0</span>
        </button>
      </div>

      {/* Center Taskbar (Windows 11 Centered Alignment) */}
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        <button
          type="button"
          aria-label="Desktop overview"
          onClick={() => setDesktopOverviewOpen(!isDesktopOverviewOpen)}
          className={`p-2 rounded-lg transition-all ${isDesktopOverviewOpen ? 'bg-sky-500/25 text-sky-300 ring-1 ring-sky-400/60' : 'text-slate-300 hover:bg-white/10'}`}
          title="Desktops overview"
        >
          <LayoutDashboard className="w-4 h-4" />
        </button>
        {/* Windows 11 Start Button */}
        <button
          type="button"
          id="taskbar-start-btn"
          aria-label="Start Menu"
          onClick={() => {
            playSystemSound('click');
            setStartMenuOpen(prev => !prev);
            setSearchOpen(false);
            setNotificationCenterOpen(false);
          }}
          className={`relative p-2 rounded-lg transition-all duration-150 group ${
            isStartMenuOpen
              ? 'bg-white/20 ring-1 ring-sky-400'
              : 'hover:bg-white/10 active:scale-95'
          }`}
          title="Start"
        >
          {/* Windows-style 4-tile icon */}
          <div className="grid grid-cols-2 gap-0.5 w-4.5 h-4.5">
            <div className="w-2 h-2 rounded-xs bg-sky-400 group-hover:bg-sky-300 transition-colors" />
            <div className="w-2 h-2 rounded-xs bg-sky-400 group-hover:bg-sky-300 transition-colors" />
            <div className="w-2 h-2 rounded-xs bg-sky-400 group-hover:bg-sky-300 transition-colors" />
            <div className="w-2 h-2 rounded-xs bg-sky-400 group-hover:bg-sky-300 transition-colors" />
          </div>

          {isDesktopOverviewOpen && (
            <div className="desktop-overview absolute bottom-14 left-1/2 -translate-x-1/2 w-[min(760px,calc(100vw-24px))] rounded-2xl border border-white/15 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-2xl">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Your desktops</p>
                  <p className="text-[11px] text-slate-400">Switch workspace without losing your place</p>
                </div>
                <button type="button" onClick={createDesktop} className="flex items-center gap-1 rounded-lg bg-sky-500 px-2.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400">
                  <Plus className="h-3.5 w-3.5" /> New desktop
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {desktops.map(desktop => {
                  const desktopWindows = windows.filter(win => win.desktopId === desktop.id);
                  return (
                    <div key={desktop.id}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        const windowId = e.dataTransfer.getData('text/window-id');
                        if (windowId) moveWindowToDesktop(windowId, desktop.id);
                      }}
                      className={`relative group rounded-xl border p-2 transition-all ${desktop.id === activeDesktopId ? 'border-sky-400/70 bg-sky-400/10' : 'border-white/10 bg-white/[0.04] hover:border-white/25'}`}>
                      <button type="button" onClick={() => switchDesktop(desktop.id)} className="block w-full text-left">
                        <div className={`relative h-20 overflow-hidden rounded-lg bg-gradient-to-br ${desktop.accent} p-2`}>
                          <div className="absolute inset-0 bg-slate-950/45" />
                          <div className="relative grid grid-cols-3 gap-1">
                            {desktopWindows.slice(0, 3).map(win => (
                              <div key={win.id} draggable onDragStart={e => {
                                e.stopPropagation();
                                e.dataTransfer.setData('text/window-id', win.id);
                              }} title={`Drag ${win.title} to another desktop`}
                                className="h-12 rounded bg-slate-900/80 shadow-lg cursor-grab active:cursor-grabbing" />
                            ))}
                            {desktopWindows.length === 0 && <span className="col-span-3 self-center pt-3 text-center text-[10px] text-white/70">Empty workspace</span>}
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-1 pt-2">
                          <span className="text-xs font-semibold text-slate-100">{desktop.name}</span>
                          <span className="text-[10px] text-slate-400">{desktopWindows.length} {desktopWindows.length === 1 ? 'window' : 'windows'}</span>
                        </div>
                        {desktopWindows.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1 px-1">
                            {desktopWindows.map(win => (
                              <span key={win.id} className="max-w-full truncate rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-slate-300" title={win.title}>
                                {win.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                      {desktops.length > 1 && <button type="button" aria-label={`Delete ${desktop.name}`} onClick={() => deleteDesktop(desktop.id)} className="absolute right-6 mt-[-24px] rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-red-500/20 hover:text-red-300 group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </button>

        {/* Search button */}
        <button
          type="button"
          id="taskbar-search-btn"
          aria-label="Search Portfolio"
          onClick={() => {
            playSystemSound('click');
            setSearchOpen(prev => !prev);
            setStartMenuOpen(false);
            setNotificationCenterOpen(false);
          }}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
            isSearchOpen
              ? 'bg-white/20 ring-1 ring-sky-400 text-sky-300'
              : 'hover:bg-white/10 text-slate-300 hover:text-white'
          }`}
          title="Search (Ctrl + K)"
        >
          <Search className="w-4 h-4" />
          <span className="hidden md:inline text-xs font-normal text-slate-400">
            Search...
          </span>
        </button>

        <div className="h-5 w-px bg-white/10 mx-1 hidden sm:block" />

        {/* Pinned / Running Applications */}
        {visibleApps.map(item => {
          const running = isAppRunning(item.appId);
          const focused = isAppFocused(item.appId);

          return (
            <button
              key={item.appId}
              type="button"
              id={`taskbar-app-${item.appId}`}
              onClick={() => handleAppClick(item.appId)}
              onContextMenu={event => {
                event.preventDefault();
                event.stopPropagation();
                openContextMenu(event.clientX, event.clientY, 'taskbar', item.appId);
              }}
              draggable={taskbarApps.some(app => app.appId === item.appId)}
              onDragStart={() => setDraggedAppId(item.appId)}
              onDragOver={event => event.preventDefault()}
              onDrop={() => {
                if (draggedAppId) reorderTaskbarApps(draggedAppId, item.appId);
                setDraggedAppId(null);
              }}
              onDragEnd={() => setDraggedAppId(null)}
              className={`relative p-2 rounded-lg transition-all duration-150 group ${
                focused
                  ? 'bg-white/20 shadow-inner'
                  : running
                  ? 'bg-white/10 hover:bg-white/15'
                  : 'hover:bg-white/10'
              }`}
              title={`${item.title}${taskbarApps.some(app => app.appId === item.appId) ? ' — right-click for options' : ''}`}
            >
              <div className="flex items-center justify-center w-5 h-5 group-hover:scale-110 transition-transform">
                <AppIcon name={item.icon} className="w-4.5 h-4.5 text-slate-200 group-hover:text-white" />
              </div>

              {/* Running indicator pill */}
              {running && (
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-full transition-all ${
                    focused
                      ? 'w-4 h-0.75 bg-sky-400'
                      : 'w-1.5 h-0.75 bg-slate-400 group-hover:w-3 group-hover:bg-slate-200'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right side System Tray (Wi-Fi, Volume, Battery, Clock, Notifications) */}
      <div className="flex items-center space-x-1">
        <button type="button" aria-label="Virtual keyboard" title="Virtual keyboard"
          onMouseDown={event => event.preventDefault()}
          onClick={() => setShowKeyboard(previous => !previous)}
          className={`rounded-lg p-1.5 transition-colors ${showKeyboard ? 'bg-sky-500/25 text-sky-300' : 'text-slate-300 hover:bg-white/10'}`}>
          <Keyboard className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={isFullscreen ? 'Exit fullscreen' : 'Full screen desktop'}
          onClick={() => void toggleFullscreen()}
          className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-cyan-300"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
        {/* Quick Settings pills (Wifi, Volume, Battery) */}
        <div
          className="flex items-center space-x-1.5 px-2 py-1 rounded-md hover:bg-white/10 transition-colors text-slate-300 cursor-pointer"
          onClick={() => setShowVolumePopup(prev => !prev)}
          title="Status: Online, Battery 98%, Audio Active"
        >
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <Volume2 className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5 text-sky-400" />
        </div>

        {/* Windows 11 Quick Settings Popover */}
        {showVolumePopup && (
          <div className="absolute bottom-14 right-4 sm:right-16 w-72 sm:w-80 p-4 rounded-2xl bg-slate-900/95 border border-white/12 shadow-2xl backdrop-blur-2xl z-9999 text-xs space-y-4">
            {/* Quick Action Toggles */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled
                className="p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 bg-sky-500 text-slate-950 font-bold shadow-sm"
              >
                <Moon className="w-4 h-4" />
                <span className="text-[10px]">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
                className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                  settings.soundEffects
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {settings.soundEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="text-[10px]">Sound FX</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ focusMode: !settings.focusMode })}
                className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                  settings.focusMode
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px]">Focus Mode</span>
              </button>
            </div>
            {/* Sliders: Master Volume & Display Brightness */}
            <div className="space-y-3 pt-2 border-t border-white/8">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Master Volume</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{settings.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={e => updateSettings({ volume: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Screen Brightness</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{settings.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={settings.brightness}
                  onChange={e => updateSettings({ brightness: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            {/* Bottom Footer: Open Full Settings */}
            <div className="pt-2 border-t border-white/8 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Battery: 98% (Plugged in)</span>
              <button
                type="button"
                onClick={() => {
                  setShowVolumePopup(false);
                  openApp('settings');
                }}
                className="text-sky-400 hover:text-sky-300 font-semibold text-[11px] transition-colors"
              >
                All Settings →
              </button>
            </div>
          </div>
        )}

        {showKeyboard && (
          <div className="fixed bottom-14 right-3 z-[9500] w-[min(620px,calc(100vw-24px))] rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-500">
              <span>Virtual keyboard</span><span>Focus a text field first</span>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {'1234567890QWERTYUIOPASDFGHJKLZXCVBNM'.split('').map(key => (
                <button key={key} type="button" onMouseDown={event => event.preventDefault()} onClick={() => pressVirtualKey(key)} className="rounded-md bg-white/[0.08] px-2 py-2 text-xs text-slate-200 transition hover:bg-sky-500/30 active:scale-95">{key}</button>
              ))}
              <button type="button" onClick={() => pressVirtualKey(' ')} className="col-span-7 rounded-md bg-white/[0.08] py-2 text-xs text-slate-300 hover:bg-sky-500/30">Space</button>
              <button type="button" onClick={() => pressVirtualKey('Backspace')} className="col-span-3 rounded-md bg-white/[0.08] py-2 text-xs text-slate-300 hover:bg-sky-500/30">Backspace</button>
            </div>
          </div>
        )}

        {/* Date & Time button (opens Notification Center / Calendar) */}
        <button
          type="button"
          id="taskbar-clock-btn"
          aria-label="Open Calendar and Notifications"
          onClick={() => {
            playSystemSound('click');
            setNotificationCenterOpen(prev => !prev);
            setStartMenuOpen(false);
            setSearchOpen(false);
          }}
          className={`flex flex-col items-end px-2 py-0.5 rounded-md text-right transition-colors ${
            isNotificationCenterOpen
              ? 'bg-white/20 text-sky-300'
              : 'hover:bg-white/10 text-slate-300 hover:text-white'
          }`}
          title="Notification Center & Calendar"
        >
          <span className="text-xs font-semibold leading-tight">{timeStr || '12:00 PM'}</span>
          <span className="text-[10px] text-slate-400 leading-tight">{dateStr || '9/13/2026'}</span>
        </button>

        {/* Notification Bell with counter */}
        <button
          type="button"
          id="taskbar-notif-btn"
          aria-label="Notifications"
          onClick={() => {
            playSystemSound('click');
            setNotificationCenterOpen(prev => !prev);
            setStartMenuOpen(false);
            setSearchOpen(false);
          }}
          className={`relative p-1.5 rounded-md transition-colors ${
            isNotificationCenterOpen
              ? 'bg-white/20 text-sky-300'
              : 'hover:bg-white/10 text-slate-300 hover:text-white'
          }`}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sky-500 animate-pulse ring-1 ring-slate-900" />
          )}
        </button>
      </div>
    </footer>
  );
};
