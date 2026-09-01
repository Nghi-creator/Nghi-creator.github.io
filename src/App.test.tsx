import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const VISITED_STORAGE_KEY = "creator-os-visited-v1";
const WINDOW_LAYOUT_STORAGE_KEY = "creator-os-window-layout-v1";

function setDesktopLayout(matches: boolean, reducedMotion = false) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches:
        query === "(min-width: 1024px)"
          ? matches
          : query === "(prefers-reduced-motion: reduce)"
            ? reducedMotion
            : false,
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
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: undefined,
    });
    setDesktopLayout(true);
  });

  it("preserves the cinematic welcome for a first-time visitor", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Boot CreatorOS" })).toBeInTheDocument();
  });

  it("skips looping and timed boot motion when reduced motion is preferred", async () => {
    const user = userEvent.setup();
    setDesktopLayout(true, true);
    render(<App />);

    expect(
      screen.getByText("hi, i am nicholas nguyen, glad to meet you"),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Boot CreatorOS" }));

    expect(await screen.findByRole("dialog", { name: "Profile" })).toBeInTheDocument();
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
    expect(
      screen.getByRole("heading", { level: 2, name: "Selected projects" }),
    ).toBeInTheDocument();

    const resumeSection = document.getElementById("resume");
    const experienceSection = document.getElementById("experience");
    const educationSection = document.getElementById("education");
    const certificationsSection = document.getElementById("certifications");
    expect(resumeSection).not.toBeNull();
    expect(experienceSection).not.toBeNull();
    expect(educationSection).not.toBeNull();
    expect(certificationsSection).not.toBeNull();
    expect(
      within(resumeSection!).getByRole("button", { name: "View or share CVs" }),
    ).toBeInTheDocument();
    expect(within(resumeSection!).queryByText("TMA Solutions")).not.toBeInTheDocument();
    expect(
      within(resumeSection!).queryByText("VNUHCM - University of Science"),
    ).not.toBeInTheDocument();
    expect(
      within(resumeSection!).queryByText("AWS Certified Solutions Architect - Associate"),
    ).not.toBeInTheDocument();
    expect(within(experienceSection!).getByText("TMA Solutions")).toBeInTheDocument();
    expect(
      within(educationSection!).getByText("VNUHCM - University of Science"),
    ).toBeInTheDocument();
    expect(
      within(certificationsSection!).getByText(
        "AWS Certified Solutions Architect - Associate",
      ),
    ).toBeInTheDocument();
    expect(
      within(educationSection!).getByRole("link", { name: "Open in Google Maps" }),
    ).toBeInTheDocument();
    expect(
      within(educationSection!).queryByRole("region", { name: /Interactive map/i }),
    ).not.toBeInTheDocument();
  });

  it("embeds the school map in the desktop education app", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    render(<App />);

    await user.click(screen.getByTitle("Open Education"));

    expect(
      await screen.findByRole("region", { name: /Interactive map of VNUHCM/i }),
    ).toBeInTheDocument();
  });

  it("shows both mobile CVs with independent view and file-sharing actions", async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockResolvedValue(undefined);
    const canShare = vi.fn().mockReturnValue(true);
    const fetchResume = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(
        new Blob(["portfolio cv"], { type: "application/pdf" }),
      ),
    } as unknown as Response);
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: canShare,
    });
    setDesktopLayout(false);
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    render(<App />);

    const cvOptionsButton = screen.getByRole("button", { name: "Open CV options" });
    await user.click(cvOptionsButton);
    const cvDialog = screen.getByRole("dialog", { name: "Choose a CV" });
    expect(within(cvDialog).getByRole("link", { name: "View industry CV" })).toHaveAttribute(
      "href",
      "/NguyenGiaNghi_Industry_CV.pdf",
    );
    expect(within(cvDialog).getByRole("link", { name: "View academic CV" })).toHaveAttribute(
      "href",
      "/NguyenGiaNghi_Academic_CV.pdf",
    );
    await user.click(
      within(cvDialog).getByRole("button", { name: "Share or save industry CV" }),
    );

    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    const shareData = share.mock.calls[0][0] as { files?: File[] };
    expect(shareData.files?.[0]).toBeInstanceOf(File);
    expect(shareData.files?.[0].name).toBe("Nicholas_Nguyen_Industry_CV.pdf");
    fireEvent.keyDown(cvDialog, { key: "Escape" });
    await waitFor(() => expect(cvDialog).not.toBeInTheDocument());
    expect(cvOptionsButton).toHaveFocus();
    fetchResume.mockRestore();
  });

  it("falls back to a download when native mobile sharing is unavailable", async () => {
    const user = userEvent.setup();
    const clickDownload = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function captureDownload(this: HTMLAnchorElement) {
        expect(this.pathname).toBe("/NguyenGiaNghi_Academic_CV.pdf");
        expect(this.download).toBe("Nicholas_Nguyen_Academic_CV.pdf");
      });
    setDesktopLayout(false);
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Open CV options" }));
    await user.click(
      screen.getByRole("button", { name: "Share or save academic CV" }),
    );

    expect(clickDownload).toHaveBeenCalledTimes(1);
    clickDownload.mockRestore();
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
    expect(screen.getByRole("log", { name: "Terminal output" })).toHaveClass(
      "flex-1",
      "overflow-y-auto",
    );
    const commandInput = screen.getByRole("textbox", {
      name: "Terminal command",
    });
    await user.type(commandInput, "frobnicate{Enter}");

    expect(screen.getByText("Unknown command: frobnicate")).toBeInTheDocument();
  });

  it("uses valid project assets and shared CV configuration on desktop", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    render(<App />);

    await user.click(screen.getByTitle("Open Projects"));
    const projectsWindow = screen.getByRole("dialog", { name: "Projects" });
    const studioProject = within(projectsWindow)
      .getByRole("heading", { name: "PIXELATED Studio" })
      .closest("article");
    expect(studioProject).not.toBeNull();
    expect(
      within(studioProject!).getByRole("link", { name: "Architecture" }),
    ).toHaveAttribute("href", "/edge-cloud-architecture.webp");

    await user.click(screen.getByTitle("Open Resume"));
    const resumeWindow = screen.getByRole("dialog", { name: "Resume" });
    expect(
      within(resumeWindow).getByRole("link", {
        name: "View industry résumé",
      }),
    ).toHaveAttribute("href", "/NguyenGiaNghi_Industry_CV.pdf");
    expect(
      within(resumeWindow).getByRole("link", {
        name: "Download academic CV",
      }),
    ).toHaveAttribute("download", "Nicholas_Nguyen_Academic_CV.pdf");
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

  it("normalizes the route when closing all windows or resetting the workspace", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    render(<App />);

    await user.click(screen.getByTitle("Open Resume"));
    expect(window.location.pathname).toBe("/resume");
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    await user.click(screen.getByRole("button", { name: "Close all windows" }));
    expect(window.location.pathname).toBe("/");

    await user.click(screen.getByTitle("Open Projects"));
    expect(window.location.pathname).toBe("/projects");
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    await user.click(screen.getByRole("button", { name: "Reset workspace" }));
    expect(window.location.pathname).toBe("/");
    expect(screen.getByRole("dialog", { name: "Profile" })).toBeInTheDocument();
  });

  it("re-clamps positioned windows when the desktop viewport shrinks", async () => {
    window.localStorage.setItem(VISITED_STORAGE_KEY, "1");
    window.localStorage.setItem(
      WINDOW_LAYOUT_STORAGE_KEY,
      '[{"id":"profile","x":700,"y":250,"width":500,"height":420}]',
    );
    render(<App />);

    const profileWindow = screen.getByRole("dialog", { name: "Profile" });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 600 });
    fireEvent(window, new Event("resize"));

    await waitFor(() => {
      expect(profileWindow.style.getPropertyValue("--window-x")).toBe("516px");
      expect(profileWindow.style.getPropertyValue("--window-y")).toBe("122px");
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
