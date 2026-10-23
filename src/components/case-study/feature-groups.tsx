import Image from "next/image";
import type { FeatureGroup } from "@/content/projects";

/**
 * Everything the product does, laid out like a spec sheet: the area on the
 * left, its features as ruled lines on the right, and a screen where one helps.
 */
export function FeatureGroups({ groups }: { groups: FeatureGroup[] }) {
  return (
    <div className="flex flex-col gap-10 md:gap-16">
      {groups.map((group) => (
        <div key={group.title}>
          <div className="grid gap-x-10 gap-y-3 md:grid-cols-12 md:gap-y-4">
            <div className="md:col-span-4">
              <h3 className="type-title text-xl text-ink">{group.title}</h3>
              {group.summary ? <p className="mt-1.5 text-base leading-relaxed text-ink-3 md:mt-2 md:text-sm">{group.summary}</p> : null}
            </div>
            <ul className="border-t border-line md:col-span-8">
              {group.items.map((item) => (
                <li key={item} className="flex gap-3 border-b border-line py-2.5 text-ink-2 md:gap-4 md:py-3">
                  <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-ink-3" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {group.image ? (
            <div className="mt-6 overflow-hidden rounded-lg border border-line shadow-md md:mt-8">
              <Image
                src={group.image.src}
                alt={group.image.alt}
                sizes="(min-width: 82rem) 900px, (min-width: 64rem) 70vw, 100vw"
                placeholder="blur"
                className="h-auto w-full"
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
