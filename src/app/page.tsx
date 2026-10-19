import { AboutSection } from "@/components/home/about-section";
import { ContactSection } from "@/components/home/contact-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { Hero } from "@/components/home/hero";
import { ServicesSection } from "@/components/home/services-section";
import { StackSection } from "@/components/home/stack-section";
import { WorkSection } from "@/components/home/work-section";
import { SectionDivider } from "@/components/section-heading";
import { education, roles } from "@/content/career";
import { orderedLayers } from "@/content/layers";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: siteUrl.toString(),
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: "Gujarat", addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: roles[0].organisation },
  alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
  sameAs: [site.socials.github.href, site.socials.linkedin.href],
  knowsAbout: Array.from(new Set(orderedLayers.flatMap((layer) => layer.tools.map((tool) => tool.name)))),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <SectionDivider />
      <WorkSection />
      <SectionDivider />
      <ServicesSection />
      <SectionDivider />
      <StackSection />
      <SectionDivider />
      <ExperienceSection />
      <SectionDivider />
      <AboutSection />
      <ContactSection />
    </>
  );
}
