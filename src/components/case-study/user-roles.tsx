import type { UserRole } from "@/content/projects";
import { CheckIcon } from "../icons";

/** One card per kind of user, listing what the product lets them do. */
export function UserRoles({ roles }: { roles: UserRole[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 sm:[&>li:last-child:nth-child(odd)]:col-span-2">
      {roles.map((role) => (
        <li key={role.name} className="rounded-lg border border-line bg-raised p-6 shadow-[var(--highlight)]">
          <h3 className="type-title text-lg text-ink">{role.name}</h3>
          <p className="mt-1 text-sm text-ink-3">{role.summary}</p>
          <ul className="mt-5 flex flex-col gap-2.5">
            {role.can.map((item) => (
              <li key={item} className="flex gap-3 text-[0.9375rem] leading-snug text-ink-2">
                <CheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-3" />
                {item}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
