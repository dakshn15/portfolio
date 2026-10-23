"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ComponentType } from "react";
import type { Game } from "@/content/games";
import { readBest, useBest, writeBest } from "@/lib/best-score";
import { isSoundOn, setSoundOn, subscribeSound } from "@/lib/sound";
import { ArrowLeftIcon, ExpandIcon, ShrinkIcon, SoundOffIcon, SoundOnIcon } from "../icons";
import type { GameProps, LiveStat, RunResult } from "./game-types";

const loading = () => <div className="h-[26rem] animate-pulse rounded-lg bg-sunken sm:h-[32rem]" aria-hidden />;

// Each game is its own chunk, so a game page only loads the game it shows.
const components: Record<string, ComponentType<GameProps>> = {
  "stack-it": dynamic(() => import("./stack-game").then((m) => m.StackGame), { loading }),
  "bug-smash": dynamic(() => import("./bug-smash").then((m) => m.BugSmash), { loading }),
  keystrokes: dynamic(() => import("./keystrokes").then((m) => m.Keystrokes), { loading }),
  echo: dynamic(() => import("./echo").then((m) => m.Echo), { loading }),
  match: dynamic(() => import("./match-game").then((m) => m.MatchGame), { loading }),
  ping: dynamic(() => import("./ping").then((m) => m.Ping), { loading }),
};

type Run = RunResult & { id: number; best: boolean };

/**
 * The frame around a game: a live score bar, full-screen play, and the
 * scores beside it. The game stays mounted when switching to full screen,
 * so a run carries on where it was.
 */
export function GameStage({ game }: { game: Game }) {
  const Board = components[game.slug];
  const { key, unit, better, label } = game.score;

  const stageRef = useRef<HTMLDivElement>(null);
  const runId = useRef(0);
  const [stats, setStats] = useState<LiveStat[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [immersive, setImmersive] = useState(false);
  const best = useBest(key);
  const soundOn = useSyncExternalStore(subscribeSound, isSoundOn, () => true);

  // State setters never change, so games can depend on `report` without re-running.
  const report: (next: LiveStat[]) => void = setStats;

  const finish = useCallback(
    (run: RunResult) => {
      const previous = readBest(key);
      const isBest = previous === null || (better === "higher" ? run.score > previous : run.score < previous);
      if (isBest) writeBest(key, run.score);
      runId.current += 1;
      const id = runId.current;
      setRuns((list) => [{ ...run, id, best: isBest }, ...list].slice(0, 6));
    },
    [key, better],
  );

  const enter = () => {
    setImmersive(true);
    const el = stageRef.current;
    // Real full screen where the browser allows it; otherwise the stage still fills the window.
    if (el?.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
    }
  };

  const exit = useCallback(() => {
    setImmersive(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  // While immersive: no page scroll behind, Escape leaves, focus stays inside.
  useEffect(() => {
    if (!immersive) return;
    const stage = stageRef.current;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    stage?.querySelector<HTMLElement>("[data-game-focus]")?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.fullscreenElement) {
        event.preventDefault();
        exit();
      }
      if (event.key !== "Tab" || !stage) return;
      const focusable = Array.from(stage.querySelectorAll<HTMLElement>("button:not([disabled]), input, [tabindex='0'], a[href]")).filter(
        (el) => el.offsetParent !== null,
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    // Leaving real full screen with the browser's own Escape ends immersive mode too.
    const onFullscreen = () => {
      if (!document.fullscreenElement) setImmersive(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [immersive, exit]);

  const format = (score: number) => `${score} ${unit}`;

  const scoreBar = (
    <dl className="flex min-w-0 flex-wrap items-end gap-x-6 gap-y-2">
      {stats.map((stat) => (
        <div key={stat.label} className="min-w-0">
          <dt className="text-2xs text-ink-3">{stat.label}</dt>
          <dd className="type-heading text-lg leading-tight text-ink tabular-nums">{stat.value}</dd>
        </div>
      ))}
      <div>
        <dt className="text-2xs text-ink-3">Your best</dt>
        <dd className="type-heading text-lg leading-tight text-ink tabular-nums">{best === null ? "–" : format(best)}</dd>
      </div>
    </dl>
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="min-w-0 lg:col-span-8">
        <div
          ref={stageRef}
          role={immersive ? "dialog" : undefined}
          aria-modal={immersive || undefined}
          aria-label={immersive ? `${game.name}, full screen` : undefined}
          className={
            immersive
              ? "fixed inset-0 z-[70] flex flex-col bg-bg"
              : "overflow-hidden rounded-xl border border-line bg-raised shadow-[var(--highlight),0_30px_60px_-40px_rgb(0_0_0/0.35)]"
          }
        >
          <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line px-4 py-3 sm:px-5 ${immersive ? "bg-raised" : ""}`}>
            {immersive ? (
              <div className="flex items-center gap-3">
                <button type="button" onClick={exit} className="btn btn-secondary btn-sm">
                  <ArrowLeftIcon className="size-4" />
                  Exit
                  <kbd className="key ml-1 hidden sm:inline-flex">Esc</kbd>
                </button>
                <p className="type-title hidden text-ink sm:block">{game.name}</p>
              </div>
            ) : null}
            {/* On phones the stats get their own row under the controls. */}
            <div className="order-last w-full min-w-0 sm:order-none sm:w-auto">{scoreBar}</div>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSoundOn(!soundOn)}
                aria-pressed={soundOn}
                aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
                title={soundOn ? "Sound on" : "Sound off"}
                className="btn btn-ghost btn-icon"
              >
                {soundOn ? <SoundOnIcon /> : <SoundOffIcon />}
              </button>
              {immersive ? (
                <button type="button" onClick={exit} className="btn btn-ghost btn-icon" aria-label="Leave full screen" title="Leave full screen">
                  <ShrinkIcon />
                </button>
              ) : (
                <button type="button" onClick={enter} className="btn btn-primary btn-sm">
                  <ExpandIcon className="size-4" />
                  Play full screen
                </button>
              )}
            </div>
          </div>

          <div className={immersive ? "paper-grid flex min-h-0 flex-1 flex-col p-3 sm:p-6" : "p-3 sm:p-5"}>
            <Board immersive={immersive} report={report} finish={finish} />
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-4 md:gap-6 lg:col-span-4" aria-label={`${game.name} scores and help`}>
        <section aria-labelledby="scores-title" className="rounded-xl border border-line bg-raised p-[15px] shadow-[var(--highlight)] md:p-5">
          <h2 id="scores-title" className="type-title text-lg text-ink">
            Your scores
          </h2>
          <p className="mt-1 text-sm text-ink-3">
            {label}, {better === "higher" ? "higher is better" : "lower is better"}. Kept in this browser only.
          </p>
          <p className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
            <span className="text-sm text-ink-3">Best</span>
            {best === null ? <span className="text-ink-3">None yet</span> : <span className="type-heading text-2xl text-ink tabular-nums">{format(best)}</span>}
          </p>
          <h3 className="mt-5 text-sm text-ink-3">This visit</h3>
          {runs.length ? (
            <ol className="mt-2">
              {runs.map((run) => (
                <li key={run.id} className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-sm last:border-b-0">
                  <span className="text-ink-2">{run.detail ?? `Run ${run.id}`}</span>
                  <span className="shrink-0 text-ink tabular-nums">
                    {format(run.score)}
                    {run.best ? <span className="ml-2 rounded-full bg-success/12 px-2 py-0.5 text-2xs text-success">best</span> : null}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-ink-3">Finish a round and it shows up here.</p>
          )}
        </section>

        <section aria-labelledby="how-title" className="rounded-xl border border-line bg-raised p-[15px] shadow-[var(--highlight)] md:p-5">
          <h2 id="how-title" className="type-title text-lg text-ink">
            How to play
          </h2>
          <ol className="mt-3 flex flex-col gap-2.5">
            {game.howTo.map((step, index) => (
              <li key={step} className="flex gap-3 text-base leading-snug text-ink-2 md:text-sm">
                <span className="mt-px font-mono text-xs text-ink-3 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
          <h3 className="mt-5 text-sm text-ink-3">Controls</h3>
          <dl className="mt-2">
            {game.keys.map((entry) => (
              <div key={entry.keys} className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-sm last:border-b-0">
                <dt className="text-ink">{entry.keys}</dt>
                <dd className="text-right text-ink-2">{entry.action}</dd>
              </div>
            ))}
          </dl>
        </section>
      </aside>
    </div>
  );
}
