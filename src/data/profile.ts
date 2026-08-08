import {
  Award,
  BriefcaseBusiness,
  CircleUserRound,
  FileText,
  GraduationCap,
  Mail,
  TerminalSquare,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { ProjectFolderIcon } from "../components/icons/ProjectFolderIcon";
import type { AppId, WindowState } from "../types";

type AppIcon = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string }
>;

export const appMeta = {
  profile: { title: "Profile", accent: "bg-[#1f7a4a]", icon: CircleUserRound },
  resume: { title: "Resume", accent: "bg-[#1f7a4a]", icon: FileText },
  projects: {
    title: "Projects",
    accent: "bg-[#1f7a4a]",
    icon: ProjectFolderIcon,
  },
  experience: {
    title: "Experience",
    accent: "bg-[#1f7a4a]",
    icon: BriefcaseBusiness,
  },
  education: {
    title: "Education",
    accent: "bg-[#1f7a4a]",
    icon: GraduationCap,
  },
  certifications: {
    title: "Certifications",
    accent: "bg-[#1f7a4a]",
    icon: Award,
  },
  terminal: { title: "Terminal", accent: "bg-[#1f7a4a]", icon: TerminalSquare },
  contact: { title: "Contact", accent: "bg-[#1f7a4a]", icon: Mail },
} satisfies Record<AppId, { title: string; accent: string; icon: AppIcon }>;

export const desktopApps: AppId[] = [
  "profile",
  "resume",
  "education",
  "certifications",
  "experience",
  "projects",
  "contact",
  "terminal",
];

export const taskbarApps: AppId[] = [
  "projects",
  "resume",
  "contact",
  "profile",
  "experience",
  "education",
  "certifications",
  "terminal",
];

export const appRoutes: Record<AppId, string> = {
  profile: "profile",
  resume: "resume",
  projects: "projects",
  experience: "experience",
  education: "education",
  certifications: "certifications",
  terminal: "terminal",
  contact: "contact",
};

export function appIdFromPath(pathname: string): AppId | null {
  const route = pathname.replace(/^\/+|\/+$/g, "");
  return (
    (Object.entries(appRoutes).find(([, value]) => value === route)?.[0] as
      | AppId
      | undefined) ?? null
  );
}

export const windowMinimumSizes: Record<
  AppId,
  { width: number; height: number }
> = {
  profile: { width: 460, height: 420 },
  resume: { width: 620, height: 520 },
  projects: { width: 520, height: 460 },
  experience: { width: 600, height: 400 },
  education: { width: 480, height: 340 },
  certifications: { width: 520, height: 380 },
  terminal: { width: 520, height: 380 },
  contact: { width: 440, height: 360 },
};

export const defaultWindows: WindowState[] = [
  {
    id: "profile",
    title: appMeta.profile.title,
    accent: appMeta.profile.accent,
    open: true,
    z: 12,
    maximized: false,
    animationKey: 0,
  },
  {
    id: "resume",
    title: appMeta.resume.title,
    accent: appMeta.resume.accent,
    open: false,
    z: 12,
    maximized: false,
    animationKey: 0,
  },
  {
    id: "projects",
    title: appMeta.projects.title,
    accent: appMeta.projects.accent,
    open: false,
    z: 10,
    maximized: false,
    animationKey: 0,
  },
  {
    id: "experience",
    title: appMeta.experience.title,
    accent: appMeta.experience.accent,
    open: false,
    z: 7,
    maximized: false,
    animationKey: 0,
  },
  {
    id: "education",
    title: appMeta.education.title,
    accent: appMeta.education.accent,
    open: false,
    z: 7,
    maximized: false,
    animationKey: 0,
  },
  {
    id: "certifications",
    title: appMeta.certifications.title,
    accent: appMeta.certifications.accent,
    open: false,
    z: 7,
    maximized: false,
    animationKey: 0,
  },
  {
    id: "terminal",
    title: appMeta.terminal.title,
    accent: appMeta.terminal.accent,
    open: false,
    z: 7,
    maximized: false,
    animationKey: 0,
  },
  {
    id: "contact",
    title: appMeta.contact.title,
    accent: appMeta.contact.accent,
    open: false,
    z: 7,
    maximized: false,
    animationKey: 0,
  },
];

export function createWindowState(id: AppId, z: number): WindowState {
  return {
    id,
    title: appMeta[id].title,
    accent: appMeta[id].accent,
    open: false,
    z,
    maximized: false,
    animationKey: 0,
  };
}

export const projects = [
  {
    name: "PIXELATED Studio — Personal Edge Cloud",
    tag: "edge cloud gaming",
    description:
      "A working personal edge-cloud gaming platform that runs interactive workloads on a user-owned node and streams them to a lightweight browser client.",
    screenshot: "/pixelated-studio-preview.webp",
    architecture: "/edge-cloud-architecture.webp",
    architectureAlt: "Baseline personal edge cloud-gaming system architecture",
    researchStatus:
      "Thesis R&D: a cross-layer latency-fingerprinting engine is in development; evaluation results are not claimed yet.",
    evidence: [
      "4 deployable workspaces: React web client, Electron desktop orchestrator, Docker engine runtime, and Fastify hosted API",
      "End-to-end compute → stream → input path using Docker, GStreamer, WebRTC, Socket.IO, and browser input",
      "Current telemetry covers process health, CPU/memory, FPS, bitrate, jitter, packet loss, and connection state",
      "Hosted, LAN, security, API, web, desktop, and engine checks are represented in the repository test and release gates",
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
    responsibilities: [
      "Distributed systems architecture",
      "Desktop and container runtime",
      "WebRTC streaming and telemetry",
      "Hosted control plane",
    ],
    decision:
      "Keep compute and private workloads on a user-owned edge node while the hosted cloud handles identity, catalog metadata, and session policy.",
    challenge:
      "Turn an ordinary personal computer into a securely paired edge node for low-latency interactive workloads without requiring a datacenter GPU.",
    build:
      "A hosted control plane coordinates an Electron-managed Docker runtime; GStreamer captures and encodes the workload, WebRTC delivers media, and the browser returns keyboard or gamepad input.",
    outcome:
      "Delivered a functioning compute-stream-input research testbed. The next phase adds stage timing, bounded probes, fingerprint matching, and deadline-aware frame handling.",
    links: [
      [
        "Latest release",
        "https://github.com/Nghi-creator/Pixelated-Studio-Edition/releases/latest",
      ],
      ["Web app", "https://pixelated-studio-edition.vercel.app/"],
      ["Repo", "https://github.com/Nghi-creator/Pixelated-Studio-Edition"],
    ],
  },
  {
    name: "PIXELATED User Edition",
    tag: "user experience",
    description:
      "A user-facing companion web app focused on making the PIXELATED product experience accessible and direct.",
    evidence: [
      "3 playable systems in-browser: NES, Game Boy, and Game Boy Color",
      "3 versioned local save-state slots per game with import and export",
      "Personal ROM bytes remain in browser memory and are never uploaded by the User Edition",
      "Installable PWA with offline caching for static runtime assets",
    ],
    stack: ["TypeScript", "React", "Web APIs", "Vercel"],
    responsibilities: [
      "Frontend architecture",
      "User experience",
      "Deployment",
    ],
    decision:
      "Keep the delivery client separate from Studio Edition to reduce coupling between authoring and playback concerns.",
    challenge:
      "Turn studio-authored experiences into a direct, approachable interface for end users.",
    build:
      "A separate React application that keeps the user experience independent from creator tooling.",
    outcome:
      "Deployed as a live companion product with its own public codebase and release surface.",
    links: [
      ["Web app", "https://pixelated-user-edition.vercel.app/"],
      ["Repo", "https://github.com/Nghi-creator/Pixelated-User-Edition"],
    ],
  },
];

export const topSkills = [
  "Cloud & Platform Engineering",
  "Solution Architecture",
  "Full-Stack Development",
];

export const experienceItems = [
  {
    company: "TMA Solutions",
    role: "Full Stack Engineer Intern",
    dates: "June 2026 - August 2026",
    location: "Ho Chi Minh City, Vietnam",
    summary:
      "Contributing to an AI-driven web application for project managers in an Agile engineering environment.",
    bullets: [
      "Developing end-to-end features with the MERN stack: MongoDB, Express.js, React, and Node.js.",
      "Writing and optimizing SQL queries while working with NoSQL data for complex datasets.",
      "Building API test suites and participating in sprints, code reviews, and engineering collaboration.",
    ],
  },
];

export const educationItems = [
  {
    school: "VNUHCM - University of Science",
    program: "Bachelor's degree, Information Technology",
    dates: "September 2023 - May 2027",
  },
];

export const certifications = [
  {
    name: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    href: "https://www.credly.com/badges/578653c9-80bb-4751-9e67-0c372462e0f4/public_url",
    action: "View badge",
  },
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    href: "https://www.credly.com/earner/earned/badge/f0b74d5c-5531-47e2-89b1-2d2cee4252be",
    action: "View badge",
  },
  {
    name: "IELTS Academic",
    issuer: "British Council",
    href: "/IELTS_ETRF.pdf",
    action: "View certificate",
  },
];

export const terminalResponses: Record<string, string[]> = {
  help: ["Commands: whoami, resume, projects, skills, cloud, contact, clear"],
  whoami: [
    "Nicholas Nguyen",
    "Aspiring software engineer focused on robust, scalable software.",
    "Current obsession: latency, system design, software architecture, distributed systems, and cloud compute.",
  ],
  projects: [
    "PIXELATED Studio Edition",
    "PIXELATED User Edition",
    "Try: open the Projects window.",
  ],
  resume: [
    "Open the Resume app for a recruiter-friendly scan of experience, education, certifications, stack, and links.",
  ],
  skills: [
    "TypeScript, JavaScript, React, Java, Express.js, Fastify, Spring Boot, PostgreSQL, MySQL, MongoDB, AWS, GCP, Docker, Kubernetes, Helm, Terraform, GitHub Actions",
  ],
  cloud: [
    "Domain focus: cloud-native infrastructure, delivery automation, ultra-low latency, and raw cloud compute.",
  ],
  contact: [
    "Dev.to: dev.to/nicholasthegreat",
    "LinkedIn: https://www.linkedin.com/in/nicholas-nguyen-3bb17a335/",
    "Email: gianghi30032005@gmail.com",
  ],
};
