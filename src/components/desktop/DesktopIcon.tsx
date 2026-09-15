import React, { useRef, useState } from "react";

import { useOS } from "../../context/OSContext";

import { DesktopIconItem } from "../../types";

import { AppIcon } from "../ui/AppIcon";

/* =========================================================
   TYPES
========================================================= */

interface DesktopPosition {
  x: number;
  y: number;
}

interface DesktopIconProps {
  item: DesktopIconItem;

  /*
   * Current absolute position on the desktop.
   */
  desktopPosition?: DesktopPosition;

  /*
   * Parent updates the icon position.
   */
  onDesktopPositionChange?: (
    x: number,
    y: number
  ) => void;

  /*
   * Parent uses this to control z-index / visual state.
   */
  isDragging?: boolean;

  /*
   * Tell the desktop which icon is currently being dragged.
   */
  onDragStateChange?: (
    id: string | null
  ) => void;

  /*
   * Windows-style desktop icon sizes.
   */
  viewMode?:
    | "large"
    | "medium"
    | "small";
}

/* =========================================================
   COMPONENT
========================================================= */

export const DesktopIcon: React.FC<
  DesktopIconProps
> = ({
  item,
  desktopPosition = {
    x: 0,
    y: 0,
  },
  onDesktopPositionChange,
  isDragging = false,
  onDragStateChange,
  viewMode = "medium",
}) => {
  const {
    selectedIconId,
    setSelectedIconId,
    openApp,
    playSystemSound,
    openContextMenu,
  } = useOS();

  const isSelected =
    selectedIconId === item.id;

  /* =======================================================
     TOUCH / POINTER REFS
  ======================================================= */

  const lastTapRef =
    useRef<number>(0);

  const pointerIdRef =
    useRef<number | null>(null);

  const isPointerDownRef =
    useRef(false);

  const hasMovedRef =
    useRef(false);

  /*
   * Used to prevent the browser from firing
   * click after a drag.
   */
  const suppressClickRef =
    useRef(false);

  /*
   * Original pointer position when dragging starts.
   */
  const dragStartRef =
    useRef({
      pointerX: 0,
      pointerY: 0,
      iconX: 0,
      iconY: 0,
    });

  /* =======================================================
     LOCAL VISUAL STATE
  ======================================================= */

  const [
    pressed,
    setPressed,
  ] = useState(false);

  /* =======================================================
     ICON DIMENSIONS
  ======================================================= */

  const dimensions =
    viewMode === "large"
      ? {
          width: 88,
          height: 88,
          icon: "w-11 h-11",
          iconInner: "w-7 h-7",
          text: "text-sm",
        }
      : viewMode === "small"
      ? {
          width: 68,
          height: 68,
          icon: "w-9 h-9",
          iconInner: "w-5 h-5",
          text: "text-[11px]",
        }
      : {
          width: 78,
          height: 78,
          icon: "w-11 h-11",
          iconInner: "w-6 h-6",
          text: "text-xs",
        };

  /* =======================================================
     POINTER DOWN
  ======================================================= */

  const handlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    /*
     * Only use the primary mouse button.
     *
     * Touch and pen don't use e.button in the
     * same way, so don't block them.
     */
    if (
      e.pointerType === "mouse" &&
      e.button !== 0
    ) {
      return;
    }

    /*
     * Don't let the desktop background
     * receive this event.
     */
    e.stopPropagation();

    isPointerDownRef.current =
      true;

    hasMovedRef.current =
      false;

    suppressClickRef.current =
      false;

    pointerIdRef.current =
      e.pointerId;

    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      iconX: desktopPosition.x,
      iconY: desktopPosition.y,
    };

    setPressed(true);

    /*
     * CRITICAL:
     *
     * Pointer capture makes the icon continue receiving
     * pointermove/pointerup events even after the cursor
     * moves outside the icon.
     */
    try {
      e.currentTarget.setPointerCapture(
        e.pointerId
      );
    } catch {
      // Ignore unsupported pointer capture.
    }
  };

  /* =======================================================
     POINTER MOVE
  ======================================================= */

  const handlePointerMove = (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (
      !isPointerDownRef.current
    ) {
      return;
    }

    if (
      pointerIdRef.current !==
      e.pointerId
    ) {
      return;
    }

    const deltaX =
      e.clientX -
      dragStartRef.current
        .pointerX;

    const deltaY =
      e.clientY -
      dragStartRef.current
        .pointerY;

    /*
     * Small movement = still a click.
     */
    const distance = Math.sqrt(
      deltaX * deltaX +
        deltaY * deltaY
    );

    if (
      !hasMovedRef.current &&
      distance < 5
    ) {
      return;
    }

    /*
     * Start dragging.
     */
    if (
      !hasMovedRef.current
    ) {
      hasMovedRef.current =
        true;

      suppressClickRef.current =
        true;

      onDragStateChange?.(
        item.id
      );
    }

    /*
     * Calculate the new position.
     *
     * The parent App.tsx is responsible for
     * clamping it inside the desktop.
     */
    const nextX =
      dragStartRef.current
        .iconX + deltaX;

    const nextY =
      dragStartRef.current
        .iconY + deltaY;

    onDesktopPositionChange?.(
      nextX,
      nextY
    );

    /*
     * Prevent scrolling on touch devices.
     */
    e.preventDefault();

    e.stopPropagation();
  };

  /* =======================================================
     POINTER UP
  ======================================================= */

  const handlePointerUp = (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (
      !isPointerDownRef.current
    ) {
      return;
    }

    e.stopPropagation();

    isPointerDownRef.current =
      false;

    setPressed(false);

    if (
      hasMovedRef.current
    ) {
      onDragStateChange?.(
        null
      );
    }

    pointerIdRef.current =
      null;

    /*
     * Release pointer capture.
     */
    try {
      if (
        e.currentTarget.hasPointerCapture(
          e.pointerId
        )
      ) {
        e.currentTarget.releasePointerCapture(
          e.pointerId
        );
      }
    } catch {
      // Ignore.
    }

    /*
     * Keep suppressClickRef true for this event cycle.
     * It will be reset on the next pointer down.
     */
    hasMovedRef.current =
      false;
  };

  /* =======================================================
     POINTER CANCEL
  ======================================================= */

  const handlePointerCancel = (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    isPointerDownRef.current =
      false;

    hasMovedRef.current =
      false;

    pointerIdRef.current =
      null;

    setPressed(false);

    onDragStateChange?.(
      null
    );
  };

  /* =======================================================
     CLICK
  ======================================================= */

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    /*
     * Browser can fire click immediately after drag.
     *
     * Don't select/open in that case.
     */
    if (
      suppressClickRef.current
    ) {
      suppressClickRef.current =
        false;

      return;
    }

    setSelectedIconId(
      item.id
    );

    playSystemSound(
      "click"
    );
  };

  /* =======================================================
     DOUBLE CLICK
  ======================================================= */

  const handleDoubleClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    /*
     * Never open the application if the user
     * has just dragged the icon.
     */
    if (
      suppressClickRef.current
    ) {
      return;
    }

    openApp(item.appId, item.extraData);
  };

  /* =======================================================
     TOUCH END
  ======================================================= */

  const handleTouchEnd = (
    e: React.TouchEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    /*
     * If this touch was actually a drag,
     * don't perform double-tap logic.
     */
    if (
      suppressClickRef.current
    ) {
      suppressClickRef.current =
        false;

      lastTapRef.current =
        0;

      return;
    }

    const currentTime =
      Date.now();

    const tapLength =
      currentTime -
      lastTapRef.current;

    /*
     * Double tap.
     */
    if (
      tapLength < 350 &&
      tapLength > 0
    ) {
      e.preventDefault();

      openApp(item.appId, item.extraData);

      lastTapRef.current =
        0;

      return;
    }

    /*
     * Single touch.
     */
    setSelectedIconId(
      item.id
    );

    lastTapRef.current =
      currentTime;
  };

  /* =======================================================
     KEYBOARD
  ======================================================= */

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (
      e.key === "Enter" ||
      e.key === " "
    ) {
      e.preventDefault();

      setSelectedIconId(
        item.id
      );

      openApp(item.appId, item.extraData);
    }
  };

  /* =======================================================
     RIGHT CLICK
  ======================================================= */

  const handleContextMenu = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    /*
     * Don't allow the event to bubble into
     * the desktop background.
     *
     * This means right-clicking an icon doesn't
     * accidentally open the desktop context menu.
     */
    e.stopPropagation();
    e.preventDefault();
    setSelectedIconId(item.id);
    openContextMenu(e.clientX, e.clientY, "icon", item.id);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <button
      id={`desktop-icon-${item.appId}`}
      type="button"
      aria-label={`Open ${item.title}`}
      title={item.title}
      tabIndex={0}
      draggable={false}
      className={`
        group
        relative
        flex
        flex-col
        items-center
        justify-center

        rounded-xl

        outline-none

        select-none
        touch-none

        transition-[transform,background-color,border-color,box-shadow]
        duration-150
        ease-out

        ${
          isDragging
            ? `
              z-[999]
              scale-[1.06]
              bg-white/[0.12]
              border-white/[0.20]
              shadow-[0_18px_45px_rgba(0,0,0,0.42)]
            `
            : ""
        }

        ${
          pressed
            ? "scale-[0.96]"
            : ""
        }

        ${
          isSelected &&
          !isDragging
            ? `
              bg-sky-500/25
              border
              border-sky-400/40
              shadow-sm
              backdrop-blur-sm
            `
            : `
              border
              border-transparent
            `
        }

        ${
          !isSelected &&
          !isDragging
            ? `
              hover:bg-white/10
              hover:border-white/15
            `
            : ""
        }

        focus-visible:ring-1
        focus-visible:ring-sky-400
      `}
      style={{
        /*
         * Width/height are controlled here rather
         * than through the old flex grid.
         */
        width:
          dimensions.width,
        height:
          dimensions.height,

        /*
         * CRITICAL FOR DRAGGING:
         *
         * Browser must not interpret touch
         * movement as scrolling/zooming.
         */
        touchAction:
          "none",

        userSelect:
          "none",

        WebkitUserSelect:
          "none",

        WebkitTouchCallout:
          "none",

        /*
         * Don't let the browser create its
         * native image/button drag preview.
         */
        WebkitUserDrag:
          "none" as any,
      }}
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
        handlePointerCancel
      }
      onClick={
        handleClick
      }
      onDoubleClick={
        handleDoubleClick
      }
      onTouchEnd={
        handleTouchEnd
      }
      onKeyDown={
        handleKeyDown
      }
      onContextMenu={
        handleContextMenu
      }
    >
      {/* ===================================================
          APP ICON CONTAINER
      =================================================== */}

      <div
        className={`
          relative
          flex
          items-center
          justify-center

          rounded-xl

          bg-slate-900/60

          border
          border-white/10

          shadow-md

          transition-transform
          duration-150
          ease-out

          ${dimensions.icon}

          ${
            isDragging
              ? "scale-105 shadow-xl"
              : "group-hover:scale-105"
          }
        `}
      >
        <AppIcon
          name={
            item.iconName
          }
          className={`
            ${dimensions.iconInner}

            transition-colors
            duration-150

            ${
              isSelected ||
              isDragging
                ? "text-sky-300"
                : "text-slate-200 group-hover:text-white"
            }
          `}
        />

        {/* =================================================
            ACTIVE APP DOT
        ================================================= */}

        {(
          item.appId ===
            "this-pc" ||
          item.appId ===
            "projects"
        ) && (
          <span
            className="
              absolute
              -bottom-0.5
              -right-0.5

              h-2
              w-2

              rounded-full

              bg-sky-400

              ring-2
              ring-slate-900
            "
          />
        )}
      </div>

      {/* ===================================================
          LABEL
      =================================================== */}

      <span
        className={`
          mt-1

          max-w-full

          px-1
          py-[2px]

          rounded-md

          text-center

          font-medium

          leading-tight

          line-clamp-2

          ${dimensions.text}

          transition-colors

          drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]

          ${
            isSelected ||
            isDragging
              ? `
                bg-sky-600/60
                text-white
                font-semibold
              `
              : `
                text-slate-100
                group-hover:text-white
              `
          }
        `}
      >
        {item.title}
      </span>
    </button>
  );
};

export default DesktopIcon;