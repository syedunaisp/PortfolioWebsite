'use client';

import { motion } from 'framer-motion';
import { Award, ExternalLink, CheckCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function Certifications({ certifications, className }: { certifications: any[], className?: string }) {
    if (!certifications || certifications.length === 0) return null;

    return (
        <section id="certifications" className={cn("min-h-screen py-20 relative overflow-hidden flex items-center justify-center", className)}>
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-teal/10 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Certifications & <span className="text-neon-teal">Licenses</span>
                    </h2>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="relative w-full md:w-[calc(50%-1rem)] p-6 rounded-xl bg-card/30 backdrop-blur-sm transition-all hover:-translate-y-2 group overflow-hidden"
                        >
                            {/* Gradient Border - Cyan/Teal theme */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-teal via-cyan-500 to-blue-500 opacity-20 group-hover:opacity-40 transition-opacity -z-10" />
                            <div className="absolute inset-[1px] rounded-xl bg-card/90 -z-10" />

                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-neon-teal/30 to-cyan-500/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-20" />

                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-neon-teal/20 to-cyan-500/20 rounded-lg text-neon-teal group-hover:from-neon-teal/30 group-hover:to-cyan-500/30 transition-all shadow-lg shadow-neon-teal/20">
                                    <Award size={24} className="drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                                </div>
                                {cert.credentialUrl && (
                                    <a
                                        href={cert.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-white transition-colors"
                                    >
                                        <ExternalLink size={20} />
                                    </a>
                                )}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-teal transition-colors">
                                {cert.name}
                            </h3>
                            <p className="text-xl text-gray-300 mb-4">
                                {cert.issuer}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-white/5 pt-4">
                                <CheckCircle size={14} className="text-green-500" />
                                <span>Issued {cert.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
