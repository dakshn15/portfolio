import Image from "next/image";
import type { Walkthrough as WalkthroughData } from "@/content/projects";
import { layers } from "@/content/layers";
import { layerFill } from "../work/layer-strip";

const layerText: Record<string, string> = {
  interface: "text-layer-interface",
  api: "text-layer-api",
  auth: "text-layer-auth",
  ai: "text-layer-ai",
  data: "text-layer-data",
};

/** One flow, followed step by step down (and back up) the stack. */
export function Walkthrough({ flow }: { flow: WalkthroughData }) {
  return (
    <div>
      <h3 className="type-title text-xl">{flow.title}</h3>
      <p className="mt-2 max-w-[42rem] text-ink-2">{flow.summary}</p>

      <ol className="relative mt-6 md:mt-8">
        {flow.steps.map((step, index) => (
          <li key={`${step.title}-${index}`} className="relative grid grid-cols-[2.25rem_1fr] gap-x-3 pb-6 last:pb-0 md:grid-cols-[2.75rem_1fr] md:gap-x-4 md:pb-8">
            {/* The thread connecting the steps. */}
            {index < flow.steps.length - 1 ? (
              <span aria-hidden className="absolute top-9 bottom-0 left-[1.125rem] w-px md:top-11 md:left-[1.375rem] -translate-x-1/2 bg-line-strong" />
            ) : null}
            <span className="relative z-10 flex size-9 items-center justify-center rounded-full border border-line-strong bg-raised font-mono text-xs md:size-11 text-ink shadow-sm">
              <span aria-hidden className={`absolute -top-0.5 -right-0.5 size-3 rounded-full ring-2 ring-bg ${layerFill[step.layer]}`} />
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 pt-1 md:pt-1.5">
              <p className={`text-xs font-medium ${layerText[step.layer]}`}>{layers[step.layer].name}</p>
              <h4 className="type-title mt-1 text-lg text-ink">{step.title}</h4>
              <p className="mt-1.5 max-w-[40rem] text-ink-2">{step.detail}</p>
              {step.code ? (
                <code
                  translate="no"
                  className="mt-3 inline-block max-w-full rounded-md border border-line bg-sunken px-2 py-1 font-mono text-xs md:px-2.5 leading-relaxed [overflow-wrap:anywhere] text-ink"
                >
                  {step.code}
                </code>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {flow.image ? (
        <div className="mt-8 overflow-hidden rounded-lg border border-line shadow-md md:mt-10">
          <Image
            src={flow.image.src}
            alt={flow.image.alt}
            sizes="(min-width: 82rem) 900px, (min-width: 64rem) 70vw, 100vw"
            placeholder="blur"
            className="h-auto w-full"
          />
        </div>
      ) : null}
    </div>
  );
}
