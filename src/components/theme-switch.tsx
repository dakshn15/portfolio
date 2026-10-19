"use client";

import { useEffect, useRef, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";
import { playSwitch, warmAudio } from "@/lib/sound";
import { readTheme, setTheme, toggleTheme, useTheme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./icons";

const CORD_KEY = "dn-cord-pulled";

// Rope model: a chain of points integrated with Verlet and held together by
// distance constraints. Units are CSS pixels in the SVG's own coordinates.
const VIEW_W = 140;
const VIEW_H = 330;
const ANCHOR_X = VIEW_W / 2;
const POINTS = 15;
const LINK = 9.2;
const REST = LINK * (POINTS - 1);
const GRAVITY = 1700;
const BOB_WEIGHT = 1.8;
const DAMPING = 0.986;
const ITERATIONS = 18;
const MAX_STRETCH = 30; // how far the cord can be drawn out of the fixture
const TRIGGER = 20; // past this, letting go flips the switch

type Point = { x: number; y: number; px: number; py: number };

function makeRope(dropFrom = 0): Point[] {
  return Array.from({ length: POINTS }, (_, i) => {
    const y = Math.max(0, i * LINK - dropFrom);
    return { x: ANCHOR_X, y, px: ANCHOR_X, py: y };
  });
}

/** The cord as one smooth curve: it leaves the ceiling straight down and bends through every point. */
function ropePath(points: Point[]) {
  let d = `M ${ANCHOR_X} -12`;
  for (let i = 0; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }
  const last = points[points.length - 1];
  return `${d} L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
}

function subscribeHint(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("cordpulled", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cordpulled", callback);
  };
}
function readHint() {
  try {
    return localStorage.getItem(CORD_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * The theme switch on wide screens: a brass plumb bob on a real-feeling cord.
 * Grab and pull it down past the catch, then let go. A quick click or Enter
 * gives it a tug. The rope swings, stretches out of its fixture, and settles.
 */
export function PlumbCord({ className = "", showHint = true }: { className?: string; showHint?: boolean }) {
  const theme = useTheme();
  const pulledBefore = useSyncExternalStore(subscribeHint, readHint, () => true);

  const svgRef = useRef<SVGSVGElement>(null);
  const cordRef = useRef<SVGPathElement>(null);
  const braidRef = useRef<SVGPathElement>(null);
  const bobRef = useRef<SVGGElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wakeRef = useRef<() => void>(() => {});

  const sim = useRef({
    points: makeRope(REST),
    anchorY: 0, // how far the cord is drawn out of the fixture
    anchorV: 0,
    dragging: false,
    target: { x: ANCHOR_X, y: REST },
    armed: false,
    startedAt: 0,
    moved: 0,
    running: false,
    lastTime: 0,
    reduced: false,
    tugging: false,
  });

  useEffect(() => {
    const state = sim.current;
    state.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const draw = () => {
      const { points } = state;
      const d = ropePath(points);
      cordRef.current?.setAttribute("d", d);
      braidRef.current?.setAttribute("d", d);
      const last = points[POINTS - 1];
      const prev = points[POINTS - 3];
      // The bob hangs in line with the last stretch of rope.
      const angle = (Math.atan2(last.x - prev.x, last.y - prev.y) * 180) / Math.PI;
      bobRef.current?.setAttribute(
        "transform",
        `translate(${last.x.toFixed(2)} ${last.y.toFixed(2)}) rotate(${(-angle).toFixed(2)})`,
      );
      if (buttonRef.current) {
        buttonRef.current.style.transform = `translate(${(last.x - 23).toFixed(1)}px, ${(last.y - 6).toFixed(1)}px)`;
      }
    };

    const step = (now: number) => {
      const dt = state.lastTime ? Math.min(1 / 30, Math.max(1 / 240, (now - state.lastTime) / 1000)) : 1 / 60;
      state.lastTime = now;
      const { points } = state;
      const damping = Math.pow(DAMPING, dt * 60);

      // Integrate.
      for (let i = 1; i < POINTS; i++) {
        const p = points[i];
        const vx = (p.x - p.px) * damping;
        const vy = (p.y - p.py) * damping;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + GRAVITY * (i === POINTS - 1 ? BOB_WEIGHT : 1) * dt * dt;
      }

      // The fixture: while held it gives a little; released, it springs home.
      if (state.dragging) {
        const dx = state.target.x - ANCHOR_X;
        const dy = state.target.y;
        const reach = Math.hypot(dx, dy);
        const want = Math.max(0, Math.min(MAX_STRETCH, reach - REST));
        state.anchorY += (want - state.anchorY) * 0.35;
        state.anchorV = 0;
        state.armed = state.anchorY > TRIGGER;
      } else {
        const force = -state.anchorY * 260 - state.anchorV * 18;
        state.anchorV += force * dt;
        state.anchorY += state.anchorV * dt;
        if (state.anchorY <= 0) {
          // Home against the catch: no overshoot into the ceiling.
          state.anchorY = 0;
          state.anchorV = Math.max(0, state.anchorV);
        }
      }

      // The top of the rope rides on the fixture.
      points[0].x = ANCHOR_X;
      points[0].y = state.anchorY;
      if (state.dragging) {
        const last = points[POINTS - 1];
        // Follow the hand, but never past the end of the rope.
        let tx = state.target.x;
        let ty = state.target.y;
        const len = Math.hypot(tx - ANCHOR_X, ty - state.anchorY);
        if (len > REST) {
          tx = ANCHOR_X + ((tx - ANCHOR_X) / len) * REST;
          ty = state.anchorY + ((ty - state.anchorY) / len) * REST;
        }
        last.px = last.x;
        last.py = last.y;
        last.x += (tx - last.x) * 0.6;
        last.y += (ty - last.y) * 0.6;
      }

      for (let n = 0; n < ITERATIONS; n++) {
        for (let i = 0; i < POINTS - 1; i++) {
          const a = points[i];
          const b = points[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const diff = (LINK - dist) / dist;
          const pinnedA = i === 0;
          const pinnedB = state.dragging && i + 1 === POINTS - 1;
          if (pinnedA && pinnedB) continue;
          const share = pinnedA || pinnedB ? 1 : 0.5;
          const ox = dx * diff * share;
          const oy = dy * diff * share;
          if (!pinnedA) {
            a.x -= ox;
            a.y -= oy;
          }
          if (!pinnedB) {
            b.x += ox;
            b.y += oy;
          }
        }
        points[1].x += (ANCHOR_X - points[1].x) * 0.18;
      }

      draw();

      let motion = Math.abs(state.anchorY) + Math.abs(state.anchorV) * 0.05;
      for (let i = 1; i < POINTS; i++) motion += Math.abs(points[i].x - points[i].px) + Math.abs(points[i].y - points[i].py);
      if (!state.dragging && motion < 0.02) {
        state.running = false;
        state.lastTime = 0;
        return;
      }
      frame = requestAnimationFrame(step);
    };

    const wake = () => {
      if (state.reduced) {
        state.points = makeRope();
        state.anchorY = 0;
        draw();
        return;
      }
      if (state.running) return;
      state.running = true;
      state.lastTime = 0;
      frame = requestAnimationFrame(step);
    };
    wakeRef.current = wake;

    // Get the audio engine ready while the page is idle, before anyone pulls.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    idle(() => warmAudio());

    // Entrance: the cord drops in from the ceiling, then a small sway.
    if (state.reduced) {
      state.points = makeRope();
      draw();
    } else {
      wake();
      const sway = window.setTimeout(() => {
        const last = state.points[POINTS - 1];
        last.px += 7;
        wake();
      }, 1800);
      return () => {
        window.clearTimeout(sway);
        cancelAnimationFrame(frame);
        state.running = false;
      };
    }
    return () => {
      cancelAnimationFrame(frame);
      state.running = false;
    };
  }, []);

  const wake = () => wakeRef.current();

  const toLocal = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: ((clientX - rect.left) / rect.width) * VIEW_W, y: ((clientY - rect.top) / rect.height) * VIEW_H };
  };

  const flip = () => {
    const bob = bobRef.current?.getBoundingClientRect();
    const origin = bob ? { x: bob.left + bob.width / 2, y: bob.top + bob.height / 2 } : undefined;
    setTheme(readTheme() === "dark" ? "light" : "dark", origin);
    try {
      localStorage.setItem(CORD_KEY, "1");
    } catch {
      // Ignore storage errors.
    }
    window.dispatchEvent(new Event("cordpulled"));
  };

  // A tug: the hand pulls the bob straight down past the catch, then lets go.
  const tug = () => {
    const state = sim.current;
    if (state.reduced) {
      flip();
      return;
    }
    if (state.tugging) return;
    state.tugging = true;
    state.dragging = true;
    state.target = { x: ANCHOR_X, y: REST + TRIGGER + 12 };
    wake();
    window.setTimeout(() => {
      state.tugging = false;
      state.dragging = false;
      state.armed = false;
      state.anchorV = -90;
      wake();
      flip();
    }, 110);
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || sim.current.tugging) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const state = sim.current;
    state.dragging = true;
    state.armed = false;
    state.moved = 0;
    state.startedAt = performance.now();
    state.target = toLocal(event.clientX, event.clientY);
    wake();
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const state = sim.current;
    if (!state.dragging) return;
    const next = toLocal(event.clientX, event.clientY);
    state.moved += Math.hypot(next.x - state.target.x, next.y - state.target.y);
    state.target = next;
  };

  const onPointerUp = () => {
    const state = sim.current;
    if (!state.dragging) return;
    state.dragging = false;
    const wasTap = state.moved < 5 && performance.now() - state.startedAt < 400;
    if (wasTap) {
      tug();
      return;
    }
    if (state.armed) {
      // Let go past the catch: the switch flips as the cord springs back.
      state.anchorV = -90;
      flip();
    } else if (state.anchorY > 6) {
      // Not far enough: a soft clack as it slips back, no change.
      playSwitch(readTheme() === "dark");
    }
    state.armed = false;
    wake();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    tug();
  };

  const nudge = () => {
    warmAudio();
    const state = sim.current;
    if (state.dragging || state.reduced) return;
    state.points[POINTS - 1].px -= 2.5;
    wake();
  };

  const next = theme === "dark" ? "light" : "dark";

  return (
    <div
      className={`pointer-events-none fixed top-0 z-[45] right-[max(0px,calc((100vw-60rem)/4-70px))] ${className}`}
      style={{ width: VIEW_W, height: VIEW_H, viewTransitionName: "plumb-cord" }}
    >
      {!pulledBefore && showHint ? (
        <p
          aria-hidden
          className="type-hand absolute top-[8.6rem] right-[5.6rem] w-max -rotate-6 text-[1.05rem] text-ink-3 motion-safe:animate-[fade-in_600ms_ease-out_2200ms_both]"
        >
          pull for {next} mode
          <svg width="34" height="18" viewBox="0 0 34 18" className="ml-1 inline-block" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M2 10c9-6 19-6 28-1" />
            <path d="M24 4l6 5-7 4" />
          </svg>
        </p>
      ) : null}

      <svg ref={svgRef} width={VIEW_W} height={VIEW_H} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="absolute inset-0 overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="cord-bl" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fbe7ad" />
            <stop offset="1" stopColor="#d6a64a" />
          </linearGradient>
          <linearGradient id="cord-br" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#c18f34" />
            <stop offset="1" stopColor="#7e5718" />
          </linearGradient>
          <linearGradient id="cord-cap" x1="0" x2="1">
            <stop offset="0" stopColor="#a77a2a" />
            <stop offset="1" stopColor="#5f4210" />
          </linearGradient>
          <filter id="cord-shadow" x="-80%" y="-40%" width="260%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="#000" floodOpacity="0.28" />
          </filter>
        </defs>
        {/* Braided cord: a base stroke with a light twist pattern over it. */}
        <path ref={cordRef} fill="none" stroke="var(--ink-3)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={braidRef} fill="none" stroke="var(--bg)" strokeOpacity="0.55" strokeWidth="1.9" strokeDasharray="1.1 2.6" strokeLinecap="round" />
        {/* The bob, drawn hanging from its own origin so it can rotate with the rope. */}
        <g ref={bobRef} filter="url(#cord-shadow)">
          <circle cx="0" cy="2.2" r="2.6" fill="var(--bg)" stroke="var(--ink-3)" strokeWidth="1.5" />
          <rect x="-6.5" y="4.8" width="13" height="6.4" rx="2" fill="url(#cord-cap)" />
          <rect x="-8.5" y="11" width="17" height="2.6" rx="1" fill="#e9c574" />
          <path d="M-9.5 13.4H9.5L11.5 25L0 46L-11.5 25Z" fill="url(#cord-br)" />
          <path d="M-9.5 13.4H0V46L-11.5 25Z" fill="url(#cord-bl)" />
          <path d="M-9.5 13.4-11.5 25 0 46" fill="none" stroke="#fff6d8" strokeOpacity=".55" strokeWidth=".8" />
        </g>
      </svg>

      <button
        ref={buttonRef}
        type="button"
        aria-label={`Switch to ${next} theme`}
        title={`Pull for ${next} theme`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerEnter={nudge}
        onKeyDown={onKeyDown}
        className="pointer-events-auto absolute top-0 left-0 h-[3.6rem] w-[2.9rem] cursor-grab touch-none rounded-full select-none active:cursor-grabbing"
        style={{ transform: `translate(${ANCHOR_X - 23}px, ${REST - 6}px)` }}
      />
    </div>
  );
}

/** Compact theme button for small screens, the menu, and the footer. */
export function ThemeButton({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`btn btn-ghost btn-icon ${className}`}
    >
      <span className="relative block size-[18px]">
        <SunIcon data-keep-transition className={`absolute inset-0 transition-[opacity,rotate,scale] duration-500 ease-[var(--ease-out)] ${theme === "dark" ? "rotate-0 opacity-100" : "-rotate-90 scale-50 opacity-0"}`} />
        <MoonIcon data-keep-transition className={`absolute inset-0 transition-[opacity,rotate,scale] duration-500 ease-[var(--ease-out)] ${theme === "dark" ? "rotate-90 scale-50 opacity-0" : "rotate-0 opacity-100"}`} />
      </span>
    </button>
  );
}
