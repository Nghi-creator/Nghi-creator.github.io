import { Eye, Share2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cvOptions, type CvId, type CvOption } from "../../data/cv";

export function CvOptionsSheet({
  onClose,
  onShare,
  sharingCvId,
}: {
  onClose: () => void;
  onShare: (cv: CvOption) => Promise<void>;
  sharingCvId: CvId | null;
}) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end bg-black/70 px-3 pb-3 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      {/* The dialog handles Escape and Tab at its boundary for focus containment. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <section
        ref={dialogRef}
        className="w-full rounded-xl border border-[#1f7a4a]/45 bg-[#06160e] p-4 shadow-[0_-24px_80px_rgba(0,0,0,0.55)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-cv-options-title"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
            return;
          }

          if (event.key !== "Tab") return;
          const focusable = Array.from(
            dialogRef.current?.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled])',
            ) ?? [],
          );
          if (!focusable.length) return;

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
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200/65">
              Documents
            </p>
            <h2
              id="mobile-cv-options-title"
              className="mt-1 text-lg font-black text-emerald-50"
            >
              Choose a CV
            </h2>
          </div>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/15 text-white/75 transition hover:bg-white/10 hover:text-white"
            type="button"
            onClick={onClose}
            aria-label="Close CV options"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3">
          {cvOptions.map((cv) => {
            const label = `${cv.id} CV`;
            const isSharing = sharingCvId === cv.id;

            return (
              <article
                key={cv.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <h3 className="font-black text-white">{cv.title}</h3>
                <p className="mt-1 text-sm leading-5 text-white/65">
                  {cv.description}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    className="flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#63c88e]/40 bg-[#1f7a4a]/15 px-3 py-2 text-xs font-black text-emerald-50 transition hover:bg-[#1f7a4a]/25"
                    href={cv.path}
                    target="_blank"
                    rel="noreferrer"
                    onClick={onClose}
                    aria-label={`View ${label}`}
                  >
                    <Eye size={16} aria-hidden="true" /> View
                  </a>
                  <button
                    className="flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#1f7a4a] px-3 py-2 text-xs font-black text-[#052416] transition hover:bg-[#2b9a60] disabled:cursor-wait disabled:opacity-65"
                    type="button"
                    onClick={() => onShare(cv)}
                    disabled={sharingCvId !== null}
                    aria-label={
                      isSharing ? `Preparing ${label}` : `Share or save ${label}`
                    }
                    aria-busy={isSharing}
                  >
                    <Share2 size={16} aria-hidden="true" />
                    {isSharing ? "Preparing…" : "Share / Save"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
