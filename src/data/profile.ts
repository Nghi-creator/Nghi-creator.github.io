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

export const topSkills = [
  "Full-Stack Development",
  "Distributed and Cloud Systems",
  "Systems Performance Analysis",
];

export const profileSummary =
  "Final-year IT student at HCMUS building full-stack applications and distributed systems. My undergraduate thesis explores latency diagnosis for edge cloud gaming, supported by a self-hosted testbed and a Python research engine.";

export const researchThesis = {
  title:
    "Latency diagnosis and optimization mechanisms for edge cloud-gaming systems",
  supervisor: "Professor Le Ngoc Son",
  completion: "March 2027 (expected)",
  question:
    "Can a system's response to a relief action help distinguish cross-layer latency bottlenecks and guide more targeted recovery?",
};

export const experienceItems = [
  {
    company: "TMA Solutions",
    role: "Full-Stack Engineer Intern",
    dates: "June 2026 - August 2026",
    location: "Ho Chi Minh City, Vietnam",
    summary:
      "Completed a full-stack engineering internship on an AI-assisted project-management application.",
    bullets: [
      "Implemented bug fixes, product improvements, and small features with MongoDB, Express.js, React, and Node.js.",
      "Modeled and queried MongoDB data through Mongoose.",
      "Developed and validated API tests, contributing changes through an Agile/Scrum workflow.",
    ],
  },
];

export const educationItems = [
  {
    school: "VNUHCM - University of Science",
    program: "Bachelor of Science, Information Technology",
    dates: "September 2023 - May 2027 (expected)",
    standing: "GPA: 8.41/10.00 (3.61/4.00) · 133 credits completed",
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
    issuer: "IDP EDUCATION",
    href: "/IELTS_ETRF.pdf",
    action: "View certificate",
  },
];

export const terminalResponses: Record<string, string[]> = {
  help: [
    "Commands: whoami, resume, projects, research, skills, cloud, contact, clear",
  ],
  whoami: [
    "Nicholas Nguyen",
    profileSummary,
    "Current obsession: latency, system design, software architecture, distributed systems, and cloud compute.",
  ],
  projects: [
    "Latency Fingerprinting — Python research engine",
    "PIXELATED Studio Edition",
    "PIXELATED User Edition",
    "Try: open the Projects window.",
  ],
  research: [
    researchThesis.title,
    `Supervisor: ${researchThesis.supervisor}. Expected completion: ${researchThesis.completion}.`,
    "Implemented: measurement validation, stage-trace analysis, experiment inspection, robust profile matching, passive replay, and offline evaluation.",
  ],
  resume: [
    "Open the Resume app for a recruiter-friendly scan of experience, education, certifications, stack, and links.",
  ],
  skills: [
    "TypeScript, JavaScript, Java, Python, C, C++, React, Express.js, Fastify, Spring Boot, PostgreSQL, MySQL, MongoDB, AWS, GCP, Docker, Kubernetes, Helm, Terraform, GitHub Actions",
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
