import { skills } from "../../data/profile";
import type { SkillNode } from "../../types";

export function SkillsApp({
  selectedSkill,
  onSelectSkill,
}: {
  selectedSkill: SkillNode;
  onSelectSkill: (skill: SkillNode) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_210px]">
      <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-[#09111f]/80">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {skills.flatMap((skill) =>
            skill.linksTo.map((targetId) => {
              const target = skills.find((item) => item.id === targetId);
              if (!target) return null;
              return (
                <line
                  key={`${skill.id}-${target.id}`}
                  x1={skill.x}
                  y1={skill.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="0.35"
                />
              );
            }),
          )}
        </svg>
        {skills.map((skill) => {
          const Icon = skill.icon;
          return (
            <button
              key={skill.id}
              className={`absolute flex min-h-14 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-lg px-2 text-center text-xs font-black shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white ${
                selectedSkill.id === skill.id ? "ring-2 ring-white" : ""
              } ${skill.color}`}
              style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
              onClick={() => onSelectSkill(skill)}
            >
              <Icon size={17} />
              <span className="mt-1">{skill.label}</span>
            </button>
          );
        })}
      </div>
      <aside className="rounded-lg border border-white/10 bg-white/10 p-4">
        <h3 className="text-lg font-black">{selectedSkill.label}</h3>
        <p className="mt-2 text-sm leading-6 text-white/70">{selectedSkill.detail}</p>
        <div className="mt-4 space-y-2">
          {selectedSkill.tools.map((tool) => (
            <span
              key={tool}
              className="block rounded-md border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-white/75"
            >
              {tool}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}
