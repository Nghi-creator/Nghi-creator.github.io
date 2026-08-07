import { FormEvent, KeyboardEvent, useState } from "react";
import { terminalResponses } from "../data/profile";

export type TerminalController = ReturnType<typeof useTerminal>;

export function useTerminal() {
  const [lines, setLines] = useState<string[]>([
    "CreatorOS terminal ready.",
    "Type help to list commands.",
  ]);
  const [input, setInput] = useState("");

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command) return;

    if (command === "clear") {
      setLines(["CreatorOS terminal ready."]);
      setInput("");
      return;
    }

    const response = terminalResponses[command] ?? [
      `Unknown command: ${command}`,
      "Type help to see what this shell knows.",
    ];
    setLines((current) => [...current, `> ${command}`, ...response]);
    setInput("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") submit();
  }

  return {
    handleKeyDown,
    input,
    lines,
    setInput,
    submit,
  };
}
