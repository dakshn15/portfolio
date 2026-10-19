import { education } from "@/content/career";
import { site } from "@/content/site";
import { LocalTime } from "../local-time";
import { SectionHeading } from "../section-heading";

const principles = [
  { title: "Data first", body: "I work out the data and the API before the screens. When those are right, the rest gets a lot easier." },
  { title: "Plain code", body: "I’d rather write code the next person can read than code that looks clever." },
  { title: "Every state matters", body: "Loading, empty, failed payment, expired session. If a user can end up there, it needs a proper screen." },
  { title: "Phone first", body: "Most people will open it on a phone, so that’s the size I design for first." },
];

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-20" data-skippable style={{ "--cis-sm": "1800px", "--cis-md": "1300px", "--cis-lg": "900px" } as React.CSSProperties}>
      <div className="shell py-20 md:py-24">
        <SectionHeading id="about-title" title="About" />

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="reveal lg:col-span-7">
            <p className="type-title text-[clamp(1.375rem,1.15rem+0.8vw,1.875rem)] leading-snug text-ink">
              I like building the software a business runs on every day.
            </p>
            <div className="mt-7 flex max-w-[40rem] flex-col gap-5 text-ink-2">
              <p>
                I’ve been a {site.employer.title.toLowerCase()} at {site.employer.name} since October 2023. Most days
                I’m working on SaaS and ERP products, booking systems and their dashboards, plus the landing pages and
                themes customers see first. In that kind of software, the parts nobody demos matter most: permissions,
                edge cases and numbers that have to add up.
              </p>
              <p>
                Outside work I build complete products on my own. WayPoint is the biggest so far, a travel platform
                with AI trip planning and payments. All of them are written up above, including what I’d change.
              </p>
            </div>
          </div>

          <aside className="reveal lg:col-span-5" style={{ "--delay": "120ms" } as React.CSSProperties} aria-label="At a glance">
            <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-raised shadow-[var(--highlight),0_24px_48px_-32px_rgb(0_0_0/0.3)]">
              {[
                ["Based in", site.location],
                ["Local time", <LocalTime key="time" withOffset />],
                ["Working at", `${site.employer.name}, since ${site.employer.since}`],
                ["Studied", `${education.degree}, ${education.grade}`],
                ["Works across", "Frontend, backend and databases"],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-6 py-4">
                  <dt className="text-sm text-ink-3">{label}</dt>
                  <dd className="text-right text-[0.9375rem] text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <ul className="reveal mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" aria-label="How I work">
          {principles.map((principle) => (
            <li key={principle.title} className="bg-bg p-6 sm:p-7">
              <h3 className="type-title text-lg text-ink">{principle.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{principle.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
