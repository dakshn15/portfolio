/**
 * Absolute base URL for metadata, the sitemap, and social images.
 * Set NEXT_PUBLIC_SITE_URL once a custom domain is attached; on Vercel the
 * production domain is picked up automatically otherwise.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);
