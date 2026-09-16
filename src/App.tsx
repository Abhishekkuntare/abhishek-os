import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AnimatePresence } from "framer-motion";

import {
  OSProvider,
  useOS,
} from "./context/OSContext";

import { DesktopIcon } from "./components/desktop/DesktopIcon";
import { DesktopWidgets } from "./components/desktop/DesktopWidgets";
import { LiveWallpaper } from "./components/desktop/LiveWallpaper";
import { ContextMenu } from "./components/desktop/ContextMenu";

import { Taskbar } from "./components/taskbar/Taskbar";

import { Window } from "./components/windows/Window";
import WindowContent from "./components/windows/WindowContentRouter";

import { StartMenu } from "./components/start/StartMenu";
import { SearchPanel } from "./components/search/SearchPanel";
import { NotificationCenter } from "./components/notifications/NotificationCenter";

import { BootScreen } from "./components/overlays/BootScreen";
import { ShutdownScreen } from "./components/overlays/ShutdownScreen";
import { LockScreen } from "./components/overlays/LockScreen";
import { SleepOverlay } from "./components/overlays/SleepOverlay";
import DesktopExperienceNotice from "./components/desktop/DesktopExperienceNotice";

/* =========================================================
   TYPES
========================================================= */

type IconPosition = {
  x: number;
  y: number;
};

type IconPositions = Record<
  string,
  IconPosition
>;

type ViewMode =
  | "large"
  | "medium"
  | "small";

type SortBy =
  | "name"
  | "type"
  | "date";

type SortDirection =
  | "asc"
  | "desc";

type DesktopSettings = {
  viewMode: ViewMode;
  sortBy: SortBy;
  sortDirection: SortDirection;
  autoArrange: boolean;
  alignToGrid: boolean;
  showDesktopIcons: boolean;
};

/* =========================================================
   STORAGE
========================================================= */

const POSITION_STORAGE_KEY =
  "abhishek-os-desktop-icon-positions-v4";

const SETTINGS_STORAGE_KEY =
  "abhishek-os-desktop-settings-v4";

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const DEFAULT_SETTINGS: DesktopSettings = {
  viewMode: "medium",
  sortBy: "name",
  sortDirection: "asc",

  /*
   * Icons are freely movable by default.
   */
  autoArrange: false,

  /*
   * Keep grid snapping enabled.
   */
  alignToGrid: true,

  showDesktopIcons: true,
};

/* =========================================================
   DESKTOP CONSTANTS
========================================================= */

/*
 * Taskbar height.
 *
 * The desktop interaction area stops above this.
 */
const TASKBAR_HEIGHT = 54;

/*
 * Additional safe space above the taskbar.
 */
const TASKBAR_SAFE_GAP = 12;

/*
 * Minimum desktop padding.
 */
const DESKTOP_PADDING = 12;

/*
 * Default icon tile dimensions.
 *
 * These are intentionally large enough for
 * two-line labels.
 */
const TILE_WIDTH = 108;
const TILE_HEIGHT = 104;

/*
 * Space between desktop icon columns.
 */
const COLUMN_GAP = 8;

/*
 * Space between desktop icon rows.
 */
const ROW_GAP = 4;

/*
 * Initial desktop icon position.
 */
const INITIAL_LEFT = 12;
const INITIAL_TOP = 12;

/* =========================================================
   VIEW MODE DIMENSIONS
========================================================= */

const getViewDimensions = (
  viewMode: ViewMode
) => {
  switch (viewMode) {
    case "large":
      return {
        tileWidth: 116,
        tileHeight: 112,
        iconBox: 54,
        icon: 30,
        labelSize: "13px",
      };

    case "small":
      return {
        tileWidth: 88,
        tileHeight: 82,
        iconBox: 38,
        icon: 21,
        labelSize: "11px",
      };

    case "medium":
    default:
      return {
        tileWidth: TILE_WIDTH,
        tileHeight: TILE_HEIGHT,
        iconBox: 46,
        icon: 26,
        labelSize: "12px",
      };
  }
};

/* =========================================================
   SAFE HELPERS
========================================================= */

const safeNumber = (
  value: unknown,
  fallback = 0
) => {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  )
    ? value
    : fallback;
};

const getIconName = (
  icon: any
): string => {
  return (
    icon.title ||
    icon.name ||
    icon.label ||
    icon.appName ||
    icon.id ||
    "Unnamed"
  );
};

const getIconType = (
  icon: any
): string => {
  return (
    icon.type ||
    icon.category ||
    icon.kind ||
    "application"
  );
};

const getIconDate = (
  icon: any
): number => {
  const value =
    icon.updatedAt ||
    icon.createdAt ||
    icon.modifiedAt ||
    icon.date;

  if (!value) {
    return 0;
  }

  const timestamp =
    new Date(value).getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : 0;
};

/* =========================================================
   DESKTOP ENVIRONMENT
========================================================= */

const DesktopEnvironment: React.FC =
  () => {
    const {
      currentWallpaper,
      desktopIcons,
      windows,
      activeDesktopId,
      openApp,
      openContextMenu,
      closeAllOverlays,
      setSelectedIconId,
      selectedIconId,
      removeDesktopIcon,
      toggleStartMenu,
      toggleSearch,
      powerState,
      refreshDesktop,
      settings,
    } = useOS();

    /* =====================================================
       ICON POSITIONS
    ===================================================== */

    const [
      iconPositions,
      setIconPositions,
    ] =
      useState<IconPositions>(() => {
        try {
          const stored =
            localStorage.getItem(
              POSITION_STORAGE_KEY
            );

          if (!stored) {
            return {};
          }

          const parsed =
            JSON.parse(stored);

          if (
            !parsed ||
            typeof parsed !== "object"
          ) {
            return {};
          }

          return parsed;
        } catch {
          return {};
        }
      });

    /* =====================================================
       DESKTOP SETTINGS
    ===================================================== */

    const [
      desktopSettings,
      setDesktopSettings,
    ] =
      useState<DesktopSettings>(() => {
        try {
          const stored =
            localStorage.getItem(
              SETTINGS_STORAGE_KEY
            );

          if (!stored) {
            return DEFAULT_SETTINGS;
          }

          const parsed =
            JSON.parse(stored);

          return {
            ...DEFAULT_SETTINGS,
            ...parsed,
          };
        } catch {
          return DEFAULT_SETTINGS;
        }
      });

    /* =====================================================
       DRAGGING ICON
    ===================================================== */

    const [
      draggingIconId,
      setDraggingIconId,
    ] =
      useState<string | null>(null);

    /* =====================================================
       INITIAL LAYOUT FLAG
    ===================================================== */

    const [
      hasInitialLayout,
      setHasInitialLayout,
    ] =
      useState(false);

    /* =====================================================
       SAVE ICON POSITIONS
    ===================================================== */

    useEffect(() => {
      try {
        localStorage.setItem(
          POSITION_STORAGE_KEY,
          JSON.stringify(
            iconPositions
          )
        );
      } catch {
        // Ignore storage failures.
      }
    }, [iconPositions]);

    /* =====================================================
       SAVE DESKTOP SETTINGS
    ===================================================== */

    useEffect(() => {
      try {
        localStorage.setItem(
          SETTINGS_STORAGE_KEY,
          JSON.stringify(
            desktopSettings
          )
        );
      } catch {
        // Ignore storage failures.
      }
    }, [desktopSettings]);

    /* =====================================================
       DESKTOP METRICS
    ===================================================== */

    const getDesktopMetrics =
      useCallback(() => {
        const viewportWidth =
          window.innerWidth;

        const viewportHeight =
          window.innerHeight;

        const {
          tileWidth,
          tileHeight,
        } =
          getViewDimensions(
            desktopSettings.viewMode
          );

        /*
         * IMPORTANT:
         *
         * Desktop ends before the taskbar.
         */
        const usableBottom =
          viewportHeight -
          TASKBAR_HEIGHT -
          TASKBAR_SAFE_GAP;

        /*
         * Maximum safe X.
         */
        const maxX =
          Math.max(
            DESKTOP_PADDING,
            viewportWidth -
              tileWidth -
              DESKTOP_PADDING
          );

        /*
         * Maximum safe Y.
         */
        const maxY =
          Math.max(
            DESKTOP_PADDING,
            usableBottom -
              tileHeight
          );

        /*
         * Available vertical space.
         */
        const availableHeight =
          Math.max(
            1,
            usableBottom -
              INITIAL_TOP -
              DESKTOP_PADDING
          );

        const rowStep =
          tileHeight +
          ROW_GAP;

        const maxRows =
          Math.max(
            1,
            Math.floor(
              availableHeight /
                rowStep
            ) + 1
          );

        /*
         * Available horizontal space.
         */
        const availableWidth =
          Math.max(
            1,
            viewportWidth -
              INITIAL_LEFT -
              DESKTOP_PADDING
          );

        const columnStep =
          tileWidth +
          COLUMN_GAP;

        const maxColumns =
          Math.max(
            1,
            Math.floor(
              availableWidth /
                columnStep
            ) + 1
          );

        return {
          viewportWidth,
          viewportHeight,

          tileWidth,
          tileHeight,

          maxX,
          maxY,

          maxRows,
          maxColumns,

          rowStep,
          columnStep,

          usableBottom,
        };
      }, [
        desktopSettings.viewMode,
      ]);

    /* =====================================================
       CLAMP ICON POSITION
    ===================================================== */

    const clampPosition =
      useCallback(
        (
          x: number,
          y: number
        ): IconPosition => {
          const {
            maxX,
            maxY,
          } =
            getDesktopMetrics();

          return {
            x: Math.max(
              DESKTOP_PADDING,
              Math.min(
                safeNumber(
                  x,
                  DESKTOP_PADDING
                ),
                maxX
              )
            ),

            y: Math.max(
              DESKTOP_PADDING,
              Math.min(
                safeNumber(
                  y,
                  DESKTOP_PADDING
                ),
                maxY
              )
            ),
          };
        },
        [
          getDesktopMetrics,
        ]
      );

    /* =====================================================
       SORT DESKTOP ICONS
    ===================================================== */

    const sortedDesktopIcons =
      useMemo(() => {
        const icons = [
          ...(desktopIcons || []),
        ];

        icons.sort(
          (
            a: any,
            b: any
          ) => {
            let result = 0;

            if (
              desktopSettings.sortBy ===
              "name"
            ) {
              result =
                getIconName(
                  a
                ).localeCompare(
                  getIconName(
                    b
                  ),
                  undefined,
                  {
                    numeric: true,
                    sensitivity:
                      "base",
                  }
                );
            }

            if (
              desktopSettings.sortBy ===
              "type"
            ) {
              result =
                getIconType(
                  a
                ).localeCompare(
                  getIconType(
                    b
                  ),
                  undefined,
                  {
                    numeric: true,
                    sensitivity:
                      "base",
                  }
                );
            }

            if (
              desktopSettings.sortBy ===
              "date"
            ) {
              result =
                getIconDate(
                  a
                ) -
                getIconDate(
                  b
                );
            }

            return desktopSettings.sortDirection ===
              "asc"
              ? result
              : -result;
          }
        );

        return icons;
      }, [
        desktopIcons,
        desktopSettings.sortBy,
        desktopSettings.sortDirection,
      ]);

    /* =====================================================
       ARRANGE ICONS
    ===================================================== */

    const arrangeIcons =
      useCallback(() => {
        if (
          !sortedDesktopIcons.length
        ) {
          return;
        }

        const {
          maxRows,
          rowStep,
          columnStep,
        } =
          getDesktopMetrics();

        setIconPositions(
          () => {
            const next: IconPositions =
              {};

            sortedDesktopIcons.forEach(
              (
                icon: any,
                index: number
              ) => {
                /*
                 * Fill vertically first.
                 */
                const column =
                  Math.floor(
                    index /
                      maxRows
                  );

                const row =
                  index %
                  maxRows;

                const rawX =
                  INITIAL_LEFT +
                  column *
                    columnStep;

                const rawY =
                  INITIAL_TOP +
                  row *
                    rowStep;

                next[icon.id] =
                  clampPosition(
                    rawX,
                    rawY
                  );
              }
            );

            return next;
          }
        );
      }, [
        sortedDesktopIcons,
        getDesktopMetrics,
        clampPosition,
      ]);

    /* =====================================================
       INITIAL ICON LAYOUT
    ===================================================== */

    useEffect(() => {
      if (
        hasInitialLayout ||
        !sortedDesktopIcons.length
      ) {
        return;
      }

      const existingIds =
        new Set(
          Object.keys(
            iconPositions
          )
        );

      const hasPositions =
        sortedDesktopIcons.some(
          (icon: any) =>
            existingIds.has(
              icon.id
            )
        );

      /*
       * Fresh installation:
       *
       * Create a safe icon layout.
       */
      if (!hasPositions) {
        arrangeIcons();
      } else {
        /*
         * Existing layout:
         *
         * Sanitize positions and place any newly added icons.
         */
        setIconPositions(
          (previous) => {
            const next: IconPositions =
              {};

            const {
              maxRows,
              rowStep,
              columnStep,
            } = getDesktopMetrics();

            sortedDesktopIcons.forEach(
              (icon: any, index: number) => {
                const position =
                  previous[
                    icon.id
                  ];

                if (position) {
                  next[icon.id] = clampPosition(
                    position.x,
                    position.y
                  );
                  return;
                }

                const column = Math.floor(index / maxRows);
                const row = index % maxRows;

                next[icon.id] = clampPosition(
                  INITIAL_LEFT + column * columnStep,
                  INITIAL_TOP + row * rowStep
                );
              }
            );

            return next;
          }
        );
      }

      setHasInitialLayout(
        true
      );
    }, [
      sortedDesktopIcons,
      iconPositions,
      hasInitialLayout,
      arrangeIcons,
      clampPosition,
      getDesktopMetrics,
    ]);

    /* =====================================================
       CLEAN INVALID POSITIONS
    ===================================================== */

    useEffect(() => {
      if (
        !sortedDesktopIcons.length
      ) {
        return;
      }

      setIconPositions(
        (previous) => {
          const next: IconPositions =
            {};

          let changed = false;
          const {
            maxRows,
            rowStep,
            columnStep,
          } = getDesktopMetrics();
          const dimensions = getViewDimensions(desktopSettings.viewMode);
          const overlaps = (a: IconPosition, b: IconPosition) =>
            Math.abs(a.x - b.x) < dimensions.tileWidth &&
            Math.abs(a.y - b.y) < dimensions.tileHeight;
          const findFreePosition = (index: number) => {
            for (let candidate = index; candidate < sortedDesktopIcons.length + index + 100; candidate += 1) {
              const column = Math.floor(candidate / maxRows);
              const row = candidate % maxRows;
              const position = clampPosition(
                INITIAL_LEFT + column * columnStep,
                INITIAL_TOP + row * rowStep
              );
              if (!Object.values(next).some(existing => overlaps(existing, position))) {
                return position;
              }
            }
            return clampPosition(INITIAL_LEFT, INITIAL_TOP);
          };

          sortedDesktopIcons.forEach(
          (icon: any, index: number) => {
              const position =
                previous[
                  icon.id
                ];

              if (!position) {
              next[icon.id] = findFreePosition(index);
              changed = true;
              return;
            }

              const safe =
                clampPosition(
                  position.x,
                  position.y
                );

              next[icon.id] = Object.values(next).some(existing => overlaps(existing, safe))
                ? findFreePosition(index)
                : safe;

              if (
                safe.x !==
                  next[icon.id].x !== position.x ||
                safe.y !==
                  next[icon.id].y !== position.y
              ) {
                changed = true;
              }
            }
          );

          if (
            !changed &&
            Object.keys(next)
              .length ===
              Object.keys(
                previous
              ).length
          ) {
            return previous;
          }

          return next;
        }
      );
    }, [
      desktopSettings.viewMode,
      sortedDesktopIcons,
      clampPosition,
    ]);

    /* =====================================================
       RESIZE
    ===================================================== */

    useEffect(() => {
      const handleResize =
        () => {
          requestAnimationFrame(
            () => {
              setIconPositions(
                (previous) => {
                  const next: IconPositions =
                    {};

                  let changed =
                    false;

                  Object.entries(
                    previous
                  ).forEach(
                    ([
                      id,
                      position,
                    ]) => {
                      const safe =
                        clampPosition(
                          position.x,
                          position.y
                        );

                      next[id] =
                        safe;

                      if (
                        safe.x !==
                          position.x ||
                        safe.y !==
                          position.y
                      ) {
                        changed =
                          true;
                      }
                    }
                  );

                  return changed
                    ? next
                    : previous;
                }
              );
            }
          );
        };

      window.addEventListener(
        "resize",
        handleResize
      );

      return () => {
        window.removeEventListener(
          "resize",
          handleResize
        );
      };
    }, [
      clampPosition,
    ]);

    /* =====================================================
       UPDATE ICON POSITION
    ===================================================== */

    const updateIconPosition =
      useCallback(
        (
          id: string,
          x: number,
          y: number
        ) => {
          let nextX =
            safeNumber(x);

          let nextY =
            safeNumber(y);

          /*
           * GRID SNAP
           */
          if (
            desktopSettings.alignToGrid
          ) {
            const {
              columnStep,
              rowStep,
            } =
              getDesktopMetrics();

            nextX =
              INITIAL_LEFT +
              Math.round(
                (nextX -
                  INITIAL_LEFT) /
                  columnStep
              ) *
                columnStep;

            nextY =
              INITIAL_TOP +
              Math.round(
                (nextY -
                  INITIAL_TOP) /
                  rowStep
              ) *
                rowStep;
          }

          /*
           * SNAP FIRST.
           * CLAMP SECOND.
           *
           * This prevents icons
           * from entering the taskbar.
           */
          const safe =
            clampPosition(
              nextX,
              nextY
            );

          setIconPositions(
            (previous) => ({
              ...previous,

              [id]: safe,
            })
          );
        },
        [
          desktopSettings.alignToGrid,
          getDesktopMetrics,
          clampPosition,
        ]
      );

    /* =====================================================
       REFRESH DESKTOP
    ===================================================== */

    const handleRefresh =
      useCallback(() => {
        refreshDesktop();

        /*
         * Refresh does not reset
         * user positions.
         */
        setIconPositions(
          (previous) => {
            const next: IconPositions =
              {};

            Object.entries(
              previous
            ).forEach(
              ([
                id,
                position,
              ]) => {
                next[id] =
                  clampPosition(
                    position.x,
                    position.y
                  );
              }
            );

            return next;
          }
        );
      }, [
        refreshDesktop,
        clampPosition,
      ]);

    /* =====================================================
       KEYBOARD SHORTCUTS
    ===================================================== */

    useEffect(() => {
      const handleKeyDown =
        (
          e: KeyboardEvent
        ) => {
          if (
            powerState !==
            "running"
          ) {
            return;
          }

          if (e.ctrlKey && e.shiftKey && e.code === "Digit9") {
            e.preventDefault();
            openApp("admin", { privateEntry: true });
            return;
          }

          const target = e.target as HTMLElement | null;
          const isEditableTarget = Boolean(
            target &&
            (target.isContentEditable ||
              target.tagName === "INPUT" ||
              target.tagName === "TEXTAREA" ||
              target.tagName === "SELECT")
          );

          if (!isEditableTarget && selectedIconId && (e.key === "Delete" || e.key === "Backspace")) {
            e.preventDefault();
            removeDesktopIcon(selectedIconId);
            return;
          }

          /*
           * ESC
           */
          if (
            e.key ===
            "Escape"
          ) {
            closeAllOverlays();
            return;
          }

          /*
           * CTRL/CMD + SPACE opens the portfolio assistant. Keep the
           * Windows key behaviour for the start menu, but don't hijack the
           * browser/OS shortcut when the user asks for the assistant.
           */
          if (e.code === "Space" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            closeAllOverlays();
            openApp("ai");
            return;
          }

          /*
           * WINDOWS / COMMAND
           */
          if (
            e.key === "Meta"
          ) {
            e.preventDefault();

            toggleStartMenu();

            return;
          }

          /*
           * CTRL/CMD + K
           */
          if (
            e.key.toLowerCase() ===
              "k" &&
            (e.ctrlKey ||
              e.metaKey)
          ) {
            e.preventDefault();

            toggleSearch();

            return;
          }

          /*
           * LARGE
           */
          if (
            e.ctrlKey &&
            e.shiftKey &&
            e.code ===
              "Digit2"
          ) {
            e.preventDefault();

            setDesktopSettings(
              (previous) => ({
                ...previous,
                viewMode:
                  "large",
              })
            );

            return;
          }

          /*
           * MEDIUM
           */
          if (
            e.ctrlKey &&
            e.shiftKey &&
            e.code ===
              "Digit3"
          ) {
            e.preventDefault();

            setDesktopSettings(
              (previous) => ({
                ...previous,
                viewMode:
                  "medium",
              })
            );

            return;
          }

          /*
           * SMALL
           */
          if (
            e.ctrlKey &&
            e.shiftKey &&
            e.code ===
              "Digit4"
          ) {
            e.preventDefault();

            setDesktopSettings(
              (previous) => ({
                ...previous,
                viewMode:
                  "small",
              })
            );

            return;
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
      powerState,
      closeAllOverlays,
      openApp,
      toggleStartMenu,
      toggleSearch,
      selectedIconId,
      removeDesktopIcon,
    ]);

    /* =====================================================
       DESKTOP CONTEXT MENU
    ===================================================== */

    const handleDesktopContextMenu =
      (
        e: React.MouseEvent
      ) => {
        e.preventDefault();
        e.stopPropagation();

        openContextMenu(
          e.clientX,
          e.clientY
        );
      };

    /* =====================================================
       DESKTOP CLICK
    ===================================================== */

    const handleDesktopClick =
      (
        e: React.MouseEvent
      ) => {
        /*
         * Only clear selection when the
         * actual desktop background was clicked.
         *
         * Widgets/windows/icons won't trigger
         * this because they stop propagation.
         */
        if (
          e.target ===
          e.currentTarget
        ) {
          closeAllOverlays();

          setSelectedIconId(
            null
          );
        }
      };

    /* =====================================================
       DESKTOP API
    ===================================================== */

    useEffect(() => {
      (
        window as any
      ).__ABHISHEK_DESKTOP__ =
        {
          getSettings:
            () =>
              desktopSettings,

          setViewMode:
            (
              mode: ViewMode
            ) => {
              setDesktopSettings(
                (previous) => ({
                  ...previous,
                  viewMode:
                    mode,
                })
              );
            },

          setSortBy:
            (
              sortBy: SortBy
            ) => {
              setDesktopSettings(
                (previous) => ({
                  ...previous,
                  sortBy,
                })
              );
            },

          toggleSortDirection:
            () => {
              setDesktopSettings(
                (previous) => ({
                  ...previous,

                  sortDirection:
                    previous.sortDirection ===
                    "asc"
                      ? "desc"
                      : "asc",
                })
              );
            },

          toggleAutoArrange:
            () => {
              setDesktopSettings(
                (previous) => ({
                  ...previous,

                  autoArrange:
                    !previous.autoArrange,
                })
              );
            },

          toggleAlignToGrid:
            () => {
              setDesktopSettings(
                (previous) => ({
                  ...previous,

                  alignToGrid:
                    !previous.alignToGrid,
                })
              );
            },

          toggleDesktopIcons:
            () => {
              setDesktopSettings(
                (previous) => ({
                  ...previous,

                  showDesktopIcons:
                    !previous
                      .showDesktopIcons,
                })
              );
            },

          arrangeIcons,

          refresh:
            handleRefresh,
        };

      return () => {
        delete (
          window as any
        ).__ABHISHEK_DESKTOP__;
      };
    }, [
      desktopSettings,
      arrangeIcons,
      handleRefresh,
    ]);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
      <div
        id="abhishek-workstation-os"
        className="
          relative
          w-screen
          h-screen

          overflow-hidden

          select-none

          font-sans
          text-slate-100
        "
        style={{
          background:
            currentWallpaper.style,
          '--os-accent': settings.accentColor,
          filter: `brightness(${settings.brightness}%)`,
        } as React.CSSProperties}
        onContextMenu={
          handleDesktopContextMenu
        }
      >

        {/* =================================================
            LIVE WALLPAPER
        ================================================= */}

        <LiveWallpaper />

        {/* =================================================
            BACKGROUND GLOW
        ================================================= */}

        <div
          className="
            absolute
            inset-0

            pointer-events-none

            z-0

            bg-[radial-gradient(
              ellipse_80%_80%_at_50%_-20%,
              rgba(56,189,248,0.12),
              rgba(255,255,255,0)
            )]
          "
        />

        {/* =================================================
            DESKTOP INTERACTION AREA

            This area stops BEFORE the taskbar.

            Everything placed here is automatically
            protected from going behind the taskbar.
        ================================================= */}

        <div
          id="desktop-interaction-area"
          className="
            absolute

            top-0
            left-0
            right-0

            bottom-[54px]

            overflow-hidden

            z-10
          "
          onClick={
            handleDesktopClick
          }
          onContextMenu={
            handleDesktopContextMenu
          }
        >

          {/* ===============================================
              DESKTOP ICON LAYER

              IMPORTANT:

              Icons have their own layer.

              Widgets are NOT placed inside
              this container.

              Therefore widget movement will
              never affect icon positions.
          =============================================== */}

          {desktopSettings.showDesktopIcons &&
            sortedDesktopIcons.map(
              (icon: any) => {
                const position =
                  iconPositions[
                    icon.id
                  ];

                if (!position) {
                  return null;
                }

                const dimensions =
                  getViewDimensions(
                    desktopSettings.viewMode
                  );

                return (
                  <div
                    key={icon.id}
                    className="
                      absolute
                      pointer-events-auto
                    "
                    style={{
                      left:
                        position.x,

                      top:
                        position.y,

                      width:
                        dimensions.tileWidth,

                      height:
                        dimensions.tileHeight,

                      /*
                       * Icons stay below
                       * active windows and
                       * selected widgets.
                       */
                      zIndex:
                        draggingIconId ===
                        icon.id
                          ? 300
                          : 20,
                    }}
                  >
                    <DesktopIcon
                      item={icon}

                      desktopPosition={
                        position
                      }

                      onDesktopPositionChange={(
                        x,
                        y
                      ) => {
                        updateIconPosition(
                          icon.id,
                          x,
                          y
                        );
                      }}

                      isDragging={
                        draggingIconId ===
                        icon.id
                      }

                      onDragStateChange={
                        setDraggingIconId
                      }

                      viewMode={
                        desktopSettings.viewMode
                      }
                    />
                  </div>
                );
              }
            )}

          {/* ===============================================
              DESKTOP WIDGET LAYER

              IMPORTANT:

              DesktopWidgets is intentionally
              separated from DesktopIcon.

              It is responsible for:

              - added widgets
              - widget positions
              - widget dragging
              - widget resizing
              - widget removal
              - widget persistence
              - widget stacking

              NO DEFAULT WIDGETS ARE CREATED HERE.

              The Widget Panel will control which
              widgets are actually added.
          =============================================== */}

          <div
            id="desktop-widgets-layer"
            className="
              absolute
              inset-0

              pointer-events-none

              z-[15]

              overflow-hidden
            "
          >
            <div
              className="
                absolute
                inset-0

                pointer-events-none
              "
            >
              <DesktopWidgets />
            </div>
          </div>

        </div>

        {/* =================================================
            APPLICATION WINDOWS

            Windows remain above desktop icons
            and desktop widgets.
        ================================================= */}

        <div
          id="desktop-windows-container"
          className="
            absolute
            inset-0

            pointer-events-none

            z-20
          "
        >
          <AnimatePresence initial={false} mode="sync">
            {(windows || [])
              .filter((win) => win.desktopId === activeDesktopId && !win.isMinimized)
              .map((win) => (
                <div
                  key={win.id}
                  className="pointer-events-auto"
                >
                  <Window
                    win={win}
                  >
                    <WindowContent
                      win={win}
                    />
                  </Window>
                </div>
              ))}
          </AnimatePresence>
        </div>

        {/* =================================================
            TASKBAR

            ALWAYS ABOVE EVERYTHING ON DESKTOP.
        ================================================= */}

           {/* Desktop experience message */}
    <DesktopExperienceNotice />

        <div
          id="abhishek-os-taskbar"
          className="
            absolute

            left-0
            right-0
            bottom-0

            h-[54px]

            z-[5000]

            overflow-visible
          "
        >
          <Taskbar />
          
        </div>

        {/* =================================================
            START MENU
        ================================================= */}

        <StartMenu />

        {/* =================================================
            SEARCH
        ================================================= */}

        <SearchPanel />

        {/* =================================================
            NOTIFICATION CENTER
        ================================================= */}

        <NotificationCenter />

        {/* =================================================
            CONTEXT MENU
        ================================================= */}

        <ContextMenu />

        {/* =================================================
            POWER OVERLAYS
        ================================================= */}

        <BootScreen />

        <ShutdownScreen />

        <LockScreen />

        <SleepOverlay />

      </div>
    );
  };

/* =========================================================
   APP ROOT
========================================================= */

export default function App() {
  return (
    <OSProvider>
      <DesktopEnvironment />
    </OSProvider>
  );
}