'use client';

import { motion } from 'framer-motion';
import ProjectCard from '@/components/ui/ProjectCard';

import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProjectsClientProps {
    projects: any[];
    className?: string;
}

export default function ProjectsClient({ projects, className }: ProjectsClientProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const visibleProjects = projects.filter(p => p.isVisible);
    const displayedProjects = isExpanded ? visibleProjects : visibleProjects.slice(0, 6);

    return (
        <section id="projects" className={cn("min-h-screen py-20 relative flex items-center justify-center", className)}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Selected <span className="text-neon-blue">Works</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        A collection of digital experiments and production-ready applications.
                    </p>
                </motion.div>

                {/* Manual Masonry Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[0, 1, 2].map((colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-6">
                            {displayedProjects
                                .filter((_, index) => index % 3 === colIndex)
                                .map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                    >
                                        <ProjectCard project={project} />
                                    </motion.div>
                                ))}
                        </div>
                    ))}
                </div>

                {/* View More Button - Centered Anchor */}
                {visibleProjects.length > 6 && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            {isExpanded ? 'Show Less' : 'View More Projects'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
