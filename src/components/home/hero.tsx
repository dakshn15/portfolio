import Link from "next/link";
import { caseStudies } from "@/content/projects";
import { site } from "@/content/site";
import { Counter } from "../counter";
import { ArrowRightIcon, PinIcon } from "../icons";
import { LocalTime } from "../local-time";
import { StackDiagram } from "./stack-diagram";

const headline = ["I build every layer", "of a web app."];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate">
      <div aria-hidden className="paper-grid paper-fade absolute inset-0 -z-10" />

      <div className="shell grid grid-cols-1 items-center gap-x-12 gap-y-10 pt-8 pb-12 sm:gap-y-14 sm:pt-16 sm:pb-16 lg:grid-cols-12 lg:pt-20 lg:pb-24">
        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2 motion-safe:animate-[rise-in_700ms_var(--ease-out)_both]">
            {site.availability ? (
              <span className="chip border-success/30 bg-success/8 text-ink">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 rounded-full bg-success/60 motion-safe:animate-ping" />
                  <span className="relative size-2 rounded-full bg-success" />
                </span>
                {site.availability}
              </span>
            ) : null}
            <span className="chip">
              <PinIcon className="size-3.5 text-ink-3" />
              {site.city}, {site.country}
              <span className="text-ink-3">
                <LocalTime />
              </span>
            </span>
          </div>

          <h1 id="hero-title" className="type-display mt-6 text-[clamp(2.25rem,1.5rem+3.6vw,4.9rem)] leading-[0.98] md:mt-8">
            {/* The space keeps the lines apart for screen readers and copy and paste. */}
            {headline.map((line, index) => (
              <span key={line} className="line-mask">
                {index > 0 ? " " : null}
                <span style={{ "--delay": `${120 + index * 110}ms` } as React.CSSProperties}>{line}</span>
              </span>
            ))}
          </h1>

          <p className="mt-5 max-w-[33rem] text-[0.9375rem] leading-relaxed text-ink-2 motion-safe:animate-[rise-in_800ms_var(--ease-out)_380ms_both] md:mt-7 md:text-[1.125rem]">
            I’m Daksh, a full-stack developer in {site.city}. I take a feature from the database table to the button
            someone taps, and build everything in between. I’ve done it for three years at {site.employer.name}, and in
            products of my own like WayPoint and Rezumely.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5 motion-safe:animate-[rise-in_800ms_var(--ease-out)_480ms_both] md:mt-9 md:gap-3">
            <Link href="#work" className="btn btn-primary btn-lg">
              View case studies
              <ArrowRightIcon className="btn-arrow size-4" />
            </Link>
            <Link href="#contact" className="btn btn-secondary btn-lg">
              Get in touch
            </Link>
          </div>

          <dl className="mt-9 grid max-w-[30rem] grid-cols-3 gap-4 border-t border-line pt-5 md:mt-12 md:gap-6 md:pt-6 motion-safe:animate-[rise-in_800ms_var(--ease-out)_600ms_both]">
            <div>
              <dt className="sr-only">Experience</dt>
              <dd className="type-heading text-[1.375rem] leading-none text-ink md:text-[1.75rem]">
                <Counter value={3} suffix="+" />
              </dd>
              <dd className="mt-2 text-xs text-ink-3">years of experience</dd>
            </div>
            <div>
              <dt className="sr-only">Case studies</dt>
              <dd className="type-heading text-[1.375rem] leading-none text-ink md:text-[1.75rem]">
                <Counter value={caseStudies.length} />
              </dd>
              <dd className="mt-2 text-xs text-ink-3">products built</dd>
            </div>
            <div>
              <dt className="sr-only">CGPA</dt>
              <dd className="type-heading text-[1.375rem] leading-none text-ink md:text-[1.75rem]">
                <Counter value={8.16} decimals={2} />
              </dd>
              <dd className="mt-2 text-xs text-ink-3">CGPA, BCA</dd>
            </div>
          </dl>
        </div>

        <div className="motion-safe:animate-[fade-in_900ms_ease-out_200ms_both] lg:col-span-6">
          <StackDiagram />
        </div>
      </div>
    </section>
  );
}
