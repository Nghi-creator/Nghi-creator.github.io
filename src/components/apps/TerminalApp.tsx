import { ChevronRight } from "lucide-react";
import type { TerminalKeyHandler, TerminalSubmitHandler } from "../../types";

export function TerminalApp({
  lines,
  input,
  onInput,
  onSubmit,
  onKeyDown,
}: {
  lines: string[];
  input: string;
  onInput: (value: string) => void;
  onSubmit: TerminalSubmitHandler;
  onKeyDown: TerminalKeyHandler;
}) {
  return (
    <form className="font-mono" onSubmit={onSubmit}>
      <div className="mb-4 min-h-64 rounded-lg border border-lime-300/20 bg-black/60 p-4 text-sm leading-6 text-lime-100">
        {lines.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
      <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2">
        <ChevronRight className="text-lime-300" size={18} />
        <input
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
          value={input}
          onChange={(event) => onInput(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="help"
          autoComplete="off"
        />
      </label>
    </form>
  );
}
