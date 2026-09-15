import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useOS } from '../../context/OSContext';

export const BootScreen: React.FC = () => {
  const { powerState, setPowerState, playSystemSound } = useOS();
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (powerState !== 'booting') return;

    playSystemSound('boot');

    const t1 = setTimeout(() => setProgress(45), 250);
    const t2 = setTimeout(() => setProgress(80), 650);
    const t3 = setTimeout(() => setProgress(100), 1100);
    const t4 = setTimeout(() => {
      setPowerState('running');
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [powerState, setPowerState, playSystemSound]);

  if (powerState !== 'booting') return null;

  return (
    <motion.div
      id="system-boot-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-100000 bg-black flex flex-col items-center justify-center select-none text-slate-100 p-6"
    >
      {/* OS Logo */}
      <div className="relative mb-8">
        <div className="grid grid-cols-2 gap-1.5 w-16 h-16">
          <div className="rounded-sm bg-sky-500 shadow-lg shadow-sky-500/50 animate-pulse" />
          <div className="rounded-sm bg-sky-400 shadow-lg shadow-sky-400/40" />
          <div className="rounded-sm bg-sky-400 shadow-lg shadow-sky-400/40" />
          <div className="rounded-sm bg-sky-300 shadow-lg shadow-sky-300/30" />
        </div>
      </div>

      <h1 className="text-xl font-bold tracking-widest text-slate-100 mb-1">
        ABHISHEK OS
      </h1>
      <p className="text-xs text-slate-400 mb-6 font-mono">
        Initializing Developer Workstation...
      </p>

      {/* Progress bar */}
      <div className="w-56 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-8 border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Skip button */}
      <button
        type="button"
        onClick={() => setPowerState('running')}
        className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-wider underline cursor-pointer"
      >
        Skip initialization (Esc)
      </button>
    </motion.div>
  );
};
