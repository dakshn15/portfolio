"use client";

import { useEffect, useState } from "react";

type Section = { id: string; label: string };

/** Sticky contents for a case study, highlighting the section being read. */
export function CaseStudyToc({ sections, repo }: { sections: Section[]; repo?: string }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="type-hand text-lg text-accent" aria-hidden>
        on this page
      </p>
      <ol className="mt-3 border-l border-line">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors duration-200 ${
                  isActive ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink"
                }`}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ol>
      {repo ? (
        <a href={repo} target="_blank" rel="noreferrer" className="link mt-6 inline-block text-sm">
          View the source on GitHub
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : null}
    </nav>
  );
}
