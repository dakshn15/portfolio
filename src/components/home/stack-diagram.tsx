"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { layerIds, layers, type LayerId } from "@/content/layers";
import { playTick } from "@/lib/sound";
import { PlayIcon } from "../icons";

// Isometric geometry, in viewBox units. Top faces are 2:1 rhombi (true 30° iso).
const VIEW_W = 680;
const VIEW_H = 610;
const CX = 205;
const W = 170;
const H = W * Math.tan(Math.PI / 6);
const T = 18;
const TOP = 122;
const GAP = 90;
const LABEL_X = 432;

const cyOf = (index: number) => TOP + index * GAP;
const pct = (value: number, of: number) => `${(value / of) * 100}%`;

const color: Record<LayerId, string> = {
  interface: "var(--layer-interface)",
  api: "var(--layer-api)",
  auth: "var(--layer-auth)",
  ai: "var(--layer-ai)",
  data: "var(--layer-data)",
};

// Little drawings etched onto each top face, drawn flat in a 100×100 square
// and projected onto the rhombus with one affine transform.
const glyph: Record<LayerId, ReactNode> = {
  interface: (
    <>
      <rect x="12" y="14" width="76" height="70" rx="7" />
      <path d="M12 29h76" />
      <path d="M20 21.5h.5M27 21.5h.5M34 21.5h.5" strokeWidth={3} />
      <rect x="20" y="37" width="24" height="38" rx="3" />
      <path d="M52 40h28M52 50h28M52 60h18" />
    </>
  ),
  api: (
    <>
      <rect x="14" y="16" width="24" height="13" rx="6.5" />
      <rect x="14" y="44" width="24" height="13" rx="6.5" />
      <rect x="14" y="72" width="24" height="13" rx="6.5" />
      <path d="M46 22.5h40M46 50.5h30M46 78.5h36" />
    </>
  ),
  auth: (
    <>
      <rect x="28" y="44" width="44" height="38" rx="7" />
      <path d="M37 44v-9a13 13 0 0 1 26 0v9" />
      <circle cx="50" cy="60" r="4.5" />
      <path d="M50 64.5v8" />
    </>
  ),
  ai: (
    <>
      <path d="M50 14c2.5 17 7 21.5 24 24-17 2.5-21.5 7-24 24-2.5-17-7-21.5-24-24 17-2.5 21.5-7 24-24Z" />
      <path d="M78 62c1.2 7 3 9 10 10-7 1.2-8.8 3-10 10-1.2-7-3-8.8-10-10 7-1 8.8-3 10-10Z" />
      <path d="M24 66c1 5 2.3 6.3 7 7-4.7 1-6 2.3-7 7-1-4.7-2.3-6-7-7 4.7-.7 6-2 7-7Z" />
    </>
  ),
  data: (
    <>
      <rect x="12" y="16" width="76" height="68" rx="6" />
      <path d="M12 33h76M12 50h76M12 67h76M38 16v68" />
    </>
  ),
};

function slab(cy: number) {
  return {
    top: `M${CX} ${cy - H}L${CX + W} ${cy}L${CX} ${cy + H}L${CX - W} ${cy}Z`,
    left: `M${CX - W} ${cy}L${CX} ${cy + H}L${CX} ${cy + H + T}L${CX - W} ${cy + T}Z`,
    right: `M${CX + W} ${cy}L${CX} ${cy + H}L${CX} ${cy + H + T}L${CX + W} ${cy + T}Z`,
  };
}

/** One request, down through every layer and back. A booking with payment. */
const traceSteps: { layer: LayerId; call: string }[] = [
  { layer: "interface", call: "submit(<BookingForm />)" },
  { layer: "api", call: "POST /api/bookings" },
  { layer: "auth", call: 'requireRole("traveler")' },
  { layer: "ai", call: "razorpay.orders.create()" },
  { layer: "data", call: "prisma.booking.create()" },
];
const STEP_MS = 640;

type TraceState = { step: number; done: boolean; running: boolean };

export function StackDiagram() {
  const [hovered, setHovered] = useState<LayerId | null>(null);
  const [trace, setTrace] = useState<TraceState>({ step: -1, done: false, running: false });
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const runTrace = useCallback((withSound: boolean) => {
    clearTimers();
    setTrace({ step: 0, done: false, running: true });
    if (withSound) playTick();
    traceSteps.forEach((_, index) => {
      if (index === 0) return;
      timers.current.push(
        window.setTimeout(() => {
          setTrace({ step: index, done: false, running: true });
          if (withSound) playTick();
        }, index * STEP_MS),
      );
    });
    // The response travels back up to the interface.
    timers.current.push(
      window.setTimeout(() => setTrace({ step: 0, done: true, running: true }), traceSteps.length * STEP_MS + 120),
      window.setTimeout(() => setTrace({ step: -1, done: true, running: false }), traceSteps.length * STEP_MS + 900),
    );
  }, []);

  // Play once after the stack has assembled, unless motion is reduced.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => runTrace(false), 1500);
    return () => {
      window.clearTimeout(id);
      clearTimers();
    };
  }, [runTrace]);

  const traceLayer = trace.step >= 0 ? traceSteps[trace.step].layer : null;
  const active = traceLayer ?? hovered;
  const packetIndex = traceLayer ? layerIds.indexOf(traceLayer) : 0;
  const current = trace.step >= 0 && !trace.done ? traceSteps[trace.step] : null;

  return (
    <div className="flex flex-col gap-5">
      <div
        className="@container relative mx-auto w-full max-w-[40rem]"
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
        onMouseLeave={() => setHovered(null)}
      >
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <radialGradient id="stack-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx={CX} cy={cyOf(4) + H + 26} rx={W * 1.05} ry={H * 0.55} fill="url(#stack-shadow)" />

          {/* The axis the request travels along. */}
          <path
            d={`M${CX} ${cyOf(0) - H - 24}V${cyOf(4) + H}`}
            stroke="var(--line-strong)"
            strokeDasharray="3 5"
            vectorEffect="non-scaling-stroke"
          />

          {[...layerIds].reverse().map((id) => {
            const index = layerIds.indexOf(id);
            const cy = cyOf(index);
            const s = slab(cy);
            const isActive = active === id;
            const dimmed = active !== null && !isActive;
            return (
              <g
                key={id}
                className="motion-safe:animate-[slab-drop_760ms_var(--ease-out)_both]"
                style={{ animationDelay: `${(layerIds.length - 1 - index) * 110}ms` }}
              >
                <g
                  className="transition-[transform,filter] duration-300 ease-[var(--ease-out)]"
                  style={{
                    transform: `translateY(${isActive ? -12 : 0}px)`,
                    filter: dimmed ? "var(--slab-dim)" : "none",
                  }}
                  onMouseEnter={() => setHovered(id)}
                >
                  <path d={s.left} style={{ fill: `color-mix(in oklab, ${color[id]} 78%, #000)` }} />
                  <path d={s.right} style={{ fill: `color-mix(in oklab, ${color[id]} 58%, #000)` }} />
                  <path d={s.top} style={{ fill: color[id] }} />
                  <path d={s.top} style={{ fill: "#fff", fillOpacity: 0.1 }} />
                  <g
                    transform={`matrix(${W / 100} ${H / 100} ${-W / 100} ${H / 100} ${CX} ${cy - H})`}
                    fill="none"
                    stroke="var(--primary-ink)"
                    strokeOpacity={0.88}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="[&_*]:[vector-effect:non-scaling-stroke]"
                  >
                    {glyph[id]}
                  </g>
                  <path
                    d={s.top}
                    fill="none"
                    stroke="#fff"
                    strokeOpacity={isActive ? 0.7 : 0.18}
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                    className="transition-[stroke-opacity] duration-300"
                  />
                </g>
                {/* Leader line to the label. */}
                <path
                  d={`M${CX + W + 8} ${cy}H${LABEL_X - 10}`}
                  stroke={isActive ? color[id] : "var(--line-strong)"}
                  strokeWidth={1}
                  strokeDasharray={isActive ? "0" : "2 4"}
                  vectorEffect="non-scaling-stroke"
                  className="transition-[stroke] duration-300"
                />
                <circle cx={CX + W + 8} cy={cy} r={3} style={{ fill: color[id] }} />
              </g>
            );
          })}
        </svg>

        {/* The request packet. */}
        <span
          aria-hidden
          className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-[top,opacity] ease-[var(--ease-in-out)] ${
            trace.running ? "opacity-100" : "opacity-0"
          } ${trace.done ? "duration-700" : "duration-500"}`}
          style={{ left: pct(CX, VIEW_W), top: pct(cyOf(packetIndex) - 14, VIEW_H) }}
        >
          <span className="relative flex size-4 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-ink/25 motion-safe:animate-ping" />
            <span className="relative size-3 rounded-full border-2 border-raised bg-ink shadow-md" />
          </span>
        </span>

        {/* Labels: links into the stack section. */}
        <ul className="absolute inset-0" aria-label="Layers of a product">
          {layerIds.map((id, index) => {
            const isActive = active === id;
            return (
              <li
                key={id}
                className="absolute -translate-y-1/2 motion-safe:animate-[rise-in_600ms_var(--ease-out)_both]"
                style={{
                  left: pct(LABEL_X, VIEW_W),
                  top: pct(cyOf(index), VIEW_H),
                  right: 0,
                  animationDelay: `${500 + index * 80}ms`,
                }}
              >
                <a
                  href={`#layer-${id}`}
                  onMouseEnter={() => setHovered(id)}
                  onFocus={() => setHovered(id)}
                  onBlur={() => setHovered(null)}
                  className={`group/label -my-1.5 block rounded-sm py-1.5 transition-opacity duration-300 ${
                    active && !isActive ? "opacity-45" : "opacity-100"
                  }`}
                >
                  <span className="type-title block text-[clamp(0.72rem,2.6cqw,1rem)] leading-tight text-ink">
                    {layers[id].name}
                  </span>
                  <span className="mt-0.5 hidden text-[clamp(0.65rem,1.9cqw,0.8125rem)] leading-snug text-ink-3 @[26rem]:block">
                    {layers[id].short}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <p
          aria-hidden
          className="type-hand pointer-events-none absolute top-[1%] left-[60%] hidden -rotate-6 text-[1.05rem] text-ink-3 motion-safe:animate-[fade-in_600ms_ease-out_1200ms_both] @[30rem]:block"
        >
          <span className="[@media(hover:none)]:hidden">hover a layer</span>
          <span className="hidden [@media(hover:none)]:inline">tap a layer</span>
          <svg width="44" height="30" viewBox="0 0 44 30" className="ml-1 inline-block -translate-y-1 rotate-12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M2 4c12 0 22 6 30 20" />
            <path d="M24 21l8 4 1-9" />
          </svg>
        </p>
      </div>

      <div className="flex min-h-11 flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => runTrace(true)}
          aria-disabled={trace.running}
          className="btn btn-secondary btn-sm"
        >
          <PlayIcon className="size-3.5" />
          {trace.running ? "Tracing…" : "Trace a request"}
        </button>
        <p className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.8125rem] text-ink-2" aria-live="polite">
          {current ? (
            <>
              <span className="size-2 shrink-0 rounded-full" style={{ background: color[current.layer] }} />
              <span className="truncate">
                <span className="text-ink-3">{layers[current.layer].name} </span>
                {current.call}
              </span>
            </>
          ) : trace.done ? (
            <>
              <span className="size-2 shrink-0 rounded-full bg-success" />
              <span className="whitespace-nowrap text-success">201 Created</span>
              <span className="text-ink-3">through 5 layers, one developer</span>
            </>
          ) : (
            <span className="text-ink-3">One booking, followed through every layer.</span>
          )}
        </p>
      </div>
    </div>
  );
}
