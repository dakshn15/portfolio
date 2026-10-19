import type { Metadata, Viewport } from "next";
import { Archivo, Fragment_Mono, Kalam } from "next/font/google";
import { CommandPalette } from "@/components/command-palette";
import { Motion } from "@/components/motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import { THEME_COLORS, themeBootScript } from "@/lib/theme-constants";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment-mono",
  display: "swap",
});

// Handwritten notes only. Kalam is by the Indian Type Foundry.
const kalam = Kalam({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kalam",
  display: "swap",
  preload: false,
});

const title = `${site.name} | ${site.role}`;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  keywords: [
    "Daksh Nimavat",
    "Full-Stack Developer",
    "Next.js developer",
    "React developer",
    "Node.js developer",
    "MERN stack developer",
    "SaaS developer",
    "Surat",
    "India",
  ],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: "/og/home.jpg", width: 1200, height: 630, alt: `${site.name}, ${site.role}` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/og/home.jpg"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${fragmentMono.variable} ${kalam.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content={THEME_COLORS.light} />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="btn btn-primary fixed top-3 left-3 z-[60] -translate-y-24 focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <div
          aria-hidden
          className="pointer-events-none fixed inset-y-0 left-1/2 hidden w-full max-w-[78rem] -translate-x-1/2 border-x border-line xl:block"
        />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="pt-[4.75rem] outline-none">
          {children}
        </main>
        <SiteFooter />
        <CommandPalette />
        <Motion />
      </body>
    </html>
  );
}
