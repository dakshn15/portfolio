import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArchitectureDiagram } from "@/components/case-study/architecture-diagram";
import { CodeExcerpt } from "@/components/case-study/code-excerpt";
import { DataModel } from "@/components/case-study/data-model";
import { FeatureGroups } from "@/components/case-study/feature-groups";
import { CaseStudyToc } from "@/components/case-study/toc";
import { UserRoles } from "@/components/case-study/user-roles";
import { Walkthrough } from "@/components/case-study/walkthrough";
import { ArrowLeftIcon, ArrowRightIcon, GitHubIcon } from "@/components/icons";
import { ToolChip } from "@/components/tool-chip";
import { LayerStrip } from "@/components/work/layer-strip";
import { caseStudies } from "@/content/projects";
import { getCaseStudy, getNextCaseStudy } from "@/lib/projects";
import { toolIconFor } from "@/lib/tool-icon-for";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const title = `${study.name} case study`;
  const image = { url: `/og/${study.slug}.jpg`, width: 1200, height: 630, alt: study.cover.alt };
  return {
    title,
    description: study.summary,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { type: "article", url: `/work/${study.slug}`, title, description: study.summary, images: [image] },
    twitter: { card: "summary_large_image", title, description: study.summary, images: [image.url] },
  };
}

/**
 * Measured section heights (phone, desktop) for each study, so sections the
 * browser skips until they're near the screen reserve about the right space.
 * Only a starting point: once a section has rendered, its real size is used.
 */
const estimates: Record<string, Record<string, [number, number]>> = {waypoint:{overview:[341,385],users:[1350,946],features:[3896,4798],"how-it-works":[4998,5506],built:[2356,2013],decisions:[1856,2119],"next-steps":[401,612]},petcare:{overview:[295,357],users:[968,843],features:[2921,3937],"how-it-works":[2547,2779],built:[2165,1867],decisions:[1733,2041],"next-steps":[378,640]},rezumely:{overview:[306,357],users:[575,464],features:[2325,3130],"how-it-works":[2259,2411],built:[1967,1705],decisions:[1366,1650],"next-steps":[390,612]},techzonix:{overview:[261,330],users:[556,464],features:[2035,2967],"how-it-works":[1077,1227],built:[1491,1454],decisions:[1089,1345],"next-steps":[378,584]}};

function Section({ id, title, lead, estimate, children }: { id: string; title: string; lead?: string; estimate?: [number, number]; children: ReactNode }) {
  const size = estimate ? ({ "--cis-sm": `${estimate[0]}px`, "--cis-md": `${estimate[1]}px` } as React.CSSProperties) : undefined;
  return (
    <section id={id} aria-labelledby={`${id}-title`} data-skippable style={size} className="scroll-mt-28 border-t border-line py-10 first:border-t-0 first:pt-0 md:py-16">
      <h2 id={`${id}-title`} className="reveal section-title">
        {title}
      </h2>
      {lead ? <p className="reveal mt-2 max-w-[42rem] text-ink-3 md:mt-3">{lead}</p> : null}
      <div className="reveal mt-6 md:mt-8" style={{ "--delay": "100ms" } as React.CSSProperties}>
        {children}
      </div>
    </section>
  );
}

function Prose({ paragraphs, lead = false }: { paragraphs: string[]; lead?: boolean }) {
  return (
    <div className="flex max-w-[42rem] flex-col gap-4 text-ink-2 md:gap-5">
      {paragraphs.map((paragraph, index) => (
        <p key={paragraph} className={lead && index === 0 ? "text-[0.9375rem] leading-relaxed text-ink md:text-xl" : "text-base leading-relaxed"}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const next = getNextCaseStudy(study.slug);

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Who uses it" },
    { id: "features", label: "What it does" },
    { id: "how-it-works", label: "How it works" },
    { id: "built", label: "How it’s built" },
    { id: "decisions", label: "Decisions" },
    { id: "next-steps", label: "What’s next" },
  ];

  return (
    <article>
      <div aria-hidden className="reading-progress fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-layer-interface via-layer-auth to-layer-data" />

      <header className="relative isolate">
        <div aria-hidden className="paper-grid paper-fade absolute inset-0 -z-10" />
        <div className="shell pt-6 pb-8 sm:pt-14 sm:pb-12">
          <Link
            href="/#work"
            className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm text-ink-2 transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="size-4" />
            All case studies
          </Link>

          <p className="mt-5 flex flex-wrap items-center gap-2 sm:mt-10">
            <span className="chip">{study.type}</span>
          </p>
          <h1 className="type-display mt-4 text-[clamp(2.25rem,1.6rem+3.6vw,5rem)] sm:mt-5 leading-[0.98]">
            <span className="line-mask">
              <span style={{ "--delay": "80ms" } as React.CSSProperties}>{study.name}</span>
            </span>
          </h1>
          <p className="type-title mt-3 max-w-[30ch] text-[1.0625rem] sm:mt-5 sm:text-[clamp(1.25rem,1.05rem+0.7vw,1.75rem)] leading-snug text-ink-2 motion-safe:animate-[rise-in_800ms_var(--ease-out)_260ms_both]">
            {study.tagline}
          </p>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-5 md:mt-12 md:grid-cols-4 md:gap-x-8 md:gap-y-6 md:pt-6">
            <div>
              <dt className="text-sm text-ink-3">Role</dt>
              <dd className="mt-1 text-ink">{study.role}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-3">Built</dt>
              <dd className="mt-1 text-ink tabular-nums">{study.timeline}</dd>
            </div>
            <div className="col-span-2 md:col-span-1">
              <dt className="text-sm text-ink-3">Layers</dt>
              <dd className="mt-2.5">
                <LayerStrip covered={study.layers} labelled />
              </dd>
            </div>
            {study.repo ? (
              <div className="col-span-2 flex items-start md:col-span-1 md:justify-end">
                <a href={study.repo} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  <GitHubIcon className="size-4" />
                  View source
                  <span className="sr-only">of {study.name} on GitHub (opens in a new tab)</span>
                </a>
              </div>
            ) : null}
          </dl>
        </div>
      </header>

      <div className="shell">
        <div className="overflow-hidden rounded-[18px] border border-line shadow-[0_40px_80px_-40px_rgb(0_0_0/0.4)] md:rounded-[28px] motion-safe:animate-[rise-in_900ms_var(--ease-out)_320ms_both]">
          <Image
            src={study.cover.src}
            alt={study.cover.alt}
            sizes="(min-width: 82rem) 1216px, 100vw"
            placeholder="blur"
            loading="eager"
            fetchPriority="high"
            className="h-auto w-full"
          />
        </div>

        <ul aria-label="Scope" className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 md:mt-14 md:grid-cols-4 md:gap-x-8 md:gap-y-8">
          {study.scope.map((fact) => (
            <li key={fact.label} className="border-t border-line pt-4 md:pt-5">
              <span className="type-heading block text-3xl tabular-nums">{fact.value}</span>
              <span className="mt-2 block text-sm text-ink-2">{fact.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="shell mt-12 grid grid-cols-1 gap-x-14 md:mt-28 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <CaseStudyToc sections={sections} repo={study.repo} />
        </aside>

        <div className="min-w-0 lg:col-span-9">
          <Section id="overview" estimate={estimates[study.slug]?.["overview"]} title="Overview">
            <Prose paragraphs={study.overview} lead />
          </Section>

          <Section id="users" estimate={estimates[study.slug]?.["users"]} title="Who uses it">
            <UserRoles roles={study.users} />
          </Section>

          <Section id="features" estimate={estimates[study.slug]?.["features"]} title="What it does" lead="Everything the product does today, grouped by area.">
            <FeatureGroups groups={study.featureGroups} />
          </Section>

          <Section id="how-it-works" estimate={estimates[study.slug]?.["how-it-works"]} title="How it works" lead="The flows that matter most, followed step by step through the code.">
            <div className="flex flex-col gap-12 md:gap-16">
              {study.walkthroughs.map((flow) => (
                <Walkthrough key={flow.title} flow={flow} />
              ))}
            </div>
          </Section>

          <Section id="built" estimate={estimates[study.slug]?.["built"]} title="How it’s built">
            <Prose paragraphs={study.approach} />
            <div className="mt-10">
              <ArchitectureDiagram architecture={study.architecture} />
            </div>
            <h3 className="type-title mt-10 text-lg md:mt-12">Built with</h3>
            <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2 md:mt-5 md:gap-y-6">
              {study.stack.map((group) => (
                <div key={group.group} className="border-t border-line pt-4">
                  <dt className="text-sm text-ink-3">{group.group}</dt>
                  <dd className="mt-3">
                    <ul className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <ToolChip key={item} name={item} icon={toolIconFor(item)} />
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
            <h3 className="type-title mt-10 text-lg md:mt-12">Data model</h3>
            <div className="mt-5">
              <DataModel groups={study.dataModel} />
            </div>
          </Section>

          <Section id="decisions" estimate={estimates[study.slug]?.["decisions"]} title="Decisions" lead="The choices that took the most thought, with the code behind them.">
            <div className="flex flex-col gap-10 md:gap-16">
              {study.decisions.map((decision) => (
                <div key={decision.title}>
                  <h3 className="type-title text-xl">{decision.title}</h3>
                  <p className="mt-2 max-w-[42rem] text-ink-2 md:mt-3">{decision.body}</p>
                  {decision.excerpt ? (
                    <div className="mt-4 md:mt-6">
                      <CodeExcerpt excerpt={decision.excerpt} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>

          <Section id="next-steps" estimate={estimates[study.slug]?.["next-steps"]} title="What’s next" lead="What it doesn’t do yet, and what I’d change.">
            <ul className="flex max-w-[42rem] flex-col border-t border-line">
              {study.nextSteps.map((step) => (
                <li key={step} className="border-b border-line py-3 text-ink-2 md:py-4">
                  {step}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <nav aria-label="Next case study" className="mt-4 border-t md:mt-10 border-line bg-surface">
        <Link
          href={`/work/${next.slug}`}
          className="group/next shell grid gap-6 py-10 md:grid-cols-12 md:items-center md:gap-12 md:py-24"
        >
          <div className="md:col-span-5">
            <p className="type-hand text-lg text-accent">next case study</p>
            <p className="type-display mt-2 text-3xl">{next.name}</p>
            <p className="mt-3 max-w-[32ch] text-ink-2">{next.tagline}</p>
            <span className="btn btn-primary btn-sm mt-5 md:mt-7">
              Read the case study
              <ArrowRightIcon className="btn-arrow size-4" />
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-line shadow-lg md:col-span-7">
            <Image
              src={next.cover.src}
              alt=""
              sizes="(min-width: 48rem) 680px, 100vw"
              placeholder="blur"
              className="h-auto w-full transition-transform duration-700 ease-out group-hover/next:scale-[1.02]"
            />
          </div>
        </Link>
      </nav>
    </article>
  );
}
