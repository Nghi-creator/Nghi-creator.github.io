import { useEffect } from "react";
import type { AppId, WindowState } from "../types";

export function useDesktopKeyboardShortcuts({
  closeWindow,
  commandPaletteOpen,
  launchWindow,
  selectedDesktopApp,
  setCommandPaletteOpen,
  windows,
}: {
  closeWindow: (id: AppId) => void;
  commandPaletteOpen: boolean;
  launchWindow: (id: AppId) => void;
  selectedDesktopApp: AppId | null;
  setCommandPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  windows: WindowState[];
}) {
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

        const active = [...windows]
          .filter((item) => item.open)
          .sort((a, b) => b.z - a.z)[0];
        if (active) closeWindow(active.id);
      }

      if (!isTyping && event.key === "Enter" && selectedDesktopApp) {
        launchWindow(selectedDesktopApp);
      }
    }

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [
    closeWindow,
    commandPaletteOpen,
    launchWindow,
    selectedDesktopApp,
    setCommandPaletteOpen,
    windows,
  ]);
}
