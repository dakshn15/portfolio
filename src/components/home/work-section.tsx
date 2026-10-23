import { caseStudies } from "@/content/projects";
import { site } from "@/content/site";
import { ExternalIcon } from "../icons";
import { SectionHeading } from "../section-heading";
import { CaseStudyCard } from "../work/case-study-card";

export function WorkSection() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-20" data-skippable style={{ "--cis-sm": "2610px", "--cis-md": "4000px", "--cis-lg": "2520px" } as React.CSSProperties}>
      <div className="shell py-12 md:py-24">
        <SectionHeading
          id="work-title"
          title="Selected work"
          lead="Four projects I built myself. For each one I’ve written down what it does, how it works and why I built it that way."
          aside={
            <a href={site.socials.github.href} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1">
              More on GitHub
              <ExternalIcon className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          }
        />

        <div className="mt-7 flex flex-col gap-5 md:mt-12 md:gap-8 lg:gap-10">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={study.slug} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
