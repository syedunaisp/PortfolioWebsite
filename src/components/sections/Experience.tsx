import { prisma } from '@/lib/prisma';
import ExperienceClient from './ExperienceClient';

export default function Experience({ experiences, className }: { experiences: any[], className?: string }) {
    return <ExperienceClient experiences={experiences} className={className} />;
}
