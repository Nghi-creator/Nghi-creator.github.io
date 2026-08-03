import { useEffect, useState } from "react";

type NetworkInformation = { saveData?: boolean };

export function SpaceBackdrop({
  variant,
  className = "",
}: {
  variant: "landing" | "desktop";
  className?: string;
}) {
  const [playVideo, setPlayVideo] = useState(false);
  const media =
    variant === "landing"
      ? {
          src: "/welcome-space.webm",
          poster: "/welcome-space-poster.webp",
        }
      : {
          src: "/os-moon.webm",
          poster: "/os-moon-poster.webp",
        };

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const video = document.createElement("video");
    const supportsVp9WebM = video.canPlayType('video/webm; codecs="vp9"') !== "";

    setPlayVideo(supportsVp9WebM && !reducedMotion && !connection?.saveData);
  }, []);

  return (
    <div
      className={`space-backdrop space-backdrop--${variant} ${className}`}
      aria-hidden="true"
    >
      {playVideo ? (
        <video
          className="space-backdrop__media"
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
        >
          <source src={media.src} type='video/webm; codecs="vp9"' />
        </video>
      ) : (
        <img className="space-backdrop__media" src={media.poster} alt="" />
      )}
      <div className="space-backdrop__vignette" />
    </div>
  );
}
