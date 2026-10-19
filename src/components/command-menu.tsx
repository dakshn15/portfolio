"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { games } from "@/content/games";
import { caseStudies } from "@/content/projects";
import { site } from "@/content/site";
import { isSoundOn, setSoundOn, subscribeSound } from "@/lib/sound";
import { toggleTheme, useTheme } from "@/lib/theme";
import { jumpTo } from "@/lib/anchor";
import { copyText } from "@/lib/toast";
import { BrandMark, CopyIcon, CornerIcon, GitHubIcon, LinkedInIcon, MailIcon, MoonIcon, PlayIcon, SearchIcon, SoundOffIcon, SoundOnIcon, SunIcon } from "./icons";
import { Toaster } from "./toaster";

type Command = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  icon: ReactNode;
  run: () => void;
};

const sections = [
  { id: "top", label: "Home", keywords: "top hero start" },
  { id: "work", label: "Selected work", keywords: "projects case studies portfolio" },
  { id: "services", label: "Services", keywords: "hire freelance build offer" },
  { id: "process", label: "How I work", keywords: "process workflow steps" },
  { id: "stack", label: "Stack and tools", keywords: "skills technologies tech" },
  { id: "experience", label: "Experience and education", keywords: "work history job workdo resume cv education degree" },
  { id: "about", label: "About", keywords: "bio story principles" },
  { id: "contact", label: "Contact", keywords: "email hire message talk" },
];

/**
 * The command menu itself: every section, case study, game and action,
 * searchable. Loaded the first time the menu is opened (see command-palette.tsx).
 */
export function CommandMenu({ startOpen = false }: { startOpen?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const soundOn = useSyncExternalStore(subscribeSound, isSoundOn, () => true);

  const close = useCallback(() => dialogRef.current?.close(), []);
  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    setActiveIndex(0);
    dialog.showModal();
    inputRef.current?.focus();
  }, []);

  const goTo = useCallback(
    (id: string) => {
      if (pathname === "/") {
        if (id === "top") window.scrollTo({ top: 0 });
        else jumpTo(id);
        history.replaceState(null, "", id === "top" ? "/" : `/#${id}`);
      } else {
        router.push(id === "top" ? "/" : `/#${id}`);
      }
    },
    [pathname, router],
  );

  const commands = useMemo<Command[]>(() => {
    const center = () => ({ x: window.innerWidth / 2, y: window.innerHeight / 3 });
    return [
      ...sections.map((section) => ({
        id: `go-${section.id}`,
        group: "Go to",
        label: section.label,
        keywords: section.keywords,
        icon: <CornerIcon />,
        run: () => goTo(section.id),
      })),
      {
        id: "go-play",
        group: "Go to",
        label: "Playground",
        hint: "Games",
        keywords: "play games fun stack typing memory chimes",
        icon: <CornerIcon />,
        run: () => router.push("/play"),
      },
      ...games.map((game) => ({
        id: `game-${game.slug}`,
        group: "Games",
        label: game.name,
        hint: game.genre,
        keywords: `play game ${game.tagline}`,
        icon: <PlayIcon />,
        run: () => router.push(`/play/${game.slug}`),
      })),
      ...caseStudies.map((study) => ({
        id: `study-${study.slug}`,
        group: "Case studies",
        label: study.name,
        hint: study.type,
        keywords: `${study.tagline} ${study.stack.flatMap((group) => group.items).join(" ")}`,
        icon: <BrandMark size={20} id={`mark-${study.slug}`} />,
        run: () => router.push(`/work/${study.slug}`),
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: site.email,
        keywords: "contact mail",
        icon: <CopyIcon />,
        run: () => void copyText(site.email, "Email address copied"),
      },
      {
        id: "theme",
        group: "Actions",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        keywords: "theme dark light mode appearance",
        icon: theme === "dark" ? <SunIcon /> : <MoonIcon />,
        run: () => toggleTheme(center()),
      },
      {
        id: "sound",
        group: "Actions",
        label: soundOn ? "Turn interface sounds off" : "Turn interface sounds on",
        keywords: "sound audio mute click",
        icon: soundOn ? <SoundOffIcon /> : <SoundOnIcon />,
        run: () => setSoundOn(!soundOn),
      },
      {
        id: "email",
        group: "Elsewhere",
        label: "Send an email",
        hint: site.email,
        icon: <MailIcon />,
        run: () => {
          window.location.href = `mailto:${site.email}`;
        },
      },
      {
        id: "github",
        group: "Elsewhere",
        label: "GitHub",
        hint: `@${site.socials.github.handle}`,
        keywords: "code source repositories",
        icon: <GitHubIcon />,
        run: () => window.open(site.socials.github.href, "_blank", "noopener,noreferrer"),
      },
      {
        id: "linkedin",
        group: "Elsewhere",
        label: "LinkedIn",
        hint: site.socials.linkedin.handle,
        keywords: "profile resume connect",
        icon: <LinkedInIcon />,
        run: () => window.open(site.socials.linkedin.href, "_blank", "noopener,noreferrer"),
      },
    ];
  }, [goTo, router, soundOn, theme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.hint ?? ""} ${command.keywords ?? ""} ${command.group}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Global shortcut and the header button's event.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", open);
    };
  }, [close, open]);

  // Opened by the shortcut or button that loaded this module.
  useEffect(() => {
    if (startOpen) open();
  }, [startOpen, open]);

  // Keep the active option in view.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const execute = useCallback(
    (command: Command | undefined) => {
      if (!command) return;
      dialogRef.current?.close();
      command.run();
    },
    [],
  );

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      execute(results[activeIndex]);
    } else if (event.key === "Home") {
      setActiveIndex(0);
    } else if (event.key === "End") {
      setActiveIndex(Math.max(0, results.length - 1));
    }
  };

  let lastGroup = "";

  return (
    <>
      <dialog
        ref={dialogRef}
        aria-label="Command menu"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        className="fixed inset-x-0 top-[12vh] m-0 mx-auto w-[min(40rem,calc(100%-2rem))] overflow-hidden rounded-xl border border-line-strong bg-raised p-0 text-ink shadow-lg backdrop:bg-[rgb(0_0_0/0.5)] backdrop:backdrop-blur-sm open:motion-safe:animate-[rise-in_220ms_var(--ease-out)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <SearchIcon className="size-5 shrink-0 text-ink-3" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[activeIndex] ? `palette-${results[activeIndex].id}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            placeholder="Jump to a section, case study, or action…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            className="h-14 w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-3"
          />
          <kbd className="key hidden sm:inline-grid">Esc</kbd>
        </div>

        <div
          ref={listRef}
          id="palette-list"
          role="listbox"
          aria-label="Commands"
          onClick={(event) => {
            const option = (event.target as HTMLElement).closest<HTMLElement>("[data-index]");
            if (option) execute(results[Number(option.dataset.index)]);
          }}
          className="max-h-[min(26rem,60vh)] overflow-y-auto overscroll-contain p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-ink-3">Nothing matches “{query}”. Try “email” or “WayPoint”.</p>
          ) : (
            results.map((command, index) => {
              const showGroup = command.group !== lastGroup;
              lastGroup = command.group;
              const active = index === activeIndex;
              return (
                <div key={command.id}>
                  {showGroup ? <p className="px-3 pt-3 pb-1.5 text-xs text-ink-3">{command.group}</p> : null}
                  <div
                    id={`palette-${command.id}`}
                    role="option"
                    aria-selected={active}
                    data-index={index}
                    onMouseMove={() => setActiveIndex(index)}
                    className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-sm transition-colors duration-100 ${
                      active ? "bg-accent-soft text-ink" : "text-ink-2"
                    }`}
                  >
                    <span className={`flex size-5 shrink-0 items-center justify-center ${active ? "text-accent" : "text-ink-3"}`}>
                      {command.icon}
                    </span>
                    <span className="truncate">{command.label}</span>
                    {command.hint ? <span className="ml-auto truncate pl-4 text-xs text-ink-3">{command.hint}</span> : null}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-ink-3 sm:flex">
          <span className="flex items-center gap-1.5">
            <kbd className="key">↑</kbd>
            <kbd className="key">↓</kbd> to move
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="key">↵</kbd> to open
          </span>
          <span className="ml-auto">{site.name}</span>
        </div>
      </dialog>
      <Toaster />
    </>
  );
}
