import { FlaskConical } from "lucide-react";
import { researchThesis } from "../../data/profile";
import { SectionTitle } from "./AppChrome";

export function ResearchSummary() {
  return (
    <section className="space-y-3 rounded-lg border border-white/10 bg-white/10 p-4">
      <SectionTitle icon={FlaskConical} title="Undergraduate research thesis" />
      <h3 className="text-sm font-bold text-emerald-50">
        {researchThesis.title}
      </h3>
      <p className="text-sm leading-6 text-white/70">
        {researchThesis.question}
      </p>
      <p className="text-xs leading-5 text-white/60">
        Supervisor: {researchThesis.supervisor}
        <br />
        Expected completion:{" "}
        {researchThesis.completion.replace(" (expected)", "")}
      </p>
      <p className="text-sm leading-6 text-white/70">
        Built the PIXELATED streaming testbed and a Python engine for
        measurement validation, fingerprint and profile matching, and offline
        evaluation. Controlled evaluation of diagnosis and recovery benefits is
        being planned.
      </p>
    </section>
  );
}
