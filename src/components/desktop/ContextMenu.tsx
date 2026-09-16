import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useOS } from "../../context/OSContext";
import { AppId } from "../../types";
import { AppIcon } from "../ui/AppIcon";

import {
  RefreshCw,
  SlidersHorizontal,
  Terminal,
  FolderKanban,
  ShieldAlert,
  Monitor,
  Check,
  Grid2X2,
  ArrowUpDown,
  ChevronRight,
  Plus,
  Paintbrush,
  Code2,
  Eye,
  AlignJustify,
  FileText,
  Folder,
  Undo2,
  Redo2,
  Settings2,
  Pin,
  PinOff,
  X,
  Clock3,
  Scissors,
  Copy,
  Pencil,
  Share2,
  Trash2,
  Smartphone,
  ShieldCheck,
  MapPin,
  Heart,
  Archive,
  Clipboard,
  Cloud,
  FileCode2,
  MoreHorizontal,
  FolderOpen,
  Info,
  Star,
} from "lucide-react";

type SubMenu =
  | "view"
  | "sort"
  | "new"
  | "share"
  | "compress"
  | null;

type DesktopAPI = {
  getSettings: () => {
    viewMode: "large" | "medium" | "small";
    sortBy: "name" | "type" | "date";
    sortDirection: "asc" | "desc";
    autoArrange: boolean;
    alignToGrid: boolean;
    showDesktopIcons: boolean;
  };

  setViewMode: (
    mode: "large" | "medium" | "small"
  ) => void;

  setSortBy: (
    sort: "name" | "type" | "date"
  ) => void;

  toggleSortDirection: () => void;

  toggleAutoArrange: () => void;

  toggleAlignToGrid: () => void;

  toggleDesktopIcons: () => void;

  arrangeIcons: () => void;

  refresh: () => void;
};

const getDesktopAPI = (): DesktopAPI | null => {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  return (
    (window as any)
      .__ABHISHEK_DESKTOP__ ?? null
  );
};

export const ContextMenu: React.FC = () => {
  const os = useOS();

  const {
    contextMenu,
    closeContextMenu,
    refreshDesktop,
    openApp,
    closeWindow,
    minimizeWindow,
    focusWindow,
    windows,
    activeDesktopId,
    taskbarApps,
    pinTaskbarApp,
    unpinTaskbarApp,
    recentClosedApps,
    desktopIcons,
    renameDesktopIcon,
    removeDesktopIcon,
    createDesktopItem,
    toggleFavoriteDesktopIcon,
    favoriteDesktopIconIds,
  } = os;

  const menuRef =
    useRef<HTMLDivElement>(null);

  const [activeSubMenu, setActiveSubMenu] =
    useState<SubMenu>(null);

  /**
   * ---------------------------------------------------------
   * Close menu when clicking outside
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!contextMenu.isOpen) {
      setActiveSubMenu(null);
      return;
    }

    const handlePointerDown = (
      event: PointerEvent
    ) => {
      // The right-button pointerdown opens the menu; it must not close it again.
      if (event.button === 2) {
        return;
      }

      const target =
        event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        closeContextMenu();
        setActiveSubMenu(null);
      }
    };

    window.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [
    contextMenu.isOpen,
    closeContextMenu,
  ]);

  /**
   * ---------------------------------------------------------
   * Escape closes menu
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!contextMenu.isOpen) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closeContextMenu();
        setActiveSubMenu(null);
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
    contextMenu.isOpen,
    closeContextMenu,
  ]);

  if (!contextMenu.isOpen) {
    return null;
  }

  if (contextMenu.type === "taskbar" && contextMenu.targetId) {
    const appId = contextMenu.targetId as AppId;
    const appWindows = windows.filter(window => window.appId === appId && window.desktopId === activeDesktopId);
    const pinned = taskbarApps.some(app => app.appId === appId);
    const app = taskbarApps.find(item => item.appId === appId) || {
      appId,
      title: appWindows[0]?.title || "Application",
      icon: appWindows[0]?.iconName || "AppWindow",
    };
    const itemClass = "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-slate-100 transition-colors hover:bg-white/10";
    const close = () => closeContextMenu();
    return (
      <div
        ref={menuRef}
        role="menu"
        aria-label={`${app.title} taskbar menu`}
        style={{ top: `${Math.max(8, Math.min(contextMenu.y - 250, window.innerHeight - 330))}px`, left: `${Math.max(8, Math.min(contextMenu.x - 100, window.innerWidth - 238))}px` }}
        className="fixed z-[99999] w-[230px] overflow-hidden rounded-xl border border-white/10 bg-[#202020]/95 p-1.5 shadow-2xl backdrop-blur-2xl"
      >
        <div className="border-b border-white/10 px-3 py-2">
          <p className="truncate text-xs font-semibold text-white">{app.title}</p>
          <p className="text-[10px] text-slate-400">{appWindows.length ? `${appWindows.length} open window${appWindows.length === 1 ? "" : "s"}` : "Not currently open"}</p>
        </div>
        {appWindows.map((appWindow) => (
          <button key={appWindow.id} type="button" className={itemClass} onClick={() => { focusWindow(appWindow.id); close(); }}>
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> {appWindow.title}
          </button>
        ))}
        <button type="button" className={itemClass} onClick={() => { openApp(appId); close(); }}>
          <Plus className="h-4 w-4 text-sky-300" /> New window
        </button>
        {recentClosedApps.includes(appId) && (
          <button type="button" className={itemClass} onClick={() => { openApp(appId); close(); }}>
            <Clock3 className="h-4 w-4 text-amber-300" /> Recently closed
          </button>
        )}
        {appWindows.length > 0 && (
          <button type="button" className={itemClass} onClick={() => { appWindows.forEach(appWindow => minimizeWindow(appWindow.id)); close(); }}>
            <span className="h-4 w-4 rounded border border-slate-400/60" /> Minimize all
          </button>
        )}
        <button type="button" className={itemClass} onClick={() => { pinned ? unpinTaskbarApp(appId) : pinTaskbarApp(app); close(); }}>
          {pinned ? <PinOff className="h-4 w-4 text-slate-300" /> : <Pin className="h-4 w-4 text-slate-300" />}
          {pinned ? "Unpin from taskbar" : "Pin to taskbar"}
        </button>
        {appWindows.length > 0 && (
          <button type="button" className={`${itemClass} text-red-200 hover:bg-red-500/15`} onClick={() => { appWindows.forEach(appWindow => closeWindow(appWindow.id)); close(); }}>
            <X className="h-4 w-4" /> Close window{appWindows.length === 1 ? "" : "s"}
          </button>
        )}
      </div>
    );
  }

  if (contextMenu.type === "icon" && contextMenu.targetId) {
    const icon = desktopIcons.find(item => item.id === contextMenu.targetId);
    if (!icon) return null;

    const itemClass = "group flex h-9 w-full items-center gap-3 rounded-md px-2.5 text-left text-[13px] text-slate-100 transition-colors hover:bg-white/[0.1] hover:text-white disabled:pointer-events-none disabled:opacity-40";
    const iconClass = "h-[17px] w-[17px] shrink-0 text-slate-400 transition-colors group-hover:text-sky-300";
    const divider = <div className="my-1 h-px bg-white/[0.09]" />;
    const close = () => { setActiveSubMenu(null); closeContextMenu(); };
    const isFavorite = favoriteDesktopIconIds.includes(icon.id);
    const iconPath = `C:\\Users\\Abhishek\\Desktop\\${icon.title}${icon.fileExtension ? `.${icon.fileExtension}` : ""}`;
    const menuWidth = 340;
    const menuHeight = 610;
    const left = Math.max(8, Math.min(contextMenu.x, window.innerWidth - menuWidth - 8));
    const top = Math.max(8, Math.min(contextMenu.y, window.innerHeight - menuHeight - 8));
    const share = async (target?: string) => {
      if (target === "phone") {
        if (navigator.share) {
          await navigator.share({ title: icon.title, text: `Shared from Abhishek OS: ${icon.title}` }).catch(() => undefined);
        } else {
          await navigator.clipboard?.writeText(iconPath);
        }
      } else {
        await navigator.clipboard?.writeText(iconPath);
      }
      close();
    };

    return (
      <div ref={menuRef} role="menu" aria-label={`${icon.title} context menu`}
        style={{ top: `${top}px`, left: `${left}px` }}
        className="fixed z-[99999] w-[340px] overflow-visible rounded-xl border border-white/[0.12] bg-[#202020]/95 p-1.5 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[#202020]/88 select-none animate-in fade-in zoom-in-[0.97] duration-150"
        onContextMenu={event => event.preventDefault()}>
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900/80 ring-1 ring-white/10">
            <AppIcon name={icon.iconName} className="h-5 w-5 text-sky-300" />
          </div>
          <div className="min-w-0"><p className="truncate text-xs font-semibold text-white">{icon.title}</p><p className="truncate text-[10px] text-slate-400">{iconPath}</p></div>
        </div>
        <div className="grid grid-cols-5 gap-1 border-y border-white/[0.09] px-1 py-1">
          {[[Scissors, "Cut"], [Copy, "Copy"], [Pencil, "Rename"], [Share2, "Share"], [Trash2, "Delete"]] .map(([Icon, label]) => (
            <button key={label as string} type="button" title={label as string} className="group flex h-12 flex-col items-center justify-center gap-1 rounded-md text-[10px] text-slate-300 hover:bg-white/10 hover:text-white"
              onClick={() => {
                if (label === "Rename") {
                  const next = window.prompt("Rename", icon.title);
                  if (next) renameDesktopIcon(icon.id, next);
                  close();
                } else if (label === "Copy") share(); else if (label === "Delete") {
                  if (icon.appId !== "recycle-bin" && window.confirm(`Remove the "${icon.title}" shortcut from the desktop?`)) {
                    removeDesktopIcon(icon.id);
                  }
                  close();
                } else { close(); }
              }}>
              <Icon className="h-4 w-4 text-slate-400 group-hover:text-sky-300" /><span>{label as string}</span>
            </button>
          ))}
        </div>
        <button type="button" className={itemClass} onClick={() => { openApp(icon.appId, icon.extraData); close(); }}><FolderOpen className={iconClass} />Open</button>
        <button type="button" className={itemClass} onClick={() => share("phone")}><Smartphone className={iconClass} />Send to phone</button>
        <div className="relative" onMouseEnter={() => setActiveSubMenu("share")}>
          <button type="button" className={itemClass}><Share2 className={iconClass} /><span className="flex-1">Share with</span><ChevronRight className="h-4 w-4 text-slate-500" /></button>
          {activeSubMenu === "share" && <div className="absolute left-[calc(100%+5px)] top-0 z-10 w-52 rounded-lg border border-white/10 bg-[#202020]/98 p-1 shadow-2xl animate-in fade-in slide-in-from-left-1 duration-100">
            <button type="button" className={itemClass} onClick={() => share("phone")}><Smartphone className={iconClass} />Nearby device</button>
            <button type="button" className={itemClass} onClick={() => share()}><Clipboard className={iconClass} />Copy link</button>
          </div>}
        </div>
        <button type="button" className={itemClass} onClick={() => { openApp("this-pc", { path: iconPath }); close(); }}><MapPin className={iconClass} />Open file location</button>
        <button type="button" className={itemClass} onClick={() => { toggleFavoriteDesktopIcon(icon.id); close(); }}><Heart className={`${iconClass} ${isFavorite ? "fill-rose-400 text-rose-400" : ""}`} />{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</button>
        <div className="relative" onMouseEnter={() => setActiveSubMenu("compress")}>
          <button type="button" className={itemClass}><Archive className={iconClass} /><span className="flex-1">Compress to</span><ChevronRight className="h-4 w-4 text-slate-500" /></button>
          {activeSubMenu === "compress" && <div className="absolute left-[calc(100%+5px)] top-0 z-10 w-52 rounded-lg border border-white/10 bg-[#202020]/98 p-1 shadow-2xl animate-in fade-in slide-in-from-left-1 duration-100">
            <button type="button" className={itemClass} onClick={() => { openApp("terminal", { command: `compress "${iconPath}"` }); close(); }}><Archive className={iconClass} />ZIP archive</button>
            <button type="button" className={itemClass} onClick={() => { openApp("terminal", { command: `compress "${iconPath}" --7z` }); close(); }}><Archive className={iconClass} />7z archive</button>
          </div>}
        </div>
        <button type="button" className={itemClass} onClick={() => share()}><Clipboard className={iconClass} />Copy as path</button>
        <button type="button" className={itemClass} onClick={() => { openApp("settings"); close(); }}><Info className={iconClass} />Properties</button>
        {divider}
        <button type="button" className={itemClass} onClick={() => { openApp("browser", { url: "https://drive.google.com" }); close(); }}><Cloud className={iconClass} />Back up to cloud</button>
        <button type="button" className={itemClass} onClick={() => { openApp("browser", { url: "https://drive.google.com/drive/my-drive" }); close(); }}><Cloud className={iconClass} />View cloud versions</button>
        <button type="button" className={itemClass} onClick={() => { openApp("writer", { filePath: iconPath }); close(); }}><FileCode2 className={iconClass} />Edit in Notepad</button>
        <button type="button" className={itemClass} onClick={() => { openApp("code-editor", { filePath: iconPath }); close(); }}><FileCode2 className={iconClass} />Open with Code</button>
        <button type="button" className={itemClass} onClick={() => { close(); }}><MoreHorizontal className={iconClass} />Show more options</button>
      </div>
    );
  }

  /**
   * ---------------------------------------------------------
   * Desktop API
   * ---------------------------------------------------------
   */

  const desktopAPI =
    getDesktopAPI();

  const settings =
    desktopAPI?.getSettings();

  /**
   * ---------------------------------------------------------
   * Menu dimensions
   * ---------------------------------------------------------
   */

  const menuWidth = 315;

  const menuHeight = 470;

  const viewportWidth =
    typeof window !== "undefined"
      ? window.innerWidth
      : 1440;

  const viewportHeight =
    typeof window !== "undefined"
      ? window.innerHeight
      : 900;

  /**
   * Keep main menu inside viewport.
   */

  const x = Math.max(
    10,
    Math.min(
      contextMenu.x,
      viewportWidth -
        menuWidth -
        10
    )
  );

  const y = Math.max(
    10,
    Math.min(
      contextMenu.y,
      viewportHeight -
        menuHeight -
        10
    )
  );

  /**
   * ---------------------------------------------------------
   * Helpers
   * ---------------------------------------------------------
   */

  const closeMenu = () => {
    setActiveSubMenu(null);
    closeContextMenu();
  };

  const handleViewChange = (
    mode:
      | "large"
      | "medium"
      | "small"
  ) => {
    desktopAPI?.setViewMode(mode);

    /**
     * Don't close immediately.
     * This feels closer to Windows.
     */
    setActiveSubMenu(null);
    closeContextMenu();
  };

  const handleSortChange = (
    sort:
      | "name"
      | "type"
      | "date"
  ) => {
    desktopAPI?.setSortBy(sort);
    desktopAPI?.arrangeIcons();

    setActiveSubMenu(null);
    closeContextMenu();
  };

  const handleAutoArrange = () => {
    desktopAPI?.toggleAutoArrange();
    desktopAPI?.arrangeIcons();

    setActiveSubMenu(null);
    closeContextMenu();
  };

  const handleAlignToGrid = () => {
    desktopAPI?.toggleAlignToGrid();

    setActiveSubMenu(null);
    closeContextMenu();
  };

  const handleShowDesktopIcons = () => {
    desktopAPI?.toggleDesktopIcons();

    setActiveSubMenu(null);
    closeContextMenu();
  };

  const handleSortDirection = () => {
    desktopAPI?.toggleSortDirection();
    desktopAPI?.arrangeIcons();

    setActiveSubMenu(null);
    closeContextMenu();
  };

  /**
   * ---------------------------------------------------------
   * Generic menu item
   * ---------------------------------------------------------
   */

  const menuItemClass = `
    group
    flex
    h-10
    w-full
    items-center
    rounded-md
    px-2.5
    text-left
    text-[13px]
    font-medium
    text-slate-100
    transition-all
    duration-100
    ease-out
    hover:bg-white/[0.09]
    hover:text-white
    active:bg-white/[0.14]
  `;

  const iconClass = `
    mr-3
    h-[17px]
    w-[17px]
    shrink-0
    text-slate-400
    transition-colors
    duration-100
    group-hover:text-sky-300
  `;

  const submenuItemClass = `
    group
    flex
    h-10
    w-full
    items-center
    rounded-md
    px-2.5
    text-left
    text-[13px]
    font-medium
    text-slate-100
    transition-all
    duration-100
    ease-out
    hover:bg-white/[0.09]
    hover:text-white
    active:bg-white/[0.14]
  `;

  return (
    <div
      ref={menuRef}
      id="desktop-context-menu"
      role="menu"
      aria-label="Desktop context menu"
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}
      className="
        fixed
        z-[99999]
        w-[315px]
        overflow-visible
        rounded-[11px]
        border
        border-white/[0.10]
        bg-[#202020]/95
        p-1
        text-slate-100
        shadow-[0_20px_60px_rgba(0,0,0,0.55)]
        backdrop-blur-2xl
        supports-[backdrop-filter]:bg-[#202020]/85
        select-none
        animate-in
        fade-in
        zoom-in-[0.97]
        duration-100
      "
      onContextMenu={(event) =>
        event.preventDefault()
      }
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          h-8
          items-center
          px-2.5
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.08em]
          text-slate-500
        "
      >
        Abhishek OS
      </div>

      {/* =====================================================
          VIEW
      ===================================================== */}

      <div
        className="relative"
        onMouseEnter={() =>
          setActiveSubMenu("view")
        }
      >
        <button
          type="button"
          role="menuitem"
          className={menuItemClass}
        >
          <Grid2X2
            className={iconClass}
          />

          <span className="flex-1">
            View
          </span>

          <ChevronRight
            className="
              h-4
              w-4
              text-slate-500
              transition-transform
              group-hover:translate-x-[1px]
            "
          />
        </button>

        {/* =================================================
            VIEW SUBMENU
        ================================================= */}

        {activeSubMenu === "view" && (
          <div
            className="
              absolute
              left-[calc(100%+5px)]
              top-0
              w-[315px]
              rounded-[11px]
              border
              border-white/[0.10]
              bg-[#202020]/95
              p-1
              shadow-[0_20px_60px_rgba(0,0,0,0.55)]
              backdrop-blur-2xl
              supports-[backdrop-filter]:bg-[#202020]/85
              animate-in
              fade-in
              slide-in-from-left-1
              duration-100
            "
            onMouseEnter={() =>
              setActiveSubMenu("view")
            }
          >
            {/* Large icons */}

            <button
              type="button"
              className={submenuItemClass}
              onClick={() =>
                handleViewChange(
                  "large"
                )
              }
            >
              <Grid2X2
                className={iconClass}
              />

              <span className="flex-1">
                Large icons
              </span>

              <span className="mr-2 text-[11px] text-slate-500">
                Ctrl+Shift+2
              </span>

              {settings?.viewMode ===
                "large" && (
                <Check className="h-4 w-4 text-sky-400" />
              )}
            </button>

            {/* Medium icons */}

            <button
              type="button"
              className={submenuItemClass}
              onClick={() =>
                handleViewChange(
                  "medium"
                )
              }
            >
              <Grid2X2
                className={iconClass}
              />

              <span className="flex-1">
                Medium icons
              </span>

              <span className="mr-2 text-[11px] text-slate-500">
                Ctrl+Shift+3
              </span>

              {settings?.viewMode ===
                "medium" && (
                <Check className="h-4 w-4 text-sky-400" />
              )}
            </button>

            {/* Small icons */}

            <button
              type="button"
              className={submenuItemClass}
              onClick={() =>
                handleViewChange(
                  "small"
                )
              }
            >
              <Grid2X2
                className={iconClass}
              />

              <span className="flex-1">
                Small icons
              </span>

              <span className="mr-2 text-[11px] text-slate-500">
                Ctrl+Shift+4
              </span>

              {settings?.viewMode ===
                "small" && (
                <Check className="h-4 w-4 text-sky-400" />
              )}
            </button>

            <div className="my-1 h-px bg-white/[0.08]" />

            {/* Auto arrange */}

            <button
              type="button"
              className={submenuItemClass}
              onClick={
                handleAutoArrange
              }
            >
              <AlignJustify
                className={iconClass}
              />

              <span className="flex-1">
                Auto arrange icons
              </span>

              {settings?.autoArrange && (
                <Check className="h-4 w-4 text-sky-400" />
              )}
            </button>

            {/* Align to grid */}

            <button
              type="button"
              className={submenuItemClass}
              onClick={
                handleAlignToGrid
              }
            >
              <Grid2X2
                className={iconClass}
              />

              <span className="flex-1">
                Align icons to grid
              </span>

              {settings?.alignToGrid && (
                <Check className="h-4 w-4 text-sky-400" />
              )}
            </button>

            {/* Show desktop icons */}

            <button
              type="button"
              className={submenuItemClass}
              onClick={
                handleShowDesktopIcons
              }
            >
              <Eye
                className={iconClass}
              />

              <span className="flex-1">
                Show desktop icons
              </span>

              {settings?.showDesktopIcons && (
                <Check className="h-4 w-4 text-sky-400" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          SORT BY
      ===================================================== */}

      <div
        className="relative"
        onMouseEnter={() =>
          setActiveSubMenu("sort")
        }
      >
        <button
          type="button"
          role="menuitem"
          className={menuItemClass}
        >
          <ArrowUpDown
            className={iconClass}
          />

          <span className="flex-1">
            Sort by
          </span>

          <ChevronRight
            className="
              h-4
              w-4
              text-slate-500
            "
          />
        </button>

        {/* =================================================
            SORT SUBMENU
        ================================================= */}

        {activeSubMenu === "sort" && (
          <div
            className="
              absolute
              left-[calc(100%+5px)]
              top-0
              w-[250px]
              rounded-[11px]
              border
              border-white/[0.10]
              bg-[#202020]/95
              p-1
              shadow-[0_20px_60px_rgba(0,0,0,0.55)]
              backdrop-blur-2xl
              supports-[backdrop-filter]:bg-[#202020]/85
              animate-in
              fade-in
              slide-in-from-left-1
              duration-100
            "
            onMouseEnter={() =>
              setActiveSubMenu("sort")
            }
          >
            {/* Name */}

            <button
              type="button"
              className={submenuItemClass}
              onClick={() =>
                handleSortChange(
                  "name"
                )
              }
            >
              <span
                className="
                  mr-3
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                "
              >
                {settings?.sortBy ===
                  "name" && (
                  <Check className="h-4 w-4 text-sky-400" />
                )}
              </span>

              <span>
                Name
              </span>
            </button>

            {/* Type */}

            <button
              type="button"
              className={submenuItemClass}
              onClick={() =>
                handleSortChange(
                  "type"
                )
              }
            >
              <span
                className="
                  mr-3
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                "
              >
                {settings?.sortBy ===
                  "type" && (
                  <Check className="h-4 w-4 text-sky-400" />
                )}
              </span>

              <span>
                Item type
              </span>
            </button>

            {/* Date */}

            <button
              type="button"
              className={submenuItemClass}
              onClick={() =>
                handleSortChange(
                  "date"
                )
              }
            >
              <span
                className="
                  mr-3
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                "
              >
                {settings?.sortBy ===
                  "date" && (
                  <Check className="h-4 w-4 text-sky-400" />
                )}
              </span>

              <span>
                Date modified
              </span>
            </button>

            <div className="my-1 h-px bg-white/[0.08]" />

            {/* Ascending / Descending */}

            <button
              type="button"
              className={submenuItemClass}
              onClick={
                handleSortDirection
              }
            >
              <ArrowUpDown
                className={iconClass}
              />

              <span className="flex-1">
                {settings?.sortDirection ===
                "asc"
                  ? "Ascending"
                  : "Descending"}
              </span>

              <Check className="h-4 w-4 text-sky-400" />
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          REFRESH
      ===================================================== */}

      <button
        type="button"
        role="menuitem"
        className={menuItemClass}
        onClick={() => {
          refreshDesktop();
          desktopAPI?.refresh();
          closeMenu();
        }}
      >
        <RefreshCw
          className={iconClass}
        />

        <span className="flex-1">
          Refresh
        </span>
      </button>

      {/* =====================================================
          UNDO DELETE
      ===================================================== */}

      <button
        type="button"
        role="menuitem"
        className={menuItemClass}
        onClick={() => {
          os.undoDesktopChange();

          closeMenu();
        }}
      >
        <Undo2
          className={iconClass}
        />

        <span className="flex-1">
          Undo Delete
        </span>

        <span className="text-[11px] text-slate-600">
          Ctrl+Z
        </span>
      </button>

      <button type="button" role="menuitem" className={menuItemClass} onClick={() => { os.redoDesktopChange(); closeMenu(); }}>
        <Redo2 className={iconClass} />
        <span className="flex-1">Redo Desktop Change</span>
        <span className="text-[11px] text-slate-600">Ctrl+Y</span>
      </button>

      <div className="my-1 h-px bg-white/[0.08]" />

      {/* =====================================================
          NEW
      ===================================================== */}

      <div
        className="relative"
        onMouseEnter={() =>
          setActiveSubMenu("new")
        }
      >
        <button
          type="button"
          role="menuitem"
          className={menuItemClass}
        >
          <Plus
            className={iconClass}
          />

          <span className="flex-1">
            New
          </span>

          <ChevronRight
            className="
              h-4
              w-4
              text-slate-500
            "
          />
        </button>

        {activeSubMenu === "new" && (
          <div
            className="
              absolute
              left-[calc(100%+5px)]
              top-0
              w-[235px]
              rounded-[11px]
              border
              border-white/[0.10]
              bg-[#202020]/95
              p-1
              shadow-[0_20px_60px_rgba(0,0,0,0.55)]
              backdrop-blur-2xl
              supports-[backdrop-filter]:bg-[#202020]/85
              animate-in
              fade-in
              slide-in-from-left-1
              duration-100
            "
            onMouseEnter={() =>
              setActiveSubMenu("new")
            }
          >
            <button
              type="button"
              className={submenuItemClass}
              onClick={() => {
                void createDesktopItem("folder");
                closeMenu();
              }}
            >
              <Folder
                className={iconClass}
              />

              New folder
            </button>

            <button
              type="button"
              className={submenuItemClass}
              onClick={() => {
                void createDesktopItem("text");
                closeMenu();
              }}
            >
              <FileText
                className={iconClass}
              />

              Text document
            </button>
          </div>
        )}
      </div>

      <div className="my-1 h-px bg-white/[0.08]" />

      {/* =====================================================
          DISPLAY SETTINGS
      ===================================================== */}

      <button
        type="button"
        role="menuitem"
        className={menuItemClass}
        onClick={() => {
          openApp("settings");
          closeMenu();
        }}
      >
        <Monitor
          className={iconClass}
        />

        <span>
          Display settings
        </span>
      </button>

      {/* =====================================================
          PERSONALIZE
      ===================================================== */}

      <button
        type="button"
        role="menuitem"
        className={menuItemClass}
        onClick={() => {
          openApp("settings");
          closeMenu();
        }}
      >
        <Paintbrush
          className={iconClass}
        />

        <span>
          Personalize
        </span>
      </button>

      <div className="my-1 h-px bg-white/[0.08]" />

      {/* =====================================================
          OPEN IN TERMINAL
      ===================================================== */}

      <button
        type="button"
        role="menuitem"
        className={menuItemClass}
        onClick={() => {
          openApp("terminal");
          closeMenu();
        }}
      >
        <Terminal
          className="
            mr-3
            h-[17px]
            w-[17px]
            shrink-0
            text-emerald-400
            transition-colors
            group-hover:text-emerald-300
          "
        />

        <span className="flex-1">
          Open in Terminal
        </span>
      </button>

      {/* =====================================================
          OPEN WITH CODE
      ===================================================== */}

      <button
        type="button"
        role="menuitem"
        className={menuItemClass}
        onClick={() => {
          /**
           * If you register a "code" app:
           */
          openApp("code-editor");
          closeMenu();
        }}
      >
        <Code2
          className="
            mr-3
            h-[17px]
            w-[17px]
            shrink-0
            text-blue-400
            transition-colors
            group-hover:text-blue-300
          "
        />

        <span className="flex-1">
          Open with Code
        </span>
      </button>

      <div className="my-1 h-px bg-white/[0.08]" />

      {/* =====================================================
          FILE EXPLORER
      ===================================================== */}

      <button
        type="button"
        role="menuitem"
        className={menuItemClass}
        onClick={() => {
          openApp("this-pc");
          closeMenu();
        }}
      >
        <Monitor
          className={iconClass}
        />

        <span className="flex-1">
          Open File Explorer
        </span>
      </button>

      {/* =====================================================
          PROJECTS
      ===================================================== */}

      <button
        type="button"
        role="menuitem"
        className={menuItemClass}
        onClick={() => {
          openApp("projects");
          closeMenu();
        }}
      >
        <FolderKanban
          className={iconClass}
        />

        <span className="flex-1">
          Browse Projects
        </span>
      </button>

      {/* =====================================================
          PORTFOLIO CONTROL CENTER
      ===================================================== */}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div
        className="
          mt-1
          flex
          h-7
          items-center
          gap-1.5
          px-2.5
          text-[10px]
          text-slate-600
        "
      >
        <Settings2
          className="h-3 w-3"
        />

        <span>
          Abhishek OS Desktop
        </span>
      </div>
    </div>
  );
};

export default ContextMenu;