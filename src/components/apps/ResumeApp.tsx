import {
  Award,
  BriefcaseBusiness,
  Download,
  Eye,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { Fragment } from "react";
import {
  certifications,
  educationItems,
  experienceItems,
} from "../../data/profile";
import { cvOptions } from "../../data/cv";
import { coreStack, resumeFocus } from "../../data/resume";
import { InfoGroup, SectionTitle } from "./AppChrome";

const links = [
  ["GitHub", "https://github.com/Nghi-creator"],
  ["LinkedIn", "https://www.linkedin.com/in/nicholas-nguyen-3bb17a335/"],
  ["Dev.to", "https://dev.to/nicholasthegreat"],
  ["Credly", "https://www.credly.com/users/nghi-nguy-n-gia/badges/credly"],
  ["Email", "mailto:gianghi30032005@gmail.com"],
];

export function ResumeApp() {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-[#1f7a4a]/25 bg-[#1f7a4a]/[0.12] p-4">
        <p className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-emerald-100/60">
          recruiter scan
        </p>
        <h2 className="mt-2 text-2xl font-black text-emerald-50">
          Nicholas Nguyen
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/[0.72]">
          Aspiring software engineer focused on robust, scalable software, cloud
          infrastructure, low-latency systems, and products that feel practical
          enough to ship.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {cvOptions.map((cv) => {
            const documentLabel =
              cv.id === "industry" ? "industry résumé" : "academic CV";

            return (
              <Fragment key={cv.id}>
                <a
                  className="inline-flex items-center gap-2 rounded-md border border-[#63c88e]/40 bg-[#1f7a4a]/15 px-3 py-2 text-xs font-black text-emerald-50 transition hover:bg-[#1f7a4a]/25"
                  href={cv.path}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Eye size={14} aria-hidden="true" /> View {documentLabel}
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-md bg-[#1f7a4a] px-3 py-2 text-xs font-black text-[#052416] transition hover:bg-[#2b9a60]"
                  href={cv.path}
                  download={cv.filename}
                >
                  <Download size={14} aria-hidden="true" /> Download{" "}
                  {documentLabel}
                </a>
              </Fragment>
            );
          })}
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <InfoGroup title="Core stack" items={coreStack} />
        <InfoGroup title="Focus" items={resumeFocus} />
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
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">
                {item.dates}
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/70">
              {item.summary}
            </p>
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
              <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">
                {item.dates}
              </p>
            </article>
          ))}
        </section>

        <section className="space-y-3 rounded-lg border border-white/10 bg-white/10 p-4">
          <SectionTitle icon={Award} title="Certifications" />
          <div className="space-y-2">
            {certifications.map((certification) => (
              <a
                key={certification.name}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm font-bold text-white/75 transition hover:bg-white/5 hover:text-emerald-100"
                href={certification.href}
                target="_blank"
                rel="noreferrer"
              >
                {certification.name}
                <ExternalLink className="shrink-0" size={13} />
              </a>
            ))}
          </div>
        </section>
      </div>

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
