import type { MetadataRoute } from "next";
import { games } from "@/content/games";
import { caseStudies } from "@/content/projects";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: new URL("/", siteUrl).toString(), changeFrequency: "monthly", priority: 1 },
    { url: new URL("/play", siteUrl).toString(), changeFrequency: "yearly", priority: 0.4 },
    ...games.map((game) => ({ url: new URL(`/play/${game.slug}`, siteUrl).toString(), changeFrequency: "yearly" as const, priority: 0.3 })),
    ...caseStudies.map((study) => ({
      url: new URL(`/work/${study.slug}`, siteUrl).toString(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
