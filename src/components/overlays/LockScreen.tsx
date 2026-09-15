import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { PROFILE_INFO } from '../../data/initialData';
import { Lock, ArrowRight, User } from 'lucide-react';

export const LockScreen: React.FC = () => {
  const { powerState, unlockSystem } = useOS();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false })
      );
      setDateStr(
        now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (powerState !== 'locked') return null;

  return (
    <motion.div
      id="system-lock-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={unlockSystem}
      className="fixed inset-0 z-100000 bg-cover bg-center flex flex-col justify-between items-center py-16 px-6 text-white select-none cursor-pointer"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 40%, rgba(15,23,42,0.85) 0%, rgba(3,7,18,0.98) 100%)',
      }}
    >
      {/* Top Clock */}
      <div className="text-center space-y-2 pt-8">
        <h1 className="text-6xl sm:text-7xl font-light tracking-tighter drop-shadow-lg">
          {timeStr}
        </h1>
        <p className="text-sm sm:text-base font-normal text-slate-300 drop-shadow">
          {dateStr}
        </p>
      </div>

      {/* Center User Profile card */}
      <div
        onClick={e => {
          e.stopPropagation();
          unlockSystem();
        }}
        className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl hover:bg-white/10 transition-all transform hover:scale-105"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg mb-3">
          AK
        </div>
        <h2 className="text-base font-semibold">{PROFILE_INFO.name}</h2>
        <p className="text-xs text-sky-300 mb-4">{PROFILE_INFO.role}</p>

        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-sky-500 text-slate-950 font-semibold text-xs shadow-md hover:bg-sky-400 transition-colors"
        >
          <span>Enter Workstation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="text-center text-xs text-slate-400 font-mono">
        Abhishek Kuntare's Developer Workstation • Click anywhere to enter
      </div>
    </motion.div>
  );
};
