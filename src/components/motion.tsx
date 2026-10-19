"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { jumpTo, prepareAnchor } from "@/lib/anchor";

/**
 * Site-wide motion. Anything with `.reveal` eases in the first time it reaches
 * the viewport, and `.spotlight` surfaces track the pointer.
 * Elements only need a class, so sections stay server-rendered.
 *
 * Long sections marked `data-skippable` are skipped by the browser while far
 * off screen (see globals.css); the reveal sweep checks the section first so
 * it never forces one of those to render early.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    // A sweep on scroll rather than an IntersectionObserver: a fast fling can
    // carry an element across the viewport between two observer checks, and
    // it would never appear. Anything at or above the fold gets shown.
    let pending = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not([data-shown])"));
    let frame = 0;
    const sweep = () => {
      frame = 0;
      const fold = window.innerHeight * 0.94;
      const sectionTop = new Map<Element, number>();
      pending = pending.filter((el) => {
        // Check the section first: measuring inside a skipped section would force it to render.
        const section = el.closest("[data-skippable]");
        if (section) {
          if (!sectionTop.has(section)) sectionTop.set(section, section.getBoundingClientRect().top);
          if (sectionTop.get(section)! > fold) return true;
        }
        if (el.getBoundingClientRect().top > fold) return true;
        el.setAttribute("data-shown", "");
        return false;
      });
      if (!pending.length) stop();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sweep);
    };
    const stop = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();
    return () => {
      stop();
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // Links to a section (#contact, a case study's contents) land exactly, even
  // when the sections above it haven't been rendered yet.
  useEffect(() => {
    const fromHash = () => decodeURIComponent(window.location.hash.slice(1));
    const initial = fromHash();
    if (initial) {
      // Arriving on a link to a section: go straight there, no long smooth scroll.
      requestAnimationFrame(() => jumpTo(initial, "instant"));
      // Once fonts are in, correct for any change in text size, unless the visitor has moved on.
      const y = () => Math.round(window.scrollY);
      let settled = 0;
      requestAnimationFrame(() => (settled = y()));
      void document.fonts?.ready.then(() => {
        if (Math.abs(y() - settled) < 4) jumpTo(initial, "instant");
      });
    }
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname === window.location.pathname && url.hash) prepareAnchor(decodeURIComponent(url.hash.slice(1)));
    };
    // A hash change on the same page (typed, or from history): make sure it lands.
    const onHash = () => {
      const id = fromHash();
      if (id) jumpTo(id, "smooth");
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHash);
    };
  }, [pathname]);

  useEffect(() => {
    let frame = 0;
    let last: { el: HTMLElement; x: number; y: number } | null = null;
    const onMove = (event: PointerEvent) => {
      const el = (event.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!el) return;
      last = { el, x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!last) return;
        const rect = last.el.getBoundingClientRect();
        last.el.style.setProperty("--mx", `${last.x - rect.left}px`);
        last.el.style.setProperty("--my", `${last.y - rect.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
