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
  Terminal,
  FolderKanban,
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
  Heart,
  Archive,
  Clipboard,
  Cloud,
  FileCode2,
  MoreHorizontal,
  FolderOpen,
  Info,
  Sparkles,
  MoveDiagonal2,
  ShieldCheck,
  FilePenLine,
  AlertCircle,
} from "lucide-react";

/* =========================================================
   TYPES
   ========================================================= */

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

type RenameState = {
  id: string;
  title: string;
};

/* =========================================================
   DESKTOP API
   ========================================================= */

const getDesktopAPI = (): DesktopAPI | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    (
      window as unknown as {
        __ABHISHEK_DESKTOP__?: DesktopAPI;
      }
    ).__ABHISHEK_DESKTOP__ ?? null
  );
};

/* =========================================================
   GLASS DIVIDER
   ========================================================= */

const Divider = () => (
  <div className="mx-2 my-1.5 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
);

/* =========================================================
   MENU ITEM
   ========================================================= */

interface MenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  active?: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  icon,
  shortcut,
  danger = false,
  disabled = false,
  active = false,
  hasSubmenu = false,
  onClick,
  onMouseEnter,
}) => {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`
        group relative flex h-9 w-full items-center
        rounded-lg px-2 text-left
        text-[12.5px] font-medium
        transition-all duration-150
        ease-out
        disabled:pointer-events-none
        disabled:opacity-40

        ${
          danger
            ? "text-red-200 hover:bg-red-500/[0.12] hover:text-red-100"
            : "text-slate-200 hover:bg-white/[0.085] hover:text-white"
        }

        ${active ? "bg-white/[0.08]" : ""}
      `}
    >
      <span
        className="
          pointer-events-none absolute inset-0
          rounded-lg opacity-0
          transition-opacity duration-150
          group-hover:opacity-100
          bg-gradient-to-r
          from-white/[0.045]
          via-white/[0.025]
          to-transparent
        "
      />

      {active && (
        <span
          className="
            absolute left-0 top-1.5 bottom-1.5
            w-[2px] rounded-full
            bg-sky-400
            shadow-[0_0_10px_rgba(56,189,248,0.8)]
          "
        />
      )}

      {icon && (
        <span
          className={`
            relative z-10 mr-3
            flex h-[18px] w-[18px]
            shrink-0 items-center justify-center
            transition-all duration-150

            ${
              danger
                ? "text-red-300 group-hover:text-red-200"
                : "text-slate-400 group-hover:text-sky-300"
            }
          `}
        >
          {icon}
        </span>
      )}

      <span className="relative z-10 flex-1 truncate">
        {children}
      </span>

      {shortcut && (
        <span
          className="
            relative z-10 ml-4
            text-[10px]
            font-medium
            tracking-wide
            text-slate-500
            group-hover:text-slate-400
          "
        >
          {shortcut}
        </span>
      )}

      {hasSubmenu && (
        <ChevronRight
          className="
            relative z-10 ml-2
            h-3.5 w-3.5
            text-slate-500
            transition-transform duration-150
            group-hover:translate-x-0.5
            group-hover:text-slate-300
          "
        />
      )}
    </button>
  );
};

/* =========================================================
   SUBMENU
   ========================================================= */

interface SubMenuContainerProps {
  children: React.ReactNode;
  width?: number;
}

const SubMenuContainer: React.FC<
  SubMenuContainerProps
> = ({ children, width = 260 }) => {
  return (
    <div
      style={{ width }}
      className="
        absolute
        left-[calc(100%+6px)]
        top-0
        z-[100]
        overflow-hidden
        rounded-xl
        border
        border-white/[0.13]
        bg-[#11151d]/[0.88]
        p-1.5
        shadow-[0_24px_80px_rgba(0,0,0,0.58)]
        backdrop-blur-[30px]
        backdrop-saturate-[180%]
        animate-in
        fade-in
        slide-in-from-left-1
        zoom-in-[0.98]
        duration-150
      "
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
    >
      <div
        className="
          pointer-events-none
          absolute inset-x-0 top-0
          h-20
          bg-gradient-to-b
          from-white/[0.055]
          to-transparent
        "
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/* =========================================================
   CUSTOM RENAME DIALOG
   ========================================================= */

interface RenameDialogProps {
  renameState: RenameState | null;
  onCancel: () => void;
  onRename: (
    id: string,
    nextName: string
  ) => void;
}

const RenameDialog: React.FC<
  RenameDialogProps
> = ({
  renameState,
  onCancel,
  onRename,
}) => {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [value, setValue] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!renameState) {
      return;
    }

    setValue(renameState.title);
    setError("");

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 60);

    return () => {
      window.clearTimeout(timer);
    };
  }, [renameState]);

  useEffect(() => {
    if (!renameState) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }

      if (event.key === "Enter") {
        event.preventDefault();

        const trimmed =
          value.trim();

        if (!trimmed) {
          setError(
            "Please enter a name."
          );
          return;
        }

        if (
          trimmed ===
          renameState.title
        ) {
          onCancel();
          return;
        }

        onRename(
          renameState.id,
          trimmed
        );
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
    renameState,
    value,
    onCancel,
    onRename,
  ]);

  if (!renameState) {
    return null;
  }

  const handleRename = () => {
    const trimmed =
      value.trim();

    if (!trimmed) {
      setError(
        "Please enter a name."
      );
      inputRef.current?.focus();
      return;
    }

    if (
      trimmed ===
      renameState.title
    ) {
      onCancel();
      return;
    }

    onRename(
      renameState.id,
      trimmed
    );
  };

  return (
    <div
      className="
        fixed inset-0 z-[100000]
        flex items-center justify-center
        bg-black/[0.18]
        backdrop-blur-[2px]
        animate-in
        fade-in
        duration-150
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rename-dialog-title"
        className="
          relative
          w-[420px]
          overflow-hidden
          rounded-[20px]
          border
          border-white/[0.14]
          bg-[#0d1118]/[0.94]
          shadow-[0_35px_120px_rgba(0,0,0,0.72)]
          backdrop-blur-[36px]
          backdrop-saturate-[190%]
          animate-in
          zoom-in-[0.94]
          slide-in-from-bottom-2
          duration-200
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* Top glass reflection */}
        <div
          className="
            pointer-events-none
            absolute inset-x-0 top-0
            h-28
            bg-gradient-to-b
            from-white/[0.055]
            via-white/[0.018]
            to-transparent
          "
        />

        {/* Subtle blue glow */}
        <div
          className="
            pointer-events-none
            absolute
            -left-20
            -top-24
            h-52
            w-52
            rounded-full
            bg-sky-400/[0.065]
            blur-3xl
          "
        />

        {/* Header */}
        <div
          className="
            relative
            flex
            items-center
            gap-3.5
            px-5
            pt-5
            pb-4
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-[13px]
              border
              border-white/[0.10]
              bg-white/[0.045]
              shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
            "
          >
            <FilePenLine
              className="
                h-[21px]
                w-[21px]
                text-sky-300
                drop-shadow-[0_0_8px_rgba(56,189,248,0.32)]
              "
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="rename-dialog-title"
              className="
                text-[14px]
                font-semibold
                tracking-[-0.01em]
                text-white
              "
            >
              Rename item
            </h2>

            <p
              className="
                mt-0.5
                text-[10.5px]
                text-slate-500
              "
            >
              Enter a new name for this desktop item
            </p>
          </div>

          <button
            type="button"
            aria-label="Close rename dialog"
            onClick={onCancel}
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              text-slate-500
              transition-all
              duration-150
              hover:bg-white/[0.07]
              hover:text-white
            "
          >
            <X
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </button>
        </div>

        <Divider />

        {/* Body */}
        <div
          className="
            relative
            px-5
            py-5
          "
        >
          <label
            htmlFor="abhishek-os-rename-input"
            className="
              mb-2
              block
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-slate-500
            "
          >
            Name
          </label>

          <div
            className={`
              group
              relative
              flex
              h-[46px]
              items-center
              rounded-xl
              border
              bg-black/[0.20]
              transition-all
              duration-150

              ${
                error
                  ? "border-red-400/40 shadow-[0_0_0_3px_rgba(248,113,113,0.06)]"
                  : "border-white/[0.11] focus-within:border-sky-400/45 focus-within:bg-black/[0.26] focus-within:shadow-[0_0_0_3px_rgba(56,189,248,0.06)]"
              }
            `}
          >
            <div
              className="
                ml-3
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-white/[0.045]
                text-slate-400
              "
            >
              <FileText
                className="h-3.5 w-3.5"
                strokeWidth={1.8}
              />
            </div>

            <input
              ref={inputRef}
              id="abhishek-os-rename-input"
              type="text"
              value={value}
              onChange={(event) => {
                setValue(
                  event.target.value
                );

                if (error) {
                  setError("");
                }
              }}
              spellCheck={false}
              autoComplete="off"
              className="
                h-full
                min-w-0
                flex-1
                bg-transparent
                px-3
                text-[13px]
                font-medium
                text-white
                outline-none
                placeholder:text-slate-600
              "
              placeholder="Enter item name"
            />

            <span
              className="
                mr-3
                hidden
                text-[9px]
                text-slate-600
                sm:block
              "
            >
              Enter
            </span>
          </div>

          {error && (
            <div
              className="
                mt-2
                flex
                items-center
                gap-1.5
                text-[10px]
                text-red-300
              "
            >
              <AlertCircle
                className="h-3 w-3"
              />
              <span>{error}</span>
            </div>
          )}

          <div
            className="
              mt-3
              flex
              items-center
              gap-1.5
              text-[9.5px]
              text-slate-600
            "
          >
            <span
              className="
                rounded
                border
                border-white/[0.08]
                bg-white/[0.035]
                px-1.5
                py-0.5
                text-[9px]
                text-slate-500
              "
            >
              Enter
            </span>

            <span>
              to rename
            </span>

            <span className="mx-1">
              •
            </span>

            <span
              className="
                rounded
                border
                border-white/[0.08]
                bg-white/[0.035]
                px-1.5
                py-0.5
                text-[9px]
                text-slate-500
              "
            >
              Esc
            </span>

            <span>
              to cancel
            </span>
          </div>
        </div>

        <Divider />

        {/* Footer */}
        <div
          className="
            relative
            flex
            items-center
            justify-end
            gap-2
            px-5
            py-4
          "
        >
          <button
            type="button"
            onClick={onCancel}
            className="
              h-9
              rounded-lg
              border
              border-white/[0.09]
              bg-white/[0.035]
              px-4
              text-[11px]
              font-medium
              text-slate-300
              transition-all
              duration-150
              hover:bg-white/[0.075]
              hover:text-white
              active:scale-[0.98]
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleRename}
            className="
              group
              relative
              flex
              h-9
              items-center
              gap-2
              overflow-hidden
              rounded-lg
              border
              border-sky-300/20
              bg-sky-400/[0.13]
              px-4
              text-[11px]
              font-semibold
              text-sky-100
              shadow-[0_0_20px_rgba(56,189,248,0.08)]
              transition-all
              duration-150
              hover:border-sky-300/30
              hover:bg-sky-400/[0.19]
              hover:shadow-[0_0_24px_rgba(56,189,248,0.13)]
              active:scale-[0.98]
            "
          >
            <span
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-r
                from-transparent
                via-white/[0.06]
                to-transparent
                opacity-0
                transition-opacity
                group-hover:opacity-100
              "
            />

            <FilePenLine
              className="
                relative
                h-3.5
                w-3.5
                text-sky-300
              "
              strokeWidth={1.9}
            />

            <span className="relative">
              Rename
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN CONTEXT MENU
   ========================================================= */

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

  /*
   * IMPORTANT:
   * This replaces window.prompt().
   * Chrome/native browser rename dialogs are never used.
   */
  const [renameState, setRenameState] =
    useState<RenameState | null>(null);

  /* =========================================================
     CLOSE WHEN CLICKING OUTSIDE
     ========================================================= */

  useEffect(() => {
    if (!contextMenu.isOpen) {
      setActiveSubMenu(null);
      return;
    }

    const handlePointerDown = (
      event: PointerEvent
    ) => {
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

  /* =========================================================
     ESCAPE FOR CONTEXT MENU
     ========================================================= */

  useEffect(() => {
    if (!contextMenu.isOpen) {
      return;
    }

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

  /* =========================================================
     CUSTOM RENAME HANDLERS
     ========================================================= */

  const openRenameDialog = (
    id: string,
    title: string
  ) => {
    setActiveSubMenu(null);
    closeContextMenu();

    /*
     * Small delay makes the transition from the
     * context menu to the rename dialog feel natural.
     */
    window.setTimeout(() => {
      setRenameState({
        id,
        title,
      });
    }, 40);
  };

  const closeRenameDialog = () => {
    setRenameState(null);
  };

  const handleRename = (
    id: string,
    nextName: string
  ) => {
    renameDesktopIcon(
      id,
      nextName
    );

    setRenameState(null);
  };

  /* =========================================================
     RENAME DIALOG RENDER
     ========================================================= */

  /*
   * The dialog is rendered independently so it remains available
   * even after the context menu itself has been closed.
   */
  const renameDialog = (
    <RenameDialog
      renameState={renameState}
      onCancel={closeRenameDialog}
      onRename={handleRename}
    />
  );

  if (!contextMenu.isOpen) {
    return renameDialog;
  }

  /* =========================================================
     TASKBAR CONTEXT MENU
     ========================================================= */

  if (
    contextMenu.type === "taskbar" &&
    contextMenu.targetId
  ) {
    const appId =
      contextMenu.targetId as AppId;

    const appWindows =
      windows.filter(
        (appWindow) =>
          appWindow.appId === appId &&
          appWindow.desktopId ===
            activeDesktopId
      );

    const pinned =
      taskbarApps.some(
        (app) =>
          app.appId === appId
      );

    const app =
      taskbarApps.find(
        (item) =>
          item.appId === appId
      ) || {
        appId,
        title:
          appWindows[0]?.title ||
          "Application",
        icon:
          appWindows[0]?.iconName ||
          "AppWindow",
      };

    const close = () => {
      closeContextMenu();
      setActiveSubMenu(null);
    };

    const top = Math.max(
      8,
      Math.min(
        contextMenu.y - 310,
        window.innerHeight - 430
      )
    );

    const left = Math.max(
      8,
      Math.min(
        contextMenu.x - 115,
        window.innerWidth - 260
      )
    );

    return (
      <>
        <div
          ref={menuRef}
          role="menu"
          aria-label={`${app.title} taskbar menu`}
          style={{
            top,
            left,
          }}
          className="
            fixed z-[99999]
            w-[250px]
            overflow-hidden
            rounded-2xl
            border border-white/[0.14]
            bg-[#10141c]/[0.84]
            p-1.5
            text-slate-100
            shadow-[0_28px_90px_rgba(0,0,0,0.65)]
            backdrop-blur-[32px]
            backdrop-saturate-[180%]
            select-none
            animate-in
            fade-in
            zoom-in-[0.94]
            slide-in-from-bottom-1
            duration-150
          "
          onContextMenu={(event) =>
            event.preventDefault()
          }
        >
          <div
            className="
              pointer-events-none
              absolute inset-x-0 top-0
              h-24
              bg-gradient-to-b
              from-sky-400/[0.06]
              via-white/[0.025]
              to-transparent
            "
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-1 flex items-center gap-3 px-2.5 py-2.5">
              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-xl
                  border border-white/[0.1]
                  bg-white/[0.055]
                  shadow-inner
                "
              >
                <AppIcon
                  name={app.icon}
                  className="h-5 w-5 text-sky-300"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">
                  {app.title}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  {appWindows.length
                    ? `${appWindows.length} open ${
                        appWindows.length === 1
                          ? "window"
                          : "windows"
                      }`
                    : "Not currently open"}
                </p>
              </div>

              {pinned && (
                <Pin className="h-3.5 w-3.5 text-sky-400" />
              )}
            </div>

            <Divider />

            {/* Open windows */}
            {appWindows.length > 0 && (
              <>
                <div className="px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Open windows
                </div>

                {appWindows.map(
                  (appWindow) => (
                    <MenuItem
                      key={appWindow.id}
                      icon={
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                      }
                      onClick={() => {
                        focusWindow(
                          appWindow.id
                        );
                        close();
                      }}
                    >
                      {appWindow.title}
                    </MenuItem>
                  )
                )}
              </>
            )}

            <MenuItem
              icon={
                <Plus className="h-4 w-4" />
              }
              onClick={() => {
                openApp(appId);
                close();
              }}
            >
              New window
            </MenuItem>

            {recentClosedApps.includes(
              appId
            ) && (
              <MenuItem
                icon={
                  <Clock3 className="h-4 w-4" />
                }
                onClick={() => {
                  openApp(appId);
                  close();
                }}
              >
                Recently closed
              </MenuItem>
            )}

            {appWindows.length > 0 && (
              <MenuItem
                icon={
                  <MoveDiagonal2 className="h-4 w-4" />
                }
                onClick={() => {
                  appWindows.forEach(
                    (appWindow) =>
                      minimizeWindow(
                        appWindow.id
                      )
                  );
                  close();
                }}
              >
                Minimize all
              </MenuItem>
            )}

            <Divider />

            <MenuItem
              icon={
                pinned ? (
                  <PinOff className="h-4 w-4" />
                ) : (
                  <Pin className="h-4 w-4" />
                )
              }
              onClick={() => {
                pinned
                  ? unpinTaskbarApp(
                      appId
                    )
                  : pinTaskbarApp(app);

                close();
              }}
            >
              {pinned
                ? "Unpin from taskbar"
                : "Pin to taskbar"}
            </MenuItem>

            {appWindows.length > 0 && (
              <MenuItem
                danger
                icon={
                  <X className="h-4 w-4" />
                }
                onClick={() => {
                  appWindows.forEach(
                    (appWindow) =>
                      closeWindow(
                        appWindow.id
                      )
                  );

                  close();
                }}
              >
                Close{" "}
                {appWindows.length === 1
                  ? "window"
                  : "windows"}
              </MenuItem>
            )}
          </div>
        </div>

        {renameDialog}
      </>
    );
  }

  /* =========================================================
     DESKTOP ICON CONTEXT MENU
     ========================================================= */

  if (
    contextMenu.type === "icon" &&
    contextMenu.targetId
  ) {
    const icon = desktopIcons.find(
      (item) =>
        item.id === contextMenu.targetId
    );

    if (!icon) {
      return renameDialog;
    }

    const isFavorite =
      favoriteDesktopIconIds.includes(
        icon.id
      );

    const iconPath =
      `C:\\Users\\Abhishek\\Desktop\\${icon.title}` +
      `${
        icon.fileExtension
          ? `.${icon.fileExtension}`
          : ""
      }`;

    const menuWidth = 330;
    const menuHeight = 650;

    const left = Math.max(
      8,
      Math.min(
        contextMenu.x,
        window.innerWidth -
          menuWidth -
          8
      )
    );

    const top = Math.max(
      8,
      Math.min(
        contextMenu.y,
        window.innerHeight -
          menuHeight -
          8
      )
    );

    const close = () => {
      setActiveSubMenu(null);
      closeContextMenu();
    };

    const share = async (
      target?: string
    ) => {
      if (
        target === "phone" &&
        navigator.share
      ) {
        await navigator
          .share({
            title: icon.title,
            text: `Shared from Abhishek OS: ${icon.title}`,
          })
          .catch(() => undefined);
      } else {
        await navigator.clipboard
          ?.writeText(iconPath)
          .catch(() => undefined);
      }

      close();
    };

    return (
      <>
        <div
          ref={menuRef}
          role="menu"
          aria-label={`${icon.title} context menu`}
          style={{
            top,
            left,
          }}
          className="
            fixed z-[99999]
            w-[330px]
            overflow-visible
            rounded-2xl
            border border-white/[0.14]
            bg-[#10141c]/[0.86]
            p-1.5
            text-slate-100
            shadow-[0_30px_100px_rgba(0,0,0,0.68)]
            backdrop-blur-[32px]
            backdrop-saturate-[190%]
            select-none
            animate-in
            fade-in
            zoom-in-[0.94]
            duration-150
          "
          onContextMenu={(event) =>
            event.preventDefault()
          }
        >
          {/* Glass background */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              overflow-hidden
              rounded-2xl
            "
          >
            <div
              className="
                absolute -left-20 -top-20
                h-40 w-40
                rounded-full
                bg-sky-400/[0.07]
                blur-3xl
              "
            />

            <div
              className="
                absolute -right-20 top-20
                h-44 w-44
                rounded-full
                bg-indigo-500/[0.055]
                blur-3xl
              "
            />

            <div
              className="
                absolute inset-x-0 top-0
                h-28
                bg-gradient-to-b
                from-white/[0.055]
                to-transparent
              "
            />
          </div>

          <div className="relative z-10">
            {/* File header */}
            <div className="flex items-center gap-3 px-2.5 py-2.5">
              <div
                className="
                  relative flex h-10 w-10
                  shrink-0 items-center justify-center
                  rounded-xl
                  border border-white/[0.12]
                  bg-white/[0.055]
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                "
              >
                <AppIcon
                  name={icon.iconName}
                  className="h-6 w-6 text-sky-300"
                />

                {isFavorite && (
                  <span
                    className="
                      absolute -right-1 -top-1
                      flex h-4 w-4
                      items-center justify-center
                      rounded-full
                      border border-white/20
                      bg-rose-500/90
                      shadow-[0_0_12px_rgba(244,63,94,0.45)]
                    "
                  >
                    <Heart className="h-2.5 w-2.5 fill-white text-white" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-white">
                  {icon.title}
                </p>

                <p className="mt-0.5 truncate text-[9.5px] text-slate-500">
                  {icon.fileExtension
                    ? `${icon.fileExtension.toUpperCase()} file`
                    : "Desktop item"}
                </p>
              </div>

              <ShieldCheck className="h-4 w-4 text-emerald-400/70" />
            </div>

            {/* Quick actions */}
            <div
              className="
                mx-1
                grid grid-cols-5
                overflow-hidden
                rounded-xl
                border border-white/[0.08]
                bg-black/[0.12]
              "
            >
              {[
                {
                  icon: Scissors,
                  label: "Cut",
                  action: close,
                },
                {
                  icon: Copy,
                  label: "Copy",
                  action: () =>
                    share(),
                },
                {
                  icon: Pencil,
                  label: "Rename",
                  action: () =>
                    openRenameDialog(
                      icon.id,
                      icon.title
                    ),
                },
                {
                  icon: Share2,
                  label: "Share",
                  action: () =>
                    share("phone"),
                },
                {
                  icon: Trash2,
                  label: "Delete",
                  action: () => {
                    if (
                      icon.appId !==
                        "recycle-bin" &&
                      window.confirm(
                        `Remove "${icon.title}" from the desktop?`
                      )
                    ) {
                      removeDesktopIcon(
                        icon.id
                      );
                    }

                    close();
                  },
                },
              ].map(
                ({
                  icon: ActionIcon,
                  label,
                  action,
                }) => (
                  <button
                    key={label}
                    type="button"
                    title={label}
                    onClick={action}
                    className="
                      group flex h-14
                      flex-col items-center
                      justify-center gap-1
                      border-r border-white/[0.06]
                      last:border-r-0
                      text-slate-400
                      transition-all duration-150
                      hover:bg-white/[0.07]
                      hover:text-white
                    "
                  >
                    <ActionIcon
                      className="
                        h-4 w-4
                        transition-transform
                        duration-150
                        group-hover:-translate-y-0.5
                        group-hover:text-sky-300
                      "
                    />

                    <span className="text-[9px]">
                      {label}
                    </span>
                  </button>
                )
              )}
            </div>

            <div className="px-1 pt-1">
              {/* Open */}
              <MenuItem
                icon={
                  <FolderOpen className="h-4 w-4" />
                }
                onClick={() => {
                  openApp(
                    icon.appId,
                    icon.extraData
                  );

                  close();
                }}
              >
                Open
              </MenuItem>

              {/* Send to phone */}
              <MenuItem
                icon={
                  <Smartphone className="h-4 w-4" />
                }
                onClick={() =>
                  share("phone")
                }
              >
                Send to phone
              </MenuItem>

              {/* Share submenu */}
              <div
                className="relative"
                onMouseEnter={() =>
                  setActiveSubMenu(
                    "share"
                  )
                }
              >
                <MenuItem
                  icon={
                    <Share2 className="h-4 w-4" />
                  }
                  hasSubmenu
                >
                  Share with
                </MenuItem>

                {activeSubMenu ===
                  "share" && (
                  <SubMenuContainer
                    width={220}
                  >
                    <MenuItem
                      icon={
                        <Smartphone className="h-4 w-4" />
                      }
                      onClick={() =>
                        share("phone")
                      }
                    >
                      Nearby device
                    </MenuItem>

                    <MenuItem
                      icon={
                        <Clipboard className="h-4 w-4" />
                      }
                      onClick={() =>
                        share()
                      }
                    >
                      Copy link
                    </MenuItem>
                  </SubMenuContainer>
                )}
              </div>

              {/* Open file location */}
              <MenuItem
                icon={
                  <MoveDiagonal2 className="h-4 w-4" />
                }
                onClick={() => {
                  openApp("this-pc", {
                    path: iconPath,
                  });

                  close();
                }}
              >
                Open file location
              </MenuItem>

              {/* Favorites */}
              <MenuItem
                icon={
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite
                        ? "fill-rose-400 text-rose-400"
                        : ""
                    }`}
                  />
                }
                onClick={() => {
                  toggleFavoriteDesktopIcon(
                    icon.id
                  );

                  close();
                }}
              >
                {isFavorite
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </MenuItem>

              {/* Compress */}
              <div
                className="relative"
                onMouseEnter={() =>
                  setActiveSubMenu(
                    "compress"
                  )
                }
              >
                <MenuItem
                  icon={
                    <Archive className="h-4 w-4" />
                  }
                  hasSubmenu
                >
                  Compress to
                </MenuItem>

                {activeSubMenu ===
                  "compress" && (
                  <SubMenuContainer
                    width={220}
                  >
                    <MenuItem
                      icon={
                        <Archive className="h-4 w-4" />
                      }
                      onClick={() => {
                        openApp(
                          "terminal",
                          {
                            command: `compress "${iconPath}"`,
                          }
                        );

                        close();
                      }}
                    >
                      ZIP archive
                    </MenuItem>

                    <MenuItem
                      icon={
                        <Archive className="h-4 w-4" />
                      }
                      onClick={() => {
                        openApp(
                          "terminal",
                          {
                            command: `compress "${iconPath}" --7z`,
                          }
                        );

                        close();
                      }}
                    >
                      7z archive
                    </MenuItem>
                  </SubMenuContainer>
                )}
              </div>

              {/* Copy path */}
              <MenuItem
                icon={
                  <Clipboard className="h-4 w-4" />
                }
                onClick={() =>
                  share()
                }
              >
                Copy as path
              </MenuItem>

              {/* Properties */}
              <MenuItem
                icon={
                  <Info className="h-4 w-4" />
                }
                onClick={() => {
                  openApp("settings");
                  close();
                }}
              >
                Properties
              </MenuItem>
            </div>

            <Divider />

            <div className="px-1">
              {/* Cloud */}
              <MenuItem
                icon={
                  <Cloud className="h-4 w-4" />
                }
                onClick={() => {
                  openApp("browser", {
                    url: "https://drive.google.com",
                  });

                  close();
                }}
              >
                Back up to cloud
              </MenuItem>

              <MenuItem
                icon={
                  <Cloud className="h-4 w-4" />
                }
                onClick={() => {
                  openApp("browser", {
                    url: "https://drive.google.com/drive/my-drive",
                  });

                  close();
                }}
              >
                View cloud versions
              </MenuItem>

              {/* Notepad */}
              <MenuItem
                icon={
                  <FileCode2 className="h-4 w-4" />
                }
                onClick={() => {
                  openApp("writer", {
                    filePath: iconPath,
                  });

                  close();
                }}
              >
                Edit in Notepad
              </MenuItem>

              {/* Code */}
              <MenuItem
                icon={
                  <Code2 className="h-4 w-4 text-blue-400" />
                }
                onClick={() => {
                  openApp(
                    "code-editor",
                    {
                      filePath: iconPath,
                    }
                  );

                  close();
                }}
              >
                Open with Code
              </MenuItem>

              {/* More */}
             
            </div>
          </div>
        </div>

        {renameDialog}
      </>
    );
  }

  /* =========================================================
     DESKTOP CONTEXT MENU
     ========================================================= */

  const desktopAPI =
    getDesktopAPI();

  const settings =
    desktopAPI?.getSettings();

  const menuWidth = 315;
  const menuHeight = 510;

  const viewportWidth =
    typeof window !== "undefined"
      ? window.innerWidth
      : 1440;

  const viewportHeight =
    typeof window !== "undefined"
      ? window.innerHeight
      : 900;

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
    closeMenu();
  };

  const handleSortChange = (
    sort:
      | "name"
      | "type"
      | "date"
  ) => {
    desktopAPI?.setSortBy(sort);
    desktopAPI?.arrangeIcons();
    closeMenu();
  };

  const handleAutoArrange = () => {
    desktopAPI?.toggleAutoArrange();
    desktopAPI?.arrangeIcons();
    closeMenu();
  };

  const handleAlignToGrid = () => {
    desktopAPI?.toggleAlignToGrid();
    closeMenu();
  };

  const handleShowDesktopIcons = () => {
    desktopAPI?.toggleDesktopIcons();
    closeMenu();
  };

  const handleSortDirection = () => {
    desktopAPI?.toggleSortDirection();
    desktopAPI?.arrangeIcons();
    closeMenu();
  };

  return (
    <>
      <div
        ref={menuRef}
        id="desktop-context-menu"
        role="menu"
        aria-label="Abhishek OS desktop context menu"
        style={{
          top: y,
          left: x,
        }}
        className="
          fixed z-[99999]
          w-[315px]
          overflow-visible
          rounded-2xl
          border border-white/[0.14]
          bg-[#0d1118]/[0.84]
          p-1.5
          text-slate-100
          shadow-[0_30px_100px_rgba(0,0,0,0.68)]
          backdrop-blur-[34px]
          backdrop-saturate-[190%]
          select-none
          animate-in
          fade-in
          zoom-in-[0.94]
          duration-150
        "
        onContextMenu={(event) =>
          event.preventDefault()
        }
      >
        {/* Glass light */}
        <div
          className="
            pointer-events-none
            absolute inset-0
            overflow-hidden
            rounded-2xl
          "
        >
          <div
            className="
              absolute -left-16 -top-16
              h-40 w-40
              rounded-full
              bg-sky-400/[0.065]
              blur-3xl
            "
          />

          <div
            className="
              absolute -right-20 top-32
              h-44 w-44
              rounded-full
              bg-indigo-500/[0.05]
              blur-3xl
            "
          />

          <div
            className="
              absolute inset-x-0 top-0
              h-24
              bg-gradient-to-b
              from-white/[0.055]
              to-transparent
            "
          />

          <div
            className="
              absolute inset-x-4 top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/[0.18]
              to-transparent
            "
          />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div
            className="
              flex h-9
              items-center
              gap-2
              px-2.5
            "
          >
            <Sparkles
              className="
                h-3.5 w-3.5
                text-sky-400
                drop-shadow-[0_0_7px_rgba(56,189,248,0.6)]
              "
            />

            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-slate-500
              "
            >
              Abhishek OS
            </span>

            <span className="ml-auto text-[9px] text-slate-600">
              Desktop
            </span>
          </div>

          <Divider />

          {/* View */}
          <div
            className="relative"
            onMouseEnter={() =>
              setActiveSubMenu("view")
            }
          >
            <MenuItem
              icon={
                <Grid2X2 className="h-4 w-4" />
              }
              hasSubmenu
            >
              View
            </MenuItem>

            {activeSubMenu ===
              "view" && (
              <SubMenuContainer width={315}>
                <div className="px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Icon layout
                </div>

                <MenuItem
                  icon={
                    <Grid2X2 className="h-4 w-4" />
                  }
                  shortcut="Ctrl+Shift+2"
                  active={
                    settings?.viewMode ===
                    "large"
                  }
                  onClick={() =>
                    handleViewChange(
                      "large"
                    )
                  }
                >
                  Large icons

                  {settings?.viewMode ===
                    "large" && (
                    <Check className="ml-2 h-3.5 w-3.5 text-sky-400" />
                  )}
                </MenuItem>

                <MenuItem
                  icon={
                    <Grid2X2 className="h-4 w-4" />
                  }
                  shortcut="Ctrl+Shift+3"
                  active={
                    settings?.viewMode ===
                    "medium"
                  }
                  onClick={() =>
                    handleViewChange(
                      "medium"
                    )
                  }
                >
                  Medium icons

                  {settings?.viewMode ===
                    "medium" && (
                    <Check className="ml-2 h-3.5 w-3.5 text-sky-400" />
                  )}
                </MenuItem>

                <MenuItem
                  icon={
                    <Grid2X2 className="h-4 w-4" />
                  }
                  shortcut="Ctrl+Shift+4"
                  active={
                    settings?.viewMode ===
                    "small"
                  }
                  onClick={() =>
                    handleViewChange(
                      "small"
                    )
                  }
                >
                  Small icons

                  {settings?.viewMode ===
                    "small" && (
                    <Check className="ml-2 h-3.5 w-3.5 text-sky-400" />
                  )}
                </MenuItem>

                <Divider />

                <MenuItem
                  icon={
                    <AlignJustify className="h-4 w-4" />
                  }
                  active={
                    settings?.autoArrange
                  }
                  onClick={
                    handleAutoArrange
                  }
                >
                  Auto arrange icons

                  {settings?.autoArrange && (
                    <Check className="ml-2 h-3.5 w-3.5 text-sky-400" />
                  )}
                </MenuItem>

                <MenuItem
                  icon={
                    <Grid2X2 className="h-4 w-4" />
                  }
                  active={
                    settings?.alignToGrid
                  }
                  onClick={
                    handleAlignToGrid
                  }
                >
                  Align icons to grid

                  {settings?.alignToGrid && (
                    <Check className="ml-2 h-3.5 w-3.5 text-sky-400" />
                  )}
                </MenuItem>

                <MenuItem
                  icon={
                    <Eye className="h-4 w-4" />
                  }
                  active={
                    settings?.showDesktopIcons
                  }
                  onClick={
                    handleShowDesktopIcons
                  }
                >
                  Show desktop icons

                  {settings?.showDesktopIcons && (
                    <Check className="ml-2 h-3.5 w-3.5 text-sky-400" />
                  )}
                </MenuItem>
              </SubMenuContainer>
            )}
          </div>

          {/* Sort */}
          <div
            className="relative"
            onMouseEnter={() =>
              setActiveSubMenu("sort")
            }
          >
            <MenuItem
              icon={
                <ArrowUpDown className="h-4 w-4" />
              }
              hasSubmenu
            >
              Sort by
            </MenuItem>

            {activeSubMenu ===
              "sort" && (
              <SubMenuContainer width={250}>
                <div className="px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Arrange desktop items
                </div>

                <MenuItem
                  active={
                    settings?.sortBy ===
                    "name"
                  }
                  onClick={() =>
                    handleSortChange(
                      "name"
                    )
                  }
                >
                  <span className="mr-2">
                    Name
                  </span>

                  {settings?.sortBy ===
                    "name" && (
                    <Check className="ml-auto h-3.5 w-3.5 text-sky-400" />
                  )}
                </MenuItem>

                <MenuItem
                  active={
                    settings?.sortBy ===
                    "type"
                  }
                  onClick={() =>
                    handleSortChange(
                      "type"
                    )
                  }
                >
                  <span className="mr-2">
                    Item type
                  </span>

                  {settings?.sortBy ===
                    "type" && (
                    <Check className="ml-auto h-3.5 w-3.5 text-sky-400" />
                  )}
                </MenuItem>

                <MenuItem
                  active={
                    settings?.sortBy ===
                    "date"
                  }
                  onClick={() =>
                    handleSortChange(
                      "date"
                    )
                  }
                >
                  <span className="mr-2">
                    Date modified
                  </span>

                  {settings?.sortBy ===
                    "date" && (
                    <Check className="ml-auto h-3.5 w-3.5 text-sky-400" />
                  )}
                </MenuItem>

                <Divider />

                <MenuItem
                  icon={
                    <ArrowUpDown className="h-4 w-4" />
                  }
                  onClick={
                    handleSortDirection
                  }
                >
                  {settings?.sortDirection ===
                  "asc"
                    ? "Ascending"
                    : "Descending"}

                  <Check className="ml-auto h-3.5 w-3.5 text-sky-400" />
                </MenuItem>
              </SubMenuContainer>
            )}
          </div>

          {/* Refresh */}
          <MenuItem
            icon={
              <RefreshCw className="h-4 w-4" />
            }
            onClick={() => {
              refreshDesktop();
              desktopAPI?.refresh();
              closeMenu();
            }}
          >
            Refresh
          </MenuItem>

          {/* Undo */}
          <MenuItem
            icon={
              <Undo2 className="h-4 w-4" />
            }
            shortcut="Ctrl+Z"
            onClick={() => {
              os.undoDesktopChange();
              closeMenu();
            }}
          >
            Undo Delete
          </MenuItem>

          {/* Redo */}
          <MenuItem
            icon={
              <Redo2 className="h-4 w-4" />
            }
            shortcut="Ctrl+Y"
            onClick={() => {
              os.redoDesktopChange();
              closeMenu();
            }}
          >
            Redo Desktop Change
          </MenuItem>

          <Divider />

          {/* New */}
          <div
            className="relative"
            onMouseEnter={() =>
              setActiveSubMenu("new")
            }
          >
            <MenuItem
              icon={
                <Plus className="h-4 w-4" />
              }
              hasSubmenu
            >
              New
            </MenuItem>

            {activeSubMenu ===
              "new" && (
              <SubMenuContainer width={235}>
                <div className="px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Create
                </div>

                <MenuItem
                  icon={
                    <Folder className="h-4 w-4" />
                  }
                  onClick={() => {
                    void createDesktopItem(
                      "folder"
                    );

                    closeMenu();
                  }}
                >
                  New folder
                </MenuItem>

                <MenuItem
                  icon={
                    <FileText className="h-4 w-4" />
                  }
                  onClick={() => {
                    void createDesktopItem(
                      "text"
                    );

                    closeMenu();
                  }}
                >
                  Text document
                </MenuItem>
              </SubMenuContainer>
            )}
          </div>

          <Divider />

          {/* Display settings */}
          <MenuItem
            icon={
              <Monitor className="h-4 w-4" />
            }
            onClick={() => {
              openApp("settings");
              closeMenu();
            }}
          >
            Display settings
          </MenuItem>

          {/* Personalize */}
          <MenuItem
            icon={
              <Paintbrush className="h-4 w-4" />
            }
            onClick={() => {
              openApp("settings");
              closeMenu();
            }}
          >
            Personalize
          </MenuItem>

          <Divider />

          {/* Terminal */}
          <MenuItem
            icon={
              <Terminal className="h-4 w-4 text-emerald-400" />
            }
            onClick={() => {
              openApp("terminal");
              closeMenu();
            }}
          >
            Open in Terminal
          </MenuItem>

          {/* Code */}
          <MenuItem
            icon={
              <Code2 className="h-4 w-4 text-blue-400" />
            }
            onClick={() => {
              openApp("code-editor");
              closeMenu();
            }}
          >
            Open with Code
          </MenuItem>

          <Divider />

          {/* File Explorer */}
          <MenuItem
            icon={
              <FolderOpen className="h-4 w-4" />
            }
            onClick={() => {
              openApp("this-pc");
              closeMenu();
            }}
          >
            Open File Explorer
          </MenuItem>

          {/* Projects */}
          <MenuItem
            icon={
              <FolderKanban className="h-4 w-4" />
            }
            onClick={() => {
              openApp("projects");
              closeMenu();
            }}
          >
            Browse Projects
          </MenuItem>

          {/* Footer */}
          <div
            className="
              mt-1
              flex h-7
              items-center
              gap-1.5
              px-2.5
              text-[9px]
              text-slate-600
            "
          >
            <Settings2 className="h-3 w-3" />

            <span>
              Abhishek OS Desktop
            </span>

            <span className="ml-auto">
              v1.0
            </span>
          </div>
        </div>
      </div>

      {renameDialog}
    </>
  );
};

export default ContextMenu;