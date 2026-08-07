import { FileText } from "lucide-react";
import { coreStack, resumeFocus } from "../../data/resume";
import { InfoGroup } from "../apps/AppChrome";

export function MobileResumeSummary({
  onOpenCvOptions,
}: {
  onOpenCvOptions: () => void;
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-[#1f7a4a]/25 bg-[#1f7a4a]/12 p-4">
        <p className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-emerald-100/65">
          recruiter snapshot
        </p>
        <h3 className="mt-2 text-2xl font-black text-emerald-50">
          Nicholas Nguyen
        </h3>
        <p className="mt-2 text-sm leading-6 text-white/75">
          Aspiring software engineer focused on robust, scalable software, cloud
          infrastructure, low-latency systems, and products that feel practical
          enough to ship.
        </p>
        <button
          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1f7a4a] px-4 py-2 text-sm font-black text-[#052416] transition hover:bg-[#2b9a60]"
          type="button"
          onClick={onOpenCvOptions}
        >
          <FileText size={17} aria-hidden="true" /> View or share CVs
        </button>
      </section>

      <InfoGroup title="Core stack" items={coreStack} />
      <InfoGroup title="Focus" items={resumeFocus} />
    </div>
  );
}
