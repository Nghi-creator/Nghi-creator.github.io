import {
  FormEvent,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";
import { CertificationsApp } from "../components/apps/CertificationsApp";
import { ContactApp } from "../components/apps/ContactApp";
import { EducationApp } from "../components/apps/EducationApp";
import { ExperienceApp } from "../components/apps/ExperienceApp";
import { ProfileApp } from "../components/apps/ProfileApp";
import { ProjectsApp } from "../components/apps/ProjectsApp";
import { SkillsApp } from "../components/apps/SkillsApp";
import { TerminalApp } from "../components/apps/TerminalApp";
import { DesktopShortcuts } from "../components/os/DesktopShortcuts";
import { OSWindow } from "../components/os/OSWindow";
import { Taskbar } from "../components/os/Taskbar";
import { TopBar } from "../components/os/TopBar";
import {
  createWindowState,
  defaultWindows,
  skills,
  terminalResponses,
} from "../data/profile";
import type { AppId, DragState, SkillNode, WindowState } from "../types";

const WINDOW_LAYOUT_STORAGE_KEY = "creator-os-window-layout-v1";

function readStoredWindows(): WindowState[] {
  try {
    const storedLayout = window.localStorage.getItem(WINDOW_LAYOUT_STORAGE_KEY);
    if (!storedLayout) return defaultWindows;

    const parsed = JSON.parse(storedLayout) as Partial<WindowState>[];
    if (!Array.isArray(parsed)) return defaultWindows;

    return defaultWindows.map((defaultWindow) => {
      const storedWindow = parsed.find((window) => window.id === defaultWindow.id);
      if (!storedWindow) return defaultWindow;

      return {
        ...defaultWindow,
        open: Boolean(storedWindow.open),
        z: typeof storedWindow.z === "number" ? storedWindow.z : defaultWindow.z,
        maximized: Boolean(storedWindow.maximized),
        animationKey:
          typeof storedWindow.animationKey === "number"
            ? storedWindow.animationKey
            : defaultWindow.animationKey,
        x: typeof storedWindow.x === "number" ? storedWindow.x : undefined,
        y: typeof storedWindow.y === "number" ? storedWindow.y : undefined,
        width: typeof storedWindow.width === "number" ? storedWindow.width : undefined,
        height: typeof storedWindow.height === "number" ? storedWindow.height : undefined,
      };
    });
  } catch {
    return defaultWindows;
  }
}

export function DesktopPage({ onBack }: { onBack: () => void }) {
  const [windows, setWindows] = useState(readStoredWindows);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(skills[0]);
  const [now, setNow] = useState(() => new Date());
  const [bouncingApp, setBouncingApp] = useState<AppId | null>(null);
  const [selectedDesktopApp, setSelectedDesktopApp] = useState<AppId | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "CreatorOS terminal ready.",
    "Type help to list commands.",
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const dragState = useRef<DragState | null>(null);

  const topZ = useMemo(() => Math.max(...windows.map((window) => window.z)), [windows]);
  const activeMobileWindow = useMemo(
    () =>
      windows
        .filter((window) => window.open)
        .sort((left, right) => right.z - left.z)[0] ?? null,
    [windows],
  );

  useEffect(() => {
    window.localStorage.setItem(WINDOW_LAYOUT_STORAGE_KEY, JSON.stringify(windows));
  }, [windows]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const drag = dragState.current;
      if (!drag) return;

      const margin = 8;
      const topLimit = 42;
      const bottomLimit = 58;
      const maxX = Math.max(margin, window.innerWidth - drag.width - margin);
      const maxY = Math.max(topLimit, window.innerHeight - drag.height - bottomLimit);
      const nextX = Math.min(Math.max(event.clientX - drag.offsetX, margin), maxX);
      const nextY = Math.min(Math.max(event.clientY - drag.offsetY, topLimit), maxY);

      setWindows((current) =>
        current.map((window) =>
          window.id === drag.id ? { ...window, x: nextX, y: nextY } : window,
        ),
      );
    }

    function handlePointerUp() {
      dragState.current = null;
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  function openWindow(id: AppId) {
    setWindows((current) => {
      const nextZ = Math.max(...current.map((window) => window.z), topZ) + 1;
      const hasWindow = current.some((window) => window.id === id);
      const syncedWindows = hasWindow ? current : [...current, createWindowState(id, nextZ)];

      return syncedWindows.map((window) =>
        window.id === id
          ? {
              ...window,
              open: true,
              z: nextZ,
              animationKey: window.animationKey + 1,
              x: window.open ? window.x : undefined,
              y: window.open ? window.y : undefined,
            }
          : window,
      );
    });
  }

  function launchWindow(id: AppId) {
    setBouncingApp(id);
    window.setTimeout(() => setBouncingApp((current) => (current === id ? null : current)), 620);
    openWindow(id);
  }

  function closeWindow(id: AppId) {
    setWindows((current) =>
      current.map((window) =>
        window.id === id
          ? { ...window, open: false, maximized: false }
          : window,
      ),
    );
  }

  function focusWindow(id: AppId) {
    setWindows((current) =>
      current.map((window) =>
        window.id === id ? { ...window, z: topZ + 1 } : window,
      ),
    );
  }

  function toggleMaximize(id: AppId) {
    setWindows((current) =>
      current.map((window) =>
        window.id === id
          ? {
              ...window,
              maximized: !window.maximized,
              z: topZ + 1,
              animationKey: window.animationKey + 1,
            }
          : window,
      ),
    );
  }

  function resizeWindow(id: AppId, size: { width: number; height: number }) {
    setWindows((current) =>
      current.map((window) => {
        if (window.id !== id || window.maximized) return window;
        const width = Math.round(size.width);
        const height = Math.round(size.height);
        const widthChanged = Math.abs((window.width ?? 0) - width) > 1;
        const heightChanged = Math.abs((window.height ?? 0) - height) > 1;

        return widthChanged || heightChanged ? { ...window, width, height } : window;
      }),
    );
  }

  function startWindowDrag(
    id: AppId,
    event: ReactPointerEvent<HTMLDivElement>,
    rect: DOMRect,
  ) {
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
      current.map((window) =>
        window.id === id ? { ...window, x: rect.left, y: rect.top } : window,
      ),
    );
  }

  function submitTerminal(event?: FormEvent) {
    event?.preventDefault();
    const command = terminalInput.trim().toLowerCase();
    if (!command) return;

    if (command === "clear") {
      setTerminalLines(["CreatorOS terminal ready."]);
      setTerminalInput("");
      return;
    }

    const response = terminalResponses[command] ?? [
      `Unknown command: ${command}`,
      "Type help to see what this shell knows.",
    ];
    setTerminalLines((lines) => [...lines, `> ${command}`, ...response]);
    setTerminalInput("");
  }

  function handleTerminalKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") submitTerminal();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <div className="relative min-h-screen bg-black">
        <div className="absolute inset-0 bg-black" />
        <video
          className="absolute inset-0 h-full w-full object-cover object-center opacity-95 [image-rendering:auto]"
          src="/2001_space.mp4"
          poster="/2001_space_poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(90deg,rgba(0,0,0,0.5),rgba(0,0,0,0.02)_46%,rgba(0,0,0,0.68))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.5))]" />

        <TopBar onBack={onBack} />

        <section className="relative min-h-screen w-full px-4 pb-20 pt-12 lg:px-6">
          <DesktopShortcuts
            selectedApp={selectedDesktopApp}
            onSelect={setSelectedDesktopApp}
            onOpen={launchWindow}
            onMobileOpen={launchWindow}
          />

          {activeMobileWindow ? (
            <MobileAppPanel
              window={activeMobileWindow}
              onClose={closeWindow}
              content={renderWindowContent(activeMobileWindow, {
                selectedSkill,
                setSelectedSkill,
                terminalLines,
                terminalInput,
                setTerminalInput,
                submitTerminal,
                handleTerminalKey,
              })}
            />
          ) : null}

          <div className="hidden lg:contents">
            {windows.map((window) =>
              window.open ? (
                <OSWindow
                  key={`${window.id}-${window.animationKey}`}
                  window={window}
                  onClose={closeWindow}
                  onFocus={focusWindow}
                  onToggleMaximize={toggleMaximize}
                  onStartDrag={startWindowDrag}
                  onResize={resizeWindow}
                >
                  {renderWindowContent(window, {
                    selectedSkill,
                    setSelectedSkill,
                    terminalLines,
                    terminalInput,
                    setTerminalInput,
                    submitTerminal,
                    handleTerminalKey,
                  })}
                </OSWindow>
              ) : null,
            )}
          </div>
        </section>

        <Taskbar openWindow={launchWindow} now={now} bouncingApp={bouncingApp} />
      </div>
    </main>
  );
}

function MobileAppPanel({
  window,
  onClose,
  content,
}: {
  window: WindowState;
  onClose: (id: AppId) => void;
  content: ReactNode;
}) {
  return (
    <article className="mt-6 flex max-h-[calc(100vh-16rem)] flex-col overflow-hidden rounded-lg border border-[#1f7a4a]/35 bg-[#06160e]/95 shadow-window backdrop-blur-2xl lg:hidden">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-[#1f7a4a]/25 bg-[#071d12] px-3">
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${window.accent}`} />
          <h2 className="text-sm font-bold text-[#eafff1]">{window.title}</h2>
        </div>
        <button
          className="window-action hover:bg-[#1f7a4a]/25"
          title="Close"
          onClick={() => onClose(window.id)}
        >
          <X size={14} />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-4">{content}</div>
    </article>
  );
}

function renderWindowContent(
  window: WindowState,
  state: {
    selectedSkill: SkillNode;
    setSelectedSkill: (skill: SkillNode) => void;
    terminalLines: string[];
    terminalInput: string;
    setTerminalInput: (value: string) => void;
    submitTerminal: (event?: FormEvent) => void;
    handleTerminalKey: (event: KeyboardEvent<HTMLInputElement>) => void;
  },
) {
  switch (window.id) {
    case "profile":
      return <ProfileApp />;
    case "projects":
      return <ProjectsApp />;
    case "skills":
      return <SkillsApp selectedSkill={state.selectedSkill} onSelectSkill={state.setSelectedSkill} />;
    case "experience":
      return <ExperienceApp />;
    case "education":
      return <EducationApp />;
    case "certifications":
      return <CertificationsApp />;
    case "terminal":
      return (
        <TerminalApp
          lines={state.terminalLines}
          input={state.terminalInput}
          onInput={state.setTerminalInput}
          onSubmit={state.submitTerminal}
          onKeyDown={state.handleTerminalKey}
        />
      );
    case "contact":
      return <ContactApp />;
    default:
      return null;
  }
}
