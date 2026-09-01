import { ExternalLink } from "lucide-react";
import { projects } from "../../data/projects";

export function ProjectsApp() {
  return (
    <div className="space-y-5">
      {projects.map((project) => (
        <article
          key={project.name}
          className="overflow-hidden rounded-lg border border-white/10 bg-black/20"
        >
          {project.image ? (
            <div className="border-b border-white/10 bg-black/30 p-2 sm:p-3">
              <img
                className="mx-auto h-auto w-full max-w-5xl rounded-sm object-contain"
                src={project.image.src}
                alt={project.image.alt}
                width={1600}
                height={877}
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : null}

          <div className="p-4 sm:p-5">
            <p className="mb-2 text-xs font-semibold text-emerald-200/65">
              {project.category}
            </p>
            <h3 className="text-lg font-bold text-white">{project.name}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/[0.72]">
              {project.description}
            </p>

            <p className="mt-4 border-l-2 border-emerald-300/55 pl-3 text-sm leading-6 text-white/[0.68]">
              <span className="font-semibold text-white/85">
                Current status:{" "}
              </span>
              {project.status}
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(13rem,0.42fr)]">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                  Details
                </h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2.5">
                      <span className="mt-[0.65rem] h-1 w-1 shrink-0 rounded-full bg-emerald-300/70" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
                  Tools
                </h4>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  {project.stack.join(" · ")}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-4">
              {project.links.map(([label, href]) => (
                <a
                  key={`${project.name}-${label}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-100/80 transition hover:text-white"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {label}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
