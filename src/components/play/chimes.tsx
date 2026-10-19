"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { isSoundOn, pentatonic, playBell, primeAudio, subscribeSound } from "@/lib/sound";

type Chime = {
  x: number; // anchor
  cord: number; // length of cord above the tube
  tube: number; // length of the tube
  angle: number;
  velocity: number;
  lastRing: number;
};

const GRAVITY = 2400; // px/s², tuned so a chime swings about once a second
const DAMPING = 0.9; // per second
const TUBE_W = 13;

function crosses(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number) {
  // Where segment AB meets segment CD, as a fraction along CD, or null.
  const r = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
  if (Math.abs(r) < 1e-6) return null;
  const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / r;
  const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / r;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? u : null;
}

/**
 * Wind chimes hanging from the top of the page. Brush across them and they
 * swing and ring; longer tubes are lower notes. Each one is also a button.
 */
export function Chimes() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const [layout, setLayout] = useState<{ width: number; height: number; chimes: Omit<Chime, "angle" | "velocity" | "lastRing">[] } | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const soundOn = useSyncExternalStore(subscribeSound, isSoundOn, () => true);
  const sim = useRef({ chimes: [] as Chime[], raf: 0, last: 0, pointer: null as { x: number; y: number; t: number } | null, reduced: false });
  // Set up by the physics effect: start the loop, and ring a chime.
  const api = useRef<{ wake: () => void; ring: (index: number, strength: number) => void }>({ wake: () => {}, ring: () => {} });

  // Lay the chimes out to the width available.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    sim.current.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The box's height comes from CSS, so nothing moves when this runs; the tubes fit inside it.
    const measure = () => {
      const { width, height: box } = wrap.getBoundingClientRect();
      const count = width < 520 ? 7 : 9;
      const unit = Math.min(1, width / 880);
      const cordScale = Math.max(0.75, unit);
      const longest = Math.min(230 * Math.max(0.7, unit), box - 24 - 110 * cordScale);
      const chimes = Array.from({ length: count }, (_, i) => {
        const t = i / (count - 1);
        return {
          x: (width / (count + 1)) * (i + 1),
          cord: (96 + Math.sin(i * 1.7) * 14) * cordScale,
          tube: longest * (1 - t * 0.5),
        };
      });
      setLayout({ width, height: box, chimes });
      sim.current.chimes = chimes.map((c, i) => ({ ...c, angle: sim.current.chimes[i]?.angle ?? 0, velocity: 0, lastRing: 0 }));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    measure();
    return () => observer.disconnect();
  }, []);

  // Physics: each chime is a damped pendulum; neighbours knock into each other.
  useEffect(() => {
    if (!layout) return;
    const state = sim.current;

    const draw = () => {
      state.chimes.forEach((chime, i) => {
        groupRefs.current[i]?.setAttribute("transform", `translate(${chime.x.toFixed(2)} 0) rotate(${((-chime.angle * 180) / Math.PI).toFixed(3)})`);
      });
    };

    const ring = (i: number, strength: number) => {
      const chime = state.chimes[i];
      const now = performance.now();
      if (now - chime.lastRing < 110 || strength < 0.06) return;
      chime.lastRing = now;
      playBell(pentatonic(state.chimes.length - 1 - i), 0.05 + Math.min(1, strength) * 0.2, 2.6);
    };

    const step = (now: number) => {
      const dt = state.last ? Math.min(1 / 30, (now - state.last) / 1000) : 1 / 60;
      state.last = now;
      let energy = 0;
      for (const chime of state.chimes) {
        const reach = chime.cord + chime.tube / 2;
        chime.velocity += (-(GRAVITY / reach) * Math.sin(chime.angle) - DAMPING * chime.velocity) * dt;
        chime.angle += chime.velocity * dt;
        energy += Math.abs(chime.angle) + Math.abs(chime.velocity);
      }
      // Tubes that swing into each other bounce apart and ring softly.
      for (let i = 0; i < state.chimes.length - 1; i++) {
        const a = state.chimes[i];
        const b = state.chimes[i + 1];
        const ay = a.cord + a.tube * 0.6;
        const by = b.cord + b.tube * 0.6;
        const ax = a.x + Math.sin(a.angle) * ay;
        const bx = b.x + Math.sin(b.angle) * by;
        const va = a.velocity * ay;
        const vb = b.velocity * by;
        if (bx - ax < TUBE_W + 1 && va > vb) {
          const [na, nb] = [vb * 0.8, va * 0.8];
          a.velocity = na / ay;
          b.velocity = nb / by;
          const hit = Math.abs(va - vb) / 900;
          ring(i, hit * 0.6);
          ring(i + 1, hit * 0.6);
        }
      }
      draw();
      if (energy < 0.0004) {
        state.raf = 0;
        state.last = 0;
        return;
      }
      state.raf = requestAnimationFrame(step);
    };

    const wake = () => {
      if (!state.raf) state.raf = requestAnimationFrame(step);
    };
    api.current = { wake, ring };

    draw();
    // A light breeze when the page opens, unless motion is reduced.
    if (!state.reduced) {
      const id = window.setTimeout(() => {
        state.chimes.forEach((chime, i) => (chime.velocity += 0.12 + Math.sin(i * 2.3) * 0.08));
        wake();
      }, 500);
      return () => {
        window.clearTimeout(id);
        cancelAnimationFrame(state.raf);
        state.raf = 0;
      };
    }
    return () => {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    };
  }, [layout]);

  const strike = (i: number, push: number, strength: number) => {
    const state = sim.current;
    const chime = state.chimes[i];
    if (!chime) return;
    const reach = chime.cord + chime.tube / 2;
    chime.velocity = Math.max(-2.2, Math.min(2.2, chime.velocity + push / reach));
    if (state.reduced) chime.velocity *= 0.3;
    api.current.ring(i, strength);
    api.current.wake();
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const t = event.timeStamp;
    const state = sim.current;
    const previous = state.pointer;
    state.pointer = { x, y, t };
    if (!previous || t - previous.t > 120) return;
    const dt = Math.max(1, t - previous.t) / 1000;
    const vx = (x - previous.x) / dt;
    state.chimes.forEach((chime, i) => {
      const length = chime.cord + chime.tube;
      const ex = chime.x + Math.sin(chime.angle) * length;
      const ey = Math.cos(chime.angle) * length;
      const along = crosses(previous.x, previous.y, x, y, chime.x, 0, ex, ey);
      if (along === null) return;
      const onTube = along * length >= chime.cord;
      const push = Math.max(-900, Math.min(900, vx)) * (onTube ? 0.35 : 0.15);
      strike(i, push, onTube ? Math.min(1, Math.abs(vx) / 1100) : 0);
    });
  };

  const enableSound = () => {
    primeAudio();
    setAudioReady(true);
  };

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto h-[16.75rem] w-full max-w-[60rem] touch-pan-y select-none md:h-[20rem] lg:h-[22.75rem]"
      onPointerMove={onPointerMove}
      onPointerLeave={() => (sim.current.pointer = null)}
      onPointerDown={enableSound}
    >
      {layout ? (
        <>
          <svg width={layout.width} height={layout.height} className="absolute inset-0 overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="chime-metal" x1="0" x2="1">
                <stop offset="0" stopColor="#8a6420" />
                <stop offset="0.35" stopColor="#f3d68f" />
                <stop offset="0.55" stopColor="#d6a64a" />
                <stop offset="1" stopColor="#6e4e15" />
              </linearGradient>
              <filter id="chime-shadow" x="-60%" y="-10%" width="220%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.22" />
              </filter>
            </defs>
            {layout.chimes.map((chime, i) => (
              <g key={i} ref={(el) => void (groupRefs.current[i] = el)} transform={`translate(${chime.x} 0)`}>
                <line x1="0" y1="-120" x2="0" y2={chime.cord + 4} stroke="var(--ink-3)" strokeWidth="1.2" />
                <g filter="url(#chime-shadow)">
                  <rect x={-TUBE_W / 2} y={chime.cord} width={TUBE_W} height={chime.tube} rx={TUBE_W / 2.6} fill="url(#chime-metal)" />
                  <rect x={-TUBE_W / 2 + 2.5} y={chime.cord + 6} width="2" height={chime.tube - 12} rx="1" fill="#fff8e1" opacity="0.55" />
                  <circle cx="0" cy={chime.cord + 5} r="1.6" fill="#5a3f10" />
                </g>
              </g>
            ))}
          </svg>
          <div role="group" aria-label="Wind chimes" className="absolute inset-0">
            {layout.chimes.map((chime, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ring chime ${i + 1} of ${layout.chimes.length}`}
                onClick={() => {
                  enableSound();
                  strike(i, 300, 0.7);
                }}
                className="absolute rounded-full outline-offset-4 focus-visible:outline-2 focus-visible:outline-focus"
                style={{ left: chime.x - 14, top: chime.cord - 4, width: 28, height: chime.tube + 8 }}
              />
            ))}
          </div>
        </>
      ) : null}
      <p
        aria-hidden
        className="type-hand pointer-events-none absolute right-0 bottom-0 translate-y-full -rotate-3 pt-2 text-[1.05rem] text-ink-3 sm:right-6"
      >
        {!soundOn ? "sounds are off, but they still swing" : audioReady ? "brush across the chimes" : "click once, then brush across the chimes"}
      </p>
    </div>
  );
}
