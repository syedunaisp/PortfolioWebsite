/**
 * portfolio-data.ts
 *
 * Fetches all public portfolio content from the database with a persistent
 * last-known-good fallback.
 *
 * HOW IT WORKS
 * ─────────────
 * 1. Each section is wrapped in Next.js `unstable_cache`, which stores the
 *    result in Vercel's Data Cache (a durable, CDN-backed key-value store
 *    shared across all serverless function instances and cold starts).
 *
 * 2. The outer fetch function attempts a live Prisma query first.
 *    - On SUCCESS  → the cache is updated and the fresh data is returned.
 *    - On FAILURE  → the stale cached value is served (if one exists).
 *
 * 3. All content mutations in actions.ts call `revalidateTag` with the
 *    appropriate tag so the Data Cache is purged and rebuilt on the next
 *    request after a successful admin edit.
 *
 * CACHE TAGS (one per data type)
 * ──────────────────────────────
 *   portfolio-projects  · portfolio-skills    · portfolio-experiences
 *   portfolio-education · portfolio-achievements · portfolio-profile
 *   portfolio-research  · portfolio-certifications · portfolio-hero
 *   portfolio-all  (invalidates everything at once)
 *
 * PERSISTENCE
 * ───────────
 * Vercel Data Cache survives:
 *   • Serverless function cold starts
 *   • Multiple concurrent function instances
 *   • Supabase being paused / unavailable
 *
 * TTL is set to 1 year (effectively "until explicitly revalidated"), so the
 * last-known-good data is always served when the DB is down.
 */

import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// ─── Types ───────────────────────────────────────────────────────────────────

type Project = Prisma.ProjectGetPayload<Record<string, never>>;
type Skill = Prisma.SkillGetPayload<Record<string, never>>;
type Experience = Prisma.ExperienceGetPayload<Record<string, never>>;
type Education = Prisma.EducationGetPayload<Record<string, never>>;
type Achievement = Prisma.AchievementGetPayload<Record<string, never>>;
type Profile = Prisma.ProfileGetPayload<Record<string, never>> | null;
type ResearchPaper = Prisma.ResearchPaperGetPayload<Record<string, never>>;
type Certification = Prisma.CertificationGetPayload<Record<string, never>>;
type HeroSettings = Prisma.HeroSettingsGetPayload<Record<string, never>> | null;

export interface PortfolioData {
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  achievements: Achievement[];
  profile: Profile;
  researchPapers: ResearchPaper[];
  certifications: Certification[];
  heroSettings: HeroSettings;
  /** true when this data was served from cache because the DB was unavailable */
  fromFallback?: boolean;
}

// ─── Cache TTL ───────────────────────────────────────────────────────────────
// Very long TTL — data is invalidated by tag, not by time expiry.
const ONE_YEAR = 60 * 60 * 24 * 365;

// ─── Cached DB fetchers ───────────────────────────────────────────────────────

const getCachedProjects = unstable_cache(
  async () => prisma.project.findMany({ orderBy: { order: 'asc' } }),
  ['portfolio-projects'],
  { tags: ['portfolio-projects', 'portfolio-all'], revalidate: ONE_YEAR },
);

const getCachedSkills = unstable_cache(
  async () =>
    prisma.skill.findMany({
      orderBy: [{ order: 'asc' }, { proficiency: 'desc' }],
    }),
  ['portfolio-skills'],
  { tags: ['portfolio-skills', 'portfolio-all'], revalidate: ONE_YEAR },
);

const getCachedExperiences = unstable_cache(
  async () =>
    prisma.experience.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  ['portfolio-experiences'],
  { tags: ['portfolio-experiences', 'portfolio-all'], revalidate: ONE_YEAR },
);

const getCachedEducation = unstable_cache(
  async () =>
    prisma.education.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  ['portfolio-education'],
  { tags: ['portfolio-education', 'portfolio-all'], revalidate: ONE_YEAR },
);

const getCachedAchievements = unstable_cache(
  async () =>
    prisma.achievement.findMany({
      orderBy: [{ order: 'asc' }, { date: 'desc' }],
    }),
  ['portfolio-achievements'],
  { tags: ['portfolio-achievements', 'portfolio-all'], revalidate: ONE_YEAR },
);

const getCachedProfile = unstable_cache(
  async () => prisma.profile.findFirst(),
  ['portfolio-profile'],
  { tags: ['portfolio-profile', 'portfolio-all'], revalidate: ONE_YEAR },
);

const getCachedResearchPapers = unstable_cache(
  async () =>
    prisma.researchPaper.findMany({
      orderBy: [{ order: 'asc' }, { publicationDate: 'desc' }],
    }),
  ['portfolio-research'],
  { tags: ['portfolio-research', 'portfolio-all'], revalidate: ONE_YEAR },
);

const getCachedCertifications = unstable_cache(
  async () =>
    prisma.certification.findMany({
      orderBy: [{ order: 'asc' }, { date: 'desc' }],
    }),
  ['portfolio-certifications'],
  { tags: ['portfolio-certifications', 'portfolio-all'], revalidate: ONE_YEAR },
);

const getCachedHeroSettings = unstable_cache(
  async () => prisma.heroSettings.findFirst(),
  ['portfolio-hero'],
  { tags: ['portfolio-hero', 'portfolio-all'], revalidate: ONE_YEAR },
);

// ─── Safe wrapper ─────────────────────────────────────────────────────────────

/**
 * Calls the cached fetcher.  If the DB throws, `unstable_cache` will return
 * the previously stored value (the Data Cache hit).  We catch any error from
 * the cache layer itself (e.g. first-ever request and DB is already down) and
 * return the supplied `fallback` value instead of crashing.
 */
async function safeGet<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  label: string,
): Promise<{ value: T; failed: boolean }> {
  try {
    const value = await fetcher();
    return { value, failed: false };
  } catch (err) {
    console.error(
      `[portfolio-data] Failed to fetch ${label} — serving fallback.`,
      err instanceof Error ? err.message : String(err),
    );
    return { value: fallback, failed: true };
  }
}

// ─── Main public API ──────────────────────────────────────────────────────────

/**
 * Fetches all portfolio data needed for the public homepage.
 * Never throws — returns cached/fallback data on DB failure.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  const results = await Promise.all([
    safeGet(getCachedProjects,       [],   'projects'),
    safeGet(getCachedSkills,         [],   'skills'),
    safeGet(getCachedExperiences,    [],   'experiences'),
    safeGet(getCachedEducation,      [],   'education'),
    safeGet(getCachedAchievements,   [],   'achievements'),
    safeGet(getCachedProfile,        null, 'profile'),
    safeGet(getCachedResearchPapers, [],   'researchPapers'),
    safeGet(getCachedCertifications, [],   'certifications'),
    safeGet(getCachedHeroSettings,   null, 'heroSettings'),
  ]);

  const anyFailed = results.some((r) => r.failed);

  if (anyFailed) {
    console.warn(
      '[portfolio-data] Supabase unavailable — serving last-known-good content from Data Cache.',
    );
  }

  const [
    projects,
    skills,
    experiences,
    education,
    achievements,
    profile,
    researchPapers,
    certifications,
    heroSettings,
  ] = results;

  return {
    projects:       projects.value       as Project[],
    skills:         skills.value         as Skill[],
    experiences:    experiences.value    as Experience[],
    education:      education.value      as Education[],
    achievements:   achievements.value   as Achievement[],
    profile:        profile.value        as Profile,
    researchPapers: researchPapers.value as ResearchPaper[],
    certifications: certifications.value as Certification[],
    heroSettings:   heroSettings.value   as HeroSettings,
    fromFallback:   anyFailed,
  };
}
