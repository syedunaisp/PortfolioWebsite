'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { User, Target, Sparkles, Code } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function About({ profile, className }: { profile: any, className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section id="about" ref={containerRef} className={cn("min-h-screen flex items-center justify-center relative py-20", className)}>
            <div className="container mx-auto px-4 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl font-bold mb-16 text-center"
                >
                    About <span className="text-neon-teal">Me</span>
                </motion.h2>

                <div className="max-w-5xl mx-auto">
                    {/* Main Content Cards */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Bio Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl border border-glass-border bg-gradient-to-br from-glass-bg/80 to-glass-bg/40 backdrop-blur-xl hover:border-neon-purple/50 transition-all group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-neon-purple/10 group-hover:bg-neon-purple/20 transition-colors">
                                    <User className="w-8 h-8 text-neon-purple" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">The Developer</h3>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                {profile?.bio || "I am a passionate developer building innovative solutions with cutting-edge technology."}
                            </p>
                        </motion.div>

                        {/* Mission Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl border border-glass-border bg-gradient-to-br from-glass-bg/80 to-glass-bg/40 backdrop-blur-xl hover:border-neon-blue/50 transition-all group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-neon-blue/10 group-hover:bg-neon-blue/20 transition-colors">
                                    <Target className="w-8 h-8 text-neon-blue" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">The Mission</h3>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                {profile?.careerObjective || "To build the future with cutting-edge technology and innovative solutions."}
                            </p>
                        </motion.div>
                    </div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {[
                            { icon: Sparkles, label: "Innovation", value: "100%", color: "neon-purple" },
                            { icon: Code, label: "Code Quality", value: "A+", color: "neon-blue" },
                            { icon: Target, label: "Precision", value: "∞", color: "neon-teal" },
                            { icon: User, label: "Collaboration", value: "24/7", color: "neon-purple" },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="p-6 rounded-xl border border-glass-border bg-card/40 backdrop-blur-sm text-center hover:bg-card/60 hover:border-neon-teal/30 transition-all cursor-pointer"
                            >
                                <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}`} />
                                <div className="font-bold text-xl text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div >
        </section >
    );
}
