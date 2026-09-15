import React, { useEffect, useState } from 'react';

import { useOS } from '../../context/OSContext';
import { PROFILE_INFO } from '../../data/initialData';

import {
  Mail,
  Phone,
  Send,
  Github,
  Linkedin,
  Globe,
  MapPin,
  CheckCircle,
  Copy,
  ExternalLink,
  MessageSquare,
  Instagram,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Radio,
  User,
  AtSign,
  Clock3,
  Check,
  Loader2,
  Terminal,
  BriefcaseBusiness,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

type CopyType = 'email' | 'phone';

/* =========================================================
   CONTACT APP
========================================================= */

export const ContactApp: React.FC = () => {
  const { sendContactMessage } = useOS();

  /* -------------------------------------------------------
     FORM STATE
  ------------------------------------------------------- */

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  /* -------------------------------------------------------
     PAGE ENTER ANIMATION
  ------------------------------------------------------- */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 40);

    return () => window.clearTimeout(timer);
  }, []);

  /* =======================================================
     HELPERS
  ======================================================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your name.');
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      setErrorMsg('Message must be at least 10 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await sendContactMessage(
        cleanName,
        cleanEmail,
        cleanMessage
      );

      if (success) {
        setIsSuccess(true);

        setName('');
        setEmail('');
        setMessage('');
        setErrorMsg('');
      } else {
        setErrorMsg(
          'Failed to send message. Please reach out directly via email.'
        );
      }
    } catch (error) {
      console.error('Contact message error:', error);

      setErrorMsg(
        'Something went wrong while sending your message. Please try again or contact Abhishek directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (
    text: string,
    type: CopyType
  ) => {
    try {
      await navigator.clipboard.writeText(text);

      if (type === 'email') {
        setCopiedEmail(true);

        window.setTimeout(() => {
          setCopiedEmail(false);
        }, 2000);
      } else {
        setCopiedPhone(true);

        window.setTimeout(() => {
          setCopiedPhone(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Clipboard error:', error);
    }
  };

  const resetSuccess = () => {
    setIsSuccess(false);
    setErrorMsg('');
  };

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div
      className={`
        contact-app
        relative
        flex
        h-full
        min-h-0
        w-full
        flex-1
        overflow-y-auto
        overflow-x-hidden
        bg-[#060a12]
        text-slate-100
        select-text
        transition-opacity
        duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* ===================================================
          ATMOSPHERIC BACKGROUND
      =================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          overflow-hidden
        "
        aria-hidden="true"
      >
        {/* Main glow */}
        <div
          className="
            absolute
            -left-32
            -top-32
            h-80
            w-80
            rounded-full
            bg-cyan-500/10
            blur-[100px]
            animate-contact-pulse
          "
        />

        <div
          className="
            absolute
            -right-32
            top-1/4
            h-96
            w-96
            rounded-full
            bg-indigo-500/10
            blur-[120px]
            animate-contact-pulse-slow
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-1/3
            h-72
            w-72
            rounded-full
            bg-blue-500/[0.06]
            blur-[100px]
          "
        />

        {/* Grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
            [background-size:40px_40px]
          "
        />

        {/* Floating particles */}
        <div className="contact-particle contact-particle-1" />
        <div className="contact-particle contact-particle-2" />
        <div className="contact-particle contact-particle-3" />
        <div className="contact-particle contact-particle-4" />
        <div className="contact-particle contact-particle-5" />
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="relative z-10 w-full p-3 sm:p-5 lg:p-6">
        <div className="mx-auto w-full max-w-[1450px] space-y-5">
          {/* =================================================
              HERO / HEADER
          ================================================= */}

          <section
            className="
              contact-card
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.08]
              bg-gradient-to-br
              from-slate-900
              via-slate-900
              to-[#10182d]
              p-5
              shadow-2xl
              shadow-black/20
              sm:p-6
              lg:p-7
            "
          >
            {/* Card shine */}
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-24
                h-64
                w-64
                rounded-full
                bg-cyan-400/[0.08]
                blur-3xl
                transition-all
                duration-700
                group-hover:bg-cyan-400/[0.13]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                right-1/4
                h-px
                w-1/2
                bg-gradient-to-r
                from-transparent
                via-cyan-400/30
                to-transparent
              "
            />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Left */}
              <div className="flex min-w-0 items-start gap-4">
                {/* Icon */}
                <div className="relative shrink-0">
                  <div
                    className="
                      absolute
                      inset-0
                      rounded-2xl
                      bg-cyan-400/20
                      blur-xl
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-cyan-400/20
                      bg-cyan-400/10
                      shadow-lg
                      shadow-cyan-500/10
                      sm:h-16
                      sm:w-16
                    "
                  >
                    <Mail
                      className="
                        h-6
                        w-6
                        text-cyan-300
                        sm:h-7
                        sm:w-7
                      "
                      strokeWidth={1.7}
                    />

                    <Sparkles
                      className="
                        absolute
                        -right-1
                        -top-1
                        h-3
                        w-3
                        animate-pulse
                        text-cyan-300
                      "
                    />
                  </div>
                </div>

                {/* Heading */}
                <div className="min-w-0">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 sm:text-xs">
                      <Radio className="h-3.5 w-3.5 animate-pulse" />
                      <span>Communications Hub</span>
                    </div>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                      Online
                    </span>
                  </div>

                  <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl lg:text-3xl">
                    Get In Touch with{' '}
                    <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                      Abhishek
                    </span>
                  </h1>

                  <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                    Available for full-time engineering roles,
                    high-impact consulting, digital products, and
                    full-stack collaborations.
                  </p>
                </div>
              </div>

              {/* Status */}
              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-emerald-400/10
                  bg-emerald-400/[0.05]
                  px-4
                  py-3
                  transition-all
                  duration-300
                  hover:border-emerald-400/20
                  hover:bg-emerald-400/[0.08]
                "
              >
                <div className="relative">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
                  <span className="relative block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-emerald-300">
                    Active & Responsive
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-500">
                    Communication channel ready
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              QUICK STATS
          ================================================= */}

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickStat
              icon={<Zap className="h-4 w-4" />}
              label="Response"
              value="Fast"
            />

            <QuickStat
              icon={<BriefcaseBusiness className="h-4 w-4" />}
              label="Available"
              value="Projects"
            />

            <QuickStat
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Channel"
              value="Secure"
            />

            <QuickStat
              icon={<Terminal className="h-4 w-4" />}
              label="Status"
              value="Online"
            />
          </section>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <div className="space-y-5 xl:col-span-2">
              {/* ===============================================
                  DIRECT CONTACT
              =============================================== */}

              <section className="contact-card rounded-3xl border border-white/[0.08] bg-slate-900/65 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6">
                <SectionHeader
                  icon={<AtSign className="h-4 w-4" />}
                  title="Direct Contact"
                  subtitle="Reach Abhishek directly"
                />

                <div className="mt-5 space-y-3">
                  {/* EMAIL */}
                  <ContactInfoCard
                    icon={<Mail className="h-4 w-4" />}
                    label="Email Address"
                    value={PROFILE_INFO.email}
                    href={`mailto:${PROFILE_INFO.email}`}
                    iconClass="text-cyan-300"
                    bgClass="bg-cyan-400/10"
                    action={
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            PROFILE_INFO.email,
                            'email'
                          )
                        }
                        className="
                          group/copy
                          rounded-lg
                          p-2
                          text-slate-500
                          transition-all
                          duration-200
                          hover:bg-white/10
                          hover:text-white
                          active:scale-90
                        "
                        title="Copy email"
                        aria-label="Copy email address"
                      >
                        {copiedEmail ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 transition-transform group-hover/copy:scale-110" />
                        )}
                      </button>
                    }
                  />

                  {/* PHONE */}
                  <ContactInfoCard
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone / WhatsApp"
                    value={PROFILE_INFO.phone}
                    href={`tel:${PROFILE_INFO.phone}`}
                    iconClass="text-emerald-300"
                    bgClass="bg-emerald-400/10"
                    action={
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            PROFILE_INFO.phone,
                            'phone'
                          )
                        }
                        className="
                          group/copy
                          rounded-lg
                          p-2
                          text-slate-500
                          transition-all
                          duration-200
                          hover:bg-white/10
                          hover:text-white
                          active:scale-90
                        "
                        title="Copy phone"
                        aria-label="Copy phone number"
                      >
                        {copiedPhone ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 transition-transform group-hover/copy:scale-110" />
                        )}
                      </button>
                    }
                  />

                  {/* LOCATION */}
                  <div
                    className="
                      group
                      rounded-2xl
                      border
                      border-white/[0.06]
                      bg-slate-800/50
                      p-4
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-sky-400/20
                      hover:bg-slate-800/75
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                        <MapPin className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                          Location
                        </div>

                        <div className="mt-1 truncate text-xs font-semibold text-slate-200 sm:text-sm">
                          {PROFILE_INFO.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ===============================================
                  SOCIAL / ONLINE PRESENCE
              =============================================== */}

              <section className="contact-card rounded-3xl border border-white/[0.08] bg-slate-900/65 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6">
                <SectionHeader
                  icon={<Globe className="h-4 w-4" />}
                  title="Online Presence"
                  subtitle="Connect, explore & follow"
                />

                <div className="mt-5 space-y-2.5">
                  <SocialLink
                    href={PROFILE_INFO.github}
                    icon={<Github className="h-4 w-4" />}
                    title="GitHub"
                    description="Projects & repositories"
                    iconClass="text-white"
                    bgClass="bg-white/[0.08]"
                  />

                  <SocialLink
                    href={PROFILE_INFO.linkedin}
                    icon={<Linkedin className="h-4 w-4" />}
                    title="LinkedIn"
                    description="Professional network"
                    iconClass="text-sky-300"
                    bgClass="bg-sky-400/10"
                  />

                  {/* INSTAGRAM */}
                  <SocialLink
                    href="https://www.instagram.com/abhishekkuntare/"
                    icon={<Instagram className="h-4 w-4" />}
                    title="Instagram"
                    description="@abhishekkuntare"
                    iconClass="text-pink-300"
                    bgClass="bg-pink-400/10"
                  />

                  {/* PORTFOLIO */}
                  <SocialLink
                    href={"https://abhishekkuntare.netlify.app/"}
                    icon={<Globe className="h-4 w-4" />}
                    title="Portfolio"
                    description="Personal portfolio"
                    iconClass="text-emerald-300"
                    bgClass="bg-emerald-400/10"
                  />

                  {/* DIGITAL SOLUTIONS */}
                  <SocialLink
                    href="https://abhishek-digital-solutions-tech.vercel.app/"
                    icon={<Sparkles className="h-4 w-4" />}
                    title="Abhishek Digital Solutions"
                    description="Websites • AI • Digital Services"
                    iconClass="text-cyan-300"
                    bgClass="bg-cyan-400/10"
                  />
                </div>
              </section>
            </div>

            {/* =================================================
                RIGHT COLUMN — MESSAGE FORM
            ================================================= */}

            <section className="contact-card relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/65 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6 lg:p-7 xl:col-span-3">
              {/* Form glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-60
                  w-60
                  rounded-full
                  bg-cyan-400/[0.06]
                  blur-3xl
                "
              />

              <div className="relative">
                {/* Form Header */}
                <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                      <MessageSquare
                        className="h-5 w-5"
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-white sm:text-base">
                        Send a Message
                      </h2>

                      <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
                        Start a conversation directly from this workstation.
                      </p>
                    </div>
                  </div>

                  <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-2.5 py-1.5 sm:flex">
                    <Clock3 className="h-3 w-3 text-emerald-400" />
                    <span className="text-[9px] font-semibold text-emerald-300">
                      Ready
                    </span>
                  </div>
                </div>

                {/* SUCCESS STATE */}
                {isSuccess ? (
                  <SuccessState onSendAnother={resetSuccess} />
                ) : (
                  /* FORM */
                  <form
                    onSubmit={handleSubmit}
                    className="relative mt-5 space-y-5"
                  >
                    {/* ERROR */}
                    {errorMsg && (
                      <div
                        className="
                          animate-contact-shake
                          flex
                          items-start
                          gap-3
                          rounded-2xl
                          border
                          border-red-400/20
                          bg-red-500/[0.07]
                          p-3.5
                        "
                        role="alert"
                      >
                        <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />

                        <p className="text-xs leading-5 text-red-300">
                          {errorMsg}
                        </p>
                      </div>
                    )}

                    {/* NAME + EMAIL */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* NAME */}
                      <FormField
                        label="Full Name"
                        icon={<User className="h-3.5 w-3.5" />}
                        required
                      >
                        <input
                          type="text"
                          autoComplete="name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errorMsg) setErrorMsg('');
                          }}
                          className="contact-input"
                        />
                      </FormField>

                      {/* EMAIL */}
                      <FormField
                        label="Email Address"
                        icon={<Mail className="h-3.5 w-3.5" />}
                        required
                      >
                        <input
                          type="email"
                          autoComplete="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errorMsg) setErrorMsg('');
                          }}
                          className="contact-input"
                        />
                      </FormField>
                    </div>

                    {/* MESSAGE */}
                    <FormField
                      label="Message / Opportunity Brief"
                      icon={<MessageSquare className="h-3.5 w-3.5" />}
                      required
                    >
                      <div className="relative">
                        <textarea
                          required
                          rows={7}
                          maxLength={1500}
                          placeholder="Tell Abhishek about your project, team, opportunity, collaboration, or idea..."
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);

                            if (errorMsg) {
                              setErrorMsg('');
                            }
                          }}
                          className="contact-input min-h-[150px] resize-none pr-16"
                        />

                        <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-slate-950/70 px-2 py-1 text-[9px] font-medium text-slate-600">
                          {message.length}/1500
                        </div>
                      </div>
                    </FormField>

                    {/* PRIVACY / INFO */}
                    <div className="flex items-start gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />

                      <p className="text-[10px] leading-4 text-slate-500">
                        Your message is used only to respond to your
                        inquiry. Please avoid sending passwords or
                        other sensitive information.
                      </p>
                    </div>

                    {/* SUBMIT */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="
                        group
                        relative
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2.5
                        overflow-hidden
                        rounded-2xl
                        border
                        border-cyan-300/20
                        bg-gradient-to-r
                        from-cyan-400
                        via-sky-400
                        to-indigo-400
                        px-5
                        py-3.5
                        text-sm
                        font-black
                        text-slate-950
                        shadow-lg
                        shadow-cyan-500/10
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:shadow-xl
                        hover:shadow-cyan-500/20
                        active:translate-y-0
                        active:scale-[0.99]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {/* Moving shine */}
                      <span
                        className="
                          pointer-events-none
                          absolute
                          inset-y-0
                          -left-20
                          w-16
                          rotate-12
                          bg-white/30
                          blur-md
                          transition-transform
                          duration-700
                          group-hover:translate-x-[700%]
                        "
                      />

                      {isSubmitting ? (
                        <>
                          <Loader2 className="relative h-4 w-4 animate-spin" />

                          <span className="relative">
                            Transmitting Message...
                          </span>
                        </>
                      ) : (
                        <>
                          <Send
                            className="
                              relative
                              h-4
                              w-4
                              transition-transform
                              duration-300
                              group-hover:translate-x-0.5
                              group-hover:-translate-y-0.5
                            "
                          />

                          <span className="relative">
                            Send Message
                          </span>

                          <ArrowUpRight
                            className="
                              relative
                              h-4
                              w-4
                              opacity-60
                              transition-transform
                              duration-300
                              group-hover:translate-x-0.5
                              group-hover:-translate-y-0.5
                            "
                          />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </section>
          </div>

          {/* =================================================
              BOTTOM CTA
          ================================================= */}

          <section
            className="
              contact-card
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.07]
              bg-gradient-to-r
              from-slate-900/90
              via-[#0d1527]
              to-slate-900/90
              p-5
              sm:p-6
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-32
                w-64
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-cyan-400/[0.06]
                blur-3xl
                transition-all
                duration-700
                group-hover:bg-cyan-400/[0.1]
              "
            />

            <div className="relative flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div>
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <Sparkles className="h-4 w-4 text-cyan-300" />

                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                    Let's Build Something
                  </span>
                </div>

                <h3 className="mt-1.5 text-base font-bold text-white sm:text-lg">
                  Have an idea? Let's turn it into something real.
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Website • App • AI • Automation • Digital Solutions
                </p>
              </div>

              <a
                href="https://abhishek-digital-solutions-tech.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group/cta
                  inline-flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-cyan-400/20
                  bg-cyan-400/10
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-cyan-200
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-cyan-400/40
                  hover:bg-cyan-400/15
                  hover:text-white
                  active:scale-95
                "
              >
                Explore Digital Solutions

                <ExternalLink
                  className="
                    h-3.5
                    w-3.5
                    transition-transform
                    duration-300
                    group-hover/cta:translate-x-0.5
                    group-hover/cta:-translate-y-0.5
                  "
                />
              </a>
            </div>
          </section>

          {/* Bottom spacing */}
          <div className="h-2" />
        </div>
      </div>

      {/* ===================================================
          CUSTOM ANIMATIONS
      =================================================== */}

      <style>
        {`
          /* ================================================
             CONTACT CARD
          ================================================ */

          .contact-card {
            animation: contactCardIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .contact-card:nth-child(2) {
            animation-delay: 80ms;
          }

          @keyframes contactCardIn {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.985);
              filter: blur(4px);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          /* ================================================
             BACKGROUND PULSE
          ================================================ */

          @keyframes contactPulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.65;
            }

            50% {
              transform: scale(1.12);
              opacity: 1;
            }
          }

          @keyframes contactPulseSlow {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.5;
            }

            50% {
              transform: scale(1.18);
              opacity: 0.8;
            }
          }

          .animate-contact-pulse {
            animation: contactPulse 7s ease-in-out infinite;
          }

          .animate-contact-pulse-slow {
            animation: contactPulseSlow 11s ease-in-out infinite;
          }

          /* ================================================
             FLOATING PARTICLES
          ================================================ */

          .contact-particle {
            position: absolute;
            width: 3px;
            height: 3px;
            border-radius: 999px;
            background: rgba(103, 232, 249, 0.5);
            box-shadow: 0 0 12px rgba(103, 232, 249, 0.35);
            animation: contactParticleFloat 8s ease-in-out infinite;
          }

          .contact-particle-1 {
            left: 12%;
            top: 24%;
            animation-delay: -2s;
          }

          .contact-particle-2 {
            left: 73%;
            top: 16%;
            animation-delay: -5s;
            transform: scale(0.7);
          }

          .contact-particle-3 {
            left: 88%;
            top: 62%;
            animation-delay: -1s;
            transform: scale(0.6);
          }

          .contact-particle-4 {
            left: 42%;
            top: 80%;
            animation-delay: -4s;
            transform: scale(0.8);
          }

          .contact-particle-5 {
            left: 20%;
            top: 72%;
            animation-delay: -6s;
            transform: scale(0.5);
          }

          @keyframes contactParticleFloat {
            0%,
            100% {
              opacity: 0.2;
              transform: translate3d(0, 0, 0);
            }

            50% {
              opacity: 0.8;
              transform: translate3d(10px, -18px, 0);
            }
          }

          /* ================================================
             FORM INPUT
          ================================================ */

          .contact-input {
            width: 100%;
            border-radius: 14px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(15, 23, 42, 0.78);
            padding: 12px 14px;
            color: rgb(241, 245, 249);
            font-size: 13px;
            line-height: 1.5;
            outline: none;
            transition:
              border-color 220ms ease,
              background 220ms ease,
              box-shadow 220ms ease,
              transform 220ms ease;
          }

          .contact-input::placeholder {
            color: rgb(71, 85, 105);
          }

          .contact-input:hover {
            border-color: rgba(255, 255, 255, 0.12);
            background: rgba(15, 23, 42, 0.9);
          }

          .contact-input:focus {
            border-color: rgba(56, 189, 248, 0.45);
            background: rgba(15, 23, 42, 0.95);
            box-shadow:
              0 0 0 3px rgba(56, 189, 248, 0.08),
              0 8px 30px rgba(14, 165, 233, 0.05);
            transform: translateY(-1px);
          }

          /* ================================================
             ERROR SHAKE
          ================================================ */

          @keyframes contactShake {
            0%,
            100% {
              transform: translateX(0);
            }

            20% {
              transform: translateX(-5px);
            }

            40% {
              transform: translateX(5px);
            }

            60% {
              transform: translateX(-3px);
            }

            80% {
              transform: translateX(3px);
            }
          }

          .animate-contact-shake {
            animation: contactShake 0.35s ease-out;
          }

          /* ================================================
             SUCCESS
          ================================================ */

          @keyframes contactSuccess {
            0% {
              opacity: 0;
              transform: translateY(15px) scale(0.96);
            }

            70% {
              opacity: 1;
              transform: translateY(-2px) scale(1.01);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .contact-success {
            animation: contactSuccess 0.55s cubic-bezier(0.22, 1, 0.36, 1);
          }

          @keyframes contactCheck {
            0% {
              stroke-dashoffset: 100;
              opacity: 0;
              transform: scale(0.7);
            }

            60% {
              opacity: 1;
              transform: scale(1.08);
            }

            100% {
              stroke-dashoffset: 0;
              opacity: 1;
              transform: scale(1);
            }
          }

          .contact-check {
            animation: contactCheck 0.8s ease-out both;
          }

          /* ================================================
             REDUCED MOTION
          ================================================ */

          @media (prefers-reduced-motion: reduce) {
            .contact-card,
            .animate-contact-pulse,
            .animate-contact-pulse-slow,
            .contact-particle,
            .animate-contact-shake,
            .contact-success,
            .contact-check {
              animation: none !important;
            }

            .contact-input {
              transition: none !important;
            }
          }

          /* ================================================
             MOBILE
          ================================================ */

          @media (max-width: 640px) {
            .contact-input {
              font-size: 16px;
            }
          }

          /* ================================================
             SCROLLBAR
          ================================================ */

          .contact-app::-webkit-scrollbar {
            width: 7px;
          }

          .contact-app::-webkit-scrollbar-track {
            background: transparent;
          }

          .contact-app::-webkit-scrollbar-thumb {
            border-radius: 999px;
            background: rgba(148, 163, 184, 0.15);
          }

          .contact-app::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.25);
          }
        `}
      </style>
    </div>
  );
};

/* =========================================================
   QUICK STAT
========================================================= */

interface QuickStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const QuickStat: React.FC<QuickStatProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-white/[0.06]
        bg-slate-900/55
        p-3
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-400/15
        hover:bg-slate-900/80
      "
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className="mt-0.5 text-xs font-bold text-slate-200">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SECTION HEADER
========================================================= */

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-cyan-300">
        {icon}
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-200">
          {title}
        </h2>

        <p className="mt-0.5 text-[10px] text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   CONTACT INFO CARD
========================================================= */

interface ContactInfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  iconClass: string;
  bgClass: string;
  action?: React.ReactNode;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  icon,
  label,
  value,
  href,
  iconClass,
  bgClass,
  action,
}) => {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-white/[0.06]
        bg-slate-800/45
        p-3.5
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-white/[0.1]
        hover:bg-slate-800/70
      "
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${bgClass}
            ${iconClass}
            transition-transform
            duration-300
            group-hover:scale-105
          `}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
            {label}
          </div>

          <div className="mt-1 flex items-center gap-1">
            <a
              href={href}
              className="
                min-w-0
                truncate
                text-xs
                font-semibold
                text-slate-200
                transition-colors
                duration-200
                hover:text-cyan-300
                hover:underline
                sm:text-sm
              "
            >
              {value}
            </a>
          </div>
        </div>

        {action}
      </div>
    </div>
  );
};

/* =========================================================
   SOCIAL LINK
========================================================= */

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  iconClass: string;
  bgClass: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  icon,
  title,
  description,
  iconClass,
  bgClass,
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-white/[0.05]
        bg-slate-800/40
        p-3
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-white/[0.1]
        hover:bg-slate-800/80
        active:scale-[0.99]
      "
    >
      <div
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${bgClass}
          ${iconClass}
          transition-all
          duration-300
          group-hover:scale-110
        `}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-slate-200 transition-colors group-hover:text-white">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-slate-500 group-hover:text-slate-400">
          {description}
        </p>
      </div>

      <ArrowUpRight
        className="
          h-4
          w-4
          shrink-0
          text-slate-600
          transition-all
          duration-300
          group-hover:-translate-y-0.5
          group-hover:translate-x-0.5
          group-hover:text-cyan-300
        "
      />
    </a>
  );
};

/* =========================================================
   FORM FIELD
========================================================= */

interface FormFieldProps {
  label: string;
  icon: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  icon,
  required,
  children,
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
        <span className="text-cyan-400/80">
          {icon}
        </span>

        <span>{label}</span>

        {required && (
          <span className="text-red-400">*</span>
        )}
      </label>

      {children}
    </div>
  );
};

/* =========================================================
   SUCCESS STATE
========================================================= */

interface SuccessStateProps {
  onSendAnother: () => void;
}

const SuccessState: React.FC<SuccessStateProps> = ({
  onSendAnother,
}) => {
  return (
    <div className="contact-success py-10">
      <div className="mx-auto max-w-md text-center">
        {/* Success icon */}
        <div className="relative mx-auto mb-6 h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
            <CheckCircle
              className="contact-check h-10 w-10 text-emerald-400"
              strokeWidth={1.7}
            />
          </div>
        </div>

        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
          Transmission Complete
        </div>

        <h3 className="text-xl font-black text-white">
          Message Sent Successfully
        </h3>

        <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-slate-400">
          Thank you for connecting. Your message has been
          successfully delivered to Abhishek's workstation
          notification and dispatch queue.
        </p>

        {/* Status */}
        <div className="mx-auto mt-5 flex max-w-xs items-center justify-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05] px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

          <span className="text-[10px] font-semibold text-emerald-300">
            Communication channel remains active
          </span>
        </div>

        <button
          type="button"
          onClick={onSendAnother}
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-white/[0.08]
            bg-white/[0.05]
            px-4
            py-2.5
            text-xs
            font-bold
            text-slate-200
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-cyan-400/20
            hover:bg-cyan-400/10
            hover:text-cyan-200
            active:scale-95
          "
        >
          <MessageSquare className="h-3.5 w-3.5" />

          Send Another Message
        </button>
      </div>
    </div>
  );
};

export default ContactApp;