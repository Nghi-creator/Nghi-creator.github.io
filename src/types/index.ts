import type { FormEvent, KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { LucideIcon } from "lucide-react";

export type AppId =
  | "profile"
  | "projects"
  | "skills"
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

export type SkillNode = {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  color: string;
  icon: LucideIcon;
  tools: string[];
  linksTo: string[];
};

export type DragState = {
  id: AppId;
  offsetX: number;
  offsetY: number;
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
  size: { width: number; height: number },
) => void;

export type TerminalSubmitHandler = (event?: FormEvent) => void;
export type TerminalKeyHandler = (event: KeyboardEvent<HTMLInputElement>) => void;
