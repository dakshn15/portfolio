import type { CSSProperties } from "react";
import { toolIcons, type ToolIconId } from "@/content/tool-icons";

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

export function ToolChip({ name, icon }: { name: string; icon?: ToolIconId }) {
  const data = icon ? toolIcons[icon] : undefined;
  const brand = data ? brandColour(data.hex) : undefined;
  return (
    <li
      className="group/tool chip min-h-9 gap-2 pr-3.5 pl-2.5 text-sm text-ink transition-[border-color,background-color] duration-200 hover:border-line-strong hover:bg-raised"
      style={brand ? ({ "--brand": brand } as CSSProperties) : undefined}
    >
      {data ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={`size-4 shrink-0 fill-ink-3 transition-[fill] duration-200 ${brand ? "group-hover/tool:fill-[var(--brand)]" : "group-hover/tool:fill-ink"}`}
        >
          <path d={data.path} />
        </svg>
      ) : (
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-ink-3" />
      )}
      {name}
    </li>
  );
}
