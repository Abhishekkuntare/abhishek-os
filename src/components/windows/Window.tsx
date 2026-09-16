import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Square, Copy, X, Grid2X2, PanelLeft, PanelRight, PanelTop, PanelBottom, Group, MonitorCog } from 'lucide-react';
import { WindowSnap, WindowState } from '../../types';
import { useOS } from '../../context/OSContext';
import { AppIcon } from '../ui/AppIcon';

interface WindowProps {
  win: WindowState;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ win, children }) => {
  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowPosition,
    updateWindowSize,
    snapWindow,
    toggleWindowGroup,
    updateSettings,
    settings,
  } = useOS();

  const isActive = activeWindowId === win.id;
  const isMinimized = win.isMinimized;
  const isMaximized = win.isMaximized;

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isSnapMenuOpen, setIsSnapMenuOpen] = useState(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initialX: number; initialY: number }>({
    mouseX: 0,
    mouseY: 0,
    initialX: 0,
    initialY: 0,
  });

  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; initialW: number; initialH: number }>({
    mouseX: 0,
    mouseY: 0,
    initialW: 0,
    initialH: 0,
  });

  // Dragging Title Bar
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    focusWindow(win.id);
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: win.position.x,
      initialY: win.position.y,
    };
  };

  // Touch drag for tablets
  const handleTitleTouchStart = (e: React.TouchEvent) => {
    if (isMaximized) return;
    if ((e.target as HTMLElement).closest('button')) return;
    const touch = e.touches[0];
    focusWindow(win.id);
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      initialX: win.position.x,
      initialY: win.position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      if (isDragging && !isMaximized) {
        const deltaX = e.clientX - dragStartRef.current.mouseX;
        const deltaY = e.clientY - dragStartRef.current.mouseY;
        const newX = Math.max(10, Math.min(window.innerWidth - 100, dragStartRef.current.initialX + deltaX));
        const newY = Math.max(10, Math.min(window.innerHeight - 80, dragStartRef.current.initialY + deltaY));
        updateWindowPosition(win.id, { x: newX, y: newY });
      }

      if (isResizing && !isMaximized) {
        const deltaW = e.clientX - resizeStartRef.current.mouseX;
        const deltaH = e.clientY - resizeStartRef.current.mouseY;
        const newW = Math.max(340, Math.min(window.innerWidth - 20, resizeStartRef.current.initialW + deltaW));
        const newH = Math.max(260, Math.min(window.innerHeight - 60, resizeStartRef.current.initialH + deltaH));
        updateWindowSize(win.id, { width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      if (isDragging && !isMaximized) {
        const { x, y } = lastPointerRef.current;
        const edge = 24;
        const nearLeft = x <= edge;
        const nearRight = x >= window.innerWidth - edge;
        const nearTop = y <= edge;
        const nearBottom = y >= window.innerHeight - 56;
        let nextSnap: WindowSnap | null = null;
        if (nearTop && nearLeft) nextSnap = 'top-left';
        else if (nearTop && nearRight) nextSnap = 'top-right';
        else if (nearBottom && nearLeft) nextSnap = 'bottom-left';
        else if (nearBottom && nearRight) nextSnap = 'bottom-right';
        else if (nearLeft) nextSnap = 'left';
        else if (nearRight) nextSnap = 'right';
        else if (nearTop) nextSnap = 'top';
        else if (nearBottom) nextSnap = 'bottom';
        if (nextSnap) snapWindow(win.id, nextSnap);
      }
      setIsDragging(false);
      setIsResizing(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && !isMaximized) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - dragStartRef.current.mouseX;
        const deltaY = touch.clientY - dragStartRef.current.mouseY;
        const newX = Math.max(0, Math.min(window.innerWidth - 80, dragStartRef.current.initialX + deltaX));
        const newY = Math.max(0, Math.min(window.innerHeight - 60, dragStartRef.current.initialY + deltaY));
        updateWindowPosition(win.id, { x: newX, y: newY });
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, isResizing, isMaximized, win.id, updateWindowPosition, updateWindowSize, snapWindow]);

  // Resize handler
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(win.id);
    setIsResizing(true);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialW: win.size.width,
      initialH: win.size.height,
    };
  };

  return (
    <motion.div
      id={`window-${win.id}`}
      initial={settings.animationsEnabled ? { opacity: 0, scale: 0.88, y: 18, filter: 'blur(8px)' } : false}
      animate={settings.animationsEnabled
        ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
        : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      exit={settings.animationsEnabled
        ? { opacity: 0, scale: 0.88, y: 18, filter: 'blur(8px)' }
        : { opacity: 0 }}
      transition={settings.animationsEnabled
        ? { type: 'spring', stiffness: 380, damping: 30, mass: 0.72 }
        : { duration: 0 }}
      layout
      onMouseDown={() => focusWindow(win.id)}
      onTouchStart={() => focusWindow(win.id)}
      style={{
        zIndex: win.zIndex,
        ...(isMaximized
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: 'calc(100vh - 48px)', // Leave room for bottom taskbar
              borderRadius: 0,
            }
          : {
              position: 'fixed',
              top: `${win.position.y}px`,
              left: `${win.position.x}px`,
              width: `${win.size.width}px`,
              height: `${win.size.height}px`,
            }),
      }}
      className={`flex flex-col select-none overflow-hidden transition-shadow duration-200 ${
        isMaximized ? 'rounded-none' : settings.windowMode === 'macos' ? 'rounded-2xl' : 'rounded-xl'
      } ${
        isActive
          ? 'shadow-[0_20px_50px_rgba(0,0,0,0.65)] ring-1 ring-white/20'
          : 'shadow-[0_10px_30px_rgba(0,0,0,0.45)] ring-1 ring-white/10 opacity-95'
      } ${
        settings.glassBlurEnabled
          ? 'bg-slate-900/90 backdrop-blur-2xl'
          : 'bg-slate-900'
      }`}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
        onDoubleClick={() => maximizeWindow(win.id)}
        className={`relative h-10 px-3 flex items-center justify-between border-b transition-colors ${
          isActive
            ? 'bg-slate-800/80 border-white/12 text-slate-100'
            : 'bg-slate-900/80 border-white/5 text-slate-400'
        } ${!isMaximized ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        {/* App Title & Icon */}
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="flex items-center justify-center w-5 h-5 rounded text-sky-400">
            <AppIcon name={win.iconName} className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold tracking-wide truncate">
            {win.title}
          </span>
          {win.groupId && <span className="rounded-full bg-sky-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300">grouped</span>}
        </div>

        {/* Window Controls (Minimize, Maximize/Restore, Close) */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            aria-label="Window snap layouts"
            title="Snap layouts"
            onClick={(e) => {
              e.stopPropagation();
              setIsSnapMenuOpen(previous => !previous);
            }}
            className="w-8 h-7 flex items-center justify-center rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <Grid2X2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label={win.groupId ? 'Ungroup window' : 'Group with another window'}
            title={win.groupId ? 'Ungroup window' : 'Group with another window'}
            onClick={(e) => {
              e.stopPropagation();
              toggleWindowGroup(win.id);
            }}
            className={`w-8 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors ${win.groupId ? 'text-sky-300' : 'text-slate-300 hover:text-white'}`}
          >
            <Group className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            id={`win-min-${win.id}`}
            aria-label="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            className="w-8 h-7 flex items-center justify-center rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            id={`win-max-${win.id}`}
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.id);
            }}
            className="w-8 h-7 flex items-center justify-center rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            {isMaximized ? (
              <Copy className="w-3 h-3 rotate-180" />
            ) : (
              <Square className="w-3 h-3" />
            )}
          </button>

          <button
            type="button"
            id={`win-close-${win.id}`}
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            className="w-9 h-7 flex items-center justify-center rounded hover:bg-red-500 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {isSnapMenuOpen && (
          <div
            className="absolute right-2 top-11 z-50 w-56 rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              <span>Snap layout</span>
              <button
                type="button"
                className="flex items-center gap-1 rounded px-1.5 py-1 text-[9px] text-slate-400 hover:bg-white/10 hover:text-white"
                title="Change window behavior"
                onClick={() => updateSettings({ windowMode: settings.windowMode === 'windows' ? 'macos' : 'windows' })}
              >
                <MonitorCog className="h-3 w-3" /> {settings.windowMode === 'windows' ? 'Windows' : 'macOS'}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {([
                ['top-left', PanelTop, 'Top left'],
                ['top', PanelTop, 'Top half'],
                ['top-right', PanelTop, 'Top right'],
                ['left', PanelLeft, 'Left half'],
                ['right', PanelRight, 'Right half'],
                ['bottom-left', PanelBottom, 'Bottom left'],
                ['bottom', PanelBottom, 'Bottom half'],
                ['bottom-right', PanelBottom, 'Bottom right'],
              ] as const).map(([layout, Icon, label]) => (
                <button
                  key={layout}
                  type="button"
                  title={label}
                  aria-label={label}
                  onClick={() => {
                    snapWindow(win.id, layout);
                    setIsSnapMenuOpen(false);
                  }}
                  className={`flex h-9 items-center justify-center rounded-lg transition-colors ${win.snap === layout ? 'bg-sky-400/20 text-sky-300' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-950/70 text-slate-100">
        {children}
      </div>

      {/* Resize Grip Handle */}
      {!isMaximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 z-30 opacity-40 hover:opacity-100"
          title="Resize window"
        >
          <svg className="w-2.5 h-2.5 text-slate-400" viewBox="0 0 6 6" fill="currentColor">
            <circle cx="5" cy="5" r="0.75" />
            <circle cx="5" cy="2.5" r="0.75" />
            <circle cx="2.5" cy="5" r="0.75" />
          </svg>
        </div>
      )}
    </motion.div>
  );
};
