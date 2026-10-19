import Link from "next/link";
import { caseStudies } from "@/content/projects";
import { site } from "@/content/site";
import { Counter } from "../counter";
import { ArrowRightIcon, PinIcon } from "../icons";
import { LocalTime } from "../local-time";
import { StackDiagram } from "./stack-diagram";

const headline = ["I build web products", "end to end."];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate">
      <div aria-hidden className="paper-grid paper-fade absolute inset-0 -z-10" />

      <div className="shell grid grid-cols-1 items-center gap-x-12 gap-y-14 pt-12 pb-16 sm:pt-16 lg:grid-cols-12 lg:pt-20 lg:pb-24">
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

          <h1 id="hero-title" className="type-display mt-8 text-[clamp(2.75rem,1.5rem+3.6vw,4.9rem)] leading-[0.98]">
            {/* The space keeps the two lines apart for screen readers and copy and paste. */}
            {headline.map((line, index) => (
              <span key={line} className="line-mask">
                {index > 0 ? " " : null}
                <span style={{ "--delay": `${120 + index * 110}ms` } as React.CSSProperties}>{line}</span>
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-[33rem] text-[1.125rem] leading-relaxed text-ink-2 motion-safe:animate-[rise-in_800ms_var(--ease-out)_380ms_both]">
            I’m Daksh, a full-stack developer from {site.city}. At {site.employer.name} I work on SaaS, ERP and
            booking products, and in my own time I build complete apps like WayPoint and Rezumely, from the database
            up to the screens.
          </p>

          <div className="mt-9 flex flex-wrap gap-3 motion-safe:animate-[rise-in_800ms_var(--ease-out)_480ms_both]">
            <Link href="#work" className="btn btn-primary btn-lg">
              View case studies
              <ArrowRightIcon className="btn-arrow size-4" />
            </Link>
            <Link href="#contact" className="btn btn-secondary btn-lg">
              Get in touch
            </Link>
          </div>

          <dl className="mt-12 grid max-w-[30rem] grid-cols-3 gap-6 border-t border-line pt-6 motion-safe:animate-[rise-in_800ms_var(--ease-out)_600ms_both]">
            <div>
              <dt className="sr-only">Experience</dt>
              <dd className="type-heading text-[1.75rem] leading-none text-ink">
                <Counter value={3} suffix="+" />
              </dd>
              <dd className="mt-2 text-xs text-ink-3">years of experience</dd>
            </div>
            <div>
              <dt className="sr-only">Case studies</dt>
              <dd className="type-heading text-[1.75rem] leading-none text-ink">
                <Counter value={caseStudies.length} />
              </dd>
              <dd className="mt-2 text-xs text-ink-3">products built</dd>
            </div>
            <div>
              <dt className="sr-only">CGPA</dt>
              <dd className="type-heading text-[1.75rem] leading-none text-ink">
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
