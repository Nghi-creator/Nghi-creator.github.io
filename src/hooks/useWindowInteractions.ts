import { useCallback, useEffect, useRef } from "react";
import { windowMinimumSizes } from "../data/profile";
import { calculateResizedWindow } from "../lib/windowGeometry";
import type {
  AppId,
  DragState,
  ResizeState,
  WindowResizeDirection,
  WindowResizeHandler,
  WindowState,
} from "../types";
import {
  clamp,
  WINDOW_BOTTOM_LIMIT,
  WINDOW_MARGIN,
  WINDOW_TOP_LIMIT,
} from "./useWindowManager";

type SetWindows = React.Dispatch<React.SetStateAction<WindowState[]>>;

export function useWindowInteractions({
  focusWindow,
  setWindows,
}: {
  focusWindow: (id: AppId) => void;
  setWindows: SetWindows;
}) {
  const dragState = useRef<DragState | null>(null);
  const resizeState = useRef<ResizeState | null>(null);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const resize = resizeState.current;
      if (resize) {
        const minimum = windowMinimumSizes[resize.id];
        const bounds = calculateResizedWindow(
          resize,
          { x: event.clientX, y: event.clientY },
          {
            bottomLimit: WINDOW_BOTTOM_LIMIT,
            margin: WINDOW_MARGIN,
            minimumHeight: minimum.height,
            minimumWidth: minimum.width,
            topLimit: WINDOW_TOP_LIMIT,
            viewportHeight: window.innerHeight,
            viewportWidth: window.innerWidth,
          },
        );
        setWindows((current) =>
          current.map((item) =>
            item.id === resize.id ? { ...item, ...bounds } : item,
          ),
        );
        return;
      }

      const drag = dragState.current;
      if (!drag) return;

      const maxX = Math.max(
        WINDOW_MARGIN,
        window.innerWidth - drag.width - WINDOW_MARGIN,
      );
      const maxY = Math.max(
        WINDOW_TOP_LIMIT,
        window.innerHeight - drag.height - WINDOW_BOTTOM_LIMIT,
      );
      const nextX = clamp(event.clientX - drag.offsetX, WINDOW_MARGIN, maxX);
      const nextY = clamp(event.clientY - drag.offsetY, WINDOW_TOP_LIMIT, maxY);

      setWindows((current) =>
        current.map((item) =>
          item.id === drag.id ? { ...item, x: nextX, y: nextY } : item,
        ),
      );
    }

    function endPointerInteraction() {
      dragState.current = null;
      resizeState.current = null;
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", endPointerInteraction);
    window.addEventListener("pointercancel", endPointerInteraction);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", endPointerInteraction);
      window.removeEventListener("pointercancel", endPointerInteraction);
      endPointerInteraction();
    };
  }, [setWindows]);

  const startWindowDrag = useCallback(
    (
      id: AppId,
      event: React.PointerEvent<HTMLDivElement>,
      rect: DOMRect,
    ) => {
      if (event.button !== 0 || window.innerWidth < 1024) return;
      event.preventDefault();
      focusWindow(id);

      dragState.current = {
        id,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        width: rect.width,
        height: rect.height,
      };

      setWindows((current) =>
        current.map((item) =>
          item.id === id ? { ...item, x: rect.left, y: rect.top } : item,
        ),
      );
    },
    [focusWindow, setWindows],
  );

  const startWindowResize = useCallback<WindowResizeHandler>(
    (id, direction: WindowResizeDirection, event, rect) => {
      if (event.button !== 0 || window.innerWidth < 1024) return;
      event.preventDefault();
      event.stopPropagation();
      focusWindow(id);

      resizeState.current = {
        direction,
        height: rect.height,
        id,
        pointerX: event.clientX,
        pointerY: event.clientY,
        width: rect.width,
        x: rect.left,
        y: rect.top,
      };
      document.body.style.cursor = `${direction}-resize`;
      document.body.style.userSelect = "none";

      setWindows((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                height: rect.height,
                width: rect.width,
                x: rect.left,
                y: rect.top,
              }
            : item,
        ),
      );
    },
    [focusWindow, setWindows],
  );

  return { startWindowDrag, startWindowResize };
}
