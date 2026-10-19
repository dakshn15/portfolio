import type { ToolIconId } from "@/content/tool-icons";

// Most specific names first, so "React Router" isn't mistaken for "React".
const matchers: [RegExp, ToolIconId][] = [
  [/react router/i, "reactrouter"],
  [/next\.?js/i, "nextjs"],
  [/react/i, "react"],
  [/typescript/i, "typescript"],
  [/javascript/i, "javascript"],
  [/tailwind/i, "tailwind"],
  [/bootstrap/i, "bootstrap"],
  [/node.?js/i, "node"],
  [/express/i, "express"],
  [/mongoose/i, "mongoose"],
  [/mongodb/i, "mongodb"],
  [/mysql/i, "mysql"],
  [/postgres/i, "postgresql"],
  [/prisma/i, "prisma"],
  [/gemini/i, "gemini"],
  [/razorpay/i, "razorpay"],
  [/vite/i, "vite"],
  [/jwt|json web token/i, "jwt"],
  [/better auth/i, "betterauth"],
  [/zod/i, "zod"],
  [/puppeteer/i, "puppeteer"],
  [/\bpwa\b|workbox/i, "pwa"],
  [/shopify/i, "shopify"],
];

/** Find a logo for a tool name, if we have one. */
export function toolIconFor(name: string): ToolIconId | undefined {
  return matchers.find(([pattern]) => pattern.test(name))?.[1];
}
