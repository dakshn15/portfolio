"use client";

import { useSyncExternalStore } from "react";
import { isSoundOn, setSoundOn, subscribeSound } from "@/lib/sound";
import { SoundOffIcon, SoundOnIcon } from "./icons";

export function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, isSoundOn, () => true);
  return (
    <button
      type="button"
      onClick={() => setSoundOn(!on)}
      aria-pressed={on}
      className="btn btn-ghost btn-sm gap-2 border border-line"
    >
      {on ? <SoundOnIcon className="size-4" /> : <SoundOffIcon className="size-4" />}
      Sounds {on ? "on" : "off"}
    </button>
  );
}
