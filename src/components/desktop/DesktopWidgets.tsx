import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Clock3,
  CloudSun,
  GripVertical,
  Music2,
  Quote,
  UserRound,
  X,
  Minus,
  Maximize2,
  Plus,
  LayoutDashboard,
  RefreshCw,
  MapPin,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type WidgetType =
  | "clock"
  | "weather"
  | "spotify"
  | "quote"
  | "profile";

type WidgetPosition = {
  x: number;
  y: number;
};

type WidgetSize = {
  width: number;
  height: number;
};

type WidgetState = {
  id: string;
  type: WidgetType;
  position: WidgetPosition;
  size: WidgetSize;
  minimized: boolean;
};

type DesktopWidgetProps = {
  widget: WidgetState;
  onMove: (
    id: string,
    x: number,
    y: number
  ) => void;
  onRemove: (
    id: string
  ) => void;
  onToggleMinimize: (
    id: string
  ) => void;
};

/* =========================================================
   STORAGE
========================================================= */

const WIDGET_STORAGE_KEY =
  "abhishek-os-desktop-widgets-v1";

/* =========================================================
   DESKTOP CONSTANTS
========================================================= */

const TASKBAR_HEIGHT = 54;

const DESKTOP_PADDING = 12;

const WIDGET_GAP = 12;

const DEFAULT_WIDGET_WIDTH = 300;

const DEFAULT_WIDGET_HEIGHT = 180;

/*
 * Widgets live inside the desktop area.
 *
 * The App.tsx desktop widget layer already ends
 * above the taskbar.
 */
const getDesktopBounds = () => {
  if (
    typeof window === "undefined"
  ) {
    return {
      width: 1280,
      height: 666,
    };
  }

  return {
    width:
      window.innerWidth,

    height:
      Math.max(
        300,
        window.innerHeight -
          TASKBAR_HEIGHT
      ),
  };
};

/* =========================================================
   WIDGET CATALOG
========================================================= */

export const WIDGET_CATALOG: Array<{
  type: WidgetType;
  title: string;
  description: string;
}> = [
  {
    type: "clock",
    title: "Live Clock",
    description:
      "Real-time date and clock",
  },

  {
    type: "weather",
    title: "Weather",
    description:
      "Current weather preview",
  },

  {
    type: "spotify",
    title: "Spotify Preview",
    description:
      "Music and Spotify preview",
  },

  {
    type: "quote",
    title: "Daily Quote",
    description:
      "A small motivational quote",
  },

  {
    type: "profile",
    title: "Profile",
    description:
      "Quick Abhishek profile card",
  },
];

/* =========================================================
   DEFAULT WIDGET SIZE
========================================================= */

const getDefaultWidgetSize = (
  type: WidgetType
): WidgetSize => {
  switch (type) {
    case "clock":
      return {
        width: 280,
        height: 170,
      };

    case "weather":
      return {
        width: 300,
        height: 190,
      };

    case "spotify":
      return {
        width: 320,
        height: 210,
      };

    case "quote":
      return {
        width: 300,
        height: 190,
      };

    case "profile":
      return {
        width: 300,
        height: 200,
      };

    default:
      return {
        width:
          DEFAULT_WIDGET_WIDTH,

        height:
          DEFAULT_WIDGET_HEIGHT,
      };
  }
};

/* =========================================================
   SAFE STORAGE
========================================================= */

const loadWidgets =
  (): WidgetState[] => {
    try {
      const stored =
        localStorage.getItem(
          WIDGET_STORAGE_KEY
        );

      if (!stored) {
        /*
         * VERY IMPORTANT:
         *
         * Empty array means:
         *
         * NO WIDGETS BY DEFAULT.
         */
        return [];
      }

      const parsed =
        JSON.parse(stored);

      if (
        !Array.isArray(parsed)
      ) {
        return [];
      }

      return parsed;
    } catch {
      return [];
    }
  };

/* =========================================================
   CLAMP POSITION
========================================================= */

const clampWidgetPosition = (
  x: number,
  y: number,
  size: WidgetSize
): WidgetPosition => {
  const bounds =
    getDesktopBounds();

  const maxX =
    Math.max(
      DESKTOP_PADDING,
      bounds.width -
        size.width -
        DESKTOP_PADDING
    );

  const maxY =
    Math.max(
      DESKTOP_PADDING,
      bounds.height -
        size.height -
        DESKTOP_PADDING
    );

  return {
    x: Math.max(
      DESKTOP_PADDING,
      Math.min(
        x,
        maxX
      )
    ),

    y: Math.max(
      DESKTOP_PADDING,
      Math.min(
        y,
        maxY
      )
    ),
  };
};

/* =========================================================
   FIND FREE POSITION
========================================================= */

/*
 * Find a visually clean location for a new widget.
 *
 * IMPORTANT:
 *
 * This does NOT create widgets automatically.
 *
 * It is only called after the user explicitly
 * clicks "Add Widget".
 */

const findFreeWidgetPosition = (
  widgets: WidgetState[],
  size: WidgetSize
): WidgetPosition => {
  const bounds =
    getDesktopBounds();

  const candidates: WidgetPosition[] =
    [];

  /*
   * Prefer the right side of the desktop
   * so widgets don't cover the common
   * left-side icon area.
   */

  const preferredColumns = [
    Math.max(
      DESKTOP_PADDING,
      bounds.width -
        size.width -
        24
    ),

    Math.max(
      DESKTOP_PADDING,
      bounds.width -
        size.width -
        360
    ),

    DESKTOP_PADDING,

    Math.floor(
      bounds.width / 2
    ),
  ];

  const preferredRows = [
    DESKTOP_PADDING,

    24,

    150,

    280,

    410,
  ];

  preferredColumns.forEach(
    (x) => {
      preferredRows.forEach(
        (y) => {
          candidates.push({
            x,
            y,
          });
        }
      );
    }
  );

  /*
   * Check candidate positions.
   */

  for (
    const candidate of candidates
  ) {
    const safe =
      clampWidgetPosition(
        candidate.x,
        candidate.y,
        size
      );

    const overlaps =
      widgets.some(
        (widget) =>
          rectanglesOverlap(
            {
              x: safe.x,
              y: safe.y,
              width:
                size.width,
              height:
                size.height,
            },
            {
              x:
                widget.position.x,
              y:
                widget.position.y,
              width:
                widget.size.width,
              height:
                widget.size.height,
            }
          )
      );

    if (!overlaps) {
      return safe;
    }
  }

  /*
   * If every preferred location is occupied,
   * use a deterministic fallback.
   */

  const fallbackX =
    Math.max(
      DESKTOP_PADDING,
      Math.min(
        bounds.width -
          size.width -
          DESKTOP_PADDING,
        DESKTOP_PADDING +
          (widgets.length % 3) *
            20
      )
    );

  const fallbackY =
    Math.max(
      DESKTOP_PADDING,
      Math.min(
        bounds.height -
          size.height -
          DESKTOP_PADDING,
        DESKTOP_PADDING +
          (widgets.length % 4) *
            20
      )
    );

  return clampWidgetPosition(
    fallbackX,
    fallbackY,
    size
  );
};

/* =========================================================
   RECTANGLE COLLISION
========================================================= */

const rectanglesOverlap = (
  a: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  b: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
) => {
  const gap =
    WIDGET_GAP;

  return !(
    a.x +
      a.width +
      gap <=
      b.x ||

    b.x +
      b.width +
      gap <=
      a.x ||

    a.y +
      a.height +
      gap <=
      b.y ||

    b.y +
      b.height +
      gap <=
      a.y
  );
};

/* =========================================================
   WIDGET ICON
========================================================= */

const WidgetIcon: React.FC<{
  type: WidgetType;
}> = ({
  type,
}) => {
  if (type === "clock") {
    return (
      <Clock3
        className="w-4 h-4"
      />
    );
  }

  if (type === "weather") {
    return (
      <CloudSun
        className="w-4 h-4"
      />
    );
  }

  if (type === "spotify") {
    return (
      <Music2
        className="w-4 h-4"
      />
    );
  }

  if (type === "quote") {
    return (
      <Quote
        className="w-4 h-4"
      />
    );
  }

  return (
    <UserRound
      className="w-4 h-4"
    />
  );
};

/* =========================================================
   CLOCK WIDGET
========================================================= */

const ClockWidget =
  () => {
    const [
      now,
      setNow,
    ] =
      useState(
        new Date()
      );

    useEffect(() => {
      const timer =
        window.setInterval(
          () => {
            setNow(
              new Date()
            );
          },
          1000
        );

      return () =>
        window.clearInterval(
          timer
        );
    }, []);

    const time =
      now.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      );

    const date =
      now.toLocaleDateString(
        [],
        {
          weekday:
            "long",
          month:
            "long",
          day: "numeric",
          year:
            "numeric",
        }
      );

    return (
      <div
        className="
          flex
          h-full
          flex-col
          justify-center
          px-6
          py-5
        "
      >
        <div
          className="
            text-[11px]
            uppercase
            tracking-[0.2em]
            text-slate-400
          "
        >
          Local time
        </div>

        <div
          className="
            mt-2
            text-4xl
            font-semibold
            tracking-tight
            text-white
          "
        >
          {time}
        </div>

        <div
          className="
            mt-2
            text-sm
            text-slate-300
          "
        >
          {date}
        </div>
      </div>
    );
  };

/* =========================================================
   WEATHER WIDGET
========================================================= */

const WeatherWidget =
  () => {
    return (
      <div
        className="
          flex
          h-full
          flex-col
          justify-between
          px-5
          py-5
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
          "
        >
          <div>
            <div
              className="
                text-xs
                text-slate-400
              "
            >
              Current weather
            </div>

            <div
              className="
                mt-1
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-white
              "
            >
              <MapPin
                className="w-3.5 h-3.5"
              />

              India
            </div>
          </div>

          <CloudSun
            className="
              h-9
              w-9
              text-sky-300
            "
          />
        </div>

        <div
          className="
            flex
            items-end
            justify-between
          "
        >
          <div>
            <div
              className="
                text-4xl
                font-semibold
                text-white
              "
            >
              28°
            </div>

            <div
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              Mostly Sunny
            </div>
          </div>

          <div
            className="
              text-right
              text-xs
              text-slate-400
            "
          >
            <div>
              H 31°
            </div>

            <div>
              L 23°
            </div>
          </div>
        </div>
      </div>
    );
  };

/* =========================================================
   SPOTIFY WIDGET
========================================================= */

const SpotifyWidget =
  () => {
    return (
      <div
        className="
          flex
          h-full
          flex-col
          justify-between
          px-5
          py-5
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white/10
              border
              border-white/10
            "
          >
            <Music2
              className="
                h-6
                w-6
                text-white
              "
            />
          </div>

          <div
            className="
              min-w-0
            "
          >
            <div
              className="
                truncate
                text-sm
                font-semibold
                text-white
              "
            >
              Spotify Preview
            </div>

            <div
              className="
                mt-1
                truncate
                text-xs
                text-slate-400
              "
            >
              Your music space
            </div>
          </div>
        </div>

        <div
          className="
            mt-5
            rounded-xl
            border
            border-white/10
            bg-white/[0.04]
            px-4
            py-3
          "
        >
          <div
            className="
              text-xs
              text-slate-400
            "
          >
            Ready to play
          </div>

          <div
            className="
              mt-1
              text-sm
              font-medium
              text-white
            "
          >
            Open Spotify
          </div>
        </div>

        <button
          type="button"
          className="
            mt-4
            flex
            h-9
            items-center
            justify-center
            rounded-lg
            bg-white/10
            px-4
            text-xs
            font-medium
            text-white
            transition
            hover:bg-white/15
          "
          onClick={() => {
            window.open(
              "https://open.spotify.com",
              "_blank",
              "noopener,noreferrer"
            );
          }}
        >
          Open Spotify
        </button>
      </div>
    );
  };

/* =========================================================
   QUOTE WIDGET
========================================================= */

const QuoteWidget =
  () => {
    return (
      <div
        className="
          flex
          h-full
          flex-col
          justify-center
          px-5
          py-5
        "
      >
        <Quote
          className="
            h-6
            w-6
            text-slate-400
          "
        />

        <p
          className="
            mt-4
            text-base
            leading-7
            text-white
          "
        >
          Build useful things,
          keep learning, and
          let the work speak.
        </p>

        <div
          className="
            mt-4
            text-xs
            text-slate-500
          "
        >
          Daily note
        </div>
      </div>
    );
  };

/* =========================================================
   PROFILE WIDGET
========================================================= */

const ProfileWidget =
  () => {
    return (
      <div
        className="
          flex
          h-full
          flex-col
          justify-between
          px-5
          py-5
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-white/10
              border
              border-white/10
            "
          >
            <UserRound
              className="
                h-6
                w-6
                text-white
              "
            />
          </div>

          <div>
            <div
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              Abhishek Kuntare
            </div>

            <div
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              Full Stack Developer
            </div>
          </div>
        </div>

        <div
          className="
            mt-4
            grid
            grid-cols-2
            gap-2
          "
        >
          <div
            className="
              rounded-lg
              border
              border-white/10
              bg-white/[0.04]
              p-3
            "
          >
            <div
              className="
                text-[10px]
                text-slate-500
              "
            >
              Focus
            </div>

            <div
              className="
                mt-1
                text-xs
                text-white
              "
            >
              React
            </div>
          </div>

          <div
            className="
              rounded-lg
              border
              border-white/10
              bg-white/[0.04]
              p-3
            "
          >
            <div
              className="
                text-[10px]
                text-slate-500
              "
            >
              Stack
            </div>

            <div
              className="
                mt-1
                text-xs
                text-white
              "
            >
              Next.js
            </div>
          </div>
        </div>
      </div>
    );
  };

/* =========================================================
   WIDGET BODY
========================================================= */

const WidgetBody: React.FC<{
  type: WidgetType;
}> = ({
  type,
}) => {
  switch (type) {
    case "clock":
      return <ClockWidget />;

    case "weather":
      return <WeatherWidget />;

    case "spotify":
      return <SpotifyWidget />;

    case "quote":
      return <QuoteWidget />;

    case "profile":
      return <ProfileWidget />;

    default:
      return null;
  }
};

/* =========================================================
   SINGLE WIDGET
========================================================= */

const DesktopWidget: React.FC<
  DesktopWidgetProps
> = ({
  widget,
  onMove,
  onRemove,
  onToggleMinimize,
}) => {
  const dragRef =
    useRef<{
      pointerId: number;
      offsetX: number;
      offsetY: number;
    } | null>(null);

  const handlePointerDown =
    (
      e: React.PointerEvent
    ) => {
      if (
        e.button !== 0
      ) {
        return;
      }

      e.stopPropagation();

      const target =
        e.currentTarget.parentElement;

      if (!target) {
        return;
      }

      const rect =
        target.getBoundingClientRect();

      dragRef.current = {
        pointerId:
          e.pointerId,

        offsetX:
          e.clientX -
          rect.left,

        offsetY:
          e.clientY -
          rect.top,
      };

      (
        e.currentTarget as HTMLElement
      ).setPointerCapture(
        e.pointerId
      );
    };

  const handlePointerMove =
    (
      e: React.PointerEvent
    ) => {
      const drag =
        dragRef.current;

      if (
        !drag ||
        drag.pointerId !==
          e.pointerId
      ) {
        return;
      }

      e.preventDefault();

      const nextX =
        e.clientX -
        drag.offsetX;

      const nextY =
        e.clientY -
        drag.offsetY;

      const safe =
        clampWidgetPosition(
          nextX,
          nextY,
          widget.size
        );

      onMove(
        widget.id,
        safe.x,
        safe.y
      );
    };

  const handlePointerUp =
    (
      e: React.PointerEvent
    ) => {
      if (
        dragRef.current
          ?.pointerId ===
        e.pointerId
      ) {
        dragRef.current =
          null;

        try {
          (
            e.currentTarget as HTMLElement
          ).releasePointerCapture(
            e.pointerId
          );
        } catch {
          // Ignore pointer release errors.
        }
      }
    };

  const catalogItem =
    WIDGET_CATALOG.find(
      (item) =>
        item.type ===
        widget.type
    );

  const title =
    catalogItem?.title ||
    "Widget";

  return (
    <div
      className="
        pointer-events-auto
        absolute
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.12]
        bg-slate-950/75
        shadow-2xl
        shadow-black/30
        backdrop-blur-2xl
        transition-shadow
        duration-200
        hover:border-white/[0.18]
        hover:shadow-black/40
      "
      style={{
        left:
          widget.position.x,

        top:
          widget.position.y,

        width:
          widget.size.width,

        height:
          widget.minimized
            ? 48
            : widget.size.height,

        zIndex: 100,
      }}
      onClick={(e) =>
        e.stopPropagation()
      }
      onContextMenu={(e) =>
        e.stopPropagation()
      }
    >
      {/* ===================================================
          WIDGET HEADER
      =================================================== */}

      <div
        className="
          flex
          h-12
          items-center
          justify-between
          border-b
          border-white/[0.08]
          bg-white/[0.035]
          px-3
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
          "
        >
          <button
            type="button"
            aria-label={`Move ${title}`}
            className="
              flex
              h-7
              w-7
              shrink-0
              cursor-grab
              items-center
              justify-center
              rounded-md
              text-slate-500
              transition
              hover:bg-white/10
              hover:text-slate-200
              active:cursor-grabbing
            "
            onPointerDown={
              handlePointerDown
            }
            onPointerMove={
              handlePointerMove
            }
            onPointerUp={
              handlePointerUp
            }
            onPointerCancel={
              handlePointerUp
            }
          >
            <GripVertical
              className="
                h-4
                w-4
              "
            />
          </button>

          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-white/[0.06]
              text-slate-300
            "
          >
            <WidgetIcon
              type={
                widget.type
              }
            />
          </div>

          <span
            className="
              truncate
              text-xs
              font-semibold
              text-slate-200
            "
          >
            {title}
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-0.5
          "
        >
          <button
            type="button"
            aria-label={
              widget.minimized
                ? `Expand ${title}`
                : `Minimize ${title}`
            }
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              text-slate-500
              transition
              hover:bg-white/10
              hover:text-white
            "
            onClick={(e) => {
              e.stopPropagation();

              onToggleMinimize(
                widget.id
              );
            }}
          >
            {widget.minimized ? (
              <Maximize2
                className="
                  h-3.5
                  w-3.5
                "
              />
            ) : (
              <Minus
                className="
                  h-3.5
                  w-3.5
                "
              />
            )}
          </button>

          <button
            type="button"
            aria-label={`Remove ${title}`}
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              text-slate-500
              transition
              hover:bg-red-500/15
              hover:text-red-300
            "
            onClick={(e) => {
              e.stopPropagation();

              onRemove(
                widget.id
              );
            }}
          >
            <X
              className="
                h-3.5
                w-3.5
              "
            />
          </button>
        </div>
      </div>

      {/* ===================================================
          WIDGET CONTENT
      =================================================== */}

      {!widget.minimized && (
        <div
          className="
            h-[calc(100%-48px)]
            overflow-hidden
          "
        >
          <WidgetBody
            type={
              widget.type
            }
          />
        </div>
      )}
    </div>
  );
};

/* =========================================================
   DESKTOP WIDGETS
========================================================= */

export const DesktopWidgets: React.FC =
  () => {
    /*
     * IMPORTANT:
     *
     * The initial state is ALWAYS loaded from
     * localStorage.
     *
     * If nothing exists:
     *
     * []
     *
     * Therefore NO widgets are automatically shown.
     */
    const [
      widgets,
      setWidgets,
    ] =
      useState<WidgetState[]>(
        loadWidgets
      );

    /*
     * Widget panel visibility.
     *
     * This is separate from the widgets themselves.
     */
    const [
      panelOpen,
      setPanelOpen,
    ] =
      useState(false);

    /* =====================================================
       SAVE WIDGETS
    ===================================================== */

    useEffect(() => {
      try {
        localStorage.setItem(
          WIDGET_STORAGE_KEY,
          JSON.stringify(
            widgets
          )
        );
      } catch {
        // Ignore localStorage errors.
      }
    }, [widgets]);

    /* =====================================================
       RESIZE HANDLER
    ===================================================== */

    useEffect(() => {
      const handleResize =
        () => {
          setWidgets(
            (previous) => {
              let changed =
                false;

              const next =
                previous.map(
                  (
                    widget
                  ) => {
                    const safe =
                      clampWidgetPosition(
                        widget.position.x,
                        widget.position.y,
                        widget.size
                      );

                    if (
                      safe.x !==
                        widget.position.x ||
                      safe.y !==
                        widget.position.y
                    ) {
                      changed =
                        true;

                      return {
                        ...widget,

                        position:
                          safe,
                      };
                    }

                    return widget;
                  }
                );

              return changed
                ? next
                : previous;
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
    }, []);

    /* =====================================================
       ADD WIDGET
    ===================================================== */

    const addWidget =
      useCallback(
        (
          type: WidgetType
        ) => {
          setWidgets(
            (previous) => {
              /*
               * Don't add duplicate widgets.
               *
               * One instance of each widget type
               * is enough for the desktop.
               */
              const alreadyExists =
                previous.some(
                  (widget) =>
                    widget.type ===
                    type
                );

              if (
                alreadyExists
              ) {
                return previous;
              }

              const size =
                getDefaultWidgetSize(
                  type
                );

              const position =
                findFreeWidgetPosition(
                  previous,
                  size
                );

              const newWidget: WidgetState =
                {
                  id: `widget-${type}-${Date.now()}`,

                  type,

                  position,

                  size,

                  minimized:
                    false,
                };

              return [
                ...previous,
                newWidget,
              ];
            }
          );

          /*
           * Close panel after adding.
           */
          setPanelOpen(
            false
          );
        },
        []
      );

    /* =====================================================
       REMOVE WIDGET
    ===================================================== */

    const removeWidget =
      useCallback(
        (
          id: string
        ) => {
          setWidgets(
            (previous) =>
              previous.filter(
                (widget) =>
                  widget.id !==
                  id
              )
          );
        },
        []
      );

    /* =====================================================
       MOVE WIDGET
    ===================================================== */

    const moveWidget =
      useCallback(
        (
          id: string,
          x: number,
          y: number
        ) => {
          setWidgets(
            (previous) =>
              previous.map(
                (widget) => {
                  if (
                    widget.id !==
                    id
                  ) {
                    return widget;
                  }

                  return {
                    ...widget,

                    position:
                      clampWidgetPosition(
                        x,
                        y,
                        widget.size
                      ),
                  };
                }
              )
          );
        },
        []
      );

    /* =====================================================
       MINIMIZE WIDGET
    ===================================================== */

    const toggleMinimize =
      useCallback(
        (
          id: string
        ) => {
          setWidgets(
            (previous) =>
              previous.map(
                (widget) =>
                  widget.id ===
                  id
                    ? {
                        ...widget,

                        minimized:
                          !widget.minimized,
                      }
                    : widget
              )
          );
        },
        []
      );

    /* =====================================================
       RESET WIDGETS
    ===================================================== */

    const resetWidgets =
      useCallback(() => {
        /*
         * Reset means:
         *
         * remove ALL widgets.
         *
         * It does NOT automatically add
         * the catalog widgets again.
         */
        setWidgets([]);
      }, []);

    /* =====================================================
       AVAILABLE WIDGETS
    ===================================================== */

    const availableWidgets =
      useMemo(
        () =>
          WIDGET_CATALOG.map(
            (item) => ({
              ...item,

              added:
                widgets.some(
                  (widget) =>
                    widget.type ===
                    item.type
                ),
            })
          ),
        [widgets]
      );

    /* =====================================================
       GLOBAL WIDGET API
    ===================================================== */

    useEffect(() => {
      (
        window as any
      ).__ABHISHEK_WIDGETS__ =
        {
          getWidgets:
            () => widgets,

          addWidget,

          removeWidget,

          moveWidget,

          resetWidgets,

          openPanel:
            () =>
              setPanelOpen(
                true
              ),

          closePanel:
            () =>
              setPanelOpen(
                false
              ),

          togglePanel:
            () =>
              setPanelOpen(
                (previous) =>
                  !previous
              ),
        };

      return () => {
        delete (
          window as any
        ).__ABHISHEK_WIDGETS__;
      };
    }, [
      widgets,
      addWidget,
      removeWidget,
      moveWidget,
      resetWidgets,
    ]);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
      <>
        {/* =================================================
            ACTIVE DESKTOP WIDGETS

            Nothing appears here until the user
            explicitly adds a widget.
        ================================================= */}

        {widgets.map(
          (widget) => (
            <DesktopWidget
              key={
                widget.id
              }
              widget={
                widget
              }
              onMove={
                moveWidget
              }
              onRemove={
                removeWidget
              }
              onToggleMinimize={
                toggleMinimize
              }
            />
          )
        )}

        {/* =================================================
            WIDGET PANEL

            This is the control center where the user
            explicitly chooses which widgets to add.
        ================================================= */}

        {panelOpen && (
          <div
            className="
              pointer-events-auto
              absolute
              right-5
              top-5
              z-[1000]
              w-[340px]
              max-w-[calc(100vw-24px)]
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.12]
              bg-slate-950/90
              shadow-2xl
              shadow-black/50
              backdrop-blur-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* =============================================
                PANEL HEADER
            ============================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-white/[0.08]
                px-4
                py-3
              "
            >
              <div>
                <div
                  className="
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  Desktop Widgets
                </div>

                <div
                  className="
                    mt-0.5
                    text-[11px]
                    text-slate-500
                  "
                >
                  Add widgets to your
                  desktop
                </div>
              </div>

              <button
                type="button"
                aria-label="Close widgets"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-500
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
                onClick={() =>
                  setPanelOpen(
                    false
                  )
                }
              >
                <X
                  className="
                    h-4
                    w-4
                  "
                />
              </button>
            </div>

            {/* =============================================
                WIDGET LIST
            ============================================= */}

            <div
              className="
                max-h-[430px]
                overflow-y-auto
                p-3
              "
            >
              <div
                className="
                  space-y-2
                "
              >
                {availableWidgets.map(
                  (
                    item
                  ) => (
                    <div
                      key={
                        item.type
                      }
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-white/[0.07]
                        bg-white/[0.025]
                        p-3
                        transition
                        hover:border-white/[0.13]
                        hover:bg-white/[0.05]
                      "
                    >
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-white/[0.08]
                          bg-white/[0.05]
                          text-slate-300
                        "
                      >
                        <WidgetIcon
                          type={
                            item.type
                          }
                        />
                      </div>

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <div
                          className="
                            text-xs
                            font-semibold
                            text-white
                          "
                        >
                          {
                            item.title
                          }
                        </div>

                        <div
                          className="
                            mt-1
                            text-[10px]
                            leading-4
                            text-slate-500
                          "
                        >
                          {
                            item.description
                          }
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={
                          item.added
                        }
                        className={`
                          flex
                          h-8
                          shrink-0
                          items-center
                          gap-1.5
                          rounded-lg
                          px-3
                          text-[11px]
                          font-medium
                          transition

                          ${
                            item.added
                              ? "cursor-default bg-white/[0.05] text-slate-600"
                              : "bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 hover:text-sky-200"
                          }
                        `}
                        onClick={() =>
                          addWidget(
                            item.type
                          )
                        }
                      >
                        {item.added ? (
                          <>
                            Added
                          </>
                        ) : (
                          <>
                            <Plus
                              className="
                                h-3.5
                                w-3.5
                              "
                            />

                            Add
                          </>
                        )}
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* =============================================
                PANEL FOOTER
            ============================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                border-t
                border-white/[0.08]
                px-3
                py-3
              "
            >
              <div
                className="
                  text-[10px]
                  text-slate-500
                "
              >
                {widgets.length}{" "}
                widget
                {widgets.length ===
                1
                  ? ""
                  : "s"}{" "}
                active
              </div>

              <button
                type="button"
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-lg
                  px-2.5
                  py-1.5
                  text-[10px]
                  text-slate-500
                  transition
                  hover:bg-white/10
                  hover:text-slate-200
                "
                onClick={
                  resetWidgets
                }
              >
                <RefreshCw
                  className="
                    h-3
                    w-3
                  "
                />

                Reset
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            WIDGET PANEL FLOATING BUTTON

            This lets the user open the panel directly
            from the desktop.
        ================================================= */}

        {!panelOpen && (
          <button
            type="button"
            aria-label="Open desktop widgets"
            className="
              pointer-events-auto
              absolute
              bottom-5
              right-5
              z-[900]
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.12]
              bg-slate-950/65
              text-slate-300
              shadow-xl
              shadow-black/20
              backdrop-blur-xl
              transition
              hover:scale-105
              hover:border-white/[0.2]
              hover:bg-slate-900/80
              hover:text-white
            "
            onClick={(e) => {
              e.stopPropagation();

              setPanelOpen(
                true
              );
            }}
          >
            <LayoutDashboard
              className="
                h-5
                w-5
              "
            />
          </button>
        )}
      </>
    );
  };

export default DesktopWidgets;