import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Maximize2, X } from "lucide-react";
import type {
  AppId,
  WindowDragHandler,
  WindowResizeDirection,
  WindowResizeHandler,
  WindowState,
} from "../../types";
import { windowMinimumSizes } from "../../data/profile";

const resizeHandles: Array<{
  className: string;
  direction: WindowResizeDirection;
}> = [
  { direction: "n", className: "left-3 right-3 top-0 h-2 cursor-n-resize" },
  { direction: "ne", className: "right-0 top-0 h-3 w-3 cursor-ne-resize" },
  { direction: "e", className: "bottom-3 right-0 top-3 w-2 cursor-e-resize" },
  { direction: "se", className: "bottom-0 right-0 h-3 w-3 cursor-se-resize" },
  { direction: "s", className: "bottom-0 left-3 right-3 h-2 cursor-s-resize" },
  { direction: "sw", className: "bottom-0 left-0 h-3 w-3 cursor-sw-resize" },
  { direction: "w", className: "bottom-3 left-0 top-3 w-2 cursor-w-resize" },
  { direction: "nw", className: "left-0 top-0 h-3 w-3 cursor-nw-resize" },
];

export function OSWindow({
  window,
  isActive,
  onClose,
  onFocus,
  onToggleMaximize,
  onStartDrag,
  onStartResize,
  children,
}: {
  window: WindowState;
  isActive: boolean;
  onClose: (id: AppId) => void;
  onFocus: (id: AppId) => void;
  onToggleMaximize: (id: AppId) => void;
  onStartDrag: WindowDragHandler;
  onStartResize: WindowResizeHandler;
  children: ReactNode;
}) {
  const articleRef = useRef<HTMLElement | null>(null);
  const titleId = `creator-os-window-title-${window.id}`;
  const dimensions: Record<AppId, string> = {
    profile: "lg:w-[500px] lg:h-[520px]",
    resume: "lg:w-[660px] lg:h-[620px]",
    projects: "lg:w-[560px] lg:h-[560px]",
    experience: "lg:w-[640px] lg:h-[440px]",
    education: "lg:w-[520px] lg:h-[360px]",
    certifications: "lg:w-[560px] lg:h-[420px]",
    terminal: "lg:w-[560px] lg:h-[430px]",
    contact: "lg:w-[460px] lg:h-[390px]",
  };
  const hasPosition = typeof window.x === "number" && typeof window.y === "number";
  const hasSize = typeof window.width === "number" && typeof window.height === "number";
  const minimumSize = windowMinimumSizes[window.id];
  const windowMode = window.maximized
    ? "fixed inset-0 mt-0 h-auto w-auto max-h-none max-w-none rounded-none"
    : hasPosition
      ? `relative mt-6 w-full lg:fixed lg:left-[var(--window-x)] lg:top-[var(--window-y)] lg:mt-0 lg:translate-x-0 lg:translate-y-0 ${hasSize ? "lg:h-[var(--window-height)] lg:w-[var(--window-width)]" : dimensions[window.id]} lg:min-h-[var(--window-min-height)] lg:min-w-[var(--window-min-width)] lg:max-h-[calc(100vh-7rem)] lg:max-w-[calc(100vw-2rem)]`
      : `relative mt-6 w-full lg:fixed lg:left-1/2 lg:top-1/2 lg:mt-0 lg:-translate-x-1/2 lg:-translate-y-1/2 ${hasSize ? "lg:h-[var(--window-height)] lg:w-[var(--window-width)]" : dimensions[window.id]} lg:min-h-[var(--window-min-height)] lg:min-w-[var(--window-min-width)] lg:max-h-[calc(100vh-7rem)] lg:max-w-[calc(100vw-2rem)]`;
  const windowStyle = {
    zIndex: window.maximized ? 80 + window.z : window.z,
    "--window-x": `${window.x ?? 0}px`,
    "--window-y": `${window.y ?? 0}px`,
    "--window-width": `${window.width ?? 0}px`,
    "--window-height": `${window.height ?? 0}px`,
    "--window-min-width": `${minimumSize.width}px`,
    "--window-min-height": `${minimumSize.height}px`,
  } as CSSProperties;
  const windowSurface = window.maximized
    ? "border-[#1f7a4a]/40 bg-[#06160e] shadow-2xl"
    : "border-[#1f7a4a]/35 bg-[#06160e]/95 shadow-window backdrop-blur-2xl";

  useEffect(() => {
    if (isActive) articleRef.current?.focus({ preventScroll: true });
  }, [isActive, window.animationKey]);

  return (
    // A desktop-style window is intentionally pointer-activated as one surface.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <article
      ref={articleRef}
      className={`flex flex-col overflow-hidden rounded-lg border focus:outline-none ${windowSurface} ${windowMode}`}
      style={windowStyle}
      data-window-mode={window.maximized ? "maximized" : hasPosition ? "positioned" : "floating"}
      onMouseDown={() => {
        articleRef.current?.focus({ preventScroll: true });
        onFocus(window.id);
      }}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      {!window.maximized &&
        resizeHandles.map((handle) => (
          <div
            aria-hidden="true"
            className={`absolute z-20 hidden touch-none lg:block ${handle.className}`}
            data-resize-direction={handle.direction}
            key={handle.direction}
            onPointerDown={(event) => {
              const article = articleRef.current;
              if (!article) return;
              onStartResize(
                window.id,
                handle.direction,
                event,
                article.getBoundingClientRect(),
              );
            }}
          />
        ))}
      <div
        className={`flex h-11 select-none items-center justify-between border-b border-[#1f7a4a]/25 bg-[#071d12] px-3 ${
          window.maximized ? "cursor-default" : "cursor-move"
        }`}
        onPointerDown={(event) => {
          if (window.maximized) return;
          const article = event.currentTarget.closest("article");
          if (!article) return;
          onStartDrag(window.id, event, article.getBoundingClientRect());
        }}
      >
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${window.accent}`} />
          <span id={titleId} className="text-sm font-bold text-[#eafff1]">{window.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="window-action"
            title={window.maximized ? "Restore" : "Maximize"}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onToggleMaximize(window.id)}
          >
            <Maximize2 size={14} />
          </button>
          <button
            className="window-action hover:bg-[#1f7a4a]/25"
            title="Close"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onClose(window.id)}
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
    </article>
  );
}
