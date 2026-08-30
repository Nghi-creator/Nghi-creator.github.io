import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  NotebookText,
} from "lucide-react";

export function ContactApp() {
  const links = [
    ["GitHub", "https://github.com/Nghi-creator", Github],
    [
      "LinkedIn",
      "https://www.linkedin.com/in/nicholas-nguyen-3bb17a335/",
      Linkedin,
    ],
    ["Dev.to", "https://dev.to/nicholasthegreat", NotebookText],
    ["Email", "mailto:gianghi30032005@gmail.com", Mail],
  ] as const;

  return (
    <div className="space-y-3">
      <p className="text-sm leading-6 text-white/70">
        Best places to follow my work, read about my writing, or start a
        conversation with me.
      </p>
      {links.map(([label, href, Icon]) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10"
        >
          <span className="flex items-center gap-3">
            <Icon size={18} />
            {label}
          </span>
          <ExternalLink size={15} />
        </a>
      ))}
    </div>
  );
}
