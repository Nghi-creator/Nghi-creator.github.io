import { ExternalLink } from "lucide-react";
import { projects } from "../../data/profile";

export function ProjectsApp() {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <article key={project.name} className="rounded-lg border border-white/10 bg-white/10 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-lg font-black">{project.name}</h3>
            <span className="rounded-md bg-amber-200 px-2 py-1 text-xs font-bold text-slate-950">
              {project.tag}
            </span>
          </div>
          <p className="mb-3 text-sm leading-6 text-white/70">{project.description}</p>
          <dl className="mb-4 grid gap-2 text-sm">
            {[
              ["Problem", project.challenge],
              ["Build", project.build],
              ["Outcome", project.outcome],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/8 bg-black/20 p-3">
                <dt className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200/55">
                  {label}
                </dt>
                <dd className="mt-1 leading-6 text-white/72">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-2">
            {project.links.map(([label, href]) => (
              <a
                key={href}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold text-white/80 transition hover:bg-white/10"
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                {label}
                <ExternalLink size={13} />
              </a>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
