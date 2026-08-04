import type { ResizeState, WindowResizeDirection } from "../types";

type ResizeLimits = {
  bottomLimit: number;
  margin: number;
  minimumHeight: number;
  minimumWidth: number;
  topLimit: number;
  viewportHeight: number;
  viewportWidth: number;
};

export type WindowBounds = {
  height: number;
  width: number;
  x: number;
  y: number;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function includesHorizontalEdge(
  direction: WindowResizeDirection,
  edge: "e" | "w",
) {
  return direction.includes(edge);
}

function includesVerticalEdge(
  direction: WindowResizeDirection,
  edge: "n" | "s",
) {
  return direction.includes(edge);
}

export function calculateResizedWindow(
  resize: ResizeState,
  pointer: { x: number; y: number },
  limits: ResizeLimits,
): WindowBounds {
  const rightLimit = limits.viewportWidth - limits.margin;
  const bottomLimit = limits.viewportHeight - limits.bottomLimit;
  const minimumWidth = Math.min(
    limits.minimumWidth,
    rightLimit - limits.margin,
  );
  const minimumHeight = Math.min(
    limits.minimumHeight,
    bottomLimit - limits.topLimit,
  );
  const deltaX = pointer.x - resize.pointerX;
  const deltaY = pointer.y - resize.pointerY;
  const startRight = resize.x + resize.width;
  const startBottom = resize.y + resize.height;
  let left = resize.x;
  let right = startRight;
  let top = resize.y;
  let bottom = startBottom;

  if (includesHorizontalEdge(resize.direction, "w")) {
    left = clamp(
      resize.x + deltaX,
      limits.margin,
      startRight - minimumWidth,
    );
  }
  if (includesHorizontalEdge(resize.direction, "e")) {
    right = clamp(
      startRight + deltaX,
      resize.x + minimumWidth,
      rightLimit,
    );
  }
  if (includesVerticalEdge(resize.direction, "n")) {
    top = clamp(
      resize.y + deltaY,
      limits.topLimit,
      startBottom - minimumHeight,
    );
  }
  if (includesVerticalEdge(resize.direction, "s")) {
    bottom = clamp(
      startBottom + deltaY,
      resize.y + minimumHeight,
      bottomLimit,
    );
  }

  return {
    height: Math.round(bottom - top),
    width: Math.round(right - left),
    x: Math.round(left),
    y: Math.round(top),
  };
}
