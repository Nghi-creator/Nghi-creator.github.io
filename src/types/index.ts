import type { FormEvent, KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";

export type AppId =
  | "profile"
  | "resume"
  | "projects"
  | "experience"
  | "education"
  | "certifications"
  | "terminal"
  | "contact";

export type WindowState = {
  id: AppId;
  title: string;
  accent: string;
  open: boolean;
  z: number;
  maximized: boolean;
  animationKey: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

export type DragState = {
  id: AppId;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export type WindowResizeDirection =
  | "n"
  | "ne"
  | "e"
  | "se"
  | "s"
  | "sw"
  | "w"
  | "nw";

export type ResizeState = {
  id: AppId;
  direction: WindowResizeDirection;
  pointerX: number;
  pointerY: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type WindowDragHandler = (
  id: AppId,
  event: ReactPointerEvent<HTMLDivElement>,
  rect: DOMRect,
) => void;

export type WindowResizeHandler = (
  id: AppId,
  direction: WindowResizeDirection,
  event: ReactPointerEvent<HTMLDivElement>,
  rect: DOMRect,
) => void;

export type TerminalSubmitHandler = (event?: FormEvent) => void;
export type TerminalKeyHandler = (event: KeyboardEvent<HTMLInputElement>) => void;
