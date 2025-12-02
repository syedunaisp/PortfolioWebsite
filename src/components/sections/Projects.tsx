import { prisma } from '@/lib/prisma';
import ProjectsClient from './ProjectsClient';

export default function Projects({ projects, className }: { projects: any[], className?: string }) {
    return <ProjectsClient projects={projects} className={className} />;
}
