import { prisma } from '@/lib/prisma';
import { logout } from '@/lib/actions';
import { LogOut, LayoutDashboard } from 'lucide-react';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    // Fetch all data from DB
    const [
        messages,
        projects,
        skills,
        experiences,
        education,
        achievements,
        profile,
        researchPapers,
        certifications,
        heroSettings
    ] = await Promise.all([
        prisma.message.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.project.findMany({ orderBy: { order: 'asc' } }),
        prisma.skill.findMany({ orderBy: { order: 'asc' } }),
        prisma.experience.findMany({ orderBy: { order: 'asc' } }),
        prisma.education.findMany({ orderBy: { order: 'asc' } }),
        prisma.achievement.findMany({ orderBy: { order: 'asc' } }),
        prisma.profile.findFirst(),
        prisma.researchPaper.findMany({ orderBy: { order: 'asc' } }),
        prisma.certification.findMany({ orderBy: { order: 'asc' } }),
        prisma.heroSettings.findFirst(),
    ]);

    return (
        <div className="min-h-screen bg-background text-white">
            {/* Header */}
            <header className="border-b border-glass-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="text-neon-purple" />
                        <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    </div>
                    <form action={logout}>
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <LogOut size={18} />
                            Logout
                        </button>
                    </form>
                </div>
            </header>

            {/* Client Component with Tabs */}
            <AdminDashboardClient
                messages={messages}
                projects={projects}
                skills={skills}
                experiences={experiences}
                education={education}
                achievements={achievements}
                profile={profile}
                researchPapers={researchPapers}
                certifications={certifications}
                heroSettings={heroSettings}
            />
        </div>
    );
}
