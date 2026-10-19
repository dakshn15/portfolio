import type { LayerId } from "./layers";

export type Service = {
  title: string;
  pitch: string;
  includes: string[];
  layers: LayerId[];
  /** Case studies that show this kind of work. */
  seenIn: string[];
};

/** What clients can hire me to build. */
export const services: Service[] = [
  {
    title: "SaaS & web applications",
    pitch:
      "Products with accounts, roles, payments and the dashboards behind them. I usually build these with Next.js or React and a Node.js API.",
    includes: ["Authentication and role-based access", "Customer and admin dashboards", "Validated REST APIs", "Payments and email"],
    layers: ["interface", "api", "auth", "ai", "data"],
    seenIn: ["waypoint", "rezumely"],
  },
  {
    title: "Business systems",
    pitch:
      "ERP modules, booking flows and internal tools that replace spreadsheets. I start from how the business really works and build around that.",
    includes: ["Booking and scheduling flows", "Role-based back offices", "Reporting dashboards", "Audit trails"],
    layers: ["interface", "api", "auth", "data"],
    seenIn: ["petcare", "waypoint"],
  },
  {
    title: "APIs & integrations",
    pitch:
      "REST APIs and the code that connects systems: payment gateways, email and webhooks, set up so that when something fails, someone finds out.",
    includes: ["API design and validation", "Razorpay integration", "Signed, idempotent webhooks", "Transactional email"],
    layers: ["api", "auth", "ai", "data"],
    seenIn: ["waypoint", "petcare"],
  },
  {
    title: "AI features",
    pitch:
      "Gemini features inside real products, like writing help, job matching and generated trip plans. The output gets checked, and there’s always a fallback.",
    includes: ["Gemini integration", "Structured JSON output", "Validation and fallbacks", "Response caching"],
    layers: ["api", "ai"],
    seenIn: ["rezumely", "waypoint"],
  },
  {
    title: "Websites & Shopify themes",
    pitch:
      "Fast, responsive marketing sites and landing pages, plus Shopify theme development and customisation.",
    includes: ["Responsive layouts", "Performance and SEO basics", "Shopify theme work", "Reusable sections"],
    layers: ["interface"],
    seenIn: ["techzonix"],
  },
];

export type Step = { title: string; body: string; output: string };

/** How an engagement runs, in order. */
export const process: Step[] = [
  {
    title: "Discover",
    body: "I find out who’ll use it, what they need to get done and what “done” means, and write it down so nothing important lives only in a call.",
    output: "A scope we’ve both read",
  },
  {
    title: "Plan",
    body: "Data model, API, roles and screens, planned before the code. Changing a plan is cheap. Changing a live database isn’t.",
    output: "Schema, API outline and flows",
  },
  {
    title: "Build in slices",
    body: "One feature at a time, all the way from the database to the screen, so there’s always something working you can try.",
    output: "Working software, early",
  },
  {
    title: "Launch & hand over",
    body: "Deployment, environment setup and a codebase with notes, so the next feature, or the next developer, can pick it up easily.",
    output: "A product you can run and extend",
  },
];
