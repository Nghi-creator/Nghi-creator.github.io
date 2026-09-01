import { ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
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
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [lines]);

  return (
    <form className="flex h-full min-h-0 flex-col font-mono" onSubmit={onSubmit}>
      <div
        ref={outputRef}
        className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-lime-300/20 bg-black/60 p-4 text-sm leading-6 text-lime-100"
        role="log"
        aria-label="Terminal output"
        aria-live="polite"
      >
        {lines.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
      <label className="mt-4 flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2">
        <span className="sr-only">Terminal command</span>
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
