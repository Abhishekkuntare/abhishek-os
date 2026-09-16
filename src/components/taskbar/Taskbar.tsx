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
  CloudSun,
  Sun,
  Moon,
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
import VirtualKeyboard from './VirtualKeyboard';

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
    const syncFullscreenState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', syncFullscreenState);
    syncFullscreenState();

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      const desktopRoot = document.getElementById('abhishek-workstation-os');

      if (!desktopRoot) {
        throw new Error('Desktop root is unavailable');
      }

      await desktopRoot.requestFullscreen();
    } catch (error) {
      console.error('Unable to toggle desktop fullscreen:', error);
    }
  };

  const pressVirtualKey = (key: string) => {
    const active = document.activeElement as HTMLElement | null;

    if (
      active?.tagName === 'INPUT' ||
      active?.tagName === 'TEXTAREA' ||
      active?.isContentEditable
    ) {
      focusedEditable.current = active;
    }

    const target = focusedEditable.current;

    if (
      !target ||
      !target.isConnected ||
      !(
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      )
    ) {
      return;
    }

    target.focus();

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      if (key === 'Enter') {
        target.dispatchEvent(
          new KeyboardEvent('keydown', {
            key,
            bubbles: true,
            cancelable: true,
          }),
        );

        target.dispatchEvent(
          new KeyboardEvent('keyup', {
            key,
            bubbles: true,
          }),
        );

        return;
      }

      const value = target.value;
      let start = target.selectionStart ?? value.length;
      const end = target.selectionEnd ?? start;

      if (key === 'Backspace' && start === end && start > 0) {
        start -= 1;
      }

      const inserted = key === 'Backspace' ? '' : key;
      const nextValue =
        value.slice(0, start) + inserted + value.slice(end);

      const descriptor = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(target),
        'value',
      );

      descriptor?.set?.call(target, nextValue);

      const caret = start + inserted.length;

      target.setSelectionRange(caret, caret);

      target.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          inputType:
            key === 'Backspace'
              ? 'deleteContentBackward'
              : 'insertText',
          data: inserted || null,
        }),
      );
    } else {
      const selection = window.getSelection();

      if (!selection) return;

      const range = selection.rangeCount
        ? selection.getRangeAt(0)
        : document.createRange();

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
        const text = document.createTextNode(
          key === 'Enter' ? '\n' : key,
        );

        range.insertNode(text);
        range.setStartAfter(text);
      }

      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);

      target.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          inputType:
            key === 'Backspace'
              ? 'deleteContentBackward'
              : 'insertText',
          data: key === 'Backspace' ? null : key,
        }),
      );
    }
  };

  /* Live visitor clock and date */
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTimeStr(
        now.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      );

      setDateStr(
        now.toLocaleDateString([], {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        }),
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleAppClick = (appId: AppId) => {
    const existing = windows.find(
      (w) =>
        w.appId === appId &&
        w.desktopId === activeDesktopId,
    );

    if (!existing) {
      openApp(appId);
      return;
    }

    if (
      activeWindowId === existing.id &&
      !existing.isMinimized
    ) {
      minimizeWindow(existing.id);
    } else {
      focusWindow(existing.id);
    }
  };

  const isAppRunning = (appId: AppId) =>
    windows.some(
      (w) =>
        w.appId === appId &&
        w.desktopId === activeDesktopId,
    );

  const isAppFocused = (appId: AppId) =>
    windows.some(
      (w) =>
        w.appId === appId &&
        w.id === activeWindowId &&
        !w.isMinimized,
    );

  const visibleApps: TaskbarApp[] = [
    ...taskbarApps,
    ...windows
      .filter(
        (window) =>
          window.desktopId === activeDesktopId &&
          !taskbarApps.some(
            (app) => app.appId === window.appId,
          ),
      )
      .map((window) => ({
        appId: window.appId,
        title: window.title,
        icon: window.iconName,
      }))
      .filter(
        (app, index, list) =>
          list.findIndex(
            (item) => item.appId === app.appId,
          ) === index,
      ),
  ];

  return (
  <>
  <footer
      id="windows-taskbar"
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-[9000]
        h-12
        sm:h-13
        acrylic-taskbar
        select-none
        overflow-visible
      "
      style={{
        borderTop: `1px solid ${settings.accentColor}45`,
      }}
    >
      {/* 
        IMPORTANT:
        The scroll container is a sibling of every popup.
        This prevents popup clipping and avoids nested buttons.
      */}
      <div
        className="
          h-full
          w-full
          overflow-x-auto
          overflow-y-visible
          overscroll-x-contain
          touch-pan-x
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <div
          className="
            flex
            h-full
            min-w-max
            items-center
            justify-between
            gap-2
            px-2
            sm:px-3
            lg:gap-3
            lg:px-4
            lg:min-w-full
          "
        >
          {/* LEFT SIDE */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Show desktop"
              title="Show desktop"
              onClick={goHome}
              className="
                group
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-slate-200
                transition-all
                hover:bg-white/10
                active:scale-90
              "
            >
              <House className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </button>

            <button
              type="button"
              onClick={() => openApp('widgets')}
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-md
                px-2
                py-1
                text-xs
                font-medium
                text-slate-200
                transition-colors
                hover:bg-white/10
                sm:px-2.5
              "
              title="Open Workstation Widgets Board & Weather"
            >
              <CloudSun className="h-4 w-4 shrink-0 text-amber-400" />

              <span className="hidden md:inline text-[11px] font-semibold text-slate-300">
                28°C Mostly Sunny
              </span>
            </button>

            <button
              type="button"
              onClick={() => openApp('system-info')}
              className="
                hidden
                shrink-0
                items-center
                gap-1.5
                rounded-md
                px-2
                py-1
                text-[11px]
                font-medium
                text-slate-400
                transition-colors
                hover:bg-white/10
                lg:flex
              "
              title="System Information"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>v2.0</span>
            </button>
          </div>

          {/* CENTER / APPS */}
          <div
            className="
              flex
              shrink-0
              items-center
              gap-1
              sm:gap-1.5
            "
          >
            {/* Desktop Overview Button */}
            <button
              type="button"
              aria-label="Desktop overview"
              onClick={() => {
                setDesktopOverviewOpen(
                  !isDesktopOverviewOpen,
                );
              }}
              className={`
                relative
                shrink-0
                rounded-lg
                p-2
                transition-all
                ${
                  isDesktopOverviewOpen
                    ? 'bg-sky-500/25 text-sky-300 ring-1 ring-sky-400/60'
                    : 'text-slate-300 hover:bg-white/10'
                }
              `}
              title="Desktops overview"
            >
              <LayoutDashboard className="h-4 w-4" />
            </button>

            {/* Start Button */}
            <button
              type="button"
              id="taskbar-start-btn"
              aria-label="Start Menu"
              onClick={() => {
                playSystemSound('click');
                setStartMenuOpen(
                  (previous) => !previous,
                );
                setSearchOpen(false);
                setNotificationCenterOpen(false);
                setDesktopOverviewOpen(false);
              }}
              className={`
                relative
                shrink-0
                rounded-lg
                p-2
                transition-all
                duration-150
                group
                ${
                  isStartMenuOpen
                    ? 'bg-white/20 ring-1 ring-sky-400'
                    : 'hover:bg-white/10 active:scale-95'
                }
              `}
              title="Start"
            >
              <div className="grid h-4 w-4 grid-cols-2 gap-0.5">
                <div className="h-2 w-2 rounded-[2px] bg-sky-400 transition-colors group-hover:bg-sky-300" />
                <div className="h-2 w-2 rounded-[2px] bg-sky-400 transition-colors group-hover:bg-sky-300" />
                <div className="h-2 w-2 rounded-[2px] bg-sky-400 transition-colors group-hover:bg-sky-300" />
                <div className="h-2 w-2 rounded-[2px] bg-sky-400 transition-colors group-hover:bg-sky-300" />
              </div>
            </button>

            {/* Search */}
            <button
              type="button"
              id="taskbar-search-btn"
              aria-label="Search Portfolio"
              onClick={() => {
                playSystemSound('click');
                setSearchOpen(
                  (previous) => !previous,
                );
                setStartMenuOpen(false);
                setNotificationCenterOpen(false);
                setDesktopOverviewOpen(false);
              }}
              className={`
                flex
                shrink-0
                items-center
                gap-2
                rounded-lg
                px-2.5
                py-1.5
                transition-colors
                ${
                  isSearchOpen
                    ? 'bg-white/20 text-sky-300 ring-1 ring-sky-400'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }
              `}
              title="Search (Ctrl + K)"
            >
              <Search className="h-4 w-4" />

              <span className="hidden text-xs font-normal text-slate-400 md:inline">
                Search...
              </span>
            </button>

            <div className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />

            {/* Pinned / Running Apps */}
            {visibleApps.map((item) => {
              const running = isAppRunning(item.appId);
              const focused = isAppFocused(item.appId);

              return (
                <button
                  key={item.appId}
                  type="button"
                  id={`taskbar-app-${item.appId}`}
                  onClick={() =>
                    handleAppClick(item.appId)
                  }
                  onContextMenu={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    openContextMenu(
                      event.clientX,
                      event.clientY,
                      'taskbar',
                      item.appId,
                    );
                  }}
                  draggable={taskbarApps.some(
                    (app) => app.appId === item.appId,
                  )}
                  onDragStart={() =>
                    setDraggedAppId(item.appId)
                  }
                  onDragOver={(event) =>
                    event.preventDefault()
                  }
                  onDrop={() => {
                    if (draggedAppId) {
                      reorderTaskbarApps(
                        draggedAppId,
                        item.appId,
                      );
                    }

                    setDraggedAppId(null);
                  }}
                  onDragEnd={() =>
                    setDraggedAppId(null)
                  }
                  className={`
                    relative
                    shrink-0
                    rounded-lg
                    p-2
                    transition-all
                    duration-150
                    group
                    ${
                      focused
                        ? 'bg-white/20 shadow-inner'
                        : running
                          ? 'bg-white/10 hover:bg-white/15'
                          : 'hover:bg-white/10'
                    }
                  `}
                  title={`${item.title}${
                    taskbarApps.some(
                      (app) =>
                        app.appId === item.appId,
                    )
                      ? ' — right-click for options'
                      : ''
                  }`}
                >
                  <div className="flex h-5 w-5 items-center justify-center">
                    <AppIcon
                      name={item.icon}
                      className="h-4.5 w-4.5 text-slate-200 transition-transform group-hover:scale-110 group-hover:text-white"
                    />
                  </div>

                  {running && (
                    <span
                      className={`
                        absolute
                        bottom-0.5
                        left-1/2
                        -translate-x-1/2
                        rounded-full
                        transition-all
                        ${
                          focused
                            ? 'h-0.75 w-4 bg-sky-400'
                            : 'h-0.75 w-1.5 bg-slate-400 group-hover:w-3 group-hover:bg-slate-200'
                        }
                      `}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex shrink-0 items-center gap-1">
            {/* Virtual Keyboard */}
            <button
              type="button"
              aria-label="Virtual keyboard"
              title="Virtual keyboard"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() =>
                setShowKeyboard(
                  (previous) => !previous,
                )
              }
              className={`
                rounded-lg
                p-1.5
                transition-colors
                ${
                  showKeyboard
                    ? 'bg-sky-500/25 text-sky-300'
                    : 'text-slate-300 hover:bg-white/10'
                }
              `}
            >
              <Keyboard className="h-4 w-4" />
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              aria-label={
                isFullscreen
                  ? 'Exit fullscreen'
                  : 'Enter fullscreen'
              }
              title={
                isFullscreen
                  ? 'Exit fullscreen'
                  : 'Full screen desktop'
              }
              onClick={() =>
                void toggleFullscreen()
              }
              className="
                rounded-lg
                p-1.5
                text-slate-300
                transition-colors
                hover:bg-white/10
                hover:text-cyan-300
              "
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>

            {/* Quick Settings */}
            <button
              type="button"
              aria-label="Quick settings"
              className="
                flex
                shrink-0
                cursor-pointer
                items-center
                gap-1.5
                rounded-md
                px-2
                py-1
                text-slate-300
                transition-colors
                hover:bg-white/10
              "
              onClick={() =>
                setShowVolumePopup(
                  (previous) => !previous,
                )
              }
              title="Status: Online, Battery 98%, Audio Active"
            >
              <Wifi className="h-3.5 w-3.5 text-emerald-400" />
              <Volume2 className="h-3.5 w-3.5" />
              <Battery className="h-3.5 w-3.5 text-sky-400" />
            </button>

            {/* Clock */}
            <button
              type="button"
              id="taskbar-clock-btn"
              aria-label="Open Calendar and Notifications"
              onClick={() => {
                playSystemSound('click');

                setNotificationCenterOpen(
                  (previous) => !previous,
                );

                setStartMenuOpen(false);
                setSearchOpen(false);
              }}
              className={`
                flex
                shrink-0
                flex-col
                items-end
                rounded-md
                px-2
                py-0.5
                text-right
                transition-colors
                ${
                  isNotificationCenterOpen
                    ? 'bg-white/20 text-sky-300'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }
              `}
              title="Notification Center & Calendar"
            >
              <span className="text-xs font-semibold leading-tight">
                {timeStr || '12:00 PM'}
              </span>

              <span className="text-[10px] leading-tight text-slate-400">
                {dateStr || '9/13/2026'}
              </span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              id="taskbar-notif-btn"
              aria-label="Notifications"
              onClick={() => {
                playSystemSound('click');

                setNotificationCenterOpen(
                  (previous) => !previous,
                );

                setStartMenuOpen(false);
                setSearchOpen(false);
              }}
              className={`
                relative
                shrink-0
                rounded-md
                p-1.5
                transition-colors
                ${
                  isNotificationCenterOpen
                    ? 'bg-white/20 text-sky-300'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }
              `}
              title="Notifications"
            >
              <Bell className="h-4 w-4" />

              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-sky-500 ring-1 ring-slate-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 
        DESKTOP OVERVIEW POPUP
        IMPORTANT: This is OUTSIDE the Start <button>.
        This fixes:
        "<button> cannot be a descendant of <button>"
      */}
      {isDesktopOverviewOpen && (
        <div
          className="
            desktop-overview
            fixed
            bottom-14
            left-1/2
            z-[9998]
            w-[min(760px,calc(100vw-24px))]
            -translate-x-1/2
            rounded-2xl
            border
            border-white/15
            bg-slate-950/90
            p-4
            shadow-2xl
            backdrop-blur-2xl
          "
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">
                Your desktops
              </p>

              <p className="text-[11px] text-slate-400">
                Switch workspace without losing your place
              </p>
            </div>

            <button
              type="button"
              onClick={createDesktop}
              className="
                flex
                shrink-0
                items-center
                gap-1
                rounded-lg
                bg-sky-500
                px-2.5
                py-1.5
                text-xs
                font-semibold
                text-slate-950
                transition-colors
                hover:bg-sky-400
                active:scale-95
              "
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New desktop</span>
            </button>
          </div>

          <div className="grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
            {desktops.map((desktop) => {
              const desktopWindows = windows.filter(
                (win) =>
                  win.desktopId === desktop.id,
              );

              return (
                <div
                  key={desktop.id}
                  onDragOver={(event) =>
                    event.preventDefault()
                  }
                  onDrop={(event) => {
                    event.preventDefault();

                    const windowId =
                      event.dataTransfer.getData(
                        'text/window-id',
                      );

                    if (windowId) {
                      moveWindowToDesktop(
                        windowId,
                        desktop.id,
                      );
                    }
                  }}
                  className={`
                    group
                    relative
                    rounded-xl
                    border
                    p-2
                    transition-all
                    ${
                      desktop.id === activeDesktopId
                        ? 'border-sky-400/70 bg-sky-400/10'
                        : 'border-white/10 bg-white/[0.04] hover:border-white/25'
                    }
                  `}
                >
                  <button
                    type="button"
                    onClick={() =>
                      switchDesktop(desktop.id)
                    }
                    className="block w-full text-left"
                  >
                    <div
                      className={`
                        relative
                        h-20
                        overflow-hidden
                        rounded-lg
                        bg-gradient-to-br
                        ${desktop.accent}
                        p-2
                      `}
                    >
                      <div className="absolute inset-0 bg-slate-950/45" />

                      <div className="relative grid grid-cols-3 gap-1">
                        {desktopWindows
                          .slice(0, 3)
                          .map((win) => (
                            <div
                              key={win.id}
                              draggable
                              onDragStart={(event) => {
                                event.stopPropagation();

                                event.dataTransfer.setData(
                                  'text/window-id',
                                  win.id,
                                );
                              }}
                              title={`Drag ${win.title} to another desktop`}
                              className="
                                h-12
                                cursor-grab
                                rounded
                                bg-slate-900/80
                                shadow-lg
                                active:cursor-grabbing
                              "
                            />
                          ))}

                        {desktopWindows.length === 0 && (
                          <span className="col-span-3 self-center pt-3 text-center text-[10px] text-white/70">
                            Empty workspace
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1 pt-2">
                      <span className="text-xs font-semibold text-slate-100">
                        {desktop.name}
                      </span>

                      <span className="text-[10px] text-slate-400">
                        {desktopWindows.length}{' '}
                        {desktopWindows.length === 1
                          ? 'window'
                          : 'windows'}
                      </span>
                    </div>

                    {desktopWindows.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1 px-1">
                        {desktopWindows.map((win) => (
                          <span
                            key={win.id}
                            className="
                              max-w-full
                              truncate
                              rounded
                              bg-white/10
                              px-1.5
                              py-0.5
                              text-[9px]
                              text-slate-300
                            "
                            title={win.title}
                          >
                            {win.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>

                  {desktops.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Delete ${desktop.name}`}
                      onClick={() =>
                        deleteDesktop(desktop.id)
                      }
                      className="
                        absolute
                        right-2
                        top-2
                        rounded
                        p-1
                        text-slate-400
                        opacity-0
                        transition-opacity
                        hover:bg-red-500/20
                        hover:text-red-300
                        group-hover:opacity-100
                      "
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUICK SETTINGS POPUP */}
      {showVolumePopup && (
        <div
          className="
            fixed
            bottom-14
            right-3
            z-[9999]
            w-[min(320px,calc(100vw-24px))]
            rounded-2xl
            border
            border-white/10
            bg-slate-900/95
            p-4
            text-xs
            shadow-2xl
            backdrop-blur-2xl
          "
        >
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-1
                rounded-xl
                bg-sky-500
                p-2.5
                font-bold
                text-slate-950
                shadow-sm
              "
            >
              <Moon className="h-4 w-4" />
              <span className="text-[10px]">
                Dark Mode
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                updateSettings({
                  soundEffects:
                    !settings.soundEffects,
                })
              }
              className={`
                flex
                flex-col
                items-center
                justify-center
                gap-1
                rounded-xl
                p-2.5
                transition-all
                ${
                  settings.soundEffects
                    ? 'bg-sky-500 font-bold text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }
              `}
            >
              {settings.soundEffects ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}

              <span className="text-[10px]">
                Sound FX
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                updateSettings({
                  focusMode: !settings.focusMode,
                })
              }
              className={`
                flex
                flex-col
                items-center
                justify-center
                gap-1
                rounded-xl
                p-2.5
                transition-all
                ${
                  settings.focusMode
                    ? 'bg-sky-500 font-bold text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }
              `}
            >
              <Sparkles className="h-4 w-4" />

              <span className="text-[10px]">
                Focus Mode
              </span>
            </button>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-3">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                  <Volume2 className="h-3.5 w-3.5 text-sky-400" />
                  <span>Master Volume</span>
                </span>

                <span className="font-mono text-[11px] text-slate-400">
                  {settings.volume}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(event) =>
                  updateSettings({
                    volume: Number(
                      event.target.value,
                    ),
                  })
                }
                className="
                  h-1.5
                  w-full
                  cursor-pointer
                  appearance-none
                  rounded-lg
                  bg-slate-700
                  accent-sky-400
                "
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Screen Brightness</span>
                </span>

                <span className="font-mono text-[11px] text-slate-400">
                  {settings.brightness}%
                </span>
              </div>

              <input
                type="range"
                min="30"
                max="100"
                value={settings.brightness}
                onChange={(event) =>
                  updateSettings({
                    brightness: Number(
                      event.target.value,
                    ),
                  })
                }
                className="
                  h-1.5
                  w-full
                  cursor-pointer
                  appearance-none
                  rounded-lg
                  bg-slate-700
                  accent-amber-400
                "
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-[10px] text-slate-500">
              Battery: 98% (Plugged in)
            </span>

            <button
              type="button"
              onClick={() => {
                setShowVolumePopup(false);
                openApp('settings');
              }}
              className="
                text-[11px]
                font-semibold
                text-sky-400
                transition-colors
                hover:text-sky-300
              "
            >
              All Settings →
            </button>
          </div>
        </div>
      )}

      {/* VIRTUAL KEYBOARD */}
      {/* {showKeyboard && (
     
   <VirtualKeyboard
  isOpen={showKeyboard}
  onClose={() => setShowKeyboard(false)}
  onKeyPress={pressVirtualKey}
/>
      )} */}
    </footer>
 <VirtualKeyboard
  isOpen={showKeyboard}
  onClose={() => setShowKeyboard(false)}
  onKeyPress={pressVirtualKey}
/>
 </>

  );
};
