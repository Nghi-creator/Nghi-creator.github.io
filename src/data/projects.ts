import { researchThesis } from "./profile";

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
    description: researchThesis.question,
    status:
      "The research engine has grown from an initial fingerprint matcher into an offline workflow for measurement validation, stage-trace analysis, controlled-experiment inspection, profile matching, and study evaluation. ",
    highlights: [
      "Versioned metric contracts validate raw gauges and counters, while host and browser traces reconstruct timing within compatible clocks and frame lifetimes.",
      "Experiment inspection checks recorded effects and cleanup. Calibration tracks source groups and training/test splits before fitting robust profiles and evaluating held-out matches.",
      "Passive replay helps detect sustained degradation and proposes bounded probes offline. Study reports retain failed and unavailable runs.",
      "The original repeatability check returned 0.982 similarity across 22 shared features.",
    ],
    stack: ["Python", "Pydantic", "pytest", "JSON Schema", "GitHub Actions"],
    links: [
      ["Repository", "https://github.com/Nghi-creator/latency_fingerprinting"],
      [
        "Research overview",
        "https://github.com/Nghi-creator/latency_fingerprinting/blob/main/docs/README.md",
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
      "The complete gameplay loop is working (the local engine runs the game and streams it to the browser, while keyboard or gamepad input is sent back to the engine). Packaged desktop releases are available. Opt-in research tooling exports telemetry, host and browser stage traces, and experiment records for offline analysis.",
    highlights: [
      "An Electron desktop app manages the Docker engine, while a React client and Fastify API handle pairing, catalog, identity, and session workflows.",
      "The runtime launches the workload, captures and encodes it with GStreamer, streams it through WebRTC, and routes keyboard or gamepad input back to the engine.",
      "Opt-in host and browser instrumentation and a bounded scenario harness record cross-layer measurements, experiment phases, and cleanup outcomes for controlled studies.",
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
      ["Architecture", "/edge-cloud-architecture.webp"],
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
      "Browser instrumentation exports launch-time, frame-pacing, long-task, capability, memory, and error telemetry as a local-execution baseline for comparison with Studio streaming.",
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
