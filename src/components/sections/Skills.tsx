import { prisma } from '@/lib/prisma';
import SkillsClient from './SkillsClient';

export default function Skills({ skills, className }: { skills: any[], className?: string }) {
    return <SkillsClient skills={skills} className={className} />;
}
