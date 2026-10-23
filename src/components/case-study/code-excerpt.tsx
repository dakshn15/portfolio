import type { ReactNode } from "react";
import type { CodeExcerpt as Excerpt } from "@/content/projects";

// A deliberately small highlighter: comments, strings, keywords, and numbers.
// It runs on the server at build time, so excerpts ship as plain HTML.
const TOKEN =
  /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(const|let|function|async|await|return|if|else|for|try|catch|throw|new|export|import|from|typeof|continue|true|false|null|undefined|readonly)\b|\b(\d[\d_]*(?:\.\d+)?)\b/g;

const tokenClass = ["text-[#7f8b87] italic", "text-[#8fd6c4]", "text-[#a9b8ff]", "text-[#f0b56d]"];

function highlight(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of code.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(code.slice(last, index));
    const kind = [1, 2, 3, 4].findIndex((group) => match[group] !== undefined);
    nodes.push(
      <span key={index} className={tokenClass[kind]}>
        {match[0]}
      </span>,
    );
    last = index + match[0].length;
  }
  if (last < code.length) nodes.push(code.slice(last));
  return nodes;
}

export function CodeExcerpt({ excerpt }: { excerpt: Excerpt }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-[#131417] text-[#e6e6e8] shadow-md">
      <figcaption className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-2.5 text-xs text-white/60">
        <code translate="no" className="truncate">
          {excerpt.file}
        </code>
        <span className="shrink-0">{excerpt.language === "ts" ? "TypeScript" : "JavaScript"}</span>
      </figcaption>
      <pre className="overflow-x-auto overscroll-x-contain p-[15px] font-mono text-xs leading-relaxed sm:p-5" tabIndex={0}>
        <code translate="no">{highlight(excerpt.code)}</code>
      </pre>
    </figure>
  );
}
