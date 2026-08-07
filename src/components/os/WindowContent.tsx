import { CertificationsApp } from "../apps/CertificationsApp";
import { ContactApp } from "../apps/ContactApp";
import { EducationApp } from "../apps/EducationApp";
import { ExperienceApp } from "../apps/ExperienceApp";
import { ProfileApp } from "../apps/ProfileApp";
import { ProjectsApp } from "../apps/ProjectsApp";
import { ResumeApp } from "../apps/ResumeApp";
import { TerminalApp } from "../apps/TerminalApp";
import type { TerminalController } from "../../hooks/useTerminal";
import type { AppId } from "../../types";

export function WindowContent({
  id,
  terminal,
}: {
  id: AppId;
  terminal: TerminalController;
}) {
  switch (id) {
    case "profile":
      return <ProfileApp />;
    case "resume":
      return <ResumeApp />;
    case "projects":
      return <ProjectsApp />;
    case "experience":
      return <ExperienceApp />;
    case "education":
      return <EducationApp />;
    case "certifications":
      return <CertificationsApp />;
    case "terminal":
      return (
        <TerminalApp
          lines={terminal.lines}
          input={terminal.input}
          onInput={terminal.setInput}
          onSubmit={terminal.submit}
          onKeyDown={terminal.handleKeyDown}
        />
      );
    case "contact":
      return <ContactApp />;
  }
}
