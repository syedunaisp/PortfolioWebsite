'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import GlitchText from '@/components/ui/GlitchText';
import { Spotlight, GridBackground } from '@/components/ui/spotlight-new';
import { SplineScene } from '@/components/ui/spline';

import { cn } from '@/lib/utils';

interface HeroProps {
    heroSettings?: {
        heading: string;
        subheading: string | null;
        keywords: string[];
    } | null;
    className?: string;
}

export default function Hero({ heroSettings, className }: HeroProps) {
    const defaultRoles = [
        "Full Stack Developer",
        "UI/UX Designer",
        "Creative Technologist",
        "Next.js Expert"
    ];

    const roles = heroSettings?.keywords && heroSettings.keywords.length > 0
        ? heroSettings.keywords
        : defaultRoles;

    const [roleIndex, setRoleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % roles.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [roles.length]);

    return (
        <section id="hero" className={cn("min-h-screen flex items-center justify-center relative overflow-hidden bg-background", className)}>
            {/* Layer 3: Spotlight & Grid Background */}
            <div className="absolute inset-0 z-0 bg-background">
                <GridBackground />
                <Spotlight />
            </div>

            {/* Layer 2: 3D Bot Background (Static) */}
            <div
                className="absolute inset-0 z-0 opacity-50 scale-125 translate-y-10"
            >
                <SplineScene
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                />
            </div>

            {/* Layer 1: Content (Static) */}
            <div className="z-20 text-center px-4 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-4"
                >
                    <span className="text-neon-teal tracking-widest text-sm uppercase font-bold mb-2 block">
                        {heroSettings?.heading || "Welcome to the Void"}
                    </span>
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter">
                    <span className="text-foreground">I am </span>
                    <GlitchText text="Unais" className="text-neon-blue" />
                </h1>

                <div className="h-12 md:h-16 overflow-hidden relative w-full flex justify-center items-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={roleIndex}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -40, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-xl md:text-3xl text-gray-400 font-light absolute"
                        >
                            {roles[roleIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-12 flex gap-6 justify-center"
                >
                    <a
                        href="#projects"
                        className="px-8 py-3 border border-neon-blue text-neon-blue hover:bg-neon-blue/10 transition-all duration-300 rounded-full uppercase text-sm tracking-wider backdrop-blur-sm pointer-events-auto"
                    >
                        View Work
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-3 bg-neon-purple text-white hover:bg-neon-purple/80 transition-all duration-300 rounded-full uppercase text-sm tracking-wider shadow-[0_0_15px_rgba(188,19,254,0.5)] pointer-events-auto"
                    >
                        Contact Me
                    </a>
                </motion.div>
            </div>

            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 pointer-events-auto"
            >
                <ArrowDown className="w-6 h-6" />
            </motion.div>

            {/* Decorative gradients */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section >
    );
}
