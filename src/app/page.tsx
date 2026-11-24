import type { Metadata } from "next";
import { getPortfolioData } from "@/lib/portfolio-data";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Achievements from "@/components/sections/Achievements";
import Research from "@/components/sections/Research";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Syed Unais Panjathan | AI Engineer & Machine Learning Developer",
  description:
    "Explore the portfolio of Syed Unais Panjathan, an AI Engineer and Machine Learning Developer building intelligent applications, Generative AI systems, LLM-powered solutions, and innovative software projects.",
  alternates: {
    canonical: "https://unais.vercel.app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": "https://unais.vercel.app/#webpage",
      url: "https://unais.vercel.app",
      name: "Syed Unais Panjathan | AI Engineer & Machine Learning Developer",
      description:
        "Portfolio of Syed Unais Panjathan, an AI Engineer and Machine Learning Developer specialising in Generative AI, LLM applications, and Applied AI engineering.",
      inLanguage: "en-US",
      isPartOf: {
        "@id": "https://unais.vercel.app/#website",
      },
      mainEntity: {
        "@id": "https://unais.vercel.app/#person",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://unais.vercel.app/#website",
      url: "https://unais.vercel.app",
      name: "Syed Unais Panjathan",
      description:
        "Personal portfolio and professional profile of Syed Unais Panjathan — AI Engineer and Machine Learning Developer.",
      inLanguage: "en-US",
      publisher: {
        "@id": "https://unais.vercel.app/#person",
      },
    },
    {
      "@type": "Person",
      "@id": "https://unais.vercel.app/#person",
      name: "Syed Unais Panjathan",
      alternateName: ["Unais Panjathan", "Syed Unais", "Unais"],
      url: "https://unais.vercel.app",
      jobTitle: "AI Engineer",
      description:
        "Syed Unais Panjathan is an AI Engineer and Machine Learning Developer with expertise in Generative AI, Large Language Models, Applied AI engineering, MLOps, and intelligent software development.",
      knowsAbout: [
        "Artificial Intelligence",
        "Machine Learning",
        "Generative AI",
        "Large Language Models",
        "Applied AI Engineering",
        "MLOps",
        "AI-powered Applications",
        "Software Development",
        "Natural Language Processing",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hyderabad",
        addressCountry: "IN",
      },
      sameAs: [],
    },
  ],
};

export default async function Home() {
  const {
    projects,
    skills,
    experiences,
    education,
    achievements,
    profile,
    researchPapers,
    certifications,
    heroSettings,
    fromFallback,
  } = await getPortfolioData();

  if (fromFallback) {
    console.warn(
      "[Home] Serving last-known-good cached content — Supabase may be unavailable."
    );
  }

  // Collect verified social links from the actual profile record
  const sameAs: string[] = [];
  if (profile?.linkedinUrl) sameAs.push(profile.linkedinUrl);
  if (profile?.githubUrl) sameAs.push(profile.githubUrl);
  if (profile?.twitterUrl) sameAs.push(profile.twitterUrl);

  const enrichedJsonLd = {
    ...jsonLd,
    "@graph": jsonLd["@graph"].map((node) => {
      if (node["@type"] === "Person") {
        return {
          ...node,
          sameAs: sameAs.length > 0 ? sameAs : undefined,
          ...(profile?.email ? { email: profile.email } : {}),
        };
      }
      return node;
    }),
  };

  const visibleSections = [
    { id: "hero", Component: Hero, props: { heroSettings } },
    { id: "about", Component: About, props: { profile } },
    {
      id: "projects",
      Component: Projects,
      props: { projects },
      isVisible: projects.length > 0,
    },
    {
      id: "skills",
      Component: Skills,
      props: { skills },
      isVisible: skills.length > 0,
    },
    {
      id: "experience",
      Component: Experience,
      props: { experiences },
      isVisible: experiences.length > 0,
    },
    {
      id: "education",
      Component: Education,
      props: { education },
      isVisible: education.length > 0,
    },
    {
      id: "achievements",
      Component: Achievements,
      props: { achievements },
      isVisible: achievements.length > 0,
    },
    {
      id: "research",
      Component: Research,
      props: { researchPapers },
      isVisible: researchPapers.length > 0,
    },
    {
      id: "certifications",
      Component: Certifications,
      props: { certifications },
      isVisible: certifications.length > 0,
    },
    { id: "contact", Component: Contact, props: { profile } },
  ].filter((section) => section.isVisible !== false);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(enrichedJsonLd) }}
      />

      <main className="bg-background text-white selection:bg-neon-purple/30">
        {visibleSections.map((section, index) => {
          const isEven = index % 2 === 0;
          const bgClass = isEven ? "bg-transparent" : "bg-black/20";
          const { Component, props } = section;
          // Cast Component to any to avoid strict union type mismatches in this dynamic rendering pattern
          const SectionComponent = Component as any;
          return (
            <SectionComponent key={section.id} {...props} className={bgClass} />
          );
        })}
      </main>
    </>
  );
}
