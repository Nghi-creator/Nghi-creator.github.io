import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { appMeta, desktopApps } from "../../data/profile";
import type { AppId } from "../../types";

export function CommandPalette({
  open,
  onClose,
  onOpenApp,
  onCloseAll,
  onResetWorkspace,
}: {
  open: boolean;
  onClose: () => void;
  onOpenApp: (id: AppId) => void;
  onCloseAll: () => void;
  onResetWorkspace: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const matches = useMemo(
    () =>
      desktopApps.filter((id) =>
        appMeta[id].title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQuery("");
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(focusTimer);
      previouslyFocusedRef.current?.focus({ preventScroll: true });
      previouslyFocusedRef.current = null;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/55 px-4 pt-[15vh] backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      {/* A dialog must handle keyboard events at its boundary to trap focus. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <section
        ref={dialogRef}
        className="w-full max-w-xl overflow-hidden rounded-lg border border-[#1f7a4a]/45 bg-[#06160e]/[0.98] shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
        role="dialog"
        aria-modal="true"
        aria-label="CreatorOS command palette"
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            onClose();
            return;
          }

          if (event.key !== "Tab") return;
          const focusable = Array.from(
            dialogRef.current?.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ) ?? [],
          ).filter((element) => element.getAttribute("aria-hidden") !== "true");
          if (!focusable.length) {
            event.preventDefault();
            dialogRef.current?.focus();
            return;
          }

          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <Search size={18} className="text-emerald-200/65" />
          <input
            ref={inputRef}
            aria-label="Search apps or commands"
            className="h-14 min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/55"
            placeholder="Search apps or commands"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && matches[0]) {
                onOpenApp(matches[0]);
                onClose();
              }
            }}
          />
          <button className="window-action" onClick={onClose} title="Close command palette">
            <X size={15} />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-auto p-2">
          {matches.map((id) => {
            const Icon = appMeta[id].icon;
            return (
              <button
                key={id}
                className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-bold text-white/80 transition hover:bg-[#1f7a4a]/[0.22] hover:text-white focus:bg-[#1f7a4a]/[0.22] focus:outline-none"
                onClick={() => {
                  onOpenApp(id);
                  onClose();
                }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f7a4a] text-[#052416] ring-1 ring-[#9be7b3]">
                  <Icon size={18} />
                </span>
                Open {appMeta[id].title}
              </button>
            );
          })}

          {!query ? (
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-2">
              <button
                className="rounded-md px-3 py-3 text-left text-xs font-black text-white/60 transition hover:bg-white/10 hover:text-white"
                onClick={() => {
                  onCloseAll();
                  onClose();
                }}
              >
                Close all windows
              </button>
              <button
                className="rounded-md px-3 py-3 text-left text-xs font-black text-white/60 transition hover:bg-white/10 hover:text-white"
                onClick={() => {
                  onResetWorkspace();
                  onClose();
                }}
              >
                Reset workspace
              </button>
            </div>
          ) : null}
        </div>
        <p className="border-t border-white/10 px-4 py-2 font-mono text-[10px] font-bold text-white/60">
          Enter to open · Esc to close · Cmd/Ctrl + K anywhere
        </p>
      </section>
    </div>
  );
}
