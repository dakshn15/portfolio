"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { layerIds, layers, type LayerId } from "@/content/layers";
import { pentatonic, playBell, playThud, primeAudio } from "@/lib/sound";
import type { GameProps } from "./game-types";

type Phase = "ready" | "showing" | "input" | "over";

const randomLayer = () => layerIds[Math.floor(Math.random() * layerIds.length)];

// Each layer plays its own note, low at the data layer and high at the interface.
const NOTE: Record<LayerId, number> = { interface: 7, api: 6, auth: 5, ai: 4, data: 3 };

/** Echo: watch the layers light up in order, then play the pattern back. */
export function Echo({ immersive, report, finish }: GameProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [sequence, setSequence] = useState<LayerId[]>([]);
  const [step, setStep] = useState(0);
  const [lit, setLit] = useState<LayerId | null>(null);
  const [wrong, setWrong] = useState<LayerId | null>(null);
  const timers = useRef<number[]>([]);
  // Mirrors the phase and step synchronously, so two presses in the same instant can't both count.
  const live = useRef({ phase: "ready" as Phase, step: 0 });
  const go = (next: Phase) => {
    live.current.phase = next;
    setPhase(next);
  };

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const rounds = Math.max(0, sequence.length - 1);
  useEffect(() => {
    report([
      { label: "Round", value: phase === "ready" ? "–" : String(sequence.length) },
      { label: "Pattern", value: phase === "ready" ? "–" : `${sequence.length} ${sequence.length === 1 ? "step" : "steps"}` },
      { label: "Turn", value: phase === "showing" ? "Watch" : phase === "input" ? `Yours, ${sequence.length - step} left` : "–" },
    ]);
  }, [phase, sequence.length, step, report]);

  const flash = (id: LayerId, ms: number) => {
    setLit(id);
    playBell(pentatonic(NOTE[id]), 0.18, 1.2);
    timers.current.push(window.setTimeout(() => setLit(null), ms));
  };

  const show = (pattern: LayerId[]) => {
    clearTimers();
    go("showing");
    live.current.step = 0;
    setStep(0);
    // A little quicker as the pattern grows.
    const on = Math.max(260, 480 - pattern.length * 18);
    const gap = Math.max(110, 200 - pattern.length * 6);
    pattern.forEach((id, i) => {
      timers.current.push(window.setTimeout(() => flash(id, on), 650 + i * (on + gap)));
    });
    timers.current.push(window.setTimeout(() => go("input"), 650 + pattern.length * (on + gap)));
  };

  const extend = (pattern: LayerId[]) => {
    const next = [...pattern, randomLayer()];
    setSequence(next);
    show(next);
  };

  const start = () => {
    primeAudio();
    setWrong(null);
    extend([]);
  };

  const press = (id: LayerId) => {
    primeAudio();
    if (live.current.phase !== "input") return;
    const at = live.current.step;
    if (sequence[at] !== id) {
      clearTimers();
      setWrong(id);
      setLit(null);
      playThud();
      go("over");
      finish({ score: rounds, detail: `Reached a ${sequence.length}-step pattern` });
      return;
    }
    flash(id, 220);
    if (at + 1 === sequence.length) {
      go("showing");
      timers.current.push(window.setTimeout(() => extend(sequence), 700));
    } else {
      live.current.step = at + 1;
      setStep(at + 1);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = Number(event.key) - 1;
    if (index >= 0 && index < layerIds.length) {
      event.preventDefault();
      press(layerIds[index]);
    }
  };

  const status =
    phase === "ready"
      ? "Press start, then watch the layers."
      : phase === "showing"
        ? "Watch and listen…"
        : phase === "input"
          ? "Your turn. Play the pattern back."
          : `Game over. You cleared ${rounds} ${rounds === 1 ? "round" : "rounds"}.`;

  return (
    <div className={immersive ? "mx-auto flex w-full max-w-[44rem] min-h-0 flex-1 flex-col justify-center" : ""} onKeyDown={onKeyDown}>
      <div className="flex flex-col gap-2 sm:gap-2.5" role="group" aria-label="Layers">
        {layerIds.map((id, index) => {
          const isLit = lit === id;
          const isWrong = wrong === id;
          return (
            <button
              key={id}
              type="button"
              data-game-focus={index === 0 ? "" : undefined}
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                event.preventDefault();
                event.currentTarget.focus();
                press(id);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  if (!event.repeat) press(id);
                }
              }}
              aria-label={`${layers[id].name}, key ${index + 1}`}
              aria-disabled={phase !== "input" || undefined}
              style={{ "--pad": `var(--layer-${id})` } as CSSProperties}
              className={`group/pad relative flex items-center justify-between overflow-hidden rounded-lg border px-5 text-left transition-[transform,background-color,border-color,box-shadow] duration-150 select-none aria-disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                immersive ? "h-[clamp(3.5rem,11dvh,6rem)]" : "h-16 sm:h-[4.5rem]"
              } ${
                isWrong
                  ? "border-danger bg-danger/15"
                  : isLit
                    ? "scale-[1.015] border-transparent bg-[var(--pad)] shadow-[0_0_0_4px_color-mix(in_oklab,var(--pad)_30%,transparent),0_18px_40px_-16px_var(--pad)]"
                    : "border-line bg-raised hover:border-[var(--pad)]"
              }`}
            >
              <span className="flex items-center gap-4">
                <span aria-hidden className={`size-3 rounded-full ${isLit ? "bg-bg" : "bg-[var(--pad)]"}`} />
                <span className={`type-title text-lg ${isLit ? "text-bg" : "text-ink"}`}>{layers[id].name}</span>
              </span>
              <kbd className={`key ${isLit ? "border-bg/40 bg-bg/15 text-bg" : ""}`}>{index + 1}</kbd>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {phase === "ready" || phase === "over" ? (
          <button type="button" onClick={start} className="btn btn-primary btn-sm">
            {phase === "over" ? "Play again" : "Start"}
          </button>
        ) : null}
        <p aria-live="polite" className="text-sm text-ink-2">
          {status}
        </p>
      </div>
    </div>
  );
}
