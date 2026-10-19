"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { layerIds } from "@/content/layers";
import { primeAudio } from "@/lib/sound";
import { useTheme } from "@/lib/theme";
import { createBugEngine, type BugEngine, type BugState } from "./bug-engine";
import type { GameProps } from "./game-types";

/** Bug Smash: breakout, where every brick is a bug I’ve met in real projects. */
export function BugSmash({ immersive, report, finish }: GameProps) {
  const theme = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BugEngine | null>(null);
  const [state, setState] = useState<BugState>("ready");
  const [result, setResult] = useState<{ score: number; level: number } | null>(null);
  const [level, setLevel] = useState(1);

  const callbacks = useRef({ report, finish });
  useEffect(() => {
    callbacks.current = { report, finish };
  }, [report, finish]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const statsFor = (score: number, lives: number, lvl: number) => [
      { label: "Points", value: score.toLocaleString("en-IN") },
      { label: "Lives", value: String(lives) },
      { label: "Level", value: String(lvl) },
    ];
    callbacks.current.report(statsFor(0, 3, 1));
    const engine = createBugEngine(
      canvas,
      {
        onStats: (score, lives, lvl) => {
          setLevel(lvl);
          callbacks.current.report(statsFor(score, lives, lvl));
        },
        onState: (next) => {
          setState(next);
          if (next === "serve") setResult(null);
        },
        onOver: (score, lvl) => {
          setResult({ score, level: lvl });
          callbacks.current.finish({ score, detail: `Reached level ${lvl}` });
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
    // Never keep playing behind another tab or window.
    const pause = () => engine.pause();
    const onVisibility = () => {
      if (document.hidden) engine.pause();
    };
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", onVisibility);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Brick colours follow the theme. Labels are dark on the light pastels of the dark theme.
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
    engineRef.current?.setTheme({
      colors: layerIds.map((id) => read(`--layer-${id}`, "#888888")),
      ink: read("--ink", "#0b1324"),
      line: read("--line-strong", "rgb(0 0 0 / 0.2)"),
      textOnBrick: theme === "dark" ? read("--bg", "#0e0f11") : "#ffffff",
    });
  }, [theme]);

  const keys = useRef({ left: false, right: false });
  const steer = () => engineRef.current?.key((keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") keys.current.left = true;
    else if (key === "arrowright" || key === "d") keys.current.right = true;
    else if (key === " " || key === "enter") {
      if (!event.repeat) {
        primeAudio();
        engineRef.current?.action();
      }
    } else return;
    event.preventDefault();
    steer();
  };

  const onKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") keys.current.left = false;
    else if (key === "arrowright" || key === "d") keys.current.right = false;
    else return;
    steer();
  };

  const overlay: Partial<Record<BugState, string>> = {
    ready: "Click, tap or press Space to start",
    serve: "Click or press Space to launch",
    paused: "Paused. Click or press Space to carry on",
    clear: `Board cleared. Level ${level + 1} next`,
  };

  return (
    <div className={immersive ? "flex min-h-0 flex-1 flex-col" : ""}>
      <div
        tabIndex={0}
        role="application"
        aria-roledescription="game"
        aria-label="Bug Smash. Move with the mouse, a finger, or the arrow keys. Space launches the ball and pauses."
        data-game-focus
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={() => {
          keys.current = { left: false, right: false };
          steer();
        }}
        onPointerMove={(event) => engineRef.current?.pointer(event.clientX)}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.currentTarget.focus();
          engineRef.current?.pointer(event.clientX);
          primeAudio();
          engineRef.current?.action();
        }}
        className={`paper-grid relative w-full touch-pan-y ${state === "play" ? "cursor-none" : "cursor-pointer"} overflow-hidden rounded-lg border border-line bg-sunken select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
          immersive ? "min-h-0 flex-1" : "aspect-[10/7] max-h-[36rem]"
        }`}
      >
        <div ref={wrapRef} className="absolute inset-0">
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
        </div>

        {state === "over" && result ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg/70 px-6 text-center backdrop-blur-[2px]">
            <p className="type-display text-[clamp(2rem,1.4rem+2.5vw,3.25rem)] leading-none text-ink tabular-nums">
              {result.score.toLocaleString("en-IN")} pts
            </p>
            <p className="text-ink-2">Out of lives on level {result.level}.</p>
            <span className="btn btn-primary btn-sm">Play again</span>
          </div>
        ) : overlay[state] ? (
          <p className="pointer-events-none absolute inset-x-0 bottom-[22%] mx-auto w-max max-w-[90%] rounded-full border border-line bg-raised/90 px-4 py-1.5 text-center text-sm text-ink-2 shadow-[var(--highlight)] backdrop-blur-sm">
            {overlay[state]}
          </p>
        ) : null}
      </div>
      <p aria-live="polite" className="sr-only">
        {state === "over" && result ? `Game over. ${result.score} points, level ${result.level}.` : state === "clear" ? "Board cleared." : ""}
      </p>
    </div>
  );
}
