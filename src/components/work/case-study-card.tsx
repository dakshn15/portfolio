import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/content/projects";
import { ArrowRightIcon } from "../icons";
import { CursorBubble } from "./cursor-bubble";
import { LayerStrip } from "./layer-strip";

/** A case study as a large card. The title carries the link; the whole card is clickable. */
export function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const tools = study.stack.flatMap((group) => group.items).slice(0, 5);

  return (
    <article
      className="reveal spotlight group/card overflow-hidden rounded-[20px] border md:rounded-[28px] border-line bg-raised shadow-[var(--highlight),0_30px_60px_-36px_rgb(0_0_0/0.35)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-focus lg:sticky lg:top-[var(--stack-top)]"
      style={{ "--stack-top": `calc(6.25rem + ${index * 1.25}rem)` } as React.CSSProperties}
    >
      <div className="grid grid-cols-1 lg:min-h-[31rem] lg:grid-cols-12">
        <div className="relative z-10 flex flex-col p-[15px] sm:p-10 lg:col-span-5">
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <span className="chip">{study.type}</span>
            <span className="tabular-nums">{study.year}</span>
          </div>

          <h3 className="type-heading mt-4 text-[1.625rem] leading-[1.05] sm:mt-7 sm:text-[clamp(1.875rem,1.5rem+1.2vw,2.5rem)]">
            <Link href={`/work/${study.slug}`} className="outline-none after:absolute after:inset-0 after:z-30 after:content-['']">
              {study.name}
              <span className="sr-only">: read the case study</span>
            </Link>
          </h3>
          <p className="mt-2 max-w-[26rem] text-ink-2 sm:mt-3">{study.tagline}</p>

          <ul aria-label="Scope" className="mt-5 grid grid-cols-2 gap-x-4 sm:mt-8 sm:gap-x-6">
            {study.scope.slice(0, 2).map((fact) => (
              <li key={fact.label} className="border-l-2 border-line pl-3 sm:pl-4">
                <span className="type-heading block text-2xl leading-none tabular-nums">{fact.value}</span>
                <span className="mt-2 block text-xs leading-snug text-ink-3">{fact.label}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-5 flex flex-wrap gap-1.5 sm:mt-8" aria-label="Built with">
            {tools.map((tool) => (
              <li key={tool} className="chip">
                {tool}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6 sm:gap-5 sm:pt-10">
            <LayerStrip covered={study.layers} className="w-full max-w-40" />
            <span aria-hidden className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
              Read the case study
              <ArrowRightIcon className="size-4 transition-transform duration-300 ease-[var(--ease-out)] group-hover/card:translate-x-1" />
            </span>
          </div>
        </div>

        <div className="relative border-t border-line bg-sunken lg:col-span-7 lg:border-t-0 lg:border-l">
          <CursorBubble>
            {/* Mouse-only duplicate of the title link, so the image is clickable too. */}
            <Link href={`/work/${study.slug}`} tabIndex={-1} aria-hidden className="block h-full cursor-none">
              <Image
                src={study.cover.src}
                alt=""
                sizes="(min-width: 78rem) 720px, (min-width: 64rem) 58vw, 100vw"
                placeholder="blur"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover/card:scale-[1.035] lg:absolute lg:inset-0"
              />
            </Link>
          </CursorBubble>
        </div>
      </div>
    </article>
  );
}
