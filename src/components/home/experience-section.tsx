import { education, roles } from "@/content/career";
import { SectionHeading } from "../section-heading";

function Node({ current = false }: { current?: boolean }) {
  return (
    <span aria-hidden className="absolute top-1.5 -left-[2.03rem] flex size-4 items-center justify-center rounded-full border border-line-strong bg-bg md:-left-[2.53rem]">
      <span className={`size-1.5 rounded-full ${current ? "bg-success" : "bg-ink-3"}`} />
      {current ? <span className="absolute inset-0 rounded-full border border-success/50 motion-safe:animate-ping" /> : null}
    </span>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-20" data-skippable style={{ "--cis-sm": "1380px", "--cis-md": "1400px", "--cis-lg": "1320px" } as React.CSSProperties}>
      <div className="shell grid grid-cols-1 gap-x-16 gap-y-8 py-12 md:gap-y-14 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              id="experience-title"
              title="Experience"
              lead="Three years at WorkDo Solutions, plus the products I build on my own."
            />
          </div>
        </div>

        <div className="lg:col-span-8">
          <ol className="relative ml-6 md:ml-8">
            {/* The spine, drawn in as the timeline scrolls past. */}
            <span aria-hidden className="absolute top-2 bottom-2 -left-[1.53rem] w-px bg-line md:-left-[2.03rem]" />
            <span aria-hidden className="draw-down absolute top-2 bottom-2 -left-[1.53rem] w-px origin-top bg-ink-3 md:-left-[2.03rem]" />

            {roles.map((role, index) => (
              <li key={role.organisation} className="reveal relative pb-10 md:pb-14" style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}>
                <Node current={role.current} />
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p className="text-sm text-ink-3 tabular-nums">
                    {role.start} – {role.end}
                  </p>
                  {role.current ? <span className="chip border-success/30 bg-success/8 text-success">Current</span> : null}
                </div>
                <h3 className="type-heading mt-2.5 text-2xl md:mt-3">{role.title}</h3>
                <p className="mt-1 text-ink">{role.organisation}</p>
                <p className="mt-3 max-w-[40rem] text-ink-2 md:mt-4">{role.summary}</p>
                <ul className="mt-4 grid max-w-[42rem] gap-2 md:mt-5 md:gap-2.5">
                  {role.highlights.map((item) => (
                    <li key={item} className="relative pl-4 text-base leading-relaxed text-ink-2 md:pl-5 md:text-[0.9875rem]">
                      <span aria-hidden className="absolute top-[0.72em] left-0 size-1 rounded-full bg-ink-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <ul aria-label="Focus areas" className="mt-4 flex md:mt-5 flex-wrap gap-1.5">
                  {role.focus.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}

            <li className="reveal relative" style={{ "--delay": "160ms" } as React.CSSProperties}>
              <Node />
              <p className="text-sm text-ink-3 tabular-nums">
                {education.start} – {education.end}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-raised p-[15px] shadow-[var(--highlight)] md:p-5">
                <div>
                  <h3 className="type-title text-lg">{education.degree}</h3>
                  <p className="mt-1 text-sm text-ink-2">{education.institution}</p>
                </div>
                <p className="text-right">
                  <span className="type-heading block text-2xl leading-none tabular-nums">{education.grade.replace("CGPA ", "")}</span>
                  <span className="mt-1 block text-xs text-ink-3">CGPA</span>
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
