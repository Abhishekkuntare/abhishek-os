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
      initial={settings.animationsEnabled ? { opacity: 0, x: 14, scale: 0.98 } : false}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={settings.animationsEnabled ? { opacity: 0, x: 10, scale: 0.98 } : undefined}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-14 right-3 w-[92vw] max-w-96 max-h-[85vh] z-9100 flex flex-col rounded-2xl bg-slate-900/78 border border-white/15 shadow-[0_24px_72px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[28px] backdrop-saturate-150 overflow-hidden text-slate-100 select-none"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.08),transparent_52%)]" />
      {/* Top Header */}
      <div className="relative flex items-center justify-between border-b border-white/10 p-4 pb-2">
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
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-400 transition-all duration-200 hover:bg-red-400/[0.08] hover:text-red-300 active:scale-95"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="relative max-h-52 space-y-2 overflow-y-auto border-b border-white/10 p-3">
        {notifications.length === 0 ? (
          <div className="flex min-h-32 flex-col items-center justify-center py-5 text-center text-slate-400">
            <CheckCheck className="mx-auto mb-2 h-6 w-6 text-emerald-400/70" />
            <p className="text-xs font-medium text-slate-300">No new notifications</p>
            <p className="text-[10px] text-slate-400">Your workstation feed is up to date.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`cursor-pointer rounded-xl border p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300/25 hover:shadow-[0_8px_22px_rgba(0,0,0,0.18)] ${
                n.read
                  ? 'bg-white/[0.035] border-white/[0.07] opacity-80 hover:bg-white/[0.06]'
                  : 'bg-sky-400/[0.09] border-sky-400/25 shadow-sm'
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
      <div className="relative p-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <CalendarIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>{monthName} {year}</span>
          </div>
          <div className="text-[11px] text-slate-300">
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
                className={`rounded-md py-1 text-[11px] font-medium transition-all duration-150 ${
                  isCurrent
                    ? 'bg-gradient-to-br from-sky-400 to-sky-500 font-bold text-white shadow-[0_3px_12px_rgba(14,165,233,0.28)] ring-1 ring-sky-200/70'
                    : 'text-slate-300 hover:scale-105 hover:bg-white/[0.09] hover:text-white'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Toggles */}
      <div className="relative grid grid-cols-3 gap-1.5 border-t border-white/10 bg-black/[0.12] p-3 text-center">
        <button
          type="button"
          onClick={() => openApp('settings')}
          className="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.055] p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-white/[0.09] hover:shadow-[0_8px_22px_rgba(0,0,0,0.2)] active:scale-[0.98]"
        >
          <Wifi className="w-3.5 h-3.5 text-emerald-400 mb-1" />
          <span className="text-[10px] font-medium text-slate-200">Wi-Fi (Active)</span>
        </button>

        <button
          type="button"
          onClick={() => openApp('settings')}
          className="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.055] p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300/20 hover:bg-white/[0.09] hover:shadow-[0_8px_22px_rgba(0,0,0,0.2)] active:scale-[0.98]"
        >
          <Moon className="w-3.5 h-3.5 text-indigo-400 mb-1" />
          <span className="text-[10px] font-medium text-slate-200">Night Light</span>
        </button>

      </div>
    </motion.div>
  );
};
