/** A live value shown above the board while a game runs, like the score or time. */
export type LiveStat = { label: string; value: string };

/** One finished run. `score` is compared with the best; `detail` is shown beside it. */
export type RunResult = { score: number; detail?: string };

/** What every game receives from the stage around it. */
export type GameProps = {
  /** True while the game fills the whole window. */
  immersive: boolean;
  /** Send the live stats for the stage's score bar. */
  report: (stats: LiveStat[]) => void;
  /** Call when a run ends. */
  finish: (run: RunResult) => void;
};

export function clock(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
