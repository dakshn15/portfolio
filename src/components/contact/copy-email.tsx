"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "../icons";

export function CopyEmail({ email, tone = "light" }: { email: string; tone?: "light" | "dark" }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors sm:size-11 max-sm:[&>svg]:size-4 ${
          tone === "dark" ? "border-white/15 text-white/70 hover:border-white/45 hover:text-white" : "border-line-strong text-ink-2 hover:border-ink hover:text-ink"
        }`}
        aria-label="Copy email address"
        title="Copy email address"
      >
        {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </>
  );
}
