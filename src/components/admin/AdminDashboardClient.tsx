'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    MessageSquare,
    Briefcase,
    Code,
    User,
    GraduationCap,
    Trophy,
    Plus,
    Edit,
    Trash2,
    FileText,
    Award,
    UserCircle,
    Zap,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import ProjectForm from './ProjectForm';
import SkillForm from './SkillForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import AchievementForm from './AchievementForm';
import ProfileForm from './ProfileForm';
import ResearchForm from './ResearchForm';
import CertificationForm from './CertificationForm';
import HeroForm from './HeroForm';
import {
    deleteProject,
    deleteSkill,
    deleteExperience,
    deleteEducation,
    deleteAchievement,
    deleteResearch,
    deleteCertification
} from '@/lib/actions';
import { useRouter } from 'next/navigation';

type Tab = 'messages' | 'profile' | 'hero' | 'projects' | 'skills' | 'experience' | 'education' | 'achievements' | 'research' | 'certifications';
type ModalType = 'project' | 'skill' | 'experience' | 'education' | 'achievement' | 'profile' | 'research' | 'certification' | 'hero' | null;

interface AdminDashboardClientProps {
    messages: any[];
    projects: any[];
    skills: any[];
    experiences: any[];
    education: any[];
    achievements: any[];
    profile: any;
    researchPapers: any[];
    certifications: any[];
    heroSettings: any;
}

export default function AdminDashboardClient({
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
}: AdminDashboardClientProps) {
    const [activeTab, setActiveTab] = useState<Tab>('messages');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [editingItem, setEditingItem] = useState<any>(null);
    const router = useRouter();

    const tabs = [
        { id: 'messages' as Tab, label: 'Messages', icon: MessageSquare, count: messages.length },
        { id: 'hero' as Tab, label: 'Hero', icon: Zap, count: 0 },
        { id: 'profile' as Tab, label: 'Profile', icon: UserCircle, count: 0 },
        { id: 'projects' as Tab, label: 'Projects', icon: Briefcase, count: projects.length },
        { id: 'skills' as Tab, label: 'Skills', icon: Code, count: skills.length },
        { id: 'experience' as Tab, label: 'Experience', icon: User, count: experiences.length },
        { id: 'education' as Tab, label: 'Education', icon: GraduationCap, count: education.length },
        { id: 'achievements' as Tab, label: 'Awards', icon: Trophy, count: achievements.length },
        { id: 'research' as Tab, label: 'Research', icon: FileText, count: researchPapers.length },
        { id: 'certifications' as Tab, label: 'Certs', icon: Award, count: certifications.length },
    ];

    const openModal = (type: ModalType, item: any = null) => {
        setModalType(type);
        setEditingItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType(null);
        setEditingItem(null);
    };

    const handleDelete = async (type: string, id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            if (type === 'project') await deleteProject(id);
            else if (type === 'skill') await deleteSkill(id);
            else if (type === 'experience') await deleteExperience(id);
            else if (type === 'education') await deleteEducation(id);
            else if (type === 'achievement') await deleteAchievement(id);
            else if (type === 'research') await deleteResearch(id);
            else if (type === 'certification') await deleteCertification(id);

            router.refresh();
        } catch (error) {
            alert('Failed to delete item');
        }
    };

    const handleReorder = async (model: string, newOrder: any[]) => {
        // Optimistic update handled by local state in the tabs
        // Send update to API
        try {
            const items = newOrder.map((item, index) => ({
                id: item.id,
                order: index,
            }));

            await fetch('/api/admin/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model, items }),
            });

            router.refresh();

            // Optional: Toast success
        } catch (error) {
            console.error('Failed to reorder:', error);
            alert('Failed to save new order');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Tabs Navigation */}
            <div className="border-b border-glass-border bg-card/30 backdrop-blur-md sticky top-16 z-40">
                <div className="container mx-auto px-6">
                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide justify-center">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap text-sm ${activeTab === tab.id
                                    ? 'border-neon-purple text-neon-purple'
                                    : 'border-transparent text-gray-400 hover:text-white'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-neon-purple/20 text-neon-purple">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'messages' && (
                        <motion.div key="messages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <MessagesTab messages={messages} />
                        </motion.div>
                    )}

                    {activeTab === 'profile' && (
                        <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <ProfileTab profile={profile} onEdit={() => openModal('profile', profile)} />
                        </motion.div>
                    )}

                    {activeTab === 'hero' && (
                        <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <HeroTab heroSettings={heroSettings} onEdit={() => openModal('hero', heroSettings)} />
                        </motion.div>
                    )}

                    {activeTab === 'projects' && (
                        <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <ProjectsTab
                                projects={projects}
                                onAdd={() => openModal('project')}
                                onEdit={(project: any) => openModal('project', project)}
                                onDelete={(id: string) => handleDelete('project', id)}
                                onReorder={(newOrder: any[]) => handleReorder('project', newOrder)}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'skills' && (
                        <motion.div key="skills" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <SkillsTab
                                skills={skills}
                                onAdd={() => openModal('skill')}
                                onEdit={(skill: any) => openModal('skill', skill)}
                                onDelete={(id: string) => handleDelete('skill', id)}
                                onReorder={(newOrder: any[]) => handleReorder('skill', newOrder)}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'experience' && (
                        <motion.div key="experience" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <ExperienceTab
                                experiences={experiences}
                                onAdd={() => openModal('experience')}
                                onEdit={(exp: any) => openModal('experience', exp)}
                                onDelete={(id: string) => handleDelete('experience', id)}
                                onReorder={(newOrder: any[]) => handleReorder('experience', newOrder)}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'education' && (
                        <motion.div key="education" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <EducationTab
                                education={education}
                                onAdd={() => openModal('education')}
                                onEdit={(edu: any) => openModal('education', edu)}
                                onDelete={(id: string) => handleDelete('education', id)}
                                onReorder={(newOrder: any[]) => handleReorder('education', newOrder)}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'achievements' && (
                        <motion.div key="achievements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <AchievementsTab
                                achievements={achievements}
                                onAdd={() => openModal('achievement')}
                                onEdit={(ach: any) => openModal('achievement', ach)}
                                onDelete={(id: string) => handleDelete('achievement', id)}
                                onReorder={(newOrder: any[]) => handleReorder('achievement', newOrder)}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'research' && (
                        <motion.div key="research" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <ResearchTab
                                researchPapers={researchPapers}
                                onAdd={() => openModal('research')}
                                onEdit={(paper: any) => openModal('research', paper)}
                                onDelete={(id: string) => handleDelete('research', id)}
                                onReorder={(newOrder: any[]) => handleReorder('researchPaper', newOrder)}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'certifications' && (
                        <motion.div key="certifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <CertificationsTab
                                certifications={certifications}
                                onAdd={() => openModal('certification')}
                                onEdit={(cert: any) => openModal('certification', cert)}
                                onDelete={(id: string) => handleDelete('certification', id)}
                                onReorder={(newOrder: any[]) => handleReorder('certification', newOrder)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            {
                showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-glass-border rounded-2xl shadow-2xl"
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <Plus size={24} className="rotate-45" />
                            </button>

                            <div className="p-6">
                                {modalType === 'project' && <ProjectForm onClose={closeModal} project={editingItem} />}
                                {modalType === 'skill' && <SkillForm onClose={closeModal} skill={editingItem} />}
                                {modalType === 'experience' && <ExperienceForm onClose={closeModal} experience={editingItem} />}
                                {modalType === 'education' && <EducationForm onClose={closeModal} education={editingItem} />}
                                {modalType === 'achievement' && <AchievementForm onClose={closeModal} achievement={editingItem} />}
                                {modalType === 'profile' && <ProfileForm onClose={closeModal} profile={editingItem} />}
                                {modalType === 'research' && <ResearchForm onClose={closeModal} research={editingItem} />}
                                {modalType === 'certification' && <CertificationForm onClose={closeModal} certification={editingItem} />}
                                {modalType === 'hero' && (
                                    <div>
                                        <HeroForm settings={editingItem} />
                                        <div className="mt-4 text-center">
                                            <button onClick={closeModal} className="text-sm text-gray-500 hover:text-white">
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )
            }
        </div >
    );
}

// Hero Tab
function HeroTab({ heroSettings, onEdit }: any) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Hero Section</h2>
                <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                    <Edit size={18} />
                    Edit Hero Settings
                </button>
            </div>

            <div className="p-6 rounded-xl border border-glass-border bg-card/30">
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Main Heading</h4>
                        <p className="text-2xl font-bold text-white">{heroSettings?.heading || "Welcome to the future"}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Subheading</h4>
                        <p className="text-gray-300">{heroSettings?.subheading || "Not set"}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Typing Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                            {heroSettings?.keywords?.map((keyword: string, i: number) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-sm">
                                    {keyword}
                                </span>
                            )) || <span className="text-gray-500">Default keywords active</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Messages Tab
function MessagesTab({ messages }: { messages: any[] }) {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Messages</h2>
            {messages.length === 0 ? (
                <div className="p-12 text-center border border-glass-border rounded-xl bg-card/30 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className="p-6 rounded-xl border border-glass-border bg-card/30 hover:bg-card/50 transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-neon-blue">{msg.name}</h3>
                                    <p className="text-sm text-gray-400">{msg.email}</p>
                                </div>
                                <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Profile Tab
function ProfileTab({ profile, onEdit }: any) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Profile Settings</h2>
                <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                    <Edit size={18} />
                    Edit Profile
                </button>
            </div>

            {!profile ? (
                <div className="p-12 text-center border border-dashed border-glass-border rounded-xl bg-card/30 text-gray-500">
                    <UserCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">Profile not set up yet.</p>
                    <button onClick={onEdit} className="px-6 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                        Setup Profile
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="p-6 rounded-xl border border-glass-border bg-card/30">
                        <h3 className="text-xl font-bold text-neon-teal mb-4">About Me</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Bio</h4>
                                <p className="text-gray-200 whitespace-pre-wrap">{profile.bio}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Career Objective</h4>
                                <p className="text-gray-200 whitespace-pre-wrap">{profile.careerObjective}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-glass-border bg-card/30">
                        <h3 className="text-xl font-bold text-neon-teal mb-4">Contact & Socials</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Email</h4>
                                <p className="text-white">{profile.email || 'Not set'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Resume</h4>
                                <a href={profile.resumeUrl} target="_blank" className="text-neon-blue hover:underline truncate block">{profile.resumeUrl || 'Not set'}</a>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">LinkedIn</h4>
                                <a href={profile.linkedinUrl} target="_blank" className="text-neon-blue hover:underline truncate block">{profile.linkedinUrl || 'Not set'}</a>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">GitHub</h4>
                                <a href={profile.githubUrl} target="_blank" className="text-neon-blue hover:underline truncate block">{profile.githubUrl || 'Not set'}</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Projects Tab
function ProjectsTab({ projects, onAdd, onEdit, onDelete, onReorder }: any) {
    const [items, setItems] = useState(projects);

    useEffect(() => {
        setItems(projects);
    }, [projects]);

    const handleReorder = (newOrder: any[]) => {
        setItems(newOrder);
        onReorder(newOrder);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Projects</h2>
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                    <Plus size={18} />
                    Add Project
                </button>
            </div>

            {items.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-glass-border rounded-xl bg-card/30 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <button onClick={onAdd} className="px-6 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                        Create Your First Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[0, 1, 2].map((colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-6">
                            {items
                                .filter((_: any, index: number) => index % 3 === colIndex)
                                .map((project: any, index: number) => {
                                    const originalIndex = items.indexOf(project);
                                    return (
                                        <div key={project.id} className="p-6 rounded-xl border border-glass-border bg-card/30 hover:bg-card/50 transition-all group relative">
                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <button
                                                    onClick={() => {
                                                        if (originalIndex > 0) {
                                                            const newItems = [...items];
                                                            [newItems[originalIndex - 1], newItems[originalIndex]] = [newItems[originalIndex], newItems[originalIndex - 1]];
                                                            handleReorder(newItems);
                                                        }
                                                    }}
                                                    disabled={originalIndex === 0}
                                                    className="p-1 bg-black/50 rounded hover:bg-neon-purple text-white disabled:opacity-30 disabled:hover:bg-black/50"
                                                    title="Move Left/Up"
                                                >
                                                    <ChevronLeft size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (originalIndex < items.length - 1) {
                                                            const newItems = [...items];
                                                            [newItems[originalIndex], newItems[originalIndex + 1]] = [newItems[originalIndex + 1], newItems[originalIndex]];
                                                            handleReorder(newItems);
                                                        }
                                                    }}
                                                    disabled={originalIndex === items.length - 1}
                                                    className="p-1 bg-black/50 rounded hover:bg-neon-purple text-white disabled:opacity-30 disabled:hover:bg-black/50"
                                                    title="Move Right/Down"
                                                >
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                            {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-40 object-cover rounded-lg mb-4" />}
                                            <h3 className="font-bold text-xl text-white mb-2">{project.title}</h3>
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.tags?.map((tag: string, i: number) => (
                                                    <span key={i} className="px-2 py-1 text-xs rounded-full bg-neon-blue/20 text-neon-blue">{tag}</span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => onEdit(project)} className="flex-1 px-2 py-1 text-xs border border-neon-blue text-neon-blue rounded hover:bg-neon-blue/10">
                                                    Edit
                                                </button>
                                                <button onClick={() => onDelete(project.id)} className="px-2 py-1 text-xs border border-red-500 text-red-500 rounded hover:bg-red-500/10">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Skills Tab
function SkillsTab({ skills, onAdd, onEdit, onDelete, onReorder }: any) {
    const [items, setItems] = useState(skills);

    useEffect(() => {
        setItems(skills);
    }, [skills]);

    const handleReorder = (newOrder: any[]) => {
        setItems(newOrder);
        onReorder(newOrder);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Skills</h2>
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                    <Plus size={18} />
                    Add Skill
                </button>
            </div>

            {items.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-glass-border rounded-xl bg-card/30 text-gray-500">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">No skills added yet.</p>
                    <button onClick={onAdd} className="px-6 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                        Add Your First Skill
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((skill: any, index: number) => (
                        <div key={skill.id} className="p-4 rounded-xl border border-glass-border bg-card/30 hover:bg-card/50 transition-all group relative">
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                    onClick={() => {
                                        if (index > 0) {
                                            const newItems = [...items];
                                            [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
                                            handleReorder(newItems);
                                        }
                                    }}
                                    disabled={index === 0}
                                    className="p-1 bg-black/50 rounded hover:bg-neon-purple text-white disabled:opacity-30 disabled:hover:bg-black/50"
                                    title="Move Left/Up"
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (index < items.length - 1) {
                                            const newItems = [...items];
                                            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
                                            handleReorder(newItems);
                                        }
                                    }}
                                    disabled={index === items.length - 1}
                                    className="p-1 bg-black/50 rounded hover:bg-neon-purple text-white disabled:opacity-30 disabled:hover:bg-black/50"
                                    title="Move Right/Down"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-white">{skill.name}</h4>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue">
                                        {skill.category}
                                    </span>
                                </div>
                                <span className="text-xs text-neon-purple">{skill.proficiency}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
                                <div
                                    className="h-full transition-all duration-500"
                                    style={{
                                        width: `${skill.proficiency}%`,
                                        backgroundColor: skill.proficiency >= 90 ? '#22c55e' :
                                            skill.proficiency >= 80 ? '#00d9ff' :
                                                skill.proficiency >= 60 ? '#bc13fe' : '#ff0055'
                                    }}
                                />
                            </div>
                            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onEdit(skill)} className="flex-1 px-2 py-1 text-xs border border-neon-blue text-neon-blue rounded hover:bg-neon-blue/10">
                                    Edit
                                </button>
                                <button onClick={() => onDelete(skill.id)} className="px-2 py-1 text-xs border border-red-500 text-red-500 rounded hover:bg-red-500/10">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
}

// Experience Tab
function ExperienceTab({ experiences, onAdd, onEdit, onDelete, onReorder }: any) {
    const [items, setItems] = useState(experiences);

    useEffect(() => { setItems(experiences); }, [experiences]);

    const handleReorder = (newOrder: any[]) => {
        setItems(newOrder);
        onReorder(newOrder);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Experience</h2>
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                    <Plus size={18} />
                    Add Experience
                </button>
            </div>

            {items.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-glass-border rounded-xl bg-card/30 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">No experience entries yet.</p>
                    <button onClick={onAdd} className="px-6 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                        Add Your First Experience
                    </button>
                </div>
            ) : (
                <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="relative border-l-2 border-glass-border ml-4 space-y-8">
                    {items.map((exp: any) => (
                        <Reorder.Item key={exp.id} value={exp}>
                            <div className="relative pl-8 group cursor-move">
                                <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-neon-purple shadow-[0_0_10px_#a855f7]" />
                                <div className="p-6 rounded-xl border border-glass-border bg-card/30 hover:bg-card/50 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-xl text-white">{exp.role}</h3>
                                            <p className="text-neon-teal">{exp.company}</p>
                                        </div>
                                        <span className="text-sm text-gray-400">{exp.period}</span>
                                    </div>
                                    <p className="text-gray-300 mb-4">{exp.description}</p>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); onEdit(exp); }} className="px-3 py-1.5 text-sm border border-neon-blue text-neon-blue rounded hover:bg-neon-blue/10">
                                            <Edit size={14} className="inline mr-1" />
                                            Edit
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); onDelete(exp.id); }} className="px-3 py-1.5 text-sm border border-red-500 text-red-500 rounded hover:bg-red-500/10">
                                            <Trash2 size={14} className="inline mr-1" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}
        </div>
    );
}

// Education Tab
function EducationTab({ education, onAdd, onEdit, onDelete, onReorder }: any) {
    const [items, setItems] = useState(education);

    useEffect(() => { setItems(education); }, [education]);

    const handleReorder = (newOrder: any[]) => {
        setItems(newOrder);
        onReorder(newOrder);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Education</h2>
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                    <Plus size={18} />
                    Add Education
                </button>
            </div>

            {items.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-glass-border rounded-xl bg-card/30 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">No education entries yet.</p>
                    <button onClick={onAdd} className="px-6 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                        Add Education
                    </button>
                </div>
            ) : (
                <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="grid gap-6">
                    {items.map((edu: any) => (
                        <Reorder.Item key={edu.id} value={edu}>
                            <div className="p-6 rounded-xl border border-glass-border bg-card/30 hover:bg-card/50 transition-all group cursor-move">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-xl text-white">{edu.degree}</h3>
                                        <p className="text-neon-teal">{edu.institution}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm text-gray-400">{edu.period}</span>
                                        <span className="block text-sm text-neon-purple font-bold">{edu.score}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); onEdit(edu); }} className="px-3 py-1.5 text-sm border border-neon-blue text-neon-blue rounded hover:bg-neon-blue/10">
                                        <Edit size={14} className="inline mr-1" />
                                        Edit
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); onDelete(edu.id); }} className="px-3 py-1.5 text-sm border border-red-500 text-red-500 rounded hover:bg-red-500/10">
                                        <Trash2 size={14} className="inline mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}
        </div>
    );
}

// Achievements Tab
function AchievementsTab({ achievements, onAdd, onEdit, onDelete, onReorder }: any) {
    const [items, setItems] = useState(achievements);

    useEffect(() => { setItems(achievements); }, [achievements]);

    const handleReorder = (newOrder: any[]) => {
        setItems(newOrder);
        onReorder(newOrder);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Awards & Achievements</h2>
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                    <Plus size={18} />
                    Add Achievement
                </button>
            </div>

            {items.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-glass-border rounded-xl bg-card/30 text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">No achievements yet.</p>
                    <button onClick={onAdd} className="px-6 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                        Add Achievement
                    </button>
                </div>
            ) : (
                <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="grid gap-6">
                    {items.map((ach: any) => (
                        <Reorder.Item key={ach.id} value={ach}>
                            <div className="p-6 rounded-xl border border-glass-border bg-card/30 hover:bg-card/50 transition-all group cursor-move">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-xl text-white">{ach.title}</h3>
                                        {ach.award && <p className="text-neon-yellow text-sm font-bold mt-1">🏆 {ach.award}</p>}
                                    </div>
                                    <span className="text-sm text-gray-400">{ach.date}</span>
                                </div>
                                <p className="text-gray-300 mt-2">{ach.description}</p>
                                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); onEdit(ach); }} className="px-3 py-1.5 text-sm border border-neon-blue text-neon-blue rounded hover:bg-neon-blue/10">
                                        <Edit size={14} className="inline mr-1" />
                                        Edit
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); onDelete(ach.id); }} className="px-3 py-1.5 text-sm border border-red-500 text-red-500 rounded hover:bg-red-500/10">
                                        <Trash2 size={14} className="inline mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}
        </div>
    );
}

// Research Tab
function ResearchTab({ researchPapers, onAdd, onEdit, onDelete, onReorder }: any) {
    const [items, setItems] = useState(researchPapers);

    useEffect(() => { setItems(researchPapers); }, [researchPapers]);

    const handleReorder = (newOrder: any[]) => {
        setItems(newOrder);
        onReorder(newOrder);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Research Papers</h2>
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                    <Plus size={18} />
                    Add Research
                </button>
            </div>

            {items.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-glass-border rounded-xl bg-card/30 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">No research papers yet.</p>
                    <button onClick={onAdd} className="px-6 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                        Add Research
                    </button>
                </div>
            ) : (
                <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="grid gap-6">
                    {items.map((paper: any) => (
                        <Reorder.Item key={paper.id} value={paper}>
                            <div className="p-6 rounded-xl border border-glass-border bg-card/30 hover:bg-card/50 transition-all group cursor-move">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-xl text-white">{paper.title}</h3>
                                        <p className="text-sm text-gray-400">{paper.publicationDate}</p>
                                    </div>
                                    {paper.link && (
                                        <a href={paper.link} target="_blank" className="text-neon-blue hover:underline text-sm">View Paper</a>
                                    )}
                                </div>
                                <p className="text-gray-300 mt-2 line-clamp-3">{paper.abstract}</p>
                                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); onEdit(paper); }} className="px-3 py-1.5 text-sm border border-neon-blue text-neon-blue rounded hover:bg-neon-blue/10">
                                        <Edit size={14} className="inline mr-1" />
                                        Edit
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); onDelete(paper.id); }} className="px-3 py-1.5 text-sm border border-red-500 text-red-500 rounded hover:bg-red-500/10">
                                        <Trash2 size={14} className="inline mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}
        </div>
    );
}

// Certifications Tab
function CertificationsTab({ certifications, onAdd, onEdit, onDelete, onReorder }: any) {
    const [items, setItems] = useState(certifications);

    useEffect(() => { setItems(certifications); }, [certifications]);

    const handleReorder = (newOrder: any[]) => {
        setItems(newOrder);
        onReorder(newOrder);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Certifications</h2>
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                    <Plus size={18} />
                    Add Certification
                </button>
            </div>

            {items.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-glass-border rounded-xl bg-card/30 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">No certifications yet.</p>
                    <button onClick={onAdd} className="px-6 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                        Add Certification
                    </button>
                </div>
            ) : (
                <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="grid md:grid-cols-2 gap-6">
                    {items.map((cert: any) => (
                        <Reorder.Item key={cert.id} value={cert}>
                            <div className="p-6 rounded-xl border border-glass-border bg-card/30 hover:bg-card/50 transition-all group cursor-move">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-neon-purple/20 rounded-lg text-neon-purple">
                                        <Award size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-white">{cert.name}</h3>
                                        <p className="text-neon-teal">{cert.issuer}</p>
                                        <p className="text-sm text-gray-400 mt-1">{cert.date}</p>
                                        {cert.credentialUrl && (
                                            <a href={cert.credentialUrl} target="_blank" className="text-xs text-neon-blue hover:underline mt-2 inline-block">View Credential</a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity pl-[60px]">
                                    <button onClick={(e) => { e.stopPropagation(); onEdit(cert); }} className="px-3 py-1.5 text-sm border border-neon-blue text-neon-blue rounded hover:bg-neon-blue/10">
                                        <Edit size={14} className="inline mr-1" />
                                        Edit
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); onDelete(cert.id); }} className="px-3 py-1.5 text-sm border border-red-500 text-red-500 rounded hover:bg-red-500/10">
                                        <Trash2 size={14} className="inline mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}
        </div>
    );
}
