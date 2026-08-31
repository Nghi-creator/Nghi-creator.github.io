export type PortfolioProject = {
  name: string;
  category: string;
  description: string;
  status: string;
  highlights: string[];
  stack: string[];
  links: [label: string, href: string][];
  image?: {
    src: string;
    alt: string;
  };
};

export const projects: PortfolioProject[] = [
  {
    name: "Latency Fingerprinting for Edge Cloud Gaming",
    category: "Undergraduate research · 2026–present",
    description:
      "My undergraduate thesis asks whether a system's response to a bounded change can help distinguish latency bottlenecks that look similar.",
    status:
      "The first working pipeline is complete. It processes telemetry from the PIXELATED engine, stores the results as context-compatible fingerprints, and returns either a match or an “unknown” status. The current evidence supports only an integration and repeatability check.",
    highlights: [
      "A Python command-line pipeline validates paired observation windows, calculates normalized response vectors, and reports why a candidate matched or was rejected.",
      "Run 001 was used as an unvalidated seed after correctly returning “unknown” against incompatible synthetic references. A separately captured run 002 matched that seed at 0.982 across 22 shared features.",
      "The implementation currently has 283 regression tests. The next stage will extend the controlled scenarios and compare fingerprinting with simpler diagnostic baselines.",
    ],
    stack: ["Python", "Pydantic", "pytest", "JSON Schema", "GitHub Actions"],
    links: [
      ["Repository", "https://github.com/Nghi-creator/latency_fingerprinting"],
      [
        "Research overview",
        "https://github.com/Nghi-creator/latency_fingerprinting/blob/main/docs/PROJECT_BUILD_AND_REVIEW_READINESS.md",
      ],
      ["Architecture", "/latency_architecture.webp"],
    ],
  },
  {
    name: "PIXELATED Studio",
    category: "Distributed systems · Active project",
    description:
      "A self-hosted edge cloud-gaming platform that turns a personal computer into the runtime for an interactive browser session. It also serves as the testbed for my thesis.",
    status:
      "The complete gameplay loop is working (the local engine runs the game and streams it to the browser, while keyboard or gamepad input is sent back to the engine). Packaged desktop releases are available. Research telemetry can be exported for fingerprinting experiments.",
    highlights: [
      "An Electron desktop app manages the Docker engine, while a React client and Fastify API handle pairing, catalog, identity, and session workflows.",
      "The runtime launches the workload, captures and encodes it with GStreamer, streams it through WebRTC, and routes keyboard or gamepad input back to the engine.",
      "The system records host, runtime, encoder, transport, and browser-visible measurements for controlled experiments.",
    ],
    stack: [
      "TypeScript",
      "React",
      "Electron",
      "Docker",
      "GStreamer",
      "WebRTC",
      "Fastify",
      "Supabase",
    ],
    links: [
      [
        "Latest release",
        "https://github.com/Nghi-creator/Pixelated-Studio-Edition/releases/latest",
      ],
      ["Web app", "https://pixelated-studio-edition.vercel.app/"],
      [
        "Repository",
        "https://github.com/Nghi-creator/Pixelated-Studio-Edition",
      ],
      ["Architecture", "/studio_architecture.webp"],
    ],
    image: {
      src: "/pixelated-studio-preview.webp",
      alt: "PIXELATED Studio application interface",
    },
  },
  {
    name: "PIXELATED User Edition",
    category: "Browser systems · Active project",
    description:
      "A separate browser-native client for the PIXELATED ecosystem. It shares the catalog, and community services with the Studio version, but runs supported games locally through WebAssembly instead of using the desktop engine or a WebRTC stream like Studio.",
    status:
      "NES, Game Boy, and Game Boy Color are playable in the browser. The application is deployed as an installable PWA and keeps personal game files on the user's device.",
    highlights: [
      "Libretro WebAssembly cores are loaded on demand for local browser play, so no Docker runtime or desktop application is required.",
      "Personal ROM bytes stay in browser memory and are never uploaded. Save states, control mappings, and optional measurements all remain in browser storage unless the user wants to export them.",
      "Each game supports three versioned save-state slots with import and export, while the shared backend provides accounts, catalog data, favorites, comments, and reactions.",
    ],
    stack: [
      "TypeScript",
      "React",
      "WebAssembly",
      "Libretro",
      "IndexedDB",
      "Supabase",
      "Vercel",
    ],
    links: [
      ["Web app", "https://pixelated-user-edition.vercel.app/"],
      ["Repository", "https://github.com/Nghi-creator/Pixelated-User-Edition"],
      ["Architecture", "/user_architecture.webp"],
    ],
  },
];
