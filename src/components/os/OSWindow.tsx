import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Maximize2, X } from "lucide-react";
import type { AppId, WindowDragHandler, WindowResizeHandler, WindowState } from "../../types";

export function OSWindow({
  window,
  onClose,
  onFocus,
  onToggleMaximize,
  onStartDrag,
  onResize,
  children,
}: {
  window: WindowState;
  onClose: (id: AppId) => void;
  onFocus: (id: AppId) => void;
  onToggleMaximize: (id: AppId) => void;
  onStartDrag: WindowDragHandler;
  onResize: WindowResizeHandler;
  children: ReactNode;
}) {
  const articleRef = useRef<HTMLElement | null>(null);
  const dimensions: Record<AppId, string> = {
    profile: "lg:w-[500px] lg:h-[520px]",
    projects: "lg:w-[560px] lg:h-[560px]",
    skills: "lg:w-[760px] lg:h-[560px]",
    experience: "lg:w-[640px] lg:h-[440px]",
    education: "lg:w-[520px] lg:h-[360px]",
    certifications: "lg:w-[560px] lg:h-[420px]",
    terminal: "lg:w-[560px] lg:h-[430px]",
    contact: "lg:w-[460px] lg:h-[390px]",
  };
  const hasPosition = typeof window.x === "number" && typeof window.y === "number";
  const hasSize = typeof window.width === "number" && typeof window.height === "number";
  const windowMode = window.maximized
    ? "fixed inset-0 mt-0 w-auto max-w-none max-h-none rounded-none resize-none"
    : hasPosition
      ? `relative mt-6 w-full lg:fixed lg:left-[var(--window-x)] lg:top-[var(--window-y)] lg:mt-0 lg:translate-x-0 lg:translate-y-0 ${hasSize ? "lg:h-[var(--window-height)] lg:w-[var(--window-width)]" : dimensions[window.id]} lg:min-h-[320px] lg:min-w-[360px] lg:max-h-[calc(100vh-7rem)] lg:max-w-[calc(100vw-2rem)] lg:resize`
      : `relative mt-6 w-full lg:fixed lg:left-1/2 lg:top-1/2 lg:mt-0 lg:-translate-x-1/2 lg:-translate-y-1/2 ${hasSize ? "lg:h-[var(--window-height)] lg:w-[var(--window-width)]" : dimensions[window.id]} lg:min-h-[320px] lg:min-w-[360px] lg:max-h-[calc(100vh-7rem)] lg:max-w-[calc(100vw-2rem)] lg:resize`;
  const windowStyle = {
    zIndex: window.maximized ? 80 + window.z : window.z,
    "--window-x": `${window.x ?? 0}px`,
    "--window-y": `${window.y ?? 0}px`,
    "--window-width": `${window.width ?? 0}px`,
    "--window-height": `${window.height ?? 0}px`,
  } as CSSProperties;
  const windowSurface = window.maximized
    ? "border-[#1f7a4a]/40 bg-[#06160e] shadow-2xl"
    : "border-[#1f7a4a]/35 bg-[#06160e]/95 shadow-window backdrop-blur-2xl";

  useEffect(() => {
    const article = articleRef.current;
    if (!article || window.maximized) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry || globalThis.window.innerWidth < 1024) return;
      const { width, height } = entry.contentRect;
      onResize(window.id, { width, height });
    });

    observer.observe(article);
    return () => observer.disconnect();
  }, [onResize, window.id, window.maximized]);

  return (
    <article
      ref={articleRef}
      className={`window-pop flex flex-col overflow-hidden rounded-lg border ${windowSurface} ${windowMode}`}
      style={windowStyle}
      data-window-mode={window.maximized ? "maximized" : hasPosition ? "positioned" : "floating"}
      onMouseDown={() => onFocus(window.id)}
    >
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
          <span className="text-sm font-bold text-[#eafff1]">{window.title}</span>
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
