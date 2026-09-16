import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import { useOS } from "../../context/OSContext";

import {
  Award,
  ExternalLink,
  ShieldCheck,
  CalendarDays,
  Building2,
  Search,
  ArrowUpDown,
  ChevronDown,
  Grid3X3,
  List,
  Sparkles,
  BadgeCheck,
  Clock3,
  Copy,
  Check,
  X,
  Link2,
  BookOpen,
  SlidersHorizontal,
} from "lucide-react";

/* ============================================================================
   TYPES
============================================================================ */

type ViewMode = "grid" | "list";

type SortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "issuer-asc"
  | "issuer-desc";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  credential_id?: string;
  credential_url: string;
  description?: string;
  skills: string[];
  duration?: string;
  category: string;
  verified: boolean;
}

/* ============================================================================
   REAL CERTIFICATION DATA
============================================================================ */

const CERTIFICATIONS: Certification[] = [
  {
    id: "learning-rest-apis",
    name: "Learning REST APIs",
    issuer: "LinkedIn Learning",
    issue_date: "2023-12-27",
    credential_url:
      "https://www.linkedin.com/learning/certificates/88474c4cd59feaf2e365f3666048f3ce0b252f5394c84ea0bc36c1dd2def2bb0",
    description:
      "Completed the LinkedIn Learning course Learning REST APIs, covering REST API concepts and practical API fundamentals.",
    skills: ["REST APIs"],
    duration: "1 hour 6 minutes",
    category: "LinkedIn Learning",
    verified: true,
  },

  {
    id: "nodejs-essential-training",
    name: "React.js",
    issuer: "LinkedIn Learning",
    issue_date: "2023-12-20",

    /*
      IMPORTANT:
      Replace this URL with the actual Node.js certificate URL if you have
      the matching credential link.
    */
    credential_url:
      "https://www.linkedin.com/learning/certificates/88474c4cd59feaf2e365f3666048f3ce0b252f5394c84ea0bc36c1dd2def2bb0",

    description:
      "Completed Node.js Essential Training with Node.js listed as the primary skill covered.",
    skills: ["React.js, states, Redux"],
    duration: "1 hour 20 minutes",
    category: "LinkedIn Learning",
    verified: true,
  },

  {
    id: "credential-03",
    name: "Node.js Essential Traininge",
    issuer: "LinkedIn",
    issue_date: "2023",
    credential_url:
      "https://drive.google.com/file/d/1U9SjjaTxWWJrVP1KjDNgHus-9yOgNQI_/view",
    skills: ["REST APIs", "Node.js", "Database"],
    category: "Backend",
    verified: true,
  },

  {
    id: "credential-04",
    name: "Express Essentials",
    issuer: "LinkedIn",
    issue_date: "2023",
    credential_url:
      "https://drive.google.com/file/d/1WzPYdZTL7Te8089gKmlw4t1wy09KCGOA/view?usp=sharing",
    skills: ["Backend", "Express"],
    category: "Backend",
    verified: true,
  },

  {
    id: "credential-05",
    name: "Web Design & Development",
    issuer: "Skill India",
    issue_date: "2023",
    credential_url:
      "https://drive.google.com/file/d/1CYU2CVvTqgcH6ZI4hNE7tXb9r8ILmWpY/view",
    skills: ["Web", "UI", "HTML", "CSS"],
    category: "Frontend",
    verified: true,
  },

  {
    id: "credential-06",
    name: "UI-UX",
    issuer: "Great Learning",
    issue_date: "2021",
    credential_url:
      "https://drive.google.com/file/d/1gMbHmZFhuaT_ruL09EWAitqgsaVrOJUB/view",
    skills: [
      "Figma",
      "Wireframing",
      "Prototyping",
      "Responsive Design",
      "Design Systems",
    ],
    category: "UI/UX",
    verified: true,
  },

  {
    id: "credential-07",
    name: "Web Development",
    issuer: "Internshala",
    issue_date: "2021",
    credential_url:
      "https://drive.google.com/file/d/1gBzr712I6GqODo7ch6U9G0s4ltIUOXZ1/view",
    skills: ["HTML", "CSS", "Bootstrap", "DBMS", "JS", "React"],
    category: "Frontend",
    verified: true,
  },

  {
    id: "credential-08",
    name: "Frontend Web Development Bootcamp",
    issuer: "Infosys",
    issue_date: "2022",
    credential_url:
      "https://drive.google.com/file/d/1xY5psU9yAHn_kbBYB0t5VV9JwgPe6YL0/view",
    skills: ["HTML", "CSS", "Bootstrap", "DBMS", "JS", "React"],
    category: "Frontend",
    verified: true,
  },

  {
    id: "credential-09",
    name: "Developer Virtual Experience Program",
    issuer: "Accenture",
    issue_date: "2022",
    credential_url:
      "https://drive.google.com/file/d/18ktkGBW7Z9YdXCfULUrznQ4oQ_PpxC7s/view",
    skills: ["Developer"],
    category: "Program",
    verified: true,
  },

  {
    id: "credential-10",
    name: "Data Analytics and Visualization Virtual Experience",
    issuer: "Accenture",
    issue_date: "2022",
    credential_url:
      "https://drive.google.com/file/d/1mpo8ptTlD7goUbHUx1GkZObocOr1cB88/view",
    skills: ["Data Analytics"],
    category: "Data",
    verified: true,
  },

  {
    id: "credential-11",
    name: "Web Development Bootcamp",
    issuer: "Udemy",
    issue_date: "2023",
    credential_url:
      "https://drive.google.com/file/d/1SmM7wGJiZTGwIbhUDBhEM-moUcUSdsa9/view",
    skills: ["HTML", "CSS", "Bootstrap", "DBMS", "JS", "React"],
    category: "Frontend",
    verified: true,
  },

  {
    id: "parchment-credential",
    name: "Postman API Fundamentals Student Expert",
    issuer: "Parchment",
    issue_date: "2022",
    credential_url:
      "https://badges.parchment.com/public/assertions/3pcM2VUCRGSipKIRs04OGg",
    skills: ["API", "Postman"],
    category: "API",
    verified: true,
  },
];

/* ============================================================================
   HELPERS
============================================================================ */

function formatDate(date: string) {
  if (!date) return "Date not specified";

  return new Date(`${date}-01T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "credential";
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/* ============================================================================
   PORTAL SORT MENU
   THIS IS THE IMPORTANT UI FIX
============================================================================ */

interface SortMenuProps {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  sort: SortOption;
  setSort: (value: SortOption) => void;
  onClose: () => void;
  labels: Record<SortOption, string>;
}

const SortMenu: React.FC<SortMenuProps> = ({
  anchorRef,
  sort,
  setSort,
  onClose,
  labels,
}) => {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 220,
  });

  useEffect(() => {
    const updatePosition = () => {
      const button = anchorRef.current;

      if (!button) return;

      const rect = button.getBoundingClientRect();

      const menuWidth = 220;
      const gap = 8;

      let left = rect.right - menuWidth;

      if (left < 12) {
        left = 12;
      }

      if (left + menuWidth > window.innerWidth - 12) {
        left = window.innerWidth - menuWidth - 12;
      }

      let top = rect.bottom + gap;

      /*
        Keep dropdown inside viewport vertically.
      */
      const estimatedHeight = 270;

      if (top + estimatedHeight > window.innerHeight - 12) {
        top = Math.max(12, rect.top - estimatedHeight - gap);
      }

      setPosition({
        top,
        left,
        width: menuWidth,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        anchorRef.current &&
        !anchorRef.current.contains(target)
      ) {
        const menu = document.getElementById(
          "abhishek-os-certification-sort-menu"
        );

        if (menu && !menu.contains(target)) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [anchorRef, onClose]);

  return createPortal(
    <div
      id="abhishek-os-certification-sort-menu"
      className="
        fixed
        z-[2147483647]
        rounded-2xl
        border border-white/10
        bg-slate-950
        shadow-[0_25px_80px_rgba(0,0,0,0.65)]
        backdrop-blur-2xl
        p-1.5
        overflow-hidden
      "
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}
    >
      <div className="px-3 pt-2 pb-1">
        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-600 font-semibold">
          Sort credentials
        </div>
      </div>

      {(Object.entries(labels) as [SortOption, string][]).map(
        ([value, label]) => {
          const active = sort === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => {
                setSort(value);
                onClose();
              }}
              className={`
                w-full
                flex items-center justify-between
                gap-3
                px-3
                py-2.5
                rounded-xl
                text-left
                text-xs
                transition-all
                ${
                  active
                    ? "bg-sky-500/15 text-sky-300"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }
              `}
            >
              <span>{label}</span>

              {active && (
                <Check className="w-3.5 h-3.5 text-sky-400" />
              )}
            </button>
          );
        }
      )}
    </div>,
    document.body
  );
};

/* ============================================================================
   CERTIFICATION CARD
============================================================================ */

interface CertificationCardProps {
  cert: Certification;
  index: number;
  viewMode: ViewMode;
  onOpen: (cert: Certification) => void;
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  cert,
  index,
  viewMode,
  onOpen,
}) => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(cert.credential_url);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // Clipboard unavailable.
    }
  };

  if (viewMode === "list") {
    return (
      <article
        className="
          group
          relative
          overflow-hidden
          rounded-2xl
          border border-white/10
          bg-slate-900/70
          backdrop-blur-xl
          transition-all duration-300
          hover:border-sky-400/30
          hover:bg-slate-900
          hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]
        "
      >
        <div className="p-4 flex items-center gap-4">
          <div
            className="
              w-12 h-12
              shrink-0
              rounded-xl
              bg-gradient-to-br
              from-sky-500/20
              to-indigo-500/20
              border border-sky-400/20
              flex items-center justify-center
              text-sky-300
              font-bold
            "
          >
            {getInitials(cert.name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white truncate">
                {cert.name}
              </h3>

              {cert.verified && (
                <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {cert.issuer}
              </span>

              {cert.issue_date && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {formatDate(cert.issue_date)}
                </span>
              )}

              {cert.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock3 className="w-3.5 h-3.5" />
                  {cert.duration}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={copyLink}
              className="
                hidden sm:flex
                w-9 h-9
                rounded-lg
                border border-white/10
                bg-white/[0.04]
                items-center justify-center
                text-slate-400
                hover:text-white
                hover:bg-white/[0.08]
                transition
              "
              title="Copy credential URL"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpen(cert)}
              className="
                px-3 py-2
                rounded-xl
                bg-sky-500/10
                border border-sky-400/20
                text-sky-300
                text-xs font-semibold
                hover:bg-sky-500/20
                hover:border-sky-400/30
                transition
                flex items-center gap-1.5
              "
            >
              View
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border border-white/10
        bg-slate-900/70
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-1
        hover:border-sky-400/30
        hover:bg-slate-900/90
        hover:shadow-[0_25px_70px_rgba(0,0,0,0.35)]
      "
    >
      <div className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div
            className="
              w-14 h-14
              rounded-2xl
              bg-gradient-to-br
              from-sky-500/20
              via-indigo-500/15
              to-transparent
              border border-sky-400/20
              flex items-center justify-center
            "
          >
            {cert.id === "learning-rest-apis" ||
            cert.id === "nodejs-essential-training" ? (
              <BookOpen className="w-7 h-7 text-sky-300" />
            ) : (
              <Award className="w-7 h-7 text-sky-300" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-600">
              #{String(index + 1).padStart(2, "0")}
            </span>

            {cert.verified && (
              <div
                className="
                  px-2 py-1
                  rounded-full
                  bg-emerald-400/10
                  border border-emerald-400/15
                  text-emerald-300
                  text-[10px]
                  font-semibold
                  flex items-center gap-1
                "
              >
                <ShieldCheck className="w-3 h-3" />
                Verified
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-[10px] uppercase tracking-[0.18em] text-sky-400 font-semibold">
            {cert.category}
          </div>

          <h3 className="mt-1.5 text-lg font-bold text-white leading-snug">
            {cert.name}
          </h3>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span>{cert.issuer}</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-3">
          {cert.issue_date && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
              {formatDate(cert.issue_date)}
            </div>
          )}

          {cert.duration && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock3 className="w-3.5 h-3.5 text-slate-500" />
              {cert.duration}
            </div>
          )}
        </div>

        {cert.description && (
          <p className="mt-4 text-xs text-slate-400 leading-relaxed line-clamp-3">
            {cert.description}
          </p>
        )}

        {cert.skills.length > 0 && (
          <div className="mt-5">
            <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-2">
              Skills covered
            </div>

            <div className="flex flex-wrap gap-1.5">
              {cert.skills.map((skill) => (
                <span
                  key={skill}
                  className="
                    px-2.5 py-1
                    rounded-lg
                    bg-sky-500/[0.08]
                    border border-sky-400/15
                    text-[11px]
                    text-sky-300
                  "
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-white/[0.07]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-600 truncate min-w-0">
              <Link2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {getDomain(cert.credential_url)}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={copyLink}
                title="Copy credential URL"
                className="
                  w-8 h-8
                  rounded-lg
                  border border-white/10
                  bg-white/[0.03]
                  flex items-center justify-center
                  text-slate-500
                  hover:text-white
                  hover:bg-white/[0.07]
                  transition
                "
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onOpen(cert)}
                className="
                  px-3 py-1.5
                  rounded-lg
                  bg-sky-500/10
                  border border-sky-400/20
                  text-sky-300
                  text-xs font-semibold
                  hover:bg-sky-500/20
                  transition
                  flex items-center gap-1.5
                "
              >
                Verify
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ============================================================================
   MODAL
============================================================================ */

const CertificationModal: React.FC<{
  cert: Certification;
  onClose: () => void;
}> = ({ cert, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="
        fixed inset-0
        z-[2147483646]
        bg-black/75
        backdrop-blur-md
        flex items-center justify-center
        p-4
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          bg-slate-950
          border border-white/10
          shadow-[0_40px_120px_rgba(0,0,0,0.7)]
        "
      >
        <div
          className="
            sticky top-0 z-10
            p-5
            border-b border-white/10
            bg-slate-950/95
            backdrop-blur-xl
            flex items-start justify-between gap-4
          "
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="
                w-12 h-12
                shrink-0
                rounded-2xl
                bg-sky-500/10
                border border-sky-400/20
                flex items-center justify-center
              "
            >
              <Award className="w-6 h-6 text-sky-300" />
            </div>

            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.18em] text-sky-400">
                Certification
              </div>

              <h2 className="text-lg font-bold text-white mt-1 truncate">
                {cert.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              w-9 h-9
              shrink-0
              rounded-xl
              bg-white/[0.04]
              border border-white/10
              text-slate-400
              hover:text-white
              hover:bg-white/[0.08]
              flex items-center justify-center
            "
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div
            className="
              p-4
              rounded-2xl
              bg-emerald-400/[0.04]
              border border-emerald-400/15
            "
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />

              <div>
                <div className="text-sm font-semibold text-emerald-300">
                  Credential available for verification
                </div>

                <div className="text-xs text-slate-500 mt-0.5">
                  Opens the original credential source.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs text-slate-500">
                Issuing organization
              </div>

              <div className="mt-2 text-sm font-semibold text-white">
                {cert.issuer}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs text-slate-500">
                Issue date
              </div>

              <div className="mt-2 text-sm font-semibold text-white">
                {cert.issue_date
                  ? formatDate(cert.issue_date)
                  : "Not specified"}
              </div>
            </div>

            {cert.duration && (
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-xs text-slate-500">
                  Course duration
                </div>

                <div className="mt-2 text-sm font-semibold text-white">
                  {cert.duration}
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs text-slate-500">
                Category
              </div>

              <div className="mt-2 text-sm font-semibold text-white">
                {cert.category}
              </div>
            </div>
          </div>

          {cert.skills.length > 0 && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs text-slate-500 mb-3">
                Skills covered
              </div>

              <div className="flex flex-wrap gap-2">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="
                      px-3 py-1.5
                      rounded-xl
                      bg-sky-500/10
                      border border-sky-400/15
                      text-xs
                      text-sky-300
                    "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cert.description && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs text-slate-500 mb-2">
                About this credential
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {cert.description}
              </p>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
            <div className="text-xs text-slate-500 mb-2">
              Credential URL
            </div>

            <div className="text-xs font-mono text-slate-400 break-all">
              {cert.credential_url}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              window.open(
                cert.credential_url,
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="
              w-full
              py-3.5
              rounded-2xl
              bg-gradient-to-r
              from-sky-500/20
              to-indigo-500/20
              border border-sky-400/25
              text-sky-200
              text-sm font-semibold
              hover:from-sky-500/30
              hover:to-indigo-500/30
              hover:border-sky-400/40
              transition
              flex items-center justify-center gap-2
            "
          >
            Open Original Credential
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ============================================================================
   MAIN APP
============================================================================ */

export const CertificationsApp: React.FC = () => {
  const { certifications } = useOS();

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] =
    useState<ViewMode>("grid");

  const [sort, setSort] =
    useState<SortOption>("newest");

  const [sortOpen, setSortOpen] =
    useState(false);

  const [selectedCert, setSelectedCert] =
    useState<Certification | null>(null);

  const sortButtonRef =
    useRef<HTMLButtonElement | null>(null);

  /* --------------------------------------------------------------------------
     SORT LABELS
  -------------------------------------------------------------------------- */

  const sortLabel: Record<SortOption, string> = {
    newest: "Newest first",
    oldest: "Oldest first",
    "title-asc": "Title A → Z",
    "title-desc": "Title Z → A",
    "issuer-asc": "Issuer A → Z",
    "issuer-desc": "Issuer Z → A",
  };

  /* --------------------------------------------------------------------------
     MERGE CONTEXT DATA
  -------------------------------------------------------------------------- */

  const mergedCertifications = useMemo(() => {
    const map = new Map<string, Certification>();

    CERTIFICATIONS.forEach((cert) => {
      map.set(cert.credential_url, cert);
    });

    (certifications || []).forEach((cert: any) => {
      if (!cert?.credential_url) return;

      const existing = map.get(cert.credential_url);

      map.set(cert.credential_url, {
        ...(existing || {}),
        ...cert,
        skills:
          cert.skills ||
          existing?.skills ||
          [],
        category:
          cert.category ||
          existing?.category ||
          "Professional Certification",
        verified:
          cert.verified ??
          existing?.verified ??
          true,
      });
    });

    return Array.from(map.values());
  }, [certifications]);

  /* --------------------------------------------------------------------------
     FILTER + SORT
  -------------------------------------------------------------------------- */

  const filteredCertifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = mergedCertifications.filter((cert) => {
      if (!query) return true;

      return [
        cert.name,
        cert.issuer,
        cert.category,
        cert.description,
        ...cert.skills,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (
            new Date(a.issue_date || "1900-01-01").getTime() -
            new Date(b.issue_date || "1900-01-01").getTime()
          );

        case "title-asc":
          return a.name.localeCompare(b.name);

        case "title-desc":
          return b.name.localeCompare(a.name);

        case "issuer-asc":
          return a.issuer.localeCompare(b.issuer);

        case "issuer-desc":
          return b.issuer.localeCompare(a.issuer);

        case "newest":
        default:
          return (
            new Date(b.issue_date || "1900-01-01").getTime() -
            new Date(a.issue_date || "1900-01-01").getTime()
          );
      }
    });
  }, [mergedCertifications, search, sort]);

  const verifiedCount =
    mergedCertifications.filter(
      (cert) => cert.verified
    ).length;

  /* --------------------------------------------------------------------------
     RENDER
  -------------------------------------------------------------------------- */

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-slate-950 text-slate-100">
      <div
        className="
          max-w-[1500px]
          mx-auto
          p-4
          sm:p-6
          lg:p-8
          space-y-6
        "
      >
        {/* ==================================================================
            HERO
        ================================================================== */}

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
            p-5
            sm:p-7
            shadow-[0_20px_70px_rgba(0,0,0,0.25)]
          "
        >
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

          <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className="
                  w-14 h-14
                  sm:w-16 sm:h-16
                  shrink-0
                  rounded-2xl
                  bg-gradient-to-br
                  from-sky-500/20
                  to-indigo-500/20
                  border border-sky-400/20
                  flex items-center justify-center
                "
              >
                <Award className="w-7 h-7 sm:w-8 sm:h-8 text-sky-300" />
              </div>

              <div>
                <div
                  className="
                    flex items-center gap-2
                    text-[10px]
                    sm:text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-sky-400
                  "
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Credentials Registry
                </div>

                <h1 className="mt-1.5 text-xl sm:text-2xl font-bold text-white">
                  Certifications & Professional Credentials
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  Verified learning achievements, professional
                  certifications and credentials earned throughout
                  the development journey.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="px-4 py-3 rounded-2xl bg-white/[0.035] border border-white/10">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">
                  Credentials
                </div>

                <div className="text-xl font-bold text-white mt-1">
                  {mergedCertifications.length}
                </div>
              </div>

              <div className="px-4 py-3 rounded-2xl bg-emerald-400/[0.035] border border-emerald-400/10">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">
                  Verified
                </div>

                <div className="text-xl font-bold text-emerald-300 mt-1">
                  {verifiedCount}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            TOOLBAR
        ================================================================== */}

        <section
          className="
            relative
            z-20
            rounded-2xl
            border border-white/10
            bg-slate-900/60
            backdrop-blur-xl
            p-3
          "
        >
          <div className="flex flex-col lg:flex-row gap-3">
            {/* SEARCH */}

            <div className="relative flex-1">
              <Search
                className="
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  w-4 h-4
                  text-slate-500
                  pointer-events-none
                "
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search certifications, skills, issuers..."
                className="
                  w-full
                  h-11
                  pl-10
                  pr-10
                  rounded-xl
                  bg-slate-950/70
                  border border-white/10
                  text-sm
                  text-white
                  placeholder:text-slate-600
                  outline-none
                  focus:border-sky-400/40
                  focus:ring-2
                  focus:ring-sky-400/10
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                    hover:text-white
                  "
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {/* ============================================================
                  SORT BUTTON
              ============================================================ */}

              <button
                ref={sortButtonRef}
                type="button"
                onClick={() =>
                  setSortOpen((value) => !value)
                }
                className="
                  h-11
                  px-3.5
                  rounded-xl
                  border border-white/10
                  bg-slate-950/70
                  text-xs
                  text-slate-300
                  hover:text-white
                  hover:bg-slate-950
                  flex
                  items-center
                  gap-2
                  transition
                "
              >
                <ArrowUpDown className="w-4 h-4 text-sky-400" />

                <span className="hidden sm:block">
                  {sortLabel[sort]}
                </span>

                <ChevronDown
                  className={`
                    w-3.5 h-3.5
                    transition-transform
                    ${sortOpen ? "rotate-180" : ""}
                  `}
                />
              </button>

              {sortOpen && (
                <SortMenu
                  anchorRef={sortButtonRef}
                  sort={sort}
                  setSort={setSort}
                  onClose={() => setSortOpen(false)}
                  labels={sortLabel}
                />
              )}

              {/* ============================================================
                  VIEW SWITCHER
              ============================================================ */}

              <div
                className="
                  h-11
                  p-1
                  rounded-xl
                  border border-white/10
                  bg-slate-950/70
                  flex
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setViewMode("grid")
                  }
                  className={`
                    w-9
                    h-9
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    transition
                    ${
                      viewMode === "grid"
                        ? "bg-sky-500/15 text-sky-300"
                        : "text-slate-500 hover:text-white hover:bg-white/[0.04]"
                    }
                  `}
                  title="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setViewMode("list")
                  }
                  className={`
                    w-9
                    h-9
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    transition
                    ${
                      viewMode === "list"
                        ? "bg-sky-500/15 text-sky-300"
                        : "text-slate-500 hover:text-white hover:bg-white/[0.04]"
                    }
                  `}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5" />

              Showing

              <span className="text-slate-300">
                {filteredCertifications.length}
              </span>

              credentials
            </div>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="
                  text-[11px]
                  text-sky-400
                  hover:text-sky-300
                "
              >
                Clear search
              </button>
            )}
          </div>
        </section>

        {/* ==================================================================
            CERTIFICATIONS
        ================================================================== */}

        {filteredCertifications.length === 0 ? (
          <div
            className="
              rounded-3xl
              border border-white/10
              bg-slate-900/50
              p-12
              text-center
            "
          >
            <Search className="w-8 h-8 mx-auto text-slate-600" />

            <h3 className="mt-4 text-white font-semibold">
              No certifications found
            </h3>

            <p className="mt-2 text-xs text-slate-500">
              Try searching for another certification or skill.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                : "space-y-3"
            }
          >
            {filteredCertifications.map(
              (cert, index) => (
                <CertificationCard
                  key={cert.id}
                  cert={cert}
                  index={index}
                  viewMode={viewMode}
                  onOpen={setSelectedCert}
                />
              )
            )}
          </div>
        )}

        {/* ==================================================================
            FOOTER
        ================================================================== */}

        <div
          className="
            rounded-2xl
            border border-white/[0.07]
            bg-white/[0.02]
            px-4
            py-3
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-2
          "
        >
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Credentials link back to their original verification sources.
          </div>

          <div className="text-[10px] font-mono text-slate-600">
            ABHISHEK OS • CREDENTIALS.REGISTRY
          </div>
        </div>
      </div>

      {selectedCert && (
        <CertificationModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};

export default CertificationsApp;