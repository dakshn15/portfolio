import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70dvh] flex-col justify-center py-24">
      <p className="text-sm text-ink-3">404</p>
      <h1 className="type-display mt-4 max-w-[14ch] text-3xl sm:text-display">This page doesn’t exist.</h1>
      <p className="mt-6 max-w-[34rem] text-lg text-ink-2">
        The link may be out of date. The case studies and contact details are all on the home page.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Go to the home page
        </Link>
        <Link href="/#work" className="btn btn-secondary">
          See selected work
        </Link>
      </div>
    </section>
  );
}
