import type { Metadata } from "next";
import { Chimes } from "@/components/play/chimes";
import { GameCard } from "@/components/play/game-card";
import { SectionDivider } from "@/components/section-heading";
import { SoundToggle } from "@/components/sound-toggle";
import { games, playImage } from "@/content/games";

const description = "Small games I made for fun: stack the layers, smash some bugs, type real code, and more. Or just ring the chimes.";

export const metadata: Metadata = {
  title: "Playground",
  description,
  alternates: { canonical: "/play" },
  openGraph: { url: "/play", title: "Playground", description, images: [playImage] },
  twitter: { card: "summary_large_image", title: "Playground", description, images: [playImage.url] },
};

export default function PlayPage() {
  return (
    <>
      <section aria-labelledby="play-title" className="relative isolate">
        <div aria-hidden className="paper-grid paper-fade absolute inset-0 -z-10" />
        {/* The chimes hang from the very top of the page, behind the header. */}
        <div className="shell -mt-[4.75rem]">
          <Chimes />
        </div>
        <div className="shell flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pt-16 pb-14 md:pt-20 md:pb-16">
          <div className="max-w-[40rem]">
            <h1 id="play-title" className="type-display text-[clamp(2.75rem,1.6rem+3.6vw,4.5rem)] leading-[0.98]">
              <span className="line-mask">
                <span>Playground</span>
              </span>
            </h1>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-2 motion-safe:animate-[rise-in_800ms_var(--ease-out)_200ms_both]">
              Small games I made for fun, built with the same care as the real work. Pick one and play a round,
              in the page or full screen. Or just brush the chimes and listen.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <SoundToggle />
            <p className="text-xs text-ink-3">Scores are only saved in your browser.</p>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section aria-labelledby="games-title" className="shell py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <h2 id="games-title" className="section-title">
            Games
          </h2>
          <p className="text-sm text-ink-3">
            {games.length} games, all playable with a mouse, a finger or the keyboard
          </p>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </ul>
      </section>
    </>
  );
}
