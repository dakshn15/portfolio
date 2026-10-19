"use client";

import { useRef, type ReactNode } from "react";
import { ArrowRightIcon } from "../icons";

/**
 * Wraps a project image. On devices with a fine pointer, a small "View case
 * study" bubble follows the cursor across it. Purely decorative: the card
 * itself carries the link.
 */
export function CursorBubble({ children, label = "View case study" }: { children: ReactNode; label?: string }) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  const move = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const zone = zoneRef.current;
    const bubble = bubbleRef.current;
    if (!zone || !bubble) return;
    const rect = zone.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      bubble.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });
  };

  return (
    <div ref={zoneRef} onPointerMove={move} className="group/bubble relative h-full overflow-hidden">
      {children}
      <span
        ref={bubbleRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-20 hidden scale-50 items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium whitespace-nowrap text-primary-ink opacity-0 shadow-lg transition-[opacity,scale] duration-300 ease-[var(--ease-out)] group-hover/bubble:scale-100 group-hover/bubble:opacity-100 [@media(pointer:fine)]:flex"
      >
        {label}
        <ArrowRightIcon className="size-4" />
      </span>
    </div>
  );
}
