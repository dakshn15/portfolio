"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";

// Re-render every 15 seconds; the snapshot only changes when the minute does.
function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 15_000);
  return () => window.clearInterval(id);
}
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => null;

const IST_OFFSET_MINUTES = 330;

function describeOffset(): string {
  const visitorOffset = -new Date().getTimezoneOffset();
  const diff = IST_OFFSET_MINUTES - visitorOffset;
  if (diff === 0) return "same time as you";
  const hours = Math.floor(Math.abs(diff) / 60);
  const minutes = Math.abs(diff) % 60;
  const span = `${hours ? `${hours}h` : ""}${hours && minutes ? " " : ""}${minutes ? `${minutes}m` : ""}`;
  return `${span} ${diff > 0 ? "ahead of" : "behind"} you`;
}

/** Live local time in Surat, plus how far that is from the visitor's own clock. */
export function LocalTime({ withOffset = false }: { withOffset?: boolean }) {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  if (minute === null) return <span className="tabular-nums">--:--</span>;

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(minute * 60_000));

  return (
    <span className="tabular-nums">
      <time dateTime={new Date(minute * 60_000).toISOString()}>{time}</time> {site.timeZoneLabel}
      {withOffset ? <span className="opacity-70">, {describeOffset()}</span> : null}
    </span>
  );
}
