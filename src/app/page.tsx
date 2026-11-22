import { getPortfolioData } from '@/lib/portfolio-data';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import Achievements from '@/components/sections/Achievements';
import Research from '@/components/sections/Research';
import Certifications from '@/components/sections/Certifications';
import Contact from '@/components/sections/Contact';

export const dynamic = 'force-dynamic';

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
    console.warn('[Home] Serving last-known-good cached content — Supabase may be unavailable.');
  }

  const visibleSections = [
    { id: 'hero',             Component: Hero,           props: { heroSettings } },
    { id: 'about',            Component: About,          props: { profile } },
    { id: 'projects',         Component: Projects,       props: { projects },        isVisible: projects.length > 0 },
    { id: 'skills',           Component: Skills,         props: { skills },          isVisible: skills.length > 0 },
    { id: 'experience',       Component: Experience,     props: { experiences },     isVisible: experiences.length > 0 },
    { id: 'education',        Component: Education,      props: { education },       isVisible: education.length > 0 },
    { id: 'achievements',     Component: Achievements,   props: { achievements },    isVisible: achievements.length > 0 },
    { id: 'research',         Component: Research,       props: { researchPapers },  isVisible: researchPapers.length > 0 },
    { id: 'certifications',   Component: Certifications, props: { certifications },  isVisible: certifications.length > 0 },
    { id: 'contact',          Component: Contact,        props: { profile } },
  ].filter(section => section.isVisible !== false);

  return (
    <main className="bg-background text-white selection:bg-neon-purple/30">
      {visibleSections.map((section, index) => {
        const isEven = index % 2 === 0;
        const bgClass = isEven ? 'bg-transparent' : 'bg-black/20';
        const { Component, props } = section;
        // Cast Component to any to avoid strict union type mismatches in this dynamic rendering pattern
        const SectionComponent = Component as any;
        return <SectionComponent key={section.id} {...props} className={bgClass} />;
      })}
    </main>
  );
}
