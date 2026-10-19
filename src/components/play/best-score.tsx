"use client";

import type { Game } from "@/content/games";
import { useBest } from "@/lib/best-score";

/** "Best: 12 layers", or a nudge to play if there's no score yet. */
export function BestScore({ game }: { game: Game }) {
  const best = useBest(game.score.key);
  return <span className="text-ink-3">{best === null ? "Not played yet" : `Best: ${best} ${game.score.unit}`}</span>;
}
