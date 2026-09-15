import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useOS } from "../../context/OSContext";
import { PROFILE_INFO } from "../../data/initialData";

import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clipboard,
  Copy,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  Folder,
  Globe,
  History,
  Home,
  Image as ImageIcon,
  Info,
  Maximize2,
  Menu,
  MoreHorizontal,
  MoreVertical,
  PanelRight,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
  Upload,
  Wifi,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type BrowserPage =
  | "resume"
  | "home"
  | "search"
  | "history"
  | "downloads"
  | "bookmarks"
  | "settings";

type BrowserTab = {
  id: string;
  title: string;
  url: string;
  page: BrowserPage;
  searchQuery?: string;
  isPinned?: boolean;
};

type SearchResult = {
  title: string;
  description: string;
  url: string;
};

type HistoryItem = {
  id: string;
  title: string;
  url: string;
  timestamp: number;
};

type DownloadItem = {
  id: string;
  name: string;
  type: string;
  timestamp: number;
};

type ContextMenuState = {
  x: number;
  y: number;
} | null;

type Wallpaper =
  | {
      type: "gradient";
      value: string;
      label: string;
    }
  | {
      type: "image";
      value: string;
      label: string;
    };

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const STORAGE_KEYS = {
  wallpaper: "resume-browser-wallpaper",
  history: "resume-browser-history",
  bookmarks: "resume-browser-bookmarks",
  downloads: "resume-browser-downloads",
};

const DEFAULT_WALLPAPER: Wallpaper = {
  type: "gradient",
  value:
    "radial-gradient(circle at 15% 20%, rgba(59,130,246,.35), transparent 30%), radial-gradient(circle at 85% 10%, rgba(168,85,247,.28), transparent 30%), linear-gradient(135deg, #0f172a 0%, #111827 48%, #020617 100%)",
  label: "Midnight",
};

const WALLPAPERS: Wallpaper[] = [
  {
    type: "gradient",
    value:
      "radial-gradient(circle at 15% 20%, rgba(59,130,246,.35), transparent 30%), radial-gradient(circle at 85% 10%, rgba(168,85,247,.28), transparent 30%), linear-gradient(135deg, #0f172a 0%, #111827 48%, #020617 100%)",
    label: "Midnight",
  },
  {
    type: "gradient",
    value:
      "radial-gradient(circle at 20% 20%, rgba(6,182,212,.45), transparent 32%), radial-gradient(circle at 80% 75%, rgba(59,130,246,.3), transparent 35%), linear-gradient(135deg, #082f49, #0f172a 55%, #020617)",
    label: "Ocean",
  },
  {
    type: "gradient",
    value:
      "radial-gradient(circle at 75% 15%, rgba(236,72,153,.38), transparent 28%), radial-gradient(circle at 15% 80%, rgba(124,58,237,.38), transparent 32%), linear-gradient(135deg, #1e1037, #111827, #020617)",
    label: "Aurora",
  },
  {
    type: "gradient",
    value:
      "radial-gradient(circle at 20% 20%, rgba(249,115,22,.42), transparent 30%), radial-gradient(circle at 85% 80%, rgba(234,179,8,.22), transparent 32%), linear-gradient(135deg, #29140a, #18181b 55%, #09090b)",
    label: "Sunset",
  },
  {
    type: "gradient",
    value:
      "radial-gradient(circle at 30% 15%, rgba(34,197,94,.25), transparent 30%), radial-gradient(circle at 75% 75%, rgba(16,185,129,.25), transparent 32%), linear-gradient(135deg, #052e16, #111827 55%, #020617)",
    label: "Forest",
  },
  {
    type: "gradient",
    value:
      "radial-gradient(circle at 50% 10%, rgba(255,255,255,.13), transparent 20%), linear-gradient(135deg, #27272a, #09090b 65%, #000)",
    label: "Graphite",
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const safeReadStorage = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const safeWriteStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors.
  }
};

const getSearchUrl = (query: string) =>
  `search://${encodeURIComponent(query.trim())}`;

const getHostFromUrl = (url: string) => {
  if (url.startsWith("search://")) return "Search";
  if (url === "browser://newtab") return "New Tab";

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Resume Browser";
  }
};

const isExternalUrl = (url: string) =>
  /^https?:\/\//i.test(url) || /^www\./i.test(url);

const normalizeUrl = (value: string) => {
  const input = value.trim();

  if (!input) return "browser://newtab";

  if (
    input.startsWith("browser://") ||
    input.startsWith("search://") ||
    input.startsWith("http://") ||
    input.startsWith("https://")
  ) {
    return input;
  }

  if (
    input.includes(".") &&
    !input.includes(" ") &&
    !input.startsWith("localhost")
  ) {
    return `https://${input}`;
  }

  return getSearchUrl(input);
};

const formatTime = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(timestamp);

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

export const ResumeApp: React.FC = () => {
  const { experiences, projects, skills, education } = useOS();

  /* ---------------------------------------------------------------------- */
  /* Browser state                                                          */
  /* ---------------------------------------------------------------------- */

  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: makeId(),
      title: "Abhishek Kuntare — Resume",
      url: "browser://resume",
      page: "resume",
    },
  ]);

  const [activeTabId, setActiveTabId] = useState(tabs[0].id);

  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [forwardStack, setForwardStack] = useState<string[]>([]);

  const [addressValue, setAddressValue] = useState(
    "browser://resume"
  );

  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);

  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showTabMenu, setShowTabMenu] = useState(false);

  const [contextMenu, setContextMenu] =
    useState<ContextMenuState>(null);

  const [toast, setToast] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const [wallpaper, setWallpaper] =
    useState<Wallpaper>(DEFAULT_WALLPAPER);

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [bookmarkItems, setBookmarkItems] = useState<HistoryItem[]>([]);
  const [downloadItems, setDownloadItems] = useState<DownloadItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Active tab                                                             */
  /* ---------------------------------------------------------------------- */

  const activeTab = useMemo(
    () =>
      tabs.find((tab) => tab.id === activeTabId) ??
      tabs[0],
    [tabs, activeTabId]
  );

  /* ---------------------------------------------------------------------- */
  /* Initial storage                                                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const savedWallpaper = safeReadStorage<Wallpaper | null>(
      STORAGE_KEYS.wallpaper,
      null
    );

    const savedHistory = safeReadStorage<HistoryItem[]>(
      STORAGE_KEYS.history,
      []
    );

    const savedBookmarks = safeReadStorage<HistoryItem[]>(
      STORAGE_KEYS.bookmarks,
      []
    );

    const savedDownloads = safeReadStorage<DownloadItem[]>(
      STORAGE_KEYS.downloads,
      []
    );

    if (savedWallpaper) setWallpaper(savedWallpaper);

    setHistoryItems(savedHistory);
    setBookmarkItems(savedBookmarks);
    setDownloadItems(savedDownloads);
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Toast                                                                  */
  /* ---------------------------------------------------------------------- */

  const showToast = useCallback((message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Sync active URL                                                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (activeTab) {
      setAddressValue(activeTab.url);
      setIsBookmarked(
        bookmarkItems.some((item) => item.url === activeTab.url)
      );
    }
  }, [activeTab, bookmarkItems]);

  /* ---------------------------------------------------------------------- */
  /* Update active tab                                                      */
  /* ---------------------------------------------------------------------- */

  const updateActiveTab = useCallback(
    (updates: Partial<BrowserTab>) => {
      setTabs((currentTabs) =>
        currentTabs.map((tab) =>
          tab.id === activeTabId
            ? {
                ...tab,
                ...updates,
              }
            : tab
        )
      );
    },
    [activeTabId]
  );

  /* ---------------------------------------------------------------------- */
  /* Resolve page from URL                                                  */
  /* ---------------------------------------------------------------------- */

  const resolvePage = (
    url: string
  ): {
    page: BrowserPage;
    title: string;
    searchQuery?: string;
  } => {
    if (url === "browser://resume") {
      return {
        page: "resume",
        title: "Abhishek Kuntare — Resume",
      };
    }

    if (url === "browser://newtab") {
      return {
        page: "home",
        title: "New Tab",
      };
    }

    if (url === "browser://history") {
      return {
        page: "history",
        title: "History",
      };
    }

    if (url === "browser://downloads") {
      return {
        page: "downloads",
        title: "Downloads",
      };
    }

    if (url === "browser://bookmarks") {
      return {
        page: "bookmarks",
        title: "Bookmarks",
      };
    }

    if (url === "browser://settings") {
      return {
        page: "settings",
        title: "Settings",
      };
    }

    if (url.startsWith("search://")) {
      const query = decodeURIComponent(
        url.replace("search://", "")
      );

      return {
        page: "search",
        title: `${query} — Search`,
        searchQuery: query,
      };
    }

    return {
      page: "home",
      title: getHostFromUrl(url),
    };
  };

  /* ---------------------------------------------------------------------- */
  /* Add browser history                                                    */
  /* ---------------------------------------------------------------------- */

  const addHistory = useCallback(
    (url: string, title: string) => {
      if (
        url.startsWith("browser://") ||
        url.startsWith("search://")
      ) {
        // Internal browser pages still count as navigation but
        // are kept lightweight.
      }

      const item: HistoryItem = {
        id: makeId(),
        title,
        url,
        timestamp: Date.now(),
      };

      setHistoryItems((current) => {
        const next = [
          item,
          ...current.filter((entry) => entry.url !== url),
        ].slice(0, 100);

        safeWriteStorage(STORAGE_KEYS.history, next);

        return next;
      });
    },
    []
  );

  /* ---------------------------------------------------------------------- */
  /* Navigation                                                             */
  /* ---------------------------------------------------------------------- */

  const navigate = useCallback(
    (
      rawUrl: string,
      options: {
        addToHistory?: boolean;
        replace?: boolean;
      } = {}
    ) => {
      const url = normalizeUrl(rawUrl);
      const resolved = resolvePage(url);

      const currentUrl =
        tabs.find((tab) => tab.id === activeTabId)?.url ??
        "browser://resume";

      if (!options.replace && currentUrl !== url) {
        setHistoryStack((current) => [
          ...current,
          currentUrl,
        ]);

        setForwardStack([]);
      }

      updateActiveTab({
        url,
        page: resolved.page,
        title: resolved.title,
        searchQuery: resolved.searchQuery,
      });

      setAddressValue(url);

      if (options.addToHistory !== false) {
        addHistory(url, resolved.title);
      }

      if (resolved.page === "search") {
        setSearchInput(resolved.searchQuery ?? "");
      }
    },
    [
      activeTabId,
      addHistory,
      tabs,
      updateActiveTab,
    ]
  );

  /* ---------------------------------------------------------------------- */
  /* Search                                                                 */
  /* ---------------------------------------------------------------------- */

  const performSearch = async (query: string) => {
    const cleaned = query.trim();

    if (!cleaned) {
      navigate("browser://newtab");
      return;
    }

    navigate(getSearchUrl(cleaned));
  };

  /* ---------------------------------------------------------------------- */
  /* Search data                                                             */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const query = activeTab?.searchQuery;

    if (!query || activeTab.page !== "search") {
      return;
    }

    let cancelled = false;

    const loadSearch = async () => {
      setSearchLoading(true);

      try {
        const endpoint =
          `https://api.duckduckgo.com/?q=${encodeURIComponent(
            query
          )}&format=json&no_html=1&skip_disambig=0`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();

        const results: SearchResult[] = [];

        if (data.AbstractText) {
          results.push({
            title:
              data.Heading ||
              query,
            description: data.AbstractText,
            url:
              data.AbstractURL ||
              `https://duckduckgo.com/?q=${encodeURIComponent(
                query
              )}`,
          });
        }

        const topics = Array.isArray(data.RelatedTopics)
          ? data.RelatedTopics
          : [];

        for (const topic of topics) {
          if (results.length >= 8) break;

          if (
            topic &&
            typeof topic.Text === "string" &&
            typeof topic.FirstURL === "string"
          ) {
            results.push({
              title: topic.Text.split(" - ")[0].slice(0, 100),
              description: topic.Text,
              url: topic.FirstURL,
            });
          }

          if (Array.isArray(topic?.Topics)) {
            for (const nested of topic.Topics) {
              if (results.length >= 8) break;

              if (
                nested &&
                typeof nested.Text === "string" &&
                typeof nested.FirstURL === "string"
              ) {
                results.push({
                  title: nested.Text.split(" - ")[0].slice(0, 100),
                  description: nested.Text,
                  url: nested.FirstURL,
                });
              }
            }
          }
        }

        if (!cancelled) {
          setSearchResults(results);
        }
      } catch {
        if (!cancelled) {
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    };

    loadSearch();

    return () => {
      cancelled = true;
    };
  }, [activeTab?.searchQuery, activeTab?.page]);

  /* ---------------------------------------------------------------------- */
  /* Browser navigation buttons                                             */
  /* ---------------------------------------------------------------------- */

  const goBack = () => {
    if (historyStack.length === 0) {
      showToast("No previous page");
      return;
    }

    const previous =
      historyStack[historyStack.length - 1];

    const currentUrl = activeTab?.url;

    setHistoryStack((current) =>
      current.slice(0, -1)
    );

    if (currentUrl) {
      setForwardStack((current) => [
        ...current,
        currentUrl,
      ]);
    }

    navigate(previous, {
      addToHistory: false,
      replace: true,
    });
  };

  const goForward = () => {
    if (forwardStack.length === 0) {
      showToast("No next page");
      return;
    }

    const next =
      forwardStack[forwardStack.length - 1];

    const currentUrl = activeTab?.url;

    setForwardStack((current) =>
      current.slice(0, -1)
    );

    if (currentUrl) {
      setHistoryStack((current) => [
        ...current,
        currentUrl,
      ]);
    }

    navigate(next, {
      addToHistory: false,
      replace: true,
    });
  };

  const refreshPage = () => {
    if (activeTab?.page === "search") {
      const query = activeTab.searchQuery;

      updateActiveTab({
        title: query
          ? `${query} — Search`
          : "Search",
      });

      showToast("Search refreshed");
      return;
    }

    showToast("Page refreshed");
  };

  /* ---------------------------------------------------------------------- */
  /* Tabs                                                                   */
  /* ---------------------------------------------------------------------- */

  const createNewTab = () => {
    const newTab: BrowserTab = {
      id: makeId(),
      title: "New Tab",
      url: "browser://newtab",
      page: "home",
    };

    setTabs((current) => [...current, newTab]);
    setActiveTabId(newTab.id);
    setShowTabMenu(false);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) {
      updateActiveTab({
        title: "New Tab",
        url: "browser://newtab",
        page: "home",
      });

      return;
    }

    const index = tabs.findIndex(
      (tab) => tab.id === id
    );

    const nextTabs = tabs.filter(
      (tab) => tab.id !== id
    );

    setTabs(nextTabs);

    if (activeTabId === id) {
      const nextIndex = Math.min(
        Math.max(index - 1, 0),
        nextTabs.length - 1
      );

      setActiveTabId(nextTabs[nextIndex].id);
    }
  };

  const duplicateTab = () => {
    if (!activeTab) return;

    const duplicated: BrowserTab = {
      ...activeTab,
      id: makeId(),
      title: `${activeTab.title}`,
    };

    setTabs((current) => {
      const index = current.findIndex(
        (tab) => tab.id === activeTabId
      );

      const next = [...current];

      next.splice(index + 1, 0, duplicated);

      return next;
    });

    setActiveTabId(duplicated.id);
    setShowTabMenu(false);
  };

  /* ---------------------------------------------------------------------- */
  /* Bookmark                                                               */
  /* ---------------------------------------------------------------------- */

  const toggleBookmark = () => {
    if (!activeTab) return;

    const existing = bookmarkItems.find(
      (item) => item.url === activeTab.url
    );

    if (existing) {
      const next = bookmarkItems.filter(
        (item) => item.url !== activeTab.url
      );

      setBookmarkItems(next);
      safeWriteStorage(
        STORAGE_KEYS.bookmarks,
        next
      );

      setIsBookmarked(false);
      showToast("Removed from bookmarks");
      return;
    }

    const bookmark: HistoryItem = {
      id: makeId(),
      title: activeTab.title,
      url: activeTab.url,
      timestamp: Date.now(),
    };

    const next = [
      bookmark,
      ...bookmarkItems,
    ];

    setBookmarkItems(next);
    safeWriteStorage(
      STORAGE_KEYS.bookmarks,
      next
    );

    setIsBookmarked(true);
    showToast("Added to bookmarks");
  };

  /* ---------------------------------------------------------------------- */
  /* Download                                                               */
  /* ---------------------------------------------------------------------- */

  const createResumeText = () => {
    return `ABHISHEK KUNTARE

${PROFILE_INFO.role}

Email: ${PROFILE_INFO.email}
Phone: ${PROFILE_INFO.phone}
Location: ${PROFILE_INFO.location}
GitHub: ${PROFILE_INFO.github}
LinkedIn: ${PROFILE_INFO.linkedin}
Portfolio: ${PROFILE_INFO.portfolio}

==================================================
PROFESSIONAL SUMMARY
==================================================

${PROFILE_INFO.bio}

==================================================
EXPERIENCE
==================================================

${(experiences || [])
  .map(
    (e) => `${e.role.toUpperCase()} — ${e.company}
${e.start_date} – ${e.end_date} | ${e.location}

${(e.description || [])
  .map((d) => `• ${d}`)
  .join("\n")}

Key Achievements:
${(e.achievements || [])
  .map((a) => `- ${a}`)
  .join("\n")}

Technologies:
${(e.technologies || []).join(", ")}
`
  )
  .join("\n\n")}

==================================================
KEY PROJECTS
==================================================

${(projects || [])
  .map(
    (p) => `${p.title.toUpperCase()} (${p.year})
Category: ${p.category}

Technologies:
${(p.technologies || []).join(", ")}

${p.short_description}

${p.live_url ? `Live: ${p.live_url}` : ""}
${p.github_url ? `GitHub: ${p.github_url}` : ""}
`
  )
  .join("\n")}

==================================================
SKILLS
==================================================

${(skills || [])
  .map(
    (s) => `• ${s.name} (${s.category})`
  )
  .join("\n")}

==================================================
EDUCATION
==================================================

${education.institution}

${education.degree} in ${education.field}

CGPA: ${education.cgpa}
${education.start_date} – ${education.end_date}
${education.location}
`;
  };

  const handleDownload = () => {
    const resumeText = createResumeText();

    const blob = new Blob(
      [resumeText],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      "Abhishek_Kuntare_Resume.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    const item: DownloadItem = {
      id: makeId(),
      name: "Abhishek_Kuntare_Resume.txt",
      type: "Text document",
      timestamp: Date.now(),
    };

    const next = [
      item,
      ...downloadItems,
    ];

    setDownloadItems(next);

    safeWriteStorage(
      STORAGE_KEYS.downloads,
      next
    );

    showToast("Resume downloaded");
  };

  /* ---------------------------------------------------------------------- */
  /* Print                                                                  */
  /* ---------------------------------------------------------------------- */

  const handlePrint = () => {
    window.print();
  };

  /* ---------------------------------------------------------------------- */
  /* Share                                                                  */
  /* ---------------------------------------------------------------------- */

  const handleShare = async () => {
    const shareData = {
      title: "Abhishek Kuntare — Resume",
      text: "View Abhishek Kuntare's resume",
      url: window.location.href,
    };

    try {
      if (
        navigator.share &&
        window.isSecureContext
      ) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);

      window.setTimeout(
        () => setCopied(false),
        2000
      );

      showToast("Link copied");
    } catch {
      showToast("Sharing cancelled");
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Copy URL                                                               */
  /* ---------------------------------------------------------------------- */

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        activeTab?.url ?? ""
      );

      setCopied(true);

      window.setTimeout(
        () => setCopied(false),
        2000
      );

      showToast("URL copied");
    } catch {
      showToast("Could not copy URL");
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Zoom                                                                   */
  /* ---------------------------------------------------------------------- */

  const zoomOut = () => {
    setZoomLevel((prev) =>
      Math.max(50, prev - 10)
    );
  };

  const zoomIn = () => {
    setZoomLevel((prev) =>
      Math.min(200, prev + 10)
    );
  };

  const resetZoom = () => {
    setZoomLevel(100);
    showToast("Zoom reset to 100%");
  };

  /* ---------------------------------------------------------------------- */
  /* Fullscreen                                                              */
  /* ---------------------------------------------------------------------- */

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      showToast("Fullscreen unavailable");
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Rotate                                                                 */
  /* ---------------------------------------------------------------------- */

  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  /* ---------------------------------------------------------------------- */
  /* Wallpaper                                                              */
  /* ---------------------------------------------------------------------- */

  const selectWallpaper = (nextWallpaper: Wallpaper) => {
    setWallpaper(nextWallpaper);

    safeWriteStorage(
      STORAGE_KEYS.wallpaper,
      nextWallpaper
    );

    showToast(
      `Wallpaper changed to ${nextWallpaper.label}`
    );
  };

  const handleWallpaperUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const value = String(reader.result);

      const customWallpaper: Wallpaper = {
        type: "image",
        value,
        label: "My Wallpaper",
      };

      selectWallpaper(customWallpaper);
    };

    reader.readAsDataURL(file);
  };

  /* ---------------------------------------------------------------------- */
  /* Screenshot                                                             */
  /* ---------------------------------------------------------------------- */

  const takeScreenshot = () => {
    /*
      Native browser screenshot APIs aren't consistently available.
      This keeps the feature functional without adding html2canvas.
      The user can use the native OS/browser screenshot shortcut.
    */

    showToast(
      "Use Win + Shift + S or Shift + Cmd + 4 to capture"
    );
  };

  /* ---------------------------------------------------------------------- */
  /* External links                                                         */
  /* ---------------------------------------------------------------------- */

  const openExternal = (url: string) => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ---------------------------------------------------------------------- */
  /* Keyboard shortcuts                                                     */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modifier =
        event.ctrlKey || event.metaKey;

      if (modifier && event.key.toLowerCase() === "l") {
        event.preventDefault();

        const input = document.querySelector(
          "[data-address-bar]"
        ) as HTMLInputElement | null;

        input?.focus();
        input?.select();
      }

      if (
        modifier &&
        event.key.toLowerCase() === "t"
      ) {
        event.preventDefault();
        createNewTab();
      }

      if (
        modifier &&
        event.key.toLowerCase() === "w"
      ) {
        event.preventDefault();

        if (activeTabId) {
          closeTab(activeTabId);
        }
      }

      if (
        modifier &&
        event.key.toLowerCase() === "r"
      ) {
        event.preventDefault();
        refreshPage();
      }

      if (
        modifier &&
        event.key === "+"
      ) {
        event.preventDefault();
        zoomIn();
      }

      if (
        modifier &&
        event.key === "-"
      ) {
        event.preventDefault();
        zoomOut();
      }

      if (
        modifier &&
        event.key === "0"
      ) {
        event.preventDefault();
        resetZoom();
      }

      if (
        event.altKey &&
        event.key === "ArrowLeft"
      ) {
        event.preventDefault();
        goBack();
      }

      if (
        event.altKey &&
        event.key === "ArrowRight"
      ) {
        event.preventDefault();
        goForward();
      }

      if (event.key === "Escape") {
        setContextMenu(null);
        setShowMoreMenu(false);
        setShowCustomize(false);
        setShowTabMenu(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  });

  /* ---------------------------------------------------------------------- */
  /* Context menu                                                           */
  /* ---------------------------------------------------------------------- */

  const handleContextMenu = (
    event: React.MouseEvent
  ) => {
    event.preventDefault();

    setContextMenu({
      x: Math.min(
        event.clientX,
        window.innerWidth - 330
      ),
      y: Math.min(
        event.clientY,
        window.innerHeight - 580
      ),
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Browser background                                                     */
  /* ---------------------------------------------------------------------- */

  const browserBackgroundStyle =
    wallpaper.type === "image"
      ? {
          backgroundImage: `url(${wallpaper.value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {
          background: wallpaper.value,
        };

  /* ---------------------------------------------------------------------- */
  /* Resume document                                                        */
  /* ---------------------------------------------------------------------- */

  const ResumeDocument = () => (
    <div
      className="mx-auto w-full max-w-[820px] rounded-sm bg-white text-slate-900 shadow-[0_30px_100px_rgba(0,0,0,.55)] print:shadow-none"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "top center",
      }}
    >
      <div className="p-8 sm:p-12 lg:p-14 select-text">
        {/* Header */}
        <div className="border-b border-slate-300 pb-5 text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 uppercase">
            {PROFILE_INFO.name}
          </h1>

          <p className="text-sm font-semibold text-sky-700 uppercase tracking-wider">
            {PROFILE_INFO.role}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-600 pt-1">
            <span>{PROFILE_INFO.email}</span>
            <span>•</span>
            <span>{PROFILE_INFO.phone}</span>
            <span>•</span>
            <span>{PROFILE_INFO.location}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-sky-700 font-medium pt-0.5">
            <span>github.com/abhishekkuntare</span>
            <span>•</span>
            <span>linkedin.com/in/abhishekkuntare</span>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-1.5 mt-6">
          <h2 className="text-xs font-bold tracking-wider text-slate-800 uppercase border-b border-slate-200 pb-1">
            Professional Summary
          </h2>

          <p className="text-xs text-slate-700 leading-relaxed">
            {PROFILE_INFO.bio}
          </p>
        </div>

        {/* Experience */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xs font-bold tracking-wider text-slate-800 uppercase border-b border-slate-200 pb-1">
            Professional Experience
          </h2>

          {(experiences || []).map((e) => (
            <div
              key={e.id}
              className="space-y-1.5 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 font-bold text-slate-900">
                <span>
                  {e.role} —{" "}
                  <span className="font-semibold text-sky-800">
                    {e.company}
                  </span>
                </span>

                <span className="text-[11px] font-normal text-slate-600">
                  {e.start_date} – {e.end_date}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 italic">
                {e.location}
              </div>

              <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                {(e.description || []).map(
                  (d, i) => (
                    <li key={i}>{d}</li>
                  )
                )}

                {(e.achievements || []).map(
                  (a, j) => (
                    <li
                      key={j}
                      className="font-medium text-slate-900"
                    >
                      Key Outcome: {a}
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="space-y-3 mt-6">
          <h2 className="text-xs font-bold tracking-wider text-slate-800 uppercase border-b border-slate-200 pb-1">
            Featured Technical Projects
          </h2>

          {(projects || [])
            .slice(0, 3)
            .map((p) => (
              <div
                key={p.id}
                className="space-y-1 text-xs"
              >
                <div className="flex justify-between items-baseline gap-2 font-bold text-slate-900">
                  <span>{p.title}</span>

                  <span className="text-[11px] font-normal text-slate-600">
                    {p.year}
                  </span>
                </div>

                <div className="text-[11px] text-sky-800 font-medium">
                  Technologies:{" "}
                  {(p.technologies || []).join(", ")}
                </div>

                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {p.short_description}
                </p>
              </div>
            ))}
        </div>

        {/* Skills */}
        <div className="space-y-1.5 mt-6">
          <h2 className="text-xs font-bold tracking-wider text-slate-800 uppercase border-b border-slate-200 pb-1">
            Technical Competencies
          </h2>

          <div className="text-[11px] text-slate-700 space-y-1 leading-relaxed">
            <div>
              <strong>Languages:</strong>{" "}
              JavaScript, TypeScript, SQL, Python
            </div>

            <div>
              <strong>Frontend:</strong>{" "}
              React.js, Next.js, Redux, HTML5, CSS3,
              SCSS, Tailwind CSS, Material UI
            </div>

            <div>
              <strong>
                Backend & Database:
              </strong>{" "}
              Node.js, Express.js, MongoDB,
              Firebase, GraphQL, Flask, REST APIs
            </div>

            <div>
              <strong>
                AI / API Integration:
              </strong>{" "}
              OpenAI APIs, LLM Integration, Prompt
              Engineering, Image Workflows
            </div>

            <div>
              <strong>
                Engineering & Tools:
              </strong>{" "}
              Git, GitHub, VS Code, Postman, Vercel,
              Responsive UI, Performance Optimization
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-1.5 mt-6">
          <h2 className="text-xs font-bold tracking-wider text-slate-800 uppercase border-b border-slate-200 pb-1">
            Education
          </h2>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 text-xs font-bold text-slate-900">
            <span>{education.institution}</span>

            <span className="text-[11px] font-normal text-slate-600">
              {education.start_date} –{" "}
              {education.end_date}
            </span>
          </div>

          <div className="text-[11px] text-slate-700">
            {education.degree} in{" "}
            {education.field} •{" "}
            <strong>
              CGPA: {education.cgpa}
            </strong>{" "}
            • {education.location}
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------------- */
  /* Home page                                                              */
  /* ---------------------------------------------------------------------- */

  const HomePage = () => (
    <div
      className="relative min-h-full overflow-hidden"
      style={browserBackgroundStyle}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

      <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-5 py-16">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
          <Globe className="h-8 w-8 text-white" />
        </div>

        <h1 className="text-center text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Resume Browser
        </h1>

        <p className="mt-3 max-w-xl text-center text-sm leading-6 text-white/65 sm:text-base">
          Browse your resume, search the web, customize
          your new-tab experience and manage browser-style
          tabs from one beautiful interface.
        </p>

        <form
          className="mt-9 w-full max-w-2xl"
          onSubmit={(event) => {
            event.preventDefault();
            performSearch(searchInput);
          }}
        >
          <div className="group flex h-14 items-center gap-3 rounded-full border border-white/15 bg-black/35 px-5 shadow-2xl backdrop-blur-2xl transition-all focus-within:border-sky-400/50 focus-within:bg-black/45 focus-within:ring-4 focus-within:ring-sky-400/10">
            <Search className="h-5 w-5 shrink-0 text-white/50 transition-colors group-focus-within:text-sky-300" />

            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search the web or type a URL"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40 sm:text-base"
            />

            <button
              type="submit"
              className="hidden rounded-full bg-white px-5 py-2 text-xs font-semibold text-slate-950 transition-transform hover:scale-105 sm:block"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              icon: FileText,
              label: "Resume",
              action: () =>
                navigate("browser://resume"),
            },
            {
              icon: History,
              label: "History",
              action: () =>
                navigate("browser://history"),
            },
            {
              icon: Bookmark,
              label: "Bookmarks",
              action: () =>
                navigate("browser://bookmarks"),
            },
            {
              icon: Download,
              label: "Downloads",
              action: () =>
                navigate("browser://downloads"),
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={item.action}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="h-4 w-4 text-white/75 transition-colors group-hover:text-sky-300" />
                </span>

                <span className="text-xs font-medium text-white/75">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() =>
            setShowCustomize(true)
          }
          className="mt-8 flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs text-white/60 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          Customize this page
        </button>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------------- */
  /* Search page                                                            */
  /* ---------------------------------------------------------------------- */

  const SearchPage = () => {
    const query =
      activeTab?.searchQuery || "";

    return (
      <div className="min-h-full bg-[#0b0d12] text-white">
        <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0d12]/90 px-4 py-4 backdrop-blur-xl sm:px-8">
          <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <Search className="h-4 w-4 text-white/40" />

            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  performSearch(searchInput);
                }
              }}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />

            <button
              onClick={() =>
                performSearch(searchInput)
              }
              className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Search
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
          <div className="mb-7">
            <p className="text-xs text-white/35">
              Search results
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {query}
            </h1>
          </div>

          {searchLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="h-3 w-28 rounded bg-white/10" />
                    <div className="mt-3 h-5 w-2/3 rounded bg-white/10" />
                    <div className="mt-3 h-3 w-full rounded bg-white/10" />
                    <div className="mt-2 h-3 w-4/5 rounded bg-white/10" />
                  </div>
                )
              )}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map(
                (result, index) => (
                  <button
                    key={`${result.url}-${index}`}
                    onClick={() =>
                      openExternal(result.url)
                    }
                    className="group block w-full rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400/25 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-[11px] text-emerald-400/70">
                          {result.url}
                        </p>

                        <h2 className="mt-1 text-base font-semibold text-sky-300 group-hover:text-sky-200">
                          {result.title}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-white/55">
                          {result.description}
                        </p>
                      </div>

                      <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-white/20 transition group-hover:text-sky-300" />
                    </div>
                  </button>
                )
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <Search className="mx-auto h-8 w-8 text-white/20" />

              <h2 className="mt-4 text-lg font-semibold">
                No instant results
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/45">
                The search provider did not return an
                instant result. You can open the complete
                web search below.
              </p>

              <button
                onClick={() =>
                  openExternal(
                    `https://www.google.com/search?q=${encodeURIComponent(
                      query
                    )}`
                  )
                }
                className="mt-6 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:scale-105"
              >
                Search Google
              </button>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-sky-400/10 bg-sky-400/[0.04] p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />

              <p className="text-xs leading-5 text-white/45">
                Search results are shown inside this browser
                interface. External websites are opened in
                a separate browser tab when they cannot be
                safely embedded by the website.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------------------- */
  /* History page                                                           */
  /* ---------------------------------------------------------------------- */

  const HistoryPage = () => (
    <div className="min-h-full bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-sky-400/70">
              Browser
            </p>

            <h1 className="mt-1 text-3xl font-semibold">
              History
            </h1>
          </div>

          {historyItems.length > 0 && (
            <button
              onClick={() => {
                setHistoryItems([]);
                safeWriteStorage(
                  STORAGE_KEYS.history,
                  []
                );
                showToast("History cleared");
              }}
              className="flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-400/5 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        <div className="mt-8 space-y-2">
          {historyItems.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">
              <History className="mx-auto h-8 w-8 text-white/20" />
              <p className="mt-4 text-sm text-white/40">
                No browsing history yet.
              </p>
            </div>
          ) : (
            historyItems.map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  navigate(item.url)
                }
                className="flex w-full items-center gap-4 rounded-2xl border border-transparent px-4 py-4 text-left transition hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                  <Globe className="h-4 w-4 text-white/40" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {item.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-white/35">
                    {item.url}
                  </p>
                </div>

                <span className="hidden text-[11px] text-white/25 sm:block">
                  {formatDate(item.timestamp)}{" "}
                  {formatTime(item.timestamp)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------------- */
  /* Downloads page                                                         */
  /* ---------------------------------------------------------------------- */

  const DownloadsPage = () => (
    <div className="min-h-full bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <p className="text-xs uppercase tracking-[.2em] text-sky-400/70">
          Browser
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          Downloads
        </h1>

        <div className="mt-8 space-y-3">
          {downloadItems.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">
              <Download className="mx-auto h-8 w-8 text-white/20" />

              <p className="mt-4 text-sm text-white/40">
                Your downloaded files will appear here.
              </p>
            </div>
          ) : (
            downloadItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-400/10">
                  <FileText className="h-5 w-5 text-sky-300" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    {item.type} ·{" "}
                    {formatDate(item.timestamp)}
                  </p>
                </div>

                <Check className="h-4 w-4 text-emerald-400" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------------- */
  /* Bookmarks page                                                         */
  /* ---------------------------------------------------------------------- */

  const BookmarksPage = () => (
    <div className="min-h-full bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <p className="text-xs uppercase tracking-[.2em] text-sky-400/70">
          Browser
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          Bookmarks
        </h1>

        <div className="mt-8 space-y-2">
          {bookmarkItems.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">
              <Bookmark className="mx-auto h-8 w-8 text-white/20" />

              <p className="mt-4 text-sm text-white/40">
                You don't have any bookmarks yet.
              </p>
            </div>
          ) : (
            bookmarkItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-4 rounded-2xl border border-transparent p-4 transition hover:border-white/10 hover:bg-white/[0.04]"
              >
                <button
                  onClick={() =>
                    navigate(item.url)
                  }
                  className="flex min-w-0 flex-1 items-center gap-4 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                    <Star className="h-4 w-4 text-amber-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {item.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-white/35">
                      {item.url}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const next =
                      bookmarkItems.filter(
                        (entry) =>
                          entry.id !== item.id
                      );

                    setBookmarkItems(next);

                    safeWriteStorage(
                      STORAGE_KEYS.bookmarks,
                      next
                    );
                  }}
                  className="rounded-lg p-2 text-white/20 opacity-0 transition hover:bg-white/10 hover:text-red-300 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------------- */
  /* Settings page                                                          */
  /* ---------------------------------------------------------------------- */

  const SettingsPage = () => (
    <div className="min-h-full bg-[#0b0d12] text-white">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <p className="text-xs uppercase tracking-[.2em] text-sky-400/70">
          Browser
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          Settings
        </h1>

        <div className="mt-8 space-y-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />

              <div>
                <p className="text-sm font-semibold">
                  Privacy
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Browser preferences are stored locally
                  in your browser.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              setShowCustomize(true)
            }
            className="flex w-full items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:bg-white/[0.05]"
          >
            <ImageIcon className="h-5 w-5 text-purple-300" />

            <div className="flex-1">
              <p className="text-sm font-semibold">
                Appearance
              </p>

              <p className="mt-1 text-xs text-white/35">
                Change your new-tab wallpaper.
              </p>
            </div>

            <ChevronRight className="h-4 w-4 text-white/20" />
          </button>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <Wifi className="h-5 w-5 text-sky-300" />

              <div>
                <p className="text-sm font-semibold">
                  Browser engine
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Internal browser shell with external-link
                  fallback for websites that block embedding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------------- */
  /* Resume page                                                            */
  /* ---------------------------------------------------------------------- */

  const ResumePage = () => (
    <div className="min-h-full bg-[#272a2f] px-3 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto mb-4 flex max-w-[820px] items-center justify-between gap-3 text-[11px] text-white/35">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5" />
          <span>Abhishek_Kuntare_Resume.pdf</span>
        </div>

        <span>
          Page 1 of 1
        </span>
      </div>

      <div
        className="origin-top transition-transform duration-200"
        style={{
          transform: `scale(${zoomLevel / 100})`,
          marginBottom:
            zoomLevel > 100
              ? `${(zoomLevel - 100) * 5}px`
              : "0px",
        }}
      >
        <ResumeDocument />
      </div>
    </div>
  );

  /* ---------------------------------------------------------------------- */
  /* Render active page                                                     */
  /* ---------------------------------------------------------------------- */

  const renderPage = () => {
    if (!activeTab) return <HomePage />;

    switch (activeTab.page) {
      case "resume":
        return <ResumePage />;

      case "search":
        return <SearchPage />;

      case "history":
        return <HistoryPage />;

      case "downloads":
        return <DownloadsPage />;

      case "bookmarks":
        return <BookmarksPage />;

      case "settings":
        return <SettingsPage />;

      case "home":
      default:
        return <HomePage />;
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Top tab icon                                                            */
  /* ---------------------------------------------------------------------- */

  const getTabIcon = (tab: BrowserTab) => {
    if (tab.page === "resume") {
      return (
        <FileText className="h-3.5 w-3.5 text-sky-300" />
      );
    }

    if (tab.page === "search") {
      return (
        <Search className="h-3.5 w-3.5 text-white/50" />
      );
    }

    return (
      <Globe className="h-3.5 w-3.5 text-white/50" />
    );
  };

  /* ---------------------------------------------------------------------- */
  /* Main UI                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#111318] text-white select-none"
      onContextMenu={handleContextMenu}
      onClick={() => {
        setContextMenu(null);
        setShowMoreMenu(false);
        setShowTabMenu(false);
      }}
    >
      {/* ================================================================== */}
      {/* macOS WINDOW HEADER                                                */}
      {/* ================================================================== */}

      <div className="shrink-0 border-b border-white/[0.08] bg-[#181a1f]/95 shadow-[0_10px_35px_rgba(0,0,0,.2)] backdrop-blur-2xl">
        {/* ---------------------------------------------------------------- */}
        {/* Traffic lights + tabs                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex h-11 items-center gap-3 px-3 sm:px-4">
          {/* Traffic lights */}
          <div className="hidden w-[68px] shrink-0 items-center gap-2 sm:flex">
            <button
              onClick={() =>
                showToast("Close")
              }
              className="group h-3 w-3 rounded-full bg-[#ff5f57] shadow-sm transition-transform hover:scale-110"
            >
              <X className="mx-auto hidden h-2 w-2 text-black/60 group-hover:block" />
            </button>

            <button
              onClick={() =>
                showToast("Minimize")
              }
              className="group h-3 w-3 rounded-full bg-[#febc2e] shadow-sm transition-transform hover:scale-110"
            >
              <span className="mx-auto hidden h-px w-1.5 bg-black/50 group-hover:block" />
            </button>

            <button
              onClick={() =>
                toggleFullscreen()
              }
              className="group h-3 w-3 rounded-full bg-[#28c840] shadow-sm transition-transform hover:scale-110"
            >
              <Maximize2 className="mx-auto hidden h-2 w-2 text-black/60 group-hover:block" />
            </button>
          </div>

          {/* Mobile title */}
          <div className="flex min-w-0 items-center gap-2 sm:hidden">
            <FileText className="h-4 w-4 text-sky-300" />

            <span className="truncate text-xs font-medium text-white/75">
              Resume Browser
            </span>
          </div>

          {/* Tabs */}
          <div className="flex min-w-0 flex-1 items-end gap-1 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const active =
                tab.id === activeTabId;

              return (
                <button
                  key={tab.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveTabId(tab.id);
                  }}
                  className={[
                    "group relative flex h-9 min-w-[145px] max-w-[240px] shrink-0 items-center gap-2 rounded-t-xl px-3 text-left transition-all",
                    active
                      ? "bg-[#25282e] text-white"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white/70",
                  ].join(" ")}
                >
                  {getTabIcon(tab)}

                  <span className="min-w-0 flex-1 truncate text-[11px] font-medium">
                    {tab.title}
                  </span>

                  <span
                    onClick={(event) => {
                      event.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md opacity-0 transition group-hover:opacity-100 hover:bg-white/10"
                  >
                    <X className="h-3 w-3" />
                  </span>

                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,.7)]" />
                  )}
                </button>
              );
            })}

            {/* New tab */}
            <button
              onClick={(event) => {
                event.stopPropagation();
                createNewTab();
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white"
              title="New tab"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Tab menu */}
          <button
            onClick={(event) => {
              event.stopPropagation();
              setShowTabMenu(
                (current) => !current
              );
            }}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white sm:flex"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Toolbar                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex min-h-[48px] items-center gap-1 px-2 pb-2 sm:gap-2 sm:px-4">
          {/* Back */}
          <button
            onClick={(event) => {
              event.stopPropagation();
              goBack();
            }}
            disabled={historyStack.length === 0}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/55 transition hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-20"
            title="Back — Alt + Left"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {/* Forward */}
          <button
            onClick={(event) => {
              event.stopPropagation();
              goForward();
            }}
            disabled={forwardStack.length === 0}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/55 transition hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-20"
            title="Forward — Alt + Right"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Refresh */}
          <button
            onClick={(event) => {
              event.stopPropagation();
              refreshPage();
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/55 transition hover:bg-white/[0.08] hover:text-white"
            title="Refresh — Ctrl + R"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {/* Address bar */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              navigate(addressValue);
            }}
            className="group relative flex h-9 min-w-0 flex-1 items-center rounded-full border border-white/[0.07] bg-[#101216]/80 px-3 shadow-inner transition-all focus-within:border-sky-400/30 focus-within:bg-[#0c0e12] focus-within:ring-2 focus-within:ring-sky-400/5"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <ShieldCheck className="mr-2 h-3.5 w-3.5 shrink-0 text-emerald-400/70" />

            <input
              data-address-bar
              value={addressValue}
              onChange={(event) =>
                setAddressValue(event.target.value)
              }
              onFocus={(event) =>
                event.currentTarget.select()
              }
              className="min-w-0 flex-1 bg-transparent text-xs text-white/80 outline-none placeholder:text-white/30 sm:text-[13px]"
              spellCheck={false}
              aria-label="Address and search bar"
            />

            <button
              type="button"
              onClick={copyCurrentUrl}
              className="hidden h-7 w-7 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/10 hover:text-white sm:flex"
              title="Copy URL"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </form>

          {/* Bookmark */}
          <button
            onClick={(event) => {
              event.stopPropagation();
              toggleBookmark();
            }}
            className={[
              "hidden h-9 w-9 shrink-0 items-center justify-center rounded-full transition sm:flex",
              isBookmarked
                ? "text-amber-300 hover:bg-amber-300/10"
                : "text-white/45 hover:bg-white/[0.08] hover:text-white",
            ].join(" ")}
            title={
              isBookmarked
                ? "Remove bookmark"
                : "Add bookmark"
            }
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>

          {/* Customize */}
          <button
            onClick={(event) => {
              event.stopPropagation();
              setShowCustomize(
                (current) => !current
              );
            }}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/45 transition hover:bg-white/[0.08] hover:text-white sm:flex"
            title="Customize"
          >
            <Pencil className="h-4 w-4" />
          </button>

          {/* More */}
          <div className="relative shrink-0">
            <button
              onClick={(event) => {
                event.stopPropagation();

                setShowMoreMenu(
                  (current) => !current
                );
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition hover:bg-white/[0.08] hover:text-white"
              title="More"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showMoreMenu && (
              <div
                onClick={(event) =>
                  event.stopPropagation()
                }
                className="absolute right-0 top-11 z-[100] w-[285px] overflow-hidden rounded-2xl border border-white/10 bg-[#1b1d22]/98 p-1.5 shadow-[0_25px_80px_rgba(0,0,0,.6)] backdrop-blur-3xl"
              >
                <BrowserMenuItem
                  icon={FileText}
                  label="New tab"
                  shortcut="Ctrl+T"
                  onClick={() => {
                    createNewTab();
                    setShowMoreMenu(false);
                  }}
                />

                <BrowserMenuItem
                  icon={History}
                  label="History"
                  shortcut=""
                  onClick={() => {
                    navigate("browser://history");
                    setShowMoreMenu(false);
                  }}
                />

                <BrowserMenuItem
                  icon={Download}
                  label="Downloads"
                  shortcut="Ctrl+J"
                  onClick={() => {
                    navigate(
                      "browser://downloads"
                    );
                    setShowMoreMenu(false);
                  }}
                />

                <BrowserMenuItem
                  icon={Bookmark}
                  label="Bookmarks"
                  shortcut=""
                  onClick={() => {
                    navigate(
                      "browser://bookmarks"
                    );
                    setShowMoreMenu(false);
                  }}
                />

                <div className="my-1.5 h-px bg-white/10" />

                <BrowserMenuItem
                  icon={ZoomOut}
                  label="Zoom out"
                  shortcut=""
                  onClick={() => zoomOut()}
                  right={`${zoomLevel}%`}
                />

                <BrowserMenuItem
                  icon={ZoomIn}
                  label="Zoom in"
                  shortcut=""
                  onClick={() => zoomIn()}
                  right={`${zoomLevel}%`}
                />

                <BrowserMenuItem
                  icon={Maximize2}
                  label="Fullscreen"
                  shortcut=""
                  onClick={() => {
                    toggleFullscreen();
                    setShowMoreMenu(false);
                  }}
                />

                <div className="my-1.5 h-px bg-white/10" />

                <BrowserMenuItem
                  icon={Printer}
                  label="Print"
                  shortcut="Ctrl+P"
                  onClick={() => {
                    handlePrint();
                    setShowMoreMenu(false);
                  }}
                />

                <BrowserMenuItem
                  icon={Download}
                  label="Download Resume"
                  shortcut=""
                  onClick={() => {
                    handleDownload();
                    setShowMoreMenu(false);
                  }}
                />

                <BrowserMenuItem
                  icon={Share2}
                  label="Share"
                  shortcut=""
                  onClick={() => {
                    handleShare();
                    setShowMoreMenu(false);
                  }}
                />

                <div className="my-1.5 h-px bg-white/10" />

                <BrowserMenuItem
                  icon={Camera}
                  label="Screenshot"
                  shortcut="Ctrl+Shift+S"
                  onClick={() => {
                    takeScreenshot();
                    setShowMoreMenu(false);
                  }}
                />

                <BrowserMenuItem
                  icon={Send}
                  label="Send tab to your devices"
                  shortcut=""
                  onClick={() => {
                    showToast(
                      "Device sharing is ready to connect"
                    );
                    setShowMoreMenu(false);
                  }}
                />

                <BrowserMenuItem
                  icon={Settings}
                  label="Settings"
                  shortcut=""
                  onClick={() => {
                    navigate(
                      "browser://settings"
                    );
                    setShowMoreMenu(false);
                  }}
                />

                <BrowserMenuItem
                  icon={CircleHelp}
                  label="Help"
                  shortcut=""
                  onClick={() => {
                    showToast(
                      "Browser help opened"
                    );
                    setShowMoreMenu(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* TAB DROPDOWN                                                        */}
      {/* ================================================================== */}

      {showTabMenu && (
        <div
          onClick={(event) =>
            event.stopPropagation()
          }
          className="absolute right-4 top-[45px] z-[90] w-[260px] rounded-2xl border border-white/10 bg-[#1b1d22]/98 p-2 shadow-2xl backdrop-blur-3xl"
        >
          <button
            onClick={() => {
              createNewTab();
              setShowTabMenu(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <Plus className="h-4 w-4" />
            New tab
          </button>

          <button
            onClick={() => {
              duplicateTab();
              setShowTabMenu(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <Copy className="h-4 w-4" />
            Duplicate tab
          </button>

          <div className="my-1 h-px bg-white/10" />

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id);
                setShowTabMenu(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              {getTabIcon(tab)}

              <span className="min-w-0 flex-1 truncate">
                {tab.title}
              </span>

              {tab.id === activeTabId && (
                <Check className="h-3.5 w-3.5 text-sky-300" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ================================================================== */}
      {/* CONTENT                                                            */}
      {/* ================================================================== */}

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto overscroll-contain">
          {renderPage()}
        </div>

        {/* ================================================================= */}
        {/* CUSTOMIZE PANEL                                                  */}
        {/* ================================================================= */}

        {showCustomize && (
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="absolute right-3 top-3 z-50 w-[min(390px,calc(100vw-24px))] overflow-hidden rounded-[26px] border border-white/10 bg-[#17191e]/95 shadow-[0_30px_100px_rgba(0,0,0,.65)] backdrop-blur-3xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold">
                  Customize Chrome
                </p>

                <p className="mt-1 text-[11px] text-white/35">
                  Personalize your new tab
                </p>
              </div>

              <button
                onClick={() =>
                  setShowCustomize(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-xl text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white/80">
                    Wallpapers
                  </p>

                  <p className="mt-1 text-[10px] text-white/30">
                    Choose a style for your new tab.
                  </p>
                </div>

                <button
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-white/65 transition hover:bg-white/10 hover:text-white"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleWallpaperUpload
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {WALLPAPERS.map((item) => {
                  const selected =
                    wallpaper.value ===
                    item.value;

                  return (
                    <button
                      key={item.label}
                      onClick={() =>
                        selectWallpaper(item)
                      }
                      className={[
                        "group relative aspect-[1.35] overflow-hidden rounded-2xl border transition-all",
                        selected
                          ? "border-sky-400 ring-2 ring-sky-400/20"
                          : "border-white/10 hover:border-white/25",
                      ].join(" ")}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            item.value,
                        }}
                      />

                      <div className="absolute inset-x-0 bottom-0 bg-black/45 px-2 py-1.5 backdrop-blur-md">
                        <span className="text-[10px] font-medium text-white/75">
                          {item.label}
                        </span>
                      </div>

                      {selected && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-400 text-slate-950 shadow-lg">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}

                {wallpaper.type === "image" && (
                  <button
                    onClick={() =>
                      selectWallpaper(
                        DEFAULT_WALLPAPER
                      )
                    }
                    className="relative aspect-[1.35] overflow-hidden rounded-2xl border border-sky-400 ring-2 ring-sky-400/20"
                  >
                    <img
                      src={wallpaper.value}
                      alt="Custom wallpaper"
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1.5 backdrop-blur-md">
                      <span className="text-[10px] font-medium text-white">
                        My Wallpaper
                      </span>
                    </div>

                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-400 text-slate-950">
                      <Check className="h-3 w-3" />
                    </span>
                  </button>
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-purple-300" />

                  <div>
                    <p className="text-xs font-semibold text-white/75">
                      Dynamic browser experience
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-white/35">
                      Your wallpaper is saved locally and
                      will remain after you close and reopen
                      the app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================================================================== */}
      {/* BOTTOM PDF CONTROLS                                                */}
      {/* ================================================================== */}

      {activeTab?.page === "resume" && (
        <div className="shrink-0 border-t border-white/[0.08] bg-[#17191d]/95 px-3 py-2 backdrop-blur-2xl sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="hidden items-center gap-2 text-[11px] text-white/30 sm:flex">
              <FileText className="h-3.5 w-3.5" />

              <span>
                Abhishek_Kuntare_Resume.pdf
              </span>
            </div>

            <div className="mx-auto flex items-center gap-1 rounded-xl border border-white/10 bg-black/20 p-1 sm:mx-0">
              <button
                onClick={zoomOut}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white"
                title="Zoom out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={resetZoom}
                className="min-w-[52px] rounded-lg px-2 py-1 text-[10px] font-mono text-white/65 transition hover:bg-white/10 hover:text-white"
                title="Reset zoom"
              >
                {zoomLevel}%
              </button>

              <button
                onClick={zoomIn}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white"
                title="Zoom in"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={rotateCounterClockwise}
                className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white sm:flex"
                title="Rotate counter-clockwise"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={rotateClockwise}
                className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white sm:flex"
                title="Rotate clockwise"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={handlePrint}
                className="flex h-8 items-center gap-2 rounded-lg px-2.5 text-[10px] text-white/55 transition hover:bg-white/10 hover:text-white"
              >
                <Printer className="h-3.5 w-3.5" />

                <span className="hidden sm:inline">
                  Print
                </span>
              </button>

              <button
                onClick={handleDownload}
                className="flex h-8 items-center gap-2 rounded-lg bg-sky-400 px-3 text-[10px] font-semibold text-slate-950 shadow-lg shadow-sky-400/10 transition hover:bg-sky-300 hover:shadow-sky-400/20"
              >
                <Download className="h-3.5 w-3.5" />

                <span className="hidden sm:inline">
                  Download
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* CONTEXT MENU                                                        */}
      {/* ================================================================== */}

      {contextMenu && (
        <div
          className="fixed z-[200] w-[310px] overflow-hidden rounded-2xl border border-white/10 bg-[#202124]/98 p-1.5 shadow-[0_30px_100px_rgba(0,0,0,.65)] backdrop-blur-3xl"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(event) =>
            event.stopPropagation()
          }
          onContextMenu={(event) =>
            event.preventDefault()
          }
        >
          <BrowserMenuItem
            icon={Pencil}
            label="Add text"
            onClick={() => {
              showToast("Text editing mode");
              setContextMenu(null);
            }}
          />

          <BrowserMenuItem
            icon={ArrowLeft}
            label="Back"
            shortcut="Alt+Left arrow"
            onClick={() => {
              goBack();
              setContextMenu(null);
            }}
            disabled={historyStack.length === 0}
          />

          <BrowserMenuItem
            icon={ArrowRight}
            label="Forward"
            shortcut="Alt+Right arrow"
            onClick={() => {
              goForward();
              setContextMenu(null);
            }}
            disabled={forwardStack.length === 0}
          />

          <BrowserMenuItem
            icon={RefreshCw}
            label="Refresh"
            shortcut="Ctrl+R"
            onClick={() => {
              refreshPage();
              setContextMenu(null);
            }}
          />

          <BrowserMenuItem
            icon={Download}
            label="Save"
            shortcut="Ctrl+S"
            onClick={() => {
              handleDownload();
              setContextMenu(null);
            }}
          />

          <BrowserMenuItem
            icon={Printer}
            label="Print"
            shortcut="Ctrl+P"
            onClick={() => {
              handlePrint();
              setContextMenu(null);
            }}
          />

          <BrowserMenuItem
            icon={Send}
            label="Cast media to device"
            onClick={() => {
              showToast(
                "Cast device selector opened"
              );
              setContextMenu(null);
            }}
          />

          <BrowserMenuItem
            icon={Sparkles}
            label="Summarize with Copilot"
            onClick={() => {
              showToast(
                "AI summary feature opened"
              );
              setContextMenu(null);
            }}
          />

          <div className="my-1.5 h-px bg-white/10" />

          <BrowserMenuItem
            icon={RotateCw}
            label="Rotate clockwise"
            shortcut="Ctrl+]"
            onClick={() => {
              rotateClockwise();
              setContextMenu(null);
            }}
          />

          <BrowserMenuItem
            icon={RotateCcw}
            label="Rotate counterclockwise"
            shortcut="Ctrl+["
            onClick={() => {
              rotateCounterClockwise();
              setContextMenu(null);
            }}
          />

          <div className="my-1.5 h-px bg-white/10" />

          <BrowserMenuItem
            icon={Search}
            label="Visual Search"
            shortcut="Alt+Shift+S"
            onClick={() => {
              showToast(
                "Visual search ready"
              );
              setContextMenu(null);
            }}
          />

          <BrowserMenuItem
            icon={Camera}
            label="Screenshot"
            shortcut="Ctrl+Shift+S"
            onClick={() => {
              takeScreenshot();
              setContextMenu(null);
            }}
          />

          <BrowserMenuItem
            icon={Menu}
            label="More tools"
            right="›"
            onClick={() => {
              showToast(
                "More tools opened"
              );
              setContextMenu(null);
            }}
          />

          <BrowserMenuItem
            icon={Send}
            label="Send tab to your devices"
            onClick={() => {
              showToast(
                "Device sharing opened"
              );
              setContextMenu(null);
            }}
          />

          <div className="my-1.5 h-px bg-white/10" />

          <BrowserMenuItem
            icon={Settings}
            label="Inspect"
            onClick={() => {
              showToast(
                "Developer tools requested"
              );
              setContextMenu(null);
            }}
          />
        </div>
      )}

      {/* ================================================================== */}
      {/* TOAST                                                               */}
      {/* ================================================================== */}

      {toast && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-[300] -translate-x-1/2 animate-[fadeIn_.2s_ease-out]">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#181a1f]/95 px-4 py-2.5 text-xs font-medium text-white shadow-2xl backdrop-blur-xl">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================================================== */
/* Browser Menu Item                                                          */
/* ========================================================================== */

type BrowserMenuItemProps = {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  right?: string;
  disabled?: boolean;
  onClick: () => void;
};

const BrowserMenuItem: React.FC<
  BrowserMenuItemProps
> = ({
  icon: Icon,
  label,
  shortcut,
  right,
  disabled,
  onClick,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] text-white/75 transition hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon className="h-4 w-4 shrink-0 text-white/45 transition group-hover:text-white/80" />

      <span className="min-w-0 flex-1 truncate">
        {label}
      </span>

      {shortcut && (
        <span className="shrink-0 text-[10px] text-white/30">
          {shortcut}
        </span>
      )}

      {right && (
        <span className="shrink-0 text-[11px] text-white/35">
          {right}
        </span>
      )}
    </button>
  );
};