import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Images,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Maximize2,
  Sparkles,
  UserRound,
  FolderKanban,
  Award,
  Image as ImageIcon,
  Layers3,
  Move3D,
  MousePointer2,
  RotateCw,
} from 'lucide-react';

import { useOS } from '../../context/OSContext';

interface GalleryItem {
  id: string;
  title: string;
  category:
    | 'Projects'
    | 'Architecture'
    | 'Certificates'
    | 'Wallpapers'
    | 'Me';
  imageUrl: string;
  description: string;
  quote?: string;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80';

/* -------------------------------------------------------------------------- */
/* STATIC GALLERY                                                             */
/* -------------------------------------------------------------------------- */

const STATIC_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'KrishiMitra AI — Precision Farming Interface',
    category: 'Projects',
    imageUrl:
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&q=80',
    description:
      'AI-driven soil health diagnostics, weather prediction, and crop advisory UI.',
  },

  {
    id: 'gal-2',
    title: 'CraveVerse — Food Delivery Ecosystem Architecture',
    category: 'Architecture',
    imageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    description:
      'Microservices architecture with real-time driver telemetry and order dispatching.',
  },

  {
    id: 'gal-3',
    title: 'Amba Motors — ERP & Dealership Dashboard',
    category: 'Projects',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    description:
      'Automobile dealership inventory, booking pipelines, and financial analytics.',
  },

  {
    id: 'gal-4',
    title: 'AWS Certified Cloud Practitioner Certificate',
    category: 'Certificates',
    imageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80',
    description:
      'Validation of foundational cloud architecture, security, and billing models.',
  },

  {
    id: 'gal-5',
    title: 'Midnight Aurora Live Wallpaper Asset',
    category: 'Wallpapers',
    imageUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    description:
      'High-definition celestial aurora canvas rendered within Abhishek OS.',
  },

  {
    id: 'gal-6',
    title: 'Developer Engineering Workstation Setup',
    category: 'Architecture',
    imageUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
    description:
      'Multi-monitor development workspace for full-stack engineering sprints.',
  },
];

/* -------------------------------------------------------------------------- */
/* PERSONAL GALLERY                                                           */
/* -------------------------------------------------------------------------- */

const PERSONAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'me-1',
    title: 'Abhishek Kuntare',
    category: 'Me',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D4D03AQGviWu-FSf4LQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1697363364918?e=1791417600&v=beta&t=Y6DI4uOusT8jMIbvz292WjarZoNq8AssVro3_l01icQ',
    description: 'Personal profile portrait.',
    quote:
      '“Keep learning, keep building, and let the work speak for itself.”',
  },

  {
    id: 'me-2',
    title: 'Personal Moment',
    category: 'Me',
    imageUrl:
      'https://scontent.cdninstagram.com/v/t51.82787-19/801396674_18200145919373133_42711558856071062_n.jpg?_nc_cat=111&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVf%20cGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=Po26UXdGnrkQ7kNvwEBaQXp&_nc_oc=AdodJFj9aByFni_zE_KXXEhFRtt1X4EEOE_Mk6cAwCRGBwez1h1K7cy5UQr0IG5FdU7HvGpUrElPdtLt0JmvHmKN&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_gid=gqpnx4ztt54lFC-5-3G8hQ&_nc_ss=7b6a8&oh=00_AQK6cdLDfLLppP7c_4h1iJoKQ0s7_bFh9DspHWmcEbQEiQ&oe=6AB0B280',
    description: 'A personal photograph from my journey.',
    quote:
      '“Enjoy the journey. Every chapter becomes part of the story.”',
  },

  {
    id: 'me-3',
    title: 'Developer Journey',
    category: 'Me',
    imageUrl:
      'https://avatars.githubusercontent.com/u/89706853?v=4',
    description: 'Developer profile and open-source identity.',
    quote:
      '“Build things that solve real problems, then keep making them better.”',
  },

  {
    id: 'me-4',
    title: 'Personal Perspective',
    category: 'Me',
    imageUrl:
      'https://pbs.twimg.com/profile_images/1666540410632826880/X-OMgzso_400x400.png',
    description: 'Personal profile photograph.',
    quote:
      '“Think beyond the screen. Create with curiosity, purpose, and consistency.”',
  },
];

/* -------------------------------------------------------------------------- */
/* CATEGORY CONFIG                                                            */
/* -------------------------------------------------------------------------- */

const CATEGORIES = [
  {
    label: 'All',
    icon: Images,
  },
  {
    label: 'Me',
    icon: UserRound,
  },
  {
    label: 'Projects',
    icon: FolderKanban,
  },
  {
    label: 'Architecture',
    icon: Sparkles,
  },
  {
    label: 'Certificates',
    icon: Award,
  },
  {
    label: 'Wallpapers',
    icon: ImageIcon,
  },
];

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export const GalleryApp: React.FC = () => {
  const { projects } = useOS();

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const [activeCard, setActiveCard] = useState<string | null>(null);

  const [cardTransforms, setCardTransforms] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const [isLightboxClosing, setIsLightboxClosing] = useState(false);

  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /* ------------------------------------------------------------------------ */
  /* DYNAMIC PROJECT GALLERY                                                 */
  /* ------------------------------------------------------------------------ */

  const dynamicProjectItems: GalleryItem[] = (projects || []).map(
    (project) => ({
      id: `dyn-${project.id}`,
      title: project.title,
      category: 'Projects',
      imageUrl: project.thumbnail_url || FALLBACK_IMAGE,
      description:
        project.short_description ||
        'Project interface and development artifact.',
    })
  );

  /* ------------------------------------------------------------------------ */
  /* ALL GALLERY DATA                                                         */
  /* ------------------------------------------------------------------------ */

  const allItems = useMemo(
    () => [
      ...PERSONAL_GALLERY_ITEMS,
      ...STATIC_GALLERY_ITEMS,
      ...dynamicProjectItems,
    ],
    [projects]
  );

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') {
      return allItems;
    }

    return allItems.filter((item) => item.category === activeCategory);
  }, [allItems, activeCategory]);

  /* ------------------------------------------------------------------------ */
  /* CATEGORY COUNTS                                                          */
  /* ------------------------------------------------------------------------ */

  const getCategoryCount = useCallback(
    (category: string) => {
      if (category === 'All') {
        return allItems.length;
      }

      return allItems.filter((item) => item.category === category).length;
    },
    [allItems]
  );

  /* ------------------------------------------------------------------------ */
  /* LIGHTBOX                                                                 */
  /* ------------------------------------------------------------------------ */

  const openLightbox = (index: number) => {
    setSelectedItemIndex(index);
    setZoomLevel(1);
    setIsLightboxClosing(false);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxClosing(true);

    window.setTimeout(() => {
      setSelectedItemIndex(null);
      setZoomLevel(1);
      setIsLightboxClosing(false);
      document.body.style.overflow = '';
    }, 180);
  };

  const nextImage = useCallback(() => {
    if (selectedItemIndex === null || filteredItems.length === 0) return;

    setSelectedItemIndex(
      (selectedItemIndex + 1) % filteredItems.length
    );

    setZoomLevel(1);
  }, [filteredItems.length, selectedItemIndex]);

  const prevImage = useCallback(() => {
    if (selectedItemIndex === null || filteredItems.length === 0) return;

    setSelectedItemIndex(
      (selectedItemIndex - 1 + filteredItems.length) %
        filteredItems.length
    );

    setZoomLevel(1);
  }, [filteredItems.length, selectedItemIndex]);

  const currentItem =
    selectedItemIndex !== null
      ? filteredItems[selectedItemIndex]
      : null;

  /* ------------------------------------------------------------------------ */
  /* CLEANUP BODY SCROLL                                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* KEYBOARD CONTROLS                                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!currentItem) return;

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }

      if (event.key === 'ArrowRight') {
        nextImage();
      }

      if (event.key === 'ArrowLeft') {
        prevImage();
      }

      if (event.key === '+' || event.key === '=') {
        setZoomLevel((prev) => Math.min(2.5, prev + 0.2));
      }

      if (event.key === '-') {
        setZoomLevel((prev) => Math.max(0.6, prev - 0.2));
      }

      if (event.key === '0') {
        setZoomLevel(1);
      }
    };

    window.addEventListener('keydown', handleKeyboard);

    return () => {
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [currentItem, nextImage, prevImage]);

  /* ------------------------------------------------------------------------ */
  /* IMAGE FALLBACK                                                           */
  /* ------------------------------------------------------------------------ */

  const handleImageError = (id: string) => {
    setImageErrors((previous) => ({
      ...previous,
      [id]: true,
    }));
  };

  const getImageSource = (item: GalleryItem) => {
    if (imageErrors[item.id]) {
      return FALLBACK_IMAGE;
    }

    return item.imageUrl;
  };

  /* ------------------------------------------------------------------------ */
  /* 3D CARD EFFECT                                                           */
  /* ------------------------------------------------------------------------ */

  const handleCardMove = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    const card = cardRefs.current[id];

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 12;
    const rotateX = ((y / rect.height) - 0.5) * -12;

    setCardTransforms((prev) => ({
      ...prev,
      [id]: {
        x: rotateX,
        y: rotateY,
      },
    }));

    setActiveCard(id);
  };

  const resetCardTransform = (id: string) => {
    setCardTransforms((prev) => ({
      ...prev,
      [id]: {
        x: 0,
        y: 0,
      },
    }));

    setActiveCard(null);
  };

  /* ------------------------------------------------------------------------ */
  /* CATEGORY CHANGE                                                          */
  /* ------------------------------------------------------------------------ */

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSelectedItemIndex(null);
    setZoomLevel(1);
  };

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <style>{`
        @keyframes galleryFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -12px, 0);
          }
        }

        @keyframes galleryPulse {
          0%, 100% {
            opacity: .25;
            transform: scale(1);
          }
          50% {
            opacity: .55;
            transform: scale(1.12);
          }
        }

        @keyframes galleryShine {
          0% {
            transform: translateX(-120%) rotate(15deg);
          }
          100% {
            transform: translateX(180%) rotate(15deg);
          }
        }

        @keyframes galleryCardIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes galleryLightboxIn {
          from {
            opacity: 0;
            transform: scale(.94);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes galleryImageIn {
          from {
            opacity: 0;
            transform: scale(.92) translateY(15px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes gallerySpin {
          to {
            transform: rotate(360deg);
          }
        }

        .gallery-card {
          animation: galleryCardIn .55s cubic-bezier(.2,.8,.2,1) both;
        }

        .gallery-lightbox {
          animation: galleryLightboxIn .22s cubic-bezier(.2,.8,.2,1) both;
        }

        .gallery-lightbox-closing {
          animation: galleryLightboxIn .18s ease reverse both;
        }

        .gallery-image {
          animation: galleryImageIn .35s cubic-bezier(.2,.8,.2,1);
        }

        .gallery-scroll::-webkit-scrollbar {
          width: 7px;
          height: 7px;
        }

        .gallery-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .gallery-scroll::-webkit-scrollbar-thumb {
          background: rgba(148,163,184,.16);
          border-radius: 999px;
        }

        .gallery-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(168,85,247,.45);
        }

        .gallery-3d {
          perspective: 1400px;
        }

        .gallery-card-inner {
          transform-style: preserve-3d;
          will-change: transform;
        }

        .gallery-depth {
          transform: translateZ(28px);
        }

        .gallery-depth-small {
          transform: translateZ(16px);
        }
      `}</style>

      <div className="relative flex flex-col h-full w-full overflow-hidden bg-[#050816] text-slate-100 select-none font-sans">
        {/* ---------------------------------------------------------------- */}
        {/* AMBIENT BACKGROUND                                               */}
        {/* ---------------------------------------------------------------- */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -left-32 -top-32 w-[420px] h-[420px] rounded-full bg-purple-600/10 blur-[110px]"
            style={{ animation: 'galleryPulse 6s ease-in-out infinite' }}
          />

          <div
            className="absolute right-[-140px] top-[20%] w-[420px] h-[420px] rounded-full bg-indigo-500/10 blur-[120px]"
            style={{
              animation: 'galleryPulse 8s ease-in-out infinite',
            }}
          />

          <div
            className="absolute left-[35%] bottom-[-200px] w-[500px] h-[500px] rounded-full bg-fuchsia-500/[0.05] blur-[130px]"
            style={{
              animation: 'galleryPulse 9s ease-in-out infinite',
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
              backgroundSize: '45px 45px',
            }}
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                           */}
        {/* ---------------------------------------------------------------- */}

        <header className="relative z-10 shrink-0 px-4 md:px-6 py-4 bg-slate-950/70 backdrop-blur-2xl border-b border-white/[0.08]">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            {/* Brand */}

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_12px_40px_rgba(139,92,246,.3)]">
                  <Images className="w-5 h-5 text-white" />

                  <div className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-[3px] border-slate-950 animate-pulse" />
                </div>

                <div className="absolute inset-0 rounded-2xl bg-purple-500/30 blur-xl -z-10" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm md:text-base font-bold text-white tracking-tight">
                    Media & Project Gallery
                  </h2>

                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[8px] uppercase tracking-widest text-slate-400">
                    <Move3D className="w-3 h-3 text-purple-400" />
                    3D Gallery
                  </span>
                </div>

                <p className="text-[10px] md:text-[11px] text-slate-500 mt-0.5">
                  Projects, architecture, credentials & personal moments
                </p>
              </div>
            </div>

            {/* Stats */}

            <div className="flex items-center gap-2">
              <div className="group px-3.5 py-2.5 rounded-2xl bg-white/[0.035] hover:bg-white/[0.055] border border-white/[0.08] backdrop-blur-xl transition-all">
                <div className="flex items-center gap-2">
                  <Layers3 className="w-3.5 h-3.5 text-purple-400" />

                  <div>
                    <div className="text-[8px] uppercase tracking-[.18em] text-slate-500">
                      Assets
                    </div>

                    <div className="text-sm font-bold text-white">
                      {allItems.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="group px-3.5 py-2.5 rounded-2xl bg-white/[0.035] hover:bg-white/[0.055] border border-white/[0.08] backdrop-blur-xl transition-all">
                <div className="flex items-center gap-2">
                  <UserRound className="w-3.5 h-3.5 text-fuchsia-400" />

                  <div>
                    <div className="text-[8px] uppercase tracking-[.18em] text-slate-500">
                      Personal
                    </div>

                    <div className="text-sm font-bold text-fuchsia-300">
                      {PERSONAL_GALLERY_ITEMS.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* CATEGORY FILTER                                                 */}
          {/* -------------------------------------------------------------- */}

          <div className="mt-5 overflow-x-auto gallery-scroll">
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/20 border border-white/[0.07] w-max min-w-full sm:min-w-0">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;

                const active = activeCategory === category.label;

                const count = getCategoryCount(category.label);

                return (
                  <button
                    key={category.label}
                    type="button"
                    onClick={() =>
                      handleCategoryChange(category.label)
                    }
                    className={`
                      relative group flex items-center gap-2
                      px-3.5 py-2.5 rounded-xl
                      text-xs font-semibold
                      whitespace-nowrap
                      transition-all duration-300
                      overflow-hidden
                      ${
                        active
                          ? 'text-white shadow-[0_8px_30px_rgba(124,58,237,.22)]'
                          : 'text-slate-500 hover:text-white hover:bg-white/[0.045]'
                      }
                    `}
                  >
                    {active && (
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600" />
                    )}

                    <span className="relative z-10 flex items-center gap-2">
                      <Icon
                        className={`
                          w-3.5 h-3.5
                          transition-transform duration-300
                          ${
                            active
                              ? 'scale-110'
                              : 'group-hover:scale-110'
                          }
                        `}
                      />

                      <span>{category.label}</span>

                      <span
                        className={`
                          min-w-[20px] px-1.5 py-0.5 rounded-md
                          text-[9px] text-center
                          ${
                            active
                              ? 'bg-white/15 text-white'
                              : 'bg-white/[0.045] text-slate-600'
                          }
                        `}
                      >
                        {count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* PERSONAL BANNER                                                  */}
        {/* ---------------------------------------------------------------- */}

        {activeCategory === 'Me' && (
          <div className="relative z-10 shrink-0 mx-4 md:mx-6 mt-4">
            <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-slate-900/70 to-indigo-950/30 backdrop-blur-xl p-4 md:p-5 shadow-[0_20px_60px_rgba(0,0,0,.2)]">
              <div
                className="absolute -right-20 -top-28 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"
                style={{
                  animation: 'galleryFloat 7s ease-in-out infinite',
                }}
              />

              <div className="absolute left-[40%] bottom-[-100px] w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
                      <UserRound className="w-5 h-5 text-purple-400" />
                    </div>

                    <div className="absolute inset-0 rounded-2xl bg-purple-500/20 blur-xl" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xs md:text-sm font-bold text-white">
                        Personal Gallery
                      </h3>

                      <span className="px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-400/20 text-[8px] uppercase tracking-[.15em] text-purple-300">
                        Me
                      </span>
                    </div>

                    <p className="text-[10px] md:text-[11px] text-slate-500 mt-1">
                      A collection of personal photographs and moments.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[9px] text-slate-600">
                  <MousePointer2 className="w-3 h-3 text-purple-400" />
                  Hover cards for 3D
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* GALLERY                                                          */}
        {/* ---------------------------------------------------------------- */}

        <main className="relative z-[1] flex-1 overflow-y-auto gallery-scroll p-4 md:p-6">
          {filteredItems.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-xl" />

                  <div className="relative w-full h-full rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center">
                    <Images className="w-7 h-7 text-slate-600" />
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white mt-5">
                  Nothing here yet
                </h3>

                <p className="text-xs text-slate-600 mt-1">
                  No gallery items are available in this category.
                </p>
              </div>
            </div>
          ) : (
            <div
              className={`
                grid gap-5
                ${
                  activeCategory === 'Me'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }
              `}
            >
              {filteredItems.map((item, index) => {
                const transform = cardTransforms[item.id] || {
                  x: 0,
                  y: 0,
                };

                return (
                  <div
                    key={item.id}
                    className="gallery-3d"
                    style={{
                      animationDelay: `${index * 45}ms`,
                    }}
                  >
                    <button
                      ref={(element) => {
                        cardRefs.current[item.id] = element;
                      }}
                      type="button"
                      onClick={() => openLightbox(index)}
                      onMouseMove={(event) =>
                        handleCardMove(event, item.id)
                      }
                      onMouseLeave={() =>
                        resetCardTransform(item.id)
                      }
                      className="gallery-card group relative w-full text-left focus:outline-none"
                      style={{
                        perspective: '1400px',
                      }}
                    >
                      <div
                        className="gallery-card-inner relative overflow-hidden rounded-[22px] bg-slate-900/80 border border-white/[0.09] shadow-[0_18px_60px_rgba(0,0,0,.28)] transition-transform duration-150 ease-out"
                        style={{
                          transform: `
                            rotateX(${transform.x}deg)
                            rotateY(${transform.y}deg)
                            translateZ(0)
                          `,
                        }}
                      >
                        {/* CARD GLOW */}

                        <div
                          className={`
                            pointer-events-none absolute -inset-1
                            rounded-[24px]
                            bg-gradient-to-r
                            from-purple-500/0
                            via-purple-500/0
                            to-indigo-500/0
                            blur-xl
                            transition-opacity duration-300
                            ${
                              activeCard === item.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            }
                          `}
                        />

                        {/* IMAGE */}

                        <div
                          className={`
                            relative w-full overflow-hidden bg-slate-950
                            ${
                              item.category === 'Me'
                                ? 'aspect-square'
                                : 'aspect-video'
                            }
                          `}
                        >
                          <img
                            src={getImageSource(item)}
                            alt={item.title}
                            onError={() =>
                              handleImageError(item.id)
                            }
                            className="
                              w-full h-full object-cover
                              transition-transform duration-700
                              group-hover:scale-[1.08]
                            "
                            loading="lazy"
                            draggable={false}
                          />

                          {/* DARK GRADIENT */}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                          {/* SHINE */}

                          <div
                            className="
                              absolute top-0 bottom-0 left-0
                              w-[35%]
                              bg-gradient-to-r
                              from-transparent
                              via-white/[0.13]
                              to-transparent
                              -translate-x-[140%]
                              group-hover:translate-x-[360%]
                              transition-transform duration-1000
                              skew-x-[-15deg]
                            "
                          />

                          {/* CATEGORY */}

                          <div className="absolute left-3 top-3 gallery-depth-small">
                            <span className="
                              inline-flex items-center gap-1.5
                              px-2.5 py-1.5
                              rounded-xl
                              bg-black/45
                              backdrop-blur-xl
                              border border-white/10
                              text-[8px] md:text-[9px]
                              font-bold uppercase
                              tracking-[.14em]
                              text-white
                            ">
                              {item.category === 'Me' && (
                                <UserRound className="w-3 h-3 text-purple-300" />
                              )}

                              {item.category}
                            </span>
                          </div>

                          {/* FULLSCREEN */}

                          <div
                            className="
                              absolute right-3 top-3
                              w-9 h-9 rounded-xl
                              bg-black/45
                              backdrop-blur-xl
                              border border-white/10
                              flex items-center justify-center
                              opacity-0
                              translate-y-2
                              scale-90
                              group-hover:opacity-100
                              group-hover:translate-y-0
                              group-hover:scale-100
                              transition-all duration-300
                              gallery-depth
                            "
                          >
                            <Maximize2 className="w-3.5 h-3.5 text-white" />
                          </div>

                          {/* CENTER PLAY / VIEW */}

                          <div
                            className="
                              absolute inset-0
                              flex items-center justify-center
                              opacity-0
                              group-hover:opacity-100
                              transition-all duration-300
                            "
                          >
                            <div
                              className="
                                w-12 h-12 rounded-2xl
                                bg-white/10
                                backdrop-blur-xl
                                border border-white/20
                                flex items-center justify-center
                                scale-75
                                group-hover:scale-100
                                transition-transform duration-300
                                shadow-2xl
                              "
                            >
                              <Maximize2 className="w-5 h-5 text-white" />
                            </div>
                          </div>

                          {/* PERSONAL QUOTE */}

                          {item.category === 'Me' &&
                            item.quote && (
                              <div
                                className="
                                  absolute bottom-0 left-0 right-0
                                  p-4
                                  translate-y-4 opacity-0
                                  group-hover:translate-y-0
                                  group-hover:opacity-100
                                  transition-all duration-400
                                  gallery-depth-small
                                "
                              >
                                <p className="text-[10px] md:text-[11px] leading-relaxed text-white/90 italic">
                                  {item.quote}
                                </p>
                              </div>
                            )}
                        </div>

                        {/* CARD CONTENT */}

                        <div className="relative p-4 bg-gradient-to-b from-slate-900/95 to-slate-950/95">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="text-xs md:text-sm font-bold text-white truncate">
                                {item.title}
                              </h3>

                              <p className="text-[10px] md:text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                                {item.description}
                              </p>
                            </div>

                            {item.category === 'Me' && (
                              <Sparkles className="w-4 h-4 shrink-0 text-purple-400" />
                            )}
                          </div>

                          {/* CARD FOOTER */}

                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
                            <span className="text-[8px] uppercase tracking-[.18em] text-slate-600">
                              Gallery Asset
                            </span>

                            <span className="flex items-center gap-1 text-[9px] text-slate-500 group-hover:text-purple-300 transition-colors">
                              View
                              <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* ---------------------------------------------------------------- */}
        {/* LIGHTBOX                                                         */}
        {/* ---------------------------------------------------------------- */}

        {currentItem && (
          <div
            className={`
              fixed inset-0 z-[99999]
              bg-[#02030a]/95
              backdrop-blur-2xl
              flex flex-col
              ${
                isLightboxClosing
                  ? 'gallery-lightbox-closing'
                  : 'gallery-lightbox'
              }
            `}
            role="dialog"
            aria-modal="true"
            aria-label={currentItem.title}
          >
            {/* AMBIENT LIGHTBOX GLOW */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-[15%] top-[10%] w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[120px]" />

              <div className="absolute right-[10%] bottom-[10%] w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[120px]" />
            </div>

            {/* LIGHTBOX HEADER */}

            <div className="relative z-10 shrink-0 px-4 md:px-6 py-4 border-b border-white/[0.08] bg-black/20 backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-400/20 text-[8px] font-bold uppercase tracking-[.15em] text-purple-300">
                      {currentItem.category}
                    </span>

                    <span className="text-[9px] text-slate-600">
                      {(selectedItemIndex ?? 0) + 1} /{' '}
                      {filteredItems.length}
                    </span>
                  </div>

                  <h2 className="text-sm md:text-base font-bold text-white mt-1.5 truncate">
                    {currentItem.title}
                  </h2>
                </div>

                {/* CONTROLS */}

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setZoomLevel((prev) =>
                        Math.max(0.6, prev - 0.2)
                      )
                    }
                    className="
                      p-2.5 rounded-xl
                      bg-white/[0.05]
                      hover:bg-white/[0.1]
                      border border-white/[0.08]
                      text-white
                      transition-all duration-200
                      hover:scale-105
                    "
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <div className="hidden sm:flex items-center justify-center min-w-[52px] px-2 py-2.5 rounded-xl bg-white/[0.035] border border-white/[0.07]">
                    <span className="text-[9px] font-bold text-slate-400">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setZoomLevel((prev) =>
                        Math.min(2.5, prev + 0.2)
                      )
                    }
                    className="
                      p-2.5 rounded-xl
                      bg-white/[0.05]
                      hover:bg-white/[0.1]
                      border border-white/[0.08]
                      text-white
                      transition-all duration-200
                      hover:scale-105
                    "
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="
                      hidden sm:flex p-2.5 rounded-xl
                      bg-white/[0.05]
                      hover:bg-white/[0.1]
                      border border-white/[0.08]
                      text-slate-400
                      transition-all duration-200
                    "
                    title="Reset Zoom"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={closeLightbox}
                    className="
                      p-2.5 rounded-xl
                      bg-red-500/75
                      hover:bg-red-500
                      border border-red-400/20
                      text-white
                      transition-all duration-200
                      hover:scale-105
                    "
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* IMAGE AREA */}

            <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden px-4 md:px-16 py-5">
              {/* PREVIOUS */}

              <button
                type="button"
                onClick={prevImage}
                className="
                  absolute left-3 md:left-6 z-30
                  w-11 h-11 md:w-12 md:h-12
                  rounded-full
                  bg-black/60
                  hover:bg-purple-600
                  border border-white/10
                  backdrop-blur-xl
                  flex items-center justify-center
                  text-white
                  transition-all duration-300
                  hover:scale-110
                  shadow-2xl
                "
                title="Previous image"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* IMAGE */}

              <div
                className="
                  relative
                  max-w-[88vw]
                  max-h-[68vh]
                  flex items-center justify-center
                "
              >
                <div className="absolute inset-0 bg-purple-500/10 blur-[60px] rounded-full scale-75" />

                <img
                  key={currentItem.id}
                  src={getImageSource(currentItem)}
                  alt={currentItem.title}
                  onError={() =>
                    handleImageError(currentItem.id)
                  }
                  style={{
                    transform: `scale(${zoomLevel})`,
                  }}
                  className="
                    gallery-image
                    relative
                    max-h-[68vh]
                    max-w-[88vw]
                    object-contain
                    rounded-2xl md:rounded-3xl
                    shadow-[0_30px_100px_rgba(0,0,0,.65)]
                    border border-white/[0.08]
                    transition-transform duration-300
                    select-none
                  "
                  draggable={false}
                />
              </div>

              {/* NEXT */}

              <button
                type="button"
                onClick={nextImage}
                className="
                  absolute right-3 md:right-6 z-30
                  w-11 h-11 md:w-12 md:h-12
                  rounded-full
                  bg-black/60
                  hover:bg-purple-600
                  border border-white/10
                  backdrop-blur-xl
                  flex items-center justify-center
                  text-white
                  transition-all duration-300
                  hover:scale-110
                  shadow-2xl
                "
                title="Next image"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* FOOTER */}

            <div className="relative z-10 shrink-0 px-4 md:px-6 py-4 border-t border-white/[0.08] bg-black/25 backdrop-blur-2xl">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                  {/* DESCRIPTION */}

                  <div className="max-w-3xl">
                    <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed">
                      {currentItem.description}
                    </p>

                    {currentItem.quote && (
                      <div className="mt-3 flex items-start gap-2.5">
                        <div className="w-7 h-7 shrink-0 rounded-lg bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        </div>

                        <p className="text-xs md:text-sm text-white/90 italic leading-relaxed">
                          {currentItem.quote}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={getImageSource(currentItem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex items-center gap-2
                        px-3.5 py-2.5 rounded-xl
                        bg-white/[0.05]
                        hover:bg-white/[0.1]
                        border border-white/[0.08]
                        text-xs font-medium
                        text-slate-300
                        hover:text-white
                        transition-all duration-200
                      "
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Original
                    </a>
                  </div>
                </div>

                {/* KEYBOARD HINT */}

                <div className="hidden md:flex items-center justify-center gap-4 mt-4 text-[9px] text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.05]">
                      ←
                    </kbd>

                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.05]">
                      →
                    </kbd>

                    Navigate
                  </span>

                  <span>•</span>

                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.05]">
                      +
                    </kbd>{' '}
                    Zoom
                  </span>

                  <span>•</span>

                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.05]">
                      0
                    </kbd>{' '}
                    Reset
                  </span>

                  <span>•</span>

                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.05]">
                      Esc
                    </kbd>{' '}
                    Close
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};