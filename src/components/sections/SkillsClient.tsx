'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SkillsClientProps {
    skills: any[];
    className?: string;
}

const SkillRing = ({ level, color, children }: { level: number; color: string; children: React.ReactNode }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (level / 100) * circumference;

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                    fill="transparent"
                />
                <motion.circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke={color}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-white">
                {children}
            </div>
        </div>
    );
};

export default function SkillsClient({ skills, className }: SkillsClientProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayedSkills = isExpanded ? skills : skills.slice(0, 8);

    const getColor = (skill: any) => {
        const proficiency = skill.proficiency || 0;

        if (proficiency >= 90) return '#22c55e'; // Green (Expert)
        if (proficiency >= 80) return '#00d9ff'; // Cyan (Advanced)
        if (proficiency >= 60) return '#bc13fe'; // Purple (Intermediate)
        return '#ff0055'; // Pink (Learning)
    };

    return (
        <section id="skills" className={cn("min-h-screen py-20 relative flex items-center justify-center", className)}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Technical <span className="text-neon-teal">Arsenal</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Tools and technologies I use to build the future.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 justify-items-center mb-12">
                    {displayedSkills.filter(s => s.isVisible !== false).map((skill, index) => {
                        const IconComponent = (Icons as any)[skill.icon] || Icons.Code;
                        const color = getColor(skill);

                        return (
                            <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="flex flex-col items-center gap-4 group"
                            >
                                <div className="relative">
                                    <SkillRing level={skill.proficiency} color={color}>
                                        <IconComponent size={32} className="text-white group-hover:scale-110 transition-transform duration-300" />
                                    </SkillRing>
                                    <div
                                        className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                                        style={{ backgroundColor: color }}
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                                <span className="text-sm text-gray-400 font-mono">{skill.proficiency}%</span>
                            </motion.div>
                        );
                    })}
                </div>

                {skills.length > 8 && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:scale-105 active:scale-95"
                        >
                            {isExpanded ? 'Show Less' : 'View All'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
