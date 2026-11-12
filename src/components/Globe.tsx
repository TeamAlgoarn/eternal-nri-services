"use client";

import { useEffect, useRef, useState } from "react";

type Point = [number, number];
type Ring = Point[];
type Topology = {
  transform: { scale: [number, number]; translate: [number, number] };
  arcs: number[][][];
  objects: { land: { type: string; arcs?: unknown; geometries?: Array<{ type: string; arcs?: unknown }> } };
};

const ORIGIN: Point = [77.5946, 12.9716];
const DESTINATIONS: Array<{ name: string; point: Point }> = [
  { name: "UAE", point: [55.2708, 25.2048] },
  { name: "UK", point: [-0.1276, 51.5072] },
  { name: "USA", point: [-74.006, 40.7128] },
  { name: "CANADA", point: [-79.3832, 43.6532] },
  { name: "SINGAPORE", point: [103.8198, 1.3521] },
  { name: "AUSTRALIA", point: [151.2093, -33.8688] },
];

const rad = Math.PI / 180;
const toVec = ([lon, lat]: Point): [number, number, number] => [
  Math.cos(lat * rad) * Math.cos(lon * rad),
  Math.cos(lat * rad) * Math.sin(lon * rad),
  Math.sin(lat * rad),
];
const toPoint = (v: [number, number, number]): Point => [
  Math.atan2(v[1], v[0]) / rad,
  Math.atan2(v[2], Math.hypot(v[0], v[1])) / rad,
];

function interpolate(a: Point, b: Point, t: number): Point {
  const av = toVec(a), bv = toVec(b);
  const angle = Math.acos(Math.max(-1, Math.min(1, av[0] * bv[0] + av[1] * bv[1] + av[2] * bv[2])));
  if (angle < 0.00001) return a;
  const sa = Math.sin((1 - t) * angle) / Math.sin(angle);
  const sb = Math.sin(t * angle) / Math.sin(angle);
  return toPoint([av[0] * sa + bv[0] * sb, av[1] * sa + bv[1] * sb, av[2] * sa + bv[2] * sb]);
}

// Decode Natural Earth land topology into lightweight, reusable longitude/latitude rings.
function decodeLand(topology: Topology): Ring[] {
  const { scale, translate } = topology.transform;
  const cache = new Map<number, Ring>();
  const arc = (id: number): Ring => {
    const idx = id < 0 ? ~id : id;
    if (!cache.has(idx)) {
      let x = 0, y = 0;
      cache.set(idx, topology.arcs[idx].map(([dx, dy]) => {
        x += dx; y += dy;
        return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
      }));
    }
    const points = cache.get(idx)!;
    return id < 0 ? [...points].reverse() : points;
  };
  const rings: Ring[] = [];
  function walk(type: string, arcs: unknown) {
    if (!Array.isArray(arcs)) return;
    if (type === "Polygon") {
      for (const ring of arcs as number[][]) rings.push(ring.flatMap((id, index) => {
        const part = arc(id);
        return index ? part.slice(1) : part;
      }));
    } else if (type === "MultiPolygon") {
      for (const polygon of arcs as number[][][]) walk("Polygon", polygon);
    }
  }
  const land = topology.objects.land;
  if (land.type === "GeometryCollection") {
    land.geometries?.forEach(g => walk(g.type, g.arcs));
  } else {
    walk(land.type, land.arcs);
  }
  return rings;
}

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let stopped = false;
    let land: Ring[] = [];
    let width = 460, height = 460;
    let last = 0, elapsed = 0;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isPaused = paused || motion.matches;
    const originLabel = "BENGALURU • HQ";

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      width = box.width || 460; height = box.height || 460;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const controller = new AbortController();
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json", { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error("Map unavailable"); return res.json(); })
      .then((topology: Topology) => { if (!stopped) land = decodeLand(topology); })
      .catch(() => { /* Graticule and global routes remain visible without remote map data. */ });

    const draw = (now: number) => {
      if (stopped) return;
      if (!last) last = now;
      const delta = Math.min(60, now - last);
      last = now;
      if (!isPaused && !document.hidden) elapsed += delta;
      const time = elapsed / 1000;
      const rotation = 77 + time * 1.45;
      const latitude = 15;
      const r = Math.min(width, height) * 0.405;
      const cx = width / 2, cy = height / 2;
      const project = (coord: Point): [number, number, boolean] => {
        const lon = (coord[0] - rotation) * rad;
        const lat = coord[1] * rad, tilt = latitude * rad;
        const facing = Math.cos(lat) * Math.cos(lon) * Math.cos(tilt) + Math.sin(lat) * Math.sin(tilt);
        return [
          cx + r * Math.cos(lat) * Math.sin(lon),
          cy - r * (Math.sin(lat) * Math.cos(tilt) - Math.cos(lat) * Math.cos(lon) * Math.sin(tilt)),
          facing >= 0,
        ];
      };

      ctx.clearRect(0, 0, width, height);
      const glow = ctx.createRadialGradient(cx, cy, r * .48, cx, cy, r * 1.18);
      glow.addColorStop(0, "rgba(210,175,110,0)");
      glow.addColorStop(.85, "rgba(210,175,110,.08)");
      glow.addColorStop(1, "rgba(210,175,110,0)");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(cx, cy, r * 1.18, 0, Math.PI * 2); ctx.fill();

      const ocean = ctx.createRadialGradient(cx - r * .35, cy - r * .4, 1, cx, cy, r);
      ocean.addColorStop(0, "#204966");
      ocean.addColorStop(.52, "#102d46");
      ocean.addColorStop(1, "#061625");
      ctx.fillStyle = ocean;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r - .5, 0, 2 * Math.PI); ctx.clip();

      const line = (points: Point[], color: string, lineWidth: number) => {
        ctx.beginPath();
        let active = false;
        for (const p of points) {
          const [x, y, visible] = project(p);
          if (!visible) { active = false; continue; }
          if (!active) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          active = true;
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      };

      for (let lat = -60; lat <= 60; lat += 30) {
        line(Array.from({ length: 181 }, (_, i): Point => [-180 + i * 2, lat]), "rgba(188,213,231,.13)", .7);
      }
      for (let lon = -180; lon < 180; lon += 30) {
        line(Array.from({ length: 91 }, (_, i): Point => [lon, -90 + i * 2]), "rgba(188,213,231,.11)", .7);
      }
      for (const ring of land) line(ring, "rgba(206,188,144,.64)", .95);

      const [ox, oy, originVisible] = project(ORIGIN);
      for (let i = 0; i < DESTINATIONS.length; i++) {
        const destination = DESTINATIONS[i];
        const route = Array.from({ length: 73 }, (_, k) => interpolate(ORIGIN, destination.point, k / 72));
        line(route, "rgba(233,197,126,.58)", 1.5);
        const [dx, dy, destinationVisible] = project(destination.point);
        if (destinationVisible) {
          ctx.beginPath(); ctx.arc(dx, dy, 3.4, 0, Math.PI * 2);
          ctx.fillStyle = "#f0d39b"; ctx.fill();
          ctx.fillStyle = "rgba(243,231,208,.92)";
          ctx.font = "600 10px Arial, sans-serif";
          ctx.textAlign = dx > cx ? "right" : "left";
          ctx.fillText(destination.name, dx + (dx > cx ? -9 : 9), dy - 9);
        }
        const progress = (time / 4.8 + i / DESTINATIONS.length) % 1;
        const [px, py, pulseVisible] = project(interpolate(ORIGIN, destination.point, progress));
        if (pulseVisible && !motion.matches) {
          ctx.beginPath(); ctx.arc(px, py, 2.7, 0, Math.PI * 2);
          ctx.shadowColor = "#f9d797"; ctx.shadowBlur = 12;
          ctx.fillStyle = "#fff4cc"; ctx.fill(); ctx.shadowBlur = 0;
        }
      }
      if (originVisible) {
        ctx.beginPath();ctx.arc(ox, oy, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = "#f3d49b"; ctx.shadowColor = "#f6cf8e"; ctx.shadowBlur = 18; ctx.fill();ctx.shadowBlur = 0;
        const pulse = motion.matches ? 12 : 10 + ((time * 13) % 23);
        ctx.strokeStyle = "rgba(247,211,150,.65)";ctx.lineWidth = 1.2;
        ctx.beginPath();ctx.arc(ox, oy, pulse, 0, Math.PI * 2);ctx.stroke();
        ctx.fillStyle = "#fff5de";ctx.textAlign = "center";ctx.font = "700 11px Arial, sans-serif";
        ctx.fillText(originLabel, ox, oy - 20);
      }
      ctx.restore();
      const vignette = ctx.createRadialGradient(cx - r * .25, cy - r * .3, r * .25, cx, cy, r);
      vignette.addColorStop(0, "rgba(0,0,0,0)");vignette.addColorStop(1, "rgba(2,9,18,.38)");
      ctx.fillStyle = vignette;ctx.beginPath();ctx.arc(cx, cy, r, 0, Math.PI * 2);ctx.fill();
      ctx.strokeStyle = "rgba(237,200,135,.43)";ctx.lineWidth = 1.6;
      ctx.beginPath();ctx.arc(cx, cy, r, 0, Math.PI * 2);ctx.stroke();
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    const onVisibility = () => { last = performance.now(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopped = true; cancelAnimationFrame(frame); controller.abort();
      observer.disconnect();document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused]);

  return (
    <div className="ens-global-globe" role="img" aria-label="Slowly rotating globe showing animated NRI service connections from Eternal NRI Services in Bengaluru to UAE, UK, USA, Canada, Singapore and Australia.">
      <div className="ens-global-orbit ens-global-orbit-a" aria-hidden="true" />
      <div className="ens-global-orbit ens-global-orbit-b" aria-hidden="true" />
      <canvas ref={canvasRef} className="ens-global-canvas" aria-hidden="true" />
      <button
        type="button"
        className="ens-global-toggle"
        aria-label={paused ? "Play globe animation" : "Pause globe animation"}
        onClick={() => setPaused(value => !value)}
      >{paused ? "▶ Play" : "Ⅱ Pause"}</button>
      <style jsx>{`
        .ens-global-globe{position:relative;isolation:isolate;width:min(100%,500px);aspect-ratio:1;margin:auto;display:grid;place-items:center;}
        .ens-global-canvas{width:100%;height:100%;display:block;position:relative;z-index:2}
        .ens-global-orbit{position:absolute;inset:10%;border:1px solid rgba(210,173,112,.24);border-radius:50%;transform:rotate(-28deg) scaleY(.52);pointer-events:none}
        .ens-global-orbit-a{animation:ens-spin 52s linear infinite}
        .ens-global-orbit-b{transform:rotate(52deg) scaleY(.64);animation:ens-spin-back 65s linear infinite}
        .ens-global-toggle{position:absolute;z-index:4;right:1%;top:3%;color:#e8d4ac;background:rgba(8,24,40,.7);border:1px solid rgba(214,181,120,.3);border-radius:99px;font-size:11px;padding:7px 12px;cursor:pointer}
        .ens-global-toggle:hover{background:rgba(35,58,76,.9)}
        @keyframes ens-spin{to{transform:rotate(332deg) scaleY(.52)}}
        @keyframes ens-spin-back{to{transform:rotate(-308deg) scaleY(.64)}}
        @media(prefers-reduced-motion:reduce){.ens-global-orbit{animation:none}}
      `}</style>
    </div>
  );
}
