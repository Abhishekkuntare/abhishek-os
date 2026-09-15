import React from 'react';
import { motion } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { Moon } from 'lucide-react';

export const SleepOverlay: React.FC = () => {
  const { powerState, wakeSystem } = useOS();

  if (powerState !== 'sleeping') return null;

  return (
    <motion.div
      id="system-sleep-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={wakeSystem}
      className="fixed inset-0 z-100000 bg-black/95 flex flex-col items-center justify-center text-slate-400 select-none cursor-pointer"
    >
      <Moon className="w-12 h-12 text-indigo-400/60 mb-4 animate-pulse" />
      <p className="text-sm font-medium text-slate-300">System is in Sleep Mode</p>
      <p className="text-xs text-slate-500 mt-1 font-mono">Press any key or click to wake workstation</p>
    </motion.div>
  );
};
