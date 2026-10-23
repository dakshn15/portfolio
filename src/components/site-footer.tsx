import Link from "next/link";
import { caseStudies } from "@/content/projects";
import { navigation, site } from "@/content/site";
import { ShortcutKeys } from "./command-palette";
import { BrandMark } from "./icons";
import { SoundToggle } from "./sound-toggle";
import { ThemeButton } from "./theme-switch";

const linkClass = "inline-flex min-h-9 items-center text-base text-ink-2 md:text-sm transition-colors duration-200 hover:text-ink md:min-h-9";

export function SiteFooter() {
  return (
    <footer id="site-footer" className="relative overflow-hidden border-t border-line" data-skippable style={{ "--cis-sm": "650px", "--cis-md": "740px", "--cis-lg": "550px" } as React.CSSProperties}>
      <div className="shell grid grid-cols-1 gap-9 pt-12 pb-8 md:gap-12 md:pt-20 md:pb-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Link href="/" className="inline-flex items-center gap-3 text-ink" aria-label={`${site.name}, home`}>
            <BrandMark size={40} id="mark-footer" />
            <span className="type-title text-lg">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-[22rem] text-ink-2 md:mt-5">Full-stack developer in {site.city}, {site.country}. I build web apps, from the database to the screen.</p>
          <div className="mt-5 flex flex-wrap items-center gap-2 md:mt-6">
            <SoundToggle />
            <ThemeButton className="border border-line" />
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-3 gap-x-4 gap-y-7 sm:gap-x-6 md:gap-8 lg:col-span-7">
          {[
            { title: "Site", links: [...navigation, { label: "Contact", href: "/#contact", id: "contact" }].map((item) => ({ label: item.label, href: item.href })) },
            { title: "Case studies", links: caseStudies.map((study) => ({ label: study.name, href: `/work/${study.slug}` })) },
          ].map((group) => (
            <div key={group.title}>
              <h2 className="text-xs text-ink-3">{group.title}</h2>
              <ul className="mt-2 md:mt-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link className={linkClass} href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="text-xs text-ink-3">Elsewhere</h2>
            <ul className="mt-2 md:mt-3">
              <li>
                <a className={linkClass} href={`mailto:${site.email}`}>
                  Email
                </a>
              </li>
              <li>
                <a className={linkClass} href={site.socials.linkedin.href} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a className={linkClass} href={site.socials.github.href} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Signature: the name, set large and cropped by the page edge. */}
      <div aria-hidden className="shell select-none">
        <p className="type-display translate-y-[16%] bg-gradient-to-b from-ink/16 to-transparent bg-clip-text text-center text-[clamp(2rem,9.4vw,8.6rem)] leading-[0.8] whitespace-nowrap text-transparent">
          {site.name}
        </p>
      </div>

      <div className="relative border-t border-line bg-bg">
        <div className="shell flex flex-col gap-2 py-5 text-sm text-ink-3 md:gap-3 md:py-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Designed and coded by me.
          </p>
          <p className="flex flex-wrap items-center gap-2">
            {/* Keyboard hint only where there is likely a keyboard. */}
            <span className="inline-flex items-center gap-2 [@media(hover:none)]:hidden">
              Press <ShortcutKeys /> to jump anywhere
            </span>
            <a href="#main" className="link ml-3 [@media(hover:none)]:ml-0">
              Back to top
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
