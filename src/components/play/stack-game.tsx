"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { layerIds, layers } from "@/content/layers";
import { primeAudio } from "@/lib/sound";
import { useTheme } from "@/lib/theme";
import type { GameProps } from "./game-types";
import { createStackEngine, type StackEngine, type StackStatus } from "./stack-engine";

/** Blend two hex colours; `amount` is how much of the second. */
function mix(a: string, b: string, amount: number) {
  const parse = (hex: string) => {
    const value = parseInt(hex.replace("#", ""), 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  };
  const [ca, cb] = [parse(a), parse(b)];
  return `#${ca.map((c, i) => Math.round(c + (cb[i] - c) * amount).toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Stack it: an isometric stacking game built from the same five layer slabs
 * as the hero. Each new layer slides over the tower; drop it, and whatever
 * hangs over the edge is cut off and falls away.
 */
export function StackGame({ immersive, report, finish }: GameProps) {
  const theme = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<StackEngine | null>(null);
  const [status, setStatus] = useState<StackStatus>("ready");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  // The latest callbacks, for the engine that outlives renders.
  const callbacks = useRef({ report, finish });
  useEffect(() => {
    callbacks.current = { report, finish };
  }, [report, finish]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const statsFor = (layersPlaced: number, combo: number, playing: boolean) => [
      { label: "Layers", value: String(layersPlaced) },
      { label: "Perfect streak", value: String(combo) },
      { label: "Next layer", value: playing ? layers[layerIds[layersPlaced % layerIds.length]].name : "–" },
    ];
    callbacks.current.report(statsFor(0, 0, false));
    const engine = createStackEngine(
      canvas,
      {
        onPlace: (layersPlaced, combo) => {
          setScore(layersPlaced);
          setStreak(combo);
          callbacks.current.report(statsFor(layersPlaced, combo, true));
        },
        onStatus: (next) => {
          setStatus(next);
          if (next === "playing") setAnnouncement("");
        },
        onOver: (layersPlaced) => {
          callbacks.current.report(statsFor(layersPlaced, 0, false));
          callbacks.current.finish({ score: layersPlaced, detail: `Tower of ${layersPlaced}` });
          setAnnouncement(`Game over. ${layersPlaced} ${layersPlaced === 1 ? "layer" : "layers"}.`);
        },
      },
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    engineRef.current = engine;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      engine.resize(rect.width, rect.height, Math.min(window.devicePixelRatio || 1, 2));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();
    return () => {
      observer.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Slab colours follow the theme; the pedestal is a quiet grey between ink and paper.
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
    engineRef.current?.setColors(
      layerIds.map((id) => read(`--layer-${id}`, "#888888")),
      mix(read("--ink-3", "#8d9097"), read("--bg", "#f4f5f7"), 0.45),
    );
  }, [theme]);

  const act = () => {
    primeAudio();
    engineRef.current?.act();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    if (!event.repeat) act();
  };

  return (
    <div className={immersive ? "flex min-h-0 flex-1 flex-col" : ""}>
      <button
        type="button"
        data-game-focus
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          event.currentTarget.focus();
          act();
        }}
        onKeyDown={onKeyDown}
        aria-label={status === "playing" ? "Drop the layer" : "Start a new game of Stack it"}
        className={`paper-grid relative block w-full cursor-pointer touch-manipulation overflow-hidden rounded-lg border border-line bg-sunken select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
          immersive ? "min-h-0 flex-1" : "h-[26rem] sm:h-[34rem]"
        }`}
      >
        <div ref={wrapRef} className="absolute inset-0">
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
        </div>

        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-5 flex flex-col items-center">
          <span className="type-display text-[2.75rem] leading-none text-ink tabular-nums sm:text-[3.5rem]">{score}</span>
          {status === "playing" && streak >= 2 ? (
            <span key={streak} className="type-hand mt-1 text-lg text-accent motion-safe:animate-[rise-in_400ms_var(--ease-out)_both]">
              perfect ×{streak}
            </span>
          ) : null}
        </span>

        {status !== "playing" ? (
          <span className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-3 px-6 text-center">
            {status === "over" ? (
              <span className="rounded-full border border-line bg-raised/90 px-4 py-1.5 text-sm text-ink shadow-[var(--highlight)] backdrop-blur-sm">
                {score} {score === 1 ? "layer" : "layers"}. Have another go.
              </span>
            ) : (
              <span className="rounded-full border border-line bg-raised/90 px-4 py-1.5 text-sm text-ink-2 shadow-[var(--highlight)] backdrop-blur-sm">
                Click, tap or press Space to drop each layer
              </span>
            )}
            <span className="btn btn-primary btn-sm">{status === "over" ? "Play again" : "Start"}</span>
          </span>
        ) : null}
      </button>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
