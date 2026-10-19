/** Tables, collections, or stores, grouped by what they hold. */
export function DataModel({ groups }: { groups: { group: string; items: string[] }[] }) {
  return (
    <dl className="border-t border-line">
      {groups.map((entry) => (
        <div key={entry.group} className="grid gap-x-8 gap-y-2 border-b border-line py-4 sm:grid-cols-12">
          <dt className="text-sm text-ink-3 sm:col-span-4">{entry.group}</dt>
          <dd className="sm:col-span-8">
            <ul className="flex flex-wrap gap-1.5">
              {entry.items.map((item) => (
                <li key={item} translate="no" className="rounded-xs border border-line bg-sunken px-2 py-0.5 font-mono text-[0.8125rem] text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
