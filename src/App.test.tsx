import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const VISITED_STORAGE_KEY = "creator-os-visited-v1";
const WINDOW_LAYOUT_STORAGE_KEY = "creator-os-window-layout-v1";

function setDesktopLayout(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

describe("CreatorOS routes and interactions", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, "", "/");
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1280 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 720 });
    setDesktopLayout(true);
  });

  it("preserves the cinematic welcome for a first-time visitor", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Boot CreatorOS" })).toBeInTheDocument();
  });

  it.each([
    ["/resume", "Resume"],
    ["/projects", "Projects"],
    ["/contact", "Contact"],
  ])("opens the %s route as an accessible window", async (path, title) => {
    window.history.replaceState({}, "", path);
    render(<App />);

    const appWindow = await screen.findByRole("dialog", { name: title });
    await waitFor(() => expect(appWindow).toHaveFocus());
  });

  it("uses exactly one main landmark in the mobile portfolio", () => {
    setDesktopLayout(false);
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    render(<App />);

    expect(screen.getAllByRole("main")).toHaveLength(1);
  });

  it("focuses an opened window", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    render(<App />);

    await user.click(screen.getByTitle("Open Resume"));
    const resumeWindow = screen.getByRole("dialog", { name: "Resume" });
    await waitFor(() => expect(resumeWindow).toHaveFocus());
  });

  it("keeps terminal commands functional through the desktop controller", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    render(<App />);

    await user.click(screen.getByTitle("Open Terminal"));
    await user.type(screen.getByPlaceholderText("help"), "frobnicate{Enter}");

    expect(screen.getByText("Unknown command: frobnicate")).toBeInTheDocument();
  });

  it("removes the Skill Map app from the desktop", () => {
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    render(<App />);

    expect(screen.queryByTitle("Open Skill Map")).not.toBeInTheDocument();
  });

  it("maximizes edge-to-edge and exposes every resize direction", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    const { container } = render(<App />);

    const profileWindow = screen.getByRole("dialog", { name: "Profile" });
    expect(
      profileWindow.querySelectorAll("[data-resize-direction]"),
    ).toHaveLength(8);

    await user.click(screen.getByTitle("Maximize"));
    expect(profileWindow).toHaveAttribute("data-window-mode", "maximized");
    expect(profileWindow).toHaveClass("inset-0");
    expect(
      profileWindow.querySelectorAll("[data-resize-direction]"),
    ).toHaveLength(0);
    expect(container.querySelector('[data-window-mode="maximized"]')).toBe(profileWindow);
  });

  it("starts with default windows instead of reopening the previous session", async () => {
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    window.localStorage.setItem(
      WINDOW_LAYOUT_STORAGE_KEY,
      JSON.stringify([
        { id: "profile", open: false, maximized: true },
        { id: "projects", open: true, maximized: true },
        { id: "contact", open: true },
      ]),
    );
    render(<App />);

    expect(screen.getByRole("dialog", { name: "Profile" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Projects" })).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Contact" })).not.toBeInTheDocument();

    await waitFor(() => {
      const savedLayout = JSON.parse(
        window.localStorage.getItem(WINDOW_LAYOUT_STORAGE_KEY) ?? "[]",
      ) as Array<Record<string, unknown>>;
      expect(savedLayout.every((item) => !("open" in item) && !("maximized" in item))).toBe(true);
    });
  });

  it("traps command-palette focus and restores the opener after closing", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    render(<App />);

    const opener = screen.getByTitle("Open Projects");
    opener.focus();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });

    const searchInput = await screen.findByPlaceholderText("Search apps or commands");
    await waitFor(() => expect(searchInput).toHaveFocus());

    const lastControl = screen.getByRole("button", { name: "Reset workspace" });
    lastControl.focus();
    await user.tab();
    expect(searchInput).toHaveFocus();

    await user.tab({ shift: true });
    expect(lastControl).toHaveFocus();

    fireEvent.keyDown(searchInput, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: /command palette/i })).not.toBeInTheDocument());
    expect(opener).toHaveFocus();
  });

  it("clamps finite persisted geometry and rejects non-finite stacking values", () => {
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    window.localStorage.setItem(
      WINDOW_LAYOUT_STORAGE_KEY,
      '[{"id":"profile","open":true,"z":1e309,"x":1000000000000,"y":1000000000000,"width":1000000000000,"height":1000000000000}]',
    );
    render(<App />);

    const profileWindow = screen.getByRole("dialog", { name: "Profile" });
    expect(profileWindow).toHaveStyle({ zIndex: "12" });
    expect(profileWindow.style.getPropertyValue("--window-x")).toBe("8px");
    expect(profileWindow.style.getPropertyValue("--window-y")).toBe("42px");
    expect(profileWindow.style.getPropertyValue("--window-width")).toBe("1264px");
    expect(profileWindow.style.getPropertyValue("--window-height")).toBe("620px");
  });
});
