import { useEffect, useState } from "react";

type NetworkInformation = { saveData?: boolean };

export function MediaBackdrop({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className: string;
}) {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    setPlayVideo(!reducedMotion && !connection?.saveData);
  }, []);

  return playVideo ? (
    <video
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  ) : (
    <img className={className} src={poster} alt="" aria-hidden="true" />
  );
}
