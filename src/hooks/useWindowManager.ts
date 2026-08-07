import { useCallback, useEffect, useMemo, useState } from "react";
import {
  appIdFromPath,
  appRoutes,
  createWindowState,
  defaultWindows,
  windowMinimumSizes,
} from "../data/profile";
import { safeStorageGet, safeStorageRemove, safeStorageSet } from "../lib/storage";
import type { AppId, WindowState } from "../types";

export const WINDOW_LAYOUT_STORAGE_KEY = "creator-os-window-layout-v1";
export const WINDOW_MARGIN = 8;
export const WINDOW_TOP_LIMIT = 42;
export const WINDOW_BOTTOM_LIMIT = 58;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function readStoredWindows(): WindowState[] {
  try {
    const storedLayout = safeStorageGet(WINDOW_LAYOUT_STORAGE_KEY);
    if (!storedLayout) return defaultWindows;

    const parsed = JSON.parse(storedLayout) as Partial<WindowState>[];
    if (!Array.isArray(parsed)) return defaultWindows;

    return defaultWindows.map((defaultWindow) => {
      const storedWindow = parsed.find((item) => item.id === defaultWindow.id);
      if (!storedWindow) return defaultWindow;

      const minimum = windowMinimumSizes[defaultWindow.id];
      const maxWidth = Math.max(320, window.innerWidth - WINDOW_MARGIN * 2);
      const maxHeight = Math.max(
        240,
        window.innerHeight - WINDOW_TOP_LIMIT - WINDOW_BOTTOM_LIMIT,
      );
      const minWidth = Math.min(minimum.width, maxWidth);
      const minHeight = Math.min(minimum.height, maxHeight);
      const width = isFiniteNumber(storedWindow.width)
        ? clamp(storedWindow.width, minWidth, maxWidth)
        : undefined;
      const height = isFiniteNumber(storedWindow.height)
        ? clamp(storedWindow.height, minHeight, maxHeight)
        : undefined;
      const positioningWidth = width ?? minWidth;
      const positioningHeight = height ?? minHeight;
      const hasStoredSize = width !== undefined && height !== undefined;
      const maxX = Math.max(
        WINDOW_MARGIN,
        window.innerWidth - positioningWidth - WINDOW_MARGIN,
      );
      const maxY = Math.max(
        WINDOW_TOP_LIMIT,
        window.innerHeight - positioningHeight - WINDOW_BOTTOM_LIMIT,
      );

      return {
        ...defaultWindow,
        open: defaultWindow.open,
        z: defaultWindow.z,
        maximized: false,
        animationKey: defaultWindow.animationKey,
        x:
          hasStoredSize && isFiniteNumber(storedWindow.x)
            ? clamp(storedWindow.x, WINDOW_MARGIN, maxX)
            : undefined,
        y:
          hasStoredSize && isFiniteNumber(storedWindow.y)
            ? clamp(storedWindow.y, WINDOW_TOP_LIMIT, maxY)
            : undefined,
        width,
        height,
      };
    });
  } catch {
    return defaultWindows;
  }
}

export function useWindowManager() {
  const [windows, setWindows] = useState(readStoredWindows);

  const activeWindowId = useMemo(
    () =>
      [...windows]
        .filter((item) => item.open)
        .sort((a, b) => b.z - a.z)[0]?.id ?? null,
    [windows],
  );

  useEffect(() => {
    const geometry = windows.map(({ id, x, y, width, height }) => ({
      id,
      x,
      y,
      width,
      height,
    }));
    safeStorageSet(WINDOW_LAYOUT_STORAGE_KEY, JSON.stringify(geometry));
  }, [windows]);

  const openWindow = useCallback((id: AppId) => {
    window.history.replaceState({}, "", `/${appRoutes[id]}`);
    setWindows((current) => {
      const nextZ = Math.max(...current.map((item) => item.z)) + 1;
      const hasWindow = current.some((item) => item.id === id);
      const syncedWindows = hasWindow
        ? current
        : [...current, createWindowState(id, nextZ)];

      return syncedWindows.map((item) =>
        item.id === id
          ? {
              ...item,
              open: true,
              z: nextZ,
              animationKey: item.animationKey + 1,
              x: item.open ? item.x : undefined,
              y: item.open ? item.y : undefined,
            }
          : item,
      );
    });
  }, []);

  const closeWindow = useCallback((id: AppId) => {
    setWindows((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, open: false, maximized: false }
          : item,
      ),
    );
    if (appIdFromPath(window.location.pathname) === id) {
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const closeAllWindows = useCallback(() => {
    setWindows((current) =>
      current.map((item) => ({ ...item, open: false, maximized: false })),
    );
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const resetWorkspace = useCallback(() => {
    safeStorageRemove(WINDOW_LAYOUT_STORAGE_KEY);
    setWindows(defaultWindows.map((item) => ({ ...item })));
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const focusWindow = useCallback((id: AppId) => {
    setWindows((current) => {
      const nextZ = Math.max(...current.map((item) => item.z)) + 1;
      return current.map((item) =>
        item.id === id ? { ...item, z: nextZ } : item,
      );
    });
  }, []);

  const toggleMaximize = useCallback((id: AppId) => {
    setWindows((current) => {
      const nextZ = Math.max(...current.map((item) => item.z)) + 1;
      return current.map((item) =>
        item.id === id
          ? {
              ...item,
              maximized: !item.maximized,
              z: nextZ,
              animationKey: item.animationKey + 1,
            }
          : item,
      );
    });
  }, []);

  useEffect(() => {
    const requestedApp = appIdFromPath(window.location.pathname);
    if (!requestedApp) return;

    openWindow(requestedApp);
    if (window.innerWidth < 1024) {
      window.setTimeout(
        () => document.getElementById(appRoutes[requestedApp])?.scrollIntoView(),
        0,
      );
    }
  }, [openWindow]);

  return {
    activeWindowId,
    closeAllWindows,
    closeWindow,
    focusWindow,
    openWindow,
    resetWorkspace,
    setWindows,
    toggleMaximize,
    windows,
  };
}
