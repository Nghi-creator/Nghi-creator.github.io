import { Award, BadgeCheck } from "lucide-react";
import { certifications } from "../../data/profile";
import { SectionTitle } from "./AppChrome";

export function CertificationsApp() {
  return (
    <div className="space-y-4">
      <SectionTitle icon={Award} title="Certifications" />
      <div className="grid gap-3 sm:grid-cols-2">
        {certifications.map((certification, index) => (
          <article
            key={certification}
            className={`group relative overflow-hidden rounded-lg border border-[#1f7a4a]/30 bg-[#1f7a4a]/12 p-4 transition hover:border-[#63c88e]/55 hover:bg-[#1f7a4a]/18 ${
              index === 0 ? "sm:col-span-2" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#63c88e]/45 bg-[#1f7a4a]/30 text-emerald-100">
                <BadgeCheck size={19} />
              </span>
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200/50">
                  {certification.startsWith("AWS")
                    ? "Amazon Web Services"
                    : "English proficiency"}
                </p>
                <h3 className="mt-1 text-sm font-black leading-5 text-emerald-50">
                  {certification}
                </h3>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
