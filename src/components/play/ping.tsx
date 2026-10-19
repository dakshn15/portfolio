"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { pentatonic, playBell, playThud, playTick, primeAudio } from "@/lib/sound";
import type { GameProps } from "./game-types";

const ROUNDS = 5;
type Phase = "ready" | "waiting" | "go" | "early" | "result" | "done";

/** Ping: wait for the signal, react, and get your reaction time in milliseconds. */
export function Ping({ immersive, report, finish }: GameProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [times, setTimes] = useState<number[]>([]);
  const goAt = useRef(0);
  const timer = useRef(0);
  // The phase, readable synchronously: a double click can't record two times.
  const live = useRef<Phase>("ready");
  const go = (next: Phase) => {
    live.current = next;
    setPhase(next);
  };

  const average = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
  const last = times.length ? times[times.length - 1] : null;

  useEffect(() => {
    report([
      { label: "Round", value: `${Math.min(times.length + (phase === "done" ? 0 : 1), ROUNDS)} of ${ROUNDS}` },
      { label: "Last", value: last === null ? "–" : `${last} ms` },
      { label: "Average", value: average === null ? "–" : `${average} ms` },
    ]);
  }, [times, phase, last, average, report]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const arm = () => {
    go("waiting");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      go("go");
      goAt.current = performance.now();
      // Time from the frame the signal is drawn, not from when it was asked for.
      requestAnimationFrame((frameTime) => (goAt.current = Math.max(goAt.current, frameTime)));
    }, 1300 + Math.random() * 2200);
  };

  const press = (at: number) => {
    primeAudio();
    const phase = live.current;
    if (phase === "ready" || phase === "done") {
      setTimes([]);
      arm();
      return;
    }
    if (phase === "waiting") {
      window.clearTimeout(timer.current);
      playThud();
      go("early");
      return;
    }
    if (phase === "early" || phase === "result") {
      arm();
      return;
    }
    if (phase === "go") {
      const ms = Math.max(0, Math.round(at - goAt.current));
      const next = [...times, ms];
      setTimes(next);
      if (next.length >= ROUNDS) {
        const avg = Math.round(next.reduce((a, b) => a + b, 0) / next.length);
        go("done");
        playBell(pentatonic(avg < 250 ? 9 : avg < 350 ? 7 : 5), 0.2, 1.6);
        finish({ score: avg, detail: `Best round ${Math.min(...next)} ms` });
      } else {
        playTick();
        go("result");
      }
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.focus();
    press(event.timeStamp);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    if (!event.repeat) press(event.timeStamp);
  };

  const surface: Record<Phase, string> = {
    ready: "bg-sunken text-ink",
    waiting: "bg-sunken text-ink-2",
    go: "bg-success text-white",
    early: "bg-danger/12 text-danger",
    result: "bg-sunken text-ink",
    done: "bg-sunken text-ink",
  };

  const message: Record<Phase, { big: string; small: string }> = {
    ready: { big: "Ready?", small: "Click, tap or press Space to start. Then wait for green." },
    waiting: { big: "Wait for green…", small: "Don’t click yet." },
    go: { big: "Now!", small: "" },
    early: { big: "Too soon", small: "That round doesn’t count. Click to try it again." },
    result: { big: `${last ?? 0} ms`, small: `Round ${times.length} of ${ROUNDS}. Click for the next one.` },
    done: { big: `${average ?? 0} ms`, small: "Your average over five rounds. Click to play again." },
  };

  return (
    <div className={immersive ? "flex min-h-0 flex-1 flex-col" : ""}>
      <button
        type="button"
        data-game-focus
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        aria-label={`${message[phase].big}. ${message[phase].small}`}
        className={`relative flex w-full touch-manipulation flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-line px-6 text-center select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${surface[phase]} ${
          immersive ? "min-h-0 flex-1" : "h-[24rem] sm:h-[30rem]"
        }`}
      >
        {phase !== "go" ? <span aria-hidden className="paper-grid absolute inset-0 opacity-70" /> : null}
        <span className="type-display relative text-[clamp(2.5rem,1.5rem+4vw,5rem)] leading-none tabular-nums">{message[phase].big}</span>
        {message[phase].small ? <span className="relative max-w-[26rem] text-[0.9375rem]">{message[phase].small}</span> : null}
      </button>

      <ol className="mt-4 grid grid-cols-5 gap-2" aria-label="Rounds">
        {Array.from({ length: ROUNDS }, (_, i) => (
          <li
            key={i}
            className={`rounded-md border px-2 py-2 text-center text-sm tabular-nums ${
              times[i] !== undefined ? "border-line-strong bg-raised text-ink" : "border-dashed border-line text-ink-3"
            }`}
          >
            {times[i] !== undefined ? (
              `${times[i]} ms`
            ) : (
              <>
                <span className="sm:hidden">{i + 1}</span>
                <span className="hidden sm:inline">Round {i + 1}</span>
              </>
            )}
          </li>
        ))}
      </ol>
      <p aria-live="polite" className="sr-only">
        {phase === "result" || phase === "done" || phase === "early" ? `${message[phase].big}. ${message[phase].small}` : ""}
      </p>
    </div>
  );
}
