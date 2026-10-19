import { SectionHeading } from "../section-heading";
import { StackExplorer } from "./stack-explorer";
import { StackTiles } from "./stack-tiles";

export function StackSection() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="scroll-mt-20" data-skippable style={{ "--cis-sm": "2100px", "--cis-md": "1470px", "--cis-lg": "1150px" } as React.CSSProperties}>
      <div className="shell py-20 md:py-24">
        <SectionHeading
          id="stack-title"
          title="Stack"
          lead="The tools I use, sorted by the part of the product they’re for."
          aside={<span>Five layers, plus my workflow</span>}
        />
        <StackExplorer>
          <StackTiles />
        </StackExplorer>
      </div>
    </section>
  );
}
