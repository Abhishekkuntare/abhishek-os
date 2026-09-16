import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Keyboard,
  X,
  Volume2,
  VolumeX,
  Minus,
  Maximize2,
  Minimize2,
  Grip,
  LockKeyhole,
} from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

interface KeyConfig {
  label: string;
  value?: string;
  width?: string;
  secondary?: string;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface DragState {
  active: boolean;
  offsetX: number;
  offsetY: number;
}

interface ResizeState {
  active: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

const KEY_ROWS: KeyConfig[][] = [
  [
    { label: 'Esc', value: 'Escape', width: 'w-[7%]' },
    { label: 'F1', value: 'F1', width: 'w-[7%]' },
    { label: 'F2', value: 'F2', width: 'w-[7%]' },
    { label: 'F3', value: 'F3', width: 'w-[7%]' },
    { label: 'F4', value: 'F4', width: 'w-[7%]' },
    { label: 'F5', value: 'F5', width: 'w-[7%]' },
    { label: 'F6', value: 'F6', width: 'w-[7%]' },
    { label: 'F7', value: 'F7', width: 'w-[7%]' },
    { label: 'F8', value: 'F8', width: 'w-[7%]' },
    { label: 'F9', value: 'F9', width: 'w-[7%]' },
    { label: 'F10', value: 'F10', width: 'w-[7%]' },
    { label: 'F11', value: 'F11', width: 'w-[7%]' },
    { label: 'F12', value: 'F12', width: 'w-[7%]' },
  ],

  [
    { label: '`', value: '`', secondary: '~' },
    { label: '1', value: '1', secondary: '!' },
    { label: '2', value: '2', secondary: '@' },
    { label: '3', value: '3', secondary: '#' },
    { label: '4', value: '4', secondary: '$' },
    { label: '5', value: '5', secondary: '%' },
    { label: '6', value: '6', secondary: '^' },
    { label: '7', value: '7', secondary: '&' },
    { label: '8', value: '8', secondary: '*' },
    { label: '9', value: '9', secondary: '(' },
    { label: '0', value: '0', secondary: ')' },
    { label: '-', value: '-', secondary: '_' },
    { label: '=', value: '=', secondary: '+' },
    {
      label: 'Backspace',
      value: 'Backspace',
      width: 'w-[13%]',
    },
  ],

  [
    {
      label: 'Tab',
      value: 'Tab',
      width: 'w-[9%]',
    },
    { label: 'Q', value: 'q' },
    { label: 'W', value: 'w' },
    { label: 'E', value: 'e' },
    { label: 'R', value: 'r' },
    { label: 'T', value: 't' },
    { label: 'Y', value: 'y' },
    { label: 'U', value: 'u' },
    { label: 'I', value: 'i' },
    { label: 'O', value: 'o' },
    { label: 'P', value: 'p' },
    { label: '[', value: '[' },
    { label: ']', value: ']' },
    { label: '\\', value: '\\' },
  ],

  [
    {
      label: 'Caps Lock',
      value: 'CapsLock',
      width: 'w-[12%]',
    },
    { label: 'A', value: 'a' },
    { label: 'S', value: 's' },
    { label: 'D', value: 'd' },
    { label: 'F', value: 'f' },
    { label: 'G', value: 'g' },
    { label: 'H', value: 'h' },
    { label: 'J', value: 'j' },
    { label: 'K', value: 'k' },
    { label: 'L', value: 'l' },
    { label: ';', value: ';' },
    { label: "'", value: "'" },
    {
      label: 'Enter',
      value: 'Enter',
      width: 'w-[12%]',
    },
  ],

  [
    {
      label: 'Shift',
      value: 'Shift',
      width: 'w-[15%]',
    },
    { label: 'Z', value: 'z' },
    { label: 'X', value: 'x' },
    { label: 'C', value: 'c' },
    { label: 'V', value: 'v' },
    { label: 'B', value: 'b' },
    { label: 'N', value: 'n' },
    { label: 'M', value: 'm' },
    { label: ',', value: ',' },
    { label: '.', value: '.' },
    { label: '/', value: '/' },
    {
      label: 'Shift',
      value: 'Shift',
      width: 'w-[15%]',
    },
  ],

  [
    {
      label: 'Ctrl',
      value: 'Control',
      width: 'w-[10%]',
    },
    {
      label: 'Win',
      value: 'Meta',
      width: 'w-[8%]',
    },
    {
      label: 'Alt',
      value: 'Alt',
      width: 'w-[8%]',
    },
    {
      label: 'Space',
      value: ' ',
      width: 'w-[38%]',
    },
    {
      label: 'Alt',
      value: 'Alt',
      width: 'w-[8%]',
    },
    {
      label: 'Fn',
      value: 'Fn',
      width: 'w-[8%]',
    },
    {
      label: 'Ctrl',
      value: 'Control',
      width: 'w-[10%]',
    },
  ],
];

const MIN_WIDTH = 620;
const MIN_HEIGHT = 300;
const MAX_WIDTH = 1300;
const MAX_HEIGHT = 720;

const clamp = (
  value: number,
  min: number,
  max: number,
) => Math.min(Math.max(value, min), max);

const getInitialSize = (): Size => {
  if (typeof window === 'undefined') {
    return {
      width: 900,
      height: 430,
    };
  }

  return {
    width: Math.min(
      1000,
      Math.max(620, window.innerWidth - 32),
    ),
    height: Math.min(
      470,
      Math.max(300, window.innerHeight * 0.48),
    ),
  };
};

const getInitialPosition = (size: Size): Position => {
  if (typeof window === 'undefined') {
    return {
      x: 40,
      y: 40,
    };
  }

  return {
    x: Math.max(
      8,
      (window.innerWidth - size.width) / 2,
    ),
    y: Math.max(
      8,
      window.innerHeight - size.height - 68,
    ),
  };
};

const getKeyClass = (
  key: KeyConfig,
  pressed: boolean,
  capsLock: boolean,
) => {
  const isModifier = [
    'CapsLock',
    'Shift',
    'Control',
    'Alt',
    'Meta',
    'Tab',
    'Enter',
    'Backspace',
  ].includes(key.value || '');

  return `
    relative
    flex
    h-10
    min-w-0
    flex-1
    items-center
    justify-center
    rounded-lg
    border
    text-[11px]
    sm:h-11
    sm:text-xs
    lg:h-12
    ${
      key.width
        ? `${key.width} flex-none`
        : 'flex-1'
    }
    ${
      pressed
        ? 'translate-y-[1px] border-sky-300 bg-sky-400/35 text-white shadow-inner'
        : isModifier
          ? 'border-white/10 bg-white/[0.07] text-slate-200 hover:border-sky-400/40 hover:bg-sky-500/15'
          : 'border-white/[0.07] bg-slate-800/80 text-slate-200 hover:border-sky-400/40 hover:bg-sky-500/15'
    }
    ${
      key.value === 'CapsLock' && capsLock
        ? 'ring-1 ring-sky-400/70 bg-sky-500/20'
        : ''
    }
    transition-all
    duration-75
    active:scale-[0.97]
    select-none
    touch-none
  `;
};

const normalizePhysicalKey = (key: string) => {
  if (key === ' ') return ' ';
  if (key === 'ControlLeft' || key === 'ControlRight') {
    return 'Control';
  }
  if (key === 'ShiftLeft' || key === 'ShiftRight') {
    return 'Shift';
  }
  if (key === 'AltLeft' || key === 'AltRight') {
    return 'Alt';
  }
  if (key === 'MetaLeft' || key === 'MetaRight') {
    return 'Meta';
  }
  return key;
};

export const VirtualKeyboard: React.FC<
  VirtualKeyboardProps
> = ({
  onKeyPress,
  onClose,
  isOpen,
}) => {
  const [capsLock, setCapsLock] = useState(false);
  const [soundEnabled, setSoundEnabled] =
    useState(true);

  const [pressedKey, setPressedKey] =
    useState<string | null>(null);

  const [isMinimized, setIsMinimized] =
    useState(false);

  const [isMaximized, setIsMaximized] =
    useState(false);

  const [size, setSize] =
    useState<Size>(getInitialSize);

  const [position, setPosition] =
    useState<Position>(() =>
      getInitialPosition(getInitialSize()),
    );

  const keyboardRef =
    useRef<HTMLDivElement | null>(null);

  const dragRef =
    useRef<DragState>({
      active: false,
      offsetX: 0,
      offsetY: 0,
    });

  const resizeRef =
    useRef<ResizeState>({
      active: false,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
    });

  const pressedTimerRef =
    useRef<number | null>(null);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const previousSizeRef =
    useRef<Size>(size);

  const previousPositionRef =
    useRef<Position>(position);

  /*
   * Keep keyboard inside viewport.
   */
  const keepInsideViewport = useCallback(
    (
      nextPosition: Position,
      nextSize: Size = size,
    ) => {
      if (typeof window === 'undefined') {
        return nextPosition;
      }

      const maxX = Math.max(
        8,
        window.innerWidth - nextSize.width - 8,
      );

      const maxY = Math.max(
        8,
        window.innerHeight - nextSize.height - 58,
      );

      return {
        x: clamp(
          nextPosition.x,
          8,
          maxX,
        ),
        y: clamp(
          nextPosition.y,
          8,
          maxY,
        ),
      };
    },
    [size],
  );

  /*
   * Resize / viewport changes.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowResize = () => {
      setSize((currentSize) => {
        const nextSize = {
          width: clamp(
            currentSize.width,
            Math.min(
              MIN_WIDTH,
              window.innerWidth - 16,
            ),
            Math.min(
              MAX_WIDTH,
              window.innerWidth - 16,
            ),
          ),
          height: clamp(
            currentSize.height,
            Math.min(
              MIN_HEIGHT,
              window.innerHeight - 70,
            ),
            Math.min(
              MAX_HEIGHT,
              window.innerHeight - 70,
            ),
          ),
        };

        setPosition((currentPosition) =>
          keepInsideViewport(
            currentPosition,
            nextSize,
          ),
        );

        return nextSize;
      });
    };

    window.addEventListener(
      'resize',
      handleWindowResize,
    );

    return () => {
      window.removeEventListener(
        'resize',
        handleWindowResize,
      );
    };
  }, [isOpen, keepInsideViewport]);

  /*
   * Escape closes keyboard.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener(
      'keydown',
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, [isOpen, onClose]);

  /*
   * Physical keyboard highlighting.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handlePhysicalKey = (
      event: KeyboardEvent,
    ) => {
      const normalized =
        normalizePhysicalKey(event.key);

      setPressedKey(normalized);

      if (pressedTimerRef.current) {
        window.clearTimeout(
          pressedTimerRef.current,
        );
      }

      pressedTimerRef.current =
        window.setTimeout(() => {
          setPressedKey(null);
        }, 120);

      if (event.key === 'CapsLock') {
        setCapsLock(event.getModifierState('CapsLock'));
      }
    };

    const handlePhysicalKeyUp = (
      event: KeyboardEvent,
    ) => {
      const normalized =
        normalizePhysicalKey(event.key);

      setPressedKey((current) =>
        current === normalized
          ? null
          : current,
      );
    };

    window.addEventListener(
      'keydown',
      handlePhysicalKey,
    );

    window.addEventListener(
      'keyup',
      handlePhysicalKeyUp,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handlePhysicalKey,
      );

      window.removeEventListener(
        'keyup',
        handlePhysicalKeyUp,
      );
    };
  }, [isOpen]);

  /*
   * Small keyboard sound.
   */
  const playKeySound = useCallback(() => {
    if (!soundEnabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current =
          new AudioContext();
      }

      const context =
        audioContextRef.current;

      if (context.state === 'suspended') {
        void context.resume();
      }

      const oscillator =
        context.createOscillator();

      const gain =
        context.createGain();

      oscillator.type = 'sine';

      oscillator.frequency.setValueAtTime(
        520,
        context.currentTime,
      );

      gain.gain.setValueAtTime(
        0.025,
        context.currentTime,
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.045,
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();
      oscillator.stop(
        context.currentTime + 0.045,
      );
    } catch {
      // Audio is optional.
    }
  }, [soundEnabled]);

  /*
   * Send key to Taskbar / active input.
   */
  const handleKeyPress = useCallback(
    (key: string) => {
      playKeySound();

      if (key === 'CapsLock') {
        setCapsLock(
          (current) => !current,
        );
      }

      setPressedKey(key);

      if (pressedTimerRef.current) {
        window.clearTimeout(
          pressedTimerRef.current,
        );
      }

      pressedTimerRef.current =
        window.setTimeout(() => {
          setPressedKey(null);
        }, 120);

      let outputKey = key;

      /*
       * Letters become uppercase when Caps Lock
       * is enabled.
       */
      if (
        capsLock &&
        key.length === 1 &&
        /^[a-z]$/i.test(key)
      ) {
        outputKey = key.toUpperCase();
      }

      onKeyPress(outputKey);
    },
    [
      capsLock,
      onKeyPress,
      playKeySound,
    ],
  );

  /*
   * Start dragging.
   */
  const handleDragStart = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (isMinimized) {
      // Minimized bar is also draggable.
    }

    if (!keyboardRef.current) return;

    const target =
      event.target as HTMLElement;

    /*
     * Don't start dragging when clicking
     * a header button.
     */
    if (
      target.closest('button') ||
      target.closest('[data-resize-handle]')
    ) {
      return;
    }

    const rect =
      keyboardRef.current.getBoundingClientRect();

    dragRef.current = {
      active: true,
      offsetX:
        event.clientX - rect.left,
      offsetY:
        event.clientY - rect.top,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  };

  /*
   * Drag keyboard.
   */
  const handleDragMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!dragRef.current.active) return;

    const nextPosition =
      keepInsideViewport({
        x:
          event.clientX -
          dragRef.current.offsetX,
        y:
          event.clientY -
          dragRef.current.offsetY,
      });

    setPosition(nextPosition);
  };

  /*
   * Stop dragging.
   */
  const handleDragEnd = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    dragRef.current.active = false;

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    } catch {
      // Pointer capture may already be released.
    }
  };

  /*
   * Start resizing from bottom-right.
   */
  const handleResizeStart = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    resizeRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: size.width,
      startHeight: size.height,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  };

  /*
   * Resize keyboard.
   */
  const handleResizeMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!resizeRef.current.active) return;

    const maxWidth = Math.min(
      MAX_WIDTH,
      window.innerWidth -
        position.x -
        8,
    );

    const maxHeight = Math.min(
      MAX_HEIGHT,
      window.innerHeight -
        position.y -
        58,
    );

    const nextWidth = clamp(
      resizeRef.current.startWidth +
        (event.clientX -
          resizeRef.current.startX),
      Math.min(
        MIN_WIDTH,
        window.innerWidth - 16,
      ),
      Math.max(
        MIN_WIDTH,
        maxWidth,
      ),
    );

    const nextHeight = clamp(
      resizeRef.current.startHeight +
        (event.clientY -
          resizeRef.current.startY),
      Math.min(
        MIN_HEIGHT,
        window.innerHeight - 70,
      ),
      Math.max(
        MIN_HEIGHT,
        maxHeight,
      ),
    );

    setSize({
      width: nextWidth,
      height: nextHeight,
    });
  };

  /*
   * Stop resizing.
   */
  const handleResizeEnd = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    resizeRef.current.active = false;

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    } catch {
      // Pointer capture may already be released.
    }
  };

  /*
   * Maximize / restore.
   */
  const toggleMaximize = () => {
    if (isMaximized) {
      setSize(previousSizeRef.current);
      setPosition(
        keepInsideViewport(
          previousPositionRef.current,
          previousSizeRef.current,
        ),
      );

      setIsMaximized(false);
      return;
    }

    previousSizeRef.current = size;
    previousPositionRef.current = position;

    const nextWidth = Math.min(
      MAX_WIDTH,
      window.innerWidth - 16,
    );

    const nextHeight = Math.min(
      MAX_HEIGHT,
      window.innerHeight - 70,
    );

    setSize({
      width: nextWidth,
      height: nextHeight,
    });

    setPosition({
      x: Math.max(
        8,
        (window.innerWidth -
          nextWidth) /
          2,
      ),
      y: 8,
    });

    setIsMaximized(true);
    setIsMinimized(false);
  };

  /*
   * Minimize.
   */
  const handleMinimize = () => {
    setIsMinimized(true);
  };

  /*
   * Restore from minimized state.
   */
  const handleRestore = () => {
    setIsMinimized(false);
  };

  if (!isOpen) {
    return null;
  }

  /*
   * MINIMIZED BAR
   */
  if (isMinimized) {
    return (
      <div
        ref={keyboardRef}
        className="
          fixed
          z-[10000]
          flex
          h-11
          w-[min(360px,calc(100vw-16px))]
          items-center
          gap-2
          rounded-xl
          border
          border-white/10
          bg-slate-950/95
          px-3
          shadow-2xl
          backdrop-blur-2xl
        "
        style={{
          left: position.x,
          top: position.y,
          touchAction: 'none',
        }}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-sky-500/15
            text-sky-300
          ">
            <Keyboard className="h-4 w-4" />
          </div>

          <span className="
            truncate
            text-xs
            font-semibold
            text-slate-200
          ">
            Virtual Keyboard
          </span>
        </div>

        <button
          type="button"
          onClick={handleRestore}
          aria-label="Restore virtual keyboard"
          title="Restore"
          className="
            rounded-lg
            p-1.5
            text-slate-400
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close virtual keyboard"
          title="Close"
          className="
            rounded-lg
            p-1.5
            text-slate-400
            transition
            hover:bg-red-500/15
            hover:text-red-300
          "
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <Grip
          className="
            h-3.5
            w-3.5
            shrink-0
            text-slate-600
          "
        />
      </div>
    );
  }

  return (
    <div
      ref={keyboardRef}
      className="
        fixed
        z-[10000]
        flex
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-slate-950/96
        text-slate-100
        shadow-[0_24px_80px_rgba(0,0,0,0.55)]
        backdrop-blur-2xl
      "
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        minWidth: 320,
        minHeight: 240,
      }}
    >
      {/* HEADER */}
      <div
        className="
          flex
          h-12
          shrink-0
          cursor-grab
          items-center
          gap-3
          border-b
          border-white/10
          bg-white/[0.035]
          px-3
          active:cursor-grabbing
          touch-none
        "
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
      >
        <div className="
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-sky-500/15
          text-sky-300
        ">
          <Keyboard className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="
            flex
            items-center
            gap-2
          ">
            <span className="
              text-xs
              font-bold
              text-slate-100
            ">
              Virtual Keyboard
            </span>

            {capsLock && (
              <span className="
                flex
                items-center
                gap-1
                rounded-full
                border
                border-sky-400/30
                bg-sky-500/10
                px-1.5
                py-0.5
                text-[9px]
                font-semibold
                uppercase
                tracking-wide
                text-sky-300
              ">
                <LockKeyhole className="h-2.5 w-2.5" />
                Caps
              </span>
            )}
          </div>

          <p className="
            truncate
            text-[9px]
            text-slate-500
          ">
            Drag the header • Resize from the corner
          </p>
        </div>

        {/* Sound */}
        <button
          type="button"
          aria-label={
            soundEnabled
              ? 'Disable keyboard sounds'
              : 'Enable keyboard sounds'
          }
          title={
            soundEnabled
              ? 'Keyboard sounds on'
              : 'Keyboard sounds off'
          }
          onPointerDown={(event) =>
            event.stopPropagation()
          }
          onClick={() =>
            setSoundEnabled(
              (current) => !current,
            )
          }
          className="
            rounded-lg
            p-1.5
            text-slate-400
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          {soundEnabled ? (
            <Volume2 className="h-3.5 w-3.5" />
          ) : (
            <VolumeX className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Minimize */}
        <button
          type="button"
          aria-label="Minimize virtual keyboard"
          title="Minimize"
          onPointerDown={(event) =>
            event.stopPropagation()
          }
          onClick={handleMinimize}
          className="
            rounded-lg
            p-1.5
            text-slate-400
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        {/* Maximize */}
        <button
          type="button"
          aria-label={
            isMaximized
              ? 'Restore virtual keyboard'
              : 'Maximize virtual keyboard'
          }
          title={
            isMaximized
              ? 'Restore'
              : 'Maximize'
          }
          onPointerDown={(event) =>
            event.stopPropagation()
          }
          onClick={toggleMaximize}
          className="
            rounded-lg
            p-1.5
            text-slate-400
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          {isMaximized ? (
            <Minimize2 className="h-3.5 w-3.5" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Close */}
        <button
          type="button"
          aria-label="Close virtual keyboard"
          title="Close"
          onPointerDown={(event) =>
            event.stopPropagation()
          }
          onClick={onClose}
          className="
            rounded-lg
            p-1.5
            text-slate-400
            transition
            hover:bg-red-500/15
            hover:text-red-300
          "
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* KEYBOARD AREA */}
      <div
        className="
          min-h-0
          flex-1
          overflow-auto
          p-2
          sm:p-3
        "
      >
        <div className="
          flex
          min-w-[600px]
          flex-col
          gap-1.5
          sm:gap-2
        ">
          {KEY_ROWS.map(
            (row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="
                  flex
                  min-w-0
                  gap-1
                  sm:gap-1.5
                "
              >
                {row.map(
                  (key, keyIndex) => {
                    const value =
                      key.value ??
                      key.label;

                    const isPressed =
                      pressedKey === value ||
                      (
                        value.length === 1 &&
                        pressedKey?.toLowerCase() ===
                          value.toLowerCase()
                      );

                    let displayLabel =
                      key.label;

                    if (
                      capsLock &&
                      key.label.length === 1 &&
                      /^[a-z]$/i.test(
                        key.label,
                      )
                    ) {
                      displayLabel =
                        key.label.toUpperCase();
                    }

                    return (
                      <button
                        key={`${key.label}-${keyIndex}`}
                        type="button"
                        aria-label={
                          key.label
                        }
                        className={getKeyClass(
                          key,
                          isPressed,
                          capsLock,
                        )}
                        onPointerDown={(
                          event,
                        ) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onClick={() =>
                          handleKeyPress(
                            value,
                          )
                        }
                      >
                        {key.secondary && (
                          <span className="
                            absolute
                            left-1.5
                            top-1
                            text-[7px]
                            leading-none
                            text-slate-500
                            sm:text-[8px]
                          ">
                            {key.secondary}
                          </span>
                        )}

                        <span className="
                          truncate
                          px-1
                          text-center
                        ">
                          {value === ' '
                            ? 'Space'
                            : displayLabel}
                        </span>

                        {value ===
                          'CapsLock' &&
                          capsLock && (
                            <span className="
                              absolute
                              bottom-1
                              h-1
                              w-1
                              rounded-full
                              bg-sky-400
                            " />
                          )}
                      </button>
                    );
                  },
                )}
              </div>
            ),
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="
        flex
        h-8
        shrink-0
        items-center
        justify-between
        border-t
        border-white/10
        bg-white/[0.025]
        px-3
        text-[9px]
        text-slate-500
      ">
        <span>
          Click keys to type into the focused field
        </span>

        <span className="font-mono">
          {Math.round(size.width)} ×{' '}
          {Math.round(size.height)}
        </span>
      </div>

      {/* RESIZE HANDLE */}
      <div
        data-resize-handle
        role="button"
        tabIndex={0}
        aria-label="Resize virtual keyboard"
        title="Drag to resize"
        className="
          absolute
          bottom-0
          right-0
          z-20
          flex
          h-6
          w-6
          cursor-nwse-resize
          items-end
          justify-end
          touch-none
          p-1
        "
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
        onPointerCancel={handleResizeEnd}
      >
        <div className="
          h-3
          w-3
          border-b-2
          border-r-2
          border-slate-500
        " />
      </div>
    </div>
  );
};

export default VirtualKeyboard;