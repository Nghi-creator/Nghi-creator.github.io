import type { LucideIcon } from "lucide-react";
import { Award, Building2, GraduationCap, Waves } from "lucide-react";
import { topSkills } from "../../data/profile";
import { InfoGroup } from "./AppChrome";

export function ProfileApp() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <img
          className="h-16 w-16 shrink-0 rounded-lg border border-[#9be7b3]/40 object-cover object-top shadow-lg shadow-black/30"
          src="/headshot.jpg"
          alt="Nicholas Nguyen"
        />
        <div>
          <h2 className="text-2xl font-black">Nicholas Nguyen</h2>
          <p className="text-sm leading-6 text-white/70">
            Aspiring software engineer building robust, scalable software.
          </p>
        </div>
      </div>
      <p className="text-sm leading-6 text-white/70">
        I love exploring and building software across the stack, from
        user-facing applications to the systems behind them. My current work
        focuses on self-hosted edge cloud gaming, latency-sensitive streaming,
        and practical methods for measuring and diagnosing system performance.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <InfoTile
          icon={Building2}
          label="Current role"
          value="SWE Intern @ TMA"
        />
        <InfoTile icon={GraduationCap} label="Education" value="HCMUS IT" />
        <InfoTile icon={Award} label="Certifications" value="2x AWS + IELTS" />
        <InfoTile icon={Waves} label="Obsession" value="Low latency" />
      </div>
      <InfoGroup title="Top Skills" items={topSkills} />
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/10 p-3">
      <Icon className="mb-2 text-cyan-200" size={18} />
      <p className="text-xs uppercase tracking-[0.12em] text-white/60">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-white/90">{value}</p>
    </div>
  );
}
