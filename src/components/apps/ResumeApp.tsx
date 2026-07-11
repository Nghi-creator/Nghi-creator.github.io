import { Award, BriefcaseBusiness, Download, ExternalLink, GraduationCap, Layers3 } from "lucide-react";
import {
  certifications,
  educationItems,
  experienceItems,
  projects,
  topSkills,
} from "../../data/profile";
import { InfoGroup, SectionTitle } from "./AppChrome";

const coreStack = [
  "TypeScript",
  "React",
  "Java",
  "Express.js",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "GCP",
  "Docker",
  "Terraform",
];

const links = [
  ["GitHub", "https://github.com/Nghi-creator"],
  ["LinkedIn", "https://www.linkedin.com/in/nicholas-nguyen-3bb17a335/"],
  ["Dev.to", "https://dev.to/nicholasthegreat"],
  ["Email", "mailto:gianghi30032005@gmail.com"],
];

export function ResumeApp() {
  const latestProject = projects[0];

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-[#1f7a4a]/25 bg-[#1f7a4a]/12 p-4">
        <p className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-emerald-100/60">
          recruiter scan
        </p>
        <h2 className="mt-2 text-2xl font-black text-emerald-50">
          Nicholas Nguyen
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/72">
          Aspiring software engineer focused on robust, scalable software,
          cloud infrastructure, low-latency systems, and products that feel
          practical enough to ship.
        </p>
        <a
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#1f7a4a] px-3 py-2 text-xs font-black text-[#052416] transition hover:bg-[#2b9a60]"
          href="/nicholas-nguyen-resume.pdf"
          download
        >
          <Download size={14} /> Download one-page resume
        </a>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <InfoGroup title="Core stack" items={coreStack} />
        <InfoGroup title="Focus" items={topSkills} />
      </div>

      <section className="space-y-3 rounded-lg border border-white/10 bg-white/10 p-4">
        <SectionTitle icon={BriefcaseBusiness} title="Experience" />
        {experienceItems.map((item) => (
          <article key={item.company}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-black">{item.role}</h3>
                <p className="text-sm font-bold text-emerald-100">
                  {item.company}
                </p>
              </div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white/45">
                {item.dates}
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/70">{item.summary}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <section className="space-y-3 rounded-lg border border-white/10 bg-white/10 p-4">
          <SectionTitle icon={GraduationCap} title="Education" />
          {educationItems.map((item) => (
            <article key={item.school}>
              <h3 className="text-sm font-black text-emerald-50">
                {item.school}
              </h3>
              <p className="mt-1 text-sm leading-6 text-white/70">
                {item.program}
              </p>
              <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white/45">
                {item.dates}
              </p>
            </article>
          ))}
        </section>

        <section className="space-y-3 rounded-lg border border-white/10 bg-white/10 p-4">
          <SectionTitle icon={Award} title="Certifications" />
          <div className="space-y-2">
            {certifications.map((certification) => (
              <p key={certification} className="text-sm font-bold text-white/75">
                {certification}
              </p>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-white/10 bg-white/10 p-4">
        <SectionTitle icon={Layers3} title="Current product" />
        <h3 className="mt-3 text-base font-black text-emerald-50">
          {latestProject.name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-white/70">
          {latestProject.description}
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        {links.map(([label, href]) => (
          <a
            key={href}
            className="inline-flex items-center gap-1 rounded-md border border-[#1f7a4a]/30 bg-[#1f7a4a]/15 px-3 py-2 text-xs font-black text-emerald-50 transition hover:bg-[#1f7a4a]/25"
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            {label}
            <ExternalLink size={13} />
          </a>
        ))}
      </div>
    </div>
  );
}
