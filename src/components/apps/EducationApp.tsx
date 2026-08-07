import { GraduationCap } from "lucide-react";
import { educationItems } from "../../data/profile";
import { SectionTitle } from "./AppChrome";

export function EducationApp() {
  return (
    <div className="space-y-4">
      <SectionTitle icon={GraduationCap} title="Education" />
      {educationItems.map((item) => (
        <article key={item.school} className="rounded-lg border border-white/10 bg-white/10 p-4">
          <h3 className="text-lg font-black">{item.school}</h3>
          <p className="mt-2 text-sm leading-6 text-white/75">{item.program}</p>
          <p className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.08em] text-white/60">
            {item.dates}
          </p>
        </article>
      ))}
      <div className="rounded-lg border border-[#1f7a4a]/25 bg-[#1f7a4a]/12 p-4">
        <p className="text-sm leading-6 text-emerald-50/80">
          Academic base for software engineering, system design, full-stack development,
          and cloud infrastructure work.
        </p>
      </div>
    </div>
  );
}
