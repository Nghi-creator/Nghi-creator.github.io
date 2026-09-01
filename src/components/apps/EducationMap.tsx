import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useRef, useState } from "react";

const campusCoordinates: L.LatLngExpression = [10.76278, 106.68139];
const campusMarkerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

export function EducationMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tileUnavailable, setTileUnavailable] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      center: campusCoordinates,
      zoom: 15,
      scrollWheelZoom: false,
    });

    let loadedTileCount = 0;
    let failedTileCount = 0;
    const tileLayer = L.tileLayer(
      "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      },
    );
    tileLayer.on("loading", () => {
      loadedTileCount = 0;
      failedTileCount = 0;
      setTileUnavailable(false);
    });
    tileLayer.on("tileload", () => {
      loadedTileCount += 1;
    });
    tileLayer.on("tileerror", () => {
      failedTileCount += 1;
      if (loadedTileCount === 0) setTileUnavailable(true);
    });
    tileLayer.on("load", () => {
      setTileUnavailable(loadedTileCount === 0 && failedTileCount > 0);
    });
    tileLayer.addTo(map);

    L.marker(campusCoordinates, { icon: campusMarkerIcon })
      .addTo(map)
      .bindTooltip("VNUHCM University of Science", { direction: "top" });

    let resizeFrame = 0;
    const syncMapSize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        map.invalidateSize({ animate: false });
      });
    };
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(syncMapSize);

    resizeObserver?.observe(container);
    window.addEventListener("resize", syncMapSize);
    map.whenReady(syncMapSize);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncMapSize);
      window.cancelAnimationFrame(resizeFrame);
      tileLayer.off();
      map.remove();
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-56 w-full border-y border-white/10 bg-black/20"
        role="region"
        aria-label="Interactive map of VNUHCM University of Science Nguyen Van Cu campus"
      />
      {tileUnavailable ? (
        <div
          className="pointer-events-none absolute inset-0 z-[900] flex items-center justify-center border-y border-white/10 bg-[#06160e]/95 px-6 text-center"
          role="status"
          aria-live="polite"
        >
          <p className="max-w-sm text-sm font-bold leading-6 text-white/75">
            Map tiles are temporarily unavailable. Use the Google Maps button
            below to view the campus location.
          </p>
        </div>
      ) : null}
    </div>
  );
}
