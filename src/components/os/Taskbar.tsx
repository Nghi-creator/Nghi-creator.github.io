import { useEffect, useState } from "react";
import {
  BatteryFull,
  ChevronDown,
  ChevronUp,
  Mic,
  Moon,
  Sun,
  Volume2,
  Wifi,
  X,
} from "lucide-react";
import { appMeta, desktopApps } from "../../data/profile";
import type { AppId } from "../../types";

export function Taskbar({
  openWindow,
  now,
  bouncingApp,
}: {
  openWindow: (id: AppId) => void;
  now: Date;
  bouncingApp: AppId | null;
}) {
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString([], {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const isNight = now.getHours() >= 18 || now.getHours() < 6;
  const DayIcon = isNight ? Moon : Sun;
  const [systemPanelOpen, setSystemPanelOpen] = useState(false);
  const TrayChevron = systemPanelOpen ? ChevronUp : ChevronDown;

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 grid h-14 grid-cols-[1fr_auto_1fr] items-center overflow-visible border-t border-[#1f7a4a]/20 bg-white/90 px-3 text-[#052416] shadow-[0_-8px_28px_rgba(5,36,22,0.14)] backdrop-blur-xl">
      <div aria-hidden="true" />

      <nav className="flex max-w-full gap-1 overflow-visible">
        {desktopApps.map((id) => {
          const Icon = appMeta[id].icon;
          return (
            <button
              key={id}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f7a4a] text-[#052416] shadow-sm ring-1 ring-[#9be7b3] transition hover:-translate-y-0.5 hover:bg-[#2b9a60] focus:outline-none focus:ring-2 focus:ring-[#9be7b3] ${
                bouncingApp === id ? "dock-bounce" : ""
              }`}
              onClick={() => openWindow(id)}
              title={appMeta[id].title}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </nav>

      <div className="flex min-w-0 items-center justify-end gap-2 text-black">
        <div className="hidden items-center gap-1.5 text-zinc-700 sm:flex">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-700 transition hover:bg-black/10 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#1f7a4a]"
            onClick={() => setSystemPanelOpen((open) => !open)}
            title="Open CreatorOS message"
          >
            <TrayChevron size={14} />
          </button>
          <Wifi size={16} aria-hidden="true" />
          <Mic size={15} aria-hidden="true" />
          <Volume2 size={16} aria-hidden="true" />
          <BatteryFull size={17} aria-hidden="true" />
          <DayIcon size={16} aria-hidden="true" />
        </div>
        <div className="flex min-w-[76px] flex-col items-end leading-tight">
          <span className="font-mono text-xs font-black text-black">
            {time}
          </span>
          <span className="font-mono text-[10px] font-bold text-zinc-600">
            {date}
          </span>
        </div>
      </div>
      {systemPanelOpen && (
        <CreatorPanel now={now} onClose={() => setSystemPanelOpen(false)} />
      )}
    </footer>
  );
}

function CreatorPanel({ now, onClose }: { now: Date; onClose: () => void }) {
  const message = "hey there, welcome to my portfolio.";
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const statusItems = [
    ["mode", "builder"],
    ["role", "software engineer"],
  ];

  useEffect(() => {
    const atFullText = typedText.length === message.length;
    const atEmptyText = typedText.length === 0;
    const delay =
      atFullText && !isDeleting
        ? 1200
        : atEmptyText && isDeleting
          ? 420
          : isDeleting
            ? 34
            : 58;

    const timer = window.setTimeout(() => {
      if (atFullText && !isDeleting) {
        setIsDeleting(true);
        return;
      }

      if (atEmptyText && isDeleting) {
        setIsDeleting(false);
        return;
      }

      setTypedText((current) =>
        isDeleting
          ? current.slice(0, -1)
          : message.slice(0, current.length + 1),
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [typedText, isDeleting]);

  return (
    <aside className="absolute bottom-16 right-3 w-[min(24rem,calc(100vw-1.5rem))] rounded-lg border border-[#1f7a4a]/35 bg-[#06160e]/95 p-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200/70">
            mission control
          </p>
          <h2 className="font-mono text-sm font-black tracking-[0.08em] text-emerald-50">
            Nicholas Nguyen | CreatorOS
          </h2>
        </div>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md text-white/65 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1f7a4a]"
          onClick={onClose}
          title="Close"
        >
          <X size={14} />
        </button>
      </div>

      <p className="mb-4 min-h-6 rounded-md border border-white/10 bg-black/20 px-3 py-2 font-mono text-sm font-bold text-white/75">
        <span>{typedText}</span>
        <span className="typing-cursor ml-1 inline-block h-[1em] w-[0.08em] translate-y-[0.12em] bg-[#1f7a4a]" />
      </p>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {statusItems.map(([label, value]) => (
          <div
            key={label}
            className="rounded-md border border-white/10 bg-white/10 px-3 py-2"
          >
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white/35">
              {label}
            </p>
            <p className="mt-1 text-xs font-black text-emerald-50">{value}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
