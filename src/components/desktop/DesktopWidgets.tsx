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
  RefreshCw,
  MapPin,
} from "lucide-react";

import { DAILY_QUOTES } from "../../data/dailyQuotes";
import { AppIcon } from "../ui/AppIcon";

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

const DEFAULT_QUOTE_SEEDED_KEY =
  "abhishek-os-default-quote-seeded-v1";
const QUOTE_WIDGET_VERSION_KEY =
  "abhishek-os-quote-widget-version";
const QUOTE_WIDGET_VERSION = "2";

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
        width:
          typeof window === "undefined"
            ? 350
            : Math.min(
                350,
                Math.max(200, window.innerWidth - DESKTOP_PADDING * 2),
              ),
        height:
          typeof window === "undefined"
            ? 205
            : Math.min(
                205,
                Math.max(160, window.innerHeight - TASKBAR_HEIGHT - DESKTOP_PADDING * 2),
              ),
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

const createDefaultQuoteWidget = (): WidgetState => {
  const size = getDefaultWidgetSize("quote");
  const bounds = getDesktopBounds();

  return {
    id: "widget-quote-default",
    type: "quote",
    position: {
      x: Math.max(
        DESKTOP_PADDING,
        bounds.width - size.width - DESKTOP_PADDING,
      ),
      y: DESKTOP_PADDING,
    },
    size,
    minimized: false,
  };
};

const loadWidgets =
  (): WidgetState[] => {
    try {
      const defaultWasSeeded =
        localStorage.getItem(DEFAULT_QUOTE_SEEDED_KEY) === "true";
      const quoteWidgetVersion =
        localStorage.getItem(QUOTE_WIDGET_VERSION_KEY);
      const stored =
        localStorage.getItem(
          WIDGET_STORAGE_KEY
        );

      if (!stored) {
        if (defaultWasSeeded) {
          return [];
        }
        localStorage.setItem(QUOTE_WIDGET_VERSION_KEY, QUOTE_WIDGET_VERSION);
        return [createDefaultQuoteWidget()];
      }

      const parsed =
        JSON.parse(stored);

      if (
        !Array.isArray(parsed)
      ) {
        if (defaultWasSeeded) {
          return [];
        }
        localStorage.setItem(QUOTE_WIDGET_VERSION_KEY, QUOTE_WIDGET_VERSION);
        return [createDefaultQuoteWidget()];
      }

      if (parsed.length === 0) {
        if (!defaultWasSeeded) {
          localStorage.setItem(QUOTE_WIDGET_VERSION_KEY, QUOTE_WIDGET_VERSION);
          return [createDefaultQuoteWidget()];
        }
        return parsed;
      }

      if (quoteWidgetVersion === QUOTE_WIDGET_VERSION) {
        return parsed;
      }

      const quoteWidget = parsed.find(
        (widget): widget is WidgetState =>
          widget &&
          typeof widget === "object" &&
          widget.type === "quote" &&
          typeof widget.id === "string" &&
          typeof widget.position?.x === "number" &&
          typeof widget.position?.y === "number" &&
          typeof widget.size?.width === "number" &&
          typeof widget.size?.height === "number",
      );

      if (!quoteWidget) {
        localStorage.setItem(QUOTE_WIDGET_VERSION_KEY, QUOTE_WIDGET_VERSION);
        return parsed;
      }

      const quoteSize = getDefaultWidgetSize("quote");
      const quoteBounds = getDesktopBounds();
      const defaultPosition = {
        x: Math.max(
          DESKTOP_PADDING,
          quoteBounds.width - quoteSize.width - DESKTOP_PADDING,
        ),
        y: DESKTOP_PADDING,
      };
      const updatedWidgets = parsed.map((widget) =>
        widget.id === quoteWidget.id
          ? {
              ...widget,
              position:
                widget.id === "widget-quote-default"
                  ? defaultPosition
                  : clampWidgetPosition(
                      quoteWidget.position.x,
                      quoteWidget.position.y,
                      quoteSize,
                    ),
              size: quoteSize,
              minimized: false,
            }
          : widget,
      );
      localStorage.setItem(QUOTE_WIDGET_VERSION_KEY, QUOTE_WIDGET_VERSION);
      return updatedWidgets;
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
          group
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
            relative
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

const QuoteWidget = () => {
  const [quoteIndex, setQuoteIndex] = useState(
    () => Math.floor(Math.random() * DAILY_QUOTES.length),
  );

  const showNextQuote = () => {
    setQuoteIndex((current) =>
      (current + 1 + Math.floor(Math.random() * (DAILY_QUOTES.length - 1))) %
      DAILY_QUOTES.length,
    );
  };

  return (
    <div
      className="
          relative
          flex
          h-full
          flex-col
          justify-between
          overflow-hidden
          px-4
          py-3
      "
    >
      <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-sky-400/[0.08] blur-3xl" />
      <div className="relative flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-400/[0.09] text-sky-200 shadow-[0_0_24px_rgba(56,189,248,0.10)]">
          <Quote className="h-3.5 w-3.5" />
        </span>
        <button
          type="button"
          aria-label="Show another quote"
          title="Show another quote"
          onClick={showNextQuote}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:rotate-[-35deg] hover:bg-white/[0.08] hover:text-sky-200 active:scale-90"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      <p
        key={quoteIndex}
        aria-live="polite"
        className="daily-quote-text relative my-1 line-clamp-3 animate-[quoteReveal_240ms_ease-out] text-[13px] font-medium leading-[1.4] tracking-[-0.02em] text-white"
      >
        “{DAILY_QUOTES[quoteIndex]}”
      </p>

      <div className="relative flex items-center justify-between border-t border-white/[0.08] pt-2 text-[10px] text-slate-400">
        <span>Daily inspiration</span>
        <span className="font-mono text-slate-500">
          {quoteIndex + 1} / {DAILY_QUOTES.length}
        </span>
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
          relative
          flex
          h-full
          flex-col
          justify-between
          overflow-hidden
          px-4
          py-4
        "
      >
        <div className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full bg-violet-400/[0.08] blur-3xl" />
        <div
          className="
            relative
            flex
            items-center
            gap-3
          "
        >
          <div
            className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.24)] transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/abhishek-profile-avatar.png"
              alt="Abhishek Kuntare"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>

          <div className="relative min-w-0">
            <div
              className="
                truncate
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
            relative
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
              border-white/[0.09]
              bg-white/[0.035]
              p-2.5
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-sky-300/20
              hover:bg-white/[0.07]
            "
          >
            <div
              className="
                text-[10px]
                text-slate-400
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
              border-white/[0.09]
              bg-white/[0.035]
              p-2.5
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-sky-300/20
              hover:bg-white/[0.07]
            "
          >
            <div
              className="
                text-[10px]
                text-slate-400
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
        bg-slate-950/65
        desktop-widget-surface
        shadow-2xl
        shadow-black/30
        backdrop-blur-[28px]
        backdrop-saturate-150
        transition-all
        duration-200
        hover:-translate-y-px
        hover:border-white/[0.2]
        hover:shadow-[0_24px_56px_rgba(0,0,0,0.42)]
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
          hidden
          sm:flex
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
        localStorage.setItem(
          DEFAULT_QUOTE_SEEDED_KEY,
          "true",
        );
        localStorage.setItem(
          QUOTE_WIDGET_VERSION_KEY,
          QUOTE_WIDGET_VERSION,
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
              border-white/[0.16]
              bg-slate-950/75
              desktop-widgets-panel
              shadow-[0_24px_72px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.08)]
              backdrop-blur-[28px]
              backdrop-saturate-150
              animate-[widgetsPanelIn_240ms_cubic-bezier(.2,.8,.2,1)]
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.09),transparent_52%)]" />
            {/* =============================================
                PANEL HEADER
            ============================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-white/[0.10]
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
                    text-slate-400
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
                  text-slate-400
                  transition-all
                  duration-200
                  hover:rotate-90
                  hover:bg-white/[0.08]
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
                relative
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
                        group
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-white/[0.08]
                        bg-white/[0.035]
                        p-3
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:border-sky-300/20
                        hover:bg-white/[0.065]
                        hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]
                      "
                    >
                      <div
                        className="
                          relative
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-white/[0.08]
                          bg-white/[0.06]
                          text-slate-300
                          transition-all
                          duration-200
                          group-hover:border-white/[0.14]
                          group-hover:bg-white/[0.09]
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
                            text-slate-400
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
                          duration-200
                          active:scale-95

                          ${
                            item.added
                              ? "cursor-default bg-white/[0.05] text-slate-400"
                              : "border border-sky-300/15 bg-sky-500/15 text-sky-200 hover:border-sky-300/30 hover:bg-sky-500/25 hover:text-white hover:shadow-[0_4px_18px_rgba(56,189,248,0.16)]"
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
                border-white/[0.10]
                px-3
                py-3
              "
            >
              <div
                className="
                  text-[10px]
                  text-slate-400
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
                  text-slate-400
                  transition-all
                  duration-200
                  hover:bg-white/[0.07]
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
              hidden
              sm:flex
              h-12
              w-12
              items-center
              justify-center
              rounded-lg
              outline-none
              transition-transform
              duration-150
              hover:scale-110
              focus-visible:ring-2
              focus-visible:ring-sky-300
              focus-visible:ring-offset-2
              focus-visible:ring-offset-transparent
            "
            onClick={(e) => {
              e.stopPropagation();

              setPanelOpen(
                true
              );
            }}
          >
            <AppIcon
              name="LayoutDashboard"
              appId="widgets"
              className="
                h-11
                w-11
              "
              size={44}
            />
          </button>
        )}
      </>
    );
  };

export default DesktopWidgets;