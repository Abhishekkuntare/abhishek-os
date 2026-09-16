import React from "react";
import { useOS } from "../../context/OSContext";
import {
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  CheckCircle2,
  School,
  Building2,
  BriefcaseBusiness,
  ChevronRight,
  Sparkles,
  Clock3,
  BadgeCheck,
} from "lucide-react";

interface AcademicStageProps {
  number: string;
  icon: React.ReactNode;
  type: string;
  title: string;
  institution: string;
  location: string;
  period: string;
  status: string;
  description: string;
  accent?: "sky" | "indigo" | "emerald";
  children?: React.ReactNode;
}

const AcademicStage: React.FC<AcademicStageProps> = ({
  number,
  icon,
  type,
  title,
  institution,
  location,
  period,
  status,
  description,
  accent = "sky",
  children,
}) => {
  const accentClasses = {
    sky: {
      icon: "bg-sky-500/10 border-sky-400/20 text-sky-300",
      label: "text-sky-400",
      line: "bg-sky-400/30",
      glow: "bg-sky-500/10",
      status:
        "bg-sky-500/10 border-sky-400/20 text-sky-300",
    },
    indigo: {
      icon: "bg-indigo-500/10 border-indigo-400/20 text-indigo-300",
      label: "text-indigo-400",
      line: "bg-indigo-400/30",
      glow: "bg-indigo-500/10",
      status:
        "bg-indigo-500/10 border-indigo-400/20 text-indigo-300",
    },
    emerald: {
      icon: "bg-emerald-500/10 border-emerald-400/20 text-emerald-300",
      label: "text-emerald-400",
      line: "bg-emerald-400/30",
      glow: "bg-emerald-500/10",
      status:
        "bg-emerald-500/10 border-emerald-400/20 text-emerald-300",
    },
  };

  const colors = accentClasses[accent];

  return (
    <div className="relative flex gap-4 sm:gap-6">
      {/* Timeline */}
      <div className="relative flex flex-col items-center shrink-0">
        <div
          className={`
            relative z-10
            w-11 h-11 sm:w-14 sm:h-14
            rounded-2xl
            border
            ${colors.icon}
            flex items-center justify-center
            shadow-[0_10px_30px_rgba(0,0,0,0.25)]
          `}
        >
          {icon}
        </div>

        <div
          className={`
            absolute
            top-14
            bottom-[-28px]
            w-px
            ${colors.line}
          `}
        />
      </div>

      {/* Content */}
      <article
        className="
          relative
          flex-1
          min-w-0
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-slate-900/70
          backdrop-blur-xl
          shadow-[0_20px_60px_rgba(0,0,0,0.20)]
          transition-all duration-300
          hover:border-white/15
          hover:bg-slate-900/90
          hover:-translate-y-[2px]
        "
      >
        {/* Glow */}
        <div
          className={`
            absolute
            -top-24
            -right-24
            w-64
            h-64
            rounded-full
            ${colors.glow}
            blur-3xl
            pointer-events-none
          `}
        />

        <div className="relative p-5 sm:p-6">
          {/* Top row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="min-w-0">
                <div
                  className={`
                    flex items-center gap-2
                    text-[10px] sm:text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    ${colors.label}
                  `}
                >
                  <span>{number}</span>
                  <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                  <span>{type}</span>
                </div>

                <h3 className="mt-2 text-lg sm:text-xl font-bold text-white leading-tight">
                  {title}
                </h3>

                <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{institution}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`
                  inline-flex items-center gap-1.5
                  px-2.5 py-1.5
                  rounded-xl
                  border
                  text-[10px]
                  font-semibold
                  ${colors.status}
                `}
              >
                <BadgeCheck className="w-3.5 h-3.5" />
                {status}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] uppercase tracking-wider text-slate-600">
                  Period
                </div>
                <div className="mt-0.5 text-xs font-medium text-slate-300 truncate">
                  {period}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] uppercase tracking-wider text-slate-600">
                  Location
                </div>
                <div className="mt-0.5 text-xs font-medium text-slate-300 truncate">
                  {location}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
            {description}
          </p>

          {/* Extra content */}
          {children && <div className="mt-5">{children}</div>}
        </div>
      </article>
    </div>
  );
};

export const EducationApp: React.FC = () => {
  const { education } = useOS();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 select-text">
      <div className="max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* ================================================================
            HERO
        ================================================================ */}
        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            border border-white/10
            bg-gradient-to-br
            from-slate-900
            via-slate-900
            to-indigo-950/40
            p-5 sm:p-7
            shadow-[0_25px_80px_rgba(0,0,0,0.28)]
          "
        >
          {/* Background effects */}
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Title */}
            <div className="flex items-start gap-4 min-w-0">
              <div
                className="
                  w-14 h-14 sm:w-16 sm:h-16
                  shrink-0
                  rounded-2xl
                  bg-gradient-to-br
                  from-sky-500/20
                  to-indigo-500/20
                  border border-sky-400/20
                  flex items-center justify-center
                  shadow-[0_12px_35px_rgba(14,165,233,0.12)]
                "
              >
                <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-sky-300" />
              </div>

              <div className="min-w-0">
                <div
                  className="
                    flex items-center gap-2
                    text-[10px] sm:text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-sky-400
                  "
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Academic Background
                </div>

                <h1 className="mt-1.5 text-xl sm:text-2xl font-bold text-white">
                  Education & Academic Journey
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  A timeline of my academic journey from school education
                  through vocational studies and engineering.
                </p>
              </div>
            </div>

            {/* CGPA */}
            {education?.cgpa && (
              <div
                className="
                  flex items-center gap-3
                  px-4 py-3
                  rounded-2xl
                  bg-slate-800/80
                  border border-white/10
                  shadow-lg
                  shrink-0
                "
              >
                <div
                  className="
                    w-10 h-10
                    rounded-xl
                    bg-amber-400/10
                    border border-amber-400/15
                    flex items-center justify-center
                  "
                >
                  <Award className="w-5 h-5 text-amber-400" />
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">
                    Current CGPA
                  </div>

                  <div className="text-lg font-bold text-white mt-0.5">
                    {education.cgpa}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================================================================
            ACADEMIC JOURNEY
        ================================================================ */}
        <section
          className="
            rounded-3xl
            border border-white/10
            bg-slate-900/40
            p-4 sm:p-6
            backdrop-blur-xl
          "
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Clock3 className="w-4 h-4 text-sky-400" />
                Academic Timeline
              </div>

              <p className="mt-1 text-[11px] text-slate-600">
                From foundational education to engineering
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-600 font-mono">
              <span>EDU</span>
              <ChevronRight className="w-3 h-3" />
              <span>ACADEMIC_RECORD</span>
            </div>
          </div>

          <div className="space-y-7">

            {/* ============================================================
                SCHOOL
            ============================================================ */}
            <AcademicStage
              number="01"
              icon={<School className="w-5 h-5 sm:w-6 sm:h-6" />}
              type="School Education"
              title="Secondary School Education"
              institution="Ram Krishna Krida Vidhalaya"
              location="Amravati, Maharashtra"
              period="Completed • 2018"
              status="Completed"
              description="Completed school-level education and established the academic foundation for higher studies."
              accent="sky"
            />

            {/* ============================================================
                JUNIOR COLLEGE
            ============================================================ */}
            <AcademicStage
              number="02"
              icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />}
              type="Junior College"
              title="Vocational Education"
              institution="Rural Institute of Jr. College"
              location="Amravati, Maharashtra"
              period="Completed • 2020"
              status="Completed"
              description="Completed vocational education at the junior college level, building practical and technical fundamentals before moving into engineering."
              accent="indigo"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-indigo-500/[0.05] border border-indigo-400/10">
                  <div className="text-[10px] uppercase tracking-wider text-slate-600">
                    Program
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-300">
                    Vocational
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/[0.05] border border-indigo-400/10">
                  <div className="text-[10px] uppercase tracking-wider text-slate-600">
                    Completion
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-300">
                    2020
                  </div>
                </div>
              </div>
            </AcademicStage>

            {/* ============================================================
                ENGINEERING — EXISTING OS DATA
            ============================================================ */}
            <AcademicStage
              number="03"
              icon={<GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />}
              type="Engineering"
              title={`${education.degree} in ${education.field}`}
              institution={education.institution}
              location={education.location}
              period={`${education.start_date} – ${education.end_date}`}
              status="Engineering"
              description="Engineering education focused on technology, software development, artificial intelligence, data-driven systems and modern application development."
              accent="emerald"
            >
              {/* Engineering information */}
              <div className="space-y-4">

                {/* Academic Highlights */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    Academic Highlights & Coursework
                  </div>

                  <div className="space-y-2">
                    {(education?.description || []).map((item, index) => (
                      <div
                        key={index}
                        className="
                          flex items-start gap-2.5
                          text-xs sm:text-sm
                          text-slate-300
                          leading-relaxed
                        "
                      >
                        <CheckCircle2
                          className="
                            w-4 h-4
                            text-emerald-400
                            shrink-0
                            mt-0.5
                          "
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engineering Record */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                    Institutional Record
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

                    <div className="p-3 rounded-xl bg-slate-800/50 border border-white/[0.06]">
                      <div className="text-[10px] text-slate-500">
                        Degree
                      </div>

                      <div className="mt-1 text-xs font-semibold text-slate-200">
                        {education.degree}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/50 border border-white/[0.06]">
                      <div className="text-[10px] text-slate-500">
                        Major Field
                      </div>

                      <div className="mt-1 text-xs font-semibold text-slate-200">
                        {education.field}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/50 border border-white/[0.06]">
                      <div className="text-[10px] text-slate-500">
                        Cumulative GPA
                      </div>

                      <div className="mt-1 text-xs font-semibold text-amber-400">
                        {education.cgpa}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/50 border border-white/[0.06]">
                      <div className="text-[10px] text-slate-500">
                        Location
                      </div>

                      <div className="mt-1 text-xs font-semibold text-slate-200">
                        {education.location}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </AcademicStage>
          </div>
        </section>

        {/* ================================================================
            EDUCATION SUMMARY
        ================================================================ */}
        <section
          className="
            rounded-2xl
            border border-white/[0.07]
            bg-white/[0.02]
            px-4 sm:px-5
            py-4
          "
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div className="flex items-start gap-3">
              <div
                className="
                  w-9 h-9
                  rounded-xl
                  bg-sky-500/10
                  border border-sky-400/15
                  flex items-center justify-center
                  shrink-0
                "
              >
                <BriefcaseBusiness className="w-4 h-4 text-sky-400" />
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-300">
                  Academic progression
                </div>

                <div className="mt-1 text-[11px] text-slate-600">
                  School → Vocational Education → Engineering
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ACADEMIC_RECORD_READY
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1 pb-2">
          <div className="flex items-center gap-2 text-[10px] text-slate-600">
            <GraduationCap className="w-3.5 h-3.5" />
            ABHISHEK OS • EDUCATION
          </div>

          <div className="text-[10px] font-mono text-slate-700">
            EDUCATION.REGISTRY
          </div>
        </div>

      </div>
    </div>
  );
};

export default EducationApp;