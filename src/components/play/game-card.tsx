import Link from "next/link";
import type { Game } from "@/content/games";
import { ArrowRightIcon } from "../icons";
import { BestScore } from "./best-score";
import { GamePreview } from "./game-preview";

/** A game in the list: a drawing of it, what it is, and your best so far. */
export function GameCard({ game, compact = false }: { game: Game; compact?: boolean }) {
  return (
    <li className="h-full">
      <Link
        href={`/play/${game.slug}`}
        className="spotlight group/game flex h-full flex-col overflow-hidden rounded-xl border border-line bg-raised shadow-[var(--highlight)] transition-[border-color,translate,box-shadow] duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--highlight),0_24px_48px_-28px_rgb(0_0_0/0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
      >
        <div className={`paper-grid relative border-b border-line bg-sunken ${compact ? "aspect-[16/8]" : "aspect-[16/10]"}`}>
          <div className="absolute inset-0 p-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover/game:scale-[1.03]">
            <GamePreview slug={game.slug} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="flex flex-wrap items-center gap-2 text-xs text-ink-3">
            <span className="chip">{game.genre}</span>
            <span>{game.length}</span>
          </p>
          <h3 className="type-title mt-3 text-xl text-ink">{game.name}</h3>
          {compact ? null : <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{game.tagline}</p>}
          <div className="mt-auto flex items-center justify-between gap-4 pt-5 text-sm">
            <BestScore game={game} />
            <span className="inline-flex items-center gap-1.5 font-medium text-ink">
              Play
              <ArrowRightIcon className="size-4 transition-transform duration-300 ease-[var(--ease-out)] group-hover/game:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
