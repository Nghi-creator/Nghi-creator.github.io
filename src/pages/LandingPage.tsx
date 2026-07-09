import { useEffect, useState } from "react";

const introLine = "hi, i am nicholas nguyen, glad to meet you";

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [typedText, setTypedText] = useState("");
  const [isDeletingIntro, setIsDeletingIntro] = useState(false);

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

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/2001_chimp.mp4"
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
          className="absolute top-[68%] inline-flex items-center justify-center rounded-md border border-[#9be7b3]/45 bg-[#0f4d2e] px-6 py-3 font-mono text-sm font-black uppercase tracking-[0.18em] text-[#eafff1] shadow-[0_18px_60px_rgba(5,36,22,0.58)] transition hover:-translate-y-0.5 hover:bg-[#1f7a4a] focus:outline-none focus:ring-2 focus:ring-[#9be7b3] focus:ring-offset-2 focus:ring-offset-black"
          onClick={onEnter}
        >
          Boot Creator OS
        </button>
      </section>
    </main>
  );
}
