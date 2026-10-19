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
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

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
    if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
  }, [filter]);

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "Everything" },
    ...orderedLayers.map((layer) => ({ id: layer.id as Filter, label: layer.name })),
    { id: "workflow", label: workflow.name },
  ];

  return (
    <div className="mt-10 md:mt-12">
      {/* Anchors for the hero stack's layer links. */}
      {layerIds.map((id) => (
        <span key={id} id={`layer-${id}`} className="block scroll-mt-32" aria-hidden />
      ))}

      <div className="-mx-1 overflow-x-auto px-1 pb-2 [scrollbar-width:none]">
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
          className="relative inline-flex min-w-max gap-1 rounded-full border border-line bg-surface p-1">
          {indicator ? (
            <span
              aria-hidden
              className="absolute top-1 bottom-1 rounded-full bg-raised shadow-[var(--highlight),0_1px_3px_rgb(0_0_0/0.12)] transition-[left,width] duration-500 ease-[var(--ease-out)]"
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
                className={`relative z-10 flex min-h-10 items-center gap-2 rounded-full px-4 text-sm transition-colors duration-200 ${selected ? "text-ink" : "text-ink-3 hover:text-ink"}`}
              >
                {tab.id !== "all" ? <span aria-hidden className={`size-2 rounded-full ${groupDot[tab.id]}`} /> : null}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div id="stack-panel" role="tabpanel" aria-live="polite" className="mt-8">
        <p key={filter} className="max-w-[44rem] text-ink-2 motion-safe:animate-[rise-in_500ms_var(--ease-out)_both]">
          {filter === "all"
            ? "Every layer of a product, from the screens down to the database, plus the tools I use around the code. Pick a tab to see one layer on its own."
            : filter === "workflow"
              ? workflow.summary
              : layers[filter].summary}
        </p>

        {/* Re-keyed per tab so the visible tiles ease in again. */}
        <ul key={`grid-${filter}`} data-filter={filter} className="stack-grid mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {children}
        </ul>
      </div>
    </div>
  );
}
