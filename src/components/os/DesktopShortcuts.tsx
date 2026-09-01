import { appMeta, desktopApps } from "../../data/profile";
import type { AppId } from "../../types";

export function DesktopShortcuts({
  selectedApp,
  onSelect,
  onOpen,
}: {
  selectedApp: AppId | null;
  onSelect: (id: AppId) => void;
  onOpen: (id: AppId) => void;
}) {
  return (
    <nav className="grid w-full max-w-sm grid-cols-3 gap-x-5 gap-y-5 sm:max-w-none sm:grid-cols-6 lg:w-52 lg:grid-flow-col lg:grid-cols-[5.5rem_5.5rem] lg:grid-rows-6 lg:gap-x-3 lg:gap-y-2">
      {desktopApps.map((id) => {
        const Icon = appMeta[id].icon;
        const selected = selectedApp === id;
        return (
          <button
            key={id}
            className={`group flex min-h-20 flex-col items-center justify-start gap-1.5 rounded-xl p-1.5 text-center text-xs font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-white/50 lg:min-h-[74px] ${
              selected
                ? "bg-white/[0.16] ring-2 ring-white/45 shadow-[0_8px_26px_rgba(0,0,0,0.25)]"
                : "hover:bg-white/10"
            }`}
            onClick={() => {
              onSelect(id);
              onOpen(id);
            }}
            aria-pressed={selected}
            title={`Open ${appMeta[id].title}`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1f7a4a] text-[#052416] shadow-lg shadow-black/35 ring-1 ring-[#9be7b3] transition group-hover:-translate-y-0.5 lg:h-12 lg:w-12">
              <Icon size={23} />
            </span>
            <span
              className={`max-w-[5.5rem] rounded-md px-1.5 py-0.5 leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] ${
                selected ? "bg-[#0a64d8] shadow-sm" : "bg-transparent"
              }`}
            >
              {appMeta[id].title}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
