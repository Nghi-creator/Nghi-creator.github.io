import { Award } from "lucide-react";
import { certifications } from "../../data/profile";
import { SectionTitle } from "./AppChrome";

export function CertificationsApp() {
  return (
    <div className="space-y-4">
      <SectionTitle icon={Award} title="Certifications" />
      <div className="grid gap-3">
        {certifications.map((certification) => (
          <article
            key={certification}
            className="rounded-lg border border-[#1f7a4a]/25 bg-[#1f7a4a]/12 p-4"
          >
            <h3 className="text-sm font-black text-emerald-50">{certification}</h3>
          </article>
        ))}
      </div>
    </div>
  );
}
