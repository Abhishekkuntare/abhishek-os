import React, { useEffect, useState } from 'react';
import {
  Monitor,
  Sparkles,
  X,
  ArrowUpRight,
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
          bottom-[64px]
          z-[9998]

          flex
          justify-center

          pointer-events-none

          transition-all
          duration-300
          ease-out

          ${
            isClosing
              ? 'translate-y-5 scale-95 opacity-0'
              : 'translate-y-0 scale-100 opacity-100'
          }
        `}
      >
        <div
          className="
            pointer-events-auto

            relative
            w-full
            max-w-[420px]

            overflow-hidden

            rounded-2xl

            border
            border-sky-400/30

            bg-slate-950/90

            shadow-[0_15px_50px_rgba(0,0,0,0.55)]

            backdrop-blur-2xl

            select-none

            animate-[noticeFloat_3s_ease-in-out_infinite]
          "
        >
          {/* ===================================================== */}
          {/* GLOW */}
          {/* ===================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              -inset-10

              rounded-full

              bg-sky-500/10

              blur-3xl

              animate-pulse
            "
          />

          {/* ===================================================== */}
          {/* TOP GLOW LINE */}
          {/* ===================================================== */}

          <div
            className="
              absolute
              left-0
              right-0
              top-0

              h-[2px]

              bg-gradient-to-r
              from-transparent
              via-sky-400
              to-transparent

              animate-pulse
            "
          />

          {/* ===================================================== */}
          {/* CONTENT */}
          {/* ===================================================== */}

          <div className="relative flex items-center gap-3 p-3.5 sm:p-4">

            {/* Monitor Icon */}
            <div
              className="
                relative

                flex
                h-11
                w-11
                shrink-0

                items-center
                justify-center

                rounded-xl

                border
                border-sky-400/30

                bg-sky-500/10

                shadow-[0_0_25px_rgba(56,189,248,0.18)]

                animate-[iconGlow_2s_ease-in-out_infinite]
              "
            >
              {/* Ping ring */}
              <span
                className="
                  absolute
                  inset-0

                  rounded-xl

                  border
                  border-sky-400/40

                  animate-ping
                "
              />

              <Monitor
                className="
                  relative
                  z-10

                  h-5
                  w-5

                  text-sky-300

                  drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]
                "
              />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">

              <div className="flex items-center gap-1.5">
                <h3
                  className="
                    text-sm
                    font-bold
                    leading-tight
                    text-white

                    sm:text-[15px]
                  "
                >
                  Better Experience
                </h3>

                <Sparkles
                  className="
                    h-3.5
                    w-3.5
                    shrink-0

                    text-sky-300

                    animate-pulse
                  "
                />
              </div>

              <p
                className="
                  mt-1

                  text-[11px]
                  leading-relaxed

                  text-slate-300

                  sm:text-xs
                "
              >
                Open this portfolio on a laptop or desktop
                for the full experience.
              </p>

              <div
                className="
                  mt-2

                  flex
                  items-center
                  gap-1.5

                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]

                  text-sky-400/80
                "
              >
                <ArrowUpRight className="h-3 w-3" />

                Desktop OS Experience
              </div>
            </div>

            {/* Close */}
            <button
              type="button"
              aria-label="Close message"
              onClick={closeNotice}
              className="
                absolute
                right-2
                top-2

                flex
                h-6
                w-6

                items-center
                justify-center

                rounded-lg

                text-slate-500

                transition-all
                duration-150

                hover:bg-white/10
                hover:text-white

                active:scale-90
              "
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* ===================================================== */}
          {/* BOTTOM PROGRESS */}
          {/* ===================================================== */}

          <div
            className="
              absolute
              bottom-0
              left-0
              right-0

              h-[2px]

              overflow-hidden

              bg-white/5
            "
          >
            <div
              className="
                h-full
                w-full

                origin-left

                bg-sky-400/70

                animate-[noticeProgress_8s_linear_forwards]
              "
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LOCAL ANIMATIONS */}
      {/* ========================================================= */}

      <style>{`
        @keyframes noticeFloat {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes iconGlow {
          0%,
          100% {
            box-shadow:
              0 0 0 rgba(56, 189, 248, 0);
          }

          50% {
            box-shadow:
              0 0 25px rgba(56, 189, 248, 0.25);
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

        @media (prefers-reduced-motion: reduce) {
          .animate-pulse,
          .animate-ping {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default DesktopExperienceNotice;