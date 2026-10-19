/**
 * Everything personal on the site lives here. Change a value once and every
 * page and the metadata pick it up. The social images in public/og are
 * pictures, so they need making again if the headline facts change.
 */
export const site = {
  name: "Daksh Nimavat",
  role: "Full-Stack Developer",
  location: "Surat, Gujarat, India",
  city: "Surat",
  country: "India",
  experience: "3+ years",
  /** Shown in the hero and contact section. Set to null to hide it. */
  availability: "Open to new roles and freelance projects" as string | null,
  employer: { name: "WorkDo Solutions", title: "Web Developer", since: "Oct 2023" },
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  description:
    "Full-stack developer in Surat, India, and web developer at WorkDo Solutions. I build complete web products with Next.js, React, Node.js, Express, PostgreSQL and MongoDB, from the database to the interface.",
  email: "dakshnimavat15@gmail.com",
  /** Add a link to a hosted PDF to show a résumé link in the header and contact section. */
  resumeUrl: null as string | null,
  socials: {
    github: { label: "GitHub", handle: "dakshn15", href: "https://github.com/dakshn15" },
    linkedin: { label: "LinkedIn", handle: "daksh15", href: "https://www.linkedin.com/in/daksh15" },
  },
} as const;

/**
 * EmailJS delivers the contact form to the inbox. The public key is designed
 * to be used in the browser. The values the form sends, and the email templates
 * that use them, are in docs/email-templates. Override per environment with
 * NEXT_PUBLIC_EMAILJS_* variables.
 */
export const emailjs = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "service_tsmiwiu",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "template_718vlpi",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "MDfzRBGHjb0mBShG3",
};

/** Main navigation. Items with `page` link to their own page rather than a home section. */
export const navigation: { label: string; href: string; id: string; page?: boolean }[] = [
  { label: "Work", href: "/#work", id: "work" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Play", href: "/play", id: "play", page: true },
];
