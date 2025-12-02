import { prisma } from '@/lib/prisma';
import AchievementsClient from './AchievementsClient';

export default function Achievements({ achievements, className }: { achievements: any[], className?: string }) {
    return <AchievementsClient achievements={achievements} className={className} />;
}
