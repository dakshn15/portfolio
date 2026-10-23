"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { layerIds, layers, orderedLayers, workflow, type LayerId } from "@/content/layers";
import { layerFill } from "../work/layer-strip";

type Group = LayerId | "workflow";
type Filter = "all" | Group;

const groupDot: Record<Group, string> = { ...layerFill, workflow: "bg-ink-3" };
/**
 * Tabs per layer over the tool tiles. The tiles are rendered on the server
 * (StackTiles) and passed in; this only switches which group is shown.
 * Every layer is anchor-linked for the hero stack.
 */
export function StackExplorer({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<Filter>("all");
  const listRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // On narrow screens the tabs scroll inside the bar. Fade whichever edge has more tabs past it.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const fade = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      const left = scroller.scrollLeft > 2 ? "1.75rem" : "0px";
      const right = scroller.scrollLeft < max - 2 ? "1.75rem" : "0px";
      const mask = max > 2 ? `linear-gradient(to right, transparent, #000 ${left}, #000 calc(100% - ${right}), transparent)` : "";
      scroller.style.maskImage = mask;
      scroller.style.webkitMaskImage = mask;
    };
    const observer = new ResizeObserver(fade);
    observer.observe(scroller);
    scroller.addEventListener("scroll", fade, { passive: true });
    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", fade);
    };
  }, []);

  // Jumping here from the hero stack (#layer-api, …) opens that layer's tab.
  useLayoutEffect(() => {
    const fromHash = () => {
      const match = window.location.hash.match(/^#layer-(\w+)$/);
      if (match && (layerIds as readonly string[]).includes(match[1])) setFilter(match[1] as LayerId);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  useLayoutEffect(() => {
    const tab = listRef.current?.querySelector<HTMLElement>(`[data-tab="${filter}"]`);
    if (!tab) return;
    setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    // Bring the chosen tab to the middle of the bar when the tabs don't all fit.
    const scroller = scrollerRef.current;
    if (scroller && scroller.scrollWidth > scroller.clientWidth) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      scroller.scrollTo({ left: tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
    }
  }, [filter]);

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "Everything" },
    ...orderedLayers.map((layer) => ({ id: layer.id as Filter, label: layer.name })),
    { id: "workflow", label: workflow.name },
  ];

  return (
    <div className="mt-7 md:mt-12">
      {/* Anchors for the hero stack's layer links. */}
      {layerIds.map((id) => (
        <span key={id} id={`layer-${id}`} className="block scroll-mt-32" aria-hidden />
      ))}

      {/* The bar itself stays put at full width; only the tabs inside it scroll sideways. */}
      <div className="pb-2">
        <div className="w-max max-w-full rounded-full border border-line bg-surface p-1">
          <div ref={scrollerRef} className="overflow-x-auto overscroll-x-contain rounded-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div
              ref={listRef}
              role="tablist"
              aria-label="Filter tools by layer"
              onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                const index = tabs.findIndex((tab) => tab.id === filter);
                const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
                setFilter(next.id);
                listRef.current?.querySelector<HTMLElement>(`[data-tab="${next.id}"]`)?.focus();
              }}
              className="relative flex w-max gap-1"
            >
              {indicator ? (
                <span
                  aria-hidden
                  className="absolute inset-y-0 rounded-full bg-raised shadow-[var(--highlight),0_1px_3px_rgb(0_0_0/0.12)] transition-[left,width] duration-500 ease-[var(--ease-out)]"
                  style={{ left: indicator.left, width: indicator.width }}
                />
              ) : null}
              {tabs.map((tab) => {
                const selected = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    data-tab={tab.id}
                    aria-selected={selected}
                    aria-controls="stack-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setFilter(tab.id)}
                    className={`relative z-10 flex min-h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-sm whitespace-nowrap transition-colors duration-200 focus-visible:outline-offset-[-2px] md:min-h-10 md:px-4 ${selected ? "text-ink" : "text-ink-3 hover:text-ink"}`}
                  >
                    {tab.id !== "all" ? <span aria-hidden className={`size-2 rounded-full ${groupDot[tab.id]}`} /> : null}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div id="stack-panel" role="tabpanel" aria-live="polite" className="mt-5 md:mt-8">
        <p key={filter} className="max-w-[44rem] text-ink-2 motion-safe:animate-[rise-in_500ms_var(--ease-out)_both]">
          {filter === "all"
            ? "Every layer of a product, from the screens down to the database, plus the tools I use around the code. Pick a tab to see one layer on its own."
            : filter === "workflow"
              ? workflow.summary
              : layers[filter].summary}
        </p>

        {/* Re-keyed per tab so the visible tiles ease in again. */}
        <ul key={`grid-${filter}`} data-filter={filter} className="stack-grid mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:mt-8 md:gap-3 lg:grid-cols-5">
          {children}
        </ul>
      </div>
    </div>
  );
}
