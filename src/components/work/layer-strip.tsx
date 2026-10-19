import { layerIds, layers, type LayerId } from "@/content/layers";

export const layerFill: Record<LayerId, string> = {
  interface: "bg-layer-interface",
  api: "bg-layer-api",
  auth: "bg-layer-auth",
  data: "bg-layer-data",
  ai: "bg-layer-ai",
};

type LayerStripProps = {
  covered: LayerId[];
  /** Show the names of the covered layers under the strip. */
  labelled?: boolean;
  className?: string;
};

/**
 * Five segments, one per layer, filled where the project reaches that layer.
 * Reads as "how much of the stack this project covers" at a glance.
 */
export function LayerStrip({ covered, labelled = false, className = "" }: LayerStripProps) {
  const names = layerIds.filter((id) => covered.includes(id)).map((id) => layers[id].name);

  return (
    <div className={className}>
      <div className="flex gap-1" role="img" aria-label={`Layers built: ${names.join(", ")}`}>
        {layerIds.map((id) => (
          <span
            key={id}
            className={`h-1.5 flex-1 rounded-full ${covered.includes(id) ? layerFill[id] : "bg-line"}`}
          />
        ))}
      </div>
      {labelled ? (
        <ul aria-hidden className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-3">
          {layerIds
            .filter((id) => covered.includes(id))
            .map((id) => (
              <li key={id} className="flex items-center gap-1.5">
                <span className={`size-1.5 rounded-full ${layerFill[id]}`} />
                {layers[id].name}
              </li>
            ))}
        </ul>
      ) : null}
    </div>
  );
}
