import React, { useEffect, useMemo, useState } from 'react';
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
/* YOUR PERSONAL IMAGES                                                       */
/* -------------------------------------------------------------------------- */

const PERSONAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'me-1',
    title: 'Abhishek Kuntare',
    category: 'Me',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D4D03AQGviWu-FSf4LQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1697363364918?e=1791417600&v=beta&t=Y6DI4uOusT8jMIbvz292WjarZoNq8AssVro3_l01icQ',
    description:
      'Personal profile portrait.',
    quote:
      '“Keep learning, keep building, and let the work speak for itself.”',
  },

  {
    id: 'me-2',
    title: 'Personal Moment',
    category: 'Me',
    imageUrl:
      'https://scontent.cdninstagram.com/v/t51.82787-19/801396674_18200145919373133_42711558856071062_n.jpg?_nc_cat=111&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVf cGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=Po26UXdGnrkQ7kNvwEBaQXp&_nc_oc=AdodJFj9aByFni_zE_KXXEhFRtt1X4EEOE_Mk6cAwCRGBwez1h1K7cy5UQr0IG5FdU7HvGpUrElPdtLt0JmvHmKN&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_gid=gqpnx4ztt54lFC-5-3G8hQ&_nc_ss=7b6a8&oh=00_AQK6cdLDfLLppP7c_4h1iJoKQ0s7_bFh9DspHWmcEbQEiQ&oe=6AB0B280',
    description:
      'A personal photograph from my journey.',
    quote:
      '“Enjoy the journey. Every chapter becomes part of the story.”',
  },

  {
    id: 'me-3',
    title: 'Developer Journey',
    category: 'Me',
    imageUrl:
      'https://avatars.githubusercontent.com/u/89706853?v=4',
    description:
      'Developer profile and open-source identity.',
    quote:
      '“Build things that solve real problems, then keep making them better.”',
  },

  {
    id: 'me-4',
    title: 'Personal Perspective',
    category: 'Me',
    imageUrl:
      'https://pbs.twimg.com/profile_images/1666540410632826880/X-OMgzso_400x400.png',
    description:
      'Personal profile photograph.',
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

  /* ------------------------------------------------------------------------ */
  /* LIVE PROJECT GALLERY                                                     */
  /* ------------------------------------------------------------------------ */

  const dynamicProjectItems: GalleryItem[] = (projects || []).map((project) => ({
    id: `dyn-${project.id}`,
    title: project.title,
    category: 'Projects',
    imageUrl: project.thumbnail_url || FALLBACK_IMAGE,
    description:
      project.short_description ||
      'Project interface and development artifact.',
  }));

  /* ------------------------------------------------------------------------ */
  /* ALL GALLERY DATA                                                         */
  /* ------------------------------------------------------------------------ */

  const allItems = useMemo(
    () => [...PERSONAL_GALLERY_ITEMS, ...STATIC_GALLERY_ITEMS, ...dynamicProjectItems],
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

  const getCategoryCount = (category: string) => {
    if (category === 'All') {
      return allItems.length;
    }

    return allItems.filter((item) => item.category === category).length;
  };

  /* ------------------------------------------------------------------------ */
  /* LIGHTBOX                                                                  */
  /* ------------------------------------------------------------------------ */

  const openLightbox = (index: number) => {
    setSelectedItemIndex(index);
    setZoomLevel(1);
  };

  const closeLightbox = () => {
    setSelectedItemIndex(null);
    setZoomLevel(1);
  };

  const nextImage = () => {
    if (selectedItemIndex === null || filteredItems.length === 0) return;

    setSelectedItemIndex(
      (selectedItemIndex + 1) % filteredItems.length
    );

    setZoomLevel(1);
  };

  const prevImage = () => {
    if (selectedItemIndex === null || filteredItems.length === 0) return;

    setSelectedItemIndex(
      (selectedItemIndex - 1 + filteredItems.length) %
        filteredItems.length
    );

    setZoomLevel(1);
  };

  const currentItem =
    selectedItemIndex !== null
      ? filteredItems[selectedItemIndex]
      : null;

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
    };

    window.addEventListener('keydown', handleKeyboard);

    return () => {
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [currentItem, selectedItemIndex, filteredItems.length]);

  /* ------------------------------------------------------------------------ */
  /* IMAGE FALLBACK                                                            */
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
  /* RENDER                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">

      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <div className="shrink-0 px-4 py-3 bg-slate-900/95 backdrop-blur-xl border-b border-white/10">

        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3">

            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/20">

              <Images className="w-5 h-5 text-white" />

              <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />

            </div>

            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Media & Project Gallery
              </h2>

              <p className="text-[10px] text-slate-400">
                Projects, architecture, credentials & personal moments
              </p>
            </div>

          </div>

          {/* Stats */}
          <div className="flex items-center gap-2">

            <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-white/10">
              <div className="text-[9px] uppercase tracking-wider text-slate-500">
                Assets
              </div>

              <div className="text-xs font-bold text-white">
                {allItems.length}
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-white/10">
              <div className="text-[9px] uppercase tracking-wider text-slate-500">
                Personal
              </div>

              <div className="text-xs font-bold text-purple-400">
                {PERSONAL_GALLERY_ITEMS.length}
              </div>
            </div>

          </div>

        </div>

        {/* ================================================================ */}
        {/* CATEGORY FILTER                                                   */}
        {/* ================================================================ */}

        <div className="mt-4 overflow-x-auto scrollbar-none">

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-white/10 w-max">

            {CATEGORIES.map((category) => {
              const Icon = category.icon;

              const active = activeCategory === category.label;

              const count = getCategoryCount(category.label);

              return (
                <button
                  key={category.label}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.label);
                    setSelectedItemIndex(null);
                    setZoomLevel(1);
                  }}
                  className={`
                    group flex items-center gap-2 px-3.5 py-2 rounded-xl
                    text-xs font-medium transition-all duration-200
                    ${
                      active
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >

                  <Icon
                    className={`
                      w-3.5 h-3.5 transition-transform duration-200
                      ${active ? 'scale-110' : 'group-hover:scale-110'}
                    `}
                  />

                  <span>{category.label}</span>

                  <span
                    className={`
                      min-w-[18px] px-1.5 py-0.5 rounded-md text-[9px]
                      ${
                        active
                          ? 'bg-white/15 text-white'
                          : 'bg-white/5 text-slate-500'
                      }
                    `}
                  >
                    {count}
                  </span>

                </button>
              );
            })}

          </div>

        </div>

      </div>

      {/* ================================================================== */}
      {/* PERSONAL FEATURE BANNER                                             */}
      {/* ================================================================== */}

      {activeCategory === 'Me' && (
        <div className="shrink-0 mx-4 mt-4 md:mx-6">

          <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/30 p-4">

            <div className="absolute -right-16 -top-20 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl" />

            <div className="relative flex items-center gap-3">

              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
                <UserRound className="w-4 h-4 text-purple-400" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white">
                    Personal Gallery
                  </h3>

                  <span className="px-1.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-400/20 text-[8px] uppercase tracking-wider text-purple-300">
                    Me
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 mt-0.5">
                  A collection of personal photographs and moments.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================================================================== */}
      {/* GALLERY                                                             */}
      {/* ================================================================== */}

      <div className="flex-1 overflow-y-auto p-4 md:p-6">

        {filteredItems.length === 0 ? (

          <div className="h-full flex items-center justify-center">

            <div className="text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center">
                <Images className="w-6 h-6 text-slate-500" />
              </div>

              <h3 className="text-sm font-semibold text-white mt-4">
                Nothing here yet
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                No gallery items are available in this category.
              </p>

            </div>

          </div>

        ) : (

          <div
            className={`
              grid gap-4
              ${
                activeCategory === 'Me'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }
            `}
          >

            {filteredItems.map((item, index) => (

              <button
                key={item.id}
                type="button"
                onClick={() => openLightbox(index)}
                className="
                  group relative text-left rounded-2xl overflow-hidden
                  bg-slate-900/80 border border-white/10
                  hover:border-purple-500/40
                  cursor-pointer shadow-lg
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-2xl hover:shadow-purple-950/30
                  focus:outline-none focus:ring-2
                  focus:ring-purple-500/50
                "
              >

                {/* Image */}
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
                    onError={() => handleImageError(item.id)}
                    className="
                      w-full h-full object-cover
                      transition-transform duration-700
                      group-hover:scale-110
                    "
                    loading="lazy"
                  />

                  {/* Image overlay */}
                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-t
                      from-black/80 via-black/10 to-transparent
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                    "
                  />

                  {/* Category */}
                  <div className="absolute left-3 top-3">

                    <span
                      className="
                        inline-flex items-center gap-1.5
                        px-2.5 py-1.5 rounded-lg
                        bg-black/50 backdrop-blur-md
                        border border-white/10
                        text-[9px] font-bold uppercase
                        tracking-wider text-white
                      "
                    >
                      {item.category === 'Me' && (
                        <UserRound className="w-3 h-3 text-purple-300" />
                      )}

                      {item.category}
                    </span>

                  </div>

                  {/* Fullscreen icon */}
                  <div
                    className="
                      absolute right-3 top-3
                      w-8 h-8 rounded-xl
                      bg-black/50 backdrop-blur-md
                      border border-white/10
                      flex items-center justify-center
                      opacity-0 translate-y-1
                      group-hover:opacity-100
                      group-hover:translate-y-0
                      transition-all duration-300
                    "
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </div>

                  {/* Quote preview for Me */}
                  {item.category === 'Me' && item.quote && (
                    <div
                      className="
                        absolute bottom-0 left-0 right-0
                        p-4
                        translate-y-3 opacity-0
                        group-hover:translate-y-0
                        group-hover:opacity-100
                        transition-all duration-400
                      "
                    >
                      <p className="text-[11px] leading-relaxed text-white/90 italic">
                        {item.quote}
                      </p>
                    </div>
                  )}

                </div>

                {/* Card content */}
                <div className="p-3.5">

                  <div className="flex items-center justify-between gap-2">

                    <h3 className="text-xs font-bold text-white truncate">
                      {item.title}
                    </h3>

                    {item.category === 'Me' && (
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                    )}

                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>

                </div>

              </button>

            ))}

          </div>

        )}

      </div>

      {/* ================================================================== */}
      {/* LIGHTBOX                                                            */}
      {/* ================================================================== */}

      {currentItem && (

        <div
          className="
            fixed inset-0 z-[999]
            bg-black/95 backdrop-blur-2xl
            flex flex-col
            animate-in fade-in duration-200
          "
          role="dialog"
          aria-modal="true"
          aria-label={currentItem.title}
        >

          {/* ============================================================ */}
          {/* LIGHTBOX HEADER                                               */}
          {/* ============================================================ */}

          <div className="shrink-0 px-4 md:px-6 py-4 border-b border-white/10">

            <div className="flex items-center justify-between gap-4">

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <span className="px-2 py-1 rounded-md bg-purple-500/10 border border-purple-400/20 text-[9px] font-bold uppercase tracking-wider text-purple-300">
                    {currentItem.category}
                  </span>

                  <span className="text-[10px] text-slate-500">
                    {(selectedItemIndex ?? 0) + 1} / {filteredItems.length}
                  </span>

                </div>

                <h2 className="text-sm md:text-base font-bold text-white mt-1 truncate">
                  {currentItem.title}
                </h2>

              </div>

              {/* Controls */}
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
                    bg-white/5 hover:bg-white/10
                    border border-white/10
                    text-white transition-all
                  "
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setZoomLevel((prev) =>
                      Math.min(2.5, prev + 0.2)
                    )
                  }
                  className="
                    p-2.5 rounded-xl
                    bg-white/5 hover:bg-white/10
                    border border-white/10
                    text-white transition-all
                  "
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={closeLightbox}
                  className="
                    p-2.5 rounded-xl
                    bg-red-500/80 hover:bg-red-500
                    border border-red-400/20
                    text-white transition-all
                  "
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>

          {/* ============================================================ */}
          {/* IMAGE AREA                                                    */}
          {/* ============================================================ */}

          <div className="relative flex-1 flex items-center justify-center overflow-hidden px-4">

            {/* Previous */}
            <button
              type="button"
              onClick={prevImage}
              className="
                absolute left-3 md:left-6 z-20
                w-11 h-11 rounded-full
                bg-black/60 hover:bg-purple-600
                border border-white/10
                backdrop-blur-md
                flex items-center justify-center
                text-white
                transition-all duration-200
                hover:scale-105
              "
              title="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Image */}
            <div
              className="
                relative max-w-[88vw] max-h-[72vh]
                flex items-center justify-center
              "
            >

              <img
                src={getImageSource(currentItem)}
                alt={currentItem.title}
                onError={() => handleImageError(currentItem.id)}
                style={{
                  transform: `scale(${zoomLevel})`,
                }}
                className="
                  max-h-[72vh]
                  max-w-[88vw]
                  object-contain
                  rounded-2xl
                  shadow-2xl
                  transition-transform duration-300
                  select-none
                "
              />

            </div>

            {/* Next */}
            <button
              type="button"
              onClick={nextImage}
              className="
                absolute right-3 md:right-6 z-20
                w-11 h-11 rounded-full
                bg-black/60 hover:bg-purple-600
                border border-white/10
                backdrop-blur-md
                flex items-center justify-center
                text-white
                transition-all duration-200
                hover:scale-105
              "
              title="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          {/* ============================================================ */}
          {/* LIGHTBOX FOOTER                                               */}
          {/* ============================================================ */}

          <div className="shrink-0 px-4 md:px-6 py-4 border-t border-white/10">

            <div className="max-w-5xl mx-auto">

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

                {/* Description */}
                <div className="max-w-3xl">

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentItem.description}
                  </p>

                  {/* Quote */}
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

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">

                  <a
                    href={currentItem.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex items-center gap-2
                      px-3 py-2 rounded-xl
                      bg-white/5 hover:bg-white/10
                      border border-white/10
                      text-xs font-medium text-slate-300
                      hover:text-white
                      transition-all
                    "
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Original
                  </a>

                </div>

              </div>

              {/* Keyboard hint */}
              <div className="hidden md:flex items-center justify-center gap-3 mt-4 text-[9px] text-slate-600">

                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                    ←
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                    →
                  </kbd>
                  Navigate
                </span>

                <span>•</span>

                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                    +
                  </kbd>{' '}
                  Zoom
                </span>

                <span>•</span>

                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
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
  );
};