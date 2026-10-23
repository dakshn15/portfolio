import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import { GameCard } from "@/components/play/game-card";
import { GameStage } from "@/components/play/game-stage";
import { games, getGame, playImage } from "@/content/games";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return {};
  return {
    title: game.name,
    description: game.tagline,
    alternates: { canonical: `/play/${game.slug}` },
    openGraph: { url: `/play/${game.slug}`, title: game.name, description: game.tagline, images: [playImage] },
    twitter: { card: "summary_large_image", title: game.name, description: game.tagline, images: [playImage.url] },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  // The next three games in the list, wrapping round.
  const index = games.findIndex((entry) => entry.slug === game.slug);
  const more = [1, 2, 3].map((offset) => games[(index + offset) % games.length]);

  return (
    <>
      <div className="relative isolate">
        <div aria-hidden className="paper-grid paper-fade absolute inset-0 -z-10" />
        <div className="shell pt-6 pb-6 sm:pt-10 sm:pb-10">
          <Link
            href="/play"
            className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm text-ink-2 transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="size-4" />
            All games
          </Link>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 sm:mt-6">
            <div className="max-w-[42rem]">
              <p className="flex flex-wrap items-center gap-2 text-xs text-ink-3">
                <span className="chip">{game.genre}</span>
                <span>{game.length}</span>
                <span className="ml-2">{game.controls.join(", ")}</span>
              </p>
              <h1 className="type-display mt-3 text-[clamp(2rem,1.6rem+3vw,4rem)] sm:mt-4 leading-[0.98]">{game.name}</h1>
              <p className="mt-3 text-base leading-relaxed text-ink-2 sm:mt-4">{game.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Not inside a reveal or a skipped section: the stage goes position: fixed for full screen. */}
      <div className="shell pb-12 md:pb-20">
        <GameStage game={game} />
      </div>

      <section aria-labelledby="more-title" className="border-t border-line bg-surface">
        <div className="shell py-10 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="more-title" className="type-heading text-2xl text-ink">
              More games
            </h2>
            <Link href="/play" className="link text-sm">
              See all {games.length}
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-8 md:gap-5 lg:grid-cols-3">
            {more.map((entry) => (
              <GameCard key={entry.slug} game={entry} compact />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
