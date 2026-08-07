import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const updatePreference = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);

    setPrefersReducedMotion(query.matches);
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}
