import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { Mascot } from 'page-mascot';

export const BootScreen: React.FC = () => {
  const { powerState, setPowerState, playSystemSound } = useOS();

  useEffect(() => {
    if (powerState !== 'booting') return;

    playSystemSound('boot');
    const bootTimer = window.setTimeout(() => setPowerState('locked'), 900);
    return () => window.clearTimeout(bootTimer);
  }, [powerState, setPowerState, playSystemSound]);

  if (powerState !== 'booting') return null;

  return (
    <motion.div
      id="system-boot-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-100000 flex items-center justify-center select-none text-slate-100"
    >
      <div className="animate-pulse drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]">
        <Mascot
          directions="/mascots/crt-directions.webp"
          reactions="/mascots/crt-reactions.webp"
          size={164}
          label="Abhishek OS"
        />
      </div>
    </motion.div>
  );
};
