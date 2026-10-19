"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { toolIcons, type ToolIconId } from "@/content/tool-icons";
import { pentatonic, playBell, playTick, primeAudio } from "@/lib/sound";
import { clock, type GameProps } from "./game-types";

const tools: ToolIconId[] = ["nextjs", "react", "typescript", "node", "postgresql", "mongodb", "prisma", "tailwind"];
const ordered = [...tools, ...tools].map((tool, id) => ({ id, tool }));

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Brand colour where it reads on both themes, otherwise none. */
function brandColour(hex: string): string | undefined {
  const value = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.06 || luminance > 0.8 ? undefined : hex;
}

/** Match: find the eight pairs of tools I use every day. */
export function MatchGame({ immersive, report, finish }: GameProps) {
  // Face-down cards all look the same, so the deck is shuffled on the first
  // flip. The server and the first client render stay identical.
  const [deck, setDeck] = useState(ordered);
  const [shuffled, setShuffled] = useState(false);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<ToolIconId[]>([]);
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const locked = useRef(false);
  const done = finishedAt !== null;

  useEffect(() => {
    if (startedAt === null || done) return;
    const id = window.setInterval(() => setNow(performance.now()), 500);
    return () => window.clearInterval(id);
  }, [startedAt, done]);

  const elapsed = startedAt === null ? 0 : (finishedAt ?? now) - startedAt;

  useEffect(() => {
    report([
      { label: "Moves", value: String(moves) },
      { label: "Pairs", value: `${matched.length} of ${tools.length}` },
      { label: "Time", value: clock(elapsed) },
    ]);
  }, [moves, matched.length, elapsed, report]);

  // `at` is the click's timestamp, on the same clock as performance.now().
  const flip = (index: number, at: number) => {
    primeAudio();
    if (locked.current || done || open.includes(index)) return;
    const cards = shuffled ? deck : shuffle(ordered);
    if (!shuffled) {
      setDeck(cards);
      setShuffled(true);
    }
    if (matched.includes(cards[index].tool)) return;
    if (startedAt === null) setStartedAt(at);

    if (open.length === 0) {
      setOpen([index]);
      playTick();
      return;
    }

    const first = open[0];
    const total = moves + 1;
    setOpen([first, index]);
    setMoves(total);
    if (cards[first].tool === cards[index].tool) {
      const nextMatched = [...matched, cards[index].tool];
      setMatched(nextMatched);
      setOpen([]);
      playBell(pentatonic(nextMatched.length + 1), 0.18, 1.4);
      if (nextMatched.length === tools.length) {
        setFinishedAt(at);
        finish({ score: total, detail: `All pairs in ${clock(at - (startedAt ?? at))}` });
      }
    } else {
      locked.current = true;
      playTick();
      window.setTimeout(() => {
        setOpen([]);
        locked.current = false;
      }, 850);
    }
  };

  const reset = () => {
    setDeck(shuffle(ordered));
    setShuffled(true);
    setOpen([]);
    setMatched([]);
    setMoves(0);
    setStartedAt(null);
    setFinishedAt(null);
    locked.current = false;
  };

  return (
    <div className={immersive ? "flex min-h-0 flex-1 flex-col items-center justify-center" : ""}>
      <ul
        className={`grid w-full grid-cols-4 gap-2 sm:gap-3 ${immersive ? "max-w-[min(40rem,calc(100dvh-15rem))]" : "mx-auto max-w-[34rem]"}`}
        aria-label="Cards"
      >
        {deck.map((card, index) => {
          const icon = toolIcons[card.tool];
          const isMatched = matched.includes(card.tool);
          const faceUp = isMatched || open.includes(index);
          const brand = brandColour(icon.hex);
          return (
            <li key={card.id} className="aspect-square perspective-[700px]">
              <button
                type="button"
                data-game-focus={index === 0 ? "" : undefined}
                onClick={(event) => flip(index, event.timeStamp)}
                aria-label={faceUp ? `${icon.title}${isMatched ? ", matched" : ""}` : `Card ${index + 1}, face down`}
                aria-disabled={isMatched || undefined}
                className="group/card relative size-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                style={brand ? ({ "--brand": brand } as CSSProperties) : undefined}
              >
                <span
                  className={`absolute inset-0 transition-transform duration-500 ease-[var(--ease-out)] transform-3d motion-reduce:transition-none ${
                    faceUp ? "rotate-y-180" : "group-hover/card:-rotate-y-6"
                  }`}
                >
                  {/* Back: a blank drafting card. */}
                  <span className="paper-grid absolute inset-0 flex items-center justify-center rounded-md border border-line bg-raised shadow-[var(--highlight)] backface-hidden">
                    <svg viewBox="0 0 12 12" aria-hidden className="size-3 text-ink-3">
                      <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </span>
                  {/* Front: the tool. */}
                  <span
                    className={`absolute inset-0 flex rotate-y-180 flex-col items-center justify-center gap-1.5 rounded-md border bg-raised backface-hidden ${
                      isMatched ? "border-[var(--brand,var(--line-strong))]" : "border-line-strong"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden className={`size-[38%] ${isMatched && brand ? "fill-[var(--brand)]" : "fill-ink"}`}>
                      <path d={icon.path} />
                    </svg>
                    <span className="hidden text-[0.6875rem] text-ink-2 sm:block">{icon.title}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className={`btn btn-sm ${done ? "btn-primary" : "btn-secondary"}`}>
          {done ? "Play again" : "Shuffle"}
        </button>
        <p aria-live="polite" className="text-sm text-ink-2">
          {done ? `All eight pairs in ${moves} moves and ${clock(elapsed)}.` : startedAt === null ? "Turn over any card to start." : "Keep going."}
        </p>
      </div>
    </div>
  );
}
