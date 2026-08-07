import type { LucideIcon } from "lucide-react";

export function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-100">
      <Icon size={16} />
      {title}
    </div>
  );
}

export function InfoGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/10 p-3">
      <p className="mb-2 text-xs uppercase tracking-[0.12em] text-white/60">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md border border-[#1f7a4a]/30 bg-[#1f7a4a]/15 px-2 py-1 text-xs font-bold text-emerald-50"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
