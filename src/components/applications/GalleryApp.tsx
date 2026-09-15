import React, { useState } from 'react';
import {
  Images,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Download,
  Filter,
  Maximize2,
  FolderKanban,
  Award,
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Projects' | 'Architecture' | 'Certificates' | 'Wallpapers';
  imageUrl: string;
  description: string;
}

const STATIC_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'KrishiMitra AI — Precision Farming Interface',
    category: 'Projects',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&q=80',
    description: 'AI-driven soil health diagnostics, weather prediction, and crop advisory UI.',
  },
  {
    id: 'gal-2',
    title: 'CraveVerse — Food Delivery Ecosystem Architecture',
    category: 'Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    description: 'Microservices architecture with real-time driver telemetry and order dispatching.',
  },
  {
    id: 'gal-3',
    title: 'Amba Motors — ERP & Dealership Dashboard',
    category: 'Projects',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    description: 'Automobile dealership inventory, booking pipelines, and financial analytics.',
  },
  {
    id: 'gal-4',
    title: 'AWS Certified Cloud Practitioner Certificate',
    category: 'Certificates',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80',
    description: 'Validation of foundational cloud architecture, security, and billing models.',
  },
  {
    id: 'gal-5',
    title: 'Midnight Aurora Live Wallpaper Asset',
    category: 'Wallpapers',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    description: 'High-definition celestial aurora canvas rendered within Abhishek OS.',
  },
  {
    id: 'gal-6',
    title: 'Developer Engineering Workstation Setup',
    category: 'Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
    description: 'Multi-monitor development workspace for full-stack engineering sprints.',
  },
];

export const GalleryApp: React.FC = () => {
  const { projects } = useOS();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Combine static gallery items with live project thumbnails from context
  const dynamicProjectItems: GalleryItem[] = (projects || []).map(p => ({
    id: `dyn-${p.id}`,
    title: p.title,
    category: 'Projects',
    imageUrl: p.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    description: p.short_description,
  }));

  const allItems: GalleryItem[] = [...STATIC_GALLERY_ITEMS, ...dynamicProjectItems];

  const filteredItems = allItems.filter(
    item => activeCategory === 'All' || item.category === activeCategory
  );

  const openLightbox = (index: number) => {
    setSelectedItemIndex(index);
    setZoomLevel(1);
  };

  const closeLightbox = () => {
    setSelectedItemIndex(null);
    setZoomLevel(1);
  };

  const nextImage = () => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((selectedItemIndex + 1) % filteredItems.length);
    setZoomLevel(1);
  };

  const prevImage = () => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((selectedItemIndex - 1 + filteredItems.length) % filteredItems.length);
    setZoomLevel(1);
  };

  const currentItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* 1. TOP HEADER & CATEGORY FILTER */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/8 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
            <Images className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Media & Project Gallery</h2>
            <p className="text-[10px] text-slate-400">High-resolution artifacts, UI designs, and credentials</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-white/10 text-xs">
          {['All', 'Projects', 'Architecture', 'Certificates', 'Wallpapers'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. GALLERY GRID VIEW */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-purple-500/40 cursor-pointer shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>View Fullscreen</span>
                  </span>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white mt-0.5 truncate">{item.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FULLSCREEN LIGHTBOX MODAL */}
      {currentItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-6 select-none animate-in fade-in duration-200">
          {/* Top Lightbox Controls */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
            <div>
              <h2 className="text-sm md:text-base font-bold text-white">{currentItem.title}</h2>
              <p className="text-xs text-slate-400">{currentItem.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Image View */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10 transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={currentItem.imageUrl}
              alt={currentItem.title}
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-h-[75vh] max-w-[85vw] object-contain rounded-xl shadow-2xl transition-transform duration-200"
            />

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10 transition-colors"
              title="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption & Navigation Counter */}
          <div className="text-center text-xs text-slate-400">
            Image {(selectedItemIndex ?? 0) + 1} of {filteredItems.length}
          </div>
        </div>
      )}
    </div>
  );
};
