import { useSyncExternalStore } from "react";
import { playSwitch } from "./sound";
import { THEME_COLORS, THEME_STORAGE_KEY, type Theme } from "./theme-constants";

export type { Theme };
const EVENT = "themechange";

export function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * Every colour on the page changes at once, and each element with a CSS
 * transition would otherwise animate its own colours, restyling the whole
 * page for several frames. Transitions are switched off for the swap and
 * restored once the new styles are in place. The theme icons keep theirs.
 */
function withoutTransitions(change: () => void) {
  const style = document.createElement("style");
  style.textContent = "*:not([data-keep-transition]),*::before,*::after{transition:none!important}";
  document.head.appendChild(style);
  change();
  void window.getComputedStyle(document.body).color;
  requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
}

function commit(next: Theme, persist: boolean) {
  withoutTransitions(() => {
    document.documentElement.dataset.theme = next;
  });
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[next]);
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode: the switch still works for this visit.
    }
  }
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Switch theme. When an origin point is given the new theme spreads out in a
 * circle from it (View Transitions), with a switch click to match.
 */
export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  playSwitch(next === "dark");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };

  if (!doc.startViewTransition || reduceMotion) {
    commit(next, true);
    return;
  }

  const root = document.documentElement;
  const x = origin?.x ?? window.innerWidth;
  const y = origin?.y ?? 0;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty("--reveal-x", `${x}px`);
  root.style.setProperty("--reveal-y", `${y}px`);
  root.style.setProperty("--reveal-r", `${radius}px`);
  doc.startViewTransition(() => commit(next, true));
}

export function toggleTheme(origin?: { x: number; y: number }) {
  setTheme(readTheme() === "dark" ? "light" : "dark", origin);
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  // Follow the system setting until the visitor picks a theme themselves.
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored !== "light" && stored !== "dark") commit(media.matches ? "dark" : "light", false);
  };
  media.addEventListener("change", onSystemChange);
  return () => {
    window.removeEventListener(EVENT, callback);
    media.removeEventListener("change", onSystemChange);
  };
}

/** Current theme; "light" during server rendering, corrected right after hydration. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => "light");
}
