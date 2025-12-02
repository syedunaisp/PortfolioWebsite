import { prisma } from '@/lib/prisma';
import EducationClient from './EducationClient';

export default function Education({ education, className }: { education: any[], className?: string }) {
    return <EducationClient education={education} className={className} />;
}
