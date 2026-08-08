import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      center: campusCoordinates,
      zoom: 15,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

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
      map.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-56 w-full border-y border-white/10 bg-black/20"
      role="region"
      aria-label="Interactive map of VNUHCM University of Science Nguyen Van Cu campus"
    />
  );
}
