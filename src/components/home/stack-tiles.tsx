import type { CSSProperties } from "react";
import { layers, orderedLayers, workflow, type LayerId } from "@/content/layers";
import { toolIcons, type ToolIconId } from "@/content/tool-icons";
import { layerFill } from "../work/layer-strip";

type Group = LayerId | "workflow";

const groupDot: Record<Group, string> = { ...layerFill, workflow: "bg-ink-3" };
const groupName = (group: Group) => (group === "workflow" ? workflow.name : layers[group].name);

/** Brand colour for hover, unless it is too dark or too light to read on both themes. */
function brandColour(hex: string): string | undefined {
  const value = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.06 || luminance > 0.8 ? undefined : hex;
}

const tools: { name: string; icon?: ToolIconId; group: Group }[] = [
  ...orderedLayers.flatMap((layer) => layer.tools.map((tool) => ({ ...tool, group: layer.id as Group }))),
  ...workflow.tools.map((tool) => ({ ...tool, group: "workflow" as Group })),
];

/**
 * Every tool tile, rendered on the server so the logos never ship as
 * JavaScript. The explorer around them only filters by group (see the
 * `.stack-grid` rules in globals.css).
 */
export function StackTiles() {
  const seen: Partial<Record<Group, number>> = {};
  return tools.map((tool, index) => {
    const icon = tool.icon ? toolIcons[tool.icon] : undefined;
    const brand = icon ? brandColour(icon.hex) : undefined;
    const inGroup = (seen[tool.group] = (seen[tool.group] ?? -1) + 1);
    return (
      <li
        key={`${tool.group}-${tool.name}`}
        data-group={tool.group}
        className="spotlight group/tool flex min-h-24 flex-col justify-between rounded-lg border border-line bg-raised p-4 shadow-[var(--highlight)] transition-[border-color,translate] duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-line-strong motion-safe:animate-[rise-in_520ms_var(--ease-out)_both]"
        style={{ "--i": inGroup, "--j": index, ...(brand ? { "--brand": brand } : {}) } as CSSProperties}
      >
        <span className="flex items-start justify-between">
          {icon ? (
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className={`size-6 fill-ink-3 transition-[fill] duration-300 ${
                brand ? "group-hover/tool:fill-[var(--brand)] [@media(hover:none)]:fill-[var(--brand)]" : "group-hover/tool:fill-ink [@media(hover:none)]:fill-ink"
              }`}
            >
              <path d={icon.path} />
            </svg>
          ) : (
            <span aria-hidden className="mt-1 size-2 rounded-full bg-ink-3" />
          )}
          <span aria-hidden className={`size-1.5 rounded-full ${groupDot[tool.group]}`} title={groupName(tool.group)} />
        </span>
        <span className="mt-4 text-sm font-medium text-ink">{tool.name}</span>
      </li>
    );
  });
}
