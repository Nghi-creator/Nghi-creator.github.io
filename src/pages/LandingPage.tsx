import { useEffect, useState } from "react";

const introLine = "hi, i am nicholas nguyen, glad to meet you";
const bootLines = [
  "mounting /profile",
  "loading projects",
  "restoring workspace",
  "initializing CreatorOS",
];

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [typedText, setTypedText] = useState("");
  const [isDeletingIntro, setIsDeletingIntro] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [bootLineCount, setBootLineCount] = useState(0);

  useEffect(() => {
    const atFullText = typedText.length === introLine.length;
    const atEmptyText = typedText.length === 0;
    const delay =
      atFullText && !isDeletingIntro
        ? 1200
        : atEmptyText && isDeletingIntro
          ? 420
          : isDeletingIntro
            ? 34
            : 58;

    const timer = window.setTimeout(() => {
      if (atFullText && !isDeletingIntro) {
        setIsDeletingIntro(true);
        return;
      }

      if (atEmptyText && isDeletingIntro) {
        setIsDeletingIntro(false);
        return;
      }

      setTypedText((current) =>
        isDeletingIntro
          ? current.slice(0, -1)
          : introLine.slice(0, current.length + 1),
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [typedText, isDeletingIntro]);

  useEffect(() => {
    if (!isBooting) {
      return;
    }

    if (bootLineCount < bootLines.length) {
      const timer = window.setTimeout(
        () => setBootLineCount((current) => current + 1),
        bootLineCount === 0 ? 120 : 280,
      );

      return () => window.clearTimeout(timer);
    }

    const enterTimer = window.setTimeout(onEnter, 420);
    return () => window.clearTimeout(enterTimer);
  }, [bootLineCount, isBooting, onEnter]);

  function handleBoot() {
    if (isBooting) {
      return;
    }

    setBootLineCount(0);
    setIsBooting(true);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/2001_chimp_web.mp4"
        poster="/2001_chimp_poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.62),rgba(0,0,0,0.22)_38%,rgba(0,0,0,0.76))]" />
      <section className="relative z-10 flex min-h-screen flex-col items-center px-5 pt-14 text-center">
        <p className="min-h-[4.5rem] max-w-5xl font-mono text-2xl font-black leading-tight tracking-[0.02em] text-white sm:text-4xl lg:text-5xl">
          <span>{typedText}</span>
          <span className="typing-cursor ml-1 inline-block h-[1em] w-[0.08em] translate-y-[0.12em] bg-[#1f7a4a]" />
        </p>

        <button
          className="absolute top-[68%] inline-flex items-center justify-center rounded-md border border-[#9be7b3]/45 bg-[#0f4d2e] px-6 py-3 font-mono text-sm font-black uppercase tracking-[0.18em] text-[#eafff1] shadow-[0_18px_60px_rgba(5,36,22,0.58)] transition hover:-translate-y-0.5 hover:bg-[#1f7a4a] focus:outline-none focus:ring-2 focus:ring-[#9be7b3] focus:ring-offset-2 focus:ring-offset-black disabled:cursor-wait disabled:opacity-70"
          onClick={handleBoot}
          disabled={isBooting}
        >
          {isBooting ? "Booting..." : "Boot CreatorOS"}
        </button>
      </section>

      {isBooting ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/72 px-5 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-lg border border-[#1f7a4a]/45 bg-[#06160e]/95 p-5 text-left shadow-[0_24px_90px_rgba(0,0,0,0.65)]">
            <p className="font-mono text-xs font-black uppercase tracking-[0.26em] text-[#9be7b3]">
              CreatorOS boot sequence
            </p>
            <div className="mt-4 min-h-36 space-y-2 font-mono text-sm font-bold text-emerald-50/85 sm:text-base">
              {bootLines.slice(0, bootLineCount).map((line) => (
                <p key={line}>
                  <span className="text-[#4ade80]">&gt;</span> {line}
                </p>
              ))}
              {bootLineCount < bootLines.length ? (
                <p aria-label="boot command loading">
                  <span className="text-[#4ade80]">&gt;</span>{" "}
                  <span className="typing-cursor inline-block h-[1em] w-[0.55em] translate-y-[0.12em] bg-[#9be7b3]" />
                </p>
              ) : (
                <p className="text-[#9be7b3]">
                  <span className="text-[#4ade80]">&gt;</span> handoff complete
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
