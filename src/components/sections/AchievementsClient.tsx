'use client';

import { motion } from 'framer-motion';
import { Trophy, Calendar } from 'lucide-react';

import { cn } from '@/lib/utils';

interface AchievementsClientProps {
    achievements: any[];
    className?: string;
}

export default function AchievementsClient({ achievements, className }: AchievementsClientProps) {
    return (
        <section id="achievements" className={cn("min-h-screen py-20 relative flex items-center justify-center", className)}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Honors & <span className="text-neon-orange">Awards</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Recognition for my work and contributions.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
                    {achievements.map((ach, index) => (
                        <motion.div
                            key={ach.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="relative w-full md:w-[calc(50%-1rem)] bg-card/30 p-6 rounded-xl hover:bg-card/50 transition-all hover:-translate-y-2 group overflow-hidden"
                        >
                            {/* Gradient Border */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-yellow via-neon-orange to-neon-pink opacity-20 group-hover:opacity-40 transition-opacity -z-10" />
                            <div className="absolute inset-[1px] rounded-xl bg-card/90 -z-10" />

                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-neon-yellow/30 to-neon-pink/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-20" />

                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gradient-to-br from-neon-yellow/20 to-neon-orange/20 rounded-lg text-neon-yellow group-hover:from-neon-yellow/30 group-hover:to-neon-orange/30 transition-all shadow-lg shadow-neon-yellow/20">
                                    <Trophy size={24} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Calendar size={14} />
                                    {ach.date}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-yellow transition-colors">
                                {ach.title}
                            </h3>

                            {ach.award && (
                                <div className="mb-4 px-3 py-1 bg-gradient-to-r from-neon-yellow/20 to-neon-orange/20 border border-neon-yellow/30 rounded-full inline-block">
                                    <span className="text-neon-yellow font-bold text-sm drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]">
                                        {ach.award}
                                    </span>
                                </div>
                            )}

                            <p className="text-gray-300 text-lg leading-relaxed">
                                {ach.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
