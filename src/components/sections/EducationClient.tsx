'use client';

import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

import { cn } from '@/lib/utils';

interface EducationClientProps {
    education: any[];
    className?: string;
}

export default function EducationClient({ education, className }: EducationClientProps) {
    return (
        <section id="education" className={cn("min-h-screen py-20 relative flex items-center justify-center", className)}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Academic <span className="text-neon-pink">Background</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Foundations of my technical knowledge.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
                    {education.map((edu, index) => (
                        <motion.div
                            key={edu.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="relative w-full md:w-[calc(50%-1rem)] bg-card/30 p-6 rounded-xl hover:bg-card/50 transition-all hover:-translate-y-2 group overflow-hidden"
                        >
                            {/* Gradient Border - Pink theme */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-pink via-purple-500 to-indigo-500 opacity-20 group-hover:opacity-40 transition-opacity -z-10" />
                            <div className="absolute inset-[1px] rounded-xl bg-card/90 -z-10" />

                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-neon-pink/30 to-purple-500/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-20" />

                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <GraduationCap size={100} />
                            </div>


                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 rounded-full bg-neon-pink/10 text-neon-pink text-sm font-bold mb-4 border border-neon-pink/20">
                                    {edu.period}
                                </span>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-pink transition-colors">
                                    {edu.degree}
                                </h3>
                                <p className="text-xl text-gray-300 mb-4">{edu.institution}</p>
                                <div className="inline-block px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                    <span className="text-gray-400 text-sm">Grade: </span>
                                    <span className="text-white font-bold">{edu.score}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
