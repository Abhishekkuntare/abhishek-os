import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { TrackingFace } from '../ui/TrackingFace';

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
      <div className="relative mb-8 rounded-[10px] shadow-[0_18px_55px_rgba(14,165,233,.38)] transition-transform duration-300 hover:scale-105">
        <TrackingFace size={128} />
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
