import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  Home,
  History,
  Clock3,
  ThumbsUp,
  Menu,
  X,
  Play,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Music2,
  Gamepad2,
  Newspaper,
  Trophy,
  GraduationCap,
  Code2,
  Film,
  MonitorPlay,
  Settings2,
  SlidersHorizontal,
  ArrowUpDown,
  UserRound,
  CheckCircle2,
  PictureInPicture2,
  Theater,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface YouTubeThumbnail {
  url: string;
  width?: number;
  height?: number;
}

interface NormalizedVideo {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
  views?: string;
  likes?: string;
  comments?: string;
  definition?: string;
  caption?: string;
}

interface YouTubeSearchItem {
  id?:
    | string
    | {
        kind?: string;
        videoId?: string;
        channelId?: string;
        playlistId?: string;
      };

  snippet?: {
    publishedAt?: string;
    channelId?: string;
    title?: string;
    description?: string;
    thumbnails?: {
      default?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
      standard?: YouTubeThumbnail;
      maxres?: YouTubeThumbnail;
    };
    channelTitle?: string;
    liveBroadcastContent?: string;
  };

  title?: string;
  description?: string;
  channelId?: string;
  channelTitle?: string;
  thumbnail?: string;
  publishedAt?: string;
  duration?: string;
  views?: string;
  likes?: string;
  comments?: string;
  definition?: string;
  caption?: string;
}

interface YouTubeVideoItem extends YouTubeSearchItem {
  contentDetails?: {
    duration?: string;
    dimension?: string;
    definition?: string;
    caption?: string;
  };

  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
}

interface YouTubeChannelItem {
  id: string;

  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: {
      default?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
    };
  };

  statistics?: {
    subscriberCount?: string;
    videoCount?: string;
    viewCount?: string;
  };
}

interface APIResponse {
  items?: unknown[];
  nextPageToken?: string;
  prevPageToken?: string;

  pageInfo?: {
    totalResults?: number;
    resultsPerPage?: number;
  };

  error?: {
    message?: string;
  };

  message?: string;
}

type ViewMode =
  | "home"
  | "trending"
  | "search"
  | "history"
  | "watch-later"
  | "liked";

type SortOrder =
  | "relevance"
  | "date"
  | "rating"
  | "viewCount"
  | "title";

type DurationFilter =
  | "any"
  | "short"
  | "medium"
  | "long";

interface SearchOptions {
  sort: SortOrder;
  duration: DurationFilter;
  hdOnly: boolean;
}

/* =========================================================
   CONSTANTS
========================================================= */

const API_BASE =
  import.meta.env.VITE_YOUTUBE_API_BASE_URL ||
  "/api/youtube";

const STORAGE_KEYS = {
  history: "abhishek-os-youtube-history-v1",
  watchLater: "abhishek-os-youtube-watch-later-v1",
  liked: "abhishek-os-youtube-liked-v1",
  searches: "abhishek-os-youtube-search-history-v1",
};

const CATEGORIES = [
  {
    label: "All",
    query: "",
    icon: MonitorPlay,
  },
  {
    label: "Music",
    query: "music",
    icon: Music2,
  },
  {
    label: "Gaming",
    query: "gaming",
    icon: Gamepad2,
  },
  {
    label: "News",
    query: "news",
    icon: Newspaper,
  },
  {
    label: "Sports",
    query: "sports",
    icon: Trophy,
  },
  {
    label: "Education",
    query: "education",
    icon: GraduationCap,
  },
  {
    label: "Programming",
    query: "programming",
    icon: Code2,
  },
  {
    label: "Movies",
    query: "movies",
    icon: Film,
  },
];

const SORT_OPTIONS: {
  value: SortOrder;
  label: string;
}[] = [
  {
    value: "relevance",
    label: "Relevance",
  },
  {
    value: "date",
    label: "Upload date",
  },
  {
    value: "rating",
    label: "Rating",
  },
  {
    value: "viewCount",
    label: "View count",
  },
  {
    value: "title",
    label: "Title",
  },
];

const DURATION_OPTIONS: {
  value: DurationFilter;
  label: string;
}[] = [
  {
    value: "any",
    label: "Any duration",
  },
  {
    value: "short",
    label: "Under 4 minutes",
  },
  {
    value: "medium",
    label: "4–20 minutes",
  },
  {
    value: "long",
    label: "Over 20 minutes",
  },
];

/* =========================================================
   STORAGE
========================================================= */

function readStorage<T>(
  key: string,
  fallback: T
): T {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(
  key: string,
  value: T
) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch {
    // Ignore storage failures.
  }
}

/* =========================================================
   FORMATTERS
========================================================= */

function formatViews(
  value?: string
): string {
  if (!value) return "";

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return value;
  }

  if (number >= 1_000_000_000) {
    return `${(
      number / 1_000_000_000
    ).toFixed(1)}B views`;
  }

  if (number >= 1_000_000) {
    return `${(
      number / 1_000_000
    ).toFixed(1)}M views`;
  }

  if (number >= 1_000) {
    return `${(
      number / 1_000
    ).toFixed(1)}K views`;
  }

  return `${number} views`;
}

function formatSubscribers(
  value?: string
): string {
  if (!value) return "";

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return value;
  }

  if (number >= 1_000_000) {
    return `${(
      number / 1_000_000
    ).toFixed(1)}M subscribers`;
  }

  if (number >= 1_000) {
    return `${(
      number / 1_000
    ).toFixed(1)}K subscribers`;
  }

  return `${number} subscribers`;
}

function formatDate(
  dateString?: string
): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const difference = Math.max(
    0,
    Date.now() - date.getTime()
  );

  const minutes = Math.floor(
    difference / 60_000
  );

  const hours = Math.floor(
    difference / 3_600_000
  );

  const days = Math.floor(
    difference / 86_400_000
  );

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

function parseISO8601Duration(
  duration?: string
): number {
  if (!duration) {
    return 0;
  }

  const match = duration.match(
    /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  );

  if (!match) {
    return 0;
  }

  const days = Number(
    match[1] || 0
  );

  const hours = Number(
    match[2] || 0
  );

  const minutes = Number(
    match[3] || 0
  );

  const seconds = Number(
    match[4] || 0
  );

  return (
    days * 86400 +
    hours * 3600 +
    minutes * 60 +
    seconds
  );
}

function formatDuration(
  duration?: string
): string {
  const totalSeconds =
    parseISO8601Duration(duration);

  if (!totalSeconds) {
    return "";
  }

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(
      minutes
    ).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(
    seconds
  ).padStart(2, "0")}`;
}

/* =========================================================
   SAFE HELPERS
========================================================= */

function isObject(
  value: unknown
): value is Record<string, any> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function getString(
  value: unknown,
  fallback = ""
): string {
  return typeof value === "string"
    ? value
    : fallback;
}

function getVideoId(
  item: any
): string {
  if (!item) {
    return "";
  }

  if (typeof item.id === "string") {
    return item.id;
  }

  if (
    isObject(item.id) &&
    typeof item.id.videoId === "string"
  ) {
    return item.id.videoId;
  }

  if (
    typeof item.videoId === "string"
  ) {
    return item.videoId;
  }

  return "";
}

function getThumbnail(
  item: any,
  videoId: string
): string {
  if (
    typeof item?.thumbnail ===
    "string"
  ) {
    return item.thumbnail;
  }

  const thumbnails =
    item?.snippet?.thumbnails;

  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    (videoId
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      : "")
  );
}

/* =========================================================
   NORMALIZATION
   IMPORTANT:
   Supports both:
   1. Raw YouTube API objects
   2. Backend-normalized objects
========================================================= */

function normalizeVideo(
  item: unknown
): NormalizedVideo | null {
  if (!isObject(item)) {
    return null;
  }

  const videoId =
    getVideoId(item);

  if (!videoId) {
    return null;
  }

  const snippet =
    isObject(item.snippet)
      ? item.snippet
      : {};

  const contentDetails =
    isObject(item.contentDetails)
      ? item.contentDetails
      : {};

  const statistics =
    isObject(item.statistics)
      ? item.statistics
      : {};

  const title =
    getString(
      item.title,
      getString(
        snippet.title
      )
    );

  const description =
    getString(
      item.description,
      getString(
        snippet.description
      )
    );

  const channelId =
    getString(
      item.channelId,
      getString(
        snippet.channelId
      )
    );

  const channelTitle =
    getString(
      item.channelTitle,
      getString(
        snippet.channelTitle
      )
    );

  const publishedAt =
    getString(
      item.publishedAt,
      getString(
        snippet.publishedAt
      )
    );

  const duration =
    getString(
      item.duration,
      getString(
        contentDetails.duration
      )
    );

  const views =
    getString(
      item.views,
      getString(
        statistics.viewCount
      )
    );

  const likes =
    getString(
      item.likes,
      getString(
        statistics.likeCount
      )
    );

  const comments =
    getString(
      item.comments,
      getString(
        statistics.commentCount
      )
    );

  const definition =
    getString(
      item.definition,
      getString(
        contentDetails.definition
      )
    );

  const caption =
    getString(
      item.caption,
      getString(
        contentDetails.caption
      )
    );

  const thumbnail =
    getThumbnail(
      item,
      videoId
    );

  return {
    id: videoId,
    title:
      title || "Untitled video",
    description,
    channelId,
    channelTitle:
      channelTitle ||
      "Unknown channel",
    thumbnail,
    publishedAt,
    duration:
      duration || undefined,
    views:
      views || undefined,
    likes:
      likes || undefined,
    comments:
      comments || undefined,
    definition:
      definition || undefined,
    caption:
      caption || undefined,
  };
}

function normalizeItems(
  items: unknown[]
): NormalizedVideo[] {
  const result: NormalizedVideo[] =
    [];

  for (const item of items) {
    const normalized =
      normalizeVideo(item);

    if (normalized) {
      result.push(normalized);
    }
  }

  return dedupeVideos(result);
}

function dedupeVideos(
  videos: NormalizedVideo[]
): NormalizedVideo[] {
  const map = new Map<
    string,
    NormalizedVideo
  >();

  for (const video of videos) {
    if (!video.id) {
      continue;
    }

    map.set(
      video.id,
      video
    );
  }

  return Array.from(
    map.values()
  );
}

/* =========================================================
   SEARCH PARAMS
========================================================= */

function buildSearchParams(
  query: string,
  options: SearchOptions,
  pageToken?: string
): string {
  const params =
    new URLSearchParams();

  params.set(
    "q",
    query
  );

  params.set(
    "maxResults",
    "24"
  );

  params.set(
    "type",
    "video"
  );

  params.set(
    "safeSearch",
    "moderate"
  );

  params.set(
    "videoEmbeddable",
    "true"
  );

  params.set(
    "regionCode",
    "IN"
  );

  if (options.sort) {
    params.set(
      "order",
      options.sort
    );
  }

  if (
    options.duration !==
    "any"
  ) {
    params.set(
      "videoDuration",
      options.duration
    );
  }

  if (options.hdOnly) {
    params.set(
      "videoDefinition",
      "high"
    );
  }

  if (pageToken) {
    params.set(
      "pageToken",
      pageToken
    );
  }

  return params.toString();
}

/* =========================================================
   API REQUEST
========================================================= */

async function apiRequest(
  path: string,
  params?: Record<
    string,
    string | undefined
  >,
  signal?: AbortSignal
): Promise<APIResponse> {
  const searchParams =
    new URLSearchParams();

  Object.entries(
    params || {}
  ).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== ""
      ) {
        searchParams.set(
          key,
          value
        );
      }
    }
  );

  const url =
    `${API_BASE}${path}` +
    (searchParams.toString()
      ? `?${searchParams.toString()}`
      : "");

  const response =
    await fetch(url, {
      method: "GET",

      /*
       * Important during development:
       * prevents browser cache / 304
       * from confusing the UI.
       */
      cache: "no-store",

      headers: {
        Accept:
          "application/json",
        "Cache-Control":
          "no-cache",
      },

      signal,
    });

  let payload: APIResponse =
    {};

  try {
    if (
      response.status !== 204
    ) {
      payload =
        (await response.json()) as APIResponse;
    }
  } catch {
    payload = {};
  }

  if (
    !response.ok
  ) {
    throw new Error(
      payload.error
        ?.message ||
        payload.message ||
        `YouTube request failed (${response.status})`
    );
  }

  return payload;
}

/* =========================================================
   SKELETON
========================================================= */

const VideoSkeleton: React.FC =
  () => {
    return (
      <div className="animate-pulse">
        <div className="aspect-video rounded-xl bg-white/[0.06]" />

        <div className="mt-3 flex gap-3">
          <div className="h-9 w-9 shrink-0 rounded-full bg-white/[0.06]" />

          <div className="min-w-0 flex-1">
            <div className="h-4 w-[90%] rounded bg-white/[0.06]" />

            <div className="mt-2 h-3 w-[65%] rounded bg-white/[0.04]" />

            <div className="mt-2 h-3 w-[45%] rounded bg-white/[0.04]" />
          </div>
        </div>
      </div>
    );
  };

/* =========================================================
   VIDEO CARD
========================================================= */

interface VideoCardProps {
  video: NormalizedVideo;
  onOpen: (
    video: NormalizedVideo
  ) => void;
  onWatchLater: (
    video: NormalizedVideo
  ) => void;
  isSaved: boolean;
  compact?: boolean;
}

const VideoCard: React.FC<
  VideoCardProps
> = ({
  video,
  onOpen,
  onWatchLater,
  isSaved,
  compact = false,
}) => {
  const [channelImageError, setChannelImageError] =
    useState(false);

  const channelImage =
    video.channelId
      ? `https://yt3.googleusercontent.com/ytc/AIdro_${encodeURIComponent(
          video.channelId
        )}=s88-c-k-c0x00ffffff-no-rj`
      : "";

  return (
    <article
      className={`group min-w-0 ${
        compact
          ? "flex gap-3"
          : ""
      }`}
    >
      <button
        type="button"
        onClick={() =>
          onOpen(video)
        }
        className={`relative block overflow-hidden rounded-xl bg-black text-left ${
          compact
            ? "h-[82px] w-[145px] shrink-0"
            : "aspect-video w-full"
        }`}
      >
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
            onError={(
              event
            ) => {
              event.currentTarget.src =
                `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#15171a]">
            <Play className="h-8 w-8 text-slate-600" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/70 backdrop-blur">
            <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
          </div>
        </div>

        {video.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            {formatDuration(
              video.duration
            )}
          </span>
        )}
      </button>

      <div
        className={`min-w-0 ${
          compact
            ? "py-0"
            : "mt-3"
        }`}
      >
        <div className="flex gap-3">
          {!compact && (
            <div className="mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/20">
              {!channelImageError &&
              channelImage ? (
                <img
                  src={channelImage}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={() =>
                    setChannelImageError(
                      true
                    )
                  }
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <UserRound className="h-4 w-4 text-cyan-200" />
                </div>
              )}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() =>
                onOpen(video)
              }
              className="line-clamp-2 w-full text-left text-sm font-semibold leading-5 text-white transition hover:text-cyan-300"
              title={video.title}
            >
              {video.title ||
                "Untitled video"}
            </button>

            <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <span className="truncate">
                {video.channelTitle ||
                  "Unknown channel"}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
              {video.views && (
                <span>
                  {formatViews(
                    video.views
                  )}
                </span>
              )}

              {video.views &&
                video.publishedAt && (
                  <span>
                    •
                  </span>
                )}

              {video.publishedAt && (
                <span>
                  {formatDate(
                    video.publishedAt
                  )}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label={
              isSaved
                ? "Remove from Watch later"
                : "Save to Watch later"
            }
            onClick={() =>
              onWatchLater(video)
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100"
          >
            {isSaved ? (
              <Check className="h-4 w-4 text-cyan-300" />
            ) : (
              <Clock3 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   SIDEBAR
========================================================= */

interface SidebarProps {
  activeView: ViewMode;
  onNavigate: (
    view: ViewMode
  ) => void;
  onClose?: () => void;
  mobile?: boolean;
}

const Sidebar: React.FC<
  SidebarProps
> = ({
  activeView,
  onNavigate,
  onClose,
  mobile = false,
}) => {
  const primary = [
    {
      id: "home" as const,
      label: "Home",
      icon: Home,
    },
    {
      id: "trending" as const,
      label: "Trending",
      icon: TrendingUp,
    },
    {
      id: "history" as const,
      label: "History",
      icon: History,
    },
    {
      id: "watch-later" as const,
      label: "Watch later",
      icon: Clock3,
    },
    {
      id: "liked" as const,
      label: "Liked videos",
      icon: ThumbsUp,
    },
  ];

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-white/[0.07] bg-[#0b0d10] ${
        mobile
          ? "h-full w-[280px]"
          : "hidden w-[220px] lg:flex"
      }`}
    >
      <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500 shadow-lg shadow-red-500/20">
            <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
          </div>

          <div>
            <div className="text-sm font-bold text-white">
              YouTube
            </div>

            <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Abhishek OS
            </div>
          </div>
        </div>

        {mobile &&
          onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {primary.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                activeView ===
                item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    void onNavigate(
                      item.id
                    );

                    onClose?.();
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-white/10 font-semibold text-white"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] ${
                      active
                        ? "text-cyan-300"
                        : ""
                    }`}
                  />

                  <span>
                    {item.label}
                  </span>
                </button>
              );
            }
          )}
        </div>

        <div className="my-4 h-px bg-white/[0.06]" />

        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
          Explore
        </div>

        <div className="space-y-1">
          {CATEGORIES.slice(
            1
          ).map(
            (category) => {
              const Icon =
                category.icon;

              return (
                <button
                  key={
                    category.label
                  }
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent(
                        "abhishek:youtube-search",
                        {
                          detail: {
                            query:
                              category.query,
                          },
                        }
                      )
                    );

                    onClose?.();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" />

                  <span>
                    {category.label}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

            YouTube API
          </div>

          <p className="mt-1 text-[10px] leading-4 text-slate-600">
            Live public search and playback
          </p>
        </div>
      </div>
    </aside>
  );
};

/* =========================================================
   PLAYER
========================================================= */

interface PlayerProps {
  video: NormalizedVideo;
}

const Player: React.FC<
  PlayerProps
> = ({ video }) => {
  const iframeRef =
    useRef<HTMLIFrameElement | null>(
      null
    );

  const playerContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    isFullscreen,
    setIsFullscreen,
  ] = useState(false);

  const [
    isTheater,
    setIsTheater,
  ] = useState(false);

  const [
    showMiniPlayer,
    setShowMiniPlayer,
  ] = useState(false);

  const playerUrl =
    useMemo(() => {
      const params =
        new URLSearchParams({
          autoplay: "1",
          rel: "0",
          playsinline: "1",
          enablejsapi: "1",
          modestbranding: "1",
          iv_load_policy: "3",
          origin:
            window.location.origin,
        });

      return `https://www.youtube.com/embed/${encodeURIComponent(
        video.id
      )}?${params.toString()}`;
    }, [video.id]);

  const toggleFullscreen =
    useCallback(
      async () => {
        const element =
          playerContainerRef.current;

        if (!element) {
          return;
        }

        try {
          if (
            !document.fullscreenElement
          ) {
            await element.requestFullscreen();
          } else {
            await document.exitFullscreen();
          }
        } catch {
          // Ignore browser fullscreen restrictions.
        }
      },
      []
    );

  useEffect(() => {
    const handler =
      () => {
        setIsFullscreen(
          Boolean(
            document.fullscreenElement
          )
        );
      };

    document.addEventListener(
      "fullscreenchange",
      handler
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handler
      );
    };
  }, []);

  useEffect(() => {
    const handler =
      (event: KeyboardEvent) => {
        const target =
          event.target as HTMLElement | null;

        if (
          target?.matches(
            "input, textarea, select, button, [contenteditable='true']"
          )
        ) {
          return;
        }

        if (
          event.key === "f"
        ) {
          event.preventDefault();

          void toggleFullscreen();
        }

        if (
          event.key === "t"
        ) {
          event.preventDefault();

          setIsTheater(
            (current) =>
              !current
          );
        }
      };

    window.addEventListener(
      "keydown",
      handler
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handler
      );
    };
  }, [toggleFullscreen]);

  return (
    <div
      className={`relative ${
        isTheater
          ? "fixed inset-0 z-[9999] flex items-center justify-center bg-black p-4"
          : ""
      }`}
    >
      <div
        ref={playerContainerRef}
        className={`group relative overflow-hidden bg-black ${
          isTheater
            ? "h-full w-full max-w-[1600px]"
            : "aspect-video w-full rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40"
        }`}
      >
        <iframe
          ref={iframeRef}
          key={video.id}
          src={playerUrl}
          title={
            video.title ||
            "YouTube video"
          }
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition group-hover:opacity-100" />

        <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={() =>
              setShowMiniPlayer(
                true
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/70 text-white backdrop-blur-xl transition hover:bg-black/90"
            title="Mini player"
          >
            <PictureInPicture2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              setIsTheater(
                (current) =>
                  !current
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/70 text-white backdrop-blur-xl transition hover:bg-black/90"
            title="Theater mode"
          >
            <Theater className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              void toggleFullscreen()
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/70 text-white backdrop-blur-xl transition hover:bg-black/90"
            title={
              isFullscreen
                ? "Exit fullscreen"
                : "Fullscreen"
            }
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {showMiniPlayer && (
        <div className="fixed bottom-5 right-5 z-[10000] w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#101214] shadow-2xl shadow-black/60">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
            <span className="truncate pr-3 text-xs font-semibold text-white">
              {video.title}
            </span>

            <button
              type="button"
              onClick={() =>
                setShowMiniPlayer(
                  false
                )
              }
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="Close mini player"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="aspect-video">
            <iframe
              src={playerUrl}
              title={`${video.title} mini player`}
              className="h-full w-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   MAIN APP
========================================================= */

export const YouTubeApp: React.FC =
  () => {
    const [
      activeView,
      setActiveView,
    ] =
      useState<ViewMode>(
        "home"
      );

    const [
      query,
      setQuery,
    ] = useState("");

    const [
      submittedQuery,
      setSubmittedQuery,
    ] = useState("");

    const [
      videos,
      setVideos,
    ] = useState<
      NormalizedVideo[]
    >([]);

    const [
      selectedVideo,
      setSelectedVideo,
    ] =
      useState<NormalizedVideo | null>(
        null
      );

    const [
      history,
      setHistory,
    ] = useState<
      NormalizedVideo[]
    >(() =>
      readStorage(
        STORAGE_KEYS.history,
        []
      )
    );

    const [
      watchLater,
      setWatchLater,
    ] = useState<
      NormalizedVideo[]
    >(() =>
      readStorage(
        STORAGE_KEYS.watchLater,
        []
      )
    );

    const [
      liked,
      setLiked,
    ] = useState<
      NormalizedVideo[]
    >(() =>
      readStorage(
        STORAGE_KEYS.liked,
        []
      )
    );

    const [
      searchHistory,
      setSearchHistory,
    ] = useState<
      string[]
    >(() =>
      readStorage(
        STORAGE_KEYS.searches,
        []
      )
    );

    const [
      isLoading,
      setIsLoading,
    ] = useState(false);

    const [
      error,
      setError,
    ] =
      useState<string | null>(
        null
      );

    const [
      nextPageToken,
      setNextPageToken,
    ] = useState<
      string | undefined
    >();

    const [
      previousPageToken,
      setPreviousPageToken,
    ] = useState<
      string | undefined
    >();

    const [
      sort,
      setSort,
    ] =
      useState<SortOrder>(
        "relevance"
      );

    const [
      duration,
      setDuration,
    ] =
      useState<DurationFilter>(
        "any"
      );

    const [
      hdOnly,
      setHdOnly,
    ] = useState(false);

    const [
      showMobileSidebar,
      setShowMobileSidebar,
    ] = useState(false);

    const [
      showSearchHistory,
      setShowSearchHistory,
    ] = useState(false);

    const [
      showFilters,
      setShowFilters,
    ] = useState(false);

    const [
      channel,
      setChannel,
    ] =
      useState<YouTubeChannelItem | null>(
        null
      );

    const [
      channelLoading,
      setChannelLoading,
    ] = useState(false);

    const [
      copied,
      setCopied,
    ] = useState(false);

    const searchAbortRef =
      useRef<AbortController | null>(
        null
      );

    const searchInputRef =
      useRef<HTMLInputElement | null>(
        null
      );

    /* =======================================================
       PERSIST LOCAL DATA
    ======================================================= */

    useEffect(() => {
      writeStorage(
        STORAGE_KEYS.history,
        history
      );
    }, [history]);

    useEffect(() => {
      writeStorage(
        STORAGE_KEYS.watchLater,
        watchLater
      );
    }, [watchLater]);

    useEffect(() => {
      writeStorage(
        STORAGE_KEYS.liked,
        liked
      );
    }, [liked]);

    useEffect(() => {
      writeStorage(
        STORAGE_KEYS.searches,
        searchHistory
      );
    }, [searchHistory]);

    /* =======================================================
       SEARCH
    ======================================================= */

    const performSearch =
      useCallback(
        async (
          searchTerm: string,
          pageToken?: string,
          append = false
        ) => {
          const cleanQuery =
            searchTerm.trim();

          if (!cleanQuery) {
            return;
          }

          searchAbortRef.current?.abort();

          const controller =
            new AbortController();

          searchAbortRef.current =
            controller;

          setIsLoading(true);
          setError(null);
          setActiveView("search");

          if (!append) {
            setVideos([]);
          }

          try {
            const params =
              buildSearchParams(
                cleanQuery,
                {
                  sort,
                  duration,
                  hdOnly,
                },
                pageToken
              );

            const payload =
              await apiRequest(
                `/search?${params}`,
                undefined,
                controller.signal
              );

            const rawItems =
              Array.isArray(
                payload.items
              )
                ? payload.items
                : [];

            const normalized =
              normalizeItems(
                rawItems
              );

            /*
             * If backend returns data but
             * frontend cannot normalize it,
             * show a useful diagnostic instead
             * of crashing.
             */
            if (
              rawItems.length > 0 &&
              normalized.length === 0
            ) {
              throw new Error(
                "YouTube returned videos, but the response format could not be read by the app."
              );
            }

            setVideos(
              (current) =>
                append
                  ? dedupeVideos([
                      ...current,
                      ...normalized,
                    ])
                  : normalized
            );

            setNextPageToken(
              payload.nextPageToken
            );

            setPreviousPageToken(
              payload.prevPageToken
            );

            setSubmittedQuery(
              cleanQuery
            );

            if (!pageToken) {
              setSearchHistory(
                (current) => {
                  const next = [
                    cleanQuery,
                    ...current.filter(
                      (item) =>
                        item.toLowerCase() !==
                        cleanQuery.toLowerCase()
                    ),
                  ];

                  return next.slice(
                    0,
                    10
                  );
                }
              );
            }
          } catch (
            searchError
          ) {
            if (
              searchError instanceof
                DOMException &&
              searchError.name ===
                "AbortError"
            ) {
              return;
            }

            setError(
              searchError instanceof
                Error
                ? searchError.message
                : "Unable to search YouTube."
            );
          } finally {
            if (
              !controller.signal
                .aborted
            ) {
              setIsLoading(
                false
              );
            }
          }
        },
        [
          duration,
          hdOnly,
          sort,
        ]
      );

    /* =======================================================
       TRENDING
    ======================================================= */

    const loadTrending =
      useCallback(
        async (
          view: ViewMode = "trending"
        ) => {
          setActiveView(
            view
          );

          setIsLoading(
            true
          );

          setError(null);

          try {
            const payload =
              await apiRequest(
                "/trending?maxResults=24&regionCode=IN"
              );

            const rawItems =
              Array.isArray(
                payload.items
              )
                ? payload.items
                : [];

            const normalized =
              normalizeItems(
                rawItems
              );

            if (
              rawItems.length > 0 &&
              normalized.length === 0
            ) {
              throw new Error(
                "YouTube returned trending videos, but the response format could not be read by the app."
              );
            }

            setVideos(
              normalized
            );

            setNextPageToken(
              payload.nextPageToken
            );

            setPreviousPageToken(
              undefined
            );
          } catch (
            loadError
          ) {
            setError(
              loadError instanceof
                Error
                ? loadError.message
                : "Unable to load trending videos."
            );
          } finally {
            setIsLoading(
              false
            );
          }
        },
        []
      );

    /* =======================================================
       HOME
    ======================================================= */

    const loadHome =
      useCallback(
        async () => {
          await loadTrending(
            "home"
          );
        },
        [loadTrending]
      );

    /* =======================================================
       INITIAL LOAD
    ======================================================= */

    useEffect(() => {
      void loadHome();
    }, [loadHome]);

    /* =======================================================
       OPEN VIDEO
    ======================================================= */

    const openVideo =
      useCallback(
        async (
          video: NormalizedVideo
        ) => {
          if (!video?.id) {
            return;
          }

          setSelectedVideo(
            video
          );

          setHistory(
            (current) => {
              const filtered =
                current.filter(
                  (item) =>
                    item.id !==
                    video.id
                );

              return [
                video,
                ...filtered,
              ].slice(0, 100);
            }
          );

          setChannel(null);
          setChannelLoading(
            true
          );

          /*
           * Channel data is supplemental.
           * If the backend doesn't implement
           * /channel yet, it will silently fail.
           */
          try {
            const payload =
              await apiRequest(
                `/channel?id=${encodeURIComponent(
                  video.channelId
                )}`
              );

            const items =
              Array.isArray(
                payload.items
              )
                ? payload.items
                : [];

            if (
              items.length > 0
            ) {
              setChannel(
                items[0] as YouTubeChannelItem
              );
            }
          } catch {
            // Channel details are optional.
          } finally {
            setChannelLoading(
              false
            );
          }
        },
        []
      );

    /* =======================================================
       WATCH LATER
    ======================================================= */

    const toggleWatchLater =
      useCallback(
        (
          video: NormalizedVideo
        ) => {
          setWatchLater(
            (current) => {
              const exists =
                current.some(
                  (item) =>
                    item.id ===
                    video.id
                );

              if (exists) {
                return current.filter(
                  (item) =>
                    item.id !==
                    video.id
                );
              }

              return [
                video,
                ...current,
              ];
            }
          );
        },
        []
      );

    /* =======================================================
       LIKE
    ======================================================= */

    const toggleLiked =
      useCallback(
        (
          video: NormalizedVideo
        ) => {
          setLiked(
            (current) => {
              const exists =
                current.some(
                  (item) =>
                    item.id ===
                    video.id
                );

              if (exists) {
                return current.filter(
                  (item) =>
                    item.id !==
                    video.id
                );
              }

              return [
                video,
                ...current,
              ];
            }
          );
        },
        []
      );

    /* =======================================================
       NAVIGATION
    ======================================================= */

    const navigate =
      useCallback(
        async (
          view: ViewMode
        ) => {
          setSelectedVideo(
            null
          );

          setChannel(null);

          setError(null);

          if (
            view === "home"
          ) {
            await loadHome();
            return;
          }

          if (
            view === "trending"
          ) {
            await loadTrending(
              "trending"
            );
            return;
          }

          setActiveView(
            view
          );

          setNextPageToken(
            undefined
          );

          setPreviousPageToken(
            undefined
          );

          if (
            view === "history"
          ) {
            setVideos(
              history
            );
            return;
          }

          if (
            view ===
            "watch-later"
          ) {
            setVideos(
              watchLater
            );
            return;
          }

          if (
            view === "liked"
          ) {
            setVideos(
              liked
            );
          }
        },
        [
          history,
          liked,
          loadHome,
          loadTrending,
          watchLater,
        ]
      );

    /* =======================================================
       SIDEBAR SEARCH EVENT
    ======================================================= */

    useEffect(() => {
      const handler =
        (event: Event) => {
          const customEvent =
            event as CustomEvent<{
              query?: string;
            }>;

          const value =
            customEvent.detail
              ?.query
              ?.trim() || "";

          if (!value) {
            return;
          }

          setQuery(
            value
          );

          void performSearch(
            value
          );
        };

      window.addEventListener(
        "abhishek:youtube-search",
        handler
      );

      return () => {
        window.removeEventListener(
          "abhishek:youtube-search",
          handler
        );
      };
    }, [performSearch]);

    /* =======================================================
       KEYBOARD
    ======================================================= */

    useEffect(() => {
      const handler =
        (
          event: KeyboardEvent
        ) => {
          const target =
            event.target as HTMLElement | null;

          if (
            target?.matches(
              "input, textarea, select, button, [contenteditable='true']"
            )
          ) {
            return;
          }

          if (
            (event.ctrlKey ||
              event.metaKey) &&
            event.key === "k"
          ) {
            event.preventDefault();

            searchInputRef.current?.focus();
          }

          if (
            event.key === "/"
          ) {
            event.preventDefault();

            searchInputRef.current?.focus();
          }

          if (
            event.key === "Escape"
          ) {
            setShowSearchHistory(
              false
            );

            setShowFilters(
              false
            );
          }
        };

      window.addEventListener(
        "keydown",
        handler
      );

      return () => {
        window.removeEventListener(
          "keydown",
          handler
        );
      };
    }, []);

    /* =======================================================
       SEARCH SUBMIT
    ======================================================= */

    const submitSearch =
      (
        event?: React.FormEvent
      ) => {
        event?.preventDefault();

        if (
          !query.trim()
        ) {
          return;
        }

        setShowSearchHistory(
          false
        );

        void performSearch(
          query
        );
      };

    /* =======================================================
       SHARE
    ======================================================= */

    const shareVideo =
      async () => {
        if (
          !selectedVideo
        ) {
          return;
        }

        const url =
          `https://www.youtube.com/watch?v=${selectedVideo.id}`;

        try {
          if (
            navigator.share
          ) {
            await navigator.share(
              {
                title:
                  selectedVideo.title,
                url,
              }
            );

            return;
          }

          await navigator.clipboard.writeText(
            url
          );

          setCopied(
            true
          );

          window.setTimeout(
            () => {
              setCopied(
                false
              );
            },
            1800
          );
        } catch {
          // User cancelled sharing.
        }
      };

    /* =======================================================
       DISPLAY VIDEOS
    ======================================================= */

    const displayVideos =
      useMemo(() => {
        if (
          activeView ===
          "history"
        ) {
          return history;
        }

        if (
          activeView ===
          "watch-later"
        ) {
          return watchLater;
        }

        if (
          activeView ===
          "liked"
        ) {
          return liked;
        }

        return videos;
      }, [
        activeView,
        history,
        liked,
        videos,
        watchLater,
      ]);

    /* =======================================================
       TITLE
    ======================================================= */

    const activeTitle =
      useMemo(() => {
        if (
          activeView ===
          "home"
        ) {
          return "Home";
        }

        if (
          activeView ===
          "trending"
        ) {
          return "Trending";
        }

        if (
          activeView ===
          "search"
        ) {
          return submittedQuery
            ? `Results for "${submittedQuery}"`
            : "Search results";
        }

        if (
          activeView ===
          "history"
        ) {
          return "Watch history";
        }

        if (
          activeView ===
          "watch-later"
        ) {
          return "Watch later";
        }

        return "Liked videos";
      }, [
        activeView,
        submittedQuery,
      ]);

    const isSelectedLiked =
      selectedVideo
        ? liked.some(
            (video) =>
              video.id ===
              selectedVideo.id
          )
        : false;

    const isSelectedSaved =
      selectedVideo
        ? watchLater.some(
            (video) =>
              video.id ===
              selectedVideo.id
          )
        : false;

    /* =======================================================
       RETRY
    ======================================================= */

    const retry =
      () => {
        if (
          activeView ===
          "trending"
        ) {
          void loadTrending(
            "trending"
          );

          return;
        }

        if (
          activeView ===
          "home"
        ) {
          void loadHome();

          return;
        }

        if (
          submittedQuery
        ) {
          void performSearch(
            submittedQuery
          );
        }
      };

    /* =======================================================
       RENDER
    ======================================================= */

    return (
      <div className="relative flex h-full min-h-0 w-full overflow-hidden bg-[#08090b] text-white">
        {/* =================================================
            MOBILE SIDEBAR
        ================================================= */}

        {showMobileSidebar && (
          <div className="absolute inset-0 z-[100] flex lg:hidden">
            <button
              type="button"
              onClick={() =>
                setShowMobileSidebar(
                  false
                )
              }
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              aria-label="Close sidebar"
            />

            <div className="relative z-10">
              <Sidebar
                activeView={
                  activeView
                }
                onNavigate={
                  navigate
                }
                mobile
                onClose={() =>
                  setShowMobileSidebar(
                    false
                  )
                }
              />
            </div>
          </div>
        )}

        {/* =================================================
            DESKTOP SIDEBAR
        ================================================= */}

        <Sidebar
          activeView={
            activeView
          }
          onNavigate={
            navigate
          }
        />

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="flex min-w-0 flex-1 flex-col">
          {/* =================================================
              TOP BAR
          ================================================= */}

          <header className="relative z-50 flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.07] bg-[#0b0d10]/95 px-3 backdrop-blur-xl sm:px-5">
            <button
              type="button"
              onClick={() =>
                setShowMobileSidebar(
                  true
                )
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* BRAND */}

            <button
              type="button"
              onClick={() =>
                void navigate(
                  "home"
                )
              }
              className="hidden items-center gap-2 sm:flex"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500 shadow-lg shadow-red-500/20">
                <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
              </div>

              <span className="font-bold tracking-tight">
                YouTube
              </span>
            </button>

            {/* SEARCH */}

            <div className="relative mx-auto flex min-w-0 max-w-2xl flex-1">
              <form
                onSubmit={
                  submitSearch
                }
                className="flex w-full"
              >
                <div className="relative flex min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <input
                    ref={
                      searchInputRef
                    }
                    value={query}
                    onChange={(
                      event
                    ) =>
                      setQuery(
                        event.target
                          .value
                      )
                    }
                    onFocus={() =>
                      setShowSearchHistory(
                        searchHistory.length >
                          0
                      )
                    }
                    placeholder="Search YouTube"
                    className="h-10 w-full rounded-l-full border border-white/10 bg-[#181a1d] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-white/20 focus:bg-[#1d1f22]"
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(
                          ""
                        );

                        setShowSearchHistory(
                          false
                        );
                      }}
                      className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-white/10 hover:text-white"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="flex h-10 w-14 shrink-0 items-center justify-center rounded-r-full border border-l-0 border-white/10 bg-[#222427] text-slate-200 transition hover:bg-[#292c30]"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>

              {/* SEARCH HISTORY */}

              {showSearchHistory &&
                searchHistory.length >
                  0 && (
                  <div className="absolute left-0 right-14 top-12 overflow-hidden rounded-2xl border border-white/10 bg-[#17191c] p-2 shadow-2xl shadow-black/60">
                    {searchHistory.map(
                      (
                        item
                      ) => (
                        <button
                          key={item}
                          type="button"
                          onMouseDown={(
                            event
                          ) =>
                            event.preventDefault()
                          }
                          onClick={() => {
                            setQuery(
                              item
                            );

                            setShowSearchHistory(
                              false
                            );

                            void performSearch(
                              item
                            );
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                        >
                          <History className="h-4 w-4 text-slate-500" />

                          <span className="truncate">
                            {item}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                )}
            </div>

            {/* ACTIONS */}

            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (current) =>
                      !current
                  )
                }
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  showFilters
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
                title="Search filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
                title="Settings"
              >
                <Settings2 className="h-4 w-4" />
              </button>

              <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-[10px] font-bold text-white shadow-lg">
                AK
              </div>
            </div>
          </header>

          {/* =================================================
              CATEGORY BAR
          ================================================= */}

          <div className="relative z-40 flex shrink-0 items-center gap-2 overflow-x-auto border-b border-white/[0.05] bg-[#0b0d10] px-3 py-2 scrollbar-none sm:px-5">
            {CATEGORIES.map(
              (category) => {
                const Icon =
                  category.icon;

                const active =
                  category.label ===
                    "All" &&
                  activeView ===
                    "home";

                return (
                  <button
                    key={
                      category.label
                    }
                    type="button"
                    onClick={() => {
                      if (
                        category.label ===
                        "All"
                      ) {
                        void navigate(
                          "home"
                        );

                        return;
                      }

                      setQuery(
                        category.query
                      );

                      void performSearch(
                        category.query
                      );
                    }}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "bg-white text-black"
                        : "bg-white/[0.07] text-slate-300 hover:bg-white/[0.12] hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />

                    {category.label}
                  </button>
                );
              }
            )}
          </div>

          {/* =================================================
              FILTER PANEL
          ================================================= */}

          {showFilters && (
            <div className="relative z-30 flex shrink-0 flex-wrap items-center gap-3 border-b border-white/[0.06] bg-[#111316] px-4 py-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-slate-500" />

                <select
                  value={
                    sort
                  }
                  onChange={(
                    event
                  ) => {
                    const value =
                      event.target
                        .value as SortOrder;

                    setSort(
                      value
                    );

                    if (
                      submittedQuery
                    ) {
                      window.setTimeout(
                        () => {
                          void performSearch(
                            submittedQuery
                          );
                        },
                        0
                      );
                    }
                  }}
                  className="rounded-lg border border-white/10 bg-[#1b1d20] px-3 py-2 text-xs text-slate-300 outline-none"
                >
                  {SORT_OPTIONS.map(
                    (
                      option
                    ) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <select
                value={
                  duration
                }
                onChange={(
                  event
                ) => {
                  const value =
                    event.target
                      .value as DurationFilter;

                  setDuration(
                    value
                  );

                  if (
                    submittedQuery
                  ) {
                    window.setTimeout(
                      () => {
                        void performSearch(
                          submittedQuery
                        );
                      },
                      0
                    );
                  }
                }}
                className="rounded-lg border border-white/10 bg-[#1b1d20] px-3 py-2 text-xs text-slate-300 outline-none"
              >
                {DURATION_OPTIONS.map(
                  (
                    option
                  ) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </option>
                  )
                )}
              </select>

              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[#1b1d20] px-3 py-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={
                    hdOnly
                  }
                  onChange={(
                    event
                  ) => {
                    const checked =
                      event.target
                        .checked;

                    setHdOnly(
                      checked
                    );

                    if (
                      submittedQuery
                    ) {
                      window.setTimeout(
                        () => {
                          void performSearch(
                            submittedQuery
                          );
                        },
                        0
                      );
                    }
                  }}
                  className="accent-cyan-400"
                />

                HD only
              </label>
            </div>
          )}

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {/* =================================================
                VIDEO DETAIL
            ================================================= */}

            {selectedVideo ? (
              <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedVideo(
                      null
                    )
                  }
                  className="mb-4 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />

                  Back to results
                </button>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="min-w-0">
                    <Player
                      video={
                        selectedVideo
                      }
                    />

                    <div className="mt-4">
                      <h1 className="text-xl font-bold leading-7 text-white sm:text-2xl">
                        {
                          selectedVideo.title
                        }
                      </h1>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30">
                            <UserRound className="h-5 w-5 text-cyan-200" />
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-white">
                              {
                                selectedVideo.channelTitle
                              }
                            </div>

                            {channel
                              ?.statistics
                              ?.subscriberCount && (
                              <div className="text-xs text-slate-500">
                                {formatSubscribers(
                                  channel
                                    .statistics
                                    .subscriberCount
                                )}
                              </div>
                            )}

                            {channelLoading && (
                              <div className="flex items-center gap-1 text-[10px] text-slate-600">
                                <Loader2 className="h-3 w-3 animate-spin" />

                                Loading channel
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-slate-200"
                          >
                            Subscribe
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              toggleLiked(
                                selectedVideo
                              )
                            }
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                              isSelectedLiked
                                ? "bg-white text-black"
                                : "bg-white/[0.08] text-white hover:bg-white/[0.13]"
                            }`}
                          >
                            {isSelectedLiked ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <ThumbsUp className="h-4 w-4" />
                            )}

                            {isSelectedLiked
                              ? "Liked"
                              : "Like"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleWatchLater(
                                selectedVideo
                              )
                            }
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                              isSelectedSaved
                                ? "bg-cyan-400/15 text-cyan-200"
                                : "bg-white/[0.08] text-white hover:bg-white/[0.13]"
                            }`}
                          >
                            <Clock3 className="h-4 w-4" />

                            {isSelectedSaved
                              ? "Saved"
                              : "Watch later"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void shareVideo()
                            }
                            className="flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.13]"
                          >
                            {copied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Share2 className="h-4 w-4" />
                            )}

                            {copied
                              ? "Copied"
                              : "Share"}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl bg-white/[0.055] p-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
                          {selectedVideo.views && (
                            <span>
                              {formatViews(
                                selectedVideo.views
                              )}
                            </span>
                          )}

                          {selectedVideo.publishedAt && (
                            <>
                              <span>
                                •
                              </span>

                              <span>
                                {formatDate(
                                  selectedVideo.publishedAt
                                )}
                              </span>
                            </>
                          )}

                          {selectedVideo.definition && (
                            <>
                              <span>
                                •
                              </span>

                              <span className="rounded bg-white/10 px-1.5 py-0.5 uppercase">
                                {
                                  selectedVideo.definition
                                }
                              </span>
                            </>
                          )}

                          {selectedVideo.caption ===
                            "true" && (
                            <>
                              <span>
                                •
                              </span>

                              <span className="rounded bg-white/10 px-1.5 py-0.5">
                                CC
                              </span>
                            </>
                          )}
                        </div>

                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-400">
                          {selectedVideo.description ||
                            "No description available."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RELATED */}

                  <aside className="min-w-0">
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-sm font-bold text-white">
                        Related videos
                      </h2>

                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                        YouTube
                      </span>
                    </div>

                    <div className="space-y-4">
                      {videos
                        .filter(
                          (item) =>
                            item.id !==
                            selectedVideo.id
                        )
                        .slice(
                          0,
                          10
                        )
                        .map(
                          (
                            video
                          ) => (
                            <VideoCard
                              key={
                                video.id
                              }
                              video={
                                video
                              }
                              compact
                              onOpen={
                                openVideo
                              }
                              onWatchLater={
                                toggleWatchLater
                              }
                              isSaved={watchLater.some(
                                (
                                  item
                                ) =>
                                  item.id ===
                                  video.id
                              )}
                            />
                          )
                        )}
                    </div>
                  </aside>
                </div>
              </div>
            ) : (
              /* =================================================
                 VIDEO GRID
              ================================================= */

              <div className="mx-auto w-full max-w-[1700px] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400/70">
                      YouTube
                    </div>

                    <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                      {activeTitle}
                    </h1>

                    {activeView ===
                      "search" &&
                      submittedQuery && (
                        <p className="mt-1 text-xs text-slate-500">
                          Live results from YouTube
                        </p>
                      )}
                  </div>

                  {(nextPageToken ||
                    previousPageToken) && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={
                          !previousPageToken
                        }
                        onClick={() => {
                          if (
                            submittedQuery &&
                            previousPageToken
                          ) {
                            void performSearch(
                              submittedQuery,
                              previousPageToken
                            );
                          }
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        title="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        disabled={
                          !nextPageToken
                        }
                        onClick={() => {
                          if (
                            submittedQuery &&
                            nextPageToken
                          ) {
                            void performSearch(
                              submittedQuery,
                              nextPageToken
                            );
                          }
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        title="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-400/10 bg-red-400/[0.06] p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-red-200">
                        YouTube request failed
                      </div>

                      <p className="mt-1 text-xs leading-5 text-red-300/70">
                        {error}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        retry
                      }
                      className="flex shrink-0 items-center gap-2 rounded-lg bg-white/[0.08] px-3 py-2 text-xs font-semibold text-white hover:bg-white/[0.13]"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />

                      Retry
                    </button>
                  </div>
                )}

                {/* =================================================
                    EMPTY
                ================================================= */}

                {!isLoading &&
                  !error &&
                  displayVideos.length ===
                    0 && (
                    <div className="flex min-h-[420px] items-center justify-center">
                      <div className="max-w-sm text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                          {activeView ===
                          "history" ? (
                            <History className="h-7 w-7 text-slate-500" />
                          ) : activeView ===
                            "watch-later" ? (
                            <Clock3 className="h-7 w-7 text-slate-500" />
                          ) : (
                            <Search className="h-7 w-7 text-slate-500" />
                          )}
                        </div>

                        <h2 className="mt-5 text-lg font-bold text-white">
                          Nothing here yet
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Search YouTube or start watching videos to build your library.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            searchInputRef.current?.focus()
                          }
                          className="mt-5 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-black transition hover:bg-slate-200"
                        >
                          Search YouTube
                        </button>
                      </div>
                    </div>
                  )}

                {/* =================================================
                    LOADING
                ================================================= */}

                {isLoading && (
                  <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {Array.from({
                      length: 12,
                    }).map(
                      (
                        _,
                        index
                      ) => (
                        <VideoSkeleton
                          key={
                            index
                          }
                        />
                      )
                    )}
                  </div>
                )}

                {/* =================================================
                    GRID
                ================================================= */}

                {!isLoading &&
                  !error &&
                  displayVideos.length >
                    0 && (
                    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                      {displayVideos.map(
                        (
                          video
                        ) => (
                          <VideoCard
                            key={
                              video.id
                            }
                            video={
                              video
                            }
                            onOpen={
                              openVideo
                            }
                            onWatchLater={
                              toggleWatchLater
                            }
                            isSaved={watchLater.some(
                              (
                                item
                              ) =>
                                item.id ===
                                video.id
                            )}
                          />
                        )
                      )}
                    </div>
                  )}

                {/* =================================================
                    LOAD MORE
                ================================================= */}

                {!isLoading &&
                  !error &&
                  nextPageToken &&
                  submittedQuery && (
                    <div className="flex justify-center py-10">
                      <button
                        type="button"
                        onClick={() =>
                          void performSearch(
                            submittedQuery,
                            nextPageToken,
                            true
                          )
                        }
                        className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-slate-200"
                      >
                        Load more

                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="flex h-7 shrink-0 items-center justify-between border-t border-white/[0.05] bg-[#090b0d] px-3 text-[9px] text-slate-600 sm:px-5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />

              Live YouTube data
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <span>
                Ctrl + K search
              </span>

              <span>
                •
              </span>

              <span>
                / focus search
              </span>

              <span>
                •
              </span>

              <span>
                {
                  displayVideos.length
                }{" "}
                videos
              </span>
            </div>
          </footer>
        </main>
      </div>
    );
  };

export default YouTubeApp;