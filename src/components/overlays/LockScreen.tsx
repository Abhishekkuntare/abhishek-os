import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { Mascot } from 'page-mascot';
import { useOS } from '../../context/OSContext';
import { PROFILE_INFO } from '../../data/initialData';
import { DAILY_QUOTES } from '../../data/dailyQuotes';

const DEFAULT_PIN = '1234';

export const LockScreen: React.FC = () => {
  const {
    unlockSystem,
    settings,
    lockScreenWallpaper,
  } = useOS();
  const [pin, setPin] = useState('');
  const [hasError, setHasError] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [quote] = useState(
    () => DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)],
  );
  const pinInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      );
      setDateStr(
        now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (pin === DEFAULT_PIN) {
      setHasError(false);
      unlockSystem();
      return;
    }

    setPin('');
    setHasError(true);
    pinInputRef.current?.focus();
  };

  return (
    <motion.div
      id="system-lock-screen"
      initial={{ opacity: 0, scale: 1.015 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="fixed inset-0 z-100000 flex flex-col items-center justify-between overflow-y-auto px-6 py-6 text-white select-none"
      style={{
        background: lockScreenWallpaper?.imageUrl
          ? `center / cover no-repeat url("${lockScreenWallpaper.imageUrl}")`
          : lockScreenWallpaper?.style || 'linear-gradient(135deg,#111827,#020617)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(56,189,248,0.12),transparent_52%)]" />

      <div className="relative z-10 w-full pt-2 text-center sm:pt-5">
        <h1 className="text-5xl font-semibold tracking-[-0.06em] drop-shadow-[0_4px_24px_rgba(0,0,0,0.28)] sm:text-7xl">
          {timeStr}
        </h1>
        {settings.lockScreenShowDate && (
          <p className="mt-1 text-sm font-medium text-slate-200/90 sm:text-base">
            {dateStr}
          </p>
        )}
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center py-4 text-center">
        <div className="mb-5 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-slate-950/35 shadow-[0_12px_45px_rgba(0,0,0,0.3),0_0_40px_rgba(56,189,248,0.12)] ring-1 ring-white/10 sm:h-36 sm:w-36">
          <Mascot
            directions="/mascots/crt-directions.webp"
            reactions="/mascots/crt-reactions.webp"
            size={120}
            label={`${PROFILE_INFO.name}'s mascot`}
          />
        </div>

        <h2 className="text-lg font-semibold tracking-tight text-white">
          {PROFILE_INFO.name}
        </h2>
        <p className="mt-1 text-sm text-slate-300">{PROFILE_INFO.role}</p>

        <form onSubmit={handleSubmit} className="mt-7 w-full">
          <label htmlFor="system-pin" className="sr-only">
            Enter your PIN
          </label>
          <div
            className={`flex h-12 items-center rounded-full border bg-slate-950/35 p-1 pl-4 shadow-lg backdrop-blur-xl transition focus-within:ring-2 ${
              hasError
                ? 'border-rose-300/80 focus-within:ring-rose-300/30'
                : 'border-sky-300/70 focus-within:border-sky-200 focus-within:ring-sky-300/30'
            }`}
          >
            <LockKeyhole className="mr-3 h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
            <input
              ref={pinInputRef}
              id="system-pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              autoComplete="off"
              value={pin}
              onChange={event => {
                setPin(event.target.value.replace(/\D/g, '').slice(0, 4));
                setHasError(false);
              }}
              placeholder="Enter PIN (Default: 1234)"
              aria-describedby={hasError ? 'system-pin-error' : 'system-pin-hint'}
              aria-invalid={hasError}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Unlock workstation"
              disabled={pin.length !== 4}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-200 text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-500/50 disabled:text-slate-300"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <p
            id={hasError ? 'system-pin-error' : 'system-pin-hint'}
            role={hasError ? 'alert' : undefined}
            className={`mt-3 min-h-5 text-xs ${
              hasError ? 'text-rose-200' : 'text-slate-300/80'
            }`}
          >
            {hasError
              ? 'That PIN is not correct. Please try again.'
              : 'Enter PIN to unlock your workstation'}
          </p>
        </form>

        {(settings.lockScreenShowQuote || settings.lockScreenShowStatus) && (
          <div className="mt-5 grid w-full gap-2 text-left">
            {settings.lockScreenShowQuote && (
              <div className="rounded-2xl border border-white/15 bg-slate-950/35 px-4 py-3 text-left shadow-lg backdrop-blur-xl">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-200">
                  <Sparkles className="h-3 w-3" />
                  Daily inspiration
                </div>
                <p className="line-clamp-2 text-xs leading-relaxed text-white/90">
                  “{quote}”
                </p>
              </div>
            )}
            {settings.lockScreenShowStatus && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-300/15 bg-slate-950/30 px-3 py-2 text-left backdrop-blur-xl">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-slate-100">Workstation ready</p>
                  <p className="truncate text-[9px] text-slate-300/75">Your workspace is ready when you are</p>
                </div>
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.7)]" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 pb-2 text-center text-xs text-slate-300/70">
        Abhishek&apos;s Developer Workstation
      </div>
    </motion.div>
  );
};
