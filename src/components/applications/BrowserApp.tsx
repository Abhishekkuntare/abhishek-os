


import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Search,
  Star,
  Download,
  History,
  MoreVertical,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  Copy,
  FolderKanban,
  FileText,
  Bookmark,
  Check,
  Globe,
  Lock,
  Compass,
  Sparkles,
  StickyNote,
  ZoomIn,
  ZoomOut,
  SlidersHorizontal,
  EyeOff,
  Share2,
  Printer,
  ChevronDown,
  Layers,
  HelpCircle,
  User,
  Settings,
  Puzzle,
  Trash2,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  Save,
  Cast,
  Languages,
  SearchCheck,
  PanelRight,
  Palette,
  Image as ImageIcon,
  CheckCircle2,
  Info,
  RefreshCw,
  CopyCheck,
  Pin,
  Volume2,
  VolumeX,
  Monitor,
  Smartphone,
  Laptop,
  Keyboard,
  Shield,
  Clock3,
  History as HistoryIcon,
  ExternalLinkIcon,
  Menu,
} from "lucide-react";

import { useOS } from "../../context/OSContext";

/* =========================================================
   TYPES
========================================================= */

interface BrowserTab {
  id: string;
  title: string;
  url: string;
  isNewTab: boolean;
  isSearch: boolean;
  searchQuery?: string;
  canEmbed: boolean;

  historyIndex: number;
  history: string[];

  groupId?: string;
  pinned?: boolean;
  muted?: boolean;
}

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  category: "Favorites" | "Portfolio" | "Docs";
}

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: string;
}

interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  category:
    | "Portfolio"
    | "Engineering"
    | "Docs"
    | "Profile"
    | "Web";
  internalApp?: string;
}

interface TabGroup {
  id: string;
  name: string;
  color: string;
  collapsed: boolean;
}

interface DownloadItem {
  id: string;
  name: string;
  size: string;
  type: string;
  status: "Completed" | "In progress";
}

interface Wallpaper {
  id: string;
  name: string;
  type: "image" | "gradient" | "solid";
  value: string;
  preview?: string;
}

interface ClosedTab {
  title: string;
  url: string;
}

/* =========================================================
   STORAGE KEYS
========================================================= */

const BOOKMARKS_KEY = "ak_browser_bookmarks";
const HISTORY_KEY = "ak_browser_history";
const WALLPAPER_KEY = "ak_browser_newtab_wallpaper";
const DOWNLOADS_KEY = "ak_browser_downloads";
const GROUPS_KEY = "ak_browser_tab_groups";
const CLOSED_TABS_KEY = "ak_browser_closed_tabs";

/* =========================================================
   DEFAULT BOOKMARKS
========================================================= */

const DEFAULT_BOOKMARKS: BookmarkItem[] = [
  {
    id: "bm-1",
    title: "GitHub",
    url: "https://github.com/abhishekkuntare",
    category: "Favorites",
  },
  {
    id: "bm-2",
    title: "LinkedIn",
    url: "https://linkedin.com/in/abhishekkuntare",
    category: "Favorites",
  },
  {
    id: "bm-3",
    title: "Portfolio Projects",
    url: "portfolio://projects",
    category: "Portfolio",
  },
  {
    id: "bm-4",
    title: "Developer Resume",
    url: "portfolio://resume",
    category: "Portfolio",
  },
  {
    id: "bm-5",
    title: "React 19 Docs",
    url: "https://react.dev",
    category: "Docs",
  },
  {
    id: "bm-6",
    title: "Next.js Documentation",
    url: "https://nextjs.org/docs",
    category: "Docs",
  },
];

/* =========================================================
   SEARCH DATABASE
========================================================= */

const SEARCH_DATABASE: SearchResultItem[] = [
  {
    id: "res-km",
    title:
      "KrishiMitra AI — Precision Agricultural Diagnostics & Vision Inference",
    url: "portfolio://projects/krishimitra-ai",
    displayUrl:
      "abhishekkuntare.dev/projects/krishimitra-ai",
    snippet:
      "Flagship full-stack AI ecosystem providing farmers with crop pathogen detection, visual inference, dynamic soil health advisory, and multilingual assistance.",
    category: "Portfolio",
    internalApp: "projects",
  },

  {
    id: "res-clacko",
    title:
      "Clacko — Collaborative Real-Time Workspace Platform",
    url: "portfolio://projects/clacko",
    displayUrl:
      "abhishekkuntare.dev/projects/clacko",
    snippet:
      "Production collaboration platform combining synchronized communication, collaborative workspace tools, presence detection, and role-based permissions.",
    category: "Portfolio",
    internalApp: "projects",
  },

  {
    id: "res-profile",
    title:
      "Abhishek Kuntare — Full-Stack & AI Systems Developer",
    url: "portfolio://about",
    displayUrl:
      "abhishekkuntare.dev/about",
    snippet:
      "Developer profile covering React, TypeScript, Node.js, AI systems, full-stack applications, and modern web architecture.",
    category: "Profile",
    internalApp: "about",
  },

  {
    id: "res-react",
    title:
      "React Documentation",
    url: "https://react.dev",
    displayUrl:
      "react.dev",
    snippet:
      "Official React documentation covering components, hooks, actions, APIs, and modern React application architecture.",
    category: "Docs",
  },

  {
    id: "res-next",
    title:
      "Next.js Documentation",
    url: "https://nextjs.org/docs",
    displayUrl:
      "nextjs.org/docs",
    snippet:
      "Official Next.js documentation covering App Router, server rendering, routing, caching, and full-stack React applications.",
    category: "Docs",
  },

  {
    id: "res-gemini",
    title:
      "Google Gemini API Documentation",
    url: "https://ai.google.dev/",
    displayUrl:
      "ai.google.dev",
    snippet:
      "Google documentation for Gemini APIs, multimodal models, structured output, tools, and application integration.",
    category: "Engineering",
  },

  {
    id: "res-gh",
    title:
      "GitHub — Abhishek Kuntare",
    url: "https://github.com/abhishekkuntare",
    displayUrl:
      "github.com/abhishekkuntare",
    snippet:
      "Open-source repositories, experiments, web applications, AI systems, and development projects.",
    category: "Profile",
  },

  {
    id: "res-resume",
    title:
      "Abhishek Kuntare Resume",
    url: "portfolio://resume",
    displayUrl:
      "abhishekkuntare.dev/resume.pdf",
    snippet:
      "Developer resume containing professional experience, technical competencies, education, and project work.",
    category: "Portfolio",
    internalApp: "resume",
  },

  {
    id: "res-browser",
    title:
      "Abhishek Browser — Developer Workstation",
    url: "portfolio://browser",
    displayUrl:
      "abhishekkuntare.dev/browser",
    snippet:
      "Built-in workstation browser with tabs, search, bookmarks, history, AI assistance, and desktop integration.",
    category: "Engineering",
    internalApp: "browser",
  },

  {
    id: "res-projects",
    title:
      "Abhishek's Project Showcase",
    url: "portfolio://projects",
    displayUrl:
      "abhishekkuntare.dev/projects",
    snippet:
      "Explore applications, experiments, websites, AI systems, and software projects.",
    category: "Portfolio",
    internalApp: "projects",
  },
];

/* =========================================================
   WALLPAPERS
========================================================= */

const DEFAULT_WALLPAPERS: Wallpaper[] = [
  {
    id: "default",
    name: "Default",
    type: "gradient",
    value:
      "radial-gradient(circle at 50% 20%, rgba(59,130,246,.28), transparent 35%), linear-gradient(135deg,#07111f 0%,#0b1220 45%,#101827 100%)",
  },

  {
    id: "blue",
    name: "Blue Aurora",
    type: "gradient",
    value:
      "radial-gradient(circle at 25% 20%, rgba(37,99,235,.55), transparent 35%), radial-gradient(circle at 80% 70%, rgba(14,165,233,.35), transparent 38%), linear-gradient(135deg,#020617,#0f172a,#111827)",
  },

  {
    id: "purple",
    name: "Purple Space",
    type: "gradient",
    value:
      "radial-gradient(circle at 20% 30%, rgba(124,58,237,.65), transparent 35%), radial-gradient(circle at 80% 20%, rgba(236,72,153,.32), transparent 30%), linear-gradient(145deg,#09051a,#170b2e,#050816)",
  },

  {
    id: "sunset",
    name: "Sunset",
    type: "gradient",
    value:
      "radial-gradient(circle at 50% 25%, rgba(249,115,22,.6), transparent 32%), radial-gradient(circle at 80% 75%, rgba(236,72,153,.4), transparent 40%), linear-gradient(135deg,#1e0b08,#32111c,#111827)",
  },

  {
    id: "ocean",
    name: "Ocean",
    type: "gradient",
    value:
      "radial-gradient(circle at 30% 30%, rgba(6,182,212,.45), transparent 35%), radial-gradient(circle at 75% 70%, rgba(59,130,246,.4), transparent 35%), linear-gradient(135deg,#03131c,#062b35,#071827)",
  },

  {
    id: "forest",
    name: "Forest",
    type: "gradient",
    value:
      "radial-gradient(circle at 25% 20%, rgba(34,197,94,.32), transparent 32%), radial-gradient(circle at 75% 75%, rgba(16,185,129,.3), transparent 38%), linear-gradient(135deg,#03120c,#071f17,#08111a)",
  },

  {
    id: "midnight",
    name: "Midnight",
    type: "solid",
    value: "#030712",
  },

  {
    id: "slate",
    name: "Slate",
    type: "solid",
    value: "#111827",
  },
];

/* =========================================================
   EMBEDDING
========================================================= */

const KNOWN_EMBED_FRIENDLY_DOMAINS = [
  "wikipedia.org",
  "archive.org",
  "openstreetmap.org",
];

/* =========================================================
   HELPERS
========================================================= */

const createNewTab = (): BrowserTab => ({
  id: `tab-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`,
  title: "New Tab",
  url: "",
  isNewTab: true,
  isSearch: false,
  canEmbed: false,
  historyIndex: 0,
  history: [""],
});

const formatTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const normalizeDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(
      /^www\./,
      "",
    );
  } catch {
    return url;
  }
};

const isLikelyUrl = (value: string) => {
  const text = value.trim();

  return (
    /^https?:\/\//i.test(text) ||
    /^www\./i.test(text) ||
    /^[a-z0-9-]+\.[a-z]{2,}/i.test(text)
  );
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* =========================================================
   COMPONENT
========================================================= */

export const BrowserApp: React.FC = () => {
  const {
    openApp,
    addNotification,
  } = useOS();

  /* =======================================================
     TABS
  ======================================================= */

  const [tabs, setTabs] = useState<BrowserTab[]>([
    createNewTab(),
  ]);

  const [activeTabId, setActiveTabId] =
    useState<string>(tabs[0].id);

  /* =======================================================
     ADDRESS BAR
  ======================================================= */

  const [urlInput, setUrlInput] =
    useState<string>("");

  const [urlFocused, setUrlFocused] =
    useState(false);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  /* =======================================================
     BROWSER UI
  ======================================================= */

  const [zoomLevel, setZoomLevel] =
    useState<number>(100);

  const [isIncognito, setIsIncognito] =
    useState(false);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [showBrowserMenu, setShowBrowserMenu] =
    useState(false);

  const [showHistoryModal, setShowHistoryModal] =
    useState(false);

  const [showDownloadsModal, setShowDownloadsModal] =
    useState(false);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [showCustomize, setShowCustomize] =
    useState(false);

  const [showFind, setShowFind] =
    useState(false);

  const [findQuery, setFindQuery] =
    useState("");

  const [findMatches, setFindMatches] =
    useState(0);

  const [showSettings, setShowSettings] =
    useState(false);

  const [showExtensions, setShowExtensions] =
    useState(false);

  const [showTabGroups, setShowTabGroups] =
    useState(false);

  const [showShareMenu, setShowShareMenu] =
    useState(false);

  const [showCastMenu, setShowCastMenu] =
    useState(false);

  const [showMoreTools, setShowMoreTools] =
    useState(false);

  const [showDeleteData, setShowDeleteData] =
    useState(false);

  const [showAbout, setShowAbout] =
    useState(false);

  const [showAiPanel, setShowAiPanel] =
    useState(false);

  const [copiedUrl, setCopiedUrl] =
    useState(false);

  const [savedNotePrompt, setSavedNotePrompt] =
    useState(false);

  const [searchCategoryFilter, setSearchCategoryFilter] =
    useState<
      "All" | "Portfolio" | "Engineering" | "Docs" | "Profile"
    >("All");

  /* =======================================================
     BOOKMARKS
  ======================================================= */

  const [bookmarks, setBookmarks] =
    useState<BookmarkItem[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            BOOKMARKS_KEY,
          );

        return saved
          ? JSON.parse(saved)
          : DEFAULT_BOOKMARKS;
      } catch {
        return DEFAULT_BOOKMARKS;
      }
    });

  /* =======================================================
     HISTORY
  ======================================================= */

  const [historyList, setHistoryList] =
    useState<HistoryItem[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            HISTORY_KEY,
          );

        return saved
          ? JSON.parse(saved)
          : [
              {
                id: "h-1",
                title:
                  "Abhishek Developer Workstation",
                url: "portfolio://home",
                timestamp: "Today, 10:20 AM",
              },
              {
                id: "h-2",
                title:
                  "KrishiMitra AI Search",
                url: "search:KrishiMitra AI",
                timestamp: "Today, 10:28 AM",
              },
            ];
      } catch {
        return [];
      }
    });

  /* =======================================================
     DOWNLOADS
  ======================================================= */

  const [downloads, setDownloads] =
    useState<DownloadItem[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            DOWNLOADS_KEY,
          );

        return saved
          ? JSON.parse(saved)
          : [
              {
                id: "download-1",
                name:
                  "Abhishek_Kuntare_Resume.pdf",
                size: "142 KB",
                type: "PDF Document",
                status: "Completed",
              },
            ];
      } catch {
        return [];
      }
    });

  /* =======================================================
     TAB GROUPS
  ======================================================= */

  const [tabGroups, setTabGroups] =
    useState<TabGroup[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            GROUPS_KEY,
          );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    });

  /* =======================================================
     CLOSED TABS
  ======================================================= */

  const [closedTabs, setClosedTabs] =
    useState<ClosedTab[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            CLOSED_TABS_KEY,
          );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    });

  /* =======================================================
     WALLPAPER
  ======================================================= */

  const [selectedWallpaperId, setSelectedWallpaperId] =
    useState<string>(() => {
      try {
        return (
          localStorage.getItem(
            WALLPAPER_KEY,
          ) || "default"
        );
      } catch {
        return "default";
      }
    });

  const [customWallpaperUrl, setCustomWallpaperUrl] =
    useState("");

  /* =======================================================
     UI REFS
  ======================================================= */

  const addressRef =
    useRef<HTMLInputElement>(null);

  const findRef =
    useRef<HTMLInputElement>(null);

  const browserRootRef =
    useRef<HTMLDivElement>(null);

  /* =======================================================
     ACTIVE TAB
  ======================================================= */

  const activeTab =
    tabs.find(
      (tab) =>
        tab.id === activeTabId,
    ) || tabs[0];

  /* =======================================================
     PERSISTENCE
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      BOOKMARKS_KEY,
      JSON.stringify(bookmarks),
    );
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(historyList),
    );
  }, [historyList]);

  useEffect(() => {
    localStorage.setItem(
      DOWNLOADS_KEY,
      JSON.stringify(downloads),
    );
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem(
      GROUPS_KEY,
      JSON.stringify(tabGroups),
    );
  }, [tabGroups]);

  useEffect(() => {
    localStorage.setItem(
      CLOSED_TABS_KEY,
      JSON.stringify(closedTabs),
    );
  }, [closedTabs]);

  useEffect(() => {
    localStorage.setItem(
      WALLPAPER_KEY,
      selectedWallpaperId,
    );
  }, [selectedWallpaperId]);

  /* =======================================================
     SYNC ADDRESS BAR
  ======================================================= */

  useEffect(() => {
    if (!activeTab) return;

    if (
      activeTab.isSearch &&
      activeTab.searchQuery
    ) {
      setUrlInput(
        activeTab.searchQuery,
      );
    } else {
      setUrlInput(
        activeTab.url || "",
      );
    }
  }, [
    activeTabId,
    activeTab?.url,
    activeTab?.isSearch,
    activeTab?.searchQuery,
  ]);

  /* =======================================================
     SAVE HISTORY
  ======================================================= */

  const saveHistory = useCallback(
    (
      title: string,
      url: string,
    ) => {
      if (isIncognito) return;

      const item: HistoryItem = {
        id: `h-${Date.now()}`,
        title,
        url,
        timestamp: `Today, ${formatTime()}`,
      };

      setHistoryList((previous) => [
        item,
        ...previous
          .filter(
            (entry) =>
              entry.url !== url,
          )
          .slice(0, 49),
      ]);
    },
    [isIncognito],
  );

  /* =======================================================
     SEARCH ENGINE
  ======================================================= */

  const searchResults = useMemo(() => {
    if (
      !activeTab?.isSearch ||
      !activeTab.searchQuery
    ) {
      return [];
    }

    const query =
      activeTab.searchQuery
        .trim()
        .toLowerCase();

    if (!query) return [];

    return SEARCH_DATABASE.filter(
      (item) => {
        const text = [
          item.title,
          item.snippet,
          item.displayUrl,
          item.category,
        ]
          .join(" ")
          .toLowerCase();

        const matches =
          text.includes(query);

        const categoryMatches =
          searchCategoryFilter ===
            "All" ||
          item.category ===
            searchCategoryFilter;

        return (
          matches &&
          categoryMatches
        );
      },
    );
  }, [
    activeTab?.isSearch,
    activeTab?.searchQuery,
    searchCategoryFilter,
  ]);

  /* =======================================================
     SUGGESTIONS
  ======================================================= */

  const suggestions = useMemo(() => {
    const query =
      urlInput.trim().toLowerCase();

    if (!query) {
      return [];
    }

    const localSuggestions =
      SEARCH_DATABASE.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(query) ||
          item.displayUrl
            .toLowerCase()
            .includes(query),
      ).slice(0, 5);

    const historySuggestions =
      historyList
        .filter(
          (item) =>
            item.title
              .toLowerCase()
              .includes(query) ||
            item.url
              .toLowerCase()
              .includes(query),
        )
        .slice(0, 4);

    return [
      ...localSuggestions.map(
        (item) => ({
          type: "result" as const,
          title: item.title,
          subtitle: item.displayUrl,
          url: item.url,
        }),
      ),

      ...historySuggestions.map(
        (item) => ({
          type: "history" as const,
          title: item.title,
          subtitle: item.url,
          url: item.url,
        }),
      ),
    ].slice(0, 8);
  }, [
    urlInput,
    historyList,
  ]);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigateTo = useCallback(
    (rawInput: string) => {
      const input =
        rawInput.trim();

      if (!input) return;

      let targetUrl = input;
      let title = input;

      let isSearch = false;
      let searchQuery = "";

      /* -----------------------------------------------
         PORTFOLIO INTERNAL URL
      ------------------------------------------------ */

      if (
        targetUrl.startsWith(
          "portfolio://",
        )
      ) {
        const route =
          targetUrl
            .replace(
              "portfolio://",
              "",
            )
            .split("/")[0];

        title =
          `Abhishek OS — ${
            route
              .charAt(0)
              .toUpperCase() +
            route.slice(1)
          }`;

        const internalApps = [
          "projects",
          "resume",
          "about",
          "skills",
          "experience",
          "terminal",
          "git",
          "api-tester",
          "ai",
          "browser",
        ];

        if (
          internalApps.includes(
            route,
          )
        ) {
          openApp(route as any);
        }
      }

      /* -----------------------------------------------
         SEARCH PREFIX
      ------------------------------------------------ */

      else if (
        targetUrl.startsWith(
          "search:",
        )
      ) {
        isSearch = true;

        searchQuery =
          targetUrl
            .replace(
              "search:",
              "",
            )
            .trim();

        title =
          `${searchQuery} — Search`;
      }

      /* -----------------------------------------------
         NORMAL SEARCH
      ------------------------------------------------ */

      else if (
        !isLikelyUrl(
          targetUrl,
        ) &&
        !targetUrl.includes("://")
      ) {
        isSearch = true;

        searchQuery =
          targetUrl;

        targetUrl =
          `search:${searchQuery}`;

        title =
          `${searchQuery} — Search`;
      }

      /* -----------------------------------------------
         URL
      ------------------------------------------------ */

      else {
        if (
          !targetUrl.startsWith(
            "http://",
          ) &&
          !targetUrl.startsWith(
            "https://",
          )
        ) {
          targetUrl =
            `https://${targetUrl}`;
        }

        try {
          const url =
            new URL(
              targetUrl,
            );

          title =
            url.hostname.replace(
              /^www\./,
              "",
            );
        } catch {
          title =
            targetUrl;
        }
      }

      const canEmbed =
        KNOWN_EMBED_FRIENDLY_DOMAINS.some(
          (domain) =>
            targetUrl
              .toLowerCase()
              .includes(domain),
        );

      setTabs((previous) =>
        previous.map(
          (tab) => {
            if (
              tab.id !==
              activeTabId
            ) {
              return tab;
            }

            const newHistory = [
              ...tab.history.slice(
                0,
                tab.historyIndex +
                  1,
              ),
              targetUrl,
            ];

            return {
              ...tab,
              title,
              url: targetUrl,
              isNewTab: false,
              isSearch,
              searchQuery:
                isSearch
                  ? searchQuery
                  : undefined,
              canEmbed,
              history:
                newHistory,
              historyIndex:
                newHistory.length -
                1,
            };
          },
        ),
      );

      setShowSuggestions(false);

      saveHistory(
        title,
        targetUrl,
      );
    },
    [
      activeTabId,
      openApp,
      saveHistory,
    ],
  );

  /* =======================================================
     SEARCH SUBMIT
  ======================================================= */

  const handleUrlSubmit = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    navigateTo(
      urlInput,
    );

    addressRef.current?.blur();
  };

  /* =======================================================
     NEW TAB
  ======================================================= */

  const createTab = useCallback(
    () => {
      const tab =
        createNewTab();

      setTabs((previous) => [
        ...previous,
        tab,
      ]);

      setActiveTabId(
        tab.id,
      );

      setShowBrowserMenu(false);
      setShowCustomize(false);
    },
    [],
  );

  /* =======================================================
     CLOSE TAB
  ======================================================= */

  const closeTab = (
    tabId: string,
    event?: React.MouseEvent,
  ) => {
    event?.stopPropagation();

    const tab =
      tabs.find(
        (item) =>
          item.id === tabId,
      );

    if (!tab) return;

    setClosedTabs(
      (previous) => [
        {
          title: tab.title,
          url: tab.url,
        },
        ...previous,
      ].slice(0, 10),
    );

    if (
      tabs.length === 1
    ) {
      const replacement =
        createNewTab();

      setTabs([
        replacement,
      ]);

      setActiveTabId(
        replacement.id,
      );

      return;
    }

    const index =
      tabs.findIndex(
        (item) =>
          item.id === tabId,
      );

    const nextTabs =
      tabs.filter(
        (item) =>
          item.id !== tabId,
      );

    setTabs(nextTabs);

    if (
      activeTabId ===
      tabId
    ) {
      const nextIndex =
        Math.max(
          0,
          Math.min(
            index,
            nextTabs.length -
              1,
          ),
        );

      setActiveTabId(
        nextTabs[nextIndex].id,
      );
    }
  };

  /* =======================================================
     REOPEN CLOSED TAB
  ======================================================= */

  const reopenClosedTab =
    () => {
      if (
        closedTabs.length ===
        0
      ) {
        return;
      }

      const last =
        closedTabs[0];

      const tab =
        createNewTab();

      const nextTab: BrowserTab =
        {
          ...tab,
          title:
            last.title ||
            "New Tab",
          url:
            last.url || "",
          isNewTab:
            !last.url,
          isSearch:
            last.url.startsWith(
              "search:",
            ),
          searchQuery:
            last.url.startsWith(
              "search:",
            )
              ? last.url.replace(
                  "search:",
                  "",
                )
              : undefined,
          history: [
            "",
            last.url,
          ],
          historyIndex:
            last.url ? 1 : 0,
          canEmbed:
            KNOWN_EMBED_FRIENDLY_DOMAINS.some(
              (domain) =>
                last.url
                  .toLowerCase()
                  .includes(domain),
            ),
        };

      setTabs(
        (previous) => [
          ...previous,
          nextTab,
        ],
      );

      setActiveTabId(
        nextTab.id,
      );

      setClosedTabs(
        (previous) =>
          previous.slice(1),
      );
    };

  /* =======================================================
     DUPLICATE TAB
  ======================================================= */

  const duplicateActiveTab =
    () => {
      if (!activeTab) return;

      const duplicated: BrowserTab =
        {
          ...activeTab,
          id: `tab-${Date.now()}`,
        };

      setTabs(
        (previous) => [
          ...previous,
          duplicated,
        ],
      );

      setActiveTabId(
        duplicated.id,
      );

      setShowBrowserMenu(false);
    };

  /* =======================================================
     BACK
  ======================================================= */

  const goBack = () => {
    if (
      !activeTab ||
      activeTab.historyIndex <=
        0
    ) {
      return;
    }

    const newIndex =
      activeTab.historyIndex -
      1;

    const previousUrl =
      activeTab.history[
        newIndex
      ];

    const isSearch =
      previousUrl.startsWith(
        "search:",
      );

    const searchQuery =
      isSearch
        ? previousUrl.replace(
            "search:",
            "",
          )
        : undefined;

    setTabs(
      (previous) =>
        previous.map(
          (tab) =>
            tab.id ===
            activeTabId
              ? {
                  ...tab,
                  url:
                    previousUrl,
                  isNewTab:
                    previousUrl ===
                    "",
                  isSearch,
                  searchQuery,
                  canEmbed:
                    KNOWN_EMBED_FRIENDLY_DOMAINS.some(
                      (domain) =>
                        previousUrl
                          .toLowerCase()
                          .includes(
                            domain,
                          ),
                    ),
                  historyIndex:
                    newIndex,
                }
              : tab,
        ),
    );
  };

  /* =======================================================
     FORWARD
  ======================================================= */

  const goForward = () => {
    if (
      !activeTab ||
      activeTab.historyIndex >=
        activeTab.history.length -
          1
    ) {
      return;
    }

    const newIndex =
      activeTab.historyIndex +
      1;

    const nextUrl =
      activeTab.history[
        newIndex
      ];

    const isSearch =
      nextUrl.startsWith(
        "search:",
      );

    const searchQuery =
      isSearch
        ? nextUrl.replace(
            "search:",
            "",
          )
        : undefined;

    setTabs(
      (previous) =>
        previous.map(
          (tab) =>
            tab.id ===
            activeTabId
              ? {
                  ...tab,
                  url:
                    nextUrl,
                  isNewTab:
                    nextUrl ===
                    "",
                  isSearch,
                  searchQuery,
                  canEmbed:
                    KNOWN_EMBED_FRIENDLY_DOMAINS.some(
                      (domain) =>
                        nextUrl
                          .toLowerCase()
                          .includes(
                            domain,
                          ),
                    ),
                  historyIndex:
                    newIndex,
                }
              : tab,
        ),
    );
  };

  /* =======================================================
     RELOAD
  ======================================================= */

  const reloadPage = () => {
    if (!activeTab) return;

    if (
      activeTab.isSearch
    ) {
      setTabs(
        (previous) =>
          previous.map(
            (tab) =>
              tab.id ===
              activeTabId
                ? {
                    ...tab,
                    title:
                      `${
                        tab.searchQuery ||
                        ""
                      } — Search`,
                  }
                : tab,
          ),
      );

      return;
    }

    if (
      activeTab.url
    ) {
      setTabs(
        (previous) =>
          previous.map(
            (tab) =>
              tab.id ===
              activeTabId
                ? {
                    ...tab,
                  }
                : tab,
          ),
      );
    }
  };

  /* =======================================================
     BOOKMARK
  ======================================================= */

  const isCurrentBookmarked =
    bookmarks.some(
      (bookmark) =>
        bookmark.url ===
        activeTab?.url,
    );

  const toggleBookmark =
    () => {
      if (
        !activeTab ||
        activeTab.isNewTab
      ) {
        return;
      }

      if (
        isCurrentBookmarked
      ) {
        setBookmarks(
          (previous) =>
            previous.filter(
              (bookmark) =>
                bookmark.url !==
                activeTab.url,
            ),
        );
      } else {
        setBookmarks(
          (previous) => [
            ...previous,
            {
              id: `bm-${Date.now()}`,
              title:
                activeTab.title,
              url:
                activeTab.url,
              category:
                "Favorites",
            },
          ],
        );
      }
    };

  /* =======================================================
     COPY URL
  ======================================================= */

  const copyCurrentUrl =
    async () => {
      if (
        !activeTab?.url
      ) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          activeTab.url,
        );
      } catch {
        // Ignore clipboard failure.
      }

      setCopiedUrl(true);

      setTimeout(
        () =>
          setCopiedUrl(false),
        1800,
      );
    };

  /* =======================================================
     ZOOM
  ======================================================= */

  const zoomIn = () => {
    setZoomLevel(
      (previous) =>
        Math.min(
          200,
          previous + 10,
        ),
    );
  };

  const zoomOut = () => {
    setZoomLevel(
      (previous) =>
        Math.max(
          50,
          previous - 10,
        ),
    );
  };

  const resetZoom = () =>
    setZoomLevel(100);

  /* =======================================================
     FIND
  ======================================================= */

  useEffect(() => {
    if (!findQuery) {
      setFindMatches(0);
      return;
    }

    const text = document.body.innerText;

    const matches =
      text.match(
        new RegExp(
          escapeRegExp(
            findQuery,
          ),
          "gi",
        ),
      ) || [];

    setFindMatches(
      matches.length,
    );
  }, [
    findQuery,
    activeTabId,
  ]);

  useEffect(() => {
    if (
      showFind
    ) {
      setTimeout(
        () =>
          findRef.current?.focus(),
        50,
      );
    }
  }, [showFind]);

  /* =======================================================
     SAVE AI TO NOTES
  ======================================================= */

  const handleSaveAiToNotes =
    (
      titleText: string,
      bodyText: string,
    ) => {
      try {
        const existingRaw =
          localStorage.getItem(
            "ak_notes_app_data",
          );

        const existing =
          existingRaw
            ? JSON.parse(
                existingRaw,
              )
            : [];

        const newNote = {
          id: `note-browser-${Date.now()}`,
          title:
            titleText,
          content:
            bodyText,
          category:
            "Personal" as const,
          updatedAt:
            "Just now",
        };

        localStorage.setItem(
          "ak_notes_app_data",
          JSON.stringify([
            newNote,
            ...existing,
          ]),
        );

        setSavedNotePrompt(
          true,
        );

        setTimeout(
          () =>
            setSavedNotePrompt(
              false,
            ),
          2500,
        );

        addNotification({
          title:
            "Saved to Workstation Notes",
          message:
            `"${titleText}" was saved to your Notes app.`,
          type: "info",
          appId: "notes",
        });
      } catch {
        // Ignore.
      }
    };

  /* =======================================================
     DOWNLOAD RESUME
  ======================================================= */

  const downloadResume =
    () => {
      const item: DownloadItem =
        {
          id: `download-${Date.now()}`,
          name:
            "Abhishek_Kuntare_Resume.pdf",
          size: "142 KB",
          type: "PDF Document",
          status:
            "Completed",
        };

      setDownloads(
        (previous) => [
          item,
          ...previous,
        ],
      );

      addNotification({
        title:
          "Download completed",
        message:
          item.name,
        type: "info",
        appId: "browser",
      });
    };

  /* =======================================================
     WALLPAPER
  ======================================================= */

  const activeWallpaper =
    DEFAULT_WALLPAPERS.find(
      (wallpaper) =>
        wallpaper.id ===
        selectedWallpaperId,
    ) ||
    DEFAULT_WALLPAPERS[0];

  const wallpaperStyle =
    activeWallpaper.type ===
    "image"
      ? {
          backgroundImage: `url("${activeWallpaper.value}")`,
          backgroundSize:
            "cover",
          backgroundPosition:
            "center",
        }
      : {
          background:
            activeWallpaper.value,
        };

  /* =======================================================
     CUSTOM WALLPAPER
  ======================================================= */

  const applyCustomWallpaper =
    () => {
      if (
        !customWallpaperUrl.trim()
      ) {
        return;
      }

      const custom: Wallpaper =
        {
          id: "custom",
          name:
            "Custom wallpaper",
          type: "image",
          value:
            customWallpaperUrl.trim(),
        };

      localStorage.setItem(
        "ak_browser_custom_wallpaper",
        JSON.stringify(
          custom,
        ),
      );

      setSelectedWallpaperId(
        "custom",
      );
    };

  /* =======================================================
     CREATE TAB GROUP
  ======================================================= */

  const createTabGroup =
    () => {
      const group: TabGroup =
        {
          id: `group-${Date.now()}`,
          name:
            "New group",
          color:
            "sky",
          collapsed:
            false,
        };

      setTabGroups(
        (previous) => [
          ...previous,
          group,
        ],
      );

      if (activeTab) {
        setTabs(
          (previous) =>
            previous.map(
              (tab) =>
                tab.id ===
                activeTabId
                  ? {
                      ...tab,
                      groupId:
                        group.id,
                    }
                  : tab,
            ),
        );
      }
    };

  /* =======================================================
     TOGGLE TAB PIN
  ======================================================= */

  const togglePinTab =
    () => {
      setTabs(
        (previous) =>
          previous.map(
            (tab) =>
              tab.id ===
              activeTabId
                ? {
                    ...tab,
                    pinned:
                      !tab.pinned,
                  }
                : tab,
          ),
      );
    };

  /* =======================================================
     TOGGLE MUTE
  ======================================================= */

  const toggleMuteTab =
    () => {
      setTabs(
        (previous) =>
          previous.map(
            (tab) =>
              tab.id ===
              activeTabId
                ? {
                    ...tab,
                    muted:
                      !tab.muted,
                  }
                : tab,
          ),
      );
    };

  /* =======================================================
     DELETE BROWSING DATA
  ======================================================= */

  const deleteBrowsingData =
    () => {
      setHistoryList([]);

      localStorage.removeItem(
        HISTORY_KEY,
      );

      addNotification({
        title:
          "Browsing data deleted",
        message:
          "Your browser history has been cleared.",
        type: "info",
        appId: "browser",
      });

      setShowDeleteData(
        false,
      );
    };

  /* =======================================================
     SHARE
  ======================================================= */

  const shareCurrentPage =
    async () => {
      const shareData = {
        title:
          activeTab?.title ||
          "Abhishek Browser",
        url:
          activeTab?.url ||
          window.location.href,
      };

      try {
        if (
          navigator.share
        ) {
          await navigator.share(
            shareData,
          );
        } else {
          await navigator.clipboard.writeText(
            shareData.url,
          );

          addNotification({
            title:
              "Link copied",
            message:
              "Sharing is not supported here, so the link was copied instead.",
            type: "info",
            appId: "browser",
          });
        }
      } catch {
        // User cancelled.
      }

      setShowShareMenu(false);
    };

  /* =======================================================
     PRINT
  ======================================================= */

  const printPage =
    () => {
      window.print();
      setShowMoreTools(
        false,
      );
    };

  /* =======================================================
     FULLSCREEN
  ======================================================= */

  const toggleFullscreen =
    async () => {
      try {
        if (
          !document.fullscreenElement
        ) {
          await browserRootRef.current?.requestFullscreen?.();
          setIsFullscreen(
            true,
          );
        } else {
          await document.exitFullscreen?.();
          setIsFullscreen(
            false,
          );
        }
      } catch {
        setIsFullscreen(
          (previous) =>
            !previous,
        );
      }
    };

  /* =======================================================
     OPEN EXTERNAL
  ======================================================= */

  const openExternal =
    () => {
      if (
        !activeTab?.url
      ) {
        return;
      }

      window.open(
        activeTab.url,
        "_blank",
        "noopener,noreferrer",
      );
    };

  /* =======================================================
     GOOGLE SEARCH FALLBACK
  ======================================================= */

  const searchGoogle =
    () => {
      const query =
        activeTab?.searchQuery ||
        urlInput.trim();

      if (!query) return;

      const googleUrl =
        `https://www.google.com/search?q=${encodeURIComponent(
          query,
        )}`;

      window.open(
        googleUrl,
        "_blank",
        "noopener,noreferrer",
      );
    };

  /* =======================================================
     KEYBOARD SHORTCUTS
  ======================================================= */

  useEffect(() => {
    const handleKeyboard =
      (
        event: KeyboardEvent,
      ) => {
        const modifier =
          event.ctrlKey ||
          event.metaKey;

        if (
          modifier &&
          event.key === "l"
        ) {
          event.preventDefault();

          addressRef.current?.focus();
          addressRef.current?.select();

          return;
        }

        if (
          modifier &&
          event.key === "t"
        ) {
          event.preventDefault();
          createTab();

          return;
        }

        if (
          modifier &&
          event.key === "w"
        ) {
          event.preventDefault();
          closeTab(
            activeTabId,
          );

          return;
        }

        if (
          modifier &&
          event.key === "r"
        ) {
          event.preventDefault();
          reloadPage();

          return;
        }

        if (
          modifier &&
          event.key === "h"
        ) {
          event.preventDefault();

          setShowHistoryModal(
            true,
          );

          return;
        }

        if (
          modifier &&
          event.key === "d"
        ) {
          event.preventDefault();

          toggleBookmark();

          return;
        }

        if (
          modifier &&
          event.key === "f"
        ) {
          event.preventDefault();

          setShowFind(true);

          return;
        }

        if (
          modifier &&
          event.key === "="
        ) {
          event.preventDefault();
          zoomIn();

          return;
        }

        if (
          modifier &&
          event.key === "-"
        ) {
          event.preventDefault();
          zoomOut();

          return;
        }

        if (
          event.key ===
          "Escape"
        ) {
          setShowBrowserMenu(
            false,
          );

          setShowProfileMenu(
            false,
          );

          setShowCustomize(
            false,
          );

          setShowExtensions(
            false,
          );

          setShowTabGroups(
            false,
          );

          setShowShareMenu(
            false,
          );

          setShowCastMenu(
            false,
          );

          setShowMoreTools(
            false,
          );
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyboard,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyboard,
      );
  }, [
    activeTabId,
    createTab,
    reloadPage,
    toggleBookmark,
  ]);

  /* =======================================================
     CUSTOM WALLPAPER LOAD
  ======================================================= */

  const customWallpaper =
    useMemo(() => {
      try {
        const saved =
          localStorage.getItem(
            "ak_browser_custom_wallpaper",
          );

        return saved
          ? JSON.parse(saved)
          : null;
      } catch {
        return null;
      }
    }, [
      selectedWallpaperId,
    ]);

  const allWallpapers =
    customWallpaper
      ? [
          ...DEFAULT_WALLPAPERS,
          customWallpaper,
        ]
      : DEFAULT_WALLPAPERS;

  const renderedWallpaper =
    allWallpapers.find(
      (item: Wallpaper) =>
        item.id ===
        selectedWallpaperId,
    ) ||
    activeWallpaper;

  const renderedWallpaperStyle =
    renderedWallpaper.type ===
    "image"
      ? {
          backgroundImage: `url("${renderedWallpaper.value}")`,
          backgroundSize:
            "cover",
          backgroundPosition:
            "center",
        }
      : {
          background:
            renderedWallpaper.value,
        };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      ref={browserRootRef}
      className="
        relative
        flex
        flex-col
        h-full
        w-full
        overflow-hidden
        select-none
        font-sans
        text-slate-100
        bg-[#0b0f17]
      "
    >
      {/* ===================================================
          BACKDROP
      =================================================== */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          opacity-40
        "
        style={{
          background:
            "radial-gradient(circle at 50% -20%, rgba(56,189,248,.16), transparent 42%)",
        }}
      />

      {/* ===================================================
          TOP TAB BAR
      =================================================== */}

      <div
        className="
          relative
          z-[60]
          flex
          items-end
          gap-1
          px-2
          pt-2
          h-[43px]
          bg-[#11151d]
          border-b
          border-white/[0.07]
        "
      >
        {/* Tabs */}

        <div
          className="
            flex
            items-end
            gap-1
            min-w-0
            flex-1
            overflow-x-auto
            no-scrollbar
          "
        >
          {tabs.map(
            (tab) => {
              const active =
                tab.id ===
                activeTabId;

              const group =
                tabGroups.find(
                  (item) =>
                    item.id ===
                    tab.groupId,
                );

              return (
                <div
                  key={tab.id}
                  onClick={() =>
                    setActiveTabId(
                      tab.id,
                    )
                  }
                  onDoubleClick={() =>
                    togglePinTab()
                  }
                  className={`
                    group
                    relative
                    flex
                    items-center
                    gap-2
                    min-w-[150px]
                    max-w-[245px]
                    h-[35px]
                    px-3
                    rounded-t-xl
                    cursor-pointer
                    transition-all
                    duration-200
                    ${
                      active
                        ? "bg-[#202631] text-white shadow-[0_-1px_20px_rgba(56,189,248,.08)]"
                        : "bg-transparent text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"
                    }
                  `}
                >
                  {group && (
                    <span
                      className="
                        absolute
                        top-0
                        left-3
                        right-3
                        h-[2px]
                        rounded-full
                        bg-sky-400
                      "
                    />
                  )}

                  {tab.pinned ? (
                    <Pin
                      className="
                        w-3
                        h-3
                        text-sky-400
                        shrink-0
                      "
                    />
                  ) : tab.isSearch ? (
                    <Search
                      className="
                        w-3.5
                        h-3.5
                        text-sky-400
                        shrink-0
                      "
                    />
                  ) : (
                    <Globe
                      className="
                        w-3.5
                        h-3.5
                        text-slate-500
                        shrink-0
                      "
                    />
                  )}

                  <span
                    className="
                      flex-1
                      truncate
                      text-[11px]
                      font-medium
                    "
                  >
                    {tab.title}
                  </span>

                  {tab.muted && (
                    <VolumeX
                      className="
                        w-3
                        h-3
                        text-slate-500
                      "
                    />
                  )}

                  <button
                    type="button"
                    onClick={(
                      event,
                    ) =>
                      closeTab(
                        tab.id,
                        event,
                      )
                    }
                    className="
                      opacity-0
                      group-hover:opacity-100
                      p-1
                      rounded-md
                      hover:bg-white/10
                      text-slate-500
                      hover:text-white
                      transition
                    "
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            },
          )}

          {/* New tab */}

          <button
            type="button"
            onClick={
              createTab
            }
            className="
              shrink-0
              p-2
              rounded-lg
              text-slate-400
              hover:text-white
              hover:bg-white/10
              transition-all
            "
            title="New tab"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Right controls */}

        <div className="flex items-center gap-1 pb-1">
          <button
            type="button"
            onClick={() =>
              setShowProfileMenu(
                (value) =>
                  !value,
              )
            }
            className="
              w-8
              h-8
              rounded-full
              overflow-hidden
              border
              border-white/10
              bg-gradient-to-br
              from-sky-400
              via-indigo-500
              to-purple-600
              flex
              items-center
              justify-center
              hover:scale-105
              transition
            "
            title="Profile"
          >
            <User className="w-4 h-4 text-white" />
          </button>

          <button
            type="button"
            onClick={() =>
              setShowBrowserMenu(
                (value) =>
                  !value,
              )
            }
            className="
              p-2
              rounded-lg
              text-slate-400
              hover:text-white
              hover:bg-white/10
              transition
            "
            title="Chrome menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ===================================================
          NAVIGATION BAR
      =================================================== */}

      <div
        className="
          relative
          z-50
          flex
          items-center
          gap-2
          px-3
          py-2
          bg-[#171c25]
          border-b
          border-white/[0.07]
        "
      >
        {/* Navigation */}

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={goBack}
            disabled={
              !activeTab ||
              activeTab.historyIndex <=
                0
            }
            className="
              p-2
              rounded-full
              text-slate-300
              hover:bg-white/10
              disabled:opacity-25
              transition
            "
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={
              goForward
            }
            disabled={
              !activeTab ||
              activeTab.historyIndex >=
                activeTab.history.length -
                  1
            }
            className="
              p-2
              rounded-full
              text-slate-300
              hover:bg-white/10
              disabled:opacity-25
              transition
            "
            title="Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={
              reloadPage
            }
            className="
              p-2
              rounded-full
              text-slate-300
              hover:bg-white/10
              transition
            "
            title="Reload"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Omnibox */}

        <form
          onSubmit={
            handleUrlSubmit
          }
          className="
            relative
            flex-1
            min-w-0
          "
        >
          <div
            className={`
              flex
              items-center
              gap-2
              px-4
              h-[38px]
              rounded-full
              bg-[#0f141c]
              border
              transition-all
              ${
                urlFocused
                  ? "border-sky-400/60 shadow-[0_0_0_3px_rgba(56,189,248,.10)]"
                  : "border-white/[0.08]"
              }
            `}
          >
            {activeTab?.isSearch ? (
              <Search
                className="
                  w-4
                  h-4
                  text-sky-400
                  shrink-0
                "
              />
            ) : activeTab?.url ? (
              <Lock
                className="
                  w-4
                  h-4
                  text-emerald-400
                  shrink-0
                "
              />
            ) : (
              <Search
                className="
                  w-4
                  h-4
                  text-slate-500
                  shrink-0
                "
              />
            )}

            <input
              ref={addressRef}
              type="text"
              value={urlInput}
              onChange={(event) => {
                setUrlInput(
                  event.target.value,
                );

                setShowSuggestions(
                  true,
                );
              }}
              onFocus={() =>
                setUrlFocused(
                  true,
                )
              }
              onBlur={() =>
                setTimeout(
                  () =>
                    setUrlFocused(
                      false,
                    ),
                  150,
                )
              }
              placeholder="Search Google or type a URL"
              className="
                flex-1
                min-w-0
                bg-transparent
                outline-none
                text-sm
                text-slate-100
                placeholder:text-slate-500
              "
            />

            {urlInput && (
              <button
                type="button"
                onClick={() =>
                  setUrlInput("")
                }
                className="
                  p-1
                  rounded-full
                  hover:bg-white/10
                  text-slate-500
                  hover:text-white
                "
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={
                toggleBookmark
              }
              className={`
                p-1.5
                rounded-full
                transition
                ${
                  isCurrentBookmarked
                    ? "text-amber-400"
                    : "text-slate-500 hover:text-slate-200"
                }
              `}
              title={
                isCurrentBookmarked
                  ? "Remove bookmark"
                  : "Bookmark this tab"
              }
            >
              <Star
                className={`
                  w-4
                  h-4
                  ${
                    isCurrentBookmarked
                      ? "fill-current"
                      : ""
                  }
                `}
              />
            </button>
          </div>

          {/* Suggestions */}

          {showSuggestions &&
            urlFocused &&
            suggestions.length >
              0 && (
              <div
                className="
                  absolute
                  top-[45px]
                  left-0
                  right-0
                  rounded-2xl
                  overflow-hidden
                  bg-[#171c25]
                  border
                  border-white/10
                  shadow-2xl
                  shadow-black/50
                  py-2
                "
              >
                {suggestions.map(
                  (
                    suggestion,
                    index,
                  ) => (
                    <button
                      key={`${suggestion.url}-${index}`}
                      type="button"
                      onMouseDown={() =>
                        navigateTo(
                          suggestion.url,
                        )
                      }
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-4
                        py-2.5
                        text-left
                        hover:bg-white/[0.06]
                        transition
                      "
                    >
                      <div
                        className="
                          w-7
                          h-7
                          rounded-full
                          bg-slate-800
                          flex
                          items-center
                          justify-center
                        "
                      >
                        {suggestion.type ===
                        "history" ? (
                          <HistoryIcon className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <Search className="w-3.5 h-3.5 text-sky-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-slate-100 truncate">
                          {
                            suggestion.title
                          }
                        </div>

                        <div className="text-[10px] text-slate-500 truncate">
                          {
                            suggestion.subtitle
                          }
                        </div>
                      </div>

                      <ArrowRight className="w-3 h-3 text-slate-600" />
                    </button>
                  ),
                )}
              </div>
            )}
        </form>

        {/* Toolbar */}

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() =>
              setShowAiPanel(
                (value) =>
                  !value,
              )
            }
            className={`
              hidden
              md:flex
              items-center
              gap-1.5
              px-3
              h-8
              rounded-full
              text-[11px]
              font-bold
              transition
              ${
                showAiPanel
                  ? "bg-sky-400 text-slate-950"
                  : "text-sky-300 hover:bg-sky-400/10"
              }
            `}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI
          </button>

          <button
            type="button"
            onClick={() =>
              setIsIncognito(
                (value) =>
                  !value,
              )
            }
            className={`
              p-2
              rounded-full
              transition
              ${
                isIncognito
                  ? "bg-purple-500/20 text-purple-300"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }
            `}
            title="Incognito"
          >
            <EyeOff className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              setShowBrowserMenu(
                (value) =>
                  !value,
              )
            }
            className="
              p-2
              rounded-full
              text-slate-400
              hover:bg-white/10
              hover:text-white
            "
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ===================================================
          BOOKMARK BAR
      =================================================== */}

      <div
        className="
          relative
          z-40
          flex
          items-center
          gap-1
          h-[31px]
          px-3
          bg-[#11161f]
          border-b
          border-white/[0.05]
          overflow-x-auto
          no-scrollbar
        "
      >
        <button
          type="button"
          onClick={() =>
            setShowCustomize(
              true,
            )
          }
          className="
            flex
            items-center
            gap-1.5
            shrink-0
            px-2
            py-1
            rounded-md
            text-[10px]
            text-slate-500
            hover:text-white
            hover:bg-white/5
          "
        >
          <Bookmark className="w-3 h-3" />
          Bookmarks
        </button>

        <div className="w-px h-4 bg-white/10 shrink-0" />

        {bookmarks.map(
          (bookmark) => (
            <button
              key={
                bookmark.id
              }
              type="button"
              onClick={() =>
                navigateTo(
                  bookmark.url,
                )
              }
              className="
                flex
                items-center
                gap-1.5
                shrink-0
                px-2
                py-1
                rounded-md
                text-[10px]
                text-slate-400
                hover:text-sky-300
                hover:bg-white/5
                transition
              "
            >
              <Globe className="w-3 h-3 text-sky-400" />
              <span>
                {
                  bookmark.title
                }
              </span>
            </button>
          ),
        )}
      </div>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div
        className="
          relative
          z-10
          flex-1
          flex
          overflow-hidden
        "
      >
        {/* =================================================
            PAGE
        ================================================= */}

        <div
          className="
            relative
            flex-1
            min-w-0
            overflow-hidden
            bg-[#090d14]
          "
          style={{
            fontSize: `${zoomLevel}%`,
          }}
        >
          {/* =================================================
              NEW TAB
          ================================================= */}

          {activeTab?.isNewTab ? (
            <div
              className="
                relative
                h-full
                w-full
                overflow-auto
              "
              style={
                renderedWallpaperStyle
              }
            >
              <div
                className="
                  absolute
                  inset-0
                  bg-black/20
                "
              />

              {/* New tab top controls */}

              <div
                className="
                  relative
                  z-10
                  flex
                  justify-end
                  p-5
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowCustomize(
                      true,
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-full
                    bg-black/25
                    backdrop-blur-xl
                    border
                    border-white/10
                    text-xs
                    text-white
                    hover:bg-black/40
                    transition
                  "
                >
                  <Palette className="w-3.5 h-3.5" />
                  Customize Chrome
                </button>
              </div>

              <div
                className="
                  relative
                  z-10
                  min-h-full
                  flex
                  flex-col
                  items-center
                  justify-center
                  px-6
                  py-12
                  -mt-10
                "
              >
                {/* Logo */}

                <div
                  className="
                    mb-6
                    w-16
                    h-16
                    rounded-[22px]
                    flex
                    items-center
                    justify-center
                    bg-white/10
                    backdrop-blur-2xl
                    border
                    border-white/15
                    shadow-2xl
                  "
                >
                  <Globe className="w-8 h-8 text-white" />
                </div>

                <h1
                  className="
                    text-4xl
                    sm:text-5xl
                    font-bold
                    tracking-tight
                    text-white
                    drop-shadow-2xl
                  "
                >
                  Abhishek
                </h1>

                <p
                  className="
                    mt-2
                    text-xs
                    sm:text-sm
                    text-white/60
                  "
                >
                  Your personal
                  developer browser
                </p>

                {/* Search */}

                <form
                  onSubmit={
                    handleUrlSubmit
                  }
                  className="
                    w-full
                    max-w-[680px]
                    mt-9
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      px-5
                      h-[58px]
                      rounded-full
                      bg-white/[0.96]
                      shadow-[0_20px_70px_rgba(0,0,0,.35)]
                      transition-all
                      focus-within:scale-[1.01]
                    "
                  >
                    <Search className="w-5 h-5 text-slate-500" />

                    <input
                      type="text"
                      value={urlInput}
                      onChange={(event) =>
                        setUrlInput(
                          event.target.value,
                        )
                      }
                      placeholder="Search Google or type a URL"
                      className="
                        flex-1
                        bg-transparent
                        outline-none
                        text-sm
                        text-slate-800
                        placeholder:text-slate-400
                      "
                    />

                    <button
                      type="submit"
                      className="
                        px-4
                        py-2
                        rounded-full
                        bg-slate-900
                        text-white
                        text-xs
                        font-bold
                        hover:bg-slate-700
                        transition
                      "
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Quick links */}

                <div
                  className="
                    mt-8
                    grid
                    grid-cols-2
                    sm:grid-cols-4
                    gap-3
                    w-full
                    max-w-[720px]
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo(
                        "https://github.com/abhishekkuntare",
                      )
                    }
                    className="
                      group
                      p-4
                      rounded-2xl
                      bg-black/20
                      backdrop-blur-xl
                      border
                      border-white/10
                      hover:bg-black/30
                      hover:-translate-y-1
                      transition-all
                      text-left
                    "
                  >
                    <div className="text-sm font-bold text-white">
                      GitHub
                    </div>

                    <div className="mt-1 text-[10px] text-white/50 truncate">
                      github.com
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigateTo(
                        "https://linkedin.com/in/abhishekkuntare",
                      )
                    }
                    className="
                      group
                      p-4
                      rounded-2xl
                      bg-black/20
                      backdrop-blur-xl
                      border
                      border-white/10
                      hover:bg-black/30
                      hover:-translate-y-1
                      transition-all
                      text-left
                    "
                  >
                    <div className="text-sm font-bold text-white">
                      LinkedIn
                    </div>

                    <div className="mt-1 text-[10px] text-white/50">
                      Professional profile
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openApp(
                        "projects",
                      )
                    }
                    className="
                      group
                      p-4
                      rounded-2xl
                      bg-black/20
                      backdrop-blur-xl
                      border
                      border-white/10
                      hover:bg-black/30
                      hover:-translate-y-1
                      transition-all
                      text-left
                    "
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <FolderKanban className="w-4 h-4 text-sky-400" />
                      Projects
                    </div>

                    <div className="mt-1 text-[10px] text-white/50">
                      Explore showcase
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openApp(
                        "resume",
                      )
                    }
                    className="
                      group
                      p-4
                      rounded-2xl
                      bg-black/20
                      backdrop-blur-xl
                      border
                      border-white/10
                      hover:bg-black/30
                      hover:-translate-y-1
                      transition-all
                      text-left
                    "
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      Resume
                    </div>

                    <div className="mt-1 text-[10px] text-white/50">
                      Open document
                    </div>
                  </button>
                </div>

                {/* Google fallback */}

                <button
                  type="button"
                  onClick={
                    searchGoogle
                  }
                  className="
                    mt-7
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-white/50
                    hover:text-white
                    transition
                  "
                >
                  <SearchCheck className="w-3.5 h-3.5" />
                  Search the web with Google
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : activeTab?.isSearch ? (
            /* =================================================
               SEARCH RESULTS
            ================================================= */

            <div
              className="
                h-full
                overflow-y-auto
                bg-[#090d14]
              "
            >
              <div
                className="
                  max-w-4xl
                  mx-auto
                  px-5
                  py-7
                "
              >
                {/* Search heading */}

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-end
                    justify-between
                    gap-4
                    pb-5
                    border-b
                    border-white/[0.07]
                  "
                >
                  <div>
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-sky-400
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wider
                      "
                    >
                      <Search className="w-3.5 h-3.5" />
                      Abhishek Search
                    </div>

                    <h1
                      className="
                        mt-2
                        text-xl
                        font-bold
                        text-white
                      "
                    >
                      Results for "
                      {
                        activeTab.searchQuery
                      }
                      "
                    </h1>

                    <p className="mt-1 text-[10px] text-slate-500">
                      {
                        searchResults.length
                      }{" "}
                      workstation
                      results
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      searchGoogle
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      px-4
                      py-2
                      rounded-xl
                      bg-white/5
                      border
                      border-white/10
                      text-xs
                      text-slate-300
                      hover:text-white
                      hover:bg-white/10
                      transition
                    "
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Search real web
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Filters */}

                <div className="flex items-center gap-1.5 mt-5 overflow-x-auto no-scrollbar">
                  {[
                    "All",
                    "Portfolio",
                    "Engineering",
                    "Docs",
                    "Profile",
                  ].map(
                    (category) => (
                      <button
                        key={
                          category
                        }
                        type="button"
                        onClick={() =>
                          setSearchCategoryFilter(
                            category as any,
                          )
                        }
                        className={`
                          shrink-0
                          px-3
                          py-1.5
                          rounded-full
                          text-[10px]
                          font-semibold
                          transition
                          ${
                            searchCategoryFilter ===
                            category
                              ? "bg-sky-400 text-slate-950"
                              : "bg-white/[0.04] text-slate-500 hover:text-white"
                          }
                        `}
                      >
                        {category}
                      </button>
                    ),
                  )}
                </div>

                {/* Results */}

                <div className="mt-6 space-y-3">
                  {searchResults.length ===
                  0 ? (
                    <div
                      className="
                        py-16
                        text-center
                        rounded-3xl
                        border
                        border-white/[0.07]
                        bg-white/[0.02]
                      "
                    >
                      <SearchCheck
                        className="
                          w-10
                          h-10
                          mx-auto
                          text-slate-600
                        "
                      />

                      <h3 className="mt-4 text-sm font-bold text-white">
                        No workstation
                        results
                      </h3>

                      <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto">
                        Try another
                        search or use
                        the real web
                        search button
                        above.
                      </p>

                      <button
                        type="button"
                        onClick={
                          searchGoogle
                        }
                        className="
                          mt-5
                          px-4
                          py-2
                          rounded-xl
                          bg-sky-400
                          text-slate-950
                          text-xs
                          font-bold
                        "
                      >
                        Search Google
                      </button>
                    </div>
                  ) : (
                    searchResults.map(
                      (result) => (
                        <article
                          key={
                            result.id
                          }
                          className="
                            group
                            p-5
                            rounded-2xl
                            bg-white/[0.025]
                            border
                            border-white/[0.06]
                            hover:bg-white/[0.04]
                            hover:border-sky-400/20
                            transition-all
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-[10px]
                              text-emerald-400
                            "
                          >
                            <Globe className="w-3 h-3" />
                            {
                              result.displayUrl
                            }
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                result.internalApp
                              ) {
                                openApp(
                                  result.internalApp as any,
                                );
                              } else {
                                navigateTo(
                                  result.url,
                                );
                              }
                            }}
                            className="
                              mt-2
                              text-left
                              text-base
                              font-bold
                              text-sky-400
                              hover:text-sky-300
                              transition
                            "
                          >
                            {
                              result.title
                            }
                          </button>

                          <p
                            className="
                              mt-2
                              text-xs
                              leading-6
                              text-slate-400
                            "
                          >
                            {
                              result.snippet
                            }
                          </p>

                          <div className="flex items-center gap-4 mt-4">
                            {result.internalApp ? (
                              <button
                                type="button"
                                onClick={() =>
                                  openApp(
                                    result.internalApp as any,
                                  )
                                }
                                className="
                                  flex
                                  items-center
                                  gap-1.5
                                  text-[10px]
                                  font-bold
                                  text-sky-400
                                "
                              >
                                Open in OS
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  navigateTo(
                                    result.url,
                                  )
                                }
                                className="
                                  flex
                                  items-center
                                  gap-1.5
                                  text-[10px]
                                  font-bold
                                  text-sky-400
                                "
                              >
                                Open
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(
                                    result.url,
                                  );
                                } catch {}

                                addNotification({
                                  title:
                                    "Link copied",
                                  message:
                                    result.url,
                                  type: "info",
                                  appId:
                                    "browser",
                                });
                              }}
                              className="
                                text-[10px]
                                text-slate-500
                                hover:text-white
                              "
                            >
                              Copy link
                            </button>
                          </div>
                        </article>
                      ),
                    )
                  )}
                </div>
              </div>
            </div>
          ) : activeTab?.canEmbed ? (
            /* =================================================
               EMBEDDED WEBSITE
            ================================================= */

            <iframe
              src={
                activeTab.url
              }
              title={
                activeTab.title
              }
              className="
                w-full
                h-full
                border-none
                bg-white
              "
              sandbox="
                allow-scripts
                allow-same-origin
                allow-forms
                allow-popups
                allow-presentation
              "
            />
          ) : (
            /* =================================================
               BLOCKED WEBSITE
            ================================================= */

            <div
              className="
                h-full
                flex
                items-center
                justify-center
                overflow-auto
                px-6
              "
            >
              <div
                className="
                  max-w-xl
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    w-20
                    h-20
                    rounded-[26px]
                    bg-sky-400/10
                    border
                    border-sky-400/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <ShieldCheck className="w-9 h-9 text-sky-400" />
                </div>

                <h2
                  className="
                    mt-6
                    text-xl
                    font-bold
                    text-white
                  "
                >
                  External website
                </h2>

                <p
                  className="
                    mt-3
                    text-xs
                    leading-6
                    text-slate-500
                  "
                >
                  This website does not
                  allow itself to be
                  displayed inside another
                  webpage. This is enforced
                  by browser security
                  headers.
                </p>

                <div
                  className="
                    mt-4
                    p-3
                    rounded-xl
                    bg-white/[0.03]
                    border
                    border-white/[0.06]
                    text-[10px]
                    text-slate-500
                    break-all
                  "
                >
                  {activeTab.url}
                </div>

                <div
                  className="
                    mt-6
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <button
                    type="button"
                    onClick={
                      openExternal
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      px-5
                      py-2.5
                      rounded-xl
                      bg-sky-400
                      text-slate-950
                      text-xs
                      font-bold
                      hover:bg-sky-300
                      transition
                    "
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open External Tab
                  </button>

                  <button
                    type="button"
                    onClick={
                      copyCurrentUrl
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-xl
                      bg-white/5
                      border
                      border-white/10
                      text-xs
                      text-white
                    "
                  >
                    {copiedUrl ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}

                    {copiedUrl
                      ? "Copied"
                      : "Copy address"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      createTab
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-xl
                      bg-white/5
                      border
                      border-white/10
                      text-xs
                      text-slate-300
                    "
                  >
                    <Plus className="w-4 h-4" />
                    New tab
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              FIND BAR
          ================================================= */}

          {showFind && (
            <div
              className="
                absolute
                top-4
                right-5
                z-[80]
                w-[340px]
                p-2
                rounded-2xl
                bg-[#171c25]
                border
                border-white/10
                shadow-2xl
                flex
                items-center
                gap-2
              "
            >
              <Search className="w-4 h-4 text-slate-500 ml-2" />

              <input
                ref={findRef}
                value={findQuery}
                onChange={(event) =>
                  setFindQuery(
                    event.target.value,
                  )
                }
                placeholder="Find in page"
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-xs
                  text-white
                "
              />

              <span className="text-[10px] text-slate-500">
                {findMatches}
              </span>

              <button
                type="button"
                onClick={() =>
                  setShowFind(
                    false,
                  )
                }
                className="
                  p-1.5
                  rounded-lg
                  hover:bg-white/10
                  text-slate-400
                "
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* =================================================
            AI PANEL
        ================================================= */}

        {showAiPanel && (
          <aside
            className="
              relative
              z-40
              w-[330px]
              shrink-0
              border-l
              border-white/[0.07]
              bg-[#11161f]
              flex
              flex-col
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                p-4
                border-b
                border-white/[0.07]
              "
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />

                <span className="text-xs font-bold text-white">
                  Browser AI
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAiPanel(
                    false,
                  )
                }
                className="
                  p-1
                  rounded-lg
                  hover:bg-white/10
                  text-slate-500
                "
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className="
                flex-1
                overflow-y-auto
                p-4
                space-y-4
              "
            >
              <div
                className="
                  p-4
                  rounded-2xl
                  bg-sky-400/[0.05]
                  border
                  border-sky-400/10
                "
              >
                <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-400">
                  Page synthesis
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  {activeTab?.isSearch
                    ? `You are viewing search results for "${activeTab.searchQuery}".`
                    : `Active page: ${activeTab?.title || "New Tab"}.`}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleSaveAiToNotes(
                    `Research: ${
                      activeTab?.title ||
                      "New Tab"
                    }`,
                    `Research generated from Abhishek Browser.\n\nURL: ${
                      activeTab?.url ||
                      "New Tab"
                    }\n\nQuery: ${
                      activeTab?.searchQuery ||
                      "None"
                    }`,
                  )
                }
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  py-3
                  rounded-xl
                  bg-sky-400
                  text-slate-950
                  text-xs
                  font-bold
                  hover:bg-sky-300
                  transition
                "
              >
                <StickyNote className="w-4 h-4" />

                {savedNotePrompt
                  ? "Saved to Notes!"
                  : "Save to Workstation Notes"}
              </button>

              <button
                type="button"
                onClick={() =>
                  openApp("ai")
                }
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  py-3
                  rounded-xl
                  bg-white/[0.04]
                  border
                  border-white/[0.06]
                  text-xs
                  text-slate-300
                  hover:bg-white/[0.07]
                  transition
                "
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Open Full AI Copilot
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* ===================================================
          PROFILE MENU
      =================================================== */}

      {showProfileMenu && (
        <div
          className="
            absolute
            z-[100]
            top-[50px]
            right-12
            w-[310px]
            rounded-3xl
            bg-[#171c25]
            border
            border-white/10
            shadow-[0_30px_100px_rgba(0,0,0,.55)]
            overflow-hidden
          "
        >
          <div
            className="
              p-5
              border-b
              border-white/[0.07]
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-gradient-to-br
                  from-sky-400
                  via-indigo-500
                  to-purple-600
                  flex
                  items-center
                  justify-center
                "
              >
                <User className="w-6 h-6 text-white" />
              </div>

              <div>
                <div className="text-sm font-bold text-white">
                  Abhishek
                </div>

                <div className="text-[10px] text-slate-500">
                  Developer Workstation
                </div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              type="button"
              onClick={() =>
                setIsIncognito(
                  (value) =>
                    !value,
                )
              }
              className="
                w-full
                flex
                items-center
                gap-3
                px-3
                py-3
                rounded-xl
                text-left
                hover:bg-white/[0.06]
              "
            >
              <EyeOff className="w-4 h-4 text-purple-400" />

              <div>
                <div className="text-xs font-semibold text-white">
                  {isIncognito
                    ? "Exit Incognito"
                    : "Open Incognito"}
                </div>

                <div className="text-[9px] text-slate-500">
                  Private browsing session
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowSettings(
                  true,
                );
                setShowProfileMenu(
                  false,
                );
              }}
              className="
                w-full
                flex
                items-center
                gap-3
                px-3
                py-3
                rounded-xl
                text-left
                hover:bg-white/[0.06]
              "
            >
              <Settings className="w-4 h-4 text-slate-400" />

              <div>
                <div className="text-xs font-semibold text-white">
                  Browser settings
                </div>

                <div className="text-[9px] text-slate-500">
                  Preferences and privacy
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          CHROME MENU
      =================================================== */}

      {showBrowserMenu && (
        <div
          className="
            absolute
            z-[100]
            top-[83px]
            right-3
            w-[330px]
            max-h-[calc(100vh-100px)]
            overflow-y-auto
            rounded-3xl
            bg-[#171c25]
            border
            border-white/10
            shadow-[0_30px_100px_rgba(0,0,0,.65)]
            p-2
          "
        >
          {/* New tab */}

          <button
            type="button"
            onClick={
              createTab
            }
            className="
              menu-row
            "
          >
            <Plus className="menu-icon" />
            <span>New tab</span>
            <kbd>Ctrl+T</kbd>
          </button>

          <button
            type="button"
            onClick={() => {
              createTab();
              setIsFullscreen(
                false,
              );
            }}
            className="menu-row"
          >
            <Monitor className="menu-icon" />
            <span>New window</span>
            <kbd>Ctrl+N</kbd>
          </button>

          <button
            type="button"
            onClick={() => {
              createTab();
              setIsIncognito(
                true,
              );
              setShowBrowserMenu(
                false,
              );
            }}
            className="menu-row"
          >
            <EyeOff className="menu-icon text-purple-400" />
            <span>
              New Incognito window
            </span>
            <kbd>Ctrl+Shift+N</kbd>
          </button>

          <div className="menu-divider" />

          {/* Profile */}

          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(
                true,
              );
              setShowBrowserMenu(
                false,
              );
            }}
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-3
              rounded-2xl
              bg-white/[0.04]
              hover:bg-white/[0.07]
              transition
              mb-1
            "
          >
            <div
              className="
                w-9
                h-9
                rounded-full
                bg-gradient-to-br
                from-sky-400
                via-indigo-500
                to-purple-600
                flex
                items-center
                justify-center
              "
            >
              <User className="w-4 h-4 text-white" />
            </div>

            <div className="flex-1 text-left">
              <div className="text-xs font-bold text-white">
                Abhishek
              </div>

              <div className="text-[9px] text-slate-500">
                Signed in • Developer
              </div>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {/* History */}

          <button
            type="button"
            onClick={() => {
              setShowHistoryModal(
                true,
              );
              setShowBrowserMenu(
                false,
              );
            }}
            className="menu-row"
          >
            <History className="menu-icon" />
            <span>History</span>
            <ChevronDown className="ml-auto w-3.5 h-3.5" />
          </button>

          {/* Downloads */}

          <button
            type="button"
            onClick={() => {
              setShowDownloadsModal(
                true,
              );
              setShowBrowserMenu(
                false,
              );
            }}
            className="menu-row"
          >
            <Download className="menu-icon" />
            <span>Downloads</span>
            <kbd>Ctrl+J</kbd>
          </button>

          {/* Bookmarks */}

          <button
            type="button"
            onClick={() =>
              setShowCustomize(
                true,
              )
            }
            className="menu-row"
          >
            <Bookmark className="menu-icon" />
            <span>
              Bookmarks and lists
            </span>
            <ChevronDown className="ml-auto w-3.5 h-3.5" />
          </button>

          {/* Tab groups */}

          <button
            type="button"
            onClick={() => {
              setShowTabGroups(
                true,
              );
              setShowBrowserMenu(
                false,
              );
            }}
            className="menu-row"
          >
            <Layers className="menu-icon" />
            <span>Tab groups</span>
            <ChevronDown className="ml-auto w-3.5 h-3.5" />
          </button>

          {/* Extensions */}

          <button
            type="button"
            onClick={() => {
              setShowExtensions(
                true,
              );
              setShowBrowserMenu(
                false,
              );
            }}
            className="menu-row"
          >
            <Puzzle className="menu-icon" />
            <span>Extensions</span>
            <ChevronDown className="ml-auto w-3.5 h-3.5" />
          </button>

          {/* Delete browsing */}

          <button
            type="button"
            onClick={() => {
              setShowDeleteData(
                true,
              );
              setShowBrowserMenu(
                false,
              );
            }}
            className="menu-row"
          >
            <Trash2 className="menu-icon" />
            <span>
              Delete browsing data...
            </span>
            <kbd>Ctrl+Shift+Del</kbd>
          </button>

          <div className="menu-divider" />

          {/* Zoom */}

          <div
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              text-xs
            "
          >
            <span className="text-slate-300">
              Zoom
            </span>

            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={
                  zoomOut
                }
                className="menu-square"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={
                  resetZoom
                }
                className="
                  min-w-[50px]
                  text-center
                  text-[10px]
                  text-slate-300
                "
              >
                {zoomLevel}%
              </button>

              <button
                type="button"
                onClick={
                  zoomIn
                }
                className="menu-square"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={
                  toggleFullscreen
                }
                className="menu-square"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="menu-divider" />

          {/* Print */}

          <button
            type="button"
            onClick={
              printPage
            }
            className="menu-row"
          >
            <Printer className="menu-icon" />
            <span>Print...</span>
            <kbd>Ctrl+P</kbd>
          </button>

          {/* AI */}

          <button
            type="button"
            onClick={() => {
              setShowAiPanel(
                true,
              );
              setShowBrowserMenu(
                false,
              );
            }}
            className="menu-row"
          >
            <Sparkles className="menu-icon text-sky-400" />
            <span>
              Open Browser AI
            </span>
          </button>

          {/* Find */}

          <button
            type="button"
            onClick={() => {
              setShowFind(true);
              setShowBrowserMenu(
                false,
              );
            }}
            className="menu-row"
          >
            <SearchCheck className="menu-icon" />
            <span>
              Find in page
            </span>
            <kbd>Ctrl+F</kbd>
          </button>

          {/* Share */}

          <button
            type="button"
            onClick={() => {
              setShowShareMenu(
                true,
              );
              setShowBrowserMenu(
                false,
              );
            }}
            className="menu-row"
          >
            <Share2 className="menu-icon" />
            <span>
              Cast, save and share
            </span>
            <ChevronDown className="ml-auto w-3.5 h-3.5" />
          </button>

          {/* More tools */}

          <button
            type="button"
            onClick={() => {
              setShowMoreTools(
                true,
              );
              setShowBrowserMenu(
                false,
              );
            }}
            className="menu-row"
          >
            <SlidersHorizontal className="menu-icon" />
            <span>More tools</span>
            <ChevronDown className="ml-auto w-3.5 h-3.5" />
          </button>

          <div className="menu-divider" />

          {/* Help */}

          <button
            type="button"
            className="menu-row"
            onClick={() =>
              setShowAbout(true)
            }
          >
            <HelpCircle className="menu-icon" />
            <span>Help</span>
            <ChevronDown className="ml-auto w-3.5 h-3.5" />
          </button>

          {/* Settings */}

          <button
            type="button"
            onClick={() => {
              setShowSettings(
                true,
              );
              setShowBrowserMenu(
                false,
              );
            }}
            className="menu-row"
          >
            <Settings className="menu-icon" />
            <span>Settings</span>
          </button>

          {/* Exit */}

          <button
            type="button"
            onClick={() => {
              setShowBrowserMenu(
                false,
              );

              addNotification({
                title:
                  "Browser",
                message:
                  "Use the window close control to close this application.",
                type: "info",
                appId:
                  "browser",
              });
            }}
            className="menu-row"
          >
            <X className="menu-icon" />
            <span>Exit</span>
          </button>
        </div>
      )}

      {/* ===================================================
          HISTORY MODAL
      =================================================== */}

      {showHistoryModal && (
        <div
          className="
            absolute
            z-[110]
            top-[83px]
            right-16
            w-[370px]
            max-h-[520px]
            flex
            flex-col
            rounded-3xl
            bg-[#171c25]
            border
            border-white/10
            shadow-2xl
            overflow-hidden
          "
        >
          <div
            className="
              p-4
              flex
              items-center
              justify-between
              border-b
              border-white/[0.07]
            "
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-sky-400" />

              <span className="text-xs font-bold text-white">
                Browsing History
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setHistoryList(
                    [],
                  )
                }
                className="
                  text-[10px]
                  text-slate-500
                  hover:text-rose-400
                "
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowHistoryModal(
                    false,
                  )
                }
                className="
                  p-1
                  rounded-lg
                  hover:bg-white/10
                  text-slate-500
                "
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {historyList.length ===
            0 ? (
              <div className="py-12 text-center">
                <History className="w-8 h-8 mx-auto text-slate-700" />

                <p className="mt-3 text-xs text-slate-500">
                  No history records.
                </p>
              </div>
            ) : (
              historyList.map(
                (item) => (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    onClick={() => {
                      navigateTo(
                        item.url,
                      );

                      setShowHistoryModal(
                        false,
                      );
                    }}
                    className="
                      w-full
                      text-left
                      p-3
                      rounded-2xl
                      hover:bg-white/[0.05]
                      transition
                    "
                  >
                    <div className="flex items-center gap-2">
                      <Clock3 className="w-3.5 h-3.5 text-slate-600" />

                      <span className="text-xs font-semibold text-white truncate">
                        {
                          item.title
                        }
                      </span>
                    </div>

                    <div className="mt-1 pl-5 text-[10px] text-slate-500 truncate">
                      {
                        item.url
                      }
                    </div>

                    <div className="mt-1 pl-5 text-[9px] text-slate-600">
                      {
                        item.timestamp
                      }
                    </div>
                  </button>
                ),
              )
            )}
          </div>
        </div>
      )}

      {/* ===================================================
          DOWNLOADS
      =================================================== */}

      {showDownloadsModal && (
        <div
          className="
            absolute
            z-[110]
            top-[83px]
            right-12
            w-[360px]
            rounded-3xl
            bg-[#171c25]
            border
            border-white/10
            shadow-2xl
            overflow-hidden
          "
        >
          <div
            className="
              p-4
              flex
              items-center
              justify-between
              border-b
              border-white/[0.07]
            "
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />

              <span className="text-xs font-bold text-white">
                Downloads
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowDownloadsModal(
                  false,
                )
              }
              className="text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 space-y-2">
            {downloads.map(
              (download) => (
                <div
                  key={
                    download.id
                  }
                  className="
                    p-3
                    rounded-2xl
                    bg-white/[0.03]
                    border
                    border-white/[0.06]
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        w-9
                        h-9
                        rounded-xl
                        bg-emerald-400/10
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {
                          download.name
                        }
                      </div>

                      <div className="text-[9px] text-slate-500">
                        {
                          download.size
                        }{" "}
                        •{" "}
                        {
                          download.type
                        }
                      </div>
                    </div>

                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      openApp(
                        "resume",
                      );

                      setShowDownloadsModal(
                        false,
                      );
                    }}
                    className="
                      mt-3
                      w-full
                      py-2
                      rounded-xl
                      bg-sky-400/10
                      text-sky-300
                      text-[10px]
                      font-bold
                    "
                  >
                    Open file
                  </button>
                </div>
              ),
            )}

            <button
              type="button"
              onClick={
                downloadResume
              }
              className="
                w-full
                py-2.5
                rounded-xl
                bg-white/[0.04]
                border
                border-white/[0.06]
                text-xs
                text-slate-300
                hover:bg-white/[0.07]
              "
            >
              Simulate resume download
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          CUSTOMIZE CHROME
      =================================================== */}

      {showCustomize && (
        <div
          className="
            absolute
            z-[120]
            top-0
            right-0
            bottom-0
            w-[390px]
            max-w-[90vw]
            bg-[#171c25]
            border-l
            border-white/10
            shadow-[-30px_0_100px_rgba(0,0,0,.45)]
            overflow-y-auto
          "
        >
          <div
            className="
              sticky
              top-0
              z-10
              p-5
              bg-[#171c25]/95
              backdrop-blur-xl
              border-b
              border-white/[0.07]
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-white">
                  Customize Chrome
                </div>

                <div className="mt-1 text-[10px] text-slate-500">
                  Personalize your new tab
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCustomize(
                    false,
                  )
                }
                className="
                  p-2
                  rounded-xl
                  hover:bg-white/10
                  text-slate-400
                "
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-7">
            {/* Theme */}

            <section>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-sky-400" />

                <h3 className="text-xs font-bold text-white">
                  Appearance
                </h3>
              </div>

              <p className="mt-1 text-[10px] text-slate-500">
                Choose the background for your new tab page.
              </p>
            </section>

            {/* Wallpaper grid */}

            <section>
              <div className="grid grid-cols-2 gap-3">
                {allWallpapers.map(
                  (
                    wallpaper,
                  ) => (
                    <button
                      key={
                        wallpaper.id
                      }
                      type="button"
                      onClick={() =>
                        setSelectedWallpaperId(
                          wallpaper.id,
                        )
                      }
                      className={`
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        aspect-[1.55]
                        transition-all
                        ${
                          selectedWallpaperId ===
                          wallpaper.id
                            ? "border-sky-400 ring-2 ring-sky-400/20"
                            : "border-white/10 hover:border-white/20"
                        }
                      `}
                    >
                      <div
                        className="
                          absolute
                          inset-0
                        "
                        style={
                          wallpaper.type ===
                          "image"
                            ? {
                                backgroundImage: `url("${wallpaper.value}")`,
                                backgroundSize:
                                  "cover",
                                backgroundPosition:
                                  "center",
                              }
                            : {
                                background:
                                  wallpaper.value,
                              }
                        }
                      />

                      <div
                        className="
                          absolute
                          inset-x-0
                          bottom-0
                          p-2
                          bg-gradient-to-t
                          from-black/70
                          to-transparent
                        "
                      >
                        <span className="text-[10px] font-semibold text-white">
                          {
                            wallpaper.name
                          }
                        </span>
                      </div>

                      {selectedWallpaperId ===
                        wallpaper.id && (
                        <div
                          className="
                            absolute
                            top-2
                            right-2
                            w-5
                            h-5
                            rounded-full
                            bg-sky-400
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <Check className="w-3 h-3 text-slate-950" />
                        </div>
                      )}
                    </button>
                  ),
                )}
              </div>
            </section>

            {/* Custom image */}

            <section>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />

                <h3 className="text-xs font-bold text-white">
                  Custom wallpaper
                </h3>
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  value={
                    customWallpaperUrl
                  }
                  onChange={(event) =>
                    setCustomWallpaperUrl(
                      event.target.value,
                    )
                  }
                  placeholder="Paste image URL..."
                  className="
                    flex-1
                    min-w-0
                    px-3
                    py-2.5
                    rounded-xl
                    bg-black/20
                    border
                    border-white/10
                    outline-none
                    text-xs
                    text-white
                    placeholder:text-slate-600
                    focus:border-sky-400/40
                  "
                />

                <button
                  type="button"
                  onClick={
                    applyCustomWallpaper
                  }
                  className="
                    px-3
                    rounded-xl
                    bg-sky-400
                    text-slate-950
                    text-[10px]
                    font-bold
                  "
                >
                  Apply
                </button>
              </div>
            </section>

            {/* Shortcut information */}

            <section
              className="
                p-4
                rounded-2xl
                bg-white/[0.025]
                border
                border-white/[0.06]
              "
            >
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-slate-400" />

                <span className="text-xs font-bold text-white">
                  Quick shortcuts
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {[
                  [
                    "New tab",
                    "Ctrl + T",
                  ],
                  [
                    "Close tab",
                    "Ctrl + W",
                  ],
                  [
                    "Focus address bar",
                    "Ctrl + L",
                  ],
                  [
                    "Find",
                    "Ctrl + F",
                  ],
                  [
                    "History",
                    "Ctrl + H",
                  ],
                ].map(
                  (shortcut) => (
                    <div
                      key={
                        shortcut[0]
                      }
                      className="
                        flex
                        items-center
                        justify-between
                        text-[10px]
                      "
                    >
                      <span className="text-slate-500">
                        {
                          shortcut[0]
                        }
                      </span>

                      <kbd
                        className="
                          px-2
                          py-1
                          rounded-md
                          bg-black/30
                          text-slate-400
                        "
                      >
                        {
                          shortcut[1]
                        }
                      </kbd>
                    </div>
                  ),
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ===================================================
          TAB GROUPS
      =================================================== */}

      {showTabGroups && (
        <div
          className="
            absolute
            z-[120]
            top-[83px]
            right-12
            w-[340px]
            rounded-3xl
            bg-[#171c25]
            border
            border-white/10
            shadow-2xl
            p-4
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />

              <span className="text-xs font-bold text-white">
                Tab groups
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowTabGroups(
                  false,
                )
              }
              className="text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={
              createTabGroup
            }
            className="
              mt-4
              w-full
              py-2.5
              rounded-xl
              bg-sky-400
              text-slate-950
              text-xs
              font-bold
            "
          >
            + Create new group
          </button>

          <div className="mt-3 space-y-2">
            {tabGroups.length ===
            0 ? (
              <p className="py-5 text-center text-[10px] text-slate-600">
                No tab groups yet.
              </p>
            ) : (
              tabGroups.map(
                (group) => {
                  const groupTabs =
                    tabs.filter(
                      (tab) =>
                        tab.groupId ===
                        group.id,
                    );

                  return (
                    <div
                      key={
                        group.id
                      }
                      className="
                        p-3
                        rounded-2xl
                        bg-white/[0.03]
                        border
                        border-white/[0.06]
                      "
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {
                            group.name
                          }
                        </span>

                        <span className="text-[9px] text-slate-600">
                          {
                            groupTabs.length
                          }{" "}
                          tabs
                        </span>
                      </div>
                    </div>
                  );
                },
              )
            )}
          </div>
        </div>
      )}

      {/* ===================================================
          EXTENSIONS
      =================================================== */}

      {showExtensions && (
        <div
          className="
            absolute
            z-[120]
            top-[83px]
            right-12
            w-[350px]
            rounded-3xl
            bg-[#171c25]
            border
            border-white/10
            shadow-2xl
            overflow-hidden
          "
        >
          <div
            className="
              p-4
              flex
              items-center
              justify-between
              border-b
              border-white/[0.07]
            "
          >
            <div className="flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-purple-400" />

              <span className="text-xs font-bold text-white">
                Extensions
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowExtensions(
                  false,
                )
              }
              className="text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 space-y-2">
            {[
              {
                name:
                  "Developer Tools",
                icon:
                  SlidersHorizontal,
              },
              {
                name:
                  "AI Assistant",
                icon:
                  Sparkles,
              },
              {
                name:
                  "Privacy Shield",
                icon:
                  Shield,
              },
            ].map(
              (extension) => {
                const Icon =
                  extension.icon;

                return (
                  <div
                    key={
                      extension.name
                    }
                    className="
                      flex
                      items-center
                      gap-3
                      p-3
                      rounded-2xl
                      bg-white/[0.03]
                      border
                      border-white/[0.06]
                    "
                  >
                    <div
                      className="
                        w-9
                        h-9
                        rounded-xl
                        bg-white/[0.05]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Icon className="w-4 h-4 text-sky-400" />
                    </div>

                    <div className="flex-1">
                      <div className="text-xs font-semibold text-white">
                        {
                          extension.name
                        }
                      </div>

                      <div className="text-[9px] text-emerald-400">
                        Enabled
                      </div>
                    </div>

                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                );
              },
            )}

            <button
              type="button"
              className="
                w-full
                py-2.5
                rounded-xl
                bg-white/[0.04]
                border
                border-white/[0.06]
                text-xs
                text-slate-300
              "
            >
              Manage extensions
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          SHARE / CAST
      =================================================== */}

      {showShareMenu && (
        <div
          className="
            absolute
            z-[120]
            top-[83px]
            right-12
            w-[330px]
            rounded-3xl
            bg-[#171c25]
            border
            border-white/10
            shadow-2xl
            p-3
          "
        >
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-xs font-bold text-white">
              Cast, save and share
            </span>

            <button
              type="button"
              onClick={() =>
                setShowShareMenu(
                  false,
                )
              }
              className="text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCastMenu(
                true,
              )
            }
            className="menu-row"
          >
            <Cast className="menu-icon" />
            <span>Cast</span>
          </button>

          <button
            type="button"
            onClick={
              shareCurrentPage
            }
            className="menu-row"
          >
            <Share2 className="menu-icon" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={
              copyCurrentUrl
            }
            className="menu-row"
          >
            <Copy className="menu-icon" />
            <span>Copy link</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setShowShareMenu(
                false,
              )
            }
            className="menu-row"
          >
            <Save className="menu-icon" />
            <span>Save page</span>
          </button>
        </div>
      )}

      {/* ===================================================
          CAST
      =================================================== */}

      {showCastMenu && (
        <div
          className="
            absolute
            z-[130]
            top-[190px]
            right-[350px]
            w-[280px]
            rounded-3xl
            bg-[#171c25]
            border
            border-white/10
            shadow-2xl
            p-4
          "
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">
              Cast to device
            </span>

            <button
              type="button"
              onClick={() =>
                setShowCastMenu(
                  false,
                )
              }
              className="text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] text-center">
            <Cast className="w-7 h-7 mx-auto text-slate-600" />

            <p className="mt-3 text-[10px] text-slate-500">
              No compatible cast
              devices detected.
            </p>
          </div>
        </div>
      )}

      {/* ===================================================
          MORE TOOLS
      =================================================== */}

      {showMoreTools && (
        <div
          className="
            absolute
            z-[120]
            top-[83px]
            right-12
            w-[340px]
            rounded-3xl
            bg-[#171c25]
            border
            border-white/10
            shadow-2xl
            p-2
          "
        >
          <button
            type="button"
            onClick={
              duplicateActiveTab
            }
            className="menu-row"
          >
            <Copy className="menu-icon" />
            <span>
              Duplicate tab
            </span>
          </button>

          <button
            type="button"
            onClick={
              togglePinTab
            }
            className="menu-row"
          >
            <Pin className="menu-icon" />
            <span>
              {activeTab?.pinned
                ? "Unpin tab"
                : "Pin tab"}
            </span>
          </button>

          <button
            type="button"
            onClick={
              toggleMuteTab
            }
            className="menu-row"
          >
            {activeTab?.muted ? (
              <Volume2 className="menu-icon" />
            ) : (
              <VolumeX className="menu-icon" />
            )}

            <span>
              {activeTab?.muted
                ? "Unmute tab"
                : "Mute tab"}
            </span>
          </button>

          <button
            type="button"
            onClick={
              reopenClosedTab
            }
            className="menu-row"
          >
            <RefreshCw className="menu-icon" />
            <span>
              Reopen closed tab
            </span>
            <kbd>Ctrl+Shift+T</kbd>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowMoreTools(
                false,
              );
              setShowCustomize(
                true,
              );
            }}
            className="menu-row"
          >
            <Palette className="menu-icon" />
            <span>
              Customize browser
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setShowFind(true)
            }
            className="menu-row"
          >
            <SearchCheck className="menu-icon" />
            <span>
              Find in page
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              addNotification({
                title:
                  "Translate",
                message:
                  "Translation tools are ready for supported pages.",
                type: "info",
                appId:
                  "browser",
              })
            }
            className="menu-row"
          >
            <Languages className="menu-icon" />
            <span>
              Translate page
            </span>
          </button>
        </div>
      )}

      {/* ===================================================
          DELETE DATA
      =================================================== */}

      {showDeleteData && (
        <div
          className="
            absolute
            inset-0
            z-[200]
            bg-black/60
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-5
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              bg-[#171c25]
              border
              border-white/10
              shadow-2xl
              p-6
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  w-11
                  h-11
                  rounded-2xl
                  bg-rose-400/10
                  flex
                  items-center
                  justify-center
                "
              >
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-white">
                  Delete browsing data
                </h2>

                <p className="text-[10px] text-slate-500">
                  This action clears stored browser history.
                </p>
              </div>
            </div>

            <div
              className="
                mt-5
                p-4
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/[0.06]
              "
            >
              <label className="flex items-center gap-3 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="accent-sky-400"
                />
                Browsing history
              </label>

              <label className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                <input
                  type="checkbox"
                  className="accent-sky-400"
                />
                Cookies and site data
              </label>

              <label className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                <input
                  type="checkbox"
                  className="accent-sky-400"
                />
                Cached images and files
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowDeleteData(
                    false,
                  )
                }
                className="
                  px-4
                  py-2.5
                  rounded-xl
                  bg-white/[0.05]
                  text-xs
                  text-slate-300
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  deleteBrowsingData
                }
                className="
                  px-4
                  py-2.5
                  rounded-xl
                  bg-rose-500
                  text-white
                  text-xs
                  font-bold
                "
              >
                Delete data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          SETTINGS
      =================================================== */}

      {showSettings && (
        <div
          className="
            absolute
            inset-0
            z-[190]
            bg-[#090d14]
            overflow-y-auto
          "
        >
          <div
            className="
              sticky
              top-0
              z-10
              flex
              items-center
              gap-4
              px-6
              py-4
              bg-[#11161f]/95
              backdrop-blur-xl
              border-b
              border-white/[0.07]
            "
          >
            <button
              type="button"
              onClick={() =>
                setShowSettings(
                  false,
                )
              }
              className="
                p-2
                rounded-xl
                hover:bg-white/10
                text-slate-400
              "
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-lg font-bold text-white">
                Settings
              </h1>

              <p className="text-[10px] text-slate-500">
                Abhishek Browser
              </p>
            </div>
          </div>

          <div
            className="
              max-w-3xl
              mx-auto
              px-6
              py-8
            "
          >
            <div
              className="
                grid
                gap-3
              "
            >
              {[
                {
                  icon:
                    User,
                  title:
                    "You and Google",
                  description:
                    "Profile and browser identity",
                },
                {
                  icon:
                    Shield,
                  title:
                    "Privacy and security",
                  description:
                    "Incognito, history and site permissions",
                },
                {
                  icon:
                    Palette,
                  title:
                    "Appearance",
                  description:
                    "Theme, new tab wallpaper and browser appearance",
                },
                {
                  icon:
                    Search,
                  title:
                    "Search engine",
                  description:
                    "Search inside your workstation browser",
                },
                {
                  icon:
                    Keyboard,
                  title:
                    "Keyboard shortcuts",
                  description:
                    "Browser productivity shortcuts",
                },
                {
                  icon:
                    Puzzle,
                  title:
                    "Extensions",
                  description:
                    "Manage browser extensions",
                },
              ].map(
                (setting) => {
                  const Icon =
                    setting.icon;

                  return (
                    <button
                      key={
                        setting.title
                      }
                      type="button"
                      className="
                        flex
                        items-center
                        gap-4
                        p-5
                        rounded-2xl
                        bg-white/[0.025]
                        border
                        border-white/[0.06]
                        hover:bg-white/[0.05]
                        hover:border-sky-400/20
                        transition-all
                        text-left
                      "
                    >
                      <div
                        className="
                          w-11
                          h-11
                          rounded-2xl
                          bg-sky-400/10
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Icon className="w-5 h-5 text-sky-400" />
                      </div>

                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">
                          {
                            setting.title
                          }
                        </div>

                        <div className="mt-1 text-[10px] text-slate-500">
                          {
                            setting.description
                          }
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-700" />
                    </button>
                  );
                },
              )}
            </div>

            <div
              className="
                mt-6
                p-5
                rounded-2xl
                bg-sky-400/[0.04]
                border
                border-sky-400/10
              "
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400" />

                <span className="text-xs font-bold text-white">
                  Workstation browser
                </span>
              </div>

              <p className="mt-2 text-[10px] leading-5 text-slate-500">
                This browser is an application
                running inside your React-based
                operating system. It provides
                browser-like navigation, tabs,
                search, bookmarks, history,
                customization and OS integration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          ABOUT
      =================================================== */}

      {showAbout && (
        <div
          className="
            absolute
            inset-0
            z-[220]
            bg-black/65
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-5
          "
        >
          <div
            className="
              w-full
              max-w-sm
              rounded-3xl
              bg-[#171c25]
              border
              border-white/10
              shadow-2xl
              p-6
              text-center
            "
          >
            <div
              className="
                w-16
                h-16
                mx-auto
                rounded-2xl
                bg-gradient-to-br
                from-sky-400
                to-indigo-600
                flex
                items-center
                justify-center
              "
            >
              <Globe className="w-8 h-8 text-white" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-white">
              Abhishek Browser
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              Developer Workstation Browser
            </p>

            <div
              className="
                mt-5
                p-4
                rounded-2xl
                bg-white/[0.03]
                text-left
                space-y-2
              "
            >
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">
                  Version
                </span>

                <span className="text-white">
                  2.0
                </span>
              </div>

              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">
                  Engine
                </span>

                <span className="text-white">
                  React Browser UI
                </span>
              </div>

              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">
                  Platform
                </span>

                <span className="text-white">
                  Abhishek OS
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowAbout(
                  false,
                )
              }
              className="
                mt-5
                w-full
                py-2.5
                rounded-xl
                bg-sky-400
                text-slate-950
                text-xs
                font-bold
              "
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          RESPONSIVE MOBILE TOOLBAR
      =================================================== */}

      <div
        className="
          md:hidden
          relative
          z-[70]
          h-10
          flex
          items-center
          justify-around
          bg-[#11161f]
          border-t
          border-white/[0.07]
        "
      >
        <button
          type="button"
          onClick={
            goBack
          }
          className="p-2 text-slate-400"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={
            goForward
          }
          className="p-2 text-slate-400"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={
            createTab
          }
          className="p-2 text-slate-400"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() =>
            setShowCustomize(
              true,
            )
          }
          className="p-2 text-slate-400"
        >
          <Palette className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() =>
            setShowBrowserMenu(
              (value) =>
                !value,
            )
          }
          className="p-2 text-slate-400"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* ===================================================
          GLOBAL STYLES
      =================================================== */}

      <style>{`
        .menu-row {
          width: 100%;
          min-height: 38px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 12px;
          color: rgb(226 232 240);
          font-size: 12px;
          text-align: left;
          transition:
            background .18s ease,
            color .18s ease,
            transform .18s ease;
        }

        .menu-row:hover {
          background: rgba(255,255,255,.055);
          color: white;
        }

        .menu-row:active {
          transform: scale(.985);
        }

        .menu-icon {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          color: rgb(148 163 184);
        }

        .menu-row kbd {
          margin-left: auto;
          font-size: 9px;
          color: rgb(100 116 139);
          white-space: nowrap;
        }

        .menu-divider {
          height: 1px;
          background: rgba(255,255,255,.07);
          margin: 6px 4px;
        }

        .menu-square {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: rgb(148 163 184);
          transition: all .18s ease;
        }

        .menu-square:hover {
          background: rgba(255,255,255,.07);
          color: white;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes browserFade {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes browserScale {
          from {
            opacity: 0;
            transform: scale(.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .browser-animate {
          animation:
            browserFade
            .2s
            ease-out;
        }

        button {
          -webkit-tap-highlight-color:
            transparent;
        }
      `}</style>
    </div>
  );
};

export default BrowserApp;