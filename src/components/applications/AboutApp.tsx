import React, { useState } from 'react';

import { useOS } from '../../context/OSContext';

import { PROFILE_INFO } from '../../data/initialData';

import {
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Github,
  FileText,
  Send,
  ExternalLink,
  Code2,
  Sparkles,
  Cpu,
} from 'lucide-react';

export const AboutApp: React.FC = () => {
  const { openApp } = useOS();

  const [avatarHovered, setAvatarHovered] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 select-text space-y-6">
      
      {/* =========================================================
          HEADER / PROFILE CARD
      ========================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800/80 border border-white/10 shadow-xl relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">

          {/* =====================================================
              AVATAR
          ===================================================== */}
          <div
            className="relative shrink-0 group"
            onMouseEnter={() => setAvatarHovered(true)}
            onMouseLeave={() => setAvatarHovered(false)}
          >

            {/* Hi Speech Bubble */}
            <div
              className={`
                absolute
                -top-6
                left-1/2
                -translate-x-1/2
                z-30
                px-3
                py-1.5
                rounded-xl
                bg-white
                text-slate-900
                text-xs
                font-bold
                whitespace-nowrap
                shadow-xl
                border
                border-sky-200
                transition-all
                duration-300
                pointer-events-none

                ${
                  avatarHovered
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-2 scale-90'
                }
              `}
            >
              Hi 👋

              {/* Bubble Arrow */}
              <span
                className="
                  absolute
                  -bottom-1
                  left-1/2
                  -translate-x-1/2
                  w-2
                  h-2
                  bg-white
                  rotate-45
                  border-r
                  border-b
                  border-sky-200
                "
              />
            </div>

            {/* Outer Animated Glow */}
            <div
              className={`
                absolute
                -inset-2
                rounded-[22px]
                bg-gradient-to-tr
                from-sky-500
                via-indigo-500
                to-purple-500
                blur-xl
                transition-all
                duration-500

                ${
                  avatarHovered
                    ? 'opacity-70 scale-110 animate-pulse'
                    : 'opacity-0 scale-90'
                }
              `}
            />

            {/* Avatar Frame */}
            <div
              className={`
                relative
                w-24
                h-24
                sm:w-28
                sm:h-28
                rounded-2xl
                p-[2px]
                bg-gradient-to-tr
                from-sky-400
                via-indigo-500
                to-purple-500
                shadow-2xl
                transition-all
                duration-500
                cursor-pointer

                ${
                  avatarHovered
                    ? 'scale-110 -rotate-2 shadow-[0_0_35px_rgba(56,189,248,0.45)]'
                    : 'scale-100 rotate-0'
                }
              `}
            >

              {/* Image Container */}
              <div
                className={`
                  relative
                  w-full
                  h-full
                  rounded-[14px]
                  overflow-hidden
                  bg-slate-950

                  transition-all
                  duration-300

                  ${
                    avatarHovered
                      ? 'brightness-110'
                      : 'brightness-100'
                  }
                `}
              >

                {/* Avatar Image */}
                <img
                  src="/avatar.png"
                  alt="Abhishek Kuntare"
                  className={`
                    w-full
                    h-full
                    object-cover
                    object-center
                    select-none
                    pointer-events-none
                    transition-all
                    duration-300

                    ${
                      avatarHovered
                        ? 'scale-105'
                        : 'scale-100'
                    }
                  `}
                />

                {/* Hover Blink / Shine */}
                <div
                  className={`
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-transparent
                    via-white/30
                    to-transparent
                    -translate-x-full
                    pointer-events-none

                    ${
                      avatarHovered
                        ? 'animate-[avatarShine_0.8s_ease-in-out]'
                        : ''
                    }
                  `}
                />

                {/* Subtle Blink Overlay */}
                <div
                  className={`
                    absolute
                    inset-0
                    bg-white
                    pointer-events-none
                    transition-opacity
                    duration-100

                    ${
                      avatarHovered
                        ? 'opacity-[0.08] animate-[avatarBlink_1.2s_ease-in-out_infinite]'
                        : 'opacity-0'
                    }
                  `}
                />
              </div>
            </div>

            {/* Online Status */}
            <span
              className="
                absolute
                -bottom-1
                -right-1
                w-6
                h-6
                rounded-full
                bg-emerald-500
                ring-4
                ring-slate-900
                flex
                items-center
                justify-center
                z-20
              "
              title="Workstation Online & Ready"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />

              <span className="absolute w-2 h-2 rounded-full bg-white" />
            </span>

            {/* Hover Label */}
            <div
              className={`
                absolute
                -bottom-8
                left-1/2
                -translate-x-1/2
                whitespace-nowrap
                text-[9px]
                font-mono
                text-sky-400
                transition-all
                duration-300
                pointer-events-none

                ${
                  avatarHovered
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-1'
                }
              `}
            >
              ONLINE • READY
            </div>
          </div>


          {/* =====================================================
              PROFILE DETAILS
          ===================================================== */}
          <div className="space-y-1.5 flex-1 min-w-0">

            <div className="flex items-center gap-2 flex-wrap">

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {PROFILE_INFO.name}
              </h1>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                {PROFILE_INFO.role}
              </span>

            </div>

            <p className="text-xs sm:text-sm text-sky-300/90 font-medium">
              {PROFILE_INFO.tagline}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap">

              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {PROFILE_INFO.location}
              </span>

              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {PROFILE_INFO.email}
              </span>

              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                {PROFILE_INFO.phone}
              </span>

            </div>

          </div>
        </div>


        {/* =========================================================
            QUICK ACTION BUTTONS
        ========================================================= */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2.5 flex-wrap">

          {/* Resume */}
          <button
            type="button"
            onClick={() => openApp('resume')}
            className="
              flex
              items-center
              gap-2
              px-3.5
              py-1.5
              rounded-xl
              bg-sky-500
              hover:bg-sky-400
              text-slate-950
              text-xs
              font-semibold
              shadow
              transition-all
              hover:scale-[1.02]
              active:scale-95
            "
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open Resume</span>
          </button>


          {/* Contact */}
          <button
            type="button"
            onClick={() => openApp('contact')}
            className="
              flex
              items-center
              gap-2
              px-3.5
              py-1.5
              rounded-xl
              bg-slate-800
              hover:bg-slate-700
              text-slate-200
              text-xs
              font-medium
              border
              border-white/10
              transition-all
              hover:border-sky-500/30
              hover:scale-[1.02]
              active:scale-95
            "
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span>Contact Abhishek</span>
          </button>


          {/* Projects */}
          <button
            type="button"
            onClick={() => openApp('projects')}
            className="
              flex
              items-center
              gap-2
              px-3.5
              py-1.5
              rounded-xl
              bg-slate-800
              hover:bg-slate-700
              text-slate-200
              text-xs
              font-medium
              border
              border-white/10
              transition-all
              hover:border-emerald-500/30
              hover:scale-[1.02]
              active:scale-95
            "
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Explore Projects</span>
          </button>


          {/* GitHub */}
          <a
            href={PROFILE_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              items-center
              gap-1.5
              px-3
              py-1.5
              rounded-xl
              bg-slate-800/80
              hover:bg-slate-700
              text-slate-300
              text-xs
              border
              border-white/10
              transition-all
              hover:border-white/20
              hover:scale-[1.02]
              ml-auto
            "
          >
            <Github className="w-3.5 h-3.5" />

            <span>GitHub</span>

            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

        </div>
      </div>


      {/* =========================================================
          PROFESSIONAL SUMMARY
      ========================================================= */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">

          <UserCheck className="w-4 h-4 text-sky-400" />

          <span>Professional Summary</span>

        </div>

        <p className="text-sm text-slate-200 leading-relaxed font-normal">
          {PROFILE_INFO.bio}
        </p>

        <div className="pt-2 flex items-start gap-2 text-xs text-slate-400">

          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />

          <span>
            Specialized in:{' '}
            <strong className="text-slate-200">Python</strong>,{' '}
            <strong className="text-slate-200">Next.js</strong>,{' '}
            <strong className="text-slate-200">React</strong>,{' '}
            <strong className="text-slate-200">OpenAI APIs</strong>,{' '}
            <strong className="text-slate-200">LLM-based workflows</strong>,
            and{' '}
            <strong className="text-slate-200">
              AI-powered applications
            </strong>
            .
          </span>

        </div>
      </div>


      {/* =========================================================
          CORE ENGINEERING STACK
      ========================================================= */}
      <div className="space-y-3">

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">

            <Cpu className="w-4 h-4 text-emerald-400" />

            <span>Core Engineering Stack</span>

          </div>

          <button
            type="button"
            onClick={() => openApp('skills')}
            className="
              text-xs
              text-sky-400
              hover:text-sky-300
              underline
              underline-offset-2
              transition-colors
            "
          >
            View full system specs →
          </button>

        </div>


        {/* Technology Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">

          {PROFILE_INFO.technologiesHighlight.map((tech) => (

            <div
              key={tech}
              className="
                p-3
                rounded-xl
                bg-slate-900/80
                border
                border-white/8
                hover:border-sky-500/30
                hover:bg-slate-900
                transition-all
                duration-300
                flex
                items-center
                gap-2.5
                hover:-translate-y-0.5
              "
            >

              <div className="relative">

                <div className="w-2 h-2 rounded-full bg-sky-400" />

                <div className="absolute inset-0 w-2 h-2 rounded-full bg-sky-400 animate-ping opacity-30" />

              </div>

              <span className="text-xs font-medium text-slate-200">
                {tech}
              </span>

            </div>

          ))}

        </div>

      </div>


      {/* =========================================================
          SYSTEM SPECIFICATIONS
      ========================================================= */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-400 space-y-2">

        <div className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
          Workstation Environment Specs
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono">

          <div>
            <span className="text-slate-500">Host:</span>{' '}
            Abhishek Kuntare
          </div>

          <div>
            <span className="text-slate-500">Architecture:</span>{' '}
            Full-Stack / AI-Powered
          </div>

          <div>
            <span className="text-slate-500">Status:</span>{' '}
            <span className="text-emerald-400">
              Open to Opportunities
            </span>
          </div>

        </div>

      </div>


      {/* =========================================================
          CUSTOM ANIMATIONS
      ========================================================= */}
      <style>
        {`
          @keyframes avatarShine {
            0% {
              transform: translateX(-120%);
            }

            100% {
              transform: translateX(120%);
            }
          }

          @keyframes avatarBlink {
            0%,
            45%,
            55%,
            100% {
              opacity: 0;
            }

            48%,
            52% {
              opacity: 0.18;
            }
          }
        `}
      </style>

    </div>
  );
};