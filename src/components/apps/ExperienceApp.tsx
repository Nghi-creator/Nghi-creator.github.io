import { BriefcaseBusiness } from "lucide-react";
import { experienceItems } from "../../data/profile";
import { SectionTitle } from "./AppChrome";

export function ExperienceApp() {
  return (
    <div className="space-y-4">
      <SectionTitle icon={BriefcaseBusiness} title="Experience" />
      {experienceItems.map((item) => (
        <article key={item.company} className="rounded-lg border border-white/10 bg-white/10 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-black">{item.role}</h3>
              <p className="text-sm font-bold text-emerald-100">{item.company}</p>
            </div>
            <div className="text-right font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">
              <p>{item.dates}</p>
              <p>{item.location}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/70">{item.summary}</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-white/68">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1f7a4a]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
