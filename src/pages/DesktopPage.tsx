import {
  FormEvent,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SpaceBackdrop } from "../components/SpaceBackdrop";
import { CertificationsApp } from "../components/apps/CertificationsApp";
import { ContactApp } from "../components/apps/ContactApp";
import { EducationApp } from "../components/apps/EducationApp";
import { ExperienceApp } from "../components/apps/ExperienceApp";
import { ProfileApp } from "../components/apps/ProfileApp";
import { ProjectsApp } from "../components/apps/ProjectsApp";
import { ResumeApp } from "../components/apps/ResumeApp";
import { SkillsApp } from "../components/apps/SkillsApp";
import { TerminalApp } from "../components/apps/TerminalApp";
import { DesktopShortcuts } from "../components/os/DesktopShortcuts";
import { CommandPalette } from "../components/os/CommandPalette";
import { OSWindow } from "../components/os/OSWindow";
import { Taskbar } from "../components/os/Taskbar";
import { TopBar } from "../components/os/TopBar";
import { MobilePortfolio } from "../components/mobile/MobilePortfolio";
import {
  appIdFromPath,
  appRoutes,
  createWindowState,
  defaultWindows,
  skills,
  terminalResponses,
  windowMinimumSizes,
} from "../data/profile";
import type { AppId, DragState, SkillNode, WindowState } from "../types";

const WINDOW_LAYOUT_STORAGE_KEY = "creator-os-window-layout-v1";

function useDesktopLayout() {
  const [isDesktop, setIsDesktop] = useState(() =>
    window.matchMedia("(min-width: 1024px)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const updateLayout = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    setIsDesktop(query.matches);
    query.addEventListener("change", updateLayout);
    return () => query.removeEventListener("change", updateLayout);
  }, []);

  return isDesktop;
}

function readStoredWindows(): WindowState[] {
  try {
    const storedLayout = window.localStorage.getItem(WINDOW_LAYOUT_STORAGE_KEY);
    if (!storedLayout) return defaultWindows;

    const parsed = JSON.parse(storedLayout) as Partial<WindowState>[];
    if (!Array.isArray(parsed)) return defaultWindows;

    return defaultWindows.map((defaultWindow) => {
      const storedWindow = parsed.find((window) => window.id === defaultWindow.id);
      if (!storedWindow) return defaultWindow;
      const minimum = windowMinimumSizes[defaultWindow.id];
      const storedWidth = typeof storedWindow.width === "number" ? storedWindow.width : undefined;
      const storedHeight = typeof storedWindow.height === "number" ? storedWindow.height : undefined;
      const invalidStoredSize =
        (storedWidth !== undefined && storedWidth < minimum.width) ||
        (storedHeight !== undefined && storedHeight < minimum.height);

      return {
        ...defaultWindow,
        open: Boolean(storedWindow.open),
        z: typeof storedWindow.z === "number" ? storedWindow.z : defaultWindow.z,
        maximized: Boolean(storedWindow.maximized),
        animationKey:
          typeof storedWindow.animationKey === "number"
            ? storedWindow.animationKey
            : defaultWindow.animationKey,
        x: !invalidStoredSize && typeof storedWindow.x === "number" ? storedWindow.x : undefined,
        y: !invalidStoredSize && typeof storedWindow.y === "number" ? storedWindow.y : undefined,
        width: storedWidth === undefined ? undefined : Math.max(storedWidth, minimum.width),
        height: storedHeight === undefined ? undefined : Math.max(storedHeight, minimum.height),
      };
    });
  } catch {
    return defaultWindows;
  }
}

export function DesktopPage({ onBack }: { onBack: () => void }) {
  const isDesktop = useDesktopLayout();
  const [windows, setWindows] = useState(readStoredWindows);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(skills[0]);
  const [now, setNow] = useState(() => new Date());
  const [bouncingApp, setBouncingApp] = useState<AppId | null>(null);
  const [selectedDesktopApp, setSelectedDesktopApp] = useState<AppId | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "CreatorOS terminal ready.",
    "Type help to list commands.",
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const dragState = useRef<DragState | null>(null);

  const topZ = useMemo(() => Math.max(...windows.map((window) => window.z)), [windows]);

  useEffect(() => {
    window.localStorage.setItem(WINDOW_LAYOUT_STORAGE_KEY, JSON.stringify(windows));
  }, [windows]);

  useEffect(() => {
    if (!isDesktop) return;
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, [isDesktop]);

  useEffect(() => {
    const requestedApp = appIdFromPath(window.location.pathname);
    if (requestedApp && defaultWindows.some((item) => item.id === requestedApp)) {
      openWindow(requestedApp);
      if (window.innerWidth < 1024) {
        window.setTimeout(() => document.getElementById(appRoutes[requestedApp])?.scrollIntoView(), 0);
      }
    }
    // The initial deep link is intentionally handled once on desktop boot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleKeyboard(event: globalThis.KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen((open) => !open);
        return;
      }

      if (event.key === "Escape") {
        if (commandPaletteOpen) {
          setCommandPaletteOpen(false);
          return;
        }
        const active = [...windows].filter((item) => item.open).sort((a, b) => b.z - a.z)[0];
        if (active) closeWindow(active.id);
      }

      if (!isTyping && event.key === "Enter" && selectedDesktopApp) {
        launchWindow(selectedDesktopApp);
      }
    }

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [commandPaletteOpen, selectedDesktopApp, windows]);

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
    window.history.replaceState({}, "", `/${appRoutes[id]}`);
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
    if (appIdFromPath(window.location.pathname) === id) {
      window.history.replaceState({}, "", "/");
    }
  }

  function closeAllWindows() {
    setWindows((current) =>
      current.map((item) => ({ ...item, open: false, maximized: false })),
    );
    window.history.replaceState({}, "", window.location.pathname);
  }

  function resetWorkspace() {
    window.localStorage.removeItem(WINDOW_LAYOUT_STORAGE_KEY);
    setWindows(defaultWindows.map((item) => ({ ...item })));
    setSelectedDesktopApp(null);
    window.history.replaceState({}, "", window.location.pathname);
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
        const minimum = windowMinimumSizes[id];
        const width = Math.max(minimum.width, Math.round(size.width));
        const height = Math.max(minimum.height, Math.round(size.height));
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
    <main className="min-h-screen bg-black text-white">
      {!isDesktop ? (
        <MobilePortfolio
          selectedSkill={selectedSkill}
          onSelectSkill={setSelectedSkill}
          onBack={onBack}
        />
      ) : (
      <div className="relative min-h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black" />
        <SpaceBackdrop variant="desktop" className="absolute inset-0 opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(90deg,rgba(0,0,0,0.5),rgba(0,0,0,0.02)_46%,rgba(0,0,0,0.68))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.5))]" />

        <TopBar onBack={onBack} />

        <section className="relative min-h-screen w-full px-4 pb-20 pt-12 lg:px-6">
          <DesktopShortcuts
            selectedApp={selectedDesktopApp}
            onSelect={setSelectedDesktopApp}
            onOpen={launchWindow}
          />

          <div className="hidden lg:contents">
            {windows.map((window) =>
              window.open ? (
                <OSWindow
                  key={window.id}
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

        <Taskbar
          openWindow={launchWindow}
          now={now}
          bouncingApp={bouncingApp}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          onCloseAll={closeAllWindows}
          onResetWorkspace={resetWorkspace}
        />
        <CommandPalette
          open={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onOpenApp={launchWindow}
          onCloseAll={closeAllWindows}
          onResetWorkspace={resetWorkspace}
        />
      </div>
      )}
    </main>
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
    case "resume":
      return <ResumeApp />;
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
