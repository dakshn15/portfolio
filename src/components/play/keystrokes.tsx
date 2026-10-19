"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { pentatonic, playBell, playKey, primeAudio } from "@/lib/sound";
import type { GameProps } from "./game-types";

/** Real lines from the projects on this site, copied exactly. */
const snippets = [
  { code: "return bookingTransitions[from]?.includes(to) ?? false;", project: "WayPoint", file: "lib/booking-rules.ts" },
  { code: "router.post('/', protect, createBooking);", project: "PetCare", file: "backend/routes/bookings.js" },
  { code: "const tax = +(subtotal * TAX_RATE).toFixed(2);", project: "Techzonix", file: "src/components/Checkout/Checkout.jsx" },
  { code: "if (!resumeText || !jobDescription) {", project: "Rezumely", file: "server/src/controllers/job.controller.ts" },
  { code: "const parsed = generatedTripSchema.safeParse(candidate);", project: "WayPoint", file: "lib/ai.ts" },
  { code: "router.put('/:id/approve', protect, authorize('admin'), approveBooking);", project: "PetCare", file: "backend/routes/bookings.js" },
  { code: "return <Navigate to=\"/login\" state={{ from: location }} replace />;", project: "Techzonix", file: "src/components/Auth/RequireAuth.jsx" },
  { code: "const commissionAmount = input.grossAmount * commissionRate;", project: "WayPoint", file: "app/actions/payout-actions.ts" },
  { code: "router.use(optionalAuthToken);", project: "Rezumely", file: "server/src/routes/ai.routes.ts" },
  { code: "const shipping = form.delivery === \"express\" ? 5.99 : 0;", project: "Techzonix", file: "src/components/Checkout/Checkout.jsx" },
  { code: "totalAmount = Number(pkg.basePrice) * input.travelers.length;", project: "WayPoint", file: "app/actions/bookings.ts" },
  { code: "const netAmount = input.grossAmount - commissionAmount;", project: "WayPoint", file: "app/actions/payout-actions.ts" },
];

type Run = { typed: string; startedAt: number | null; finishedAt: number | null; keystrokes: number; mistakes: number };
const fresh: Run = { typed: "", startedAt: null, finishedAt: null, keystrokes: 0, mistakes: 0 };

function wordsPerMinute(chars: number, ms: number) {
  return ms > 0 ? Math.round(chars / 5 / (ms / 60000)) : 0;
}

/** Keystrokes: type a real line of code from my projects, against the clock. */
export function Keystrokes({ immersive, report, finish }: GameProps) {
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState<Run>(fresh);
  const [now, setNow] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const snippet = snippets[index];
  const target = snippet.code;
  const done = run.finishedAt !== null;

  // A ticking clock while a line is in progress.
  useEffect(() => {
    if (run.startedAt === null || done) return;
    const id = window.setInterval(() => setNow(performance.now()), 200);
    return () => window.clearInterval(id);
  }, [run.startedAt, done]);

  const elapsed = run.startedAt === null ? 0 : (run.finishedAt ?? now) - run.startedAt;
  const correct = [...run.typed].filter((char, i) => char === target[i]).length;
  const wpm = wordsPerMinute(done ? target.length : correct, elapsed);
  const accuracy = run.keystrokes ? Math.round(((run.keystrokes - run.mistakes) / run.keystrokes) * 100) : 100;

  useEffect(() => {
    report([
      { label: "Speed", value: `${wpm} wpm` },
      { label: "Accuracy", value: `${accuracy}%` },
      { label: "Line", value: `${index + 1} of ${snippets.length}` },
    ]);
  }, [wpm, accuracy, index, report]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (done) return;
    const value = event.target.value.slice(0, target.length);
    const startedAt = run.startedAt ?? performance.now();
    let { keystrokes, mistakes } = run;
    for (let i = run.typed.length; i < value.length; i++) {
      keystrokes += 1;
      const wrong = value[i] !== target[i];
      if (wrong) mistakes += 1;
      playKey(wrong);
    }
    const finishedAt = value === target ? performance.now() : null;
    setRun({ typed: value, startedAt, finishedAt, keystrokes, mistakes });
    if (finishedAt !== null) {
      const final = wordsPerMinute(target.length, finishedAt - startedAt);
      const finalAccuracy = Math.round(((keystrokes - mistakes) / keystrokes) * 100);
      playBell(pentatonic(7), 0.2, 1.6);
      finish({ score: final, detail: `${snippet.project}, ${finalAccuracy}% accurate` });
    }
  };

  const next = () => {
    setIndex((current) => (current + 1) % snippets.length);
    setRun(fresh);
    inputRef.current?.focus();
  };

  const restart = () => {
    setRun(fresh);
    inputRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    primeAudio();
    if (event.key === "Enter" && done) {
      event.preventDefault();
      next();
    }
  };

  return (
    <div className={immersive ? "mx-auto flex w-full max-w-[56rem] flex-1 flex-col justify-center" : ""}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-ink-3">
        <p>
          From <span className="text-ink">{snippet.project}</span>, <span className="font-mono text-[0.8125rem]">{snippet.file}</span>
        </p>
        <p className="tabular-nums">
          Line {index + 1} of {snippets.length}
        </p>
      </div>

      <div className="relative mt-3 rounded-lg border border-line bg-sunken p-5 transition-[border-color,box-shadow] duration-200 focus-within:border-accent focus-within:shadow-[0_0_0_4px_var(--accent-soft)] sm:p-7">
        <p
          aria-hidden
          className={`font-mono leading-relaxed [overflow-wrap:anywhere] ${immersive ? "text-[clamp(1rem,0.8rem+1vw,1.5rem)]" : "text-[0.9375rem] sm:text-base"}`}
        >
          {[...target].map((char, i) => {
            const typedChar = run.typed[i];
            const state = typedChar === undefined ? "todo" : typedChar === char ? "ok" : "bad";
            const isCaret = i === run.typed.length && !done;
            return (
              <span
                key={i}
                className={`relative ${
                  state === "ok" ? "text-ink" : state === "bad" ? "rounded-[2px] bg-danger/15 text-danger" : "text-ink-3/70"
                } ${isCaret ? "in-focus-within:before:absolute in-focus-within:before:inset-y-0.5 in-focus-within:before:-left-px in-focus-within:before:w-[2px] in-focus-within:before:bg-accent in-focus-within:before:content-[''] motion-safe:in-focus-within:before:animate-[blink_1.1s_steps(1)_infinite]" : ""}`}
              >
                {state === "bad" && char === " " ? "·" : char}
              </span>
            );
          })}
        </p>
        <label className="sr-only" htmlFor="keystrokes-input">
          Type this line of code: {target}
        </label>
        <input
          id="keystrokes-input"
          ref={inputRef}
          data-game-focus
          value={run.typed}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onPaste={(event) => event.preventDefault()}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="absolute inset-0 size-full cursor-text text-base opacity-0"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {done ? (
          <>
            <button type="button" onClick={next} className="btn btn-primary btn-sm">
              Next line
            </button>
            <button type="button" onClick={restart} className="btn btn-ghost btn-sm">
              Try this one again
            </button>
            <p aria-live="polite" className="text-sm text-ink-2">
              {wpm} wpm at {accuracy}% accuracy. Press Enter for the next line.
            </p>
          </>
        ) : (
          <>
            <button type="button" onClick={() => inputRef.current?.focus()} className="btn btn-secondary btn-sm">
              {run.startedAt === null ? "Start typing" : "Keep going"}
            </button>
            {run.startedAt !== null ? (
              <button type="button" onClick={restart} className="btn btn-ghost btn-sm">
                Start the line again
              </button>
            ) : null}
            <button type="button" onClick={next} className="btn btn-ghost btn-sm">
              Skip this line
            </button>
          </>
        )}
      </div>
    </div>
  );
}
