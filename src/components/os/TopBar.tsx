import { ArrowLeft } from "lucide-react";

export function TopBar({ onBack }: { onBack: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1f7a4a]/30 bg-[#052416]/78 px-4 py-2 backdrop-blur-md">
      <div className="flex items-center justify-center font-mono text-sm font-bold tracking-[0.04em] text-white/90">
        Nicholas Nguyen
      </div>
      <button
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[#d8ffe5] transition hover:bg-[#1f7a4a]/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1f7a4a]"
        onClick={onBack}
        title="Back to welcome"
      >
        <ArrowLeft size={17} />
      </button>
    </header>
  );
}
