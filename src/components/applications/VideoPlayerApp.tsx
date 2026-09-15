import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  ChevronRight,
  ListVideo,
  Loader2,
  Maximize,
  Minimize,
  MoreHorizontal,
  Pause,
  PictureInPicture2,
  Play,
  RefreshCw,
  RotateCcw,
  SkipBack,
  SkipForward,
  Video,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type DemoVideo = {
  id: string;
  title: string;
  url: string;
  type: string;
  description: string;
};

/* =========================================================
   DEMO VIDEOS
   These are direct MP4 URLs and do NOT depend on your VFS.
========================================================= */

const DEMO_VIDEOS: DemoVideo[] = [
  {
    id: "flower",
    title: "Flower — Demo Video",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    type: "MP4",
    description: "Browser-compatible demonstration video",
  },
  {
    id: "big-buck-bunny",
    title: "Big Buck Bunny — Demo",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "MP4",
    description: "Big Buck Bunny sample video",
  },
  {
    id: "for-bigger-blazes",
    title: "For Bigger Blazes",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    type: "MP4",
    description: "Google video sample",
  },
  {
    id: "for-bigger-escapes",
    title: "For Bigger Escapes",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    type: "MP4",
    description: "Google video sample",
  },
];

/* =========================================================
   CONSTANTS
========================================================= */

const DEFAULT_VOLUME = 0.8;

/* =========================================================
   HELPERS
========================================================= */

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const totalSeconds = Math.floor(seconds);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(
    secs
  ).padStart(2, "0")}`;
}

/* =========================================================
   COMPONENT
========================================================= */

type VideoPlayerAppProps = {
  onClose?: () => void;
};

const VideoPlayerApp: React.FC<VideoPlayerAppProps> = ({
  onClose,
}) => {
  /* =======================================================
     REFS
  ======================================================= */

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const playerRef = useRef<HTMLDivElement | null>(null);

  /* =======================================================
     STATE
  ======================================================= */

  const [currentIndex, setCurrentIndex] = useState(0);

  const [currentVideo, setCurrentVideo] = useState<DemoVideo>(
    DEMO_VIDEOS[0]
  );

  const [isPlaying, setIsPlaying] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [isMuted, setIsMuted] = useState(false);

  const [volume, setVolume] =
    useState(DEFAULT_VOLUME);

  const [previousVolume, setPreviousVolume] =
    useState(DEFAULT_VOLUME);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [speed, setSpeed] =
    useState(1);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [showPlaylist, setShowPlaylist] =
    useState(true);

  const [showMoreMenu, setShowMoreMenu] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     LOAD CURRENT VIDEO
  ======================================================= */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    video.pause();

    video.src = currentVideo.url;

    video.load();
  }, [currentVideo]);

  /* =======================================================
     PLAY
  ======================================================= */

  const playVideo = useCallback(async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    try {
      setError(null);

      await video.play();

      setIsPlaying(true);
    } catch (err) {
      console.error("Play failed:", err);

      setIsPlaying(false);

      setError(
        "The browser could not start this video. Click Try Again or Play once more."
      );
    }
  }, []);

  /* =======================================================
     PAUSE
  ======================================================= */

  const pauseVideo = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.pause();

    setIsPlaying(false);
  }, []);

  /* =======================================================
     TOGGLE PLAY
  ======================================================= */

  const togglePlay = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      void playVideo();
    } else {
      pauseVideo();
    }
  }, [playVideo, pauseVideo]);

  /* =======================================================
     SELECT VIDEO
  ======================================================= */

  const selectVideo = useCallback(
    (index: number) => {
      const selected = DEMO_VIDEOS[index];

      if (!selected) {
        return;
      }

      setCurrentIndex(index);
      setCurrentVideo(selected);

      setShowPlaylist(false);
      setShowMoreMenu(false);
    },
    []
  );

  /* =======================================================
     NEXT VIDEO
  ======================================================= */

  const nextVideo = useCallback(() => {
    const nextIndex =
      currentIndex + 1 >= DEMO_VIDEOS.length
        ? 0
        : currentIndex + 1;

    selectVideo(nextIndex);
  }, [currentIndex, selectVideo]);

  /* =======================================================
     PREVIOUS VIDEO
  ======================================================= */

  const previousVideo = useCallback(() => {
    const previousIndex =
      currentIndex - 1 < 0
        ? DEMO_VIDEOS.length - 1
        : currentIndex - 1;

    selectVideo(previousIndex);
  }, [currentIndex, selectVideo]);

  /* =======================================================
     SEEK
  ======================================================= */

  const seekRelative = useCallback(
    (amount: number) => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      const maxDuration =
        Number.isFinite(video.duration)
          ? video.duration
          : duration;

      const nextTime = Math.max(
        0,
        Math.min(
          maxDuration || 0,
          video.currentTime + amount
        )
      );

      video.currentTime = nextTime;

      setCurrentTime(nextTime);
    },
    [duration]
  );

  /* =======================================================
     RESTART
  ======================================================= */

  const restartVideo = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = 0;

    setCurrentTime(0);

    void playVideo();
  }, [playVideo]);

  /* =======================================================
     VOLUME
  ======================================================= */

  const handleVolumeChange = useCallback(
    (value: number) => {
      const safeValue = Math.max(
        0,
        Math.min(1, value)
      );

      const video = videoRef.current;

      setVolume(safeValue);

      if (safeValue === 0) {
        setIsMuted(true);

        if (video) {
          video.muted = true;
          video.volume = 0;
        }

        return;
      }

      setPreviousVolume(safeValue);

      setIsMuted(false);

      if (video) {
        video.muted = false;
        video.volume = safeValue;
      }
    },
    []
  );

  /* =======================================================
     MUTE
  ======================================================= */

  const toggleMute = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.muted || isMuted) {
      const restoreVolume =
        previousVolume > 0
          ? previousVolume
          : DEFAULT_VOLUME;

      video.muted = false;
      video.volume = restoreVolume;

      setVolume(restoreVolume);
      setIsMuted(false);

      return;
    }

    setPreviousVolume(
      video.volume > 0
        ? video.volume
        : DEFAULT_VOLUME
    );

    video.muted = true;

    setIsMuted(true);
  }, [isMuted, previousVolume]);

  /* =======================================================
     SPEED
  ======================================================= */

  const handleSpeedChange = useCallback(
    (value: number) => {
      const video = videoRef.current;

      setSpeed(value);

      if (video) {
        video.playbackRate = value;
      }
    },
    []
  );

  /* =======================================================
     FULLSCREEN
  ======================================================= */

  const toggleFullscreen = useCallback(
    async () => {
      const container = playerRef.current;

      if (!container) {
        return;
      }

      try {
        if (!document.fullscreenElement) {
          await container.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (err) {
        console.error(
          "Fullscreen error:",
          err
        );
      }
    },
    []
  );

  /* =======================================================
     PICTURE IN PICTURE
  ======================================================= */

  const togglePictureInPicture =
    useCallback(async () => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          return;
        }

        if (
          document.pictureInPictureEnabled &&
          "requestPictureInPicture" in video
        ) {
          await (
            video as HTMLVideoElement & {
              requestPictureInPicture: () => Promise<unknown>;
            }
          ).requestPictureInPicture();
        }
      } catch (err) {
        console.error(
          "Picture-in-Picture error:",
          err
        );
      }
    }, []);

  /* =======================================================
     RETRY
  ======================================================= */

  const retryVideo = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setError(null);
    setIsLoading(true);

    video.load();

    setTimeout(() => {
      void video.play().catch(() => {
        // User can press play manually if autoplay is blocked.
      });
    }, 150);
  }, []);

  /* =======================================================
     FULLSCREEN EVENT
  ======================================================= */

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(document.fullscreenElement)
      );
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  /* =======================================================
     VIDEO METADATA
  ======================================================= */

  const handleLoadedMetadata =
    useCallback(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      const videoDuration =
        Number.isFinite(video.duration)
          ? video.duration
          : 0;

      setDuration(videoDuration);

      video.volume = volume;
      video.muted = isMuted;
      video.playbackRate = speed;

      setIsLoading(false);
    }, [isMuted, speed, volume]);

  /* =======================================================
     TIME UPDATE
  ======================================================= */

  const handleTimeUpdate =
    useCallback(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      setCurrentTime(video.currentTime);
    }, []);

  /* =======================================================
     PLAY EVENT
  ======================================================= */

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setIsLoading(false);
  }, []);

  /* =======================================================
     PAUSE EVENT
  ======================================================= */

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  /* =======================================================
     WAITING
  ======================================================= */

  const handleWaiting = useCallback(() => {
    setIsLoading(true);
  }, []);

  /* =======================================================
     PLAYING
  ======================================================= */

  const handlePlaying = useCallback(() => {
    setIsLoading(false);
    setIsPlaying(true);
  }, []);

  /* =======================================================
     ENDED
  ======================================================= */

  const handleEnded = useCallback(() => {
    setIsPlaying(false);

    if (DEMO_VIDEOS.length > 1) {
      nextVideo();
    }
  }, [nextVideo]);

  /* =======================================================
     ERROR
  ======================================================= */

  const handleVideoError = useCallback(() => {
    const video = videoRef.current;

    setIsLoading(false);
    setIsPlaying(false);

    let message =
      "Unable to load this demo video.";

    if (video?.error) {
      switch (video.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          message =
            "Video loading was aborted.";
          break;

        case MediaError.MEDIA_ERR_NETWORK:
          message =
            "A network error occurred while loading the video.";
          break;

        case MediaError.MEDIA_ERR_DECODE:
          message =
            "Your browser could not decode this video.";
          break;

        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          message =
            "This video source is not supported by the browser.";
          break;

        default:
          message =
            "The video could not be loaded.";
      }
    }

    setError(message);
  }, []);

  /* =======================================================
     KEYBOARD SHORTCUTS
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      const target =
        event.target as HTMLElement | null;

      if (
        target?.closest(
          "input, textarea, select, button, a, [contenteditable='true']"
        )
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case " ":
        case "k":
          event.preventDefault();
          togglePlay();
          break;

        case "arrowleft":
          event.preventDefault();
          seekRelative(-5);
          break;

        case "arrowright":
          event.preventDefault();
          seekRelative(5);
          break;

        case "arrowup":
          event.preventDefault();

          handleVolumeChange(
            Math.min(
              1,
              volume + 0.05
            )
          );

          break;

        case "arrowdown":
          event.preventDefault();

          handleVolumeChange(
            Math.max(
              0,
              volume - 0.05
            )
          );

          break;

        case "m":
          event.preventDefault();
          toggleMute();
          break;

        case "f":
          event.preventDefault();
          void toggleFullscreen();
          break;

        case "r":
          event.preventDefault();
          restartVideo();
          break;

        case "n":
          event.preventDefault();
          nextVideo();
          break;

        case "p":
          event.preventDefault();
          previousVideo();
          break;

        case "escape":
          setShowMoreMenu(false);
          break;

        default:
          break;
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    handleVolumeChange,
    nextVideo,
    previousVideo,
    restartVideo,
    seekRelative,
    toggleFullscreen,
    toggleMute,
    togglePlay,
    volume,
  ]);

  /* =======================================================
     PROGRESS
  ======================================================= */

  const progress =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  /* =======================================================
     PLAYLIST
  ======================================================= */

  const renderPlaylist = () => {
    return (
      <div className="space-y-2 p-3">
        {DEMO_VIDEOS.map(
          (video, index) => {
            const active =
              index === currentIndex;

            return (
              <button
                key={video.id}
                type="button"
                aria-current={
                  active
                    ? "true"
                    : undefined
                }
                onClick={() =>
                  selectVideo(index)
                }
                className={[
                  "group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200",
                  active
                    ? "border-pink-500/40 bg-pink-500/10 shadow-[0_0_25px_rgba(236,72,153,0.10)]"
                    : "border-transparent bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    active
                      ? "bg-pink-500/20 text-pink-400"
                      : "bg-slate-800 text-slate-500",
                  ].join(" ")}
                >
                  <Video className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={[
                      "truncate text-sm font-semibold",
                      active
                        ? "text-pink-300"
                        : "text-slate-300",
                    ].join(" ")}
                  >
                    {video.title}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-slate-600">
                    {video.type} •{" "}
                    {video.description}
                  </p>
                </div>

                <ChevronRight
                  className={[
                    "h-4 w-4 shrink-0 transition-transform",
                    active
                      ? "translate-x-0.5 text-pink-400"
                      : "text-slate-600 group-hover:translate-x-0.5",
                  ].join(" ")}
                />
              </button>
            );
          }
        )}
      </div>
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      ref={playerRef}
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#080b0f] text-white"
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-slate-800 bg-[#10151c] px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-500 text-white shadow-lg shadow-pink-500/20">
            <Video className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-500">
              Media Player
            </p>

            <h1 className="truncate text-sm font-semibold text-slate-200">
              {currentVideo.title}
            </h1>
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          {/* Playlist */}

          <button
            type="button"
            onClick={() =>
              setShowPlaylist(
                (value) => !value
              )
            }
            className="flex items-center gap-2 rounded-xl bg-sky-500/15 px-3 py-2 text-xs font-medium text-sky-400 transition hover:bg-sky-500/25"
          >
            <ListVideo className="h-4 w-4" />

            <span className="hidden sm:inline">
              Playlist
            </span>
          </button>

          {/* More */}

          <button
            type="button"
            aria-label="More options"
            onClick={() =>
              setShowMoreMenu(
                (value) => !value
              )
            }
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {/* More menu */}

          {showMoreMenu && (
            <div className="absolute right-0 top-12 z-[100] w-56 overflow-hidden rounded-2xl border border-slate-700 bg-[#151b23] p-1.5 shadow-2xl">
              <button
                type="button"
                onClick={() => {
                  retryVideo();
                  setShowMoreMenu(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4" />
                Reload video
              </button>

              <button
                type="button"
                onClick={() => {
                  void togglePictureInPicture();
                  setShowMoreMenu(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-slate-800"
              >
                <PictureInPicture2 className="h-4 w-4" />
                Picture in Picture
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPlaylist(true);
                  setShowMoreMenu(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-slate-800"
              >
                <ListVideo className="h-4 w-4" />
                Show playlist
              </button>

              {onClose && (
                <>
                  <div className="my-1 border-t border-slate-800" />

                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      onClose();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-red-400 transition hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                    Close player
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          MAIN AREA
      =================================================== */}

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* =================================================
            VIDEO AREA
        ================================================= */}

        <div className="relative flex min-w-0 flex-1 items-center justify-center bg-[#05080b]">
          {/* VIDEO */}

          <video
            ref={videoRef}
            src={currentVideo.url}
            className="h-full w-full object-contain"
            preload="auto"
            playsInline
            controls={false}
            onLoadedMetadata={
              handleLoadedMetadata
            }
            onTimeUpdate={
              handleTimeUpdate
            }
            onPlay={handlePlay}
            onPause={handlePause}
            onWaiting={handleWaiting}
            onPlaying={handlePlaying}
            onEnded={handleEnded}
            onError={handleVideoError}
          />

          {/* Loading */}

          {isLoading && !error && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/70 backdrop-blur-md">
                <Loader2 className="h-7 w-7 animate-spin text-sky-400" />
              </div>
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#05080b]/95 px-5">
              <div className="w-full max-w-[480px] rounded-3xl border border-slate-700 bg-[#10151a] p-7 text-center shadow-2xl">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/15">
                  <AlertCircle className="h-7 w-7 text-pink-400" />
                </div>

                <h2 className="text-lg font-bold text-white">
                  Unable to play video
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={retryVideo}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Center play */}

          {!isPlaying &&
            !isLoading &&
            !error && (
              <button
                type="button"
                aria-label="Play video"
                onClick={togglePlay}
                className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-110 hover:bg-white/20"
              >
                <Play className="ml-1 h-8 w-8 fill-current" />
              </button>
            )}

          {/* Video title */}

          {!error && (
            <div className="pointer-events-none absolute left-5 top-5 max-w-[65%]">
              <div className="rounded-xl border border-white/5 bg-black/40 px-3 py-2 backdrop-blur-md">
                <p className="truncate text-xs font-medium text-white">
                  {currentVideo.title}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  {currentVideo.type} • Demo Media
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              MOBILE PLAYLIST
          ================================================= */}

          {showPlaylist && (
            <div className="absolute inset-0 z-40 lg:hidden">
              <button
                type="button"
                aria-label="Close playlist"
                onClick={() =>
                  setShowPlaylist(false)
                }
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              <div className="absolute bottom-0 right-0 top-0 w-[min(88%,340px)] border-l border-slate-800 bg-[#10151b] shadow-2xl">
                <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4">
                  <div className="flex items-center gap-2">
                    <ListVideo className="h-4 w-4 text-sky-400" />

                    <span className="text-sm font-semibold">
                      Your Videos
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowPlaylist(false)
                    }
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="h-[calc(100%-56px)] overflow-y-auto">
                  {renderPlaylist()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            DESKTOP PLAYLIST
        ================================================= */}

        <aside className="hidden w-[340px] shrink-0 flex-col border-l border-slate-800 bg-[#10151b] lg:flex">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 px-4">
            <div className="flex items-center gap-2">
              <ListVideo className="h-4 w-4 text-sky-400" />

              <span className="text-sm font-semibold text-slate-300">
                YOUR VIDEOS
              </span>
            </div>

            <span className="text-xs text-slate-600">
              {DEMO_VIDEOS.length}
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {renderPlaylist()}
          </div>
        </aside>
      </div>

      {/* ===================================================
          CONTROLS
      =================================================== */}

      <div className="shrink-0 border-t border-slate-800 bg-[#10161d] px-4 pb-3 pt-2">
        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="relative mb-3 h-1.5">
          <div className="absolute inset-0 rounded-full bg-slate-800" />

          <div
            className="absolute left-0 top-0 h-full rounded-full bg-sky-400 transition-all"
            style={{
              width: `${Math.min(
                100,
                Math.max(0, progress)
              )}%`,
            }}
          />

          <input
            aria-label="Video progress"
            type="range"
            min="0"
            max={duration || 0}
            step="0.01"
            value={Math.min(
              currentTime,
              duration || 0
            )}
            onChange={(event) => {
              const value = Number(
                event.target.value
              );

              const video =
                videoRef.current;

              if (video) {
                video.currentTime = value;
              }

              setCurrentTime(value);
            }}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent accent-sky-400"
          />
        </div>

        {/* =================================================
            CONTROL BAR
        ================================================= */}

        <div className="flex items-center gap-1 sm:gap-2">
          {/* PLAY */}

          <button
            type="button"
            aria-label={
              isPlaying
                ? "Pause"
                : "Play"
            }
            onClick={togglePlay}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition hover:bg-slate-800"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
          </button>

          {/* PREVIOUS */}

          <button
            type="button"
            aria-label="Previous video"
            onClick={previousVideo}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          {/* NEXT */}

          <button
            type="button"
            aria-label="Next video"
            onClick={nextVideo}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          {/* RESTART */}

          <button
            type="button"
            aria-label="Restart video"
            onClick={restartVideo}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white sm:flex"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* TIME */}

          <div className="ml-1 min-w-[82px] whitespace-nowrap font-mono text-[10px] text-slate-500">
            {formatTime(currentTime)} /{" "}
            {formatTime(duration)}
          </div>

          {/* SPACER */}

          <div className="flex-1" />

          {/* SPEED */}

          <select
            aria-label="Playback speed"
            value={speed}
            onChange={(event) =>
              handleSpeedChange(
                Number(event.target.value)
              )
            }
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-[10px] text-slate-400 outline-none transition focus:border-sky-500"
          >
            <option value={0.5}>
              0.5x
            </option>

            <option value={0.75}>
              0.75x
            </option>

            <option value={1}>
              1x
            </option>

            <option value={1.25}>
              1.25x
            </option>

            <option value={1.5}>
              1.5x
            </option>

            <option value={1.75}>
              1.75x
            </option>

            <option value={2}>
              2x
            </option>
          </select>

          {/* MUTE */}

          <button
            type="button"
            aria-label={
              isMuted
                ? "Unmute"
                : "Mute"
            }
            onClick={toggleMute}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          {/* VOLUME */}

          <input
            aria-label="Volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={
              isMuted
                ? 0
                : volume
            }
            onChange={(event) =>
              handleVolumeChange(
                Number(event.target.value)
              )
            }
            className="hidden w-20 accent-sky-400 sm:block"
          />

          {/* PIP */}

          <button
            type="button"
            aria-label="Picture in Picture"
            onClick={() =>
              void togglePictureInPicture()
            }
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white sm:flex"
          >
            <PictureInPicture2 className="h-4 w-4" />
          </button>

          {/* FULLSCREEN */}

          <button
            type="button"
            aria-label={
              isFullscreen
                ? "Exit fullscreen"
                : "Fullscreen"
            }
            onClick={() =>
              void toggleFullscreen()
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerApp;