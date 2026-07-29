import {
  Award,
  Bot,
  BriefcaseBusiness,
  CircleUserRound,
  Code2,
  Cpu,
  Database,
  FileText,
  GraduationCap,
  Layers3,
  Mail,
  Network,
  ServerCog,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { ProjectFolderIcon } from "../components/icons/ProjectFolderIcon";
import type { AppId, SkillNode, WindowState } from "../types";

type AppIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

export const appMeta = {
  profile: { title: "Profile", accent: "bg-[#1f7a4a]", icon: CircleUserRound },
  resume: { title: "Resume", accent: "bg-[#1f7a4a]", icon: FileText },
  projects: { title: "Projects", accent: "bg-[#1f7a4a]", icon: ProjectFolderIcon },
  skills: { title: "Skill Map", accent: "bg-[#1f7a4a]", icon: Network },
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
} satisfies Record<
  AppId,
  { title: string; accent: string; icon: AppIcon }
>;

export const desktopApps: AppId[] = [
  "profile",
  "resume",
  "education",
  "certifications",
  "experience",
  "projects",
  "skills",
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
  "skills",
  "terminal",
];

export const appRoutes: Record<AppId, string> = {
  profile: "profile",
  resume: "resume",
  projects: "projects",
  skills: "skills",
  experience: "experience",
  education: "education",
  certifications: "certifications",
  terminal: "terminal",
  contact: "contact",
};

export function appIdFromPath(pathname: string): AppId | null {
  const route = pathname.replace(/^\/+|\/+$/g, "");
  return (Object.entries(appRoutes).find(([, value]) => value === route)?.[0] as AppId | undefined) ?? null;
}

export const windowMinimumSizes: Record<AppId, { width: number; height: number }> = {
  profile: { width: 460, height: 420 },
  resume: { width: 620, height: 520 },
  projects: { width: 520, height: 460 },
  skills: { width: 760, height: 520 },
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
    id: "skills",
    title: appMeta.skills.title,
    accent: appMeta.skills.accent,
    open: false,
    z: 11,
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
    name: "PIXELATED Studio Edition",
    tag: "creator tooling",
    description:
      "A studio-side web application for building and managing pixelated experiences with a production-minded workflow.",
    screenshot: "/pixelated-studio-preview.png",
    stack: ["TypeScript", "React", "Supabase", "Vercel"],
    responsibilities: ["Product architecture", "Full-stack implementation", "Release ownership"],
    decision: "Split creator tooling from the user-facing application so each surface can evolve around its own workflow.",
    challenge: "Give creators a focused workspace for configuring and managing PIXELATED experiences.",
    build: "A TypeScript and React studio interface backed by production-minded workflows and separate user-facing delivery.",
    outcome: "Released as a versioned product with a live web app and an actively maintained public repository.",
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
    screenshot: "/pixelated-user-preview.png",
    stack: ["TypeScript", "React", "Web APIs", "Vercel"],
    responsibilities: ["Frontend architecture", "User experience", "Deployment"],
    decision: "Keep the delivery client separate from Studio Edition to reduce coupling between authoring and playback concerns.",
    challenge: "Turn studio-authored experiences into a direct, approachable interface for end users.",
    build: "A separate React application that keeps the user experience independent from creator tooling.",
    outcome: "Deployed as a live companion product with its own public codebase and release surface.",
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
  "AWS Certified Solutions Architect - Associate",
  "AWS Certified Cloud Practitioner",
  "IELTS Academic",
];

export const skills: SkillNode[] = [
  {
    id: "center",
    label: "Nicholas",
    detail: "Aspiring software engineer building robust, scalable products.",
    x: 50,
    y: 50,
    color: "bg-white text-slate-950",
    icon: Sparkles,
    tools: ["systems taste", "product focus", "fast learner"],
    linksTo: ["frontend", "backend", "cloud", "data", "ai", "architecture"],
  },
  {
    id: "frontend",
    label: "Frontend",
    detail:
      "Interactive product interfaces with TypeScript, React, and focused UX.",
    x: 22,
    y: 28,
    color: "bg-cyan-300 text-slate-950",
    icon: Code2,
    tools: ["TypeScript", "React", "Tailwind"],
    linksTo: ["backend", "architecture"],
  },
  {
    id: "backend",
    label: "Backend",
    detail:
      "API design and service foundations with Java, Express.js, and scalable patterns.",
    x: 76,
    y: 31,
    color: "bg-emerald-300 text-slate-950",
    icon: ServerCog,
    tools: ["Java", "Express.js", "Node", "WebRTC"],
    linksTo: ["data", "cloud"],
  },
  {
    id: "data",
    label: "Data",
    detail:
      "Practical data persistence for products that need clean models and reliable access.",
    x: 24,
    y: 74,
    color: "bg-amber-300 text-slate-950",
    icon: Database,
    tools: ["PostgreSQL", "MySQL", "MongoDB", "Supabase"],
    linksTo: ["backend"],
  },
  {
    id: "cloud",
    label: "Cloud + Platform",
    detail:
      "Cloud-native infrastructure, delivery automation, and latency-sensitive systems for demanding workloads.",
    x: 80,
    y: 71,
    color: "bg-emerald-300 text-slate-950",
    icon: Cpu,
    tools: [
      "AWS",
      "GCP",
      "Docker",
      "Kubernetes",
      "Helm",
      "Terraform",
      "GitHub Actions",
    ],
    linksTo: ["architecture"],
  },
  {
    id: "architecture",
    label: "Architecture",
    detail:
      "System design, scale, reliability, and the boring choices that keep software alive.",
    x: 50,
    y: 18,
    color: "bg-violet-300 text-slate-950",
    icon: Layers3,
    tools: ["system design", "scalability", "latency"],
    linksTo: ["frontend", "backend", "cloud"],
  },
  {
    id: "ai",
    label: "AI + Tools",
    detail:
      "Exploring the intersection of artificial intelligence and developer tools.",
    x: 50,
    y: 84,
    color: "bg-lime-300 text-slate-950",
    icon: Bot,
    tools: ["automation", "experiments", "tooling"],
    linksTo: ["frontend", "data"],
  },
];

export const terminalResponses: Record<string, string[]> = {
  help: ["Commands: whoami, resume, projects, skills, cloud, contact, clear"],
  whoami: [
    "Nicholas Nguyen",
    "Aspiring software engineer focused on robust, scalable software.",
    "Current obsession: latency, cloud compute, and cloud gaming infrastructure.",
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
    "TypeScript, React, Java, Express.js, PostgreSQL, MySQL, MongoDB, AWS, GCP, Docker, Kubernetes, Helm, Terraform, GitHub Actions",
  ],
  cloud: [
    "Domain focus: cloud-native infrastructure, delivery automation, ultra-low latency, and raw cloud compute.",
  ],
  contact: [
    "Dev.to: dev.to/nicholasthegreat",
    "LinkedIn: Nicholas Nguyen",
    "Email: gianghi30032005@gmail.com",
  ],
};
