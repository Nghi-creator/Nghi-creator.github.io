import { ExternalLink } from "lucide-react";
import { projects } from "../../data/profile";

export function ProjectsApp() {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <article key={project.name} className="rounded-lg border border-white/10 bg-white/10 p-4">
          {"screenshot" in project && project.screenshot ? (
            <img
              className="mx-auto mb-4 aspect-video w-full max-w-6xl rounded-md border border-white/10 bg-black/30 object-cover object-top"
              src={project.screenshot}
              alt={`${project.name} interface preview`}
              width={1600}
              height={877}
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-lg font-black">{project.name}</h3>
            <span className="rounded-md bg-amber-200 px-2 py-1 text-xs font-bold text-slate-950">
              {project.tag}
            </span>
          </div>
          <p className="mb-3 text-sm leading-6 text-white/70">{project.description}</p>
          {"researchStatus" in project && project.researchStatus ? (
            <p className="mb-4 rounded-md border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-xs font-bold leading-5 text-amber-100/80">
              {project.researchStatus}
            </p>
          ) : null}
          {"architecture" in project && project.architecture ? (
            <a
              className="mx-auto mb-4 block max-w-7xl overflow-hidden rounded-md border border-white/10 bg-black/30 transition hover:border-cyan-200/35"
              href={project.architecture}
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="aspect-[2.07/1] w-full object-contain"
                src={project.architecture}
                alt={project.architectureAlt}
                loading="lazy"
              />
              <span className="block border-t border-white/10 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/60">
                Baseline architecture · Open full size
              </span>
            </a>
          ) : null}
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
          <div className="mb-4 rounded-md border border-cyan-200/15 bg-cyan-200/5 p-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/60">
              Evidence
            </p>
            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-white/72">
              {project.evidence.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-cyan-200/65">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200/55">Stack</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.stack.map((item) => <span key={item} className="rounded bg-[#1f7a4a]/18 px-2 py-1 text-[11px] font-bold text-emerald-50">{item}</span>)}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200/55">Responsibilities</p>
              <p className="mt-2 text-xs leading-5 text-white/70">{project.responsibilities.join(" · ")}</p>
            </div>
          </div>
          <div className="mb-4 border-l-2 border-[#1f7a4a] pl-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200/55">Technical decision</p>
            <p className="mt-1 text-sm leading-6 text-white/72">{project.decision}</p>
          </div>
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
