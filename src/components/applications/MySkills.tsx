import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  BarChart3,
  Box,
  Brain,
  BriefcaseBusiness,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Circle,
  Code2,
  Compass,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  FileCode2,
  Filter,
  Flower2,
  FolderCode,
  Gauge,
  Github,
  Globe,
  Grip,
  Hammer,
  Hash,
  Heart,
  Layers,
  Layout,
  Leaf,
  Lightbulb,
  Link2,
  Lock,
  Monitor,
  MousePointer2,
  Network,
  Palette,
  Play,
  RotateCcw,
  Search,
  Server,
  Settings2,
  Shield,
  Sparkles,
  Star,
  Terminal,
  TestTube2,
  Type,
  Wand2,
  Wrench,
  X,
  Zap,
} from 'lucide-react';

import { useOS } from '../../context/OSContext';


// ============================================================
// TYPES
// ============================================================

type Skill = {
  id: string;
  name: string;
  category: string;
};

type CategoryConfig = {
  title: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  description: string;
};


// ============================================================
// CATEGORY CONFIGURATION
// ============================================================

const CATEGORIES: CategoryConfig[] = [
  {
    title: 'Programming Languages',
    icon: Code2,
    color: 'text-sky-400',
    glow: 'rgba(56,189,248,0.35)',
    description: 'Core programming languages and development fundamentals.',
  },
  {
    title: 'Frontend',
    icon: Layout,
    color: 'text-indigo-400',
    glow: 'rgba(129,140,248,0.35)',
    description: 'Modern interfaces, responsive experiences and web applications.',
  },
  {
    title: 'Backend & Database',
    icon: Database,
    color: 'text-emerald-400',
    glow: 'rgba(52,211,153,0.35)',
    description: 'Server-side systems, APIs, databases and application architecture.',
  },
  {
    title: 'AI / API',
    icon: Sparkles,
    color: 'text-amber-400',
    glow: 'rgba(251,191,36,0.35)',
    description: 'AI integrations, APIs, automation and intelligent applications.',
  },
  {
    title: 'Tools / Engineering',
    icon: Wrench,
    color: 'text-purple-400',
    glow: 'rgba(192,132,252,0.35)',
    description: 'Developer tools, deployment, version control and engineering workflow.',
  },
];


// ============================================================
// SKILL ICON RESOLVER
// ============================================================

const getSkillIcon = (skillName: string): React.ElementType => {
  const name = skillName.toLowerCase();

  if (name.includes('react')) return Code2;
  if (name.includes('typescript')) return Type;
  if (name.includes('javascript') || name === 'js') return FileCode2;
  if (name.includes('python')) return Terminal;
  if (name.includes('java')) return CoffeeIcon;
  if (name.includes('c++') || name.includes('cpp')) return Hash;
  if (name.includes('html')) return Globe;
  if (name.includes('css')) return Palette;
  if (name.includes('tailwind')) return Wand2;
  if (name.includes('next')) return Layers;
  if (name.includes('vite')) return Zap;
  if (name.includes('node')) return Server;
  if (name.includes('express')) return Network;
  if (name.includes('sql')) return Database;
  if (name.includes('mongo')) return Database;
  if (name.includes('postgres')) return Database;
  if (name.includes('mysql')) return Database;
  if (name.includes('firebase')) return Zap;
  if (name.includes('supabase')) return Database;
  if (name.includes('api')) return Link2;
  if (name.includes('openai')) return Brain;
  if (name.includes('gemini')) return Sparkles;
  if (name.includes('ai')) return Brain;
  if (name.includes('machine')) return Brain;
  if (name.includes('learning')) return Brain;
  if (name.includes('git')) return GitBranchIcon;
  if (name.includes('github')) return Github;
  if (name.includes('docker')) return Box;
  if (name.includes('aws')) return CloudIcon;
  if (name.includes('azure')) return CloudIcon;
  if (name.includes('figma')) return Palette;
  if (name.includes('vscode') || name.includes('visual studio')) {
    return Code2;
  }
  if (name.includes('linux')) return Terminal;
  if (name.includes('windows')) return Monitor;
  if (name.includes('terminal')) return Terminal;
  if (name.includes('vercel')) return Globe;
  if (name.includes('npm')) return PackageIcon;
  if (name.includes('redux')) return Layers;
  if (name.includes('graphql')) return Network;
  if (name.includes('rest')) return Link2;
  if (name.includes('testing')) return TestTube2;
  if (name.includes('security')) return Shield;
  if (name.includes('cyber')) return Lock;
  if (name.includes('ui')) return Layout;
  if (name.includes('ux')) return MousePointer2;
  if (name.includes('design')) return Palette;
  if (name.includes('database')) return Database;
  if (name.includes('backend')) return Server;
  if (name.includes('frontend')) return Layout;
  if (name.includes('cloud')) return CloudIcon;
  if (name.includes('devops')) return Settings2;
  if (name.includes('automation')) return Zap;

  return Sparkles;
};


// Small aliases using lucide icons so we don't need additional packages.
const CoffeeIcon = BriefcaseBusiness;
// const GitBranchIcon = GitBranch;
const CloudIcon = Globe;
const PackageIcon = Box;
const GitBranch = Network;


// ============================================================
// COLOR SYSTEM
// ============================================================

const getCategoryConfig = (category: string): CategoryConfig => {
  return (
    CATEGORIES.find(categoryItem => categoryItem.title === category) ??
    CATEGORIES[0]
  );
};


// ============================================================
// DETERMINISTIC FALL POSITIONS
// ============================================================

const getFallPosition = (
  index: number,
  total: number,
  seed = 0,
) => {
  const columns = 6;

  const column = index % columns;
  const row = Math.floor(index / columns);

  const xPattern = [
    7,
    20,
    34,
    50,
    66,
    82,
  ];

  const x =
    xPattern[column] +
    (((index * 17 + seed * 13) % 12) - 6);

  const y =
    12 +
    row * 15 +
    ((index * 23 + seed * 7) % 11);

  const rotation =
    ((index * 47 + seed * 19) % 56) - 28;

  const scale =
    0.88 + ((index * 13) % 25) / 100;

  return {
    x: Math.max(4, Math.min(88, x)),
    y: Math.max(8, Math.min(86, y)),
    rotation,
    scale,
  };
};


// ============================================================
// DECORATIVE FLOATING OBJECTS
// ============================================================

const FLOATING_OBJECTS = [
  {
    type: 'circle',
    x: 5,
    y: 12,
    size: 46,
  },
  {
    type: 'triangle',
    x: 17,
    y: 72,
    size: 42,
  },
  {
    type: 'arrow',
    x: 31,
    y: 15,
    size: 64,
  },
  {
    type: 'circle',
    x: 48,
    y: 78,
    size: 30,
  },
  {
    type: 'arrow',
    x: 66,
    y: 18,
    size: 68,
  },
  {
    type: 'triangle',
    x: 83,
    y: 73,
    size: 38,
  },
  {
    type: 'circle',
    x: 91,
    y: 21,
    size: 52,
  },
];


// ============================================================
// COMPONENT
// ============================================================

export const MySkills: React.FC = () => {
  const { skills } = useOS();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<string>('All');

  const [isFalling, setIsFalling] = useState(false);

  const [selectedSkill, setSelectedSkill] =
    useState<Skill | null>(null);

  const [fallSeed, setFallSeed] = useState(0);

  const [showDecorations, setShowDecorations] =
    useState(true);

  const [isDraggingMode, setIsDraggingMode] =
    useState(false);

  const [isMobileFilterOpen, setIsMobileFilterOpen] =
    useState(false);


  // ==========================================================
  // FILTERED SKILLS
  // ==========================================================

  const filteredSkills = useMemo(() => {
    const query = searchFilter.trim().toLowerCase();

    return skills.filter(skill => {
      const matchesSearch =
        !query ||
        skill.name.toLowerCase().includes(query) ||
        skill.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All' ||
        skill.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [
    skills,
    searchFilter,
    selectedCategory,
  ]);


  // ==========================================================
  // TOTALS
  // ==========================================================

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    skills.forEach(skill => {
      counts[skill.category] =
        (counts[skill.category] || 0) + 1;
    });

    return counts;
  }, [skills]);


  // ==========================================================
  // FALL ANIMATION
  // ==========================================================

  const activateFallMode = useCallback(() => {
    setSelectedSkill(null);
    setFallSeed(value => value + 1);
    setIsFalling(true);
  }, []);


  const restoreStaticMode = useCallback(() => {
    setIsDraggingMode(false);
    setSelectedSkill(null);
    setIsFalling(false);
  }, []);


  const shuffleSkills = useCallback(() => {
    setFallSeed(value => value + 1);
    setIsFalling(true);
  }, []);


  // ==========================================================
  // KEYBOARD ESC
  // ==========================================================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedSkill(null);
      }

      if (
        event.key === 'r' &&
        (event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();
        restoreStaticMode();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [restoreStaticMode]);


  // ==========================================================
  // SKILL CARD
  // ==========================================================

  const renderSkillCard = (
    skill: Skill,
    index: number,
    isPlayground = false,
  ) => {
    const Icon = getSkillIcon(skill.name);

    const category =
      getCategoryConfig(skill.category);

    const fall =
      getFallPosition(
        index,
        filteredSkills.length,
        fallSeed,
      );

    const isSelected =
      selectedSkill?.id === skill.id;


    if (isPlayground) {
      return (
        <motion.div
          key={skill.id}
          layoutId={`skill-${skill.id}`}
          drag={isDraggingMode}
          dragMomentum
          dragElastic={0.18}
          whileDrag={{
            scale: 1.12,
            rotate: 0,
            zIndex: 100,
            cursor: 'grabbing',
          }}
          initial={{
            opacity: 0,
            x: `${fall.x + (index % 2 === 0 ? -20 : 20)}vw`,
            y: '-30vh',
            rotate: fall.rotation * 1.8,
            scale: 0.45,
          }}
          animate={{
            opacity: 1,
            x: `${fall.x - 50}vw`,
            y: `${fall.y - 8}vh`,
            rotate: fall.rotation,
            scale: fall.scale,
          }}
          transition={{
            type: 'spring',
            stiffness: 70,
            damping: 13,
            mass: 0.85,
            delay: index * 0.045,
          }}
          onClick={() => {
            if (!isDraggingMode) {
              setSelectedSkill(skill);
            }
          }}
          className="absolute left-1/2 top-0 w-[145px] sm:w-[165px] cursor-grab touch-none"
          style={{
            zIndex: isSelected ? 80 : 20,
          }}
        >
          <motion.div
            whileHover={{
              scale: 1.06,
              y: -5,
            }}
            className={[
              'relative overflow-hidden',
              'rounded-2xl',
              'border border-white/10',
              'bg-slate-900/90',
              'backdrop-blur-xl',
              'shadow-2xl',
              'p-3',
              isSelected
                ? 'ring-2 ring-sky-400/70'
                : '',
            ].join(' ')}
          >
            {/* Glow */}
            <div
              className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{
                background:
                  category.glow,
              }}
            />

            {/* Tiny decorative line */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative flex items-center gap-2.5">
              <div
                className={[
                  'w-10 h-10 shrink-0',
                  'rounded-xl',
                  'flex items-center justify-center',
                  'bg-white/[0.06]',
                  'border border-white/10',
                  category.color,
                ].join(' ')}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  Skill
                </p>

                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  {skill.name}
                </p>
              </div>
            </div>

            <div className="relative mt-3 flex items-center justify-between">
              <span
                className={`text-[9px] font-semibold ${category.color} truncate max-w-[105px]`}
              >
                {skill.category}
              </span>

              <motion.div
                animate={{
                  x: [0, 2, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      );
    }


    // ========================================================
    // STATIC CARD
    // ========================================================

    return (
      <motion.button
        key={skill.id}
        layout
        type="button"
        onClick={() => setSelectedSkill(skill)}
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.92,
        }}
        transition={{
          duration: 0.3,
          delay: Math.min(index * 0.025, 0.25),
        }}
        whileHover={{
          y: -4,
          scale: 1.015,
        }}
        whileTap={{
          scale: 0.98,
        }}
        className={[
          'relative text-left',
          'p-3',
          'rounded-2xl',
          'bg-slate-800/55',
          'hover:bg-slate-800/90',
          'border border-white/[0.07]',
          'hover:border-sky-400/30',
          'transition-colors',
          'group',
          'overflow-hidden',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-sky-400/50',
        ].join(' ')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.035] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative flex items-center gap-2.5">
          <div
            className={[
              'w-9 h-9',
              'rounded-xl',
              'shrink-0',
              'flex items-center justify-center',
              'bg-slate-900',
              'border border-white/10',
              category.color,
              'group-hover:scale-110',
              'transition-transform',
            ].join(' ')}
          >
            <Icon className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
              {skill.name}
            </p>

            <p className="text-[9px] text-slate-500 truncate mt-0.5">
              {skill.category}
            </p>
          </div>

          <CheckCircle className="w-3.5 h-3.5 text-emerald-400/60 group-hover:text-emerald-400 shrink-0" />
        </div>
      </motion.button>
    );
  };


  // ==========================================================
  // CATEGORY ICON
  // ==========================================================

  const renderCategoryIcon = (
    category: string,
  ) => {
    const config =
      getCategoryConfig(category);

    const Icon = config.icon;

    return (
      <Icon className="w-4 h-4" />
    );
  };


  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div
      className={[
        'relative',
        'flex-1',
        'h-full',
        'min-h-0',
        'overflow-hidden',
        'bg-[#05070b]',
        'text-slate-100',
        'font-sans',
      ].join(' ')}
    >

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_80%_90%,rgba(139,92,246,0.08),transparent_30%)]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize:
              '34px 34px',
          }}
        />

        <motion.div
          animate={{
            x: ['-10%', '10%', '-10%'],
            y: ['-5%', '8%', '-5%'],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-500/[0.07] blur-3xl"
        />

        <motion.div
          animate={{
            x: ['10%', '-10%', '10%'],
            y: ['5%', '-5%', '5%'],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-500/[0.07] blur-3xl"
        />
      </div>


      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div className="relative z-50 border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-xl">

        <div className="px-4 sm:px-5 py-3">

          <div className="flex flex-col xl:flex-row xl:items-center gap-3">

            {/* Brand */}

            <div className="flex items-center gap-3 shrink-0">

              <motion.div
                whileHover={{
                  rotate: 8,
                  scale: 1.05,
                }}
                className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400/20 to-indigo-500/20 border border-sky-400/20 flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-sky-400" />

                <motion.span
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.9, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 rounded-2xl border border-sky-400/20"
                />
              </motion.div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-white">
                    Skills Lab
                  </h1>

                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[9px] font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <p className="text-[9px] sm:text-[10px] text-slate-500">
                  Technical competency playground
                </p>
              </div>
            </div>


            {/* Search */}

            <div className="flex-1 min-w-0 xl:max-w-md xl:mx-auto">

              <div className="relative group">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />

                <input
                  type="text"
                  value={searchFilter}
                  onChange={event =>
                    setSearchFilter(
                      event.target.value,
                    )
                  }
                  placeholder="Search skills..."
                  className={[
                    'w-full',
                    'bg-white/[0.04]',
                    'border border-white/[0.08]',
                    'hover:border-white/[0.13]',
                    'focus:border-sky-400/40',
                    'rounded-xl',
                    'pl-10 pr-10',
                    'py-2.5',
                    'text-xs sm:text-sm',
                    'text-white',
                    'placeholder:text-slate-600',
                    'outline-none',
                    'focus:ring-2',
                    'focus:ring-sky-400/10',
                    'transition-all',
                  ].join(' ')}
                />

                {searchFilter && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchFilter('')
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>


            {/* Action controls */}

            <div className="flex items-center gap-2">

              {/* Decorations */}

              <button
                type="button"
                onClick={() =>
                  setShowDecorations(
                    value => !value,
                  )
                }
                title={
                  showDecorations
                    ? 'Hide decorations'
                    : 'Show decorations'
                }
                className={[
                  'hidden sm:flex',
                  'items-center gap-2',
                  'px-3 py-2',
                  'rounded-xl',
                  'border border-white/[0.08]',
                  'bg-white/[0.035]',
                  'hover:bg-white/[0.07]',
                  'text-xs font-semibold',
                  'text-slate-300',
                  'transition-all',
                ].join(' ')}
              >
                <Wand2 className="w-3.5 h-3.5 text-purple-400" />

                <span>
                  FX
                </span>
              </button>


              {/* Static */}

              <motion.button
                type="button"
                onClick={restoreStaticMode}
                whileTap={{
                  scale: 0.94,
                }}
                className={[
                  'flex items-center gap-2',
                  'px-3 py-2',
                  'rounded-xl',
                  'border',
                  isFalling
                    ? 'border-white/[0.08] bg-white/[0.035] text-slate-400 hover:text-white'
                    : 'border-sky-400/30 bg-sky-400/10 text-sky-300',
                  'text-xs font-semibold',
                  'transition-all',
                ].join(' ')}
              >
                <Layout className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  Static
                </span>
              </motion.button>


              {/* Drop */}

              <motion.button
                type="button"
                onClick={activateFallMode}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                className={[
                  'flex items-center gap-2',
                  'px-3 sm:px-4 py-2',
                  'rounded-xl',
                  'bg-gradient-to-r',
                  'from-sky-500',
                  'to-indigo-500',
                  'hover:from-sky-400',
                  'hover:to-indigo-400',
                  'text-white',
                  'text-xs font-bold',
                  'shadow-lg shadow-sky-500/10',
                  'transition-all',
                ].join(' ')}
              >
                <ArrowDown className="w-3.5 h-3.5" />

                <span>
                  Drop Skills
                </span>
              </motion.button>

            </div>
          </div>
        </div>


        {/* ===================================================
            CATEGORY NAV
        ==================================================== */}

        <div className="px-4 sm:px-5 pb-3">

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">

            <button
              type="button"
              onClick={() =>
                setSelectedCategory('All')
              }
              className={[
                'shrink-0',
                'flex items-center gap-1.5',
                'px-3 py-1.5',
                'rounded-full',
                'text-[10px] sm:text-xs',
                'font-semibold',
                'border',
                'transition-all',
                selectedCategory === 'All'
                  ? 'bg-sky-400/15 border-sky-400/30 text-sky-300'
                  : 'bg-white/[0.025] border-white/[0.07] text-slate-500 hover:text-slate-200',
              ].join(' ')}
            >
              <Filter className="w-3 h-3" />
              All
              <span className="opacity-60">
                {skills.length}
              </span>
            </button>


            {CATEGORIES.map(category => {
              const Icon = category.icon;

              const count =
                categoryCounts[
                  category.title
                ] || 0;

              return (
                <button
                  key={category.title}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      category.title,
                    )
                  }
                  className={[
                    'shrink-0',
                    'flex items-center gap-1.5',
                    'px-3 py-1.5',
                    'rounded-full',
                    'text-[10px] sm:text-xs',
                    'font-semibold',
                    'border',
                    'transition-all',
                    selectedCategory ===
                    category.title
                      ? `bg-white/[0.08] border-white/20 ${category.color}`
                      : 'bg-white/[0.025] border-white/[0.07] text-slate-500 hover:text-slate-200',
                  ].join(' ')}
                >
                  <Icon className="w-3 h-3" />

                  <span>
                    {category.title}
                  </span>

                  <span className="opacity-50">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 h-[calc(100%-124px)] min-h-0 overflow-y-auto">

        <AnimatePresence mode="wait">

          {!isFalling ? (

            // =================================================
            // STATIC MODE
            // =================================================

            <motion.div
              key="static"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="p-4 sm:p-5 lg:p-6"
            >

              {/* HERO */}

              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-sky-950/20 p-5 sm:p-6 mb-5">

                <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-sky-500/[0.06] blur-3xl pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                  <div>

                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-400">
                      <Cpu className="w-4 h-4" />
                      <span>
                        Technical Competencies
                      </span>
                    </div>

                    <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
                      Everything I can build with.
                    </h2>

                    <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-400">
                      Explore the technologies, frameworks,
                      tools and engineering capabilities behind
                      my projects. Click any skill to inspect it.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[10px] font-bold text-emerald-400">
                        <Check className="w-3 h-3" />
                        Production Ready
                      </div>

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-400/10 border border-sky-400/20 text-[10px] font-bold text-sky-300">
                        <Activity className="w-3 h-3" />
                        {skills.length} Skills
                      </div>

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-400/10 border border-purple-400/20 text-[10px] font-bold text-purple-300">
                        <Sparkles className="w-3 h-3" />
                        AI Integrated
                      </div>

                    </div>
                  </div>


                  {/* DROP CTA */}

                  <motion.button
                    type="button"
                    onClick={activateFallMode}
                    whileHover={{
                      scale: 1.03,
                      rotate: -1,
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    className="relative shrink-0 group overflow-hidden rounded-2xl border border-sky-400/25 bg-sky-400/[0.08] px-5 py-4 text-left"
                  >

                    <motion.div
                      animate={{
                        x: ['-120%', '160%'],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                    />

                    <div className="relative flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:rotate-6 transition-transform">
                        <ArrowDown className="w-5 h-5" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Drop everything
                        </p>

                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Drag • Explore • Play
                        </p>
                      </div>

                    </div>
                  </motion.button>

                </div>
              </div>


              {/* RESULTS INFO */}

              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {selectedCategory === 'All'
                      ? 'All Skills'
                      : selectedCategory}
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[9px] font-mono text-slate-500">
                    {filteredSkills.length}
                  </span>
                </div>

                {searchFilter && (
                  <span className="text-[10px] text-slate-500">
                    Results for "
                    <span className="text-sky-400">
                      {searchFilter}
                    </span>
                    "
                  </span>
                )}

              </div>


              {/* CATEGORIES */}

              <div className="space-y-5">

                {CATEGORIES.map(category => {

                  const categorySkills =
                    filteredSkills.filter(
                      skill =>
                        skill.category ===
                        category.title,
                    );

                  if (
                    categorySkills.length === 0
                  ) {
                    return null;
                  }

                  const Icon =
                    category.icon;

                  return (
                    <motion.section
                      key={category.title}
                      layout
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="rounded-3xl border border-white/[0.07] bg-slate-900/55 backdrop-blur-sm overflow-hidden"
                    >

                      {/* Category Header */}

                      <div className="px-4 sm:px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.015]">

                        <div className="flex items-center justify-between gap-3">

                          <div className="flex items-center gap-3">

                            <div
                              className={[
                                'w-9 h-9',
                                'rounded-xl',
                                'bg-slate-800',
                                'border border-white/10',
                                'flex items-center justify-center',
                                category.color,
                              ].join(' ')}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            <div>

                              <h3 className="text-sm font-bold text-white">
                                {category.title}
                              </h3>

                              <p className="hidden sm:block text-[9px] text-slate-500 mt-0.5">
                                {category.description}
                              </p>

                            </div>

                          </div>

                          <div className="flex items-center gap-2">

                            <span className="text-[9px] font-mono text-slate-600">
                              {categorySkills.length}{' '}
                              items
                            </span>

                            <ChevronDown className="w-3.5 h-3.5 text-slate-600" />

                          </div>

                        </div>
                      </div>


                      {/* Skills */}

                      <div className="p-3 sm:p-4 grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">

                        <AnimatePresence>
                          {categorySkills.map(
                            skill =>
                              renderSkillCard(
                                skill,
                                filteredSkills.indexOf(
                                  skill,
                                ),
                              ),
                          )}
                        </AnimatePresence>

                      </div>

                    </motion.section>
                  );
                })}

              </div>


              {/* EMPTY */}

              {filteredSkills.length === 0 && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="py-20 text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center">
                    <Search className="w-7 h-7 text-slate-600" />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-white">
                    No skills found
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Try another skill name or category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchFilter('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-xs font-semibold text-sky-300 hover:bg-sky-500/20"
                  >
                    Clear filters
                  </button>
                </motion.div>
              )}


              {/* FOOTER */}

              <div className="mt-5 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02]">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-sky-400" />

                    <span className="text-[10px] text-slate-500">
                      Architecture:
                      <strong className="text-slate-300 ml-1">
                        Component Driven •
                        Performance Focused •
                        AI Integrated
                      </strong>
                    </span>
                  </div>

                  <span className="text-[9px] font-mono text-slate-600">
                    ABHISHEK_OS / SKILLS
                  </span>

                </div>
              </div>

            </motion.div>

          ) : (

            // =================================================
            // FALL / PLAYGROUND MODE
            // =================================================

            <motion.div
              key="playground"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="relative min-h-[calc(100vh-124px)] overflow-hidden"
            >

              {/* Decorative playground objects */}

              {showDecorations && (
                <div className="absolute inset-0 pointer-events-none">

                  {FLOATING_OBJECTS.map(
                    (object, index) => {

                      if (
                        object.type ===
                        'circle'
                      ) {
                        return (
                          <motion.div
                            key={index}
                            animate={{
                              y: [0, -14, 0],
                              rotate: [0, 8, 0],
                            }}
                            transition={{
                              duration:
                                3.5 +
                                index *
                                  0.35,
                              repeat:
                                Infinity,
                              ease:
                                'easeInOut',
                            }}
                            className="absolute rounded-full border border-sky-300/20 bg-sky-300/[0.05]"
                            style={{
                              left: `${object.x}%`,
                              top: `${object.y}%`,
                              width: object.size,
                              height: object.size,
                            }}
                          />
                        );
                      }

                      if (
                        object.type ===
                        'triangle'
                      ) {
                        return (
                          <motion.div
                            key={index}
                            animate={{
                              y: [0, -10, 0],
                              rotate: [
                                -8,
                                8,
                                -8,
                              ],
                            }}
                            transition={{
                              duration:
                                4 +
                                index *
                                  0.3,
                              repeat:
                                Infinity,
                              ease:
                                'easeInOut',
                            }}
                            className="absolute w-0 h-0 border-l-[18px] border-r-[18px] border-b-[32px] border-l-transparent border-r-transparent border-b-emerald-300/20"
                            style={{
                              left: `${object.x}%`,
                              top: `${object.y}%`,
                            }}
                          />
                        );
                      }

                      return (
                        <motion.div
                          key={index}
                          animate={{
                            x: [0, 12, 0],
                            rotate: [
                              -5,
                              5,
                              -5,
                            ],
                          }}
                          transition={{
                            duration:
                              4 +
                              index *
                                0.2,
                            repeat:
                              Infinity,
                            ease:
                              'easeInOut',
                          }}
                          className="absolute"
                          style={{
                            left: `${object.x}%`,
                            top: `${object.y}%`,
                          }}
                        >
                          <div className="flex items-center justify-center w-14 h-9 rounded-full border border-lime-300/25 bg-lime-300/[0.08]">
                            <ArrowRight className="w-5 h-5 text-lime-300/60" />
                          </div>
                        </motion.div>
                      );
                    },
                  )}


                  {/* Extra playful labels */}

                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                      rotate: [-4, 3, -4],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                    className="absolute left-[7%] top-[48%] hidden md:block"
                  >
                    <span className="font-black italic text-3xl text-sky-300/25">
                      Skills
                    </span>
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, 9, 0],
                      rotate: [3, -3, 3],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                    }}
                    className="absolute right-[8%] top-[42%] hidden md:block"
                  >
                    <span className="font-black italic text-3xl text-purple-300/20">
                      Build
                    </span>
                  </motion.div>

                </div>
              )}


              {/* PLAYGROUND HEADER */}

              <div className="relative z-40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 pt-4">

                <div>

                  <div className="flex items-center gap-2">

                    <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      Skill Playground
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[8px] font-bold text-amber-300">
                      INTERACTIVE
                    </span>

                  </div>

                  <h2 className="mt-1 text-xl sm:text-2xl font-black text-white">
                    Let the skills fall.
                  </h2>

                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                    Drag cards around the canvas and explore
                    the stack.
                  </p>

                </div>


                <div className="flex items-center gap-2">

                  {/* Drag */}

                  <button
                    type="button"
                    onClick={() =>
                      setIsDraggingMode(
                        value => !value,
                      )
                    }
                    className={[
                      'flex items-center gap-2',
                      'px-3 py-2',
                      'rounded-xl',
                      'border',
                      isDraggingMode
                        ? 'bg-amber-400/15 border-amber-400/30 text-amber-300'
                        : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white',
                      'text-[10px] font-bold',
                      'transition-all',
                    ].join(' ')}
                  >
                    <Grip className="w-3.5 h-3.5" />

                    <span>
                      {isDraggingMode
                        ? 'Dragging On'
                        : 'Drag Skills'}
                    </span>
                  </button>


                  {/* Shuffle */}

                  <button
                    type="button"
                    onClick={
                      shuffleSkills
                    }
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[10px] font-bold text-slate-400 hover:text-white transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      Shuffle
                    </span>
                  </button>


                  {/* Reverse */}

                  <motion.button
                    type="button"
                    onClick={
                      restoreStaticMode
                    }
                    whileTap={{
                      scale: 0.94,
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-400 text-slate-950 text-[10px] font-black shadow-lg shadow-sky-500/20"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>
                      Reverse
                    </span>
                  </motion.button>

                </div>
              </div>


              {/* HINT */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.5,
                }}
                className="relative z-40 mx-4 sm:mx-6 mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/70 border border-white/[0.08] backdrop-blur-md"
              >
                <MousePointer2 className="w-3.5 h-3.5 text-sky-400" />

                <span className="text-[9px] text-slate-500">
                  {isDraggingMode
                    ? 'Drag any skill anywhere.'
                    : 'Enable “Drag Skills” to move cards.'}
                </span>
              </motion.div>


              {/* SKILL CARDS */}

              <div className="absolute inset-0 top-[135px] overflow-hidden">

                {filteredSkills.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Search className="w-10 h-10 mx-auto text-slate-700" />

                      <p className="mt-3 text-sm font-bold text-slate-300">
                        No skills to drop
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setSearchFilter('');
                          setSelectedCategory(
                            'All',
                          );
                        }}
                        className="mt-3 px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-xs text-sky-300"
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredSkills.map(
                    (skill, index) =>
                      renderSkillCard(
                        skill,
                        index,
                        true,
                      ),
                  )
                )}

              </div>


              {/* BOTTOM STATUS */}

              <div className="absolute z-50 left-4 right-4 sm:left-6 sm:right-6 bottom-4">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/[0.08]">

                  <div className="flex items-center gap-3">

                    <div className="flex -space-x-2">

                      {filteredSkills
                        .slice(0, 5)
                        .map(
                          (
                            skill,
                            index,
                          ) => {
                            const Icon =
                              getSkillIcon(
                                skill.name,
                              );

                            const category =
                              getCategoryConfig(
                                skill.category,
                              );

                            return (
                              <div
                                key={
                                  skill.id
                                }
                                className={`w-7 h-7 rounded-lg border border-slate-900 bg-slate-800 flex items-center justify-center ${category.color}`}
                                style={{
                                  zIndex:
                                    10 -
                                    index,
                                }}
                              >
                                <Icon className="w-3 h-3" />
                              </div>
                            );
                          },
                        )}

                    </div>

                    <span className="text-[9px] text-slate-500">
                      {filteredSkills.length}{' '}
                      floating skills
                    </span>

                  </div>


                  <div className="flex items-center gap-2">

                    <span className="hidden sm:inline text-[9px] text-slate-600">
                      Drag mode:
                    </span>

                    <span
                      className={[
                        'px-2 py-1 rounded-lg',
                        'text-[9px] font-bold',
                        isDraggingMode
                          ? 'bg-amber-400/10 text-amber-300'
                          : 'bg-white/[0.04] text-slate-600',
                      ].join(' ')}
                    >
                      {isDraggingMode
                        ? 'ON'
                        : 'OFF'}
                    </span>

                    <button
                      type="button"
                      onClick={
                        restoreStaticMode
                      }
                      className="text-[9px] font-bold text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      Return to layout →
                    </button>

                  </div>

                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>


      {/* =====================================================
          SKILL DETAIL PANEL
      ====================================================== */}

      <AnimatePresence>

        {selectedSkill && !isFalling && (
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: 40,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 25,
            }}
            className="fixed z-[200] right-3 sm:right-5 bottom-3 sm:bottom-5 w-[calc(100%-24px)] sm:w-[340px] max-h-[70vh] overflow-y-auto"
          >

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-black/50">

              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.08] via-transparent to-purple-500/[0.06] pointer-events-none" />

              <div className="relative p-5">

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <motion.div
                      animate={{
                        rotate: [0, 4, -4, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                      className={`w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center ${getCategoryConfig(selectedSkill.category).color}`}
                    >
                      {React.createElement(
                        getSkillIcon(
                          selectedSkill.name,
                        ),
                        {
                          className:
                            'w-6 h-6',
                        },
                      )}
                    </motion.div>

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
                        Selected Skill
                      </p>

                      <h3 className="text-base font-black text-white mt-0.5">
                        {selectedSkill.name}
                      </h3>

                      <p
                        className={`text-[10px] mt-0.5 ${getCategoryConfig(selectedSkill.category).color}`}
                      >
                        {selectedSkill.category}
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSkill(
                        null,
                      )
                    }
                    className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close skill details"
                  >
                    <X className="w-4 h-4" />
                  </button>

                </div>


                <div className="mt-5 space-y-2">

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.035] border border-white/[0.06]">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />

                    <div>
                      <p className="text-[10px] font-bold text-slate-200">
                        Production Capability
                      </p>

                      <p className="text-[9px] text-slate-600 mt-0.5">
                        Available in the technical toolkit.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.035] border border-white/[0.06]">
                    <Layers className="w-4 h-4 text-sky-400" />

                    <div>
                      <p className="text-[10px] font-bold text-slate-200">
                        Domain
                      </p>

                      <p className="text-[9px] text-slate-600 mt-0.5">
                        {selectedSkill.category}
                      </p>
                    </div>
                  </div>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setSelectedSkill(
                      null,
                    )
                  }
                  className="mt-4 w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black transition-colors"
                >
                  Continue Exploring
                </button>

              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>


      {/* =====================================================
          MOBILE DETAIL PANEL FOR FALL MODE
      ====================================================== */}

      <AnimatePresence>

        {selectedSkill && isFalling && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 30,
            }}
            className="fixed z-[200] left-3 right-3 bottom-3 sm:left-auto sm:right-5 sm:w-[300px]"
          >

            <div className="rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-xl p-3 shadow-2xl">

              <div className="flex items-center gap-3">

                <div
                  className={`w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center ${getCategoryConfig(selectedSkill.category).color}`}
                >
                  {React.createElement(
                    getSkillIcon(
                      selectedSkill.name,
                    ),
                    {
                      className:
                        'w-4 h-4',
                    },
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    {selectedSkill.name}
                  </p>

                  <p className="text-[9px] text-slate-500 truncate">
                    {selectedSkill.category}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedSkill(null)
                  }
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>


      {/* =====================================================
          FLOATING MODE INDICATOR
      ====================================================== */}

      <AnimatePresence>

        {isFalling && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: -10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: -10,
            }}
            className="absolute z-[150] top-[132px] right-4 pointer-events-none"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-sky-400/20 backdrop-blur-xl">

              <motion.span
                animate={{
                  y: [0, 3, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                }}
              >
                <ArrowDown className="w-3 h-3 text-sky-400" />
              </motion.span>

              <span className="text-[9px] font-bold text-sky-300">
                FALL MODE
              </span>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};