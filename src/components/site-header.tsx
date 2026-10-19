"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { navigation, site } from "@/content/site";
import { isSoundOn, setSoundOn, subscribeSound } from "@/lib/sound";
import { openCommandPalette, useShortcutLabel } from "./command-palette";
import { ArrowRightIcon, BrandMark, CloseIcon, GitHubIcon, LinkedInIcon, MenuIcon, SearchIcon, SoundOffIcon, SoundOnIcon } from "./icons";
import { PlumbCord, ThemeButton } from "./theme-switch";

const sectionIds = [...navigation.filter((item) => !item.page).map((item) => item.id), "contact"];
type Box = { left: number; width: number } | null;
/** The hover pill. `instant` places it without sliding, for the first hover after leaving the nav. */
type Pill = { left: number; width: number; visible: boolean; instant: boolean };

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [pill, setPill] = useState<Pill>({ left: 0, width: 0, visible: false, instant: true });
  const [activeBox, setActiveBox] = useState<Box>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const shortcut = useShortcutLabel();
  const soundOn = useSyncExternalStore(subscribeSound, isSoundOn, () => true);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  // Slide the active underline to the section being read.
  useLayoutEffect(() => {
    const current = navigation.find((item) => item.page && item.href === pathname)?.id ?? (isHome ? active : "");
    const link = navRef.current?.querySelector<HTMLElement>(`[data-nav="${current}"]`);
    setActiveBox(link ? { left: link.offsetLeft, width: link.offsetWidth } : null);
  }, [active, isHome, pathname]);

  // Mobile menu: inert page behind, focus trapped, Escape and outside clicks close it.
  useEffect(() => {
    if (!open) return;
    const outside = [document.getElementById("main"), document.getElementById("site-footer")];
    outside.forEach((el) => el?.setAttribute("inert", ""));
    const header = headerRef.current;
    header?.querySelector<HTMLElement>("#mobile-menu a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") return close();
      if (event.key !== "Tab" || !header) return;
      const focusable = Array.from(header.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter(
        (el) => el.offsetParent !== null,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (header && !header.contains(event.target as Node)) close(false);
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 64rem)").matches) close(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onResize);
    return () => {
      outside.forEach((el) => el?.removeAttribute("inert"));
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  const elevated = scrolled || open;

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4">
      <div
        className={`relative mx-auto flex h-14 max-w-[60rem] items-center gap-2 rounded-full border pr-2 pl-3.5 transition-[background-color,border-color,box-shadow] duration-500 ease-[var(--ease-out)] ${
          elevated
            ? "border-line bg-raised/80 shadow-[var(--highlight),0_12px_32px_-16px_rgb(0_0_0/0.35)] backdrop-blur-xl backdrop-saturate-150"
            : "border-line/60 bg-raised/45 backdrop-blur-md"
        }`}
      >
        <Link
          href="/"
          aria-label={`${site.name}, home`}
          className="group/logo flex items-center gap-2.5 rounded-full py-1.5 pr-2 text-ink"
          onClick={() => setOpen(false)}
        >
          <BrandMark size={30} id="mark-header" className="transition-transform duration-500 ease-[var(--ease-spring)] group-hover/logo:-rotate-6" />
          {/* Full name wherever it fits; first name only on the narrowest phones. */}
          <span className="type-title text-[0.975rem] whitespace-nowrap">
            <span className="min-[22rem]:hidden">{site.name.split(" ")[0]}</span>
            <span className="hidden min-[22rem]:inline">{site.name}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="mx-auto hidden lg:block">
          <ul ref={navRef} className="relative flex items-center" onMouseLeave={() => setPill((prev) => ({ ...prev, visible: false }))}>
            <span
              aria-hidden
              className="absolute inset-y-0 rounded-full bg-sunken duration-300 ease-[var(--ease-out)]"
              style={{
                left: pill.left,
                width: pill.width,
                opacity: pill.visible ? 1 : 0,
                scale: pill.visible ? "1" : "0.92",
                transitionProperty: pill.instant ? "opacity, scale" : "left, width, opacity, scale",
              }}
            />
            <span
              aria-hidden
              className="absolute -bottom-1 h-[2px] rounded-full bg-ink transition-[left,width,opacity] duration-500 ease-[var(--ease-out)]"
              style={{ left: (activeBox?.left ?? 0) + (activeBox?.width ?? 0) / 2 - 8, width: 16, opacity: activeBox ? 1 : 0 }}
            />
            {navigation.map((item) => {
              const isActive = item.page ? pathname === item.href : isHome && active === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    data-nav={item.id}
                    aria-current={isActive ? "true" : undefined}
                    onMouseEnter={(event) => {
                      const { offsetLeft: left, offsetWidth: width } = event.currentTarget;
                      setPill((prev) => ({ left, width, visible: true, instant: !prev.visible }));
                    }}
                    className={`relative block rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                      isActive ? "text-ink" : "text-ink-2 hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button
            type="button"
            onClick={openCommandPalette}
            className="btn btn-ghost btn-sm hidden gap-2 md:inline-flex"
            aria-label="Open the command menu"
          >
            <SearchIcon className="size-4" />
            <kbd className="key">{shortcut}</kbd>
          </button>
          <button type="button" onClick={openCommandPalette} className="btn btn-ghost btn-icon md:hidden" aria-label="Open the command menu">
            <SearchIcon />
          </button>
          <ThemeButton className="min-[75rem]:hidden" />
          <Link href="/#contact" className="btn btn-primary btn-sm ml-1 hidden sm:inline-flex">
            Let’s talk
            <ArrowRightIcon className="btn-arrow size-3.5" />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="btn btn-ghost btn-icon lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => (open ? close() : setOpen(true))}
          >
            <span className="relative block size-[18px]">
              <MenuIcon className={`absolute inset-0 transition-[opacity,rotate] duration-300 ${open ? "rotate-90 opacity-0" : "opacity-100"}`} />
              <CloseIcon className={`absolute inset-0 transition-[opacity,rotate] duration-300 ${open ? "opacity-100" : "-rotate-90 opacity-0"}`} />
            </span>
          </button>
        </div>

        <div
          id="mobile-menu"
          hidden={!open}
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] origin-top rounded-xl border border-line bg-raised p-2 shadow-lg motion-safe:animate-[menu-in_380ms_var(--ease-spring)] lg:hidden"
        >
          <nav aria-label="Mobile">
            <ul>
              {[...navigation, { label: "Contact", href: "/#contact", id: "contact" }].map((item, index) => (
                <li key={item.id} className="motion-safe:animate-[rise-in_420ms_var(--ease-out)_both]" style={{ animationDelay: `${60 + index * 40}ms` }}>
                  <Link
                    href={item.href}
                    onClick={() => close(false)}
                    className="type-title flex min-h-14 items-center justify-between rounded-lg px-4 text-xl text-ink transition-colors hover:bg-sunken"
                  >
                    {item.label}
                    <ArrowRightIcon className="size-4 text-ink-3" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center gap-1.5 border-t border-line px-2 pt-3 pb-1.5">
              <ThemeButton />
              <button
                type="button"
                onClick={() => setSoundOn(!soundOn)}
                className="btn btn-ghost btn-icon"
                aria-label={soundOn ? "Turn interface sounds off" : "Turn interface sounds on"}
              >
                {soundOn ? <SoundOnIcon /> : <SoundOffIcon />}
              </button>
              <a href={site.socials.github.href} target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon" aria-label="GitHub (opens in a new tab)">
                <GitHubIcon />
              </a>
              <a href={site.socials.linkedin.href} target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon" aria-label="LinkedIn (opens in a new tab)">
                <LinkedInIcon />
              </a>
              <Link href="/#contact" onClick={() => close(false)} className="btn btn-primary btn-sm ml-auto">
                Let’s talk
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <PlumbCord className="hidden min-[75rem]:block" showHint={!scrolled && pathname !== "/play"} />
    </header>
  );
}
