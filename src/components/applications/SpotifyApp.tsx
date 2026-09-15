import React, { useState } from 'react';
import {
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  ListMusic,
  Disc3,
  ExternalLink,
  Search,
  Sparkles,
  Radio,
  Check,
} from 'lucide-react';

interface SpotifyItem {
  id: string;
  title: string;
  subtitle: string;
  embedUri: string;
  type: 'playlist' | 'track' | 'album';
  cover: string;
}

const FEATURED_SPOTIFY_ITEMS: SpotifyItem[] = [
  {
    id: 'sp-1',
    title: "Abhishek's Deep Coding Session",
    subtitle: 'High-focus ambient electronic & synthwave for engineers',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0',
    type: 'playlist',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
  },
  {
    id: 'sp-2',
    title: 'Lo-Fi Beats to Code/Relax To',
    subtitle: 'Calm mellow beats for continuous uninterrupted productivity',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0',
    type: 'playlist',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
  },
  {
    id: 'sp-3',
    title: 'Peaceful Piano & Acoustic Study',
    subtitle: 'Gentle piano melodies designed for deep analytical thinking',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0',
    type: 'playlist',
    cover: 'https://images.unsplash.com/photo-1520523839898-5071282543e2?w=800&q=80',
  },
  {
    id: 'sp-4',
    title: 'Night Rider / Synthwave Fast Coding',
    subtitle: 'Uplifting retro-wave tracks for rapid prototyping',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0',
    type: 'playlist',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
  },
];

export const SpotifyApp: React.FC = () => {
  const [activeItem, setActiveItem] = useState<SpotifyItem>(FEATURED_SPOTIFY_ITEMS[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'Now Playing' | 'Playlists' | 'Favorites'>('Now Playing');
  const [favorites, setFavorites] = useState<string[]>(['sp-1', 'sp-2']);
  const [customError, setCustomError] = useState('');

  // Converts any user-entered Spotify URL into official Spotify Embed URL
  const convertToSpotifyEmbed = (url: string): string | null => {
    try {
      const cleanUrl = url.trim();
      const match = cleanUrl.match(/spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/);
      if (match) {
        const type = match[1];
        const id = match[2];
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');
    const embedUrl = convertToSpotifyEmbed(customUrl);
    if (!embedUrl) {
      setCustomError('Please provide a valid Spotify track, playlist, or album link.');
      return;
    }

    const newItem: SpotifyItem = {
      id: `custom-${Date.now()}`,
      title: 'Custom Spotify Stream',
      subtitle: 'Loaded via user pasted URL',
      embedUri: embedUrl,
      type: 'playlist',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    };

    setActiveItem(newItem);
    setCustomUrl('');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]));
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* 1. SPOTIFY HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
            <Music className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Spotify Music Station</h2>
            <p className="text-[10px] text-slate-400">Curated audio for deep programming sprints</p>
          </div>
        </div>

        {/* Custom Spotify URL Input */}
        <form onSubmit={handleCustomSubmit} className="hidden sm:flex items-center gap-2">
          <input
            type="text"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            placeholder="Paste Spotify track/playlist link..."
            className="w-56 px-3 py-1.5 rounded-full bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-hidden focus:border-emerald-500/50"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            Play Link
          </button>
        </form>
      </div>

      {customError && (
        <div className="px-4 py-1.5 bg-red-950/80 border-b border-red-500/30 text-[11px] text-red-300">
          {customError}
        </div>
      )}

      {/* 2. BODY WITH NAVIGATION TABS & EMBED VIEW */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left / Sidebar Playlist selector */}
        <div className="w-full md:w-72 border-r border-white/8 bg-slate-900/60 flex flex-col p-3 space-y-3 shrink-0 overflow-y-auto">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-white/8 text-xs">
            {(['Now Playing', 'Playlists', 'Favorites'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-500/20 text-emerald-400 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
              Curated Stations
            </div>

            {FEATURED_SPOTIFY_ITEMS.filter(
              item => activeTab !== 'Favorites' || favorites.includes(item.id)
            ).map(item => {
              const isSelected = item.id === activeItem.id;
              const isFav = favorites.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`group flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-white'
                      : 'hover:bg-slate-800/80 border border-transparent text-slate-300'
                  }`}
                >
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold truncate group-hover:text-white">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">{item.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className={`p-1 rounded-full transition-colors ${
                      isFav ? 'text-emerald-400' : 'text-slate-500 opacity-0 group-hover:opacity-100 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-emerald-400' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Recruiter / Visitor Tip */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-white/8 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <Radio className="w-3.5 h-3.5" />
              <span>Official Embedded Player</span>
            </div>
            <p>Music streams via verified Spotify embeds without downloading or copyright infringement.</p>
          </div>
        </div>

        {/* Right / Main Audio Player Area */}
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-900/40 to-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                Now Streaming
              </span>
              <h1 className="text-xl font-bold text-white mt-1">{activeItem.title}</h1>
              <p className="text-xs text-slate-400">{activeItem.subtitle}</p>
            </div>

            <button
              type="button"
              onClick={() => toggleFavorite(activeItem.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs text-slate-200 transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${favorites.includes(activeItem.id) ? 'text-emerald-400 fill-emerald-400' : 'text-slate-400'}`}
              />
              <span>{favorites.includes(activeItem.id) ? 'Favorited' : 'Add to Library'}</span>
            </button>
          </div>

          {/* Official Spotify Iframe Player */}
          <div className="w-full flex-1 min-h-[380px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
            <iframe
              src={activeItem.embedUri}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="w-full h-full min-h-[380px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
