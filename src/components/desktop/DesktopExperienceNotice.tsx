import React, { useEffect, useState } from 'react';
import {
  Monitor,
  X,
} from 'lucide-react';

const DesktopExperienceNotice: React.FC = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      /*
       * Show only on screens below 1024px.
       *
       * This includes:
       * - Mobile phones
       * - Small tablets
       * - Tablets
       *
       * It will NOT show on:
       * - Laptop
       * - Desktop
       * - Large monitors
       */
      const mobile = window.matchMedia('(max-width: 1023px)').matches;

      setIsMobileDevice(mobile);

      if (mobile) {
        // Small delay so the desktop environment loads first.
        const timer = window.setTimeout(() => {
          setIsVisible(true);
        }, 700);

        return () => window.clearTimeout(timer);
      } else {
        setIsVisible(false);
      }
    };

    const cleanup = checkDevice();

    const mediaQuery = window.matchMedia('(max-width: 1023px)');

    const handleChange = () => {
      checkDevice();
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }

      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  /*
   * Automatically hide after 8 seconds.
   */
  useEffect(() => {
    if (!isVisible || !isMobileDevice) return;

    const timer = window.setTimeout(() => {
      closeNotice();
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [isVisible, isMobileDevice]);

  const closeNotice = () => {
    setIsClosing(true);

    window.setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  /*
   * IMPORTANT:
   * Never render anything on laptop/desktop.
   */
  if (!isMobileDevice || !isVisible) {
    return null;
  }

  return (
    <>
      <div
        className={`
          fixed
          left-3
          right-3
          top-[max(12px,env(safe-area-inset-top))]
          z-[9998]
          flex
          justify-center
          pointer-events-none
          transition-all
          duration-[250ms]
          ease-out
          ${
            isClosing
              ? '-translate-y-2 opacity-0'
              : 'translate-y-0 opacity-100'
          }
        `}
      >
        <div
          className="
            pointer-events-auto
            relative
            flex
            w-full
            max-w-[420px]
            items-center
            gap-2.5
            overflow-hidden
            rounded-xl
            border
            border-sky-300/20
            bg-slate-950/75
            px-3
            py-2
            text-slate-100
            shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]
            backdrop-blur-2xl
            backdrop-saturate-150
            select-none
            notice-enter
          "
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(56,189,248,0.1),transparent_65%)]" />

          <div
            className="
              relative
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-sky-300/20
              bg-sky-400/10
              text-sky-200
            "
          >
            <Monitor className="h-4 w-4" />
          </div>

          <p className="relative min-w-0 flex-1 truncate text-[11px] font-medium text-slate-200 sm:text-xs">
            For the full experience, open on desktop
          </p>

          <button
            type="button"
            aria-label="Close message"
            onClick={closeNotice}
            className="
              relative
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition-all
              duration-200
              hover:rotate-90
              hover:bg-white/[0.08]
              hover:text-white
              active:scale-90
            "
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              h-px
              overflow-hidden
              bg-white/[0.06]
            "
          >
            <div
              className="
                h-full
                w-full
                origin-left
                bg-sky-300/70
                notice-progress
              "
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LOCAL ANIMATIONS */}
      {/* ========================================================= */}

      <style>{`
        @keyframes noticeEnter {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes noticeProgress {
          from {
            transform: scaleX(1);
          }

          to {
            transform: scaleX(0);
          }
        }

        .notice-enter {
          animation: noticeEnter 260ms cubic-bezier(.2, .8, .2, 1) both;
        }

        .notice-progress {
          animation: noticeProgress 8s linear forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .notice-enter,
          .notice-progress {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default DesktopExperienceNotice;