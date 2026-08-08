import { Building2, ExternalLink, GraduationCap, MapPin } from "lucide-react";
import { lazy, Suspense } from "react";
import { educationItems } from "../../data/profile";
import { useDesktopLayout } from "../../hooks/useDesktopLayout";
import { SectionTitle } from "./AppChrome";

const EducationMap = lazy(() =>
  import("./EducationMap").then((module) => ({ default: module.EducationMap })),
);

const campusAddress =
  "227 Nguyen Van Cu Street, Cho Quan Ward, Ho Chi Minh City";
const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=VNUHCM+University+of+Science+227+Nguyen+Van+Cu+Ho+Chi+Minh+City";
const schoolUrl = "https://en.hcmus.edu.vn/overview/";
const academicFocus = [
  "Software engineering",
  "System design",
  "Cloud infrastructure",
  "Full-stack development",
];

export function EducationApp() {
  const isDesktop = useDesktopLayout();

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

      <div className="education-layout grid gap-4">
        <section className="rounded-lg border border-[#1f7a4a]/25 bg-[#1f7a4a]/12 p-4">
          <div className="flex items-center gap-2 text-emerald-100">
            <Building2 size={17} aria-hidden="true" />
            <h3 className="font-mono text-xs font-black uppercase tracking-[0.12em]">
              About HCMUS
            </h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-emerald-50/80">
            A member of Viet Nam National University Ho Chi Minh City with more
            than 80 years of history in science education and research. Its
            academic community spans fundamental science, information
            technology, engineering, and applied research.
          </p>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white/55">
              Academic focus
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {academicFocus.map((focus) => (
                <span
                  key={focus}
                  className="rounded-md border border-[#1f7a4a]/30 bg-black/20 px-2 py-1 text-xs font-bold text-emerald-50"
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1f7a4a]/20 text-emerald-200">
                <MapPin size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white/55">
                  Nguyen Van Cu campus
                </p>
                <p className="mt-1 text-sm font-bold leading-5 text-white/85">
                  {campusAddress}
                </p>
              </div>
            </div>
          </div>

          {isDesktop ? (
            <Suspense
              fallback={
                <div
                  className="flex h-56 w-full items-center justify-center border-y border-white/10 bg-black/20 font-mono text-xs text-white/45"
                  aria-label="Loading campus map"
                >
                  Loading map…
                </div>
              }
            >
              <EducationMap />
            </Suspense>
          ) : null}

          <div className="flex flex-wrap gap-2 p-4">
            <a
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[#1f7a4a] px-3 py-2 text-xs font-black text-[#052416] transition hover:bg-[#2b9a60]"
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={15} aria-hidden="true" /> Open in Google Maps
            </a>
            <a
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs font-black text-white/80 transition hover:bg-white/10 hover:text-white"
              href={schoolUrl}
              target="_blank"
              rel="noreferrer"
            >
              School overview <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
