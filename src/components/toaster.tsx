"use client";

import { useEffect, useState } from "react";
import type { ToastDetail } from "@/lib/toast";
import { playTick } from "@/lib/sound";
import { CheckIcon } from "./icons";

type Item = { id: number; message: string };

export function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let next = 0;
    const onToast = (event: Event) => {
      const { message } = (event as CustomEvent<ToastDetail>).detail;
      const id = ++next;
      playTick();
      setItems((current) => [...current.slice(-2), { id, message }]);
      window.setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 2600);
    };
    window.addEventListener("toast", onToast);
    return () => window.removeEventListener("toast", onToast);
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[70] flex flex-col items-center gap-2 px-4"
    >
      {items.map((item) => (
        <p
          key={item.id}
          className="flex items-center gap-2 rounded-full border border-line bg-raised px-4 py-2.5 text-sm text-ink shadow-lg motion-safe:animate-[rise-in_280ms_var(--ease-out)_both]"
        >
          <CheckIcon className="size-4 text-success" />
          {item.message}
        </p>
      ))}
    </div>
  );
}
