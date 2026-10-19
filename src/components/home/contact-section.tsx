import { site } from "@/content/site";
import { ContactForm } from "../contact/contact-form";
import { CopyEmail } from "../contact/copy-email";
import { GitHubIcon, LinkedInIcon } from "../icons";
import { LocalTime } from "../local-time";

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20" data-skippable style={{ "--cis-sm": "1290px", "--cis-md": "1180px", "--cis-lg": "740px" } as React.CSSProperties}>
      <div className="shell pb-20 md:pb-24">
        <div className="reveal relative isolate overflow-hidden rounded-[26px] border border-white/10 bg-[#0f1013] sm:rounded-[32px] text-white shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)]">
          {/* Blueprint grid and a soft light, fixed dark in both themes. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 [background-image:linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_80%_at_20%_20%,#000,transparent_75%)]"
          />
          <div aria-hidden className="absolute -top-40 -left-24 -z-10 size-[34rem] rounded-full bg-[radial-gradient(circle,rgb(130_180_255/0.22),transparent_65%)]" />

          <div className="grid grid-cols-1 gap-x-12 gap-y-12 p-5 sm:p-10 lg:grid-cols-12 lg:p-14">
            <div className="flex min-w-0 flex-col lg:col-span-5">
              <p className="type-hand text-lg text-[#9cc2ff]" aria-hidden>
                say hello
              </p>
              <h2 id="contact-title" className="type-display mt-3 text-[clamp(2.25rem,1.8rem+1.2vw,2.75rem)] leading-[1.04] text-balance text-white">
                Let’s talk.
              </h2>
              <p className="mt-5 max-w-[26rem] text-[1.0625rem] leading-relaxed text-white/70">
                If you’re hiring or have a project in mind, send me a message. I’ll reply with a few questions, or a
                time to talk.
              </p>

              <div className="mt-9 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-white/55">Email</p>
                {/* On the narrowest phones the copy button wraps under the address instead of truncating it. */}
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
                  <a href={`mailto:${site.email}`} className="type-title max-w-full min-w-0 truncate text-[0.9375rem] text-white underline sm:text-lg decoration-white/25 underline-offset-4 transition-[text-decoration-color] hover:decoration-white">
                    {site.email}
                  </a>
                  <CopyEmail email={site.email} tone="dark" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <a href={site.socials.linkedin.href} target="_blank" rel="noreferrer" className="btn btn-sm border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]">
                  <LinkedInIcon className="size-4" /> LinkedIn
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <a href={site.socials.github.href} target="_blank" rel="noreferrer" className="btn btn-sm border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]">
                  <GitHubIcon className="size-4" /> GitHub
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>

              <p className="mt-auto pt-10 text-sm text-white/55">
                {site.city}, {site.country}. <LocalTime withOffset />
              </p>
            </div>

            <div className="min-w-0 lg:col-span-7">
              <div className="rounded-xl border border-line bg-raised p-5 text-ink shadow-[var(--highlight),0_30px_60px_-30px_rgb(0_0_0/0.7)] sm:p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
