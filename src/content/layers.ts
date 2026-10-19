import type { ToolIconId } from "./tool-icons";

/**
 * The five layers of a product, top to bottom: what people touch, down to
 * the data everything rests on. They drive the hero stack, the stack
 * section, and the layer strip on every case study, so a layer keeps its
 * colour and name wherever it appears.
 */
export const layerIds = ["interface", "api", "auth", "ai", "data"] as const;

export type LayerId = (typeof layerIds)[number];

export type Tool = { name: string; icon?: ToolIconId };

export type Layer = {
  id: LayerId;
  name: string;
  /** Short role, used on the hero stack labels. */
  short: string;
  /** What I build at this layer. */
  summary: string;
  tools: Tool[];
};

export const layers: Record<LayerId, Layer> = {
  interface: {
    id: "interface",
    name: "Interface",
    short: "What people see and touch",
    summary:
      "Responsive, accessible screens built from reusable components. Loading, empty and error states get designed too, not only the happy path.",
    tools: [
      { name: "Next.js", icon: "nextjs" },
      { name: "React", icon: "react" },
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Bootstrap", icon: "bootstrap" },
      { name: "HTML5", icon: "html" },
      { name: "CSS3", icon: "css" },
      { name: "Shopify", icon: "shopify" },
    ],
  },
  api: {
    id: "api",
    name: "API & logic",
    short: "Rules, routes, and workflows",
    summary:
      "REST APIs with clear contracts, validated input and error messages that actually help. This is where the business rules live: bookings, approvals, payouts.",
    tools: [
      { name: "Node.js", icon: "node" },
      { name: "Express.js", icon: "express" },
    ],
  },
  auth: {
    id: "auth",
    name: "Auth & access",
    short: "Who can do what",
    summary:
      "Sign-up, sessions and token refresh, with roles checked on the server, so admins, staff and customers each see only what they should.",
    tools: [
      { name: "JWT", icon: "jwt" },
      { name: "Better Auth", icon: "betterauth" },
    ],
  },
  ai: {
    id: "ai",
    name: "AI & integrations",
    short: "Models, payments, and services",
    summary:
      "Gemini features with structured output and fallbacks, plus the services real products depend on, like payments, email and webhooks.",
    tools: [
      { name: "Google Gemini", icon: "gemini" },
      { name: "Razorpay", icon: "razorpay" },
    ],
  },
  data: {
    id: "data",
    name: "Data",
    short: "The foundation underneath",
    summary:
      "Schemas shaped around how the product is used, with relations, indexes and constraints that keep the data right, even when two requests arrive at once.",
    tools: [
      { name: "MongoDB", icon: "mongodb" },
      { name: "MySQL", icon: "mysql" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Prisma ORM", icon: "prisma" },
    ],
  },
};

export const orderedLayers = layerIds.map((id) => layers[id]);

/** The tools around the code. Not a layer of the product, so it gets its own tab. */
export const workflow = {
  id: "workflow" as const,
  name: "Workflow",
  summary:
    "What I use around the code: Git and GitHub for every change, ChatGPT and Claude as everyday helpers, Postman to test APIs, Figma to read designs and Docker to run databases locally.",
  tools: [
    { name: "Git", icon: "git" },
    { name: "GitHub", icon: "github" },
    { name: "ChatGPT", icon: "openai" },
    { name: "Claude", icon: "claude" },
    { name: "VS Code", icon: "editor" },
    { name: "Postman", icon: "postman" },
    { name: "Figma", icon: "figma" },
    { name: "Docker", icon: "docker" },
  ] satisfies Tool[],
};
