"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";

// The full menu (with every case study and game to search) is its own chunk.
// It downloads while the browser is idle and only runs once someone opens it.
const loadMenu = () => import("./command-menu").then((m) => m.CommandMenu);
const CommandMenu = dynamic(loadMenu, { ssr: false });

export function openCommandPalette() {
  window.dispatchEvent(new Event("open-palette"));
}

function subscribeNothing() {
  return () => {};
}
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** "⌘K" on Apple devices, "Ctrl K" elsewhere. */
export function useShortcutLabel() {
  return useSyncExternalStore(subscribeNothing, () => (isMac() ? "⌘K" : "Ctrl K"), () => "Ctrl K");
}

/** The shortcut as keycaps, matching the visitor's platform. */
export function ShortcutKeys() {
  const label = useShortcutLabel();
  return label === "⌘K" ? (
    <span className="inline-flex gap-1">
      <kbd className="key">⌘</kbd>
      <kbd className="key">K</kbd>
    </span>
  ) : (
    <span className="inline-flex gap-1">
      <kbd className="key">Ctrl</kbd>
      <kbd className="key">K</kbd>
    </span>
  );
}

/** Listens for Ctrl/⌘K and the header button until the real menu has loaded. */
export function CommandPalette() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const load = () => setLoaded(true);
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        load();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", load);
    // Fetch the menu's code in the background once the page is quiet.
    const idle = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(() => void loadMenu(), { timeout: 6000 }) : 0;
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", load);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, [loaded]);

  return loaded ? <CommandMenu startOpen /> : null;
}
