import { layerIds, layers, type LayerId } from "@/content/layers";
import { layerFill } from "../work/layer-strip";

/**
 * The product drawn as the five-layer stack. Layers the project reaches list
 * what lives there; the rest stay visible but empty, so coverage reads honestly.
 */
export function ArchitectureDiagram({ architecture }: { architecture: Partial<Record<LayerId, string[]>> }) {
  return (
    <ol className="flex flex-col gap-2" aria-label="Architecture by layer">
      {layerIds.map((id) => {
        const items = architecture[id];
        return (
          <li
            key={id}
            className={`relative grid gap-3 overflow-hidden rounded-md border py-4 pr-5 pl-6 sm:grid-cols-[10.5rem_1fr] sm:gap-6 ${
              items ? "border-line bg-raised" : "border-dashed border-line-strong"
            }`}
          >
            <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${layerFill[id]} ${items ? "" : "opacity-30"}`} />
            <p className={`font-medium ${items ? "text-ink" : "text-ink-3"}`}>{layers[id].name}</p>
            {items ? (
              <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-2">
                {items.map((item) => (
                  <li key={item} className="flex items-baseline gap-2">
                    <span aria-hidden className={`size-1.5 shrink-0 translate-y-[-1px] rounded-full ${layerFill[id]}`} />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-3">Not part of this project</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
