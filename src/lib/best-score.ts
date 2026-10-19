import { useSyncExternalStore } from "react";

/**
 * Best scores for the playground, kept in this browser only. Storage can be
 * unavailable (private windows, blocked site data), so every read and write
 * is guarded and the games work without it.
 */
const EVENT = "dn-best-score";

export function readBest(key: string): number | null {
  try {
    const value = localStorage.getItem(`dn-play-${key}`);
    return value === null ? null : Number(value);
  } catch {
    return null;
  }
}

export function writeBest(key: string, value: number) {
  try {
    localStorage.setItem(`dn-play-${key}`, String(value));
  } catch {
    // Not saved this time; the score still shows for this visit.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** The saved best for a game, or null. Always null during server rendering. */
export function useBest(key: string): number | null {
  return useSyncExternalStore(
    subscribe,
    () => readBest(key),
    () => null,
  );
}
