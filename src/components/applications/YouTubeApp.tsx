import React, { useState } from 'react';
import {
  Search,
  Play,
  Share2,
  ThumbsUp,
  Clock,
  Sparkles,
  Tv,
  CheckCircle2,
  ExternalLink,
  Code2,
  Headphones,
} from 'lucide-react';

interface YouTubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  views: string;
  published: string;
  duration: string;
  thumbnail: string;
  category: 'Tech' | 'Portfolio' | 'Music';
  description: string;
}

const FEATURED_VIDEOS: YouTubeVideo[] = [
  {
    id: 'yt-1',
    youtubeId: 'SqcY0GlETPk', // React Tutorial / Clean Code
    title: 'React 19 & Next.js Full Stack Architecture Deep Dive',
    channel: 'Abhishek Kuntare Dev Showcase',
    views: '18.4K views',
    published: '3 weeks ago',
    duration: '24:15',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    category: 'Tech',
    description:
      'A comprehensive architectural breakdown of modern React patterns, concurrent features, server components, and responsive state management in developer workstations.',
  },
  {
    id: 'yt-2',
    youtubeId: 'jfKfPfyJRdk', // Lofi Beats to Relax / Study to
    title: 'Synthwave & Lo-Fi Coding Beats — 24/7 Deep Work Session',
    channel: 'Lofi Girl / Developer Radio',
    views: '2.8M views',
    published: 'Live',
    duration: 'LIVE',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    category: 'Music',
    description:
      'Immersive ambient background music curated for engineers, developers, and designers working on intense deep programming sprints.',
  },
  {
    id: 'yt-3',
    youtubeId: 'aircAruvnKk', // Neural Networks & Machine Learning
    title: 'Building AI Powered Applications with TypeScript & Gemini APIs',
    channel: 'AI Systems Engineering',
    views: '92.1K views',
    published: '1 month ago',
    duration: '38:42',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&q=80',
    category: 'Tech',
    description:
      'Complete end-to-end guide on architecting resilient AI pipelines, function calling, streaming responses, and low-latency inference in web applications.',
  },
  {
    id: 'yt-4',
    youtubeId: 'bMknfKXIFA8', // Modern React & Tailwind CSS
    title: 'Building Modern Desktop Operating Systems in the Browser',
    channel: 'Frontend Masterclass',
    views: '45.3K views',
    published: '2 months ago',
    duration: '42:10',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    category: 'Portfolio',
    description:
      'Explore how to craft window managers, taskbars, virtual desktop environments, and fluid glassmorphism interfaces using React and Tailwind.',
  },
];

export const YouTubeApp: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo>(FEATURED_VIDEOS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [customUrlError, setCustomUrlError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Extract YouTube ID safely from diverse URL formats
  const extractVideoId = (url: string): string | null => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    } catch {
      return null;
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomUrlError('');
    const id = extractVideoId(customUrlInput.trim());
    if (!id) {
      setCustomUrlError('Please enter a valid YouTube URL (e.g. https://www.youtube.com/watch?v=...)');
      return;
    }

    const customVideo: YouTubeVideo = {
      id: `custom-${Date.now()}`,
      youtubeId: id,
      title: 'Custom Embedded Video',
      channel: 'User Added Stream',
      views: '1 view',
      published: 'Just now',
      duration: 'Embed',
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      category: 'Tech',
      description: 'Official YouTube embedded playback loaded via custom URL entry.',
    };

    setSelectedVideo(customVideo);
    setCustomUrlInput('');
  };

  const filteredVideos = FEATURED_VIDEOS.filter(v => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* 1. YOUTUBE HEADER & SEARCH BAR */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-white/8 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
            <Play className="w-4 h-4 fill-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white hidden sm:inline">
            YouTube <span className="text-[10px] font-medium text-slate-400">Embed Studio</span>
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-white/10 focus-within:border-red-500/50 transition-all text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search developer talks, coding streams..."
              className="flex-1 bg-transparent text-white placeholder-slate-500 outline-hidden text-xs"
            />
          </div>
        </div>

        {/* Quick Direct URL Embed */}
        <form onSubmit={handleCustomUrlSubmit} className="hidden md:flex items-center gap-2">
          <input
            type="text"
            value={customUrlInput}
            onChange={e => setCustomUrlInput(e.target.value)}
            placeholder="Paste YouTube link..."
            className="w-48 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-hidden focus:border-red-500/50"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Play URL
          </button>
        </form>
      </div>

      {customUrlError && (
        <div className="px-4 py-1.5 bg-red-950/80 border-b border-red-500/30 text-[11px] text-red-300">
          {customUrlError}
        </div>
      )}

      {/* 2. MAIN LAYOUT: ACTIVE PLAYER + RELATED VIDEOS */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Left / Top: Active Video Player Area */}
        <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto space-y-4">
          {/* Responsive Official 16:9 Embed Player */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={selectedVideo.title}
              className="absolute inset-0 w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Metadata & Controls */}
          <div className="space-y-3">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {selectedVideo.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="font-semibold text-slate-200">{selectedVideo.channel}</span>
                <span>•</span>
                <span>{selectedVideo.views}</span>
                <span>•</span>
                <span>{selectedVideo.published}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Recommend</span>
                </button>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open on YouTube</span>
                </a>
              </div>
            </div>

            {/* Description Box */}
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/8 text-xs text-slate-300 leading-relaxed space-y-2">
              <p>{selectedVideo.description}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified embed playback through official YouTube API player</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Bottom: Related Videos Sidebar */}
        <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-white/8 bg-slate-900/50 flex flex-col p-4 space-y-3 overflow-y-auto">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Related Playlists
            </span>
            <div className="flex items-center gap-1 text-[11px]">
              {['All', 'Tech', 'Music'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredVideos.map(video => {
              const isCurrent = video.youtubeId === selectedVideo.youtubeId;
              return (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`flex gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-red-600/15 border border-red-500/30'
                      : 'hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  {/* Thumbnail with duration badge */}
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-slate-950 shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[10px] font-bold text-white">
                      {video.duration}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <h3 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                    <div className="text-[11px] text-slate-400">
                      <p className="truncate">{video.channel}</p>
                      <p className="text-[10px] text-slate-500">{video.views}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
