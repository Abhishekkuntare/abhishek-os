import React from 'react';
import { motion } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { Power, RotateCcw } from 'lucide-react';

export const ShutdownScreen: React.FC = () => {
  const { powerState, setPowerState, restartSystem } = useOS();

  if (powerState !== 'shutting-down' && powerState !== 'off') return null;

  if (powerState === 'shutting-down') {
    return (
      <motion.div
        id="system-shutting-down-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100000 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center select-none text-slate-100"
      >
        <div className="w-10 h-10 rounded-full border-2 border-sky-400 border-t-transparent animate-spin mb-4" />
        <h2 className="text-base font-semibold tracking-wide">
          Shutting down Abhishek's Portfolio...
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Closing active processes and saving session state...
        </p>
      </motion.div>
    );
  }

  // State === 'off'
  return (
    <motion.div
      id="system-off-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-100000 bg-black flex flex-col items-center justify-center select-none text-slate-100 p-6"
    >
      <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
        <Power className="w-8 h-8 text-slate-600" />
      </div>

      <h2 className="text-xl font-bold tracking-wider text-slate-200 mb-2">
        Portfolio Session Ended
      </h2>
      <p className="text-xs text-slate-400 mb-8 max-w-sm text-center">
        The developer workstation is currently powered down.
      </p>

      <button
        type="button"
        id="power-turn-on-btn"
        onClick={() => {
          setPowerState('booting');
        }}
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs tracking-wide shadow-lg shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Turn on again</span>
      </button>
    </motion.div>
  );
};
