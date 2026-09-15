import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useOS } from '../../context/OSContext';
import {
  Bell,
  Trash2,
  CheckCheck,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Moon,
  Volume2,
  Shield,
  Sparkles,
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const {
    isNotificationCenterOpen,
    setNotificationCenterOpen,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    settings,
    openApp,
  } = useOS();

  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('#taskbar-clock-btn') &&
        !(e.target as HTMLElement).closest('#taskbar-notif-btn')
      ) {
        setNotificationCenterOpen(false);
      }
    };
    if (isNotificationCenterOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationCenterOpen, setNotificationCenterOpen]);

  if (!isNotificationCenterOpen) return null;

  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const currentDay = today.getDate();

  // Simple mini calendar grid
  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(year, today.getMonth(), 1).getDay();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <motion.div
      ref={panelRef}
      id="windows-notification-center"
      initial={settings.animationsEnabled ? { opacity: 0, x: 20 } : false}
      animate={{ opacity: 1, x: 0 }}
      exit={settings.animationsEnabled ? { opacity: 0, x: 15 } : undefined}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-14 right-3 w-[92vw] max-w-96 max-h-[85vh] z-9100 flex flex-col rounded-2xl bg-slate-900/95 border border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-3xl overflow-hidden text-slate-100 select-none"
    >
      {/* Top Header */}
      <div className="p-4 pb-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-slate-200">Notifications</span>
          {notifications.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-sky-500/30 text-sky-300">
              {notifications.length}
            </span>
          )}
        </div>

        {notifications.length > 0 && (
          <button
            type="button"
            onClick={clearNotifications}
            className="text-[11px] text-slate-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="p-3 space-y-2 max-h-52 overflow-y-auto border-b border-white/10">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <CheckCheck className="w-6 h-6 mx-auto mb-1 opacity-30 text-emerald-400" />
            <p className="text-xs">No new notifications</p>
            <p className="text-[10px] text-slate-400">Your workstation feed is up to date.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                n.read
                  ? 'bg-slate-800/30 border-white/5 opacity-70'
                  : 'bg-slate-800/70 border-sky-500/30 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200">{n.title}</span>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Mini Calendar Widget */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <CalendarIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>{monthName} {year}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {today.toLocaleDateString([], { weekday: 'short' })}, {monthName.slice(0, 3)} {currentDay}
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-slate-400 mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {calendarDays.map(day => {
            const isCurrent = day === currentDay;
            return (
              <div
                key={day}
                className={`py-1 rounded-md text-[11px] font-medium transition-colors ${
                  isCurrent
                    ? 'bg-sky-500 text-white font-bold shadow-sm ring-1 ring-sky-300'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Toggles */}
      <div className="p-3 bg-slate-950/70 border-t border-white/10 grid grid-cols-3 gap-1.5 text-center">
        <button
          type="button"
          onClick={() => openApp('settings')}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 transition-colors"
        >
          <Wifi className="w-3.5 h-3.5 text-emerald-400 mb-1" />
          <span className="text-[10px] font-medium text-slate-200">Wi-Fi (Active)</span>
        </button>

        <button
          type="button"
          onClick={() => openApp('settings')}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 transition-colors"
        >
          <Moon className="w-3.5 h-3.5 text-indigo-400 mb-1" />
          <span className="text-[10px] font-medium text-slate-200">Night Light</span>
        </button>

        <button
          type="button"
          onClick={() => openApp('admin')}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 transition-colors"
        >
          <Shield className="w-3.5 h-3.5 text-sky-400 mb-1" />
          <span className="text-[10px] font-medium text-slate-200">Admin Lock</span>
        </button>
      </div>
    </motion.div>
  );
};
