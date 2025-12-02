'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';

interface ProjectProps {
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
    link?: string;
    githubLink?: string;
}

export default function ProjectCard({ project }: { project: ProjectProps }) {
    return (
        <motion.div
            className="relative w-full rounded-xl bg-card/30 hover:bg-card/50 transition-all hover:-translate-y-2 group overflow-hidden flex flex-col"
        >
            {/* Gradient Border - Blue/Purple theme */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-blue via-purple-500 to-neon-purple opacity-20 group-hover:opacity-40 transition-opacity -z-10" />
            <div className="absolute inset-[1px] rounded-xl bg-card/90 -z-10" />

            {/* Neon Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-20" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Image Section */}
                <div className="relative w-full h-48 overflow-hidden">
                    {project.imageUrl ? (
                        <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-800 text-gray-600">No Image</div>
                    )}
                    {/* Overlay gradient for image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors duration-300">
                        {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">
                        {project.description}
                    </p>

                    {/* Buttons Section */}
                    <div className="flex gap-4 mt-auto pt-4 border-t border-white/10">
                        {project.githubLink && (
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full hover:bg-neon-purple hover:text-white transition-all text-sm text-gray-300"
                            >
                                <Github size={16} />
                                <span>Code</span>
                            </a>
                        )}
                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full hover:bg-neon-blue hover:text-black transition-all text-sm text-gray-300"
                            >
                                <ExternalLink size={16} />
                                <span>Live Demo</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
