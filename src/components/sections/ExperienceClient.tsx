'use client';

import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExperienceClientProps {
    experiences: any[];
    className?: string;
}

export default function ExperienceClient({ experiences, className }: ExperienceClientProps) {
    return (
        <section id="experience" className={cn("min-h-screen flex items-center justify-center py-20 relative", className)}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Professional <span className="text-neon-purple">Journey</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        My career path and the companies I've had the privilege to work with.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="relative pl-8 pb-12 last:pb-0 border-l-2 border-glass-border group"
                        >
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.8)] group-hover:scale-150 transition-transform duration-300" />

                            <div className="relative bg-card/30 p-6 rounded-xl hover:bg-card/50 transition-all hover:-translate-y-2 overflow-hidden">
                                {/* Gradient Border - Purple theme */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-purple via-neon-pink to-neon-blue opacity-20 group-hover:opacity-40 transition-opacity -z-10" />
                                <div className="absolute inset-[1px] rounded-xl bg-card/90 -z-10" />

                                {/* Glow Effect */}
                                <div className="absolute -inset-1 bg-gradient-to-br from-neon-purple/30 to-neon-pink/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-20" />

                                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-neon-purple transition-colors">
                                            {exp.role}
                                        </h3>
                                        <div className="flex items-center gap-2 text-neon-pink font-medium">
                                            <Briefcase size={16} />
                                            {exp.company}
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300 border border-white/10 whitespace-nowrap">
                                        {exp.period}
                                    </span>
                                </div>
                                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                                    {exp.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
