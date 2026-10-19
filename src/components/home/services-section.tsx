import Link from "next/link";
import { caseStudies } from "@/content/projects";
import { process, services } from "@/content/services";
import { ArrowRightIcon } from "../icons";
import { SectionDivider, SectionHeading } from "../section-heading";
import { LayerStrip } from "../work/layer-strip";

export function ServicesSection() {
  return (
    <>
      <section id="services" aria-labelledby="services-title" className="scroll-mt-20" data-skippable style={{ "--cis-sm": "2210px", "--cis-md": "1910px", "--cis-lg": "1580px" } as React.CSSProperties}>
        <div className="shell py-20 md:py-24">
          <SectionHeading
            id="services-title"
            title="Services"
            lead="What I can build for you, whether you’re hiring for a role or have a project in mind."
            aside={<span>Full-time or freelance</span>}
          />

          <ul className="mt-10 border-t border-line md:mt-12">
            {services.map((service, index) => (
              <li
                key={service.title}
                className="reveal group/row relative border-b border-line"
                style={{ "--delay": `${index * 60}ms` } as React.CSSProperties}
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-ink transition-transform duration-500 ease-[var(--ease-out)] group-hover/row:scale-y-100"
                />
                <div className="grid grid-cols-1 gap-x-10 gap-y-4 py-8 transition-[padding] duration-500 ease-[var(--ease-out)] md:py-10 lg:grid-cols-12 lg:group-hover/row:pl-6">
                  <div className="lg:col-span-4">
                    <h3 className="type-title text-xl text-ink">{service.title}</h3>
                    <LayerStrip covered={service.layers} className="mt-4 max-w-32" />
                  </div>
                  <div className="lg:col-span-5">
                    <p className="text-ink-2">{service.pitch}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Includes">
                      {service.includes.map((item) => (
                        <li key={item} className="chip">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap items-start gap-2 lg:col-span-3 lg:justify-end">
                    <span className="sr-only">See it in:</span>
                    {service.seenIn.map((slug) => {
                      const study = caseStudies.find((item) => item.slug === slug);
                      return study ? (
                        <Link
                          key={slug}
                          href={`/work/${slug}`}
                          className="group/seen inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-raised px-3.5 text-sm text-ink-2 transition-[border-color,color] duration-200 hover:border-line-strong hover:text-ink"
                        >
                          {study.name}
                          <ArrowRightIcon className="size-3.5 -rotate-45 transition-transform duration-300 group-hover/seen:rotate-0" />
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SectionDivider />

      <section id="process" aria-labelledby="process-title" className="scroll-mt-20" data-skippable style={{ "--cis-sm": "1360px", "--cis-md": "830px", "--cis-lg": "610px" } as React.CSSProperties}>
        <div className="shell py-20 md:py-24">
          <SectionHeading
            id="process-title"
            title="How I work"
            lead="The same four steps, whether it’s a landing page or a full platform."
          />

          <ol className="relative mt-10 grid gap-12 md:mt-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <span aria-hidden className="draw-on-scroll absolute top-[1.375rem] right-0 left-0 hidden h-px origin-left bg-line-strong lg:block" />
            {process.map((step, index) => (
              <li key={step.title} className="reveal relative" style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}>
                <span className="relative z-10 flex size-11 items-center justify-center rounded-full border border-line-strong bg-raised font-mono text-xs text-ink shadow-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="type-title mt-6 text-lg text-ink">{step.title}</h3>
                <p className="mt-2.5 text-[0.9875rem] leading-relaxed text-ink-2">{step.body}</p>
                <p className="mt-5 text-sm text-ink">
                  <span className="text-ink-3">You get </span>
                  {step.output.charAt(0).toLowerCase() + step.output.slice(1)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
