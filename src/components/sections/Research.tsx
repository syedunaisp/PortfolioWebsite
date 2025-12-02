'use client';

import { motion } from 'framer-motion';
import { FileText, ExternalLink, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResearchProps {
    researchPapers: any[];
    className?: string;
}

export default function Research({ researchPapers, className }: ResearchProps) {
    return (
        <section id="research" className={cn("min-h-screen flex items-center justify-center py-20 relative", className)}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Research <span className="text-neon-purple">Papers</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Exploring the frontiers of technology through academic research and publication.
                    </p>
                </motion.div>

                <div className="grid gap-8 max-w-4xl mx-auto">
                    {researchPapers.map((paper, index) => (
                        <motion.div
                            key={paper.id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative p-8 rounded-2xl bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all group overflow-hidden"
                        >
                            {/* Gradient Border - Blue/Cyan theme */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 opacity-20 group-hover:opacity-40 transition-opacity -z-10" />
                            <div className="absolute inset-[1px] rounded-2xl bg-card/90 -z-10" />

                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-20" />

                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <FileText className="text-neon-purple" size={24} />
                                        <h3 className="text-2xl font-bold text-white group-hover:text-neon-purple transition-colors">
                                            {paper.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-300 mb-4 leading-relaxed">
                                        {paper.abstract}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {paper.publicationDate}
                                        </span>
                                    </div>
                                </div>

                                {paper.link && (
                                    <a
                                        href={paper.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 transition-all group-hover:border-neon-purple/50 group-hover:text-neon-purple whitespace-nowrap"
                                    >
                                        Read Paper
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
