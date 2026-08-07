import { useCallback, useState } from "react";
import { SpaceBackdrop } from "../components/SpaceBackdrop";
import { MobilePortfolio } from "../components/mobile/MobilePortfolio";
import { CommandPalette } from "../components/os/CommandPalette";
import { DesktopShortcuts } from "../components/os/DesktopShortcuts";
import { OSWindow } from "../components/os/OSWindow";
import { Taskbar } from "../components/os/Taskbar";
import { TopBar } from "../components/os/TopBar";
import { WindowContent } from "../components/os/WindowContent";
import { useDesktopKeyboardShortcuts } from "../hooks/useDesktopKeyboardShortcuts";
import { useDesktopClock, useDesktopLayout } from "../hooks/useDesktopLayout";
import { useTerminal } from "../hooks/useTerminal";
import { useWindowInteractions } from "../hooks/useWindowInteractions";
import { useWindowManager } from "../hooks/useWindowManager";
import type { AppId } from "../types";

export function DesktopPage({ onBack }: { onBack: () => void }) {
  const isDesktop = useDesktopLayout();
  const now = useDesktopClock(isDesktop);
  const terminal = useTerminal();
  const {
    activeWindowId,
    closeAllWindows,
    closeWindow,
    focusWindow,
    openWindow,
    resetWorkspace,
    setWindows,
    toggleMaximize,
    windows,
  } = useWindowManager();
  const { startWindowDrag, startWindowResize } = useWindowInteractions({
    focusWindow,
    setWindows,
  });
  const [bouncingApp, setBouncingApp] = useState<AppId | null>(null);
  const [selectedDesktopApp, setSelectedDesktopApp] = useState<AppId | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const launchWindow = useCallback(
    (id: AppId) => {
      setBouncingApp(id);
      window.setTimeout(
        () => setBouncingApp((current) => (current === id ? null : current)),
        620,
      );
      openWindow(id);
    },
    [openWindow],
  );

  const handleResetWorkspace = useCallback(() => {
    resetWorkspace();
    setSelectedDesktopApp(null);
  }, [resetWorkspace]);

  useDesktopKeyboardShortcuts({
    closeWindow,
    commandPaletteOpen,
    launchWindow,
    selectedDesktopApp,
    setCommandPaletteOpen,
    windows,
  });

  if (!isDesktop) {
    return <MobilePortfolio onBack={onBack} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
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
          {windows.map((item) =>
            item.open ? (
              <OSWindow
                key={item.id}
                window={item}
                isActive={activeWindowId === item.id}
                onClose={closeWindow}
                onFocus={focusWindow}
                onToggleMaximize={toggleMaximize}
                onStartDrag={startWindowDrag}
                onStartResize={startWindowResize}
              >
                <WindowContent id={item.id} terminal={terminal} />
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
        onResetWorkspace={handleResetWorkspace}
      />
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenApp={launchWindow}
        onCloseAll={closeAllWindows}
        onResetWorkspace={handleResetWorkspace}
      />
    </main>
  );
}
