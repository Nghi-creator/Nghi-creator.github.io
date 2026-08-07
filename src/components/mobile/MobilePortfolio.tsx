import { ArrowLeft, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import type { CvId, CvOption } from "../../data/cv";
import { shareCv } from "../../lib/shareCv";
import { CertificationsApp } from "../apps/CertificationsApp";
import { ContactApp } from "../apps/ContactApp";
import { EducationApp } from "../apps/EducationApp";
import { ExperienceApp } from "../apps/ExperienceApp";
import { ProfileApp } from "../apps/ProfileApp";
import { ProjectsApp } from "../apps/ProjectsApp";
import { CvOptionsSheet } from "./CvOptionsSheet";
import { MobileResumeSummary } from "./MobileResumeSummary";

const sections = [
  ["profile", "Profile"],
  ["resume", "Resume"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["education", "Education"],
  ["certifications", "Certifications"],
  ["contact", "Contact"],
] as const;

export function MobilePortfolio({ onBack }: { onBack: () => void }) {
  const [cvOptionsOpen, setCvOptionsOpen] = useState(false);
  const [sharingCvId, setSharingCvId] = useState<CvId | null>(null);

  useEffect(() => {
    const route = window.location.pathname.replace(/^\/+|\/+$/g, "");
    if (!sections.some(([id]) => id === route)) return;

    const timer = window.setTimeout(() => {
      document.getElementById(route)?.scrollIntoView({ block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleShareCv(cv: CvOption) {
    if (sharingCvId) return;

    setSharingCvId(cv.id);
    try {
      await shareCv(cv);
    } finally {
      setSharingCvId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#04110b] text-white lg:hidden">
      <header className="sticky top-0 z-40 border-b border-[#1f7a4a]/35 bg-[#052416]/95 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200/55">
              Nicholas Nguyen
            </p>
            <h1 className="text-base font-black text-emerald-50 sm:text-lg">
              Software Engineer
            </h1>
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              className="flex h-11 w-11 items-center justify-center rounded-md bg-[#1f7a4a] text-[#052416] transition hover:bg-[#2b9a60] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9be7b3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#052416]"
              type="button"
              onClick={() => setCvOptionsOpen(true)}
              aria-label="Open CV options"
              title="CV options"
            >
              <FileText size={18} aria-hidden="true" />
            </button>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-md border border-white/15 text-white/80 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9be7b3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#052416]"
              onClick={onBack}
              aria-label="Back to welcome"
              title="Back to welcome"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav
          className="mt-3 flex gap-1 overflow-x-auto pb-1"
          aria-label="Portfolio sections"
        >
          {sections.map(([id, label]) => (
            <a
              key={id}
              className="shrink-0 rounded-md px-3 py-2 text-xs font-black text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9be7b3]"
              href={`#${id}`}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      {cvOptionsOpen ? (
        <CvOptionsSheet
          sharingCvId={sharingCvId}
          onClose={() => setCvOptionsOpen(false)}
          onShare={handleShareCv}
        />
      ) : null}

      <main>
        <MobileSection id="profile" title="Profile">
          <ProfileApp />
        </MobileSection>
        <MobileSection id="resume" title="Recruiter view">
          <MobileResumeSummary onOpenCvOptions={() => setCvOptionsOpen(true)} />
        </MobileSection>
        <MobileSection id="projects" title="Selected projects">
          <ProjectsApp />
        </MobileSection>
        <MobileSection id="experience" title="Experience">
          <ExperienceApp />
        </MobileSection>
        <MobileSection id="education" title="Education">
          <EducationApp />
        </MobileSection>
        <MobileSection id="certifications" title="Certifications">
          <CertificationsApp />
        </MobileSection>
        <MobileSection id="contact" title="Contact">
          <ContactApp />
        </MobileSection>
      </main>
    </div>
  );
}

function MobileSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-b border-white/10 px-4 py-8"
    >
      <h2 className="mb-5 font-mono text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200/70">
        {title}
      </h2>
      {children}
    </section>
  );
}
