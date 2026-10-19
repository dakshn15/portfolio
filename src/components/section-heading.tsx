import type { ReactNode } from "react";

type SectionHeadingProps = {
  id: string;
  title: string;
  lead?: ReactNode;
  /** Small supporting content on the right: a count, a link. */
  aside?: ReactNode;
};

/** Short title, one-line lead, optional aside. The same rhythm in every section. */
export function SectionHeading({ id, title, lead, aside }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
      <div className="reveal max-w-[40rem]">
        <h2 id={id} className="section-title">
          {title}
        </h2>
        {lead ? <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-2">{lead}</p> : null}
      </div>
      {aside ? (
        <div className="reveal text-sm text-ink-3" style={{ "--delay": "120ms" } as React.CSSProperties}>
          {aside}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The band between sections: a hatched strip with registration marks where
 * it meets the sheet's frame, like the margin of a technical drawing.
 */
export function SectionDivider() {
  return (
    // Clipped sideways: on narrow screens the marks sit at the very edge and must not widen the page.
    <div aria-hidden className="mx-auto w-full max-w-[78rem] overflow-x-clip min-[78rem]:overflow-x-visible">
      <div className="hatch relative h-9 border-y border-line">
        <Mark className="-top-[5px] -left-[5px]" />
        <Mark className="-top-[5px] -right-[5px]" />
        <Mark className="-bottom-[5px] -left-[5px]" />
        <Mark className="-right-[5px] -bottom-[5px]" />
      </div>
    </div>
  );
}

function Mark({ className }: { className: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" className={`absolute text-ink-3 ${className}`}>
      <path d="M4.5 0v9M0 4.5h9" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
